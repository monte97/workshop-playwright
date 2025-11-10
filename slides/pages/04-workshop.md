# Workshop Pratico

<SectionTitle title="04" />

---

# Struttura Workshop

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Obiettivi

1. **Hands-on experience**
2. **Casi d'uso realistici**
3. **Best practices**

## 📋 Esercizi

| # | Esercizio | Difficoltà |
|---|-----------|------------|
| 1 | Login Flow | ⭐ |
| 2 | E-commerce | ⭐⭐ |
| 3 | API Mock | ⭐⭐ |
| 4 | Visual | ⭐⭐⭐ |

</div>

<div>

## 🚀 Setup

```bash
cd demo-app
npm install
npm start
```

**Demo app**: `http://localhost:3000`

**Credenziali**:
- Email: `test@example.com`
- Password: `password123`

</div>

</div>

---

# Esercizio 1: Login Flow

<Exercise
  number="1"
  title="Test Login"
  difficulty="beginner"
  time="5-7 min"
/>

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Obiettivo

Test per:
1. Login con successo
2. Login fallito
3. Validazione form
4. Logout

## 📝 Specifiche

**URL**: `/login`

**Credenziali**:
- `test@example.com` / `password123`

**Comportamento**:
- ✅ Login → `/dashboard`
- ❌ Errori → messaggio

</div>

<div>

## 💡 Hints

```js
test.describe('Login Flow', () => {
  test('login successo', async ({ page }) => {
    // TODO
  });

  test('login fallito', async ({ page }) => {
    // TODO
  });
});
```

**Selettori**:
- `getByLabel('Email')`
- `getByRole('button')`

</div>

</div>

---

# Soluzione Esercizio 1

<div class="text-xs overflow-auto" style="max-height: 500px;">

```js
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login con successo', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('login con credenziali errate', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('validazione form vuoto', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('logout', async ({ page }) => {
    // Login
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });
});
```

</div>

---

# Esercizio 2: E-Commerce

<Exercise
  number="2"
  title="Carrello"
  difficulty="intermediate"
  time="7-10 min"
/>

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Obiettivo

Flow e-commerce:
1. Cerca prodotto
2. Aggiungi al carrello
3. Modifica quantità
4. Calcolo totale
5. Checkout

**URL**: `/shop`

</div>

<div>

## 💡 Hints

```js
test('aggiunta prodotto', async ({ page }) => {
  // cerca, aggiungi, verifica
});

test('modifica quantità', async ({ page }) => {
  // aumenta/diminuisci
});
```

**Selettori**:
- `getByRole('spinbutton')`
- `getByTestId('cart-count')`

</div>

</div>

---

# Soluzione Esercizio 2

<div class="text-xs overflow-auto" style="max-height: 520px;">

```js
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => await page.goto('/shop'));

  test('aggiunta prodotto al carrello', async ({ page }) => {
    await page.getByPlaceholder('Search products').fill('laptop');
    await page.getByRole('button', { name: 'Search' }).click();

    const productCard = page.getByTestId('product-laptop-pro');
    await expect(productCard).toBeVisible();
    await productCard.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.getByText('Product added to cart')).toBeVisible();
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    await page.getByRole('link', { name: /Cart/ }).click();
    await expect(page.getByText('Laptop Pro 15"')).toBeVisible();
  });

  test('modifica quantità prodotto', async ({ page }) => {
    await addProductToCart(page, 'laptop');
    await page.goto('/cart');

    const qtyInput = page.getByRole('spinbutton', { name: 'Quantity' });
    await expect(qtyInput).toHaveValue('1');

    await page.getByRole('button', { name: 'Increase' }).click();
    await expect(qtyInput).toHaveValue('2');

    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toHaveText('€1999.98');
  });

  test('rimozione prodotto dal carrello', async ({ page }) => {
    await addProductToCart(page, 'laptop');
    await page.goto('/cart');

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByTestId('cart-count')).not.toBeVisible();
  });

  test('calcolo totale con più prodotti', async ({ page }) => {
    await addProductToCart(page, 'laptop');
    await addProductToCart(page, 'mouse');
    await addProductToCart(page, 'keyboard');

    await page.goto('/cart');

    await expect(page.getByText('Laptop Pro 15"')).toBeVisible();
    await expect(page.getByText('Wireless Mouse')).toBeVisible();

    const subtotal = page.getByTestId('subtotal');
    await expect(subtotal).toHaveText('€1109.97');
  });

  test('checkout flow completo', async ({ page }) => {
    await addProductToCart(page, 'laptop');
    await page.goto('/cart');

    await page.getByRole('button', { name: 'Proceed to checkout' }).click();
    await expect(page).toHaveURL(/checkout/);

    await page.getByLabel('Full name').fill('Mario Rossi');
    await page.getByLabel('Email').fill('mario@example.com');
    await page.getByLabel('Address').fill('Via Roma 1');
    await page.getByLabel('City').fill('Roma');
    await page.getByLabel('ZIP').fill('00100');

    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page).toHaveURL(/order-confirmation/);
    await expect(page.getByText('Order confirmed!')).toBeVisible();
  });
});

async function addProductToCart(page, productName) {
  await page.goto('/shop');
  await page.getByPlaceholder('Search products').fill(productName);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
}
```

