---
error_area: "Administração"
error_category: "Natureza de operação"
error_tags:
  - "natureza de operacao"
  - "regra fiscal"
  - "fiscal"
---

# Como cadastrar uma Natureza de Operação

## Pré-requisitos

<div class="wc-prereq-list" markdown>

- Operação que será realizada definida
- Critérios fiscais da operação validados com o responsável fiscal da empresa
- Categorias de material, NCMs, materiais e demais cadastros de critério disponíveis no sistema

</div>

## Avisos

--8<-- "shared/avisos/validacao-fiscal.md"

## Permissões

--8<-- "shared/avisos/permissoes.md"

## Caminho
`Administração > Natureza de Operação`.

## Demonstração em vídeo
<video class="wc-video" controls preload="auto" playsinline>
  <source src="../../assets/videos/adm_natureza_operacao.mp4" type="video/mp4">
  Seu navegador não conseguiu reproduzir este vídeo.
</video>


## Como fazer

1. Acesse **Administração > Natureza de Operação**.
2. Inicie um novo cadastro.
3. Informe a descrição da Natureza de Operação.
4. Preencha os dados do cadastro conforme a operação que será realizada.
5. Salve a Natureza de Operação.
6. Com a Natureza criada, clique em **Adicionar Regra**.
7. Selecione a aba correspondente à Regra Fiscal que será configurada:
    - **Simples**;
    - **Normal**;
    - **Transporte**;
    - **Serviço**.
8. Defina a quais itens a Regra será aplicada. A configuração pode utilizar:
    - **Categoria de Material**;
    - **NCM**;
    - **Material**.
9. Preencha os demais campos conforme a orientação do responsável fiscal.
    - **Grupo de Cliente** e **Indicador de Inscrição Estadual** são opcionais.
    - Campos numéricos sem valor devem permanecer preenchidos com `0`, quando aplicável.
10. Salve a Regra Fiscal.
11. Caso a Natureza exija outros cenários de cálculo, use novamente **Adicionar Regra**. Cada Natureza de Operação pode possuir uma ou mais Regras Fiscais.
12. Teste a Natureza em uma operação controlada antes de liberar seu uso.

Durante o faturamento, o WCorp compara os dados da operação com os critérios das Regras vinculadas à Natureza selecionada e utiliza a Regra Fiscal compatível para realizar o cálculo da nota.

## Quando utilizar

Use este processo quando for necessário:

- cadastrar uma nova Natureza de Operação;
- incluir uma Regra Fiscal em uma Natureza existente;
- ajustar os critérios de uma Regra Fiscal;
- corrigir uma operação para a qual o sistema não encontrou uma Regra Fiscal compatível.

## Veja também

- [Como emitir uma NF-e](faturar-nota.md){: target="_blank" rel="noopener" }
- [Como lançar uma nota de entrada](lancar-nota-entrada.md){: target="_blank" rel="noopener" }
- [Consultar manual de natureza de operação](../administracao/natureza-op.md){: target="_blank" rel="noopener" }
