import { test, expect } from '@playwright/test';


test('already logged in 1', async ({ page }) => {
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
})


test('already logged in 2', async ({ page }) => {
    await page.goto('http://localhost:3000/');    
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
})


test('perform order', async ({ page }) => {
    await page.goto('http://localhost:3000/');    
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
    await page.getByTestId('checkout-button').click();
    await page.getByTestId('place-order-button').click();
    await expect(page.getByText('Compila tutti i campi')).toBeVisible();
    await expect(page.locator('#errorMessage')).toContainText('Compila tutti i campi obbligatori');
    await page.getByTestId('first-name').click();
    await page.getByTestId('first-name').fill('mario');
    await page.getByTestId('last-name').click();
    await page.getByTestId('last-name').fill('rossi');
    await page.getByTestId('address').click();
    await page.getByTestId('address').fill('via spedizione 1');
    await page.getByTestId('city').click();
    await page.getByTestId('city').fill('milano');
    await page.getByTestId('zip-code').click();
    await page.getByTestId('zip-code').fill('12345');
    await page.getByTestId('phone').click();
    await page.getByTestId('phone').fill('79842');
    await page.getByTestId('payment-bank-transfer').click();
    await page.getByTestId('place-order-button').click();
    await expect(page.locator('#successMessage')).toContainText('Ordine Completato!');
    await page.getByRole('link', { name: 'Visualizza Ordini' }).click();
    await expect(page.getByTestId('order-1')).toMatchAriaSnapshot(`
      - strong: "📍 Indirizzo di spedizione:"
      - text: "/mario rossi via spedizione 1 \\\\d+ milano Tel: \\\\d+/"
      `);
    await expect(page.getByTestId('order-1')).toContainText('Laptop ProBook 15 1 × €899.99 €899.99');
})