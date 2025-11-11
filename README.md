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

### Avviare le Slide

1. **Clona il repository**:
   ```bash
   git clone https://github.com/your-username/workshop-playwright.git
   cd workshop-playwright
   ```

2. **Installa le dipendenze globali** (se non già installato):
   ```bash
   npm install -g @slidev/cli
   ```

3. **Avvia le slide**:
   ```bash
   cd slides
   npx slidev slides.md
   ```

   Le slide saranno disponibili su `http://localhost:3030`

   **Modalità presenter:**
   ```bash
   npx slidev slides.md --open
   ```

   **Export PDF:**
   ```bash
   npx slidev export slides.md
   ```

### Avviare la Demo Application

```bash
cd demo-app
npm install
npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

## Struttura del Progetto

```
workshop-playwright/
├── slides/                    # Slide del workshop (Slidev)
│   ├── pages/                 # Pagine individuali delle slide
│   │   ├── 01-agenda.md       # Agenda e intro
│   │   ├── 02-playwright-intro.md  # Introduzione Playwright
│   │   ├── 03-demo.md         # Demo e tools
│   │   ├── 04-workshop.md     # Esercitazioni pratiche
│   │   ├── 05-advanced.md     # Concetti avanzati
│   │   └── 06-conclusion.md   # Best practices e conclusioni
│   ├── slides.md              # File principale Slidev
│   └── README.md              # Documentazione slide
├── workshop-commons/          # Risorse riutilizzabili
│   ├── themes/
│   │   └── modern-minimal/    # Tema dark professionale
│   ├── styles/
│   │   └── overrides.css      # Utility CSS opzionali
│   ├── slides/
│   │   └── intro/             # Slide introduttive standard
│   └── README.md              # Guida all'uso delle risorse comuni
├── demo-app/                  # Applicazione demo per il testing
│   ├── public/                # File frontend
│   └── server.js              # Server Express
├── speeches/                  # Contenuti speech per diverse versioni
│   ├── main-outline.md        # Scaletta completa
│   ├── workshop-speech.md     # Speech completo (4-8 ore)
│   └── demo-scripts.md        # Script per demo live coding
└── README.md                  # Questo file
```

## Lavorare con le Slide

### Comandi Slidev

```bash
cd slides

# Modalità sviluppo (con hot reload)
npx slidev slides.md

# Apri automaticamente il browser
npx slidev slides.md --open

# Modalità presenter (con note e timer)
npx slidev slides.md --open --presenter

# Build per produzione
npx slidev build slides.md

# Export PDF
npx slidev export slides.md

# UI Mode per sviluppo
npx slidev slides.md --ui
```

### Struttura delle Slide

Le slide sono organizzate in modo modulare:

- **slides/slides.md**: File principale che orchestra le slide
- **slides/pages/**: Contiene le singole pagine/sezioni
- **workshop-commons/**: Risorse condivise (tema, stili, slide template)

### Personalizzazione

Il workshop usa un tema custom e risorse condivise. Per personalizzare:

1. **Tema**: Modifica `workshop-commons/themes/modern-minimal/style.css`
2. **Utility CSS**: Aggiungi classi in `workshop-commons/styles/overrides.css`
3. **Slide intro**: Modifica `workshop-commons/slides/intro/montelli-intro.md`

Vedi [workshop-commons/README.md](workshop-commons/README.md) per dettagli

### Contenuti del Workshop

1. **Agenda** - Overview e introduzione al testing E2E
2. **Introduzione Playwright** - Cos'è, perché usarlo, pilastri fondamentali
3. **Demo & Tools** - Primo test, Codegen, UI Mode, Trace Viewer
4. **Workshop Hands-on** - Esercitazioni pratiche guidate
5. **Concetti Avanzati** - Page Object Model, Fixtures, Mobile, API, CI/CD
6. **Conclusioni** - Best practices, confronti, risorse

**Durata totale:** 60-90 minuti

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

## Workshop-Commons

Il progetto usa una struttura modulare con risorse condivise in `workshop-commons/`:

### Tema Modern-Minimal

Un tema dark professionale ottimizzato per workshop tecnici:
- Palette di colori sobria (Teal primary #00A98F)
- Font Inter per massima leggibilità
- Syntax highlighting per code blocks
- Design responsive e accessibile

### Utilizzo nelle Slide

```yaml
---
theme: '../workshop-commons/themes/modern-minimal'
---

# Le tue slide qui
```

### Utility CSS

Classi CSS opzionali disponibili in `workshop-commons/styles/overrides.css`:
- Grid layouts (`.grid-cols-2`, `.grid-cols-3`)
- Card components (`.card`)
- Badge e tag (`.badge`)
- Info boxes (`.info-box`, `.warning-box`)
- Emoji sizing (`.emoji-small`, `.emoji-medium`, `.emoji-large`)

Per importarle:
```html
<style src="../workshop-commons/styles/overrides.css"></style>
```

## Contribuire

Contributi e miglioramenti sono benvenuti! Puoi:

- Aggiungere esempi alla demo application
- Creare contenuti aggiuntivi per le slide
- Migliorare gli esercizi del workshop
- Correggere errori o migliorare le spiegazioni

## Licenza

Questo progetto è rilasciato sotto licenza MIT.