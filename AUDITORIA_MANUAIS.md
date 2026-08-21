# Auditoria dos Manuais WCorp

Data da auditoria: 2026-08-20

Fonte analisada: bloco `Manual` do `mkdocs.yml` e arquivos Markdown referenciados na navegacao.

## Resumo

- Total de Manuais publicados na navegacao: 31
- OK pelo padrao novo: 0
- Fora do padrao: 6
- Incompletos: 2
- Precisam revisao tecnica: 23
- Sem screenshot: 24
- Sem objetivo: 2
- Sem caminho: 2
- Possiveis obsoletos: 0
- Possiveis duplicados: 0

Observacao: a maior lacuna estrutural e a ausencia de uma secao explicita de `Visao geral` na maior parte dos Manuais. Como isso exigiria conhecimento tecnico, nenhum texto foi inventado.

## Tabela de Auditoria

| Manual | Modulo | URL | Objetivo | Caminho | Visao geral | Print | Campos/areas | Acoes | Observacoes | Relacionados | Status | Observacao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Clientes | Comercial | /comercial/comercial-clientes/ | Sim | Sim | Nao | Sim | Sim | Sim | Sim | Sim | FORA DO PADRAO | Falta secao Visao geral |
| Grupo de clientes | Comercial | /comercial/comercial-grupo-clientes/ | Sim | Sim | Nao | Sim | Sim | Nao | Sim | Nao | FORA DO PADRAO | Falta Visao geral, acoes e relacionados |
| Orcamento | Comercial | /comercial/comercial-orcamento/ | Nao | Nao | Nao | Nao | Nao | Nao | Nao | Nao | PRECISA REVISAO TECNICA | Titulo divergente, sem objetivo, caminho e screenshot; conteudo em atualizacao |
| Pedido | Comercial | /comercial/pedidos/ | Nao | Nao | Nao | Sim | Nao | Nao | Nao | Nao | PRECISA REVISAO TECNICA | Titulo divergente, sem objetivo/caminho; conteudo em atualizacao |
| Devolucao | Comercial | /comercial/devolucao/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Nota Fiscal | Faturamento | /faturamento/faturamento-nf/ | Sim | Sim | Nao | Sim | Sim | Sim | Sim | Sim | FORA DO PADRAO | Falta secao Visao geral |
| Cupom Fiscal | Faturamento | /faturamento/faturamento-nfce/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Entrada de Nota Fiscal | Faturamento | /faturamento/entrada-nota-fiscal/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Carta de Correcao | Faturamento | /faturamento/carta-correcao/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Inutilizacao Nota Fiscal | Faturamento | /faturamento/inutilizacao-nota-fiscal/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| CFOP Entrada | Faturamento | /faturamento/cfop-entrada/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Contas a Pagar | Financeiro | /financeiro/contas-a-pagar/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Contas a Receber | Financeiro | /financeiro/contas-a-receber/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Boleto | Financeiro | /financeiro/boleto/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Contas | Financeiro | /financeiro/contas/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Fornecedores | Fornecedores | /fornecedores/fornecedores/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Materiais | Materiais | /materiais/materiais/ | Sim | Sim | Nao | Sim | Sim | Nao | Sim | Nao | INCOMPLETO | Titulo divergente; falta Visao geral e acoes |
| Categoria de Materiais | Materiais | /materiais/categoria-materiais/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Locais de Armazenagem | Materiais | /materiais/locais-armazenagem/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Ajustar Inventario | Materiais | /materiais/ajustar-inventario/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Lote/Estoque | Materiais | /materiais/lote-estoque/ | Sim | Sim | Nao | Sim | Sim | Nao | Sim | Nao | FORA DO PADRAO | Falta Visao geral, acoes e relacionados |
| Pedido de Compra | Compras | /compras/pedido-compra/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| XML(s) NFe | Relatorios | /relatorios/xml-nfe/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Usuarios | Administracao | /administracao/usuarios/ | Sim | Sim | Nao | Sim | Sim | Nao | Sim | Nao | FORA DO PADRAO | Falta Visao geral, acoes e relacionados |
| Grupo Usuarios | Administracao | /administracao/grupo-usuarios/ | Sim | Sim | Nao | Nao | Nao | Nao | Sim | Sim | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Empresas | Administracao | /administracao/empresas/ | Sim | Sim | Nao | Nao | Nao | Nao | Sim | Sim | INCOMPLETO | Sem screenshot; falta campos/acoes |
| Natureza de Operacao | Administracao | /administracao/natureza-op/ | Sim | Sim | Nao | Nao | Nao | Sim | Nao | Sim | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Unidades | Administracao | /administracao/unidades/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| NCMS | Administracao | /administracao/ncms/ | Sim | Sim | Nao | Nao | Nao | Nao | Sim | Sim | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Centro de Custo | Administracao | /administracao/centro-custo/ | Sim | Sim | Nao | Nao | Sim | Sim | Sim | Nao | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |
| Condicoes de Pagamento | Administracao | /administracao/condicoes-pagamento/ | Sim | Sim | Nao | Nao | Nao | Nao | Sim | Sim | PRECISA REVISAO TECNICA | Sem screenshot; conteudo em atualizacao |

