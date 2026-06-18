(function () {
  const shortcuts = [
    { label: "Início", href: "" },
    { label: "Guia", href: "como-fazer/" },
    { label: "FAQ", href: "referencia/glossario/" },
    { label: "Manual", href: "manual/" }
  ];

  const erpTabs = [
    { label: "Comercial", href: "comercial/comercial-geral/", section: "/comercial/" },
    { label: "Faturamento", href: "faturamento/faturamento-geral/", section: "/faturamento/" },
    { label: "Financeiro", href: "financeiro/financeiro-geral/", section: "/financeiro/" },
    { label: "Colaboradores", href: "colaboradores/colaboradores-geral/", section: "/colaboradores/" },
    { label: "Fornecedores", href: "fornecedores/fornecedores-geral/", section: "/fornecedores/" },
    { label: "Materiais", href: "materiais/materiais-geral/", section: "/materiais/" },
    { label: "Serviços", href: "servicos/servicos-geral/", section: "/servicos/" },
    { label: "Contratos", href: "contratos/contratos-geral/", section: "/contratos/" },
    { label: "Compras", href: "compras/compras-geral/", section: "/compras/" },
    { label: "Produção", href: "producao/producao-geral/", section: "/producao/" },
    { label: "Transportes", href: "transportes/transportes-geral/", section: "/transportes/" },
    { label: "Relatórios", href: "relatorios/relatorios-geral/", section: "/relatorios/" },
    { label: "Administração", href: "administracao/administracao-geral/", section: "/administracao/" }
  ];

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    return logo ? logo.href : new URL("/", window.location.href).href;
  }

  function addShortcuts() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner || document.querySelector(".wc-shortcuts")) return;

    const nav = document.createElement("nav");
    nav.className = "wc-shortcuts";
    nav.setAttribute("aria-label", "Atalhos principais");

    const root = rootUrl();
    shortcuts.forEach((item) => {
      const link = document.createElement("a");
      link.className = "wc-shortcuts__link";
      link.href = new URL(item.href, root).href;
      link.textContent = item.label;
      nav.appendChild(link);
    });

    const palette = headerInner.querySelector(".md-header__option");
    const search = headerInner.querySelector(".md-search");
    headerInner.insertBefore(nav, palette || search || null);
  }

  function isManualPage() {
    const path = window.location.pathname;
    return path.includes("/manual/") || erpTabs.some((tab) => path.includes(tab.section));
  }

  function replaceTabsWithErpMenu() {
    const tabsList = document.querySelector(".md-tabs__list");
    if (!tabsList) return;

    if (!isManualPage()) {
      tabsList.classList.remove("wc-erp-tabs");
      return;
    }

    const root = rootUrl();
    const currentPath = window.location.pathname;
    tabsList.classList.add("wc-erp-tabs");
    tabsList.innerHTML = "";

    erpTabs.forEach((tab) => {
      const item = document.createElement("li");
      item.className = "md-tabs__item";

      const link = document.createElement("a");
      link.className = "md-tabs__link";
      link.href = new URL(tab.href, root).href;
      link.textContent = tab.label;

      if (currentPath.includes(tab.section)) {
        link.classList.add("md-tabs__link--active");
      }

      item.appendChild(link);
      tabsList.appendChild(item);
    });
  }

  function addSupportFooter() {
    const content = document.querySelector(".md-content__inner");
    if (!content || content.querySelector(".wc-support-footer")) return;

    const footer = document.createElement("aside");
    footer.className = "wc-support-footer";
    footer.innerHTML = [
      '<span class="wc-support-footer__text">Precisa de ajuda?</span>',
      '<a class="wc-support-footer__button wc-support-footer__button--whatsapp" href="https://wa.me/5512991583055" target="_blank" rel="noopener">WhatsApp</a>',
      '<a class="wc-support-footer__button wc-support-footer__button--youtube" href="https://www.youtube.com/@wcorpsoftwaredegestao5422" target="_blank" rel="noopener">YouTube</a>'
    ].join("");

    content.appendChild(footer);
  }

  function initWcorpUi() {
    addShortcuts();
    replaceTabsWithErpMenu();
    addSupportFooter();
  }

  document.addEventListener("DOMContentLoaded", initWcorpUi);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initWcorpUi);
  }
})();
