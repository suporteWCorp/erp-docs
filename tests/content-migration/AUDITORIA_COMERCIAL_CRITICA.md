# Auditoria Editorial Crítica - Comercial

Escopo:

- `docs/comercial/comercial-orcamento.md`
- `docs/comercial/pedidos.md`

Nenhum arquivo em `docs/` foi alterado. Esta auditoria não completa lacunas com conhecimento externo e não inventa comportamento do WCorp.

## Conteúdos Comparados

- `docs/como-fazer/criar-orcamento.md`
- `docs/como-fazer/fazer-pedido-venda.md`
- `docs/como-fazer/cancelar-pedido.md`
- `docs/comercial/comercial-clientes.md`
- `docs/comercial/comercial-grupo-clientes.md`
- `docs/erros-solucoes/erros-operacionais/aprovacao-desconto-pendente.md`
- `docs/referencia/faq/editar-pedido-bloqueado-workflow.md`
- `mkdocs.yml`
- `docs/assets/data/content-info.json`

## Resumo Executivo

As duas páginas críticas estão no menu Manual > Comercial, mas ainda não cumprem o papel esperado de Manual de tela.

- `comercial-orcamento.md` é o maior risco: o título fala de Orçamentos, mas o único parágrafo operacional fala em cadastrar pedido de venda.
- `pedidos.md` é importante e tem relação com vários conteúdos existentes, mas está quase vazio: falta descrever campos, status, ações e regras da tela.
- Os Guias relacionados são mais úteis hoje do que os Manuais críticos, mas eles documentam "como fazer" e não substituem completamente um Manual de tela.

## 1. Módulo Comercial - Orçamentos

- Página: `docs/comercial/comercial-orcamento.md`
- Título atual: `Módulo Comercial - Orçamentos`
- Classificação anterior: D1 - Remover/Ocultar da V1 até decisão humana
- Relacionado direto: `docs/como-fazer/criar-orcamento.md`
- Navegação: aparece em `mkdocs.yml` como `Manual > Comercial > Orçamento`
- Metadado auxiliar: `content-info.json` registra como manual, dificuldade intermediária, sem vídeo

### Conteúdo Atual Lido

Estrutura atual:

- H1: `Módulo Comercial - Orçamentos`
- Aviso: `Conteúdo em atualização`
- Link para `../como-fazer/criar-orcamento.md`
- Um parágrafo operacional:
  - "Para cadastrar um pedido de venda é necessário preencher as informações obrigatórias..."

### CORRETO/UTILIZÁVEL

- O aviso de conteúdo em atualização é honesto e evita parecer página final.
- O link para `docs/como-fazer/criar-orcamento.md` é útil, porque existe um Guia relacionado mais completo.
- A existência da página no menu é coerente com `mkdocs.yml`, que possui uma tela `Orçamento` dentro de Comercial.
- O Guia `criar-orcamento.md` confirma um caminho plausível: `Comercial > Orçamento`.

### DUVIDOSO

- O título usa `Módulo Comercial - Orçamentos`, enquanto a navegação usa `Orçamento`. Precisa confirmar qual nomenclatura final deve ser padronizada.
- O parágrafo cita "Cliente/Contrato", mas o Guia de orçamento fala apenas em cliente, materiais, quantidades, valores, condição de pagamento, prazo e observações. O uso de "Contrato" precisa validação no ERP.
- O conteúdo não mostra se Orçamento é tela própria, etapa anterior ao Pedido ou apenas modo de criar Pedido.

### INCOMPLETO

Falta praticamente toda a estrutura esperada para Manual:

- Objetivo da tela.
- Caminho padronizado.
- Print da tela.
- Campos principais.
- Ações disponíveis.
- Status ou estados do orçamento.
- Diferença entre orçamento, pedido e venda.
- Quando usar esta tela.
- Como orçamento se relaciona com pedido.
- Como orçamento se relaciona com faturamento.
- Mensagens comuns ou bloqueios.
- Permissões relevantes.

### POSSIVELMENTE ERRADO

- O trecho "Para cadastrar um pedido de venda..." parece incoerente com a página `Orçamentos`.
- O texto parece reaproveitado da página `pedidos.md`, pois é praticamente igual ao parágrafo do Manual de Pedido.
- Se o usuário abrir Manual > Comercial > Orçamento, pode receber orientação de Pedido de Venda e seguir para a tela errada.

