(function () {
  const storageKey = "wcorpHelpTourCompleted";
  const targetClass = "wc-tour-target";
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeTour = null;
  let startQueued = false;

  function hasCompletedTour() {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch (_error) {
      return false;
    }
  }

  function setCompletedTour() {
    try {
      localStorage.setItem(storageKey, "true");
    } catch (_error) {
      // Sem acesso ao localStorage, apenas fecha o tutorial nesta sessao.
    }
  }

  function clearCompletedTour() {
    try {
      localStorage.removeItem(storageKey);
    } catch (_error) {
      // Sem acesso ao localStorage, a funcao de reset vira apenas um no-op seguro.
    }
  }

  function normalizedText(element) {
    return (element?.textContent || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function linkByText(containerSelector, text) {
    const container = document.querySelector(containerSelector);
    if (!container) return null;

    return Array.from(container.querySelectorAll("a[href], button"))
      .find((item) => normalizedText(item).includes(text)) || null;
  }

  function findGuideTarget() {
    return linkByText(".wc-global-nav", "guias");
  }

  function findManualTarget() {
    return linkByText(".wc-global-nav", "manuais");
  }

  function findToolsTarget() {
    return linkByText(".wc-global-nav", "ferramentas");
  }

  function findQuickHelpTarget() {
    return document.querySelector(".md-header .md-search") ||
      document.querySelector(".wc-assistant__launcher") ||
      document.querySelector(".wc-header-actions");
  }

  const stepDefinitions = [
    {
      id: "welcome",
      title: "Bem-vindo à Central de Ajuda WCorp",
      text: "A Central reúne guias, manuais, erros, referências e ferramentas para ajudar no uso do WCorp.",
      target: null
    },
    {
      id: "guide",
      title: "Consulte os Guias",
      text: "Encontre instruções passo a passo para realizar os principais processos no WCorp.",
      target: findGuideTarget
    },
    {
      id: "manual",
      title: "Consulte os Manuais",
      text: "Use os manuais para entender telas, campos e recursos do sistema.",
      target: findManualTarget
    },
    {
      id: "tools",
      title: "Explore as Ferramentas",
      text: "Acesse utilitários para consultar relatórios, analisar arquivos e apoiar os processos do WCorp.",
      target: findToolsTarget
    },
    {
      id: "quick-help",
      title: "Busque e acesse ajuda rapidamente",
      text: "Use a busca e os recursos rápidos da Central para localizar informações e resolver problemas.",
      target: findQuickHelpTarget
    }
  ];

  function availableSteps() {
    return stepDefinitions
      .map((step) => ({
        ...step,
        element: typeof step.target === "function" ? step.target() : null
      }))
      .filter((step) => !step.target || step.element);
  }

  function createButton(label, action, variant = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `wc-tour__button${variant ? ` wc-tour__button--${variant}` : ""}`;
    button.textContent = label;
    button.dataset.action = action;
    return button;
  }

  function createTourShell() {
    const root = document.createElement("div");
    root.className = "wc-tour";
    root.setAttribute("role", "presentation");

    const overlay = document.createElement("div");
    overlay.className = "wc-tour__overlay";

    const spotlight = document.createElement("div");
    spotlight.className = "wc-tour__spotlight";
    spotlight.setAttribute("aria-hidden", "true");

    const card = document.createElement("section");
    card.className = "wc-tour__card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "wc-tour-title");
    card.setAttribute("aria-describedby", "wc-tour-text");
    card.tabIndex = -1;

    const progress = document.createElement("div");
    progress.className = "wc-tour__progress";
    progress.setAttribute("aria-hidden", "true");

    const eyebrow = document.createElement("span");
    eyebrow.className = "wc-tour__eyebrow";

    const title = document.createElement("h2");
    title.id = "wc-tour-title";
    title.className = "wc-tour__title";

    const text = document.createElement("p");
    text.id = "wc-tour-text";
    text.className = "wc-tour__text";

    const actions = document.createElement("div");
    actions.className = "wc-tour__actions";

    const connector = document.createElement("div");
    connector.className = "wc-tour__connector";
    connector.setAttribute("aria-hidden", "true");

    card.append(progress, eyebrow, title, text, actions);
    root.append(overlay, spotlight, connector, card);
    document.body.appendChild(root);

    return { root, overlay, spotlight, connector, card, progress, eyebrow, title, text, actions };
  }

  function focusableElements(container) {
    return Array.from(container.querySelectorAll([
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(","))).filter((element) => element.offsetParent !== null);
  }

  function clearTarget() {
    document.querySelectorAll(`.${targetClass}`).forEach((element) => {
      element.classList.remove(targetClass);
    });
  }

  function markTarget(element) {
    clearTarget();
    if (!element) return;

    element.classList.add(targetClass);
    element.scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "center",
      inline: "nearest"
    });
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function positionSpotlight(tour, step) {
    tour.root.classList.toggle("wc-tour--spotlight", Boolean(step.element));

    if (!step.element) {
      tour.spotlight.style.cssText = "";
      return;
    }

    const rect = step.element.getBoundingClientRect();
    const padding = 4;
    tour.spotlight.style.setProperty("--wc-tour-spotlight-left", `${Math.max(rect.left - padding, 6)}px`);
    tour.spotlight.style.setProperty("--wc-tour-spotlight-top", `${Math.max(rect.top - padding, 6)}px`);
    tour.spotlight.style.setProperty("--wc-tour-spotlight-width", `${Math.min(rect.width + padding * 2, window.innerWidth - 12)}px`);
    tour.spotlight.style.setProperty("--wc-tour-spotlight-height", `${Math.min(rect.height + padding * 2, window.innerHeight - 12)}px`);
  }

  function hideConnector(tour) {
    tour.connector.style.removeProperty("--wc-tour-connector-left");
    tour.connector.style.removeProperty("--wc-tour-connector-top");
    tour.connector.style.removeProperty("--wc-tour-connector-width");
    tour.connector.style.removeProperty("--wc-tour-connector-angle");
    tour.root.classList.remove("wc-tour--connector");
  }

  function isSidebarStep(step) {
    return step?.id === "guide" || step?.id === "manual" || step?.id === "tools";
  }

  function positionConnector(tour, step, placement) {
    if (isSidebarStep(step)) {
      hideConnector(tour);
      return;
    }

    if (!step.element || !placement || window.matchMedia("(max-width: 44em)").matches) {
      hideConnector(tour);
      return;
    }

    const targetRect = step.element.getBoundingClientRect();
    const cardRect = tour.card.getBoundingClientRect();
    let startX = targetRect.left + targetRect.width / 2;
    let startY = targetRect.top + targetRect.height / 2;
    let endX = cardRect.left + cardRect.width / 2;
    let endY = cardRect.top + cardRect.height / 2;
    const endpointOffset = isSidebarStep(step) ? 0 : 6;

    if (placement === "right") {
      startX = targetRect.right + endpointOffset;
      endX = cardRect.left - endpointOffset;
    } else if (placement === "left") {
      startX = targetRect.left - endpointOffset;
      endX = cardRect.right + endpointOffset;
    } else if (placement === "below") {
      startY = targetRect.bottom + endpointOffset;
      endY = cardRect.top - endpointOffset;
    } else if (placement === "above") {
      startY = targetRect.top - endpointOffset;
      endY = cardRect.bottom + endpointOffset;
    }

    const width = Math.hypot(endX - startX, endY - startY);
    if (width < 28) {
      hideConnector(tour);
      return;
    }

    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    tour.connector.style.setProperty("--wc-tour-connector-left", `${startX}px`);
    tour.connector.style.setProperty("--wc-tour-connector-top", `${startY}px`);
    tour.connector.style.setProperty("--wc-tour-connector-width", `${width}px`);
    tour.connector.style.setProperty("--wc-tour-connector-angle", `${angle}deg`);
    tour.root.classList.add("wc-tour--connector");
  }

  function scheduleConnector(tour, step, placement) {
    if (tour.connectorTimer) window.clearTimeout(tour.connectorTimer);
    tour.connectorTimer = null;
    hideConnector(tour);

    const updateConnector = () => {
      tour.connectorTimer = null;
      if (activeTour !== tour || tour.steps[tour.index] !== step) return;
      positionConnector(tour, step, placement);
    };

    if (reducedMotion()) {
      requestAnimationFrame(updateConnector);
      return;
    }

    tour.connectorTimer = window.setTimeout(updateConnector, 170);
  }

  function setPlacementClass(card, placement) {
    ["right", "left", "below", "above"].forEach((name) => {
      card.classList.toggle(`wc-tour__card--${name}`, placement === name);
    });
  }

  function positionCard(tour, step) {
    const { card } = tour;
    card.classList.toggle("wc-tour__card--center", !step.element);
    positionSpotlight(tour, step);

    if (!step.element) {
      setPlacementClass(card, null);
      card.style.removeProperty("--wc-tour-card-left");
      card.style.removeProperty("--wc-tour-card-top");
      hideConnector(tour);
      return;
    }

    if (window.matchMedia("(max-width: 44em)").matches) {
      setPlacementClass(card, null);
      card.style.removeProperty("--wc-tour-card-left");
      card.style.removeProperty("--wc-tour-card-top");
      hideConnector(tour);
      return;
    }

    const rect = step.element.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const gap = isSidebarStep(step) ? 32 : 14;
    const margin = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const centerTop = clamp(rect.top + rect.height / 2 - cardRect.height / 2, margin, viewportHeight - cardRect.height - margin);
    const centerLeft = clamp(rect.left + rect.width / 2 - cardRect.width / 2, margin, viewportWidth - cardRect.width - margin);
    const placements = [
      {
        name: "right",
        fits: rect.right + gap + cardRect.width + margin <= viewportWidth,
        left: rect.right + gap,
        top: centerTop
      },
      {
        name: "left",
        fits: rect.left - gap - cardRect.width - margin >= 0,
        left: rect.left - cardRect.width - gap,
        top: centerTop
      },
      {
        name: "below",
        fits: rect.bottom + gap + cardRect.height + margin <= viewportHeight,
        left: centerLeft,
        top: rect.bottom + gap
      },
      {
        name: "above",
        fits: rect.top - gap - cardRect.height - margin >= 0,
        left: centerLeft,
        top: rect.top - cardRect.height - gap
      }
    ];
    const placement = placements.find((item) => item.fits) || {
      name: "below",
      left: centerLeft,
      top: clamp(rect.bottom + gap, margin, viewportHeight - cardRect.height - margin)
    };
    const left = clamp(placement.left, margin, viewportWidth - cardRect.width - margin);
    const top = clamp(placement.top, margin, viewportHeight - cardRect.height - margin);

    card.style.setProperty("--wc-tour-card-left", `${left}px`);
    card.style.setProperty("--wc-tour-card-top", `${top}px`);
    setPlacementClass(card, placement.name);

    if (isSidebarStep(step)) {
      scheduleConnector(tour, step, placement.name);
    } else {
      requestAnimationFrame(() => positionConnector(tour, step, placement.name));
    }
  }

  function renderStep(tour) {
    const step = tour.steps[tour.index];
    const isFirst = tour.index === 0;
    const isLast = tour.index === tour.steps.length - 1;

    markTarget(step.element);

    tour.eyebrow.textContent = `Passo ${tour.index + 1} de ${tour.steps.length}`;
    tour.title.textContent = step.title;
    tour.text.textContent = step.text;
    tour.progress.replaceChildren();
    tour.steps.forEach((_step, index) => {
      const segment = document.createElement("span");
      segment.className = "wc-tour__progress-segment";
      segment.classList.toggle("wc-tour__progress-segment--active", index <= tour.index);
      tour.progress.appendChild(segment);
    });
    tour.actions.replaceChildren();

    if (isFirst) {
      tour.actions.appendChild(createButton("Pular tutorial", "skip", "secondary"));
    } else {
      tour.actions.appendChild(createButton("← Anterior", "previous", "secondary"));
    }

    tour.actions.appendChild(createButton(isLast ? "Explorar a Central →" : isFirst ? "Começar →" : "Próximo →", isLast ? "finish" : "next", "primary"));

    requestAnimationFrame(() => {
      positionCard(tour, step);
      tour.card.focus({ preventScroll: true });
    });
  }

  function finishTour(tour, completed = true) {
    if (!tour) return;
    if (completed) setCompletedTour();

    clearTarget();
    document.body.classList.remove("wc-tour-active");
    window.removeEventListener("resize", tour.handleResize);
    window.removeEventListener("scroll", tour.handleScroll, true);
    document.removeEventListener("keydown", tour.handleKeydown, true);
    if (tour.connectorTimer) window.clearTimeout(tour.connectorTimer);
    tour.root.remove();
    activeTour = null;

    if (tour.previousFocus?.isConnected && typeof tour.previousFocus.focus === "function") {
      tour.previousFocus.focus({ preventScroll: true });
    }
  }

  function handleAction(tour, action) {
    if (action === "skip" || action === "finish") {
      finishTour(tour);
      return;
    }

    if (action === "next" && tour.index < tour.steps.length - 1) {
      tour.index += 1;
      renderStep(tour);
      return;
    }

    if (action === "previous" && tour.index > 0) {
      tour.index -= 1;
      renderStep(tour);
    }
  }

  function startTour(force = false) {
    if (activeTour || (!force && hasCompletedTour())) return false;

    const steps = availableSteps();
    if (!steps.length) return false;

    const shell = createTourShell();
    const tour = {
      ...shell,
      steps,
      index: 0,
      previousFocus: document.activeElement,
      connectorTimer: null,
      handleResize: () => activeTour && positionCard(activeTour, activeTour.steps[activeTour.index]),
      handleScroll: () => activeTour && positionCard(activeTour, activeTour.steps[activeTour.index]),
      handleKeydown: null
    };

    tour.root.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action) handleAction(tour, action);
    });

    tour.handleKeydown = (event) => {
      if (!activeTour) return;

      if (event.key === "Escape") {
        event.preventDefault();
        finishTour(tour);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableElements(tour.card);
      if (!focusable.length) {
        event.preventDefault();
        tour.card.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("resize", tour.handleResize);
    window.addEventListener("scroll", tour.handleScroll, true);
    document.addEventListener("keydown", tour.handleKeydown, true);
    document.body.classList.add("wc-tour-active");
    activeTour = tour;
    renderStep(tour);

    return true;
  }

  function queueTourStart() {
    if (startQueued || hasCompletedTour()) return;
    startQueued = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startQueued = false;
        startTour(false);
      });
    });
  }

  window.resetWcorpHelpTour = function resetWcorpHelpTour() {
    clearCompletedTour();
    if (activeTour) finishTour(activeTour, false);
    startTour(true);
  };

  document.addEventListener("DOMContentLoaded", queueTourStart);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(queueTourStart);
  }
})();
