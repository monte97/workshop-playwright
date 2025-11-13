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

## Documentazione API

La documentazione completa delle API è disponibile tramite Swagger UI all'indirizzo:

**http://localhost:3000/api-docs**

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
├── server.js              # Server Express con API REST e Swagger
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
- `POST /api/products` - Crea nuovo prodotto
- `PUT /api/products/:id` - Aggiorna prodotto
- `DELETE /api/products/:id` - Elimina prodotto
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

## Licenza

MIT