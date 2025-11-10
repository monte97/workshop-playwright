# Primo Test

```js
import { test, expect } from '@playwright/test';

test('login con successo', async ({ page }) => {
  // Naviga
  await page.goto('/login');

  // Compila form
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');

  // Submit
  await page.getByRole('button', { name: 'Login' }).click();

  // Verifica
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Benvenuto')).toBeVisible();
});
```

### Features Chiave
- Selettori semantici (`getByLabel`, `getByRole`)
- Auto-waiting (niente `sleep()`)
- Assertions web-first (auto-retry)
- Codice leggibile come istruzioni umane

---

# Eseguire i Test

<div class="grid-cols-2">

<div>

### Comandi Base

```bash
# Tutti i test
npx playwright test

# Test specifico
npx playwright test login.spec.ts

# Per nome
npx playwright test -g "login"

# Browser specifico
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI Mode ⭐
npx playwright test --ui
```

</div>

<div>

### Output

```bash
Running 3 tests using 3 workers

✓ login.spec.ts:3 › login (2s)
✓ signup.spec.ts:5 › signup (3s)
✓ profile.spec.ts:7 › profile (2s)

3 passed (7s)
```

### HTML Reporter

```bash
npx playwright show-report
```

Include:
- Timeline dei test
- Screenshots su failure
- Video recordings
- Trace files

</div>

</div>

---

# Codegen: Genera Test Automaticamente

<div class="grid-cols-2">

<div>

### Come Funziona

```bash
# Avvia Codegen
npx playwright codegen localhost:3000
```

1. Si apre il browser
2. Interagisci con la pagina
3. Codegen genera il codice
4. Copia-incolla nel test

**Usa selettori best-practice automaticamente!**

</div>

<div>

### Codice Generato

```js
// Generato automaticamente!
await page.goto('http://localhost:3000/');

await page.getByRole('link',
  { name: 'Products' }
).click();

await page.getByPlaceholder('Search...')
  .fill('laptop');

await page.getByRole('button',
  { name: 'Search' }
).click();

await page.getByRole('heading',
  { name: 'Laptop Pro' }
).click();
```

</div>

</div>

---

# UI Mode: Il Miglior Modo per Sviluppare

```bash
npx playwright test --ui
```

<div class="mt-8">

### Features

<div class="grid-cols-3">

<div>

**Development**
- Watch mode attivo
- Hot reload
- Run singoli test

</div>

<div>

**Debugging**
- Inspector integrato
- Timeline visuale
- Video playback

</div>

<div>

**Analysis**
- Screenshots step-by-step
- Network tab
- Console logs

</div>

</div>

</div>

---

# Trace Viewer: Debug Avanzato

<div class="grid-cols-2 mt-4">

<div>

### Come Usare

```bash
# Esegui con trace
npx playwright test --trace on

# Visualizza trace
npx playwright show-trace trace.zip
```

**Game changer per debug in CI!**

</div>

<div>

### Cosa Include

- ✅ Ogni azione eseguita
- 📸 Screenshot di ogni step
- 🌐 Richieste network
- 📝 Console logs
- 🎯 DOM snapshot interattivo
- ⏱️ Timing preciso

</div>

</div>
