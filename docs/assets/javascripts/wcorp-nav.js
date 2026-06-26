(function () {
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
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function relativePortalPath() {
    const root = new URL(rootUrl()).pathname.replace(/\/+$/, "");
    const path = window.location.pathname.replace(/\/+$/, "");
    const relativePath = path.startsWith(root) ? path.slice(root.length) || "/" : path;
    return relativePath.replace(/\/index\.html$/, "") || "/";
  }

  function manualModuleForCurrentPage() {
    return erpTabs.find((tab) => window.location.pathname.includes(tab.section)) || null;
  }

  function isManualModuleOverview() {
    const activeModule = manualModuleForCurrentPage();
    if (!activeModule) return false;

    return normalizedPagePath(window.location.href) === normalizedPagePath(new URL(activeModule.href, rootUrl()));
  }

  function currentPageTitle() {
    const relativePath = relativePortalPath();

    const routeTitles = {
      "/": "Início",
      "/como-fazer": "Guia",
      "/manual": "Manual",
      "/referencia": "Referências",
      "/referencia/faq": "FAQ",
      "/favoritos": "Favoritos"
    };

    if (routeTitles[relativePath]) return routeTitles[relativePath];

    const heading = document.querySelector(".md-content__inner > h1");
    if (!heading) return "";

    const copy = heading.cloneNode(true);
    copy.querySelectorAll(".headerlink").forEach((link) => link.remove());
    return copy.textContent.trim();
  }

  function addBreadcrumb() {
    const existing = document.querySelector(".wc-breadcrumb-bar");
    if (existing) existing.remove();
    document.querySelectorAll(".md-content .wc-breadcrumb").forEach((item) => item.remove());

    const relativePath = relativePortalPath();

    const content = document.querySelector(".md-content__inner");
    const heading = content ? content.querySelector(":scope > h1") : null;
    const header = document.querySelector(".md-header");
    if (!header || !content || !heading) return;

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

    addItem("Início", rootUrl(), relativePath === "/");
    const title = currentPageTitle();
    if (section) {
      const manualModule = isManualPage() ? manualModuleForCurrentPage() : null;

      if (relativePath === section.path) {
        addItem(section.label, null, true);
      } else {
        addItem(section.label, section.href);
        if (manualModule) {
          const moduleHref = new URL(manualModule.href, rootUrl()).href;
          const isModuleOverview = normalizedPagePath(window.location.href) === normalizedPagePath(moduleHref);

          if (isModuleOverview) {
            addItem(manualModule.label, null, true);
          } else {
            addItem(manualModule.label, manualModule.href);
            addItem(title, null, true);
          }
        } else {
          addItem(title, null, true);
        }
      }
    } else if (relativePath !== "/") {
      addItem(title, null, true);
    }

    const bar = document.createElement("div");
    bar.className = "wc-breadcrumb-bar";
    breadcrumb.appendChild(list);
    bar.appendChild(breadcrumb);
    header.insertAdjacentElement("afterend", bar);
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
    const path = new URL(url, window.location.href).pathname
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "");
    return `${path}/`;
  }

  function updateManualSubnav() {
    const existing = document.querySelector(".wc-manual-subnav");
    const activeModule = manualModuleForCurrentPage();

    if (!isManualPage() || !activeModule) {
      if (existing) existing.remove();
      return;
    }

    const primaryNav = document.querySelector(".md-sidebar--primary .md-nav--primary");
    const tabs = document.querySelector(".md-tabs");
    if (!primaryNav || !tabs) return;

    const currentPath = normalizedPagePath(window.location.href);
    const activeModuleItems = manualSidebarItems()
      .find((module) => module.label === activeModule.label)
      ?.children.filter((item) => item.label.toLocaleLowerCase("pt-BR") !== "visão geral") || [];

    if (!activeModuleItems.length) {
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

      activeModuleItems.forEach((sourceItem) => {
        const link = document.createElement("a");
        link.className = "wc-manual-subnav__link";
        link.href = sourceItem.href;
        link.textContent = sourceItem.label;
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

  function linksFromPortalBlock(block) {
    if (!block) return [];

    return Array.from(block.querySelectorAll("li > a[href]")).map((link) => ({
      label: link.textContent.trim(),
      href: link.href,
      external: link.target === "_blank"
    }));
  }

  function sectionListFor(path) {
    const primaryNav = document.querySelector(
      ".md-sidebar--primary .md-sidebar__inner > .md-nav--primary"
    );
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

      const children = directNavItems(moduleList);
      return [{ label, count: children.length, children }];
    });
  }

  function manualSidebarItems() {
    const manualList = sectionListFor("manual/");
    if (!manualList) return [];

    return Array.from(manualList.children).flatMap((item) => {
      if (!item.matches("li.md-nav__item--section.md-nav__item--nested")) return [];

      const label = item.querySelector(":scope > .md-nav__link .md-ellipsis")?.textContent.trim();
      const moduleList = item.querySelector(":scope > nav.md-nav > ul.md-nav__list");
      if (!label || !moduleList) return [];

      return [{ label, children: directNavItems(moduleList) }];
    });
  }

  function manualOverviewCards() {
    const activeModule = manualModuleForCurrentPage();
    if (!activeModule || !isManualModuleOverview()) return;

    const content = document.querySelector(".md-content__inner");
    if (!content || content.querySelector(".wc-manual-category-grid")) return;

    const activeModuleItems = manualSidebarItems()
      .find((module) => module.label === activeModule.label)
      ?.children.filter((item) => item.label.toLocaleLowerCase("pt-BR") !== "visão geral") || [];
    if (!activeModuleItems.length) return;

    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = "Telas do módulo";

    const grid = document.createElement("div");
    grid.className = "wc-home-grid wc-manual-category-grid";

    activeModuleItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "wc-card";
      card.dataset.wcCardType = "Manuais";

      const title = document.createElement("h3");
      title.textContent = item.label;

      const description = document.createElement("p");
      description.textContent = "Consulte campos, caminho e funcionamento desta tela.";

      const linkWrapper = document.createElement("p");
      const link = document.createElement("a");
      link.className = "md-button md-button--primary";
      link.href = item.href;
      link.textContent = "Ver manual";
      linkWrapper.appendChild(link);

      card.append(title, description, linkWrapper);
      grid.appendChild(card);
    });

    const orderHeading = Array.from(content.querySelectorAll(":scope > h2"))
      .find((heading) => heading.textContent.trim().toLocaleLowerCase("pt-BR").startsWith("ordem da aba"));
    const firstImageBlock = content.querySelector(":scope > p > img, :scope > img")?.closest("p");

    if (orderHeading) {
      const insertBefore = firstImageBlock || orderHeading;
      insertBefore.insertAdjacentElement("beforebegin", sectionTitle);
      sectionTitle.insertAdjacentElement("afterend", grid);

      let cursor = orderHeading;
      while (cursor) {
        const next = cursor.nextElementSibling;
        cursor.remove();
        if (!next || next.tagName === "H2") break;
        cursor = next;
      }
    } else {
      const anchor = firstImageBlock || content.querySelector(":scope > h1");
      anchor?.insertAdjacentElement("afterend", grid);
      grid.insertAdjacentElement("beforebegin", sectionTitle);
    }
  }

  function contextSidebarConfig() {
    const relativePath = relativePortalPath();
    const currentPath = normalizedPagePath(window.location.href);

    if (relativePath === "/") {
      const blocks = Array.from(document.querySelectorAll(".md-content .wc-portal-sidebar .wc-portal-block"));
      return {
        className: "wc-context-home",
        title: "Nesta página",
        items: [
          { label: "Mais acessados", children: linksFromPortalBlock(blocks[0]) },
          { label: "Links úteis", children: linksFromPortalBlock(blocks[1]) }
        ]
      };
    }

    if (relativePath.startsWith("/como-fazer")) {
      return {
        className: "wc-context-guide",
        title: "Guia",
        items: guideSidebarItems()
      };
    }

    if (relativePath.startsWith("/referencia")) {
      const referenceOverview = normalizedPagePath(new URL("referencia/", rootUrl()));
      const fiscalUpdates = normalizedPagePath(new URL("referencia/atualizacoes-fiscais/", rootUrl()));
      return {
        className: "wc-context-reference",
        title: "Referências",
        items: directNavItems(sectionListFor("referencia/"))
          .filter((item) => ![referenceOverview, fiscalUpdates].includes(normalizedPagePath(item.href)))
          .map((item) => ({
            ...item,
            active: normalizedPagePath(item.href) === currentPath
          }))
      };
    }

    if (relativePath.startsWith("/suporte")) {
      return {
        className: "wc-context-support",
        title: "Suporte",
        items: [
          { label: "Erros Comuns", href: new URL("referencia/erros-comuns/", rootUrl()).href },
          { label: "Links úteis", href: new URL("referencia/links-uteis/", rootUrl()).href },
          { label: "FAQ", href: new URL("referencia/faq/", rootUrl()).href },
          { label: "Glossário", href: new URL("referencia/glossario/", rootUrl()).href }
        ]
      };
    }

    if (isManualPage()) {
      return {
        className: "wc-context-manual",
        title: "Manual",
        items: manualSidebarItems()
      };
    }

    return null;
  }

  function globalSidebarItems() {
    const relativePath = relativePortalPath();
    const root = rootUrl();
    const navigationPaths = [...new Set(Array.from(document.querySelectorAll("a[href]"), (link) => (
      new URL(link.href, window.location.href).pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "")
    )))];
    const guideCount = navigationPaths.filter((path) => path.includes("/como-fazer/")).length;
    const manualCount = navigationPaths.filter((path) => (
      erpTabs.some((tab) => path.includes(tab.section)) && !/-geral$/.test(path)
    )).length;

    return [
      { label: "Início", icon: "home", href: root, active: relativePath === "/" },
      { label: "Guia", count: guideCount, icon: "guide", href: new URL("como-fazer/", root).href, active: relativePath.startsWith("/como-fazer") },
      { label: "Manual", count: manualCount, icon: "manual", href: new URL("manual/", root).href, active: isManualPage() },
      { label: "Referências", icon: "reference", href: new URL("referencia/", root).href, active: relativePath.startsWith("/referencia") },
      { label: "Suporte", icon: "support", href: new URL("suporte/", root).href, active: relativePath.startsWith("/suporte") },
      { label: "Favoritos", icon: "favorite", href: new URL("favoritos/", root).href, active: relativePath.startsWith("/favoritos") }
    ];
  }

  function createNavigationIcon(name) {
    const paths = {
      home: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z"/>',
      guide: '<path d="M4 3h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v16h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4V3zm2 2v12h4c.35 0 .69.04 1 .12V6.88A2.98 2.98 0 0 0 10 5H6zm12 0h-4c-.35 0-.69.06-1 .18v11.94c.31-.08.65-.12 1-.12h4V5z"/>',
      manual: '<path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zm8 2H6v16h12V8h-4V4zm-5 8h6v2H9v-2zm0 4h6v2H9v-2z"/>',
      reference: '<path d="M3 4h7a2 2 0 0 1 2 2 2 2 0 0 1 2-2h7v15h-7a2 2 0 0 0-2 2 2 2 0 0 0-2-2H3V4zm2 2v11h5c.35 0 .69.06 1 .17V7a1 1 0 0 0-1-1H5zm14 0h-5a1 1 0 0 0-1 1v10.17c.31-.11.65-.17 1-.17h5V6z"/>',
      support: '<path d="M12 2a8 8 0 0 0-8 8v1a3 3 0 0 0 3 3h1V9H6.08A6 6 0 0 1 18 9h-2v7h2a2 2 0 0 1-2 2h-3v-1h-3v3h6a4 4 0 0 0 4-4v-2.18A3 3 0 0 0 21 11v-1a8 8 0 0 0-8-8h-1z"/>',
      favorite: '<path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3z"/>'
    };
    if (!paths[name]) return null;

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.classList.add("wc-context-nav__icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = paths[name];
    return icon;
  }

  function createSidebarNav(titleText, items, className) {
    const nav = document.createElement("nav");
    nav.className = `md-nav md-nav--primary wc-context-nav ${className}`;
    nav.setAttribute("aria-label", titleText);

    const title = document.createElement("div");
    title.className = "wc-context-nav__title";
    title.textContent = titleText;

    const list = document.createElement("ul");
    list.className = "md-nav__list";
    const groups = [];
    items.forEach((item) => list.appendChild(createContextSidebarItem(item, groups)));

    nav.append(title, list);
    return nav;
  }

  function createContextSidebarItem(item, groups) {
    const listItem = document.createElement("li");
    listItem.className = "md-nav__item wc-context-nav__item";

    if (!item.children) {
      if (!item.href) {
        const label = document.createElement("span");
        label.className = "md-nav__link wc-context-nav__label";
        label.textContent = item.label;
        listItem.appendChild(label);
        return listItem;
      }

      const link = document.createElement("a");
      link.className = "md-nav__link";
      if (item.active) link.classList.add("md-nav__link--active");
      link.href = item.href;
      const icon = item.icon ? createNavigationIcon(item.icon) : null;
      if (icon) link.appendChild(icon);

      const text = document.createElement("span");
      text.textContent = item.label;
      link.appendChild(text);
      if (Number.isFinite(item.count)) {
        const count = document.createElement("span");
        count.className = "wc-context-nav__count";
        count.textContent = String(item.count);
        count.setAttribute("aria-label", `${item.count} conteúdos`);
        link.appendChild(count);
      }
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
    const triggerText = document.createElement("span");
    triggerText.textContent = item.label;
    trigger.appendChild(triggerText);
    if (Number.isFinite(item.count)) {
      const count = document.createElement("span");
      count.className = "wc-context-nav__count";
      count.textContent = String(item.count);
      count.setAttribute("aria-label", `${item.count} conteúdos`);
      trigger.appendChild(count);
    }
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

    if (item.children.some((child) => child.active)) {
      listItem.classList.add("wc-context-nav__group--open");
      trigger.setAttribute("aria-expanded", "true");
    }

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
      "wc-context-sidebar-custom",
      "wc-context-home",
      "wc-context-guide",
      "wc-context-reference",
      "wc-context-support",
      "wc-context-manual",
      "wc-context-favorites"
    );

    const config = contextSidebarConfig();
    const host = document.createElement("div");
    host.className = "wc-context-sidebar-host";

    host.appendChild(createSidebarNav("Navegar", globalSidebarItems(), "wc-global-nav"));
    if (config) {
      if (config.items.length) {
        host.appendChild(createSidebarNav(config.title, config.items, "wc-page-nav"));
      }
      document.body.classList.add("wc-context-sidebar-custom", config.className);
    }

    primarySidebar.prepend(host);
    document.body.classList.add("wc-context-sidebar-active");

    const scrollContainer = primarySidebar.closest(".md-sidebar__scrollwrap") || primarySidebar;
    const resetScroll = () => {
      primarySidebar.scrollTop = 0;
      scrollContainer.scrollTop = 0;
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    window.setTimeout(resetScroll, 120);
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
    addBreadcrumb();
    replaceTabsWithErpMenu();
    configureContextSidebar();
    updateManualSubnav();
    manualOverviewCards();
    focusGuideSidebar();
    replaceGuideOverviewToc();
    addSupportFooter();
  }

  document.addEventListener("DOMContentLoaded", initWcorpUi);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initWcorpUi);
  }
})();
