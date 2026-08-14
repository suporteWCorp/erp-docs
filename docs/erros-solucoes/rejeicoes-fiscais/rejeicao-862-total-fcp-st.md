---
type: rejection
category: fiscal
code: "862"
document: nfe
codigo: "862"
documento: "NF-e"
titulo: "Rejeição 862 - Total do FCP ST difere do somatório dos itens"
title: "Total do FCP ST difere do somatório dos itens"
mensagem_original: "Rejeição 862: Total do FCP ST difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#862"
---

# Rejeição 862 — Total do FCP ST difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 862: Total do FCP ST difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O total de FCP ST informado na nota está diferente da soma dos valores de FCP ST dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor do campo **FCP ST** dos materiais não fecha com o FCP ST informado na aba **Impostos**.

## Como verificar

1. Verifique o campo **FCP ST** na aba **Fundo Combate Pobreza** de cada material.
2. Some os valores de FCP ST dos itens.
3. Compare o resultado com o FCP ST da aba **Impostos**.

## Como corrigir

Ajuste os valores para que o resultado seja exatamente igual ao FCP ST informado na aba **Impostos**.
