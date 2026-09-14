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
  const assistantDebugVersion =
    "dom-audit-2026-08-30";

  const assistantRectSnapshot = (element) => {
    if (!element) {
      return null;
    }

    const rect =
      element.getBoundingClientRect();

    return {
      x: Number(rect.x.toFixed(2)),
      y: Number(rect.y.toFixed(2)),
      top: Number(rect.top.toFixed(2)),
      right: Number(rect.right.toFixed(2)),
      bottom: Number(rect.bottom.toFixed(2)),
      left: Number(rect.left.toFixed(2)),
      width: Number(rect.width.toFixed(2)),
      height: Number(rect.height.toFixed(2))
    };
  };

  const assistantStyleSnapshot = (element) => {
    if (!element) {
      return null;
    }

    const style =
      window.getComputedStyle(element);

    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      position: style.position,
      top: style.top,
      right: style.right,
      bottom: style.bottom,
      left: style.left,
      transform: style.transform
    };
  };

  const assistantElementLabel = (element) => {
    if (!element) {
      return null;
    }

    const parts = [
      element.tagName.toLowerCase()
    ];

    if (element.id) {
      parts.push(`#${element.id}`);
    }

    if (element.className) {
      parts.push(
        `.${String(element.className)
          .trim()
          .replace(/\s+/g, ".")}`
      );
    }

    return parts.join("");
  };

  const assistantDomAudit = () => {
    const assistants =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant"
        )
      );
    const panels =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant__panel"
        )
      );
    const launchers =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant__launcher"
        )
      );
    const panelIds =
      Array.from(
        document.querySelectorAll(
          "#wc-assistant-panel"
        )
      );

    const instances =
      assistants.map((assistant, index) => {
        const panel =
          assistant.querySelector(
            ".wc-assistant__panel"
          );
        const launcher =
          assistant.querySelector(
            ".wc-assistant__launcher"
          );
        const button =
          assistant.querySelector(
            ".wc-assistant__button"
          );
        const bubble =
          assistant.querySelector(
            ".wc-assistant__bubble"
          );

        return {
          index,
          assistantConnected:
            assistant.isConnected,
          assistantClasses:
            assistant.className,
          assistantRect:
            assistantRectSnapshot(assistant),
          panelConnected:
            Boolean(panel?.isConnected),
          panelHidden:
            panel?.hidden ?? null,
          panelAriaHidden:
            panel?.getAttribute("aria-hidden"),
          panelRect:
            assistantRectSnapshot(panel),
          panelStyle:
            assistantStyleSnapshot(panel),
          launcherConnected:
            Boolean(launcher?.isConnected),
          launcherRect:
            assistantRectSnapshot(launcher),
          launcherStyle:
            assistantStyleSnapshot(launcher),
          buttonRect:
            assistantRectSnapshot(button),
          buttonAriaExpanded:
            button?.getAttribute(
              "aria-expanded"
            ),
          bubbleRect:
            assistantRectSnapshot(bubble),
          bubbleAriaExpanded:
            bubble?.getAttribute(
              "aria-expanded"
            )
        };
      });

    const orphanPanels =
      panels.map((panel, index) => ({
        index,
        isConnected:
          panel.isConnected,
        hidden:
          panel.hidden,
        ariaHidden:
          panel.getAttribute("aria-hidden"),
        rect:
          assistantRectSnapshot(panel),
        style:
          assistantStyleSnapshot(panel),
        parent:
          assistantElementLabel(
            panel.parentElement
          ),
        closestAssistantClass:
          panel.closest(".wc-assistant")
            ?.className || null
      }));

    const audit = {
      label: "Assistant DOM Audit",
      version: assistantDebugVersion,
      url: window.location.href,
      readyState:
        document.readyState,
      navigationInstant:
        Boolean(window.document$),
      counts: {
        assistants:
          assistants.length,
        panels:
          panels.length,
        launchers:
          launchers.length,
        panelIds:
          panelIds.length
      },
      instances,
      panels:
        orphanPanels
    };

    console.info(
      "[Assistant DOM Audit]",
      audit
    );

    return audit;
  };

  window.__WC_ASSISTANT_DEBUG__ = {
    version: assistantDebugVersion,
    source:
      "docs/assets/javascripts/wcorp-assistant.js",
    positioning:
      "fixed-bottom-anchor-current",
    initializeCalls: 0,
    skippedExistingInstances: 0,
    audit:
      assistantDomAudit
  };

  window.__WC_ASSISTANT_DOM_AUDIT__ =
    assistantDomAudit;

  if (!window.__WC_ASSISTANT_DEBUG_LOGGED__) {
    window.__WC_ASSISTANT_DEBUG_LOGGED__ = true;
    console.info(
      `[WCorp Assistant] ${assistantDebugVersion} loaded`
    );
  }

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

  const assistantAuxiliaryTerms = new Set([
    "agora",
    "ajuda",
    "ajudar",
    "alterar",
    "cad",
    "cadastrar",
    "cadastro",
    "como",
    "configurar",
    "consultar",
    "criar",
    "emitir",
    "faturar",
    "faco",
    "fica",
    "fazer",
    "gerar",
    "guia",
    "manual",
    "onde",
    "vejo",
    "encontro",
    "acesso",
    "preciso",
    "qual",
    "quais",
    "quero",
    "realizar",
    "usar",
    "uso"
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
    { label: "ordem de produção", terms: ["ordem de producao", "ordem de produção"] },
    { label: "ferramenta", terms: ["ferramenta", "ferramentas", "indicador de relatorio", "indicador de relatórios", "validador xml", "validar xml"] },
    { label: "CT-e", terms: ["cte"] },
    { label: "NFS-e", terms: ["nfse"] },
    { label: "MDF-e", terms: ["mdfe"] }
  ];

  const assistantSemanticActions = [
    {
      id: "emitir",
      terms: ["emitir", "emissao", "emissão", "gerar", "faturar", "faturamento"]
    },
    {
      id: "consultar",
      terms: ["consultar", "consulta", "ver", "vejo", "verificar", "conferir", "localizar", "acompanhar"]
    },
    {
      id: "cancelar",
      terms: ["cancelar", "cancelamento", "cancela", "inutilizar", "inutilizacao", "inutilização"]
    },
    {
      id: "cadastrar",
      terms: ["cad", "cadastrar", "cadastro", "criar", "incluir"]
    },
    {
      id: "configurar",
      terms: ["configurar", "configuracao", "configuração", "ajustar", "parametrizar", "definir"]
    },
    {
      id: "corrigir",
      terms: ["corrigir", "correcao", "correção", "erro", "rejeicao", "rejeição", "rejeitada", "rejeitado", "schema"]
    },
    {
      id: "entender",
      terms: ["funciona", "funcionar", "serve", "campo", "campos", "tela", "manual", "significa"]
    }
  ];

  const assistantSemanticObjects = [
    {
      id: "nota fiscal",
      terms: ["nota fiscal", "notas fiscais", "nota", "notas", "nfe", "nf", "nf-e"]
    },
    {
      id: "ordem de produção",
      terms: ["ordem de producao", "ordem de produção"]
    },
    {
      id: "cliente",
      terms: ["cliente", "clientes"]
    },
    {
      id: "pedido",
      terms: ["pedido", "pedidos", "pedido venda", "pedido de venda"]
    },
    {
      id: "estoque",
      terms: ["estoque", "estoques"]
    },
    {
      id: "regra fiscal",
      terms: ["regra fiscal", "regras fiscais", "regra", "regras"]
    },
    {
      id: "carta de correção",
      terms: ["carta de correcao", "carta de correção", "correcao", "correção", "cce", "cc-e"]
    },
    {
      id: "inutilização",
      terms: ["inutilizacao", "inutilização", "inutilizar"]
    },
    {
      id: "material",
      terms: ["material", "materiais", "produto", "produtos"]
    },
    {
      id: "fornecedor",
      terms: ["fornecedor", "fornecedores"]
    },
    {
      id: "boleto",
      terms: ["boleto", "boletos"]
    },
    {
      id: "relatório",
      terms: ["relatorio", "relatórios", "relatorios"]
    },
    {
      id: "xml",
      terms: ["xml", "schema"]
    },
    {
      id: "usuário",
      terms: ["usuario", "usuário", "usuarios", "usuários", "logado", "logados"]
    }
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
  ];

  const assistantAmbiguousPreferences = [
    {
      terms: ["nota"],
      path: "como-fazer/faturar-nota",
      score: 420
    },
    {
      terms: ["pedido"],
      path: "comercial/pedidos",
      score: 130
    }
  ];

  const assistantAvatars = [
    "assets/avatar_homem_oculos.png",
    "assets/avatar_mulher.png",
    "assets/avatar_mulher_afro.png",
    "assets/avatar_homem_azul.png"
  ];

  const suggestions = [
    { label: "Como consultar notas rejeitadas?", href: "como-fazer/consultar-nfe-rejeitada/" },
    { label: "Como cadastrar um cliente?", href: "como-fazer/cadastrar-cliente/" },
    { label: "Como consultar estoque?", href: "como-fazer/consultar-estoque/" },
    { label: "Como verificar CBenef?", href: "como-fazer/verificar-cbenef/" }
  ];

  let assistantSearchPromise = null;
  let assistantPublishedManualPaths = null;
  let assistantPublishedGuidePaths = null;
  let assistantPublishedGuidePromise = null;

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

  function safeAssistantLink(value) {
    try {
      const internalPath = String(value || "")
        .trim()
        .replace(/^<|>$/g, "");
      const isExternal = /^(?:https?:|mailto:)/i.test(internalPath);
      const [pathPart, suffix = ""] = internalPath.split(/(?=[?#])/);
      const markdownPath = pathPart
        .replace(/^\/?(?:sources\/central-ajuda\/)?docs\//i, "")
        .replace(/^(?:\.\.\/|\.\/)+/, "")
        .replace(/\.md$/i, "")
        .replace(/\/index$/i, "")
        .replace(/^\/+|\/+$/g, "");
      const normalizedValue = !isExternal && /(?:\.md|(?:^|\/)docs\/)/i.test(internalPath)
        ? new URL(`${markdownPath}/${suffix}`, rootUrl()).href
        : internalPath;
      const url = new URL(normalizedValue, window.location.href);

      return ["http:", "https:", "mailto:"].includes(url.protocol)
        ? url.href
        : null;
    } catch (_error) {
      return null;
    }
  }

  function isAssistantInternalLink(value) {
    return !/^(?:https?:|mailto:)/i.test(value || "") &&
      /(?:\.md(?:[#?].*)?|(?:^|\/)docs\/)/i.test(value || "");
  }

  function appendAssistantMarkdownInline(parent, value) {
    const pattern = /(`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^)\n]+)\))/g;
    let position = 0;
    let match;

    while ((match = pattern.exec(value)) !== null) {
      parent.appendChild(
        document.createTextNode(
          value.slice(position, match.index)
        )
      );

      if (match[2]) {
        const code = document.createElement("code");

        code.textContent = match[2];
        parent.appendChild(code);
      } else if (match[3]) {
        const strong = document.createElement("strong");

        strong.textContent = match[3];
        parent.appendChild(strong);
      } else if (match[4]) {
        const emphasis = document.createElement("em");

        emphasis.textContent = match[4];
        parent.appendChild(emphasis);
      } else {
        const href = safeAssistantLink(match[6].trim());

        if (href) {
          const link = document.createElement("a");

          link.href = href;
          link.textContent = match[5];
          parent.appendChild(link);
        } else {
          parent.appendChild(
            document.createTextNode(match[5])
          );
        }
      }

      position = pattern.lastIndex;
    }

    parent.appendChild(
      document.createTextNode(value.slice(position))
    );
  }

  function createMarkdownMessage(markdown) {
    const message = document.createElement("div");
    const cleanedMarkdown = String(markdown || "")
      .replace(/\s*\{:\s*[^}\n]*(?:target\s*=\s*["']_blank["']|rel\s*=\s*["']noopener["'])[^}\n]*\}/gi, "")
      .trim();
    const lines = cleanedMarkdown.replace(/\r\n?/g, "\n").split("\n");
    let paragraphLines = [];
    let listStack = [];
    let complementarySection = false;

    message.className = "wc-assistant__message";

    const flushParagraph = () => {
      if (!paragraphLines.length) {
        return;
      }

      const paragraph = document.createElement("p");

      appendAssistantMarkdownInline(
        paragraph,
        paragraphLines.join(" ")
      );
      message.appendChild(paragraph);
      paragraphLines = [];
    };

    const resetLists = () => {
      listStack = [];
    };

    const createComplementaryCard = (label, href, sectionTitle) => {
      const card = document.createElement("article");
      const type = document.createElement("span");
      const title = document.createElement("strong");
      const action = document.createElement("a");

      card.className = "wc-assistant__markdown-card";
      type.className = "wc-assistant__result-type";
      type.textContent = sectionTitle;
      title.className = "wc-assistant__result-title";
      title.textContent = label;
      action.className = "wc-assistant__result-link";
      action.href = href;
      action.textContent = "Ver guia completo →";

      card.append(type, title, action);
      return card;
    };

    const appendListItem = (line, orderedItem, unorderedItem) => {
      const indent = line.match(/^\s*/)[0].length;
      const listTag = orderedItem ? "ol" : "ul";

      flushParagraph();

      while (
        listStack.length &&
        indent < listStack[listStack.length - 1].indent
      ) {
        listStack.pop();
      }

      if (
        listStack.length &&
        indent === listStack[listStack.length - 1].indent &&
        listStack[listStack.length - 1].type !== listTag
      ) {
        listStack.pop();
      }

      let current = listStack[listStack.length - 1];

      if (!current || indent > current.indent) {
        const list = document.createElement(listTag);
        const parent = current?.item || message;

        parent.appendChild(list);
        current = {
          indent,
          item: null,
          list,
          type: listTag
        };
        listStack.push(current);
      }

      const listItem = document.createElement("li");

      appendAssistantMarkdownInline(
        listItem,
        (orderedItem || unorderedItem)[1]
      );
      current.list.appendChild(listItem);
      current.item = listItem;
    };

    lines.forEach((line) => {
      const heading = line.trim().replace(/^#+\s*/, "");
      const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/);
      const unorderedItem = line.match(/^\s*[-*+]\s+(.+)$/);
      const item = orderedItem || unorderedItem;

      if (/^(documenta[cç][aã]o complementar|guia recomendado|leia tamb[eé]m|materiais complementares)$/i.test(heading)) {
        flushParagraph();
        resetLists();
        complementarySection = heading;
        const section = document.createElement("div");

        section.className = "wc-assistant__markdown-links";
        section.setAttribute("data-section-title", heading);
        message.appendChild(section);
        return;
      }

      if (item) {
        const linkMatch = item[1].match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
        const section = message.lastElementChild;

        if (
          complementarySection &&
          section?.classList.contains("wc-assistant__markdown-links") &&
          linkMatch &&
          isAssistantInternalLink(linkMatch[2])
        ) {
          const href = safeAssistantLink(linkMatch[2]);

          if (href) {
            section.appendChild(
              createComplementaryCard(
                linkMatch[1],
                href,
                complementarySection
              )
            );
            return;
          }
        }

        appendListItem(line, orderedItem, unorderedItem);
        return;
      }

      resetLists();

      if (!line.trim()) {
        flushParagraph();
        return;
      }

      if (complementarySection) {
        complementarySection = false;
      }

      paragraphLines.push(line.trim());
    });

    flushParagraph();

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
    if (window.WCorpSearchUtils?.normalizeText) {
      return window.WCorpSearchUtils.normalizeText(value);
    }

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

  function normalizeAssistantCatalogGuidePath(value) {
    return assistantProfilePathKey(value)
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
  }

  async function loadAssistantPublishedGuidePaths() {
    if (assistantPublishedGuidePaths) {
      return assistantPublishedGuidePaths;
    }

    if (assistantPublishedGuidePromise) {
      return assistantPublishedGuidePromise;
    }

    assistantPublishedGuidePromise = fetch(new URL("assets/data/content-catalog.json", rootUrl()))
      .then((response) => response.ok ? response.json() : null)
      .then((catalog) => {
        const paths = new Set();

        (catalog?.items || []).forEach((item) => {
          if (
            item.type === "guia" &&
            item.status === "published" &&
            Array.isArray(item.videos) &&
            item.videos.length &&
            item.url
          ) {
            paths.add(normalizeAssistantCatalogGuidePath(item.url));
          }
        });

        assistantPublishedGuidePaths = paths;
        return assistantPublishedGuidePaths;
      })
      .catch(() => {
        assistantPublishedGuidePaths = new Set();
        return assistantPublishedGuidePaths;
      });

    return assistantPublishedGuidePromise;
  }

  function isAssistantBlockedGuideDoc(doc) {
    const key = normalizeAssistantCatalogGuidePath(assistantPageKey(doc.location));

    if (!key.startsWith("como-fazer/")) {
      return false;
    }

    return assistantPublishedGuidePaths?.size > 0 &&
      !assistantPublishedGuidePaths.has(key);
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

  function assistantAmbiguousPreferenceScore(doc, analysis, intent) {
    if (intent !== "ambiguous") {
      return 0;
    }

    const words = new Set(analysis.words);
    const pageKey = assistantPageKey(doc.location);

    return assistantAmbiguousPreferences.reduce((score, preference) => {
      const hasTerm = preference.terms.some((term) =>
        words.has(normalizeAssistantSearch(term))
      );

      if (!hasTerm) {
        return score;
      }

      return pageKey === preference.path || pageKey.startsWith(`${preference.path}/`)
        ? score + preference.score
        : score;
    }, 0);
  }

  function assistantDefaultPageScore(doc, analysis, intent) {
    const words = new Set(analysis.words);
    const pageKey = assistantPageKey(doc.location);
    const hasAny = (terms) => terms.some((term) => words.has(term));
    const normalizedQuery = analysis.words.join(" ");

    if (
      assistantQueryHasFinalizedInvoiceContext(normalizedQuery) &&
      (pageKey === "referencia/faq/alterar-nfe-autorizada" || pageKey.startsWith("referencia/faq/alterar-nfe-autorizada/"))
    ) {
      return 430;
    }

    if (
      (intent === "guide" || intent === "ambiguous") &&
      hasAny(["nota", "nfe", "nf"]) &&
      !hasAny(["entrada", "complementar", "cancelar", "cancela", "baixar", "lancar", "alterar", "editar", "impostos", "valores"]) &&
      (pageKey === "como-fazer/faturar-nota" || pageKey.startsWith("como-fazer/faturar-nota/"))
    ) {
      return 75;
    }

    if (
      /\b(quem alterou|usuario que alterou|mudancas|registro de log|valor anterior|valor novo|historico|alteracoes)\b/.test(normalizedQuery) &&
      (pageKey === "como-fazer/verificar-historico-alteracoes" || pageKey.startsWith("como-fazer/verificar-historico-alteracoes/"))
    ) {
      return 380;
    }

    if (
      hasAny(["nota", "nfe", "nf"]) &&
      hasAny(["alterar", "editar", "impostos", "valores"]) &&
      !assistantQueryHasFinalizedInvoiceContext(normalizedQuery) &&
      (pageKey === "como-fazer/editar-valores-nfe" || pageKey.startsWith("como-fazer/editar-valores-nfe/"))
    ) {
      return 390;
    }

    if (
      hasAny(["ajustar", "quantidade", "material", "estoque", "inventario"]) &&
      (pageKey === "como-fazer/ajustar-estoque" || pageKey.startsWith("como-fazer/ajustar-estoque/"))
    ) {
      return 360;
    }

    if (
      intent === "error" &&
      hasAny(["nota", "nfe", "nf"]) &&
      hasAny(["rejeitada", "rejeitado", "rejeitadas", "rejeitados"]) &&
      (pageKey === "como-fazer/consultar-nfe-rejeitada" || pageKey.startsWith("como-fazer/consultar-nfe-rejeitada/"))
    ) {
      return 360;
    }

    if (
      intent === "manual" &&
      hasAny(["nota", "nfe", "nf"]) &&
      !hasAny(["entrada", "lote", "servico", "serviço", "inutilizacao", "inutilização", "inutilizar"]) &&
      (pageKey === "faturamento/faturamento-nf" || pageKey.startsWith("faturamento/faturamento-nf/"))
    ) {
      return 260;
    }

    if (
      hasAny(["inutilizacao", "inutilização", "inutilizar"]) &&
      (pageKey === "faturamento/inutilizacao-nota-fiscal" || pageKey.startsWith("faturamento/inutilizacao-nota-fiscal/"))
    ) {
      return 340;
    }

    if (
      hasAny(["regra", "regras"]) &&
      hasAny(["fiscal", "fiscais", "ver", "vejo", "verificar", "consultar"]) &&
      (pageKey === "como-fazer/verificar-regra-fiscal" || pageKey.startsWith("como-fazer/verificar-regra-fiscal/"))
    ) {
      return 280;
    }

    if (
      (intent === "manual" || intent === "ambiguous") &&
      words.has("pedido") &&
      !hasAny(["compra", "compras", "separacao", "separar", "cancelar", "cancela"]) &&
      (pageKey === "comercial/pedidos" || pageKey.startsWith("comercial/pedidos/"))
    ) {
      return 150;
    }

    return 0;
  }

  function assistantQueryHasFinalizedInvoiceContext(value) {
    const normalized = normalizeAssistantSearch(value);

    return /\b(ja emitid[ao]|autorizad[ao]|depois que .*emitid[ao])\b/.test(normalized);
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

    if (location.includes("problemas-tecnicos")) {
      return "Problema Técnico";
    }

    if (
      location.includes("erros-solucoes") ||
      location.includes("erros-e-solucoes")
    ) {
      return "Erro";
    }

    if (location.includes("ferramentas/")) {
      return "Ferramenta";
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

  function isAssistantGenericDoc(doc) {
    const title = normalizeAssistantSearch(doc.title);
    const segments = assistantPathSegments(doc.location);
    const lastSegment = segments[segments.length - 1] || "";

    return isAssistantIndexDoc(doc) ||
      /(^|\s)(visao geral|introducao|inicio)(\s|$)/.test(title) ||
      /(^|-)visao-geral$/.test(lastSegment) ||
      /(^|-)introducao$/.test(lastSegment);
  }

  function assistantQueryNeedsSpecificContent(analysis) {
    return Boolean(
      analysis.codes.length ||
      analysis.hasSpecificTerms ||
      analysis.semantic.object ||
      analysis.businessWords.length ||
      analysis.meaningfulWords.length >= 3
    );
  }

  function extractRejectionCodes(value) {
    if (window.WCorpSearchUtils?.extractCodes) {
      return window.WCorpSearchUtils.extractCodes(value);
    }

    return normalizeAssistantSearch(value).match(/\b\d{3,4}\b/g) || [];
  }

  function assistantSearchWords(value) {
    if (window.WCorpSearchUtils?.tokenize) {
      return window.WCorpSearchUtils.tokenize(value);
    }

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

  function assistantSemanticTermMatch(normalized, words, terms) {
    return terms.some((term) => {
      const normalizedTerm = normalizeAssistantSearch(term);

      if (!normalizedTerm) {
        return false;
      }

      if (normalizedTerm.includes(" ")) {
        return normalized.includes(normalizedTerm);
      }

      return words.has(normalizedTerm);
    });
  }

  function assistantSemanticAnalysis(value) {
    const normalized = normalizeAssistantSearch(value);
    const words = new Set(uniqueAssistantWords(normalized));
    const action = assistantSemanticActions.find((item) =>
      assistantSemanticTermMatch(normalized, words, item.terms)
    )?.id || null;
    const forcedObject = /\binutiliz/.test(normalized)
      ? "inutilização"
      : null;
    const object = assistantSemanticObjects
      .filter((item) =>
        assistantSemanticTermMatch(normalized, words, item.terms)
      )
      .sort((left, right) => {
        const longest = (item) => Math.max(
          ...item.terms.map((term) =>
            normalizeAssistantSearch(term).length
          )
        );

        return longest(right) - longest(left);
      })[0]?.id || null;

    return {
      action,
      object: forcedObject || object
    };
  }

  function assistantActionConflicts(queryAction, docAction) {
    if (!queryAction || !docAction || queryAction === docAction) {
      return false;
    }

    const conflicts = {
      emitir: ["consultar", "cancelar", "corrigir", "entender"],
      consultar: ["emitir", "cancelar", "cadastrar"],
      cancelar: ["emitir", "consultar", "cadastrar", "configurar"],
      cadastrar: ["consultar", "cancelar", "corrigir", "entender"],
      configurar: ["consultar", "cancelar", "corrigir"],
      corrigir: ["emitir", "cadastrar", "configurar", "entender"],
      entender: ["emitir", "cadastrar", "cancelar", "corrigir"]
    };

    return conflicts[queryAction]?.includes(docAction) || false;
  }

  function assistantOperationalAction(action) {
    return [
      "emitir",
      "cancelar",
      "cadastrar",
      "configurar",
      "consultar"
    ].includes(action);
  }

  function assistantContextSet(value, category, semantic = {}) {
    const normalized = normalizeAssistantSearch(value);
    const contexts = new Set();
    const hasNotaFiscal =
      semantic.object === "nota fiscal" ||
      /\b(nota|nfe|nf)\b/.test(normalized);
    [
      ["entrada", /\b(entrada|importar|importacao|importação|radar)\b/],
      ["cancelamento", /\b(cancelar|cancelamento|cancela)\b/],
      ["carta_correcao", /\b(carta de correcao|carta de correção|cce|cc-e)\b/],
      ["inutilizacao", /\b(inutilizar|inutilizacao|inutilização)\b/],
      ["cadastro", /\b(cadastrar|cadastro|criar|incluir)\b/],
      ["edicao", /\b(editar|edicao|edição|alterar|ajustar)\b/],
      ["edicao_nfe_emitida", /\b(ja emitid[ao]|já emitid[ao]|autorizad[ao]|depois que .*emitid[ao])\b/],
      ["ajuste_inventario", /\b(ajustar|ajuste)\b.*\b(estoque|inventario|inventário|quantidade|material)\b|\b(estoque|inventario|inventário|quantidade|material)\b.*\b(ajustar|ajuste)\b/],
      ["historico_alteracoes", /\b(quem alterou|usuario que alterou|usuário que alterou|mudancas|mudanças|registro de log|valor anterior|valor novo|historico|histórico|alteracoes|alterações)\b/],
      ["consulta", /\b(consultar|consulta|verificar|conferir|localizar|acompanhar)\b/],
      ["emissor", /\b(emissor)\b/]
    ].forEach(([context, pattern]) => {
      if (pattern.test(normalized)) contexts.add(context);
    });

    if (["Rejeição", "Erro"].includes(category) || /\b(rejeicao|rejeição|rejeitad[ao]s?|erro fiscal|schema)\b/.test(normalized)) {
      contexts.add("rejeicao");
    }
    if (hasNotaFiscal && /\b(emitir|emissao|emissão|gerar|faturar|saida|saída|transmitir)\b/.test(normalized)) {
      contexts.add("emissao");
    }
    return contexts;
  }

  function assistantContextsConflict(baseContexts, candidateContexts) {
    const incompatible = {
      emissao: "entrada cancelamento rejeicao inutilizacao",
      entrada: "emissao cancelamento rejeicao inutilizacao",
      cancelamento: "entrada emissao rejeicao inutilizacao",
      rejeicao: "entrada emissao cancelamento inutilizacao",
      inutilizacao: "entrada emissao cancelamento rejeicao",
      ajuste_inventario: "entrada",
      edicao_nfe_emitida: "edicao"
    };

    return [...baseContexts].some((context) =>
      incompatible[context]?.split(" ").some((blocked) => candidateContexts.has(blocked))
    );
  }

  function assistantRelatedContextCompatible(primary, candidate, query) {
    const querySemantic = analyzeAssistantQuery(query).semantic;
    const contextFromDoc = (doc) => {
      const text = `${doc.title || ""} ${doc.location || ""}`;
      return assistantContextSet(text, getAssistantCategory(doc), assistantSemanticAnalysis(text));
    };
    const baseContexts = new Set([...assistantContextSet(query, "", querySemantic), ...contextFromDoc(primary.doc)]);
    const candidateContexts = contextFromDoc(candidate.doc);

    return !assistantContextsConflict(baseContexts, candidateContexts);
  }

  function assistantQueryAllowsIssueRelated(query, intent) {
    const normalized = normalizeAssistantSearch(query);

    return intent === "error" ||
      extractRejectionCodes(query).length > 0 ||
      /\b(erro|rejeicao|falha|problema|mensagem|codigo|nao consigo|nao consegue|nao esta|nao funciona|nao salva|nao autoriza|nao transmite|deu erro|retornou|aparece|bloqueado)\b/.test(normalized);
  }

  function assistantQueryAllowsRejectionRelated(query, intent) {
    const normalized = normalizeAssistantSearch(query);

    return extractRejectionCodes(query).length > 0 ||
      /\b(rejeicao|rejeitad[ao]|codigo de rejeicao|sefaz|autorizacao|nao autoriza|transmissao|nao transmite|retornou rejeicao)\b/.test(normalized);
  }

  function assistantQueryAllowsSpecificRejection(query) {
    const normalized = normalizeAssistantSearch(query);

    return extractRejectionCodes(query).length > 0 ||
      /\b(codigo de rejeicao|sefaz|nao autoriza|transmissao|nao transmite|retornou rejeicao|ausencia|troco|cfop|csosn|cst|ncm|icms|ipi|pis|cofins)\b/.test(normalized);
  }

  function assistantQueryIsGenericRejection(query) {
    return assistantQueryAllowsRejectionRelated(query, "error") &&
      !assistantQueryAllowsSpecificRejection(query);
  }

  function assistantSemanticScore(doc, queryAnalysis, intent) {
    const category = getAssistantCategory(doc);
    const docAnalysis = assistantSemanticAnalysis(
      assistantDocText(doc)
    );
    const titleLocationAnalysis = assistantSemanticAnalysis(
      `${doc.title || ""} ${doc.location || ""}`
    );
    const docAction = titleLocationAnalysis.action;
    const docObject = titleLocationAnalysis.object || docAnalysis.object;
    const actionMatchesIntent = !(
      intent === "manual" &&
      assistantOperationalAction(queryAnalysis.action)
    );
    const bonuses = [];
    const penalties = [];
    let score = 0;

    if (!queryAnalysis.action && !queryAnalysis.object) {
      return {
        score,
        action: null,
        object: null,
        bonuses,
        penalties
      };
    }

    if (queryAnalysis.object && docObject === queryAnalysis.object) {
      score += 82;
      bonuses.push("objeto");
    } else if (queryAnalysis.object && docObject) {
      score -= 42;
      penalties.push("objeto_diferente");
    }

    if (actionMatchesIntent && queryAnalysis.action && docAction === queryAnalysis.action) {
      score += 74;
      bonuses.push("acao");
    }

    if (
      actionMatchesIntent &&
      queryAnalysis.action &&
      queryAnalysis.object &&
      docAction === queryAnalysis.action &&
      docObject === queryAnalysis.object
    ) {
      score += 150;
      bonuses.push("acao_objeto");
    }

    if (assistantActionConflicts(queryAnalysis.action, docAction)) {
      const penalty =
        queryAnalysis.object && docObject === queryAnalysis.object
          ? 220
          : 110;

      score -= penalty;
      penalties.push("conflito_acao");
    }

    if (
      queryAnalysis.action === "emitir" &&
      queryAnalysis.object === "nota fiscal" &&
      /\b(rejeitad|rejeicao|rejeição|cancelar|cancelamento|inutiliz)\b/.test(
        normalizeAssistantSearch(assistantDocText(doc))
      )
    ) {
      score -= 190;
      penalties.push("variante_de_nota_incompativel");
    }

    if (queryAnalysis.action === "entender") {
      if (category === "Manual") {
        score += 72;
        bonuses.push("manual_para_entender");
      } else if (category === "Guia") {
        score -= 32;
        penalties.push("guia_para_entender");
      }
    } else if (assistantOperationalAction(queryAnalysis.action)) {
      if (intent === "manual") {
        if (category === "Manual") {
          score += 72;
          bonuses.push("manual_para_localizacao");
        } else if (category === "Guia") {
          score -= 34;
          penalties.push("guia_para_localizacao");
        }
      } else if (category === "Guia") {
        score += 18;
        bonuses.push("guia_operacional");
      } else if (category === "Manual") {
        score += 4;
        bonuses.push("manual_relacionado_a_acao");
      }
    }

    return {
      score,
      action: docAction,
      object: docObject,
      bonuses,
      penalties
    };
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
      codes: extractRejectionCodes(value),
      semantic: assistantSemanticAnalysis(value)
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

  function assistantRootMatchCount(source, words) {
    const tokens = assistantTokenSet(source);

    return words.filter((word) =>
      tokens.has(assistantWordRoot(word))
    ).length;
  }

  function assistantIntent(query) {
    const normalized = normalizeAssistantSearch(query);
    const words = uniqueAssistantWords(query);
    const wordSet = new Set(words);

    if (
      /\b(indicador de relatorio|indicador de relatorios|validador xml|validar xml|ferramenta|ferramentas)\b/.test(normalized) ||
      /\b(qual|quais|usar|uso|indicar|indica)\b.*\b(relatorio|relatorios)\b/.test(normalized) ||
      /\b(relatorio|relatorios)\b.*\b(qual|quais|usar|uso|indicar|indica)\b/.test(normalized) ||
      /\bxml\b.*\b(errado|erro|validar|validacao|analisar|conferir)\b/.test(normalized)
    ) {
      return "tool";
    }

    if (
      extractRejectionCodes(query).length ||
      /\b(rejeicao|rejeicoes|rejeitad[ao]s?|erro|schema|sefaz|xml)\b/.test(normalized) ||
      /\b(referencia objeto|objeto nao definid[ao])\b/.test(normalized)
    ) {
      return "error";
    }

    if (
      /\b(onde fica|onde cadastro|onde cadastra|onde cadastrar|onde vejo|onde encontro|onde acesso|qual campo|quais campos|para que serve|o que e|o que significa|como funciona|funciona a tela|tela de)\b/.test(normalized)
    ) {
      return "manual";
    }

    const guideIntentWords = new Set([
      "ajustar",
      "alterar",
      "baixar",
      "cad",
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
      /\b(ajustar|alterar|baixar|cad|cadastrar|cadastro|cancelar|configurar|consultar|criar|emitir|faturar|fazer|gerar|importar|lancar|transferir)\b/.test(normalized) ||
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
    const pageKey = assistantPageKey(doc.location);
    const isIndex = isAssistantIndexDoc(doc);
    const isGeneric = isAssistantGenericDoc(doc);
    const analysis = analyzeAssistantQuery(query);
    const words = analysis.words;
    const profile = assistantPageProfile(doc);
    const category = getAssistantCategory(doc);
    const guideIntentWords = new Set([
      "ajustar",
      "baixar",
      "cad",
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
    const hasGuideIntent =
      intent === "guide" ||
      normalizeAssistantSearch(term).includes("como") ||
      words.some((word) => guideIntentWords.has(word));
    let specificMatchScore = 0;
    let hasSpecificMatch = false;
    let codeMatchScore = 0;
    let defaultPageScore = 0;

    let score = 0;

    if (!query) {
      return score;
    }

    if (
      isAssistantBlockedManualDoc(doc) ||
      isAssistantBlockedGuideDoc(doc) ||
      !assistantProfileMatchesQuery(profile, analysis, query)
    ) {
      return 0;
    }

    if (
      assistantQueryHasFinalizedInvoiceContext(term) &&
      (pageKey === "como-fazer/editar-valores-nfe" ||
        pageKey.startsWith("como-fazer/editar-valores-nfe/") ||
        pageKey === "como-fazer/faturar-nota" ||
        pageKey.startsWith("como-fazer/faturar-nota/"))
    ) {
      return 0;
    }

    if (analysis.codes.length) {
      analysis.codes.forEach((code) => {
        const exactCode = new RegExp(`\\b${code}\\b`);

        if (exactCode.test(title)) {
          codeMatchScore += 260;
        }

        if (exactCode.test(location)) {
          codeMatchScore += 180;
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
    score += assistantAmbiguousPreferenceScore(doc, analysis, intent);
    defaultPageScore = assistantDefaultPageScore(doc, analysis, intent);
    score += defaultPageScore;
    score += assistantSemanticScore(doc, analysis.semantic, intent).score;

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
      score -= analysis.codes.length || analysis.meaningfulWords.length > 1 ? 130 : 35;
    }

    if (isGeneric && assistantQueryNeedsSpecificContent(analysis)) {
      score -= analysis.hasSpecificTerms || analysis.semantic.object ? 115 : 80;
    }

    if (intent === "guide" || hasGuideIntent) {
      if (category === "Guia") {
        score += 12;
      }

      if (category === "Manual") {
        score += 6;
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
        score += 72;
      }

      if (category === "Guia") {
        score -= 4;
      }

      if (category === "FAQ") {
        score -= 120;
      }
    }

    if (intent === "error") {
      if (category === "Erro" && assistantQueryIsGenericRejection(term)) {
        return 0;
      }

      if (
        category === "Rejeição" &&
        /\brejeicao\b/.test(location) &&
        !isAssistantIndexDoc(doc) &&
        !assistantQueryAllowsSpecificRejection(term)
      ) {
        return 0;
      }

      if (category === "Rejeição" || category === "Erro" || category === "Problema Técnico") {
        score += 72;
      } else if (category === "Guia" || category === "Manual") {
        score += 4;
      } else {
        score -= 24;
      }
    }

    if (intent === "tool") {
      if (category === "Ferramenta") {
        score += 110;
      } else if (category === "Guia" || category === "Manual") {
        score -= 20;
      } else if (category !== "FAQ") {
        score -= 12;
      }
    }

    if (intent === "ambiguous" && category === "Manual") {
      score += 12;
    }

    if (category === "Guia") {
      score += 4;
    } else if (category === "Manual") {
      score += 4;
    } else if (category === "FAQ") {
      score += 3;
    }

    const titleMatches = words.filter((word) => title.includes(word)).length;
    const locationMatches = words.filter((word) => location.includes(word)).length;
    const combinedTokens = assistantTokenSet(combined);
    const combinedHasWord = (word) =>
      combined.includes(word) || combinedTokens.has(assistantWordRoot(word));
    const meaningfulTitleMatches = assistantRootMatchCount(
      title,
      analysis.meaningfulWords
    );
    const meaningfulLocationMatches = assistantRootMatchCount(
      location,
      analysis.meaningfulWords
    );
    const matchedWords = words.filter(combinedHasWord).length;
    const meaningfulMatches = analysis.meaningfulWords.filter((word) =>
      combinedHasWord(word)
    ).length;
    const unmatchedMeaningfulWords = analysis.meaningfulWords.filter((word) =>
      !combinedHasWord(word)
    );

    if (
      !analysis.codes.length &&
      !analysis.hasSpecificTerms &&
      analysis.meaningfulWords.length &&
      !meaningfulMatches &&
      !defaultPageScore
    ) {
      return 0;
    }

    if (
      !analysis.codes.length &&
      analysis.meaningfulWords.length >= 3 &&
      meaningfulMatches / analysis.meaningfulWords.length < 0.5 &&
      !defaultPageScore
    ) {
      return 0;
    }

    if (
      !analysis.codes.length &&
      analysis.meaningfulWords.length <= 2 &&
      unmatchedMeaningfulWords.length &&
      meaningfulMatches <= 1 &&
      matchedWords <= 1 &&
      !defaultPageScore
    ) {
      return 0;
    }

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

    if (
      analysis.meaningfulWords.length &&
      meaningfulTitleMatches === analysis.meaningfulWords.length
    ) {
      score += 76;
    } else if (meaningfulTitleMatches >= 2) {
      score += 38;
    }

    if (words.length > 1 && locationMatches === words.length) {
      score += 24;
    }

    if (
      analysis.meaningfulWords.length &&
      meaningfulLocationMatches === analysis.meaningfulWords.length
    ) {
      score += 44;
    } else if (meaningfulLocationMatches >= 2) {
      score += 22;
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
      category === "FAQ" &&
      analysis.meaningfulWords.length >= 2 &&
      analysis.meaningfulWords.every((word) => combined.includes(word))
    ) {
      score += 95;
    }

    if (window.WCorpSearchUtils?.scoreDocument) {
      score += Math.round(window.WCorpSearchUtils.scoreDocument({
        title: doc.title,
        location: doc.location,
        text: doc.text
      }, term, { intent }) * 0.28);
    }

    if (
      !analysis.hasSpecificTerms &&
      !analysis.codes.length &&
      analysis.meaningfulWords.length === 0
    ) {
      score = Math.min(score, MIN_ASSISTANT_RESULT_SCORE - 1);
    }

    return score;
  }

  function isAssistantReliableSpecificResult(item, query, intent) {
    const doc = item?.doc;

    if (
      !doc ||
      item.score < MIN_ASSISTANT_RESULT_SCORE ||
      isAssistantGenericDoc(doc)
    ) {
      return false;
    }

    const analysis = analyzeAssistantQuery(query);
    const semantic = assistantSemanticScore(doc, analysis.semantic, intent);

    if (semantic.penalties.includes("conflito_acao")) {
      return false;
    }

    const titleLocation = `${doc.title || ""} ${doc.location || ""}`;
    const combined = `${titleLocation} ${doc.text || ""}`;
    const titleLocationMatches = assistantRootMatchCount(
      titleLocation,
      analysis.meaningfulWords
    );
    const strongTitleLocationMatch =
      analysis.meaningfulWords.length > 0 &&
      titleLocationMatches >= Math.min(2, analysis.meaningfulWords.length);
    const businessMatch =
      analysis.businessWords.length > 0 &&
      assistantRootMatchCount(titleLocation, analysis.businessWords) ===
        analysis.businessWords.length;
    const compatibleObject =
      analysis.semantic.object &&
      semantic.object === analysis.semantic.object;
    const specificTermMatch =
      analysis.hasSpecificTerms &&
      analysis.specificMatches.some((match) =>
        match.terms.some((term) => assistantContainsTerm(combined, term))
      );

    return Boolean(
      strongTitleLocationMatch ||
      specificTermMatch ||
      businessMatch ||
      compatibleObject
    );
  }

  function selectAssistantPrimaryResult(ranked, query, intent) {
    const first = ranked[0];

    if (!first || !isAssistantGenericDoc(first.doc)) {
      return first;
    }

    return ranked.find((item) =>
      isAssistantReliableSpecificResult(item, query, intent)
    ) || first;
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

    const primary = selectAssistantPrimaryResult(ranked, query, intent);
    const relatedCandidates = ranked.filter((item) =>
      item.pageKey !== primary.pageKey
    );

    return {
      primary,
      related: getAssistantRelatedResults(primary, relatedCandidates, query, intent),
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
    const querySemantic = analyzeAssistantQuery(query).semantic;
    const candidateSemantic = assistantSemanticScore(
      candidateDoc,
      querySemantic,
      intent
    );

    if (primary.pageKey === candidate.pageKey || isAssistantIndexDoc(candidateDoc)) {
      return -Infinity;
    }

    if (candidateSemantic.penalties.includes("conflito_acao")) {
      return -Infinity;
    }

    if (
      querySemantic.object &&
      candidateSemantic.object &&
      candidateSemantic.object !== querySemantic.object
    ) {
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
    score += Math.min(candidateSemantic.score / 3, 60);

    if (candidateCategory === "FAQ" && score < 82) {
      score -= 22;
    }

    if (candidateCategory === "Ferramenta" && intent !== "tool") {
      return -Infinity;
    }

    if (candidateCategory === "Conteúdo") {
      return -Infinity;
    }

    return score;
  }

  function getAssistantRelatedResults(primary, candidates, query, intent) {
    const usedCategories = new Set([getAssistantCategory(primary.doc)]);

    return candidates
      .map((candidate) => ({
        ...candidate,
        relatedScore: scoreAssistantRelatedResult(primary, candidate, query, intent)
      }))
      .filter((candidate) => {
        const category = getAssistantCategory(candidate.doc);
        const pageKey = candidate.pageKey || assistantPageKey(candidate.doc.location);

        return candidate.score >= MIN_ASSISTANT_RESULT_SCORE &&
          candidate.relatedScore >= MIN_ASSISTANT_RELATED_SCORE &&
          !(
            assistantQueryHasFinalizedInvoiceContext(query) &&
            getAssistantCategory(primary.doc) === "FAQ"
          ) &&
          (category !== "Erro" || (
            assistantQueryAllowsIssueRelated(query, intent) &&
            !assistantQueryIsGenericRejection(query)
          )) &&
          (category !== "Rejeição" || (
            assistantQueryAllowsRejectionRelated(query, intent) &&
            (isAssistantIndexDoc(candidate.doc) || assistantQueryAllowsSpecificRejection(query))
          )) &&
          !(category === "FAQ" &&
            !/\b(complementar|complemento)\b/.test(normalizeAssistantSearch(query)) &&
            /\b(complementar|complemento)\b/.test(normalizeAssistantSearch(candidate.doc.title))) &&
          !(pageKey.includes("registrar-entrada-material") && assistantContextSet(query, "", analyzeAssistantQuery(query).semantic).has("ajuste_inventario")) &&
          assistantRelatedContextCompatible(primary, candidate, query);
      })
      .sort((a, b) => {
        if (b.relatedScore !== a.relatedScore) return b.relatedScore - a.relatedScore;

        const priorityDelta =
          assistantContentTypePriority(getAssistantCategory(a.doc)) -
          assistantContentTypePriority(getAssistantCategory(b.doc));

        if (priorityDelta !== 0) return priorityDelta;
        return b.score - a.score;
      })
      .filter((candidate) => {
        const category = getAssistantCategory(candidate.doc);

        if (usedCategories.has(category)) {
          return false;
        }

        usedCategories.add(category);
        return true;
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
    if (category === "Problema Técnico") return "PROBLEMA TÉCNICO";
    if (category === "Ferramenta") return "FERRAMENTA";
    return category.toUpperCase();
  }

  function assistantContentTypePriority(category) {
    if (category === "Guia") return 0;
    if (category === "Manual") return 1;
    if (category === "FAQ") return 2;
    return 10;
  }

  function assistantOrderResultCards(cards) {
    return cards;
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

      case "Ferramenta":
        return "Abrir ferramenta →";

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
    execute: [
      "Este guia mostra o passo a passo para {assunto}.",
      "Para executar essa rotina, consulte este conteúdo.",
      "O caminho mais direto para {assunto} está aqui.",
      "Esse guia responde melhor ao processo solicitado.",
      "Para fazer isso no WCorp, este é o conteúdo indicado.",
      "Separei o guia operacional mais próximo da sua dúvida.",
      "Use este conteúdo para seguir com {assunto}.",
      "Esse passo a passo deve atender ao que você pediu.",
      "Para realizar essa ação, comece por aqui."
    ],
    consult: [
      "Você pode consultar essa informação por aqui.",
      "Para verificar isso, este conteúdo é o mais indicado.",
      "Esse material mostra onde conferir {assunto}.",
      "A consulta mais relacionada está neste conteúdo.",
      "Para localizar essa informação, veja este material.",
      "Esse conteúdo ajuda a conferir o ponto solicitado.",
      "Para essa consulta, recomendo começar por aqui.",
      "Você encontra essa informação neste conteúdo.",
      "Esse é o caminho mais direto para verificar {assunto}."
    ],
    configure: [
      "Para cadastrar isso, use este guia.",
      "Esse conteúdo mostra a configuração necessária.",
      "O passo a passo de cadastro está aqui.",
      "Para criar esse registro, consulte este conteúdo.",
      "Esse guia é o mais direto para o cadastro.",
      "Para configurar {assunto}, comece por aqui.",
      "Separei a orientação mais adequada para esse cadastro.",
      "Este conteúdo mostra como preparar essa informação.",
      "Use este material para ajustar o cadastro no WCorp."
    ],
    error: [
      "Encontrei a orientação específica para essa rejeição.",
      "Para corrigir essa mensagem, consulte este conteúdo.",
      "Essa solução é a orientação mais indicada para a mensagem.",
      "Veja a orientação para tratar esse erro.",
      "Esse conteúdo explica como validar a rejeição.",
      "Para essa falha, esta é a página mais indicada.",
      "Separei a orientação mais direta para o problema.",
      "Esse material ajuda a conferir a causa do erro.",
      "Use esta referência para analisar a mensagem retornada."
    ],
    technical: [
      "Encontrei uma orientação para este problema técnico.",
      "Separei a orientação técnica mais próxima da sua dúvida.",
      "Esse conteúdo ajuda a analisar esse problema técnico."
    ],
    understand: [
      "Este manual explica essa tela.",
      "Para entender como funciona, consulte este conteúdo.",
      "A documentação da funcionalidade está aqui.",
      "Esse manual descreve os campos e o uso da tela.",
      "Para conhecer essa rotina, veja este material.",
      "Esse conteúdo ajuda a entender {assunto}.",
      "Separei a referência mais adequada sobre a tela.",
      "Para consultar os detalhes da funcionalidade, comece aqui.",
      "Este material reúne a explicação mais próxima da dúvida."
    ],
    single: [
      "Encontrei um conteúdo direto para sua dúvida.",
      "Este conteúdo deve ajudar com a sua dúvida.",
      "Este é o conteúdo mais alinhado com a pergunta.",
      "A resposta mais direta está aqui.",
      "Separei apenas a orientação mais útil.",
      "Esse conteúdo é o melhor ponto de partida.",
      "Para essa dúvida, este conteúdo é o mais adequado.",
      "Encontrei uma orientação direta para você.",
      "Este material deve responder melhor ao que você pediu."
    ],
    complementary: [
      "Encontrei alguns conteúdos que podem ajudar.",
      "Achei mais de uma orientação relacionada à sua dúvida.",
      "Separei opções próximas ao que você perguntou.",
      "Esses conteúdos parecem úteis para essa consulta.",
      "Encontrei materiais relacionados ao tema.",
      "Você pode consultar estas opções.",
      "Achei caminhos úteis para seguir com a dúvida.",
      "Separei conteúdos que tratam desse assunto.",
      "Estas opções estão próximas da sua pergunta."
    ],
    guideOnly: [
      "Encontrei este Guia para o que você precisa.",
      "Este Guia é o conteúdo mais direto para {assunto}.",
      "Você pode seguir este Guia para realizar o processo.",
      "Esse processo está explicado neste Guia.",
      "O Guia abaixo mostra o caminho para {assunto}.",
      "Para essa operação, este Guia é o melhor ponto de partida.",
      "Separei um Guia direto sobre {assunto}.",
      "Use este Guia para seguir com a orientação.",
      "A orientação para esse processo está neste Guia."
    ],
    manualOnly: [
      "Encontrei o Manual dessa funcionalidade.",
      "Este Manual reúne as informações relacionadas a {assunto}.",
      "Você encontra os detalhes dessa funcionalidade neste Manual.",
      "Essa informação está documentada neste Manual.",
      "O Manual abaixo explica os pontos ligados a {assunto}.",
      "Para entender essa tela, consulte este Manual.",
      "Separei o Manual mais próximo da sua dúvida.",
      "Os detalhes da funcionalidade estão neste Manual.",
      "Este Manual deve ajudar na consulta."
    ],
    faqOnly: [
      "Encontrei uma resposta na FAQ para essa dúvida.",
      "Essa dúvida possui uma orientação na FAQ.",
      "Há uma resposta na FAQ relacionada ao que você perguntou.",
      "A FAQ abaixo deve ajudar com {assunto}.",
      "Separei uma orientação da FAQ para essa pergunta.",
      "Essa pergunta já tem uma resposta na FAQ.",
      "Você pode consultar esta resposta da FAQ.",
      "A orientação mais próxima está na FAQ.",
      "Encontrei uma FAQ relacionada à sua dúvida."
    ],
    guideManual: [
      "Encontrei um Guia e um Manual sobre esse assunto.",
      "Achei dois conteúdos relacionados à sua dúvida.",
      "Separei um Guia e um Manual que podem ajudar.",
      "Você pode consultar estes dois conteúdos.",
      "Há um Guia e um Manual próximos da sua pergunta.",
      "Encontrei materiais úteis para {assunto}.",
      "Essas opções tratam do tema que você perguntou.",
      "Achei conteúdos relacionados para seguir com essa dúvida.",
      "Separei estas orientações sobre {assunto}."
    ],
    guideFaq: [
      "Encontrei um Guia e uma resposta da FAQ sobre isso.",
      "Achei dois conteúdos relacionados à sua dúvida.",
      "Separei um Guia e uma FAQ que podem ajudar.",
      "Você pode consultar estas duas opções.",
      "Há um Guia e uma FAQ próximos da pergunta.",
      "Encontrei materiais úteis para {assunto}.",
      "Essas orientações tratam do tema pesquisado.",
      "Achei conteúdos relacionados para seguir com a dúvida.",
      "Separei estas opções sobre {assunto}."
    ],
    manualFaq: [
      "Encontrei um Manual e uma resposta da FAQ sobre isso.",
      "Achei dois conteúdos relacionados à sua dúvida.",
      "Separei um Manual e uma FAQ que podem ajudar.",
      "Você pode consultar estas duas opções.",
      "Há um Manual e uma FAQ próximos da pergunta.",
      "Encontrei materiais úteis para {assunto}.",
      "Essas orientações tratam do tema pesquisado.",
      "Achei conteúdos relacionados para seguir com a dúvida.",
      "Separei estas opções sobre {assunto}."
    ],
    guideManualFaq: [
      "Encontrei um Guia, um Manual e uma FAQ sobre isso.",
      "Achei três conteúdos relacionados à sua dúvida.",
      "Separei um Guia, um Manual e uma FAQ que podem ajudar.",
      "Você pode consultar estas opções.",
      "Há conteúdos de Guia, Manual e FAQ próximos da pergunta.",
      "Encontrei materiais úteis para {assunto}.",
      "Essas orientações tratam do tema pesquisado.",
      "Achei conteúdos relacionados para seguir com a dúvida.",
      "Separei estas opções sobre {assunto}."
    ],
    noResult: [
      "Não encontrei um conteúdo específico para essa dúvida.",
      "Não achei um Guia, Manual ou FAQ que responda diretamente a isso.",
      "Essa dúvida ainda não parece ter um conteúdo específico na Central.",
      "Não tenho uma orientação específica para indicar agora.",
      "Tente informar o nome da tela, processo ou mensagem completa.",
      "Não encontrei uma orientação segura para recomendar.",
      "Ainda não há um conteúdo claro para essa pergunta.",
      "Não achei uma orientação direta o suficiente na Central.",
      "Preciso de um termo mais específico para encontrar a orientação certa."
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

    if (
      !firstLabel &&
      results?.primary?.doc?.title &&
      !isAssistantGenericDoc(results.primary.doc)
    ) {
      return String(results.primary.doc.title)
        .replace(/^como\s+/i, "")
        .replace(/\s+/g, " ")
        .trim();
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

  function assistantIntroSubject(query, results) {
    const subject = assistantSubject(query, results);
    return subject === "sua busca" ? "essa dúvida" : subject;
  }

  function assistantCardCompositionKey(cards) {
    const categories = new Set(cards.map((item) =>
      getAssistantCategory(item.doc || item)
    ));

    if (
      !categories.size ||
      !Array.from(categories).every((category) =>
        ["Guia", "Manual", "FAQ"].includes(category)
      )
    ) {
      return null;
    }

    const hasGuide = categories.has("Guia");
    const hasManual = categories.has("Manual");
    const hasFaq = categories.has("FAQ");

    if (hasGuide && hasManual && hasFaq) return "guideManualFaq";
    if (hasGuide && hasManual) return "guideManual";
    if (hasGuide && hasFaq) return "guideFaq";
    if (hasManual && hasFaq) return "manualFaq";
    if (hasGuide) return "guideOnly";
    if (hasManual) return "manualOnly";
    if (hasFaq) return "faqOnly";

    return null;
  }

  function assistantOrderedCompositionIntro(cards, subject) {
    const article = (category) => category === "FAQ" ? "uma FAQ" : `um ${category}`;
    const demonstrative = (category) => category === "FAQ" ? "esta FAQ" : `este ${category}`;
    const categories = cards
      .map((item) => getAssistantCategory(item.doc || item))
      .filter((category) => ["Guia", "Manual", "FAQ"].includes(category));

    if (categories.length < 2) {
      return "";
    }

    const primaryCategory = categories[0];
    const rest = categories.slice(1).map(article);
    const subjectText = subject === "essa dúvida" ? "" : ` sobre ${subject}`;

    if (rest.length === 1) {
      return `Encontrei ${demonstrative(primaryCategory)}${subjectText}. Também achei ${rest[0]} que pode ajudar.`;
    }

    return `Encontrei ${demonstrative(primaryCategory)}${subjectText}. Também achei ${rest.slice(0, -1).join(", ")} e ${rest[rest.length - 1]} que podem ajudar.`;
  }

  function assistantResponseFamily(category, query, results) {
    const semantic = analyzeAssistantQuery(query).semantic;

    if (results?.related?.length) {
      return "complementary";
    }

    if (category === "Problema Técnico") {
      return "technical";
    }

    if (category === "Rejeição" || category === "Erro" || semantic.action === "corrigir") {
      return "error";
    }

    if (semantic.action === "consultar") {
      return "consult";
    }

    if (semantic.action === "cadastrar" || semantic.action === "configurar") {
      return "configure";
    }

    if (semantic.action === "entender" || category === "Manual") {
      return "understand";
    }

    if (assistantOperationalAction(semantic.action) || category === "Guia") {
      return "execute";
    }

    return "single";
  }

  function assistantIntro(category, query, results, cards) {
    const subject = assistantIntroSubject(query, results);
    const orderedIntro = assistantOrderedCompositionIntro(cards || [], subject);
    const compositionKey = assistantCardCompositionKey(cards || []);

    if (assistantQueryIsGenericRejection(query)) {
      return "Informe o código ou a mensagem da rejeição para encontrar uma solução específica. Enquanto isso, consulte este conteúdo.";
    }

    if (orderedIntro) {
      return orderedIntro;
    }

    if (compositionKey) {
      return pickAssistantPhrase(
        compositionKey,
        assistantIntroPhrases[compositionKey]
      ).replace("{assunto}", subject);
    }

    const phraseKey = assistantResponseFamily(category, query, results);

    const phrases =
      assistantIntroPhrases[phraseKey] ||
      assistantIntroPhrases.single;

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
      const phrase = pickAssistantPhrase(
        "noResult",
        assistantIntroPhrases.noResult
      );

      return {
        textHtml: `
          <strong>${escapeHtml(phrase)}</strong>
          <br>
          Tente informar o código, nome da tela ou mensagem completa.
          <br><br>
          Caso seja uma falha do sistema, você pode abrir um chamado no Suporte.
        `,
        cardsHtml: ""
      };
    }

    const cards = assistantOrderResultCards([
      results.primary,
      ...results.related
    ]);
    const category = getAssistantCategory(cards[0].doc);
    const cardsHtml = cards.length
      ? `
        <div class="wc-assistant__answer-cards">
          ${cards.map(renderAssistantResultCard).join("")}
        </div>
      `
      : "";

    return {
      textHtml: `<strong>${escapeHtml(assistantIntro(category, query, results, cards))}</strong>`,
      cardsHtml
    };
  }

  /*
   * ============================
   * INICIALIZAÇÃO
   * ============================
   */

  function initializeAssistant() {
    window.__WC_ASSISTANT_DEBUG__.initializeCalls +=
      1;

    if (document.querySelector(".wc-assistant")) {
      window.__WC_ASSISTANT_DEBUG__.skippedExistingInstances +=
        1;
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
    const assistantViewportMargin = 12;
    let lastLauncherAnchor = null;

    const clampAssistantPanelPosition = (value, min, max) =>
      Math.min(
        Math.max(value, min),
        Math.max(min, max)
      );

    const readPixelValue = (
      value,
      fallback
    ) => {
      const number =
        Number.parseFloat(value);

      return Number.isFinite(number)
        ? number
        : fallback;
    };

    const readAssistantFixedAnchor = () => {
      const style =
        window.getComputedStyle(assistant);
      const right =
        readPixelValue(
          style.right,
          assistantViewportMargin
        );
      const bottom =
        readPixelValue(
          style.bottom,
          assistantViewportMargin
        );

      return {
        right:
          window.innerWidth - right,
        bottom:
          window.innerHeight - bottom
      };
    };

    const readLauncherAnchor = () => {
      if (
        assistant.classList.contains(
          "wc-assistant--open"
        ) ||
        assistant.classList.contains(
          "wc-assistant--closing"
        )
      ) {
        lastLauncherAnchor =
          readAssistantFixedAnchor();

        return lastLauncherAnchor;
      }

      const launcherRect =
        launcher.getBoundingClientRect();

      if (
        launcherRect.width &&
        launcherRect.height
      ) {
        lastLauncherAnchor = {
          right:
            launcherRect.right,
          bottom:
            launcherRect.bottom
        };
      }

      return lastLauncherAnchor ||
        readAssistantFixedAnchor();
    };

    const positionAssistantPanel = (
      anchor = readLauncherAnchor()
    ) => {
      if (panel.hidden) {
        return;
      }

      const panelWidth =
        panel.offsetWidth;
      const panelHeight =
        panel.offsetHeight;

      if (
        !anchor ||
        !panelWidth ||
        !panelHeight
      ) {
        return;
      }

      const maxLeft =
        window.innerWidth -
        panelWidth -
        assistantViewportMargin;
      const desiredLeft =
        anchor.right -
        panelWidth;

      const desiredBottom =
        window.innerHeight -
        anchor.bottom;

      const maxBottom =
        window.innerHeight -
        assistantViewportMargin -
        panelHeight;

      const left =
        clampAssistantPanelPosition(
          desiredLeft,
          assistantViewportMargin,
          maxLeft
        );

      const bottom =
        clampAssistantPanelPosition(
          desiredBottom,
          assistantViewportMargin,
          maxBottom
        );

      panel.style.setProperty(
        "--wc-assistant-panel-left",
        `${Math.round(left)}px`
      );
      panel.style.setProperty(
        "--wc-assistant-panel-bottom",
        `${Math.round(bottom)}px`
      );
    };

    const scheduleAssistantPanelPosition = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          positionAssistantPanel();
        });
      });
    };

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
          ) ||
          element.classList.contains(
            "wc-assistant__message--temporary"
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
        assistant.classList.remove(
          "wc-assistant--closing"
        );

        const launcherAnchor =
          readLauncherAnchor();

        panel.hidden = false;

        positionAssistantPanel(
          launcherAnchor
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
        scheduleAssistantPanelPosition();

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

        const isFirstUserMessage = !messages.querySelector(
          ".wc-assistant__message--user"
        );

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
        const consultationMessage = isFirstUserMessage
          ? createMessage(
              "Opa! Sou o Assistente WCorp. Já vou verificar isso pra você."
            )
          : null;

        consultationMessage?.classList.add(
          "wc-assistant__message--temporary"
        );

        setAssistantBusy(true);

        if (consultationMessage) {
          messages.appendChild(consultationMessage);
        }
        messages.appendChild(typingMessage);

        scrollConversationToBottom();

        try {
          const response = await fetch(
            "http://127.0.0.1:8642/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer wcorp-hermes-local"
              },
              body: JSON.stringify({
                model: "hermes-agent",
                messages: [
                  {
                    role: "user",
                    content: value
                  }
                ]
              })
            }
          );

          if (!response.ok) {
            throw new Error(
              `Hermes respondeu com HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          const hermesAnswer =
            data?.choices?.[0]?.message?.content ||
            "Não foi possível obter uma resposta do Assistente.";

          consultationMessage?.remove();
          typingMessage.remove();

          messages.appendChild(
            createMarkdownMessage(
              hermesAnswer
            )
          );
        } catch (error) {
          console.error(
            "Erro ao consultar Hermes:",
            error
          );

          consultationMessage?.remove();
          typingMessage.remove();

          messages.appendChild(
            createMessage(
              "Não consegui me conectar ao Hermes neste momento."
            )
          );
        } finally {
          consultationMessage?.remove();
          typingMessage.remove();
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

    window.addEventListener(
      "resize",
      scheduleAssistantPanelPosition,
      {
        passive: true
      }
    );

    window.addEventListener(
      "orientationchange",
      scheduleAssistantPanelPosition,
      {
        passive: true
      }
    );

    if (
      window.document$ &&
      typeof window.document$.subscribe ===
        "function"
    ) {
      window.document$.subscribe(
        scheduleAssistantPanelPosition
      );
    }

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
