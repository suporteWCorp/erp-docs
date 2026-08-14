---
type: rejection
category: fiscal
code: "930"
document: nfe
codigo: "930"
documento: "NF-e"
titulo: "Rejeição 930 - CST com benefício fiscal e não informado o código de benefício fiscal"
title: "CST com benefício fiscal e não informado o código de benefício fiscal"
mensagem_original: "Rejeição 930: CST com benefício fiscal e não informado o código de benefício fiscal."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#930"
termos_alternativos:
  - "rejeição 930"
  - "código de benefício fiscal"
  - "CST com benefício fiscal"
---

# Rejeição 930 — CST com benefício fiscal e não informado o código de benefício fiscal

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 930: CST com benefício fiscal e não informado o código de benefício fiscal.</p>

## Como a SEFAZ interpreta

A NF-e informa um CST que exige benefício fiscal, mas o código de benefício fiscal correspondente não foi enviado.

## Como isso acontece no WCorp

Normalmente aparece quando a nota usa uma Regra Fiscal com CST de benefício fiscal, mas o código de benefício não está informado no material ou na regra aplicada.

## Como verificar

1. Verifique o CST usado na nota.
2. Confira se o código de benefício fiscal está informado no(s) material(is).
3. Revise a Natureza de Operação utilizada.
4. Abra a Regra Fiscal usada pela nota.
5. Gere o cálculo novamente antes de transmitir.

## Como corrigir

Na Natureza de Operação utilizada, acesse a Regra Fiscal da nota e informe o código de benefício fiscal no campo localizado abaixo do CFOP.

!!! info "Validação fiscal"
    Confirme com o responsável fiscal ou com a contabilidade qual código de benefício fiscal deve ser usado.

## Observações

Se a nota já tiver sido calculada, recalcule após realizar a alteração.
