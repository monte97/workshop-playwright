import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('email-input').click();
  await page.getByTestId('email-input').fill('test@example.com');
  await page.getByTestId('email-input').press('Tab');
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('login-button').click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByTestId('show-create-form').click();
  
});