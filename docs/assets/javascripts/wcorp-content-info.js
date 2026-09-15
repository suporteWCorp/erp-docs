(function () {
  const dataPath = "assets/data/content-info.json";
  const catalogPath = "assets/data/content-catalog.json";
  const manualPrefixes = [
    "administracao", "colaboradores", "comercial", "compras", "contratos", "faturamento",
    "financeiro", "fornecedores", "materiais", "producao", "relatorios", "servicos", "transportes"
  ];
  const difficultyLevels = {
    basic: { label: "Básico", dots: 1 },
    intermediate: { label: "Intermediário", dots: 2 },
    advanced: { label: "Avançado", dots: 3 }
  };

  let contentInfoCache = null;
  let contentCatalogCache = null;
  let renderVersion = 0;

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function contentKey(url = window.location.href) {
    const root = new URL(rootUrl());
    const target = new URL(url, window.location.href);
    const base = root.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
    const path = target.pathname.startsWith(base)
      ? target.pathname.slice(base.length)
      : target.pathname;

    return path
      .replace(/^\/+/, "")
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
  }

  function catalogKey(value = "") {
    return String(value || "")
      .replace(/^\/+/, "")
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
  }

  function pageType(path) {
    if (path.startsWith("como-fazer/") && path !== "como-fazer") return "guide";
    if (manualPrefixes.some((prefix) => path.startsWith(`${prefix}/`)) && !/-geral$/.test(path)) return "manual";
    return "";
  }

  function loadContentInfo() {
    if (contentInfoCache) return contentInfoCache;

    contentInfoCache = fetch(new URL(dataPath, rootUrl()).href)
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));

    return contentInfoCache;
  }

  function loadContentCatalog() {
    if (contentCatalogCache) return contentCatalogCache;

    contentCatalogCache = fetch(new URL(catalogPath, rootUrl()).href)
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .catch(() => ({ items: [] }));

    return contentCatalogCache;
  }

  function catalogItemByPath(catalog, path) {
    const target = catalogKey(path);
    return (catalog?.items || []).find((item) => catalogKey(item.url) === target) || null;
  }

  function catalogItemById(catalog, id) {
    return (catalog?.items || []).find((item) => item.id === id) || null;
  }

  function guidePathById(catalog) {
    const paths = new Map();
    (catalog?.items || []).forEach((item) => {
      if (item.id && item.type === "guia" && item.status === "published") {
        paths.set(item.id, catalogKey(item.url));
      }
    });
    return paths;
  }

  function contentInfoWithoutStaticGuidePopular(infoByPath, catalog) {
    const merged = {};
    Object.entries(infoByPath || {}).forEach(([path, data]) => {
      merged[path] = {
        ...data,
        popular: path.startsWith("como-fazer/") ? false : data.popular,
        popularityTotal: 0
      };
    });

    guidePathById(catalog).forEach((path) => {
      merged[path] = {
        ...(merged[path] || {}),
        popular: false,
        popularityTotal: 0
      };
    });

    return merged;
  }

  function applyGuidePopularity(infoByPath, catalog, popularity) {
    const merged = contentInfoWithoutStaticGuidePopular(infoByPath, catalog);
    const paths = guidePathById(catalog);

    if (!popularity?.ok || !Array.isArray(popularity.items)) return merged;

    popularity.items.forEach((item) => {
      const path = paths.get(item.content_id);
      if (!path) return;

      merged[path] = {
        ...(merged[path] || {}),
        popular: Boolean(item.popular),
        popularityTotal: Number(item.total) || 0
      };
    });

    return merged;
  }

  function loadContentInfoWithPopularity(catalog) {
    const catalogPromise = catalog ? Promise.resolve(catalog) : loadContentCatalog();

    return Promise.all([loadContentInfo(), catalogPromise]).then(([infoByPath, loadedCatalog]) => {
      const neutralInfo = contentInfoWithoutStaticGuidePopular(infoByPath, loadedCatalog);
      if (!window.WCorpAnalytics?.getGuidePopularity) return neutralInfo;

      return window.WCorpAnalytics.getGuidePopularity()
        .then((popularity) => applyGuidePopularity(infoByPath, loadedCatalog, popularity))
        .catch(() => neutralInfo);
    });
  }

  function itemUrl(item) {
    return new URL(catalogKey(item.url), rootUrl()).href;
  }

  function normalizeList(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function cleanTextForReadingTime(content) {
    const clone = content.cloneNode(true);
    clone.querySelectorAll([
      ".headerlink",
      ".wc-content-info",
      ".wc-page-favorite",
      ".wc-support-footer",
      "script",
      "style",
      "video"
    ].join(",")).forEach((element) => element.remove());

    return clone.textContent || "";
  }

  function ReadingTime(content, manualValue) {
    if (manualValue) return manualValue;

    const words = cleanTextForReadingTime(content)
      .trim()
      .split(/\s+/)
      .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

    return `${Math.max(1, Math.ceil(words / 200))} min`;
  }

  function iconSvg(name) {
    const paths = {
      time: '<path d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5zm0 2a7.25 7.25 0 1 1 0 14.5 7.25 7.25 0 0 1 0-14.5zm1 2.7h-2v5.05l4.12 2.47 1-1.65L13 11.45v-4z"/>',
      difficulty: '<path d="M4 19h16v2H4v-2zm2-3h3V8H6v8zm5 0h3V4h-3v12zm5 0h3v-6h-3v6z"/>',
      popular: '<path d="M4 17.5 9.5 12l3.2 3.2L20 7.9V12h2V4h-8v2h4.6l-5.9 5.9L9.5 8.7 2.6 15.6 4 17.5z"/>',
      video: '<path d="M8 5v14l11-7L8 5z"/>'
    };
    if (!paths[name]) return "";

    return `<svg class="wc-content-info__icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }

  function createInfoItem(type, label, title) {
    const item = document.createElement("span");
    item.className = `wc-content-info__item wc-content-info__item--${type}`;
    if (title) item.title = title;
    item.innerHTML = `${iconSvg(type)}<span>${label}</span>`;
    return item;
  }

  function createInfoLink(type, label, title, href) {
    const item = document.createElement("a");
    item.className = `wc-content-info__item wc-content-info__item--${type}`;
    item.href = href;
    if (title) item.title = title;
    item.innerHTML = `${iconSvg(type)}<span>${label}</span>`;
    return item;
  }

  function ReadingTimeIndicator(content, manualValue) {
    return createInfoItem("time", ReadingTime(content, manualValue), "Tempo de leitura");
  }

  function DifficultyIndicator(level) {
    const difficulty = difficultyLevels[level];
    if (!difficulty) return null;

    const item = createInfoItem(
      "difficulty",
      difficulty.label,
      `Dificuldade: ${difficulty.label}`
    );

    item.setAttribute("aria-label", `Dificuldade: ${difficulty.label}`);

    const dots = document.createElement("span");
    dots.className = `wc-difficulty wc-difficulty--${level}`;
    dots.setAttribute("aria-hidden", "true");

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span");
      dot.className = "wc-difficulty__dot";
      if (index < difficulty.dots) {
        dot.classList.add("wc-difficulty__dot--active");
      }
      dots.appendChild(dot);
    }

    item.prepend(dots);
    return item;
  }

  function PopularIndicator(compact = false) {
    const item = compact
      ? document.createElement("span")
      : createInfoItem("popular", "Popular", "Conteúdo popular");

    if (compact) {
      item.className = "wc-card-popular";
      item.title = "Popular";
      item.setAttribute("aria-label", "Popular");
      item.innerHTML = iconSvg("popular");
    }

    return item;
  }

  function videoTarget(content) {
    const heading = content.querySelector("h2[id='demonstracao-em-video']");
    if (heading) return `#${heading.id}`;

    const video = content.querySelector("video");
    if (!video) return "";

    if (!video.id) video.id = "demonstracao-em-video";
    return `#${video.id}`;
  }

  function VideoIndicator(content, duration) {
    const href = videoTarget(content);
    const label = duration ? `Vídeo ${duration}` : "Vídeo";
    return href
      ? createInfoLink("video", label, "Ir para a demonstração em vídeo", href)
      : createInfoItem("video", label, "Demonstração em vídeo disponível");
  }

  function decorateVideoLinks(content) {
    content.querySelectorAll("a.wc-video-link[href]").forEach((link) => {
      if (link.dataset.wcVideoReady === "true") return;

      const href = link.getAttribute("href") || "";
      if (!/\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(href)) return;

      const video = document.createElement("video");
      video.className = "wc-video";
      video.controls = true;
      video.preload = "auto";
      video.playsInline = true;

      if (link.dataset.poster) {
        video.poster = link.dataset.poster;
      }

      if (link.id) {
        video.id = link.id;
      }

      const source = document.createElement("source");
      source.src = link.href;
      source.type = href.toLowerCase().endsWith(".webm")
        ? "video/webm"
        : href.toLowerCase().endsWith(".ogg")
          ? "video/ogg"
          : "video/mp4";

      video.appendChild(source);
      video.append("Seu navegador não conseguiu reproduzir este vídeo.");
      link.dataset.wcVideoReady = "true";
      link.replaceWith(video);

      window.WCorpVideo?.prepareSeekableVideo?.(video);
    });
  }

  function pageHasVideo(content) {
    return Boolean(content.querySelector("video, h2[id='demonstracao-em-video']"));
  }

  function ContentInfo(content, data) {
    const wrapper = document.createElement("div");
    wrapper.className = "wc-content-info";

    wrapper.appendChild(ReadingTimeIndicator(content, data.readingTime));

    const difficulty = DifficultyIndicator(data.difficulty);
    if (difficulty) wrapper.appendChild(difficulty);

    if (data.popular) wrapper.appendChild(PopularIndicator());

    if (data.videoAvailable || pageHasVideo(content)) {
      wrapper.appendChild(VideoIndicator(content, data.videoDuration));
    }

    return wrapper;
  }

  function enhanceVideoScroll(content) {
    content.querySelectorAll(".wc-content-info__item--video[href^='#']").forEach((link) => {
      if (link.dataset.wcVideoScrollReady === "true") return;
      link.dataset.wcVideoScrollReady = "true";

      link.addEventListener("click", (event) => {
        const id = decodeURIComponent(link.hash.slice(1));
        const target = id ? document.getElementById(id) : null;
        if (!target) return;

        event.preventDefault();
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}${link.hash}`);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function clearUnexpectedGuideVideoHash(path, content) {
    if (path === "como-fazer" || !path.startsWith("como-fazer/")) return;
    if (!/^#(?:demonstracao-em-video|video)$/i.test(window.location.hash)) return;
    if (!content.querySelector("h2#demonstracao-em-video, video#wc-video, video#demonstracao-em-video")) return;

    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }

  function markGuidePage(path, type) {
    document.body?.classList.toggle("wc-guide-page", type === "guide");
    document.body?.classList.toggle("wc-guide-index", path === "como-fazer");
  }

  function normalizeHeadingText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".headerlink").forEach((link) => link.remove());
    return clone.textContent
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function removeSectionByHeading(content, headingText) {
    const normalized = headingText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    const heading = Array.from(content.querySelectorAll(":scope > h2"))
      .find((element) => normalizeHeadingText(element) === normalized);

    if (!heading) return null;

    let node = heading;

    while (node && (node === heading || !(node.nodeType === 1 && /^H[12]$/.test(node.tagName)))) {
      const next = node.nextSibling;
      node.remove();
      node = next;
    }

    return node;
  }

  function introInsertionPoint(content) {
    const firstHeading = content.querySelector(":scope > h2");
    if (!firstHeading) return null;
    if (normalizeHeadingText(firstHeading) !== "objetivo") return firstHeading;

    let node = firstHeading.nextSibling;
    while (node && !(node.nodeType === 1 && /^H[12]$/.test(node.tagName))) {
      node = node.nextSibling;
    }

    return node;
  }

  function decorateScreenPath(content, item) {
    if (!item || item.type !== "manual") return;

    const parts = normalizeList(item.screen_path);
    if (!parts.length) return;

    content.querySelectorAll(".wc-screen-path[data-wc-generated='true']").forEach((element) => element.remove());

    const removedPoint = removeSectionByHeading(content, "caminho");
    const section = document.createElement("section");
    section.className = "wc-screen-path";
    section.dataset.wcGenerated = "true";

    const heading = document.createElement("h2");
    heading.id = "caminho";
    heading.textContent = "Caminho";

    const paragraph = document.createElement("p");
    const code = document.createElement("code");
    code.textContent = parts.join(" > ");
    paragraph.appendChild(code);

    section.append(heading, paragraph);
    content.insertBefore(section, removedPoint || introInsertionPoint(content));
  }

  function relatedIds(item) {
    return [
      ...normalizeList(item?.related_manual),
      ...normalizeList(item?.related_guides)
    ];
  }

  function relatedTypeLabel(type) {
    if (type === "manual") return "Manual";
    if (type === "guia") return "Guia";
    return "Conteúdo";
  }

  function decorateRelatedContent(content, item, catalog) {
    if (!item || !catalog) return;

    const ids = relatedIds(item);
    if (!ids.length) return;

    content.querySelectorAll(".wc-related-content[data-wc-generated='true']").forEach((element) => element.remove());
    removeSectionByHeading(content, "veja tambem");

    const targets = ids
      .map((id) => catalogItemById(catalog, id))
      .filter(Boolean);

    if (!targets.length) return;

    const section = document.createElement("section");
    section.className = "wc-related-content";
    section.dataset.wcGenerated = "true";

    const heading = document.createElement("h2");
    heading.id = "veja-tambem";
    heading.textContent = "Veja também";

    const list = document.createElement("ul");
    targets.forEach((target) => {
      const itemElement = document.createElement("li");
      const link = document.createElement("a");
      link.href = itemUrl(target);
      link.textContent = `${relatedTypeLabel(target.type)}: ${target.title}`;
      itemElement.appendChild(link);
      list.appendChild(itemElement);
    });

    section.append(heading, list);
    const footer = content.querySelector(':scope > .wc-support-footer');
    if (footer) {
      content.insertBefore(section, footer);
    } else {
      content.appendChild(section);
    }
  }

  function revealPrerequisiteCard(card) {
    card.classList.add("wc-prereq-card--visible");
  }

  function preparePrerequisiteAnimation(card) {
    if (card.dataset.wcPrereqReady === "true") return;
    card.dataset.wcPrereqReady = "true";

    card.querySelectorAll(".wc-prereq-card__item").forEach((item, index) => {
      item.style.setProperty("--wc-prereq-delay", `${index * 120}ms`);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealPrerequisiteCard(card);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealPrerequisiteCard(card);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealPrerequisiteCard(card);
        observer.disconnect();
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

    observer.observe(card);
  }

  function decoratePrerequisites(content) {
    content.querySelectorAll(":scope > h2").forEach((heading) => {
      if (normalizeHeadingText(heading) !== "pre-requisitos") return;
      if (heading.closest(".wc-prereq-card")) return;

      const card = document.createElement("section");
      card.className = "wc-prereq-card";
      if (heading.id) {
        card.setAttribute("aria-labelledby", heading.id);
      }

      const header = document.createElement("div");
      header.className = "wc-prereq-card__header";

      const icon = document.createElement("span");
      icon.className = "wc-prereq-card__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h3v16H5V5h3l1-2zm1.25 2-.5 1h-2.5v13h9.5V6h-2.5l-.5-1h-3.5zM8 10.6l1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4L8 10.6zm0 5 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4L8 15.6z"/></svg>';

      heading.classList.add("wc-prereq-card__title");
      heading.parentNode.insertBefore(card, heading);
      header.append(icon, heading);
      card.appendChild(header);

      const body = document.createElement("div");
      body.className = "wc-prereq-card__body";

      let sibling = card.nextSibling;
      while (sibling && !(sibling.nodeType === 1 && /^H[12]$/.test(sibling.tagName))) {
        const next = sibling.nextSibling;
        body.appendChild(sibling);
        sibling = next;
      }

      body.querySelectorAll("ul, ol").forEach((list) => {
        list.classList.add("wc-prereq-card__list");
      });
      body.querySelectorAll("li").forEach((item) => {
        item.classList.add("wc-prereq-card__item");
      });

      card.appendChild(body);
      preparePrerequisiteAnimation(card);
    });
  }

  function decorateCurrentPage(infoByPath, catalog) {
    const content = document.querySelector(".md-content__inner");
    const heading = content?.querySelector(":scope > h1");
    if (!content || !heading) return;

    content.querySelector(".wc-content-info")?.remove();

    const path = contentKey();
    const type = pageType(path);
    markGuidePage(path, type);
    if (!type) return;
    decorateVideoLinks(content);
    if (type === "guide") decoratePrerequisites(content);

    const catalogItem = catalogItemByPath(catalog, path);
    decorateScreenPath(content, catalogItem);
    decorateRelatedContent(content, catalogItem, catalog);

    const data = {
      type,
      difficulty: "basic",
      videoAvailable: false,
      videoDuration: null,
      ...(infoByPath[path] || {})
    };

    const favorite = heading.nextElementSibling?.classList.contains("wc-page-favorite")
      ? heading.nextElementSibling
      : null;
    (favorite || heading).insertAdjacentElement("afterend", ContentInfo(content, data));
    enhanceVideoScroll(content);
    clearUnexpectedGuideVideoHash(path, content);
  }

  function prepareCurrentPageStructure() {
    const content = document.querySelector(".md-content__inner");
    if (!content) return;

    const path = contentKey();
    const type = pageType(path);
    markGuidePage(path, type);

    if (type === "guide") {
      decorateVideoLinks(content);
      decoratePrerequisites(content);
    }
  }

  function decorateCards(infoByPath) {
    document.querySelectorAll(".wc-card").forEach((card) => {
      const link = card.querySelector("a.md-button[href], a[href]:not(.headerlink)");
      const heading = card.querySelector("h2, h3, h4");
      if (!link || !heading) return;

      const data = infoByPath[contentKey(link.href)];
      if (!data) return;
      const isPopular = Boolean(data.popular);
      if (
        card.dataset.wcContentInfoReady === "true" &&
        card.dataset.wcPopularState === String(isPopular)
      ) {
        return;
      }

      card.querySelector(".wc-card-popular")?.remove();

      if (isPopular) {
        // Indicador visual removido; popular mantido nos dados
      }

      card.dataset.wcContentInfoReady = "true";
      card.dataset.wcPopularState = String(isPopular);
    });
  }

  function initContentInfo() {
    prepareCurrentPageStructure();
    const currentVersion = ++renderVersion;

    loadContentCatalog().then((catalog) => loadContentInfoWithPopularity(catalog).then((infoByPath) => {
      if (currentVersion !== renderVersion) return;
      decorateCurrentPage(infoByPath, catalog);
      decorateCards(infoByPath);

      const content = document.querySelector(".md-content__inner");
      if (content) {
        content.wcorpContentInfoObserver?.disconnect();
        content.wcorpContentInfoObserver = new MutationObserver(() => { decorateCards(infoByPath); const guides = document.querySelectorAll('.wc-card[data-wc-card-type="Guias"]'); if (guides.length > 0) { if(typeof classifyGuideCards==='function') classifyGuideCards(); if(typeof equalizeRowLevels==='function') equalizeRowLevels(); } });
        content.wcorpContentInfoObserver.observe(content, { childList: true, subtree: true });
      }
    }));
  }

  window.WCorpContentInfo = {
    ContentInfo,
    ReadingTime,
    DifficultyIndicator,
    PopularIndicator,
    VideoIndicator,
    loadContentInfoWithPopularity
  };

  // Gatilho determinístico: após layout/fonte estável (load) + SPA (document$/observer)
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      if (typeof classifyGuideCards === 'function') classifyGuideCards();
      if (typeof equalizeRowLevels === 'function') equalizeRowLevels();
    });
  });

  const content = document.querySelector('.md-content__inner');
  if (content && !content.wcorpContentInfoObserver) {
    content.wcorpContentInfoObserver = new MutationObserver(() => {
      const guides = document.querySelectorAll('.wc-card[data-wc-card-type="Guias"]');
      if (guides.length > 0) {
        if (typeof classifyGuideCards === 'function') classifyGuideCards();
        if (typeof equalizeRowLevels === 'function') equalizeRowLevels();
      }
    });
    content.wcorpContentInfoObserver.observe(content, { childList: true, subtree: true });
  }
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      if (typeof classifyGuideCards === 'function') classifyGuideCards();
      if (typeof equalizeRowLevels === 'function') equalizeRowLevels();
    });
    initContentInfo();
  });
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initContentInfo);
  }
})();

/* Classificação automática de cards de Guia por conteúdo real */
function classifyGuideCards() {
  document.querySelectorAll('.wc-card[data-wc-card-type="Guias"]').forEach(card => {
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p:not(:has(> .md-button))');
    const footer = card.querySelector('.wc-card-footer-compact');
    const textLen = (h3 ? h3.textContent.length : 0) + (p ? p.textContent.length : 0);
    let size = 'compact';
    if (textLen > 120 || (footer && footer.textContent.length > 30)) size = 'medium';
    if (textLen > 200 || (h3 && h3.textContent.length > 60)) size = 'large';
    card.setAttribute('data-wc-card-size', size);
  });
}

/* Equalização por linha: todos os cards da mesma linha assumem o maior nível */
function equalizeRowLevels() {
  document.querySelectorAll('.wc-home-grid').forEach(grid => {
    const hasGuide = grid.querySelector('.wc-card[data-wc-card-type="Guias"]');
    if (!hasGuide) return;
    const cards = Array.from(grid.children).filter(c => c.classList && c.classList.contains('wc-card'));
    if (cards.length === 0) return;
    const levels = { compact: 1, medium: 2, large: 3 };
    let max = 1;
    cards.forEach(c => {
      const s = c.getAttribute('data-wc-card-size') || 'compact';
      if (levels[s] > max) max = levels[s];
    });
    const target = max === 3 ? 'large' : max === 2 ? 'medium' : 'compact';
    cards.forEach(c => c.setAttribute('data-wc-card-size', target));
  });
}

/* Recalcular após mudança de largura */
window.addEventListener('resize', () => {
  classifyGuideCards();
  equalizeRowLevels();
});

/* Inicializar */
document.addEventListener('DOMContentLoaded', () => {
  classifyGuideCards();
  equalizeRowLevels();
});
