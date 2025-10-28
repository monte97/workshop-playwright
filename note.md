# [Testing] Playwright

Area: RuleDesigner (https://www.notion.so/RuleDesigner-5639d23e29cb40a28195629ff597cdfe?pvs=21), Aete (https://www.notion.so/Aete-14ff28947e69805e8108eb3ebdea2840?pvs=21)
Status: Doing
Is blocking: 0
Done: No
Archive: No
To Share: No

[Untitled](%5BTesting%5D%20Playwright/Untitled%20299f28947e6980ee9b5aee006f7fd164.csv)

...

---

- Info
    
    <aside>
    ❓ Breakdown projects into manageable **Tasks**.
    
    </aside>
    
    [Untitled](%5BTesting%5D%20Playwright/Untitled%20299f28947e69801cbeaedf2ef889fad1.csv)
    
    [Untitled](%5BTesting%5D%20Playwright/Untitled%20299f28947e69807eabe0c7660282d68c.csv)
    

[‎Google Gemini](https://gemini.google.com/app/50dd695e8ababc43)

# Materiali

- workshop
    - 2/4/8 ore
        - a seconda di quello che si vuole approfondire usare un set diverso di slide
            - partire con quella da 4 e poi tagliare/aggiungere
        - derivare anche una versione da 30/40 minuti per workshop
    - servirà una applicazione demo
        - la posso generare
        - usare obfuscation su html/js per dimostrare che funziona in ogni caso

## Organizzazione slide

[Slidev](https://sli.dev/)

```bash
/slides
|-- /components        <-- Per componenti riutilizzabili
|   |-- Exercise.vue
|   |-- SectionTitle.vue
|-- /pages             <-- I tuoi "capitoli"
|   |-- 00-cover.md
|   |-- 01-intro.md
|   |-- 02-core-concepts.md
|   |-- 03-demos.md
|   |-- 04-workshop.md
|   |-- 05-advanced.md
|   |-- 99-end.md
|-- slides.md          <-- IL FILE "MASTER"
|-- package.json
```

in *slides.dev* importo solo i capitoli che mi servono

se un capitolo definire più pagine allora vengono importate in blocco tutte le pagine?

posso fare più versioni di [*slides.dev*](http://slides.dev) in cui importo capitoli diversi

```bash
"scripts": {
  "dev:workshop": "slidev slides.workshop.md",
  "dev:meetup": "slidev slides.meetup.md",
  "build:workshop": "slidev build slides.workshop.md",
  "build:meetup": "slidev build slides.meetup.md"
}
```

# Scaletta

- introduzione/cover
    - chi sono…
- core-concept
    - tipologie di testing/piramide di testing
        - unit test: verificare una specifica funzionalità
        - integration test: vedere come un inseme di componenti lavorano insieme
        - E2E testing: simulare utenti reali per determinare la correttezza dell’interno flusso
    - i test E2E perché sono utili e perché sono difficili
        - utili
            - verificano dei flussi completi
            - possibilità di identificare errori che si verificano in casi complessi
            - maggiore confidenza
            - documentazione vivente del comportamento
                - Documentation Driven Development
        - difficili
            - instabili
            - lenti
            - difficili da mantenere
            - setup complesso
                - gestione di dipendenze esterne
    - playwright
        - cos’è
            - frame open source di microsoft
        - quali problemi risolve
        - prncipi cardine
    - affidabilità
        - 
    - velocità: esecuzione parallela
        - isolamento totale dei contesti
            - ma come fa? come posso garantire che le esecuzioni siano isolate e senza interferenze?
                - lato browser in capo a lui, garantisce l’univocità delle sessioni
                - lat backend responsabilità di chi scrive i test
    - semplicità: Multi Browser
        - una sola API per tutti i principali browser
- demo(s)
- wokshop
- argomenti avanzati
- conclusioni
