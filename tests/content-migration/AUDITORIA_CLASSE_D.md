# Auditoria Editorial dos Conteudos Classe D

Escopo: auditoria editorial dos 21 conteudos Classe D identificados em `INVENTARIO_CONTEUDO.md`.

Nenhum arquivo em `docs/` foi alterado. As classificacoes abaixo sao recomendacoes para revisao humana antes da V1, nao decisoes definitivas de exclusao.

## Resumo

- Total auditado: 21 paginas
- D1 - Remover da V1: 1
- D2 - Completar antes da V1: 15
- D3 - Manter como esta temporariamente: 4
- D4 - Possivel duplicidade: 1

## Criterios usados

- D1 - REMOVER DA V1: pagina sem conteudo util suficiente, placeholder ou texto incorreto para o titulo.
- D2 - COMPLETAR ANTES DA V1: tema importante, mas conteudo insuficiente para publicar como Manual confiavel.
- D3 - MANTER COMO ESTA TEMPORARIAMENTE: conteudo limitado, mas ainda responde algo util e pode ficar temporariamente com aviso de revisao.
- D4 - POSSIVEL DUPLICIDADE: precisa comparar com outro Guia/Manual antes de decidir se permanece separado.

## Prioridades Antes da V1

1. `docs/comercial/comercial-orcamento.md`: texto parece nao corresponder ao titulo e pode confundir o usuario.
2. `docs/comercial/pedidos.md`: tela importante e vinculada ao fluxo comercial; depende de revisao junto do Guia de pedido.
3. `docs/faturamento/entrada-nota-fiscal.md`: tema fiscal/operacional importante, mas ainda usa estrutura generica.
4. `docs/faturamento/carta-correcao.md`: rotina fiscal sensivel; precisa orientacao operacional mais precisa.
5. `docs/faturamento/cfop-entrada.md`: tema fiscal sensivel e potencialmente relacionado a Natureza de Operacao.
6. `docs/financeiro/contas-a-pagar.md`, `docs/financeiro/contas-a-receber.md`, `docs/financeiro/boleto.md` e `docs/financeiro/contas.md`: conjunto precisa revisao em bloco para evitar sobreposicao.

## Paginas Auditadas

### Módulo Comercial - Orçamentos

- Caminho: `docs/comercial/comercial-orcamento.md`
- Situacao encontrada: aviso de conteudo em atualizacao, corpo muito curto e texto menciona cadastro de pedido de venda em uma pagina de orcamentos.
- Quantidade/qualidade aproximada: cerca de 54 palavras uteis; sem secoes operacionais, sem campos, sem passos especificos e sem imagem.
- Classificacao sugerida: D1 - REMOVER DA V1.
- Justificativa: a pagina funciona praticamente como placeholder e a frase principal parece deslocada ou reaproveitada de Pedido de Venda, gerando risco de confusao.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/criar-orcamento.md`; avaliar tambem relacao com `docs/comercial/pedidos.md`.
- Acao recomendada: retirar da publicacao V1 ou ocultar da navegacao ate haver conteudo especifico de Orçamentos; revisar se o tema deve existir como Manual separado.

### Módulo Comercial - Pedido de Venda

- Caminho: `docs/comercial/pedidos.md`
- Situacao encontrada: aviso de conteudo em atualizacao, texto curto, um print de menu e orientacao generica.
- Quantidade/qualidade aproximada: cerca de 56 palavras uteis; possui imagem, mas nao possui campos, regras ou explicacao da tela.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: Pedido de Venda e uma tela central do Comercial; o conteudo atual aponta para o Guia, mas nao cumpre bem o papel de Manual.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/fazer-pedido-venda.md` e `docs/como-fazer/criar-orcamento.md`.
- Acao recomendada: completar com objetivo, caminho, campos principais, acoes da tela e relacao com orcamento/faturamento antes da V1.

### Devolução

- Caminho: `docs/comercial/devolucao.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura de manual generica, campos e duvidas com `A definir`.
- Quantidade/qualidade aproximada: cerca de 123 palavras uteis; tem caminho e passos genericos, mas nao ha informacao operacional especifica.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: ha esqueleto, mas os campos principais e resultado esperado ainda sao placeholders.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/emitir-devolucao.md`.
- Acao recomendada: completar campos, criterios de uso, diferenca entre devolucao comercial/fiscal e resultado esperado.

### Entrada de Nota Fiscal

- Caminho: `docs/faturamento/entrada-nota-fiscal.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 137 palavras uteis; possui objetivo e caminho, mas os passos sao amplos demais.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: rotina de entrada fiscal e importante; o conteudo atual ainda nao orienta campos, estados ou excecoes.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/importar-xml.md`; consultar tambem `docs/faturamento/faturamento-nf.md` para padrao de tela fiscal.
- Acao recomendada: completar antes da V1 com fluxo real, campos obrigatorios, vinculo com XML e cuidados fiscais.

### Carta de Correção

