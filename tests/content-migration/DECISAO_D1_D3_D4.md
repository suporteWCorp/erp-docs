# Proposta Final de Tratamento - Classe D1, D3 e D4

Escopo: proposta final para os 6 conteúdos Classe D que não são D2.

- D1: 1 conteúdo
- D3: 4 conteúdos
- D4: 1 conteúdo

Nenhum arquivo em `docs/` foi alterado. Esta proposta não executa remoção, ocultação, migração, ajuste de busca ou ajuste do Assistente.

## Princípio de Decisão para V1

- Conteúdo com risco de orientar errado não deve aparecer na V1.
- Conteúdo curto, mas útil e honesto sobre estar em revisão, pode permanecer temporariamente se não for promovido como Popular.
- Conteúdo com possível duplicidade deve ficar fora da migração até a equipe decidir seu escopo.
- Migrar para metadata V1 só faz sentido quando a página tiver decisão de publicação clara.

## Decisão por Conteúdo

### 1. Módulo Comercial - Orçamentos

- Arquivo: `docs/comercial/comercial-orcamento.md`
- Classificação atual: D1 - Remover da V1
- Situação: página quase placeholder; o único trecho operacional fala em "pedido de venda", o que é incoerente com o título de Orçamentos.
- Recomendação para a V1: não publicar como página final.
- Deve aparecer na navegação? Não.
- Deve aparecer na busca? Não.
- Deve ser encontrado pelo Assistente? Não.
- Deve entrar no Popular? Não.
- Deve receber metadata V1? Não agora.
- Deve ser migrado agora? Não.
- Melhor tratamento D1: manter como draft/arquivo interno temporário, oculto da navegação e da busca, até revisão humana decidir se Orçamento terá Manual próprio.
- Ação futura recomendada: confirmar no ERP se Orçamento é tela independente, se pode virar pedido, quais campos/status existem e substituir o trecho suspeito antes de publicar.

### 2. Grupo Usuários

- Arquivo: `docs/administracao/grupo-usuarios.md`
- Classificação atual: D3 - Manter como está temporariamente
- Situação: conteúdo curto, mas útil; explica finalidade geral, mostra caminho e aponta para Guia e Manual de Usuários.
- Recomendação para a V1: pode permanecer publicado temporariamente com aviso de atualização.
- Deve aparecer na navegação? Sim, se a equipe aceitar conteúdo temporário curto.
- Deve aparecer na busca? Sim, mas sem prioridade alta.
- Deve ser encontrado pelo Assistente? Sim, quando a pergunta for sobre a tela ou conceito de grupo de usuários.
- Deve entrar no Popular? Não. Atualmente aparece como `popular: true` em `content-info.json`, mas o conteúdo ainda é limitado.
- Deve receber metadata V1? Sim, caso permaneça na V1, com status indicando revisão/temporário.
- Deve ser migrado agora? Não junto da Classe B; migrar depois de decidir política para D3.
- Ação futura recomendada: completar campos, regras de permissão e impacto nos usuários; depois avaliar se volta a ser Popular.

### 3. Natureza de Operação

- Arquivo: `docs/administracao/natureza-op.md`
- Classificação atual: D3 - Manter como está temporariamente
- Situação: é o D3 mais forte; possui objetivo, caminho, explicação de Regras Fiscais, critérios de aplicação e relação com faturamento.
- Recomendação para a V1: manter temporariamente, desde que o aviso de atualização continue visível ou a página passe por revisão fiscal/operacional rápida.
- Deve aparecer na navegação? Sim.
- Deve aparecer na busca? Sim.
- Deve ser encontrado pelo Assistente? Sim.
- Deve entrar no Popular? Não por enquanto; é conteúdo importante, mas ainda marcado como atualização.
- Deve receber metadata V1? Sim, se mantido na V1.
- Deve ser migrado agora? Não junto da Classe B; pode ser primeira candidata D3 após a onda B.
- Ação futura recomendada: validar com responsável fiscal/operacional se abas, critérios, campos opcionais e relação com faturamento estão corretos; depois remover aviso de atualização.

### 4. NCMS

- Arquivo: `docs/administracao/ncms.md`
- Classificação atual: D3 - Manter como está temporariamente
- Situação: conteúdo curto, mas localiza a tela e explica de forma mínima a relação com classificações fiscais usadas em cadastros/documentos fiscais.
- Recomendação para a V1: pode permanecer temporariamente se a equipe aceitar conteúdo mínimo com aviso.
- Deve aparecer na navegação? Sim, com ressalva de conteúdo em atualização.
- Deve aparecer na busca? Sim, para não quebrar consultas por NCM.
- Deve ser encontrado pelo Assistente? Sim, mas resposta deve direcionar com cuidado e sem prometer procedimento completo.
- Deve entrar no Popular? Não.
- Deve receber metadata V1? Sim, se mantido na V1.
- Deve ser migrado agora? Não junto da Classe B.
- Ação futura recomendada: validar se a tela cadastra, consulta ou mantém NCM; completar campos e alertas fiscais antes de tratar como página final.

### 5. Condições de Pagamento

- Arquivo: `docs/administracao/condicoes-pagamento.md`
- Classificação atual: D3 - Manter como está temporariamente
- Situação: conteúdo curto, mas útil como ponte; informa finalidade geral, caminho e relação com Guia e Financeiro > Contas a Receber.
- Recomendação para a V1: pode permanecer temporariamente.
- Deve aparecer na navegação? Sim.
- Deve aparecer na busca? Sim.
- Deve ser encontrado pelo Assistente? Sim, para perguntas sobre a tela ou cadastro de condição de pagamento.
- Deve entrar no Popular? Não.
- Deve receber metadata V1? Sim, se mantido na V1.
- Deve ser migrado agora? Não junto da Classe B.
- Ação futura recomendada: completar campos, parcelas, prazos, regras de vencimento e impacto em vendas/compras/financeiro.

