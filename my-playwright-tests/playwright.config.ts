import { defineConfig, devices } from '@playwright/test';

const noAuthTests = ['**/esercizio1.spec.ts', '**/esercizio2.spec.ts'];

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

    // Authenticated projects
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: noAuthTests,
    },
    {
      name: 'firefox-auth',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: noAuthTests,
    },
    // {
    //   name: 'webkit-auth',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    //   testIgnore: noAuthTests,
    // },

    // Non-authenticated projects
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
  ],
});
