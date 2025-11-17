import { test, expect } from '@playwright/test';

test('Aggiungi più prodotti al carrello', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByTestId('email-input').click();
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('email-input').click()
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('add-to-cart-2').click();
    await page.getByTestId('add-to-cart-2').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
    await page.getByRole('heading', { name: 'Wireless Mouse' }).click();
    await expect(page.getByTestId('cart-item-2').getByRole('heading')).toContainText('Wireless Mouse');
    await page.getByText('€899.99 × 1 = €').click();
    await expect(page.getByTestId('cart-item-1').getByRole('paragraph')).toContainText('€899.99 × 1 = €899.99');
    await expect(page.getByTestId('cart-item-2').getByRole('paragraph')).toContainText('€29.99 × 2 = €59.98');
    await expect(page.getByTestId('cart-total')).toContainText('€959.97');
    await expect(page.getByTestId('cart-total')).toContainText('€959.97');
});


test('Effettua il login e verifica il benvenuto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.locator('h1')).toContainText('Accedi');
  await page.getByTestId('email-input').click();
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('email-input').press('Tab');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('login-button').click();
  await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
});