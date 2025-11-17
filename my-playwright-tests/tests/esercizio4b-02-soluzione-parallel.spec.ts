/**
 * Esercizio 4b: Scalare i Test con Workers Multipli
 *
 * Questo file dimostra come usare la fixture authenticatedUser per
 * eseguire test in parallelo con isolamento totale.
 *
 * Per testare:
 * 1. Configura workers: 3 in playwright.config.ts
 * 2. Esegui: npx playwright test esercizio4b-parallel.spec.ts
 * 3. Osserva che ogni test crea il suo utente e non interferisce con gli altri
 */

import { test, expect } from '../fixtures/user.fixture';

test.describe('Shopping Cart - Parallel Execution', () => {
  test('Worker 1: Aggiungi un prodotto al carrello (utente isolato)', async ({ page, authenticatedUser }) => {
    await page.goto('/');

    // Verifica autenticazione
    await expect(page.locator('#userGreeting')).toBeVisible();
    console.log(`🛒 Test 1 running with user: ${authenticatedUser.email}`);

    // Aggiungi prodotto al carrello e attendi la risposta API
    const [addToCartResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
      page.getByTestId('add-to-cart-1').click(),
    ]);
    expect(addToCartResponse.ok()).toBeTruthy();

    // Vai al carrello
    await page.getByRole('link', { name: '🛒 Carrello' }).click();

    // Verifica che ci sia esattamente 1 prodotto
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    const cartItems = page.getByTestId(/cart-item-\d+/);
    await expect(cartItems).toHaveCount(1);
  });

  test('Worker 2: Aggiungi due prodotti al carrello (utente isolato)', async ({ page, authenticatedUser }) => {
    await page.goto('/');

    // Verifica autenticazione
    await expect(page.locator('#userGreeting')).toBeVisible();
    console.log(`🛒 Test 2 running with user: ${authenticatedUser.email}`);

    // Aggiungi DUE prodotti diversi, attendendo le risposte API
    const [response1] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
      page.getByTestId('add-to-cart-2').click(),
    ]);
    expect(response1.ok()).toBeTruthy();

    const [response2] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
      page.getByTestId('add-to-cart-3').click(),
    ]);
    expect(response2.ok()).toBeTruthy();

    // Vai al carrello
    await page.getByRole('link', { name: '🛒 Carrello' }).click();

    // Verifica che ci siano esattamente 2 prodotti
    const cartItems = page.getByTestId(/cart-item-\d+/);
    await expect(cartItems).toHaveCount(2);
  });

  test('Worker 3: Aggiungi lo stesso prodotto due volte (utente isolato)', async ({ page, authenticatedUser }) => {
    await page.goto('/');

    // Verifica autenticazione
    await expect(page.locator('#userGreeting')).toBeVisible();
    console.log(`🛒 Test 3 running with user: ${authenticatedUser.email}`);

    // Aggiungi lo stesso prodotto DUE VOLTE, attendendo le risposte API
    const [firstAdd] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
      page.getByTestId('add-to-cart-1').click(),
    ]);
    expect(firstAdd.ok()).toBeTruthy();

    const [secondAdd] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
      page.getByTestId('add-to-cart-1').click(),
    ]);
    expect(secondAdd.ok()).toBeTruthy();

    // Vai al carrello
    await page.getByRole('link', { name: '🛒 Carrello' }).click();

    // Verifica che ci sia 1 riga con quantità 2
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    await expect(page.getByTestId('cart-item-1').getByText('× 2')).toBeVisible();
  });
});

/**
 * CONFRONTO: Test con e senza fixture
 *
 * ❌ SENZA FIXTURE (problemi):
 * - Tutti i test usano lo stesso utente (test@example.com)
 * - Con workers multipli, i test interferiscono tra loro
 * - Race conditions sul carrello condiviso
 * - Test flaky e intermittenti
 *
 * ✅ CON FIXTURE (soluzione):
 * - Ogni test ha il suo utente unico (creato via API)
 * - Isolamento totale tra workers
 * - Nessuna interferenza
 * - Test deterministici e affidabili
 * - Cleanup automatico al termine
 * - Sincronizzazione robusta con waitForResponse (pattern dall'esercizio 4)
 *
 * BEST PRACTICES APPLICATE:
 * 1. Fixture API-based per setup veloce (~100ms vs ~3s UI)
 * 2. Dati dinamici per isolamento (randomUUID per email)
 * 3. waitForResponse per sincronizzazione (nessun timeout arbitrario)
 * 4. Verifica response.ok() per validazione API
 * 5. Teardown automatico per cleanup
 */
