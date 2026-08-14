---
type: rejection
category: fiscal
code: "733"
document: nfe
codigo: "733"
documento: "NF-e"
titulo: "Rejeição 733 - CFOP de operação interna e idDest <> 1"
title: "CFOP de operação interna e idDest <> 1"
mensagem_original: "Rejeição 733: CFOP de operação interna e idDest <> 1."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#733"
---

# Rejeição 733 — CFOP de operação interna e idDest <> 1

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 733: CFOP de operação interna e idDest &lt;&gt; 1.</p>

## Como a SEFAZ interpreta

O CFOP informado indica operação interna, mas o indicador de destino da NF-e não está como operação interna.

## Como isso acontece no WCorp

Pode aparecer quando o CFOP da Regra Fiscal não condiz com a operação da nota, interna ou interestadual.

## Como verificar

1. Verifique se a operação é interna ou interestadual.
2. Confira o CFOP calculado na nota.
3. Acesse a Natureza de Operação utilizada.
4. Revise a Regra Fiscal usada pela nota.

## Como corrigir

Na Natureza de Operação utilizada, acesse a Regra Fiscal da nota e ajuste o CFOP.

!!! info "Validação fiscal"
    Confirme com o responsável fiscal se o CFOP condiz com a operação.

## Observações

Se a nota já tiver sido calculada, recalcule após realizar a alteração.
