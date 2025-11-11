---
layout: center
---

# Workshop Time! 🎯

---

# Esercizio 1: Login Flow

<div class="grid grid-cols-2 gap-8">
<div>

### Obiettivo
Testare il flusso di login completo

### Passi
1. Navigare alla pagina di login
2. Compilare email e password
3. Cliccare su login
4. Verificare redirect a dashboard
5. Verificare messaggio di benvenuto

</div>
<div>

### Bonus
- Testare login fallito
- Testare validazione campi
- Testare "Remember me"

</div>
</div>

---

# Esercizio 2: E-commerce

<div class="grid grid-cols-2 gap-8">
<div>

### Obiettivo
Testare il flusso di acquisto end-to-end

### Passi
1. Cercare un prodotto
2. Aprire dettaglio prodotto
3. Aggiungere al carrello
4. Procedere al checkout
5. Compilare form spedizione
6. Confermare ordine

</div>
<div>

### Bonus
- Testare quantità prodotti
- Testare rimozione dal carrello
- Testare codici sconto

</div>
</div>

---

# Esercizio 3: API Mocking

<div class="grid grid-cols-3 gap-8">
<div class="col-span-2">

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

</div>
<div>

### Obiettivo
Intercettare e mockare chiamate API

</div>
</div>

---

# Esercizio 4: Visual Testing

<div class="grid grid-cols-3 gap-8">
<div class="col-span-2">

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

</div>
<div>

### Obiettivo
Confrontare screenshot per rilevare cambiamenti UI

### Bonus
- Screenshot full page
- Screenshot di un componente specifico
- Soglie di tolleranza (# pixel)
- Stylesheet custom


### Aggiornamenti

```bash
npx playwright test --update-snapshots
```

</div>
</div>

<!--
Alla prima esecuzione vengono generati gli screenshot.

Gli aggiornamenti possono riguardare anche un sotto-insieme dei test (eg: filtro per progetto)
 
Gli stylesheet custom servono per applicare particolari stili alla pagina, in modo da facilitare il confronto (eg: nascondere elementi dinamici)

Il confronto può avvenire anche tramite locator!
https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1
-->
