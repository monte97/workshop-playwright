---
layout: center
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