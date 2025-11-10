# Concetti Avanzati

<SectionTitle title="05" />

---

# Parallelizzazione

<div class="grid grid-cols-2 gap-6">

<div>

## ⚡ Config

```js
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
});
```

**Performance**:
```bash
# workers=1: ~5min
# workers=4: ~1min
```

**4x più veloce!** 🚀

</div>

<div>

## 🔒 Modalità

```js
// Parallelo
test.describe.configure({
  mode: 'parallel'
});

// Sequenziale
test.describe.configure({
  mode: 'serial'
});
```

Context isolati per worker

</div>

</div>

---

# Sharding

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Test Sharding

```bash
# Dividi in 4 shard
npx playwright test --shard=1/4
npx playwright test --shard=2/4
```

**GitHub Actions**:
```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npx playwright test
      --shard=${{ matrix.shard }}/4
```

</div>

<div>

## 📊 Vantaggi

**Scalabilità**:
- Distribuisci su più macchine
- Suite grandi più veloci

**Esempio**:
- 1000 test: 30min (1 macchina)
- 4 shard: ~8min (4 macchine)
- 10 shard: ~3min (10 macchine)

Bilanciamento automatico!

</div>

</div>

---

# Mobile Testing: iOS e Android

<div class="grid grid-cols-2 gap-6">

<div>

## 📱 Device Emulation

```js
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] },
    },
  ],
});
```

<div v-click class="mt-4 text-sm">

**Device properties**:
- Viewport size
- User agent
- Touch support
- Pixel ratio
- Geolocation

</div>

</div>

<div>

## 🎮 Test Mobile-Specific

```js
test('mobile menu', async ({ page }) => {
  // Simula touch
  await page.tap('#menu-button');

  // Swipe gesture
  await page.locator('.carousel').tap();
  await page.mouse.move(100, 200);
  await page.mouse.down();
  await page.mouse.move(300, 200);
  await page.mouse.up();

  // Pinch zoom
  await page.touchscreen.tap(100, 100);

  // Orientamento
  await page.evaluate(() => {
    screen.orientation.lock('landscape');
  });
});
```

<div v-click class="mt-4 text-sm">

```js
// Geolocation
await context.setGeolocation({
  latitude: 41.9028,
  longitude: 12.4964
});
await context.grantPermissions(['geolocation']);
```

</div>

</div>

</div>

---

# Test Mobile: Best Practices

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

## ✅ Do's

**Viewport Testing**
```js
test.describe('Responsive', () => {
  test('mobile portrait', async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 667
    });
    // Test mobile layout
  });

  test('tablet landscape', async ({ page }) => {
    await page.setViewportSize({
      width: 1024,
      height: 768
    });
    // Test tablet layout
  });
});
```

**Touch Events**
```js
// Usa tap invece di click
await page.tap('.button');

// Testa gesture
await page.locator('.slider')
  .dragTo(page.locator('.target'));
```

</div>

<div>

## 🎯 Casi d'Uso

**Hamburger Menu**
```js
test('mobile navigation', async ({ page }) => {
  // Desktop: menu visible
  await expect(page.getByRole('navigation'))
    .toBeVisible();

  // Mobile: hamburger
  await page.setViewportSize({
    width: 375,
    height: 667
  });

  await expect(
    page.getByRole('button', { name: 'Menu' })
  ).toBeVisible();

  await page.tap('[aria-label="Menu"]');

  await expect(page.getByRole('navigation'))
    .toBeVisible();
});
```

**PWA Features**
```js
// Service Worker
await page.evaluate(() =>
  navigator.serviceWorker.ready
);

// Offline mode
await context.setOffline(true);
await page.reload();
await expect(page.getByText('Offline'))
  .toBeVisible();
```

</div>

</div>

---

# CI/CD: GitHub Actions

<div class="text-xs">

**Workflow Base**:

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20 }
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

**Con Sharding (4 worker paralleli)**:

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npx playwright test --shard=${{ matrix.shard }}/4
```

</div>

---

# CI/CD: Altre Piattaforme

<div class="grid grid-cols-2 gap-6 text-xs">

<div>

## 🦊 GitLab CI

```yaml
stages: [test]

playwright-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths: [playwright-report/]
```

## 🐳 Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]
```

</div>

<div>

## 🔵 Azure Pipelines

```yaml
trigger: [main]
pool: { vmImage: ubuntu-latest }

steps:
- task: NodeTool@0
  inputs: { versionSpec: '20.x' }
- script: npm ci
- script: npx playwright install --with-deps
- script: npx playwright test
- task: PublishPipelineArtifact@1
  condition: always()
  inputs:
    targetPath: playwright-report
    artifactName: report
```

