# Como emitir uma NF-e

## Objetivo

Emitir uma nota fiscal eletrônica de saída, de forma manual ou vinculada a um pedido.

## Quando utilizar

Use quando for necessário documentar fiscalmente uma venda, remessa ou outra operação de saída.

## Pré-requisitos

- Cliente cadastrado.<br>
  [Como cadastrar um cliente](cadastrar-cliente.md){: target="_blank" rel="noopener" }.
- Material cadastrado.<br>
  [Como cadastrar um material](cadastrar-material.md){: target="_blank" rel="noopener" }.
- Natureza de operação cadastrada.<br>
  [Como cadastrar uma natureza de operação](cadastrar-natureza-operacao.md){: target="_blank" rel="noopener" }.
- Pedido criado, quando a emissão for por pedido.<br>
  [Como gerar um pedido](fazer-pedido-venda.md){: target="_blank" rel="noopener" }.
- Certificado e parâmetros fiscais configurados.

--8<-- "shared/avisos/validacao-fiscal.md"

--8<-- "shared/avisos/permissoes.md"

## Onde encontrar

Caminho: `Faturamento > Nota Fiscal`.

![Onde encontrar](../assets/images/guias/faturamento_emitir_nfe.png)

## Como fazer

1. Acesse **Faturamento > Nota Fiscal**.
2. Escolha emissão manual ou por pedido.
3. Se for por pedido, adicione o pedido correspondente.
4. Confira cliente, itens, valores e impostos.
5. Salve a nota.
6. Clique em **Transmitir**.
7. Confira o retorno da SEFAZ.

## Erros comuns

- Cliente não encontrado: veja [Como cadastrar um cliente](cadastrar-cliente.md).
- Material sem informação fiscal: veja [Como cadastrar um material](cadastrar-material.md).
- Natureza incorreta ou ausente: veja [Como cadastrar uma natureza de operação](cadastrar-natureza-operacao.md).
- Rejeição da SEFAZ: copie a mensagem completa e consulte [Suporte > Base de erros](../suporte/base-de-erros.md).

## Veja também

- [Como cancelar uma NF-e](cancelar-nfe.md){: target="_blank" rel="noopener" }
- [Como emitir uma devolução](emitir-devolucao.md){: target="_blank" rel="noopener" }
- [Como emitir uma carta de correção](emitir-carta-correcao.md){: target="_blank" rel="noopener" }
- [Manual > Faturamento > Nota Fiscal](../faturamento/faturamento-nf.md){: target="_blank" rel="noopener" }
