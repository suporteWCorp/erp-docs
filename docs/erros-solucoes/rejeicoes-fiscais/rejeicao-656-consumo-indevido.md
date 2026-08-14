---
type: rejection
category: fiscal
code: "656"
document: nfe
codigo: "656"
documento: "NF-e"
titulo: "Rejeição 656 - Consumo indevido"
title: "Consumo indevido"
mensagem_original: "Rejeição 656: Consumo Indevido."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#656"
termos_alternativos:
  - "consumo indevido"
  - "rejeição 656"
  - "bloqueio temporário SEFAZ"
---

# Rejeição 656 — Consumo indevido

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 656: Consumo Indevido.</p>

## Como a SEFAZ interpreta

A SEFAZ identificou uso excessivo do serviço, como muitas consultas ou transmissões em curto intervalo para o mesmo CNPJ.

## Como isso acontece no WCorp

Pode aparecer após várias tentativas de consulta ou transmissão da NF-e em sequência.

## Como verificar

1. Verifique se houve muitas consultas ou tentativas de transmissão em pouco tempo.
2. Interrompa novas tentativas enquanto o bloqueio estiver ativo.
3. Aguarde a liberação temporária do serviço para o CNPJ.

## Como corrigir

Aguarde cerca de 1 hora antes de tentar transmitir a nota novamente.

## Observações

Evite reenviar a NF-e repetidamente enquanto o bloqueio temporário estiver ativo.
