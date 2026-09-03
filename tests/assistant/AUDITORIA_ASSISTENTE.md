# Auditoria do Assistente WCorp

Gerado em: `2026-08-31T19:37:36Z`.

Escopo: qualidade de ranking/seleção e variação de frases do Assistente. Não houve alteração em CSS, layout, avatar, posicionamento, navegação, Guias, Manuais, `mkdocs.yml` ou `content-catalog.json`.

## Regra Alterada

- Adicionada camada semântica de ação + objeto sobre o ranking existente.
- Ações reconhecidas: emitir/gerar, consultar/verificar, cancelar, cadastrar, configurar, corrigir e entender.
- Objetos reconhecidos: nota fiscal, cliente, pedido, estoque, regra fiscal, carta de correção, inutilização, material, fornecedor, boleto, relatório, XML, usuário e ordem de produção.
- Correspondência conjunta ação + objeto recebe bônus forte.
- Conflito semântico recebe penalidade, evitando casos como `como gerar nota` escolher `Como consultar notas fiscais rejeitadas`.
- Relacionados deixaram de ser preenchimento automático: quando o resultado principal tem ação + objeto com confiança alta, nenhum complemento é forçado.
- Frases foram separadas em famílias por contexto: executar, consultar, configurar/cadastrar, erro/rejeição, entender tela, resultado único, resultados complementares e nenhum resultado confiável.

## Casos De Teste

Foram executados `59` testes no runner `tests/assistant/runner.html`.

Casos obrigatórios adicionados:

- `como gerar nota`
- `como emitir uma nfe`
- `como consultar notas fiscais rejeitadas`
- `minha nota foi rejeitada`
- `como cancelar uma nota`
- `como fazer carta de correção`
- `como inutilizar uma nota`
- `como cadastrar cliente`
- `como gerar pedido`
- `como consultar estoque`
- `como verificar usuários logados`
- `como ver uma regra`
- `onde vejo regra fiscal`
- `como funciona nota fiscal`

O diagnóstico estruturado registra: consulta, intenção, ação, objeto, candidatos, score, bônus/penalidades, motivo de descarte, resultado final, relacionados e frase escolhida.

## Regressões Encontradas

Nenhuma regressão funcional comprovada após a calibração final.

Durante a execução foram detectadas inconsistências independentes do ranking:

- `como-fazer/cadastrar-centro-custo`
- `como-fazer/cadastrar-condicao-pagamento`
- `como-fazer/cadastrar-material`
- `como-fazer/cadastrar-natureza-operacao`
- `como-fazer/cadastrar-usuario`
- `como-fazer/cancelar-nfe`
- `como-fazer/configurar-grupo-usuario`
- `como-fazer/criar-orcamento`
- `como-fazer/emitir-carta-correcao`
- `como-fazer/faturar-nota`
- `como-fazer/fazer-pedido-venda`

Motivo: Guia publicado no `mkdocs.yml`, mas ausente do `content-catalog.json` usado pelo Assistente.

## Resultado Final

| Total | PASS | FAIL | CATALOG_INTEGRITY_ERROR |
|---:|---:|---:|---:|
| 59 | 54 | 0 | 5 |

Os 5 casos marcados como `CATALOG_INTEGRITY_ERROR` são testes que dependem de guias publicados em `mkdocs.yml`, mas ausentes do catálogo usado pelo Assistente. O runner não aplica fallback silencioso e não altera o catálogo.

Resultado estruturado: `tests/assistant/latest-results.json`.
