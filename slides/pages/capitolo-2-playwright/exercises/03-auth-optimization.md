---
layout: center
---

# Esercizio 3: Ottimizzazione del Login

<div class="text-left">

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

</div>

<!--
Di quanto visto fino ad ora cosa vi puzza? a me personalmente pare noioso dovere fare rupetutamente login per ogni test, anche perché sono azioni che devono essere ripetute per ogni esecuzione, causando un aumento nei tempi di esecuzione dei test.

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

<!--
Il nostro scopo è fare il login una sola volta e vedere i nostri funzionare comunque. 

Per fare questo playwright mette a disposizione il concetto di "setup" ovvero una funzione che viene  eseguita per preparare l'ambiente.

In questo caso, viene sfruttutata insieme alla possibilità di memorizzare

OVVIAMENTE fate attenzione al file, NON deve essere committato su git! usate gitignore.

In questo modo, i nostri test partiranno con un browser già loggato
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

<!--
Adesso che abbiamo a disposizioneun file di setup dobbiamo _configurare_ playwright per usarlo in modo trasparente.
-->

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
Attenzione!

il setup prepara il contesto di autenticazione ma l'esecuzione NON prosegue da dove si era interrotto il test.

perché questo? perché lo scopo di setup è quello di rendere possibile il riuso della procedura, non posso assumere di essere in una pagina specifica se i test devono essere totalmente indipendenti.
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