</div>

---

# Esercizio 3: API Mocking

<Exercise
  number="3"
  title="Mock API"
  difficulty="intermediate"
  time="6-8 min"
/>

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Obiettivo

Test con API:
1. Mock successo
2. Mock errore 500
3. Mock timeout
4. Modifica risposta

**API**: `/api/products`

</div>

<div>

## 💡 Hints

```js
test('mock API', async ({ page }) => {
  await page.route('**/api/products',
    route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([...])
      });
    });

  await page.goto('/shop');
});
```

</div>

</div>

---

# Soluzione Esercizio 3

<div class="text-xs overflow-auto" style="max-height: 520px;">

```js
import { test, expect } from '@playwright/test';

test.describe('API Mocking', () => {
  test('mock prodotti con successo', async ({ page }) => {
    await page.route('**/api/products', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, name: 'Mocked Laptop', price: 999.99 },
          { id: 2, name: 'Mocked Mouse', price: 29.99 }
        ])
      });
    });

    await page.goto('/shop');
    await expect(page.getByText('Mocked Laptop')).toBeVisible();
    await expect(page.getByText('€999.99')).toBeVisible();
  });

  test('mock errore API 500', async ({ page }) => {
    await page.route('**/api/products', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.goto('/shop');
    await expect(page.getByText('Failed to load products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('mock timeout API', async ({ page }) => {
    await page.route('**/api/products', async route => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      route.fulfill({ status: 200, body: '[]' });
    });

    await page.goto('/shop');
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    await expect(page.getByText('Request timeout')).toBeVisible({ timeout: 10000 });
  });

  test('modifica risposta API', async ({ page }) => {
    await page.route('**/api/products', async route => {
      const response = await route.fetch();
      const json = await response.json();

      const modified = json.map(product => ({
        ...product,
        price: product.price * 0.5,
        onSale: true
      }));

      route.fulfill({ response, json: modified });
    });

    await page.goto('/shop');
    await expect(page.getByText('50% OFF')).toBeVisible();
  });

  test('verifica payload request', async ({ page }) => {
    let capturedRequest;

    await page.route('**/api/cart', route => {
      capturedRequest = route.request();
      route.fulfill({
        status: 201,
        body: JSON.stringify({ success: true, cartId: '123' })
      });
    });

    await page.goto('/shop');
    // Aggiungi prodotto e verifica payload
  });
});
```

</div>

---

# Esercizio 4: Visual Testing

<Exercise
  number="4"
  title="Visual Testing"
  difficulty="advanced"
  time="7-10 min"
/>

<div class="grid grid-cols-2 gap-6">

<div>

## 🎯 Obiettivo

Visual testing:
1. Screenshot full page
2. Screenshot elemento
3. Responsive
4. Dark mode

**Testare**: Homepage, modal, form

</div>

<div>

## 💡 Hints

```js
test('visual', async ({ page }) => {
  await page.goto('/');
  await expect(page)
    .toHaveScreenshot('home.png');
});

test('responsive', async ({ page }) => {
  await page.setViewportSize({
    width: 375, height: 667
  });
  await page.goto('/');
  await expect(page)
    .toHaveScreenshot('mobile.png');
});
```

</div>

</div>

---

# Soluzione Esercizio 4

