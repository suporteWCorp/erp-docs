# Natureza de Operação

## Objetivo

A tela **Natureza de Operação** permite cadastrar as operações disponíveis no WCorp e vincular a elas as regras fiscais usadas durante o faturamento.

A natureza de operação não funciona apenas como uma descrição da movimentação. Ao selecioná-la em uma nota fiscal, o sistema consulta suas regras fiscais para identificar qual configuração é compatível com os dados da operação e deve ser utilizada no cálculo.

A tela reúne recursos para:
- cadastrar e consultar naturezas de operação;
- definir a descrição e os dados gerais de cada natureza;
- adicionar uma ou mais regras fiscais;
- organizar as regras conforme o tipo de operação;
- revisar os critérios utilizados pelo WCorp durante o cálculo da nota fiscal.

## Caminho

`Administração > Natureza de Operação`.

## Quando usar

Use esta tela para cadastrar ou consultar naturezas de operação, vincular regras fiscais e revisar os critérios utilizados pelo WCorp no cálculo da nota fiscal.

## Como usar

### Cadastro e consulta

Cadastre a descrição e os dados gerais da natureza de operação ou consulte os registros existentes.

### Adicionar Regra

Após criar e salvar uma natureza de operação, o botão **Adicionar Regra** permite cadastrar uma regra fiscal vinculada a ela.
Uma mesma natureza pode possuir várias regras, permitindo que o WCorp escolha configurações diferentes conforme os dados do cliente, do item e da operação realizada.

### Abas de Regras

As regras fiscais são organizadas nas seguintes abas:
- **Simples**: regras para operações tratadas nessa modalidade pelo WCorp.
- **Normal**: regras para operações normais do sistema.
- **Transporte**: regras para operações de transporte.
- **Serviço**: regras para operações de serviço.

As abas separam os contextos de utilização das regras. A definição da aba e o preenchimento dos campos devem seguir a orientação do responsável fiscal da empresa.

### Critérios de aplicação

Uma regra fiscal pode ser configurada para ser aplicada por:
- **Categoria de Material**
- **NCM**
- **Material**

Os campos **Grupo de Cliente** e **Indicador de Inscrição Estadual** são opcionais. Os demais campos devem ser configurados de acordo com o cenário da operação e com a orientação do responsável fiscal.

Quando um campo numérico não possuir valor, ele deve permanecer preenchido com `0`, quando aplicável.

### Relação com o faturamento

Durante o cálculo da nota fiscal, o WCorp utiliza a natureza de operação selecionada para localizar suas regras fiscais. Em seguida, compara os critérios de cada regra com os dados da operação, como cliente, estado e item faturado.

Quando encontra uma regra compatível, o sistema utiliza essa configuração no cálculo da nota. Quando nenhuma regra atende aos dados informados, o cálculo automático pode não ser finalizado.

Configuração em sequência:
1. A natureza de operação identifica a operação realizada.
2. As regras fiscais vinculadas definem os cenários disponíveis para essa natureza.
3. Os critérios de aplicação determinam qual regra é compatível com os dados da nota.
4. O faturamento utiliza a regra encontrada durante o cálculo.

## Avisos

Defina o conteúdo fiscal de cada campo conforme a orientação do responsável fiscal da empresa.

## Dúvidas frequentes

<!-- TODO: adicionar Dúvidas frequentes -->

## Veja também

- [Como cadastrar uma Natureza de Operação](../como-fazer/cadastrar-natureza-operacao.md){: target="_blank" rel="noopener" }
- [Como emitir uma NF-e](../como-fazer/faturar-nota.md){: target="_blank" rel="noopener" }
- [Consultar manual de Nota Fiscal](../faturamento/faturamento-nf.md){: target="_blank" rel="noopener" }
