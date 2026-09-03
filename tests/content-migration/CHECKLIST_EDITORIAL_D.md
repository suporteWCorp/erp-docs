# Checklist Editorial Classe D - Preparacao V1

Escopo: transformar a auditoria editorial Classe D em um plano pratico de revisao humana.

Nenhum conteudo em `docs/` deve ser alterado a partir deste arquivo sem decisao editorial posterior. Para paginas D2, os itens abaixo sao perguntas a responder no WCorp, nao conteudo pronto.

## Resumo

- Total de paginas Classe D: 21
- D1 - Remover da V1: 1
- D2 - Completar antes da V1: 15
- D3 - Manter como esta temporariamente: 4
- D4 - Possivel duplicidade: 1

## D2 por Prioridade

| Prioridade | Pagina | Motivo |
| --- | --- | --- |
| P0 | `docs/comercial/pedidos.md` | Tela central do fluxo comercial, mas conteudo atual e quase placeholder. |
| P0 | `docs/faturamento/entrada-nota-fiscal.md` | Rotina fiscal/operacional importante e ainda generica. |
| P0 | `docs/faturamento/carta-correcao.md` | Rotina fiscal sensivel; precisa criterio claro de uso. |
| P0 | `docs/faturamento/cfop-entrada.md` | Tema fiscal sensivel e relacionado a configuracoes de calculo. |
| P1 | `docs/financeiro/contas-a-pagar.md` | Fluxo financeiro importante; faltam campos, status e acoes. |
| P1 | `docs/financeiro/contas-a-receber.md` | Fluxo financeiro importante; precisa diferenciar baixa, boleto e recebimento. |
| P1 | `docs/financeiro/boleto.md` | Fluxo financeiro importante; faltam estados e integracoes. |
| P1 | `docs/comercial/devolucao.md` | Processo com impacto operacional/fiscal; template ainda incompleto. |
| P1 | `docs/compras/pedido-compra.md` | Tela importante de compras; faltam campos e status. |
| P2 | `docs/fornecedores/fornecedores.md` | Cadastro base; pode ser completado com conferencia de campos. |
| P2 | `docs/materiais/categoria-materiais.md` | Cadastro auxiliar; faltam regras de impacto. |
| P2 | `docs/materiais/locais-armazenagem.md` | Cadastro auxiliar; precisa diferenciar local/lote/saldo. |
| P2 | `docs/materiais/ajustar-inventario.md` | Rotina afeta estoque; confirmar efeitos no saldo. |
| P2 | `docs/administracao/unidades.md` | Cadastro auxiliar; deve confirmar impacto em material/compra/faturamento. |
| P2 | `docs/administracao/centro-custo.md` | Cadastro auxiliar; precisa confirmar uso em lancamentos e rateios. |

## Checklist por Pagina

### Módulo Comercial - Orçamentos

- Caminho: `docs/comercial/comercial-orcamento.md`
- Classificacao: D1 - REMOVER DA V1
- Prioridade: P0
- Problema especifico: pagina quase sem conteudo e texto aparentemente reaproveitado de Pedido de Venda.
- Informacao faltando: escopo real da tela de orcamentos, campos, acoes, estados e diferenca entre orcamento e pedido.
- Confirmar com alguem que conhece o WCorp:
  - A tela de Orcamentos deve existir como Manual separado na V1?
  - O texto atual sobre pedido de venda esta incorreto para esta pagina?
  - O Guia `criar-orcamento.md` cobre suficientemente o tema para a V1?
  - Existe uma tela especifica de Orcamento diferente da tela de Pedido?
  - A pagina deve ser removida da navegacao ou apenas ocultada temporariamente?
- Relacionados que podem ajudar: `docs/como-fazer/criar-orcamento.md`; possivel comparacao com `docs/comercial/pedidos.md`.
- Acao antes da V1: decidir se remove/oculta da V1; nao migrar enquanto o escopo estiver inconsistente.
- Pendencias: 5

### Módulo Comercial - Pedido de Venda

