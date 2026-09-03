# Auditoria tecnica do Validador de XML WCorp

Data da auditoria: 2026-08-28

## 1. RESUMO EXECUTIVO

Foi criada e executada uma suite reproduzivel para validar o motor atual do Validador de XML usando o mesmo fluxo da interface: preencher XML, clicar em Validar XML, aguardar renderizacao, ler resultado, acionar botoes e interacoes.

Resultado consolidado nos viewports 1366x768, 1440x1000 e 1920x1080:

| Total de testes | Pass | Fail | Nao suportado |
| --- | ---: | ---: | ---: |
| 47 | 47 | 0 | 0 |

Conclusao: a versao esta consistente para validacoes locais basicas de NF-e, totalizadores objetivos, extracao de identificacao e interacoes principais. Ainda nao deve ser apresentada como validacao fiscal completa, pois nao executa XSD/MOC completo nem regras contextuais de CST/CSOSN/CFOP/UF. O bug A06 foi corrigido: `nItem` duplicado continua sendo detectado, agora na categoria `Itens`.

## 2. ARQUIVOS ALTERADOS/CRIADOS

Criados:

| Arquivo | Finalidade |
| --- | --- |
| `tests/xml-validator/fixtures/base-nfe.xml` | Fixture NF-e 4.00 base para mutacoes controladas. |
| `tests/xml-validator/runner.html` | Runner browser que chama o mesmo motor usado pela interface. |
| `tests/xml-validator/latest-results.json` | Resultado principal da ultima execucao em 1440x1000. |
| `tests/xml-validator/latest-results-1366x768.json` | Resultado da execucao em 1366x768. |
| `tests/xml-validator/latest-results-1440x1000.json` | Resultado da execucao em 1440x1000. |
| `tests/xml-validator/latest-results-1920x1080.json` | Resultado da execucao em 1920x1080. |
| `tests/xml-validator/AUDITORIA_VALIDADOR_XML.md` | Este relatorio. |

Arquivos do produto alterados nesta etapa:

| Arquivo | Observacao |
| --- | --- |
| `docs/assets/javascripts/wcorp-tools.js` | Corrigida a categoria de integridade de `nItem` e agrupada somente a apresentacao de verificacoes realizadas. |

Arquivos do produto nao alterados nesta etapa:

| Arquivo | Observacao |
| --- | --- |
| `docs/assets/stylesheets/cards.css` | Nao alterado. UX/UI visual permaneceu fechada. |

## 3. ARQUITETURA ATUAL DO VALIDADOR

Motor principal: `docs/assets/javascripts/wcorp-tools.js`.

Fluxo atual:

1. `initializeXmlValidator()` conecta os eventos da tela.
2. O botao `data-wc-xml-validate` captura o conteudo do textarea.
3. `DOMParser().parseFromString(content, "application/xml")` parseia o XML.
4. `parserErrorMessage()` identifica erro de parse.
5. `validateXmlDocument(xmlDocument, error)` executa o motor.
6. O motor cria uma analise com cinco categorias: Estrutura XML, Campos e formatos, Itens, Calculos, Totalizadores.
7. `validateXmlStructure()` decide se o documento e parseavel e se contem `infNFe`.
8. Se houver contexto NF-e, executa `validateXmlFields()`, `validateXmlItems()`, `validateXmlCalculations()` e `validateXmlTotals()`.
9. `finalizeXmlCategories()` marca categorias como validado, problema ou nao verificado.
10. A interface renderiza pipeline, documento identificado, inconsistencias, verificacoes e arvore XML.

O runner de testes carrega `wcorp-tools.js` diretamente e interage com os mesmos seletores da tela, sem duplicar a logica de validacao.

Atualizacao desta etapa: `analysis.checks` continua registrando todas as verificacoes reais. A camada `renderXmlChecks()` agrupa apenas a exibicao de verificacoes repetiveis por `validationKey`, sem reduzir a contagem interna.

