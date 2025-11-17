---
layout: center
---

# Workshop: Scrittura di Test E2E con Playwright

---

# L'applicazione di Riferimento: TechStore

**Applicazione e-commerce per il workshop, ottimizzata per il testing con Playwright.**

```bash
# Avvia l'applicazione tramite Docker
cd demo-app
docker-compose up -d

# Oppure con Node.js
npm install && npm start
```

**URL:** `http://localhost:3000`

**Credenziali di test:**
- Email: `test@example.com`
- Password: `password123`

**Funzionalità:** Catalogo prodotti, carrello, autenticazione, checkout, API REST.

---
src: ./exercises/00-setup.md
---

---
src: ./exercises/01-codegen.md
---

---
src: ./exercises/02-visual-testing.md
---

---
src: ./exercises/03-auth-optimization.md
---

---
src: ./exercises/04-robust-tests.md
---

---
src: ./exercises/04b-parallel-workers.md
---

---
src: ./exercises/05-accessibility.md
---

# Riepilogo del Workshop

**Argomenti trattati:**

0.  **Setup del Progetto**: Creazione di un nuovo progetto Playwright.
1.  **Generazione Automatica di Test**: Utilizzo di Codegen e UI Mode per accelerare la creazione di test.
2.  **Visual Regression Testing**: Verifica dell'integrità visiva tramite confronto di screenshot.
3.  **Ottimizzazione del Login**: Utilizzo di `setup` project per un'autenticazione efficiente.
4.  **Test Robusti e Isolati**: Gestione di dati dinamici, race condition e setup con fixture.
4b. **Scalare i Test con Workers Multipli**: Esecuzione parallela, isolamento tra workers, fixture con API.
5.  **Test di Accessibilità**: Integrazione di controlli automatici di accessibilità con `axe-core`.

**Principio guida**: Automatizzare non solo il "cosa" fa l'applicazione, ma anche il "come" appare e quanto è accessibile.