### Comparação com Relacionados

`docs/como-fazer/criar-orcamento.md` traz informação mais específica:

- Pré-requisitos: cliente cadastrado, material cadastrado, condição comercial definida.
- Caminho: `Comercial > Orçamento`.
- Vídeo: `comercial_orcamento.mp4`.
- Passos: criar orçamento, informar cliente, adicionar materiais, quantidades e valores, informar condição de pagamento, prazo, observações e salvar.

`docs/como-fazer/fazer-pedido-venda.md` indica relação entre pedido e orçamento:

- Há uma seção "Criar pedido a partir de um orçamento".
- Diz que, quando existe orçamento aprovado, é possível gerar pedido diretamente a partir dele.

Conclusão comparativa: o Guia de Orçamento pode servir como base de revisão, mas não resolve o Manual sozinho. O Manual precisa explicar a tela, não repetir o passo a passo do Guia.

### Roteiro de Revisão no ERP

Ao abrir a tela no WCorp, confirmar:

1. O nome correto da tela no ERP: `Orçamento`, `Orçamentos` ou outro.
2. O caminho exato no menu.
3. Se a tela é independente de Pedido ou se é uma etapa do fluxo de Pedido.
4. Quais campos aparecem no cadastro.
5. Quais campos são obrigatórios.
6. Se existe vínculo com Cliente, Contrato, Grupo de Cliente ou outro cadastro.
7. Como adicionar itens/materiais.
8. Onde ficam valores, quantidades, prazos e condição de pagamento.
9. Quais botões/ações existem depois de salvar.
10. Se existe aprovação de orçamento.
11. Se existe conversão de orçamento em pedido.
12. Se existe cancelamento, rejeição, duplicação ou impressão.
13. Quais status existem.
14. Quais permissões bloqueiam criação, alteração ou aprovação.
15. Quais mensagens chegam ao Suporte.

### Ação Recomendada

Não publicar esta página como Manual final na V1 sem revisão. Opções para decisão humana:

- ocultar/remover da V1 e manter apenas o Guia `criar-orcamento.md`;
- reescrever a página como Manual real da tela Orçamento;
- fundir o conteúdo com Pedido caso o ERP não possua tela independente.

## 2. Módulo Comercial - Pedido de Venda

- Página: `docs/comercial/pedidos.md`
- Título atual: `Módulo Comercial - Pedido de Venda`
- Classificação anterior: D2 - Completar antes da V1
- Relacionado direto: `docs/como-fazer/fazer-pedido-venda.md`
- Navegação: aparece em `mkdocs.yml` como `Manual > Comercial > Pedido`
- Metadado auxiliar: `content-info.json` registra como manual, popular, dificuldade intermediária, sem vídeo

### Conteúdo Atual Lido

Estrutura atual:

- H1: `Módulo Comercial - Pedido de Venda`
- Aviso: `Conteúdo em atualização`
- Link para `../como-fazer/fazer-pedido-venda.md`
- Um parágrafo operacional:
  - "Para cadastrar um pedido de venda é necessário preencher as informações obrigatórias..."
- Uma imagem:
  - `../assets/comercial-pedidos.png`

### CORRETO/UTILIZÁVEL

- O tema é coerente com a navegação: `Manual > Comercial > Pedido`.
- O link para `docs/como-fazer/fazer-pedido-venda.md` é útil.
- A imagem `comercial-pedidos.png` pode ajudar se estiver atualizada.
- O parágrafo lista alguns elementos que também aparecem nos Guias: cliente, condição de pagamento, itens, quantidade.
- Conteúdos relacionados confirmam que Pedido é um assunto importante na Central:
  - Guia de gerar pedido.
  - Guia de cancelar pedido.
  - Erro operacional sobre aprovação de desconto.
  - FAQ sobre workflow bloqueando edição de pedido.
  - Manual de Nota Fiscal menciona emissão por pedido.

### DUVIDOSO

