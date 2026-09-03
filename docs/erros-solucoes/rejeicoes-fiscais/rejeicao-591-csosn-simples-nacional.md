---
type: rejection
category: fiscal
code: "591"
document: nfe
codigo: "591"
documento: "NF-e"
titulo: "Rejeição 591 - CSOSN informado para emitente que não é optante do Simples Nacional"
title: "CSOSN informado para emitente que não é optante do Simples Nacional"
mensagem_original: "Rejeição 591: CSOSN informado para emitente que não é optante do Simples Nacional."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#591"
---

# Rejeição 591 — CSOSN informado para emitente que não é optante do Simples Nacional

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 591: CSOSN informado para emitente que não é optante do Simples Nacional.</p>

## Como a SEFAZ interpreta

A NF-e foi emitida por uma empresa que não está configurada como optante do Simples Nacional, mas a tributação enviada utiliza CSOSN.

## Como isso acontece no WCorp

Pode ocorrer quando o regime tributário da empresa ou a Regra Fiscal aplicada à nota não está coerente com a tributação calculada.

## Como verificar

1. Verifique o regime tributário configurado para a empresa emitente.
2. Confira se a nota gerou CST ou CSOSN na tributação do item.
3. Revise a Natureza de Operação utilizada.
4. Abra a Regra Fiscal aplicada à nota.

## Como corrigir

Ajuste o regime tributário da empresa ou a configuração tributária da Regra Fiscal conforme a situação fiscal correta. Depois, recalcule a nota antes de transmitir novamente.

!!! info "Validação fiscal"
    Confirme com o responsável fiscal ou contábil o regime tributário da empresa e a tributação correta para a operação.

## Observações

Não troque CSOSN por CST sem validar o regime tributário e a regra fiscal aplicável.
