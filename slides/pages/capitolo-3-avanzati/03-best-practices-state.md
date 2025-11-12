---
layout: center
---

# Best Practice: Test che Alterano i Dati

La sfida principale dei test E2E

---

# Il Problema dei Test E2E

<div class="grid grid-cols-2 gap-8">

<div>

### Alterazione dello Stato
I test che **creano, modificano o eliminano** dati possono essere:
- Lenti
- Instabili ("flaky")
- Dipendenti l'uno dall'altro

### La Soluzione
**Isolamento totale dei test**

Ogni test deve:
1. Creare le proprie condizioni
2. Pulire dopo il suo passaggio
3. Mai dipendere da altri test

</div>

<div>

### Esempio di Problema

```js
// ❌ Test fragile e dipendente
test('modifica utente', async ({ page }) => {
  // Presume che 'user@test.com' esista!
  await page.goto('/users/user@test.com');
  // ...
});

test('elimina utente', async ({ page }) => {
  // Se eseguito prima, rompe l'altro test!
  await page.goto('/users/user@test.com');
  await page.click('button[aria-label="Delete"]');
});
```

</div>

</div>

---

# 1. Regola d'Oro: API per Setup, UI per Test

<div class="grid grid-cols-2 gap-8">

<div>

### ❌

```js
test.beforeEach(async ({ page }) => {
  // Login via UI = LENTO e FRAGILE
  await page.goto('/register');
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
});
```


</div>

<div>

### ✅
```js
test.beforeEach(async ({ request }) => {
  // Setup via API = VELOCE e AFFIDABILE
  await request.post('/api/users', {
    data: {
      email: 'user@test.com',
      password: 'pass123'
    }
  });
});

test.afterEach(async ({ request }) => {
  // Cleanup via API
  await request.delete('/api/users/user@test.com');
});
```

</div>

</div>

<!--
**Problemi:**
- Setup lento (10-15 secondi)
- Se il form cambia, tutti i test falliscono
- Testa la UI quando non serve


**Vantaggi:**
- Setup rapido (< 1 secondo)
- Indipendente dalla UI
- UI testata solo quando necessario
-->

---

# 2. Isola i Dati: Mai Usare Dati Statici

<div class="grid grid-cols-2 gap-8">

<div>

### Il Problema
```js
// ❌ Fallisce in parallelo!
test('crea utente', async ({ request }) => {
  await request.post('/api/users', {
    data: { email: 'test@test.com' }
  });
});

test('aggiorna utente', async ({ request }) => {
  await request.put('/api/users/test@test.com', {
    data: { name: 'Updated' }
  });
});
```

**Race Condition:** Chi arriva primo?

</div>

<div>

### La Soluzione
```js
// ✅ Dati unici per ogni test
import { faker } from '@faker-js/faker';

test('crea utente', async ({ request }) => {
  const email = faker.internet.email();
  await request.post('/api/users', {
    data: { email }
  });
});

// Alternativa semplice
test('crea prodotto', async ({ request }) => {
  const name = `Product-${Date.now()}`;
  await request.post('/api/products', {
    data: { name }
  });
});
```

</div>

</div>

---

# 3. Incapsula Setup e Teardown nelle Fixtures

<div class="grid grid-cols-2 gap-8">

<div>

### Problema: Setup Sparso
```js
// ❌ Setup e cleanup separati
test.beforeEach(async ({ request }) => {
  const prodotto = await creaProdotto();
  // Come lo passo al test?
});

test.afterEach(async ({ request }) => {
  // Come so quale prodotto eliminare?
});

test('modifica prodotto', async ({ page }) => {
  // Come ottengo il prodotto?
});
```

</div>

<div>

### Soluzione: Fixture Personalizzata
```js
// ✅ fixtures.ts
export const test = base.extend<{
  prodottoCreato: any
}>({
  prodottoCreato: async ({ request }, use) => {
    // 1. SETUP
    const nome = `Prodotto-${Date.now()}`;
    const prodotto = await request.post(
      '/api/products', { data: { nome } }
    );

    // 2. PASSA AL TEST
    await use(prodotto);

    // 3. TEARDOWN
    await request.delete(
      `/api/products/${prodotto.id}`
    );
  }
});
```

</div>

</div>

---

# 3. Fixtures: Esempio Completo

```js
// fixtures/prodotto.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ prodottoCreato: any }>({
  prodottoCreato: async ({ request }, use) => {
    const nomeProdotto = `Prodotto-${Date.now()}`;
    const response = await request.post('/api/products', {
      data: { name: nomeProdotto, price: 99.99 }
    });
    const prodotto = await response.json();

    await use(prodotto); // Il test riceve il prodotto

    await request.delete(`/api/products/${prodotto.id}`); // Cleanup automatico
  }
});

// test.spec.ts
import { test } from './fixtures/prodotto';

test('modifica nome prodotto', async ({ page, prodottoCreato }) => {
  await page.goto(`/prodotti/${prodottoCreato.id}`);
  await page.getByLabel('Nome').fill('Nuovo Nome');
  await page.getByRole('button', { name: 'Salva' }).click();

  await expect(page.getByText('Nuovo Nome')).toBeVisible();
});
```

---

# 4. Gestisci l'Autenticazione una Sola Volta

<div class="grid grid-cols-2 gap-8">

<div>

### Setup File
```js
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ request }) => {
  // Login via API (non UI!)
  const response = await request.post('/api/login', {
    data: {
      email: 'admin@test.com',
      password: 'admin123'
    }
  });

  // Salva i cookie/token
  await request.storageState({
    path: 'auth.json'
  });
});
```

</div>

<div>

### Configurazione
```js
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Usa lo stato di autenticazione
        storageState: 'auth.json'
      },
      dependencies: ['setup']
    }
  ]
});
```

**Tutti i test partono già loggati!**

</div>

</div>
