---
type: rejection
category: fiscal
code: "866"
document: nfe
codigo: "866"
documento: "NF-e"
titulo: "Rejeição 866 - Ausência de troco"
title: "Ausência de troco quando o valor dos pagamentos informados for maior que o total da nota"
mensagem_original: "Rejeição 866: Ausência de troco quando o valor dos pagamentos informados for maior que o total da nota."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#866"
---

# Rejeição 866 — Ausência de troco

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 866: Ausência de troco quando o valor dos pagamentos informados for maior que o total da nota.</p>

## Como a SEFAZ interpreta

Os pagamentos informados são maiores que o total da NF-e, mas o valor de troco não foi informado.

## Como isso acontece no WCorp

Pode ocorrer quando o total da nota na aba **Imposto** não bate com o valor informado na(s) parcela(s).

## Como verificar

1. Confira o valor total da nota na aba **Imposto**.
2. Some o valor informado na(s) parcela(s).
3. Compare os valores.

## Como corrigir

Ajuste os valores para que o total da nota corresponda ao(s) valor(es) da(s) parcela(s), ou informe o troco quando aplicável.
