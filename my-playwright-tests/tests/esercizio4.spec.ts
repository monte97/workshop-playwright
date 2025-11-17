import { test as base, expect, Page } from '@playwright/test';
import { randomUUID } from 'crypto'; // Importa la funzione per l'UUID

// 1. Definiamo un tipo per la nostra fixture (buona prassi per TypeScript)
type MyFixtures = {
  adminCreateFormPage: Page;
};

// 2. Estendiamo 'test' (rinominato in 'base' per chiarezza)
const myTest = base.extend<MyFixtures>({
  
  // Questa è la tua fixture, con un nome più chiaro
  adminCreateFormPage: async ({ page }, use) => {
    // --- SETUP ---
    // Questi passaggi vengono eseguiti PRIMA di ogni test che usa la fixture
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByTestId('show-create-form').click();
    
    // Buona prassi: Aggiungi un'attesa per assicurarti
    // che il modulo sia effettivamente visibile prima di procedere
    await expect(page.getByRole('heading', { name: 'Crea Nuovo Prodotto' })).toBeVisible();

    // --- ESECUZIONE TEST ---
    // 'use' passa il controllo al corpo del test (il codice dentro 'myTest(...)')
    // Il test riceverà l'oggetto 'page' in questo stato
    await use(page);

    // --- TEARDOWN (Pulizia) ---
  },
});

// 3. Ora usiamo la fixture per scrivere test REALI

// Test 1: Versione INGENUA - Usa dati statici
// ❌ SHOULD FAIL on second run - Duplicate product name
myTest('[PROBLEMA] Fixture con dati statici - fallisce alla 2ª esecuzione', async ({ adminCreateFormPage }) => {
  // 'adminCreateFormPage' è l'oggetto 'page' che la fixture ci ha passato
  // Siamo già sul modulo di creazione grazie alla fixture
  const page = adminCreateFormPage;

  await page.getByTestId('create-name').click();
  await page.getByTestId('create-name').fill('Nome del prodotto'); // ⚠️ STATICO - fallirà alla 2a esecuzione!
  await page.getByTestId('create-name').press('Tab');
  await page.getByTestId('create-price').fill('15');
  await page.getByTestId('create-stock').click();
  await page.getByTestId('create-stock').fill('120');
  await page.getByTestId('create-category').selectOption('electronics');
  await page.getByTestId('submit-create').click();
  await expect(page.getByTestId('alert-success')).toBeVisible();
});

// Test 2: Sad Path (dati mancanti)
myTest('Fixture - validazione: errore se nome è mancante', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;

  await page.getByTestId('create-category').selectOption('electronics');
  await page.getByTestId('submit-create').click();
  await expect(page.getByTestId('alert-error')).toBeVisible();
  
});

/* ----- */

// Test 2: Versione MIGLIORATA - Usa dati dinamici ma con timeout fisso
// ⚠️ FLAKY - Può fallire a causa del delay artificiale del backend (3s > 1s timeout)
myTest('[FLAKY] Dati dinamici ma race condition con timeout fisso', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;

  // 1. Genera dati dinamici (risolve il problema dei duplicati)
  const uniqueName = `Prodotto Test ${randomUUID().slice(0, 8)}`; // Un nome unico
  const randomPrice = Math.floor(Math.random() * 200 + 1).toString(); // Un prezzo tra 1 e 200
  const randomStock = Math.floor(Math.random() * 500 + 50).toString(); // Uno stock tra 50 e 500

  // 2. Usa i dati dinamici per compilare il modulo
  await page.getByTestId('create-name').fill(uniqueName);
  await page.getByTestId('create-price').fill(randomPrice);
  await page.getByTestId('create-stock').fill(randomStock);
  // --- Fine Modifica ---

  await page.getByTestId('create-category').selectOption('electronics');

  await page.getByRole('button', { name: 'Crea Prodotto' }).click();

  // ⚠️ PROBLEMA: timeout di 1s ma il backend ha un delay del 70% con 3s
  // Fallirà ~70% delle volte!
  await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
});

// Test 3: Versione ROBUSTA - Usa waitForResponse
// ✅ SHOULD PASS - Risolve sia il problema dei duplicati che della race condition
myTest('✅ Soluzione robusta con dati dinamici e waitForResponse', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;

  // 1. Genera dati dinamici (risolve problema duplicati)
  const uniqueName = `Prodotto Test ${randomUUID().slice(0, 8)}`; // Un nome unico
  const randomPrice = Math.floor(Math.random() * 200 + 1).toString(); // Un prezzo tra 1 e 200
  const randomStock = Math.floor(Math.random() * 500 + 50).toString(); // Uno stock tra 50 e 500

  // 2. Usa i dati dinamici per compilare il modulo
  await page.getByTestId('create-name').fill(uniqueName);
  await page.getByTestId('create-price').fill(randomPrice);
  await page.getByTestId('create-stock').fill(randomStock);
  // --- Fine Modifica ---

  await page.getByTestId('create-category').selectOption('electronics');

  // ✅ SOLUZIONE: Attende la risposta dell'API (risolve race condition)
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/products') && response.request().method() === 'POST'),
    page.getByTestId('submit-create').click()
  ]);
  expect(response.ok()).toBeTruthy(); // Verifica che la chiamata API sia andata a buon fine

  // Ora l'asserzione è sicura perché sappiamo che l'API ha risposto
  await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
});
