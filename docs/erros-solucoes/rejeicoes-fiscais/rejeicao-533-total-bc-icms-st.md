---
type: rejection
category: fiscal
code: "533"
document: nfe
codigo: "533"
documento: "NF-e"
titulo: "Rejeição 533 - Total da BC ICMS-ST difere do somatório dos itens"
title: "Total da BC ICMS-ST difere do somatório dos itens"
mensagem_original: "Rejeição 533: Total da BC ICMS-ST difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#533"
---

# Rejeição 533 — Total da BC ICMS-ST difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 533: Total da BC ICMS-ST difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

A Base de Cálculo total do ICMS-ST da NF-e está diferente da soma das Bases de Cálculo do ICMS-ST dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total de BC ICMS-ST na aba **Impostos** não corresponde ao somatório do campo `vBCST` dos materiais.

## Como verificar

1. Some as Bases de Cálculo do ICMS-ST dos materiais.
2. Compare a soma com a Base de Cálculo do ICMS-ST da aba **Impostos**.

## Como corrigir

Ajuste os valores para que a Base de Cálculo do ICMS-ST da aba **Impostos** seja igual à soma das bases dos materiais.
