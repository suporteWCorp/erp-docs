---
type: rejection
category: fiscal
code: "233"
document: nfe
codigo: "233"
documento: "NF-e"
titulo: "Rejeição 233 - IE do destinatário não cadastrada"
title: "IE do destinatário não cadastrada"
mensagem_original: "Rejeição 233: IE do destinatário não cadastrada."
modulo_relacionado: "Faturamento"
base_oficial: "assets/data/nfe-rejeicoes.json#233"
---

# Rejeição 233 — IE do destinatário não cadastrada

<p class="wc-rejection-meta"><span class="wc-rejection-doc-badge">NF-e</span></p>

<p class="wc-rejection-message"><strong>Mensagem SEFAZ</strong>Rejeição 233: IE do destinatário não cadastrada.</p>

## Como a SEFAZ interpreta

A Inscrição Estadual do destinatário informada na NF-e não está cadastrada.

## Como isso acontece no WCorp

Pode aparecer quando a Inscrição Estadual do cliente está incorreta no cadastro ou quando o campo da NF-e foi preenchido com uma IE inválida.

## Como verificar

1. Verifique a Inscrição Estadual no cadastro do cliente.
2. Confira o Indicador de IE da NF-e.
3. Na NF-e, revise o campo **I.E** ao lado do Indicador de IE.

## Como corrigir

Acesse **Comercial > Clientes**, corrija o campo **Inscrição Estadual** no cadastro do cliente e salve. Depois, dentro da NF-e, ajuste o campo **I.E** para emitir novamente.

!!! info "Validação fiscal"
    Confirme se o destinatário deve ser tratado como contribuinte, isento ou não contribuinte.
