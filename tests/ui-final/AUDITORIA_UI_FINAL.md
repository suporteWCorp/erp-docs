# Auditoria Final de UX/UI da Central WCorp

Auditoria diagnóstica. Nenhuma correção foi aplicada nesta etapa.

## Escopo

Telas priorizadas:

- Home
- Listagem de Guias
- Listagem de Manuais
- Referências
- FAQ
- Links úteis
- Erros e Soluções
- Rejeições Fiscais
- Erros Operacionais
- Problemas Técnicos
- Suporte
- Ferramentas, apenas como hub de navegação
- 404

Validador XML, Indicador de Relatórios e Assistente não foram redesenhados nesta auditoria, conforme solicitado.

## Limitações da Validação Visual

A validação automatizada em navegador nos viewports `390x844`, `1366x768`, `1440x1000` e `1920x1080` foi tentada, mas ficou bloqueada pelo ambiente:

- navegador interno indisponível;
- Playwright instalado, porém sem Chromium baixado;
- Chrome/Edge headless do Windows falharam por GPU antes de gerar screenshots confiáveis;
- Docker/MkDocs real já havia sido confirmado como indisponível neste ambiente.

Portanto, os achados abaixo combinam:

- análise estática de Markdown/HTML/CSS;
- inspeção do `site/` existente, com ressalva de que ele pode estar desatualizado;
- validação estática de links e assets das telas auditadas.

Antes de congelar a UI final, repetir a auditoria visual em navegador real nos quatro viewports.

## Validação Estática

- Arquivos auditados diretamente: 11 páginas principais.
- Links Markdown internos verificados: 48.
- Links internos quebrados encontrados: 0.
- Assets locais ausentes nas páginas auditadas: 0.
- `site/404.html`: existe.

Evidência estruturada:

```text
tests/ui-final/static-link-check.json
tests/ui-final/ui-audit-raw.json
```

## Resumo por Prioridade

- CRÍTICO: 0 achados de produto confirmados.
- ALTO: 2 achados.
- MÉDIO: 5 achados.
- BAIXO: 4 achados.
- POLIMENTO: 4 achados.

## Achados

### ALTO — Auditoria visual por viewport ainda não confirmada

- Página: Todas.
- Problema: não foi possível validar visualmente os viewports `390x844`, `1366x768`, `1440x1000` e `1920x1080` com navegador real neste ambiente.
- Impacto: risco de aprovar desalinhamentos, overflow ou bugs de responsividade sem evidência visual final.
- Correção sugerida: executar a auditoria em ambiente com Docker/MkDocs e navegador funcional; capturar screenshots das telas priorizadas.
- Arquivo provavelmente responsável: ambiente de validação, não arquivo de produto.

### ALTO — Home ainda possui histórico de tela branca ao clicar em Início

- Página: Home.
- Problema: bug relatado anteriormente pelo usuário: estando no Início, clicar novamente em Início pode deixar o conteúdo branco.
- Impacto: navegação principal aparenta quebrar a Central, mesmo com header/elementos globais presentes.
- Correção sugerida: investigar interação entre navegação instantânea do Material, handlers de header/nav e cleanup de classes/containers antes de corrigir.
- Arquivo provavelmente responsável: `docs/assets/javascripts/wcorp-header.js`, `docs/assets/javascripts/wcorp-nav.js` ou integração com `navigation.instant`.

### MÉDIO — 404 ainda está com aparência padrão de documentação

- Página: 404.
- Problema: o HTML gerado mostra `404 - Not found`, sem linguagem visual WCorp nem caminhos de recuperação.
- Impacto: experiência de erro final parece genérica e menos cuidada que o restante da Central.
- Correção sugerida: criar página 404 própria com título em português, ação para voltar ao Início, busca e links para Guia/Manual/Suporte.
- Arquivo provavelmente responsável: `docs/404.md` ou override/template de 404 do MkDocs.

### MÉDIO — Navegação superior de Manuais ainda tem risco de corte em módulos longos

- Página: Manual e páginas de módulos.
- Problema: CSS usa limites como `max-width: 96px` e `max-width: 86px` nos links de abas, com overflow/ellipsis.
- Impacto: nomes longos como Colaboradores, Fornecedores e Administração podem voltar a cortar em resoluções intermediárias.
- Correção sugerida: revisar a distribuição horizontal das abas com fonte/tamanho estáveis, scroll claro e sem truncamento agressivo.
- Arquivo provavelmente responsável: `docs/extra.css`.

### MÉDIO — Hubs usam padrões de card diferentes demais entre si

- Página: Home, Referências, Ferramentas, Guia, Manual.
- Problema: há variações de raio, orientação, max-width, ícones e comportamento entre `.wc-card`, `.wc-reference-hub__item` e `.wc-tool-hub-card`.
- Impacto: telas aprovadas individualmente parecem menos coesas quando navegadas em sequência.
- Correção sugerida: criar uma família única de hub cards com variações controladas por contexto, preservando os componentes já aprovados.
- Arquivo provavelmente responsável: `docs/assets/stylesheets/cards.css`.

### MÉDIO — Suporte usa ícones textuais com aparência provisória

- Página: Suporte.
- Problema: os itens de triagem usam caracteres literais como `?`, `!`, `i` e `#` como ícones.
- Impacto: a tela fica mais pobre visualmente que Referências/Ferramentas, que usam ícones SVG consistentes.
- Correção sugerida: substituir por ícones SVG/lucide equivalentes, mantendo tamanho, layout e texto.
- Arquivo provavelmente responsável: `docs/suporte/index.md` e `docs/assets/stylesheets/cards.css`.

