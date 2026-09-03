# Checkpoint V1 - Central de Ajuda WCorp

Gerado em: 2026-08-29

Escopo: levantamento tecnico do estado atual do projeto, sem alteracao de produto.

## Resumo Executivo

| Status | Quantidade |
| --- | ---: |
| APROVADO | 2 |
| EM VALIDACAO | 10 |
| PENDENTE | 8 |
| BLOQUEADO | 3 |
| NAO INICIADO | 1 |

Observacao importante: `docker` e `mkdocs` nao estao disponiveis no PATH deste ambiente no momento do checkpoint. Existe `site/404.html` e `site/search/search_index.json` gerados, mas o build real atual do MkDocs via ambiente oficial ainda precisa ser executado antes do congelamento V1.

## Frentes

### 1. Validador XML

- STATUS: APROVADO
- Concluido: UX/UI fechada para V1; validador local evoluido para resultado mais util; viewer XML refinado; validacoes basicas de NF-e documentadas.
- Testes existentes: `tests/xml-validator/runner.html`, `tests/xml-validator/latest-results*.json`, `tests/xml-validator/AUDITORIA_VALIDADOR_XML.md`.
- Resultado conhecido mais recente: 47 PASS, 0 FAIL nos viewports `1366x768`, `1440x1000` e `1920x1080`.
- Pendencias: registrar claramente que o validador nao substitui validacao completa por XSD/MOC/SEFAZ.
- Bloqueios: nenhum para V1 dentro do escopo aprovado.
- Dependencias: manter fixtures XML representativas se o motor evoluir no pos-V1.
- Proxima acao recomendada: nao mexer na V1; planejar validacao fiscal completa no pos-V1, se necessario.

### 2. Indicador de Relatorios

- STATUS: APROVADO
- Concluido: motor auditado; regra `selected.every(...)` aprovada; UX/UI aprovada e congelada; nenhum match parcial escondido encontrado.
- Testes existentes: `tests/report-indicator/runner.html`, `tests/report-indicator/latest-results.json`, `tests/report-indicator/AUDITORIA_INDICADOR_RELATORIOS.md`.
- Resultado conhecido mais recente: suite funcional com 18 PASS, 0 FAIL; equivalencia estrutural com catalogo PASS.
- Pendencias: nenhuma correcao de motor/UX para V1.
- Bloqueios: nenhum.
- Dependencias: catalogo operacional futuro para confirmar informacoes de relatorios.
- Proxima acao recomendada: nao alterar ate a fonte operacional real ser fornecida.

### 3. Catalogo do Indicador

- STATUS: EM VALIDACAO
- Concluido: `docs/assets/data/report-indicator-catalog.json` criado como catalogo independente; 65 relatorios, 34 filtros e 482 associacoes migradas do mapeamento atual.
- Testes existentes: equivalencia registrada em `tests/report-indicator/latest-results.json`.
- Resultado conhecido mais recente: catalogo equivalente ao JS atual; 482 associacoes `nao_confirmado`, 0 `confirmado`.
- Pendencias: validacao operacional independente contra fonte real do WCorp.
- Bloqueios: falta fonte de verdade operacional fornecida pela equipe.
- Dependencias: levantamento operacional real dos relatorios/telas.
- Proxima acao recomendada: manter como fonte auditavel em espera; nao fazer o Indicador consumir o JSON ainda.

### 4. Assistente WCorp

- STATUS: EM VALIDACAO
- Concluido: pipeline auditado; ranking e respostas locais refinadas em etapas anteriores; persistencia preservada; Assistente agora bloqueia estruturalmente Guias fora da V1 usando `content-catalog.json`.
- Testes existentes: `tests/assistant/runner.html`, `tests/assistant/latest-results.json`, `tests/assistant/AUDITORIA_ASSISTENTE.md`.
- Resultado conhecido mais recente: suite funcional atualizada em `2026-08-31` com 45 testes, 45 PASS e 0 FAIL; nenhum `invalidGuideMatches`. O runner completo ainda registra 6 FAIL de ancoragem visual do painel, frente conhecida e nao alterada nesta etapa.
- Pendencias: revalidar apos build real final e depois das decisoes editoriais sobre conteudos D; tratar ancoragem visual do painel em etapa propria, se ainda estiver pendente no ambiente real.
- Bloqueios: nenhum no motor atual.
- Dependencias: qualidade do `search_index.json` gerado pelo MkDocs e decisao sobre conteudos publicados.
- Proxima acao recomendada: congelar comportamento atual e reexecutar a suite apos build Docker/MkDocs final.