## 4. LISTA COMPLETA DE REGRAS IMPLEMENTADAS

### ESTRUTURA XML

| Regra | Campos/elementos | Executa quando | Ignora quando | Severity | Categoria |
| --- | --- | --- | --- | --- | --- |
| XML bem-formado | documento inteiro | sempre apos parse | nunca | error se malformado | structure |
| Raiz identificada | `documentElement` | XML parseado | parse malformado | error se ausente | structure |
| Tipo NF-e suportado | descendente `infNFe` | raiz existe | parse malformado | warning se nao suportado | structure |
| Versao da NF-e | `infNFe/@versao` | `infNFe` existe | documento nao suportado | warning se ausente | structure |
| Namespace nacional | `root.namespaceURI` ou `infNFe.namespaceURI` | `infNFe` existe | documento nao suportado | warning se nao contem `portalfiscal.inf.br/nfe` | structure |
| Documento identificado | `infNFe`, `ide`, `emit`, `dest`, `infProt` | `infNFe` existe | documento nao suportado | sem issue | informativo |

### CAMPOS E FORMATOS

| Regra | Campos/elementos | Executa quando | Ignora quando | Severity | Categoria |
| --- | --- | --- | --- | --- | --- |
| CPF/CNPJ valido | todos `CNPJ` e `CPF` dentro de `infNFe` | elemento existe | elemento ausente | error | fields |
| CEP com 8 digitos | todos `CEP` dentro de `infNFe` | elemento existe | elemento ausente | warning | fields |
| UF brasileira | todos `UF` dentro de `infNFe` | elemento existe | elemento ausente | warning | fields |
| Data ISO basica | `dhEmi`, `dEmi` | elemento existe | elemento ausente | warning | fields |
| Campos numericos | `cUF`, `cNF`, `mod`, `serie`, `nNF`, `tpNF`, `idDest`, `cMunFG`, `tpImp`, `tpEmis`, `cDV`, `tpAmb`, `finNFe`, `indFinal`, `indPres`, `procEmi`, `vNF`, `vTotTrib`, `qCom`, `vUnCom`, `vProd`, `qTrib`, `vUnTrib`, `vFrete`, `vSeg`, `vDesc`, `vOutro`, `vBC`, `pICMS`, `vICMS`, `vBCST`, `vST`, `vIPI`, `vPIS`, `vCOFINS` | campo existe, e folha, e possui texto | campo ausente ou vazio | error | fields |
| Grupo `prod` presente | `det/prod` | cada `det` | nenhum `det` | error | fields |
| `ICMSTot` presente | `total/ICMSTot` | `infNFe` existe | documento nao suportado | error | fields |

### ITENS

| Regra | Campos/elementos | Executa quando | Ignora quando | Severity | Categoria |
| --- | --- | --- | --- | --- | --- |
| `nItem` unico e presente | `det/@nItem` | cada `det` | nenhum `det` | error | items |
| Valor de produto por item | `det/prod/qCom`, `det/prod/vUnCom`, `det/prod/vProd` | os tres campos sao numericos no item | qualquer um ausente ou nao numerico | warning | items |

### CALCULOS

| Regra | Campos/elementos | Executa quando | Ignora quando | Severity | Categoria |
| --- | --- | --- | --- | --- | --- |
| ICMS00 direto | `det/imposto/ICMS/ICMS00/vBC`, `pICMS`, `vICMS` | grupo `ICMS00` possui os tres campos numericos | outros CST/grupos ou campo ausente | warning | calculations |

### TOTALIZADORES

