# Convenção Interna de Conteúdo da Central WCorp

Este arquivo é interno. Ele define como criar e manter conteúdos da Central WCorp sem precisar editar HTML, CSS ou JavaScript para cada novo Guia ou Manual.

Para o usuário final, a Central continua mostrando apenas o conteúdo visual aprovado. Front matter, IDs e campos técnicos são usados internamente.

## Diferença Editorial

**Guia** ensina como fazer uma tarefa.

Exemplos:

- Como cadastrar um cliente
- Como emitir uma NF-e
- Como realizar ajuste de inventário

**Manual** documenta o que existe e como uma tela ou função funciona.

Exemplos:

- Clientes
- Nota Fiscal
- Natureza de Operação

Não misture os dois formatos. Se o conteúdo é passo a passo de uma tarefa, é Guia. Se descreve uma tela, campos, botões, regras e comportamento, é Manual.

## Front Matter

Todo conteúdo novo adotado pelo padrão deve começar com front matter.

Campos obrigatórios:

```yaml
---
id: cadastrar-cliente
title: Como cadastrar um cliente
type: guia
category: Comercial
---
```

Campos opcionais:

```yaml
description: Aprenda como realizar o cadastro de um cliente no WCorp.
difficulty: facil
status: published
related_manual:
  - comercial-clientes
related_guides:
  - fazer-pedido-venda
tags:
  - cliente
  - cadastro
```

Use poucos campos. Só preencha o que ajuda busca, Assistente, analytics ou manutenção.

### Identificador Único

Não use `analytics_id`.

O campo `id` é a identidade única e estável do conteúdo e deve ser reutilizado como `content_id` por Analytics, Popular, Assistente, relacionados e testes. Só criaremos outro identificador se surgir uma necessidade técnica concreta que não possa ser atendida pelo `id`.

## Campos

| Campo | Obrigatório | Uso |
|---|---|---|
| `id` | Sim | Identidade estável do conteúdo. Não muda quando o título muda. Também é o `content_id` para Analytics, Popular, Assistente, relacionados e testes. |
| `title` | Sim | Título principal exibido/esperado para o conteúdo. |
| `type` | Sim | `guia` ou `manual`. |
| `category` | Sim | Área principal, como Comercial, Faturamento ou Administração. |
| `description` | Não | Resumo curto para cards, busca e Assistente. |
| `difficulty` | Não | `facil`, `intermediario` ou `avancado`. |
| `related_manual` | Não | Lista de IDs de manuais relacionados. A Central resolve título, URL e tipo automaticamente. |
| `related_guides` | Não | Lista de IDs de guias relacionados. A Central resolve título, URL e tipo automaticamente. |
| `tags` | Não | Palavras úteis para busca, Assistente e analytics. |
| `status` | Não | `published`, `draft` ou `deprecated`. |
| `screen_path` | Não | Caminho da tela em Manual, como `Comercial > Clientes`. |

Valores válidos:

- `type`: `guia`, `manual`
- `difficulty`: `facil`, `intermediario`, `avancado`
- `status`: `published`, `draft`, `deprecated`

## Organização de Arquivos

Guias:

```text
docs/como-fazer/<slug>.md
```

Manuais:

```text
docs/<modulo>/<slug>.md
```

Imagens de guia:

```text
docs/assets/images/guias/<id>/
```

Vídeos de guia:

```text
docs/assets/videos/guias/<id>/
```

Imagens de manual:

```text
docs/assets/images/manuais/<id>/
```

Vídeos de manual:

```text
docs/assets/videos/manuais/<id>/
```

Não reorganize arquivos antigos em lote. Use essa estrutura para conteúdos novos e para pilotos migrados manualmente.

## Sintaxe de Conteúdo

### Texto e Subtítulos

Use Markdown comum:

```markdown
## Como fazer

1. Acesse **Comercial > Clientes**.
2. Clique em **Novo**.
3. Preencha os dados obrigatórios.
```

### Pré-Requisitos

Escreva só o título e a lista. A Central aplica o card visual automaticamente.