### 5. Guias

- STATUS: EM VALIDACAO
- Concluido: 38 arquivos em `docs/como-fazer/` auditados; 15 Guias V1 publicados com video valido; 23 conteudos retirados da publicacao V1 com `search.exclude: true`; cards, nav, catalogo, busca, Popular e Assistente alinhados a mesma regra.
- Testes existentes: `tests/content-migration/INVENTARIO_CONTEUDO.md`, `tests/content-migration/PLANO_MIGRACAO_B.md`, `tests/content-migration/VALIDACAO_MIGRADOR_ONDA_1.md`, `tests/content-convention/validate-guide-publication-v1.py`, `tests/content-convention/latest-guide-publication-v1.json`, `tests/content-migration/AUDITORIA_GUIAS_V1.md`.
- Resultado conhecido mais recente: validacao de publicacao dos Guias V1 PASS; 15 cards, 15 itens de nav e 15 Guias publicados no `content-catalog.json`; `mkdocs build` PASS.
- Pendencias: revisar editorialmente os Guias novos marcados como REVISAR; decidir conteudos D; migrar Classe B somente depois.
- Bloqueios: revisao operacional humana dos conteudos ainda pendentes.
- Dependencias: convencao V1 e revisao editorial humana.
- Proxima acao recomendada: validar visualmente os 15 Guias publicados no ambiente Docker/real antes do congelamento final.

### 6. Manuais

- STATUS: PENDENTE
- Concluido: 31 Manuais inventariados; navegacao superior de Manuais implementada; parte dos conteudos mapeada para migracao Classe B.
- Testes existentes: inventario e plano em `tests/content-migration/`.
- Resultado conhecido mais recente: existem conteudos Classe D criticos em Manuais, inclusive auditoria aprofundada de Comercial.
- Pendencias: revisar D2; decidir D1/D3/D4; validar navegacao em viewports reais; migrar apenas apos padrao V1 consolidado.
- Bloqueios: falta revisao operacional humana dos conteudos incompletos/suspeitos.
- Dependencias: respostas editoriais WCorp e build real.
- Proxima acao recomendada: preencher fichas D2 e decidir o que fica publicado na V1.

### 7. Convencao de Conteudo V1

- STATUS: EM VALIDACAO
- Concluido: convencao documentada em `docs/CONVENCAO_CONTEUDO.md`; `analytics_id` removido como identificador separado; pilotos com ID, relacionados por ID, assets e metadados.
- Testes existentes: `tests/content-convention/validate-content-metadata.mjs`, `tests/content-convention/latest-results.json`.
- Resultado conhecido mais recente: 2 conteudos adotados, 0 erros, 0 warnings; IDs unicos e relacionados resolvidos.
- Pendencias: build real do MkDocs/Docker e verificacao visual dos pilotos renderizados.
- Bloqueios: `mkdocs` e `docker` indisponiveis neste ambiente.
- Dependencias: ambiente oficial do projeto.
- Proxima acao recomendada: rodar `mkdocs build` via Docker/ambiente oficial e registrar aprovacao final antes de migrar mais conteudos.

### 8. Migracao Classe B

- STATUS: EM VALIDACAO
- Concluido: plano executavel criado para 32 conteudos Classe B; migrador com dry-run/staging preparado; Onda 1 gerada em `tests/content-migration/dry-run/`.
- Testes existentes: `tests/content-migration/PLANO_MIGRACAO_B.md`, `migration-plan-b.json`, `migrate-class-b.mjs`, `VALIDACAO_MIGRADOR_ONDA_1.md`.
- Resultado conhecido mais recente: Onda 1 - 5 arquivos staged, 1 PASS, 4 REVISAR; nenhum arquivo em `docs/` alterado.
- Pendencias: melhorar previsibilidade dos casos REVISAR ou aceitar revisao humana por onda.
- Bloqueios: padrao V1 ainda depende de build real.
- Dependencias: Convencao V1 aprovada e decisao editorial de relacionados Classe D.
- Proxima acao recomendada: apos build real, repetir dry-run por onda e revisar diffs antes de tocar em `docs/`.

### 9. Conteudos Classe D

