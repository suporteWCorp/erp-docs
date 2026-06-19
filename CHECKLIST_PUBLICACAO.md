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

## Guias

- [ ] Confirmar que todos seguem a ordem padrão.
- [ ] Validar links internos e `Veja também`.
- [ ] Remover ou resolver `(PRINT DO CAMINHO AQUI)` antes de publicar como versão final.
- [ ] Validar pré-requisitos e avisos compartilhados.
- [ ] Não inventar prints ou passos operacionais.

## Manual

- [ ] Procurar por `A definir`.
- [ ] Procurar por textos reaproveitados de outra tela.
- [ ] Conferir caminhos no WCorp.
- [ ] Validar se campos principais e dúvidas frequentes são úteis.

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