- Caminho: `docs/comercial/pedidos.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P0
- Problema especifico: possui aviso de revisao, texto curto e um print, mas nao documenta a tela.
- Informacao faltando:
  - finalidade principal da tela;
  - caminho confirmado no ERP;
  - campos principais;
  - acoes disponiveis;
  - estados/status do pedido;
  - relacao com Orcamento;
  - relacao com Faturamento/NF-e;
  - mensagens ou bloqueios frequentes.
- Confirmar com alguem que conhece o WCorp:
  - Pedido pode ser criado do zero e tambem a partir de Orcamento?
  - Quais campos sao obrigatorios para salvar?
  - Quais acoes existem depois de salvar?
  - Existe aprovacao, cancelamento, separacao ou faturamento direto?
  - Quais erros comuns chegam ao Suporte?
  - O print atual ainda representa a tela real?
  - Quais permissoes impactam a rotina?
  - O Guia `fazer-pedido-venda.md` deve complementar ou substituir parte deste Manual?
- Relacionados que podem ajudar: `docs/como-fazer/fazer-pedido-venda.md`, `docs/como-fazer/criar-orcamento.md`.
- Acao antes da V1: completar como Manual da tela ou retirar temporariamente se o Guia for suficiente.
- Pendencias: 8

### Devolução

- Caminho: `docs/comercial/devolucao.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P1
- Problema especifico: estrutura generica com campos e duvidas em `A definir`.
- Informacao faltando:
  - quando usar Devolucao no Comercial;
  - diferenca entre devolucao comercial e devolucao fiscal, se existir;
  - campos principais;
  - vinculo com pedido/nota/origem;
  - acoes disponiveis;
  - resultado esperado;
  - bloqueios comuns;
  - relacao com o Guia de devolucao.
- Confirmar com alguem que conhece o WCorp:
  - A tela gera documento fiscal ou apenas registra o processo comercial?
  - E necessario vincular pedido, cliente ou nota de origem?
  - Quais campos sao obrigatorios?
  - O que muda no estoque/financeiro?
  - Existe cancelamento ou estorno?
  - Quais validacoes aparecem com mais frequencia?
  - O Guia `emitir-devolucao.md` cobre a parte fiscal ou operacional?
  - Quais dados o Suporte precisa quando houver erro?
- Relacionados que podem ajudar: `docs/como-fazer/emitir-devolucao.md`.
- Acao antes da V1: completar campos, fluxo e resultado esperado.
- Pendencias: 8

### Entrada de Nota Fiscal

- Caminho: `docs/faturamento/entrada-nota-fiscal.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P0
- Problema especifico: pagina fiscal importante com passos genericos e tabela `A definir`.
- Informacao faltando:
  - finalidade da tela;
  - diferenca entre entrada manual e importacao de XML;
  - campos obrigatorios;
  - vinculo com fornecedor/pedido de compra;
  - validacoes fiscais;
  - efeitos em estoque;
  - efeitos em financeiro;
  - acoes de salvar/confirmar/transmitir, se existirem;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Quando o usuario deve usar esta tela em vez de `importar-xml.md`?
  - Existe vinculo obrigatorio com pedido de compra?
  - Quais campos fiscais precisam conferencia?
  - A rotina movimenta estoque automaticamente?
  - A rotina gera contas a pagar automaticamente?
  - Existe autorizacao/manifestacao/transmissao envolvida?
  - Quais mensagens da SEFAZ ou do sistema podem aparecer?
  - Quais permissoes sao necessarias?
  - O Manual `faturamento-nf.md` ajuda ou trata apenas saida?
- Relacionados que podem ajudar: `docs/como-fazer/importar-xml.md`, `docs/faturamento/faturamento-nf.md`.
- Acao antes da V1: completar com fluxo real e criterios fiscais/operacionais.
- Pendencias: 9

### Carta de Correção

- Caminho: `docs/faturamento/carta-correcao.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P0
- Problema especifico: rotina fiscal sensivel documentada apenas por template.
- Informacao faltando:
  - finalidade da tela;
  - quando carta de correcao pode ser usada;
  - quando nao pode ser usada;
  - campos principais;
  - vinculo com NF-e autorizada;
  - fluxo de envio;
  - retorno da SEFAZ;
  - cancelamento/correcao posterior, se existir;
  - mensagens comuns.