- STATUS: PENDENTE
- Concluido: 21 conteudos auditados; checklist editorial e fichas preenchiveis criados; decisao proposta para D1/D3/D4.
- Testes existentes: `AUDITORIA_CLASSE_D.md`, `CHECKLIST_EDITORIAL_D.md`, `RESPOSTAS_EDITORIAIS_D2.md`, `DECISAO_D1_D3_D4.md`, `AUDITORIA_COMERCIAL_CRITICA.md`.
- Resultado conhecido mais recente: D1=1, D2=15, D3=4, D4=1.
- Pendencias: preencher respostas D2 olhando o WCorp real; decidir publicacao/remocao/draft dos 6 conteudos D1/D3/D4.
- Bloqueios: requer conhecimento operacional humano.
- Dependencias: acesso ao ERP real e decisao editorial da equipe.
- Proxima acao recomendada: resolver primeiro D2 P0/P1 e tirar placeholders da navegacao/busca antes da V1.

### 10. FAQ

- STATUS: EM VALIDACAO
- Concluido: FAQ revitalizado e integrado a busca/Assistente; problemas de icone corrigidos em etapas anteriores.
- Testes existentes: coberto indiretamente por `tests/assistant/latest-results.json` e `tests/ui-final/AUDITORIA_UI_FINAL.md`.
- Resultado conhecido mais recente: auditoria final aponta problemas baixos: labels de resposta inconsistentes e HTML manual no Markdown.
- Pendencias: validacao visual real nos quatro viewports; eventual padronizacao de labels/HTML.
- Bloqueios: navegador real/MkDocs indisponiveis neste ambiente.
- Dependencias: auditoria visual final.
- Proxima acao recomendada: corrigir polimentos em lote depois do build real, se houver tempo.

### 11. Erros e Solucoes

- STATUS: EM VALIDACAO
- Concluido: base estruturada de rejeicoes NF-e existe; paginas individuais foram reestruturadas; houve refinamentos anteriores para priorizar rejeicoes especificas.
- Testes existentes: `tests/assistant/latest-results.json`, `docs/assets/data/nfe-rejeicoes.json`, `docs/assets/javascripts/wcorp-errors.js`.
- Resultado conhecido mais recente: suite atual do Assistente ainda tem FAIL em perguntas de rejeicao/erro especifico (`E01`, `E02`, `E03`, `R03`, `R04`); auditoria UI ainda classifica o hub como generico.
- Pendencias: polimento do hub e validacao visual real.
- Bloqueios: nenhum funcional confirmado.
- Dependencias: revisao UI final.
- Proxima acao recomendada: manter motor/conteudo; aplicar polimento visual leve se entrar no lote pre-V1.

### 12. Popular

- STATUS: PENDENTE
- Concluido: metadados de popularidade existem em `docs/assets/data/content-info.json` e scripts associados; Guias fora da V1 nao ficam mais marcados como populares nem aparecem em `shared/portal/mais-acessados.md`.
- Testes existentes: cobertura por `tests/content-convention/validate-guide-publication-v1.py`, busca/Assistente e auditorias de conteudo.
- Resultado conhecido mais recente: Popular esta consistente para a regra dos Guias V1; ainda pode depender das decisoes editoriais de Manuais/Classe D.
- Pendencias: alinhar Popular com decisoes Classe D e metadados V1 para conteudos que nao sao Guia.
- Bloqueios: decisao editorial de conteudos incompletos.
- Dependencias: tratamento Classe D.
- Proxima acao recomendada: revisar Popular somente apos decidir o que fica publicado na V1.

### 13. Analytics

- STATUS: NAO INICIADO
- Concluido: convencao definiu que `id` deve ser o identificador unico tambem para analytics/popular/assistente/testes.
- Testes existentes: validacao de metadados dos pilotos em `tests/content-convention/latest-results.json`.
- Resultado conhecido mais recente: nao ha auditoria ou suite especifica de Analytics.
- Pendencias: definir/validar coleta real, eventos, armazenamento e relatorio.
- Bloqueios: escopo funcional de Analytics ainda nao fechado.
- Dependencias: decisao de produto e ambiente de coleta.
- Proxima acao recomendada: deixar para pos-V1 ou especificar escopo minimo separadamente.

### 14. Home

- STATUS: PENDENTE
- Concluido: Home estilizada e integrada aos cards principais; tutorial/onboarding aplicado.
- Testes existentes: apontamentos em `tests/ui-final/AUDITORIA_UI_FINAL.md`.
- Resultado conhecido mais recente: bug historico continua registrado - ao clicar em Inicio estando no Inicio, pode surgir tela branca.
- Pendencias: investigar/corrigir navegacao instantanea/JS global sem mascarar com reload.
- Bloqueios: precisa reproducao em navegador real.
- Dependencias: build real e console do navegador.
- Proxima acao recomendada: tratar como item obrigatorio antes da V1.

### 15. Suporte

