# Inventário de Adoção do Padrão de Conteúdo V1

Inventário diagnóstico. Nenhum Guia ou Manual foi migrado nesta etapa.

## Critérios de Classificação

- A — já compatível ou migração trivial.
- B — precisa reorganizar assets/metadata.
- C — possui estrutura especial que exige revisão humana.
- D — possível conteúdo duplicado/obsoleto/suspeito.

## Resumo

- Total de Guias: 25
- Total de Manuais: 31
- Páginas Visão geral/índice fora dos totais principais: 15
- Classe A: 2
- Classe B: 32
- Classe C: 1
- Classe D: 21

## Principais Exceções

- Muitos Guias legados usam `<div class="wc-prereq-list">`, `<br>` e vídeos HTML; isso é convertível, mas exige reorganização controlada.
- Alguns Manuais são páginas de visão geral ou páginas em preparação; elas não devem ser migradas automaticamente como conteúdo final.
- O piloto `comercial-clientes.md` já possui front matter V1 e relação por ID, mas ainda usa `wc-screen-block` para o print; manter ou simplificar deve ser uma decisão editorial/visual posterior.
- Há vídeos externos do YouTube em Manual; a convenção V1 cobre bem arquivos `.mp4`, mas vídeo externo precisa decisão de padrão antes de migração em massa.

## Guias

### Como cadastrar uma Natureza de Operação

- Caminho: `docs/como-fazer/cadastrar-natureza-operacao.md`
- Tipo: Guia
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/adm_natureza_operacao.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como cadastrar uma Condição de Pagamento

- Caminho: `docs/como-fazer/cadastrar-condicao-pagamento.md`
- Tipo: Guia
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/adm_condicao_pagamento.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como cadastrar um Centro de Custo

- Caminho: `docs/como-fazer/cadastrar-centro-custo.md`
- Tipo: Guia
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/adm_centro_custo.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como cadastrar um usuário

- Caminho: `docs/como-fazer/cadastrar-usuario.md`
- Tipo: Guia
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/adm_cadastro_usuario.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como configurar um Grupo de Usuário

- Caminho: `docs/como-fazer/configurar-grupo-usuario.md`
- Tipo: Guia
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/adm__grupo_usuario.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como cadastrar um cliente

- Caminho: `docs/como-fazer/cadastrar-cliente.md`
- Tipo: Guia
- Módulo/categoria: Comercial
- Classificação: A (já compatível)
- Front matter V1: sim
- Imagens: `docs/assets/images/guias/cadastrar-cliente/comercial_clientes.png`
- Vídeos: `docs/assets/videos/guias/cadastrar-cliente/comercial_clientes.mp4`
- HTML manual: nenhum
- Pré-requisitos: sim
- Relacionados: não + front matter por ID
- Estrutura especial: nenhuma relevante
- Motivos:
  - front matter V1 completo e migração trivial

### Como cadastrar um fornecedor

- Caminho: `docs/como-fazer/cadastrar-fornecedor.md`
- Tipo: Guia
- Módulo/categoria: Comercial
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como criar um orçamento

- Caminho: `docs/como-fazer/criar-orcamento.md`
- Tipo: Guia
- Módulo/categoria: Comercial
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/comercial_orcamento.mp4`
- HTML manual: `br`, `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como gerar um pedido

