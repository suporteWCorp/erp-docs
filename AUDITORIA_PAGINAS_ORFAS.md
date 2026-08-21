# Auditoria de páginas órfãs e busca

Data: 2026-08-21

## Resumo

- Arquivos Markdown encontrados: 224
- Páginas referenciadas no `mkdocs.yml`: 83
- Páginas alcançadas por links internos/cards/listagens: 108
- Páginas órfãs restantes: 103
- Links internos quebrados em páginas finais: 0
- Links quebrados restantes em snippets/modelos internos: 8
- Conteúdo excluído nesta correção: nenhum

## Causa do resultado indevido

`suporte/coleta-de-evidencias.md` aparecia para consultas como "faturar nota" porque o Assistente usa o `search_index.json` completo do MkDocs. A página de coleta contém termos incidentais como "Nota fiscal", "XML", "cliente" e "pedido", então ela recebia pontos mesmo sendo uma página de suporte.

Correção aplicada: a página ganhou perfil condicional no Assistente. Ela só entra no ranking quando a consulta indicar suporte, chamado, evidência, print, anexo, arquivo ou coleta.

## Página Coleta de evidências

- Arquivo: `docs/suporte/coleta-de-evidencias.md`
- Decisão: manter pública e navegável pela página de Suporte.
- Link adicionado em: `docs/suporte/index.md`
- Busca/Assistente: condicional, somente para intenção de suporte/evidência.

## Páginas internas

Estas páginas não devem ser tratadas como documentação pública de usuário final:

- `como-documentar/base-de-erros.md`
- `como-documentar/caixas-de-aviso.md`
- `como-documentar/checklist-de-processo.md`
- `como-documentar/padrao-das-paginas.md`
- `como-documentar/plano-de-documentacao.md`
- `como-documentar/revisao-guias.md`
- `shared/avisos/configuracao-bancaria.md`
- `shared/avisos/permissoes.md`
- `shared/avisos/validacao-fiscal.md`
- `shared/modelos/guia-processo.md`
- `shared/modelos/manual-tela.md`
- `shared/portal/links-uteis.md`
- `shared/portal/mais-acessados.md`
- `shared/portal/sidebar.md`
- `suporte/triagem.md`

Decisão: manter como conteúdo interno/snippet/modelo. O Assistente bloqueia `como-documentar/*`; `suporte/triagem.md` só aparece em consulta explícita de triagem/suporte interno.

## Duplicadas, obsoletas ou em revisão

- `referencia/erros-comuns.md`: provável página antiga/duplicada da área atual `erros-solucoes`. Bloqueada no Assistente.
- `referencia/atualizacoes-fiscais.md`: conteúdo futuro/em revisão. Mantida fora de buscas genéricas.
- `suporte/base-de-erros.md`: página ponte navegável a partir de Suporte, aponta para Erros e Soluções. Não é órfã.
- `favoritos.md`: utilitária, acessada pelo recurso de Favoritos. Não foi adicionada ao menu nem removida.

## Páginas órfãs restantes

Decisão geral para os manuais abaixo: manter no repositório como conteúdo em revisão/fora da navegação atual. O Assistente agora usa a lista de manuais publicados no menu lateral para não furar páginas que não aparecem nos cards/menu.

### Administração

- `administracao/embalagem.md`
- `administracao/layout-ficha-tecnica.md`
- `administracao/municipio.md`
- `administracao/rateio-centro-custo.md`

### Colaboradores

- `colaboradores/cargos.md`
- `colaboradores/comissoes.md`
- `colaboradores/funcionarios-colaboradores.md`
- `colaboradores/pagamento-funcionario.md`
- `colaboradores/planejamento-pagamento.md`

### Comercial

- `comercial/comercial-separacao-pedido.md`
- `comercial/comissoes-vendedores.md`
- `comercial/despacho.md`
- `comercial/ficha-tecnica-material.md`
- `comercial/importar-nfe-remessa.md`
- `comercial/projecao-vendas.md`
- `comercial/transportadora.md`

### Compras

- `compras/aprovacao-compras.md`
- `compras/aprovacao-diretoria.md`
- `compras/planilha-equalizacao.md`
- `compras/requisicao-compras.md`
- `compras/requisicoes-projecao-vendas.md`

