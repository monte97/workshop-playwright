/**
 * Fixture che crea un utente unico per ogni test via API.
 *
 * Vantaggi:
 * - Isolamento totale: ogni test ha il suo utente dedicato
 * - Setup veloce: login via API (~100ms) invece che via UI (~3s)
 * - Cleanup automatico: utente eliminato al termine del test
 * - Scalabilità: supporta workers multipli senza limiti
 *
 * Uso:
 * import { test, expect } from '../fixtures/user.fixture';
 *
 * test('mio test', async ({ page, authenticatedUser }) => {
 *   // Il browser è già autenticato con un utente unico
 *   await page.goto('/');
 *   await expect(page.locator('#userGreeting')).toContainText(authenticatedUser.email);
 * });
 */

import { test as base, expect, APIRequestContext } from '@playwright/test';
import { randomUUID } from 'crypto';

// Tipo per i dati dell'utente autenticato
type AuthenticatedUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

// Estende le fixture di Playwright con la nostra fixture personalizzata
type UserFixtures = {
  authenticatedUser: AuthenticatedUser;
};

/**
 * Crea un nuovo utente via API
 */
async function createUser(request: APIRequestContext): Promise<AuthenticatedUser> {
  const timestamp = Date.now();
  const uniqueId = randomUUID().slice(0, 8);
  const uniqueEmail = `test-${timestamp}-${uniqueId}@example.com`;
  const password = 'test123';
  const name = `Test User ${timestamp}`;

  const response = await request.post('/api/users', {
    data: { email: uniqueEmail, password, name },
  });

  if (!response.ok()) {
    throw new Error(`Failed to create user: ${response.status()} ${await response.text()}`);
  }

  const user = await response.json();
  return { ...user, password }; // Aggiungi la password (non ritornata dall'API)
}

/**
 * Esegue il login via API e inietta i cookie nel browser context
 */
async function loginUser(
  request: APIRequestContext,
  user: AuthenticatedUser,
  context: any
): Promise<void> {
  const loginResponse = await request.post('/api/auth/login', {
    data: { email: user.email, password: user.password },
  });

  if (!loginResponse.ok()) {
    throw new Error(`Login failed: ${loginResponse.status()}`);
  }

  // Estrai i cookie dalla risposta
  const setCookieHeader = loginResponse.headers()['set-cookie'];
  if (setCookieHeader) {
    // Parse dei cookie dalla risposta (supporta multiple set-cookie headers)
    const cookieStrings = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    const cookies = cookieStrings.flatMap(cookieString => {
      // Split per multiple cookies nella stessa stringa
      return cookieString.split(',').map(c => {
        const [nameValue] = c.trim().split(';');
        const [name, ...valueParts] = nameValue.split('=');
        return {
          name: name.trim(),
          value: valueParts.join('='), // Handle values with '=' in them
          domain: 'localhost',
          path: '/',
        };
      });
    });

    await context.addCookies(cookies);
  }
}

/**
 * Elimina l'utente via API
 */
async function deleteUser(request: APIRequestContext, userId: number): Promise<void> {
  const response = await request.delete(`/api/users/${userId}`);

  if (!response.ok()) {
    console.warn(`Failed to delete user ${userId}: ${response.status()}`);
    // Non lanciamo errore per non far fallire il test se il cleanup fallisce
  }
}

// Estende il test base con la fixture authenticatedUser
export const test = base.extend<UserFixtures>({
  authenticatedUser: async ({ request, context }, use) => {
    // ==================== SETUP ====================
    console.log('🔧 [Fixture] Creating unique user via API...');

    // 1. Crea utente via API
    const user = await createUser(request);
    console.log(`✅ [Fixture] User created: ${user.email} (ID: ${user.id})`);

    // 2. Login via API e inietta cookie nel browser context
    await loginUser(request, user, context);
    console.log(`🔐 [Fixture] User logged in: ${user.email}`);

    // 3. Passa il controllo al test
    await use(user);

    // ==================== TEARDOWN ====================
    console.log(`🧹 [Fixture] Cleaning up user: ${user.email}`);
    await deleteUser(request, user.id);
    console.log(`✅ [Fixture] User deleted: ${user.id}`);
  },
});

// Re-export expect per comodità
export { expect };