| Regra | Campo total | Origem da soma | Executa quando | Ignora quando | Severity | Categoria |
| --- | --- | --- | --- | --- | --- | --- |
| Total dos produtos | `ICMSTot/vProd` | `det/prod/vProd` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total da BC do ICMS | `ICMSTot/vBC` | `det/imposto/ICMS/**/vBC` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do ICMS | `ICMSTot/vICMS` | `det/imposto/ICMS/**/vICMS` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total da BC ICMS-ST | `ICMSTot/vBCST` | `det/imposto/ICMS/**/vBCST` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do ICMS-ST | `ICMSTot/vST` | `det/imposto/ICMS/**/vST` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do IPI | `ICMSTot/vIPI` | `det/imposto/IPI/**/vIPI` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do PIS | `ICMSTot/vPIS` | `det/imposto/PIS/**/vPIS` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do COFINS | `ICMSTot/vCOFINS` | `det/imposto/COFINS/**/vCOFINS` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do frete | `ICMSTot/vFrete` | `det/prod/vFrete` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do seguro | `ICMSTot/vSeg` | `det/prod/vSeg` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total do desconto | `ICMSTot/vDesc` | `det/prod/vDesc` | total existe e e numerico | total ausente ou nao numerico | error | totals |
| Total de outras despesas | `ICMSTot/vOutro` | `det/prod/vOutro` | total existe e e numerico | total ausente ou nao numerico | error | totals |

## 5. FORMULAS E TOLERANCIAS

| Area | Formula | Arredondamento | Tolerancia |
| --- | --- | --- | --- |
| Item | `vProd esperado = qCom * vUnCom` | `Math.round(valor * 100)` | ate 1 centavo sem issue |
| ICMS00 | `vICMS esperado = vBC * pICMS / 100` | `Math.round(valor * 100)` | ate 1 centavo sem issue |
| Totalizadores | `total esperado = soma dos valores dos itens em centavos` | cada valor somado com `Math.round(valor * 100)` | ate 1 centavo sem issue |

Observacao: a diferenca exatamente igual a 1 centavo nao gera inconsistencia. Apenas diferenca maior que 1 centavo gera issue.

## 6. MATRIZ DE TOTALIZADORES

| Total | Origem da soma | Implementado | Testado | Resultado |
| --- | --- | --- | --- | --- |
| `vProd` | `det/prod/vProd` | SIM | SIM | PASS |
| `vBC` | `det/imposto/ICMS/**/vBC` | SIM | SIM | PASS |
| `vICMS` | `det/imposto/ICMS/**/vICMS` | SIM | SIM | PASS |
| `vBCST` | `det/imposto/ICMS/**/vBCST` | SIM | SIM | PASS |
| `vST` | `det/imposto/ICMS/**/vST` | SIM | SIM | PASS |
| `vIPI` | `det/imposto/IPI/**/vIPI` | SIM | SIM | PASS |
| `vPIS` | `det/imposto/PIS/**/vPIS` | SIM | SIM | PASS |
| `vCOFINS` | `det/imposto/COFINS/**/vCOFINS` | SIM | SIM | PASS |
| `vFrete` | `det/prod/vFrete` | SIM | SIM | PASS |
| `vSeg` | `det/prod/vSeg` | SIM | SIM | PASS |
| `vDesc` | `det/prod/vDesc` | SIM | SIM | PASS |
| `vOutro` | `det/prod/vOutro` | SIM | SIM | PASS |

## 7. RESULTADOS COMPLETOS DOS TESTES