- O título do arquivo/manual diz `Pedido de Venda`, mas o menu usa apenas `Pedido`. Precisa padronizar nomenclatura.
- O trecho fala em `Cliente/Contrato`; precisa confirmar se contrato é realmente campo obrigatório, opcional ou apenas aplicável em alguns cenários.
- O print precisa ser validado contra a tela atual do ERP.
- `content-info.json` marca a página como popular, mas o conteúdo atual é fraco; isso pode aumentar o impacto de publicar algo incompleto.
- O Manual não informa se o pedido tem workflow, aprovação, autorização de desconto, separação ou vínculo com faturamento, embora outros conteúdos indiquem essas relações.

### INCOMPLETO

Faltam informações essenciais para Manual:

- Objetivo da tela.
- Caminho padronizado em texto.
- Print da tela com legenda clara.
- Campos principais.
- Campos obrigatórios.
- Diferença entre criar, editar, fechar e cancelar pedido.
- Status do pedido.
- Relação com orçamento.
- Relação com separação.
- Relação com faturamento/NF-e.
- Relação com financeiro/recebimento.
- Permissões e workflow.
- Autorização de desconto.
- Bloqueios comuns.
- O que fazer quando o pedido não pode ser editado.
- O que fazer quando o pedido não aparece para faturar.

### POSSIVELMENTE ERRADO

- Não há erro operacional explícito no texto principal, mas a página está incompleta demais para ser tratada como Manual final.
- O parágrafo pode estar simplificando demais a rotina se "contrato", "condição de pagamento" e "data de entrega" não forem sempre obrigatórios.
- Se o print estiver desatualizado, a página pode orientar a navegação visual de forma incorreta.

### Comparação com Relacionados

`docs/como-fazer/fazer-pedido-venda.md` contém:

- Pré-requisitos: cliente, material e condição de pagamento cadastrada.
- Passos para criar pedido.
- Dois vídeos.
- Outra opção: criar pedido a partir de orçamento aprovado.
- Links para orçamento, cancelamento de pedido e NF-e.

`docs/como-fazer/cancelar-pedido.md` contém:

- Caminho: `Comercial > Pedido`.
- Pré-requisitos: pedido localizado, confirmação de cancelamento possível, vínculos com separação/faturamento/financeiro verificados.
- Passos de cancelamento.

`docs/erros-solucoes/erros-operacionais/aprovacao-desconto-pendente.md` contém sinais úteis:

- Pedido pode ter desconto pendente de aprovação.
- Existe ação/botão `Autorizar Desconto`.
- Existe referência a botão `Fechar Pedido`.
- Pode haver bloqueio por autorização/permissão.

`docs/referencia/faq/editar-pedido-bloqueado-workflow.md` contém sinais úteis:

- Existe `Workflow` do pedido.
- Pode haver checkbox `Bloquear edição do Pedido`.
- O workflow pode impedir edição mesmo com pedido pendente.

`docs/faturamento/faturamento-nf.md` contém sinais úteis:

- NF-e pode ser emitida por pedido.
- Há ação relacionada a adicionar pedido na NF-e.

Conclusão comparativa: existe material interno suficiente para desenhar o roteiro de perguntas, mas não para completar o Manual sem validação no ERP.

### Roteiro de Revisão no ERP

Ao abrir a tela no WCorp, confirmar:

1. Nome correto da tela: `Pedido`, `Pedido de Venda` ou outro.
2. Caminho exato no menu.
3. Quais campos aparecem no cabeçalho do pedido.
4. Quais campos são obrigatórios para salvar.
5. Se `Contrato` é campo obrigatório, opcional ou contextual.
6. Como incluir materiais/itens.
7. Como informar quantidade, valor, desconto e condição de pagamento.
8. Se existe data de entrega e onde ela aparece.
9. Quais botões existem antes e depois de salvar.
10. O que significa `Fechar Pedido`.
11. Quando aparece `Autorizar Desconto`.
12. Quais status existem.
13. Quando o pedido pode ser editado.
14. Como o workflow bloqueia edição.
15. Como gerar pedido a partir de orçamento.
16. Como cancelar pedido.
17. Como o pedido segue para separação.
18. Como o pedido segue para faturamento/NF-e.
19. Quando o pedido não aparece para faturar.
20. Quais permissões são necessárias.
21. Quais mensagens de erro são mais recorrentes.

