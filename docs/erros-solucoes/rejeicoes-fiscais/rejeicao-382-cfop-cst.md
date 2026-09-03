---
type: rejection
category: fiscal
code: "382"
document: nfe
codigo: "382"
documento: "NF-e"
titulo: "Rejeição 382 - CFOP não permitido para o CST informado"
title: "CFOP não permitido para o CST informado"
mensagem_original: "Rejeição 382: CFOP não permitido para o CST informado."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#382"
---

# Rejeição 382 — CFOP não permitido para o CST informado

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 382: CFOP não permitido para o CST informado.</p>

## Como a SEFAZ interpreta

O CFOP informado na NF-e não é compatível com o CST utilizado na tributação do item.

## Como isso acontece no WCorp

Pode aparecer quando a Regra Fiscal da Natureza de Operação calcula um CFOP que não condiz com o CST aplicado ao material.

## Como verificar

1. Verifique o CFOP calculado no item da NF-e.
2. Confira o CST informado na tributação do item.
3. Revise a Natureza de Operação utilizada.
4. Abra a Regra Fiscal aplicada à nota.

## Como corrigir

Na Natureza de Operação utilizada, acesse a Regra Fiscal da nota e ajuste a configuração tributária para que o CFOP e o CST fiquem coerentes com a operação. Depois, recalcule a nota antes de transmitir novamente.

!!! info "Validação fiscal"
    Confirme com o responsável fiscal ou contábil qual CFOP e qual CST devem ser usados na operação.

## Observações

Não altere CFOP ou CST sem validar a regra fiscal aplicável à operação.
