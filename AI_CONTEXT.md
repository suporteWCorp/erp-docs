# AI Context

## Objetivo do projeto

Este repositório mantém a documentação do WCorp em MkDocs Material. O objetivo principal é publicar uma central de conhecimento útil para usuários e suporte, com guias práticos por tarefa e manual de referência por tela.

## Estrutura atual

- `docs/index.md`: página inicial da central.
- `docs/como-fazer/`: Guia orientado a tarefas.
- `docs/manual/index.md`: visão geral do Manual.
- Pastas de módulo, como `comercial`, `faturamento`, `financeiro`, `materiais`, `compras`, `administracao`: páginas do Manual por tela.
- `docs/referencia/`: FAQ, glossário, erros comuns e links úteis.
- `docs/suporte/`: materiais de suporte acessados pela navegação global customizada.
- `docs/como-documentar/`: padrões e checklist de documentação, hoje fora da navegação principal.
- `docs/shared/`: snippets e componentes reutilizáveis.
- `docs/assets/stylesheets/`: estilos separados por componente, como cards e cabeçalho.
- `docs/assets/javascripts/`: controladores independentes de cabeçalho, navegação e vídeos.
- `docs/assets/images/` e `docs/assets/videos/`: mídia utilizada pelos Guias.
- `docs/assets/data/erros-comuns.json`: fonte oficial da base de erros.
- `docs/como-documentar/base-de-erros.md`: contrato de cadastro, taxonomia e links diretos da base de erros.
- `docs/assets/javascripts/wcorp-errors.js`: busca, filtros e expansão dos erros.
- `docs/assets/javascripts/wcorp-favorites.js`: favoritos persistidos no navegador, cards, header e página agregadora.
- `docs/favoritos.md`: página que organiza os favoritos por tipo.
- `tools/normalize-manuals.ps1`: normalizador conservador da estrutura editorial dos Manuais de tela.
- `docs/assets/stylesheets/alerts.css`: cores semânticas das caixas de aviso.
- `docs/como-documentar/caixas-de-aviso.md`: referência de uso dos avisos.

## Governança e continuidade

- `AI_CONTEXT.md`: visão geral estável para retomar o projeto.
- `DECISIONS.md`: decisões de arquitetura e conteúdo já consolidadas.
- `ROADMAP.md`: sequência de evolução planejada.
- `CHECKLIST_PUBLICACAO.md`: validações obrigatórias antes da publicação.

Evitar repetir nesses arquivos informações que já possuem uma fonte oficial. Decisões ficam em `DECISIONS.md`; tarefas futuras ficam em `ROADMAP.md`.

## Diferença entre Guia e Manual

- Guia: explica como realizar uma tarefa ou processo, como emitir NF-e, importar XML ou cadastrar cliente.
- Manual: explica como funciona uma tela do WCorp, seus campos, dúvidas frequentes e orientações de suporte.

## Padrão atual dos Guias

O modelo oficial está em `docs/shared/modelos/guia-processo.md`. A ordem é: Pré-requisitos, Avisos, Permissões, Caminho, Print do caminho, Como fazer, Demonstração em vídeo, Outra opção, Demonstração em vídeo, Quando utilizar e Veja também. Seções sem conteúdo real são omitidas.

Não inventar prints. Use apenas arquivos reais em `docs/assets/images/guias/`.

## Componentes compartilhados

- Permissões: `docs/shared/avisos/permissoes.md`
- Validação fiscal: `docs/shared/avisos/validacao-fiscal.md`
- Configuração bancária: `docs/shared/avisos/configuracao-bancaria.md`
- Sidebar do portal: `docs/shared/portal/*.md`
- Modelo de guia: `docs/shared/modelos/guia-processo.md`

## Estado atual conhecido

- Os 26 Guias existem e seguem a estrutura atual.
- Os Manuais com conteúdo foram reorganizados sem inventar informações operacionais.
- Sete páginas do Manual possuem somente título e precisam de documentação manual.
- Favoritos usam `localStorage`; portanto, são específicos de cada navegador e perfil.
- O build real com `mkdocs build --strict` não pôde ser executado no ambiente atual porque `mkdocs`, `python`, `docker` e WSL funcional não estão disponíveis.

## Restrições importantes

- Não alterar layout, Home, FAQ ou navegação sem pedido explícito.
- Não criar novos guias sem pedido explícito.
- Não inventar conteúdo operacional, prints, campos ou regras.
- Antes de publicar, validar com MkDocs/Docker em ambiente funcional.