- Caminho: `docs/como-fazer/fazer-pedido-venda.md`
- Tipo: Guia
- Módulo/categoria: Comercial
- Classificação: C (alta)
- Front matter V1: não
- Imagens: `docs/assets/images/guias/comercial_pedido.png`
- Vídeos: `docs/assets/videos/comercial_pedido.mp4`, `docs/assets/videos/comercial_pedido_orcamento.mp4`
- HTML manual: `br`, `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link; múltiplos vídeos exigem conferência de ordem/contexto
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter
  - múltiplos vídeos exigem conferência de ordem/contexto

### Como cadastrar um material

- Caminho: `docs/como-fazer/cadastrar-material.md`
- Tipo: Guia
- Módulo/categoria: Estoque
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/images/guias/materiais_materiais.png`
- Vídeos: `docs/assets/videos/materiais_materiais.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como consultar estoque

- Caminho: `docs/como-fazer/consultar-estoque.md`
- Tipo: Guia
- Módulo/categoria: Estoque
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como ajustar estoque

- Caminho: `docs/como-fazer/ajustar-estoque.md`
- Tipo: Guia
- Módulo/categoria: Estoque
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como fazer inventário

- Caminho: `docs/como-fazer/fazer-inventario.md`
- Tipo: Guia
- Módulo/categoria: Estoque
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como transferir estoque

- Caminho: `docs/como-fazer/transferir-estoque.md`
- Tipo: Guia
- Módulo/categoria: Estoque
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como emitir uma NF-e

- Caminho: `docs/como-fazer/faturar-nota.md`
- Tipo: Guia
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/images/guias/faturamento_emitir_nfe.png`
- Vídeos: `docs/assets/videos/faturamento_nfe.mp4`
- HTML manual: `br`, `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como cancelar uma NF-e

- Caminho: `docs/como-fazer/cancelar-nfe.md`
- Tipo: Guia
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/faturamento_cancelar_nfe.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como emitir uma devolução

- Caminho: `docs/como-fazer/emitir-devolucao.md`
- Tipo: Guia
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como emitir uma carta de correção

- Caminho: `docs/como-fazer/emitir-carta-correcao.md`
- Tipo: Guia
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/faturamento_carta_correcao.mp4`
- HTML manual: `div`, `source`, `video`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - Veja também manual deve virar IDs no front matter

### Como emitir uma nota complementar

- Caminho: `docs/como-fazer/emitir-nota-complementar.md`
- Tipo: Guia
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como importar XML

- Caminho: `docs/como-fazer/importar-xml.md`
- Tipo: Guia
- Módulo/categoria: Compras
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como lançar uma nota de entrada

- Caminho: `docs/como-fazer/lancar-nota-entrada.md`
- Tipo: Guia
- Módulo/categoria: Compras
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como criar um pedido de compra

- Caminho: `docs/como-fazer/criar-pedido-compra.md`
- Tipo: Guia
- Módulo/categoria: Compras
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como gerar boleto

- Caminho: `docs/como-fazer/gerar-boleto.md`
- Tipo: Guia
- Módulo/categoria: Financeiro
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como baixar um título

- Caminho: `docs/como-fazer/baixar-titulo.md`
- Tipo: Guia
- Módulo/categoria: Financeiro
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

### Como lançar contas a pagar

- Caminho: `docs/como-fazer/lancar-contas-a-pagar.md`
- Tipo: Guia
- Módulo/categoria: Financeiro
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: `br`, `div`
- Pré-requisitos: sim (HTML wc-prereq-list)
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - pré-requisitos usam HTML wc-prereq-list convertível para Markdown
  - Veja também manual deve virar IDs no front matter

## Manuals

### Clientes

- Caminho: `docs/comercial/comercial-clientes.md`
- Tipo: Manual
- Módulo/categoria: Comercial
- Classificação: A (já compatível)
- Front matter V1: sim
- Imagens: `docs/assets/comercial-clientes.png`
- Vídeos: `https://www.youtube.com/watch?v=osiFPSfEOrc&list=PLouJpYsMKL1fizkcacjs-UdhTCnxnrMOO&t=80s`
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: não + front matter por ID
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown; link de YouTube exige decisão de padrão para vídeo externo; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - front matter V1 completo e migração trivial
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo
  - link de YouTube exige decisão de padrão para vídeo externo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Grupo de Clientes

