# Entrada de Nota Fiscal

## Objetivo

A tela **Entrada de Nota Fiscal** é utilizada para registrar documentos fiscais de entrada no WCorp, incluindo operações vinculadas a fornecedores ou clientes.

## Caminho

`Faturamento > Entrada de Nota Fiscal`.

## Quando usar

- Registrar documentos fiscais de entrada vinculados a fornecedores ou clientes.
- Preencher uma entrada a partir de um arquivo XML, do Radar de NFe ou de um pedido de compra.
- Consultar os dados fiscais, os materiais, os serviços e as demais informações da entrada.

## Como usar

### Informações obrigatórias

Para salvar uma entrada de nota fiscal, informe: **Fornecedor ou Cliente**, **Natureza de Operação**, **Número da Nota Fiscal**, **Série** e pelo menos um **Material ou Serviço**.

### Formas de importar os dados

- **Selecionar XML NFe:** permite selecionar um arquivo XML salvo no computador e carregar os dados da NF-e.
- **Importar do Radar de NFe:** permite importar uma NF-e disponível no Radar de NFe.
- **Preencher dados via Pedido de Compra:** permite utilizar um Pedido de Compra na rotina de preenchimento da entrada.

### Informações da nota

Campos: **Pedido de Compra**, **Chave de Acesso**, **Tipo**, **Data de Emissão**, **Data de Entrada**, **Data de Registro**.

Abas: **Materiais**, **Serviços**, **Transporte**, **Parcelas (Contas a Pagar)**, **Inspeção**, **Arquivos**.

### Materiais

Ao adicionar um material à Nota Fiscal de Entrada, informe: **Material**, **Local de Armazenagem**, **CFOP**, **CFOP NF**, **CST**, **Quantidade**.

A aba **Materiais** oferece as opções **Abastecer Estoque com Materiais** e **Atualizar Custo dos Materiais**.

### Validações

Ao salvar, o WCorp valida os dados necessários. Se alguma informação obrigatória do material estiver ausente, o sistema pode apresentar a pendência antes de permitir a conclusão.

Validações identificadas: **CFOP do Material**, **CFOP da Nota Fiscal**, **CST**.

## Avisos

<!-- TODO: adicionar Avisos -->

## Dúvidas frequentes

<!-- TODO: adicionar Dúvidas frequentes -->

## Veja também

<!-- TODO: adicionar Veja também -->
