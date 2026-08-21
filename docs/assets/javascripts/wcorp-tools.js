(function () {
  const reportFields = [
    { id: "cliente", label: "Cliente" },
    { id: "material", label: "Material" },
    { id: "fornecedor", label: "Fornecedor" },
    { id: "funcionario", label: "Funcionário" },
    { id: "nota-fiscal", label: "Nota fiscal" },
    { id: "pedido", label: "Pedido" },
    { id: "orcamento", label: "Orçamento" },
    { id: "vendedor", label: "Vendedor" },
    { id: "quantidade", label: "Quantidade" },
    { id: "valor", label: "Valor" },
    { id: "data", label: "Data" },
    { id: "estoque", label: "Estoque" },
    { id: "comissao", label: "Comissão" },
    { id: "transportadora", label: "Transportadora" },
    { id: "contrato", label: "Contrato" },
    { id: "ordem-producao", label: "Ordem de produção" },
    { id: "ordem-servico", label: "Ordem de serviço" },
    { id: "servico", label: "Serviço" },
    { id: "documento", label: "Documento" },
    { id: "certificado", label: "Certificado" },
    { id: "financeiro", label: "Financeiro" },
    { id: "imposto", label: "Imposto" },
    { id: "cfop", label: "CFOP" }
  ];

  function report(id, category, name, fields, options = {}) {
    return {
      id,
      name,
      category,
      fields,
      location: options.location || `Relatórios > ${category} > ${name}`,
      pendingReview: Boolean(options.pendingReview)
    };
  }

  const pendingReportNames = [
    {
      category: "Financeiro",
      partialName: "Demonstrativo de Resultado Financeiro...",
      reason: "Nome final cortado na imagem do menu de relatórios."
    }
  ];

  const reports = [
    report("materiais-movimentacao-material", "Materiais", "Movimentação de Material", ["material", "quantidade", "estoque", "valor", "data"]),
    report("materiais-estoque-sintetico", "Materiais", "Estoque Sintético", ["material", "quantidade", "estoque"]),
    report("materiais-estoque-sintetico-relacionados", "Materiais", "Estoque Sintético com Materiais Relacionados", ["material", "quantidade", "estoque"]),
    report("materiais-estoque-analitico", "Materiais", "Estoque Analítico", ["material", "quantidade", "estoque", "valor", "data"]),
    report("materiais-estoque-minimo", "Materiais", "Estoque Mínimo", ["material", "quantidade", "estoque"]),
    report("materiais-inventario", "Materiais", "Material Inventário", ["material", "quantidade", "estoque", "data"]),
    report("materiais-custo-medio", "Materiais", "Custo Médio de Material", ["material", "valor", "data"]),
    report("materiais-historico-compras", "Materiais", "Material Histórico de Compras", ["material", "fornecedor", "pedido", "quantidade", "valor", "data"]),
    report("materiais-tabela-preco", "Materiais", "Tabela de Preço", ["material", "valor", "data"]),
    report("materiais-consumo-lotes", "Materiais", "Consumo Lotes", ["material", "quantidade", "estoque", "data"]),
    report("materiais-ficha-tecnica", "Materiais", "Ficha Técnica", ["material", "quantidade"]),

    report("contratos-ficha-sintetico", "Contratos", "Ficha de Contrato Sintético", ["contrato", "cliente", "valor", "data"]),
    report("contratos-ficha-analitico", "Contratos", "Ficha de Contrato Analítico", ["contrato", "cliente", "material", "servico", "quantidade", "valor", "data"]),
    report("contratos-fases", "Contratos", "Fases de Contrato", ["contrato", "data"]),
    report("contratos-fases-gantt", "Contratos", "Fases de Contrato - Gantt", ["contrato", "data"]),
    report("contratos-fases-planejado-realizado", "Contratos", "Fases Planejado x Realizado", ["contrato", "valor", "data"]),
    report("contratos-compras", "Contratos", "Contrato x Compras", ["contrato", "fornecedor", "pedido", "material", "valor", "data"]),
    report("contratos-fechamento-custo", "Contratos", "Fechamento de Custo", ["contrato", "financeiro", "valor", "data"]),

    report("op-sintetico", "Ordem de Produção", "Ordem de Produção Sintético", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-analitico", "Ordem de Produção", "Ordem de Produção Analítico", ["ordem-producao", "material", "quantidade", "valor", "data"]),
    report("op-diaria", "Ordem de Produção", "Ordem de Produção Diária", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-processo", "Ordem de Produção", "Ordem de Produção Processo", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-separacao-material", "Ordem de Produção", "Separação de Material", ["ordem-producao", "material", "quantidade", "estoque", "data"]),
    report("op-apontamento-sucatas-analitico", "Ordem de Produção", "Apontamento de Sucatas Analítico", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-apontamento-sucatas", "Ordem de Produção", "Apontamento de Sucatas", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-equipamento", "Ordem de Produção", "Ordem de Produção Equipamento", ["ordem-producao", "material", "data"]),
    report("op-entrada-nfe", "Ordem de Produção", "Entrada NFe x Ordem Produção", ["ordem-producao", "fornecedor", "material", "nota-fiscal", "quantidade", "valor", "data"]),
    report("op-equipamento-manutencao", "Ordem de Produção", "Equipamento Manutenção", ["ordem-producao", "valor", "data"]),
    report("op-equipamento-locacao", "Ordem de Produção", "Equipamento Locação", ["ordem-producao", "valor", "data"]),
    report("op-fluxo-manutencao-equipamento", "Ordem de Produção", "Fluxo de Manutenção de Equipamento", ["ordem-producao", "data"]),
    report("op-paletes", "Ordem de Produção", "Paletes", ["ordem-producao", "material", "quantidade", "data"]),
    report("op-forecast-consumo", "Ordem de Produção", "Forecast Consumo Ordem de Produção", ["ordem-producao", "material", "quantidade", "data"]),

    report("os-sintetico", "Ordem de Serviço", "Ordem de Serviço Sintético", ["ordem-servico", "cliente", "servico", "valor", "data"]),
    report("os-analitico", "Ordem de Serviço", "Ordem de Serviço Analítico", ["ordem-servico", "cliente", "servico", "material", "quantidade", "valor", "data"]),
    report("os-recebimento-sintetico", "Ordem de Serviço", "Ordem Serviço x Recebimento Sintético", ["ordem-servico", "cliente", "financeiro", "valor", "data"]),
    report("os-recebimento-analitico", "Ordem de Serviço", "Ordem Serviço x Recebimento Analítico", ["ordem-servico", "cliente", "servico", "financeiro", "valor", "data"]),
    report("os-servicos-realizados", "Ordem de Serviço", "Serviços Realizados", ["ordem-servico", "cliente", "servico", "valor", "data"]),
    report("os-recorrencia", "Ordem de Serviço", "Recorrência de Ordem de Serviço", ["ordem-servico", "cliente", "servico", "data"]),
    report("os-fatura-servico", "Ordem de Serviço", "Fatura por Serviço", ["ordem-servico", "cliente", "servico", "nota-fiscal", "valor", "data"]),

    report("vendas-orcamentos-sintetico", "Vendas", "Orçamentos Sintético", ["cliente", "orcamento", "vendedor", "valor", "data"]),
    report("vendas-orcamentos-analitico", "Vendas", "Orçamentos Analítico", ["cliente", "orcamento", "material", "quantidade", "vendedor", "valor", "data"]),
    report("vendas-pedidos-sintetico", "Vendas", "Pedidos Sintético", ["cliente", "pedido", "vendedor", "valor", "data"]),
    report("vendas-pedidos-analitico", "Vendas", "Pedidos Analítico", ["cliente", "pedido", "material", "quantidade", "vendedor", "valor", "data"]),
    report("vendas-lucratividade", "Vendas", "Vendas x Lucratividade", ["cliente", "material", "quantidade", "valor", "data"]),
    report("vendas-pedidos-caixa", "Vendas", "Pedidos Movimentação de Caixa", ["cliente", "pedido", "financeiro", "valor", "data"]),
    report("vendas-pedidos-disponiveis-faturamento", "Vendas", "Pedidos Disponíveis para Faturamento", ["cliente", "pedido", "material", "quantidade", "valor", "data"]),
    report("vendas-demonstrativo-mensal", "Vendas", "Demonstrativo de Vendas Mensal", ["cliente", "vendedor", "quantidade", "valor", "data"]),
    report("vendas-produtos-mais-vendidos", "Vendas", "Produtos mais Vendidos", ["material", "quantidade", "valor", "data"]),
    report("vendas-material-cliente", "Vendas", "Vendas de Material por Cliente", ["cliente", "material", "quantidade", "valor", "data"]),
    report("vendas-dia-hora", "Vendas", "Vendas por Dia/Hora", ["cliente", "vendedor", "quantidade", "valor", "data"]),
    report("vendas-demonstrativo-material", "Vendas", "Demonstrativo de Vendas por Material", ["material", "quantidade", "valor", "data"]),
    report("vendas-comissoes", "Vendas", "Comissões", ["vendedor", "comissao", "valor", "data"]),
    report("vendas-comissoes-recebimento", "Vendas", "Comissões por Recebimento", ["vendedor", "comissao", "financeiro", "valor", "data"]),
    report("vendas-fechamento-caixa", "Vendas", "Fechamento de Caixa", ["financeiro", "valor", "data"]),
    report("vendas-fechamento-caixa-dia-sintetico", "Vendas", "Fechamento de Caixa por Dia Sintético", ["financeiro", "valor", "data"]),
    report("vendas-fechamento-caixa-dia-analitico", "Vendas", "Fechamento de Caixa por Dia Analítico", ["financeiro", "valor", "data"]),
    report("vendas-pedidos-recebimento-sintetico", "Vendas", "Pedidos x Recebimento Sintético", ["cliente", "pedido", "financeiro", "valor", "data"]),
    report("vendas-pedidos-recebimento-analitico", "Vendas", "Pedidos x Recebimento Analítico", ["cliente", "pedido", "financeiro", "valor", "data"]),
    report("vendas-pedido-analitico-data-entrega", "Vendas", "Pedido Analítico por Data de Entrega", ["cliente", "pedido", "material", "quantidade", "valor", "data"]),
    report("vendas-pedido-ficha-tecnica", "Vendas", "Pedido x Ficha Técnica", ["cliente", "pedido", "material", "quantidade", "data"]),
    report("vendas-pedido-ordem-producao", "Vendas", "Pedido x Ordem Produção", ["cliente", "pedido", "ordem-producao", "material", "quantidade", "data"]),
    report("vendas-pedido-ordem-servico", "Vendas", "Pedido x Ordem Serviço", ["cliente", "pedido", "ordem-servico", "servico", "valor", "data"]),
    report("vendas-despacho", "Vendas", "Despacho", ["cliente", "pedido", "transportadora", "quantidade", "data"]),
    report("vendas-despacho-pedido", "Vendas", "Despacho por Pedido", ["cliente", "pedido", "transportadora", "quantidade", "data"]),
    report("vendas-cliente-mes", "Vendas", "Vendas por Cliente Mês a Mês", ["cliente", "quantidade", "valor", "data"]),
    report("vendas-vendedor-mes", "Vendas", "Vendas por Vendedor Mês a Mês", ["vendedor", "quantidade", "valor", "data"]),
    report("vendas-diarias-meio-pagamento", "Vendas", "Vendas Diárias por Meio de Pagamento", ["financeiro", "valor", "data"]),
    report("vendas-ranking-cliente", "Vendas", "Ranking de Vendas por Cliente", ["cliente", "quantidade", "valor", "data"]),
    report("vendas-devolucoes", "Vendas", "Devoluções", ["cliente", "pedido", "material", "quantidade", "valor", "data"]),
    report("vendas-clientes-nao-compraram", "Vendas", "Clientes que não Compraram", ["cliente", "data"]),

    report("faturamento-nota-fiscal-sintetico", "Faturamento", "Nota Fiscal Sintético", ["cliente", "nota-fiscal", "valor", "data"]),
    report("faturamento-nota-fiscal-analitico", "Faturamento", "Nota Fiscal Analítico", ["cliente", "material", "nota-fiscal", "quantidade", "valor", "data"]),
    report("faturamento-entrada-nota-sintetico", "Faturamento", "Entrada Nota Fiscal Sintético", ["fornecedor", "nota-fiscal", "valor", "data"]),
    report("faturamento-entrada-nota-analitico", "Faturamento", "Entrada Nota Fiscal Analítico", ["fornecedor", "material", "nota-fiscal", "quantidade", "valor", "data"]),
    report("faturamento-cupom-fiscal-sintetico", "Faturamento", "Cupom Fiscal Sintético", ["cliente", "valor", "data"]),
    report("faturamento-cupom-fiscal-analitico", "Faturamento", "Cupom Fiscal Analítico", ["cliente", "material", "quantidade", "valor", "data"]),
    report("faturamento-nfs-sintetico", "Faturamento", "Nota Fiscal Serviço Sintético", ["cliente", "servico", "nota-fiscal", "valor", "data"]),
    report("faturamento-nota-apuracao-impostos", "Faturamento", "Nota Fiscal Apuração de Impostos", ["cliente", "nota-fiscal", "imposto", "valor", "data"]),
    report("faturamento-apuracao-impostos-cfop", "Faturamento", "Apuração de Impostos por CFOP", ["imposto", "cfop", "valor", "data"]),
    report("faturamento-apuracao-impostos", "Faturamento", "Apuração de Impostos", ["imposto", "valor", "data"]),

    report("contas-pagar", "Contas a Pagar", "Contas a Pagar", ["fornecedor", "financeiro", "valor", "data"]),
    report("contas-pagar-centro-custo", "Contas a Pagar", "Contas a Pagar por Centro Custo", ["fornecedor", "financeiro", "valor", "data"]),

    report("contas-receber", "Contas a Receber", "Contas a Receber", ["cliente", "financeiro", "valor", "data"]),
    report("contas-receber-centro-custo", "Contas a Receber", "Contas a Receber por Centro Custo", ["cliente", "financeiro", "valor", "data"]),

    report("financeiro-fluxo-caixa", "Financeiro", "Fluxo de Caixa", ["financeiro", "valor", "data"]),
    report("financeiro-fluxo-caixa-diario", "Financeiro", "Fluxo de Caixa Diário", ["financeiro", "valor", "data"]),
    report("financeiro-fluxo-caixa-horizontal", "Financeiro", "Fluxo de Caixa Horizontal", ["financeiro", "valor", "data"]),
    report("financeiro-fluxo-caixa-movimentacao-contas", "Financeiro", "Fluxo de Caixa + Movimentação de Contas", ["financeiro", "valor", "data"]),
    report("financeiro-movimentacao-contas", "Financeiro", "Movimentação Contas", ["financeiro", "valor", "data"]),
    report("financeiro-cheque", "Financeiro", "Cheque", ["financeiro", "valor", "data"]),
    report("financeiro-solicitacao-pagamento", "Financeiro", "Solicitação de Pagamento", ["fornecedor", "financeiro", "valor", "data"]),
    report("financeiro-contrato", "Financeiro", "Contrato", ["contrato", "financeiro", "valor", "data"]),

    report("compras-pedidos-sintetico", "Compras", "Pedidos Compra Sintético", ["pedido", "fornecedor", "valor", "data"]),
    report("compras-pedidos-analitico", "Compras", "Pedidos Compra Analítico", ["pedido", "fornecedor", "material", "quantidade", "valor", "data"]),

    report("transporte-conhecimento-sintetico", "Transporte", "Conhecimento de Transporte Sintético", ["transportadora", "cliente", "nota-fiscal", "valor", "data"]),
    report("transporte-faturamento-sintetico", "Transporte", "Faturamento Sintético", ["transportadora", "cliente", "nota-fiscal", "valor", "data"]),
    report("transporte-faturamento-analitico", "Transporte", "Faturamento Analíticoítico", ["transportadora", "cliente", "nota-fiscal", "pedido", "valor", "data"]),
    report("transporte-conhecimento-estatistico", "Transporte", "Conhecimento de Transporte Estatístico", ["transportadora", "quantidade", "valor", "data"]),
    report("transporte-cargas", "Transporte", "Cargas", ["transportadora", "pedido", "quantidade", "valor", "data"]),

    report("funcionario-documentos", "Funcionário", "Documentos", ["funcionario", "documento"]),
    report("funcionario-rendimento", "Funcionário", "Rendimento", ["funcionario", "valor", "data"]),

    report("fornecedor-certificados", "Fornecedor", "Certificados", ["fornecedor", "certificado"]),

    report("registros-auditoria", "Registros", "Auditoria de Registros", ["documento", "data"])
  ];

  const fieldLabels = new Map(reportFields.map((field) => [field.id, field.label]));

  function fieldLabel(fieldId) {
    return fieldLabels.get(fieldId) || fieldId;
  }

  function fieldLabelForSentence(fieldId) {
    return fieldLabel(fieldId).toLocaleLowerCase("pt-BR");
  }

  function formatFieldSentence(fields) {
    const labels = fields.map(fieldLabelForSentence);
    if (labels.length <= 1) return labels[0] || "";

    return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
  }

  function createFieldCheckbox(field) {
    const label = document.createElement("label");
    label.className = "wc-report-field";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = field.id;
    input.dataset.wcReportField = field.id;

    const text = document.createElement("span");
    text.textContent = field.label;

    label.append(input, text);
    return label;
  }

  function createReportCard(report, selectedFields) {
    const card = document.createElement("article");
    card.className = "wc-tool-result-card";

    const fieldsLabel = document.createElement("p");
    fieldsLabel.className = "wc-report-card__label";
    fieldsLabel.textContent = "Informações encontradas:";

    const fieldList = document.createElement("div");
    fieldList.className = "wc-report-card__fields";
    selectedFields.forEach((field) => {
      const tag = document.createElement("span");
      tag.className = "wc-report-card__field wc-report-card__field--selected";
      tag.textContent = fieldLabel(field);
      fieldList.appendChild(tag);
    });

    const title = document.createElement("h3");
    title.className = "wc-report-card__title";
    title.textContent = report.name;

    card.append(fieldsLabel, fieldList, title);
    return card;
  }

  function createStateMessage(text, detail = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "wc-tool-empty";

    const message = document.createElement("p");
    message.textContent = text;
    wrapper.appendChild(message);

    if (detail) {
      const hint = document.createElement("p");
      hint.textContent = detail;
      wrapper.appendChild(hint);
    }

    return wrapper;
  }

  function createResultsSummary(count) {
    const summary = document.createElement("p");
    summary.className = "wc-report-results__summary";
    summary.textContent = `${count} ${count === 1 ? "relatório encontrado" : "relatórios encontrados"}`;
    return summary;
  }

  function createReferenceNote() {
    const note = document.createElement("p");
    note.className = "wc-report-results__note";
    note.textContent = "Use as sugestões como referência e acesse o relatório no WCorp para confirmar qual atende melhor à sua necessidade.";
    return note;
  }

  function initializeReportFinder() {
    const finder = document.querySelector("[data-wc-report-finder]");
    const fieldsContainer = document.querySelector("[data-wc-report-fields]");
    const results = document.querySelector("[data-wc-report-results]");
    const clearButton = document.querySelector("[data-wc-report-clear]");

    if (!finder || !fieldsContainer || !results || !clearButton || results.dataset.wcReady) return;
    results.dataset.wcReady = "true";

    fieldsContainer.replaceChildren(...reportFields.map(createFieldCheckbox));

    const selectedFields = () => Array.from(
      fieldsContainer.querySelectorAll("[data-wc-report-field]:checked")
    ).map((input) => input.value);

    const render = () => {
      const selected = selectedFields();
      const filtered = reports.filter((report) => (
        selected.every((field) => report.fields.includes(field))
      ));

      results.replaceChildren();

      clearButton.hidden = !selected.length;

      if (!selected.length) {
        results.appendChild(createStateMessage("Selecione uma ou mais informações para encontrar relatórios."));
        return;
      }

      if (!filtered.length) {
        results.appendChild(createStateMessage(
          "Nenhum relatório reúne todas as informações selecionadas.",
          "Tente remover uma das opções para ampliar os resultados."
        ));
        return;
      }

      results.appendChild(createResultsSummary(filtered.length));
      filtered.forEach((report) => results.appendChild(createReportCard(report, selected)));
      results.appendChild(createReferenceNote());
    };

    fieldsContainer.addEventListener("change", render);
    clearButton.addEventListener("click", () => {
      fieldsContainer.querySelectorAll("[data-wc-report-field]").forEach((input) => {
        input.checked = false;
      });
      render();
    });

    render();
  }

  function setXmlResult(container, type, message) {
    container.className = `wc-tool-result wc-tool-result--${type}`;
    container.textContent = message;
  }

  function parserErrorMessage(xmlDocument) {
    const parserError = xmlDocument.querySelector("parsererror");
    return parserError?.textContent.trim().replace(/\s+/g, " ") || "";
  }

  function initializeXmlValidator() {
    const fileInput = document.querySelector("[data-wc-xml-file]");
    const textarea = document.querySelector("[data-wc-xml-content]");
    const button = document.querySelector("[data-wc-xml-validate]");
    const result = document.querySelector("[data-wc-xml-result]");
    const dropzone = document.querySelector(".wc-xml-dropzone");

    if (!fileInput || !textarea || !button || !result || button.dataset.wcReady) return;
    button.dataset.wcReady = "true";

    const loadFile = (file) => {
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".xml")) {
        setXmlResult(result, "error", "Selecione um arquivo com extensão .xml.");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        textarea.value = String(reader.result || "");
        setXmlResult(result, "info", "Arquivo carregado. Clique em Validar XML para analisar a estrutura.");
      });
      reader.addEventListener("error", () => {
        setXmlResult(result, "error", "Não foi possível ler o arquivo selecionado.");
      });
      reader.readAsText(file);
    };

    fileInput.addEventListener("change", () => loadFile(fileInput.files?.[0]));

    if (dropzone) {
      ["dragenter", "dragover"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropzone.classList.add("wc-xml-dropzone--active");
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropzone.classList.remove("wc-xml-dropzone--active");
        });
      });

      dropzone.addEventListener("drop", (event) => {
        loadFile(event.dataTransfer?.files?.[0]);
      });
    }

    button.addEventListener("click", () => {
      const content = textarea.value.trim();

      if (!content) {
        setXmlResult(result, "error", "Informe um XML para validar.");
        return;
      }

      const xmlDocument = new DOMParser().parseFromString(content, "application/xml");
      const error = parserErrorMessage(xmlDocument);

      if (error) {
        setXmlResult(result, "error", `O XML possui erro de estrutura: ${error}`);
        return;
      }

      setXmlResult(result, "success", "O XML está bem-formado. Esta verificação não valida regras fiscais da SEFAZ.");
    });
  }

  function initializeTools() {
    initializeReportFinder();
    initializeXmlValidator();
  }

  document.addEventListener("DOMContentLoaded", initializeTools);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeTools);
  }
})();
