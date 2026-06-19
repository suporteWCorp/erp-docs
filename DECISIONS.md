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