### Contratos

- `contratos/contratos.md`
- `contratos/fases-contrato.md`
- `contratos/manutencao-contratos.md`
- `contratos/materiais-servicos-previstos.md`

### Faturamento

- `faturamento/nota-fiscal-lote.md`
- `faturamento/nota-fiscal-servico.md`
- `faturamento/radar-nota-fiscal.md`

### Financeiro

- `financeiro/arquivo-remessa.md`
- `financeiro/cartao.md`
- `financeiro/cheque.md`
- `financeiro/conciliacao-bancaria.md`
- `financeiro/ferramentas-cnab.md`
- `financeiro/solicitacao-pagamento.md`
- `financeiro/transferencia-entre-contas.md`
- `financeiro/veiculos.md`

### Fornecedores

- `fornecedores/categoria-fornecedor.md`
- `fornecedores/certificado.md`

### Materiais

- `materiais/conversao-unidades.md`
- `materiais/entrada-material.md`
- `materiais/etiqueta.md`
- `materiais/ferramentas.md`
- `materiais/palete.md`
- `materiais/romaneio.md`
- `materiais/tabela-precos.md`

### Produção

- `producao/acessorio.md`
- `producao/custos-producao.md`
- `producao/equipamento.md`
- `producao/grupo-processo.md`
- `producao/inspecao.md`
- `producao/motivo-parada.md`
- `producao/ordem-producao.md`
- `producao/parametro.md`
- `producao/pcp.md`
- `producao/processo.md`
- `producao/qualidade.md`
- `producao/separar-material.md`

### Referência

- `referencia/atualizacoes-fiscais.md`
- `referencia/erros-comuns.md`

### Relatórios

- `relatorios/relatorio-nao-conformidade.md`
- `relatorios/relatorio-ocorrencia.md`
- `relatorios/relatorio-whatsapp.md`
- `relatorios/relatorios.md`
- `relatorios/sped-fiscal.md`
- `relatorios/xml-cfe.md`
- `relatorios/xml-cte.md`

### Serviços

- `servicos/cadastro-atividade.md`
- `servicos/cadastro-servico.md`
- `servicos/faturamento-recorrencia.md`
- `servicos/grupo-servico.md`
- `servicos/orcamento-os.md`
- `servicos/ordem-servico.md`
- `servicos/rateio-centro-custo.md`
- `servicos/tipo-ordem-servico.md`

### Suporte

- `suporte/triagem.md`

### Transportes

- `transportes/aliquotas-transporte.md`
- `transportes/averbacao-seguradora.md`
- `transportes/carga.md`
- `transportes/carta-correcao.md`
- `transportes/coleta.md`
- `transportes/conhecimento-transporte-lote.md`
- `transportes/conhecimento-transporte.md`
- `transportes/faturamento.md`
- `transportes/inutilizacao-cte.md`
- `transportes/manifesto-transporte.md`
- `transportes/orcamento-cte.md`
- `transportes/regioes.md`
- `transportes/tabela-precos.md`

### Utilitárias e internas

- `favoritos.md`
- `como-documentar/base-de-erros.md`
- `como-documentar/caixas-de-aviso.md`
- `como-documentar/checklist-de-processo.md`
- `como-documentar/padrao-das-paginas.md`
- `como-documentar/plano-de-documentacao.md`
- `como-documentar/revisao-guias.md`
- `shared/avisos/configuracao-bancaria.md`
- `shared/avisos/permissoes.md`
- `shared/avisos/validacao-fiscal.md`
- `shared/modelos/guia-processo.md`
- `shared/modelos/manual-tela.md`
- `shared/portal/links-uteis.md`
- `shared/portal/mais-acessados.md`
- `shared/portal/sidebar.md`

## Links quebrados em snippets/modelos internos

Não foram encontrados links quebrados em páginas finais de navegação pública. Os links abaixo aparecem em arquivos internos usados como snippet/modelo:

- `shared/modelos/guia-processo.md` -> `caminho-do-guia.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/faturar-nota.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/importar-xml.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/cadastrar-cliente.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/cadastrar-material.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/gerar-boleto.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/ajustar-estoque.md`
- `shared/portal/mais-acessados.md` -> `como-fazer/cancelar-nfe.md`