- Confirmar com alguem que conhece o WCorp:
  - A tela lista apenas NF-e autorizada?
  - Quais informacoes podem ser corrigidas no WCorp?
  - O sistema valida limites de uso ou depende do responsavel fiscal?
  - Como o usuario acompanha autorizacao/retorno?
  - Existe impressao ou download do evento?
  - O que fazer quando a SEFAZ rejeita a carta?
  - Existe prazo operacional exibido pelo sistema?
  - Quais campos sao obrigatorios?
  - O Guia `emitir-carta-correcao.md` ja cobre parte do fluxo?
- Relacionados que podem ajudar: `docs/como-fazer/emitir-carta-correcao.md`.
- Acao antes da V1: completar com limites operacionais e fluxo real no WCorp.
- Pendencias: 9

### CFOP Entrada

- Caminho: `docs/faturamento/cfop-entrada.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P0
- Problema especifico: tema fiscal critico, mas pagina nao explica regra, campos ou uso no WCorp.
- Informacao faltando:
  - finalidade da tela;
  - relacao com entrada de nota;
  - relacao com Natureza de Operacao;
  - campos principais;
  - criterios fiscais;
  - quando alterar/cadastrar;
  - impacto no XML/calculo;
  - validacoes ou erros comuns;
  - responsavel por conferir configuracao.
- Confirmar com alguem que conhece o WCorp:
  - A tela cadastra CFOPs ou apenas parametriza CFOP de entrada?
  - Como ela se relaciona com Regra Fiscal/Natureza de Operacao?
  - Quais campos sao obrigatorios?
  - O usuario comum deve alterar isso ou apenas fiscal/suporte?
  - Alterar CFOP afeta notas futuras ou documentos ja emitidos?
  - Existem validacoes automaticas?
  - Quais erros costumam ocorrer por configuracao incorreta?
  - Existe relacao com material/NCM?
  - Qual orientacao deve ficar como alerta fiscal?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-natureza-operacao.md`, `docs/administracao/natureza-op.md`.
- Acao antes da V1: completar com revisao fiscal/operacional; nao publicar como template generico.
- Pendencias: 9

### Contas a Pagar

- Caminho: `docs/financeiro/contas-a-pagar.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P1
- Problema especifico: esqueleto generico com tabela `A definir`.
- Informacao faltando:
  - finalidade principal da tela;
  - diferenca entre lancamento manual e automatico;
  - campos principais;
  - filtros;
  - status;
  - acoes disponiveis;
  - relacao com baixa;
  - relacao com Centro de Custo;
  - relacao com entrada/compra/fornecedor.
- Confirmar com alguem que conhece o WCorp:
  - Quais titulos entram automaticamente no Contas a Pagar?
  - Como criar titulo manual?
  - Como baixar, cancelar ou estornar?
  - Quais status existem?
  - Quais campos sao obrigatorios?
  - Centro de Custo e obrigatorio ou opcional?
  - Existe rateio?
  - Quais permissoes bloqueiam a rotina?
  - Quais erros/mensagens sao comuns?
- Relacionados que podem ajudar: `docs/como-fazer/lancar-contas-a-pagar.md`, `docs/administracao/centro-custo.md`.
- Acao antes da V1: completar em conjunto com Contas, Contas a Receber e Boleto.
- Pendencias: 9

### Contas a Receber

- Caminho: `docs/financeiro/contas-a-receber.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P1
- Problema especifico: conteudo semelhante a Contas a Pagar, sem detalhar rotina propria.
- Informacao faltando:
  - finalidade principal da tela;
  - origem dos titulos;
  - diferenca entre lancamento manual e automatico;
  - campos principais;
  - filtros;
  - status;
  - relacao com boleto;
  - relacao com baixa;
  - relacao com cliente/pedido/nota.
- Confirmar com alguem que conhece o WCorp:
  - Quais rotinas geram contas a receber automaticamente?
  - Como criar titulo manual?
  - Como baixar, cancelar ou estornar recebimento?
  - Boleto nasce nesta tela ou em tela separada?
  - Quais status existem?
  - Quais campos sao obrigatorios?
  - Existe conciliacao ou retorno bancario?
  - Quais permissoes impactam a rotina?
  - Quais mensagens chegam mais ao Suporte?
