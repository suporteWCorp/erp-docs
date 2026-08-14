---
type: rejection
category: fiscal
code: "564"
document: nfe
codigo: "564"
documento: "NF-e"
titulo: "Rejeição 564 - Total do Produto / Serviço difere do somatório dos itens"
title: "Total do Produto / Serviço difere do somatório dos itens"
mensagem_original: "Rejeição 564: Total do Produto / Serviço difere do somatório dos itens."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#564"
---

# Rejeição 564 — Total do Produto / Serviço difere do somatório dos itens

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 564: Total do Produto / Serviço difere do somatório dos itens.</p>

## Como a SEFAZ interpreta

O total de produtos ou serviços informado na NF-e não corresponde ao somatório dos itens.

## Como isso acontece no WCorp

Pode aparecer quando o valor total dos produtos na aba **Imposto** está diferente da soma dos itens da NF-e.

## Como verificar

1. Some o total de todos os itens da NF-e.
2. Compare com o valor total dos produtos na aba **Imposto**.

## Como corrigir

Ajuste os valores para que o total dos produtos corresponda exatamente ao somatório dos itens.
