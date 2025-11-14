import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  //attendo il caricamento della griglia
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  await expect(page).toHaveScreenshot("homepage.png");
});


test('test wrong', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  // Ottengo un riferimento all'elemento
  const heading = page.getByRole('heading', { name: 'Catalogo Prodotti' }).first()

  // applico una funzione per applicare un nuovo stile
  await heading.evaluate(el => el.style.color = "red");

  // Adesso il test dovrebbe fallire perché lo screenshot è diverso
  await expect(page).toHaveScreenshot("homepage.png");
});