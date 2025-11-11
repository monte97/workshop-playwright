# Enter Playwright 🎭

<div class="grid grid-cols-2 gap-8 mt-4">

<div><h3>Cos'è?</h3>

Framework open source di **Microsoft** per automazione e testing web

```bash
# Setup
npm init playwright@latest

# utilizzo
npx playwright test
```


</div>

<div><h3>Chi lo usa? Ci sono alternative?</h3>

  ![Star](./star-history-20251111.png)
</div>

</div>


---

# I 3 Pilastri di Playwright

<div class="grid grid-cols-3 mt-8">

<div class="card">

### <span class="emoji-medium">🎯</span> Affidabilità

**Auto-waiting**
- Aspetta visibilità
- Aspetta stabilità
- Aspetta interattività

**Web-first assertions**
- Retry automatico
- Niente flaky test

</div>

<div class="card">

### <span class="emoji-medium">⚡</span> Velocità

**Parallelizzazione**
- Worker multipli
- Test isolati
- Context separati

**Performance**
- WebSocket diretto
- Fast by default

</div>

<div class="card">

### <span class="emoji-medium">🎨</span> Semplicità

**Multi-Browser**
- Una sola API
- Chromium, Firefox, WebKit

**Developer Experience**
- Setup veloce
- Tooling eccezionale
- Debug intuitivo

</div>

</div>


---

# Auto-Waiting


<div class="grid grid-cols-3 gap-8 mt-8">

<div class="col-span-2">

```js
import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Get started' }).click();

  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

</div>

<div>

- Controlli automatici:
  - Univocità del selettore
  - Elemento visibile 
  - Elemento stabile (no animazioni)
  - Non coperto da altri elementi
  - NON disabilitato

</div>



</div>

---

# Selettori Semantici

<div class="grid grid-cols-2 mt-4">

<div>

### Best Practice Built-in

```js
// Role-based
await page.getByRole('button',
  { name: 'Invia' });

// Label
await page.getByLabel('Email');

// Placeholder
await page.getByPlaceholder('Cerca...');

// Text
await page.getByText('Login');
```

</div>

<div>

### Vantaggi

**Resilienti**
- Non si rompono con refactoring CSS

**Semantici**
- Leggibili e comprensibili

**Accessibili**
- Seguono best practice a11y

**Stabili**
- Test ID per elementi dinamici

</div>

</div>
