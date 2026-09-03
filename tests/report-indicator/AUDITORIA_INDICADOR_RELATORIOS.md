# Auditoria técnica do Indicador de Relatórios

Atualizado em: `2026-08-28`.

Escopo atual: auditoria técnica concluída e criação de catálogo estruturado independente em `docs/assets/data/report-indicator-catalog.json`. O Indicador de Relatórios ainda não consome esse arquivo; algoritmo, UX/UI, resultados e comportamento seguem congelados.

## Conclusão da etapa

| Frente | Status | Observação |
|---|---|---|
| Motor do Indicador | APROVADO | A lógica atual exige 100% dos filtros selecionados e não apresentou bug comprovado. |
| Catálogo relatório x informação | FUNCIONAL, PENDENTE DE VALIDAÇÃO OPERACIONAL INDEPENDENTE | Catálogo JSON criado com 65 relatórios e 482 associações migradas do mapeamento atual, todas como `nao_confirmado`. |
| UX/UI | APROVADA E CONGELADA | A experiência visual do Indicador está fechada para a V1. |

Decisão registrada: não alterar algoritmo, mapeamento atual do JavaScript ou UX/UI do Indicador de Relatórios nesta etapa. A validação operacional do catálogo será feita posteriormente contra fonte de verdade fornecida pela equipe WCorp.

## Catálogo estruturado independente

Arquivo criado:

`docs/assets/data/report-indicator-catalog.json`

Resultado da migração:

| Item | Resultado |
|---|---:|
| Relatórios migrados | 65 |
| Informações/filtros existentes | 34 |
| Associações migradas | 482 |
| Associações confirmadas operacionalmente | 0 |
| Associações não confirmadas | 482 |
| IDs duplicados | 0 |
| Relatórios duplicados no catálogo | 0 |
| Informações duplicadas dentro do mesmo relatório | 0 |

Validação automatizada:

| Verificação | Status | Observação |
|---|---|---|
| JSON válido | PASS | O arquivo foi carregado via `fetch(...).json()` no runner. |
| Equivalência catálogo x mapeamento atual | PASS | PASS indica apenas equivalência estrutural com `wcorp-tools.js`. |
| Suíte funcional do Indicador | PASS | 18 PASS / 0 FAIL. |
| IDs únicos | PASS | IDs gerados por slug estável do nome do relatório. |
| Relatórios únicos | PASS | Nenhum nome duplicado encontrado. |
| Informações sem duplicidade por relatório | PASS | Nenhuma duplicidade encontrada. |

Importante: este PASS não significa que as associações estão operacionalmente confirmadas no WCorp. Significa apenas que o catálogo independente reproduz 100% do mapeamento atual do Indicador.

## Proposta de fonte de verdade do catálogo

Esta proposta agora teve sua primeira etapa implementada como catálogo independente. O consumo do JSON pelo Indicador permanece para uma etapa futura, após validação operacional.

### 1. Formato escolhido

Formato recomendado: `JSON`.

Motivos:

- já é consumível diretamente no navegador, sem dependência extra;
- funciona bem em site estático/MkDocs;
- permite validação automatizada com testes simples;
- evita parser adicional para YAML;
- facilita comparação entre catálogo oficial, implementação e resultado renderizado.

### 2. Estrutura proposta

Local recomendado:

`docs/assets/data/report-indicator-catalog.json`

Estrutura conceitual:

```json
{
  "versao": 1,
  "ultima_revisao": null,
  "status_catalogo": "pendente_validacao_operacional",
  "filtros": [
    {
      "id": "client",
      "rotulo": "Cliente",
      "grupo": "principal",
      "aliases": ["cliente", "clientes"]
    }
  ],
  "relatorios": [
    {
      "id": "nota-fiscal-analitico",
      "nome": "Nota Fiscal Analítico",
      "area": "Faturamento",
      "status_validacao": "nao_confirmado",
      "fonte": null,
      "observacoes": null,
      "informacoes": [
        {
          "id": "client",
          "status": "nao_confirmado",
          "fonte": null,
          "observacoes": null
        }
      ]
    }
  ]
}
```

Estados de validação:

- `confirmado`: associação conferida contra evidência operacional real do WCorp.
- `nao_confirmado`: associação existente no Indicador, mas ainda não conferida contra fonte independente.
- `remover_proposto`: associação suspeita, aguardando revisão antes de remoção.
- `adicionar_proposto`: associação detectada em fonte externa, aguardando revisão antes de entrar no produto.

O próprio `wcorp-tools.js` não deve ser considerado evidência de confirmação.

### 3. Exemplo com 3 relatórios

```json
{
  "relatorios": [
    {
      "id": "nota-fiscal-analitico",
      "nome": "Nota Fiscal Analítico",
      "area": "Faturamento",
      "status_validacao": "nao_confirmado",
      "fonte": null,
      "observacoes": null,
      "informacoes": [
        { "id": "client", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "material", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "invoice", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "quantity", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "value", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "date", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "status", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "tax", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "cfop", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "freight", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "weight", "status": "nao_confirmado", "fonte": null, "observacoes": null }
      ]
    },
    {
      "id": "pedidos-analitico",
      "nome": "Pedidos Analítico",
      "area": "Vendas",
      "status_validacao": "nao_confirmado",
      "fonte": null,
      "observacoes": null,
      "informacoes": [
        { "id": "client", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "material", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "invoice", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "order", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "productionOrder", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "contract", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "quantity", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "value", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "date", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "status", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "seller", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "paymentCondition", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "freight", "status": "nao_confirmado", "fonte": null, "observacoes": null }
      ]
    },
    {
      "id": "ordem-servico-analitico",
      "nome": "Ordem de Serviço Analítico",
      "area": "Ordem de Serviço",
      "status_validacao": "nao_confirmado",
      "fonte": null,
      "observacoes": null,
      "informacoes": [
        { "id": "client", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "contract", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "serviceOrder", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "order", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "date", "status": "nao_confirmado", "fonte": null, "observacoes": null },
        { "id": "status", "status": "nao_confirmado", "fonte": null, "observacoes": null }
      ]
    }
  ]
}
```

### 4. Estratégia para migrar os 65 relatórios

1. Criar o JSON oficial inicial com os 65 relatórios atuais, preservando exatamente nomes, áreas e IDs de campos atuais.
2. Marcar todas as associações migradas como `nao_confirmado`, sem tratá-las como erro.
3. Manter o comportamento atual em paralelo e comparar: catálogo JSON x arrays atuais x resultados renderizados.
4. Só depois de equivalência 100% comprovada, alterar o Indicador para consumir o JSON como fonte primária.
5. Remover ou reduzir os arrays hardcoded de `reports` apenas após os testes confirmarem que os resultados continuam idênticos.

### 5. Estratégia para validar os 431 relacionamentos

A validação deve ser feita relação por relação, não apenas por relatório.

Para cada associação `relatorio + informacao`:

- se houver print, exportação, manual operacional ou levantamento real confirmando o campo, marcar `confirmado`;
- se não houver evidência, manter `nao_confirmado`;
- se a fonte indicar ausência de campo atualmente mapeado, marcar `remover_proposto`;
- se a fonte indicar campo existente mas não mapeado, marcar `adicionar_proposto`;
- revisar manualmente antes de qualquer alteração que mude resultado do Indicador.

