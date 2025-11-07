# Demo Live

<SectionTitle title="03" />

---

# Setup

<div class="grid grid-cols-2 gap-6">

<div>

## 🚀 Installazione

```bash
npm init playwright@latest

# Setup automatico:
✔ tests folder
✔ GitHub Actions
✔ browsers
```

**Ottieni**: Struttura + config + test + CI/CD

</div>

<div>

## 📁 Struttura

```
my-project/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
└── .github/workflows/
```

```js
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

</div>

</div>

---

# Primo Test

<div class="grid grid-cols-2 gap-6">

<div>

## 📝 Codice

```js
import { test, expect } from '@playwright/test';

test('login con successo', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email')
    .fill('user@example.com');
  await page.getByLabel('Password')
    .fill('password123');

  await page.getByRole('button',
    { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Benvenuto'))
    .toBeVisible();
});
```

</div>

<div>

## 🎯 Features

<v-clicks>

1. **Selettori semantici**
   - `getByLabel`, `getByRole`

2. **Auto-waiting**
   - Niente `sleep()`

3. **Assertions web-first**
   - Auto-retry integrato

4. **Leggibile**
   - Come istruzioni umane

</v-clicks>

</div>

</div>

---

# Eseguire Test

<div class="grid grid-cols-2 gap-8">

<div>

## 🎮 Comandi

```bash
# Tutti i test
npx playwright test

# Test specifico
npx playwright test login.spec.ts

# Per nome
npx playwright test -g "login"

# Browser specifico
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI Mode (raccomandato!)
npx playwright test --ui
```

</div>

<div>

## 📊 Output

```bash
Running 3 tests using 3 workers

  ✓ login.spec.ts:3:1 › login con successo (2s)
  ✓ signup.spec.ts:5:1 › registrazione (3s)
  ✓ profile.spec.ts:7:1 › modifica profilo (2s)

  3 passed (7s)
```

<div v-click class="mt-4">

### 🎯 HTML Reporter

```bash
npx playwright show-report
```

- Timeline dei test
- Screenshots su failure
- Video recordings
- Trace files

</div>

</div>

</div>

---

# Codegen

<div class="grid grid-cols-2 gap-6">

<div>

## 🎬 Registra

```bash
# Avvia Codegen
npx playwright codegen localhost:3000

# Con contesto specifico
npx playwright codegen \
  --viewport-size=1280,720 \
  --device="iPhone 13" \
  --lang=it-IT \
  localhost:3000
```

<div v-click class="mt-4">

**Come funziona**:
1. Si apre il browser
2. Interagisci con la pagina
3. Codegen genera il codice
4. Copia-incolla nel test

</div>

</div>

<div>

## ✨ Codice Generato

```js
// Generato automaticamente!
await page.goto('http://localhost:3000/');

await page.getByRole('link',
  { name: 'Products' }
).click();

await page.getByPlaceholder('Search...')
  .click();

await page.getByPlaceholder('Search...')
  .fill('laptop');

await page.getByRole('button',
  { name: 'Search' }
).click();

await page.getByRole('heading',
  { name: 'Laptop Pro' }
).click();
```

<div v-click class="p-3 bg-green-500 bg-opacity-10 rounded mt-4 text-sm">

**Usa selettori best-practice automaticamente!**

</div>

</div>

</div>

---

# Codegen Demo

<div class="mt-8 max-w-4xl mx-auto">

**Scenario**: Test ricerca prodotti

<v-clicks>

1. Avvia codegen sul sito demo
2. Naviga alla sezione prodotti
3. Usa la ricerca
4. Seleziona un prodotto
5. Aggiungi al carrello
6. Copia il codice generato
7. Aggiungi assertions

</v-clicks>

<div v-click class="mt-8 p-4 bg-blue-500 bg-opacity-10 rounded text-sm">

**Pro tip**: Codegen è ottimo per iniziare, poi raffina con assertions e edge cases

</div>

</div>

---

# Inspector

<div class="grid grid-cols-2 gap-8">

<div>

## 🔍 Durante Esecuzione

```js
// Aggiungi breakpoint
await page.pause();
```

<div class="mt-4">

**Cosa puoi fare**:
- ▶️ Step through delle azioni
- 🔍 Inspect degli elementi
- 📝 Test selettori live
- 📸 Vedi lo stato DOM
- 🎯 Genera selettori

</div>

<div v-click class="mt-4 p-3 bg-purple-500 bg-opacity-10 rounded text-sm">

```bash
# Test in debug mode
npx playwright test --debug

# Debug test specifico
npx playwright test login.spec.ts --debug
```

</div>

</div>

<div>

## 🎮 UI Mode

<div class="text-sm">

Il modo migliore per sviluppare test!

```bash
npx playwright test --ui
```

**Features**:
- 👁️ Watch mode attivo
- ⚡ Run singoli test
- 🔍 Inspector integrato
- 📊 Timeline visuale
- 🎬 Video playback
- 📸 Screenshots step-by-step
- 🌐 Network tab
- 📝 Console logs

</div>

<div v-click class="mt-4 p-3 bg-green-500 bg-opacity-10 rounded text-sm">

**Hot reload**: Modifica il test e vedi subito il risultato!

</div>

</div>

</div>

---

# Trace Viewer

<div class="grid grid-cols-2 gap-6">

<div>

## 🎬 Registra

```bash
# Esegui con trace
npx playwright test --trace on

# Solo su failure
npx playwright test --trace retain-on-failure

# Visualizza trace
npx playwright show-trace trace.zip
```

<div v-click class="mt-4">

**In config**:

```js
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

</div>

</div>

<div>

## 🔍 Cosa Include

<div class="text-sm">

**Timeline completa**:
- ✅ Ogni azione eseguita
- 📸 Screenshot di ogni step
- 🌐 Tutte le richieste network
- 📝 Console logs
- 🎯 DOM snapshot interattivo
- ⏱️ Timing preciso
- 🎨 Before/After di ogni azione

**Navigation**:
- Click su azione → vedi DOM state
- Network tab → request/response
- Console tab → logs
- Source tab → codice test

</div>

<div v-click class="mt-4 p-3 bg-blue-500 bg-opacity-10 rounded text-sm">

**Game changer** per debug test falliti in CI!

</div>

</div>

</div>

---

# HTML Reporter

<div class="grid grid-cols-2 gap-8">

<div>

## 📊 Report Completo

```bash
# Genera e apri report
npx playwright show-report
```

**Include**:
- ✅ Tutti i test eseguiti
- ⏱️ Durata di ogni test
- 🎯 Pass/Fail rate
- 📸 Screenshots
- 🎬 Video
- 📋 Trace files
- 📝 Logs

</div>

<div>

## 🎨 Visualizzazione

<div class="text-sm">

**Filtri disponibili**:
- Per stato (passed/failed)
- Per browser
- Per file
- Per durata

**Click su test fallito**:
1. Vedi lo stack trace
2. Screenshot del failure
3. Video dell'esecuzione
4. Apri trace viewer
5. Vedi logs completi

</div>

<div v-click class="mt-4 p-3 bg-green-500 bg-opacity-10 rounded text-sm">

Perfetto per CI/CD: artefatto scaricabile da GitHub Actions!

</div>

</div>

</div>

---

# Demo E-Commerce

<div class="text-xs overflow-auto" style="max-height: 520px;">

```js
test('acquisto prodotto end-to-end', async ({ page }) => {
  // Homepage
  await page.goto('/');
  await expect(page).toHaveTitle(/Store/);

  // Ricerca prodotto
  await page.getByPlaceholder('Cerca prodotti').fill('laptop');
  await page.getByRole('button', { name: 'Cerca' }).click();
  await expect(page.getByText('Laptop Pro 15"')).toBeVisible();

  // Aggiungi al carrello
  await page.getByRole('link', { name: 'Laptop Pro 15"' }).click();
  await page.getByRole('button', { name: 'Aggiungi al carrello' }).click();
  await expect(page.getByText('Prodotto aggiunto')).toBeVisible();

  // Checkout
  await page.getByRole('link', { name: 'Carrello (1)' }).click();
  await page.getByRole('button', { name: 'Procedi' }).click();

  // Compila form
  await page.getByLabel('Nome completo').fill('Mario Rossi');
  await page.getByLabel('Email').fill('mario@example.com');
  await page.getByLabel('Indirizzo').fill('Via Roma 1');
  await page.getByLabel('CAP').fill('00100');

  // Conferma ordine
  await page.getByRole('button', { name: 'Conferma Ordine' }).click();
  await expect(page).toHaveURL(/order-confirmation/);
  await expect(page.getByText('Ordine confermato!')).toBeVisible();
});
```

</div>

---

# Configurazione

<div class="grid grid-cols-2 gap-6">

<div>

## ⚙️ Config Base

```js
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

</div>

<div>

## 🌐 Multi-Browser

```js
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

```bash
npx playwright test --project=chromium
```

</div>

</div>

---

# Tips per Demo Live

<div class="grid grid-cols-2 gap-8">

<div>

## 💡 Best Practices

<v-clicks>

1. **Usa UI Mode** per sviluppo
   - Visual feedback immediato
   - Debug facile

2. **Codegen per iniziare**
   - Poi raffina il codice
   - Aggiungi assertions

3. **Trace su failure**
   - Essential per debug
   - Specialmente in CI

4. **Reporter HTML**
   - Overview completa
   - Condividi con team

</v-clicks>

</div>

<div>

## 🚀 Workflow Consigliato

```bash
# 1. Sviluppo
npx playwright test --ui

# 2. Generazione rapida
npx playwright codegen localhost:3000

# 3. Test completo
npx playwright test

# 4. Debug su failure
npx playwright test --debug

# 5. Analisi risultati
npx playwright show-report
```

<div v-click class="mt-4 p-3 bg-purple-500 bg-opacity-10 rounded text-sm">

**Pro tip**: Aggiungi script in package.json per comandi frequenti!

</div>

</div>

</div>

---

# Recap Demo Live

<div class="grid grid-cols-2 gap-8">

<div>

### ✅ Cosa Abbiamo Visto

- 🚀 Setup in 2 minuti
- ✍️ Primo test funzionale
- 🎮 Comandi esecuzione
- 🎬 Codegen per velocità
- 🔍 Inspector e UI Mode
- 📊 Reporter e trace viewer
- ⚙️ Configurazione progetto

</div>

<div>

### 🎯 Punti Chiave

<div class="text-sm">

1. **Zero config needed**
   - Funziona out-of-the-box

2. **Tooling eccezionale**
   - UI Mode migliore in class
   - Trace Viewer unico

3. **Developer Experience**
   - Feedback immediato
   - Debug intuitivo

4. **Production ready**
   - Multi-browser
   - CI/CD integrato

</div>

</div>

</div>

<div class="text-center mt-8">

**Ora tocca a voi**: Workshop hands-on! 🎯

</div>
