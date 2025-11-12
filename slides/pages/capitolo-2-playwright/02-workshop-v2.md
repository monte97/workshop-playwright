---
layout: center
---

# Workshop: Scrittura di Test E2E con Playwright

---

# L'applicazione di Riferimento: TechStore

**Applicazione e-commerce per il workshop, ottimizzata per il testing con Playwright.**

```bash
# Avvia l'applicazione tramite Docker
cd demo-app
docker-compose up -d

# Oppure con Node.js
npm install && npm start
```

**URL:** `http://localhost:3000`

**Credenziali di test:**
- Email: `test@example.com`
- Password: `password123`

**Funzionalità:** Catalogo prodotti, carrello, autenticazione, checkout, API REST.

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

# Esercizio 1: Passi Operativi

```bash
# 1. Avvia Codegen puntando all'applicazione
npx playwright codegen http://localhost:3000

# Azioni da registrare nel browser:
# - Cliccare su "Login" nel menu.
# - Compilare email: test@example.com
# - Compilare password: password123
# - Cliccare sul pulsante di login.
# - Aggiungere un prodotto al carrello.
# - Verificare che il contatore del carrello sia aggiornato.

# 2. Salvare il codice generato in un file (es. tests/example.spec.ts)

# 3. Eseguire il test
npx playwright test

# 4. Simulare un fallimento e analizzarlo con la UI Mode
npx playwright test --ui
```

<!--
**Punti chiave da osservare:**
- La scelta automatica di selettori robusti (`data-testid`).
- La facilità di esecuzione e debug tramite gli strumenti integrati.
-->

---

# Esercizio 2: Visual Regression Testing

Il **Visual Comparison (o Screenshot Testing)** confronta uno screenshot della UI attuale con uno "screenshot di baseline" (approvato in precedenza). Un test fallisce se le due immagini presentano differenze visive. È utile per rilevare modifiche inaspettate a layout, colori, font e posizionamento degli elementi.

## Obiettivi di apprendimento
- ✅ Creare uno screenshot di baseline con `toHaveScreenshot()`.
- ✅ Rilevare automaticamente cambiamenti nel layout.
- ✅ Analizzare le differenze visive (diff) generate da Playwright.
- ✅ Comprendere i casi d'uso per il testing visivo.

**Scenario:** Verifica del layout della homepage di TechStore.

---

# Esercizio 2: Implementazione del Test

```typescript
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test('Verifica aspetto homepage TechStore', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Attende il caricamento degli elementi dinamici
  await page.waitForSelector('[data-testid^="product-"]');

  // Esegue il confronto dello screenshot
  await expect(page).toHaveScreenshot('homepage.png');
});
```

**Flusso di lavoro:**
1.  **Prima esecuzione**: Playwright genera lo screenshot di baseline (es. `homepage.png`) e lo salva. Il test risulta superato.
2.  **Esecuzioni successive**: Playwright confronta lo stato attuale della pagina con la baseline. Se non ci sono differenze, il test è superato.

---

# Esercizio 2: Simulazione di un Fallimento

Per osservare il comportamento di un test di regressione visiva in caso di fallimento, si può introdurre una modifica al DOM prima dell'esecuzione dell'asserzione `toHaveScreenshot()`.

```typescript
// Modifica uno stile per causare un fallimento
await page.evaluate(() => {
  const title = document.querySelector('h1');
  if (title) title.style.color = 'red';
});

// Questa asserzione ora fallirà
await expect(page).toHaveScreenshot('homepage.png');
```

---

# Esercizio 2: Analisi del Risultato

**In caso di fallimento:**
1.  Playwright segnala l'errore nel report.
2.  Nella directory `test-results`, vengono salvate tre immagini:
    *   `homepage-expected.png`: Lo screenshot di baseline.
    *   `homepage-actual.png`: Lo screenshot attuale che ha causato il fallimento.
    *   `homepage-diff.png`: Un'immagine che evidenzia in rosso le differenze tra le due versioni.

Questo strumento permette di identificare rapidamente e con precisione qualsiasi regressione visiva.

---

# Esercizio 3: Ottimizzazione del Login


Un approccio comune, ma inefficiente, consiste nell'eseguire il login tramite UI prima di ogni test.

```typescript
test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    /* ... */
    await expect(page.locator('#userGreeting')).toBeVisible();
  });

  test('dovrebbe mostrare il nome utente', async ({ page }) => {
    /* ... */
  });
  test('dovrebbe mostrare lo storico ordini', async ({ page }) => {
    /* ... */
  });
});
```

<!--
**Svantaggi:**
- **Lentezza**: Se un login via UI richiede 5 secondi, 10 test richiederanno **50 secondi** solo per l'autenticazione.
- **Fragilità**: Qualsiasi modifica alla UI di login può rompere l'intera suite di test.
-->

---

# Esercizio 3: La Soluzione - Setup Project


