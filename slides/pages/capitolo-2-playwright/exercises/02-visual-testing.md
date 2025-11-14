---
layout: center
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
import { test, expect } from '@playwright/test';

test('Verifica aspetto homepage TechStore', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Attende il caricamento della griglia
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  // Esegue il confronto dello screenshot
  await expect(page).toHaveScreenshot("homepage.png");
});
```

**Flusso di lavoro:**
1.  **Prima esecuzione**: Playwright genera lo screenshot di baseline (es. `homepage.png`) e lo salva. Il test risulta superato.
2.  **Esecuzioni successive**: Playwright confronta lo stato attuale della pagina con la baseline. Se non ci sono differenze, il test è superato.

---

# Esercizio 2: Simulazione di un Fallimento

Per osservare il comportamento di un test di regressione visiva in caso di fallimento, si può introdurre una modifica al DOM prima dell'esecuzione dell'asserzione `toHaveScreenshot()`.

```typescript
import { test, expect } from '@playwright/test';

test('Simulazione di un fallimento nel test visivo', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('product-1').first()).toBeVisible();

  // Ottengo un riferimento all'elemento
  const heading = page.getByRole('heading', { name: 'Catalogo Prodotti' }).first()

  // applico una funzione per applicare un nuovo stile
  await heading.evaluate(el => el.style.color = "red");

  // Adesso il test dovrebbe fallire perché lo screenshot è diverso
  await expect(page).toHaveScreenshot("homepage.png");
});
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