- STATUS: PENDENTE
- Concluido: pagina existe e esta integrada a navegacao.
- Testes existentes: auditoria UI final.
- Resultado conhecido mais recente: auditoria aponta icones textuais com aparencia provisoria.
- Pendencias: polimento visual e validacao responsiva.
- Bloqueios: nenhum tecnico confirmado.
- Dependencias: auditoria visual real.
- Proxima acao recomendada: aplicar ajuste visual em lote, se houver tempo antes da V1.

### 16. Links Uteis

- STATUS: PENDENTE
- Concluido: pagina existe e esta ligada a Home/navegacao.
- Testes existentes: `tests/ui-final/AUDITORIA_UI_FINAL.md`, `static-link-check.json`.
- Resultado conhecido mais recente: links internos auditados sem quebra; pagina tem duplicidade de icone externo e HTML manual extenso.
- Pendencias: limpeza visual/HTML manual e validacao real.
- Bloqueios: nenhum tecnico confirmado.
- Dependencias: lote de polimento UI.
- Proxima acao recomendada: corrigir se entrar no lote de baixo risco; nao bloquear V1 se links estiverem funcionais.

### 17. 404

- STATUS: PENDENTE
- Concluido: `site/404.html` existe.
- Testes existentes: `tests/ui-final/AUDITORIA_UI_FINAL.md`.
- Resultado conhecido mais recente: 404 ainda parece padrao de documentacao, com experiencia pobre para usuario final.
- Pendencias: criar pagina 404 WCorp com busca/voltar ao Inicio/atalhos.
- Bloqueios: nenhum tecnico confirmado.
- Dependencias: build MkDocs para validar output.
- Proxima acao recomendada: fazer antes da V1 se houver janela curta de polimento.

### 18. Busca

- STATUS: EM VALIDACAO
- Concluido: busca local e ranking refinados; `site/search/search_index.json` existe; busca e Assistente agora filtram estruturalmente Guias fora da V1.
- Testes existentes: `tests/assistant/latest-results.json`, `docs/assets/javascripts/wcorp-search.js`, `wcorp-search-utils.js`.
- Resultado conhecido mais recente: `mkdocs build` PASS; `validate-guide-publication-v1.py` PASS; suite funcional do Assistente 45 PASS e 0 FAIL; nenhum Guia fora da V1 presente como pagina indexada.
- Pendencias: garantir que paginas ocultas/draft/Classe D indevidas fora do escopo Guia nao entrem no indice final.
- Bloqueios: nenhum para a regra dos Guias V1.
- Dependencias: decisoes editoriais e build real.
- Proxima acao recomendada: reexecutar busca/Assistente apos retirar ou ocultar conteudos que nao entram na V1.

### 19. Navegacao

- STATUS: EM VALIDACAO
- Concluido: menu lateral, navegacao superior dos Manuais e submenu estilo ERP foram implementados/refinados.
- Testes existentes: auditoria UI final.
- Resultado conhecido mais recente: risco medio de corte em modulos longos e foco/scroll horizontal a validar.
- Pendencias: validacao visual em `390x844`, `1366x768`, `1440x1000`, `1920x1080`.
- Bloqueios: navegador real/MkDocs indisponiveis neste ambiente.
- Dependencias: build real e screenshots.
- Proxima acao recomendada: validar antes do congelamento UI.

### 20. Responsividade

- STATUS: BLOQUEADO
- Concluido: XML e Assistente possuem metricas por viewport; UI geral tem auditoria estatica.
- Testes existentes: `tests/xml-validator/latest-results-*.json`, `tests/assistant/latest-results.json`, `tests/ui-final/AUDITORIA_UI_FINAL.md`.
- Resultado conhecido mais recente: validacao visual geral nos quatro viewports ficou bloqueada pelo ambiente.
- Pendencias: testar Home, Guia, Manual, FAQ, Erros, Referencias, Suporte, Links Uteis e 404 em navegador real.
- Bloqueios: Docker/MkDocs/navegador funcional indisponiveis para auditoria real neste ambiente.
- Dependencias: ambiente oficial de build/teste.
- Proxima acao recomendada: desbloquear ambiente e capturar screenshots comparativas.

### 21. Testes Automatizados

