---
type: rejection
category: fiscal
code: "109"
document: nfe
codigo: "109"
documento: "NF-e"
titulo: "Rejeição 109 - Serviço Paralisado sem Previsão"
title: "Serviço Paralisado sem Previsão"
mensagem_original: "Rejeição 109: Serviço Paralisado sem Previsão."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#109"
termos_alternativos:
  - "SEFAZ indisponível"
  - "instabilidade SEFAZ"
---

# Rejeição 109 — Serviço Paralisado sem Previsão

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 109: Serviço Paralisado sem Previsão.</p>

## Como a SEFAZ interpreta

O serviço autorizador da SEFAZ está paralisado e sem previsão de retorno no momento da tentativa.

## Como isso acontece no WCorp

A rejeição aparece durante a tentativa de transmissão quando o ambiente da SEFAZ está indisponível.

## Como verificar

1. Verifique se a mensagem é de indisponibilidade da SEFAZ.
2. Aguarde a normalização do serviço autorizador.
3. Tente transmitir novamente depois.

## Como corrigir

Não há ajuste no WCorp para essa rejeição. Aguarde a normalização da SEFAZ e tente transmitir novamente.

## Observações

A correção depende da disponibilidade da SEFAZ.
