# Playwright Workshop

Workshop completo su Playwright, la libreria moderna per il testing end-to-end automatizzato di applicazioni web.

## Contenuto del Workshop

Questo repository include:

- **Slide interattive** costruite con Slidev
- **Demo application** per esercitazioni pratiche
- **Speech e contenuti** per diverse durate di presentazione
- **Esercizi hands-on** per apprendere Playwright

Il workshop copre:
- Concetti fondamentali del testing E2E
- Funzionalità e best practice di Playwright
- Esercitazioni pratiche guidate
- Temi avanzati (parallelizzazione, CI/CD integration)

## Prerequisiti

- Node.js (versione 16 o superiore)
- npm o yarn
- Git

## Quick Start

1. **Clona il repository**:
   ```bash
   git clone https://github.com/your-username/workshop-playwright.git
   cd workshop-playwright
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia le slide o la demo app** (o entrambi):

   ```bash
   # Avvia le slide in modalità sviluppo
   npm run dev:workshop

   # Oppure avvia la demo application
   cd demo-app
   npm install
   npm start
   ```

   Le slide saranno disponibili su `http://localhost:3030` e la demo app su `http://localhost:3000`.

## Struttura del Progetto

```
workshop-playwright/
├── slides/                    # File della presentazione Slidev
│   ├── components/            # Componenti riutilizzabili (Exercise, SectionTitle)
│   └── pages/                 # Pagine individuali delle slide
│       ├── 00-cover.md        # Copertina
│       ├── 01-0-overview.md   # Panoramica
│       ├── 01-intro.md        # Introduzione
│       ├── 02-core-concepts.md # Concetti fondamentali
│       ├── 03-demos.md        # Dimostrazioni
│       ├── 04-workshop.md     # Esercitazioni
│       ├── 05-advanced.md     # Temi avanzati
│       └── 99-end.md          # Conclusioni
├── demo-app/                  # Applicazione demo per il testing
│   ├── public/                # File frontend
│   └── server.js              # Server Express
├── speeches/                  # Contenuti speech per diverse versioni
│   ├── main-outline.md        # Scaletta completa
│   ├── workshop-speech.md     # Speech workshop completo (4-8 ore)
│   ├── intermediate-workshop-speech.md # Workshop intermedio (2 ore)
│   ├── meetup-speech.md       # Versione meetup (30-40 min)
│   └── demo-scripts.md        # Script per demo live coding
├── exports/                   # PDF generati (escluso da Git)
├── slides.workshop.md         # File principale orchestrazione slide
└── package.json               # Dipendenze e script npm
```

## Lavorare con le Slide

### Comandi Disponibili

```bash
# Sviluppo
npm run dev:workshop          # Avvia le slide in modalità sviluppo
npm run build:workshop        # Build per produzione

# Esportazione PDF
npm run export:workshop       # Esporta in PDF (salva in exports/)

# Con Makefile
make slides                   # Avvia le slide
make install                  # Installa tutte le dipendenze
make all                      # Avvia slide + demo app
```

### Struttura delle Slide

Le slide sono organizzate in modo modulare:

- **slides.workshop.md**: File principale che orchestra le slide
- **slides/pages/**: Contiene le singole pagine/sezioni
- **slides/components/**: Componenti Vue riutilizzabili (Exercise, SectionTitle)

Questa struttura permette di:
- Modificare singole sezioni senza impattare le altre
- Riutilizzare componenti attraverso le slide
- Mantenere il codice organizzato e manutenibile

### Contenuti del Workshop

1. **Introduzione** - Presentatore e obiettivi del workshop
2. **Concetti Fondamentali** - Tipi di testing e sfide dell'E2E
3. **Playwright Deep Dive** - Caratteristiche e vantaggi
4. **Esercitazioni Pratiche** - Hands-on exercises
5. **Temi Avanzati** - Parallelizzazione e integrazione CI/CD

## Demo Application - TechStore E-commerce

### Caratteristiche

La directory `demo-app/` contiene un'**applicazione e-commerce completa** progettata specificamente per il workshop Playwright. Offre un ambiente realistico per testare tutti gli scenari comuni di un'applicazione web moderna.

**Funzionalità E-commerce:**
- **Catalogo Prodotti**: 10 prodotti con categorie, prezzi, disponibilità
- **Ricerca e Filtri**: Ricerca testuale, filtro per categoria, ordinamento
- **Gestione Carrello**: Aggiungi/rimuovi prodotti, modifica quantità
- **Autenticazione**: Sistema di login con gestione sessioni
- **Checkout Multi-step**: Form di spedizione e selezione pagamento
- **Storico Ordini**: Visualizzazione ordini completati

**Ottimizzazioni per Testing:**
- Tutti gli elementi hanno `data-testid` attributes per selettori stabili
- Loading states per testare operazioni asincrone
- Validazione form per testare error handling
- API REST per intercettare/mockare richieste
- Design responsive per testare diversi viewport

### Avviare la Demo App

**Con Docker (Consigliato):**
```bash
cd demo-app
docker-compose up -d
```

**Con Node.js:**
```bash
cd demo-app
npm install
npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

**Credenziali di test:**
```
Email: test@example.com
Password: password123
```

### Scenari di Testing

L'app è ottimizzata per testare:

- **Navigazione**: Ricerca prodotti, filtri, ordinamento
- **Carrello**: Aggiunta/rimozione prodotti, modifica quantità
- **Autenticazione**: Login, logout, gestione sessioni
- **Checkout**: Form multi-step, validazione, completamento ordine
- **API Mocking**: Intercettare richieste, simulare errori
- **Visual Testing**: Screenshot comparison, responsive testing

Vedi il [README della demo-app](demo-app/README.md) per esempi di test dettagliati.

## Speech e Contenuti

La directory `speeches/` contiene il materiale per presentare il workshop in diverse modalità:

- **main-outline.md**: Scaletta generale del workshop
- **workshop-speech.md**: Speech completo (4-8 ore)
- **intermediate-workshop-speech.md**: Versione intermedia (2 ore)
- **meetup-speech.md**: Versione breve per meetup (30-40 minuti)
- **demo-scripts.md**: Script per le demo live coding

Questi contenuti possono essere adattati in base al tempo disponibile e al livello di approfondimento desiderato.

## Comandi Makefile

Per facilitare la gestione del progetto, è disponibile un Makefile con i comandi principali:

```bash
make install              # Installa tutte le dipendenze
make slides               # Avvia le slide in dev mode
make demo                 # Avvia la demo application
make all                  # Avvia sia slide che demo app
make clean                # Pulisce gli asset compilati
```

## Contribuire

Contributi e miglioramenti sono benvenuti! Puoi:

- Aggiungere esempi alla demo application
- Creare contenuti aggiuntivi per le slide
- Migliorare gli esercizi del workshop
- Correggere errori o migliorare le spiegazioni

## Licenza

Questo progetto è rilasciato sotto licenza MIT.