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
- `docs/assets/data/content-info.json`: fonte das informações rápidas de Guias e Manuais, como dificuldade, popularidade, vídeo e tempo manual opcional.
- `docs/como-documentar/base-de-erros.md`: contrato de cadastro, taxonomia e links diretos da base de erros.
- `docs/assets/javascripts/wcorp-errors.js`: busca, filtros e expansão dos erros.
- `docs/assets/javascripts/wcorp-content-info.js`: componente `ContentInfo` e indicadores reutilizáveis `ReadingTime`, `DifficultyIndicator`, `PopularIndicator` e `VideoIndicator`.
- `docs/assets/javascripts/wcorp-favorites.js`: favoritos persistidos no navegador, cards, header e página agregadora.
- `docs/favoritos.md`: página que organiza os favoritos por tipo.
- `tools/normalize-manuals.ps1`: normalizador conservador da estrutura editorial dos Manuais de tela.
- `docs/assets/stylesheets/alerts.css`: cores semânticas das caixas de aviso.
- `docs/assets/stylesheets/content-info.css`: estilo do `ContentInfo` e do ícone discreto de popularidade nos cards.
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

O modelo oficial está em `docs/shared/modelos/guia-processo.md`. A ordem editorial principal é: Pré-requisitos, Permissões, Caminho, Demonstração em vídeo quando existir, Como fazer, Quando utilizar, Avisos quando existirem e Veja também. `Print do caminho` permanece logo após `Caminho` quando existir. `Outra opção` só aparece em Guias que realmente possuem alternativa e fica após `Como fazer`, antes de `Quando utilizar`. A seção `Permissões` usa o snippet `docs/shared/avisos/permissoes.md`; avisos específicos ficam depois de `Quando utilizar` com caixas semânticas.

Não inventar prints. Use apenas arquivos reais em `docs/assets/images/guias/`.

## Padrão atual dos Manuais

O modelo oficial está em `docs/shared/modelos/manual-tela.md`. A ordem editorial é: Objetivo, Quando usar, Caminho, Print da tela quando existir, Passo a passo, Campos principais, Avisos, Dúvidas frequentes e Veja também. O caminho deve ficar separado do print para facilitar leitura e reaproveitamento.

## Componentes compartilhados

- Permissões: `docs/shared/avisos/permissoes.md`
- Validação fiscal: `docs/shared/avisos/validacao-fiscal.md`
- Configuração bancária: `docs/shared/avisos/configuracao-bancaria.md`
- Sidebar do portal: `docs/shared/portal/*.md`
- Modelo de guia: `docs/shared/modelos/guia-processo.md`
- Informações rápidas de conteúdo: `docs/assets/data/content-info.json` + `docs/assets/javascripts/wcorp-content-info.js`

## ContentInfo de Guias e Manuais

Guias e Manuais recebem informações rápidas abaixo do título pelo componente `ContentInfo`. O tempo de leitura é calculado automaticamente no navegador usando 200 palavras por minuto e arredondamento para cima. O campo `readingTime` em `content-info.json` fica reservado para ajuste manual futuro.

Campos aceitos em `content-info.json`: `readingTime`, `difficulty`, `popular`, `videoAvailable` e `videoDuration`. Valores de dificuldade aceitos: `basic`, `intermediate` e `advanced`. O campo `popular` aparece como texto apenas no `ContentInfo` da página interna; em cards deve aparecer somente como ícone discreto com tooltip `Popular`. O índice lateral não deve receber destaque visual por causa de vídeo; quando houver vídeo, a informação deve aparecer apenas no `ContentInfo`.

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