- Caminho: `docs/comercial/comercial-grupo-clientes.md`
- Tipo: Manual
- Módulo/categoria: Comercial
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/comercial-grupo-clientes.png`
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
- Motivos:
  - sem front matter V1 completo
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo

### Módulo Comercial - Orçamentos

- Caminho: `docs/comercial/comercial-orcamento.md`
- Tipo: Manual
- Módulo/categoria: Comercial
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo

### Módulo Comercial - Pedido de Venda

- Caminho: `docs/comercial/pedidos.md`
- Tipo: Manual
- Módulo/categoria: Comercial
- Classificação: D (média)
- Front matter V1: não
- Imagens: `docs/assets/comercial-pedidos.png`
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - assets fora da pasta previsível por conteúdo

### Devolução

- Caminho: `docs/comercial/devolucao.md`
- Tipo: Manual
- Módulo/categoria: Comercial
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Nota Fiscal

- Caminho: `docs/faturamento/faturamento-nf.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/faturamento-nf.png`, `docs/assets/faturamento-nf-manual-pedidos.png`, `docs/assets/faturamento-nf-add-pedido.png`, `docs/assets/faturamento-nf-transmitir.png`
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - sem front matter V1 completo
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo
  - Veja também manual deve virar IDs no front matter
  - manual com tabelas extensas, migração precisa preservar estrutura

### Cupom Fiscal

- Caminho: `docs/faturamento/faturamento-nfce.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: B (baixa)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Entrada de Nota Fiscal

- Caminho: `docs/faturamento/entrada-nota-fiscal.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Carta de Correção

- Caminho: `docs/faturamento/carta-correcao.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Inutilização Nota Fiscal

- Caminho: `docs/faturamento/inutilizacao-nota-fiscal.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: B (média)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: `docs/assets/videos/faturamento_inutilizacao_nota_fiscal.mp4`
- HTML manual: `source`, `video`
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: vídeo em HTML deve virar link Markdown .wc-video-link; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - sem front matter V1 completo
  - vídeo em HTML deve virar link Markdown .wc-video-link
  - manual com tabelas extensas, migração precisa preservar estrutura

### CFOP Entrada

- Caminho: `docs/faturamento/cfop-entrada.md`
- Tipo: Manual
- Módulo/categoria: Faturamento
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Contas a Pagar

- Caminho: `docs/financeiro/contas-a-pagar.md`
- Tipo: Manual
- Módulo/categoria: Financeiro
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Contas a Receber

- Caminho: `docs/financeiro/contas-a-receber.md`
- Tipo: Manual
- Módulo/categoria: Financeiro
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Boleto

- Caminho: `docs/financeiro/boleto.md`
- Tipo: Manual
- Módulo/categoria: Financeiro
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Contas

- Caminho: `docs/financeiro/contas.md`
- Tipo: Manual
- Módulo/categoria: Financeiro
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Fornecedores

- Caminho: `docs/fornecedores/fornecedores.md`
- Tipo: Manual
- Módulo/categoria: Fornecedores
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Cadastro de Materiais

- Caminho: `docs/materiais/materiais.md`
- Tipo: Manual
- Módulo/categoria: Materiais
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/materiais-materiais.png`
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
- Motivos:
  - sem front matter V1 completo
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo

### Categoria de Materiais

- Caminho: `docs/materiais/categoria-materiais.md`
- Tipo: Manual
- Módulo/categoria: Materiais
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Locais de Armazenagem

- Caminho: `docs/materiais/locais-armazenagem.md`
- Tipo: Manual
- Módulo/categoria: Materiais
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Ajustar Inventário

- Caminho: `docs/materiais/ajustar-inventario.md`
- Tipo: Manual
- Módulo/categoria: Materiais
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Lote/Estoque

- Caminho: `docs/materiais/lote-estoque.md`
- Tipo: Manual
- Módulo/categoria: Materiais
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/materiais-lote-estoque.png`
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
- Motivos:
  - sem front matter V1 completo
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo

### Pedido de Compra

- Caminho: `docs/compras/pedido-compra.md`
- Tipo: Manual
- Módulo/categoria: Compras
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### XML(s) NFe

- Caminho: `docs/relatorios/xml-nfe.md`
- Tipo: Manual
- Módulo/categoria: Relatórios
- Classificação: B (baixa)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Usuários

- Caminho: `docs/administracao/usuarios.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: B (média)
- Front matter V1: não
- Imagens: `docs/assets/adm-usuarios.png`
- Vídeos: nenhum
- HTML manual: `div`
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
- Motivos:
  - sem front matter V1 completo
  - imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown
  - assets fora da pasta previsível por conteúdo

### Grupo Usuários

