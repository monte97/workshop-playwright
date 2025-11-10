# Best Practices

### Principi da seguire

<div class="grid-cols-2 mt-8">

<div>

**Test Philosophy**
- Testa comportamento, non implementazione
- User-centric testing
- Test critical paths first

**Code Quality**
- DRY: usa fixtures e helper
- Selettori semantici
- Assertions meaningful

</div>

<div>

**Maintenance**
- Keep tests updated
- Refactor quando necessario
- Monitor test health

**Performance**
- Parallelizzazione
- Test isolation
- Fast feedback loop

</div>

</div>

---

# Playwright vs Alternative

| Feature | Playwright | Selenium | Cypress |
|---------|-----------|----------|---------|
| **Browser Support** | Chromium, Firefox, WebKit | Tutti | Chromium, Firefox |
| **Auto-waiting** | ✅ Built-in | ❌ Manuale | ✅ Built-in |
| **Network Mocking** | ✅ Nativo | ❌ Complesso | ✅ Nativo |
| **Multiple Tabs** | ✅ Facile | ✅ Complesso | ❌ Limitato |
| **Parallelizzazione** | ✅ Nativa | ⚠️ Grid | ❌ File only |
| **Mobile Emulation** | ✅ Completa | ⚠️ Limitata | ⚠️ Viewport |
| **API Testing** | ✅ Nativo | ❌ No | ⚠️ Plugin |
| **Learning Curve** | 🟢 Bassa | 🔴 Alta | 🟢 Bassa |
| **Performance** | 🟢 Veloce | 🔴 Lento | 🟡 Media |

---

# Quando Usare Playwright

<div class="grid-cols-2">

<div>

### ✅ Ottimo Per

- Nuovi progetti
- Web apps moderne (SPA, PWA)
- Test E2E complessi
- Cross-browser testing
- CI/CD intensive
- Team che vuole velocità

</div>

<div>

### ⚠️ Considerazioni

- No IE11 support
- Solo web mobile (no native)
- Learning investment
- Migration cost da altri tool
- Verifica requisiti enterprise

</div>

</div>

---

# Risorse

<div class="grid-cols-3">

<div>

### 📖 Documentazione

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

</div>

<div>

### 🛠️ Tools

- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Codegen](https://playwright.dev/docs/codegen)

</div>

<div>

### 🌟 Community

- [Discord](https://aka.ms/playwright/discord)
- [GitHub](https://github.com/microsoft/playwright)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

</div>

</div>

---

# Recap

### Cosa Abbiamo Visto

<div class="grid-cols-2 mt-8">

<div>

**Fondamenti**
- ✅ Cos'è Playwright e perché usarlo
- ✅ Auto-waiting e selettori semantici
- ✅ Cross-browser testing

**Pratica**
- ✅ Primo test e comandi
- ✅ Codegen e UI Mode
- ✅ Trace Viewer per debugging

</div>

<div>

**Workshop**
- ✅ Login flow
- ✅ E-commerce completo
- ✅ API mocking
- ✅ Visual testing

**Avanzato**
- ✅ Page Object Model
- ✅ Custom fixtures
- ✅ Parallelizzazione
- ✅ CI/CD integration

</div>

</div>

---
layout: center
---

# Grazie! 🎭

### Happy Testing con Playwright!

<div class="mt-8 text-secondary">

**Francesco Montelli**

github.com/monte97 • linkedin.com/in/francescomontelli

</div>

<div class="mt-8">

Workshop materials: [github.com/monte97/workshop-playwright](https://github.com/monte97/workshop-playwright)

</div>

---
layout: center
---

# Q&A

<div class="emoji-large mb-8">🎤</div>

### Domande?
