# Agenda

<div class="grid-cols-2 mt-8">

<div>

### Fondamenti
1. Introduzione a Playwright
2. Concetti Core
3. Architettura e Selettori

### Pratica
4. Demo Live
5. Workshop Hands-on
6. Debugging Tools

</div>

<div>

### Avanzato
7. Page Object Model
8. Fixtures e Context
9. CI/CD Integration
10. Mobile & API Testing

### Conclusione
- Best Practices
- Risorse
- Q&A

</div>

</div>

<div class="absolute bottom-10 right-10 text-secondary">
Durata: 60-90 minuti
</div>

---

# Perché E2E Testing?

### Il Problema

**I bug in produzione costano 10-100x più che in sviluppo**

<div class="grid-cols-3 mt-8">

<div class="card">

**Verifica Flussi Completi**

Testa user journey reali dal login al checkout

</div>

<div class="card">

**Confidenza nel Deploy**

"Se passa, funziona" - Deploy sicuri e meno stress

</div>

<div class="card">

**Documentazione Vivente**

I test descrivono esattamente come funziona l'app

</div>

</div>

---

# Le Sfide Tradizionali

<div class="grid-cols-2 mt-4">

<div>

### Instabilità (Flaky)

```js
await driver.findElement(By.id('btn'));
await driver.sleep(2000); // 😱
await driver.click('#btn');
```

### Setup Complesso
- Configurare WebDriver
- Gestire browser binaries
- Dependency hell

</div>

<div>

### Lenti
- Esecuzione sequenziale
- Attese manuali
- No parallelizzazione

### Difficili da Mantenere
- Selettori fragili
- Codice duplicato
- Refactoring UI → test rotti

</div>

</div>
