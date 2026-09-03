# Auditoria de Publicação dos Guias V1

Data: 2026-08-31

## Regra Aplicada

Para a Central V1, um Guia publicado precisa possuir pelo menos 1 vídeo válido declarado no padrão V1.

Conteúdos em `docs/como-fazer/` sem vídeo válido deixam de participar das superfícies de Guia publicadas:

- cards da página Guia;
- contadores totais e por categoria;
- navegação de Guia;
- `content-catalog.json` como Guia publicado;
- busca geral como página de Guia válida;
- recomendações do Assistente como Guia;
- links de Mais acessados.

Os arquivos antigos não foram excluídos fisicamente. Eles receberam `search.exclude: true` para não quebrar referências diretas existentes enquanto ficam fora da publicação V1.

## Resultado Geral

| Métrica | Total |
|---|---:|
| Arquivos de conteúdo em `docs/como-fazer/` | 38 |
| Guias V1 com vídeo válido | 15 |
| Conteúdos fora da publicação V1 | 23 |
| Cards finais na página Guia | 15 |
| Itens finais na navegação de Guia | 15 |
| Guias publicados no `content-catalog.json` | 15 |

Inventário detalhado: `tests/content-convention/latest-guide-publication-v1.json`.

## Guias Retirados da V1

Solicitados explicitamente:

| Guia | Caminho | Tratamento |
|---|---|---|
| Como fazer inventário | `docs/como-fazer/fazer-inventario.md` | Removido dos cards/nav/catálogo/search; arquivo preservado com `search.exclude: true`. |
| Como transferir estoque | `docs/como-fazer/transferir-estoque.md` | Removido dos cards/nav/catálogo/search; arquivo preservado com `search.exclude: true`. |
| Como importar XML | `docs/como-fazer/importar-xml.md` | Removido dos cards/nav/catálogo/search/mais acessados; arquivo preservado com `search.exclude: true`. |

## Títulos Alterados

| Antes | Depois | Caminho |
|---|---|---|
| Como verificar usuários e log | Como verificar usuários logados | `docs/como-fazer/verificar-usuarios-log.md` |
| Como empenhar material | Como verificar o empenho de material | `docs/como-fazer/empenhar-material.md` |
| Como registrar entrada de material | Como realizar entrada de material | `docs/como-fazer/registrar-entrada-material.md` |
| Como consultar uma NF-e rejeitada | Como consultar notas fiscais rejeitadas | `docs/como-fazer/consultar-nfe-rejeitada.md` |
| Como usar Emissor | Como utilizar emissor de NF-e | `docs/como-fazer/usar-emissor.md` |

Os slugs/IDs foram preservados.

## Categoria Corrigida

| Guia | Antes | Depois |
|---|---|---|
| Como exportar e editar tabela | Ferramentas | Funcionalidades |

## Contagem Antiga x Nova

### Cards da Página Guia

| Categoria | Antes | Depois | Diferença |
|---|---:|---:|---:|
| Administração | 6 | 1 | -5 |
| Comercial | 3 | 1 | -2 |
| Compras | 1 | 0 | -1 |
| Estoque | 10 | 7 | -3 |
| Faturamento | 7 | 4 | -3 |
| Ferramentas | 1 | 0 | -1 |
| Financeiro | 1 | 0 | -1 |
| Funcionalidades | 0 | 1 | +1 |
| Relatórios | 1 | 1 | 0 |

### Navegação Lateral

| Categoria | Antes | Depois |
|---|---:|---:|
| Administração | 6 | 1 |
| Comercial | 4 | 1 |
| Compras | 3 | 0 |
| Estoque | 10 | 7 |
| Faturamento | 9 | 4 |
| Financeiro | 3 | 0 |
| Ferramentas | 1 | 0 |
| Funcionalidades | 0 | 1 |
| Relatórios | 1 | 1 |

Depois da correção, cards, navegação e catálogo usam a mesma fonte de verdade.

## Contagem Final Por Categoria

| Categoria | Cards | Navegação | Publicados V1 | Diferença |
|---|---:|---:|---:|---:|
| Administração | 1 | 1 | 1 | 0 |
| Comercial | 1 | 1 | 1 | 0 |
| Estoque | 7 | 7 | 7 | 0 |
| Faturamento | 4 | 4 | 4 | 0 |
| Funcionalidades | 1 | 1 | 1 | 0 |
| Relatórios | 1 | 1 | 1 | 0 |

Compras, Financeiro e Materiais não possuem Guia V1 publicado nesta etapa.

## Validações

| Validação | Resultado |
|---|---|
| Guia publicado possui vídeo declarado | PASS |
| Vídeos declarados existem em `docs/assets/videos/guias/` | PASS |
| Cards exibidos = Guias V1 publicados | PASS |
| Navegação Guia = Guias V1 publicados | PASS |
| `content-catalog.json` = Guias V1 publicados | PASS |
| Conteúdo fora da V1 possui `search.exclude: true` | PASS |
| `content-info.json` não marca Guia fora da V1 como popular/vídeo disponível | PASS |
| `shared/portal/mais-acessados.md` não aponta para Guia fora da V1 | PASS |
| `site/search/search_index.json` não indexa páginas de Guia fora da V1 | PASS |
| Assistente funcional não retorna Guia fora da V1 | PASS |

## Build

`mkdocs build` executado com `.tools/python/python.exe -m mkdocs build`.

Resultado: PASS.

Observação: o build continua listando páginas existentes fora do `nav`, incluindo os Guias preservados fora da V1. Isso é esperado nesta etapa, pois os arquivos não foram excluídos fisicamente.

## Assistente

O Assistente passou a carregar `content-catalog.json` e bloquear estruturalmente documentos de `como-fazer/` que não estejam publicados como Guia V1.

Resultado funcional da suíte:

- total: 45
- PASS: 45
- FAIL: 0
- `invalidGuideMatches`: 0

Observação: o runner completo ainda registra 6 FAIL na métrica visual de ancoragem do painel do Assistente. Essa frente é conhecida e não foi alterada porque esta tarefa proíbe mexer em posicionamento/UI do Assistente.

## Arquivos de Resultado

- `tests/content-convention/latest-guide-publication-v1.json`
- `tests/assistant/latest-results.json`
- `tests/content-migration/AUDITORIA_GUIAS_V1.md`
