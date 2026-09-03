---
id: faturar-nota
title: Como emitir uma NF-e
type: guia
category: Faturamento
status: published
tags:
  - nfe
  - sefaz
  - faturamento
  - transmissao
---

# Como emitir uma NF-e

## Pré-requisitos

- Cliente cadastrado<br>
  [Como cadastrar um cliente.](cadastrar-cliente.md){: target="_blank" rel="noopener" }
- Material cadastrado<br>
  [Como cadastrar um material.](cadastrar-material.md){: target="_blank" rel="noopener" }
- Natureza de operação cadastrada<br>
  [Como cadastrar uma natureza de operação.](cadastrar-natureza-operacao.md){: target="_blank" rel="noopener" }
- Pedido criado, quando a emissão for por pedido<br>
  [Como gerar um pedido](fazer-pedido-venda.md){: target="_blank" rel="noopener" }
- Certificado e parâmetros fiscais configurados

## Permissões

--8<-- "shared/avisos/permissoes.md"

## Caminho

![Onde encontrar](../assets/images/guias/faturamento_emitir_nfe.png)

## Demonstração em vídeo

[Demonstração da emissão de NF-e](../assets/videos/faturamento_nfe.mp4){ .wc-video-link }

## Como fazer

1. Acesse **Faturamento > Nota Fiscal**.
2. Escolha emissão manual ou por pedido.
3. Se for por pedido, adicione o pedido correspondente.
4. Salve a nota.
5. Clique em **Transmitir**.
6. Confira o retorno da SEFAZ.

**O que conferir antes de salvar ou enviar**

- Cliente.
- Itens e quantidades.
- Valores.
- Impostos aplicados.

**Resultado esperado**

A NF-e é transmitida e, quando os dados são aceitos pela SEFAZ, fica autorizada para consulta.

## Avisos

--8<-- "shared/avisos/validacao-fiscal.md"

## Veja também

- [Como cancelar uma NF-e](cancelar-nfe.md){: target="_blank" rel="noopener" }
- [Como emitir uma devolução](emitir-devolucao.md){: target="_blank" rel="noopener" }
- [Como emitir uma carta de correção](emitir-carta-correcao.md){: target="_blank" rel="noopener" }
- [Consultar manual de nota fiscal](../faturamento/faturamento-nf.md){: target="_blank" rel="noopener" }