```markdown
## Pré-requisitos

- Cliente cadastrado
- Material cadastrado
- Natureza de Operação configurada
```

Não use HTML para pré-requisitos em conteúdos novos.

### Imagens

Use Markdown normal:

```markdown
![Tela de clientes](../assets/images/guias/cadastrar-cliente/comercial_clientes.png)
```

Boas práticas:

- sempre preencher texto alternativo útil;
- guardar a imagem na pasta do conteúdo;
- evitar nomes genéricos como `print1.png`;
- preferir nomes descritivos como `aba-clientes.png`.

A Central cuida de responsividade e lightbox pelo padrão atual.

### Vídeos

Use link Markdown com a classe `.wc-video-link`.

```markdown
[Demonstração do cadastro](../assets/videos/guias/cadastrar-cliente/comercial_clientes.mp4){ .wc-video-link data-poster="../assets/images/guias/cadastrar-cliente/comercial_clientes.png" }
```

Esse link é convertido automaticamente para o mesmo player visual usado pela Central.

Para vários vídeos no mesmo Guia, coloque cada vídeo no trecho correspondente:

```markdown
### Passo 1

Texto do primeiro passo.

[Vídeo do passo 1](../assets/videos/guias/exemplo-completo/passo-1.mp4){ .wc-video-link }

### Passo 2

Texto do segundo passo.

[Vídeo do passo 2](../assets/videos/guias/exemplo-completo/passo-2.mp4){ .wc-video-link }
```

### Dica, Atenção e Observação

Use admonitions do MkDocs.

```markdown
!!! tip "Dica"
    Informação útil que facilita a operação.

!!! warning "Atenção"
    Algo que pode causar problema se ignorado.

!!! note "Observação"
    Contexto complementar.
```

Use com moderação. Não transforme a página inteira em caixas.

### Código ou Comandos

Use bloco de código quando realmente necessário:

````markdown
```text
Mensagem ou comando aqui
```
````

### Relacionados

Registre relações por ID no front matter:

```yaml
related_manual:
  - comercial-clientes
related_guides:
  - fazer-pedido-venda
```

Não crie uma seção manual `## Veja também` para repetir esses links.

A Central usa o catálogo técnico gerado em `docs/assets/data/content-catalog.json` para resolver:

```text
ID -> título -> URL -> tipo
```

Se um ID relacionado não existir entre os conteúdos adotados pela convenção, a validação falha antes da publicação.

### Caminho de Tela em Manual

Para Manuais, informe o caminho uma única vez no front matter:

```yaml
screen_path: Comercial > Clientes
```

A Central renderiza a seção `Caminho` de forma padronizada. Não escreva HTML e não repita o mesmo caminho manualmente no conteúdo.

## Modelo de Guia

```markdown
---
id: cadastrar-cliente
title: Como cadastrar um cliente
type: guia
category: Comercial
description: Aprenda como realizar o cadastro de um cliente no WCorp.
difficulty: facil
status: published
related_manual:
  - comercial-clientes
tags:
  - cliente
  - cadastro
---

# Como cadastrar um cliente

## Pré-requisitos

- CNPJ, CPF ou dados cadastrais do cliente em mãos

## Caminho

![Onde encontrar](../assets/images/guias/cadastrar-cliente/comercial_clientes.png)

## Demonstração em vídeo

[Demonstração do cadastro de cliente](../assets/videos/guias/cadastrar-cliente/comercial_clientes.mp4){ .wc-video-link data-poster="../assets/images/guias/cadastrar-cliente/comercial_clientes.png" }

## Como fazer

1. Acesse **Comercial > Clientes**.
2. Inicie um novo cadastro.
3. Preencha os campos obrigatórios.
4. Salve o cadastro.
```

## Modelo de Manual

```markdown
---
id: comercial-clientes
title: Clientes
type: manual
category: Comercial
description: Tela utilizada para cadastro e manutenção de clientes.
screen_path: Comercial > Clientes
status: published
related_guides:
  - cadastrar-cliente
tags:
  - cliente
  - cadastro
---

# Clientes

## Objetivo

Cadastrar e consultar clientes no WCorp.

## Campos principais

| Campo | Descrição |
|---|---|
| CNPJ | Documento da empresa cliente |
```

