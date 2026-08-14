---
type: rejection
category: fiscal
code: "538"
document: nfe
codigo: "538"
documento: "NF-e"
titulo: "Rejeição 538 - Total do IPI difere do somatório dos itens"
title: "Total do IPI difere do somatório dos itens"
mensagem_original: "Rejeição 538: Total do IPI difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#538"
---

# Rejeição 538 — Total do IPI difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 538: Total do IPI difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O total de IPI informado na NF-e está diferente da soma do IPI dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total do IPI na aba **Impostos** não corresponde à soma do IPI dos materiais.

## Como verificar

1. Some o IPI dos materiais da nota.
2. Compare a soma com o valor total do IPI na aba **Impostos**.

## Como corrigir

Ajuste os valores para que o IPI total da aba **Impostos** corresponda exatamente à soma do IPI dos materiais.