<div class="text-xs overflow-auto" style="max-height: 520px;">

```js
import { test, expect } from '@playwright/test';

test.describe('Visual Testing', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });

  test('product card visual', async ({ page }) => {
    await page.goto('/shop');

    const productCard = page.getByTestId('product-1');
    await expect(productCard).toHaveScreenshot('product-card.png');

    await productCard.hover();
    await expect(productCard).toHaveScreenshot('product-card-hover.png');
  });

  test('modal dialog visual', async ({ page }) => {
    await page.goto('/shop');
    await page.getByRole('button', { name: 'Quick view' }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveScreenshot('product-modal.png');
  });

  test('form validation states', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('form-initial.png');

    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveScreenshot('form-error.png');

    await page.getByLabel('Email').focus();
    await expect(page).toHaveScreenshot('form-focus.png');
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      test(`${viewport.name} layout`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, { fullPage: true });
      });
    }
  });

  test('dark mode visual', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('theme-light.png');

    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('theme-dark.png');
  });

  test('mascheramento contenuto dinamico', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png', {
      mask: [
        page.getByTestId('user-avatar'),
        page.getByTestId('timestamp'),
      ],
    });
  });
});

// Config globale
test.use({ screenshot: 'only-on-failure' });
expect.configure({ toHaveScreenshot: { maxDiffPixels: 50 } });
```

</div>

---

# Best Practices dal Workshop

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## ✅ Do's

<v-clicks>

**Test Organization**
- Usa `test.describe` per raggruppare
- `beforeEach` per setup comune
- Helper functions per codice riutilizzabile

**Selettori**
- Preferisci `getByRole`, `getByLabel`
- Usa `data-testid` per elementi stabili
- Evita selettori CSS fragili

**Assertions**
- Usa assertions web-first
- Verifica stati intermedi
- Test multi-stato (empty, loading, error, success)

**API Mocking**
- Mock per isolamento
- Test edge cases (error, timeout)
- Verifica request payload

</v-clicks>

</div>

<div>

## ❌ Don'ts

<v-clicks>

**Anti-patterns**
- ❌ `page.waitForTimeout(5000)`
- ❌ Selettori CSS fragili (`div > span.class`)
- ❌ Hard-coded wait
- ❌ Test dipendenti tra loro

**Bad practices**
- ❌ No cleanup tra test
- ❌ Test troppo lunghi
- ❌ Assertions vaghe
- ❌ Ignorare errori intermittenti

**Code smells**
- ❌ Codice duplicato
- ❌ Magic numbers/strings
- ❌ Test non deterministici
- ❌ Over-mocking

</v-clicks>

</div>

</div>

---

# Organizzazione Test: File Structure

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

## 📁 Struttura Consigliata

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── shop/
│   │   ├── products.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   └── user/
│       └── profile.spec.ts
├── api/
│   └── products-api.spec.ts
├── visual/
│   └── snapshots.spec.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── products.fixture.ts
└── helpers/
    ├── mock-data.ts
    └── test-utils.ts
```

</div>

<div>

## 🎯 Naming Convention

**File test**:
- `*.spec.ts` - Test E2E
- `*.api.spec.ts` - Test API
- `*.visual.spec.ts` - Visual tests

**Test names**:
```js
// ✅ Good
test('user can add product to cart')
test('displays error on invalid email')
test('calculates discount correctly')

// ❌ Bad
test('test1')
test('it works')
test('check cart')
```

**Describe blocks**:
```js
test.describe('Shopping Cart', () => {
  test.describe('Adding items', () => {
    test('single item', ...)
    test('multiple items', ...)
  });
});
```

</div>

</div>

---

# Pattern: Test Fixtures

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## 🔧 Custom Fixtures

```js
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Fixture: utente autenticato
  authenticatedPage: async ({ page }, use) => {
    // Setup
    await page.goto('/login');
    await page.getByLabel('Email')
      .fill('test@example.com');
    await page.getByLabel('Password')
      .fill('password123');
    await page.getByRole('button',
      { name: 'Login' }
    ).click();
    await page.waitForURL(/dashboard/);

    // Usa la page autenticata
    await use(page);

    // Cleanup (opzionale)
    await page.getByRole('button',
      { name: 'Logout' }
    ).click();
  },

  // Fixture: prodotti mockati
  mockProducts: async ({ page }, use) => {
    await page.route('**/api/products',
      route => route.fulfill({
        body: JSON.stringify(mockData)
      })
    );
    await use(page);
  }
});
```

</div>

<div>

## 📝 Utilizzo Fixtures

```js
import { test } from './fixtures/auth.fixture';
import { expect } from '@playwright/test';

