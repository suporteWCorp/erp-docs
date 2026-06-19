# AI Context

## Objetivo do projeto

Este repositório mantém a documentação do WCorp em MkDocs Material. O objetivo principal é publicar uma central de conhecimento útil para usuários e suporte, com guias práticos por tarefa e manual de referência por tela.

## Estrutura atual

- `docs/index.md`: página inicial da central.
- `docs/como-fazer/`: Guia orientado a tarefas.
- `docs/manual/index.md`: visão geral do Manual.
- Pastas de módulo, como `comercial`, `faturamento`, `financeiro`, `materiais`, `compras`, `administracao`: páginas do Manual por tela.
- `docs/referencia/`: FAQ, glossário, erros comuns e links úteis.
- `docs/suporte/`: materiais de suporte interno, hoje fora da navegação principal.
- `docs/como-documentar/`: padrões e checklist de documentação, hoje fora da navegação principal.
- `docs/shared/`: snippets e componentes reutilizáveis.
- `docs/assets/`: imagens, vídeos e JavaScript customizado.

## Diferença entre Guia e Manual

- Guia: explica como realizar uma tarefa ou processo, como emitir NF-e, importar XML ou cadastrar cliente.
- Manual: explica como funciona uma tela do WCorp, seus campos, dúvidas frequentes e orientações de suporte.

## Padrão atual dos Guias

As páginas em `docs/como-fazer` devem seguir esta ordem:

1. `Objetivo`
2. `Quando utilizar`
3. `Pré-requisitos`
4. `Onde encontrar`
5. `Como fazer`
6. `Erros comuns`
7. `Veja também`

Não inventar prints. Quando faltar imagem, usar marcador claro como `(PRINT DO CAMINHO AQUI)`.

## Componentes compartilhados

- Permissões: `docs/shared/avisos/permissao-*.md`
- Validação fiscal: `docs/shared/avisos/validacao-fiscal.md`
- Configuração bancária: `docs/shared/avisos/configuracao-bancaria.md`
- Sidebar do portal: `docs/shared/portal/*.md`
- Modelo de guia: `docs/shared/modelos/guia-processo.md`

## Estado atual conhecido

- Os 22 Guias existem e seguem a estrutura atual.
- Alguns Guias ainda possuem `(PRINT DO CAMINHO AQUI)`.
- A maioria das páginas do Manual ainda é provisória ou rasa.
- O build real com `mkdocs build --strict` não pôde ser executado no ambiente atual porque `mkdocs`, `python`, `docker` e WSL funcional não estão disponíveis.

## Restrições importantes

- Não alterar layout, Home, FAQ ou navegação sem pedido explícito.
- Não criar novos guias sem pedido explícito.
- Não inventar conteúdo operacional, prints, campos ou regras.
- Antes de publicar, validar com MkDocs/Docker em ambiente funcional.
