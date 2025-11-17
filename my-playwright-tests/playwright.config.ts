import { defineConfig, devices } from '@playwright/test';

// Test che NON richiedono autenticazione (fanno login manualmente)
const noAuthTests = ['**/esercizio1.spec.ts', '**/esercizio2.spec.ts'];

// Test che usano storageState (login globale via auth.setup.ts)
const storageStateAuthTests = [
  '**/esercizio3.spec.ts',
  '**/esercizio4.spec.ts',
  '**/esercizio4b-01-problema-flaky.spec.ts',
];

// Test che usano la fixture user.fixture.ts (autenticazione dinamica via API)
// Questi NON devono usare storageState perché creano utenti unici
const fixtureAuthTests = ['**/esercizio4b-02-soluzione-parallel.spec.ts'];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Authenticated projects (storageState-based)
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: storageStateAuthTests,
    },
    {
      name: 'firefox-auth',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: storageStateAuthTests,
    },
    // {
    //   name: 'webkit-auth',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    //   testMatch: storageStateAuthTests,
    // },

    // Non-authenticated projects (test che fanno login manualmente)
    {
      name: 'chromium-no-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: noAuthTests,
    },
    {
      name: 'firefox-no-auth',
      use: { ...devices['Desktop Firefox'] },
      testMatch: noAuthTests,
    },
    // {
    //   name: 'webkit-no-auth',
    //   use: { ...devices['Desktop Safari'] },
    //   testMatch: noAuthTests,
    // },

    // Fixture-based authentication projects (NO storageState)
    // Questi test creano utenti dinamici via API per isolamento totale
    {
      name: 'chromium-fixture-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: fixtureAuthTests,
    },
    {
      name: 'firefox-fixture-auth',
      use: { ...devices['Desktop Firefox'] },
      testMatch: fixtureAuthTests,
    },
    // {
    //   name: 'webkit-fixture-auth',
    //   use: { ...devices['Desktop Safari'] },
    //   testMatch: fixtureAuthTests,
    // },
  ],
});