</div>

</div>


---

# Component Testing (Preview)

<div class="grid grid-cols-2 gap-6">

<div>

## 🧩 Test Componenti React

```jsx
// Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import Button from './Button';

test('renders button', async ({ mount }) => {
  const component = await mount(
    <Button onClick={() => {}}>
      Click me
    </Button>
  );

  await expect(component).toContainText('Click me');
});

test('handles click', async ({ mount }) => {
  let clicked = false;

  const component = await mount(
    <Button onClick={() => clicked = true}>
      Click
    </Button>
  );

  await component.click();
  expect(clicked).toBe(true);
});

test('disabled state', async ({ mount }) => {
  const component = await mount(
    <Button disabled>Disabled</Button>
  );

  await expect(component).toBeDisabled();
});
```

</div>

<div>

## ⚡ Setup Component Testing

```bash
# Install
npm init playwright@latest -- --ct

# Config playwright-ct.config.ts
export default defineConfig({
  testDir: './tests/component',
  use: {
    ctPort: 3100,
  },
});
```

<div v-click class="mt-4 text-sm">

**Vantaggi**:
- ✅ Test isolati
- 🎯 Browser reale
- ⚡ Veloce
- 🔄 Hot reload

**Supporto**:
- React
- Vue
- Svelte
- Solid

</div>

<div v-click class="mt-4 p-3 bg-green-500 bg-opacity-10 rounded text-xs">

**Alternativa a**: React Testing Library, Vue Test Utils

**Quando usare**: Componenti complessi con interazioni browser

</div>

</div>

</div>

---

# API Testing

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## 🌐 Request Context

```js
import { test, expect } from '@playwright/test';

test('GET products', async ({ request }) => {
  const response = await request.get(
    'https://api.example.com/products'
  );

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const products = await response.json();
  expect(products).toHaveLength(10);
  expect(products[0]).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    price: expect.any(Number),
  });
});

test('POST create product', async ({ request }) => {
  const response = await request.post(
    'https://api.example.com/products',
    {
      data: {
        name: 'New Product',
        price: 99.99
      }
    }
  );

  expect(response.status()).toBe(201);

  const product = await response.json();
  expect(product.id).toBeDefined();
  expect(product.name).toBe('New Product');
});
```

</div>

<div>

## 🔐 Authentication

```js
// Setup globale
test.use({
  extraHTTPHeaders: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
});

test('authenticated request', async ({ request }) => {
  const response = await request.get('/api/user/profile');
  expect(response.ok()).toBeTruthy();
});

// Fixture per auth
export const test = base.extend({
  authenticatedRequest: async ({ request }, use) => {
    // Login
    const loginResponse = await request.post('/api/login', {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });

    const { token } = await loginResponse.json();

    // Request con token
    const authenticatedRequest = request;
    await authenticatedRequest.setExtraHTTPHeaders({
      'Authorization': `Bearer ${token}`
    });

    await use(authenticatedRequest);
  }
});
```

</div>

</div>

---

# Playwright MCP: Claude Integration

<div class="grid grid-cols-2 gap-6">

<div>

## 🤖 MCP Overview

**Model Context Protocol** per AI coding assistants

**Playwright MCP Server** permette a Claude di:
- 🎯 Navigare pagine web
- 🔍 Ispezionare elementi
- 📸 Catturare screenshot
- 🖱️ Interagire con UI
- ✅ Validare comportamenti

<div v-click class="mt-4">

**Installazione**:
```bash
# NPX (globale)
npx @playwright/mcp

# NPM install
npm install -g @playwright/mcp
```

</div>

</div>

<div>

## 🎯 Use Cases

<v-clicks>

**1. Debugging Assistito**
- Claude analizza pagina
- Suggerisce selettori
- Genera test code

**2. Test Generation**
- Descrivi scenario in linguaggio naturale
- Claude genera test completo
- Con assertions e best practices

**3. Visual Analysis**
- Screenshot analysis
- Layout issues detection
- Accessibility checks

**4. Quick Exploration**
- Ispeziona siti senza codice
- Analizza struttura DOM
- Estrai dati

</v-clicks>

</div>

</div>

---

# MCP: Demo Pratica

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

## 💬 Esempio Interazione

**User**: "Crea un test che fa login su example.com, va al profilo e verifica che il nome sia 'Mario Rossi'"

**Claude con MCP**:
1. Naviga a example.com
2. Ispeziona form login
3. Identifica selettori
4. Genera test:

```js
test('verifica profilo utente', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('Email')
    .fill('mario@example.com');
  await page.getByLabel('Password')
    .fill('password');

  await page.getByRole('button', { name: 'Login' })
    .click();

  await page.waitForURL(/profile/);

  await expect(page.getByText('Mario Rossi'))
    .toBeVisible();
});
```

</div>

<div>

## 🚀 Comandi MCP

```bash
# Avvia server MCP
playwright-mcp

# Claude può ora:
# - page.goto(url)
# - page.screenshot()
# - page.locator(selector)
# - page.click(selector)
# - page.fill(selector, value)
# - page.getByRole()
# - page.content()
```

<div v-click class="mt-4">

**Workflow Consigliato**:
1. Usa MCP per esplorare
2. Genera bozza test
3. Raffina e ottimizza
4. Aggiungi a suite

</div>

<div v-click class="mt-4 p-3 bg-purple-500 bg-opacity-10 rounded text-xs">

**Nota**: MCP è in preview, syntax può cambiare

Docs: https://playwright.dev/docs/mcp

</div>

</div>

</div>

---

# Authentication Patterns

<div class="text-xs">

**Salvare stato auth con global setup**:

```js
// global-setup.ts
import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://example.com/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/);

  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}
export default globalSetup;
```

**Configurazione**:
```js
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: { storageState: 'auth.json' }
});
```

**Tutti i test sono ora autenticati automaticamente!** ⚡

</div>

---

# Auth: Setup Projects Multipli

<div class="grid grid-cols-2 gap-6 text-xs">

<div>

## 👥 Utenti Diversi, Setup Diversi

**Scenario**: Test per admin e user normale

```bash
tests/
├── auth.admin.setup.ts   # Login admin
├── auth.user.setup.ts    # Login user
├── admin/
│   ├── settings.spec.ts
│   ├── users.spec.ts
│   └── reports.spec.ts
└── user/
    ├── dashboard.spec.ts
    ├── profile.spec.ts
    └── notifications.spec.ts
```

**auth.admin.setup.ts**:
```js
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email')
    .fill('admin@example.com');
  await page.getByLabel('Password')
    .fill('admin123');
  await page.getByRole('button', { name: 'Sign in' })
    .click();

  await page.waitForURL('/admin/dashboard');

  await page.context().storageState({ path: authFile });
});
```

</div>

<div>

## ⚙️ Config con Progetti

```js
// playwright.config.ts
export default defineConfig({
  projects: [
    // Setup projects
    {
      name: 'setup-admin',
      testMatch: /.*\.admin\.setup\.ts/
    },
    {
      name: 'setup-user',
      testMatch: /.*\.user\.setup\.ts/
    },

    // Test projects con auth admin
    {
      name: 'admin-tests',
      testMatch: /admin\/.*\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/admin.json'
      },
      dependencies: ['setup-admin']
    },

    // Test projects con auth user
    {
      name: 'user-tests',
      testMatch: /user\/.*\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup-user']
    }
  ]
});
```

</div>

</div>

---

# Auth: Vantaggi Multi-Project

<div class="grid grid-cols-2 gap-8">

<div>

## ✅ Benefici

<v-clicks>

**1. Isolamento Ruoli**
```js
// Admin tests
test('admin can manage users', async ({ page }) => {
  // Già loggato come admin!
  await page.goto('/admin/users');
  await expect(page.getByText('User Management'))
    .toBeVisible();
});

// User tests
test('user sees dashboard', async ({ page }) => {
  // Già loggato come user normale!
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome back'))
    .toBeVisible();
});
```

**2. Efficienza**
- Login 1 volta per setup
- Riuso per tutti i test
- Velocità massima

**3. Manutenzione**
- Setup separati
- Cambio credenziali facile
- Clear separation

</v-clicks>

</div>

<div>

## 🎯 Esecuzione

```bash
# Tutti i progetti
npx playwright test

# Solo admin tests
npx playwright test --project=admin-tests

# Solo user tests
npx playwright test --project=user-tests

# Setup viene eseguito automaticamente!
```

<v-click>

**Output**:
```bash
Running 3 projects

[setup-admin] › auth.admin.setup.ts
  ✓ authenticate as admin (2s)

[admin-tests] › admin/users.spec.ts
  ✓ admin can manage users (1s)
  ✓ admin can delete users (1s)

[setup-user] › auth.user.setup.ts
  ✓ authenticate as user (2s)

[user-tests] › user/dashboard.spec.ts
  ✓ user sees dashboard (1s)

  5 passed (7s)
```

</v-click>

</div>

</div>

---

# Auth: Best Practices

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## ✅ Do's

<v-clicks>

