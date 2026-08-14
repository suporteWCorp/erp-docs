---
type: rejection
category: fiscal
code: "206"
document: nfe
codigo: "206"
documento: "NF-e"
titulo: "Rejeição 206 - NF-e já está inutilizada na Base de Dados da SEFAZ"
title: "NF-e já está inutilizada na Base de Dados da SEFAZ"
mensagem_original: "Rejeição 206: NF-e já está inutilizada na Base de Dados da SEFAZ."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#206"
---

# Rejeição 206 — NF-e já está inutilizada na Base de Dados da SEFAZ

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 206: NF-e já está inutilizada na Base de Dados da SEFAZ.</p>

## Como a SEFAZ interpreta

A numeração informada na NF-e já consta como inutilizada na base da SEFAZ.

## Como isso acontece no WCorp

A rejeição aparece quando a nota está tentando usar uma numeração que já foi inutilizada anteriormente.

## Como verificar

1. Verifique o número e a série da NF-e.
2. Confirme se essa numeração já foi inutilizada.

## Como corrigir

Utilize outra numeração para emitir a nota. No WCorp, desative essa NF-e e refaça a nota do zero.

## Observações

Uma numeração já inutilizada não pode ser reutilizada para autorização de NF-e.