- Relacionados que podem ajudar: `docs/como-fazer/baixar-titulo.md`, `docs/financeiro/boleto.md`.
- Acao antes da V1: completar junto do bloco financeiro para evitar informacao duplicada.
- Pendencias: 9

### Boleto

- Caminho: `docs/financeiro/boleto.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P1
- Problema especifico: objetivo existe, mas nao explica geracao, consulta, remessa, retorno ou estados do boleto.
- Informacao faltando:
  - finalidade da tela;
  - origem dos boletos;
  - relacao com Contas a Receber;
  - campos principais;
  - filtros;
  - acoes disponiveis;
  - estados/status;
  - remessa/retorno, se existir;
  - cancelamento/baixa/segunda via;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - O boleto e gerado a partir de titulo, nota ou pedido?
  - Quais dados bancarios precisam estar configurados?
  - Existe envio/remessa bancaria no WCorp?
  - Existe retorno/baixa automatica?
  - Como cancelar ou regerar boleto?
  - Quais status aparecem?
  - Quais campos sao obrigatorios?
  - Quais permissoes sao necessarias?
  - Quais erros ocorrem por configuracao bancaria?
  - O Guia `gerar-boleto.md` cobre a operacao principal?
- Relacionados que podem ajudar: `docs/como-fazer/gerar-boleto.md`, `docs/financeiro/contas-a-receber.md`.
- Acao antes da V1: completar com fluxo real e dependencia de configuracao bancaria.
- Pendencias: 10

### Contas

- Caminho: `docs/financeiro/contas.md`
- Classificacao: D4 - POSSIVEL DUPLICIDADE
- Prioridade: P0
- Problema especifico: escopo ambiguo e potencial sobreposicao com Contas a Pagar, Contas a Receber e Boleto.
- Informacao faltando: definicao do que a tela "Contas" representa no ERP.
- Conteudos que parecem se sobrepor:
  - `docs/financeiro/contas-a-pagar.md`
  - `docs/financeiro/contas-a-receber.md`
  - `docs/financeiro/boleto.md`
  - `docs/como-fazer/gerar-boleto.md`
- Decisao humana necessaria:
  - "Contas" e uma tela independente?
  - "Contas" significa contas financeiras/bancarias?
  - "Contas" deve virar uma pagina agregadora do financeiro?
  - O link atual para `gerar-boleto.md` esta correto?
  - A pagina deve ser unida a outra ou mantida separada?
  - Qual nome exibido no menu corresponde exatamente ao ERP?
- Relacionados que podem ajudar: bloco Financeiro completo.
- Acao antes da V1: decidir escopo antes de completar ou migrar.
- Pendencias: 6

### Fornecedores

- Caminho: `docs/fornecedores/fornecedores.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: cadastro importante, mas ainda com tabela `A definir`.
- Informacao faltando:
  - finalidade da tela;
  - campos principais;
  - diferenca entre fornecedor pessoa fisica/juridica, se houver;
  - documentos obrigatorios;
  - acoes de consulta/edicao/inativacao;
  - relacao com compras;
  - relacao com financeiro;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Quais campos sao obrigatorios?
  - Existe validacao de CNPJ/CPF?
  - Fornecedor se relaciona com transportadora ou cliente?
  - Existe inativacao?
  - Quais dados fiscais sao relevantes?
  - O cadastro impacta entrada de nota?
  - O cadastro gera vinculos financeiros?
  - Quais mensagens aparecem quando cadastro esta incompleto?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-fornecedor.md`.
- Acao antes da V1: completar campos e relacoes com compras/fiscal/financeiro.
- Pendencias: 8

### Categoria de Materiais

- Caminho: `docs/materiais/categoria-materiais.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: template com objetivo curto e tabela `A definir`.
- Informacao faltando:
  - finalidade da categoria;
  - campos principais;
  - quando criar nova categoria;
  - impacto no cadastro de material;
  - impacto em estoque;
  - impacto fiscal, se existir;
  - exemplos reais de uso;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Categoria e obrigatoria no Material?
  - Categoria influencia regra fiscal ou relatorio?
  - Quais campos existem na tela?
  - Ha hierarquia/subcategoria?
  - Pode excluir categoria em uso?
  - Existe inativacao?
  - Quais mensagens aparecem quando vinculada a material?
  - Qual Guia cobre melhor o uso pratico?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-material.md`, `docs/materiais/materiais.md`.
- Acao antes da V1: completar como cadastro auxiliar de Materiais.
- Pendencias: 8

### Locais de Armazenagem

- Caminho: `docs/materiais/locais-armazenagem.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: conteudo generico que nao diferencia local, lote e saldo.
- Informacao faltando:
  - finalidade da tela;
  - campos principais;
  - diferenca entre local de armazenagem e lote;
  - impacto no saldo;
  - relacao com consulta de estoque;
  - relacao com transferencia;
  - exclusao/inativacao;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Local e obrigatorio em materiais?
  - Local e definido por empresa/filial?
  - Como local aparece em movimentacoes?
  - Pode transferir saldo entre locais?
  - Pode excluir local com saldo?
  - Existe local padrao?
  - Como se relaciona com lote?
  - Quais mensagens de erro sao comuns?
