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
      const title = document.createElement("span");
      title.className = "wc-brand-title";
      title.textContent = "WCorp";

      const subtitle = document.createElement("span");
      subtitle.className = "wc-brand-subtitle";
      subtitle.textContent = "Central de Ajuda";

      topic.replaceChildren(title, subtitle);
      topic.setAttribute("aria-label", "WCorp — Central de Ajuda");
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

  function linksFromPortalBlock(block) {
    if (!block) return [];

    return Array.from(block.querySelectorAll("li > a[href]")).map((link) => ({
      label: link.textContent.trim(),
      href: link.href,
      external: link.target === "_blank"
    }));
  }

  function directNavItems(list) {
    if (!list) return [];

    return Array.from(list.children).flatMap((item) => {
      const link = item.querySelector(":scope > a.md-nav__link[href]");
      if (!link) return [];

      return [{
        label: link.textContent.trim(),
        href: link.href,
        active: normalizedPagePath(link.href) === normalizedPagePath(window.location.href)
      }];
    });
  }

  function sectionListFor(path) {
    const primaryNav = document.querySelector(".md-sidebar--primary .md-nav--primary");
    if (!primaryNav) return null;

    const targetPath = normalizedPagePath(new URL(path, rootUrl()));
    const overviewLink = Array.from(primaryNav.querySelectorAll("a.md-nav__link[href]"))
      .find((link) => normalizedPagePath(link.href) === targetPath);

    return overviewLink ? overviewLink.closest("li.md-nav__item")?.parentElement : null;
  }

  function guideSidebarItems() {
    const guideList = sectionListFor("como-fazer/");
    if (!guideList) return [];

    return Array.from(guideList.children).flatMap((item) => {
      if (!item.matches("li.md-nav__item--section.md-nav__item--nested")) return [];

      const label = item.querySelector(":scope > .md-nav__link .md-ellipsis")?.textContent.trim();
      const moduleList = item.querySelector(":scope > nav.md-nav > ul.md-nav__list");
      if (!label || !moduleList) return [];

      return [{ label, children: directNavItems(moduleList) }];
    });
  }

  function contextSidebarConfig() {
    const relativePath = relativePortalPath();
    const currentPath = normalizedPagePath(window.location.href);

    if (relativePath === "/") {
      const blocks = Array.from(document.querySelectorAll(".md-content .wc-portal-sidebar .wc-portal-block"));
      return {
        className: "wc-context-home",
        title: "Início",
        items: [
          { label: "Início", href: rootUrl(), active: true },
          { label: "Guia", href: new URL("como-fazer/", rootUrl()).href },
          { label: "Referências", href: new URL("referencia/", rootUrl()).href },
          { label: "Manual", href: new URL("manual/", rootUrl()).href },
          { label: "Suporte", href: new URL("suporte/", rootUrl()).href },
          { label: "Mais acessados", children: linksFromPortalBlock(blocks[0]) },
          { label: "Links úteis", children: linksFromPortalBlock(blocks[1]) }
        ]
      };
    }

    if (relativePath === "/como-fazer") {
      return {
        className: "wc-context-guide",
        title: "Guia",
        items: guideSidebarItems()
      };
    }

    if (relativePath.startsWith("/referencia")) {
      return {
        className: "wc-context-reference",
        title: "Referências",
        items: directNavItems(sectionListFor("referencia/")).map((item) => ({
          ...item,
          active: normalizedPagePath(item.href) === currentPath
        }))
      };
    }

    return null;
  }

  function createContextSidebarItem(item, groups) {
    const listItem = document.createElement("li");
    listItem.className = "md-nav__item wc-context-nav__item";

    if (!item.children) {
      const link = document.createElement("a");
      link.className = "md-nav__link";
      if (item.active) link.classList.add("md-nav__link--active");
      link.href = item.href;
      link.textContent = item.label;
      if (item.external) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      listItem.appendChild(link);
      return listItem;
    }

    listItem.classList.add("wc-context-nav__group");
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "wc-context-nav__trigger";
    trigger.textContent = item.label;
    trigger.setAttribute("aria-expanded", "false");

    const childNav = document.createElement("nav");
    childNav.className = "md-nav wc-context-nav__children";
    childNav.setAttribute("aria-label", item.label);

    const childList = document.createElement("ul");
    childList.className = "md-nav__list";
    item.children.forEach((child) => childList.appendChild(createContextSidebarItem(child, groups)));
    childNav.appendChild(childList);
    listItem.append(trigger, childNav);
    groups.push(listItem);

    trigger.addEventListener("click", () => {
      const shouldOpen = !listItem.classList.contains("wc-context-nav__group--open");
      groups.forEach((group) => {
        group.classList.remove("wc-context-nav__group--open");
        group.querySelector(":scope > .wc-context-nav__trigger")?.setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        listItem.classList.add("wc-context-nav__group--open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    return listItem;
  }

  function configureContextSidebar() {
    const primarySidebar = document.querySelector(".md-sidebar--primary .md-sidebar__inner");
    if (!primarySidebar) return;

    primarySidebar.querySelector(".wc-context-sidebar-host")?.remove();
    document.body.classList.remove(
      "wc-context-sidebar-active",
      "wc-context-home",
      "wc-context-guide",
      "wc-context-reference"
    );

    const config = contextSidebarConfig();
    if (!config) return;

    const host = document.createElement("div");
    host.className = "wc-context-sidebar-host";

    const nav = document.createElement("nav");
    nav.className = "md-nav md-nav--primary wc-context-nav";
    nav.setAttribute("aria-label", config.title);

    const title = document.createElement("div");
    title.className = "wc-context-nav__title";
    title.textContent = config.title;

    const list = document.createElement("ul");
    list.className = "md-nav__list";
    const groups = [];
    config.items.forEach((item) => list.appendChild(createContextSidebarItem(item, groups)));

    nav.append(title, list);
    host.appendChild(nav);
    primarySidebar.appendChild(host);
    document.body.classList.add("wc-context-sidebar-active", config.className);
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
    configureContextSidebar();
    focusGuideSidebar();
    replaceGuideOverviewToc();
    addSupportFooter();
    prepareSeekableVideos();
  }

  document.addEventListener("DOMContentLoaded", initWcorpUi);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initWcorpUi);
  }
})();
