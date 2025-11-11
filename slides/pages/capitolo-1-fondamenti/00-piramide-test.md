# La Piramide dei Test

<div class="absolute top-4 right-6 bg-gray-800/80 text-gray-100 text-xs px-3 py-1 rounded-full">
  Capitolo 1 — Fondamenti
</div>


<div class="grid grid-cols-2 gap-8 mt-4">

  <div> <h3>Strategia di Testing</h3>
```mermaid
graph BT
direction BT
subgraph Piramide dei Test
    C(Test E2E / UI)
    B(Test di Integrazione)
    A(Test Unitari)
end

A --> B
B --> C

style A fill:#4CAF50,color:#fff,stroke:#333,stroke-width:2px
style B fill:#FFC107,color:#000,stroke:#333,stroke-width:2px
style C fill:#F44336,color:#fff,stroke:#333,stroke-width:2px
```

  </div>

  <div>
    <h3>Tipologie di Test</h3>
  </div>

</div>

---

# Perché E2E sta in Cima?

<div class="grid grid-cols-3 gap-8 mt-4">

<div class="card">

**Costo**

- Setup complesso
- Ambiente completo
- Dati di test
- Manutenzione alta

</div>

<div class="card">

**Velocità**

- Browser rendering
- Network calls
- Attese UI
- Esecuzione sequenziale

</div>

<div class="card">

**Fragilità**

- UI changes
- Timing issues
- Dipendenze esterne
- Flaky tests

</div>

</div>

