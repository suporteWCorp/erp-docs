# Base de erros

A fonte oficial dos artigos fica em `docs/assets/data/erros-comuns.json`.

## Como cadastrar um artigo

Adicione um objeto ao array `errors`:

```json
{
  "id": "rejeicao-999-exemplo",
  "title": "Rejeição 999 - Exemplo",
  "area": "Documentos Fiscais",
  "category": "NF-e",
  "description": "Resumo curto da mensagem.",
  "cause": "Causa provável.",
  "resolution": "Orientação para resolução.",
  "observations": "Informação complementar.",
  "links": [],
  "tags": ["sefaz", "999", "nfe"]
}
```

A área, a categoria e seus contadores são atualizados automaticamente na página. Uma área ou categoria ainda desconhecida também será incluída automaticamente.

## Ordem de exibição

O objeto `taxonomy` controla somente a ordem editorial das áreas e categorias conhecidas. Ele também pode reservar categorias ainda sem artigos, exibidas com contador zero.

Não é necessário alterar `taxonomy` para publicar um artigo. Valores novos são acrescentados automaticamente depois dos valores ordenados.

## Identificador

O campo `id` deve ser único, usar letras minúsculas e hífens e permanecer estável. Ele forma o link direto do artigo:

```text
referencia/erros-comuns/#rejeicao-999-exemplo
```
