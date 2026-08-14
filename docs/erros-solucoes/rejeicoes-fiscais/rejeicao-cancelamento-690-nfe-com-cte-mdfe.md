---
type: rejection
category: fiscal
code: "690"
document: nfe
codigo: "690"
documento: "NF-e / Cancelamento"
titulo: "Rejeição Cancelamento 690 - Pedido de cancelamento para NF-e com CT-e ou MDF-e"
title: "Pedido de cancelamento para NF-e com CT-e ou MDF-e"
mensagem_original: "Rejeição Cancelamento 690: Pedido de cancelamento para NF-e com CT-e ou MDF-e."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#690"
termos_alternativos:
  - "cancelamento 690"
  - "NF-e com CT-e"
  - "NF-e com MDF-e"
---

# Rejeição Cancelamento 690 — Pedido de cancelamento para NF-e com CT-e ou MDF-e

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição Cancelamento 690: Pedido de cancelamento para NF-e com CT-e ou MDF-e.</p>

## Como a SEFAZ interpreta

A NF-e possui CT-e ou MDF-e vinculado, por isso o pedido de cancelamento da NF-e foi rejeitado.

## Como isso acontece no WCorp

Aparece ao tentar cancelar uma NF-e que possui CT-e ou MDF-e relacionado.

## Como verificar

1. Verifique se existe CT-e vinculado à NF-e.
2. Verifique se existe MDF-e vinculado à NF-e.
3. Se algum documento já foi cancelado, aguarde a atualização da SEFAZ antes de nova tentativa.

## Como corrigir

Cancele o CT-e ou MDF-e vinculado à nota. Depois, tente cancelar a NF-e novamente.

## Observações

Se o documento vinculado já tiver sido cancelado, a SEFAZ pode demorar algumas horas para atualizar e liberar o cancelamento da NF-e.
