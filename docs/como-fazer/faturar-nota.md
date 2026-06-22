---
error_area: "Documentos Fiscais"
error_category: "NF-e"
error_tags:
  - "nfe"
  - "sefaz"
  - "faturamento"
  - "transmissao"
---

# Como emitir uma NF-e

## Pré-requisitos

!!! prerequisite "Antes de começar"
    - Cliente cadastrado: [Como cadastrar um cliente](cadastrar-cliente.md){: target="_blank" rel="noopener" }.
    - Material cadastrado: [Como cadastrar um material](cadastrar-material.md){: target="_blank" rel="noopener" }.
    - Natureza de operação cadastrada: [Como cadastrar uma natureza de operação](cadastrar-natureza-operacao.md){: target="_blank" rel="noopener" }.
    - Pedido criado, quando a emissão for por pedido: [Como gerar um pedido](fazer-pedido-venda.md){: target="_blank" rel="noopener" }.
    - Certificado e parâmetros fiscais configurados.

## Avisos

--8<-- "shared/avisos/validacao-fiscal.md"

## Permissões

--8<-- "shared/avisos/permissoes.md"

## Caminho
`Faturamento > Nota Fiscal`.

## Print do caminho
![Onde encontrar](../assets/images/guias/faturamento_emitir_nfe.png)

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

## Demonstração em vídeo
<video class="wc-video" controls preload="auto" playsinline>
  <source src="../../assets/videos/faturamento_nfe.mp4" type="video/mp4">
  Seu navegador não conseguiu reproduzir este vídeo.
</video>

## Quando utilizar

Use quando for necessário documentar fiscalmente uma venda, remessa ou outra operação de saída.

## Veja também

- [Como cancelar uma NF-e](cancelar-nfe.md){: target="_blank" rel="noopener" }
- [Como emitir uma devolução](emitir-devolucao.md){: target="_blank" rel="noopener" }
- [Como emitir uma carta de correção](emitir-carta-correcao.md){: target="_blank" rel="noopener" }
- [Manual > Faturamento > Nota Fiscal](../faturamento/faturamento-nf.md){: target="_blank" rel="noopener" }
