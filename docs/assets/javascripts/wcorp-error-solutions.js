(function () {
  function normalize(value) {
    if (window.WCorpSearchUtils?.normalizeText) {
      return window.WCorpSearchUtils.normalizeText(value);
    }

    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function solutionItemScore(item, query) {
    if (!query) return 0;

    if (window.WCorpSearchUtils?.scoreDocument) {
      return window.WCorpSearchUtils.scoreDocument({
        title: item.querySelector(".wc-rejection-item__title")?.textContent || item.textContent,
        location: item.getAttribute("href") || "",
        text: `${item.dataset.search || ""} ${item.textContent || ""}`
      }, query, { intent: "error" });
    }

    return normalize(`${item.dataset.search || ""} ${item.textContent || ""}`).includes(normalize(query)) ? 1 : 0;
  }

  function solutionItemMatches(item, query) {
    const term = normalize(query);
    const haystack = normalize([
      item.dataset.search,
      item.textContent
    ].join(" "));
    const tokens = window.WCorpSearchUtils?.tokenize?.(query) ||
      term.match(/[a-z0-9]+/g) ||
      [];
    const codes = window.WCorpSearchUtils?.extractCodes?.(query) ||
      term.match(/\b\d{3,4}\b/g) ||
      [];

    if (!term) return false;
    if (haystack.includes(term)) return true;

    if (codes.length && !codes.every((code) => new RegExp(`\\b${code}\\b`).test(haystack))) {
      return false;
    }

    return tokens.length > 0 && tokens.every((token) =>
      haystack.includes(token) || window.WCorpSearchUtils?.includesWord?.(haystack, token)
    );
  }

  function initializeSolutionLists() {
    document.querySelectorAll("[data-wc-solution-list]").forEach((container) => {
      if (container.dataset.wcSolutionReady === "true") return;
      container.dataset.wcSolutionReady = "true";

      const input = container.querySelector("[data-wc-solution-filter]");
      const empty = container.querySelector("[data-wc-solution-empty]");
      const categories = container.querySelector("[data-wc-solution-categories]");
      const results = container.querySelector("[data-wc-solution-results]");
      const resultList = container.querySelector("[data-wc-solution-result-list]");
      const groups = Array.from(container.querySelectorAll("[data-wc-solution-group]"));
      const items = Array.from(container.querySelectorAll(".wc-rejection-item"));
      const directList = container.classList.contains("wc-solution-list--direct");

      if (!input || !items.length) return;

      const closeGroup = (group) => {
        const toggle = group.querySelector(".wc-solution-category__toggle");
        if (!toggle) return;
        toggle.setAttribute("aria-expanded", "false");
      };

      groups.forEach((group) => {
        const toggle = group.querySelector(".wc-solution-category__toggle");
        if (!toggle) return;

        closeGroup(group);
        toggle.addEventListener("click", () => {
          const willOpen = toggle.getAttribute("aria-expanded") !== "true";
          groups.forEach(closeGroup);
          toggle.setAttribute("aria-expanded", String(willOpen));
        });
      });

      const applyFilter = () => {
        const term = input.value.trim();
        const matches = term
          ? items
              .map((item) => ({
                item,
                score: solutionItemScore(item, term)
              }))
              .filter(({ item }) => solutionItemMatches(item, term))
              .sort((first, second) => second.score - first.score)
              .map(({ item }) => item)
          : [];

        if (!term) {
          if (categories) categories.hidden = false;
          if (results) results.hidden = false;
          if (resultList) {
            resultList.replaceChildren(...(directList ? items : []));
          }
          if (empty) empty.hidden = true;
          groups.forEach(closeGroup);
          return;
        }

        if (categories) categories.hidden = true;
        if (results) results.hidden = matches.length === 0;

        if (resultList) {
          resultList.replaceChildren(...matches.map((item) => {
            const clone = item.cloneNode(true);
            clone.hidden = false;
            return clone;
          }));
        }

        if (empty) empty.hidden = matches.length > 0;
      };

      input.addEventListener("input", applyFilter);
      applyFilter();
    });
  }

  function headingText(heading) {
    const clone = heading.cloneNode(true);
    clone.querySelectorAll(".headerlink").forEach((link) => link.remove());
    return clone.textContent.trim();
  }

  function setHeadingText(heading, text) {
    const headerlink = heading.querySelector(".headerlink");
    heading.textContent = text;
    if (headerlink) heading.appendChild(headerlink);
  }

  function wrapRejectionSection(heading, modifier) {
    if (heading.parentElement?.classList.contains("wc-rejection-section")) return;

    const section = document.createElement("section");
    section.className = `wc-rejection-section ${modifier}`.trim();
    heading.parentNode.insertBefore(section, heading);

    let node = heading;
    while (node) {
      const next = node.nextSibling;
      section.appendChild(node);
      if (next?.nodeType === Node.ELEMENT_NODE && next.matches("h2")) break;
      node = next;
    }
  }

  function initializeRejectionArticles() {
    const content = document.querySelector(".md-content__inner");
    const message = content?.querySelector(".wc-rejection-message");
    if (!content || !message || content.dataset.wcRejectionArticleReady === "true") return;

    const heading = content.querySelector(":scope > h1");
    const meta = content.querySelector(".wc-rejection-meta");
    const docBadge = meta?.querySelector(".wc-rejection-doc-badge");
    const match = heading ? headingText(heading).match(/^Rejei[cç][aã]o(?:\s+Cancelamento)?\s+(\d{3,4})\s+[—-]\s+(.+)$/i) : null;

    content.dataset.wcRejectionArticleReady = "true";
    content.classList.add("wc-rejection-article-page");

    if (heading && match) {
      const hero = document.createElement("div");
      hero.className = "wc-rejection-hero";
      hero.innerHTML = `<span class="wc-rejection-code-badge">REJEIÇÃO ${match[1]}</span>`;
      if (docBadge) hero.appendChild(docBadge);
      heading.before(hero);
      setHeadingText(heading, match[2]);
      meta?.remove();
    }

    Array.from(content.querySelectorAll("h2")).forEach((sectionHeading) => {
      const text = headingText(sectionHeading);
      const normalized = normalize(text);
      if (normalized === "como a sefaz interpreta") setHeadingText(sectionHeading, "O que significa");

      const current = normalize(headingText(sectionHeading));
      const modifier = current === "como corrigir"
        ? "wc-rejection-section--fix"
        : /^(observacao|observacoes|depois de corrigir)$/.test(current)
          ? "wc-rejection-section--secondary"
          : current === "o que significa"
            ? "wc-rejection-section--meaning"
            : "";
      wrapRejectionSection(sectionHeading, modifier);
    });
  }

  document.addEventListener("DOMContentLoaded", initializeSolutionLists);
  document.addEventListener("DOMContentLoaded", initializeRejectionArticles);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      initializeSolutionLists();
      initializeRejectionArticles();
    });
  }
})();
