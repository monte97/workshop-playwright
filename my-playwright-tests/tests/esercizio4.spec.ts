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

// Test 1: Happy Path (tutto corretto)
myTest('dovrebbe creare un nuovo elemento con dati validi', async ({ adminCreateFormPage }) => {
  // 'adminCreateFormPage' è l'oggetto 'page' che la fixture ci ha passato
  // Siamo già sul modulo di creazione grazie alla fixture
  const page = adminCreateFormPage;

  await page.getByTestId('create-name').click();
  await page.getByTestId('create-name').fill('Nome del prodotto');
  await page.getByTestId('create-name').press('Tab');
  await page.getByTestId('create-price').fill('15');
  await page.getByTestId('create-stock').click();
  await page.getByTestId('create-stock').fill('120');
  await page.getByTestId('create-category').selectOption('electronics');
  await page.getByTestId('submit-create').click();
  await expect(page.getByTestId('alert-success')).toBeVisible();
});

// Test 2: Sad Path (dati mancanti)
myTest('dovrebbe mostrare un errore se il nome è mancante', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;

  await page.getByTestId('create-category').selectOption('electronics');
  await page.getByTestId('submit-create').click();
  await expect(page.getByTestId('alert-error')).toBeVisible();
  
});

/* ----- */

myTest('dovrebbe creare un nuovo elemento con dati validi - v2', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;
  
  // 1. Genera dati dinamici
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

  // --- Modifica Asserzione ---
  await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
});

myTest('dovrebbe creare un nuovo elemento con dati validi - v3', async ({ adminCreateFormPage }) => {
  const page = adminCreateFormPage;
  
  // 1. Genera dati dinamici
  const uniqueName = `Prodotto Test ${randomUUID().slice(0, 8)}`; // Un nome unico
  const randomPrice = Math.floor(Math.random() * 200 + 1).toString(); // Un prezzo tra 1 e 200
  const randomStock = Math.floor(Math.random() * 500 + 50).toString(); // Uno stock tra 50 e 500

  // 2. Usa i dati dinamici per compilare il modulo
  await page.getByTestId('create-name').fill(uniqueName);
  await page.getByTestId('create-price').fill(randomPrice);
  await page.getByTestId('create-stock').fill(randomStock);
  // --- Fine Modifica ---
  
  await page.getByTestId('create-category').selectOption('electronics');
  
  // Attende la risposta dell'API dopo aver inviato il modulo
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/products') && response.request().method() === 'POST'),
    page.getByTestId('submit-create').click()
  ]);
  expect(response.ok()).toBeTruthy(); // Verifica che la chiamata API sia andata a buon fine

  // --- Modifica Asserzione ---
  await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
});