```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Attendi che la pagina dopo il login sia caricata
  await expect(page.locator('#userGreeting')).toBeVisible();

  // Salva lo stato di autenticazione nel file specificato
  await page.context().storageState({ path: authFile });
});
```

<!--
La soluzione di Playwright è usare un **progetto di setup** che viene eseguito una sola volta.

**Passo 1: Creare il file di setup**
Questo file esegue il login (preferibilmente via API per la massima velocità) e salva lo stato di autenticazione (cookie, local storage) in un file.
-->

---

# Esercizio 3: La Soluzione - Passo 2, la Configurazione


```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    // 1. Progetto per il setup
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2. Progetto di test principale
    {
      name: 'chromium',
      use: {
        // Usa lo stato di autenticazione salvato dal setup
        storageState: 'playwright/.auth/user.json',
      },
      // Dipende dal completamento del progetto 'setup'
      dependencies: ['setup'],
    },
  ],
});
```
---

# Esercizio 3: Passo 3, Semplificare i test

I test ora possono partire dal presupposto di essere già autenticati.


```typescript
// tests/my-tests.spec.ts
import { test, expect } from '@playwright/test';

// Non c'è più bisogno di test.describe o beforeEach per il login!
test('dovrebbe mostrare il nome utente', async ({ page }) => {
  await page.goto('/'); // Va alla homepage, ma è già loggato
  await expect(page.locator('#userGreeting')).toBeVisible();
});
```

<!--
**Passo 2: Aggiornare `playwright.config.ts`**
Si definiscono due progetti: `setup` e il progetto principale che dipende da esso.
-->

---

# Esercizio 3: Risultati e Vantaggi


### Vantaggi Chiave
- **Velocità Drastica**: Il tempo di esecuzione della suite di test viene ridotto in modo significativo.
- **Affidabilità**: Il setup è isolato e meno soggetto a fallimenti legati alla UI.
- **Riutilizzo**: Lo stato di autenticazione può essere condiviso tra più progetti di test.
- **Separazione delle Responsabilità**: La logica di autenticazione è separata dalla logica di test.

<!--
### Confronto Prestazionale

| Approccio | Tempo per 1 Test | Tempo per 10 Test |
| :--- | :--- | :--- |
| **Prima (`beforeEach`)** | ~5 secondi | ~50 secondi |
| **Dopo (`setup project`)** | ~0.5 secondi | ~5 secondi |

*I tempi sono stime. Il login via API nel setup può ridurre il tempo a poche centinaia di millisecondi.*
-->

---

# Esercizio 4: Isolamento dei Test con le Fixture

L'**isolamento dei test** è un principio fondamentale per garantire test affidabili e non "flaky". Ogni test dovrebbe essere eseguito in un ambiente controllato e indipendente, senza essere influenzato dai risultati dei test precedenti.

Le **Fixture Personalizzate** di Playwright permettono di definire e riutilizzare logiche di setup e teardown. Un pattern comune è usare le API per preparare lo stato necessario a un test (es. creare un utente, aggiungere un prodotto) e per pulirlo al termine.

## Obiettivi di apprendimento
- ✅ Creare fixture personalizzate che estendono quelle base di Playwright.
- ✅ Utilizzare le API per le operazioni di setup e teardown.
- ✅ Comprendere i vantaggi dell'isolamento dei test.
- ✅ Applicare il pattern: "usare le API per gestire lo stato, usare la UI per testare il comportamento".

**Scenario:** Creare un prodotto via API e autenticare un utente prima di eseguire un test sulla UI.

<!--
Isolare i test gli uni dagli altri gestendo lo stato dell'applicazione (es. login, dati di test) tramite API, utilizzando le fixture per incapsulare la logica di setup e teardown.
-->

---

# Esercizio 4: Definizione di una Fixture

```typescript
// fixtures/custom.test.ts
import { test as base } from '@playwright/test';

// 1. Definisci i tipi per le tue fixture
type MyFixtures = {
  myFixture: string;
};

// 2. Estendi il test base con le tue fixture
export const test = base.extend<MyFixtures>({
  // 3. Implementa la fixture
  myFixture: async ({}, use) => {
    // Codice di Setup
    const data = 'Hello, World!';
    
    // Fornisci il dato al test
    await use(data);
    
    // Codice di Teardown (opzionale)
  }
});
```

<!--
Una **Fixture** è un servizio o un dato fornito a un test. Playwright fornisce fixture di base come `page` e `request`. È possibile estenderle per creare un ambiente di test personalizzato.

**Principio di funzionamento:**
- **Setup**: Codice eseguito prima del test (es. creare dati, autenticare un utente).
- **Esecuzione**: Il test viene eseguito utilizzando i dati o i servizi forniti dalla fixture.
- **Teardown**: Codice eseguito dopo il test (es. eliminare i dati creati).
-->

---

# Esercizio 4: Creare una Fixture per i Dati di Test

