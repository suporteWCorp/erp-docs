(function () {
  const storageKey = "wcorp:favorites:v1";
  const typeOrder = ["Guias", "Manuais", "Erros Comuns", "FAQ", "Glossário", "Links úteis"];
  const manualPrefixes = [
    "administracao", "colaboradores", "comercial", "compras", "contratos", "faturamento",
    "financeiro", "fornecedores", "materiais", "producao", "relatorios", "servicos", "transportes"
  ];

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function relativePath(url) {
    const root = new URL(rootUrl());
    const target = new URL(url, window.location.href);
    const base = root.pathname.replace(/\/+$/, "");
    return target.pathname.startsWith(base)
      ? target.pathname.slice(base.length).replace(/^\//, "").replace(/index\.html$/, "")
      : target.pathname.replace(/^\//, "");
  }

  function contentType(url) {
    const path = relativePath(url).replace(/\/+$/, "");
    if (path.startsWith("como-fazer/") && path !== "como-fazer") return "Guias";
    if (path === "referencia/erros-comuns") return "Erros Comuns";
    if (path === "referencia/faq") return "FAQ";
    if (path === "referencia/glossario") return "Glossário";
    if (path === "referencia/links-uteis") return "Links úteis";
    if (manualPrefixes.some((prefix) => path.startsWith(`${prefix}/`))) return "Manuais";
    return "";
  }

  function normalizeUrl(url) {
    const target = new URL(url, window.location.href);
    const root = new URL(rootUrl());
    if (target.origin === root.origin && target.pathname.startsWith(root.pathname.replace(/index\.html$/, ""))) {
      target.search = "";
    }
    return target.href.replace(/index\.html(?=#|$)/, "");
  }

  function readFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored.filter((item) => item && item.url && item.title && item.type) : [];
    } catch (_error) {
      return [];
    }
  }

  function writeFavorites(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("wcorp:favorites-changed"));
  }

  function isFavorite(url) {
    const normalized = normalizeUrl(url);
    return readFavorites().some((item) => item.url === normalized);
  }

  function toggleFavorite(item) {
    const items = readFavorites();
    const index = items.findIndex((favorite) => favorite.url === item.url);
    if (index >= 0) {
      items.splice(index, 1);
    } else {
      items.unshift({ ...item, savedAt: new Date().toISOString() });
    }
    writeFavorites(items);
  }

  function starIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3z"/></svg>';
  }

  function createToggle(item, extraClass = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `wc-favorite-toggle ${extraClass}`.trim();
    button.dataset.favoriteUrl = item.url;
    button.dataset.favoriteTitle = item.title;
    button.innerHTML = starIcon();

    const refresh = () => {
      const active = isFavorite(item.url);
      button.classList.toggle("is-favorite", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", `${active ? "Remover" : "Adicionar"} ${item.title} ${active ? "dos" : "aos"} favoritos`);
      button.title = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(item);
    });
    refresh();
    return button;
  }

  function refreshToggle(button) {
    const active = isFavorite(button.dataset.favoriteUrl);
    const title = button.dataset.favoriteTitle || "conteúdo";
    button.classList.toggle("is-favorite", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", `${active ? "Remover" : "Adicionar"} ${title} ${active ? "dos" : "aos"} favoritos`);
    button.title = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
  }

  function itemFromLink(link, title) {
    const type = contentType(link.href);
    if (!type) return null;
    return { title: title.trim(), type, url: normalizeUrl(link.href) };
  }

  function decorateCards() {
    document.querySelectorAll(".wc-card:not([data-wc-favorite-ready]), .wc-link-item:not([data-wc-favorite-ready])").forEach((card) => {
      const link = card.querySelector("a.md-button[href], h3 a[href], a[href]");
      const heading = card.querySelector("h2, h3, h4");
      if (!link || !heading) return;

      const fallbackType = window.location.pathname.includes("/como-fazer/")
        ? "Guias"
        : manualPrefixes.some((prefix) => window.location.pathname.includes(`/${prefix}/`)) ? "Manuais" : "";
      const item = itemFromLink(link, heading.textContent) || (card.classList.contains("wc-link-item")
        ? { title: heading.textContent.trim(), type: "Links úteis", url: normalizeUrl(link.href) }
        : fallbackType ? { title: heading.textContent.trim(), type: fallbackType, url: normalizeUrl(link.href) } : null);
      const path = relativePath(link.href);
      card.dataset.wcCardType = item?.type || (path.startsWith("suporte") ? "Apoio" : "Referências");
      if (!item) return;
      card.appendChild(createToggle(item));
      card.dataset.wcFavoriteReady = "true";
    });
  }

  function decorateGuideCategoryCounts() {
    if (!window.location.pathname.includes("/como-fazer/")) return;
    document.querySelectorAll(".md-content__inner > h2").forEach((heading) => {
      if (heading.querySelector(".wc-category-count")) return;
      const grid = heading.nextElementSibling;
      if (!grid?.classList.contains("wc-home-grid")) return;
      const headingLabel = heading.cloneNode(true);
      headingLabel.querySelectorAll(".headerlink").forEach((link) => link.remove());
      const category = headingLabel.textContent.trim();
      const sidebarGroup = Array.from(document.querySelectorAll(".wc-context-guide .wc-context-nav__trigger"))
        .find((trigger) => trigger.querySelector(":scope > span:first-child")?.textContent.trim() === category);
      const sidebarCount = Number.parseInt(
        sidebarGroup?.querySelector(".wc-context-nav__count")?.textContent || "",
        10
      );
      const count = Number.isFinite(sidebarCount)
        ? sidebarCount
        : grid.querySelectorAll(":scope > .wc-card").length;
      if (!count) return;

      const badge = document.createElement("span");
      badge.className = "wc-category-count";
      badge.textContent = String(count);
      badge.setAttribute("aria-label", `${count} ${count === 1 ? "Guia" : "Guias"}`);
      heading.appendChild(badge);
    });
  }

  function decorateCurrentPage() {
    const content = document.querySelector(".md-content__inner");
    const heading = content?.querySelector(":scope > h1");
    if (!content || !heading || content.querySelector(".wc-page-favorite")) return;

    const item = itemFromLink({ href: window.location.href }, heading.textContent);
    if (!item) return;
    heading.insertAdjacentElement("afterend", createToggle(item, "wc-page-favorite"));
  }

  function decorateErrorCards() {
    document.querySelectorAll(".wc-error-card:not([data-wc-favorite-ready])").forEach((card) => {
      const heading = card.querySelector("h2");
      const summary = card.querySelector(".wc-error-card__summary");
      if (!heading || !summary || !card.id) return;
      const url = new URL(`referencia/erros-comuns/#${card.id}`, rootUrl()).href;
      const item = { title: heading.textContent.trim(), type: "Erros Comuns", url: normalizeUrl(url) };
      card.appendChild(createToggle(item));
      card.dataset.wcFavoriteReady = "true";
    });
  }

  function groupedFavorites() {
    const items = readFavorites();
    return typeOrder.map((type) => ({
      type,
      items: items.filter((item) => item.type === type)
        .sort((left, right) => String(right.savedAt).localeCompare(String(left.savedAt)))
    })).filter((group) => group.items.length);
  }

  function renderGroups(container, headingLevel = 3) {
    const groups = groupedFavorites();
    container.replaceChildren();
    if (!groups.length) {
      const empty = document.createElement("p");
      empty.className = "wc-favorites-empty";
      empty.textContent = "Nenhum conteúdo favoritado neste navegador.";
      container.appendChild(empty);
      return;
    }

    groups.forEach((group) => {
      const section = document.createElement("section");
      section.className = "wc-favorites-group";
      const heading = document.createElement(`h${headingLevel}`);
      heading.textContent = group.type;
      const list = document.createElement("ul");
      list.className = "wc-favorites-list";
      group.items.forEach((item) => {
        const row = document.createElement("li");
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.title;
        row.append(link, createToggle(item));
        list.appendChild(row);
      });
      section.append(heading, list);
      container.appendChild(section);
    });
  }

  function updateHeaderActions() {
    const header = document.querySelector(".md-header__inner");
    if (!header) return;
    header.querySelector(".wc-header-actions")?.remove();

    const actions = document.createElement("div");
    actions.className = "wc-header-actions";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wc-header-action wc-header-favorites";
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = `${starIcon()}<span class="wc-header-action__label">Favoritos</span><span class="wc-header-favorites__count"></span>`;

    const version = document.createElement("span");
    version.className = "wc-header-action wc-header-version";
    version.textContent = "v06.2026";
    version.title = "Versão da documentação: junho de 2026";
    version.setAttribute("aria-label", "Versão da documentação, junho de 2026");

    const panel = document.createElement("div");
    panel.className = "wc-favorites-panel";
    panel.hidden = true;
    const panelHeading = document.createElement("div");
    panelHeading.className = "wc-favorites-panel__heading";
    panelHeading.innerHTML = `<strong>Favoritos recentes</strong><a class="wc-favorites-panel__all" href="${new URL("favoritos/", rootUrl()).href}">Ver todos</a>`;
    const panelContent = document.createElement("div");
    panelContent.className = "wc-favorites-panel__content";
    panel.append(panelHeading, panelContent);

    const refresh = () => {
      const count = readFavorites().length;
      button.querySelector(".wc-header-favorites__count").textContent = count ? `(${count})` : "";
      renderGroups(panelContent);
    };
    button.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      button.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) refresh();
    });
    document.addEventListener("click", (event) => {
      if (!actions.contains(event.target)) {
        panel.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });
    refresh();
    actions.append(button, version, panel);
    header.appendChild(actions);
  }

  function renderFavoritesPage() {
    const container = document.getElementById("wc-favorites-page");
    if (!container) return;
    renderGroups(container, 2);
  }

  function refreshFavoriteInterface() {
    document.querySelectorAll(".wc-favorite-toggle[data-favorite-url]").forEach(refreshToggle);
    const count = readFavorites().length;
    const countElement = document.querySelector(".wc-header-favorites__count");
    if (countElement) countElement.textContent = count ? `(${count})` : "";

    const panelContent = document.querySelector(".wc-favorites-panel__content");
    if (panelContent) renderGroups(panelContent);
    const page = document.getElementById("wc-favorites-page");
    if (page) renderGroups(page, 2);
  }

  function initFavorites() {
    decorateCards();
    decorateGuideCategoryCounts();
    decorateCurrentPage();
    decorateErrorCards();
    updateHeaderActions();
    renderFavoritesPage();

    const errors = document.getElementById("wc-error-kb");
    if (errors) {
      new MutationObserver(decorateErrorCards).observe(errors, { childList: true, subtree: true });
    }

    const content = document.querySelector(".md-content__inner");
    if (content) {
      content.wcorpFavoriteObserver?.disconnect();
      content.wcorpFavoriteObserver = new MutationObserver(() => {
        decorateCards();
        decorateGuideCategoryCounts();
      });
      content.wcorpFavoriteObserver.observe(content, { childList: true, subtree: true });
    }
  }

  document.addEventListener("DOMContentLoaded", initFavorites);
  window.addEventListener("wcorp:favorites-changed", refreshFavoriteInterface);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initFavorites);
  }
})();
