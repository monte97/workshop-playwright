# Concetti Avanzati

---

# Page Object Model

### Organizza il codice per manutenibilità

<div class="grid-cols-2">

<div>

**pages/LoginPage.ts**
```js
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, pwd: string) {
    await this.page
      .getByLabel('Email')
      .fill(email);
    await this.page
      .getByLabel('Password')
      .fill(pwd);
    await this.page
      .getByRole('button', { name: 'Login' })
      .click();
  }
}
```

</div>

<div>

**tests/login.spec.ts**
```js
import { LoginPage } from '../pages/LoginPage';

test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(
    'user@test.com',
    'password123'
  );

  await expect(page)
    .toHaveURL(/dashboard/);
});
```

### Vantaggi
- Codice riutilizzabile
- Facile manutenzione
- Selettori centralizzati

</div>

</div>

---

# Custom Fixtures

<div class="grid-cols-2 mt-4">

<div>

### Definizione

```js
// fixtures/auth.ts
import { test as base }
  from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async (
    { page }, use
  ) => {
    await page.goto('/login');
    await page.getByLabel('Email')
      .fill('test@test.com');
    await page.getByLabel('Password')
      .fill('pass123');
    await page.getByRole('button',
      { name: 'Login' }).click();
    await page.waitForURL(/dash/);
    await use(page);
  }
});
```

</div>

<div>

### Utilizzo

```js
test('dashboard',
  async ({ authenticatedPage }) => {
  // Già loggato!
  await expect(
    authenticatedPage
      .getByText('Welcome')
  ).toBeVisible();
});
```

### Vantaggi
- Riuso del setup
- Test più puliti
- Manutenzione centralizzata

</div>

</div>

---

# Parallelizzazione

### 4x più veloce out of the box

```js
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
});
```

**Risultati:**
```bash
# workers=1: ~10min
# workers=4: ~2.5min

# 4x più veloce! 🚀
```

### Sharding per CI/CD

```bash
# Dividi su più macchine
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

---

# Mobile Testing

<div class="grid-cols-2 mt-4">

<div>

### Device Emulation

```js
import { devices }
  from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13']
      },
    },
    {
      name: 'Pixel 5',
      use: {
        ...devices['Pixel 5']
      },
    },
  ],
});
```

</div>

<div>

### Touch Events

```js
test('mobile menu',
  async ({ page }) => {
  // Tap
  await page.tap('#menu-button');

  // Swipe
  await page.touchscreen
    .tap(100, 100);
});
```

**Device preconfigurati:**
- iPhone, iPad
- Android devices
- Tablets

</div>

</div>

---

# API Testing

<div class="grid-cols-2 mt-4">

<div>

### GET Request

```js
test('GET products',
  async ({ request }) => {
  const response =
    await request.get('/api/products');

  expect(response.ok())
    .toBeTruthy();
  expect(response.status())
    .toBe(200);

  const products =
    await response.json();
  expect(products)
    .toHaveLength(10);
});
```

</div>

<div>

### POST Request

```js
test('POST create',
  async ({ request }) => {
  const response = await request
    .post('/api/products', {
      data: {
        name: 'Product',
        price: 99.99
      }
    });

  expect(response.status())
    .toBe(201);
});
```

**Supporta:** GET, POST, PUT, DELETE, PATCH

</div>

</div>

---

# CI/CD Integration

<div class="grid-cols-2 mt-4">

<div>

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install
    - run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: report
        path: playwright-report/
```

</div>

<div>

### Altri CI/CD

**GitLab CI**
- Docker image ufficiale
- Artifact reports

**Azure Pipelines**
- Windows, Linux, macOS
- Parallel jobs

**Jenkins**
- Plugin disponibile
- Docker support

**CircleCI**
- Orbs Playwright
- Caching ottimizzato

</div>

</div>