| ID | Caso | Esperado | Obtido | Status |
| --- | --- | --- | --- | --- |
| A01 | XML normal sem inconsistencias conhecidas | 0 inconsistencias | 0 inconsistencia(s); nenhuma; 2611ms | PASS |
| A02 | XML malformado | erro de estrutura e dependentes nao verificadas | 1 inconsistencia(s); XML malformado; 2633ms | PASS |
| A03 | raiz/tipo incompatível | comportamento controlado sem crash | 1 inconsistencia(s); Tipo de documento nao suportado; 2633ms | PASS |
| A04 | CNPJ invalido | problema em campos e formatos | 1 inconsistencia(s); CNPJ com formato invalido; 2626ms | PASS |
| A05 | campo numerico invalido | problema de campo numerico | 2 inconsistencia(s); Campo vProd nao numerico; Total dos produtos divergente; 2641ms | PASS |
| A06 | nItem duplicado | problema em Itens | 1 inconsistencia(s); nItem duplicado: 1; 2635ms | PASS |
| A07 | qCom x vUnCom divergente | problema em calculo do item | 1 inconsistencia(s); Item 1 com vProd divergente; 2628ms | PASS |
| A08 | vProd total divergente | total vProd divergente | 1 inconsistencia(s); Total dos produtos divergente; 2627ms | PASS |
| A09 | vBC divergente | total vBC divergente | 1 inconsistencia(s); Total da BC do ICMS divergente; 2628ms | PASS |
| A10 | vICMS divergente | total vICMS divergente | 1 inconsistencia(s); Total do ICMS divergente; 2633ms | PASS |
| A11 | vBCST divergente | total vBCST divergente | 1 inconsistencia(s); Total da BC ICMS-ST divergente; 2632ms | PASS |
| A12 | vST divergente | total vST divergente | 1 inconsistencia(s); Total do ICMS-ST divergente; 2634ms | PASS |
| A13 | vIPI divergente | total vIPI divergente | 1 inconsistencia(s); Total do IPI divergente; 2628ms | PASS |
| A14 | vPIS divergente | total vPIS divergente | 1 inconsistencia(s); Total do PIS divergente; 2633ms | PASS |
| A15 | vCOFINS divergente | total vCOFINS divergente | 1 inconsistencia(s); Total do COFINS divergente; 2637ms | PASS |
| A16 | vFrete divergente | total vFrete divergente | 1 inconsistencia(s); Total do frete divergente; 2626ms | PASS |
| A17 | vSeg divergente | total vSeg divergente | 1 inconsistencia(s); Total do seguro divergente; 2640ms | PASS |
| A18 | vDesc divergente | total vDesc divergente | 1 inconsistencia(s); Total do desconto divergente; 2635ms | PASS |
| A19 | vOutro divergente | total vOutro divergente | 1 inconsistencia(s); Total de outras despesas divergente; 2634ms | PASS |
| R01 | arredondamento dentro da tolerancia | sem falso positivo por precisao | 0 inconsistencia(s); nenhuma; 2625ms | PASS |
| R02 | diferenca exatamente no limite | sem problema com 1 centavo | 0 inconsistencia(s); nenhuma; 2634ms | PASS |
| R03 | diferenca acima do limite | problema acima de 1 centavo | 1 inconsistencia(s); Item 1 com vProd divergente; 2634ms | PASS |
| M01 | 1 item | 0 inconsistencias | 0 inconsistencia(s); nenhuma; 2627ms | PASS |
| M02 | 2 itens | 0 inconsistencias | 0 inconsistencia(s); nenhuma; 2629ms | PASS |
| M10 | 12 itens | 0 inconsistencias | 0 inconsistencia(s); nenhuma; 2632ms | PASS |
| M11 | somente item 7 inconsistente | identificar apenas nItem 7 | 2 inconsistencia(s); Item 7 com vProd divergente; Total dos produtos divergente; 2644ms | PASS |
| MP01 | multiplos problemas independentes | todos os problemas independentes aparecem | 3 inconsistencia(s); Item 1 com vProd divergente; Total dos produtos divergente; Total do IPI divergente; 2638ms | PASS |
| FP01 | falso positivo base simples | 0 errors/warnings | 0 inconsistencia(s); nenhuma; 2628ms | PASS |
| FP02 | falso positivo nfeProc com protocolo | 0 errors/warnings | 0 inconsistencia(s); nenhuma; 2626ms | PASS |
| FP03 | falso positivo arredondamento | 0 errors/warnings | 0 inconsistencia(s); nenhuma; 2627ms | PASS |
| CTX01 | ICMS20 sem calculo tributario direto | sem falso positivo em calculo contextual | 0 inconsistencia(s); nenhuma; 2629ms | PASS |
| DOC01 | Documento identificado nfeProc | campos principais extraidos | Tipo, numero, serie, emissao, operacao, ambiente, protocolo, emitente, destinatario, chave formatada e natureza extraidos | PASS |
| CPY01 | Botoes copiar | valores corretos, chave sem espacos e feedback | 10 copias; chave=35260811222333000181550010000000011000000010; copied=10 | PASS |
| CPY02 | Copiar por teclado | botao focavel e acionavel | active=true; copied=1 | PASS |
| V01 | Agrupamento visual de CNPJ | contador preserva 2 CNPJs e UI mostra uma linha agrupada | 74 verificacoes concluidas; CNPJ analisado em 2 campos | PASS |
| V02 | Agrupamento visual de vProd em multiplos itens | UI nao mostra dezenas de linhas vProd repetidas | vProd numerico analisado em 12 itens; vProd numerico analisado | PASS |
| V03 | Uma ocorrencia sem sufixo de agrupamento | dhEmi analisada sem 'em 1 campo' | dhEmi analisada | PASS |
| V04 | Agrupamento nao esconde problema | linha agrupada aparece e inconsistencia individual permanece | CNPJ analisado em 2 campos; issue CNPJ com formato invalido | PASS |
| UI01 | Verificacoes realizadas recolhivel | recolhida por padrao e expande ao clique | beforeHidden=true; afterHidden=false; 74 verificacoes concluidas | PASS |
| LOC01 | Localizar problema em totalizador | highlight em linha do XML | highlight=1; paths=132 | PASS |
| LOC02 | Localizar problema em item | highlight em linha do XML | highlight=1; titles=Item 1 com vProd divergente | PASS |
| LOC03 | Localizar problema em campo | highlight em linha do XML | highlight=1; titles=CEP com formato inesperado | PASS |
| UI02 | Expandir/Recolher arvore | recolhe e expande nos | collapse=20; expand=0 | PASS |
| UI03 | Editar XML preserva conteudo | textarea preenchido e botao validar visivel | length=2878; validateHidden=false | PASS |
| UI04 | Selecionar arquivo XML | textarea recebe conteudo do arquivo | length=2885 | PASS |
| UI05 | Arrastar e soltar arquivo XML | textarea recebe conteudo do arquivo solto e dropzone limpa destaque | length=2885; active=false | PASS |
| PERF01 | XML grande 120 itens | sem travamento perceptivel | 2717ms; 0 inconsistencia(s); 6320 paths | PASS |

