# Natureza de Operação

## Objetivo

A tela **Natureza de Operação** é utilizada para cadastrar as operações disponíveis no WCorp e vincular a elas as Regras Fiscais usadas durante o faturamento.

A Natureza de Operação não funciona apenas como uma descrição da movimentação. Ao selecioná-la em uma nota fiscal, o sistema consulta suas Regras Fiscais para identificar qual configuração é compatível com os dados da operação e deve ser utilizada no cálculo.

Nesta tela é possível:

- cadastrar e consultar Naturezas de Operação;
- definir a descrição e os dados gerais de cada Natureza;
- adicionar uma ou mais Regras Fiscais;
- organizar as Regras conforme o tipo de operação;
- revisar os critérios utilizados pelo WCorp durante o cálculo da nota fiscal.

## Print da tela com caminho

`Administração > Natureza de Operação`

## Passo a passo

### Adicionar Regra

Após criar e salvar uma Natureza de Operação, o botão **Adicionar Regra** permite cadastrar uma Regra Fiscal vinculada a ela.

Uma mesma Natureza pode possuir várias Regras. Isso permite que o WCorp escolha configurações diferentes conforme os dados do cliente, do item e da operação realizada.

### Abas de Regras

As Regras Fiscais são organizadas nas seguintes abas:

- **Simples**: reúne as Regras cadastradas para as operações tratadas nessa modalidade pelo WCorp.
- **Normal**: reúne as Regras cadastradas para as operações normais do sistema.
- **Transporte**: reúne as Regras utilizadas em operações de transporte.
- **Serviço**: reúne as Regras utilizadas em operações de serviço.

As abas separam os contextos de utilização das Regras. A definição da aba e o preenchimento dos campos devem seguir a orientação do responsável fiscal da empresa.

### Critérios de aplicação

Uma Regra Fiscal pode ser configurada para ser aplicada por:

- **Categoria de Material**;
- **NCM**;
- **Material**.

Os campos **Grupo de Cliente** e **Indicador de Inscrição Estadual** são opcionais. Os demais campos devem ser configurados de acordo com o cenário da operação e com a orientação do responsável fiscal.

Quando um campo numérico não possuir valor, ele deve permanecer preenchido com `0`, quando aplicável.

### Relação com o faturamento

Durante o cálculo da nota fiscal, o WCorp utiliza a Natureza de Operação selecionada para localizar suas Regras Fiscais. Em seguida, compara os critérios de cada Regra com os dados da operação, como cliente, Estado e item faturado.

Quando encontra uma Regra compatível, o sistema utiliza essa configuração no cálculo da nota. Quando nenhuma Regra atende aos dados informados, o cálculo automático pode não ser finalizado.

Por isso, a configuração pode ser entendida nesta sequência:

1. A **Natureza de Operação** identifica a operação realizada.
2. As **Regras Fiscais** vinculadas definem os cenários disponíveis para essa Natureza.
3. Os **critérios de aplicação** determinam qual Regra é compatível com os dados da nota.
4. O **faturamento** utiliza a Regra encontrada durante o cálculo.

Esta documentação descreve apenas como o WCorp utiliza essas informações. A definição do conteúdo fiscal de cada campo deve ser feita pelo responsável fiscal da empresa.

## Veja também

- [Como cadastrar uma Natureza de Operação](../como-fazer/cadastrar-natureza-operacao.md){: target="_blank" rel="noopener" }
- [Como emitir uma NF-e](../como-fazer/faturar-nota.md){: target="_blank" rel="noopener" }
- [Manual > Faturamento > Nota Fiscal](../faturamento/faturamento-nf.md){: target="_blank" rel="noopener" }