### 6. Funcionamento futuro dos testes

O fluxo futuro recomendado:

```text
Catálogo oficial
↓
Indicador
↓
Resultados

Catálogo oficial
↓
Testes
↓
PASS / FAIL
```

Testes recomendados:

- validação de schema do JSON;
- IDs únicos de relatório;
- nomes não vazios;
- todos os campos usados existem em `filtros`;
- nenhuma associação duplicada no mesmo relatório;
- comparação entre catálogo oficial e resultado do Indicador;
- consultas combinadas garantindo a regra de 100% dos filtros;
- detecção de campo ausente: catálogo possui `Valor`, implementação não retorna;
- detecção de associação indevida: catálogo não possui `CFOP`, implementação retorna como se possuísse.

### 7. Impacto esperado no código atual

Impacto esperado quando a migração for aprovada:

- `wcorp-tools.js`: trocar o array hardcoded `reports` por carregamento/normalização do JSON.
- `wcorp-tools.js`: manter a regra `selected.every(...)` sem alteração.
- `wcorp-tools.js`: manter a renderização dos cards sem alteração.
- `tests/report-indicator/`: atualizar a suíte para usar o JSON como fonte oficial de expectativa.
- `docs/assets/data/report-indicator-catalog.json`: novo arquivo de dados.

Não há necessidade prevista de alterar CSS, textos da interface, cards, filtros visuais ou animações.

### 8. Riscos da mudança

- Caminho incorreto do `fetch()` em ambiente MkDocs/site estático.
- Cache do navegador mantendo versão antiga do JSON.
- Erro de digitação em IDs de campo.
- Divergência temporária entre JSON e arrays antigos durante a migração.
- Alterar o carregamento para assíncrono pode exigir cuidado para não criar estado vazio ou atraso perceptível.
- JSON não aceita comentários; observações precisam ser campos de dados.
- Se IDs de campos forem renomeados, a equivalência dos testes pode ficar falsa mesmo sem mudança funcional.

### 9. Arquivos que seriam criados/alterados na implementação

Arquivos novos:

- `docs/assets/data/report-indicator-catalog.json`
- `tests/report-indicator/catalog-schema.json` ou validação equivalente
- `tests/report-indicator/catalog-vs-product.html` ou runner equivalente

Arquivos alterados:

- `docs/assets/javascripts/wcorp-tools.js`
- `tests/report-indicator/runner.html`
- `tests/report-indicator/latest-results.json`
- `tests/report-indicator/AUDITORIA_INDICADOR_RELATORIOS.md`

Arquivos que não devem ser alterados para essa migração:

- `docs/assets/stylesheets/cards.css`
- layout Markdown da ferramenta, salvo se for necessário apenas incluir metadado invisível
- textos visíveis da interface

## Resumo executivo
| Item | Valor |
|---|---:|
| Relatórios mapeados | 65 |
| Filtros disponíveis | 34 |
| Testes executados | 18 |
| PASS | 18 |
| FAIL | 0 |
| Filtros sem cobertura | 0 |
| Mapeamentos não confirmados | 431 |

A busca do Indicador está funcionalmente consistente com a regra atual, mas a precisão do catálogo não está comprovada pela documentação existente no repositório. A auditoria encontrou ausência de fonte independente para confirmar os campos associados aos relatórios.

## Regra de match atual
Um relatório precisa possuir 100% dos filtros selecionados para aparecer. A regra atual é selected.every((field) => report.fields.includes(field)).

Não há match parcial no trecho do Indicador: se o usuário seleciona `Cliente + Material + Nota fiscal + Pedido`, um relatório que tenha apenas parte desses campos não é retornado.

Verificação de lógica parcial: Nenhuma lógica de match parcial foi encontrada no initializeReportFinder().

