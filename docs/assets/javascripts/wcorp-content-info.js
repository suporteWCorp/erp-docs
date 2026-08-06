(function () {
  const dataPath = "assets/data/content-info.json";
  const manualPrefixes = [
    "administracao", "colaboradores", "comercial", "compras", "contratos", "faturamento",
    "financeiro", "fornecedores", "materiais", "producao", "relatorios", "servicos", "transportes"
  ];
  const difficultyLabels = {
    basic: "Básico",
    intermediate: "Intermediário",
    advanced: "Avançado"
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
      time: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l5 3 .9-1.45-3.9-2.3V7z"/>',
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
    const label = difficultyLabels[level];
    return label ? createInfoItem("difficulty", label, "Nível de dificuldade") : null;
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

  function decorateCurrentPage(infoByPath) {
    const content = document.querySelector(".md-content__inner");
    const heading = content?.querySelector(":scope > h1");
    if (!content || !heading) return;

    content.querySelector(".wc-content-info")?.remove();

    const path = contentKey();
    const type = pageType(path);
    if (!type) return;

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
