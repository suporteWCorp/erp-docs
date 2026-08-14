---
type: rejection
category: fiscal
code: "928"
document: nfe
codigo: "928"
documento: "NF-e"
titulo: "Rejeição 928 - Informado código de benefício fiscal para CST sem benefício fiscal"
title: "Informado código de benefício fiscal para CST sem benefício fiscal"
mensagem_original: "Rejeição 928: Informado código de benefício fiscal para CST sem benefício fiscal."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#928"
termos_alternativos:
  - "rejeição 928"
  - "CST sem benefício fiscal"
  - "código de benefício fiscal"
---

# Rejeição 928 — Informado código de benefício fiscal para CST sem benefício fiscal

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 928: Informado código de benefício fiscal para CST sem benefício fiscal.</p>

## Como a SEFAZ interpreta

A NF-e enviou um código de benefício fiscal, mas o CST informado não corresponde a uma tributação com benefício fiscal.

## Como isso acontece no WCorp

Normalmente aparece quando a Regra Fiscal da Natureza de Operação envia o código de benefício fiscal, mas o CST da nota não possui benefício fiscal.

## Como verificar

1. Verifique o CST usado na nota.
2. Confira se o código de benefício fiscal deve mesmo ser informado.
3. Revise a Natureza de Operação utilizada.
4. Abra a Regra Fiscal usada pela nota.

## Como corrigir

Na Natureza de Operação utilizada, acesse a Regra Fiscal da nota e ajuste o código de benefício fiscal ou o CST, que é a Situação Tributária do ICMS.

!!! info "Validação fiscal"
    Confirme com a contabilidade qual CST com benefício fiscal deve ser usado e qual código de benefício fiscal deve ser informado.

## Observações

Se a nota já tiver sido calculada, recalcule após realizar a alteração.
