(function () {
  const videoObjectUrls = new Map();

  const shortcuts = [
    { label: "Início", href: "" },
    { label: "Guia", href: "como-fazer/" },
    { label: "FAQ", href: "referencia/" },
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
      document.body.classList.remove("wc-manual-tabs");
      tabsList.classList.remove("wc-erp-tabs");
      return;
    }

    const root = rootUrl();
    const currentPath = window.location.pathname;
    document.body.classList.add("wc-manual-tabs");
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
      '<span class="wc-support-footer__text">Contato</span>',
      '<a class="wc-support-footer__link" href="mailto:suporte@waveconcept.com.br" aria-label="Enviar e-mail para suporte@waveconcept.com.br"><span aria-hidden="true">📧</span> suporte@waveconcept.com.br</a>',
      '<span class="wc-support-footer__separator" aria-hidden="true">•</span>',
      '<a class="wc-support-footer__link" href="https://wa.me/5512991583055" target="_blank" rel="noopener" aria-label="Falar com suporte pelo WhatsApp"><span aria-hidden="true">💬</span> WhatsApp</a>'
    ].join("");

    content.appendChild(footer);
  }

  function movePortalSidebar() {
    const primarySidebar = document.querySelector(".md-sidebar--primary .md-sidebar__inner");
    const portalSidebar = document.querySelector(".md-content .wc-portal-sidebar");
    const portalMarker = document.querySelector(".md-content .wc-portal-sidebar-marker");
    const existingHost = primarySidebar ? primarySidebar.querySelector(".wc-portal-sidebar-host") : null;

    if (!portalSidebar && !portalMarker) {
      if (existingHost) existingHost.remove();
      document.body.classList.remove("wc-has-portal-sidebar");
      return;
    }

    if (!primarySidebar) return;

    if (!portalSidebar && existingHost && existingHost.querySelector(".wc-portal-sidebar")) {
      document.body.classList.add("wc-has-portal-sidebar");
      return;
    }

    const host = existingHost || document.createElement("div");
    host.className = "wc-portal-sidebar-host";

    if (!existingHost) {
      primarySidebar.appendChild(host);
    }

    if (portalSidebar && !portalMarker) {
      const marker = document.createElement("span");
      marker.className = "wc-portal-sidebar-marker";
      marker.hidden = true;
      portalSidebar.parentNode.insertBefore(marker, portalSidebar);
    }

    if (portalSidebar && !host.contains(portalSidebar)) {
      host.appendChild(portalSidebar);
    }

    document.body.classList.add("wc-has-portal-sidebar");
  }

  function cleanupDetachedVideoUrls() {
    videoObjectUrls.forEach((url, video) => {
      if (!video.isConnected) {
        URL.revokeObjectURL(url);
        videoObjectUrls.delete(video);
      }
    });
  }

  async function prepareSeekableVideo(video) {
    if (video.dataset.wcSeekable) return;

    const source = video.querySelector("source[src]");
    if (!source) return;

    video.dataset.wcSeekable = "loading";

    try {
      const response = await fetch(source.src, {
        cache: "no-store",
        headers: { Range: "bytes=0-0" }
      });

      if (response.status === 206) {
        if (response.body) await response.body.cancel();
        video.dataset.wcSeekable = "native";
        return;
      }

      if (!response.ok) throw new Error(`Falha ao carregar vídeo: ${response.status}`);

      const blob = await response.blob();
      if (!video.isConnected) return;

      const objectUrl = URL.createObjectURL(blob);
      videoObjectUrls.set(video, objectUrl);
      video.src = objectUrl;
      video.load();
      video.dataset.wcSeekable = "blob";
    } catch (_error) {
      video.dataset.wcSeekable = "native";
    }
  }

  function prepareSeekableVideos() {
    cleanupDetachedVideoUrls();
    document.querySelectorAll("video.wc-video").forEach(prepareSeekableVideo);
  }

  function initWcorpUi() {
    addShortcuts();
    replaceTabsWithErpMenu();
    movePortalSidebar();
    addSupportFooter();
    prepareSeekableVideos();
  }

  document.addEventListener("DOMContentLoaded", initWcorpUi);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initWcorpUi);
  }
})();