## Inventário completo
| # | Relatório | Área | Informações associadas | Origem |
|---:|---|---|---|---|
| 1 | Movimentação de Material | Materiais | Material, Quantidade, Data, Estoque, Lote, Local de armazenagem | `docs/assets/javascripts/wcorp-tools.js:84` |
| 2 | Estoque Sintético | Materiais | Material, Quantidade, Valor, Estoque, Lote, Custo | `docs/assets/javascripts/wcorp-tools.js:85` |
| 3 | Estoque Sintético com Material Relacionado | Materiais | Material, Quantidade, Valor, Estoque, Lote, Custo | `docs/assets/javascripts/wcorp-tools.js:86` |
| 4 | Estoque Analítico | Materiais | Material, Valor, Estoque, Custo, Data | `docs/assets/javascripts/wcorp-tools.js:87` |
| 5 | Histórico de Compras | Materiais | Material, Fornecedor, Pedido, Valor, Data, Custo | `docs/assets/javascripts/wcorp-tools.js:88` |
| 6 | Tabela de Preço | Materiais | Cliente, Material, Valor, Preço/Lucratividade | `docs/assets/javascripts/wcorp-tools.js:89` |
| 7 | Consumo de Lote | Materiais | Material, Fornecedor, Cliente, Nota fiscal, Ordem de produção, Quantidade, Valor, Data, Lote, Estoque | `docs/assets/javascripts/wcorp-tools.js:90` |
| 8 | Ordem de Produção Sintético | Ordem de Produção | Cliente, Material, Ordem de produção, Contrato, Quantidade, Data, Status, Peso, Sucata, Processo | `docs/assets/javascripts/wcorp-tools.js:92` |
| 9 | Ordem de Produção Analítico | Ordem de Produção | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Data, Status, Lote | `docs/assets/javascripts/wcorp-tools.js:93` |
| 10 | Ordem de Produção Diária | Ordem de Produção | Cliente, Material, Ordem de produção, Quantidade, Data, Peso, Sucata, Processo | `docs/assets/javascripts/wcorp-tools.js:94` |
| 11 | Ordem de Produção por Processo Realizado | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo, Sucata, Peso | `docs/assets/javascripts/wcorp-tools.js:95` |
| 12 | Apontamento de Sucatas Analítico | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Sucata | `docs/assets/javascripts/wcorp-tools.js:96` |
| 13 | Ordem de Produção Equipamento | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo | `docs/assets/javascripts/wcorp-tools.js:97` |
| 14 | Equipamento Manutenção | Ordem de Produção | Fornecedor, Data, Equipamento, Manutenção | `docs/assets/javascripts/wcorp-tools.js:98` |
| 15 | Ordem de Serviço Sintético | Ordem de Serviço | Cliente, Contrato, Ordem de serviço, Data, Status | `docs/assets/javascripts/wcorp-tools.js:100` |
| 16 | Ordem de Serviço Analítico | Ordem de Serviço | Cliente, Contrato, Ordem de serviço, Pedido, Data, Status | `docs/assets/javascripts/wcorp-tools.js:101` |
| 17 | Ordem de Serviço X Recebimento Sintético | Ordem de Serviço | Cliente, Contrato, Ordem de serviço, Valor, Data, Status, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:102` |
| 18 | Ordem de Serviço X Recebimento Analítico | Ordem de Serviço | Cliente, Contrato, Ordem de serviço, Valor, Data, Status, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:103` |
| 19 | Fatura por Serviço | Ordem de Serviço | Cliente, Serviço, Valor, Data, Recebimento/Pagamento, Vencimento | `docs/assets/javascripts/wcorp-tools.js:104` |
| 20 | Orçamentos Analítico | Vendas | Cliente, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:106` |
| 21 | Pedidos Sintético | Vendas | Cliente, Nota fiscal, Pedido, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:107` |
| 22 | Pedidos Analítico | Vendas | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:108` |
| 23 | Vendas X Lucratividade | Vendas | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Funcionário, Ordem de serviço, Custo, Preço/Lucratividade | `docs/assets/javascripts/wcorp-tools.js:109` |
| 24 | Pedidos - Movimentação do Caixa | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:110` |
| 25 | Pedidos Disponíveis para Faturamento | Vendas | Cliente, Pedido, Contrato, Data, Vendedor | `docs/assets/javascripts/wcorp-tools.js:111` |
| 26 | Materiais Mais Vendidos | Vendas | Material, Quantidade, Valor, Estoque, Lote | `docs/assets/javascripts/wcorp-tools.js:112` |
| 27 | Vendas de Material por Cliente | Vendas | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data, Status | `docs/assets/javascripts/wcorp-tools.js:113` |
| 28 | Vendas por Dia/Hora | Vendas | Pedido, Valor, Data | `docs/assets/javascripts/wcorp-tools.js:114` |
| 29 | Demonstrativo de Vendas por Material | Vendas | Material, Quantidade, Valor | `docs/assets/javascripts/wcorp-tools.js:115` |
| 30 | Comissões | Vendas | Cliente, Material, Nota fiscal, Pedido, Contrato, Quantidade, Valor, Data, Vendedor, Funcionário, Ordem de serviço, Serviço, Comissão, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:116` |
| 31 | Comissões por Recebimento | Vendas | Cliente, Nota fiscal, Pedido, Contrato, Valor, Data, Comissão, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:117` |
| 32 | Pedidos X Recebimento Sintético | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:118` |
| 33 | Pedidos X Recebimento Analítico | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:119` |
| 34 | Pedidos Analítico por Data de Entrega | Vendas | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento | `docs/assets/javascripts/wcorp-tools.js:120` |
| 35 | Pedidos X Ficha Técnica | Vendas | Cliente, Material, Pedido, Ordem de produção, Quantidade, Data, Status, Vendedor | `docs/assets/javascripts/wcorp-tools.js:121` |
| 36 | Pedido X Ordem Produção | Vendas | Cliente, Material, Pedido, Ordem de produção, Quantidade, Valor, Data, Status, Processo | `docs/assets/javascripts/wcorp-tools.js:122` |
| 37 | Despacho | Vendas | Cliente, Fornecedor, Nota fiscal, Pedido, Valor, Data, Transporte/Frete, Peso, Impostos | `docs/assets/javascripts/wcorp-tools.js:123` |
| 38 | Despacho por Pedido | Vendas | Cliente, Nota fiscal, Pedido, Valor, Data, Transporte/Frete, Impostos | `docs/assets/javascripts/wcorp-tools.js:124` |
| 39 | Ranking de Vendas por Cliente | Vendas | Cliente, Pedido, Quantidade, Valor, Vendedor, Preço/Lucratividade | `docs/assets/javascripts/wcorp-tools.js:125` |
| 40 | Clientes que não compraram | Vendas | Cliente, Pedido, Quantidade, Data, Vendedor | `docs/assets/javascripts/wcorp-tools.js:126` |
| 41 | Devoluções | Vendas | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data | `docs/assets/javascripts/wcorp-tools.js:127` |
| 42 | Nota Fiscal Sintético | Faturamento | Cliente, Nota fiscal, Valor, Data, Status, Impostos, Transporte/Frete, Peso | `docs/assets/javascripts/wcorp-tools.js:129` |
| 43 | Nota Fiscal Analítico | Faturamento | Cliente, Material, Nota fiscal, Quantidade, Valor, Data, Status, Impostos, CFOP, Transporte/Frete, Peso | `docs/assets/javascripts/wcorp-tools.js:130` |
| 44 | Entrada Nota Fiscal Sintético | Faturamento | Fornecedor, Nota fiscal, Valor, Data | `docs/assets/javascripts/wcorp-tools.js:131` |
| 45 | Entrada Nota Fiscal Analítico | Faturamento | Material, Fornecedor, Nota fiscal, Pedido, Quantidade, Valor, Data, Impostos, CFOP | `docs/assets/javascripts/wcorp-tools.js:132` |
| 46 | Cupom Fiscal Sintético | Faturamento | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:133` |
| 47 | Cupom Fiscal Analítico | Faturamento | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:134` |
| 48 | Nota Fiscal Serviço Sintético | Faturamento | Cliente, Nota fiscal, Serviço, Valor, Data, Status, Impostos | `docs/assets/javascripts/wcorp-tools.js:135` |
| 49 | Nota Fiscal Apuração de Impostos | Faturamento | Cliente, Fornecedor, Nota fiscal, Valor, Data, Impostos, CFOP | `docs/assets/javascripts/wcorp-tools.js:136` |
| 50 | Apuração de Impostos por CFOP | Faturamento | Valor, Impostos, CFOP | `docs/assets/javascripts/wcorp-tools.js:137` |
| 51 | Contas a Pagar | Contas a Pagar | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | `docs/assets/javascripts/wcorp-tools.js:139` |
| 52 | Contas a Pagar por Centro de Custo | Contas a Pagar | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | `docs/assets/javascripts/wcorp-tools.js:140` |
| 53 | Contas a Receber | Contas a Receber | Cliente, Fornecedor, Nota fiscal, Pedido, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento | `docs/assets/javascripts/wcorp-tools.js:141` |
| 54 | Contas a Receber por Centro de Custo | Contas a Receber | Cliente, Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | `docs/assets/javascripts/wcorp-tools.js:142` |
| 55 | Movimentação de Contas | Financeiro | Cliente, Fornecedor, Nota fiscal, Valor, Data, Funcionário, Centro de custo | `docs/assets/javascripts/wcorp-tools.js:143` |
| 56 | Cheques | Financeiro | Cliente, Fornecedor, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | `docs/assets/javascripts/wcorp-tools.js:144` |
| 57 | Solicitação de Pagamento | Financeiro | Cliente, Fornecedor, Contrato, Data, Funcionário, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:145` |
| 58 | Pedidos de Compra Sintético | Compras | Cliente, Fornecedor, Nota fiscal, Pedido, Contrato, Valor, Data, Status, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:147` |
| 59 | Pedidos de Compra Analítico | Compras | Cliente, Material, Fornecedor, Pedido, Contrato, Quantidade, Valor, Data, Status, Transporte/Frete, Impostos, Serviço | `docs/assets/javascripts/wcorp-tools.js:148` |
| 60 | Conhecimento de Transporte Sintético | Transporte | Cliente, Fornecedor, Nota fiscal, Quantidade, Valor, Data, Status, Transporte/Frete | `docs/assets/javascripts/wcorp-tools.js:150` |
| 61 | Faturamento Sintético | Transporte | Cliente, Valor, Data, Vencimento, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:151` |
| 62 | Faturamento Analítico | Transporte | Cliente, Valor, Data, Vencimento, Recebimento/Pagamento | `docs/assets/javascripts/wcorp-tools.js:152` |
| 63 | Estatístico de Conhecimento de Transporte | Transporte | Quantidade, Valor, Data, Impostos, Transporte/Frete, Peso | `docs/assets/javascripts/wcorp-tools.js:153` |
| 64 | Documentos do Funcionário | Funcionário | Data, Funcionário, Documento, Vencimento | `docs/assets/javascripts/wcorp-tools.js:155` |
| 65 | Rendimento do Funcionário | Funcionário | Quantidade, Data, Funcionário | `docs/assets/javascripts/wcorp-tools.js:156` |

## Matriz relatório x informação
Legenda: `SIM` = mapeado e confirmado pela documentação existente; `NÃO` = não mapeado; `NÃO CONFIRMADO` = mapeado no catálogo, mas sem confirmação suficiente na documentação existente.

| Relatório | Área | Cliente | Material | Fornecedor | Nota fiscal | Pedido | Ordem de produção | Contrato | Quantidade | Valor | Data | Status | Vendedor | Funcionário | Ordem de serviço | Serviço | Estoque | Lote | Local de armazenagem | Custo | Preço/Lucratividade | Condição de pagamento | Recebimento/Pagamento | Vencimento | Centro de custo | Impostos | CFOP | Comissão | Equipamento | Processo | Sucata | Transporte/Frete | Peso | Documento | Manutenção |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Movimentação de Material | Materiais | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Estoque Sintético | Materiais | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Estoque Sintético com Material Relacionado | Materiais | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Estoque Analítico | Materiais | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Histórico de Compras | Materiais | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Tabela de Preço | Materiais | SIM | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Consumo de Lote | Materiais | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Produção Sintético | Ordem de Produção | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO |
| Ordem de Produção Analítico | Ordem de Produção | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Produção Diária | Ordem de Produção | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO |
| Ordem de Produção por Processo Realizado | Ordem de Produção | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO |
| Apontamento de Sucatas Analítico | Ordem de Produção | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Produção Equipamento | Ordem de Produção | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Equipamento Manutenção | Ordem de Produção | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO |
| Ordem de Serviço Sintético | Ordem de Serviço | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Serviço Analítico | Ordem de Serviço | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Serviço X Recebimento Sintético | Ordem de Serviço | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Ordem de Serviço X Recebimento Analítico | Ordem de Serviço | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Fatura por Serviço | Ordem de Serviço | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Orçamentos Analítico | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Pedidos Sintético | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos Analítico | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Vendas X Lucratividade | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos - Movimentação do Caixa | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Pedidos Disponíveis para Faturamento | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Materiais Mais Vendidos | Vendas | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Vendas de Material por Cliente | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Vendas por Dia/Hora | Vendas | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Demonstrativo de Vendas por Material | Vendas | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Comissões | Vendas | SIM | SIM | NÃO | SIM | SIM | NÃO | SIM | NÃO CONFIRMADO | SIM | NÃO CONFIRMADO | NÃO | SIM | SIM | SIM | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO |
| Comissões por Recebimento | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos X Recebimento Sintético | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos X Recebimento Analítico | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos Analítico por Data de Entrega | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos X Ficha Técnica | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedido X Ordem Produção | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Despacho | Vendas | SIM | NÃO | SIM | SIM | SIM | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO CONFIRMADO | NÃO | NÃO |
| Despacho por Pedido | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Ranking de Vendas por Cliente | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Clientes que não compraram | Vendas | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Devoluções | Vendas | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Nota Fiscal Sintético | Faturamento | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO |
| Nota Fiscal Analítico | Faturamento | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO |
| Entrada Nota Fiscal Sintético | Faturamento | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Entrada Nota Fiscal Analítico | Faturamento | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Cupom Fiscal Sintético | Faturamento | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Cupom Fiscal Analítico | Faturamento | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Nota Fiscal Serviço Sintético | Faturamento | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Nota Fiscal Apuração de Impostos | Faturamento | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Apuração de Impostos por CFOP | Faturamento | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Contas a Pagar | Contas a Pagar | NÃO | NÃO | SIM | SIM | NÃO | NÃO | SIM | NÃO | SIM | SIM | SIM | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | SIM | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Contas a Pagar por Centro de Custo | Contas a Pagar | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Contas a Receber | Contas a Receber | SIM | NÃO | SIM | SIM | SIM | NÃO | SIM | NÃO | SIM | SIM | SIM | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Contas a Receber por Centro de Custo | Contas a Receber | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Movimentação de Contas | Financeiro | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Cheques | Financeiro | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO CONFIRMADO | SIM | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | SIM | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Solicitação de Pagamento | Financeiro | SIM | NÃO | SIM | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | SIM | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Pedidos de Compra Sintético | Compras | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Pedidos de Compra Analítico | Compras | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Conhecimento de Transporte Sintético | Transporte | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO |
| Faturamento Sintético | Transporte | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Faturamento Analítico | Transporte | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |
| Estatístico de Conhecimento de Transporte | Transporte | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO CONFIRMADO | NÃO | NÃO |
| Documentos do Funcionário | Funcionário | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO |
| Rendimento do Funcionário | Funcionário | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO CONFIRMADO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO |

## Cobertura por filtro
| Filtro | Qtde. relatórios | Relatórios |
|---|---:|---|
| Cliente | 45 | Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Faturamento Sintético, Faturamento Analítico |
| Material | 26 | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Histórico de Compras, Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Vendas X Lucratividade, Materiais Mais Vendidos, Vendas de Material por Cliente, Demonstrativo de Vendas por Material, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Devoluções, Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Pedidos de Compra Analítico |
| Fornecedor | 17 | Histórico de Compras, Consumo de Lote, Equipamento Manutenção, Despacho, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético |
| Nota fiscal | 25 | Consumo de Lote, Ordem de Produção Analítico, Pedidos Sintético, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Despacho, Despacho por Pedido, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético |
| Pedido | 28 | Histórico de Compras, Ordem de Produção Analítico, Ordem de Serviço Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Vendas por Dia/Hora, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Contas a Receber, Pedidos de Compra Sintético, Pedidos de Compra Analítico |
| Ordem de produção | 10 | Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Pedidos X Ficha Técnica, Pedido X Ordem Produção |
| Contrato | 23 | Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Orçamentos Analítico, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico |
| Quantidade | 29 | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Materiais Mais Vendidos, Vendas de Material por Cliente, Demonstrativo de Vendas por Material, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Estatístico de Conhecimento de Transporte, Rendimento do Funcionário |
| Valor | 49 | Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Histórico de Compras, Tabela de Preço, Consumo de Lote, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Materiais Mais Vendidos, Vendas de Material por Cliente, Vendas por Dia/Hora, Demonstrativo de Vendas por Material, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Apuração de Impostos por CFOP, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Faturamento Sintético, Faturamento Analítico, Estatístico de Conhecimento de Transporte |
| Data | 58 | Movimentação de Material, Estoque Analítico, Histórico de Compras, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Equipamento Manutenção, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Vendas por Dia/Hora, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Clientes que não compraram, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Faturamento Sintético, Faturamento Analítico, Estatístico de Conhecimento de Transporte, Documentos do Funcionário, Rendimento do Funcionário |
| Status | 30 | Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Vendas de Material por Cliente, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Cheques, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético |
| Vendedor | 10 | Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Ranking de Vendas por Cliente, Clientes que não compraram |
| Funcionário | 11 | Vendas X Lucratividade, Comissões, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Documentos do Funcionário, Rendimento do Funcionário |
| Ordem de serviço | 6 | Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Vendas X Lucratividade, Comissões |
| Serviço | 4 | Fatura por Serviço, Comissões, Nota Fiscal Serviço Sintético, Pedidos de Compra Analítico |
| Estoque | 6 | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Consumo de Lote, Materiais Mais Vendidos |
| Lote | 6 | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Consumo de Lote, Ordem de Produção Analítico, Materiais Mais Vendidos |
| Local de armazenagem | 1 | Movimentação de Material |
| Custo | 5 | Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Histórico de Compras, Vendas X Lucratividade |
| Preço/Lucratividade | 3 | Tabela de Preço, Vendas X Lucratividade, Ranking de Vendas por Cliente |
| Condição de pagamento | 7 | Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Pedidos - Movimentação do Caixa, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega |
| Recebimento/Pagamento | 15 | Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Pedidos Sintético, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Cheques, Solicitação de Pagamento, Faturamento Sintético, Faturamento Analítico |
| Vencimento | 9 | Fatura por Serviço, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Cheques, Faturamento Sintético, Faturamento Analítico, Documentos do Funcionário |
| Centro de custo | 5 | Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques |
| Impostos | 12 | Despacho, Despacho por Pedido, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Apuração de Impostos por CFOP, Pedidos de Compra Analítico, Estatístico de Conhecimento de Transporte |
| CFOP | 4 | Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Apuração de Impostos por CFOP |
| Comissão | 2 | Comissões, Comissões por Recebimento |
| Equipamento | 4 | Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Equipamento Manutenção |
| Processo | 5 | Ordem de Produção Sintético, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Ordem de Produção Equipamento, Pedido X Ordem Produção |
| Sucata | 4 | Ordem de Produção Sintético, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico |
| Transporte/Frete | 14 | Orçamentos Analítico, Pedidos Analítico, Pedidos - Movimentação do Caixa, Comissões, Despacho, Despacho por Pedido, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Estatístico de Conhecimento de Transporte |
| Peso | 7 | Ordem de Produção Sintético, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Despacho, Nota Fiscal Sintético, Nota Fiscal Analítico, Estatístico de Conhecimento de Transporte |
| Documento | 1 | Documentos do Funcionário |
| Manutenção | 1 | Equipamento Manutenção |

Filtros sem cobertura: nenhum.

## Resultados da suíte de consultas
| ID | Informações selecionadas | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| Q01 | Cliente | Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Faturamento Sintético, Faturamento Analítico | Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Serviço Sintético, Ordem de Serviço Analítico, Ordem de Serviço X Recebimento Sintético, Ordem de Serviço X Recebimento Analítico, Fatura por Serviço, Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Cheques, Solicitação de Pagamento, Pedidos de Compra Sintético, Pedidos de Compra Analítico, Conhecimento de Transporte Sintético, Faturamento Sintético, Faturamento Analítico | PASS |
| Q02 | Material | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Histórico de Compras, Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Vendas X Lucratividade, Materiais Mais Vendidos, Vendas de Material por Cliente, Demonstrativo de Vendas por Material, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Devoluções, Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Pedidos de Compra Analítico | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Estoque Analítico, Histórico de Compras, Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Vendas X Lucratividade, Materiais Mais Vendidos, Vendas de Material por Cliente, Demonstrativo de Vendas por Material, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Devoluções, Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Pedidos de Compra Analítico | PASS |
| Q03 | Nota fiscal | Consumo de Lote, Ordem de Produção Analítico, Pedidos Sintético, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Despacho, Despacho por Pedido, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | Consumo de Lote, Ordem de Produção Analítico, Pedidos Sintético, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Despacho, Despacho por Pedido, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | PASS |
| Q04 | Pedido | Histórico de Compras, Ordem de Produção Analítico, Ordem de Serviço Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Vendas por Dia/Hora, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Contas a Receber, Pedidos de Compra Sintético, Pedidos de Compra Analítico | Histórico de Compras, Ordem de Produção Analítico, Ordem de Serviço Analítico, Pedidos Sintético, Pedidos Analítico, Vendas X Lucratividade, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Vendas de Material por Cliente, Vendas por Dia/Hora, Comissões, Comissões por Recebimento, Pedidos X Recebimento Sintético, Pedidos X Recebimento Analítico, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Despacho, Despacho por Pedido, Ranking de Vendas por Cliente, Clientes que não compraram, Devoluções, Entrada Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Contas a Receber, Pedidos de Compra Sintético, Pedidos de Compra Analítico | PASS |
| Q05 | Cliente, Material | Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Pedidos Analítico, Vendas X Lucratividade, Vendas de Material por Cliente, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Devoluções, Nota Fiscal Analítico, Pedidos de Compra Analítico | Tabela de Preço, Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Pedidos Analítico, Vendas X Lucratividade, Vendas de Material por Cliente, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Pedido X Ordem Produção, Devoluções, Nota Fiscal Analítico, Pedidos de Compra Analítico | PASS |
| Q06 | Cliente, Nota fiscal | Consumo de Lote, Ordem de Produção Analítico, Pedidos Sintético, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Despacho, Despacho por Pedido, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | Consumo de Lote, Ordem de Produção Analítico, Pedidos Sintético, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Comissões por Recebimento, Despacho, Despacho por Pedido, Devoluções, Nota Fiscal Sintético, Nota Fiscal Analítico, Cupom Fiscal Sintético, Cupom Fiscal Analítico, Nota Fiscal Serviço Sintético, Nota Fiscal Apuração de Impostos, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | PASS |
| Q07 | Cliente, Material, Nota fiscal | Consumo de Lote, Ordem de Produção Analítico, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Devoluções, Nota Fiscal Analítico | Consumo de Lote, Ordem de Produção Analítico, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Devoluções, Nota Fiscal Analítico | PASS |
| Q08 | Cliente, Material, Nota fiscal, Pedido | Ordem de Produção Analítico, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Devoluções | Ordem de Produção Analítico, Pedidos Analítico, Vendas de Material por Cliente, Comissões, Devoluções | PASS |
| Q09 | Fornecedor, Nota fiscal | Consumo de Lote, Despacho, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | Consumo de Lote, Despacho, Entrada Nota Fiscal Sintético, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Movimentação de Contas, Pedidos de Compra Sintético, Conhecimento de Transporte Sintético | PASS |
| Q10 | Vendedor, Cliente | Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Ranking de Vendas por Cliente, Clientes que não compraram | Orçamentos Analítico, Pedidos Sintético, Pedidos Analítico, Pedidos - Movimentação do Caixa, Pedidos Disponíveis para Faturamento, Comissões, Pedidos Analítico por Data de Entrega, Pedidos X Ficha Técnica, Ranking de Vendas por Cliente, Clientes que não compraram | PASS |
| Q11 | Estoque, Lote | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Consumo de Lote, Materiais Mais Vendidos | Movimentação de Material, Estoque Sintético, Estoque Sintético com Material Relacionado, Consumo de Lote, Materiais Mais Vendidos | PASS |
| Q12 | Ordem de produção, Material | Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Pedidos X Ficha Técnica, Pedido X Ordem Produção | Consumo de Lote, Ordem de Produção Sintético, Ordem de Produção Analítico, Ordem de Produção Diária, Ordem de Produção por Processo Realizado, Apontamento de Sucatas Analítico, Ordem de Produção Equipamento, Pedidos Analítico, Pedidos X Ficha Técnica, Pedido X Ordem Produção | PASS |
| Q13 | Serviço, Ordem de serviço | Comissões | Comissões | PASS |
| Q14 | CFOP, Impostos | Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Apuração de Impostos por CFOP | Nota Fiscal Analítico, Entrada Nota Fiscal Analítico, Nota Fiscal Apuração de Impostos, Apuração de Impostos por CFOP | PASS |
| Q15 | Recebimento/Pagamento, Vencimento | Fatura por Serviço, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Cheques, Faturamento Sintético, Faturamento Analítico | Fatura por Serviço, Contas a Pagar, Contas a Pagar por Centro de Custo, Contas a Receber, Contas a Receber por Centro de Custo, Cheques, Faturamento Sintético, Faturamento Analítico | PASS |
| N01 | Local de armazenagem, Comissão | Nenhum | Nenhum | PASS |
| N02 | Manutenção, Cliente | Nenhum | Nenhum | PASS |
| N03 | Documento, Nota fiscal | Nenhum | Nenhum | PASS |

## Testes de não resultado
| ID | Informações selecionadas | Esperado | Obtido | Status |
|---|---|---|---|---|
| N01 | Local de armazenagem, Comissão | Nenhum | Nenhum | PASS |
| N02 | Manutenção, Cliente | Nenhum | Nenhum | PASS |
| N03 | Documento, Nota fiscal | Nenhum | Nenhum | PASS |

## Possíveis falsos positivos
Não há falso positivo comprovado, porque não há documentação detalhada suficiente para afirmar que um campo mapeado está errado. Porém, todos os campos mapeados sem confirmação independente entram como possível falso positivo para revisão humana.

| Relatório | Campos mapeados sem confirmação |
|---|---|
| Movimentação de Material | Material, Quantidade, Data, Estoque, Lote, Local de armazenagem |
| Estoque Sintético | Material, Quantidade, Valor, Estoque, Lote, Custo |
| Estoque Sintético com Material Relacionado | Material, Quantidade, Valor, Estoque, Lote, Custo |
| Estoque Analítico | Material, Valor, Data, Estoque, Custo |
| Histórico de Compras | Material, Fornecedor, Pedido, Valor, Data, Custo |
| Tabela de Preço | Valor |
| Consumo de Lote | Cliente, Material, Fornecedor, Nota fiscal, Ordem de produção, Quantidade, Valor, Data, Estoque, Lote |
| Ordem de Produção Sintético | Cliente, Material, Ordem de produção, Contrato, Quantidade, Data, Status, Processo, Sucata, Peso |
| Ordem de Produção Analítico | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Data, Status, Lote |
| Ordem de Produção Diária | Cliente, Material, Ordem de produção, Quantidade, Data, Processo, Sucata, Peso |
| Ordem de Produção por Processo Realizado | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo, Sucata, Peso |
| Apontamento de Sucatas Analítico | Material, Ordem de produção, Quantidade, Data, Equipamento, Sucata |
| Ordem de Produção Equipamento | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo |
| Equipamento Manutenção | Fornecedor, Data, Equipamento, Manutenção |
| Ordem de Serviço Sintético | Cliente, Contrato, Data, Status, Ordem de serviço |
| Ordem de Serviço Analítico | Cliente, Pedido, Contrato, Data, Status, Ordem de serviço |
| Ordem de Serviço X Recebimento Sintético | Cliente, Contrato, Valor, Data, Status, Ordem de serviço, Recebimento/Pagamento |
| Ordem de Serviço X Recebimento Analítico | Cliente, Contrato, Valor, Data, Status, Ordem de serviço, Recebimento/Pagamento |
| Fatura por Serviço | Cliente, Valor, Data, Serviço, Recebimento/Pagamento, Vencimento |
| Orçamentos Analítico | Cliente, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete |
| Pedidos Sintético | Cliente, Nota fiscal, Pedido, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Recebimento/Pagamento |
| Pedidos Analítico | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete |
| Vendas X Lucratividade | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Funcionário, Ordem de serviço, Custo, Preço/Lucratividade |
| Pedidos - Movimentação do Caixa | Cliente, Pedido, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete |
| Pedidos Disponíveis para Faturamento | Cliente, Pedido, Contrato, Data, Vendedor |
| Materiais Mais Vendidos | Material, Quantidade, Valor, Estoque, Lote |
| Vendas de Material por Cliente | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data, Status |
| Vendas por Dia/Hora | Pedido, Valor, Data |
| Demonstrativo de Vendas por Material | Material, Quantidade, Valor |
| Comissões | Quantidade, Data |
| Comissões por Recebimento | Cliente, Nota fiscal, Pedido, Contrato, Valor, Data, Recebimento/Pagamento, Comissão |
| Pedidos X Recebimento Sintético | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento |
| Pedidos X Recebimento Analítico | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento |
| Pedidos Analítico por Data de Entrega | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento |
| Pedidos X Ficha Técnica | Cliente, Material, Pedido, Ordem de produção, Quantidade, Data, Status, Vendedor |
| Pedido X Ordem Produção | Cliente, Material, Pedido, Ordem de produção, Quantidade, Valor, Data, Status, Processo |
| Despacho | Valor, Data, Peso |
| Despacho por Pedido | Cliente, Nota fiscal, Pedido, Valor, Data, Impostos, Transporte/Frete |
| Ranking de Vendas por Cliente | Cliente, Pedido, Quantidade, Valor, Vendedor, Preço/Lucratividade |
| Clientes que não compraram | Cliente, Pedido, Quantidade, Data, Vendedor |
| Devoluções | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data |
| Nota Fiscal Sintético | Cliente, Nota fiscal, Valor, Data, Status, Impostos, Transporte/Frete, Peso |
| Nota Fiscal Analítico | Cliente, Material, Nota fiscal, Quantidade, Valor, Data, Status, Impostos, CFOP, Transporte/Frete, Peso |
| Entrada Nota Fiscal Sintético | Fornecedor, Nota fiscal, Valor, Data |
| Entrada Nota Fiscal Analítico | Material, Fornecedor, Nota fiscal, Pedido, Quantidade, Valor, Data, Impostos, CFOP |
| Cupom Fiscal Sintético | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete |
| Cupom Fiscal Analítico | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete |
| Nota Fiscal Serviço Sintético | Cliente, Nota fiscal, Valor, Data, Status, Serviço, Impostos |
| Nota Fiscal Apuração de Impostos | Cliente, Fornecedor, Nota fiscal, Valor, Data, Impostos, CFOP |
| Apuração de Impostos por CFOP | Valor, Impostos, CFOP |
| Contas a Pagar por Centro de Custo | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo |
| Contas a Receber por Centro de Custo | Cliente, Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo |
| Movimentação de Contas | Cliente, Fornecedor, Nota fiscal, Valor, Data, Funcionário, Centro de custo |
| Cheques | Cliente, Fornecedor, Data, Funcionário, Centro de custo |
| Solicitação de Pagamento | Data |
| Pedidos de Compra Sintético | Cliente, Fornecedor, Nota fiscal, Pedido, Contrato, Valor, Data, Status, Transporte/Frete |
| Pedidos de Compra Analítico | Cliente, Material, Fornecedor, Pedido, Contrato, Quantidade, Valor, Data, Status, Serviço, Impostos, Transporte/Frete |
| Conhecimento de Transporte Sintético | Cliente, Fornecedor, Nota fiscal, Quantidade, Valor, Data, Status, Transporte/Frete |
| Faturamento Sintético | Cliente, Valor, Data, Recebimento/Pagamento, Vencimento |
| Faturamento Analítico | Cliente, Valor, Data, Recebimento/Pagamento, Vencimento |
| Estatístico de Conhecimento de Transporte | Quantidade, Valor, Data, Impostos, Transporte/Frete, Peso |
| Documentos do Funcionário | Data, Funcionário, Vencimento, Documento |
| Rendimento do Funcionário | Quantidade, Data, Funcionário |

## Possíveis falsos negativos
Nenhum falso negativo foi comprovado nesta auditoria. A documentação disponível não lista campos reais por relatório em detalhe suficiente para provar que algum campo existente ficou fora do catálogo.

## Mapeamentos não confirmados
Todos os mapeamentos marcados como `NÃO CONFIRMADO` precisam de validação manual com fonte interna confiável, print do relatório, manual específico ou exportação do ERP.

| Relatório | Área | Campos não confirmados | Evidência encontrada |
|---|---|---|---|
| Movimentação de Material | Materiais | Material, Quantidade, Data, Estoque, Lote, Local de armazenagem | Nenhuma página/manual específico encontrado no repositório |
| Estoque Sintético | Materiais | Material, Quantidade, Valor, Estoque, Lote, Custo | Nenhuma página/manual específico encontrado no repositório |
| Estoque Sintético com Material Relacionado | Materiais | Material, Quantidade, Valor, Estoque, Lote, Custo | Nenhuma página/manual específico encontrado no repositório |
| Estoque Analítico | Materiais | Material, Valor, Data, Estoque, Custo | Nenhuma página/manual específico encontrado no repositório |
| Histórico de Compras | Materiais | Material, Fornecedor, Pedido, Valor, Data, Custo | Nenhuma página/manual específico encontrado no repositório |
| Tabela de Preço | Materiais | Valor | docs/assets/data/content-info.json, docs/manual/index.md, docs/materiais/tabela-precos.md, docs/transportes/tabela-precos.md |
| Consumo de Lote | Materiais | Cliente, Material, Fornecedor, Nota fiscal, Ordem de produção, Quantidade, Valor, Data, Estoque, Lote | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Produção Sintético | Ordem de Produção | Cliente, Material, Ordem de produção, Contrato, Quantidade, Data, Status, Processo, Sucata, Peso | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Produção Analítico | Ordem de Produção | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Data, Status, Lote | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Produção Diária | Ordem de Produção | Cliente, Material, Ordem de produção, Quantidade, Data, Processo, Sucata, Peso | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Produção por Processo Realizado | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo, Sucata, Peso | Nenhuma página/manual específico encontrado no repositório |
| Apontamento de Sucatas Analítico | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Sucata | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Produção Equipamento | Ordem de Produção | Material, Ordem de produção, Quantidade, Data, Equipamento, Processo | Nenhuma página/manual específico encontrado no repositório |
| Equipamento Manutenção | Ordem de Produção | Fornecedor, Data, Equipamento, Manutenção | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Serviço Sintético | Ordem de Serviço | Cliente, Contrato, Data, Status, Ordem de serviço | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Serviço Analítico | Ordem de Serviço | Cliente, Pedido, Contrato, Data, Status, Ordem de serviço | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Serviço X Recebimento Sintético | Ordem de Serviço | Cliente, Contrato, Valor, Data, Status, Ordem de serviço, Recebimento/Pagamento | Nenhuma página/manual específico encontrado no repositório |
| Ordem de Serviço X Recebimento Analítico | Ordem de Serviço | Cliente, Contrato, Valor, Data, Status, Ordem de serviço, Recebimento/Pagamento | Nenhuma página/manual específico encontrado no repositório |
| Fatura por Serviço | Ordem de Serviço | Cliente, Valor, Data, Serviço, Recebimento/Pagamento, Vencimento | Nenhuma página/manual específico encontrado no repositório |
| Orçamentos Analítico | Vendas | Cliente, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Pedidos Sintético | Vendas | Cliente, Nota fiscal, Pedido, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Recebimento/Pagamento | Nenhuma página/manual específico encontrado no repositório |
| Pedidos Analítico | Vendas | Cliente, Material, Nota fiscal, Pedido, Ordem de produção, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Vendas X Lucratividade | Vendas | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Funcionário, Ordem de serviço, Custo, Preço/Lucratividade | Nenhuma página/manual específico encontrado no repositório |
| Pedidos - Movimentação do Caixa | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Pedidos Disponíveis para Faturamento | Vendas | Cliente, Pedido, Contrato, Data, Vendedor | Nenhuma página/manual específico encontrado no repositório |
| Materiais Mais Vendidos | Vendas | Material, Quantidade, Valor, Estoque, Lote | Nenhuma página/manual específico encontrado no repositório |
| Vendas de Material por Cliente | Vendas | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data, Status | Nenhuma página/manual específico encontrado no repositório |
| Vendas por Dia/Hora | Vendas | Pedido, Valor, Data | Nenhuma página/manual específico encontrado no repositório |
| Demonstrativo de Vendas por Material | Vendas | Material, Quantidade, Valor | Nenhuma página/manual específico encontrado no repositório |
| Comissões | Vendas | Quantidade, Data | docs/assets/data/content-info.json, docs/colaboradores/comissoes.md, docs/comercial/comissoes-vendedores.md, docs/manual/index.md, docs/referencia/faq/comissao-cliente.md, docs/referencia/faq.md |
| Comissões por Recebimento | Vendas | Cliente, Nota fiscal, Pedido, Contrato, Valor, Data, Recebimento/Pagamento, Comissão | Nenhuma página/manual específico encontrado no repositório |
| Pedidos X Recebimento Sintético | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento | Nenhuma página/manual específico encontrado no repositório |
| Pedidos X Recebimento Analítico | Vendas | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento | Nenhuma página/manual específico encontrado no repositório |
| Pedidos Analítico por Data de Entrega | Vendas | Cliente, Material, Pedido, Contrato, Quantidade, Valor, Data, Status, Vendedor, Condição de pagamento | Nenhuma página/manual específico encontrado no repositório |
| Pedidos X Ficha Técnica | Vendas | Cliente, Material, Pedido, Ordem de produção, Quantidade, Data, Status, Vendedor | Nenhuma página/manual específico encontrado no repositório |
| Pedido X Ordem Produção | Vendas | Cliente, Material, Pedido, Ordem de produção, Quantidade, Valor, Data, Status, Processo | Nenhuma página/manual específico encontrado no repositório |
| Despacho | Vendas | Valor, Data, Peso | docs/assets/data/content-info.json, docs/comercial/despacho.md |
| Despacho por Pedido | Vendas | Cliente, Nota fiscal, Pedido, Valor, Data, Impostos, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Ranking de Vendas por Cliente | Vendas | Cliente, Pedido, Quantidade, Valor, Vendedor, Preço/Lucratividade | Nenhuma página/manual específico encontrado no repositório |
| Clientes que não compraram | Vendas | Cliente, Pedido, Quantidade, Data, Vendedor | Nenhuma página/manual específico encontrado no repositório |
| Devoluções | Vendas | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data | docs/comercial/devolucao.md |
| Nota Fiscal Sintético | Faturamento | Cliente, Nota fiscal, Valor, Data, Status, Impostos, Transporte/Frete, Peso | Nenhuma página/manual específico encontrado no repositório |
| Nota Fiscal Analítico | Faturamento | Cliente, Material, Nota fiscal, Quantidade, Valor, Data, Status, Impostos, CFOP, Transporte/Frete, Peso | Nenhuma página/manual específico encontrado no repositório |
| Entrada Nota Fiscal Sintético | Faturamento | Fornecedor, Nota fiscal, Valor, Data | Nenhuma página/manual específico encontrado no repositório |
| Entrada Nota Fiscal Analítico | Faturamento | Material, Fornecedor, Nota fiscal, Pedido, Quantidade, Valor, Data, Impostos, CFOP | Nenhuma página/manual específico encontrado no repositório |
| Cupom Fiscal Sintético | Faturamento | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Cupom Fiscal Analítico | Faturamento | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Nota Fiscal Serviço Sintético | Faturamento | Cliente, Nota fiscal, Valor, Data, Status, Serviço, Impostos | Nenhuma página/manual específico encontrado no repositório |
| Nota Fiscal Apuração de Impostos | Faturamento | Cliente, Fornecedor, Nota fiscal, Valor, Data, Impostos, CFOP | Nenhuma página/manual específico encontrado no repositório |
| Apuração de Impostos por CFOP | Faturamento | Valor, Impostos, CFOP | Nenhuma página/manual específico encontrado no repositório |
| Contas a Pagar por Centro de Custo | Contas a Pagar | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | Nenhuma página/manual específico encontrado no repositório |
| Contas a Receber por Centro de Custo | Contas a Receber | Cliente, Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo | Nenhuma página/manual específico encontrado no repositório |
| Movimentação de Contas | Financeiro | Cliente, Fornecedor, Nota fiscal, Valor, Data, Funcionário, Centro de custo | Nenhuma página/manual específico encontrado no repositório |
| Cheques | Financeiro | Cliente, Fornecedor, Data, Funcionário, Centro de custo | docs/financeiro/cheque.md |
| Solicitação de Pagamento | Financeiro | Data | docs/assets/data/content-info.json, docs/financeiro/solicitacao-pagamento.md |
| Pedidos de Compra Sintético | Compras | Cliente, Fornecedor, Nota fiscal, Pedido, Contrato, Valor, Data, Status, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Pedidos de Compra Analítico | Compras | Cliente, Material, Fornecedor, Pedido, Contrato, Quantidade, Valor, Data, Status, Serviço, Impostos, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Conhecimento de Transporte Sintético | Transporte | Cliente, Fornecedor, Nota fiscal, Quantidade, Valor, Data, Status, Transporte/Frete | Nenhuma página/manual específico encontrado no repositório |
| Faturamento Sintético | Transporte | Cliente, Valor, Data, Recebimento/Pagamento, Vencimento | Nenhuma página/manual específico encontrado no repositório |
| Faturamento Analítico | Transporte | Cliente, Valor, Data, Recebimento/Pagamento, Vencimento | Nenhuma página/manual específico encontrado no repositório |
| Estatístico de Conhecimento de Transporte | Transporte | Quantidade, Valor, Data, Impostos, Transporte/Frete, Peso | Nenhuma página/manual específico encontrado no repositório |
| Documentos do Funcionário | Funcionário | Data, Funcionário, Vencimento, Documento | Nenhuma página/manual específico encontrado no repositório |
| Rendimento do Funcionário | Funcionário | Quantidade, Data, Funcionário | Nenhuma página/manual específico encontrado no repositório |

## Duplicidades e sobreposições
### Conjuntos exatamente iguais

| Relatórios | Informações |
|---|---|
| Estoque Sintético / Estoque Sintético com Material Relacionado | Material, Quantidade, Valor, Estoque, Lote, Custo |
| Ordem de Serviço X Recebimento Sintético / Ordem de Serviço X Recebimento Analítico | Cliente, Contrato, Ordem de serviço, Valor, Data, Status, Recebimento/Pagamento |
| Pedidos X Recebimento Sintético / Pedidos X Recebimento Analítico | Cliente, Pedido, Contrato, Valor, Data, Status, Condição de pagamento, Recebimento/Pagamento |
| Cupom Fiscal Sintético / Cupom Fiscal Analítico | Cliente, Nota fiscal, Pedido, Valor, Data, Status, Impostos, Transporte/Frete |
| Contas a Pagar / Contas a Pagar por Centro de Custo | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo |
| Faturamento Sintético / Faturamento Analítico | Cliente, Valor, Data, Vencimento, Recebimento/Pagamento |

### Conjuntos muito semelhantes

| Similaridade | Relatórios | Campos em comum |
|---:|---|---|
| 0.89 | Orçamentos Analítico / Pedidos - Movimentação do Caixa | Cliente, Contrato, Valor, Data, Status, Vendedor, Condição de pagamento, Transporte/Frete |
| 0.88 | Vendas de Material por Cliente / Devoluções | Cliente, Material, Nota fiscal, Pedido, Quantidade, Valor, Data |
| 0.88 | Despacho por Pedido / Cupom Fiscal Sintético | Cliente, Nota fiscal, Pedido, Valor, Data, Transporte/Frete, Impostos |
| 0.88 | Despacho por Pedido / Cupom Fiscal Analítico | Cliente, Nota fiscal, Pedido, Valor, Data, Transporte/Frete, Impostos |
| 0.91 | Contas a Pagar / Contas a Receber por Centro de Custo | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo |
| 0.91 | Contas a Pagar por Centro de Custo / Contas a Receber por Centro de Custo | Fornecedor, Nota fiscal, Contrato, Valor, Data, Status, Funcionário, Recebimento/Pagamento, Vencimento, Centro de custo |

## Pontos não confirmados
- A documentação existente no repositório não contém manuais/páginas específicas para a maioria dos relatórios cadastrados no Indicador.
- Não foi possível confirmar tecnicamente quais colunas/campos cada relatório real do ERP possui apenas pelo repositório.
- O catálogo atual pode estar correto, mas ainda precisa de validação manual com evidência de produto.
- Relatórios sintéticos e analíticos com o mesmo conjunto de filtros podem ser intencionais, mas devem ser revisados.

## Recomendações de correção
1. Antes de alterar o produto, validar cada relatório contra print, exportação ou documentação interna do ERP.
2. Criar uma fonte estruturada separada para o catálogo de relatórios, com campo `fonte` e `ultima_revisao`, em vez de manter apenas arrays no JavaScript.
3. Revisar primeiro os pares com campos exatamente iguais, porque eles têm maior chance de ocultar diferenças funcionais entre sintético e analítico.
4. Depois da revisão manual, transformar `NÃO CONFIRMADO` em `SIM` apenas quando houver evidência.

## Arquivos criados para teste
- `tests/report-indicator/runner.html`
- `tests/report-indicator/latest-results.json`
- `tests/report-indicator/AUDITORIA_INDICADOR_RELATORIOS.md`
