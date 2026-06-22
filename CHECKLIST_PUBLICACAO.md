# Checklist de Publicação

## Build

- [ ] Executar `mkdocs build --strict`.
- [ ] Se usar Docker, executar `docker compose run --rm docs build --strict`.
- [ ] Corrigir erros de build antes de publicar.
- [ ] Confirmar que todos os arquivos referenciados no `mkdocs.yml` existem.

## Navegação

- [ ] Conferir links principais: Início, Guia, FAQ e Manual.
- [ ] Conferir se os Guias aparecem nas categorias corretas.
- [ ] Conferir se o Manual mantém os módulos esperados.
- [ ] Confirmar que páginas fora da navegação são intencionais.
- [ ] Testar adicionar e remover Favoritos e confirmar a persistência após recarregar.
- [ ] Conferir contadores automáticos de Guias e Manuais.
- [ ] Conferir a ordem de Referências: Consultar Erros, FAQ, Links úteis e Glossário.

## Guias

- [ ] Confirmar que todos seguem a ordem padrão.
- [ ] Confirmar que seções opcionais sem conteúdo foram omitidas.
- [ ] Validar links internos e `Veja também`.
- [ ] Remover ou resolver `(PRINT DO CAMINHO AQUI)` antes de publicar como versão final.
- [ ] Validar pré-requisitos e avisos compartilhados.
- [ ] Confirmar que caixas semelhantes usam o mesmo tipo semântico.
- [ ] Não inventar prints ou passos operacionais.

## Base de erros

- [ ] Validar a sintaxe de `docs/assets/data/erros-comuns.json`.
- [ ] Confirmar que cada erro possui identificador único, `area`, `category` e todos os campos obrigatórios.
- [ ] Testar busca, filtro por categoria e abertura por link direto.
- [ ] Conferir contadores e agrupamento por área e categoria.
- [ ] Validar links relacionados cadastrados nos erros.
- [ ] Confirmar que erros citados nos Guias apontam para o registro correto.

## Manual

- [ ] Procurar por `A definir`.
- [ ] Procurar por textos reaproveitados de outra tela.
- [ ] Conferir caminhos no WCorp.
- [ ] Validar se campos principais e dúvidas frequentes são úteis.
- [ ] Revisar as sete páginas que ainda possuem somente título.

## Conteúdo

- [ ] Procurar termos antigos ou genéricos usados fora de contexto.
- [ ] Conferir ortografia de nomes fiscais: NF-e, CT-e, NFS-e, SEFAZ, CFOP, NCM.
- [ ] Confirmar que links externos abrem em nova aba quando apropriado.
- [ ] Conferir que não há informações fiscais inventadas.

## Visual

- [ ] Conferir Home em desktop.
- [ ] Conferir Home em tela menor.
- [ ] Conferir FAQ e Links úteis.
- [ ] Conferir se cards, sidebar e rodapé não quebram o layout.

## Contato

- [ ] Confirmar e-mail `suporte@waveconcept.com.br`.
- [ ] Confirmar link oficial do WhatsApp.
- [ ] Confirmar ausência de canais não oficiais no rodapé.
