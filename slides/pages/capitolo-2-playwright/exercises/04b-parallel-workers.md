---
layout: center
---

# Esercizio 4b: Scalare i Test con Workers Multipli

Un test suite veloce è fondamentale per la produttività. Playwright permette di eseguire test in **parallelo** usando workers multipli.

## Obiettivi di apprendimento
- ✅ Comprendere i problemi dell'esecuzione parallela con dati condivisi.
- ✅ Riconoscere le race conditions causate da worker che competono per le stesse risorse.
- ✅ Implementare fixture che interagiscono con API per garantire isolamento.
- ✅ Usare `APIRequestContext` per setup/teardown via API invece che via UI.

**Scenario**: Scalare l'esecuzione da 1 worker a N workers mantenendo l'isolamento dei test.

<!--
Questo esercizio mostra un pattern avanzato e molto pratico: invece di fare setup/teardown via UI (lento e fragile), usiamo le API.
-->

---

# Esercizio 4b: Il Problema

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 3, // esecuzione parallela di 3 test
  // ... resto della config
});
```

Ma i nostri test usano tutti lo stesso utente (`test@example.com`):

```typescript
test('aggiungi prodotto al carrello', async ({ page }) => {
  await page.goto('/');
  // Già autenticato come test@example.com (da setup project)
  await page.getByTestId('add-to-cart-1').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');
});
```

**Problema**: 3 workers → 3 browser → 1 utente → 1 carrello condiviso → Race Conditions! 💥

<!--
Quando più test modificano contemporaneamente il carrello dello stesso utente, succede il caos:
- Worker 1 aggiunge prodotto A, si aspetta count = 1
- Worker 2 aggiunge prodotto B nello stesso momento
- Worker 1 legge il badge: "2" invece di "1" → Test fallisce!

Questi fallimenti sono intermittenti (flaky) perché dipendono dal timing di esecuzione.

Il file di demo contiene test intenzionalmente flaky che dimostrano questo problema.

**Demo**: `tests/esercizio4b-problema-flaky.spec.ts` (test marcati `[FLAKY - SHOULD FAIL]`)
-->

---

# Esercizio 4b: Soluzione 1 - Pool di Utenti

Una prima soluzione: usare utenti diversi per ogni worker.

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 2, // Limitato a 2 perché abbiamo solo 2 utenti!
  projects: [
    {
      name: 'worker-1',
      use: { storageState: 'playwright/.auth/user1.json' },
      dependencies: ['setup-user1'],
    },
    {
      name: 'worker-2',
      use: { storageState: 'playwright/.auth/user2.json' },
      dependencies: ['setup-user2'],
    },
  ],
});
```

<!--
Questo approccio funziona ma non scala. Se vogliamo 10 workers, servono 10 utenti pre-configurati e 10 progetti separati.


**Limiti:**
- ❌ Numero di workers vincolato al numero di utenti pre-configurati
- ❌ Non scala (serve un progetto per ogni utente)
- ❌ Setup multipli rallentano l'avvio
-->

---

# Esercizio 4b: Soluzione 2 - Fixture + API

Usiamo una **fixture** che crea un utente unico via API per ogni test.

```typescript
// fixtures/user.fixture.ts
import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

type UserFixtures = {
  authenticatedUser: { email: string; password: string; userId: number };
};

export const test = base.extend<UserFixtures>({
  authenticatedUser: async ({ request, context }, use) => {
    // --- SETUP: Crea utente via API ---
    const uniqueEmail = `test-${randomUUID().slice(0, 8)}@example.com`;
    const password = 'test123';

    const response = await request.post('/api/users', {
      data: {
        email: uniqueEmail,
        password: password,
        name: `Test User ${uniqueEmail}`,
      },
    });
    expect(response.ok()).toBeTruthy();
    const user = await response.json();

    // Continua nella slide successiva...
```

<!--
**Nota chiave**: Usiamo `request` fixture di Playwright, che è un `APIRequestContext` configurato automaticamente con `baseURL`.
-->

---

# Esercizio 4b: Fixture - Login via API

```typescript
    // ... continua dalla slide precedente

    // --- Login via API (molto più veloce del login UI!) ---
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: uniqueEmail, password },
    });
    expect(loginResponse.ok()).toBeTruthy();

    // Estrai i cookie dalla risposta e iniettali nel browser context
    const cookies = await loginResponse.headerValue('set-cookie');
    if (cookies) {
      await context.addCookies(
        cookies.split(';').map(c => ({
          name: c.split('=')[0].trim(),
          value: c.split('=')[1],
          domain: 'localhost',
          path: '/',
        }))
      );
    }

    // Passa il controllo al test
    await use({ email: uniqueEmail, password, userId: user.id });

    // --- TEARDOWN: Elimina l'utente ---
    await request.delete(`/api/users/${user.id}`);
  },
});
```

<!--
**Vantaggi:**
- Setup via API: ~100ms invece di ~3s via UI
- Teardown automatico: ogni test pulisce i suoi dati
- Isolamento totale: ogni test ha il suo utente dedicato
-->

---

# Esercizio 4b: Usare la Fixture

Ora i test sono semplici, completamente isolati e **robusti**:

```typescript
// tests/cart.spec.ts
import { test, expect } from '../fixtures/user.fixture';

test('dovrebbe aggiungere un prodotto al carrello', async ({ page, authenticatedUser }) => {
  // Il browser è già autenticato con un utente unico!
  await page.goto('/');

  // Verifica l'autenticazione
  await expect(page.locator('#userGreeting')).toContainText(authenticatedUser.email);

  // Aggiungi prodotto e attendi la risposta API (pattern dall'Esercizio 4!)
  const [response] = await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/cart') && res.request().method() === 'POST'),
    page.getByTestId('add-to-cart-1').click(),
  ]);
  expect(response.ok()).toBeTruthy();

  // Alla fine del test, l'utente viene automaticamente eliminato
});
```

**Risultato:**
- ✅ Esecuzione parallela senza limiti al numero di workers
- ✅ Isolamento totale tra test (fixture)
- ✅ Sincronizzazione robusta (waitForResponse)
- ✅ Setup velocissimo (via API)
- ✅ Cleanup automatico

---

# Esercizio 4b: Configurazione Finale

Torniamo a una configurazione semplice:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : 2, // Scala in base all'ambiente
  use: {
    baseURL: 'http://localhost:3000',
  },
  // Non servono più progetti multipli!
});
```


<!--
**Confronto Prestazionale:**
- Login UI: ~3s per test
- Login API: ~0.1s per test
- Con 100 test: 5 minuti risparmiati solo sul setup!

**Pattern Progression:**
- Esercizio 4: waitForResponse per test robusti (no race conditions)
- Esercizio 4b: Fixture API + waitForResponse per test paralleli robusti

### Best Practices

**Pattern Combinati (Esercizio 4 + 4b):**
- **API First**: Setup/teardown via API invece che UI (30x più veloce)
- **waitForResponse**: Sincronizzazione con eventi reali, non timeout arbitrari
- **Dynamic Data**: Genera dati unici per ogni test (UUID, random)
- **Cleanup Always**: Teardown automatico nelle fixture
- **Context Isolation**: Ogni test ha il suo `context` e il suo storage

-->
