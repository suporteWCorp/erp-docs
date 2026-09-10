(function () {
  const stopWords = new Set([
    "a",
    "ao",
    "aos",
    "as",
    "da",
    "das",
    "de",
    "do",
    "dos",
    "e",
    "em",
    "eu",
    "na",
    "nas",
    "no",
    "nos",
    "o",
    "os",
    "pra",
    "para",
    "por",
    "um",
    "uma",
    "uns",
    "umas",
    "wcorp"
  ]);

  const singularWords = new Map([
    ["clientes", "cliente"],
    ["compras", "compra"],
    ["condicoes", "condicao"],
    ["contratos", "contrato"],
    ["documentos", "documento"],
    ["empresas", "empresa"],
    ["erros", "erro"],
    ["fiscais", "fiscal"],
    ["fornecedores", "fornecedor"],
    ["guias", "guia"],
    ["materiais", "material"],
    ["modulos", "modulo"],
    ["notas", "nota"],
    ["pedidos", "pedido"],
    ["produtos", "produto"],
    ["rejeicoes", "rejeicao"],
    ["relatorios", "relatorio"],
    ["usuarios", "usuario"],
    ["vendedores", "vendedor"]
  ]);

  const indexTitles = new Set([
    "central de ajuda wcorp",
    "guia",
    "guias",
    "manual",
    "manuais",
    "manuais do wcorp",
    "referencias",
    "erros e solucoes",
    "rejeicoes fiscais",
    "faq",
    "ferramentas",
    "suporte"
  ]);

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\bnf[\s-]*e\b/g, "nfe")
      .replace(/\bnfc[\s-]*e\b/g, "nfce")
      .replace(/\bnfs[\s-]*e\b/g, "nfse")
      .replace(/\bct[\s-]*e\b/g, "cte")
      .replace(/\bmdf[\s-]*e\b/g, "mdfe")
      .replace(/\bicms[\s-]*st\b/g, "icmsst")
      .replace(/[^a-z0-9\s/.-]/g, " ")
      .replace(/[/.:-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizePath(value) {
    return normalizeText(value).replace(/\s+/g, "/");
  }

  function normalizeToken(value) {
    const token = normalizeText(value).replace(/\s+/g, "");
    return singularWords.get(token) || token;
  }

  function tokenize(value, options = {}) {
    const tokens = normalizeText(value)
      .match(/[a-z0-9]+/g)
      ?.map(normalizeToken)
      .filter((token) => token.length > 1 && (options.keepStopWords || !stopWords.has(token))) || [];

    return [...new Set(tokens)];
  }

  function extractCodes(value) {
    return normalizeText(value).match(/\b\d{3,4}\b/g) || [];
  }

  function wordRegExp(word) {
    return new RegExp(`\\b${String(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
  }

  function includesWord(source, word) {
    return wordRegExp(normalizeToken(word)).test(normalizeText(source));
  }

  function isIndexDoc(doc) {
    const title = normalizeText(doc?.title);
    const location = normalizeText(doc?.location || doc?.url || doc?.path);
    const segments = location.split(" ").filter(Boolean);

    if (indexTitles.has(title)) {
      return true;
    }

    if (segments.length <= 1) {
      return true;
    }

    if (
      segments.length === 2 &&
      ["como", "fazer"].every((segment) => segments.includes(segment))
    ) {
      return true;
    }

    if (
      segments.length <= 2 &&
      ["manual", "referencia", "ferramentas", "suporte"].includes(segments[0])
    ) {
      return true;
    }

    if (
      segments.length <= 3 &&
      segments[0] === "erros" &&
      segments[1] === "solucoes"
    ) {
      return true;
    }

    return / geral$/.test(title) || /(^|\s)(index|visao geral)(\s|$)/.test(title);
  }

  function scoreDocument(doc, query, options = {}) {
    const normalizedQuery = normalizeText(query);
    const title = normalizeText(doc?.title);
    const location = normalizeText(doc?.location || doc?.url || doc?.path);
    const text = normalizeText(doc?.text);

    const combined = `${title} ${location} ${text}`;
    const tokens = tokenize(query);
    const meaningfulTokens = tokens.filter((token) => !stopWords.has(token));
    const codes = extractCodes(query);
    const indexDoc = isIndexDoc(doc);
    let score = 0;

    if (!normalizedQuery) {
      return 0;
    }

    codes.forEach((code) => {
      const exactCode = wordRegExp(code);
      if (exactCode.test(title)) score += 520;
      if (exactCode.test(location)) score += 420;
      if (exactCode.test(text)) score += 120;
    });

    if (codes.length && score === 0) {
      return -120;
    }

    if (title === normalizedQuery) score += 420;
    if (title.startsWith(normalizedQuery)) score += 260;
    if (title.includes(normalizedQuery)) score += 220;
    if (location.includes(normalizedQuery)) score += 160;
    if (text.includes(normalizedQuery)) score += 20;

    const titleHits = meaningfulTokens.filter((token) => includesWord(title, token)).length;
    const locationHits = meaningfulTokens.filter((token) => includesWord(location, token)).length;
    const textHits = meaningfulTokens.filter((token) => includesWord(text, token)).length;

    score += titleHits * 55;
    score += locationHits * 36;
    score += Math.min(textHits, 6) * 8;

    if (meaningfulTokens.length > 1 && titleHits === meaningfulTokens.length) {
      score += 180;
    }

    if (meaningfulTokens.length > 1 && locationHits === meaningfulTokens.length) {
      score += 95;
    }

    if (meaningfulTokens.length && meaningfulTokens.every((token) => includesWord(combined, token))) {
      score += 70;
    }

    if (
      options.intent === "guide" &&
      (location.includes("como fazer") || title.includes("como "))
    ) {
      score += 90;
    }

    if (
      options.intent === "manual" &&
      !location.includes("como fazer") &&
      !location.includes("erros solucoes")
    ) {
      score += 55;
    }

    if (
      options.intent === "error" &&
      (title.includes("rejeicao") || location.includes("rejeicoes fiscais") || location.includes("erros solucoes"))
    ) {
      score += 120;
    }

    if (indexDoc && (meaningfulTokens.length > 1 || codes.length)) {
      score -= 260;
    } else if (indexDoc) {
      score -= 100;
    }

    /* Distinção semântica consulta vs ajuste (não hardcodado) — assess depois de score existir */
    const queryLower = (query || '').toLowerCase();
    const isConsultQuery = /(consultar|verificar|visualizar|ver|vejo|veja|vê|conferir|saldo|posição).*estoque|(estoque.*(consultar|verificar|visualizar|ver|vejo|veja|vê|conferir|saldo))/.test(queryLower);
    const isAdjustQuery = /(ajustar|corrigir|acertar).*estoque|(estoque.*(ajustar|corrigir|acertar))/.test(queryLower) || /(inventário|contagem)/.test(queryLower);
    if (isConsultQuery && doc?.location && doc.location.includes('consultar-estoque')) score += 3.0;
    if (isConsultQuery && doc?.location && doc.location.includes('ajustar-estoque')) score -= 2.0;
    if (isAdjustQuery && doc?.location && doc.location.includes('ajustar-estoque')) score += 3.0;
    if (isAdjustQuery && doc?.location && doc.location.includes('consultar-estoque')) score -= 2.0;
    /* Penalizar FAQ estoque-negativo em query genérica (sem 'negativo') */
    if (queryLower.includes('estoque') && !queryLower.includes('negativo')) {
      if (doc?.location && doc.location.includes('estoque-negativo')) score -= 80;
    }
    /* Remover expansão errada: inventário ≠ consultar */
    if (queryLower.includes('verificar') || queryLower.includes('consultar')) {
      if (doc?.title && doc.title.toLowerCase().includes('inventário') && !doc.title.toLowerCase().includes('consultar')) score -= 1.5;
    }

    return score;
  }

  window.WCorpSearchUtils = {
    normalizeText,
    normalizePath,
    normalizeToken,
    tokenize,
    extractCodes,
    includesWord,
    isIndexDoc,
    scoreDocument
  };
})();
