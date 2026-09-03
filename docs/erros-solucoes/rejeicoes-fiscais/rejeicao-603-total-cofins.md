---
type: rejection
category: fiscal
code: "603"
document: nfe
codigo: "603"
documento: "NF-e"
titulo: "Rejeição 603 - Total do COFINS difere do somatório dos itens"
title: "Total do COFINS difere do somatório dos itens"
mensagem_original: "Rejeição 603: Total do COFINS difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#603"
---

# Rejeição 603 — Total do COFINS difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 603: Total do COFINS difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O total de COFINS informado na NF-e está diferente da soma do COFINS dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total de COFINS na aba **Impostos** não corresponde ao somatório do COFINS dos materiais.

## Como verificar

1. Some o COFINS dos materiais da nota.
2. Compare a soma com o valor total de COFINS na aba **Impostos**.

## Como corrigir

Ajuste os valores para que o COFINS total da aba **Impostos** corresponda exatamente à soma do COFINS dos materiais.
