# Enter Playwright 🎭

<div class="grid-cols-2 mt-8">

<div>

### Cos'è Playwright?

**Framework open source di Microsoft** per automazione e testing web

- Nato nel 2020
- Team dietro Puppeteer
- Focus su developer experience
- Cross-browser nativo

```bash
# Setup in 2 minuti
npm init playwright@latest

# Fatto! 🎉
npx playwright test
```

</div>

<div>

### Chi lo Usa?

**Microsoft**
- Bing, VS Code, Teams

**Tech Giants**
- Adobe, Salesforce
- React, Vue, Angular docs

**Adoption**
- 60k+ GitHub stars
- 3M+ weekly downloads
- Community in crescita

</div>

</div>

---

# I 3 Pilastri di Playwright

<div class="grid-cols-3 mt-8">

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

# Prima vs Dopo

<div class="grid-cols-2">

<div>

### ❌ Prima (Selenium)

```js
// Test instabile
const el = await driver.findElement(
  By.id('btn')
);
await driver.sleep(2000);
await el.click();
await driver.sleep(1000);

// Selettori fragili
await driver.findElement(
  By.css('div > span.btn-primary')
);

// Multi-browser complesso
if (browser === 'chrome') { ... }
if (browser === 'firefox') { ... }
```

</div>

<div>

### ✅ Con Playwright

```js
// Auto-waiting: niente sleep!
await page.click('#btn');

// Aspetta automaticamente che sia:
// - visibile, stabile, enabled






// Selettori semantici
await page.getByRole('button',
  { name: 'Submit' }
);

// Multi-browser: stessa API
// Funziona su tutti i browser!
```

</div>

</div>

---

# Auto-Waiting in Dettaglio

### Playwright aspetta automaticamente che l'elemento sia:

<div class="grid-cols-2 mt-8">

<div>

1. **Attached** al DOM
2. **Visible** (non `display: none`)
3. **Stable** (non in animazione)
4. **Enabled** (non `disabled`)
5. **Editable** (se input)

**Tutto questo è automatico!**

</div>

<div>

```js
// Questo codice semplice...
await page.click('button');

// ...fa tutto questo automaticamente:
await driver.wait(
  until.elementLocated(...), 5000
);
await driver.wait(
  until.elementIsVisible(...), 5000
);
await driver.wait(
  until.elementIsEnabled(...), 5000
);
await element.click();
```

</div>

</div>

---

# Selettori Semantici

<div class="grid-cols-2 mt-4">

<div>

### Best Practice Built-in

```js
// Role-based ⭐
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