```typescript
// fixtures/testData.ts
import { test as base, Page } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page; // Una pagina con utente già autenticato
  testProduct: { id: number; name: string; price: number }; // Un prodotto creato appositamente per il test
};

export const test = base.extend<TestFixtures>({
  testProduct: async ({ request }, use) => {
    // SETUP: Crea un prodotto via API
    const productResponse = await request.post('/api/products', {
      data: {
        name: `Test Product ${Date.now()}`,
        description: 'Prodotto creato per il test',
        price: 99.99,
        category: 'electronics',
        stock: 10
      }
    });
    const product = await productResponse.json();

    // Passa il prodotto al test
    await use(product);

    // TEARDOWN: Pulisce i dati creati via API
    await request.delete(`/api/products/${product.id}`);
  },
  
  // Esempio di un'altra fixture per l'autenticazione
  authenticatedPage: async ({ page, request }, use) => {
    // Logica di autenticazione via API per ottenere una sessione...
    await use(page); // ...e fornire la pagina già autenticata al test
  }
});
```

---

# Esercizio 4: Utilizzo delle Fixture nel Test

```typescript
// tests/cart.spec.ts
import { test } from '../fixtures/testData';
import { expect } from '@playwright/test';

test('Aggiunta di un prodotto al carrello', async ({ page, testProduct }) => {
  // La fixture `testProduct` ha già creato il prodotto via API

  await page.goto('/');

  // Il test interagisce con la UI usando i dati della fixture
  await page
    .getByTestId(`add-to-cart-${testProduct.id}`)
    .click();

  // il resto del test...
  await expect(page.locator('#cartBadge')).toHaveText('1');

  // Il teardown nella fixture eliminerà automaticamente il prodotto
});
```

<!--
**Vantaggi di questo approccio:**
- **Velocità**: Il setup via API è ordini di grandezza più rapido rispetto all'interazione con la UI.
- **Affidabilità**: Elimina la fragilità legata a cambiamenti nella UI di login o di creazione dati.
- **Isolamento**: Ogni test opera su dati propri, consentendo l'esecuzione parallela senza conflitti.
- **Manutenibilità**: La logica di setup/teardown è centralizzata e riutilizzabile.
-->

---

# Esercizio 5: Test di Accessibilità (a11y)

## Concetto
L'accessibilità (a11y) garantisce che le applicazioni web siano utilizzabili da persone con disabilità. La libreria **axe-core** è lo standard de-facto per l'automazione dei test di accessibilità. Integrata con Playwright, permette di analizzare una pagina e riportare non conformità rispetto a un set di regole WCAG.

## Obiettivi di apprendimento
- ✅ Integrare `axe-core` in un progetto Playwright.
- ✅ Eseguire una scansione di accessibilità su una pagina.
- ✅ Analizzare il report delle violazioni (impatto, elementi coinvolti, suggerimenti per la risoluzione).
- ✅ Comprendere l'importanza di includere l'accessibilità nel processo di qualità.

**Scenario**: Analisi dell'accessibilità della homepage di TechStore.

<!--
## Obiettivo
Integrare test automatici di accessibilità per identificare violazioni delle linee guida WCAG (Web Content Accessibility Guidelines) direttamente nella pipeline di testing.
-->

---

# Esercizio 5: Implementazione

```bash
# 1. Installa la libreria di integrazione
npm install -D @axe-core/playwright
```

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Verifica accessibilità della homepage', async ({ page }) => {
  await page.goto('/');

  // Attende il caricamento completo della UI
  await page.waitForSelector('[data-testid^="product-"]');

  // Esegue l'analisi con axe-core
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Verifica che non ci siano violazioni
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

# Esercizio 5: Analisi dell'Output

Se il test fallisce, l'asserzione `toEqual([])` riporterà un output dettagliato per ogni violazione trovata, includendo:

-   `id`: L'identificativo della regola violata (es. `color-contrast`).
-   `impact`: La gravità del problema (es. `serious`, `moderate`).
-   `description`: Una spiegazione del problema.
-   `helpUrl`: Un link alla documentazione di Deque University con dettagli e tecniche di risoluzione.
-   `nodes`: Un elenco degli elementi del DOM che presentano il problema.

**Esempio di output per una violazione:**
```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/color-contrast",
  "nodes": [
    { "target": ["#some-low-contrast-element"] }
  ]
}
```

Questo report fornisce agli sviluppatori tutte le informazioni necessarie per identificare e correggere i problemi di accessibilità.

---

# Riepilogo del Workshop

**Argomenti trattati:**

1.  **Generazione Automatica di Test**: Utilizzo di Codegen e UI Mode per accelerare la creazione di test.
2.  **Visual Regression Testing**: Verifica dell'integrità visiva tramite confronto di screenshot.
3.  **Locator Semantici**: Scrittura di test robusti e manutenibili.
4.  **Isolamento dei Test**: Gestione dello stato tramite API e fixture per test affidabili.
5.  **Test di Accessibilità**: Integrazione di controlli automatici di accessibilità con `axe-core`.

**Principio guida**: Automatizzare non solo il "cosa" fa l'applicazione, ma anche il "come" appare e quanto è accessibile.