- Relacionados que podem ajudar: `docs/como-fazer/consultar-estoque.md`, `docs/como-fazer/transferir-estoque.md`, `docs/materiais/lote-estoque.md`.
- Acao antes da V1: completar com regras de estoque/local.
- Pendencias: 8

### Ajustar Inventário

- Caminho: `docs/materiais/ajustar-inventario.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: rotina que altera estoque, mas esta descrita por template.
- Informacao faltando:
  - finalidade da tela;
  - diferenca entre ajuste e inventario;
  - campos principais;
  - prerequisitos;
  - efeito no saldo;
  - efeito em custo/financeiro, se existir;
  - permissoes;
  - auditoria/historico;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Ajuste altera saldo imediatamente?
  - Precisa informar motivo?
  - Existe aprovacao?
  - Pode ajustar lote/local especifico?
  - O ajuste gera movimento rastreavel?
  - Existe bloqueio por periodo fechado?
  - Quais campos sao obrigatorios?
  - Qual diferenca para o Guia `fazer-inventario.md`?
  - Quais erros chegam ao Suporte?
- Relacionados que podem ajudar: `docs/como-fazer/ajustar-estoque.md`, `docs/como-fazer/fazer-inventario.md`.
- Acao antes da V1: completar com regras de impacto no estoque.
- Pendencias: 9

### Pedido de Compra

- Caminho: `docs/compras/pedido-compra.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P1
- Problema especifico: pagina importante de Compras, ainda com tabela `A definir`.
- Informacao faltando:
  - finalidade da tela;
  - campos principais;
  - fluxo de criacao;
  - acoes disponiveis;
  - status;
  - relacao com fornecedor;
  - relacao com entrada de nota;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Pedido de compra exige fornecedor cadastrado?
  - Pode ser convertido em entrada de nota?
  - Existe aprovacao/confirmacao?
  - Quais status existem?
  - Quais campos sao obrigatorios?
  - Como incluir itens?
  - Existe cancelamento?
  - Quais erros aparecem com mais frequencia?
- Relacionados que podem ajudar: `docs/como-fazer/criar-pedido-compra.md`, `docs/fornecedores/fornecedores.md`, `docs/faturamento/entrada-nota-fiscal.md`.
- Acao antes da V1: completar com fluxo de compras e integracoes.
- Pendencias: 8

### Grupo Usuários

- Caminho: `docs/administracao/grupo-usuarios.md`
- Classificacao: D3 - MANTER COMO ESTA TEMPORARIAMENTE
- Prioridade: P2
- Problema especifico: conteudo curto, mas ainda explica finalidade e aponta para Guia/Manual relacionado.
- Informacao faltando: campos e regras de permissao detalhadas.
- Confirmar com alguem que conhece o WCorp:
  - Quais permissoes podem ser configuradas no grupo?
  - Existe heranca entre grupos?
  - O grupo controla menus, acoes ou ambos?
  - Pode alterar grupo usado por usuarios ativos?
  - Quais erros/permissoes bloqueadas aparecem mais?
- Relacionados que podem ajudar: `docs/como-fazer/configurar-grupo-usuario.md`, `docs/administracao/usuarios.md`.
- Acao antes da V1: pode manter temporariamente com aviso, mas planejar complemento posterior.
- Pendencias: 5