### MÉDIO — Erros e Soluções ainda parece hub genérico

- Página: Erros e Soluções.
- Problema: as três entradas usam cards comuns, sem diferenciação visual clara entre rejeição fiscal, erro operacional e problema técnico.
- Impacto: uma área crítica para suporte parece menos orientada à decisão do usuário.
- Correção sugerida: manter a estrutura de 3 cards, mas adicionar sinais visuais discretos por tipo, como ícone e microcopy mais objetiva.
- Arquivo provavelmente responsável: `docs/erros-solucoes/index.md` e `docs/assets/stylesheets/cards.css`.

### BAIXO — FAQ tem labels de resposta inconsistentes

- Página: FAQ.
- Problema: alguns itens usam `Resposta:` e outros `Resposta rápida`.
- Impacto: pequena quebra de consistência no padrão de leitura do accordion.
- Correção sugerida: padronizar para um único label, preferencialmente `Resposta rápida`.
- Arquivo provavelmente responsável: `docs/referencia/faq.md`.

### BAIXO — Links úteis repete ícone de link externo duas vezes

- Página: Links úteis.
- Problema: cada item tem um ícone externo à esquerda e outra seta externa à direita.
- Impacto: ruído visual em uma tela que deveria ser muito escaneável.
- Correção sugerida: manter apenas um indicador de link externo, preferencialmente à direita.
- Arquivo provavelmente responsável: `docs/referencia/links-uteis.md` e `docs/assets/stylesheets/cards.css`.

### BAIXO — Links úteis usa HTML manual extenso no Markdown

- Página: Links úteis.
- Problema: a estrutura é toda escrita em HTML manual.
- Impacto: manutenção mais frágil e chance maior de inconsistência ao adicionar links.
- Correção sugerida: futuramente mover para dados estruturados ou padrão Markdown mais simples com renderização automática.
- Arquivo provavelmente responsável: `docs/referencia/links-uteis.md`.

### BAIXO — FAQ ainda usa HTML manual para accordions

- Página: FAQ.
- Problema: os accordions são escritos com `<details>`, `<summary>` e parágrafos com classes.
- Impacto: funciona, mas dificulta padronização futura e aumenta chance de regressão visual em ícones/hover.
- Correção sugerida: criar padrão interno para FAQ, parecido com a convenção de conteúdo V1, antes de expandir a seção.
- Arquivo provavelmente responsável: `docs/referencia/faq.md` e `docs/extra.css`.

### POLIMENTO — Listagens de Guia e Manual dependem de muitos cards estáticos

- Página: Listagem de Guias e Manuais.
- Problema: os cards são escritos manualmente no Markdown.
- Impacto: risco de contadores, relacionados, ordem e cards ficarem divergentes do catálogo real.
- Correção sugerida: depois da migração V1, gerar listagens a partir de metadados em vez de manter cards duplicados.
- Arquivo provavelmente responsável: `docs/como-fazer/index.md`, `docs/manual/index.md` e futuro catálogo de conteúdo.

### POLIMENTO — Filtro de cards está visualmente sensível por largura fixa

- Página: Listagens de Guias e Manuais.
- Problema: o controle `.wc-card-filter` usa largura fixa de `165px`.
- Impacto: funciona hoje, mas pode voltar a cortar opções mais longas ou destoar da largura dos cards em resoluções intermediárias.
- Correção sugerida: manter compacto, mas validar visualmente nos quatro viewports antes de congelar.
- Arquivo provavelmente responsável: `docs/assets/stylesheets/cards.css`.

### POLIMENTO — Descoberta de scroll horizontal no submenu de Manual pode ser baixa no mobile

- Página: Manual e páginas de módulos.
- Problema: o submenu usa overflow horizontal, mas sem affordance visual clara de que há mais itens.
- Impacto: em mobile, usuários podem não perceber módulos/telas fora da primeira área visível.
- Correção sugerida: avaliar fade lateral discreto, indicador de rolagem ou snap leve, sem mudar a lógica atual.
- Arquivo provavelmente responsável: `docs/extra.css`.

### POLIMENTO — Foco de teclado pode ser reforçado em navegações horizontais

- Página: Manual, submenu de Manual e hubs.
- Problema: há estados `focus-visible` em vários componentes, mas a navegação horizontal de módulos depende mais de cor/fundo.
- Impacto: usuários por teclado podem ter feedback menos evidente em alguns itens.
- Correção sugerida: revisar outline/focus ring dos links de tabs/subnav mantendo a identidade teal.
- Arquivo provavelmente responsável: `docs/extra.css` e `docs/assets/stylesheets/cards.css`.

## Correções que Podem Ser Feitas em Lote com Baixo Risco Funcional

- Padronizar labels do FAQ.
- Remover duplicidade de seta/ícone em Links úteis.
- Trocar ícones textuais do Suporte por ícones consistentes.
- Melhorar 404 com página própria.
- Revisar apenas cores/foco/hover dos hubs sem alterar estrutura.

## Correções que Exigem Mais Cuidado

- Bug da Home ao clicar em Início, por envolver navegação instantânea e JavaScript global.
- Ajustes da navegação superior de Manuais, pois já houve histórico de cortes em resoluções intermediárias.
- Geração futura das listagens de Guia/Manual a partir de metadados, por tocar arquitetura de conteúdo.

## Pendência Obrigatória

Reexecutar validação visual em navegador real com screenshots nos viewports:

- `390x844`
- `1366x768`
- `1440x1000`
- `1920x1080`

Também validar console real sem erros após build atual do MkDocs.
