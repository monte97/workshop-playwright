---
layout: center
---

# Esercizio 1: Generazione Automatica di Test

- **Codegen**: Strumento che registra le interazioni dell'utente e le converte in codice di test.
- **UI Mode**: Interfaccia grafica per eseguire, esplorare e debuggare i test in modo interattivo.
- **Trace Viewer**: Utility per analizzare l'esecuzione di un test fallito, ispezionando DOM, azioni e chiamate di rete passo dopo passo.

## Obiettivi di apprendimento
- ✅ Generare uno script di test utilizzando Codegen.
- ✅ Utilizzare selettori stabili come `data-testid`.
- ✅ Eseguire e analizzare un test tramite la UI Mode.
- ✅ Effettuare il debug di un fallimento con il Trace Viewer.

**Scenario:** Test del flusso di login e aggiunta di un prodotto al carrello.

---

# Esercizio 1: Passi Operativi (con l'estensione VS Code)

1.  **Avvia il Recorder** dall'estensione Playwright di VS Code.
2.  **Interagisci con l'applicazione** (`http://localhost:3000`) per registrare il flusso:
    - Login (`test@example.com` / `password123`)
    - Aggiunta prodotto al carrello
3.  **Aggiungi un'asserzione** (es. verifica contatore carrello) tramite il Recorder.
4.  **Salva il codice** generato in `tests/exercise1.spec.ts`.
5.  **Esegui il test** direttamente da VS Code.

<!--
**Note aggiuntive per il docente:**

**Passi dettagliati per l'Esercizio 1:**

1.  **Apri il pannello "Testing"** nella barra laterale di VS Code (l'icona a forma di beuta).
2.  Trova e clicca sul pulsante **"Record new"** in alto nel pannello dei test.
3.  **Registra le azioni nel browser:**
    - Si aprirà una finestra del browser e il recorder di Playwright.
    - Inserisci l'URL `http://localhost:3000` nella barra degli indirizzi del recorder.
    - Esegui le seguenti azioni:
        - Clicca su "Login" nel menu.
        - Compila email: `test@example.com`
        - Compila password: `password123`
        - Clicca sul pulsante di login.
        - Aggiungi un prodotto al carrello.
4.  **Aggiungi un'asserzione con il Recorder:**
    - Clicca sul pulsante "Assert visibility" nel recorder.
    - Clicca sull'icona del carrello in alto a destra per verificare che sia visibile.
    - Il recorder aggiungerà un'istruzione `await expect(...).toBeVisible()`.
5.  **Salva il test:**
    - Clicca su "Cancel" nel recorder per terminare la registrazione.
    - Il codice generato apparirà in un nuovo file in VS Code.
    - Salva il file come `tests/exercise1.spec.ts`.
6.  **Esegui il test da VS Code:**
    - Apri il file salvato.
    - Clicca sull'icona "play" verde accanto alla definizione del test per eseguirlo.
    - Analizza i risultati direttamente nell'editor.
-->

<!--
**Punti chiave da osservare:**
- La scelta automatica di selettori robusti (`data-testid`).
- La facilità di esecuzione e debug tramite gli strumenti integrati.

In generale ho notato che:
- ci possono essere dei problemi quando si definiscono delle asserzioni sui "baloon"
- meglio usare interazioni "semplici", ad esempio mi dava problemi con il cambio focus tramite tab -> sempre meglio cliccare
-->