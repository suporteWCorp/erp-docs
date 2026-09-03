# Diagnostico de Runtime do Assistente WCorp

Data: 2026-08-30

## Escopo

Investigacao do caso em que o navegador real retornou:

```js
document.querySelector(".wc-assistant__panel")?.getBoundingClientRect()
// width: 0, height: 0
```

Sem alterar novamente a geometria de posicionamento do Assistente.

## Cadeia de arquivos

Fonte declarada no MkDocs:

- CSS: `docs/assets/stylesheets/assistant.css`
- JS: `docs/assets/javascripts/wcorp-assistant.js`

O `mkdocs.yml` referencia diretamente:

- `assets/stylesheets/assistant.css`
- `assets/javascripts/wcorp-assistant.js`

O build local com `.tools/python/python.exe -m mkdocs build` terminou sem erro e sincronizou:

- `docs/assets/javascripts/wcorp-assistant.js`
- `site/assets/javascripts/wcorp-assistant.js`
- `docs/assets/stylesheets/assistant.css`
- `site/assets/stylesheets/assistant.css`

## Divergencia encontrada na porta 8000

Antes da validacao real, foi identificado que `http://127.0.0.1:8000/erp-docs/assets/javascripts/wcorp-assistant.js` entregava um arquivo antigo:

- Hash HTTP em `8000`: `E0479836785D14E8C7F4639AA66D7B2CEB54255226401A4C18EF7A3193458AB1`
- Hash atual em `docs/` e `site/`: `364DDC77A7E679441A0006929BDF8C2C557D78FD4A9CA1BFEEC405C5A6D54786`
- Header HTTP em `8000`: `WSGIServer/0.2 CPython/3.11.14`
- Python local usada pelo projeto neste ambiente: `3.12.4`

Conclusao: a porta `8000` estava servindo outro runtime/copia antiga do JS. Isso explica por que uma correcao feita em `docs/` podia nao aparecer no navegador real apontando para `8000`.

Apos encerrar os servidores temporarios abertos nesta auditoria, a porta `8000` continuou respondendo:

```text
8000 responds
HAS_DEBUG=False
SERVER=WSGIServer/0.2, CPython/3.11.14
```

Isso confirma que `8000` nao era o servidor temporario desta validacao e permanece entregando uma versao antiga do Assistente.

## Porta correta de validacao

Foi iniciado um servidor temporario em:

```text
http://127.0.0.1:8017/erp-docs/
```

Nesse servidor:

- Header HTTP: `WSGIServer/0.2 CPython/3.12.4`
- Hash HTTP do JS: `364DDC77A7E679441A0006929BDF8C2C557D78FD4A9CA1BFEEC405C5A6D54786`
- `window.__WC_ASSISTANT_DEBUG__.version`: `dom-audit-2026-08-30`

## Por que o painel retornou 0x0

Quando o Assistente esta fechado, o painel possui:

```text
panel.hidden = true
display = none
rect = 0x0
button aria-expanded = false
bubble aria-expanded = false
```

Portanto, `getBoundingClientRect()` retornar `0x0` e esperado para o painel fechado.

Se visualmente o chat parecer aberto, mas o console retornar `panel.hidden === true`, entao o navegador nao esta medindo o runtime atualizado/mesma instancia. No teste real com o JS correto, quando aberto, o painel sempre ficou com geometria real.

## Instancias

Em todos os passos do ciclo testado:

```text
assistants = 1
panels = 1
launchers = 1
panelIds = 1
```

Nao foi confirmada duplicidade de instancias no runtime correto.

## Navigation.instant

`initializeAssistant()` foi chamado mais de uma vez por causa de `document$.subscribe`, mas a guarda existente funcionou:

```text
Home: initializeCalls = 2, skippedExistingInstances = 1
Manual: initializeCalls = 3, skippedExistingInstances = 2
Guia: initializeCalls = 4, skippedExistingInstances = 3
Voltar: initializeCalls = 5, skippedExistingInstances = 4
```

Conclusao: no runtime correto, `navigation.instant` nao gerou duplicidade nem stale DOM conectado. Ele apenas reexecutou a inicializacao e a instancia existente foi preservada.

## Geometria real do painel aberto

| Viewport | Estado | Instancias | Panel | Button | horizontalDelta | verticalGap |
| --- | --- | ---: | --- | --- | ---: | ---: |
| 390x844 | aberto | 1 | 340x500 | 60x60 | 0px | 11px a 12px |
| 1366x768 | aberto | 1 | 300x480 | 65x65 | 0px | 11px a 12px |
| 1440x1000 | aberto | 1 | 300x480 | 65x65 | 0px | 11px a 12px |
| 1920x1080 | aberto | 1 | 300x480 | 71.5x71.5 | 0.09px | 11.41px a 12.41px |

## Ciclo testado

1. Carregar Home.
2. Abrir Assistente.
3. Fechar Assistente.
4. Navegar para Manual.
5. Abrir Assistente.
6. Navegar para Guia.
7. Conferir Assistente aberto.
8. Voltar no navegador.
9. Conferir Assistente aberto.

Resultado: PASS para DOM/estado/ancoragem no runtime correto.

## Suite funcional

Runner executado via HTTP em:

```text
http://127.0.0.1:8020/tests/assistant/runner.html
```

Resultado atual:

```text
Total: 45
PASS: 36
FAIL: 9
```

Observacao: nao foi feita correcao de ranking ou busca nesta etapa, porque o escopo era diagnosticar DOM/estado/ancoragem do Assistente.

## Conclusao

O `panel 0x0` medido anteriormente tem duas causas possiveis, separadas:

1. Estado fechado normal: `panel.hidden = true` e `display: none`.
2. Runtime errado/stale: a porta `8000` estava entregando um `wcorp-assistant.js` antigo, diferente dos arquivos atuais em `docs/` e `site/`.

No runtime correto, nao foi encontrado:

- duplicidade de `.wc-assistant`;
- duplicidade de `.wc-assistant__panel`;
- duplicidade de `#wc-assistant-panel`;
- stale DOM conectado;
- falha de `navigation.instant`;
- painel aberto com `rect 0x0`.

Proxima acao recomendada: encerrar o processo que esta ocupando/servindo a porta `8000` e subir novamente o Docker/servidor oficial a partir do repositório atual. Depois, confirmar no DevTools:

```js
window.__WC_ASSISTANT_DEBUG__?.version
window.__WC_ASSISTANT_DOM_AUDIT__?.()
```

O valor esperado de `version` e:

```text
dom-audit-2026-08-30
```