Execucoes por viewport:

| Viewport | Total | Pass | Fail | Nao suportado |
| --- | ---: | ---: | ---: | ---: |
| 1366x768 | 47 | 47 | 0 | 0 |
| 1440x1000 | 47 | 47 | 0 | 0 |
| 1920x1080 | 47 | 47 | 0 | 0 |

## 8. FALSOS POSITIVOS ENCONTRADOS

Nenhum falso positivo encontrado nos cenarios testados.

Cenarios sem inconsistencias nas regras suportadas:

| ID | Resultado |
| --- | --- |
| FP01 | NF-e base simples: 0 inconsistencias. |
| FP02 | `nfeProc` com protocolo: 0 inconsistencias. |
| FP03 | diferenca dentro da tolerancia de arredondamento: 0 inconsistencias. |
| CTX01 | ICMS20 sem calculo direto ICMS00: 0 inconsistencias. |

## 9. FALSOS NEGATIVOS ENCONTRADOS

Nenhum falso negativo de deteccao foi encontrado nas regras atualmente suportadas.

Observacao importante: A06 agora detecta `nItem duplicado` na categoria correta, `Itens`.

## 10. REGRAS NAO SUPORTADAS

Nao suportado pelo motor atual:

| Regra/Lacuna | Classificacao |
| --- | --- |
| Validacao oficial por XSD/schema NF-e | REGRA AUSENTE |
| Validacao completa MOC/SEFAZ por codigo de rejeicao | REGRA AUSENTE |
| Calculo completo de `vNF` | REGRA AUSENTE |
| Validacao de chave de acesso e digito verificador `cDV` | REGRA AUSENTE |
| Regras CST/CSOSN, CFOP, NCM, CEST, cBenef e UF | REGRA AUSENTE |
| Calculos de ICMS20, ICMS-ST, diferimento, desoneracao, Simples Nacional, FCP e DIFAL | REGRA AUSENTE |
| Calculos detalhados de PIS/COFINS/IPI por CST | REGRA AUSENTE |
| Validacao de obrigatoriedade condicional de campos opcionais | REGRA AUSENTE |
| Validacao de faixa, tamanho e casas decimais oficiais para todos os campos | REGRA AUSENTE |

