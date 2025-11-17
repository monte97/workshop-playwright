/**
 * ⚠️ ESERCIZIO 4b - DIMOSTRAZIONE DEL PROBLEMA ⚠️
 *
 * Questo file contiene test INTENZIONALMENTE FLAKY che dimostrano
 * i problemi dell'esecuzione parallela con dati condivisi.
 *
 * Per vedere il problema:
 * 1. Configura workers: 3 in playwright.config.ts
 * 2. Esegui: npx playwright test esercizio4b-problema-flaky.spec.ts --workers=3 --repeat-each=3
 * 3. Osserva i fallimenti intermittenti
 *
 * ❌ Questi test DOVREBBERO FALLIRE in modo intermittente
 * ✅ La soluzione è in esercizio4b-parallel.spec.ts (usa la fixture)
 */

import { test, expect } from '@playwright/test';

/**
 * PROBLEMA: Tutti questi test usano lo stesso utente (test@example.com)
 * configurato tramite storageState nel playwright.config.ts
 *
 * Con workers multipli, competono per lo stesso carrello!
 *
 * NOTA: Questi test NON usano waitForResponse (pattern dell'Esercizio 4)
 * per evidenziare ulteriormente i problemi di race condition.
 */

test.describe('⚠️ PROBLEMA: Cart Tests con Utente Condiviso', () => {
  // Usa l'autenticazione standard (stesso utente per tutti)
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('[FLAKY - SHOULD FAIL] Worker A - Aggiunge 1 prodotto (fallisce con utente condiviso)', async ({ page }) => {
    await page.goto('/');

    console.log('🔴 Worker A: Starting with shared user test@example.com');

    // Vai al carrello e conta gli elementi PRIMA
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    const initialCount = await page.getByTestId(/cart-item-\d+/).count();
    console.log(`🔴 Worker A: Initial cart count = ${initialCount}`);

    // Torna alla home e aggiungi 1 prodotto
    await page.goto('/');
    await page.getByTestId('add-to-cart-1').click();

    // Verifica che ci sia esattamente initialCount + 1 prodotti
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    const cartItems = page.getByTestId(/cart-item-\d+/);

    // ❌ QUESTA ASSERTION FALLIRÀ se altri worker aggiungono prodotti contemporaneamente!
    await expect(cartItems).toHaveCount(initialCount + 1, {
      timeout: 2000,
    });
  });

  test('[FLAKY - SHOULD FAIL] Worker B - Aggiunge 2 prodotti (fallisce con utente condiviso)', async ({ page }) => {
    await page.goto('/');

    console.log('🔴 Worker B: Starting with shared user test@example.com');

    // Vai al carrello e conta gli elementi PRIMA
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    const initialCount = await page.getByTestId(/cart-item-\d+/).count();
    console.log(`🔴 Worker B: Initial cart count = ${initialCount}`);

    // Torna alla home e aggiungi 2 prodotti
    await page.goto('/');
    await page.getByTestId('add-to-cart-2').click();
    await page.getByTestId('add-to-cart-3').click();

    // Verifica che ci siano esattamente initialCount + 2 prodotti
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    const cartItems = page.getByTestId(/cart-item-\d+/);

    // ❌ QUESTA ASSERTION FALLIRÀ se altri worker aggiungono prodotti contemporaneamente!
    await expect(cartItems).toHaveCount(initialCount + 2, {
      timeout: 2000,
    });
  });

  test('[FLAKY - SHOULD FAIL] Worker C - Verifica badge carrello (fallisce con utente condiviso)', async ({ page }) => {
    await page.goto('/');

    console.log('🔴 Worker C: Starting with shared user test@example.com');

    // Leggi il badge attuale
    const badgeLocator = page.locator('.cart-badge, [data-testid="cart-badge"]');
    const initialBadge = await badgeLocator.textContent().catch(() => '0');
    const initialCount = parseInt(initialBadge || '0');
    console.log(`🔴 Worker C: Initial badge count = ${initialCount}`);

    // Aggiungi un prodotto
    await page.getByTestId('add-to-cart-4').click();

    // Aspetta che il badge si aggiorni
    await page.waitForTimeout(500); // Simulazione di attesa

    // Verifica che il badge sia incrementato di 1
    const newBadge = await badgeLocator.textContent();
    const newCount = parseInt(newBadge || '0');

    // ❌ QUESTA ASSERTION FALLIRÀ se altri worker modificano il carrello!
    expect(newCount).toBe(initialCount + 1);
  });
});

test.describe('⚠️ PROBLEMA: Race Condition Visibile', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('[FLAKY - SHOULD FAIL] Assume carrello vuoto all\'inizio', async ({ page }) => {
    await page.goto('/cart');

    console.log('🔴 Race Test: Assuming empty cart...');

    // ❌ ASSUMPTION PERICOLOSA: Assumo che il carrello sia vuoto
    // Ma se altri worker hanno già aggiunto prodotti, non lo sarà!
    const cartItems = page.getByTestId(/cart-item-\d+/);

    // Questa assertion fallirà se eseguita in parallelo con altri test
    await expect(cartItems).toHaveCount(0, {
      timeout: 1000,
    });
  });
});

/**
 * 📊 SPIEGAZIONE DEL PROBLEMA:
 *
 * Scenario con 3 workers:
 *
 * T=0: Worker A conta carrello (0 items)
 * T=0: Worker B conta carrello (0 items)
 * T=0: Worker C conta carrello (0 items)
 *
 * T=1: Worker A aggiunge prodotto → carrello = 1
 * T=1: Worker B aggiunge 2 prodotti → carrello = 3
 * T=1: Worker C aggiunge prodotto → carrello = 4
 *
 * T=2: Worker A verifica count = 1 ❌ FAIL (è 4!)
 * T=2: Worker B verifica count = 2 ❌ FAIL (è 4!)
 * T=2: Worker C verifica count = 1 ❌ FAIL (è 4!)
 *
 * Tutti i test falliscono perché condividono lo stesso carrello!
 *
 * 📌 PROBLEMI MULTIPLI DIMOSTRATI:
 * 1. Utente condiviso (test@example.com) → race condition sui dati
 * 2. NO waitForResponse → race condition sul timing
 * 3. Assumption di stato iniziale → dipendenza da esecuzioni precedenti
 *
 * ✅ SOLUZIONE:
 * Vedi esercizio4b-parallel.spec.ts che risolve TUTTI questi problemi:
 * 1. Fixture con utente unico per test (fixtures/user.fixture.ts)
 * 2. waitForResponse per sincronizzazione API (pattern dall'Esercizio 4)
 * 3. Nessuna assumption sullo stato - ogni test parte da zero
 */