## Exemplos Demonstrativos

### Exemplo 1: Guia mínimo

```markdown
---
id: consultar-estoque
title: Como consultar estoque
type: guia
category: Estoque
---

# Como consultar estoque

1. Acesse **Materiais > Estoque**.
2. Informe o material desejado.
3. Consulte o saldo disponível.
```

### Exemplo 2: Guia completo

```markdown
---
id: exemplo-guia-completo
title: Como executar um processo completo
type: guia
category: Comercial
description: Exemplo interno com passos, imagem, vídeos e alertas.
difficulty: intermediario
status: draft
related_manual:
  - comercial-clientes
tags:
  - exemplo
  - processo
---

# Como executar um processo completo

## Pré-requisitos

- Cliente cadastrado
- Produto cadastrado
- Permissão de acesso liberada

## Passo 1

Acesse a tela principal do processo.

![Tela inicial](../assets/images/guias/exemplo-guia-completo/tela-inicial.png)

[Vídeo do passo 1](../assets/videos/guias/exemplo-guia-completo/passo-1.mp4){ .wc-video-link }

## Passo 2

Preencha os campos obrigatórios.

[Vídeo do passo 2](../assets/videos/guias/exemplo-guia-completo/passo-2.mp4){ .wc-video-link }

## Passo 3

Revise os dados e salve.

!!! warning "Atenção"
    Confira os dados fiscais antes de finalizar.

!!! note "Observação"
    Se houver erro de validação, consulte a área de Erros e Soluções.
```

### Exemplo 3: Manual completo

```markdown
---
id: exemplo-manual-completo
title: Tela de Exemplo
type: manual
category: Comercial
description: Exemplo interno de documentação de tela.
screen_path: Comercial > Tela de Exemplo
status: draft
related_guides:
  - exemplo-guia-completo
tags:
  - exemplo
  - manual
---

# Tela de Exemplo

## Objetivo

Explicar para que a tela serve.

## Visão geral

![Tela de exemplo](../assets/images/manuais/exemplo-manual-completo/tela.png)

## Campos

| Campo | Descrição | Observações |
|---|---|---|
| Código | Identificador do registro | Gerado automaticamente quando aplicável |

## Botões

| Botão | Função |
|---|---|
| Salvar | Grava as alterações |
```

## Validação

A validação interna fica em:

```text
tests/content-convention/validate-content-metadata.mjs
```

Ela verifica:

- ID duplicado;
- `type` inválido;
- conteúdo adotado pelo padrão sem `title`;
- Guia ou Manual sem campos obrigatórios;
- `related_manual` e `related_guides` apontando para ID inexistente entre conteúdos adotados;
- resolução automática de relacionados por ID;
- `screen_path` válido em Manuais;
- imagem Markdown local inexistente;
- vídeo Markdown local inexistente;
- múltiplos vídeos Markdown com `.wc-video-link`;
- metadata inválida;
- ausência de HTML manual para autoria comum, como `<video>` ou listas de pré-requisitos customizadas;
- asset duplicado dentro do mesmo conteúdo quando possível.

Conteúdos antigos sem `id` e `type` ainda são tratados como legados e não quebram a validação nesta etapa.

O script também gera:

```text
docs/assets/data/content-catalog.json
```

Esse catálogo técnico resolve IDs para título, URL e tipo na renderização automática de `Veja também` e `Caminho`.

## Pendência de Build Real

Como MkDocs/Python não estavam disponíveis no ambiente desta revisão, a aprovação visual final ainda depende de executar posteriormente:

```bash
mkdocs build
```

Depois do build real no Docker/ambiente do projeto, conferir os dois pilotos renderizados pelo MkDocs verdadeiro.

## Pilotos Migrados

Guia piloto:

```text
docs/como-fazer/cadastrar-cliente.md
```

Manual piloto:

```text
docs/comercial/comercial-clientes.md
```

Esses dois arquivos definem o padrão inicial. A migração dos demais conteúdos deve ser feita depois, em lote controlado ou aos poucos.