- STATUS: EM VALIDACAO
- Concluido: suites existem para Assistente, Indicador, XML, convencao de conteudo e migracao.
- Testes existentes: diretorios `tests/assistant/`, `tests/report-indicator/`, `tests/xml-validator/`, `tests/content-convention/`, `tests/content-migration/`, `tests/ui-final/`.
- Resultado conhecido mais recente: Assistente 36/45 funcional e 6/6 ancoragem no runner; Indicador 18/18 funcionais e equivalencia PASS; XML 47/47; Convencao 2 conteudos sem erro; Migrador Onda 1 com revisoes.
- Pendencias: consolidar comando unico de validacao e executar em ambiente limpo.
- Bloqueios: build real e dependencias locais ausentes.
- Dependencias: Docker/MkDocs/Node/navegador conforme suite.
- Proxima acao recomendada: criar checklist de release com comandos exatos apos ambiente real.

### 22. Build MkDocs

- STATUS: BLOQUEADO
- Concluido: estrutura do projeto possui `mkdocs.yml`, `Dockerfile`, `docker-compose.yml` e `requirements.txt`; existe build gerado em `site/`.
- Testes existentes: verificacao local mostrou `site/search/search_index.json` e `site/404.html`.
- Resultado conhecido mais recente: `mkdocs --version` falha porque `mkdocs` nao esta no PATH.
- Pendencias: executar `mkdocs build` no ambiente oficial/Docker e validar output atual.
- Bloqueios: MkDocs indisponivel diretamente neste ambiente.
- Dependencias: Docker ou instalacao local do ambiente Python do projeto.
- Proxima acao recomendada: rodar build pelo Docker/terminal do projeto antes de qualquer aprovacao final.

### 23. Docker

- STATUS: BLOQUEADO
- Concluido: arquivos Docker existem no repositorio.
- Testes existentes: verificacao direta `docker --version`.
- Resultado conhecido mais recente: comando falha porque `docker` nao esta reconhecido no PATH.
- Pendencias: confirmar Docker Desktop/engine no ambiente real do usuario.
- Bloqueios: Docker indisponivel neste shell.
- Dependencias: Docker instalado/iniciado ou alternativa oficial de build.
- Proxima acao recomendada: usuario subir via terminal com Docker Compose e compartilhar resultado/log se falhar.

### 24. Preparacao Para Producao

- STATUS: PENDENTE
- Concluido: varias frentes funcionais estao maduras; auditorias e planos estao documentados.
- Testes existentes: conjunto em `tests/`.
- Resultado conhecido mais recente: motores principais estao fortes, mas build real, responsividade geral, Home bug e conteudos editoriais ainda impedem congelamento total.
- Pendencias: build real, revisao Classe D, decisao de publicacao/busca, auditoria visual final e checklist de release.
- Bloqueios: Docker/MkDocs indisponiveis neste ambiente.
- Dependencias: ambiente oficial e revisao humana WCorp.
- Proxima acao recomendada: seguir caminho critico abaixo.

## Caminho Critico Para V1

### Obrigatorio Para V1

1. Desbloquear ambiente oficial: Docker/MkDocs funcionando.
2. Executar build real do MkDocs e confirmar `search_index.json`, assets, paginas e console sem erros.
3. Validar visualmente os viewports `390x844`, `1366x768`, `1440x1000` e `1920x1080`.
4. Corrigir o bug da Home ao clicar em Inicio estando na Home.
5. Resolver decisao editorial minima dos Classe D que nao devem aparecer na V1.
6. Garantir que conteudos removidos/draft nao aparecam na navegacao, busca, Assistente ou Popular.
7. Reexecutar suites principais: Assistente, Indicador, XML, convencao de conteudo e busca.

### Desejavel Para V1

1. Melhorar pagina 404 com identidade WCorp.
2. Polir Suporte, Links Uteis, FAQ e hub de Erros e Solucoes.
3. Validar corte/scroll/foco da navegacao superior de Manuais.
4. Rodar dry-run adicional da migracao Classe B em mais uma onda, sem aplicar em `docs/`.
5. Consolidar um checklist de release com comandos e evidencias.

### Pode Ficar Para Pos-V1

1. Analytics completo.
2. Confirmacao operacional das 482 associacoes do catalogo do Indicador.
3. Migracao completa dos 32 conteudos Classe B.
4. Reescrita editorial profunda dos 15 conteudos D2.
5. Validacao fiscal completa do XML por XSD/MOC/SEFAZ.

## Principais Riscos Para Lancamento

1. Ambiente de build oficial ainda nao validado neste checkpoint.
2. Bug da Home com tela branca ainda registrado.
3. Conteudos Classe D podem contaminar navegacao, busca, Assistente e Popular se nao houver decisao antes da V1.
4. Responsividade geral ainda nao foi confirmada visualmente nos quatro viewports solicitados.
5. Catalogo do Indicador esta estruturalmente equivalente, mas ainda nao validado contra fonte operacional real.