**Aggiorna .gitignore**
```bash
# Non committare stati auth!
playwright/.auth/
*.json
```

**Verifica auth nel setup**
```js
setup('authenticate', async ({ page }) => {
  // Login...

  // ✅ Verifica login success
  await expect(page.getByRole('button',
    { name: 'Logout' }
  )).toBeVisible();

  // Salva stato
  await page.context().storageState({ path });
});
```

**Usa environment variables**
```js
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;
```

</v-clicks>

</div>

<div>

## ❌ Don'ts

<v-clicks>

**Non hard-code credenziali**
```js
// ❌ Male
await page.fill('email', 'admin@example.com');
await page.fill('password', 'supersecret123');

// ✅ Bene
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
await page.fill('email', ADMIN_EMAIL);
await page.fill('password', ADMIN_PASSWORD);
```

**Non skip verifica**
```js
// ❌ Male - non verifica
await page.click('Login');
await page.context().storageState({ path });

// ✅ Bene - verifica prima
await page.click('Login');
await page.waitForURL(/dashboard/);
await expect(page.getByText('Welcome'))
  .toBeVisible();
await page.context().storageState({ path });
```

</v-clicks>

</div>

</div>

---

# Performance Testing

<div class="text-xs">

**Web Vitals**:

```js
test('page load performance', async ({ page }) => {
  await page.goto('/');

  const fcp = await page.evaluate(() =>
    performance.getEntriesByName('first-contentful-paint')[0]?.startTime
  );

  expect(fcp).toBeLessThan(1800); // < 1.8s
});
```

**Bundle Size Check**:

```js
test('bundle size', async ({ page }) => {
  const resources = [];
  page.on('response', response => {
    resources.push({
      type: response.request().resourceType(),
      size: parseInt(response.headers()['content-length'] || '0')
    });
  });

  await page.goto('/');

  const jsSize = resources.filter(r => r.type === 'script')
    .reduce((sum, r) => sum + r.size, 0);

  expect(jsSize).toBeLessThan(500_000); // Max 500KB
});
```

</div>

---

# Accessibility Testing

<div class="text-xs">

**Axe Integration**:

```js
import AxeBuilder from '@axe-core/playwright';

test('accessibility check', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('specific component', async ({ page }) => {
  await page.goto('/form');
  const results = await new AxeBuilder({ page })
    .include('#registration-form')
    .analyze();
  expect(results.violations).toEqual([]);
});
```

**Keyboard Navigation**:

```js
test('keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '/about');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/about/);
});
```

</div>

---

# Video Recording per Demo

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## 🎥 Registra Video per Utenti

**Use Case**: Creare video demo/tutorial

```js
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'demo-videos',
      testMatch: /demo\/.*\.spec\.ts/,
      use: {
        video: 'on',  // Sempre registra
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 500  // Rallenta per chiarezza
        }
      }
    }
  ]
});
```

**Test per demo**:
```js
// tests/demo/product-search.spec.ts
test('demo ricerca prodotto', async ({ page }) => {
  await page.goto('/');

  // Azioni deliberate per demo
  await page.getByPlaceholder('Cerca...')
    .fill('laptop');

  await page.waitForTimeout(1000); // Pausa visiva

  await page.getByRole('button', { name: 'Cerca' })
    .click();

  await page.waitForTimeout(500);

  await expect(page.getByText('Risultati per'))
    .toBeVisible();
});
```

</div>

<div>

## 🎬 Configurazione Video

**Opzioni avanzate**:
```js
use: {
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 },
    // Salva in cartella specifica
    dir: './demo-videos'
  },

  // Rallenta per chiarezza
  launchOptions: {
    slowMo: 500  // 500ms tra azioni
  },

  // Viewport desktop standard
  viewport: { width: 1920, height: 1080 },

  // Device specifico
  ...devices['Desktop Chrome']
}
```

<v-click>

**Post-processing**:
```js
test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'passed') {
    // Rinomina video per uso demo
    const video = await testInfo.attachments
      .find(a => a.name === 'video')?.path;

    if (video) {
      fs.renameSync(
        video,
        `./demo-videos/${testInfo.title}.webm`
      );
    }
  }
});
```

</v-click>

</div>

</div>

---

# Video Demo: Best Practices

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

## ✅ Tips per Video Demo

<v-clicks>

**1. Velocità Appropriata**
```js
// Rallenta per chiarezza
launchOptions: { slowMo: 500 }

// Pause tra azioni critiche
await page.click('button');
await page.waitForTimeout(800);
```

