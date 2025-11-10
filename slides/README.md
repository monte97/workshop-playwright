# Workshop Playwright - Slide Minimali

Nuovo set di slide con design minimale, moderno e professionale.

## Struttura

```
slides-new/
├── slides.md              # File principale
├── styles/
│   └── minimal.css        # CSS custom minimale
├── pages/
│   ├── 00-cover.md       # Cover e chi sono
│   ├── 01-agenda.md      # Agenda e intro E2E
│   ├── 02-playwright-intro.md  # Intro Playwright
│   ├── 03-demo.md        # Demo e tools
│   ├── 04-workshop.md    # Workshop exercises
│   ├── 05-advanced.md    # Concetti avanzati
│   └── 06-conclusion.md  # Best practices e conclusione
└── README.md
```

## Come usare

```bash
cd slides-new

# Installa dipendenze (se non già fatto)
npm install

# Avvia dev server
npx slidev slides.md

# Build per produzione
npx slidev build slides.md
```

## Caratteristiche

- **Design minimale**: Tanto spazio bianco, leggibilità ottimale
- **Font moderni**: Inter per testo, JetBrains Mono per codice
- **Colori sobri**: Palette professionale con blu come primary
- **Contenuti ben distribuiti**: Mai troppo in una slide
- **Code blocks eleganti**: Syntax highlighting e padding generoso
- **Responsive**: Si adatta a diverse dimensioni schermo

## Principi di design

1. **Meno è meglio**: Ogni slide ha un solo concetto principale
2. **Spazio respira**: Padding e margini generosi
3. **Gerarchia chiara**: Titoli ben distinti dal contenuto
4. **Codice leggibile**: Font monospace ben spaziato
5. **Colori funzionali**: Usati per enfatizzare, non decorare
