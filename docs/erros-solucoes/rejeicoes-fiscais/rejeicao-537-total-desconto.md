---
type: rejection
category: fiscal
code: "537"
document: nfe
codigo: "537"
documento: "NF-e"
titulo: "Rejeição 537 - Total do Desconto difere do somatório dos itens"
title: "Total do Desconto difere do somatório dos itens"
mensagem_original: "Rejeição 537: Total do Desconto difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#537"
---

# Rejeição 537 — Total do Desconto difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 537: Total do Desconto difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O desconto total informado na NF-e está diferente da soma dos descontos dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total do desconto na aba **Impostos** não corresponde à soma do desconto dos materiais.

## Como verificar

1. Some o desconto de todos os materiais.
2. Compare a soma com o valor total do desconto na aba **Impostos**.

## Como corrigir

Ajuste os valores para que o desconto total da aba **Impostos** corresponda exatamente à soma do desconto dos materiais.
