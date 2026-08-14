(function () {
  function normalize(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
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
        const term = normalize(input.value);
        const matches = term
          ? items.filter((item) => {
              const haystack = normalize([
                item.dataset.search,
                item.textContent
              ].join(" "));
              return haystack.includes(term);
            })
          : [];

        if (!term) {
          if (categories) categories.hidden = false;
          if (results) results.hidden = true;
          if (resultList) resultList.replaceChildren();
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

  document.addEventListener("DOMContentLoaded", initializeSolutionLists);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeSolutionLists);
  }
})();
