(function () {
  const groups = [
    {
      label: "Guias",
      icon: "📘",
      test: (path) => path.includes("/como-fazer/")
    },
    {
      label: "Manuais",
      icon: "📄",
      test: (path) => [
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
      ].some((section) => path.includes(section))
    },
    {
      label: "Referências",
      icon: "📚",
      test: (path) => path.includes("/referencia/")
    },
    {
      label: "Suporte",
      icon: "💬",
      test: (path) => path.includes("/suporte/")
    },
    {
      label: "Outras páginas",
      icon: "↗",
      test: () => true
    }
  ];

  function resultPath(item) {
    const link = item.querySelector(".md-search-result__link[href], a[href]");
    if (!link) return "";

    try {
      return new URL(link.getAttribute("href"), window.location.href).pathname;
    } catch (_error) {
      return link.getAttribute("href") || "";
    }
  }

  function groupFor(item) {
    const path = resultPath(item);
    return groups.find((group) => group.test(path)) || groups[groups.length - 1];
  }

  function resultTitle(item) {
    return (
      item.querySelector(".md-search-result__title")?.textContent ||
      item.querySelector(".md-search-result__link")?.textContent ||
      ""
    ).trim();
  }

  function decorateResult(item, group) {
    item.dataset.wcSearchGroup = group.label;
    item.style.setProperty("--wc-search-icon", `"${group.icon}"`);

    const link = item.querySelector(".md-search-result__link[href], a[href]");
    if (link) link.setAttribute("aria-label", resultTitle(item));
  }

  function createHeading(label) {
    const heading = document.createElement("li");
    heading.className = "wc-search-group";
    heading.setAttribute("aria-hidden", "true");
    heading.textContent = label;
    return heading;
  }

  function organizeResults(list) {
    if (list.dataset.wcSearchOrganizing === "true") return;

    const result = list.closest(".md-search-result");
    const input = document.querySelector(".md-search__input");
    const items = Array.from(list.children).filter((child) =>
      child.classList.contains("md-search-result__item")
    );

    if (!items.length) {
      result?.classList.remove("wc-search-has-results");
      list.dataset.wcSearchSignature = "";

      const meta = result?.querySelector(".md-search-result__meta");
      if (meta && !(input?.value || "").trim()) meta.textContent = "Digite para iniciar a busca.";
      return;
    }

    const signature = items
      .map((item) => `${groupFor(item).label}:${resultTitle(item)}:${resultPath(item)}`)
      .join("|");

    if (
      list.dataset.wcSearchSignature === signature &&
      list.querySelector(".wc-search-group")
    ) {
      return;
    }

    list.dataset.wcSearchOrganizing = "true";
    result?.classList.add("wc-search-has-results");

    const fragment = document.createDocumentFragment();
    groups.forEach((group) => {
      const groupItems = items
        .filter((item) => groupFor(item).label === group.label)
        .sort((first, second) => resultTitle(first).localeCompare(resultTitle(second), "pt-BR"));

      if (!groupItems.length) return;

      fragment.appendChild(createHeading(group.label));
      groupItems.forEach((item) => {
        decorateResult(item, group);
        fragment.appendChild(item);
      });
    });

    list.replaceChildren(fragment);
    list.dataset.wcSearchSignature = signature;
    list.dataset.wcSearchOrganizing = "false";
  }

  function initializeSearchGroups() {
    const resultList = document.querySelector(".md-search-result__list");
    if (!resultList || resultList.dataset.wcSearchObserver === "true") return;

    resultList.dataset.wcSearchObserver = "true";
    const observer = new MutationObserver(() => organizeResults(resultList));
    observer.observe(resultList, { childList: true });
    organizeResults(resultList);
  }

  document.addEventListener("DOMContentLoaded", initializeSearchGroups);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeSearchGroups);
  }
})();
