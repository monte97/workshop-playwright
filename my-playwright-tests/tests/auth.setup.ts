import {test as setup, expect} from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({page} ) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByTestId('email-input').click();
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('email-input').press('Tab');
    await page.getByTestId('password-input').click();
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page.locator('#userGreeting')).toContainText('Ciao, Test User!');

    await page.context().storageState({path: authFile})
});