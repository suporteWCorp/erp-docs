(function () {
  const containerId = "wc-error-kb";

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    return logo ? logo.href : new URL("/", window.location.href).href;
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function orderedValues(configuredValues, articleValues) {
    const values = unique([...(configuredValues || []), ...articleValues]);
    const configured = new Map((configuredValues || []).map((value, index) => [value, index]));

    return values.sort((left, right) => {
      const leftIndex = configured.has(left) ? configured.get(left) : Number.MAX_SAFE_INTEGER;
      const rightIndex = configured.has(right) ? configured.get(right) : Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex || left.localeCompare(right, "pt-BR");
    });
  }

  function articleCountLabel(count) {
    return `${count} ${count === 1 ? "artigo" : "artigos"}`;
  }

  function clearArticleHash() {
    if (window.location.hash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function searchableText(error) {
    return normalize([
      error.title,
      error.area,
      error.category,
      error.description,
      error.cause,
      error.resolution,
      error.observations,
      ...(error.tags || [])
    ].join(" "));
  }

  function appendDetail(content, title, value, className) {
    if (!value) return;

    const section = createElement("section", `wc-error-card__section ${className || ""}`.trim());
    section.appendChild(createElement("h3", null, title));
    section.appendChild(createElement("p", null, value));
    content.appendChild(section);
  }

  function createErrorCard(error, root) {
    const card = createElement("article", "wc-error-card");
    card.id = error.id;
    card.dataset.area = error.area;
    card.dataset.category = error.category;
    card.dataset.tags = (error.tags || []).map(normalize).join("|");
    card.dataset.search = searchableText(error);

    const summary = createElement("button", "wc-error-card__summary");
    summary.type = "button";
    summary.setAttribute("aria-expanded", "false");
    summary.setAttribute("aria-controls", `${error.id}-content`);

    const heading = createElement("div", "wc-error-card__heading");
    heading.appendChild(createElement("span", "wc-error-card__category", error.category));
    heading.appendChild(createElement("h2", null, error.title));
    heading.appendChild(createElement("p", null, error.description));
    summary.appendChild(heading);

    const content = createElement("div", "wc-error-card__content");
    content.id = `${error.id}-content`;
    content.hidden = true;
    appendDetail(content, "Causa provável", error.cause, "wc-error-card__cause");
    appendDetail(content, "Como resolver", error.resolution, "wc-error-card__resolution");
    appendDetail(content, "Observações", error.observations, "wc-error-card__notes");

    if (Array.isArray(error.links) && error.links.length) {
      const section = createElement("section", "wc-error-card__section wc-error-card__links");
      section.appendChild(createElement("h3", null, "Links relacionados"));
      const list = createElement("ul");
      error.links.forEach((relatedLink) => {
        const item = createElement("li");
        const link = createElement("a", null, relatedLink.label);
        link.href = new URL(relatedLink.url, root).href;
        item.appendChild(link);
        list.appendChild(item);
      });
      section.appendChild(list);
      content.appendChild(section);
    }

    if (Array.isArray(error.tags) && error.tags.length) {
      const tags = createElement("div", "wc-error-card__tags");
      tags.setAttribute("aria-label", "Tags");
      error.tags.forEach((tag) => tags.appendChild(createElement("span", null, tag)));
      content.appendChild(tags);
    }

    card.append(summary, content);
    summary.addEventListener("click", () => {
      const isOpen = summary.getAttribute("aria-expanded") === "true";
      summary.setAttribute("aria-expanded", String(!isOpen));
      content.hidden = isOpen;
      card.classList.toggle("is-open", !isOpen);
      if (!isOpen) history.replaceState(null, "", `#${error.id}`);
    });
    return card;
  }

  function validateData(data) {
    if (!data || !Array.isArray(data.errors)) throw new Error("Formato da base de erros inválido.");

    data.errors.forEach((error) => {
      const required = ["id", "title", "area", "category", "description", "cause", "resolution"];
      if (required.some((field) => !error[field])) {
        throw new Error(`Erro incompleto na base: ${error.id || "sem identificador"}.`);
      }
    });

    return {
      errors: data.errors,
      taxonomy: data.taxonomy || {}
    };
  }

  function createNavigationButton(label, count, className) {
    const button = createElement("button", className);
    button.type = "button";
    button.appendChild(createElement("span", `${className}__label`, label));
    button.appendChild(createElement("span", `${className}__count`, String(count)));
    button.setAttribute("aria-label", `${label}: ${articleCountLabel(count)}`);
    return button;
  }

  function renderKnowledgeBase(container, data) {
    const { errors, taxonomy } = data;
    const root = rootUrl();
    const cards = errors.map((error) => createErrorCard(error, root));
    const state = { area: "", category: "", relatedTags: [] };

    const areas = orderedValues(taxonomy.areaOrder, errors.map((error) => error.area));
    const areaCounts = new Map(areas.map((area) => [
      area,
      errors.filter((error) => error.area === area).length
    ]));

    const areaSection = createElement("section", "wc-error-taxonomy");
    areaSection.setAttribute("aria-labelledby", "wc-error-area-title");
    const areaTitle = createElement("h2", "wc-error-taxonomy__title", "Escolha uma área");
    areaTitle.id = "wc-error-area-title";
    const areaList = createElement("div", "wc-error-taxonomy__areas");
    areaSection.append(areaTitle, areaList);

    const categorySection = createElement("section", "wc-error-taxonomy__categories");
    categorySection.hidden = true;
    const categoryTitle = createElement("h2", "wc-error-taxonomy__title");
    const categoryList = createElement("div", "wc-error-taxonomy__category-list");
    const categoryHint = createElement("p", "wc-error-taxonomy__hint");
    categorySection.append(categoryTitle, categoryList, categoryHint);

    const results = createElement("section", "wc-error-results");
    results.hidden = true;
    const resultsHeading = createElement("div", "wc-error-results__heading");
    const resultsTitle = createElement("h2", "wc-error-results__title");
    const status = createElement("p", "wc-error-kb__status");
    status.setAttribute("role", "status");
    resultsHeading.append(resultsTitle, status);

    const controls = createElement("div", "wc-error-kb__controls");
    controls.setAttribute("aria-label", "Busca nos artigos selecionados");
    const searchGroup = createElement("div", "wc-error-kb__field wc-error-kb__field--search");
    const searchLabel = createElement("label", null, "Buscar nesta categoria");
    const search = createElement("input", "wc-error-kb__search");
    search.type = "search";
    search.placeholder = "Digite código, mensagem, causa ou palavra-chave";
    search.autocomplete = "off";
    search.id = "wc-error-search";
    searchLabel.htmlFor = search.id;
    searchGroup.append(searchLabel, search);
    controls.appendChild(searchGroup);

    const list = createElement("div", "wc-error-kb__list");
    cards.forEach((card) => list.appendChild(card));

    const empty = createElement("div", "wc-error-kb__empty");
    empty.hidden = true;
    empty.appendChild(createElement("strong", null, "Nenhum artigo encontrado."));
    empty.appendChild(createElement("p", null, "Revise os termos da busca."));
    results.append(resultsHeading, controls, list, empty);

    function filterArticles() {
      const query = normalize(search.value.trim());
      let visible = 0;

      cards.forEach((card) => {
        const matchesArea = card.dataset.area === state.area;
        const matchesCategory = state.relatedTags.length
          ? state.relatedTags.some((tag) => card.dataset.search.includes(tag))
          : card.dataset.category === state.category;
        const matchesSearch = !query || card.dataset.search.includes(query);
        card.hidden = !(matchesArea && matchesCategory && matchesSearch);
        if (!card.hidden) visible += 1;
      });

      status.textContent = articleCountLabel(visible);
      empty.hidden = visible !== 0;
    }

    function selectCategory(category, focusSearch = false) {
      state.category = category;
      state.relatedTags = [];
      search.value = "";
      searchLabel.textContent = "Buscar nesta categoria";
      empty.querySelector("p").textContent = "Revise os termos da busca.";
      categoryList.querySelectorAll(".wc-error-category").forEach((button) => {
        const active = button.dataset.category === category;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      resultsTitle.textContent = `${state.area} / ${category}`;
      results.hidden = false;
      filterArticles();
      if (focusSearch) search.focus();
    }

    function selectArea(area, requestedCategory = "", autoSelect = true) {
      state.area = area;
      state.category = "";
      state.relatedTags = [];
      results.hidden = true;
      search.value = "";

      areaList.querySelectorAll(".wc-error-area").forEach((button) => {
        const active = button.dataset.area === area;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      const configuredCategories = taxonomy.categoryOrder?.[area] || [];
      const articleCategories = errors
        .filter((error) => error.area === area)
        .map((error) => error.category);
      const categories = orderedValues(configuredCategories, articleCategories);

      categoryTitle.textContent = `Categorias em ${area}`;
      categoryList.replaceChildren();
      categoryHint.textContent = "";
      categorySection.hidden = false;

      categories.forEach((category) => {
        const count = errors.filter((error) => error.area === area && error.category === category).length;
        const button = createNavigationButton(category, count, "wc-error-category");
        button.dataset.category = category;
        button.setAttribute("aria-pressed", "false");
        button.disabled = count === 0;
        button.addEventListener("click", () => {
          clearArticleHash();
          selectCategory(category, true);
        });
        categoryList.appendChild(button);
      });

      if (!categories.length) {
        categoryHint.textContent = "Nenhum artigo cadastrado nesta área.";
        return;
      }

      const availableCategories = categories.filter((category) => errors.some(
        (error) => error.area === area && error.category === category
      ));
      const categoryToSelect = availableCategories.includes(requestedCategory)
        ? requestedCategory
        : autoSelect && availableCategories.length === 1 ? availableCategories[0] : "";

      if (categoryToSelect) {
        selectCategory(categoryToSelect);
      } else {
        categoryHint.textContent = "Escolha uma categoria para consultar os artigos.";
      }
    }

    function showRelatedArticles(area, category, tags) {
      selectArea(area, "", false);
      state.category = "";
      state.relatedTags = unique(
        [category, ...tags]
          .map(normalize)
          .filter((tag) => tag.length >= 3)
      );
      categoryList.querySelectorAll(".wc-error-category").forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      });
      categoryHint.textContent = "Filtro aplicado a partir da página consultada.";
      resultsTitle.textContent = `${area} / Problemas relacionados`;
      searchLabel.textContent = "Buscar nos problemas relacionados";
      empty.querySelector("p").textContent = "Ainda não há problemas cadastrados com estas tags.";
      results.hidden = false;
      filterArticles();
    }

    areas.forEach((area) => {
      const button = createNavigationButton(area, areaCounts.get(area) || 0, "wc-error-area");
      button.dataset.area = area;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        clearArticleHash();
        selectArea(area);
      });
      areaList.appendChild(button);
    });

    search.addEventListener("input", filterArticles);
    container.replaceChildren(areaSection, categorySection, results);

    const requestedCard = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null;
    if (requestedCard && requestedCard.matches(".wc-error-card")) {
      selectArea(requestedCard.dataset.area, requestedCard.dataset.category);
      const trigger = requestedCard.querySelector(".wc-error-card__summary");
      if (trigger && trigger.getAttribute("aria-expanded") !== "true") trigger.click();
      requestedCard.scrollIntoView({ block: "nearest" });
      return;
    }

    const parameters = new URLSearchParams(window.location.search);
    const requestedArea = parameters.get("area") || "";
    const requestedCategory = parameters.get("category") || "";
    const requestedTags = (parameters.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (requestedArea) {
      const availableCategories = errors
        .filter((error) => error.area === requestedArea)
        .map((error) => error.category);
      if (requestedCategory && availableCategories.includes(requestedCategory)) {
        selectArea(requestedArea, requestedCategory);
      } else if (requestedCategory || requestedTags.length) {
        showRelatedArticles(requestedArea, requestedCategory, requestedTags);
      } else {
        selectArea(requestedArea);
      }
    }
  }

  async function initializeErrorKnowledgeBase() {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = "true";

    try {
      const source = new URL("assets/data/erros-comuns.json", rootUrl());
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Falha ao carregar a base de erros: ${response.status}.`);
      renderKnowledgeBase(container, validateData(await response.json()));
    } catch (_error) {
      container.replaceChildren();
      const message = createElement("div", "wc-error-kb__error");
      message.appendChild(createElement("strong", null, "Não foi possível carregar a base de erros."));
      message.appendChild(createElement("p", null, "Atualize a página. Se o problema continuar, entre em contato com o Suporte."));
      container.appendChild(message);
    }
  }

  document.addEventListener("DOMContentLoaded", initializeErrorKnowledgeBase);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeErrorKnowledgeBase);
  }
})();
