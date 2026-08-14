---
type: rejection
category: fiscal
code: "610"
document: nfe
codigo: "610"
documento: "NF-e"
titulo: "Rejeição 610 - Total da NF-e difere do somatório dos valores"
title: "Total da NF-e difere do somatório dos valores"
mensagem_original: "Rejeição 610: Total da NF-e difere do somatório dos Valores compõem o valor Total da NF-e."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#610"
---

# Rejeição 610 — Total da NF-e difere do somatório dos valores

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 610: Total da NF-e difere do somatório dos Valores compõem o valor Total da NF-e.</p>

## Como a SEFAZ interpreta

O valor total da NF-e não corresponde ao resultado dos valores que compõem o total do documento.

## Como isso acontece no WCorp

Pode aparecer quando a soma de materiais, impostos, frete, seguro, despesas e desconto não fecha com o Total da NF-e.

## Como verificar

1. Some o valor total dos materiais.
2. Inclua impostos, frete, seguro e despesas.
3. Subtraia os descontos.
4. Compare o resultado com o campo **Total da NF-e**.

## Como corrigir

Ajuste os valores que compõem o total para que a soma final corresponda ao Total da NF-e.