## 11. RISCOS FISCAIS/CONTEXTUAIS IDENTIFICADOS

| Risco | Impacto | Classificacao |
| --- | --- | --- |
| Motor pode parecer mais completo do que realmente e | Usuario pode confiar como se fosse validador SEFAZ completo | RISCO CONTEXTUAL |
| `parseXmlDecimal()` aceita valores negativos | Campos monetarios/quantidades negativas podem passar onde nao deveriam | FALSO NEGATIVO POSSIVEL |
| Campos numericos validam formato, mas nao tamanho/faixa/casas oficiais | Codigos como `tpAmb`, `tpNF`, `mod`, `cUF` podem passar mesmo com valores fiscalmente invalidos | FALSO NEGATIVO POSSIVEL |
| Totalizadores somam por nome local dentro de grupos tributarios | Adequado para os XMLs testados, mas exige cuidado ao adicionar FCP/DIFAL/desoneracao para evitar somas indevidas | RISCO DE FUTURA REGRA |
| Calculo tributario so executa ICMS00 | Evita falso positivo em CST contextual, mas deixa muita coisa sem validar | LIMITACAO ATUAL |

## 12. PERFORMANCE

Teste grande executado com 120 itens.

| Medida | Resultado |
| --- | --- |
| Execucao end-to-end em 1440x1000 | 2717ms |
| Inconsistencias | 0 |
| Linhas/nos localizaveis na arvore | 6320 |
| Travamento perceptivel | Nao observado no headless |

Observacao: o tempo inclui fluxo de interface e pipeline visual. O motor interno nao esta exportado publicamente; por isso a auditoria evitou medir parse, validacao e renderizacao com uma implementacao paralela.

## 13. BUGS ENCONTRADOS

| Bug | Evidencia | Classificacao |
| --- | --- | --- |
| Nenhum bug pendente nos cenarios da suite atual | 47/47 PASS nos tres viewports testados. | - |

Correcao aplicada nesta etapa: a issue de `nItem` duplicado/ausente passou a usar a categoria `items`. A logica de deteccao, severity e mensagem foram preservadas.

## 14. LIMITACOES ATUAIS

1. O validador e um analisador local de sanidade de NF-e, nao um substituto de autorizacao SEFAZ.
2. Nao valida XML contra XSD oficial.
3. Nao cobre regras fiscais contextuais.
4. Nao cobre todos os grupos tributarios e variacoes de CST.
5. Nao valida obrigatoriedade condicional conforme finalidade, UF, regime ou produto.
6. Nao mede parse/validacao/renderizacao separadamente sem expor funcoes internas.
7. A suite usa fixture sintetica realista, nao XML autorizado real de cliente.

## 15. RECOMENDACOES PARA A PROXIMA ETAPA

1. Expor uma API interna de teste do motor, por exemplo `window.WCorpXmlValidator.validateXmlDocument`, sem mudar UI, para medir parse/validacao/render separadamente.
2. Adicionar fixtures anonimizadas de NF-e autorizadas reais.
3. Criar camada de regras fiscais versionadas, separando: schema, regras objetivas, regras contextuais e orientacoes WCorp.
4. Antes de implementar CST/CSOSN, documentar escopo por grupo tributario para evitar falso positivo.
5. Adicionar validacao de chave de acesso/cDV e formula de `vNF` como proximas regras objetivas de baixo risco.
