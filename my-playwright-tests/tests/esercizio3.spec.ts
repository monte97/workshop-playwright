import { test as base, expect } from '@playwright/test';

/**
 * Fixture che svuota il carrello prima di ogni test
 * Risolve il problema di carrello persistente tra i test con session condivisa
 */
type ClearCartFixture = {
  clearCart: void;
};

const test = base.extend<ClearCartFixture>({
  clearCart: async ({ page, request }, use) => {
    // SETUP: Svuota il carrello prima del test
    await page.goto('http://localhost:3000/');

    // Prendi il carrello attuale
    const cartResponse = await request.get('/api/cart');
    const cart = await cartResponse.json();

    // Rimuovi tutti i prodotti
    for (const item of cart) {
      await request.delete(`/api/cart/${item.productId}`).catch(() => {});
    }

    console.log('✓ Carrello svuotato');

    // Passa il controllo al test (auto-executing fixture)
    await use(undefined);

    // TEARDOWN (opzionale): potresti svuotare di nuovo se necessario
  },
});

test('Utente già loggato - aggiungi al carrello (test 1)', async ({ page, clearCart }) => {
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
})


test('Utente già loggato - aggiungi al carrello (test 2)', async ({ page, clearCart }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByRole('link', { name: '🛒 Carrello' }).click();
    await expect(page.getByTestId('cart-item-1').getByRole('heading')).toContainText('Laptop ProBook 15');
})


test('Completa un ordine con validazione form', async ({ page, clearCart }) => {
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

    // Seleziona l'ordine più recente (primo nella lista) per supportare esecuzioni multiple
    const lastOrder = page.getByTestId(/^order-\d+$/).first();
    await expect(lastOrder).toMatchAriaSnapshot(`
      - strong: "📍 Indirizzo di spedizione:"
      - text: "/mario rossi via spedizione 1 \\\\d+ milano Tel: \\\\d+/"
      `);
    
    await expect(lastOrder).toContainText('899');
})