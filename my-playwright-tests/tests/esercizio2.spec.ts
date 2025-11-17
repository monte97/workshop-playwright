import { test, expect } from '@playwright/test';

test('Screenshot della homepage - baseline', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Attendo il caricamento della griglia
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  await expect(page).toHaveScreenshot("homepage.png");
});


test('Screenshot con stile modificato - verifica differenza', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  // Ottengo un riferimento all'elemento
  const heading = page.getByRole('heading', { name: 'Catalogo Prodotti' }).first()

  // Applico una funzione per applicare un nuovo stile
  await heading.evaluate(el => el.style.color = "red");

  // Adesso il test dovrebbe fallire perché lo screenshot è diverso dal baseline
  await expect(page).toHaveScreenshot("homepage.png");
});