# Nota Fiscal

## Objetivo

A tela **Nota Fiscal** é utilizada para emitir Notas Fiscais de saída no WCorp, de forma manual ou a partir de um **Pedido, Ordem de Serviço ou Pedido de Compra**.

## Caminho

`Faturamento > Nota Fiscal`

Ao iniciar uma nova Nota Fiscal, o sistema permite escolher entre:

- **Pedido / Ordem de Serviço / Pedido de Compra**
- **Manualmente**

## Formas de emissão

### Pedido / Ordem de Serviço / Pedido de Compra

Nesta opção, o WCorp utiliza os dados do documento de origem para montar a Nota Fiscal, trazendo as informações vinculadas ao pedido, ordem de serviço ou pedido de compra.

### Manualmente

Na emissão manual, os dados da Nota Fiscal são informados diretamente no cadastro.

Para uma emissão manual básica, são obrigatórios:

- **Natureza de Operação**
- **Cliente**
- **Material**

Quando necessário, também podem ser informadas parcelas e outras informações disponíveis na Nota Fiscal.

## Campos e áreas principais

A tela apresenta informações como:

- Status
- Natureza de Operação
- Tipo de Operação Presencial
- Meio de Pagamento
- Operação Destinatário
- Número
- Série
- Data/Hora de Emissão
- Data/Hora de Saída
- Dados do Destinatário
- Endereço do Destinatário

O cadastro também possui as abas:

- **Materiais**
- **Endereço de Envio**
- **Transportador**
- **Impostos**
- **Parcelas**
- **NFe Referenciada**

## Cálculo automático da Nota Fiscal

A opção **Ativar Cálculo da Nota Fiscal Automaticamente** controla o cálculo automático da Nota Fiscal.

Quando a opção está marcada, o cálculo de impostos é realizado automaticamente pelo sistema tanto nas Notas Fiscais criadas manualmente quanto nas geradas a partir de Pedido, Ordem de Serviço ou Pedido de Compra.

Quando a opção está desmarcada, o cálculo automático não é realizado.

## Ações da Nota Fiscal

Conforme a situação da Nota Fiscal, a tela disponibiliza ações como:

- **Transmitir para o Sefaz**
- **Cancelar NFe**
- **Pedidos / OS / Pedidos de Compra da NFe**
- **Criar DANFE da NFe**
- **Salvar XML da NFe**
- **Pré-Visualizar DANFE**

Na parte superior da tela também é possível consultar as Notas Fiscais cadastradas e acompanhar informações como número, data de emissão, destinatário, CNPJ, total e status.

## Veja também

- [Como emitir uma NF-e](../como-fazer/faturar-nota.md){: target="_blank" rel="noopener" }
- [Como cancelar uma NF-e](../como-fazer/cancelar-nfe.md){: target="_blank" rel="noopener" }
- [Como emitir uma carta de correção](../como-fazer/emitir-carta-correcao.md){: target="_blank" rel="noopener" }
