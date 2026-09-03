---
type: rejection
category: fiscal
code: "386"
document: nfe
codigo: "386"
documento: "NF-e"
titulo: "Rejeição 386 - CFOP não permitido para o CSOSN informado"
title: "CFOP não permitido para o CSOSN informado"
mensagem_original: "Rejeição 386: CFOP não permitido para o CSOSN informado."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#386"
---

# Rejeição 386 — CFOP não permitido para o CSOSN informado

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 386: CFOP não permitido para o CSOSN informado.</p>

## Como a SEFAZ interpreta

O CFOP informado na NF-e não é compatível com o CSOSN utilizado na tributação do item.

## Como isso acontece no WCorp

Pode aparecer quando a Regra Fiscal da Natureza de Operação calcula um CFOP que não condiz com o CSOSN aplicado ao material.

## Como verificar

1. Verifique o CFOP calculado no item da NF-e.
2. Confira o CSOSN informado na tributação do item.
3. Revise a Natureza de Operação utilizada.
4. Abra a Regra Fiscal aplicada à nota.

## Como corrigir

Na Natureza de Operação utilizada, acesse a Regra Fiscal da nota e ajuste a configuração tributária para que o CFOP e o CSOSN fiquem coerentes com a operação. Depois, recalcule a nota antes de transmitir novamente.

!!! info "Validação fiscal"
    Confirme com o responsável fiscal ou contábil qual CFOP e qual CSOSN devem ser usados na operação.

## Observações

Não altere CFOP ou CSOSN sem validar a regra fiscal aplicável à operação.