- Caminho: `docs/administracao/grupo-usuarios.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - Veja também manual deve virar IDs no front matter

### Empresas

- Caminho: `docs/administracao/empresas.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: B (baixa)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: nenhuma relevante
- Motivos:
  - sem front matter V1 completo
  - Veja também manual deve virar IDs no front matter

### Natureza de Operação

- Caminho: `docs/administracao/natureza-op.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - Veja também manual deve virar IDs no front matter

### Unidades

- Caminho: `docs/administracao/unidades.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### NCMS

- Caminho: `docs/administracao/ncms.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - Veja também manual deve virar IDs no front matter

### Centro de Custo

- Caminho: `docs/administracao/centro-custo.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: não
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto; manual com tabelas extensas, migração precisa preservar estrutura
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - manual com tabelas extensas, migração precisa preservar estrutura

### Condições de Pagamento

- Caminho: `docs/administracao/condicoes-pagamento.md`
- Tipo: Manual
- Módulo/categoria: Administração
- Classificação: D (revisão humana)
- Front matter V1: não
- Imagens: nenhuma
- Vídeos: nenhum
- HTML manual: nenhum
- Pré-requisitos: não
- Relacionados: seção Markdown
- Estrutura especial: conteúdo em breve/em preparação, possível obsoleto ou incompleto
- Motivos:
  - conteúdo em breve/em preparação, possível obsoleto ou incompleto
  - sem front matter V1 completo
  - Veja também manual deve virar IDs no front matter

## Páginas Visão Geral / Índice

- `docs/como-fazer/index.md` — Guia — Guia — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo; tipo editorial precisa revisão pela definição Guia/Manual
- `docs/manual/index.md` — Manuais do WCorp — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/comercial/comercial-geral.md` — Comercial — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/faturamento/faturamento-geral.md` — Faturamento — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/financeiro/financeiro-geral.md` — Financeiro — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/colaboradores/colaboradores-geral.md` — Colaboradores — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/fornecedores/fornecedores-geral.md` — Fornecedores — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/materiais/materiais-geral.md` — Materiais — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/servicos/servicos-geral.md` — Serviços — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/contratos/contratos-geral.md` — Contratos — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/compras/compras-geral.md` — Compras — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/producao/producao-geral.md` — Produção — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/transportes/transportes-geral.md` — Transportes — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/relatorios/relatorios-geral.md` — Relatórios — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo
- `docs/administracao/administracao-geral.md` — Administração — Manual — Classe C: página de índice/visão geral com layout especial; sem front matter V1 completo

## Assets Compartilhados por Vários Conteúdos

- Nenhum asset local foi referenciado por mais de um conteúdo inventariado.

## Candidatos a Assets Órfãos

- `docs/assets/aba-adm-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-colaboradores-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-comercial-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-compras-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-contratos-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-faturamento-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-financeiro-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-fornecedores-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-materiais-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-producao-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-relatorios-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-servicos-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/aba-transportes-geral.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/images/guias/comercial_clientes.png` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.
- `docs/assets/videos/comercial_clientes.mp4` — Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover.

## HTML que Pode Virar Markdown

