# Decisions

## Guia orientado a tarefas

Decisão: a seção Guia é organizada por processos e tarefas do dia a dia, não por telas.

Motivo: o usuário normalmente procura respostas como "Como emitir uma NF-e?" ou "Como importar XML?".

## Manual por tela

Decisão: o Manual permanece organizado por módulos e telas do WCorp.

Motivo: evitar duplicação e manter uma fonte de referência para funcionamento de cada tela.

## Uso de snippets

Decisão: avisos reutilizáveis devem ficar em `docs/shared`.

Motivo: reduzir manutenção e evitar repetir permissões, validações fiscais e configurações bancárias em várias páginas.

## Prints

Decisão: não inventar imagens nem reaproveitar print genérico quando ele não representar exatamente o caminho ou tela.

Motivo: prints incorretos confundem o usuário e reduzem confiança na documentação.

## Nomenclatura

Decisão: usar `WCorp` quando a frase se refere ao produto e `Sistema` quando a frase soar mais natural de forma genérica.

Motivo: reduzir o uso de `ERP`, que é genérico demais para a documentação do produto.

## FAQ

Decisão: FAQ deve abrir uma página de visão geral em cards, sem menu lateral com lista de subpáginas.

Motivo: a página deve funcionar como hub de referência rápida.

## Rodapé de contato

Decisão: o rodapé deve exibir apenas contato oficial por e-mail e WhatsApp.

Motivo: manter a documentação limpa e profissional.

## Build

Decisão: antes de publicar, executar `mkdocs build --strict` em ambiente com MkDocs ou Docker funcional.

Motivo: validações estáticas ajudam, mas não substituem o build real do MkDocs.

## Base de erros orientada a dados

Decisão: a fonte oficial de Erros comuns fica em `docs/assets/data/erros-comuns.json` e é renderizada na rota existente `referencia/erros-comuns/`.

Motivo: separar conteúdo da apresentação permite incluir erros, categorias, links e tags sem editar HTML ou JavaScript.

Decisão complementar: cada artigo possui `area` e `category`. A navegação, os agrupamentos e os contadores são derivados desses campos; `taxonomy` define apenas a ordem editorial e categorias planejadas.

Motivo: permitir que a base cresça sem manter menus ou contadores manualmente.

## Caixas semânticas

Decisão: avisos usam os tipos `prerequisite`, `requirement`, `fiscal`, `caution`, `information` e `success`.

Motivo: o significado define a cor. Guias diferentes não devem escolher cores distintas para o mesmo tipo de orientação.

## Estrutura dos Guias

Decisão: o template oficial fica em `docs/shared/modelos/guia-processo.md`. Caminho e print são seções próprias; avisos, vídeos e alternativas são opcionais. Todo vídeo usa o título `Demonstração em vídeo`.

Motivo: uma estrutura rígida com seções vazias prejudica Guias simples. O padrão deve ser consistente sem obrigar conteúdo que não existe.

## Favoritos

Decisão: favoritos são armazenados em `localStorage`, classificados automaticamente pela rota e apresentados no header, na lateral e em `favoritos/`.

Motivo: a Central é estática e não possui autenticação ou serviço de dados. A persistência local mantém a funcionalidade simples e não altera as rotas existentes.

## Estrutura dos Manuais

Decisão: páginas de tela seguem o modelo `docs/shared/modelos/manual-tela.md`. Visões gerais de módulo são exceções. O script `tools/normalize-manuals.ps1` apenas reorganiza conteúdo existente e não preenche páginas vazias.

Motivo: Manual descreve tela e funcionalidade; informações ausentes precisam ser validadas no WCorp, não inferidas.