- Caminho: `docs/faturamento/carta-correcao.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 132 palavras uteis; tem objetivo e caminho, mas falta criterio operacional.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: a rotina e fiscalmente sensivel; publicar apenas o template pode induzir uso incompleto.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/emitir-carta-correcao.md`.
- Acao recomendada: completar com limites de uso, campos da tela, envio, retorno e relacao com NF-e autorizada.

### CFOP Entrada

- Caminho: `docs/faturamento/cfop-entrada.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 123 palavras uteis; objetivo curto, sem detalhamento de campos ou criterio fiscal.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: CFOP e informacao fiscal critica; a pagina atual nao explica regra, uso no WCorp ou relacao com natureza/regra fiscal.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-natureza-operacao.md` e `docs/administracao/natureza-op.md`.
- Acao recomendada: revisar com responsavel fiscal/operacional e completar antes da V1.

### Contas a Pagar

- Caminho: `docs/financeiro/contas-a-pagar.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 119 palavras uteis; objetivo e caminho existem, mas faltam campos, estados e acoes.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: tema importante do financeiro; o conteudo atual e um esqueleto.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/lancar-contas-a-pagar.md`.
- Acao recomendada: completar com campos, filtros, status, baixa/estorno quando aplicavel e mensagens comuns.

### Contas a Receber

- Caminho: `docs/financeiro/contas-a-receber.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 119 palavras uteis; semelhante a Contas a Pagar.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: rotina financeira importante, mas sem informacao suficiente para uso autonomo.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/baixar-titulo.md` e `docs/financeiro/boleto.md`.
- Acao recomendada: completar junto com Boleto e Contas para evitar sobreposicao.

### Boleto

- Caminho: `docs/financeiro/boleto.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 115 palavras uteis; informa objetivo geral, mas nao orienta geracao/consulta/remessa/retorno.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: existe Guia relacionado, mas o Manual nao explica a tela nem estados do boleto.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/gerar-boleto.md` e `docs/financeiro/contas-a-receber.md`.
- Acao recomendada: completar com fluxo real de boleto e relacao com contas a receber.

### Contas

- Caminho: `docs/financeiro/contas.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e link relacionado para Boleto.
- Quantidade/qualidade aproximada: cerca de 117 palavras uteis; conteudo parecido com outras paginas financeiras.
- Classificacao sugerida: D4 - POSSIVEL DUPLICIDADE.
- Justificativa: o escopo "Contas" pode se sobrepor a Contas a Pagar, Contas a Receber, contas bancarias ou Boleto; o link relacionado para gerar boleto nao confirma o limite da tela.
- Conteudo relacionado que pode substituir/complementar: `docs/financeiro/contas-a-pagar.md`, `docs/financeiro/contas-a-receber.md`, `docs/financeiro/boleto.md` e `docs/como-fazer/gerar-boleto.md`.
- Acao recomendada: revisar se "Contas" e uma tela independente, uma configuracao financeira ou uma pagina agregadora; so depois decidir manter, unir ou completar.

### Fornecedores

- Caminho: `docs/fornecedores/fornecedores.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 113 palavras uteis; objetivo e caminho existem, mas faltam campos e regras.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: tema importante e com Guia relacionado; o Manual ainda nao documenta a tela.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-fornecedor.md`.
- Acao recomendada: completar com campos de fornecedor, consulta/alteracao, documentos e vinculos com compras/financeiro.

### Categoria de Materiais

- Caminho: `docs/materiais/categoria-materiais.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 127 palavras uteis; ha objetivo e caminho, mas faltam criterios da categoria.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: conteudo operacional ainda incompleto e dependente de definicao de campos.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-material.md` e `docs/materiais/materiais.md`.
- Acao recomendada: completar com finalidade da categoria, impacto em material/estoque/fiscal quando aplicavel.

### Locais de Armazenagem

- Caminho: `docs/materiais/locais-armazenagem.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 130 palavras uteis; objetivo e caminho existem, mas faltam exemplos/campos.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: importante para estoque, mas a pagina ainda nao diferencia local, lote e movimentos.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/consultar-estoque.md`, `docs/materiais/lote-estoque.md` e `docs/materiais/materiais.md`.
- Acao recomendada: completar com campos, uso em movimentacoes e relacao com estoque/lote.

### Ajustar Inventário

- Caminho: `docs/materiais/ajustar-inventario.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 125 palavras uteis; objetivo e caminho existem, mas faltam regras de ajuste.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: ajuste de inventario pode afetar saldo; o conteudo precisa orientar cuidado operacional.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/ajustar-estoque.md` e `docs/como-fazer/fazer-inventario.md`.
- Acao recomendada: completar com prerequisitos, campos, efeitos no saldo e validacoes.

### Pedido de Compra

- Caminho: `docs/compras/pedido-compra.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 119 palavras uteis; objetivo e caminho existem, mas falta funcionamento da tela.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: tela importante de Compras; publicar como Manual final exigiria campos e fluxo real.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/criar-pedido-compra.md`.
- Acao recomendada: completar com criacao, consulta, aprovacao/confirmacao se existir e relacao com entrada de nota.

### Grupo Usuários

- Caminho: `docs/administracao/grupo-usuarios.md`
- Situacao encontrada: aviso de conteudo em atualizacao, objetivo curto, caminho e links relacionados; nao possui tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 78 palavras uteis; limitado, mas orienta finalidade e aponta para o Guia.
- Classificacao sugerida: D3 - MANTER COMO ESTA TEMPORARIAMENTE.
- Justificativa: apesar de incompleto, o conteudo ainda explica a finalidade da tela e possui substituto direto.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/configurar-grupo-usuario.md` e `docs/administracao/usuarios.md`.
- Acao recomendada: manter temporariamente com aviso, mas completar campos/permissoes antes de consolidar V1.

