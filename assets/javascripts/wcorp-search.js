(function () {
  const manualSections = [
    "/administracao/",
    "/colaboradores/",
    "/comercial/",
    "/compras/",
    "/contratos/",
    "/faturamento/",
    "/financeiro/",
    "/fornecedores/",
    "/materiais/",
    "/producao/",
    "/relatorios/",
    "/servicos/",
    "/transportes/"
  ];

  const groups = [
    {
      label: "Guias",
      icon: "guide",
      test: (path) => path.startsWith("/como-fazer/") && path !== "/como-fazer"
    },
    {
      label: "FAQ",
      icon: "reference",
      test: (path) => path.startsWith("/referencia/faq/") && path !== "/referencia/faq"
    },
    {
      label: "Manuais",
      icon: "manual",
      test: (path) => manualSections.some((section) => path.startsWith(section)) &&
        !/-geral$/.test(path)
    },
    {
      label: "Rejeições / Erros e Soluções",
      icon: "errors",
      test: (path) => path.startsWith("/erros-solucoes/") && path !== "/erros-solucoes"
    }
  ];

  let searchMeta = null;
  let searchMetaPromise = null;
  let searchStateReady = false;
  let publishedManualPaths = null;
  let publishedGuidePaths = null;
  let publishedGuidePathsPromise = null;
  let blockedSearchClickReady = false;
  let lastSearchAnalyticsSignature = "";
  let searchAnalyticsTimer = 0;
  const searchAnalyticsDebounceMs = 850;

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function cleanPathname(pathname) {
    return pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  }

  function portalPath(url) {
    const root = cleanPathname(new URL(rootUrl(), window.location.href).pathname);
    const path = cleanPathname(url.pathname);
    const relative = root !== "/" && path.startsWith(root) ? path.slice(root.length) || "/" : path;
    return cleanPathname(relative.startsWith("/") ? relative : `/${relative}`);
  }

  function resultUrl(item) {
    const link = item.querySelector(".md-search-result__link[href], a[href]");
    if (!link) return null;

    try {
      return new URL(link.getAttribute("href"), window.location.href);
    } catch (_error) {
      return null;
    }
  }

  function resultPath(item) {
    const url = resultUrl(item);
    return url ? portalPath(url) : "";
  }

  function groupForPath(path) {
    return groups.find((group) => group.test(path)) || null;
  }

  function isManualPath(path) {
    return manualSections.some((section) => path.startsWith(section)) && !/-geral$/.test(path);
  }

  function publishedManualPagePaths() {
    if (publishedManualPaths) return publishedManualPaths;

    publishedManualPaths = new Set();
    document.querySelectorAll(".md-sidebar--primary .md-nav--primary a.md-nav__link[href]").forEach((link) => {
      try {
        const path = portalPath(new URL(link.href, window.location.href));
        if (isManualPath(path)) {
          publishedManualPaths.add(path);
        }
      } catch (_error) {
        // Ignora links inválidos gerados por extensões ou navegação temporária.
      }
    });

    return publishedManualPaths;
  }

  function isBlockedManualPath(path) {
    if (!isManualPath(path)) return false;

    const publishedPaths = publishedManualPagePaths();
    return publishedPaths.size > 0 && !publishedPaths.has(path);
  }

  function normalizeCatalogPortalPath(value) {
    return cleanPathname(`/${String(value || "")
      .replace(/^\/+/, "")
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "")}`);
  }

  function loadPublishedGuidePaths() {
    if (publishedGuidePaths) return Promise.resolve(publishedGuidePaths);
    if (publishedGuidePathsPromise) return publishedGuidePathsPromise;

    publishedGuidePathsPromise = fetch(new URL("assets/data/content-catalog.json", rootUrl()))
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
            paths.add(normalizeCatalogPortalPath(item.url));
          }
        });

        publishedGuidePaths = paths;
        return publishedGuidePaths;
      })
      .catch(() => {
        publishedGuidePaths = new Set();
        return publishedGuidePaths;
      });

    return publishedGuidePathsPromise;
  }

  function isBlockedGuidePath(path) {
    if (!path.startsWith("/como-fazer/") || path === "/como-fazer") return false;
    return publishedGuidePaths?.size > 0 && !publishedGuidePaths.has(path);
  }

  function preventBlockedManualResultClick() {
    if (blockedSearchClickReady) return;
    blockedSearchClickReady = true;

    document.addEventListener("click", (event) => {
      const link = event.target.closest(".md-search-result a[href]");
      if (!link) return;

      let path = "";
      try {
        path = portalPath(new URL(link.href, window.location.href));
      } catch (_error) {
        return;
      }

      if (!isBlockedManualPath(path)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      link.closest(".md-search-result__item")?.remove();
    }, true);
  }

  function stripSearchNoise(value) {
    return String(value || "")
      .replace(/Ausente:\s*[\wÀ-ÿ-]+/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeSearchText(value) {
    if (window.WCorpSearchUtils?.normalizeText) {
      return window.WCorpSearchUtils.normalizeText(value);
    }

    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function titleFromSlug(path) {
    const slug = path.split("/").filter(Boolean).pop() || "";
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => /^\d+$/.test(part) ? part : part.charAt(0).toLocaleUpperCase("pt-BR") + part.slice(1))
      .join(" ");
  }

  function displayTitle(path) {
    const rawTitle = searchMeta?.titles.get(path) || titleFromSlug(path);
    const cleaned = stripSearchNoise(rawTitle);
    if (path.startsWith("/erros-solucoes/rejeicoes-fiscais/")) {
      return cleaned.replace(/^Rejei[cç][aã]o\s+(\d+)\s*[-–—]\s*/i, "$1 — ");
    }
    return cleaned;
  }

  function indexLocationPath(location) {
    const url = new URL(location || ".", rootUrl());
    url.hash = "";
    return portalPath(url);
  }

  function isPageLevelLocation(location) {
    return !String(location || "").includes("#");
  }

  function buildSearchMeta(index) {
    const titles = new Map();
    const docs = new Map();
    const pageLevel = new Set();

    (index.docs || []).forEach((doc) => {
      const path = indexLocationPath(doc.location);
      if (!groupForPath(path)) return;

      const title = stripSearchNoise(doc.title);
      if (!title) return;

      const current = docs.get(path) || { title: "", text: "", location: path };
      current.text = `${current.text} ${doc.text || ""} ${doc.title || ""}`.trim();
      current.location = doc.location || path;

      if (isPageLevelLocation(doc.location)) {
        titles.set(path, title);
        pageLevel.add(path);
        current.title = title;
      } else if (!pageLevel.has(path) && !titles.has(path)) {
        titles.set(path, title);
        current.title = title;
      }

      docs.set(path, current);
    });

    return { titles, docs };
  }

  function loadSearchMeta() {
    if (searchMeta) return Promise.resolve(searchMeta);
    if (searchMetaPromise) return searchMetaPromise;

    searchMetaPromise = fetch(new URL("search/search_index.json", rootUrl()))
      .then((response) => response.json())
      .then((index) => {
        searchMeta = buildSearchMeta(index);
        return searchMeta;
      })
      .catch(() => {
        searchMeta = { titles: new Map(), docs: new Map() };
        return searchMeta;
      });

    return searchMetaPromise;
  }

  function decorateResult(item, path, group) {
    item.dataset.wcSearchGroup = group.label;
    item.dataset.wcSearchIcon = group.icon;

    const link = item.querySelector(".md-search-result__link[href], a[href]");
    const article = item.querySelector(".md-search-result__article") || link;
    const url = resultUrl(item);
    const title = displayTitle(path);

    if (link && url) {
      url.hash = "";
      link.href = url.href;
      link.setAttribute("aria-label", title);
      link.title = title;
    }

    item.querySelectorAll(":scope > .md-search-result__link, :scope > a[href]").forEach((candidate) => {
      if (candidate !== link) candidate.remove();
    });

    item.querySelectorAll([
      ".md-search-result__teaser",
      ".md-search-result__more",
      ".md-search-result__terms",
      ".md-search-result__icon"
    ].join(",")).forEach((element) => element.remove());

    const icon = document.createElement("span");
    icon.className = "wc-search-result-icon";
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "wc-search-result-text";

    const titleElement = document.createElement("span");
    titleElement.className = "md-search-result__title";
    titleElement.textContent = title;

    const typeElement = document.createElement("span");
    typeElement.className = "wc-search-result-type";
    typeElement.textContent = group.label;

    text.append(titleElement, typeElement);
    article?.replaceChildren(icon, text);
  }

  function isDecorated(item) {
    return Boolean(item.querySelector(".wc-search-result-text")) &&
      !item.querySelector([
        ".md-search-result__teaser",
        ".md-search-result__more",
        ".md-search-result__terms",
        ".md-search-result__icon"
      ].join(","));
  }

  function createHeading(label) {
    const heading = document.createElement("li");
    heading.className = "wc-search-group";
    heading.setAttribute("aria-hidden", "true");
    heading.textContent = label;
    return heading;
  }

  function queryIntent(query) {
    const normalized = normalizeSearchText(query);
    const codes = window.WCorpSearchUtils?.extractCodes?.(query) || normalized.match(/\b\d{3,4}\b/g) || [];

    if (codes.length || /\b(rejeicao|erro|schema|sefaz|xml)\b/.test(normalized)) {
      return "error";
    }

    if (/\b(onde fica|qual campo|quais campos|para que serve|tela de|manual)\b/.test(normalized)) {
      return "manual";
    }

    if (/\b(como|guia|cadastrar|cadastro|cancelar|configurar|emitir|faturar|gerar|importar|lancar)\b/.test(normalized)) {
      return "guide";
    }

    return "general";
  }

  function searchScore(path, query) {
    if (!query) return 0;

    const doc = searchMeta?.docs?.get(path) || {};
    const title = displayTitle(path);

    if (window.WCorpSearchUtils?.scoreDocument) {
      return window.WCorpSearchUtils.scoreDocument({
        title,
        location: doc.location || path,
        text: doc.text || ""
      }, query, { intent: queryIntent(query) });
    }

    const normalizedQuery = normalizeSearchText(query);
    return normalizeSearchText(`${title} ${path} ${doc.text || ""}`).includes(normalizedQuery) ? 1 : 0;
  }

  function organizeResults(list) {
    if (list.dataset.wcSearchOrganizing === "true") return;

    const result = list.closest(".md-search-result");
    const input = document.querySelector(".md-search__input");
    const items = Array.from(list.children).filter((child) =>
      child.classList.contains("md-search-result__item")
    );
    const query = (input?.value || "").trim();

    const trackSearchAnalytics = (resultCount) => {
      window.clearTimeout(searchAnalyticsTimer);

      if (!query || !window.WCorpAnalytics?.trackSearch) return;

      const signature = `${normalizeSearchText(query)}|${resultCount}`;

      searchAnalyticsTimer = window.setTimeout(() => {
        if (signature === lastSearchAnalyticsSignature) return;

        lastSearchAnalyticsSignature = signature;
        window.WCorpAnalytics.trackSearch({
          result_count: resultCount,
          has_results: resultCount > 0
        });
      }, searchAnalyticsDebounceMs);
    };

    document.body.classList.toggle("wc-search-open", Boolean(query) || isSearchOpen());

    if (!items.length) {
      result?.classList.remove("wc-search-has-results");
      list.dataset.wcSearchSignature = "";
      trackSearchAnalytics(0);

      const meta = result?.querySelector(".md-search-result__meta");
      if (meta && !query) meta.textContent = "Digite para iniciar a busca.";
      return;
    }

    const allowedItems = [];
    const seenPaths = new Set();

    items.forEach((item) => {
      const path = resultPath(item);
      const group = groupForPath(path);
      if (!group || seenPaths.has(path)) return;
      if (isBlockedManualPath(path)) return;
      if (isBlockedGuidePath(path)) return;

      seenPaths.add(path);
      allowedItems.push({ item, path, group, score: searchScore(path, query) });
    });

    if (!allowedItems.length) {
      result?.classList.remove("wc-search-has-results");
      list.dataset.wcSearchSignature = "";
      list.replaceChildren();
      trackSearchAnalytics(0);
      return;
    }

    const signature = allowedItems
      .map(({ path, group, score }) => `${group.label}:${displayTitle(path)}:${path}:${score}`)
      .join("|");
    const fullSignature = `${normalizeSearchText(query)}|${signature}`;

    if (
      list.dataset.wcSearchSignature === fullSignature &&
      list.querySelector(".wc-search-group") &&
      allowedItems.every(({ item }) => isDecorated(item))
    ) {
      return;
    }

    list.dataset.wcSearchOrganizing = "true";
    result?.classList.add("wc-search-has-results");

    const fragment = document.createDocumentFragment();
    const orderedGroups = [...groups].sort((first, second) => {
      if (!query) return groups.indexOf(first) - groups.indexOf(second);

      const firstBest = Math.max(...allowedItems
        .filter((entry) => entry.group.label === first.label)
        .map((entry) => entry.score), -Infinity);
      const secondBest = Math.max(...allowedItems
        .filter((entry) => entry.group.label === second.label)
        .map((entry) => entry.score), -Infinity);

      if (!Number.isFinite(firstBest) && !Number.isFinite(secondBest)) {
        return groups.indexOf(first) - groups.indexOf(second);
      }

      return secondBest - firstBest || groups.indexOf(first) - groups.indexOf(second);
    });

    orderedGroups.forEach((group) => {
      const groupItems = allowedItems
        .filter((entry) => entry.group.label === group.label)
        .sort((first, second) => {
          if (query && second.score !== first.score) return second.score - first.score;
          return displayTitle(first.path).localeCompare(displayTitle(second.path), "pt-BR");
        });

      if (!groupItems.length) return;

      fragment.appendChild(createHeading(group.label));
      groupItems.forEach(({ item, path }) => {
        decorateResult(item, path, group);
        fragment.appendChild(item);
      });
    });

    list.replaceChildren(fragment);
    list.dataset.wcSearchSignature = fullSignature;
    list.dataset.wcSearchOrganizing = "false";
    trackSearchAnalytics(allowedItems.length);
  }

  function isSearchOpen() {
    const search = document.querySelector(".md-search");
    const input = document.querySelector(".md-search__input");
    const toggle = document.querySelector("[data-md-toggle='search']");
    return Boolean(
      search?.classList.contains("md-search--active") ||
      toggle?.checked ||
      (input && document.activeElement === input)
    );
  }

  function syncSearchState() {
    const open = isSearchOpen();
    const input = document.querySelector(".md-search__input");
    const empty = open && !(input?.value || "").trim();

    document.body.classList.toggle("wc-search-open", open);
    document.body.classList.toggle("wc-search-empty", empty);
  }

  function initializeSearchState() {
    if (searchStateReady) {
      syncSearchState();
      return;
    }

    searchStateReady = true;
    const search = document.querySelector(".md-search");
    const observer = new MutationObserver(syncSearchState);
    if (search) observer.observe(search, { attributes: true, attributeFilter: ["class"] });

    ["focusin", "focusout", "click", "keydown", "input"].forEach((eventName) => {
      document.addEventListener(eventName, () => window.setTimeout(syncSearchState, 0), true);
    });
    syncSearchState();
  }

  function initializeSearchGroups() {
    const resultList = document.querySelector(".md-search-result__list");
    initializeSearchState();
    preventBlockedManualResultClick();
    publishedManualPaths = null;
    if (!resultList || resultList.dataset.wcSearchObserver === "true") return;

    resultList.dataset.wcSearchObserver = "true";
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(() => {
        pending = false;
        Promise.all([loadSearchMeta(), loadPublishedGuidePaths()])
          .then(() => organizeResults(resultList));
      });
    });
    observer.observe(resultList, { childList: true, subtree: true, characterData: true });
    Promise.all([loadSearchMeta(), loadPublishedGuidePaths()])
      .then(() => organizeResults(resultList));
  }

  document.addEventListener("DOMContentLoaded", initializeSearchGroups);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeSearchGroups);
  }
})();
