(function () {
  const storageKey = "wcorpAssistantSession";
  const avatarStorageKey = "wcorpAssistantAvatar";
  const MIN_TEXT_RESPONSE_DELAY = 520;
  const MAX_TEXT_RESPONSE_DELAY = 760;
  const MIN_CARDS_RESPONSE_DELAY = 360;
  const MAX_CARDS_RESPONSE_DELAY = 620;
  const MIN_ASSISTANT_RESULT_SCORE = 35;
  const MIN_ASSISTANT_RELATED_SCORE = 70;
  const MAX_ASSISTANT_RELATED_RESULTS = 2;
  const manualPrefixes = new Set([
    "administracao",
    "colaboradores",
    "comercial",
    "compras",
    "contratos",
    "faturamento",
    "financeiro",
    "fornecedores",
    "materiais",
    "producao",
    "relatorios",
    "servicos",
    "transportes"
  ]);

  const assistantStopWords = new Set([
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
    "umas"
  ]);

  const assistantAuxiliaryTerms = new Set([
    "agora",
    "ajuda",
    "ajudar",
    "alterar",
    "cadastrar",
    "cadastro",
    "como",
    "configurar",
    "consultar",
    "criar",
    "emitir",
    "faturar",
    "faco",
    "fazer",
    "gerar",
    "guia",
    "manual",
    "preciso",
    "quero",
    "realizar"
  ]);

  const assistantSpecificTermGroups = [
    { label: "orçamento", terms: ["orcamento", "orcamentos"] },
    { label: "pedido", terms: ["pedido", "pedidos"] },
    { label: "boleto", terms: ["boleto", "boletos"] },
    { label: "nota fiscal", terms: ["nota fiscal", "notas fiscais", "nota", "notas", "nfe", "nf", "emitir nota", "emitir nfe", "faturar", "faturar nota"] },
    { label: "cupom fiscal", terms: ["cupom fiscal", "nfce", "cupom"] },
    { label: "cliente", terms: ["cliente", "clientes"] },
    { label: "fornecedor", terms: ["fornecedor", "fornecedores"] },
    { label: "material", terms: ["material", "materiais", "produto", "produtos"] },
    { label: "contrato", terms: ["contrato", "contratos"] },
    { label: "relatório", terms: ["relatorio", "relatorios"] },
    { label: "comissão", terms: ["comissao", "comissoes"] },
    { label: "estoque", terms: ["estoque", "estoques"] },
    { label: "CFOP", terms: ["cfop"] },
    { label: "ICMS", terms: ["icms"] },
    { label: "XML", terms: ["xml", "schema"] },
    { label: "ordem de serviço", terms: ["ordem de servico", "os"] },
    { label: "CT-e", terms: ["cte"] },
    { label: "NFS-e", terms: ["nfse"] },
    { label: "MDF-e", terms: ["mdfe"] }
  ];

  const assistantPageProfiles = [
    {
      path: "como-fazer/faturar-nota",
      category: "Guia",
      audience: "user",
      assistantSearchable: true,
      tags: ["faturar nota", "faturar a nota", "faturar", "emitir nota", "emitir nfe", "nota fiscal", "nfe"]
    },
    {
      path: "suporte/coleta-de-evidencias",
      category: "Suporte",
      audience: "support",
      assistantSearchable: "conditional",
      tags: [
        "coleta de evidencias",
        "coletar evidencias",
        "evidencia",
        "evidencias",
        "enviar evidencias",
        "enviar arquivos",
        "arquivos do chamado",
        "abrir chamado",
        "suporte",
        "chamado",
        "print",
        "prints",
        "tirar print",
        "xml",
        "logs",
        "log",
        "erro no sistema"
      ]
    },
    {
      path: "suporte/triagem",
      category: "Suporte interno",
      audience: "internal",
      assistantSearchable: "conditional",
      tags: ["triagem", "triagem de suporte", "atendimento", "chamado", "classificacao do chamado"]
    },
    {
      path: "como-documentar",
      category: "Interno",
      audience: "internal",
      assistantSearchable: false,
      tags: []
    },
    {
      path: "referencia/erros-comuns",
      category: "Interno",
      audience: "internal",
      assistantSearchable: false,
      tags: []
    },
    {
      path: "referencia/atualizacoes-fiscais",
      category: "Referência",
      audience: "review",
      assistantSearchable: "conditional",
      tags: ["atualizacao fiscal", "atualizacoes fiscais", "nota tecnica", "sefaz", "mudanca fiscal"]
    }
  ];

  const assistantAvatars = [
    "assets/avatar_homem_oculos.png",
    "assets/avatar_mulher.png",
    "assets/avatar_mulher_afro.png",
    "assets/avatar_homem_azul.png"
  ];

  const suggestions = [
    { label: "Como emitir uma NF-e?", href: "como-fazer/faturar-nota/" },
    { label: "Como cadastrar um cliente?", href: "como-fazer/cadastrar-cliente/" },
    { label: "Como gerar um pedido?", href: "como-fazer/fazer-pedido-venda/" },
    { label: "Como cancelar uma nota?", href: "como-fazer/cancelar-nfe/" }
  ];

  let assistantSearchPromise = null;
  let assistantPublishedManualPaths = null;

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");

    if (!logo) {
      return new URL("/", window.location.href).href;
    }

    return /\/index\.html$/.test(new URL(logo.href).pathname)
      ? new URL(".", logo.href).href
      : logo.href;
  }

  function getAssistantAvatar() {
    try {
      const saved = sessionStorage.getItem(avatarStorageKey);

      if (assistantAvatars.includes(saved)) {
        return saved;
      }

      const selected =
        assistantAvatars[Math.floor(Math.random() * assistantAvatars.length)];

      sessionStorage.setItem(avatarStorageKey, selected);

      return selected;
    } catch (_error) {
      return assistantAvatars[0];
    }
  }

  function assistantIcon() {
    const icon = document.createElement("img");

    icon.className = "wc-assistant__agent-icon";
    icon.src = new URL(getAssistantAvatar(), rootUrl()).href;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");

    return icon;
  }

  function createMessage(text, fromUser = false) {
    const message = document.createElement("div");

    message.className =
      `wc-assistant__message${fromUser ? " wc-assistant__message--user" : ""}`;

    message.textContent = text;

    return message;
  }

  function createHtmlMessage(html) {
    const message = document.createElement("div");

    message.className = "wc-assistant__message";
    message.innerHTML = html;

    return message;
  }

  function createTypingMessage() {
    const message = document.createElement("div");

    message.className =
      "wc-assistant__message wc-assistant__typing";

    message.setAttribute(
      "aria-label",
      "Assistente digitando"
    );

    message.innerHTML = [
      '<span class="wc-assistant__typing-dot"></span>',
      '<span class="wc-assistant__typing-dot"></span>',
      '<span class="wc-assistant__typing-dot"></span>'
    ].join("");

    return message;
  }

  function createSuggestions() {
    const wrapper = document.createElement("div");

    wrapper.className = "wc-assistant__suggestions";

    suggestions.forEach((item) => {
      const link = document.createElement("a");

      link.className = "wc-assistant__suggestion";
      link.href = new URL(item.href, rootUrl()).href;
      link.textContent = item.label;

      wrapper.appendChild(link);
    });

    return wrapper;
  }

  function loadState() {
    try {
      return JSON.parse(
        sessionStorage.getItem(storageKey) || "null"
      );
    } catch (_error) {
      return null;
    }
  }

  function isReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  /*
   * ============================
   * BUSCA LOCAL DA DOCUMENTAÇÃO
   * ============================
   */

  function getSearchIndexUrl() {
    return new URL(
      "search/search_index.json",
      rootUrl()
    ).href;
  }

  async function loadSearchIndex() {
    if (assistantSearchPromise) {
      return assistantSearchPromise;
    }

    assistantSearchPromise = fetch(getSearchIndexUrl())
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Falha ao carregar índice de busca: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        return Array.isArray(data?.docs)
          ? data.docs
          : [];
      })
      .catch((error) => {
        console.error(
          "Assistente WCorp: não foi possível carregar o índice de busca.",
          error
        );

        return [];
      });

    return assistantSearchPromise;
  }

  function normalizeAssistantSearch(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\bnf[\s-]*e\b/g, "nfe")
      .replace(/\bnfc[\s-]*e\b/g, "nfce")
      .replace(/\bnfs[\s-]*e\b/g, "nfse")
      .replace(/\bct[\s-]*e\b/g, "cte")
      .replace(/\bmdf[\s-]*e\b/g, "mdfe")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeAssistantPath(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\\/g, "/")
      .trim();
  }

  function cleanAssistantPathname(pathname) {
    return pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  }

  function assistantPortalPath(url) {
    const root = cleanAssistantPathname(new URL(rootUrl(), window.location.href).pathname);
    const path = cleanAssistantPathname(url.pathname);
    const relative =
      root !== "/" && path.startsWith(root)
        ? path.slice(root.length) || "/"
        : path;

    return cleanAssistantPathname(relative.startsWith("/") ? relative : `/${relative}`);
  }

  function assistantManualPathFromLocation(location) {
    try {
      return assistantPortalPath(new URL(assistantPageLocation(location), rootUrl()));
    } catch (_error) {
      return "";
    }
  }

  function isAssistantManualPortalPath(path) {
    const firstSegment = path.replace(/^\/+/, "").split("/")[0];
    return manualPrefixes.has(firstSegment) && !/-geral$/.test(path);
  }

  function assistantPublishedManualPagePaths() {
    if (assistantPublishedManualPaths) {
      return assistantPublishedManualPaths;
    }

    assistantPublishedManualPaths = new Set();

    document.querySelectorAll(".md-sidebar--primary .md-nav--primary a.md-nav__link[href]").forEach((link) => {
      try {
        const path = assistantPortalPath(new URL(link.href, window.location.href));

        if (isAssistantManualPortalPath(path)) {
          assistantPublishedManualPaths.add(path);
        }
      } catch (_error) {
        // Ignora links inválidos criados por navegação temporária.
      }
    });

    return assistantPublishedManualPaths;
  }

  function isAssistantBlockedManualDoc(doc) {
    const path = assistantManualPathFromLocation(doc.location);

    if (!isAssistantManualPortalPath(path)) {
      return false;
    }

    const publishedPaths = assistantPublishedManualPagePaths();
    return publishedPaths.size > 0 && !publishedPaths.has(path);
  }

  function assistantProfilePathKey(value) {
    return normalizeAssistantPath(value)
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
  }

  function assistantPageProfile(doc) {
    const key = assistantProfilePathKey(assistantPageKey(doc.location));

    return assistantPageProfiles.find((profile) => {
      const profileKey = assistantProfilePathKey(profile.path);
      return key === profileKey || key.startsWith(`${profileKey}/`);
    }) || null;
  }

  function assistantProfileMatchesQuery(profile, analysis, query) {
    if (!profile) {
      return true;
    }

    if (profile.assistantSearchable === false) {
      return false;
    }

    if (profile.assistantSearchable !== "conditional") {
      return true;
    }

    const normalizedQuery = normalizeAssistantSearch(query);
    const queryWords = new Set(analysis.words);
    const matchedTag = (profile.tags || []).some((tag) => {
      const normalizedTag = normalizeAssistantSearch(tag);

      if (!normalizedTag) {
        return false;
      }

      if (normalizedTag.includes(" ")) {
        return normalizedQuery.includes(normalizedTag);
      }

      return queryWords.has(normalizedTag);
    });

    if (!matchedTag) {
      return false;
    }

    if (profile.path === "suporte/coleta-de-evidencias") {
      const supportIntent =
        /\b(suporte|chamado|evidencia|evidencias|print|prints|arquivo|arquivos|anexo|anexar|coletar|coleta)\b/.test(normalizedQuery) ||
        /\b(o que|oque|quais)\b.*\b(enviar|mandar)\b/.test(normalizedQuery);

      return supportIntent;
    }

    return true;
  }

  function assistantProfileScore(profile, analysis, query) {
    if (!profile?.tags?.length) {
      return 0;
    }

    const normalizedQuery = normalizeAssistantSearch(query);
    const queryWords = new Set(analysis.words);

    return profile.tags.reduce((score, tag) => {
      const normalizedTag = normalizeAssistantSearch(tag);

      if (!normalizedTag) {
        return score;
      }

      if (normalizedTag.includes(" ") && normalizedQuery.includes(normalizedTag)) {
        return score + 90;
      }

      if (queryWords.has(normalizedTag)) {
        return score + 26;
      }

      return score;
    }, 0);
  }

  function getAssistantCategory(doc) {
    const profile = assistantPageProfile(doc);
    const location = normalizeAssistantPath(doc.location);
    const title = normalizeAssistantSearch(doc.title);
    const segments = assistantPathSegments(doc.location);

    if (profile?.category) {
      return profile.category;
    }

    if (
      location.includes("referencia/faq") ||
      title.includes("perguntas frequentes") ||
      title === "faq"
    ) {
      return "FAQ";
    }

    if (
      location.includes("rejeicoes-fiscais") ||
      title.includes("rejeicao")
    ) {
      return "Rejeição";
    }

    if (
      location.includes("erros-solucoes") ||
      location.includes("erros-e-solucoes")
    ) {
      return "Erro";
    }

    if (
      location.includes("como-fazer/") ||
      location.includes("guias/")
    ) {
      return "Guia";
    }

    if (
      location.includes("/manual/") ||
      location.includes("/manuais/") ||
      segments[0] === "manual" ||
      manualPrefixes.has(segments[0])
    ) {
      return "Manual";
    }

    return "Conteúdo";
  }

  function assistantPathSegments(location) {
    return normalizeAssistantPath(location)
      .replace(/(^\.\/|index\.html$)/g, "")
      .replace(/[?#].*$/, "")
      .split("/")
      .filter(Boolean);
  }

  function assistantPageLocation(location) {
    return String(location || "").split("#")[0];
  }

  function assistantPageKey(location) {
    return assistantPageLocation(location)
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
  }

  function isAssistantIndexDoc(doc) {
    const segments = assistantPathSegments(doc.location);
    const title = normalizeAssistantSearch(doc.title);

    if (!segments.length) {
      return true;
    }

    if (
      segments.length === 1 &&
      ["como-fazer", "erros-solucoes", "referencia", "manual"].includes(segments[0])
    ) {
      return true;
    }

    if (
      segments.length === 2 &&
      segments[0] === "erros-solucoes" &&
      ["rejeicoes-fiscais", "erros-operacionais", "problemas-tecnicos"].includes(segments[1])
    ) {
      return true;
    }

    return /(^|\s)(guia|guias|manual|rejeicoes fiscais|erros e solucoes)(\s|$)/.test(title) ||
      /-geral$/.test(segments[segments.length - 1] || "");
  }

  function extractRejectionCodes(value) {
    return normalizeAssistantSearch(value).match(/\b\d{3,4}\b/g) || [];
  }

  function assistantSearchWords(value) {
    return normalizeAssistantSearch(value)
      .match(/[a-z0-9]+/g)
      ?.filter((word) => word.length > 1 && !assistantStopWords.has(word)) || [];
  }

  function uniqueAssistantWords(value) {
    return [...new Set(assistantSearchWords(value))];
  }

  function escapeAssistantRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function assistantContainsTerm(source, term) {
    const normalizedSource = normalizeAssistantSearch(source);
    const normalizedTerm = normalizeAssistantSearch(term);

    if (!normalizedSource || !normalizedTerm) {
      return false;
    }

    if (normalizedTerm.includes(" ")) {
      return normalizedSource.includes(normalizedTerm);
    }

    return new RegExp(`\\b${escapeAssistantRegExp(normalizedTerm)}\\b`)
      .test(normalizedSource);
  }

  function getAssistantSpecificMatches(value) {
    const normalized = normalizeAssistantSearch(value);
    const words = new Set(assistantSearchWords(normalized));

    return assistantSpecificTermGroups
      .map((group) => {
        const matchedTerm = group.terms.find((term) => {
          const normalizedTerm = normalizeAssistantSearch(term);

          if (normalizedTerm.includes(" ")) {
            return normalized.includes(normalizedTerm);
          }

          return words.has(normalizedTerm);
        });

        return matchedTerm
          ? {
            label: group.label,
            terms: group.terms
          }
          : null;
      })
      .filter(Boolean);
  }

  function analyzeAssistantQuery(value) {
    const words = uniqueAssistantWords(value);
    const specificMatches = getAssistantSpecificMatches(value);
    const specificTerms = new Set(
      specificMatches.flatMap((match) =>
        match.terms.flatMap((term) =>
          normalizeAssistantSearch(term).split(" ")
        )
      )
    );

    const businessWords = words.filter((word) =>
      specificTerms.has(word)
    );

    const auxiliaryWords = words.filter((word) =>
      assistantAuxiliaryTerms.has(word)
    );

    const meaningfulWords = words.filter((word) =>
      !assistantAuxiliaryTerms.has(word)
    );

    return {
      words,
      auxiliaryWords,
      businessWords,
      meaningfulWords,
      specificMatches,
      hasSpecificTerms: specificMatches.length > 0,
      codes: extractRejectionCodes(value)
    };
  }

  function assistantWordRoot(word) {
    return normalizeAssistantSearch(word)
      .replace(/oes$/g, "ao")
      .replace(/ais$/g, "al")
      .replace(/eis$/g, "el")
      .replace(/res$/g, "r")
      .replace(/s$/g, "");
  }

  function assistantTokenSet(value) {
    const expanded = uniqueAssistantWords(value).flatMap((word) => {
      if (word === "nfe" || word === "nf" || word === "nota") {
        return [word, "nota", "fiscal", "nfe"];
      }

      if (word === "nfce" || word === "cupom") {
        return [word, "cupom", "fiscal", "nfce"];
      }

      return [word];
    });

    return new Set(expanded.map(assistantWordRoot));
  }

  function assistantIntent(query) {
    const normalized = normalizeAssistantSearch(query);
    const words = uniqueAssistantWords(query);
    const wordSet = new Set(words);

    if (
      extractRejectionCodes(query).length ||
      /\b(rejeicao|rejeicoes|erro|schema|sefaz|xml)\b/.test(normalized)
    ) {
      return "error";
    }

    if (
      /\b(onde fica|qual campo|quais campos|para que serve|o que significa|tela de)\b/.test(normalized)
    ) {
      return "manual";
    }

    const guideIntentWords = new Set([
      "ajustar",
      "alterar",
      "baixar",
      "cadastrar",
      "cadastro",
      "cancelar",
      "configurar",
      "consultar",
      "criar",
      "emitir",
      "faturar",
      "fazer",
      "gerar",
      "importar",
      "lancar",
      "lançar",
      "transferir"
    ]);

    if (
      normalized.includes("como") ||
      /\b(ajustar|alterar|baixar|cadastrar|cadastro|cancelar|configurar|consultar|criar|emitir|faturar|fazer|gerar|importar|lancar|transferir)\b/.test(normalized) ||
      words.some((word) => guideIntentWords.has(word)) ||
      /\bguia\b/.test(normalized)
    ) {
      return "guide";
    }

    if (wordSet.has("manual") || /\bmanual\b/.test(normalized)) {
      return "manual";
    }

    return words.length <= 1 ? "ambiguous" : "general";
  }

  function isAmbiguousAssistantQuery(query, intent) {
    return intent === "ambiguous" &&
      !extractRejectionCodes(query).length &&
      uniqueAssistantWords(query).length <= 1;
  }

  function assistantDocText(doc) {
    return [
      doc?.title || "",
      doc?.location || "",
      doc?.text || ""
    ].join(" ");
  }

  function scoreAssistantResult(doc, term, intent = assistantIntent(term)) {
    const query = normalizeAssistantSearch(term);
    const title = normalizeAssistantSearch(doc.title);
    const text = normalizeAssistantSearch(doc.text);
    const location = normalizeAssistantSearch(doc.location);
    const combined = `${title} ${location} ${text}`;
    const segments = assistantPathSegments(doc.location);
    const isIndex = isAssistantIndexDoc(doc);
    const analysis = analyzeAssistantQuery(query);
    const words = analysis.words;
    const profile = assistantPageProfile(doc);
    const category = getAssistantCategory(doc);
    const guideIntentWords = new Set([
      "ajustar",
      "baixar",
      "cadastrar",
      "cadastro",
      "cancelar",
      "configurar",
      "consultar",
      "criar",
      "emitir",
      "faturar",
      "gerar",
      "importar",
      "lancar",
      "lançar",
      "transferir"
    ]);
    const hasGuideIntent =
      intent === "guide" ||
      normalizeAssistantSearch(term).includes("como") ||
      words.some((word) => guideIntentWords.has(word));
    let specificMatchScore = 0;
    let hasSpecificMatch = false;
    let codeMatchScore = 0;

    let score = 0;

    if (!query) {
      return score;
    }

    if (
      isAssistantBlockedManualDoc(doc) ||
      !assistantProfileMatchesQuery(profile, analysis, query)
    ) {
      return 0;
    }

    if (analysis.codes.length) {
      analysis.codes.forEach((code) => {
        const exactCode = new RegExp(`\\b${code}\\b`);

        if (exactCode.test(title)) {
          codeMatchScore += 140;
        }

        if (exactCode.test(location)) {
          codeMatchScore += 100;
        }

        if (exactCode.test(text)) {
          codeMatchScore += 38;
        }
      });

      if (!codeMatchScore) {
        return 0;
      }

      score += codeMatchScore;
    }

    if (analysis.hasSpecificTerms) {
      analysis.specificMatches.forEach((match) => {
        let bestTermScore = 0;

        match.terms.forEach((specificTerm) => {
          if (assistantContainsTerm(title, specificTerm)) {
            bestTermScore = Math.max(bestTermScore, 76);
          }

          if (assistantContainsTerm(location, specificTerm)) {
            bestTermScore = Math.max(bestTermScore, 54);
          }

          if (assistantContainsTerm(text, specificTerm)) {
            bestTermScore = Math.max(bestTermScore, 20);
          }
        });

        if (bestTermScore) {
          hasSpecificMatch = true;
          specificMatchScore += bestTermScore;
        }
      });

      if (!hasSpecificMatch) {
        return 0;
      }

      score += specificMatchScore;
    }

    score += assistantProfileScore(profile, analysis, query);

    if (title === query) {
      score += 100;
    }

    if (title.includes(query)) {
      score += 60;
    }

    if (location.includes(query)) {
      score += 40;
    }

    if (text.includes(query)) {
      score += 5;
    }

    if (!isIndex && segments.length > 1) {
      score += 28;
    }

    if (isIndex) {
      score -= 35;
    }

    if (intent === "guide" || hasGuideIntent) {
      if (category === "Guia") {
        score += 42;
      }

      if (category === "Manual") {
        score += 8;
      }

      if (
        category === "FAQ" ||
        title.includes("perguntas frequentes")
      ) {
        score -= 30;
      }
    }

    if (intent === "manual") {
      if (category === "Manual") {
        score += 46;
      }

      if (category === "Guia") {
        score += 8;
      }

      if (category === "FAQ") {
        score -= 18;
      }
    }

    if (intent === "error") {
      if (category === "Rejeição" || category === "Erro") {
        score += 72;
      } else if (category === "Guia" || category === "Manual") {
        score += 4;
      } else {
        score -= 24;
      }
    }

    if (intent === "ambiguous" && category === "Manual") {
      score += 12;
    }

    const titleMatches = words.filter((word) => title.includes(word)).length;
    const locationMatches = words.filter((word) => location.includes(word)).length;
    const matchedWords = words.filter((word) => combined.includes(word)).length;
    const meaningfulMatches = analysis.meaningfulWords.filter((word) =>
      combined.includes(word)
    ).length;

    if (analysis.meaningfulWords.length >= 2 && !meaningfulMatches) {
      score -= 80;
    } else if (words.length >= 3 && matchedWords / words.length < 0.45) {
      score -= 80;
    } else if (words.length >= 2 && matchedWords === 0) {
      score -= 60;
    }

    if (words.length > 1 && titleMatches === words.length) {
      score += 45;
    }

    if (words.length > 1 && locationMatches === words.length) {
      score += 24;
    }

    words.forEach((word) => {
      const isAuxiliary = assistantAuxiliaryTerms.has(word);
      const titleWeight = isAuxiliary ? 4 : 14;
      const locationWeight = isAuxiliary ? 2 : 9;
      const textWeight = isAuxiliary ? 0.2 : 1.4;

      if (title.includes(word)) {
        score += titleWeight;
      }

      if (location.includes(word)) {
        score += locationWeight;
      }

      if (text.includes(word)) {
        score += textWeight;
      }
    });

    if (
      !analysis.hasSpecificTerms &&
      !analysis.codes.length &&
      analysis.meaningfulWords.length === 0
    ) {
      score = Math.min(score, MIN_ASSISTANT_RESULT_SCORE - 1);
    }

    return score;
  }

  function representativeAssistantDoc(docs, pageKey, fallback) {
    return docs.find((doc) =>
      assistantPageKey(doc.location) === pageKey &&
      !String(doc.location || "").includes("#") &&
      doc.title
    ) || fallback;
  }

  function getAssistantResults(docs, query) {
    const intent = assistantIntent(query);
    const byPage = new Map();

    docs.forEach((doc) => {
      const score = scoreAssistantResult(doc, query, intent);

      if (score <= 0) {
        return;
      }

      const pageKey = assistantPageKey(doc.location);
      const current = byPage.get(pageKey);

      if (!current || score > current.score) {
        byPage.set(pageKey, {
          doc,
          pageKey,
          score
        });
      }
    });

    const ranked = Array.from(byPage.values())
      .map((item) => ({
        ...item,
        doc: representativeAssistantDoc(docs, item.pageKey, item.doc)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        const aHasHash = String(a.doc.location || "").includes("#");
        const bHasHash = String(b.doc.location || "").includes("#");

        if (aHasHash !== bHasHash) return aHasHash ? 1 : -1;

        return assistantPageLocation(a.doc.location).length -
          assistantPageLocation(b.doc.location).length;
      });

    if (!ranked.length || ranked[0].score < MIN_ASSISTANT_RESULT_SCORE) {
      return {
        primary: null,
        related: [],
        intent,
        ambiguous: isAmbiguousAssistantQuery(query, intent)
      };
    }

    const primary = ranked[0];

    return {
      primary,
      related: getAssistantRelatedResults(primary, ranked.slice(1), query, intent),
      intent,
      ambiguous: isAmbiguousAssistantQuery(query, intent)
    };
  }

  function sharedAssistantTokenScore(source, target) {
    const sourceTokens = assistantTokenSet(source);
    const targetTokens = assistantTokenSet(target);
    let score = 0;

    sourceTokens.forEach((token) => {
      if (targetTokens.has(token)) {
        score += 1;
      }
    });

    return score;
  }

  function scoreAssistantRelatedResult(primary, candidate, query, intent) {
    const primaryDoc = primary.doc;
    const candidateDoc = candidate.doc;
    const primaryCategory = getAssistantCategory(primaryDoc);
    const candidateCategory = getAssistantCategory(candidateDoc);

    if (primary.pageKey === candidate.pageKey || isAssistantIndexDoc(candidateDoc)) {
      return -Infinity;
    }

    let score = 0;

    if (primaryCategory === "Guia" && candidateCategory === "Manual") {
      score += 34;
    } else if (primaryCategory === "Manual" && candidateCategory === "Guia") {
      score += 34;
    } else if (
      (primaryCategory === "Rejeição" || primaryCategory === "Erro") &&
      (candidateCategory === "Guia" || candidateCategory === "Manual")
    ) {
      score += 26;
    } else if (candidateCategory === "FAQ") {
      score += 8;
    } else if (primaryCategory === candidateCategory && intent !== "ambiguous") {
      score -= 18;
    }

    score += sharedAssistantTokenScore(query, assistantDocText(candidateDoc)) * 20;
    score += sharedAssistantTokenScore(
      `${primaryDoc.title || ""} ${primaryDoc.location || ""}`,
      assistantDocText(candidateDoc)
    ) * 16;
    score += Math.min(candidate.score / 4, 28);

    if (candidateCategory === "FAQ" && score < 82) {
      score -= 22;
    }

    return score;
  }

  function getAssistantRelatedResults(primary, candidates, query, intent) {
    return candidates
      .map((candidate) => ({
        ...candidate,
        relatedScore: scoreAssistantRelatedResult(primary, candidate, query, intent)
      }))
      .filter((candidate) => candidate.relatedScore >= MIN_ASSISTANT_RELATED_SCORE)
      .sort((a, b) => {
        if (b.relatedScore !== a.relatedScore) return b.relatedScore - a.relatedScore;
        return b.score - a.score;
      })
      .slice(0, MAX_ASSISTANT_RELATED_RESULTS);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function assistantContentTypeLabel(category) {
    if (category === "Rejeição") return "REJEIÇÃO";
    if (category === "Erro") return "ERRO";
    return category.toUpperCase();
  }

  function assistantActionLabel(category) {
    switch (category) {
      case "Guia":
        return "Abrir guia →";

      case "Manual":
        return "Ver manual →";

      case "Rejeição":
      case "Erro":
        return "Ver solução →";

      case "FAQ":
        return "Ver resposta →";

      default:
        return "Abrir conteúdo →";
    }
  }

  function assistantResultHref(doc) {
    if (!doc?.location) {
      return rootUrl();
    }

    try {
      return new URL(assistantPageLocation(doc.location), rootUrl()).href;
    } catch (_error) {
      return rootUrl();
    }
  }

  const assistantPhraseHistory = {};

  const assistantIntroPhrases = {
    general: [
      "Separei o conteúdo mais alinhado com {assunto}.",
      "Encontrei uma orientação que combina com {assunto}.",
      "Achei um caminho útil para {assunto}.",
      "Tenho uma referência boa para {assunto}.",
      "Esse conteúdo deve ajudar com {assunto}."
    ],
    guide: [
      "Separei o guia mais direto para {assunto}.",
      "Encontrei o passo a passo de {assunto}.",
      "Achei o guia que melhor responde sobre {assunto}.",
      "Para {assunto}, este guia é o melhor ponto de partida.",
      "O guia abaixo parece ser o caminho certo para {assunto}."
    ],
    manual: [
      "Encontrei o manual da tela relacionada a {assunto}.",
      "Separei a documentação da tela para {assunto}.",
      "Para consultar {assunto}, este manual é o mais adequado.",
      "Achei o manual que descreve {assunto}.",
      "Este manual deve ajudar a localizar {assunto} no WCorp."
    ],
    error: [
      "Encontrei a orientação específica para essa rejeição.",
      "Separei a solução mais próxima para esse erro.",
      "Achei a página certa para conferir essa rejeição.",
      "Essa orientação deve ajudar a validar o problema fiscal.",
      "Para essa mensagem, a solução abaixo é a melhor correspondência."
    ],
    faq: [
      "Encontrei uma resposta relacionada à sua dúvida.",
      "Achei uma pergunta frequente que combina com {assunto}.",
      "Essa resposta rápida deve ajudar com {assunto}.",
      "Separei a FAQ mais próxima do que você perguntou.",
      "Tenho uma resposta direta para essa dúvida."
    ]
  };

  function assistantRandomDelay(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function assistantWait(milliseconds) {
    return new Promise((resolve) =>
      window.setTimeout(resolve, milliseconds)
    );
  }

  function pickAssistantPhrase(key, phrases) {
    if (!phrases.length) {
      return "";
    }

    let index = Math.floor(Math.random() * phrases.length);

    if (phrases.length > 1 && index === assistantPhraseHistory[key]) {
      index = (index + 1) % phrases.length;
    }

    assistantPhraseHistory[key] = index;

    return phrases[index];
  }

  function assistantSubject(query, results) {
    const normalized = normalizeAssistantSearch(query);
    const matches = analyzeAssistantQuery(query).specificMatches;
    const firstLabel = matches[0]?.label;

    if (!firstLabel && results?.primary?.doc?.title) {
      return normalizeAssistantSearch(results.primary.doc.title)
        .replace(/^como\s+/, "")
        .replace(/\s+/g, " ");
    }

    if (
      firstLabel === "cliente" &&
      /\b(cadastrar|cadastro|criar)\b/.test(normalized)
    ) {
      return "cadastro de cliente";
    }

    if (
      firstLabel === "fornecedor" &&
      /\b(cadastrar|cadastro|criar)\b/.test(normalized)
    ) {
      return "cadastro de fornecedor";
    }

    if (
      firstLabel === "material" &&
      /\b(cadastrar|cadastro|criar)\b/.test(normalized)
    ) {
      return "cadastro de material";
    }

    if (
      firstLabel === "nota fiscal" &&
      /\b(faturar)\b/.test(normalized)
    ) {
      return "faturar a nota";
    }

    if (
      firstLabel === "nota fiscal" &&
      /\b(emitir|emissao|gerar)\b/.test(normalized)
    ) {
      return "emissão de nota fiscal";
    }

    return firstLabel || "sua busca";
  }

  function assistantIntro(category, query, results) {
    const subject = assistantSubject(query, results);

    if (category === "Guia" && subject === "faturar a nota") {
      return "Para faturar a nota, encontrei este guia sobre emissão de NF-e:";
    }

    const phraseKey =
      category === "Rejeição" || category === "Erro"
        ? "error"
        : normalizeAssistantSearch(category).toLowerCase();

    const phrases =
      assistantIntroPhrases[phraseKey] ||
      assistantIntroPhrases.general;

    return pickAssistantPhrase(phraseKey, phrases)
      .replace("{assunto}", subject);
  }

  function renderAssistantResultCard(item) {
    const doc = item.doc || item;
    const category = getAssistantCategory(doc);
    const title = doc.title || "Conteúdo encontrado";
    const href = assistantResultHref(doc);

    return `
      <div class="wc-assistant__result">
        <span class="wc-assistant__result-type">${escapeHtml(assistantContentTypeLabel(category))}</span>
        <strong class="wc-assistant__result-title">${escapeHtml(title)}</strong>
        <a
          class="wc-assistant__result-link"
          href="${escapeHtml(href)}"
        >
          ${escapeHtml(assistantActionLabel(category))}
        </a>
      </div>
    `;
  }

  function createAssistantAnswer(query, results) {
    if (!results?.primary) {
      return {
        textHtml: `
          <strong>Não encontrei uma orientação específica.</strong>
          <br>
          Tente informar o código, nome da tela ou mensagem completa.
          <br><br>
          Caso seja uma falha do sistema, você pode abrir um chamado no Suporte.
        `,
        cardsHtml: ""
      };
    }

    const category = getAssistantCategory(results.primary.doc);
    const cards = [
      results.primary,
      ...results.related
    ];
    const cardsHtml = cards.length
      ? `
        <div class="wc-assistant__answer-cards">
          ${cards.map(renderAssistantResultCard).join("")}
        </div>
      `
      : "";

    return {
      textHtml: `<strong>${escapeHtml(assistantIntro(category, query, results))}</strong>`,
      cardsHtml
    };
  }

  /*
   * ============================
   * INICIALIZAÇÃO
   * ============================
   */

  function initializeAssistant() {
    if (document.querySelector(".wc-assistant")) {
      return;
    }

    const assistant = document.createElement("aside");

    assistant.className = "wc-assistant";
    assistant.setAttribute(
      "aria-label",
      "Assistente WCorp"
    );

    const panel = document.createElement("section");

    panel.className = "wc-assistant__panel";
    panel.id = "wc-assistant-panel";
    panel.hidden = true;

    panel.setAttribute(
      "aria-labelledby",
      "wc-assistant-title"
    );

    const header = document.createElement("header");

    header.className = "wc-assistant__header";

    header.innerHTML = [
      '<span class="wc-assistant__avatar"></span>',
      '<span class="wc-assistant__title">',
      '<strong id="wc-assistant-title">Assistente WCorp</strong>',
      '</span>'
    ].join("");

    header
      .querySelector(".wc-assistant__avatar")
      ?.appendChild(assistantIcon());

    const close = document.createElement("button");

    close.type = "button";
    close.className = "wc-assistant__close";

    close.setAttribute(
      "aria-label",
      "Fechar Assistente WCorp"
    );

    close.textContent = "×";

    header.appendChild(close);

    const messages = document.createElement("div");

    messages.className = "wc-assistant__messages";

    messages.setAttribute(
      "aria-live",
      "polite"
    );

    const form = document.createElement("form");

    form.className = "wc-assistant__form";

    form.innerHTML = [
      '<input class="wc-assistant__input" type="text" autocomplete="off" placeholder="Digite sua dúvida" aria-label="Digite sua dúvida">',
      '<button class="wc-assistant__send" type="submit">Enviar</button>'
    ].join("");

    panel.append(
      header,
      messages,
      form
    );

    const launcher = document.createElement("div");

    launcher.className = "wc-assistant__launcher";

    const bubble = document.createElement("button");

    bubble.type = "button";
    bubble.className = "wc-assistant__bubble";
    bubble.textContent = "Pergunte ao assistente WCorp!";

    bubble.setAttribute(
      "aria-controls",
      panel.id
    );

    bubble.setAttribute(
      "aria-expanded",
      "false"
    );

    const button = document.createElement("button");

    button.type = "button";
    button.className = "wc-assistant__button";

    button.setAttribute(
      "aria-label",
      "Abrir Assistente WCorp"
    );

    button.setAttribute(
      "aria-controls",
      panel.id
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.appendChild(
      assistantIcon()
    );

    launcher.append(
      bubble,
      button
    );

    assistant.append(
      panel,
      launcher
    );

    document.body.appendChild(
      assistant
    );

    const input = form.querySelector(
      ".wc-assistant__input"
    );
    const sendButton = form.querySelector(
      ".wc-assistant__send"
    );

    let closeTimer = 0;
    let restoredScrollTop = null;
    let assistantIsResponding = false;

    /*
     * ============================
     * ESTADO / CONVERSA
     * ============================
     */

    const serializeConversation = () =>
      Array.from(messages.children).map((element) => {
        if (
          element.classList.contains(
            "wc-assistant__typing"
          )
        ) {
          return null;
        }

        if (
          element.classList.contains(
            "wc-assistant__suggestions"
          )
        ) {
          return {
            type: "suggestions"
          };
        }

        return {
          type: element.classList.contains(
            "wc-assistant__message--user"
          )
            ? "user"
            : "assistant",

          html: element.innerHTML
        };
      }).filter(Boolean);

    const saveState = (
      open = assistant.classList.contains(
        "wc-assistant--open"
      )
    ) => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            open,
            inputValue: input?.value || "",
            messagesScrollTop:
              messages.scrollTop,
            conversation:
              serializeConversation()
          })
        );
      } catch (_error) {
        // sessionStorage indisponível.
      }
    };

    const appendInitialConversation = () => {
      messages.appendChild(
        createHtmlMessage(
          "<strong>Olá! Sou o Assistente WCorp.</strong><br><strong>Qual é a sua dúvida hoje?</strong>"
        )
      );

      messages.appendChild(
        createSuggestions()
      );
    };

    const scrollConversationToBottom = () => {
      messages.scrollTop =
        messages.scrollHeight;
    };

    const scheduleConversationScrollToBottom = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollConversationToBottom);
      });

      window.setTimeout(scrollConversationToBottom, 180);
    };

    const setAssistantBusy = (busy) => {
      assistantIsResponding = busy;

      if (sendButton) {
        sendButton.disabled = busy;
      }
    };

    const restoreConversation = (state) => {
      const conversation =
        Array.isArray(state?.conversation)
          ? state.conversation
          : [];

      if (!conversation.length) {
        appendInitialConversation();
        return;
      }

      conversation.forEach((item) => {
        if (item.type === "suggestions") {
          messages.appendChild(
            createSuggestions()
          );

          return;
        }

        const message =
          document.createElement("div");

        message.className =
          `wc-assistant__message${
            item.type === "user"
              ? " wc-assistant__message--user"
              : ""
          }`;

        message.innerHTML =
          item.html || "";

        messages.appendChild(
          message
        );
      });
    };

    const updateControls = (open) => {
      bubble.setAttribute(
        "aria-expanded",
        String(open)
      );

      button.setAttribute(
        "aria-expanded",
        String(open)
      );

      button.setAttribute(
        "aria-label",
        open
          ? "Fechar Assistente WCorp"
          : "Abrir Assistente WCorp"
      );
    };

    const finishClose = () => {
      window.clearTimeout(closeTimer);

      panel.hidden = true;

      assistant.classList.remove(
        "wc-assistant--closing"
      );

      updateControls(false);

      saveState(false);
    };

    const setOpen = (
      open,
      options = {}
    ) => {
      window.clearTimeout(
        closeTimer
      );

      if (open) {
        panel.hidden = false;

        assistant.classList.remove(
          "wc-assistant--closing"
        );

        assistant.classList.add(
          "wc-assistant--open"
        );

        updateControls(true);

        saveState(true);

        window.setTimeout(() => {
          input?.focus();

          scrollConversationToBottom();

          restoredScrollTop =
            messages.scrollTop;

          saveState(true);
        }, 80);

        scheduleConversationScrollToBottom();

        return;
      }

      if (panel.hidden) {
        assistant.classList.remove(
          "wc-assistant--open",
          "wc-assistant--closing"
        );

        updateControls(false);

        saveState(false);

        return;
      }

      assistant.classList.remove(
        "wc-assistant--open"
      );

      updateControls(false);

      if (
        options.immediate ||
        isReducedMotion()
      ) {
        finishClose();
        return;
      }

      assistant.classList.add(
        "wc-assistant--closing"
      );

      closeTimer = window.setTimeout(
        finishClose,
        190
      );
    };

    const toggle = () =>
      setOpen(panel.hidden);

    bubble.addEventListener(
      "click",
      toggle
    );

    button.addEventListener(
      "click",
      toggle
    );

    close.addEventListener(
      "click",
      () => setOpen(false)
    );

    if (
      window.wcorpAssistantEscapeHandler
    ) {
      document.removeEventListener(
        "keydown",
        window.wcorpAssistantEscapeHandler
      );
    }

    window.wcorpAssistantEscapeHandler =
      (event) => {
        if (
          event.key === "Escape" &&
          !panel.hidden
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "keydown",
      window.wcorpAssistantEscapeHandler
    );

    /*
     * ============================
     * ENVIO DA PERGUNTA
     * ============================
     */

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        if (assistantIsResponding) {
          return;
        }

        const value =
          input.value.trim();

        if (!value) {
          return;
        }

        messages.appendChild(
          createMessage(
            value,
            true
          )
        );

        input.value = "";

        scrollConversationToBottom();

        saveState(true);

        const typingMessage =
          createTypingMessage();
        let cardsTypingMessage = null;

        setAssistantBusy(true);

        messages.appendChild(
          typingMessage
        );

        scrollConversationToBottom();

        try {
          const textDelay = assistantWait(
            assistantRandomDelay(
              MIN_TEXT_RESPONSE_DELAY,
              MAX_TEXT_RESPONSE_DELAY
            )
          );

          const docs = await loadSearchIndex();

          const results =
            getAssistantResults(
              docs,
              value
            );

          await textDelay;

          const answer =
            createAssistantAnswer(
              value,
              results
            );

          typingMessage.remove();

          messages.appendChild(
            createHtmlMessage(
              answer.textHtml
            )
          );

          scrollConversationToBottom();

          if (answer.cardsHtml) {
            cardsTypingMessage =
              createTypingMessage();

            messages.appendChild(
              cardsTypingMessage
            );

            scrollConversationToBottom();

            await assistantWait(
              assistantRandomDelay(
                MIN_CARDS_RESPONSE_DELAY,
                MAX_CARDS_RESPONSE_DELAY
              )
            );

            cardsTypingMessage.remove();

            messages.appendChild(
              createHtmlMessage(
                answer.cardsHtml
              )
            );
          }
        } finally {
          typingMessage.remove();
          cardsTypingMessage?.remove();
          setAssistantBusy(false);
        }

        scrollConversationToBottom();

        saveState(true);
      }
    );

    input?.addEventListener(
      "input",
      () =>
        saveState(!panel.hidden)
    );

    messages.addEventListener(
      "scroll",
      () =>
        saveState(!panel.hidden),
      {
        passive: true
      }
    );

    panel.addEventListener(
      "animationend",
      (event) => {
        if (
          event.animationName ===
          "wc-assistant-close"
        ) {
          finishClose();
        }
      }
    );

    /*
     * ============================
     * RESTAURAÇÃO
     * ============================
     */

    const state =
      loadState();

    restoreConversation(
      state
    );

    if (
      input &&
      state?.inputValue
    ) {
      input.value =
        state.inputValue;
    }

    restoredScrollTop =
      Number.isFinite(
        state?.messagesScrollTop
      )
        ? state.messagesScrollTop
        : null;

    window.setTimeout(
      scheduleConversationScrollToBottom,
      0
    );

    if (state?.open) {
      setOpen(true, {
        immediate: true
      });
    } else {
      panel.hidden = true;

      assistant.classList.remove(
        "wc-assistant--open",
        "wc-assistant--closing"
      );

      updateControls(false);
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeAssistant
  );

  if (
    window.document$ &&
    typeof window.document$.subscribe ===
      "function"
  ) {
    window.document$.subscribe(
      initializeAssistant
    );
  }
})();
