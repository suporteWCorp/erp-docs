(function () {
  function updateHeader() {
    const headerInner = document.querySelector(".md-header__inner");
    const titleTopics = document.querySelectorAll(".md-header__title .md-header__topic .md-ellipsis");
    if (!headerInner || !titleTopics.length) return;

    titleTopics.forEach((topic) => {
      const title = document.createElement("span");
      title.className = "wc-brand-title";
      title.textContent = "WCorp";

      const subtitle = document.createElement("span");
      subtitle.className = "wc-brand-subtitle";
      subtitle.textContent = "Central de Ajuda";

      topic.replaceChildren(title, subtitle);
      topic.setAttribute("aria-label", "WCorp - Central de Ajuda");
    });

    headerInner.querySelector(".wc-shortcuts")?.remove();
    headerInner.querySelector(".wc-page-context")?.remove();

    const searchInput = document.querySelector(".md-search__input");
    if (!searchInput) return;

    searchInput.placeholder = "Buscar tela, processo, guia ou mensagem de erro...";
    searchInput.setAttribute("aria-label", "Buscar tela, processo, guia ou mensagem de erro");
  }

  document.addEventListener("DOMContentLoaded", updateHeader);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(updateHeader);
  }
})();
