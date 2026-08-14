---
type: rejection
category: fiscal
code: "280"
document: nfe
codigo: "280"
documento: "NF-e"
titulo: "Rejeição 280 - Certificado Digital inválido"
title: "Certificado Digital inválido"
mensagem_original: "Rejeição 280: Certificado Digital inválido."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#280"
---

# Rejeição 280 — Certificado Digital inválido

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 280: Certificado Digital inválido.</p>

## Como a SEFAZ interpreta

O certificado digital usado na transmissão não é válido para autorizar a solicitação.

## Como isso acontece no WCorp

Pode ocorrer quando o certificado está vencido, revogado ou incompatível com a empresa emissora.

## Como verificar

1. Verifique a validade do certificado digital instalado.
2. Confirme se o certificado pertence à empresa emitente.
3. Confira se o emissor está selecionando o certificado correto.

## Como corrigir

Reinicie o emissor e selecione o certificado correto para a empresa correta.
