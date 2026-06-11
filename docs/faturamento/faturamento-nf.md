# Nota Fiscal

## Objetivo

Emitir nota fiscal de saída no ERP WCorp, de forma manual ou vinculada a pedidos.

![Tela principal de Nota Fiscal](../assets/faturamento-nf.png)

## Quando usar

Use esta rotina quando for necessário:

- Emitir uma nota fiscal de saída.
- Gerar nota a partir de um pedido.
- Cadastrar nota manualmente.
- Conferir impostos antes da transmissão.
- Transmitir a nota para a SEFAZ.

## Caminho no ERP

`Faturamento > Nota Fiscal`

## Passo a passo

1. Acesse a aba **Faturamento**.
2. Clique em **Nota Fiscal**.
3. No cadastro de nota fiscal de saída, escolha se a emissão será **manual** ou **por pedido**.

![Opções de emissão](../assets/faturamento-nf-manual-pedidos.png)

4. Se a emissão for por pedido, clique em `Pedidos/OS/Pedidos de Compra da NFe`.
5. Clique em **Adicionar Pedido**.
6. Selecione o pedido referente à NFe.
7. Salve a seleção.

![Adicionar pedido](../assets/faturamento-nf-add-pedido.png)

8. Confira os campos de imposto no material e na aba de impostos.
9. Caso falte algum campo obrigatório, o sistema informará ao tentar salvar.
10. Clique em **Transmitir** para enviar a nota à SEFAZ.

![Transmitir nota](../assets/faturamento-nf-transmitir.png)

!!! info "Dica"
    Quando a nota é gerada por pedido, o sistema já busca os impostos automaticamente com base na regra fiscal configurada.

## Campos principais

| Campo | Descrição | Observações |
| --- | --- | --- |
| Pedido | Documento de origem usado para gerar a nota | Usado quando a emissão é por pedido |
| Cliente | Destinatário da nota | Deve estar com cadastro completo |
| Materiais | Itens vinculados à nota | Conferir quantidade, valor e impostos |
| Impostos | Aba com os dados fiscais da emissão | Revisar antes de transmitir |
| Transmitir | Envia a nota para autorização | Usar após conferir os dados obrigatórios |

## Dúvidas Frequentes

| Dúvida | Orientação |
| --- | --- |
| Posso emitir nota manualmente? | Sim. A tela permite emissão manual ou por pedido. |
| Quando devo usar emissão por pedido? | Use quando a nota deve ser gerada a partir de um pedido já cadastrado. |
| O sistema informa se faltar algum campo? | Sim. Ao salvar ou transmitir, o ERP indica campos obrigatórios pendentes. |
| Preciso conferir impostos se vier do pedido? | Sim. Mesmo com cálculo automático, confira material e aba de impostos antes de transmitir. |

??? info "Ver mais para Suporte"

    ## Resultado esperado

    A nota fiscal deve ser salva e transmitida à SEFAZ, retornando status de autorização ou uma mensagem de rejeição para correção.

    ## Orientação para Suporte

    Ao atender problemas em **Faturamento > Nota Fiscal**, colete:

    - Número da nota, pedido ou documento de origem.
    - Cliente envolvido.
    - Natureza de operação e CFOP, se aplicável.
    - Mensagem completa exibida pelo ERP ou pela SEFAZ.
    - Print da tela, principalmente da aba de impostos.
    - Informação se a emissão é manual ou por pedido.

    Classifique o caso antes de encaminhar:

    | Situação | Possível causa | Ação inicial |
    | --- | --- | --- |
    | Campo obrigatório pendente | Cadastro incompleto ou regra fiscal sem informação | Conferir campos destacados pelo sistema |
    | Rejeição da SEFAZ | Dados fiscais inconsistentes | Copiar retorno completo e validar cadastros fiscais |
    | Nota não transmite | Certificado, conexão ou dados fiscais | Verificar certificado e mensagem retornada |
    | Pedido não aparece | Status, filtro ou vínculo indisponível | Conferir pedido e situação comercial |
