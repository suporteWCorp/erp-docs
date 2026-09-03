---
type: rejection
category: fiscal
code: "778"
document: nfe
codigo: "778"
documento: "NF-e"
titulo: "Rejeição 778 - NCM inexistente"
title: "NCM inexistente"
mensagem_original: "Rejeição 778: NCM inexistente."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#778"
---

# Rejeição 778 — NCM inexistente

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 778: NCM inexistente.</p>

## Como a SEFAZ interpreta

O NCM informado em algum item da NF-e não existe ou não é reconhecido na validação fiscal.

## Como isso acontece no WCorp

Pode aparecer quando o NCM cadastrado no material ou produto está incorreto, incompleto ou desatualizado.

## Como verificar

1. Acesse o cadastro do material ou produto informado na NF-e.
2. Verifique o campo **NCM**.
3. Confira se o código possui o formato esperado e está correto para o item.

## Como corrigir

No cadastro do material ou produto, corrija o NCM e salve. Depois, recalcule a nota antes de transmitir novamente.

!!! info "Classificação fiscal"
    Em caso de dúvida sobre qual NCM utilizar, valide a classificação com o responsável fiscal ou contábil.

## Observações

Não escolha um NCM por aproximação sem validação fiscal.
