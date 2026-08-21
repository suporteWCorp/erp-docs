(function () {
  const filterClass = "wc-card-filter";
  const dataPath = "assets/data/content-info.json";
  const sortOptions = [
    { value: "original", label: "Todos" },
    { value: "az", label: "A–Z" },
    { value: "popular-desc", label: "Mais popular" },
    { value: "popular-asc", label: "Menos popular" }
  ];

  let contentInfoCache = null;
  let documentClickReady = false;

  function normalizedPath() {
    return window.location.pathname
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
  }

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function contentKey(url) {
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

  function loadContentInfo() {
    if (contentInfoCache) return contentInfoCache;

    contentInfoCache = fetch(new URL(dataPath, rootUrl()).href)
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));

    return contentInfoCache;
  }

  function cleanLabel(value) {
    return String(value || "")
      .replace(/¶/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function directTextLabel(element) {
    return cleanLabel(
      Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join(" ")
    );
  }

  function elementLabel(element) {
    if (!element) return "";

    const directText = directTextLabel(element);
    if (directText) return directText;

    const copy = element.cloneNode(true);
    copy
      .querySelectorAll(
        ".headerlink, .wc-context-nav__count, .wc-card-filter__heading-count, .wc-card-filter__option-count, .wc-card__badge"
      )
      .forEach((item) => item.remove());

    return cleanLabel(copy.textContent);
  }

  function cardTitle(card) {
    const heading = card.querySelector("h2, h3, h4");
    return elementLabel(heading);
  }

  function cardPopularity(card, infoByPath) {
    const link = card.querySelector("a[href]");
    if (!link) return 0;
    return infoByPath[contentKey(link.href)]?.popular ? 1 : 0;
  }

  function closeFilter(wrapper) {
    const button = wrapper.querySelector(".wc-card-filter__select");
    const menu = wrapper.querySelector(".wc-card-filter__menu");

    button?.setAttribute("aria-expanded", "false");
    if (menu) menu.hidden = true;
  }

  function closeFiltersOutsideClick(event) {
    document.querySelectorAll(`.${filterClass}`).forEach((wrapper) => {
      if (!wrapper.contains(event.target)) {
        closeFilter(wrapper);
      }
    });
  }

  function ensureDocumentClickListener() {
    if (documentClickReady) return;
    documentClickReady = true;
    document.addEventListener("click", closeFiltersOutsideClick);
  }

  function sortCards(items, mode) {
    const sorted = [...items];

    if (mode === "az") {
      sorted.sort((left, right) => {
        const titleOrder = left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" });
        return titleOrder || left.originalIndex - right.originalIndex;
      });
    } else if (mode === "popular-desc") {
      sorted.sort((left, right) => (
        right.popularity - left.popularity ||
        left.originalIndex - right.originalIndex
      ));
    } else if (mode === "popular-asc") {
      sorted.sort((left, right) => (
        left.popularity - right.popularity ||
        left.originalIndex - right.originalIndex
      ));
    } else {
      sorted.sort((left, right) => left.originalIndex - right.originalIndex);
    }

    return sorted;
  }

  function applySortToGrid(grid, items, mode) {
    sortCards(items, mode).forEach((item) => {
      grid.appendChild(item.card);
    });
  }

  function createControl(onChange, headingLabel, headingCount) {
    const wrapper = document.createElement("div");
    wrapper.className = filterClass;
    wrapper.setAttribute("aria-label", "Controle de ordenação");

    const heading = document.createElement("div");
    heading.className = "wc-card-filter__heading";

    const headingTitle = document.createElement("span");
    headingTitle.className = "wc-card-filter__heading-title";
    headingTitle.textContent = headingLabel;

    const headingCountBadge = document.createElement("span");
    headingCountBadge.className = "wc-card-filter__heading-count";
    headingCountBadge.textContent = String(headingCount);

    heading.append(headingTitle, headingCountBadge);

    const field = document.createElement("div");
    field.className = "wc-card-filter__field";

    const label = document.createElement("span");
    label.className = "wc-card-filter__label";
    label.textContent = "Ordenar por";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "wc-card-filter__select";
    button.setAttribute("aria-label", "Ordenar cards");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");

    const value = document.createElement("span");
    value.className = "wc-card-filter__value";
    value.textContent = sortOptions[0].label;
    button.appendChild(value);

    const menu = document.createElement("div");
    menu.className = "wc-card-filter__menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    sortOptions.forEach((sortOption) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "wc-card-filter__option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(sortOption.value === sortOptions[0].value));
      option.dataset.sortValue = sortOption.value;

      const optionName = document.createElement("span");
      optionName.className = "wc-card-filter__option-name";
      optionName.textContent = sortOption.label;

      option.appendChild(optionName);

      option.addEventListener("click", () => {
        menu.querySelectorAll(".wc-card-filter__option").forEach((item) => {
          item.setAttribute("aria-selected", String(item === option));
        });

        value.textContent = sortOption.label;
        onChange(sortOption.value);
        closeFilter(wrapper);
        button.focus();
      });

      menu.appendChild(option);
    });

    button.addEventListener("click", () => {
      const open = menu.hidden;

      document.querySelectorAll(`.${filterClass}`).forEach((item) => {
        if (item !== wrapper) closeFilter(item);
      });

      menu.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    });

    wrapper.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeFilter(wrapper);
        button.focus();
      }
    });

    field.append(label, button, menu);
    wrapper.append(heading, field);
    ensureDocumentClickListener();

    return wrapper;
  }

  function setupGuideFilters(content, infoByPath) {
    const intro = content.querySelector(":scope > .wc-listing-intro");
    if (!intro || content.querySelector(`:scope > .${filterClass}`)) return;

    const sections = Array.from(content.querySelectorAll(":scope > h2"))
      .map((heading, sectionIndex) => {
        const grid = heading.nextElementSibling;
        if (!grid?.classList.contains("wc-home-grid")) return null;

        const cards = Array.from(grid.querySelectorAll(".wc-card"));
        return {
          category: elementLabel(heading),
          heading,
          grid,
          cards,
          items: cards.map((card, cardIndex) => ({
            card,
            originalIndex: cardIndex,
            popularity: cardPopularity(card, infoByPath),
            title: cardTitle(card)
          })),
          sectionIndex
        };
      })
      .filter(Boolean);

    if (!sections.length) return;

    const firstSection = sections[0];
    const applySort = (mode) => {
      sections.forEach((section) => {
        section.heading.hidden = section === firstSection;
        section.grid.hidden = false;
        applySortToGrid(section.grid, section.items, mode);
      });
    };
    const filter = createControl(applySort, firstSection.category, firstSection.cards.length);

    firstSection.heading.insertAdjacentElement("beforebegin", filter);
    firstSection.heading.hidden = true;
  }

  function setupManualFilters(content, infoByPath) {
    const intro = content.querySelector(":scope > .wc-listing-intro");
    if (!intro || content.querySelector(`:scope > .${filterClass}`)) return;

    const heading = content.querySelector(":scope > h2");
    const grid = content.querySelector(":scope > h2 + .wc-home-grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".wc-card"));

    if (!cards.length) return;

    const items = cards.map((card, index) => ({
      card,
      originalIndex: index,
      popularity: cardPopularity(card, infoByPath),
      title: cardTitle(card)
    }));
    const headingLabel = elementLabel(heading) || "Categorias";
    const headingCount = cards.length;
    const applySort = (mode) => {
      cards.forEach((card) => {
        card.hidden = false;
      });
      applySortToGrid(grid, items, mode);
    };
    const filter = createControl(applySort, headingLabel, headingCount);

    heading.insertAdjacentElement("beforebegin", filter);
    heading.hidden = true;
  }

  function initializeFilters() {
    const content = document.querySelector(".md-content__inner");
    if (!content) return;

    const path = normalizedPath();

    if (!path.endsWith("/como-fazer") && !path.endsWith("/manual")) return;

    loadContentInfo().then((infoByPath) => {
      if (path.endsWith("/como-fazer")) {
        setupGuideFilters(content, infoByPath);
        return;
      }

      setupManualFilters(content, infoByPath);
    });
  }

  document.addEventListener("DOMContentLoaded", initializeFilters);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeFilters);
  }
})();
