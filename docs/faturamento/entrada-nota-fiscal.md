# Entrada de Nota Fiscal

A tela **Entrada de Nota Fiscal** é utilizada para registrar documentos fiscais de entrada no WCorp, incluindo operações vinculadas a fornecedores ou clientes.

## Caminho

`Faturamento > Entrada de Nota Fiscal`

## Informações obrigatórias

Para salvar uma Entrada de Nota Fiscal, é necessário informar:

- **Fornecedor ou Cliente**
- **Natureza de Operação**
- **Número da Nota Fiscal**
- **Série**
- Pelo menos um **Material ou Serviço**

## Formas de importar os dados

A tela oferece opções para facilitar o preenchimento da entrada:

- **Selecionar XML NFe:** permite selecionar um arquivo XML salvo no computador e carregar os dados da NF-e.
- **Importar do Radar de NFe:** permite importar uma NF-e disponível no Radar de NFe.
- **Preencher dados via Pedido de Compra:** permite utilizar um Pedido de Compra na rotina de preenchimento da entrada.

## Informações da nota

Além dos dados obrigatórios, a tela apresenta campos como:

- Pedido de Compra
- Chave de Acesso
- Tipo
- Data de Emissão
- Data de Entrada
- Data de Registro

A tela também é organizada nas abas:

- **Materiais**
- **Serviços**
- **Transporte**
- **Parcelas (Contas a Pagar)**
- **Inspeção**
- **Arquivos**

## Materiais

Ao adicionar um material à Nota Fiscal de Entrada, é necessário informar:

- **Material**
- **Local de Armazenagem**
- **CFOP**
- **CFOP NF**
- **CST**
- **Quantidade**

A tela do material também apresenta informações da Nota Fiscal, dados de entrada no sistema, impostos, lotes e saldos de estoque.

Na aba **Materiais**, estão disponíveis as opções **Abastecer Estoque com Materiais** e **Atualizar Custo dos Materiais**.

## Validações

Ao salvar, o WCorp valida os dados necessários para a operação. Caso alguma informação obrigatória do material esteja ausente, o sistema pode apresentar a pendência antes de permitir a conclusão.

Entre as validações identificadas estão:

- CFOP do Material
- CFOP da Nota Fiscal
- CST

