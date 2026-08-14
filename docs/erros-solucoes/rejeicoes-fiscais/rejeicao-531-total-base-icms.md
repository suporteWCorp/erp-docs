---
type: rejection
category: fiscal
code: "531"
document: nfe
codigo: "531"
documento: "NF-e"
titulo: "Rejeição 531 - Total da Base de Cálculo do ICMS difere do somatório dos itens"
title: "Total da Base de Cálculo do ICMS difere do somatório dos itens"
mensagem_original: "Rejeição 531: Total da Base de Cálculo do ICMS difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#531"
---

# Rejeição 531 — Total da Base de Cálculo do ICMS difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 531: Total da Base de Cálculo do ICMS difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

A Base de Cálculo total do ICMS da NF-e está diferente da soma das Bases de Cálculo dos itens.

## Como isso acontece no WCorp

Pode aparecer quando a Base de Cálculo do ICMS na aba **Impostos** não corresponde à soma das bases dos materiais.

## Como verificar

1. Some as Bases de Cálculo do ICMS dos materiais.
2. Compare a soma com a Base de Cálculo do ICMS da aba **Impostos**.

## Como corrigir

Ajuste os valores para que a Base de Cálculo do ICMS da aba **Impostos** seja igual à soma das bases dos materiais.