### 6. Contas

- Arquivo: `docs/financeiro/contas.md`
- Classificação atual: D4 - Possível duplicidade
- Situação: escopo ambíguo; o objetivo fala em "contas financeiras", mas o conteúdo repete o mesmo template de Contas a Pagar/Receber/Boleto e o link relacionado aponta para gerar boleto.
- Recomendação para a V1: não publicar nem migrar até decisão de escopo.
- Deve aparecer na navegação? Não, até confirmar se é tela independente.
- Deve aparecer na busca? Não, para evitar que consultas financeiras caiam em página ambígua.
- Deve ser encontrado pelo Assistente? Não, até resolver o escopo.
- Deve entrar no Popular? Não.
- Deve receber metadata V1? Não agora.
- Deve ser migrado agora? Não.
- Ação futura recomendada: decidir se "Contas" é cadastro de contas financeiras/bancárias, página agregadora ou duplicidade de Contas a Pagar/Receber/Boleto.

## Análise D4 - Contas

### Conteúdos Envolvidos

- `docs/financeiro/contas.md`
- `docs/financeiro/contas-a-pagar.md`
- `docs/financeiro/contas-a-receber.md`
- `docs/financeiro/boleto.md`
- `docs/como-fazer/gerar-boleto.md`
- `docs/como-fazer/baixar-titulo.md`
- `docs/como-fazer/lancar-contas-a-pagar.md`

### Sobreposição Encontrada

- `contas.md` usa objetivo amplo: "Cadastrar ou consultar contas financeiras usadas nas movimentações do WCorp."
- `contas-a-pagar.md` e `contas-a-receber.md` tratam títulos financeiros.
- `boleto.md` trata boletos vinculados a contas a receber.
- `contas.md` aponta como Guia relacionado para `gerar-boleto.md`, o que sugere ligação com boleto, mas não confirma que a página é sobre boleto.
- As páginas financeiras D2 usam passos e dúvidas muito parecidas, então a diferença real entre elas ainda não está documentada.

### Opções Possíveis

1. Manter ambos, se `Contas` for uma tela independente de cadastro de contas financeiras/bancárias.
   - Resultado recomendado: `Contas` vira Manual; `Contas a Pagar`, `Contas a Receber` e `Boleto` continuam como Manuais próprios.
   - Condição: confirmar no ERP que `Financeiro > Contas` é uma tela real e diferente de títulos/boletos.

2. Fundir, se `Contas` for apenas um agrupador genérico.
   - Resultado recomendado: remover/ocultar `contas.md` e manter páginas específicas.
   - Condição: confirmar que não existe tela independente chamada `Contas`.

3. Transformar um em Guia e outro em Manual.
   - Não recomendado agora.
   - Motivo: `contas.md` parece descrever uma tela, não uma tarefa "como fazer".

4. Remover duplicidade.
   - Recomendado somente se o ERP não tiver tela independente `Financeiro > Contas` ou se a página não tiver função clara para o usuário.

### Decisão Humana Necessária

- Existe uma tela real `Financeiro > Contas`?
- Essa tela representa contas bancárias/financeiras, contas a pagar/receber ou outro conceito?
- O link para `gerar-boleto.md` está correto?
- A página deve ficar no menu junto de Contas a Pagar/Receber/Boleto?
- O usuário buscaria "contas" esperando qual resultado?
- O Assistente deve responder "Contas" ou preferir páginas específicas?

### Recomendação D4 para V1

Manter o arquivo como draft/pendente e ocultar de navegação, busca e Assistente até a decisão de escopo. Se confirmada como tela independente, migrar depois como Manual V1. Se for apenas agrupador ou duplicidade, remover da V1.

## Tabela Final

| CONTEÚDO | V1 | NAVEGAÇÃO | BUSCA | ASSISTENTE | POPULAR | MIGRAR | AÇÃO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `comercial-orcamento.md` | Fora da V1 por enquanto | Não | Não | Não | Não | Não | Manter como draft/oculto; validar se Orçamento terá Manual próprio. |
| `grupo-usuarios.md` | Manter temporariamente | Sim | Sim | Sim | Não | Depois | Completar permissões/campos e remover Popular até ficar robusto. |
| `natureza-op.md` | Manter temporariamente | Sim | Sim | Sim | Não | Depois | Validar fiscal/operacional e migrar como primeira D3. |
| `ncms.md` | Manter temporariamente | Sim | Sim | Sim, com cautela | Não | Depois | Confirmar escopo da tela e completar campos/cuidados fiscais. |
| `condicoes-pagamento.md` | Manter temporariamente | Sim | Sim | Sim | Não | Depois | Completar parcelas, prazos e impacto em vendas/compras/financeiro. |
| `contas.md` | Fora da V1 até decisão | Não | Não | Não | Não | Não | Resolver duplicidade/escopo com Contas a Pagar, Receber e Boleto. |

## Resumo de Execução Futura

- Ocultar da V1 antes de publicar: `comercial-orcamento.md`, `contas.md`.
- Manter temporariamente, mas sem Popular: `grupo-usuarios.md`, `natureza-op.md`, `ncms.md`, `condicoes-pagamento.md`.
- Migrar para metadata V1 somente após decisão de manter: os quatro D3.
- Não migrar agora: todos os 6 conteúdos desta proposta.
- Não remover fisicamente nesta etapa: nenhum; preferir ocultar/draft para preservar histórico e permitir revisão humana.
