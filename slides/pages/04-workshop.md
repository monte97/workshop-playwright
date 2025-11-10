# Workshop Time! 🎯

### Esercizi Pratici

| # | Esercizio | Difficoltà | Tempo |
|---|-----------|------------|-------|
| 1 | Login Flow | ⭐ | 10 min |
| 2 | E-commerce | ⭐⭐ | 15 min |
| 3 | API Mock | ⭐⭐ | 10 min |
| 4 | Visual Testing | ⭐⭐⭐ | 15 min |

---

# Esercizio 1: Login Flow

### Obiettivo
Testare il flusso di login completo

### Passi
1. Navigare alla pagina di login
2. Compilare email e password
3. Cliccare su login
4. Verificare redirect a dashboard
5. Verificare messaggio di benvenuto

### Bonus
- Testare login fallito
- Testare validazione campi
- Testare "Remember me"

---

# Esercizio 2: E-commerce

### Obiettivo
Testare il flusso di acquisto end-to-end

### Passi
1. Cercare un prodotto
2. Aprire dettaglio prodotto
3. Aggiungere al carrello
4. Procedere al checkout
5. Compilare form spedizione
6. Confermare ordine

### Bonus
- Testare quantità prodotti
- Testare rimozione dal carrello
- Testare codici sconto

---

# Esercizio 3: API Mocking

### Obiettivo
Intercettare e mockare chiamate API

```js
test('mock API response', async ({ page }) => {
  // Mock della risposta API
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'Product 1', price: 99.99 }
      ])
    });
  });

  await page.goto('/products');

  // Verifica che usi i dati mockati
  await expect(page.getByText('Product 1')).toBeVisible();
  await expect(page.getByText('99.99')).toBeVisible();
});
```

---

# Esercizio 4: Visual Testing

### Obiettivo
Confrontare screenshot per rilevare cambiamenti UI

```js
test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');

  // Screenshot comparison
  await expect(page).toHaveScreenshot('dashboard.png');
});

test('element screenshot', async ({ page }) => {
  await page.goto('/profile');

  const card = page.getByTestId('profile-card');
  await expect(card).toHaveScreenshot('profile-card.png');
});
```

### Bonus
- Screenshot full page
- Maschere per contenuti dinamici
- Soglie di tolleranza