## Manuais OK

Nenhum Manual atende integralmente ao padrao novo, principalmente pela ausencia de `Visao geral` explicita.

## Manuais Incompletos

- Materiais
- Empresas

## Manuais Fora do Padrao

- Clientes
- Grupo de clientes
- Nota Fiscal
- Materiais
- Lote/Estoque
- Usuarios

## Manuais que Precisam Revisao Tecnica

- Orcamento
- Pedido
- Devolucao
- Cupom Fiscal
- Entrada de Nota Fiscal
- Carta de Correcao
- Inutilizacao Nota Fiscal
- CFOP Entrada
- Contas a Pagar
- Contas a Receber
- Boleto
- Contas
- Fornecedores
- Categoria de Materiais
- Locais de Armazenagem
- Ajustar Inventario
- Pedido de Compra
- XML(s) NFe
- Grupo Usuarios
- Natureza de Operacao
- Unidades
- NCMS
- Centro de Custo
- Condicoes de Pagamento

## Manuais sem Screenshot

- Orcamento
- Devolucao
- Cupom Fiscal
- Entrada de Nota Fiscal
- Carta de Correcao
- Inutilizacao Nota Fiscal
- CFOP Entrada
- Contas a Pagar
- Contas a Receber
- Boleto
- Contas
- Fornecedores
- Categoria de Materiais
- Locais de Armazenagem
- Ajustar Inventario
- Pedido de Compra
- XML(s) NFe
- Grupo Usuarios
- Empresas
- Natureza de Operacao
- Unidades
- NCMS
- Centro de Custo
- Condicoes de Pagamento

## Manuais sem Objetivo

- Orcamento
- Pedido

## Manuais sem Caminho

- Orcamento
- Pedido

## Possiveis Obsoletos ou Duplicados

Nao foram encontrados sinais confiaveis de duplicidade ou obsolescencia apenas pela estrutura atual. Recomenda-se validacao humana para paginas com `Conteudo em atualizacao`.

## Padrao Oficial Recomendado

1. Breadcrumb: `Inicio > Manual > Modulo > Tela`
2. Titulo: nome da tela/recurso do ERP
3. Metadados: tempo, dificuldade, popularidade/video quando existir e favorito
4. `## Objetivo`
5. `## Caminho`
6. `## Visao geral`
7. `## Print da tela`
8. `## Campos principais` ou `## Areas da tela`
9. `## Acoes disponiveis` ou equivalente
10. `## Observacoes` / `## Avisos` / alertas existentes
11. `## Veja tambem`

## Exemplos de Antes/Depois Visual

### Clientes

Antes: titulo, `Objetivo` e `Caminho` apareciam como Markdown padrao; o caminho ficava com aparencia de codigo.

Depois: o titulo fica mais proximo dos Guias, metadados recebem divisoria discreta, `Objetivo` ganha barra teal leve, o `Caminho` vira uma peca visual interna e o print usa container limpo.

### Nota Fiscal

Antes: screenshots e tabelas tinham aparencia generica e pesada.

Depois: screenshots ficam em container responsivo com borda discreta, tabelas de campos seguem visual leve de sistema e os relacionados permanecem como links simples.

## Revisao Humana Necessaria

- Escrever `Visao geral` sem inventar informacao tecnica.
- Substituir placeholders `A definir`.
- Capturar screenshots faltantes.
- Corrigir titulos divergentes onde o `# H1` nao bate com a navegacao.
- Validar caminhos do ERP nas paginas marcadas como conteudo em atualizacao.
