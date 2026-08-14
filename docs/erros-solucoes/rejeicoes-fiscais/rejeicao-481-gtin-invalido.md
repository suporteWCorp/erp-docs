---
type: rejection
category: fiscal
code: "481"
document: nfe
codigo: "481"
documento: "NF-e"
titulo: "Rejeição 481 - Código GTIN inválido"
title: "Código GTIN inválido"
mensagem_original: "Rejeição 481: Código GTIN inválido."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#481"
---

# Rejeição 481 — Código GTIN inválido

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 481: Código GTIN inválido.</p>

## Como a SEFAZ interpreta

O código GTIN informado no item não atende ao padrão esperado.

## Como isso acontece no WCorp

A rejeição aparece quando o código de barras informado no material é inválido.

## Como verificar

1. Acesse o cadastro do material.
2. Verifique o campo **EAN** ou **EAN tributário**.
3. Confira se o código informado é válido.

## Como corrigir

No cadastro do material, informe um código válido no campo **EAN** ou **EAN tributário**, ou deixe o campo vazio quando permitido.
