(function () {
  const dataPath = "assets/data/content-info.json";
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

  function decorateCurrentPage(infoByPath) {
    const content = document.querySelector(".md-content__inner");
    const heading = content?.querySelector(":scope > h1");
    if (!content || !heading) return;

    content.querySelector(".wc-content-info")?.remove();

    const path = contentKey();
    const type = pageType(path);
    markGuidePage(path, type);
    if (!type) return;
    if (type === "guide") decoratePrerequisites(content);

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
      decoratePrerequisites(content);
    }
  }

  function decorateCards(infoByPath) {
    document.querySelectorAll(".wc-card:not([data-wc-content-info-ready])").forEach((card) => {
      const link = card.querySelector("a[href]");
      const heading = card.querySelector("h2, h3, h4");
      if (!link || !heading) return;

      const data = infoByPath[contentKey(link.href)];
      if (!data) return;

      if (data.popular && !card.querySelector(".wc-card-popular")) {
        heading.appendChild(PopularIndicator(true));
      }

      card.dataset.wcContentInfoReady = "true";
    });
  }

  function initContentInfo() {
    prepareCurrentPageStructure();

    loadContentInfo().then((infoByPath) => {
      decorateCurrentPage(infoByPath);
      decorateCards(infoByPath);

      const content = document.querySelector(".md-content__inner");
      if (content) {
        content.wcorpContentInfoObserver?.disconnect();
        content.wcorpContentInfoObserver = new MutationObserver(() => decorateCards(infoByPath));
        content.wcorpContentInfoObserver.observe(content, { childList: true, subtree: true });
      }
    });
  }

  window.WCorpContentInfo = {
    ContentInfo,
    ReadingTime,
    DifficultyIndicator,
    PopularIndicator,
    VideoIndicator
  };

  document.addEventListener("DOMContentLoaded", initContentInfo);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initContentInfo);
  }
})();
