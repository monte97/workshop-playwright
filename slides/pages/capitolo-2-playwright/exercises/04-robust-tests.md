---
layout: center
---

# Esercizio 4: Scrivere Test Robusti e Isolati

Un test è **robusto** se non fallisce a causa di condizioni esterne variabili (es. lentezza della rete).
Un test è **isolato** se non dipende e non influenza lo stato di altri test.

## Obiettivi di apprendimento
- ✅ Comprendere i problemi dei dati statici e dei test non isolati.
- ✅ Utilizzare dati dinamici per garantire l'isolamento.
- ✅ Riconoscere e risolvere i test "flaky" (instabili) causati da race condition.
- ✅ Sincronizzare i test con le operazioni di backend usando `waitForResponse`.
- ✅ Centralizzare la logica di setup ripetitiva con le **Fixture**.


---

# Esercizio 4, Refactoring con le Fixture

```typescript
// 1. Definiamo un tipo per la nostra fixture
type MyFixtures = {
  adminCreateFormPage: Page;
};

// 2. Estendiamo 'test' (rinominato in 'base' per chiarezza)
const myTest = base.extend<MyFixtures>({
  
  // 3. Implementiamo la fixture
  adminCreateFormPage: async ({ page }, use) => {
    // --- SETUP ---
    await page.goto('http://localhost:3000/admin/products');
    await page.getByTestId('show-create-form').click();
    await expect(page.getByRole('heading', { name: 'Crea Nuovo Prodotto' })).toBeVisible();

    // 'use' passa il controllo (e la pagina configurata) al test
    await use(page);

    // --- TEARDOWN (opzionale) ---
  },
});
```


<!--
I test diventano più puliti e si concentrano solo sulla logica di business.

Tutti i nostri test iniziano con gli stessi passaggi: vai alla pagina admin, apri il form. Questo è codice ripetuto. Le **Fixture** ci aiutano a centralizzare questa logica.
-->

---

# Esercizio 4, Passo 1: Il Test "Ingenuo"

Partiamo da un test semplice per la creazione di un prodotto.

```typescript
// USA DATI STATICI
myTest('dovrebbe creare un nuovo elemento con dati validi', async ({ page }) => {
  await page.getByTestId('create-name').fill('Nome del prodotto');
  await page.getByTestId('create-price').fill('15');
  await page.getByTestId('create-category').selectOption('electronics');
  
  await page.getByTestId('submit-create').click();
  
  await expect(page.getByTestId('alert-success')).toBeVisible();
});
```

**Il Problema:** Questo test fallirà alla seconda esecuzione.

<!--
**Domanda per l'aula:** Perché questo test è problematico?

**Risposta:** Usa dati statici ("Nome del prodotto"). Il nostro backend ora impedisce la creazione di prodotti con nomi duplicati. Al secondo avvio, l'API restituirà un errore `409 Conflict` e il test fallirà.

Questo test **non è isolato**: il suo successo dipende dallo stato lasciato dalle esecuzioni precedenti.
-->

---

# Esercizio 4, Passo 2: Dati Dinamici


```typescript
import { randomUUID } from 'crypto';

myTest('dovrebbe creare un elemento con dati validi - v2', async ({ page }) => {
  // 1. Genera dati dinamici e unici
  const uniqueName = `Prodotto Test ${randomUUID().slice(0, 8)}`;
  const randomPrice = Math.floor(Math.random() * 200 + 1).toString();

  // 2. Usa i dati dinamici per compilare il modulo
  await page.getByTestId('create-name').fill(uniqueName);
  await page.getByTestId('create-price').fill(randomPrice);
  await page.getByTestId('create-category').selectOption('electronics');
  
  await page.getByRole('button', { name: 'Crea Prodotto' }).click();

  // 3. Asserzione... ma c'è un problema nascosto!
  await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
});
```

<!--
Per risolvere il problema dell'isolamento, generiamo dati unici per ogni esecuzione del test.

**Spiegazione:**
Usando `randomUUID`, garantiamo che ogni esecuzione del test tenti di creare un prodotto con un nome diverso, evitando conflitti nel database. Questo è un passo fondamentale verso test affidabili.

Tuttavia, osservate l'asserzione: `toBeVisible({ timeout: 1000 })`. Stiamo *sperando* che l'API risponda entro 1 secondo. Cosa succede se è più lenta?
-->

---

# Esercizio 4, Passo 3: Il Pericolo - Test "Flaky" e Race Condition

Un test **"flaky"** (instabile) è un test che a volte passa e a volte fallisce senza modifiche al codice. La causa più comune è una **race condition**: il test e l'applicazione "gareggiano", e il risultato dipende da chi arriva primo.

```typescript
// Questa asserzione è una scommessa:
await expect(page.getByTestId('alert-success')).toBeVisible({ timeout: 1000 });
```

Se l'API impiega più di 1 secondo a rispondere, il test cercherà l'alert di successo prima che appaia, causando un fallimento.

**Simulazione:** Abbiamo introdotto un ritardo artificiale nel nostro backend. Con una probabilità del 70%, l'API impiegherà 3 secondi a rispondere. Questo test fallirà la maggior parte delle volte.

<!--
**Spiegazione per il docente:**
Questo è il punto cruciale. Il test non è rotto, e nemmeno l'applicazione. È il *test stesso* a essere scritto in modo fragile. Non bisogna mai fare affidamento su attese fisse (`page.waitForTimeout`) o timeout generosi per gestire operazioni asincrone. Bisogna attendere l'evento corretto.
-->

---

# Esercizio 4, Passo 4: `waitForResponse`

```typescript
myTest('dovrebbe creare un elemento con dati validi - v3', async ({ page }) => {
  // ... compilazione del modulo con dati dinamici ...
  await page.getByTestId('create-name').fill(uniqueName);
  await page.getByTestId('create-price').fill(randomPrice);
  await page.getByTestId('create-category').selectOption('electronics');
  
  // Attendi la risposta dell'API DOPO aver scatenato l'azione
  const [response] = await Promise.all([
    page.waitForResponse(res => 
      res.url().includes('/api/products') && res.request().method() === 'POST'
    ),
    page.getByTestId('submit-create').click()
  ]);

  // Ora che l'API ha risposto, possiamo verificare il risultato
  expect(response.ok()).toBeTruthy(); // Opzionale: verifica lo status code
  await expect(page.getByTestId('alert-success')).toBeVisible();
});
```

<!--
La soluzione corretta è sincronizzare il test con l'applicazione, attendendo l'evento che sblocca la UI: la risposta della chiamata API.
-->


