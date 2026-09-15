# Nota Fiscal

## Objetivo

A tela **Nota Fiscal** permite emitir NF-e de saída no WCorp de forma manual ou a partir de um **Pedido**, uma **Ordem de Serviço** ou um **Pedido de Compra**.

## Caminho

`Faturamento > Nota Fiscal`.

## Quando usar

- Emitir uma NF-e de saída manualmente.
- Gerar uma NF-e a partir de um pedido, uma ordem de serviço ou um pedido de compra.
- Consultar as notas fiscais cadastradas e acompanhar seu status.

## Como usar

### Tipo de documento

Ao iniciar uma nova NF-e, o sistema permite escolher entre:
- **Pedido / Ordem de Serviço / Pedido de Compra**
- **Manualmente**

#### Pedido / Ordem de Serviço / Pedido de Compra

O WCorp utiliza os dados do documento de origem para montar a NF-e e carregar as informações vinculadas ao pedido, à ordem de serviço ou ao pedido de compra.

#### Manualmente

Na emissão manual, informe os dados da NF-e diretamente no cadastro. Para uma emissão manual básica, são obrigatórios: **Natureza de Operação**, **Cliente** e **Material**. Quando necessário, informe também as parcelas e as demais informações disponíveis na tela.

### Campos e áreas principais

- **Status**
- **Natureza de Operação**
- **Tipo de Operação Presencial**
- **Meio de Pagamento**
- **Operação Destinatário**
- **Número**
- **Série**
- **Data/Hora de Emissão**
- **Data/Hora de Saída**
- **Dados do Destinatário**
- **Endereço do Destinatário**

Abas: **Materiais**, **Endereço de Envio**, **Transportador**, **Impostos**, **Parcelas**, **NFe Referenciada**.

### Cálculo automático da Nota Fiscal

A opção **Ativar Cálculo da Nota Fiscal Automaticamente** controla o cálculo automático da Nota Fiscal.
- Marcada: o sistema calcula os impostos automaticamente nas NF-e criadas manualmente e nas geradas a partir de pedido, ordem de serviço ou pedido de compra.
- Desmarcada: o cálculo automático não é realizado.

### Consulta e ações disponíveis

Na parte superior da tela, consulte as notas fiscais cadastradas e acompanhe informações como número, data de emissão, destinatário, CNPJ, total e status.

Conforme a situação da NF-e, a tela disponibiliza ações como:
- **Transmitir para o Sefaz**
- **Cancelar NFe**
- **Pedidos / OS / Pedidos de Compra da NFe**
- **Criar DANFE da NFe**
- **Salvar XML da NFe**
- **Pré-Visualizar DANFE**

## Avisos

<!-- TODO: adicionar Avisos -->

## Dúvidas frequentes

<!-- TODO: adicionar Dúvidas frequentes -->

## Veja também

- [Como emitir uma NF-e](../como-fazer/faturar-nota.md){: target="_blank" rel="noopener" }
- [Como cancelar uma NF-e](../como-fazer/cancelar-nfe.md){: target="_blank" rel="noopener" }
- [Como emitir uma carta de correção](../como-fazer/emitir-carta-correcao.md){: target="_blank" rel="noopener" }
