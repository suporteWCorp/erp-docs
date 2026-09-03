# Guias Novos V1

Data da preparação: 2026-08-31

## Escopo

Esta etapa adicionou somente o lote de Guias novos gravados na pasta padrão de vídeos do Windows:

`C:\Users\wavec\Videos`

Não foram usados vídeos antigos do repositório como fonte do lote. Os assets foram copiados para dentro de `docs/assets/`, portanto os Guias publicados não dependem mais da pasta local do usuário.

## Observação Sobre a Contagem de Mídias

O pedido mencionava `14 Guias / 16 mídias / 15 MP4 + 1 PNG`, mas a lista explícita continha:

- 14 processos de Guia;
- 16 arquivos MP4;
- 1 arquivo PNG;
- 17 mídias no total.

Foi seguida a lista explícita de arquivos. O Guia `usar-emissor` concentra 2 vídeos e 1 imagem. O Guia `verificar-regra-fiscal` concentra 2 vídeos.

## Resultado Geral

- Guias no lote: 14
- Guias novos criados: 12
- Guias existentes atualizados: 2
- Mídias copiadas: 17
- MP4 copiados: 16
- PNG copiado: 1
- Conteúdos bloqueados: 0

## Tabela do Lote

| Guia | Status | ID | Vídeos | Imagens | Guia existente | Manual relacionado | Ação |
|---|---|---|---|---|---|---|---|
| Como ajustar inventário | ATUALIZADO | `ajustar-estoque` | `ajuste-inventario.mp4` | - | `docs/como-fazer/ajustar-estoque.md` | Materiais / estoque | Guia existente adotado no padrão V1 e mídia nova adicionada. |
| Como alterar o NCM de um material | PUBLICADO | `alterar-ncm-material` | `alterar-ncm-material.mp4` | - | Não havia Guia equivalente | Materiais | Guia novo criado com base no FAQ existente e na mídia gravada. |
| Como consultar uma NF-e rejeitada | PUBLICADO | `consultar-nfe-rejeitada` | `consultar-nfe-rejeitada.mp4` | - | Não havia Guia equivalente | Nota Fiscal | Guia novo criado; revisar linguagem operacional fiscal antes da V1, se necessário. |
| Como usar o Emissor | REVISAR | `usar-emissor` | `abrir-emissor.mp4`, `verificar-erro-emissor.mp4` | `aguardar-emissor.png` | Não havia Guia equivalente | Nota Fiscal / Emissor | Guia novo criado com mídia múltipla; revisar se o nome e a divisão dos passos refletem o processo real. |
| Como empenhar material | REVISAR | `empenhar-material` | `empenho-material.mp4` | - | Não havia Guia equivalente | Materiais / Estoque | Guia novo criado com texto estrutural mínimo; requer validação operacional. |
| Como registrar entrada de material | PUBLICADO | `registrar-entrada-material` | `entrada-material.mp4` | - | Não havia Guia equivalente | Entrada de Material | Guia novo criado com caminho compatível com conteúdo existente. |
| Como exportar e editar tabela | REVISAR | `exportar-editar-tabela` | `exportar-editar-tabela.mp4` | - | Não havia Guia equivalente | Ferramentas / tabelas | Guia novo criado com texto estrutural mínimo; requer validação operacional. |
| Como configurar lote padrão | REVISAR | `configurar-lote-padrao` | `lote-padrao.mp4` | - | Não havia Guia equivalente | Materiais / Estoque | Guia novo criado com texto estrutural mínimo; requer validação operacional. |
| Como criar romaneio | PUBLICADO | `criar-romaneio` | `romaneio.mp4` | - | Não havia Guia equivalente | Romaneio | Guia novo criado com caminho compatível com conteúdo existente. |
| Como consultar SPED Fiscal | PUBLICADO | `consultar-sped-fiscal` | `sped-fiscal.mp4` | - | Não havia Guia equivalente | Relatórios / SPED Fiscal | Guia novo criado; recomenda-se revisão fiscal antes da publicação final. |
| Como consultar estoque | ATUALIZADO | `consultar-estoque` | `ver-estoque.mp4` | - | `docs/como-fazer/consultar-estoque.md` | Lote/Estoque | Guia existente adotado no padrão V1 e mídia nova adicionada. |
| Como verificar CBenef | REVISAR | `verificar-cbenef` | `verificar-cbenef.mp4` | - | Não havia Guia equivalente | Natureza de Operação / regras fiscais | Guia novo criado sem inventar regra fiscal; requer validação operacional/fiscal. |
| Como verificar regra fiscal | REVISAR | `verificar-regra-fiscal` | `ver-regra-fiscal.mp4`, `ver-regra-fiscal-administracao.mp4` | - | Não havia Guia equivalente | Natureza de Operação / regras fiscais | Guia novo criado com dois vídeos no mesmo processo; requer validação operacional/fiscal. |
| Como verificar usuários e log | REVISAR | `verificar-usuarios-log` | `verificar-usuarios-log.mp4` | - | Não havia Guia equivalente | Usuários | Guia novo criado com texto estrutural mínimo; revisar exatamente quais logs devem ser orientados. |