**2. Viewport Consistente**
```js
// Usa dimensioni standard
viewport: {
  width: 1920,
  height: 1080
}
// Risultato pulito e professionale
```

**3. Dati Significativi**
```js
// Usa dati demo realistici
await page.fill('name', 'Mario Rossi');
await page.fill('email', 'mario@example.com');
// Non: 'test123', 'aaa@aaa.com'
```

</v-clicks>

</div>

<div>

## 🎯 Workflow Consigliato

<v-clicks>

1. **Crea suite demo separata**
   ```bash
   tests/demo/
   ├── 01-signup.spec.ts
   ├── 02-login.spec.ts
   ├── 03-search.spec.ts
   └── 04-checkout.spec.ts
   ```

2. **Esegui con config specifica**
   ```bash
   npx playwright test \
     --project=demo-videos \
     tests/demo/
   ```

3. **Video generati automaticamente**
   ```
   demo-videos/
   ├── 01-signup.webm
   ├── 02-login.webm
   ├── 03-search.webm
   └── 04-checkout.webm
   ```

4. **Usa per:**
   - Onboarding utenti
   - Demo commerciali
   - Bug reports
   - Documentation

</v-clicks>

</div>

</div>

---

# Debugging Avanzato

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## 🔍 Strumenti Debug

```js
// 1. Pause esecuzione
await page.pause();

// 2. Screenshot on demand
await page.screenshot({
  path: 'debug.png',
  fullPage: true
});

// 3. Video recording
const context = await browser.newContext({
  recordVideo: { dir: 'videos/' }
});

// 4. Console logs
page.on('console', msg => {
  console.log('Browser:', msg.text());
});

// 5. Network logs
page.on('request', req =>
  console.log('>>', req.method(), req.url())
);
page.on('response', res =>
  console.log('<<', res.status(), res.url())
);

// 6. Page errors
page.on('pageerror', err =>
  console.error('Page error:', err)
);
```

</div>

<div>

## 🎯 Debugging Patterns

```js
// Helper: wait and screenshot
async function debugScreenshot(page, name) {
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `debug-${name}.png`
  });
}

test('debug flow', async ({ page }) => {
  await page.goto('/');
  await debugScreenshot(page, '01-home');

  await page.click('#login');
  await debugScreenshot(page, '02-after-click');

  await page.fill('#email', 'test@test.com');
  await debugScreenshot(page, '03-after-fill');
});

// Conditional breakpoint
test('conditional debug', async ({ page }) => {
  const products = await page.$$('.product');

  for (const [i, product] of products.entries()) {
    const price = await product.$eval(
      '.price',
      el => el.textContent
    );

    // Break se prezzo alto
    if (parseFloat(price) > 1000) {
      await page.pause(); // Debug this one
    }
  }
});
```

</div>

</div>

---

# Recap Avanzato

<div class="grid grid-cols-3 gap-4 text-xs">

<div class="p-3 bg-blue-500 bg-opacity-10 rounded">

### ⚡ Performance
- Parallelizzazione
- Sharding
- Workers
- Timeout optimization

</div>

<div class="p-3 bg-green-500 bg-opacity-10 rounded">

### 📱 Mobile
- Device emulation
- Touch events
- Responsive testing
- PWA features

</div>

<div class="p-3 bg-purple-500 bg-opacity-10 rounded">

### 🔄 CI/CD
- GitHub Actions
- GitLab CI
- Azure Pipelines
- Docker

</div>

<div class="p-3 bg-orange-500 bg-opacity-10 rounded">

### 🧩 Components
- React/Vue/Svelte
- Isolated testing
- Browser-based
- Fast feedback

</div>

<div class="p-3 bg-red-500 bg-opacity-10 rounded">

### 🌐 API Testing
- Request context
- Authentication
- GraphQL support
- E2E + API combo

</div>

<div class="p-3 bg-yellow-500 bg-opacity-10 rounded">

### 🤖 MCP
- Claude integration
- AI-assisted testing
- Visual analysis
- Test generation

</div>

<div class="p-3 bg-pink-500 bg-opacity-10 rounded">

### 🔐 Auth Patterns
- Storage state
- Multiple users
- Session reuse
- Global setup

</div>

<div class="p-3 bg-indigo-500 bg-opacity-10 rounded">

### ⚡ Performance
- Web Vitals
- Bundle size
- Lighthouse
- Network metrics

</div>

<div class="p-3 bg-teal-500 bg-opacity-10 rounded">

### ♿ Accessibility
- Axe integration
- Keyboard nav
- ARIA labels
- WCAG compliance

</div>

</div>

<div class="text-center mt-6">

**Quasi finito!** 🎉

</div>