test('utente può vedere dashboard',
  async ({ authenticatedPage }) => {
    // Già loggato!
    await expect(authenticatedPage)
      .toHaveURL(/dashboard/);

    await expect(
      authenticatedPage.getByText('Welcome')
    ).toBeVisible();
  }
);

test('carrello con prodotti mockati',
  async ({ page, mockProducts }) => {
    await page.goto('/shop');

    // API già mockata!
    await expect(
      page.getByTestId('product-1')
    ).toBeVisible();
  }
);
```

**Vantaggi**:
- ♻️ Riutilizzo codice
- 🧹 Cleanup automatico
- 📦 Composable
- 🎯 Test più leggibili

</div>

</div>

---

# Fixtures: Esempio Avanzato

<div class="grid grid-cols-2 gap-6 text-xs">

<div>

## 🛒 Fixture: Carrello Precaricato

```js
// fixtures/cart.ts
import { test as base } from '@playwright/test';

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

</div>

<div>

## 📝 Utilizzo

```js
import { test, expect } from './fixtures/cart';

test('can apply coupon', async ({ pageWithCart }) => {
  // Carrello già pieno con 3 prodotti!
  await pageWithCart.fill('coupon', 'SAVE10');
  await expect(pageWithCart.locator('.discount'))
    .toContainText('-10%');
});

test('can checkout', async ({ pageWithCart }) => {
  // Carrello già pieno, nuovo setup per questo test
  await pageWithCart.click('Checkout');
  await expect(pageWithCart)
    .toHaveURL('/payment');
});

test('can remove item', async ({ pageWithCart }) => {
  // Carrello già pieno di nuovo
  await pageWithCart.click('[data-remove="laptop"]');
  const count = await pageWithCart
    .locator('[data-cart-count]')
    .textContent();
  expect(count).toBe('2');
});
```

**Key point**: Le fixture vengono eseguite per ogni test!

</div>

</div>

---

# Fixtures: Composizione

<div class="grid grid-cols-2 gap-6 text-xs">

<div>

## 🔗 Fixtures Multiple

```js
// fixtures/index.ts
export const test = base.extend({
  // Fixture 1: Mock API
  mockProducts: async ({ page }, use) => {
    await page.route('**/api/products', route =>
      route.fulfill({
        body: JSON.stringify([
          { id: 1, name: 'Product 1', price: 10 }
        ])
      })
    );
    await use(page);
  },

  // Fixture 2: Authenticated page
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@test.com');
    await page.fill('[name="password"]', 'pass123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);
    await use(page);
  },

  // Fixture 3: Carrello con prodotti
  cartWithProducts: async ({
    authenticatedPage,
    mockProducts
  }, use) => {
    // Compone altre fixture!
    await authenticatedPage.goto('/shop');
    await authenticatedPage.click('.add-to-cart');
    await use(authenticatedPage);
  }
});
```

</div>

<div>

## 🎯 Usa Fixture Composte

```js
test('checkout flow completo',
  async ({ cartWithProducts }) => {
    // Abbiamo:
    // 1. API mockata (mockProducts)
    // 2. Utente loggato (authenticatedPage)
    // 3. Prodotti nel carrello (cartWithProducts)

    await cartWithProducts.click('Checkout');

    await expect(cartWithProducts)
      .toHaveURL(/checkout/);
  }
);
```

<div class="mt-4 p-3 bg-purple-500 bg-opacity-10 rounded">

**Vantaggi**:
- ♻️ Riuso massimo
- 🧩 Componibili
- 🧹 Cleanup automatico
- 📦 Separation of concerns

</div>

</div>

</div>

---

# Fixtures: Worker-Scoped

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

## 🌐 Worker-Scoped Fixtures

**Eseguono una volta per worker** invece che per test