### Natureza de Operação

- Caminho: `docs/administracao/natureza-op.md`
- Classificacao: D3 - MANTER COMO ESTA TEMPORARIAMENTE
- Prioridade: P1
- Problema especifico: tem conteudo util, mas ainda esta marcado como atualizacao e precisa revisao fiscal/operacional.
- Informacao faltando: confirmacao dos criterios fiscais e campos da tela.
- Confirmar com alguem que conhece o WCorp:
  - O fluxo descrito ainda corresponde a tela atual?
  - As abas Simples, Normal, Transporte e Servico estao corretas?
  - Quais campos sao obrigatorios em cada regra?
  - Quais pontos devem ser validados pelo responsavel fiscal?
  - Quais mensagens de erro ligadas a Natureza devem ser referenciadas?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-natureza-operacao.md`, `docs/como-fazer/faturar-nota.md`, `docs/faturamento/faturamento-nf.md`.
- Acao antes da V1: manter temporariamente se revisao fiscal nao bloquear; migrar depois da Classe B.
- Pendencias: 5

### Unidades

- Caminho: `docs/administracao/unidades.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: template generico com tabela `A definir`.
- Informacao faltando:
  - finalidade da tela;
  - campos principais;
  - relacao com Material;
  - relacao com Compra;
  - relacao com Faturamento;
  - exclusao/inativacao;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Unidade e obrigatoria no Material?
  - Existe conversao entre unidades?
  - Pode excluir unidade em uso?
  - Existe unidade padrao?
  - Quais campos existem?
  - Unidade afeta nota fiscal/XML?
  - Quais mensagens comuns aparecem?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-material.md`, `docs/materiais/materiais.md`.
- Acao antes da V1: completar como cadastro auxiliar.
- Pendencias: 7

### NCMS

- Caminho: `docs/administracao/ncms.md`
- Classificacao: D3 - MANTER COMO ESTA TEMPORARIAMENTE
- Prioridade: P1
- Problema especifico: conteudo curto, mas util como ponte para Material e Natureza de Operacao.
- Informacao faltando: campos da tela, responsabilidades fiscais e efeitos no documento fiscal.
- Confirmar com alguem que conhece o WCorp:
  - A tela cadastra NCM ou apenas consulta?
  - Quais campos existem?
  - NCM impacta regras fiscais automaticamente?
  - Quem deve validar alteracoes de NCM?
  - Quais rejeicoes/erros podem estar ligados a NCM?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-material.md`, `docs/administracao/natureza-op.md`.
- Acao antes da V1: pode manter temporariamente com aviso; completar depois com revisao fiscal.
- Pendencias: 5

### Centro de Custo

- Caminho: `docs/administracao/centro-custo.md`
- Classificacao: D2 - COMPLETAR ANTES DA V1
- Prioridade: P2
- Problema especifico: template generico e tabela `A definir`.
- Informacao faltando:
  - finalidade da tela;
  - campos principais;
  - onde Centro de Custo e usado;
  - relacao com financeiro;
  - relacao com compras;
  - relacao com relatorios;
  - exclusao/inativacao;
  - erros comuns.
