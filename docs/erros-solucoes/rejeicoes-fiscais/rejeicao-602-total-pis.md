---
type: rejection
category: fiscal
code: "602"
document: nfe
codigo: "602"
documento: "NF-e"
titulo: "Rejeição 602 - Total do PIS difere do somatório dos itens"
title: "Total do PIS difere do somatório dos itens"
mensagem_original: "Rejeição 602: Total do PIS difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#602"
---

# Rejeição 602 — Total do PIS difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 602: Total do PIS difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O total de PIS informado na NF-e está diferente da soma do PIS dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total de PIS na aba **Impostos** não corresponde ao somatório do PIS dos materiais.

## Como verificar

1. Some o PIS dos materiais da nota.
2. Compare a soma com o valor total de PIS na aba **Impostos**.

## Como corrigir

Ajuste os valores para que o PIS total da aba **Impostos** corresponda exatamente à soma do PIS dos materiais.
