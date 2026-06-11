# erp-docs

Base de documentação do ERP utilizada por suporte e desenvolvimento, contendo fluxos, regras de negócio, integrações e resolução de problemas.

## Rodar localmente com Docker

```powershell
docker compose up
```

Depois acesse:

```text
http://localhost:8000
```

## Estrutura principal

- `docs/como-documentar`: padrões, checklist e plano de documentação.
- `docs/comercial`: clientes, grupos, pedidos, orçamentos e separação.
- `docs/faturamento`: nota fiscal e cupom fiscal.
- `docs/materiais`: cadastro de materiais e lote/estoque.
- `docs/administracao`: usuários, empresas, NCMs, natureza de operação e condições de pagamento.
- `docs/referencia`: glossário, erros comuns e perguntas frequentes.

## Como adicionar uma página

1. Crie um arquivo `.md` dentro de `docs/`.
2. Use o modelo em `docs/como-documentar/padrao-das-paginas.md`.
3. Inclua a página no menu `nav` do `mkdocs.yml`.