- Confirmar com alguem que conhece o WCorp:
  - Centro de Custo e obrigatorio em quais lancamentos?
  - Existe hierarquia?
  - Existe rateio?
  - Pode excluir centro em uso?
  - Quais campos sao obrigatorios?
  - Como aparece nos relatorios?
  - Quais rotinas mais dependem dele?
  - Quais mensagens comuns aparecem?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-centro-custo.md`, `docs/financeiro/contas-a-pagar.md`.
- Acao antes da V1: completar como cadastro auxiliar financeiro/administrativo.
- Pendencias: 8

### Condições de Pagamento

- Caminho: `docs/administracao/condicoes-pagamento.md`
- Classificacao: D3 - MANTER COMO ESTA TEMPORARIAMENTE
- Prioridade: P2
- Problema especifico: conteudo curto, mas localiza a tela e aponta para Guia/Financeiro.
- Informacao faltando: campos, parcelas, prazos, regras de calculo e impacto em vendas/compras/financeiro.
- Confirmar com alguem que conhece o WCorp:
  - Quais campos existem na condicao?
  - Como configurar parcelas e vencimentos?
  - A condicao impacta pedido, nota e financeiro?
  - Pode alterar condicao ja usada?
  - Existe juros/desconto/multa?
  - Quais mensagens aparecem quando configurada incorretamente?
- Relacionados que podem ajudar: `docs/como-fazer/cadastrar-condicao-pagamento.md`, `docs/financeiro/contas-a-receber.md`.
- Acao antes da V1: pode manter temporariamente com aviso; completar depois com regras de uso.
- Pendencias: 6

## Paginas Mais Rapidas de Resolver

- `docs/administracao/grupo-usuarios.md`: ja tem objetivo, caminho e links; falta detalhar permissoes.
- `docs/administracao/ncms.md`: curto, mas com escopo identificavel; exige conferencia fiscal.
- `docs/administracao/condicoes-pagamento.md`: ja tem ponte com Guia e Financeiro; completar campos e regras.
- `docs/administracao/unidades.md`: cadastro auxiliar com perguntas objetivas.
- `docs/administracao/centro-custo.md`: cadastro auxiliar com escopo relativamente claro.
- `docs/fornecedores/fornecedores.md`: cadastro base; deve ser resolvido com conferencia de campos da tela.

## Paginas com Conhecimento Operacional Mais Profundo

- `docs/faturamento/entrada-nota-fiscal.md`: envolve fiscal, compras, estoque e financeiro.
- `docs/faturamento/carta-correcao.md`: envolve limites fiscais e retorno SEFAZ.
- `docs/faturamento/cfop-entrada.md`: envolve regra fiscal e configuracao sensivel.
- `docs/financeiro/boleto.md`: pode envolver banco, remessa, retorno e status.
- `docs/financeiro/contas-a-pagar.md` e `docs/financeiro/contas-a-receber.md`: exigem entender origem, baixa, estorno e integracoes.
- `docs/materiais/ajustar-inventario.md`: altera saldo e pode ter impacto de auditoria.
- `docs/comercial/pedidos.md`: central no fluxo comercial e conectado a orcamento/faturamento.

## Quantidade de Pendencias por Pagina

| Pagina | Classificacao | Pendencias |
| --- | --- | ---: |
| `docs/comercial/comercial-orcamento.md` | D1 | 5 |
| `docs/comercial/pedidos.md` | D2 | 8 |
| `docs/comercial/devolucao.md` | D2 | 8 |
| `docs/faturamento/entrada-nota-fiscal.md` | D2 | 9 |
| `docs/faturamento/carta-correcao.md` | D2 | 9 |
| `docs/faturamento/cfop-entrada.md` | D2 | 9 |
| `docs/financeiro/contas-a-pagar.md` | D2 | 9 |
| `docs/financeiro/contas-a-receber.md` | D2 | 9 |
| `docs/financeiro/boleto.md` | D2 | 10 |
| `docs/financeiro/contas.md` | D4 | 6 |
| `docs/fornecedores/fornecedores.md` | D2 | 8 |
| `docs/materiais/categoria-materiais.md` | D2 | 8 |
| `docs/materiais/locais-armazenagem.md` | D2 | 8 |
| `docs/materiais/ajustar-inventario.md` | D2 | 9 |
| `docs/compras/pedido-compra.md` | D2 | 8 |
| `docs/administracao/grupo-usuarios.md` | D3 | 5 |
| `docs/administracao/natureza-op.md` | D3 | 5 |
| `docs/administracao/unidades.md` | D2 | 7 |
| `docs/administracao/ncms.md` | D3 | 5 |
| `docs/administracao/centro-custo.md` | D2 | 8 |
| `docs/administracao/condicoes-pagamento.md` | D3 | 6 |

## Regras Para Execucao Editorial

- Nao completar com suposicoes.
- Conferir cada tela no WCorp real antes de escrever campos, status ou regras.
- Priorizar P0 antes de migrar Classe D.
- Para D2, responder as perguntas primeiro e so depois transformar em conteudo.
- Para D3, decidir se o aviso de atualizacao e aceitavel na V1.
- Para D4, decidir escopo antes de qualquer escrita.
- Para D1, remover/ocultar somente apos decisao humana.
