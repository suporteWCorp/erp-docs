---
type: rejection
category: fiscal
code: "904"
document: nfe
codigo: "904"
documento: "NF-e"
titulo: "Rejeição 904 - Informado indevidamente campo valor de pagamento"
title: "Informado indevidamente campo valor de pagamento"
mensagem_original: "Rejeição 904: Informado indevidamente campo valor de pagamento."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#904"
---

# Rejeição 904 — Informado indevidamente campo valor de pagamento

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 904: Informado indevidamente campo valor de pagamento.</p>

## Como a SEFAZ interpreta

A NF-e enviou informação de pagamento em uma situação em que esse campo não deve ser informado.

## Como isso acontece no WCorp

No material revisado, o caso citado ocorre quando há parcela(s) em uma nota de devolução.

## Como verificar

1. Verifique se a nota é de devolução.
2. Confira se existem parcelas informadas na nota.

## Como corrigir

Se a NF-e for de devolução, exclua a(s) parcela(s), pois notas de devolução não devem possuir parcelas.