```js
// fixtures/auth.ts
export const test = base.extend({
  // Test-scoped (default)
  page: async ({ page }, use) => {
    // Esegue per ogni test
    await use(page);
  },

  // Worker-scoped
  workerStorageState: [async ({ browser }, use) => {
    // Esegue UNA VOLTA per worker
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto('/login');
    await page.fill('email', 'test@test.com');
    await page.fill('password', 'pass');
    await page.click('button[type="submit"]');

    // Salva stato
    await context.storageState({
      path: 'auth-state.json'
    });

    await context.close();
    await use('auth-state.json');
  }, { scope: 'worker' }]
});
```

</div>

<div>

## ⚡ Performance Boost

**Confronto**:

```js
// Test-scoped: login per ogni test
test('test 1', async ({ page }) => {
  // Login: 2s
  // Test: 1s
}); // Totale: 3s

test('test 2', async ({ page }) => {
  // Login: 2s
  // Test: 1s
}); // Totale: 3s

// 10 test = 30s solo di login! 😱
```

```js
// Worker-scoped: login una volta
test.use({
  storageState: workerStorageState
});

test('test 1', async ({ page }) => {
  // Test: 1s (già loggato!)
});

test('test 2', async ({ page }) => {
  // Test: 1s (già loggato!)
});

// 10 test = 2s login + 10s test = 12s! 🚀
```

</div>

</div>

---

# Pattern: Page Object Model

<div class="grid grid-cols-2 gap-6 text-xs">

<div>

## 🏗️ Definizione POM

```js
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get emailInput() {
    return this.page.getByLabel('Email');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get loginButton() {
    return this.page.getByRole('button',
      { name: 'Login' }
    );
  }

  get errorMessage() {
    return this.page.getByTestId('error-message');
  }

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithValidCredentials() {
    await this.login(
      'test@example.com',
      'password123'
    );
  }

  // Assertions
  async expectLoginSuccess() {
    await expect(this.page)
      .toHaveURL(/dashboard/);
  }

  async expectLoginError(message: string) {
    await expect(this.errorMessage)
      .toHaveText(message);
  }
}
```

</div>

<div>

## 📝 Utilizzo POM

```js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('login con successo', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithValidCredentials();
  await loginPage.expectLoginSuccess();
});

test('login fallito', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('wrong@email.com', 'wrong');
  await loginPage.expectLoginError('Invalid credentials');
});
```

**POM Avanzato**:
```js
// pages/ShopPage.ts
export class ShopPage {
  constructor(private page: Page) {}

  // Componenti
  get searchBox() {
    return new SearchComponent(
      this.page.getByTestId('search')
    );
  }

  get cart() {
    return new CartComponent(
      this.page.getByTestId('cart')
    );
  }

  // Metodi fluent
  async searchProduct(name: string) {
    await this.searchBox.search(name);
    return this;
  }

  async addToCart(productId: string) {
    await this.page
      .getByTestId(`product-${productId}`)
      .getByRole('button', { name: 'Add' })
      .click();
    return this;
  }
}
```

</div>

</div>

---

# Recap Workshop

<div class="grid grid-cols-3 gap-6 text-sm">

<div class="p-4 bg-blue-500 bg-opacity-10 rounded">

### 📝 Esercizio 1: Login
- Form validation
- Success/error flows
- Selettori semantici
- Assertions web-first

</div>

<div class="p-4 bg-green-500 bg-opacity-10 rounded">

### 🛒 Esercizio 2: E-commerce
- Multi-step flow
- State management
- Calcoli dinamici
- User interactions

</div>

<div class="p-4 bg-purple-500 bg-opacity-10 rounded">

### 🌐 Esercizio 3: API
- Request mocking
- Error scenarios
- Response modification
- Network testing

</div>

<div class="p-4 bg-orange-500 bg-opacity-10 rounded">

### 📸 Esercizio 4: Visual
- Screenshot testing
- Responsive design
- Visual regression
- Dynamic content

</div>

<div class="p-4 bg-red-500 bg-opacity-10 rounded">

### 🏗️ Patterns
- Page Object Model
- Custom fixtures
- Test organization
- Code reuse

</div>

<div class="p-4 bg-yellow-500 bg-opacity-10 rounded">

### ✅ Best Practices
- Naming conventions
- File structure
- Anti-patterns
- Clean code

</div>

</div>

<div class="text-center mt-8">

**Prossimo**: Concetti avanzati! 🚀

</div>