- `docs/como-fazer/cadastrar-natureza-operacao.md` — Como cadastrar uma Natureza de Operação: <div>, <source>, <video>
- `docs/como-fazer/cadastrar-condicao-pagamento.md` — Como cadastrar uma Condição de Pagamento: <div>, <source>, <video>
- `docs/como-fazer/cadastrar-centro-custo.md` — Como cadastrar um Centro de Custo: <div>, <source>, <video>
- `docs/como-fazer/cadastrar-usuario.md` — Como cadastrar um usuário: <div>, <source>, <video>
- `docs/como-fazer/configurar-grupo-usuario.md` — Como configurar um Grupo de Usuário: <div>, <source>, <video>
- `docs/como-fazer/cadastrar-fornecedor.md` — Como cadastrar um fornecedor: <div>
- `docs/como-fazer/criar-orcamento.md` — Como criar um orçamento: <br>, <div>, <source>, <video>
- `docs/como-fazer/fazer-pedido-venda.md` — Como gerar um pedido: <br>, <div>, <source>, <video>
- `docs/como-fazer/cadastrar-material.md` — Como cadastrar um material: <div>, <source>, <video>
- `docs/como-fazer/consultar-estoque.md` — Como consultar estoque: <br>, <div>
- `docs/como-fazer/ajustar-estoque.md` — Como ajustar estoque: <br>, <div>
- `docs/como-fazer/fazer-inventario.md` — Como fazer inventário: <br>, <div>
- `docs/como-fazer/transferir-estoque.md` — Como transferir estoque: <br>, <div>
- `docs/como-fazer/faturar-nota.md` — Como emitir uma NF-e: <br>, <div>, <source>, <video>
- `docs/como-fazer/cancelar-nfe.md` — Como cancelar uma NF-e: <div>, <source>, <video>
- `docs/como-fazer/emitir-devolucao.md` — Como emitir uma devolução: <br>, <div>
- `docs/como-fazer/emitir-carta-correcao.md` — Como emitir uma carta de correção: <div>, <source>, <video>
- `docs/como-fazer/emitir-nota-complementar.md` — Como emitir uma nota complementar: <br>, <div>
- `docs/como-fazer/importar-xml.md` — Como importar XML: <br>, <div>
- `docs/como-fazer/lancar-nota-entrada.md` — Como lançar uma nota de entrada: <br>, <div>
- `docs/como-fazer/criar-pedido-compra.md` — Como criar um pedido de compra: <br>, <div>
- `docs/como-fazer/gerar-boleto.md` — Como gerar boleto: <br>, <div>
- `docs/como-fazer/baixar-titulo.md` — Como baixar um título: <div>
- `docs/como-fazer/lancar-contas-a-pagar.md` — Como lançar contas a pagar: <br>, <div>
- `docs/faturamento/inutilizacao-nota-fiscal.md` — Inutilização Nota Fiscal: <source>, <video>

## Conteúdos que Exigem Decisão Humana

- `docs/comercial/comercial-orcamento.md` — Módulo Comercial - Orçamentos — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo
- `docs/comercial/pedidos.md` — Módulo Comercial - Pedido de Venda — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; assets fora da pasta previsível por conteúdo
- `docs/comercial/devolucao.md` — Devolução — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/faturamento/entrada-nota-fiscal.md` — Entrada de Nota Fiscal — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/faturamento/carta-correcao.md` — Carta de Correção — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/faturamento/cfop-entrada.md` — CFOP Entrada — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/financeiro/contas-a-pagar.md` — Contas a Pagar — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/financeiro/contas-a-receber.md` — Contas a Receber — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/financeiro/boleto.md` — Boleto — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/financeiro/contas.md` — Contas — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/fornecedores/fornecedores.md` — Fornecedores — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/materiais/categoria-materiais.md` — Categoria de Materiais — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/materiais/locais-armazenagem.md` — Locais de Armazenagem — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/materiais/ajustar-inventario.md` — Ajustar Inventário — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/compras/pedido-compra.md` — Pedido de Compra — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/administracao/grupo-usuarios.md` — Grupo Usuários — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; Veja também manual deve virar IDs no front matter
- `docs/administracao/natureza-op.md` — Natureza de Operação — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; Veja também manual deve virar IDs no front matter
- `docs/administracao/unidades.md` — Unidades — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/administracao/ncms.md` — NCMS — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; Veja também manual deve virar IDs no front matter
- `docs/administracao/centro-custo.md` — Centro de Custo — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; manual com tabelas extensas, migração precisa preservar estrutura
- `docs/administracao/condicoes-pagamento.md` — Condições de Pagamento — Classe D: conteúdo em breve/em preparação, possível obsoleto ou incompleto; sem front matter V1 completo; Veja também manual deve virar IDs no front matter

## Estimativa Geral de Migração

- Guias: migração majoritariamente média, por causa de pré-requisitos em HTML, vídeos HTML e links relacionados manuais.
- Manuais: migração dividida entre páginas simples/triviais e páginas com placeholder/visão geral que precisam decisão editorial.
- Estratégia recomendada: migrar primeiro Classe A, depois B por módulo, e deixar C/D para revisão humana antes de qualquer alteração.
