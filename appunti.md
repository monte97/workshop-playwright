# Materiali

# VSCode integration

Essenzialmente, cosa consente di fare? perché la dovrei installare?

posso fare le stesse cose che farei tramite cli ma con una interfaccia molto più friendly. tutte le interazioni principali sono coperte

[Get Started with Playwright and VS Code (2025 edition)](https://www.youtube.com/watch?v=WvsLGZnHmzw)

- carino fare vedere come si installa, usa e quali sono le opzioni principali
    - mostrare broweser
    - tracing
        - uso del tracing
        
        [Trace viewer | Playwright](https://playwright.dev/docs/trace-viewer-intro)
        

# Funzionalità

## codegen

[Use Playwright codegen to create new Checkly browser checks in minutes](https://www.youtube.com/watch?v=XbWVPnY7n7k)

- interessante la demo perché mostra come usare codegen, il caso d’uso è quello del syntetic monitoring ma si capisce bene

[The FASTEST Way To Generate Playwright Tests](https://www.youtube.com/watch?v=zfqarh3MOzI)

Bell’esempio di come un workflow di utilizzo

## trace-viewer

[Trace viewer | Playwright](https://playwright.dev/docs/trace-viewer-intro)

- demo trace: nella parte alta possiamo vedere la scansione temporale delle azioni e per ognuna di esse, vedere anche lo screenshot
- actions: a sx abbiamo un elenco delle azioni che si sono verificate, con tanto di immagine. contestualmente possiamo aprire il dom ed ispazionare
- metadata: mostra informazioni sull’esecuzione del test
- parte bassa (cose più interessante)
    - locator: possiamo interagire con al schermata per determinare dei nuovi locatori. eventuali modifiche sono riportate direttamente, inoltre possiamo copiare quanto scritto per usarlo nei test
    - network: mostra la parte di comunicazione di rete, evidenzia anche nella timeline quando sono avvenute

# Fixtures

[Fixtures | Playwright](https://playwright.dev/docs/test-fixtures)

Consentono di stabilire l’ambiente di esecuzione per ogni test e consentono anche di raggruppare i test sulla base del loro significato piuttosto che per la loro configurazione. Consentono quindi di definire setup e teradown automatici e riusabili.

Le fixture vengono eseguite ogni volta che le si usa

```jsx
// fixture/cart.ts
export const test = base.extend({
  pageWithCart: async ({ page }, use) => {
    // Setup: aggiungi 3 prodotti al carrello
    await page.goto('/shop');
    await page.click('[data-product="laptop"]');
    await page.click('Add to Cart');
    
    await page.click('[data-product="mouse"]');
    await page.click('Add to Cart');
    
    await page.click('[data-product="keyboard"]');
    await page.click('Add to Cart');
    
    // Vai al carrello
    await page.goto('/cart');
    
    // Passa la pagina al test
    await use(page);
    
    // Teardown: svuota carrello
    await page.click('Clear Cart');
  }
});

export { expect } from '@playwright/test';
```

qui ho definito la `pageWithCart` per precaricare degli elementi nel carrelo

```jsx
import { test, expect } from './fixtures/cart';

test('can apply coupon', async ({ pageWithCart }) => {
  // Carrello già pieno con 3 prodotti
  await pageWithCart.fill('coupon', 'SAVE10');
  await expect(pageWithCart.locator('.discount')).toContainText('-10%');
});

test('can checkout', async ({ pageWithCart }) => {
  // Carrello già pieno, nuovo setup per questo test
  await pageWithCart.click('Checkout');
  await expect(pageWithCart).toHaveURL('/payment');
});

test('can remove item', async ({ pageWithCart }) => {
  // Carrello già pieno di nuovo
  await pageWithCart.click('[data-remove="laptop"]');
  const count = await pageWithCart.locator('[data-cart-count]').textContent();
  expect(count).toBe('2');
});
```

Qui invece le uso in modo diretto, ho già dei prodotti nel carrello al momento dell’utilizzo

[Playwright Fixtures: How They Actually Work (Simpy Explained)](https://www.youtube.com/watch?v=EO2WufLMuh0)

begli esempi, spiega bene che cosa sono le fixture e come usare

[3 Reasons Why You Should Use Custom Playwright Fixtures](https://www.youtube.com/watch?v=wXHiq9H3MB0)

- ha delle grafiche molto belle che spiegano le cose

# Agents

[Why Do You Need (or NOT) the Playwright MCP Server.](https://www.youtube.com/watch?v=FGwtDhjnBMc)

Mostra come installare e configurare MCP su visual studio code. mostra come dato un prompt

[Playwright Testing Agents: under the hood](https://www.youtube.com/watch?v=HLegcP8qxVY&t=385s&pp=0gcJCQMKAYcqIYzv)

[[LAB]: How to Heal Failing Playwright Tests Automatically with the Healer Agent](https://www.youtube.com/watch?v=PKZsdyAuuPc&pp=0gcJCQMKAYcqIYzv)

# Authorization

[Authentication | Playwright](https://playwright.dev/docs/auth)

[How to Speed up your Playwright Tests with shared "storageState"](https://www.youtube.com/watch?v=nSHPCLUwwVk&t=123s)

- ogni test che ripete la login è estremamente inefficiente, per ogni test potrebbe portare via 4/5 secondi → serve un modo per fare login una sola volta per tutto il blocco di test e riusare la configurazione
- playwright consente di salvare lo stato di autenticazione e di riusarlo tra i test
    - aggiorna il gitignore!
    
    ```jsx
    // Una volta - salva lo stato dopo il login
    await page.goto('https://example.com/login');
    await page.fill('[name="username"]', 'user');
    await page.fill('[name="password"]', 'pass');
    await page.click('button[type="submit"]');
    await page.context().storageState({ path: 'auth.json' });
    
    // Nei test - riusa lo stato
    const context = await browser.newContext({ storageState: 'auth.json' });
    ```
    

## Come lo faccio?

`tests/auth.setup.ts`

```jsx
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Eseguire i passaggi di autenticazione
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Attendere che i cookie siano impostati
  await page.waitForURL('https://github.com/');
  
  // Verificare che l'autenticazione sia avvenuta
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // Salvare lo stato autenticato
  await page.context().storageState({ path: authFile });
});
```

dentro il `setpu` definisco tutti gli step hce devo compiere per autenticarmi, li posso generare anche tramite codegen

`playwright.config.ts`

```jsx
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Progetto di setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    // Browser chromium che usa lo stato autenticato
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'  // ← Riutilizza lo stato
      },
      dependencies: ['setup']  // ← Dipende dal progetto setup
    },
    // Browser firefox (stesso stato)
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup']
    }
  ]
});
```

- `dependencies: ['setup']` garantisce che il setup project esegua sempre prima
- `storageState` carica i cookie e sessione salvati
- Ogni browser project riutilizza lo stesso file di stato

`tests/example.spec.ts`

```jsx
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // La pagina è già autenticata!
  // Puoi iniziare direttamente dal tuo flusso di test
});
```

- i singoli test sono già autenticati, la configurazione di playwright si è occupata già di autenticare e injectare l’autenticazione nel nuovo contesto che esegue i test

### Progetti multipli con setup diversi

si, posso definire setup diversi e usarli in progetti diversi

- definire un file di setup diverso per ogni utente (eg: `tests/auth.admin.setup.ts` e `tests/auth.user.setup.ts`)
    - importante che ogni seutp salvi le credenziali in un file separato
- configurare playwright
    - come prima, definire i progetti di test oltre a quelli “normali”
    - definire le dipendenze
        - se un test dipende dall’autenticazione “admin”, allora deve dipendere da lei; non è necessario che dipenda anche da quella utente
    - come prima, devo definire lo storage che contiene l’autenticazione
        - da qui l’importanza di avere storage diversi per utenti diversi menzionati prima
- esempio organizzazione folder
    
    ```jsx
    tests/
      ├── admin/
      │   ├── settings.spec.ts
      │   ├── users.spec.ts
      │   └── reports.spec.ts
      ├── user/
      │   ├── dashboard.spec.ts
      │   ├── profile.spec.ts
      │   └── notifications.spec.ts
      ├── auth.admin.setup.ts
      └── auth.user.setup.ts
    ```
    

# Altre tipologie di test

## Test visivi (visual regression testing)

[Visual comparisons | Playwright](https://playwright.dev/docs/test-snapshots)

Abbiamo la possibilità di verificare regressioni visive confrontando l’esecuzione attuale con degli screenshot di riferimento generati durante la prima esecuzione. Lo scopo è verificare l’assenza di cambiamenti visivi inaspettati

si, possono essere rigenerati se c’è bisogno

`npx playwright test --update-snapshot`

```jsx
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot();
});
```

Alla prima esecuzione verrà creato in modo automatico uno screenshot. I nomi dei file vengono assegnati in modo automatico dal engine di esecuzione, in questo modo viene garantito il rispetto delle convenzioni

Abbiamo anche alcune opzioni di configurazione:

- numero massimo di pixel di differenza (sia locale per singolo confronto che globale)
- stylepath: possiamo applicare un foglio di stile personalizzato alla pagina durante lo screenshot
    - in questo modo possiamo filtrare elementi dinamici o volatili, in questo modo manteniamo il determinismo (eg: se abbiamo un carosello che con delle immagini caricate in modo dinamico, non mi interessa andare a vedere il contenuto attuale ma solo la sua posizione
    - anche in questo caso, possibile impostarlo sia a livello locale che globale
- screenshot di componenti specifici
    - possiamo anche catturare *singoli elementi*
    
    ```jsx
    import { test, expect } from '@playwright/test';
    
    test('test component', async ({ page }) => {
      await page.goto('https://playwright.dev');
      
      // Screenshot dell'intera pagina
      await expect(page).toHaveScreenshot();
      
      // Screenshot di un elemento specifico
      await expect(page.locator('.navbar')).toHaveScreenshot('navbar.png');
      
      // Screenshot di una sezione
      await expect(page.locator('main')).toHaveScreenshot('main-content.png');
    });
    ```
    
    in questo caso, ho specificato un nome nello screenshot. Questo comporta l’append di un suffisso al nome determinto da playwright. dato che avremo più file rende facile riconoscere il contenuto
    

## Video demo

Possiamo registrare dei video durante l’esecuzione dei test

Posso definire un insieme di test specifici per cui, oltre a verificare la correttezza, vado anche a generare dei video che poi metterò a disposizione degli utenti