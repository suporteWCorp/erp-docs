# Validacao do Migrador Classe B - Onda 1

Escopo validado: ONDA 1 - Guias de Administracao.

Arquivos originais em `docs/` nao foram alterados. O migrador gerou somente staging em `tests/content-migration/dry-run/`.

## Resultado

- Arquivos validados: 5
- PASS: 1
- REVISAR: 4
- Assets reais movidos: 0
- Arquivos escritos em `docs/`: 0
- Arquivos staged: 5

## Tabela de Validacao

| Arquivo | Transformacoes | Risco | Status |
| --- | --- | --- | --- |
| `docs/como-fazer/cadastrar-natureza-operacao.md` | front matter V1 criado; `id`, `title`, `type`, `category` e `difficulty` preenchidos; `wc-prereq-list` convertido; `<video>/<source>` convertido para `.wc-video-link`; caminho do video aponta para `docs/assets/videos/guias/cadastrar-natureza-operacao/`; HTML removido | Mantem link manual em `Veja tambem` para `docs/administracao/natureza-op.md`, que e Classe D e nao deve ser migrado automaticamente | REVISAR |
| `docs/como-fazer/cadastrar-condicao-pagamento.md` | front matter V1 criado; `id`, `title`, `type`, `category` e `difficulty` preenchidos; `wc-prereq-list` convertido; `<video>/<source>` convertido para `.wc-video-link`; caminho do video aponta para `docs/assets/videos/guias/cadastrar-condicao-pagamento/`; HTML removido | Mantem link manual em `Veja tambem` para `docs/administracao/condicoes-pagamento.md`, que e Classe D e nao deve ser migrado automaticamente | REVISAR |
| `docs/como-fazer/cadastrar-centro-custo.md` | front matter V1 criado; `id`, `title`, `type`, `category` e `difficulty` preenchidos; `wc-prereq-list` convertido; `<video>/<source>` convertido para `.wc-video-link`; caminho do video aponta para `docs/assets/videos/guias/cadastrar-centro-custo/`; HTML removido | Mantem link manual em `Veja tambem` para `docs/administracao/centro-custo.md`, que e Classe D e nao deve ser migrado automaticamente | REVISAR |
| `docs/como-fazer/cadastrar-usuario.md` | front matter V1 criado; `id`, `title`, `type`, `category`, `difficulty`, `related_manual` e `related_guides` preenchidos; `wc-prereq-list` convertido; `<video>/<source>` convertido para `.wc-video-link`; caminho do video aponta para `docs/assets/videos/guias/cadastrar-usuario/`; `Veja tambem` manual removido porque os relacionados foram resolvidos por ID | Baixo; requer apenas build real posterior para validar renderizacao do video e do bloco automatico de relacionados | PASS |
| `docs/como-fazer/configurar-grupo-usuario.md` | front matter V1 criado; `id`, `title`, `type`, `category`, `difficulty` e `related_guides` preenchidos; `wc-prereq-list` convertido; `<video>/<source>` convertido para `.wc-video-link`; caminho do video aponta para `docs/assets/videos/guias/configurar-grupo-usuario/`; HTML removido | Mantem link manual em `Veja tambem` para `docs/administracao/grupo-usuarios.md`, que e Classe D e nao deve ser migrado automaticamente | REVISAR |

## Arquivos Staged

- `tests/content-migration/dry-run/docs/como-fazer/cadastrar-natureza-operacao.md`
- `tests/content-migration/dry-run/docs/como-fazer/cadastrar-condicao-pagamento.md`
- `tests/content-migration/dry-run/docs/como-fazer/cadastrar-centro-custo.md`
- `tests/content-migration/dry-run/docs/como-fazer/cadastrar-usuario.md`
- `tests/content-migration/dry-run/docs/como-fazer/configurar-grupo-usuario.md`

## Validacoes Executadas

1. Front matter
   - Todos os 5 arquivos staged possuem front matter novo.
   - `id`, `title`, `type`, `category` e `difficulty` foram preenchidos.
   - `description` nao foi gerada para a Onda 1, porque os arquivos nao possuem paragrafo introdutorio claro antes do primeiro `##`.
   - `screen_path` nao foi aplicado, pois a Onda 1 contem apenas Guias.

2. Pre-requisitos
   - `wc-prereq-list` foi removido dos 5 arquivos.
   - Os itens foram preservados como lista Markdown abaixo de `## Pré-requisitos`.

3. Videos
   - Nenhum `<video>` ou `<source>` permaneceu no staging.
   - Os 5 videos foram convertidos para links Markdown com `.wc-video-link`.
   - Os links apontam para os novos caminhos planejados em `docs/assets/videos/guias/<id>/`.
   - Nenhum asset real foi movido nesta etapa.

4. `<br>` e `wc-screen-block`
   - Nenhum `<br>` permaneceu nos arquivos staged da Onda 1.
   - Nenhum `wc-screen-block` existia na Onda 1.

5. Preservacao de conteudo
   - A ordem principal foi preservada: titulo, pre-requisitos, permissoes, caminho, video, como fazer, avisos e relacionados quando necessario.
   - Nenhum passo operacional foi inventado.
   - Nenhum passo operacional foi removido.
   - O texto fallback do player HTML antigo nao foi transformado em `description`.

## Diferencas Relevantes

- O migrador inicialmente tentou derivar `description` de trechos tecnicos como `Caminho` e fallback de video. Isso foi corrigido no gerador: agora `description` so vem de paragrafo introdutorio real antes do primeiro `##`.
- O migrador inicialmente manteria `Veja tambem` mesmo quando os links ja estavam resolvidos por ID. Isso foi corrigido para remover a secao apenas quando nao existem links adiados ou nao resolvidos.
- Quatro arquivos da Onda 1 ainda mantem `Veja tambem` porque possuem relacao com Manuais Classe D. Esse comportamento foi mantido de proposito para nao perder referencia e nao migrar Classe D indiretamente.

## Conclusao

O migrador estrutural esta apto para testar proximas ondas, mas a Onda 1 nao esta 100% previsivel para migracao automatica final porque 4 de 5 arquivos dependem de decisao humana sobre relacionados Classe D.

Recomendacao: antes de aplicar a Onda 1 em `docs/`, decidir se os links para Manuais Classe D devem ser removidos, mantidos temporariamente como Markdown ou aguardarem conclusao dos Manuais relacionados.