### Ação Recomendada

Completar antes da V1 se a página continuar visível/popular. O Manual de Pedido deveria ser priorizado porque é ponto de conexão entre Orçamento, Cancelamento, Faturamento, Workflow e Erros Operacionais.

## Principais Riscos

- Página de Orçamento pode estar orientando o usuário para Pedido de Venda.
- Página de Pedido está marcada como popular, mas ainda não entrega conteúdo de Manual.
- Guias relacionados podem estar compensando Manuais incompletos, mas isso prejudica a separação Guia = tarefa e Manual = tela.
- Links circulares entre Guia e Manual podem levar o usuário de volta para páginas incompletas.
- Conteúdos sobre Pedido aparecem em vários lugares; sem revisão, há risco de inconsistência entre Pedido, Orçamento, Cancelamento, Faturamento, Workflow e Aprovação de Desconto.

## Trechos para Validar Primeiro

1. Em `comercial-orcamento.md`: o trecho "Para cadastrar um pedido de venda..." deve ser validado imediatamente.
2. Em `comercial-orcamento.md`: confirmar se `Cliente/Contrato` pertence mesmo ao Orçamento.
3. Em `pedidos.md`: confirmar se `Cliente/Contrato`, condição de pagamento, data de entrega, itens e quantidade são realmente obrigatórios.
4. Em `pedidos.md`: validar se `../assets/comercial-pedidos.png` representa a tela atual.
5. Em conteúdos relacionados: confirmar `Fechar Pedido`, `Autorizar Desconto` e `Workflow` antes de referenciar no Manual.

## Perguntas Para Responder Olhando o Sistema

### Orçamento

- A tela de Orçamento existe separada da tela de Pedido?
- Qual é o nome exato no menu?
- O orçamento tem status próprio?
- O orçamento pode ser aprovado?
- O orçamento pode virar pedido?
- O orçamento usa contrato?
- Quais campos são obrigatórios?
- Quais ações existem na tela?
- Existe cancelamento ou expiração de orçamento?
- O orçamento gera impacto em estoque, financeiro ou faturamento?
- Quais mensagens de erro aparecem com frequência?

### Pedido

- Qual é o nome exato no menu?
- Quais campos são obrigatórios?
- O pedido exige contrato?
- O pedido exige condição de pagamento?
- Existe workflow obrigatório?
- Quais status existem?
- O que faz `Fechar Pedido`?
- Quando aparece `Autorizar Desconto`?
- Como um pedido é editado ou bloqueado?
- Como um pedido é cancelado?
- Quando ele segue para separação?
- Quando ele segue para faturamento?
- Quando ele aparece ou não aparece na NF-e?
- Quais permissões influenciam criação, edição, fechamento, desconto e cancelamento?

## Referências Internas Úteis

- `docs/como-fazer/criar-orcamento.md`: melhor base atual para o fluxo de criação de orçamento.
- `docs/como-fazer/fazer-pedido-venda.md`: melhor base atual para o fluxo de criação de pedido.
- `docs/como-fazer/cancelar-pedido.md`: referência sobre cancelamento e vínculos com separação/faturamento/financeiro.
- `docs/erros-solucoes/erros-operacionais/aprovacao-desconto-pendente.md`: referência sobre desconto pendente, autorização e fechamento de pedido.
- `docs/referencia/faq/editar-pedido-bloqueado-workflow.md`: referência sobre workflow bloqueando edição.
- `docs/faturamento/faturamento-nf.md`: referência sobre emissão de NF-e por pedido.
- `docs/comercial/comercial-clientes.md`: referência de padrão editorial mais completo para Manual de tela.
- `docs/comercial/comercial-grupo-clientes.md`: referência curta de Manual simples, útil para comparar densidade mínima.

## Recomendações Para a V1

- Orçamento: não migrar nem publicar como Manual final sem resolver a possível incoerência com Pedido de Venda.
- Pedido: completar antes da V1 se permanecer como item popular/visível.
- Se faltar tempo, manter os Guias como fonte principal e ocultar temporariamente os Manuais críticos incompletos.
- Não escrever nenhum campo, status ou regra de Pedido/Orçamento sem validação no ERP real.
