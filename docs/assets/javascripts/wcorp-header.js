(function () {
  const topThreshold = 420;

  function updateTopButtonVisibility() {
    const topButton = document.querySelector(".md-top");
    if (!topButton) return;

    topButton.classList.toggle("wc-top-ready", window.scrollY > topThreshold);
  }

  function updateHeader() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return;

    const logo = headerInner.querySelector(".md-header__button.md-logo[href]");
    if (logo) {
      logo.setAttribute("aria-label", "Ir para o início");
      logo.setAttribute("title", "Ir para o início");
    }

    headerInner.querySelector(".wc-shortcuts")?.remove();
    headerInner.querySelector(".wc-page-context")?.remove();

    const searchInput = document.querySelector(".md-search__input");
    if (!searchInput) return;

    searchInput.placeholder = "Buscar tela, processo, guia ou mensagem de erro...";
    searchInput.setAttribute("aria-label", "Buscar tela, processo, guia ou mensagem de erro");

    updateTopButtonVisibility();
  }

  document.addEventListener("DOMContentLoaded", updateHeader);
  window.addEventListener("scroll", updateTopButtonVisibility, { passive: true });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      updateHeader();
      requestAnimationFrame(updateTopButtonVisibility);
    });
  }
})();
