# Perché E2E Testing?

<div class="absolute top-4 right-6 bg-gray-800/80 text-gray-100 text-xs px-3 py-1 rounded-full">
  Capitolo 1 — Fondamenti

</div>

- **I bug in produzione costano 10-100x più che in sviluppo**

Meglio rendercene conto subito

- **Verifica Flussi Completi**

Testa user journey reali dal login al checkout

- **Confidenza nel Deploy**

"Se passa, funziona" - Deploy sicuri e meno stress

- **Documentazione Vivente**

I test descrivono esattamente come funziona l'app



---

# Le Sfide Tradizionali

<div class="grid grid-cols-2 gap-8 mt-4">

  <div> <h3>Instabilità (Flaky)</h3>

  ```js
  await driver.findElement(By.id('btn'));
  await driver.sleep(2000); // 😱
  await driver.click('#btn');
  ```
  </div>

<div> <h3>Setup Complesso</h3> <ul class="mt-2 space-y-1"> <li>Configurare WebDriver</li> <li>Gestire browser binaries</li> <li>Dependency hell</li> </ul> </div>

<div> <h3>Lenti</h3> <ul class="mt-2 space-y-1"> <li>Esecuzione sequenziale</li> <li>Attese manuali</li> <li>No parallelizzazione</li> </ul> </div>

<div> <h3>Difficili da Mantenere</h3> <ul class="mt-2 space-y-1"> <li>Selettori fragili</li> <li>Codice duplicato</li> <li>Refactoring UI → test rotti</li> </ul> </div>

</div>