---
type: rejection
category: fiscal
code: "600"
document: nfe
codigo: "600"
documento: "NF-e"
titulo: "Rejeição 600 - CSOSN incompatível na operação com Não Contribuinte"
title: "CSOSN incompatível na operação com Não Contribuinte"
mensagem_original: "Rejeição 600: CSOSN incompatível na operação com Não Contribuinte."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#600"
---

# Rejeição 600 — CSOSN incompatível na operação com Não Contribuinte

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 600: CSOSN incompatível na operação com Não Contribuinte.</p>

## Como a SEFAZ interpreta

O CSOSN informado é incompatível com operação destinada a não contribuinte.

## Como isso acontece no WCorp

Pode ocorrer quando a nota está com Indicador de IE como **Não contribuinte**, mas a Regra Fiscal calculou um CSOSN incompatível.

## Como verificar

1. Verifique se o Indicador de IE deve ser **Não contribuinte**.
2. Confira o CSOSN calculado para a nota.
3. Revise a Regra Fiscal aplicada.

## Como corrigir

Ajuste o CSOSN na regra fiscal aplicável ou corrija o Indicador de IE, conforme a situação fiscal do cliente. Depois, recalcule a nota.

!!! info "Validação fiscal"
    Confirme com a contabilidade qual CSOSN deve ser usado se o cliente realmente for Não contribuinte.

## Observações

Se a nota já tiver sido calculada, recalcule após realizar a alteração.
