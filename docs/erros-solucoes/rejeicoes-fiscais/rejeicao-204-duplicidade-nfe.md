---
type: rejection
category: fiscal
code: "204"
document: nfe
codigo: "204"
documento: "NF-e"
titulo: "Rejeição 204 - Duplicidade de NF-e"
title: "Duplicidade de NF-e"
mensagem_original: "Rejeição 204: Duplicidade de NF-e."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#204"
---

# Rejeição 204 — Duplicidade de NF-e

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 204: Duplicidade de NF-e.</p>

## Como a SEFAZ interpreta

Já existe uma NF-e autorizada na SEFAZ com a mesma numeração, série, CNPJ emitente e modelo.

## Como isso acontece no WCorp

O material revisado orienta que o Suporte deve verificar o ID da Nota Fiscal quando essa rejeição ocorrer.

## Como verificar

1. Verifique número e série da NF-e.
2. Confira o CNPJ emitente.
3. Separe o ID da Nota Fiscal para análise.

## Como corrigir

O Suporte deve verificar a NF-e a partir do ID da Nota Fiscal.

## Observações

Esta rejeição continua sendo fiscal, mesmo quando a análise precisa ser feita pelo Suporte.
