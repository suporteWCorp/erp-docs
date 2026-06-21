(function () {
  const videoObjectUrls = new Map();

  const shortcuts = [
    { label: "Início", href: "" },
    { label: "Guia", href: "como-fazer/" },
    { label: "Referências", href: "referencia/" },
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

  function relativePortalPath() {
    const root = new URL(rootUrl()).pathname.replace(/\/+$/, "");
    const path = window.location.pathname.replace(/\/+$/, "");
    return path.startsWith(root) ? path.slice(root.length) || "/" : path;
  }

  function currentPageTitle() {
    const relativePath = relativePortalPath();

    const routeTitles = {
      "/": "Início",
      "/como-fazer": "Guia",
      "/manual": "Manual",
      "/referencia": "Referências",
      "/referencia/faq": "FAQ"
    };

    if (routeTitles[relativePath]) return routeTitles[relativePath];

    const heading = document.querySelector(".md-content__inner > h1");
    if (!heading) return "";

    const copy = heading.cloneNode(true);
    copy.querySelectorAll(".headerlink").forEach((link) => link.remove());
    return copy.textContent.trim();
  }

  function addBreadcrumb() {
    const existing = document.querySelector(".wc-breadcrumb");
    if (existing) existing.remove();

    const relativePath = relativePortalPath();
    if (relativePath === "/") return;

    const content = document.querySelector(".md-content__inner");
    const heading = content ? content.querySelector(":scope > h1") : null;
    if (!content || !heading) return;

    let section = null;
    if (relativePath.startsWith("/como-fazer")) {
      section = { label: "Guia", href: "como-fazer/", path: "/como-fazer" };
    } else if (relativePath.startsWith("/referencia")) {
      section = { label: "Referências", href: "referencia/", path: "/referencia" };
    } else if (relativePath.startsWith("/suporte")) {
      section = { label: "Suporte", href: "suporte/", path: "/suporte" };
    } else if (isManualPage()) {
      section = { label: "Manual", href: "manual/", path: "/manual" };
    }

    const breadcrumb = document.createElement("nav");
    breadcrumb.className = "wc-breadcrumb";
    breadcrumb.setAttribute("aria-label", "Navegação estrutural");

    const list = document.createElement("ol");
    list.className = "wc-breadcrumb__list";

    const addItem = (label, href, current = false) => {
      const item = document.createElement("li");
      item.className = "wc-breadcrumb__item";
      if (current) item.setAttribute("aria-current", "page");

      if (href) {
        const link = document.createElement("a");
        link.href = new URL(href, rootUrl()).href;
        link.textContent = label;
        item.appendChild(link);
      } else {
        item.textContent = label;
      }
      list.appendChild(item);
    };

    addItem("Início", "");
    const title = currentPageTitle();
    if (section && relativePath !== section.path) addItem(section.label, section.href);
    addItem(section && relativePath === section.path ? section.label : title, null, true);

    breadcrumb.appendChild(list);
    content.insertBefore(breadcrumb, heading);
  }

  function updateHeaderIdentity() {
    const headerInner = document.querySelector(".md-header__inner");
    const titleTopics = document.querySelectorAll(".md-header__title .md-header__topic .md-ellipsis");
    if (!headerInner || !titleTopics.length) return;

    titleTopics.forEach((topic) => {
      topic.textContent = "Central de Ajuda WCorp";
    });

    let context = headerInner.querySelector(".wc-page-context");
    if (!context) {
      context = document.createElement("span");
      context.className = "wc-page-context";
      context.setAttribute("aria-label", "Página atual");

      const palette = headerInner.querySelector(".md-header__option");
      const search = headerInner.querySelector(".md-search");
      headerInner.insertBefore(context, palette || search || null);
    }

    context.textContent = currentPageTitle();
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

    if (!tabsList.dataset.wcErpMenu || tabsList.querySelectorAll("[data-wc-module]").length !== erpTabs.length) {
      const fragment = document.createDocumentFragment();

      erpTabs.forEach((tab) => {
        const item = document.createElement("li");
        item.className = "md-tabs__item";
        item.dataset.wcModule = tab.section;

        const link = document.createElement("a");
        link.className = "md-tabs__link";
        link.href = new URL(tab.href, root).href;
        link.textContent = tab.label;

        item.appendChild(link);
        fragment.appendChild(item);
      });

      tabsList.replaceChildren(fragment);
      tabsList.dataset.wcErpMenu = "true";
    }

    tabsList.querySelectorAll("[data-wc-module]").forEach((item) => {
      const link = item.querySelector(".md-tabs__link");
      const isActive = currentPath.includes(item.dataset.wcModule);
      link.classList.toggle("md-tabs__link--active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function normalizedPagePath(url) {
    return `${new URL(url, window.location.href).pathname.replace(/\/+$/, "")}/`;
  }

  function updateManualSubnav() {
    const existing = document.querySelector(".wc-manual-subnav");
    const activeModule = erpTabs.find((tab) => window.location.pathname.includes(tab.section));

    if (!isManualPage() || !activeModule) {
      if (existing) existing.remove();
      return;
    }

    const primaryNav = document.querySelector(".md-sidebar--primary .md-nav--primary");
    const tabs = document.querySelector(".md-tabs");
    if (!primaryNav || !tabs) return;

    const currentPath = normalizedPagePath(window.location.href);
    const activeSourceLink = Array.from(primaryNav.querySelectorAll("a.md-nav__link[href]"))
      .find((link) => normalizedPagePath(link.href) === currentPath);
    const moduleItem = activeSourceLink
      ? activeSourceLink.closest("li.md-nav__item--nested")
      : null;
    const moduleNav = moduleItem
      ? moduleItem.querySelector(":scope > nav.md-nav")
      : null;

    if (!moduleNav) {
      if (existing) existing.remove();
      return;
    }

    const sourceLinks = Array.from(
      moduleNav.querySelectorAll(":scope > ul.md-nav__list > li.md-nav__item > a.md-nav__link[href]")
    ).filter((link) => link.textContent.trim().toLocaleLowerCase("pt-BR") !== "visão geral");

    if (!sourceLinks.length) {
      if (existing) existing.remove();
      return;
    }

    const subnav = existing || document.createElement("nav");
    subnav.className = "wc-manual-subnav";
    subnav.setAttribute("aria-label", `Funcionalidades de ${activeModule.label}`);

    let inner = subnav.querySelector(".wc-manual-subnav__inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "wc-manual-subnav__inner";
      subnav.appendChild(inner);
    }

    if (subnav.dataset.wcModule !== activeModule.section) {
      const fragment = document.createDocumentFragment();

      sourceLinks.forEach((sourceLink) => {
        const link = document.createElement("a");
        link.className = "wc-manual-subnav__link";
        link.href = sourceLink.href;
        link.textContent = sourceLink.textContent.trim();
        fragment.appendChild(link);
      });

      inner.replaceChildren(fragment);
      subnav.dataset.wcModule = activeModule.section;
    }

    inner.querySelectorAll(".wc-manual-subnav__link").forEach((link) => {
      const isActive = normalizedPagePath(link.href) === currentPath;
      link.classList.toggle("wc-manual-subnav__link--active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (!existing) {
      tabs.insertAdjacentElement("afterend", subnav);
    }
  }

  function addSupportFooter() {
    const content = document.querySelector(".md-content__inner");
    if (!content || content.querySelector(".wc-support-footer")) return;

    const footer = document.createElement("aside");
    footer.className = "wc-support-footer";
    footer.innerHTML = [
      '<span class="wc-support-footer__text">Contato</span>',
      '<span class="wc-support-footer__separator" aria-hidden="true">•</span>',
      '<a class="wc-support-footer__link" href="mailto:suporte@waveconcept.com.br" aria-label="Enviar e-mail para suporte@waveconcept.com.br">suporte@waveconcept.com.br</a>',
      '<span class="wc-support-footer__separator" aria-hidden="true">•</span>',
      '<a class="wc-support-footer__link" href="https://wa.me/5512991583055" target="_blank" rel="noopener" aria-label="Falar com suporte pelo WhatsApp">WhatsApp</a>',
      '<span class="wc-support-footer__separator" aria-hidden="true">•</span>',
      '<span class="wc-support-footer__note">Desenvolvido pela equipe de Suporte - versão teste 2026</span>'
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

  function isGuideOverview() {
    const currentPath = `${window.location.pathname.replace(/\/+$/, "")}/`;
    const guidePath = `${new URL("como-fazer/", rootUrl()).pathname.replace(/\/+$/, "")}/`;
    return currentPath === guidePath;
  }

  function focusGuideSidebar() {
    const primaryNav = document.querySelector(".md-sidebar--primary .md-nav--primary");
    if (!primaryNav) return;

    primaryNav.querySelectorAll(".wc-guide-nav-hidden").forEach((item) => {
      item.hidden = false;
      item.classList.remove("wc-guide-nav-hidden");
    });

    const currentPath = normalizedPagePath(window.location.href);
    const guidePath = normalizedPagePath(new URL("como-fazer/", rootUrl()));

    if (!currentPath.startsWith(guidePath) || currentPath === guidePath) {
      document.body.classList.remove("wc-guide-nav-focused");
      return;
    }

    const currentLink = Array.from(primaryNav.querySelectorAll("a.md-nav__link[href]"))
      .find((link) => normalizedPagePath(link.href) === currentPath);
    const moduleItem = currentLink
      ? currentLink.closest("li.md-nav__item--section.md-nav__item--nested")
      : null;
    const guideList = moduleItem ? moduleItem.parentElement : null;
    const guideItem = guideList
      ? guideList.closest("li.md-nav__item--section.md-nav__item--nested")
      : null;
    const rootList = guideItem ? guideItem.parentElement : null;

    if (!moduleItem || !guideList || !guideItem || !rootList) return;

    Array.from(rootList.children).forEach((item) => {
      if (item !== guideItem) {
        item.hidden = true;
        item.classList.add("wc-guide-nav-hidden");
      }
    });

    Array.from(guideList.children).forEach((item, index) => {
      if (index !== 0 && item !== moduleItem) {
        item.hidden = true;
        item.classList.add("wc-guide-nav-hidden");
      }
    });

    document.body.classList.add("wc-guide-nav-focused");
  }

  function configureGuideOverviewSidebar() {
    const primaryNav = document.querySelector(".md-sidebar--primary .md-nav--primary");
    if (!primaryNav) return;

    primaryNav.querySelectorAll(".wc-guide-overview-module").forEach((item) => {
      item.classList.remove("wc-guide-overview-module", "wc-guide-overview-module--open");
      const originalTrigger = item.querySelector(":scope > .wc-guide-overview-original-trigger");
      if (originalTrigger) originalTrigger.classList.remove("wc-guide-overview-original-trigger");
      const trigger = item.querySelector(":scope > button.wc-guide-overview-trigger");
      if (trigger) trigger.hidden = true;
    });
    primaryNav.querySelectorAll(".wc-guide-overview-home-link").forEach((item) => {
      item.classList.remove("wc-guide-overview-home-link");
    });
    document.body.classList.remove("wc-guide-overview");

    if (!isGuideOverview()) return;

    const currentPath = normalizedPagePath(window.location.href);
    const overviewLink = Array.from(primaryNav.querySelectorAll("a.md-nav__link[href]"))
      .find((link) => normalizedPagePath(link.href) === currentPath);
    const guideList = overviewLink
      ? overviewLink.closest("li.md-nav__item")?.parentElement
      : null;
    if (!guideList) return;

    const overviewItem = overviewLink.closest("li.md-nav__item");
    if (overviewItem) overviewItem.classList.add("wc-guide-overview-home-link");

    const modules = Array.from(guideList.children)
      .filter((item) => item.matches("li.md-nav__item--section.md-nav__item--nested"));

    modules.forEach((item) => {
      item.classList.add("wc-guide-overview-module");
      const toggle = item.querySelector(":scope > input.md-nav__toggle");
      const originalTrigger = item.querySelector(":scope > .md-nav__link");
      const moduleNav = item.querySelector(":scope > nav.md-nav");
      if (!toggle || !originalTrigger || !moduleNav) return;

      let trigger = item.querySelector(":scope > button.wc-guide-overview-trigger");
      if (!trigger) {
        trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "wc-guide-overview-trigger";
        trigger.textContent = originalTrigger.textContent.trim();
        item.insertBefore(trigger, moduleNav);
      }

      toggle.checked = false;
      item.classList.remove("wc-guide-overview-module--open");
      originalTrigger.classList.add("wc-guide-overview-original-trigger");
      trigger.hidden = false;
      trigger.setAttribute("aria-expanded", "false");

      if (trigger.dataset.wcGuideAccordion) return;

      trigger.dataset.wcGuideAccordion = "true";
      trigger.addEventListener("click", () => {
        if (!document.body.classList.contains("wc-guide-overview")) return;
        const shouldOpen = !item.classList.contains("wc-guide-overview-module--open");

        modules.forEach((otherItem) => {
          const otherToggle = otherItem.querySelector(":scope > input.md-nav__toggle");
          if (otherToggle) otherToggle.checked = false;
          otherItem.classList.remove("wc-guide-overview-module--open");
          const otherTrigger = otherItem.querySelector(":scope > button.wc-guide-overview-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });

        if (shouldOpen) {
          toggle.checked = true;
          item.classList.add("wc-guide-overview-module--open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.body.classList.add("wc-guide-overview");
  }

  function createQuickLinksSection(title, items, root) {
    const section = document.createElement("section");
    section.className = "wc-guide-quicklinks__section";

    const heading = document.createElement("span");
    heading.className = "wc-guide-quicklinks__title";
    heading.textContent = title;
    section.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "md-nav__list";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "md-nav__item";

      if (item.href) {
        const link = document.createElement("a");
        link.className = "md-nav__link";
        link.href = new URL(item.href, root).href;
        link.textContent = item.label;
        listItem.appendChild(link);
      } else {
        const pending = document.createElement("span");
        pending.className = "md-nav__link wc-guide-quicklinks__pending";
        pending.textContent = item.label;
        pending.dataset.errorSlug = item.slug;
        pending.title = "Página de erro pendente de documentação";

        const status = document.createElement("small");
        status.textContent = "Pendente";
        pending.appendChild(status);
        listItem.appendChild(pending);
      }

      list.appendChild(listItem);
    });

    section.appendChild(list);
    return section;
  }

  function replaceGuideOverviewToc() {
    if (!isGuideOverview()) return;

    const sidebar = document.querySelector(".md-sidebar--secondary .md-sidebar__inner");
    if (!sidebar || sidebar.querySelector(".wc-guide-quicklinks")) return;

    const root = rootUrl();
    const nav = document.createElement("nav");
    nav.className = "md-nav md-nav--secondary wc-guide-quicklinks";
    nav.setAttribute("aria-label", "Atalhos rápidos do Guia");

    nav.appendChild(createQuickLinksSection("Atalhos", [
      { label: "Como emitir uma NF-e", href: "como-fazer/faturar-nota/" },
      { label: "Como cadastrar um cliente", href: "como-fazer/cadastrar-cliente/" },
      { label: "Como gerar um pedido", href: "como-fazer/fazer-pedido-venda/" },
      { label: "Como cadastrar uma Natureza de Operação", href: "como-fazer/cadastrar-natureza-operacao/" }
    ], root));

    nav.appendChild(createQuickLinksSection("Links rápidos", [
      { label: "FAQ", href: "referencia/faq/" },
      { label: "Manual", href: "manual/" },
      { label: "Suporte", href: "suporte/" }
    ], root));

    sidebar.replaceChildren(nav);
  }

  function initWcorpUi() {
    addShortcuts();
    updateHeaderIdentity();
    addBreadcrumb();
    replaceTabsWithErpMenu();
    updateManualSubnav();
    movePortalSidebar();
    focusGuideSidebar();
    configureGuideOverviewSidebar();
    replaceGuideOverviewToc();
    addSupportFooter();
    prepareSeekableVideos();
  }

  document.addEventListener("DOMContentLoaded", initWcorpUi);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initWcorpUi);
  }
})();
