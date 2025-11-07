# TechStore - E-commerce Demo Application

Applicazione e-commerce demo progettata specificamente per il workshop su Playwright. Questa app fornisce un ambiente realistico per imparare e testare scenari comuni di testing end-to-end.

## Caratteristiche

### 🛍️ Funzionalità E-commerce

- **Catalogo Prodotti**: 10 prodotti con categorie, prezzi e disponibilità
- **Ricerca e Filtri**: Ricerca testuale, filtro per categoria, ordinamento per prezzo/nome
- **Gestione Carrello**: Aggiungi/rimuovi prodotti, modifica quantità
- **Autenticazione**: Sistema di login con sessioni
- **Checkout**: Form multi-step con validazione
- **Ordini**: Visualizzazione storico ordini utente

### 🎯 Ottimizzato per Testing Playwright

Tutte le funzionalità includono:
- **data-testid attributes** per selettori stabili
- **Loading states** per testare async operations
- **Validazione form** per testare error handling
- **Responsive design** per testare su diversi viewport
- **API REST** per intercettare/mockare richieste

## Quick Start

### Opzione 1: Docker Compose (Consigliato)

Il modo più semplice per avviare l'applicazione:

```bash
docker-compose up -d
```

L'app sarà disponibile su http://localhost:3000

**Comandi Docker utili:**
```bash
docker-compose up -d          # Avvia in background
docker-compose logs -f        # Visualizza i log
docker-compose down           # Ferma e rimuove i container
docker-compose restart        # Riavvia l'applicazione
```

### Opzione 2: Node.js Locale

Se preferisci eseguire l'app senza Docker:

1. **Installa le dipendenze**:
   ```bash
   npm install
   ```

2. **Avvia l'applicazione**:
   ```bash
   npm start
   ```

   L'app sarà disponibile su http://localhost:3000

3. **Modalità sviluppo** (con auto-reload):
   ```bash
   npm run dev
   ```

## Credenziali di Test

L'applicazione include utenti pre-configurati per il testing:

```
Email: test@example.com
Password: password123

Email: john@example.com
Password: john123
```

## Struttura del Progetto

```
demo-app/
├── server.js              # Server Express con API REST
├── data/                  # Dati mock
│   ├── products.json      # 10 prodotti e-commerce
│   └── users.json         # Utenti di test
├── public/                # Frontend
│   ├── index.html         # Catalogo prodotti + ricerca/filtri
│   ├── login.html         # Pagina di autenticazione
│   ├── cart.html          # Carrello della spesa
│   ├── checkout.html      # Processo di checkout
│   ├── orders.html        # Storico ordini
│   ├── css/
│   │   └── style.css      # Stili globali
│   └── js/
│       └── common.js      # Utilità condivise
└── package.json
```

## API Endpoints

### Prodotti
- `GET /api/products` - Lista prodotti (con filtri: ?category=, ?search=, ?sort=)
- `GET /api/products/:id` - Dettaglio prodotto
- `GET /api/categories` - Lista categorie

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Info utente corrente

### Carrello
- `GET /api/cart` - Ottieni carrello
- `POST /api/cart` - Aggiungi prodotto
- `PUT /api/cart/:productId` - Aggiorna quantità
- `DELETE /api/cart/:productId` - Rimuovi prodotto

### Checkout & Ordini
- `POST /api/checkout` - Completa ordine
- `GET /api/orders` - Lista ordini utente
- `GET /api/orders/:id` - Dettaglio ordine

## Scenari di Testing Consigliati

### 1. Navigazione e Ricerca
```javascript
// Test ricerca prodotti
await page.goto('http://localhost:3000');
await page.getByTestId('search-input').fill('laptop');
await expect(page.getByTestId('product-1')).toBeVisible();

// Test filtri categoria
await page.getByTestId('category-filter').selectOption('electronics');
```

### 2. Gestione Carrello
```javascript
// Aggiungi al carrello
await page.getByTestId('add-to-cart-1').click();
await expect(page.locator('#cartBadge')).toHaveText('1');

// Modifica quantità
await page.goto('/cart');
await page.getByTestId('increase-1').click();
await expect(page.getByTestId('quantity-1')).toHaveText('2');
```

### 3. Autenticazione
```javascript
// Login
await page.goto('/login');
await page.getByTestId('email-input').fill('test@example.com');
await page.getByTestId('password-input').fill('password123');
await page.getByTestId('login-button').click();
await expect(page.locator('#userGreeting')).toContainText('Test User');
```

### 4. Checkout
```javascript
// Completa acquisto
await page.goto('/checkout');
await page.getByTestId('first-name').fill('Mario');
await page.getByTestId('last-name').fill('Rossi');
// ... compila altri campi
await page.getByTestId('place-order-button').click();
await expect(page.getByTestId('order-number')).toBeVisible();
```

### 5. Testing Avanzato

**Intercettare API**:
```javascript
await page.route('**/api/products', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([/* mock products */])
  });
});
```

**Testare Loading States**:
```javascript
const response = page.waitForResponse('**/api/products');
await page.goto('/');
await expect(page.locator('#loadingState')).toBeVisible();
await response;
await expect(page.locator('#loadingState')).toBeHidden();
```

**Visual Regression Testing**:
```javascript
await page.goto('/');
await expect(page).toHaveScreenshot('homepage.png');
```

## Configurazione Playwright

Esempio di configurazione per testare questa app:

```javascript
// playwright.config.js
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Features per Workshop

Questa app è ottimizzata per dimostrare:

✅ **Selettori robusti** (data-testid)
✅ **Form validation** e error handling
✅ **Async operations** e loading states
✅ **Autenticazione** e gestione sessioni
✅ **Multi-step flows** (checkout)
✅ **API mocking** e intercettazione
✅ **Responsive testing**
✅ **Visual regression testing**

## Configurazione Docker

### Dockerfile

L'applicazione include un Dockerfile ottimizzato:
- Base image: `node:18-alpine` (leggera)
- Multi-stage build ready
- Health check integrato
- Variabili d'ambiente configurabili

### docker-compose.yml

Configurazione completa con:
- Port mapping: `3000:3000`
- Health check automatico
- Auto-restart
- Network isolato

### Personalizzazione

Per modificare la porta o altre configurazioni:

```yaml
# docker-compose.yml
services:
  demo-app:
    ports:
      - "8080:3000"  # Cambia la porta host
    environment:
      - NODE_ENV=development
```

## Troubleshooting

### L'app non si avvia (Docker)
```bash
# Verifica che Docker sia in esecuzione
docker ps

# Verifica i log
docker-compose logs -f

# Ricostruisci l'immagine
docker-compose build --no-cache
docker-compose up -d
```

### L'app non si avvia (Node.js)
```bash
# Verifica che la porta 3000 sia libera
lsof -i :3000

# Reinstalla le dipendenze
rm -rf node_modules package-lock.json
npm install
```

### Il carrello non mantiene i prodotti
Il carrello è salvato in memoria nel server. Se riavvii il server, il carrello viene perso. Questo è intenzionale per semplificare il testing.

### Gli ordini scompaiono
Gli ordini sono salvati in memoria. Riavviando il server vengono persi. Per testing persistenti, considera di mockare le API.

### Problemi di connessione da Playwright
Se esegui Playwright fuori dal container Docker, assicurati che l'app sia raggiungibile su `localhost:3000`. Se Playwright è in un altro container, usa il nome del servizio Docker come hostname.

## Licenza

MIT
