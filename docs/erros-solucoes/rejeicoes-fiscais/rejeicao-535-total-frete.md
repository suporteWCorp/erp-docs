---
type: rejection
category: fiscal
code: "535"
document: nfe
codigo: "535"
documento: "NF-e"
titulo: "Rejeição 535 - Total do Frete difere do somatório dos itens"
title: "Total do Frete difere do somatório dos itens"
mensagem_original: "Rejeição 535: Total do Frete difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#535"
---

# Rejeição 535 — Total do Frete difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 535: Total do Frete difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O frete total informado na NF-e está diferente da soma dos valores de frete dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total de frete na aba **Impostos** não corresponde ao somatório do frete dos materiais.

## Como verificar

1. Some o frete informado nos materiais da nota.
2. Compare a soma com o valor total de frete na aba **Impostos**.

## Como corrigir

Ajuste os valores para que o frete total da aba **Impostos** corresponda exatamente à soma do frete dos materiais.