## Pode Subir Direto

- `alterar-ncm-material`
- `consultar-nfe-rejeitada`
- `registrar-entrada-material`
- `criar-romaneio`
- `consultar-sped-fiscal`

Esses Guias foram publicados com texto objetivo, sem extrapolar o conteúdo disponível. Ainda assim, os casos fiscais devem ser revisados por responsável fiscal quando aplicável.

## Atualizar Existente

- `ajustar-estoque`
- `consultar-estoque`

Os dois já existiam em `docs/como-fazer/` e foram atualizados para a Convenção V1, com os assets novos adicionados.

## Precisa de Decisão ou Revisão Humana

- `usar-emissor`
- `empenhar-material`
- `exportar-editar-tabela`
- `configurar-lote-padrao`
- `verificar-cbenef`
- `verificar-regra-fiscal`
- `verificar-usuarios-log`

Motivo: os nomes das mídias indicam o processo, mas não fornecem evidência textual suficiente para detalhar regras, variações, campos obrigatórios ou consequências operacionais sem revisão de alguém que conhece o WCorp real.

## Assets Copiados

| Origem | Destino |
|---|---|
| `guiaajusteinventario.mp4` | `docs/assets/videos/guias/ajustar-estoque/ajuste-inventario.mp4` |
| `guiaalterarncm.mp4` | `docs/assets/videos/guias/alterar-ncm-material/alterar-ncm-material.mp4` |
| `guiaconsultarnferejeitada.mp4` | `docs/assets/videos/guias/consultar-nfe-rejeitada/consultar-nfe-rejeitada.mp4` |
| `guiaemissorabrir.mp4` | `docs/assets/videos/guias/usar-emissor/abrir-emissor.mp4` |
| `guiaemissorvererro.mp4` | `docs/assets/videos/guias/usar-emissor/verificar-erro-emissor.mp4` |
| `guiaemissorespera.png` | `docs/assets/images/guias/usar-emissor/aguardar-emissor.png` |
| `guiaempenhomaterial.mp4` | `docs/assets/videos/guias/empenhar-material/empenho-material.mp4` |
| `guiaentradamaterial.mp4` | `docs/assets/videos/guias/registrar-entrada-material/entrada-material.mp4` |
| `guiaexportareeditartabela.mp4` | `docs/assets/videos/guias/exportar-editar-tabela/exportar-editar-tabela.mp4` |
| `guialotepadrao.mp4` | `docs/assets/videos/guias/configurar-lote-padrao/lote-padrao.mp4` |
| `guiaromaneio.mp4` | `docs/assets/videos/guias/criar-romaneio/romaneio.mp4` |
| `guiaspedfiscal.mp4` | `docs/assets/videos/guias/consultar-sped-fiscal/sped-fiscal.mp4` |
| `guiaverestoque.mp4` | `docs/assets/videos/guias/consultar-estoque/ver-estoque.mp4` |
| `guiaverificarcbenef.mp4` | `docs/assets/videos/guias/verificar-cbenef/verificar-cbenef.mp4` |
| `guiaverregra.mp4` | `docs/assets/videos/guias/verificar-regra-fiscal/ver-regra-fiscal.mp4` |
| `guiaverregraadm.mp4` | `docs/assets/videos/guias/verificar-regra-fiscal/ver-regra-fiscal-administracao.mp4` |
| `guiaverusuarioslog.mp4` | `docs/assets/videos/guias/verificar-usuarios-log/verificar-usuarios-log.mp4` |

## Validações Executadas

- Conferência dos arquivos na pasta padrão de vídeos: PASS
- Ausência de `guiaverreadme`: PASS
- Ausência de caminhos locais `C:\Users\...` nos Guias do lote: PASS
- Ausência de `<video>` manual nos Guias do lote: PASS
- Ausência de `wc-prereq-list` nos Guias do lote: PASS
- Validação equivalente da Convenção V1 via Python local: PASS
- `mkdocs build` com `.tools/python/python.exe`: PASS
- Geração de `site/search/search_index.json`: PASS

## Observações de Teste

O script oficial `tests/content-convention/validate-content-metadata.mjs` não foi executado diretamente porque `node` não está disponível no PATH desta máquina. Foi executada uma validação equivalente com o Python local do projeto, atualizando:

- `docs/assets/data/content-catalog.json`
- `tests/content-convention/latest-results.json`

Resultado: 16 conteúdos adotados pela Convenção V1, 0 erros, 0 avisos.

