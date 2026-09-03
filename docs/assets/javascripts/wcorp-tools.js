(function () {
  const primaryFieldIds = [
    "client",
    "material",
    "supplier",
    "invoice",
    "order",
    "productionOrder",
    "contract",
    "quantity",
    "value",
    "date",
    "status",
    "seller"
  ];

  const additionalFieldIds = [
    "employee",
    "serviceOrder",
    "service",
    "stock",
    "batch",
    "storageLocation",
    "cost",
    "profitability",
    "paymentCondition",
    "payment",
    "dueDate",
    "costCenter",
    "tax",
    "cfop",
    "commission",
    "equipment",
    "process",
    "scrap",
    "freight",
    "weight",
    "document",
    "maintenance"
  ];

  const fieldDefinitions = {
    client: { label: "Cliente", aliases: ["cliente", "clientes", "cliente/contrato", "destinatário", "nome destinatário"] },
    material: { label: "Material", aliases: ["material", "produto", "descrição do material"] },
    supplier: { label: "Fornecedor", aliases: ["fornecedor", "fornecedores", "emitente"] },
    invoice: { label: "Nota fiscal", aliases: ["nota fiscal", "nf-e", "nfe", "cupom fiscal"] },
    order: { label: "Pedido", aliases: ["pedido", "pedido de venda", "pedido de compra"] },
    productionOrder: { label: "Ordem de produção", aliases: ["ordem de produção", "op"] },
    contract: { label: "Contrato", aliases: ["contrato", "contratos"] },
    quantity: { label: "Quantidade", aliases: ["quantidade", "qtde", "qtd"] },
    value: { label: "Valor", aliases: ["valor", "total", "valor total"] },
    date: { label: "Data", aliases: ["data", "emissão", "data emissão"] },
    status: { label: "Status", aliases: ["status", "situação"] },
    seller: { label: "Vendedor", aliases: ["vendedor", "representante"] },
    employee: { label: "Funcionário", aliases: ["funcionário", "colaborador", "funcionario"] },
    serviceOrder: { label: "Ordem de serviço", aliases: ["ordem de serviço", "os"] },
    service: { label: "Serviço", aliases: ["serviço", "servico"] },
    stock: { label: "Estoque", aliases: ["estoque", "saldo"] },
    batch: { label: "Lote", aliases: ["lote", "lotes"] },
    storageLocation: { label: "Local de armazenagem", aliases: ["local de armazenagem", "almoxarifado"] },
    cost: { label: "Custo", aliases: ["custo", "custo médio"] },
    profitability: { label: "Preço/Lucratividade", aliases: ["preço", "lucratividade", "margem"] },
    paymentCondition: { label: "Condição de pagamento", aliases: ["condição de pagamento", "forma de pagamento"] },
    payment: { label: "Recebimento/Pagamento", aliases: ["recebimento", "pagamento", "financeiro"] },
    dueDate: { label: "Vencimento", aliases: ["vencimento", "data de vencimento"] },
    costCenter: { label: "Centro de custo", aliases: ["centro de custo"] },
    tax: { label: "Impostos", aliases: ["impostos", "tributos", "icms", "ipi"] },
    cfop: { label: "CFOP", aliases: ["cfop"] },
    commission: { label: "Comissão", aliases: ["comissão", "comissao"] },
    equipment: { label: "Equipamento", aliases: ["equipamento", "máquina"] },
    process: { label: "Processo", aliases: ["processo", "processo realizado"] },
    scrap: { label: "Sucata", aliases: ["sucata", "refugo"] },
    freight: { label: "Transporte/Frete", aliases: ["transporte", "frete"] },
    weight: { label: "Peso", aliases: ["peso", "peso líquido", "peso bruto"] },
    document: { label: "Documento", aliases: ["documento", "documentos"] },
    maintenance: { label: "Manutenção", aliases: ["manutenção", "manutencao"] }
  };

  function report(name, category, fields) {
    return { name, category, fields };
  }

  const reports = [
    report("Movimentação de Material", "Materiais", ["material", "quantity", "date", "stock", "batch", "storageLocation"]),
    report("Estoque Sintético", "Materiais", ["material", "quantity", "value", "stock", "batch", "cost"]),
    report("Estoque Sintético com Material Relacionado", "Materiais", ["material", "quantity", "value", "stock", "batch", "cost"]),
    report("Estoque Analítico", "Materiais", ["material", "value", "stock", "cost", "date"]),
    report("Histórico de Compras", "Materiais", ["material", "supplier", "order", "value", "date", "cost"]),
    report("Tabela de Preço", "Materiais", ["client", "material", "value", "profitability"]),
    report("Consumo de Lote", "Materiais", ["material", "supplier", "client", "invoice", "productionOrder", "quantity", "value", "date", "batch", "stock"]),

    report("Ordem de Produção Sintético", "Ordem de Produção", ["client", "material", "productionOrder", "contract", "quantity", "date", "status", "weight", "scrap", "process"]),
    report("Ordem de Produção Analítico", "Ordem de Produção", ["client", "material", "invoice", "order", "productionOrder", "contract", "quantity", "date", "status", "batch"]),
    report("Ordem de Produção Diária", "Ordem de Produção", ["client", "material", "productionOrder", "quantity", "date", "weight", "scrap", "process"]),
    report("Ordem de Produção por Processo Realizado", "Ordem de Produção", ["material", "productionOrder", "quantity", "date", "equipment", "process", "scrap", "weight"]),
    report("Apontamento de Sucatas Analítico", "Ordem de Produção", ["material", "productionOrder", "quantity", "date", "equipment", "scrap"]),
    report("Ordem de Produção Equipamento", "Ordem de Produção", ["material", "productionOrder", "quantity", "date", "equipment", "process"]),
    report("Equipamento Manutenção", "Ordem de Produção", ["supplier", "date", "equipment", "maintenance"]),

    report("Ordem de Serviço Sintético", "Ordem de Serviço", ["client", "contract", "serviceOrder", "date", "status"]),
    report("Ordem de Serviço Analítico", "Ordem de Serviço", ["client", "contract", "serviceOrder", "order", "date", "status"]),
    report("Ordem de Serviço X Recebimento Sintético", "Ordem de Serviço", ["client", "contract", "serviceOrder", "value", "date", "status", "payment"]),
    report("Ordem de Serviço X Recebimento Analítico", "Ordem de Serviço", ["client", "contract", "serviceOrder", "value", "date", "status", "payment"]),
    report("Fatura por Serviço", "Ordem de Serviço", ["client", "service", "value", "date", "payment", "dueDate"]),

    report("Orçamentos Analítico", "Vendas", ["client", "contract", "value", "date", "status", "seller", "paymentCondition", "freight"]),
    report("Pedidos Sintético", "Vendas", ["client", "invoice", "order", "quantity", "value", "date", "status", "seller", "paymentCondition", "payment"]),
    report("Pedidos Analítico", "Vendas", ["client", "material", "invoice", "order", "productionOrder", "contract", "quantity", "value", "date", "status", "seller", "paymentCondition", "freight"]),
    report("Vendas X Lucratividade", "Vendas", ["client", "material", "order", "contract", "quantity", "value", "date", "status", "employee", "serviceOrder", "cost", "profitability"]),
    report("Pedidos - Movimentação do Caixa", "Vendas", ["client", "order", "contract", "value", "date", "status", "seller", "paymentCondition", "freight"]),
    report("Pedidos Disponíveis para Faturamento", "Vendas", ["client", "order", "contract", "date", "seller"]),
    report("Materiais Mais Vendidos", "Vendas", ["material", "quantity", "value", "stock", "batch"]),
    report("Vendas de Material por Cliente", "Vendas", ["client", "material", "invoice", "order", "quantity", "value", "date", "status"]),
    report("Vendas por Dia/Hora", "Vendas", ["order", "value", "date"]),
    report("Demonstrativo de Vendas por Material", "Vendas", ["material", "quantity", "value"]),
    report("Comissões", "Vendas", ["client", "material", "invoice", "order", "contract", "quantity", "value", "date", "seller", "employee", "serviceOrder", "service", "commission", "freight"]),
    report("Comissões por Recebimento", "Vendas", ["client", "invoice", "order", "contract", "value", "date", "commission", "payment"]),
    report("Pedidos X Recebimento Sintético", "Vendas", ["client", "order", "contract", "value", "date", "status", "paymentCondition", "payment"]),
    report("Pedidos X Recebimento Analítico", "Vendas", ["client", "order", "contract", "value", "date", "status", "paymentCondition", "payment"]),
    report("Pedidos Analítico por Data de Entrega", "Vendas", ["client", "material", "order", "contract", "quantity", "value", "date", "status", "seller", "paymentCondition"]),
    report("Pedidos X Ficha Técnica", "Vendas", ["client", "material", "order", "productionOrder", "quantity", "date", "status", "seller"]),
    report("Pedido X Ordem Produção", "Vendas", ["client", "material", "order", "productionOrder", "quantity", "value", "date", "status", "process"]),
    report("Despacho", "Vendas", ["client", "supplier", "invoice", "order", "value", "date", "freight", "weight", "tax"]),
    report("Despacho por Pedido", "Vendas", ["client", "invoice", "order", "value", "date", "freight", "tax"]),
    report("Ranking de Vendas por Cliente", "Vendas", ["client", "order", "quantity", "value", "seller", "profitability"]),
    report("Clientes que não compraram", "Vendas", ["client", "order", "quantity", "date", "seller"]),
    report("Devoluções", "Vendas", ["client", "material", "invoice", "order", "quantity", "value", "date"]),

    report("Nota Fiscal Sintético", "Faturamento", ["client", "invoice", "value", "date", "status", "tax", "freight", "weight"]),
    report("Nota Fiscal Analítico", "Faturamento", ["client", "material", "invoice", "quantity", "value", "date", "status", "tax", "cfop", "freight", "weight"]),
    report("Entrada Nota Fiscal Sintético", "Faturamento", ["supplier", "invoice", "value", "date"]),
    report("Entrada Nota Fiscal Analítico", "Faturamento", ["material", "supplier", "invoice", "order", "quantity", "value", "date", "tax", "cfop"]),
    report("Cupom Fiscal Sintético", "Faturamento", ["client", "invoice", "order", "value", "date", "status", "tax", "freight"]),
    report("Cupom Fiscal Analítico", "Faturamento", ["client", "invoice", "order", "value", "date", "status", "tax", "freight"]),
    report("Nota Fiscal Serviço Sintético", "Faturamento", ["client", "invoice", "service", "value", "date", "status", "tax"]),
    report("Nota Fiscal Apuração de Impostos", "Faturamento", ["client", "supplier", "invoice", "value", "date", "tax", "cfop"]),
    report("Apuração de Impostos por CFOP", "Faturamento", ["value", "tax", "cfop"]),

    report("Contas a Pagar", "Contas a Pagar", ["supplier", "invoice", "contract", "value", "date", "status", "employee", "payment", "dueDate", "costCenter"]),
    report("Contas a Pagar por Centro de Custo", "Contas a Pagar", ["supplier", "invoice", "contract", "value", "date", "status", "employee", "payment", "dueDate", "costCenter"]),
    report("Contas a Receber", "Contas a Receber", ["client", "supplier", "invoice", "order", "contract", "value", "date", "status", "employee", "payment", "dueDate"]),
    report("Contas a Receber por Centro de Custo", "Contas a Receber", ["client", "supplier", "invoice", "contract", "value", "date", "status", "employee", "payment", "dueDate", "costCenter"]),
    report("Movimentação de Contas", "Financeiro", ["client", "supplier", "invoice", "value", "date", "employee", "costCenter"]),
    report("Cheques", "Financeiro", ["client", "supplier", "value", "date", "status", "employee", "payment", "dueDate", "costCenter"]),
    report("Solicitação de Pagamento", "Financeiro", ["client", "supplier", "contract", "date", "employee", "payment"]),

    report("Pedidos de Compra Sintético", "Compras", ["client", "supplier", "invoice", "order", "contract", "value", "date", "status", "freight"]),
    report("Pedidos de Compra Analítico", "Compras", ["client", "material", "supplier", "order", "contract", "quantity", "value", "date", "status", "freight", "tax", "service"]),

    report("Conhecimento de Transporte Sintético", "Transporte", ["client", "supplier", "invoice", "quantity", "value", "date", "status", "freight"]),
    report("Faturamento Sintético", "Transporte", ["client", "value", "date", "dueDate", "payment"]),
    report("Faturamento Analítico", "Transporte", ["client", "value", "date", "dueDate", "payment"]),
    report("Estatístico de Conhecimento de Transporte", "Transporte", ["quantity", "value", "date", "tax", "freight", "weight"]),

    report("Documentos do Funcionário", "Funcionário", ["date", "employee", "document", "dueDate"]),
    report("Rendimento do Funcionário", "Funcionário", ["quantity", "date", "employee"])
  ];

  const reportFields = [...primaryFieldIds, ...additionalFieldIds].map((id) => ({ id, ...fieldDefinitions[id] }));
  const fieldLabels = new Map(reportFields.map((field) => [field.id, field.label]));
  const catalogValidation = validateReportCatalog();

  function fieldLabel(fieldId) {
    return fieldLabels.get(fieldId) || fieldId;
  }

  function validateReportCatalog() {
    const errors = [];
    const validFields = new Set([...primaryFieldIds, ...additionalFieldIds]);
    const fieldIds = new Set();
    const reportNames = new Set();

    reportFields.forEach((field) => {
      if (!field.id || !field.label) errors.push(`Campo inválido: ${field.id || "(vazio)"}`);
      if (fieldIds.has(field.id)) errors.push(`Campo duplicado: ${field.id}`);
      fieldIds.add(field.id);
    });

    reports.forEach((item) => {
      if (!item.name || !item.category || !Array.isArray(item.fields) || !item.fields.length) {
        errors.push(`Relatório inválido: ${item.name || "(sem nome)"}`);
      }
      if (reportNames.has(item.name)) errors.push(`Relatório duplicado: ${item.name}`);
      reportNames.add(item.name);

      const uniqueFields = new Set(item.fields);
      if (uniqueFields.size !== item.fields.length) errors.push(`Campos duplicados em: ${item.name}`);
      item.fields.forEach((field) => {
        if (!validFields.has(field)) errors.push(`Campo desconhecido em ${item.name}: ${field}`);
      });
    });

    return errors;
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

  function createFieldGrid(fields, className = "") {
    const grid = document.createElement("div");
    grid.className = `wc-report-fields${className ? ` ${className}` : ""}`;
    grid.append(...fields.map(createFieldCheckbox));
    return grid;
  }

  function createAdditionalToggle(grid) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wc-report-extra-toggle";
    button.setAttribute("aria-expanded", "false");
    grid.setAttribute("aria-hidden", "true");
    grid.inert = true;
    button.textContent = "Outras informações";

    const updateLabel = () => {
      const count = grid.querySelectorAll("[data-wc-report-field]:checked").length;
      button.textContent = count
        ? `Outras informações · ${count} selecionada${count === 1 ? "" : "s"}`
        : "Outras informações";
    };

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      grid.setAttribute("aria-hidden", String(expanded));
      grid.inert = expanded;
    });
    grid.addEventListener("change", updateLabel);
    updateLabel();

    return { button, updateLabel };
  }

  function createReportCard(report, selectedFields) {
    const card = document.createElement("article");
    card.className = "wc-tool-result-card";

    const eyebrow = document.createElement("p");
    eyebrow.className = "wc-report-card__eyebrow";
    eyebrow.textContent = "Relatório indicado";

    const title = document.createElement("h3");
    title.className = "wc-report-card__title";
    title.textContent = report.name;

    const match = document.createElement("p");
    match.className = "wc-report-card__match";
    match.textContent = `Atende ${selectedFields.length} ${selectedFields.length === 1 ? "informação selecionada" : "informações selecionadas"}`;

    const fieldsLabel = document.createElement("p");
    fieldsLabel.className = "wc-report-card__label";
    fieldsLabel.textContent = "Informações encontradas";

    const fieldList = document.createElement("div");
    fieldList.className = "wc-report-card__fields";
    selectedFields.forEach((field) => {
      const tag = document.createElement("span");
      tag.className = "wc-report-card__field wc-report-card__field--selected";
      tag.textContent = fieldLabel(field);
      fieldList.appendChild(tag);
    });

    card.append(eyebrow, title, match, fieldsLabel, fieldList);
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

  function initializeReportFinder() {
    const finder = document.querySelector("[data-wc-report-finder]");
    const fieldsContainer = document.querySelector("[data-wc-report-fields]");
    const results = document.querySelector("[data-wc-report-results]");
    const clearButton = document.querySelector("[data-wc-report-clear]");

    if (!finder || !fieldsContainer || !results || !clearButton || results.dataset.wcReady) return;
    results.dataset.wcReady = "true";

    const primaryFields = primaryFieldIds.map((id) => ({ id, ...fieldDefinitions[id] }));
    const additionalFields = additionalFieldIds.map((id) => ({ id, ...fieldDefinitions[id] }));
    const primaryGrid = createFieldGrid(primaryFields);
    const additionalGrid = createFieldGrid(additionalFields, "wc-report-fields--additional");
    const { button: additionalToggle, updateLabel: updateAdditionalLabel } = createAdditionalToggle(additionalGrid);

    fieldsContainer.replaceChildren(primaryGrid, additionalToggle, additionalGrid);

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
      if (catalogValidation.length) {
        results.appendChild(createStateMessage("O catálogo do indicador precisa de revisão técnica."));
        return;
      }

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
    };

    fieldsContainer.addEventListener("change", render);
    clearButton.addEventListener("click", () => {
      fieldsContainer.querySelectorAll("[data-wc-report-field]").forEach((input) => {
        input.checked = false;
      });
      updateAdditionalLabel();
      render();
    });

    render();
  }

  function setXmlResult(container, type, message) {
    container.className = `wc-tool-result wc-tool-result--${type}`;
    container.textContent = message;
  }

  function createXmlToken(className, text) {
    const token = document.createElement("span");
    token.className = className;
    token.textContent = text;
    return token;
  }

  function appendXmlTag(container, element, closing = false, selfClosing = false) {
    container.appendChild(createXmlToken("wc-xml-token wc-xml-token--symbol", closing ? "</" : "<"));
    container.appendChild(createXmlToken("wc-xml-token wc-xml-token--tag", element.nodeName));

    if (!closing) {
      Array.from(element.attributes || []).forEach((attribute) => {
        container.appendChild(document.createTextNode(" "));
        container.appendChild(createXmlToken("wc-xml-token wc-xml-token--attr", attribute.name));
        container.appendChild(createXmlToken("wc-xml-token wc-xml-token--symbol", "="));
        if (element.nodeName === "infNFe" && attribute.name === "Id") {
          container.appendChild(createXmlToken("wc-xml-token wc-xml-token--symbol", "\""));
          container.appendChild(createXmlToken("wc-xml-token wc-xml-token--value wc-xml-token--inf-id", attribute.value));
          container.appendChild(createXmlToken("wc-xml-token wc-xml-token--symbol", "\""));
        } else {
          container.appendChild(createXmlToken("wc-xml-token wc-xml-token--value", `"${attribute.value}"`));
        }
      });
    }

    container.appendChild(createXmlToken("wc-xml-token wc-xml-token--symbol", selfClosing ? "/>" : ">"));
  }

  function xmlMeaningfulChildren(node) {
    return Array.from(node.childNodes || []).filter((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) return true;
      if (child.nodeType === Node.CDATA_SECTION_NODE || child.nodeType === Node.COMMENT_NODE) return true;
      return child.nodeType === Node.TEXT_NODE && child.textContent.trim();
    });
  }

  function createXmlLine(depth, className = "") {
    const line = document.createElement("div");
    line.className = `wc-xml-tree__line ${className}`.trim();
    line.style.setProperty("--wc-xml-depth", String(depth));
    return line;
  }

  function createXmlSpacer() {
    const spacer = document.createElement("span");
    spacer.className = "wc-xml-tree__toggle-spacer";
    spacer.setAttribute("aria-hidden", "true");
    return spacer;
  }

  function isSimpleXmlElement(element, children) {
    return children.length === 1 &&
      [Node.TEXT_NODE, Node.CDATA_SECTION_NODE].includes(children[0].nodeType) &&
      children[0].textContent.trim().length <= 140;
  }

  function getXmlElementPath(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return "";

    const parts = [];
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      const name = current.nodeName;
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.nodeName === name) index += 1;
        sibling = sibling.previousElementSibling;
      }
      parts.unshift(`${name}[${index}]`);
      current = current.parentElement;
    }

    return `/${parts.join("/")}`;
  }

  function setXmlNodeCollapsed(node, collapsed) {
    const toggle = node.querySelector(":scope > .wc-xml-tree__line .wc-xml-tree__toggle");
    const children = node.querySelector(":scope > .wc-xml-node__children");
    const closeLine = node.querySelector(":scope > .wc-xml-tree__line--close");

    node.classList.toggle("is-collapsed", collapsed);
    if (toggle) {
      toggle.textContent = collapsed ? "▶" : "▼";
      toggle.setAttribute("aria-expanded", String(!collapsed));
    }
    if (children) children.hidden = collapsed;
    if (closeLine) closeLine.hidden = collapsed;
  }

  function buildXmlTreeNode(node, depth = 0) {
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
      const text = node.textContent.trim();
      if (!text) return null;

      const line = createXmlLine(depth, "wc-xml-tree__line--text");
      line.appendChild(createXmlSpacer());
      line.appendChild(createXmlToken("wc-xml-token wc-xml-token--text", text));
      return line;
    }

    if (node.nodeType === Node.COMMENT_NODE) {
      const line = createXmlLine(depth, "wc-xml-tree__line--comment");
      line.appendChild(createXmlSpacer());
      line.appendChild(createXmlToken("wc-xml-token wc-xml-token--comment", `<!--${node.textContent}-->`));
      return line;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const children = xmlMeaningfulChildren(node);
    const path = getXmlElementPath(node);

    if (!children.length) {
      const line = createXmlLine(depth);
      line.dataset.wcXmlPath = path;
      line.appendChild(createXmlSpacer());
      appendXmlTag(line, node, false, true);
      return line;
    }

    if (isSimpleXmlElement(node, children)) {
      const line = createXmlLine(depth);
      line.dataset.wcXmlPath = path;
      line.appendChild(createXmlSpacer());
      appendXmlTag(line, node);
      line.appendChild(createXmlToken("wc-xml-token wc-xml-token--text", children[0].textContent.trim()));
      appendXmlTag(line, node, true);
      return line;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "wc-xml-node";
    wrapper.dataset.collapsible = "true";
    wrapper.dataset.wcXmlPath = path;

    const openLine = createXmlLine(depth, "wc-xml-tree__line--open");
    openLine.dataset.wcXmlPath = path;
    const toggle = document.createElement("button");
    toggle.className = "wc-xml-tree__toggle";
    toggle.type = "button";
    toggle.textContent = "▼";
    toggle.setAttribute("aria-label", `Alternar ${node.nodeName}`);
    toggle.setAttribute("aria-expanded", "true");
    openLine.appendChild(toggle);
    appendXmlTag(openLine, node);

    const summary = createXmlToken("wc-xml-tree__collapsed-summary", " … ");
    appendXmlTag(summary, node, true);
    openLine.appendChild(summary);

    const childContainer = document.createElement("div");
    childContainer.className = "wc-xml-node__children";
    children.forEach((child) => {
      const childNode = buildXmlTreeNode(child, depth + 1);
      if (childNode) childContainer.appendChild(childNode);
    });

    const closeLine = createXmlLine(depth, "wc-xml-tree__line--close");
    closeLine.dataset.wcXmlPath = path;
    closeLine.appendChild(createXmlSpacer());
    appendXmlTag(closeLine, node, true);

    wrapper.append(openLine, childContainer, closeLine);
    return wrapper;
  }

  function renderXmlTree(container, xmlDocument) {
    if (!container) return;

    container.replaceChildren();
    const tree = document.createElement("div");
    tree.className = "wc-xml-tree__content";
    const rootNode = buildXmlTreeNode(xmlDocument.documentElement);
    if (rootNode) tree.appendChild(rootNode);
    container.appendChild(tree);
  }

  function renderXmlCodeFallback(container, content) {
    if (!container) return;

    container.replaceChildren();
    const notice = document.createElement("p");
    notice.className = "wc-xml-tree__notice";
    notice.textContent = "Não foi possível montar a árvore completa. O XML original foi mantido em modo de código.";

    const code = document.createElement("pre");
    code.className = "wc-xml-code";
    String(content || "").split(/\r?\n/).forEach((line, index) => {
      const row = document.createElement("span");
      row.className = "wc-xml-code__line";
      row.dataset.line = String(index + 1);
      row.textContent = line || " ";
      code.appendChild(row);
    });

    container.append(notice, code);
  }

  function parserErrorMessage(xmlDocument) {
    const parserError = xmlDocument.querySelector("parsererror");
    return parserError?.textContent.trim().replace(/\s+/g, " ") || "";
  }

  const xmlValidationCategories = [
    { id: "structure", label: "Estrutura XML", shortLabel: "Estrutura" },
    { id: "fields", label: "Campos e formatos", shortLabel: "Campos" },
    { id: "items", label: "Itens", shortLabel: "Itens" },
    { id: "calculations", label: "Cálculos", shortLabel: "Cálculos" },
    { id: "totals", label: "Totalizadores", shortLabel: "Totais" },
  ];

  const brazilianStates = new Set([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ]);

  const totalizerChecks = [
    { tag: "vProd", source: "prod", label: "Total dos produtos" },
    { tag: "vBC", source: "icms", label: "Total da BC do ICMS" },
    { tag: "vICMS", source: "icms", label: "Total do ICMS" },
    { tag: "vBCST", source: "icms", label: "Total da BC ICMS-ST" },
    { tag: "vST", source: "icms", label: "Total do ICMS-ST" },
    { tag: "vIPI", source: "ipi", label: "Total do IPI" },
    { tag: "vPIS", source: "pis", label: "Total do PIS" },
    { tag: "vCOFINS", source: "cofins", label: "Total do COFINS" },
    { tag: "vFrete", source: "prod", label: "Total do frete" },
    { tag: "vSeg", source: "prod", label: "Total do seguro" },
    { tag: "vDesc", source: "prod", label: "Total do desconto" },
    { tag: "vOutro", source: "prod", label: "Total de outras despesas" },
  ];

  const numericFieldNames = new Set([
    "cUF", "cNF", "mod", "serie", "nNF", "tpNF", "idDest", "cMunFG", "tpImp", "tpEmis",
    "cDV", "tpAmb", "finNFe", "indFinal", "indPres", "procEmi", "vNF", "vTotTrib",
    "qCom", "vUnCom", "vProd", "qTrib", "vUnTrib", "vFrete", "vSeg", "vDesc", "vOutro",
    "vBC", "pICMS", "vICMS", "vBCST", "vST", "vIPI", "vPIS", "vCOFINS",
  ]);

  const percentageFieldNames = new Set(["pICMS", "pIPI", "pPIS", "pCOFINS", "pST"]);

  const icmsGroupRules = {
    ICMS00: { codeTag: "CST", codes: ["00"], required: ["orig", "CST"] },
    ICMS10: { codeTag: "CST", codes: ["10"], required: ["orig", "CST"] },
    ICMS20: { codeTag: "CST", codes: ["20"], required: ["orig", "CST"] },
    ICMS30: { codeTag: "CST", codes: ["30"], required: ["orig", "CST"] },
    ICMS40: { codeTag: "CST", codes: ["40"], required: ["orig", "CST"] },
    ICMS41: { codeTag: "CST", codes: ["41"], required: ["orig", "CST"] },
    ICMS50: { codeTag: "CST", codes: ["50"], required: ["orig", "CST"] },
    ICMS51: { codeTag: "CST", codes: ["51"], required: ["orig", "CST"] },
    ICMS60: { codeTag: "CST", codes: ["60"], required: ["orig", "CST"] },
    ICMS70: { codeTag: "CST", codes: ["70"], required: ["orig", "CST"] },
    ICMS90: { codeTag: "CST", codes: ["90"], required: ["orig", "CST"] },
    ICMSSN101: { codeTag: "CSOSN", codes: ["101"], required: ["orig", "CSOSN"] },
    ICMSSN102: { codeTag: "CSOSN", codes: ["102", "103", "300", "400"], required: ["orig", "CSOSN"] },
    ICMSSN201: { codeTag: "CSOSN", codes: ["201"], required: ["orig", "CSOSN"] },
    ICMSSN202: { codeTag: "CSOSN", codes: ["202", "203"], required: ["orig", "CSOSN"] },
    ICMSSN500: { codeTag: "CSOSN", codes: ["500"], required: ["orig", "CSOSN"] },
    ICMSSN900: { codeTag: "CSOSN", codes: ["900"], required: ["orig", "CSOSN"] },
  };

  function createXmlAnalysis() {
    const categories = xmlValidationCategories.map((category) => ({
      ...category,
      checks: 0,
      status: "not_checked",
      problems: 0,
    }));

    return {
      categories,
      checks: [],
      documentInfo: null,
      issues: [],
      notChecked: [],
      toleranceCents: 1,
    };
  }

  function categoryById(analysis, categoryId) {
    return analysis.categories.find((category) => category.id === categoryId);
  }

  function addXmlCheck(analysis, categoryId, label, status = "validated", options = {}) {
    const category = categoryById(analysis, categoryId);
    if (!category) return;

    category.checks += status === "validated" ? 1 : 0;
    analysis.checks.push({
      category: categoryId,
      label,
      status,
      validationKey: options.validationKey || "",
      groupUnit: options.groupUnit || "",
    });
  }

  function addXmlNotChecked(analysis, categoryId, label) {
    const category = categoryById(analysis, categoryId);
    if (category && category.status !== "problem") {
      category.status = "not_checked";
    }
    analysis.notChecked.push({ category: categoryId, label });
    analysis.checks.push({ category: categoryId, label, status: "not_checked" });
  }

  function addXmlIssue(analysis, issue) {
    const category = categoryById(analysis, issue.category);
    if (category) {
      category.problems += 1;
      category.status = "problem";
    }
    analysis.issues.push({
      severity: "warning",
      foundValue: null,
      expectedValue: null,
      difference: null,
      xmlPath: "",
      ...issue,
      id: `xml-issue-${analysis.issues.length + 1}`,
    });
  }

  function finalizeXmlCategories(analysis) {
    analysis.categories.forEach((category) => {
      if (category.status === "problem") return;
      category.status = category.checks > 0 ? "validated" : "not_checked";
    });
  }

  function elementsByLocalName(root, localName) {
    if (!root) return [];
    return Array.from(root.getElementsByTagName("*")).filter((element) => element.localName === localName);
  }

  function directChildrenByLocalName(element, localName) {
    if (!element) return [];
    return Array.from(element.children || []).filter((child) => child.localName === localName);
  }

  function firstDirectChildByLocalName(element, localName) {
    return directChildrenByLocalName(element, localName)[0] || null;
  }

  function firstElementByLocalName(root, localName) {
    return elementsByLocalName(root, localName)[0] || null;
  }

  function firstDescendantText(element, localName) {
    return firstElementByLocalName(element, localName)?.textContent.trim() || "";
  }

  function hasXmlAncestor(element, localName) {
    let current = element?.parentElement || null;
    while (current) {
      if (current.localName === localName) return true;
      current = current.parentElement;
    }
    return false;
  }

  function xmlCheckContext(element) {
    if (hasXmlAncestor(element, "det")) {
      return hasXmlAncestor(element, "prod") ? "item-prod" : "item-tax";
    }
    if (hasXmlAncestor(element, "ICMSTot")) return "total";
    if (hasXmlAncestor(element, "ide")) return "ide";
    return element?.parentElement?.localName || "field";
  }

  function parseXmlDecimal(value) {
    const normalized = String(value || "").trim();
    if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
    return Number(normalized);
  }

  function toCents(value) {
    return Math.round(Number(value) * 100);
  }

  function formatXmlMoneyFromCents(cents) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
  }

  function formatXmlDisplayDate(value) {
    const text = String(value || "").trim();
    if (!text) return "";

    const date = new Date(text.length === 10 ? `${text}T00:00:00` : text);
    if (Number.isNaN(date.getTime())) return text;

    const parts = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(date);
    const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${byType.day}/${byType.month}/${byType.year} ${byType.hour}:${byType.minute}`;
  }

  function buildXmlAddress(addressGroup) {
    if (!addressGroup) return "";

    const street = firstDescendantText(addressGroup, "xLgr");
    const number = firstDescendantText(addressGroup, "nro");
    const district = firstDescendantText(addressGroup, "xBairro");
    const city = firstDescendantText(addressGroup, "xMun");
    const state = firstDescendantText(addressGroup, "UF");
    const streetLine = [street, number].filter(Boolean).join(", ");
    const cityLine = city && state ? `${city}/${state}` : city || state;

    return [
      [streetLine, district].filter(Boolean).join(" - "),
      cityLine,
    ].filter(Boolean).join(" · ");
  }

  function sumXmlValues(elements, tagName) {
    return elements.reduce((total, element) => {
      const value = parseXmlDecimal(firstDescendantText(element, tagName));
      return value === null ? total : total + toCents(value);
    }, 0);
  }

  function sumXmlTaxValues(detElements, parentName, tagName) {
    return detElements.reduce((total, det) => {
      const imposto = firstElementByLocalName(det, "imposto");
      if (!imposto) return total;

      return total + elementsByLocalName(imposto, parentName).reduce((subtotal, parent) => (
        subtotal + elementsByLocalName(parent, tagName).reduce((valueTotal, valueElement) => {
          const value = parseXmlDecimal(valueElement.textContent.trim());
          return value === null ? valueTotal : valueTotal + toCents(value);
        }, 0)
      ), 0);
    }, 0);
  }

  function isValidXmlDate(value) {
    const text = String(value || "").trim();
    if (!text) return false;
    return /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:-\d{2}:\d{2}|Z)?)?$/.test(text) &&
      !Number.isNaN(Date.parse(text.length === 10 ? `${text}T00:00:00` : text));
  }

  function hasRepeatedDigits(value) {
    return /^(\d)\1+$/.test(value);
  }

  function mod11CheckDigit(numbers, weights) {
    const sum = numbers.reduce((total, number, index) => total + Number(number) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  function isValidCpf(value) {
    if (!/^\d{11}$/.test(value) || hasRepeatedDigits(value)) return false;
    const digits = value.split("");
    const first = mod11CheckDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const second = mod11CheckDigit(digits.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    return Number(digits[9]) === first && Number(digits[10]) === second;
  }

  function isValidCnpj(value) {
    if (!/^\d{14}$/.test(value) || hasRepeatedDigits(value)) return false;
    const digits = value.split("");
    const first = mod11CheckDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const second = mod11CheckDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    return Number(digits[12]) === first && Number(digits[13]) === second;
  }

  function findSupportedNfe(xmlDocument) {
    const root = xmlDocument.documentElement;
    const infNFe = firstElementByLocalName(root, "infNFe");
    if (!root || !infNFe) {
      return { root, infNFe: null, detElements: [], icmsTot: null, type: "XML" };
    }

    return {
      root,
      infNFe,
      detElements: elementsByLocalName(infNFe, "det"),
      icmsTot: firstElementByLocalName(infNFe, "ICMSTot"),
      type: "NF-e",
    };
  }

  function buildXmlDocumentInfo(context) {
    const { root, infNFe, type } = context;
    if (!infNFe) return null;

    const emit = firstElementByLocalName(infNFe, "emit");
    const dest = firstElementByLocalName(infNFe, "dest");
    const tpNF = firstDescendantText(infNFe, "tpNF");
    const tpAmb = firstDescendantText(infNFe, "tpAmb");
    const emission = firstDescendantText(infNFe, "dhEmi") || firstDescendantText(infNFe, "dEmi");
    const rawAccessKey = String(infNFe.getAttribute("Id") || "").replace(/^NFe/i, "");
    const accessKey = /^\d{44}$/.test(rawAccessKey) ? rawAccessKey : "";
    const protocol = firstDescendantText(firstElementByLocalName(root, "infProt"), "nProt");

    return {
      type,
      version: infNFe.getAttribute("versao") || "",
      accessKey,
      accessKeyRaw: /^\d{44}$/.test(rawAccessKey) ? rawAccessKey : "",
      protocol,
      operationNature: firstDescendantText(infNFe, "natOp"),
      number: firstDescendantText(infNFe, "nNF"),
      series: firstDescendantText(infNFe, "serie"),
      emission: formatXmlDisplayDate(emission),
      operation: tpNF === "1" ? "Saída" : tpNF === "0" ? "Entrada" : "",
      environment: tpAmb === "1" ? "Produção" : tpAmb === "2" ? "Homologação" : "",
      emitter: firstDescendantText(emit, "xNome"),
      recipient: firstDescendantText(dest, "xNome"),
      address: buildXmlAddress(firstElementByLocalName(dest, "enderDest") || firstElementByLocalName(emit, "enderEmit")),
    };
  }

  function validateXmlStructure(analysis, xmlDocument, parserError) {
    if (parserError) {
      addXmlIssue(analysis, {
        severity: "error",
        category: "structure",
        title: "XML malformado",
        message: parserError,
      });
      addXmlNotChecked(analysis, "fields", "Campos e formatos não verificados porque o XML não pôde ser parseado.");
      addXmlNotChecked(analysis, "items", "Itens não verificados porque o XML não pôde ser parseado.");
      addXmlNotChecked(analysis, "calculations", "Cálculos não verificados porque o XML não pôde ser parseado.");
      addXmlNotChecked(analysis, "totals", "Totalizadores não verificados porque o XML não pôde ser parseado.");
      return null;
    }

    const context = findSupportedNfe(xmlDocument);
    if (!context.root) {
      addXmlIssue(analysis, {
        severity: "error",
        category: "structure",
        title: "Elemento raiz não identificado",
        message: "O arquivo foi parseado, mas não foi possível identificar o elemento raiz do XML.",
      });
      return null;
    }

    addXmlCheck(analysis, "structure", "XML bem-formado");
    addXmlCheck(analysis, "structure", `Elemento raiz identificado: ${context.root.nodeName}`);

    if (!context.infNFe) {
      addXmlIssue(analysis, {
        severity: "warning",
        category: "structure",
        title: "Tipo de documento não suportado",
        message: "A análise detalhada desta versão do validador está preparada inicialmente para NF-e.",
        xmlPath: getXmlElementPath(context.root),
      });
      addXmlNotChecked(analysis, "fields", "Campos e formatos de NF-e não verificados.");
      addXmlNotChecked(analysis, "items", "Itens de NF-e não verificados.");
      addXmlNotChecked(analysis, "calculations", "Cálculos de NF-e não verificados.");
      addXmlNotChecked(analysis, "totals", "Totalizadores de NF-e não verificados.");
      return null;
    }

    addXmlCheck(analysis, "structure", "Documento NF-e identificado");
    if (context.infNFe.getAttribute("versao")) {
      addXmlCheck(analysis, "structure", `Versão identificada: ${context.infNFe.getAttribute("versao")}`);
    } else {
      addXmlIssue(analysis, {
        severity: "warning",
        category: "structure",
        title: "Versão da NF-e não identificada",
        message: "O atributo versao não foi encontrado em infNFe.",
        xmlPath: getXmlElementPath(context.infNFe),
      });
    }

    const namespace = context.root.namespaceURI || context.infNFe.namespaceURI || "";
    if (namespace.includes("portalfiscal.inf.br/nfe")) {
      addXmlCheck(analysis, "structure", "Namespace nacional da NF-e identificado");
    } else {
      addXmlIssue(analysis, {
        severity: "warning",
        category: "structure",
        title: "Namespace da NF-e não identificado",
        message: "O namespace esperado da NF-e não foi encontrado nos elementos principais.",
        xmlPath: getXmlElementPath(context.root),
      });
    }

    analysis.documentInfo = buildXmlDocumentInfo(context);
    return context;
  }

  function validateXmlFields(analysis, context) {
    const { infNFe, detElements, icmsTot } = context;
    const cpfCnpjElements = [...elementsByLocalName(infNFe, "CNPJ"), ...elementsByLocalName(infNFe, "CPF")];

    cpfCnpjElements.forEach((element) => {
      const value = element.textContent.trim();
      const isCnpj = element.localName === "CNPJ";
      addXmlCheck(analysis, "fields", `${element.localName} analisado`, "validated", {
        validationKey: `${element.localName.toLowerCase()}-format`,
        groupUnit: "campos",
      });
      if ((isCnpj && !isValidCnpj(value)) || (!isCnpj && !isValidCpf(value))) {
        addXmlIssue(analysis, {
          severity: "error",
          category: "fields",
          title: `${element.localName} com formato inválido`,
          message: `${element.localName} deve ser numérico e possuir dígitos verificadores coerentes.`,
          foundValue: value,
          xmlPath: getXmlElementPath(element),
        });
      }
    });

    elementsByLocalName(infNFe, "CEP").forEach((element) => {
      const value = element.textContent.trim();
      addXmlCheck(analysis, "fields", "CEP analisado", "validated", {
        validationKey: "cep-format",
        groupUnit: "campos",
      });
      if (!/^\d{8}$/.test(value)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "CEP com formato inesperado",
          message: "Quando informado, o CEP deve conter 8 dígitos numéricos.",
          foundValue: value,
          xmlPath: getXmlElementPath(element),
        });
      }
    });

    elementsByLocalName(infNFe, "UF").forEach((element) => {
      const value = element.textContent.trim().toUpperCase();
      addXmlCheck(analysis, "fields", "UF analisada", "validated", {
        validationKey: "uf-format",
        groupUnit: "campos",
      });
      if (!brazilianStates.has(value)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "UF com formato inesperado",
          message: "UF deve usar uma sigla brasileira com dois caracteres.",
          foundValue: element.textContent.trim(),
          xmlPath: getXmlElementPath(element),
        });
      }
    });

    [...elementsByLocalName(infNFe, "dhEmi"), ...elementsByLocalName(infNFe, "dEmi")].forEach((element) => {
      const value = element.textContent.trim();
      addXmlCheck(analysis, "fields", `${element.localName} analisada`, "validated", {
        validationKey: `date-${element.localName.toLowerCase()}`,
        groupUnit: "campos",
      });
      if (!isValidXmlDate(value)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "Data com formato inesperado",
          message: "A data deve estar em formato ISO compatível com NF-e.",
          foundValue: value,
          xmlPath: getXmlElementPath(element),
        });
      }
    });

    Array.from(infNFe.getElementsByTagName("*")).forEach((element) => {
      if (!numericFieldNames.has(element.localName)) return;
      const value = element.textContent.trim();
      if (value && element.children.length === 0) {
        const numericContext = xmlCheckContext(element);
        addXmlCheck(analysis, "fields", `${element.localName} numérico analisado`, "validated", {
          validationKey: `numeric-${numericContext}-${element.localName.toLowerCase()}`,
          groupUnit: numericContext.startsWith("item-") ? "itens" : "campos",
        });
        const numericValue = parseXmlDecimal(value);
        if (numericValue === null) {
          addXmlIssue(analysis, {
            severity: "error",
            category: "fields",
            title: `Campo ${element.localName} não numérico`,
            message: "O campo possui conteúdo incompatível com valor numérico.",
            foundValue: value,
            xmlPath: getXmlElementPath(element),
          });
        } else if (numericValue < 0) {
          addXmlIssue(analysis, {
            severity: "warning",
            category: "fields",
            title: `Campo ${element.localName} com valor negativo`,
            message: "O campo foi identificado como numérico, mas possui valor negativo em uma estrutura de NF-e.",
            foundValue: value,
            xmlPath: getXmlElementPath(element),
          });
        } else if (percentageFieldNames.has(element.localName) && numericValue > 100) {
          addXmlIssue(analysis, {
            severity: "warning",
            category: "fields",
            title: `Percentual ${element.localName} fora da faixa esperada`,
            message: "Percentuais básicos da NF-e devem estar entre 0 e 100 nesta validação estrutural.",
            foundValue: value,
            xmlPath: getXmlElementPath(element),
          });
        }
      }
    });

    const itemNumbers = new Map();
    detElements.forEach((det) => {
      const itemNumber = det.getAttribute("nItem") || "";
      const parsedItemNumber = /^\d+$/.test(itemNumber) ? Number(itemNumber) : null;
      addXmlCheck(analysis, "items", `Item ${itemNumber || "sem número"} analisado`, "validated", {
        validationKey: "item-number-integrity",
        groupUnit: "itens",
      });
      if (itemNumber && (!parsedItemNumber || parsedItemNumber < 1)) {
        addXmlIssue(analysis, {
          severity: "error",
          category: "items",
          title: `nItem inválido: ${itemNumber}`,
          message: "O atributo nItem deve ser um número inteiro positivo.",
          foundValue: itemNumber,
          xmlPath: getXmlElementPath(det),
          itemNumber,
        });
      }
      if (!itemNumber || itemNumbers.has(itemNumber)) {
        addXmlIssue(analysis, {
          severity: "error",
          category: "items",
          title: itemNumber ? `nItem duplicado: ${itemNumber}` : "Item sem nItem",
          message: "Cada item deve possuir um nItem identificável e sem duplicidade dentro da NF-e.",
          foundValue: itemNumber || "não informado",
          xmlPath: getXmlElementPath(det),
          itemNumber,
        });
      }
      itemNumbers.set(itemNumber, det);

      if (!firstElementByLocalName(det, "prod")) {
        addXmlIssue(analysis, {
          severity: "error",
          category: "fields",
          title: `Item ${itemNumber || ""} sem grupo prod`,
          message: "O item não possui o grupo prod para análise básica do produto.",
          xmlPath: getXmlElementPath(det),
          itemNumber,
        });
      }
    });

    addXmlCheck(analysis, "fields", "Totalizador ICMSTot analisado");
    if (!icmsTot) {
      addXmlIssue(analysis, {
        severity: "error",
        category: "fields",
        title: "Totalizador ICMSTot não encontrado",
        message: "Não foi possível encontrar o grupo de totalizadores da NF-e.",
        xmlPath: getXmlElementPath(infNFe),
      });
    }
  }

  function validateXmlNcm(analysis, context) {
    context.detElements.forEach((det) => {
      const itemNumber = det.getAttribute("nItem") || "";
      const prod = firstElementByLocalName(det, "prod");
      if (!prod) return;

      const ncmElement = firstDirectChildByLocalName(prod, "NCM");
      addXmlCheck(analysis, "fields", "NCM do item analisado", "validated", {
        validationKey: "item-ncm-format",
        groupUnit: "itens",
      });
      if (!ncmElement || !ncmElement.textContent.trim()) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} sem NCM`,
          message: "O grupo prod não possui NCM informado para validação estrutural do produto.",
          xmlPath: getXmlElementPath(prod),
          itemNumber,
        });
        return;
      }

      const value = ncmElement.textContent.trim();
      if (!/^\d{8}$/.test(value)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} com NCM em formato inválido`,
          message: "NCM deve conter exatamente 8 dígitos numéricos.",
          foundValue: value,
          xmlPath: getXmlElementPath(ncmElement),
          itemNumber,
        });
      }
    });
  }

  function validateXmlOperationCoherence(analysis, context) {
    const { infNFe, detElements } = context;
    const ide = firstElementByLocalName(infNFe, "ide");
    const emit = firstElementByLocalName(infNFe, "emit");
    const dest = firstElementByLocalName(infNFe, "dest");
    const tpNFElement = firstDirectChildByLocalName(ide, "tpNF");
    const idDestElement = firstDirectChildByLocalName(ide, "idDest");
    const tpNF = tpNFElement?.textContent.trim() || "";
    const idDest = idDestElement?.textContent.trim() || "";
    const emitUF = firstDescendantText(emit, "UF").toUpperCase();
    const destUF = firstDescendantText(dest, "UF").toUpperCase();

    if (tpNF && !["0", "1"].includes(tpNF)) {
      addXmlIssue(analysis, {
        severity: "warning",
        category: "fields",
        title: "tpNF fora da faixa esperada",
        message: "tpNF deve indicar entrada ou saída usando 0 ou 1.",
        foundValue: tpNF,
        xmlPath: getXmlElementPath(tpNFElement || ide),
      });
    }
    if (idDest && !["1", "2", "3"].includes(idDest)) {
      addXmlIssue(analysis, {
        severity: "warning",
        category: "fields",
        title: "idDest fora da faixa esperada",
        message: "idDest deve indicar operação interna, interestadual ou exterior usando 1, 2 ou 3.",
        foundValue: idDest,
        xmlPath: getXmlElementPath(idDestElement || ide),
      });
    }

    if (emitUF && destUF) {
      addXmlCheck(analysis, "fields", "idDest comparado com UF de emitente e destinatário");
      if (emitUF === destUF && idDest && idDest !== "1") {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "idDest incompatível com UFs iguais",
          message: "Emitente e destinatário possuem a mesma UF, mas idDest não indica operação interna.",
          foundValue: idDest,
          expectedValue: "1",
          xmlPath: getXmlElementPath(idDestElement || ide),
        });
      } else if (emitUF !== destUF && idDest === "1") {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "idDest incompatível com UFs diferentes",
          message: "Emitente e destinatário possuem UFs diferentes, mas idDest indica operação interna.",
          foundValue: idDest,
          expectedValue: "2 ou 3",
          xmlPath: getXmlElementPath(idDestElement || ide),
        });
      }
    }

    detElements.forEach((det) => {
      const itemNumber = det.getAttribute("nItem") || "";
      const prod = firstElementByLocalName(det, "prod");
      const cfopElement = firstDirectChildByLocalName(prod, "CFOP");
      if (!cfopElement || !cfopElement.textContent.trim()) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: "CFOP não informado",
          message: "O item deve possuir um CFOP informado.",
          foundValue: "não informado",
          xmlPath: getXmlElementPath(prod || det),
          itemNumber,
        });
        return;
      }

      const cfop = cfopElement.textContent.trim();
      const firstDigit = cfop.charAt(0);
      addXmlCheck(analysis, "fields", "CFOP comparado com operação da NF-e", "validated", {
        validationKey: "cfop-operation-coherence",
        groupUnit: "itens",
      });
      if (!/^[1-7]\d{3}$/.test(cfop)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} com CFOP em formato inesperado`,
          message: "CFOP deve conter 4 dígitos e iniciar entre 1 e 7.",
          foundValue: cfop,
          xmlPath: getXmlElementPath(cfopElement),
          itemNumber,
        });
        return;
      }

      const isEntradaCfop = ["1", "2", "3"].includes(firstDigit);
      if ((tpNF === "1" && isEntradaCfop) || (tpNF === "0" && !isEntradaCfop)) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} com CFOP incompatível com tpNF`,
          message: "O primeiro dígito do CFOP não acompanha o tipo de operação informado em tpNF.",
          foundValue: cfop,
          expectedValue: tpNF === "1" ? "CFOP de saída (5, 6 ou 7)" : "CFOP de entrada (1, 2 ou 3)",
          xmlPath: getXmlElementPath(cfopElement),
          itemNumber,
        });
      }

      const expectedByIdDest = ["0", "1"].includes(tpNF)
        ? { 1: tpNF === "0" ? "1" : "5", 2: tpNF === "0" ? "2" : "6", 3: tpNF === "0" ? "3" : "7" }[idDest]
        : "";
      if (expectedByIdDest && firstDigit !== expectedByIdDest) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} com CFOP incompatível com idDest`,
          message: "O primeiro dígito do CFOP não acompanha o destino da operação informado em idDest.",
          foundValue: cfop,
          expectedValue: `CFOP iniciado por ${expectedByIdDest}`,
          xmlPath: getXmlElementPath(cfopElement),
          itemNumber,
        });
      }
    });
  }

  function validateXmlContributionOrder(analysis, context, groupName, rateTag, valueTag) {
    const percentageOrder = ["CST", "vBC", rateTag, valueTag];
    const quantityOrder = ["CST", "qBCProd", "vAliqProd", valueTag];

    elementsByLocalName(context.infNFe, groupName).forEach((group) => {
      const childNames = Array.from(group.children || []).map((child) => child.localName);
      const hasPercentageFields = percentageOrder.every((name) => childNames.includes(name));
      const hasQuantityFields = quantityOrder.every((name) => childNames.includes(name));
      const expectedOrder = hasPercentageFields ? percentageOrder : hasQuantityFields ? quantityOrder : null;
      if (!expectedOrder) return;

      const relevantOrder = childNames.filter((name) => expectedOrder.includes(name));
      addXmlCheck(analysis, "fields", `${groupName} com ordem estrutural analisada`, "validated", {
        validationKey: `${groupName.toLowerCase()}-field-order`,
        groupUnit: "campos",
      });
      if (relevantOrder.join("|") !== expectedOrder.join("|")) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `${groupName} com ordem estrutural inválida`,
          message: `A sequência esperada é ${expectedOrder.join(" > ")}.`,
          foundValue: relevantOrder.join(" > "),
          expectedValue: expectedOrder.join(" > "),
          xmlPath: getXmlElementPath(group),
        });
      }
    });
  }

  function validateXmlIcmsGroups(analysis, context) {
    context.detElements.forEach((det) => {
      const itemNumber = det.getAttribute("nItem") || "";
      const icms = firstElementByLocalName(firstElementByLocalName(det, "imposto"), "ICMS");
      if (!icms) return;

      const groups = Array.from(icms.children || []).filter((child) => /^ICMS/.test(child.localName));
      if (!groups.length) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} sem grupo tributário de ICMS`,
          message: "O grupo ICMS existe, mas não possui um subgrupo CST/CSOSN identificável.",
          xmlPath: getXmlElementPath(icms),
          itemNumber,
        });
        return;
      }
      if (groups.length > 1) {
        addXmlIssue(analysis, {
          severity: "warning",
          category: "fields",
          title: `Item ${itemNumber || ""} com múltiplos grupos de ICMS`,
          message: "O grupo ICMS possui mais de um subgrupo tributário CST/CSOSN.",
          foundValue: groups.map((group) => group.localName).join(", "),
          xmlPath: getXmlElementPath(icms),
          itemNumber,
        });
      }

      groups.forEach((group) => {
        const rule = icmsGroupRules[group.localName];
        if (!rule) return;

        addXmlCheck(analysis, "fields", "Grupo ICMS comparado com CST/CSOSN", "validated", {
          validationKey: "icms-group-code-coherence",
          groupUnit: "itens",
        });
        const codeElement = firstDirectChildByLocalName(group, rule.codeTag);
        const code = codeElement?.textContent.trim() || "";
        if (!code || !rule.codes.includes(code)) {
          addXmlIssue(analysis, {
            severity: "warning",
            category: "fields",
            title: `Item ${itemNumber || ""} com ${rule.codeTag} incompatível com ${group.localName}`,
            message: `O subgrupo ${group.localName} deve possuir ${rule.codeTag} compatível com sua estrutura.`,
            foundValue: code || "não informado",
            expectedValue: rule.codes.join(", "),
            xmlPath: getXmlElementPath(codeElement || group),
            itemNumber,
          });
        }

        rule.required.forEach((fieldName) => {
          if (firstDirectChildByLocalName(group, fieldName)) return;
          addXmlIssue(analysis, {
            severity: "warning",
            category: "fields",
            title: `Item ${itemNumber || ""} sem ${fieldName} em ${group.localName}`,
            message: "Campo obrigatório estrutural não encontrado dentro do grupo tributário analisado.",
            expectedValue: fieldName,
            xmlPath: getXmlElementPath(group),
            itemNumber,
          });
        });
      });
    });
  }

  function validateXmlItems(analysis, context) {
    let checks = 0;
    context.detElements.forEach((det) => {
      const prod = firstElementByLocalName(det, "prod");
      if (!prod) return;

      const itemNumber = det.getAttribute("nItem") || "";
      const description = firstDescendantText(prod, "xProd");
      const quantity = parseXmlDecimal(firstDescendantText(prod, "qCom"));
      const unitValue = parseXmlDecimal(firstDescendantText(prod, "vUnCom"));
      const informed = parseXmlDecimal(firstDescendantText(prod, "vProd"));
      if (quantity === null || unitValue === null || informed === null) return;

      checks += 1;
      addXmlCheck(analysis, "items", `qCom x vUnCom comparado com vProd`, "validated", {
        validationKey: "item-vprod-calculation",
        groupUnit: "itens",
      });
      const expectedCents = toCents(quantity * unitValue);
      const informedCents = toCents(informed);
      const difference = informedCents - expectedCents;
      if (Math.abs(difference) > analysis.toleranceCents) {
        const vProdElement = firstElementByLocalName(prod, "vProd");
        addXmlIssue(analysis, {
          severity: "warning",
          category: "items",
          title: `Item ${itemNumber || checks} com vProd divergente`,
          message: description || "O valor do produto não confere com quantidade x valor unitário comercial.",
          foundValue: formatXmlMoneyFromCents(informedCents),
          expectedValue: formatXmlMoneyFromCents(expectedCents),
          difference: formatXmlMoneyFromCents(Math.abs(difference)),
          xmlPath: getXmlElementPath(vProdElement || det),
          itemNumber,
        });
      }
    });

    if (!checks) {
      addXmlNotChecked(analysis, "items", "Nenhum item possuía qCom, vUnCom e vProd juntos para comparação segura.");
    }
  }

  function validateXmlCalculations(analysis, context) {
    let checks = 0;
    context.detElements.forEach((det) => {
      const itemNumber = det.getAttribute("nItem") || "";
      elementsByLocalName(det, "ICMS00").forEach((icms00) => {
        const base = parseXmlDecimal(firstDescendantText(icms00, "vBC"));
        const rate = parseXmlDecimal(firstDescendantText(icms00, "pICMS"));
        const informed = parseXmlDecimal(firstDescendantText(icms00, "vICMS"));
        if (base === null || rate === null || informed === null) return;

        checks += 1;
        addXmlCheck(analysis, "calculations", "vBC x pICMS comparado com vICMS", "validated", {
          validationKey: "icms00-vicms-calculation",
          groupUnit: "itens",
        });
        const expectedCents = toCents((base * rate) / 100);
        const informedCents = toCents(informed);
        const difference = informedCents - expectedCents;
        if (Math.abs(difference) > analysis.toleranceCents) {
          const vICMSElement = firstElementByLocalName(icms00, "vICMS");
          addXmlIssue(analysis, {
            severity: "warning",
            category: "calculations",
            title: `Item ${itemNumber || checks} com vICMS divergente`,
            message: "Comparação executada somente em ICMS00, onde a relação vBC x pICMS / 100 é direta.",
            foundValue: formatXmlMoneyFromCents(informedCents),
            expectedValue: formatXmlMoneyFromCents(expectedCents),
            difference: formatXmlMoneyFromCents(Math.abs(difference)),
            xmlPath: getXmlElementPath(vICMSElement || icms00),
            itemNumber,
          });
        }
      });
    });

    if (!checks) {
      addXmlNotChecked(analysis, "calculations", "Cálculos tributários detalhados não verificados; nenhum ICMS00 completo foi encontrado.");
    }
  }

  function validateXmlTotals(analysis, context) {
    const { detElements, icmsTot } = context;
    if (!icmsTot) {
      addXmlNotChecked(analysis, "totals", "Totalizadores não verificados porque ICMSTot não foi encontrado.");
      return;
    }

    totalizerChecks.forEach((check) => {
      const totalElement = directChildrenByLocalName(icmsTot, check.tag)[0];
      if (!totalElement) return;

      const totalValue = parseXmlDecimal(totalElement.textContent.trim());
      if (totalValue === null) return;

      addXmlCheck(analysis, "totals", check.label);

      let expectedCents = 0;
      if (check.source === "prod") {
        const prodElements = detElements.map((det) => firstElementByLocalName(det, "prod")).filter(Boolean);
        expectedCents = sumXmlValues(prodElements, check.tag);
      } else if (check.source === "icms") {
        expectedCents = sumXmlTaxValues(detElements, "ICMS", check.tag);
      } else {
        expectedCents = sumXmlTaxValues(detElements, check.source.toUpperCase(), check.tag);
      }

      const informedCents = toCents(totalValue);
      const difference = informedCents - expectedCents;
      if (Math.abs(difference) > analysis.toleranceCents) {
        addXmlIssue(analysis, {
          severity: "error",
          category: "totals",
          title: `${check.label} divergente`,
          message: "O valor informado no totalizador não confere com a soma objetiva dos itens analisados.",
          foundValue: formatXmlMoneyFromCents(informedCents),
          expectedValue: formatXmlMoneyFromCents(expectedCents),
          difference: formatXmlMoneyFromCents(Math.abs(difference)),
          xmlPath: getXmlElementPath(totalElement),
        });
      }
    });
  }

  function validateXmlDocument(xmlDocument, parserError) {
    const analysis = createXmlAnalysis();
    const context = validateXmlStructure(analysis, xmlDocument, parserError);

    if (context) {
      validateXmlFields(analysis, context);
      validateXmlNcm(analysis, context);
      validateXmlOperationCoherence(analysis, context);
      validateXmlContributionOrder(analysis, context, "PISOutr", "pPIS", "vPIS");
      validateXmlContributionOrder(analysis, context, "COFINSOutr", "pCOFINS", "vCOFINS");
      validateXmlIcmsGroups(analysis, context);
      validateXmlItems(analysis, context);
      validateXmlCalculations(analysis, context);
      validateXmlTotals(analysis, context);
    }

    finalizeXmlCategories(analysis);
    return analysis;
  }

  function xmlStatusIcon(status) {
    if (status === "validated") return "✓";
    if (status === "problem") return "!";
    if (status === "running" || status === "pending") return "◌";
    return "—";
  }

  function xmlStatusText(status) {
    if (status === "validated") return "Validado";
    if (status === "problem") return "Problemas encontrados";
    if (status === "running") return "Verificando";
    return "Não verificado";
  }

  function createNode(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createSvgIcon(pathData) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    return svg;
  }

  function createXmlCopyButton(label, value) {
    const button = createNode("button", "wc-xml-copy");
    button.type = "button";
    button.dataset.wcXmlCopyValue = String(value || "");
    button.dataset.wcXmlCopyLabel = label;
    button.setAttribute("aria-label", `Copiar ${label.toLowerCase()}`);
    button.title = "Copiar";

    const icon = createNode("span", "wc-xml-copy__icon");
    icon.appendChild(createSvgIcon("M8 7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V7zm2 0v9h7V7h-7zM5 9H3V5a2 2 0 0 1 2-2h9v2H5v4zm0 2h2v8h8v2H5a2 2 0 0 1-2-2v-8h2z"));
    const feedback = createNode("span", "wc-xml-copy__feedback", "✓");
    feedback.setAttribute("aria-hidden", "true");

    button.append(icon, feedback);
    return button;
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      return Promise.resolve();
    } finally {
      textarea.remove();
    }
  }

  function showXmlCopyFeedback(button) {
    window.clearTimeout(Number(button.dataset.wcXmlCopyTimer || 0));
    button.classList.add("is-copied");
    button.setAttribute("aria-label", "Copiado");
    button.title = "Copiado";

    const timer = window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", `Copiar ${button.dataset.wcXmlCopyLabel.toLowerCase()}`);
      button.title = "Copiar";
      button.dataset.wcXmlCopyTimer = "";
    }, 1400);
    button.dataset.wcXmlCopyTimer = String(timer);
  }

  function renderXmlPipeline(container, analysis, options = {}) {
    if (!container) return;

    const resolved = options.resolved || {};
    const running = options.running || "";
    container.replaceChildren();
    container.appendChild(createNode("span", "wc-xml-loading__spinner", ""));
    container.lastElementChild.setAttribute("aria-hidden", "true");
    container.appendChild(createNode("strong", "", "Analisando XML..."));
    container.appendChild(createNode("span", "", "Executando verificações locais e determinísticas"));

    const list = createNode("div", "wc-xml-pipeline");
    analysis.categories.forEach((category) => {
      const visualStatus = running === category.id ? "running" : resolved[category.id] || "pending";
      const item = createNode("div", `wc-xml-pipeline__item wc-xml-pipeline__item--${visualStatus}`);
      item.appendChild(createNode("span", "wc-xml-pipeline__icon", xmlStatusIcon(visualStatus)));
      const label = createNode("span", "wc-xml-pipeline__label", category.label);
      item.appendChild(label);
      if (resolved[category.id] === "problem") {
        item.appendChild(createNode("span", "wc-xml-pipeline__count", `${category.problems} problema${category.problems === 1 ? "" : "s"}`));
      }
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  function animateXmlPipeline(loadingContainer, analysis, prefersReducedMotion, done) {
    if (prefersReducedMotion) {
      const resolved = Object.fromEntries(analysis.categories.map((category) => [category.id, category.status]));
      renderXmlPipeline(loadingContainer, analysis, { resolved });
      window.setTimeout(done, 40);
      return;
    }

    const resolved = {};
    let index = 0;
    renderXmlPipeline(loadingContainer, analysis, { resolved });

    const step = () => {
      const category = analysis.categories[index];
      if (!category) {
        window.setTimeout(done, 140);
        return;
      }

      renderXmlPipeline(loadingContainer, analysis, { resolved, running: category.id });
      window.setTimeout(() => {
        resolved[category.id] = category.status;
        renderXmlPipeline(loadingContainer, analysis, { resolved });
        index += 1;
        window.setTimeout(step, 130);
      }, 190);
    };

    window.setTimeout(step, 120);
  }

  function renderXmlDocumentInfo(container, info) {
    if (!info) return;

    const wrapper = createNode("section", "wc-xml-doc-info");
    wrapper.appendChild(createNode("h3", "", "Documento identificado"));
    const grid = createNode("div", "wc-xml-doc-info__grid");
    const numberSeries = info.number ? `NF · ${info.number}${info.series ? ` / Série · ${info.series}` : ""}` : "";
    const entries = [
      ["Número / Série", numberSeries],
      ["Chave de acesso", info.accessKey, "full", info.accessKeyRaw],
      ["Endereço", info.address, "full"],
      ["Emissão", info.emission],
      ["Operação", info.operation],
      ["Emitente", info.emitter, "wide"],
      ["Destinatário", info.recipient, "wide"],
      ["Natureza da operação", info.operationNature, "full"],
    ].filter((entry) => entry[1]);

    entries.forEach(([label, value, size, copyValue]) => {
      const item = createNode("div", `wc-xml-doc-info__item${size ? ` wc-xml-doc-info__item--${size}` : ""}`);
      item.appendChild(createNode("span", "", label));
      item.appendChild(createNode("strong", "", value));
      item.appendChild(createXmlCopyButton(label, copyValue || value));
      grid.appendChild(item);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  function renderXmlCategoryChips(container, analysis) {
    const chips = createNode("div", "wc-xml-category-chips");
    analysis.categories.forEach((category) => {
      const chip = createNode(category.problems ? "button" : "span", `wc-xml-category-chip wc-xml-category-chip--${category.status}`);
      if (category.problems) {
        chip.type = "button";
        chip.dataset.wcXmlCategoryTarget = category.id;
      }
      chip.appendChild(createNode("span", "wc-xml-category-chip__icon", xmlStatusIcon(category.status)));
      chip.appendChild(createNode("span", "", category.shortLabel));
      if (category.problems) chip.appendChild(createNode("strong", "", String(category.problems)));
      chip.setAttribute("aria-label", `${category.label}: ${xmlStatusText(category.status)}`);
      chips.appendChild(chip);
    });
    container.appendChild(chips);
  }

  function groupXmlChecks(checks) {
    const grouped = [];
    const keyed = new Map();

    checks.forEach((check) => {
      if (!check.validationKey) {
        grouped.push({ ...check, count: 1 });
        return;
      }

      const key = `${check.category}:${check.status}:${check.validationKey}`;
      const existing = keyed.get(key);
      if (existing) {
        existing.count += 1;
        return;
      }

      const item = { ...check, count: 1 };
      keyed.set(key, item);
      grouped.push(item);
    });

    return grouped;
  }

  function formatXmlCheckLabel(check) {
    if (!check.count || check.count === 1) return check.label;

    return `${check.label} em ${check.count} ${check.groupUnit || "verificações"}`;
  }

  function renderXmlChecks(container, analysis) {
    const completedCount = analysis.checks.filter((check) => check.status === "validated").length;
    const completedLabel = completedCount === 1
      ? "1 verificação concluída"
      : `${completedCount} verificações concluídas`;
    const wrapper = createNode("section", "wc-xml-checks");
    const toggle = createNode("button", "wc-xml-checks__toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.dataset.wcXmlChecksToggle = "true";

    const header = createNode("span", "wc-xml-checks__header");
    header.appendChild(createNode("strong", "", "Verificações realizadas"));
    header.appendChild(createNode("span", "wc-xml-checks__count", completedLabel));
    toggle.appendChild(header);
    toggle.appendChild(createNode("span", "wc-xml-checks__chevron", "⌄"));
    wrapper.appendChild(toggle);

    const list = createNode("div", "wc-xml-checks__list");
    list.hidden = true;

    const visibleChecks = groupXmlChecks(analysis.checks);
    visibleChecks.slice(0, 80).forEach((check) => {
      const item = createNode("div", `wc-xml-checks__item wc-xml-checks__item--${check.status}`);
      item.appendChild(createNode("span", "", xmlStatusIcon(check.status)));
      item.appendChild(createNode("span", "", formatXmlCheckLabel(check)));
      list.appendChild(item);
    });

    if (visibleChecks.length > 80) {
      list.appendChild(createNode("div", "wc-xml-checks__more", `+ ${visibleChecks.length - 80} tipos de verificação adicionais`));
    }

    wrapper.appendChild(list);
    container.appendChild(wrapper);
  }

  function renderXmlIssueDetails(card, issue) {
    const details = [
      ["Informado", issue.foundValue],
      ["Esperado", issue.expectedValue],
      ["Diferença", issue.difference],
    ].filter((entry) => entry[1] !== null && entry[1] !== undefined && entry[1] !== "");

    if (!details.length) return;

    const grid = createNode("dl", "wc-xml-issue__details");
    details.forEach(([label, value]) => {
      grid.appendChild(createNode("dt", "", label));
      grid.appendChild(createNode("dd", "", String(value)));
    });
    card.appendChild(grid);
  }

  function renderXmlIssues(container, analysis) {
    const issuesByCategory = analysis.categories
      .map((category) => ({
        category,
        issues: analysis.issues.filter((issue) => issue.category === category.id),
      }))
      .filter((group) => group.issues.length);

    if (!issuesByCategory.length) return;

    const wrapper = createNode("section", "wc-xml-issues");
    wrapper.appendChild(createNode("h3", "", "Inconsistências encontradas"));

    issuesByCategory.forEach(({ category, issues }) => {
      const group = createNode("div", "wc-xml-issue-group");
      group.dataset.wcXmlCategoryGroup = category.id;
      const title = createNode("h4", "", category.label);
      title.appendChild(createNode("span", "", `${issues.length} inconsistência${issues.length === 1 ? "" : "s"}`));
      group.appendChild(title);

      issues.forEach((issue) => {
        const card = createNode("article", `wc-xml-issue wc-xml-issue--${issue.severity}`);
        const header = createNode("div", "wc-xml-issue__header");
        header.appendChild(createNode("strong", "", issue.title));
        if (issue.itemNumber) header.appendChild(createNode("span", "", `Item ${issue.itemNumber}`));
        card.appendChild(header);
        if (issue.message) card.appendChild(createNode("p", "", issue.message));
        renderXmlIssueDetails(card, issue);
        if (issue.xmlPath) {
          const button = createNode("button", "wc-xml-locate", "Localizar no XML");
          button.type = "button";
          button.dataset.wcXmlLocate = issue.xmlPath;
          card.appendChild(button);
        }
        group.appendChild(card);
      });

      wrapper.appendChild(group);
    });

    container.appendChild(wrapper);
  }

  function renderXmlAnalysisResult(container, analysis) {
    const problemCount = analysis.issues.length;
    const checkCount = analysis.categories.reduce((total, category) => total + category.checks, 0);
    container.className = `wc-tool-result wc-xml-analysis wc-xml-analysis--${problemCount ? "problem" : "success"}`;
    container.replaceChildren();

    const summary = createNode("section", "wc-xml-summary");
    summary.appendChild(createNode("h2", "", "Análise concluída"));
    summary.appendChild(createNode(
      "p",
      "",
      problemCount
        ? `${problemCount} inconsistência${problemCount === 1 ? " foi encontrada" : "s foram encontradas"} nas verificações realizadas.`
        : "Nenhuma inconsistência foi encontrada nas verificações realizadas."
    ));

    const counters = createNode("div", "wc-xml-summary__counters");
    counters.appendChild(createNode("span", "", `${checkCount} verificações realizadas`));
    counters.appendChild(createNode("span", "", `${problemCount} inconsistência${problemCount === 1 ? "" : "s"} encontrada${problemCount === 1 ? "" : "s"}`));
    summary.appendChild(counters);
    renderXmlCategoryChips(summary, analysis);
    summary.appendChild(createNode("p", "wc-xml-summary__note", "Esta análise não substitui a validação/autorização da SEFAZ."));
    container.appendChild(summary);

    renderXmlDocumentInfo(container, analysis.documentInfo);
    renderXmlIssues(container, analysis);
    renderXmlChecks(container, analysis);
  }

  function findXmlTreeLineByPath(tree, path) {
    if (!path) return null;
    if (window.CSS?.escape) {
      return tree.querySelector(`[data-wc-xml-path="${window.CSS.escape(path)}"]`);
    }
    return Array.from(tree.querySelectorAll("[data-wc-xml-path]")).find((element) => element.dataset.wcXmlPath === path) || null;
  }

  function initializeXmlValidator() {
    const fileInput = document.querySelector("[data-wc-xml-file]");
    const textarea = document.querySelector("[data-wc-xml-content]");
    const button = document.querySelector("[data-wc-xml-validate]");
    const result = document.querySelector("[data-wc-xml-result]");
    const editor = document.querySelector("[data-wc-xml-editor]");
    const editorTitle = document.querySelector("[data-wc-xml-editor-title]");
    const loading = document.querySelector("[data-wc-xml-loading]");
    const tree = document.querySelector("[data-wc-xml-tree]");
    const actions = document.querySelector("[data-wc-xml-actions]");
    const expandButton = document.querySelector("[data-wc-xml-expand]");
    const collapseButton = document.querySelector("[data-wc-xml-collapse]");
    const editButton = document.querySelector("[data-wc-xml-edit]");
    const fullscreenButton = document.querySelector("[data-wc-xml-fullscreen]");
    const dropzone = document.querySelector(".wc-xml-dropzone");

    if (!fileInput || !textarea || !button || !result || !editor || !loading || !tree || button.dataset.wcReady) return;
    button.dataset.wcReady = "true";
    let originalXml = "";
    let xmlFullscreen = null;

    const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getStickyOffset = () => {
      const stickySelectors = [".md-header", ".md-tabs"];
      const offset = stickySelectors.reduce((total, selector) => {
        const element = document.querySelector(selector);
        if (!element) return total;

        const style = window.getComputedStyle(element);
        if (style.position !== "sticky" && style.position !== "fixed") return total;

        return total + element.getBoundingClientRect().height;
      }, 0);

      return offset + 16;
    };

    const scrollXmlEditorIntoView = () => {
      const top = editor.getBoundingClientRect().top + window.scrollY - getStickyOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };

    const scrollXmlResultIntoView = () => {
      const top = result.getBoundingClientRect().top + window.scrollY - getStickyOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };

    const scheduleXmlEditorScroll = () => {
      window.requestAnimationFrame(scrollXmlEditorIntoView);
    };

    const scheduleXmlResultScroll = () => {
      window.requestAnimationFrame(scrollXmlResultIntoView);
    };

    const setEditorState = (state) => {
      editor.classList.toggle("wc-xml-editor--editing", state === "edit");
      editor.classList.toggle("wc-xml-editor--loading", state === "loading");
      editor.classList.toggle("wc-xml-editor--viewing", state === "view");

      textarea.hidden = state !== "edit";
      loading.hidden = state !== "loading";
      tree.hidden = state !== "view";
      if (actions) actions.hidden = state !== "view";
      if (editorTitle) editorTitle.textContent = state === "view" ? "XML analisado" : "Conteúdo do XML";

      button.hidden = state === "view";
      button.disabled = state === "loading";
    };

    const clearTree = () => {
      tree.replaceChildren();
    };

    const closeXmlFullscreen = ({ restoreFocus = true } = {}) => {
      if (!xmlFullscreen) return;

      const { overlay, placeholder, handleKeydown } = xmlFullscreen;
      document.removeEventListener("keydown", handleKeydown);
      editor.classList.remove("wc-xml-editor--fullscreen");
      if (fullscreenButton) {
        fullscreenButton.textContent = "Ampliar";
        fullscreenButton.setAttribute("aria-label", "Ampliar XML analisado");
      }
      if (placeholder.parentNode) {
        placeholder.parentNode.insertBefore(editor, placeholder);
        placeholder.remove();
      }
      overlay.remove();
      document.body.classList.remove("wc-xml-fullscreen-open");
      xmlFullscreen = null;
      if (restoreFocus) fullscreenButton?.focus({ preventScroll: true });
    };

    const editXml = () => {
      closeXmlFullscreen({ restoreFocus: false });
      textarea.value = originalXml || textarea.value;
      clearTree();
      setEditorState("edit");
      try {
        textarea.focus({ preventScroll: true });
      } catch (error) {
        textarea.focus();
      }
      scheduleXmlEditorScroll();
    };

    const setAllTreeNodes = (collapsed) => {
      tree.querySelectorAll(".wc-xml-node[data-collapsible='true']").forEach((node) => {
        setXmlNodeCollapsed(node, collapsed);
      });
    };

    const openXmlFullscreen = () => {
      if (xmlFullscreen || tree.hidden) return;

      const placeholder = document.createComment("wc-xml-editor-placeholder");
      const overlay = document.createElement("div");
      const panel = document.createElement("div");

      overlay.className = "wc-xml-fullscreen";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "XML analisado em tela cheia");
      panel.className = "wc-xml-fullscreen__panel";

      const handleKeydown = (event) => {
        if (event.key === "Escape") closeXmlFullscreen();
      };

      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeXmlFullscreen();
      });
      document.addEventListener("keydown", handleKeydown);

      editor.before(placeholder);
      editor.classList.add("wc-xml-editor--fullscreen");
      if (fullscreenButton) {
        fullscreenButton.textContent = "×";
        fullscreenButton.setAttribute("aria-label", "Fechar tela cheia do XML");
      }
      panel.append(editor);
      overlay.append(panel);
      document.body.append(overlay);
      document.body.classList.add("wc-xml-fullscreen-open");
      xmlFullscreen = { overlay, placeholder, handleKeydown };
      fullscreenButton?.focus({ preventScroll: true });
    };

    const locateXmlPath = (path) => {
      const target = findXmlTreeLineByPath(tree, path);
      if (!target) return;

      let parentNode = target.closest(".wc-xml-node");
      while (parentNode) {
        setXmlNodeCollapsed(parentNode, false);
        parentNode = parentNode.parentElement?.closest(".wc-xml-node");
      }

      const line = target.classList.contains("wc-xml-tree__line")
        ? target
        : target.querySelector(":scope > .wc-xml-tree__line");
      if (!line) return;

      tree.querySelectorAll(".wc-xml-tree__line.is-highlighted").forEach((highlighted) => {
        highlighted.classList.remove("is-highlighted");
      });

      scrollXmlEditorIntoView();
      window.requestAnimationFrame(() => {
        const treeRect = tree.getBoundingClientRect();
        const lineRect = line.getBoundingClientRect();
        const top = Math.max(0, tree.scrollTop + lineRect.top - treeRect.top - tree.clientHeight * 0.32);

        tree.scrollTo({
          top,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        line.classList.add("is-highlighted");
        window.setTimeout(() => line.classList.remove("is-highlighted"), 2800);
      });
    };

    tree.addEventListener("click", (event) => {
      const toggle = event.target.closest(".wc-xml-tree__toggle");
      if (!toggle || !tree.contains(toggle)) return;

      const node = toggle.closest(".wc-xml-node");
      if (node) {
        setXmlNodeCollapsed(node, !node.classList.contains("is-collapsed"));
      }
    });

    expandButton?.addEventListener("click", () => setAllTreeNodes(false));
    collapseButton?.addEventListener("click", () => setAllTreeNodes(true));
    editButton?.addEventListener("click", editXml);
    fullscreenButton?.addEventListener("click", () => {
      if (xmlFullscreen) closeXmlFullscreen();
      else openXmlFullscreen();
    });

    result.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-wc-xml-copy-value]");
      if (copyButton) {
        event.preventDefault();
        event.stopPropagation();
        copyTextToClipboard(copyButton.dataset.wcXmlCopyValue)
          .then(() => showXmlCopyFeedback(copyButton))
          .catch(() => {
            copyButton.classList.add("is-copy-error");
            window.setTimeout(() => copyButton.classList.remove("is-copy-error"), 1000);
          });
        return;
      }

      const checksButton = event.target.closest("[data-wc-xml-checks-toggle]");
      if (checksButton) {
        const checks = checksButton.closest(".wc-xml-checks");
        const list = checks?.querySelector(".wc-xml-checks__list");
        const expanded = checksButton.getAttribute("aria-expanded") === "true";
        checksButton.setAttribute("aria-expanded", String(!expanded));
        checksButton.querySelector(".wc-xml-checks__chevron").textContent = expanded ? "⌄" : "⌃";
        if (list) list.hidden = expanded;
        return;
      }

      const locateButton = event.target.closest("[data-wc-xml-locate]");
      if (locateButton) {
        locateXmlPath(locateButton.dataset.wcXmlLocate);
        return;
      }

      const categoryButton = event.target.closest("[data-wc-xml-category-target]");
      if (categoryButton) {
        const group = result.querySelector(`[data-wc-xml-category-group="${categoryButton.dataset.wcXmlCategoryTarget}"]`);
        group?.scrollIntoView({
          block: "start",
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    });

    const loadFile = (file) => {
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".xml")) {
        setXmlResult(result, "error", "Selecione um arquivo com extensão .xml.");
        setEditorState("edit");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        textarea.value = String(reader.result || "");
        originalXml = textarea.value;
        clearTree();
        setEditorState("edit");
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
      originalXml = textarea.value;
      const content = originalXml.trim();

      if (!content) {
        setXmlResult(result, "error", "Informe um XML para validar.");
        clearTree();
        setEditorState("edit");
        return;
      }

      result.textContent = "";
      result.className = "wc-tool-result";
      clearTree();
      setEditorState("loading");

      const validationStartedAt = window.performance.now();
      const xmlDocument = new DOMParser().parseFromString(content, "application/xml");
      const error = parserErrorMessage(xmlDocument);
      const analysis = validateXmlDocument(xmlDocument, error);
      const validationElapsed = window.performance.now() - validationStartedAt;
      renderXmlPipeline(loading, analysis);

      const finish = () => {
        if (error) {
          renderXmlCodeFallback(tree, originalXml);
          setEditorState("view");
          renderXmlAnalysisResult(result, analysis);
          scheduleXmlResultScroll();
          return;
        }

        renderXmlTree(tree, xmlDocument);
        setAllTreeNodes(false);
        setEditorState("view");
        renderXmlAnalysisResult(result, analysis);
        scheduleXmlResultScroll();
      };

      animateXmlPipeline(loading, analysis, prefersReducedMotion() || validationElapsed > 700, finish);
    });

    textarea.addEventListener("input", () => {
      if (!textarea.value.trim()) {
        result.textContent = "";
        result.className = "wc-tool-result";
      }
    });

    setEditorState("edit");
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