### Natureza de Operação

- Caminho: `docs/administracao/natureza-op.md`
- Situacao encontrada: aviso de conteudo em atualizacao, mas possui objetivo, caminho, secoes explicativas, criterios e relacao com faturamento.
- Quantidade/qualidade aproximada: cerca de 461 palavras uteis; e o Classe D com conteudo mais consistente.
- Classificacao sugerida: D3 - MANTER COMO ESTA TEMPORARIAMENTE.
- Justificativa: embora ainda tenha aviso de revisao e precise front matter V1, a pagina ja responde parte importante do funcionamento da tela.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-natureza-operacao.md`, `docs/como-fazer/faturar-nota.md` e `docs/faturamento/faturamento-nf.md`.
- Acao recomendada: manter temporariamente; remover aviso apenas apos revisao fiscal/operacional e migrar depois da Classe B.

### Unidades

- Caminho: `docs/administracao/unidades.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 110 palavras uteis; objetivo e caminho existem, mas faltam campos e impacto operacional.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: pagina ainda e template com conteudo operacional insuficiente.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-material.md` e `docs/materiais/materiais.md`.
- Acao recomendada: completar com uso de unidades em materiais, compras, estoque e faturamento.

### NCMS

- Caminho: `docs/administracao/ncms.md`
- Situacao encontrada: aviso de conteudo em atualizacao, objetivo curto, caminho e links relacionados; nao possui tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 75 palavras uteis; limitado, mas aponta relacao fiscal/material.
- Classificacao sugerida: D3 - MANTER COMO ESTA TEMPORARIAMENTE.
- Justificativa: conteudo curto, porem util como referencia minima e com links para Material/Natureza de Operacao.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-material.md` e `docs/administracao/natureza-op.md`.
- Acao recomendada: manter temporariamente com aviso; completar depois com campos e cuidados fiscais.

### Centro de Custo

- Caminho: `docs/administracao/centro-custo.md`
- Situacao encontrada: aviso de conteudo em atualizacao, estrutura generica e tabela com `A definir`.
- Quantidade/qualidade aproximada: cerca de 118 palavras uteis; objetivo e caminho existem, mas faltam campos e uso pratico.
- Classificacao sugerida: D2 - COMPLETAR ANTES DA V1.
- Justificativa: pagina ainda nao documenta a tela alem do esqueleto.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-centro-custo.md`.
- Acao recomendada: completar com campos, impacto em financeiro/lancamentos e exemplos de uso.

### Condições de Pagamento

- Caminho: `docs/administracao/condicoes-pagamento.md`
- Situacao encontrada: aviso de conteudo em atualizacao, objetivo curto, caminho e links relacionados; nao possui tabela placeholder.
- Quantidade/qualidade aproximada: cerca de 82 palavras uteis; limitado, mas ainda localiza a tela e seu uso.
- Classificacao sugerida: D3 - MANTER COMO ESTA TEMPORARIAMENTE.
- Justificativa: conteudo incompleto, mas util como ponte para o Guia e para Financeiro > Contas a Receber.
- Conteudo relacionado que pode substituir/complementar: `docs/como-fazer/cadastrar-condicao-pagamento.md` e `docs/financeiro/contas-a-receber.md`.
- Acao recomendada: manter temporariamente com aviso; completar campos, parcelas, prazos e impacto em vendas/compras.

## Padroes Encontrados

- Todos os 21 conteudos possuem aviso de "Conteudo em atualizacao" ou equivalente.
- 14 paginas usam tabelas ou campos com `A definir`, indicando template incompleto.
- Varias paginas tem passos genericos como "informe os filtros ou dados necessarios", sem orientar a operacao real.
- Algumas paginas curtas funcionam melhor como ponte temporaria para Guias existentes do que como Manuais completos.
- `docs/comercial/comercial-orcamento.md` apresenta maior risco editorial por aparente texto reaproveitado de Pedido de Venda.
- `docs/financeiro/contas.md` precisa decisao de escopo antes de completar, pois pode sobrepor Contas a Pagar, Contas a Receber e Boleto.

## Recomendacao Geral

- Nao migrar Classe D automaticamente para o padrao V1.
- Antes da V1, revisar prioritariamente os Manuais fiscais e financeiros por impacto operacional.
- Manter temporariamente apenas paginas D3 se a equipe aceitar o aviso de conteudo em atualizacao.
- Para D1 e D4, decidir primeiro se a pagina deve existir na navegacao antes de qualquer migracao estrutural.
