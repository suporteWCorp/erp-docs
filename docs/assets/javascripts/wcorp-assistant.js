(function () {
  const storageKey = "wcorpAssistantSession";
  const avatarStorageKey = "wcorpAssistantAvatar";
  const assistantDebugVersion =
    "rag-v15-hermes-two-stage";

  const assistantRectSnapshot = (element) => {
    if (!element) {
      return null;
    }

    const rect =
      element.getBoundingClientRect();

    return {
      x: Number(rect.x.toFixed(2)),
      y: Number(rect.y.toFixed(2)),
      top: Number(rect.top.toFixed(2)),
      right: Number(rect.right.toFixed(2)),
      bottom: Number(rect.bottom.toFixed(2)),
      left: Number(rect.left.toFixed(2)),
      width: Number(rect.width.toFixed(2)),
      height: Number(rect.height.toFixed(2))
    };
  };

  const assistantStyleSnapshot = (element) => {
    if (!element) {
      return null;
    }

    const style =
      window.getComputedStyle(element);

    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      position: style.position,
      top: style.top,
      right: style.right,
      bottom: style.bottom,
      left: style.left,
      transform: style.transform
    };
  };

  const assistantElementLabel = (element) => {
    if (!element) {
      return null;
    }

    const parts = [
      element.tagName.toLowerCase()
    ];

    if (element.id) {
      parts.push(`#${element.id}`);
    }

    if (element.className) {
      parts.push(
        `.${String(element.className)
          .trim()
          .replace(/\s+/g, ".")}`
      );
    }

    return parts.join("");
  };

  const assistantDomAudit = () => {
    const assistants =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant"
        )
      );
    const panels =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant__panel"
        )
      );
    const launchers =
      Array.from(
        document.querySelectorAll(
          ".wc-assistant__launcher"
        )
      );
    const panelIds =
      Array.from(
        document.querySelectorAll(
          "#wc-assistant-panel"
        )
      );

    const instances =
      assistants.map((assistant, index) => {
        const panel =
          assistant.querySelector(
            ".wc-assistant__panel"
          );
        const launcher =
          assistant.querySelector(
            ".wc-assistant__launcher"
          );
        const button =
          assistant.querySelector(
            ".wc-assistant__button"
          );
        const bubble =
          assistant.querySelector(
            ".wc-assistant__bubble"
          );

        return {
          index,
          assistantConnected:
            assistant.isConnected,
          assistantClasses:
            assistant.className,
          assistantRect:
            assistantRectSnapshot(assistant),
          panelConnected:
            Boolean(panel?.isConnected),
          panelHidden:
            panel?.hidden ?? null,
          panelAriaHidden:
            panel?.getAttribute("aria-hidden"),
          panelRect:
            assistantRectSnapshot(panel),
          panelStyle:
            assistantStyleSnapshot(panel),
          launcherConnected:
            Boolean(launcher?.isConnected),
          launcherRect:
            assistantRectSnapshot(launcher),
          launcherStyle:
            assistantStyleSnapshot(launcher),
          buttonRect:
            assistantRectSnapshot(button),
          buttonAriaExpanded:
            button?.getAttribute(
              "aria-expanded"
            ),
          bubbleRect:
            assistantRectSnapshot(bubble),
          bubbleAriaExpanded:
            bubble?.getAttribute(
              "aria-expanded"
            )
        };
      });

    const orphanPanels =
      panels.map((panel, index) => ({
        index,
        isConnected:
          panel.isConnected,
        hidden:
          panel.hidden,
        ariaHidden:
          panel.getAttribute("aria-hidden"),
        rect:
          assistantRectSnapshot(panel),
        style:
          assistantStyleSnapshot(panel),
        parent:
          assistantElementLabel(
            panel.parentElement
          ),
        closestAssistantClass:
          panel.closest(".wc-assistant")
            ?.className || null
      }));

    const audit = {
      label: "Assistant DOM Audit",
      version: assistantDebugVersion,
      url: window.location.href,
      readyState:
        document.readyState,
      navigationInstant:
        Boolean(window.document$),
      counts: {
        assistants:
          assistants.length,
        panels:
          panels.length,
        launchers:
          launchers.length,
        panelIds:
          panelIds.length
      },
      instances,
      panels:
        orphanPanels
    };

    console.info(
      "[Assistant DOM Audit]",
      audit
    );

    return audit;
  };

  window.__WC_ASSISTANT_DEBUG__ = {
    version: assistantDebugVersion,
    source:
      "docs/assets/javascripts/wcorp-assistant.js",
    positioning:
      "fixed-bottom-anchor-current",
    initializeCalls: 0,
    skippedExistingInstances: 0,
    audit:
      assistantDomAudit
  };

  window.__WC_ASSISTANT_DOM_AUDIT__ =
    assistantDomAudit;

  if (!window.__WC_ASSISTANT_DEBUG_LOGGED__) {
    window.__WC_ASSISTANT_DEBUG_LOGGED__ = true;
    console.info(
      `[WCorp Assistant] ${assistantDebugVersion} loaded`
    );
  }

  const assistantAvatars = [
    "assets/avatar_homem_oculos.png",
    "assets/avatar_mulher.png",
    "assets/avatar_mulher_afro.png",
    "assets/avatar_homem_azul.png"
  ];

  const suggestions = [
    { label: "Como consultar notas rejeitadas?", href: "como-fazer/consultar-nfe-rejeitada/" },
    { label: "Como cadastrar um cliente?", href: "como-fazer/cadastrar-cliente/" },
    { label: "Como consultar estoque?", href: "como-fazer/consultar-estoque/" },
    { label: "Como verificar CBenef?", href: "como-fazer/verificar-cbenef/" }
  ];

  const assistantScriptUrl = document.currentScript?.src;
  const assistantBaseUrl = assistantScriptUrl
    ? new URL('../../', assistantScriptUrl).href
    : null;
  let assistantPipeline = null;
  function getAssistantPipeline() {
    if (!assistantPipeline) assistantPipeline = window.WCorpAssistantRag.create({baseUrl: rootUrl()});
    return assistantPipeline;
  }

  function rootUrl() {
    if (assistantBaseUrl) return assistantBaseUrl;
    const logo = document.querySelector(".md-header__button.md-logo[href]");

    if (!logo) {
      return new URL("/", window.location.href).href;
    }

    return /\/index\.html$/.test(new URL(logo.href).pathname)
      ? new URL(".", logo.href).href
      : logo.href;
  }

  function getAssistantAvatar() {
    try {
      const saved = sessionStorage.getItem(avatarStorageKey);

      if (assistantAvatars.includes(saved)) {
        return saved;
      }

      const selected =
        assistantAvatars[Math.floor(Math.random() * assistantAvatars.length)];

      sessionStorage.setItem(avatarStorageKey, selected);

      return selected;
    } catch (_error) {
      return assistantAvatars[0];
    }
  }

  function assistantIcon() {
    const icon = document.createElement("img");

    icon.className = "wc-assistant__agent-icon";
    icon.src = new URL(getAssistantAvatar(), rootUrl()).href;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");

    return icon;
  }

  function createMessage(text, fromUser = false) {
    const message = document.createElement("div");

    message.className =
      `wc-assistant__message${fromUser ? " wc-assistant__message--user" : ""}`;

    message.textContent = text;
    message.dataset.text = text;

    return message;
  }

  function appendAssistantMarkdownInline(parent, value) {
    const pattern = /(`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^)\n]+)\))/g;
    let position = 0;
    let match;

    while ((match = pattern.exec(value)) !== null) {
      parent.appendChild(
        document.createTextNode(
          value.slice(position, match.index)
        )
      );

      if (match[2]) {
        const code = document.createElement("code");

        code.textContent = match[2];
        parent.appendChild(code);
      } else if (match[3]) {
        const strong = document.createElement("strong");

        strong.textContent = match[3];
        parent.appendChild(strong);
      } else if (match[4]) {
        const emphasis = document.createElement("em");

        emphasis.textContent = match[4];
        parent.appendChild(emphasis);
      } else {
        // Model-authored links are rendered as labels, never navigation.
        parent.appendChild(document.createTextNode(match[5]));
      }

      position = pattern.lastIndex;
    }

    parent.appendChild(
      document.createTextNode(value.slice(position))
    );
  }

  function createMarkdownMessage(markdown, sources = []) {
    const message = document.createElement("div");
    const cleanedMarkdown = String(markdown || "")
      .replace(/\s*\{:\s*[^}\n]*(?:target\s*=\s*["']_blank["']|rel\s*=\s*["']noopener["'])[^}\n]*\}/gi, "")
      .trim();
    const lines = cleanedMarkdown.replace(/\r\n?/g, "\n").split("\n");
    let paragraphLines = [];
    let listStack = [];

    message.className = "wc-assistant__message";

    const flushParagraph = () => {
      if (!paragraphLines.length) {
        return;
      }

      const paragraph = document.createElement("p");

      appendAssistantMarkdownInline(
        paragraph,
        paragraphLines.join(" ")
      );
      message.appendChild(paragraph);
      paragraphLines = [];
    };

    const resetLists = () => {
      listStack = [];
    };

    const appendListItem = (line, orderedItem, unorderedItem) => {
      const indent = line.match(/^\s*/)[0].length;
      const listTag = orderedItem ? "ol" : "ul";

      flushParagraph();

      while (
        listStack.length &&
        indent < listStack[listStack.length - 1].indent
      ) {
        listStack.pop();
      }

      if (
        listStack.length &&
        indent === listStack[listStack.length - 1].indent &&
        listStack[listStack.length - 1].type !== listTag
      ) {
        listStack.pop();
      }

      let current = listStack[listStack.length - 1];

      if (!current || indent > current.indent) {
        const list = document.createElement(listTag);
        const parent = current?.item || message;

        if (orderedItem) list.setAttribute("start", line.trim().match(/^\d+/)[0]);
        parent.appendChild(list);
        current = {
          indent,
          item: null,
          list,
          type: listTag
        };
        listStack.push(current);
      }

      const listItem = document.createElement("li");

      appendAssistantMarkdownInline(
        listItem,
        (orderedItem || unorderedItem)[1]
      );
      current.list.appendChild(listItem);
      current.item = listItem;
    };

    lines.forEach((line) => {
      const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/);
      const unorderedItem = line.match(/^\s*[-*+]\s+(.+)$/);
      const item = orderedItem || unorderedItem;

      if (item) {
        appendListItem(line, orderedItem, unorderedItem);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        return;
      }

      resetLists();

      paragraphLines.push(line.trim());
    });

    flushParagraph();
    message.dataset.text = String(markdown || "");
    message.dataset.sourceIds = JSON.stringify(sources.map((source) => source.sourceId));
    return message;
  }

  function appendOfficialSources(message, sources) {
    const recommendedSources = sources.filter((source) => source.type === "guia" || source.type === "manual");
    if (!recommendedSources.length) return;
    const recommendation = document.createElement("div");
    recommendation.className = "wc-assistant__message wc-assistant__message--source";
    for (const source of recommendedSources) {
      const result = document.createElement("div");
      result.className = "wc-assistant__result";
      const type = document.createElement("span");
      type.className = "wc-assistant__result-type";
      const link = document.createElement("a");
      const label = source.type === "guia" ? "Guia recomendado" : "Manual recomendado";
      type.textContent = label;
      link.className = "wc-assistant__result-title";
      link.textContent = source.title;
      link.href = source.url;
      result.append(type, link);
      recommendation.appendChild(result);
    }
    message.after(recommendation);
  }

  const followUps = [
    "Ficou alguma dúvida?",
    "Posso ajudar com mais alguma coisa?",
    "Precisa de mais alguma informação?",
    "Tem mais alguma dúvida sobre isso?"
  ];
  function appendFollowUp(message) {
    const followUp = document.createElement("div");
    followUp.className = "wc-assistant__message wc-assistant__message--followup";
    followUp.textContent = followUps[Math.floor(Math.random() * followUps.length)];
    message.after(followUp);
  }

  function appendAssistantResponse(messages, result) {
    const message = createMarkdownMessage(result.message, result.sources || []);
    if (result.kind) message.dataset.kind = result.kind;
    messages.appendChild(message);
    if (result.kind === "answer") appendFollowUp(message);
    appendOfficialSources(message, result.sources || []);
    return message;
  }

  function createHtmlMessage(html) {
    const message = document.createElement("div");

    message.className = "wc-assistant__message";
    message.innerHTML = html;

    return message;
  }

  function createTypingMessage() {
    const message = document.createElement("div");

    message.className =
      "wc-assistant__message wc-assistant__typing";

    message.setAttribute(
      "aria-label",
      "Assistente digitando"
    );

    message.innerHTML = [
      '<span class="wc-assistant__typing-dot"></span>',
      '<span class="wc-assistant__typing-dot"></span>',
      '<span class="wc-assistant__typing-dot"></span>'
    ].join("");

    return message;
  }

  function createSuggestions() {
    const wrapper = document.createElement("div");

    wrapper.className = "wc-assistant__suggestions";

    suggestions.forEach((item) => {
      const link = document.createElement("a");

      link.className = "wc-assistant__suggestion";
      link.href = new URL(item.href, rootUrl()).href;
      link.textContent = item.label;

      wrapper.appendChild(link);
    });

    return wrapper;
  }

  function loadState() {
    try {
      const state = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      return state?.version === 2 ? state : null;
    } catch (_error) {
      return null;
    }
  }

  function isReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  /*
   * ============================
   * INICIALIZAÇÃO
   * ============================
   */

  function initializeAssistant() {
    window.__WC_ASSISTANT_DEBUG__.initializeCalls +=
      1;

    if (document.querySelector(".wc-assistant")) {
      window.__WC_ASSISTANT_DEBUG__.skippedExistingInstances +=
        1;
      return;
    }

    const assistant = document.createElement("aside");

    assistant.className = "wc-assistant";
    assistant.setAttribute(
      "aria-label",
      "Assistente WCorp"
    );

    const panel = document.createElement("section");

    panel.className = "wc-assistant__panel";
    panel.id = "wc-assistant-panel";
    panel.hidden = true;

    panel.setAttribute(
      "aria-labelledby",
      "wc-assistant-title"
    );

    const header = document.createElement("header");

    header.className = "wc-assistant__header";

    header.innerHTML = [
      '<span class="wc-assistant__avatar"></span>',
      '<span class="wc-assistant__title">',
      '<strong id="wc-assistant-title">Assistente WCorp</strong>',
      '</span>'
    ].join("");

    header
      .querySelector(".wc-assistant__avatar")
      ?.appendChild(assistantIcon());

    const close = document.createElement("button");

    close.type = "button";
    close.className = "wc-assistant__close";

    close.setAttribute(
      "aria-label",
      "Fechar Assistente WCorp"
    );

    close.textContent = "×";

    header.appendChild(close);

    const messages = document.createElement("div");

    messages.className = "wc-assistant__messages";

    messages.setAttribute(
      "aria-live",
      "polite"
    );

    const form = document.createElement("form");

    form.className = "wc-assistant__form";

    form.innerHTML = [
      '<input class="wc-assistant__input" type="text" autocomplete="off" placeholder="Digite sua dúvida" aria-label="Digite sua dúvida">',
      '<button class="wc-assistant__send" type="submit">Enviar</button>'
    ].join("");

    panel.append(
      header,
      messages,
      form
    );

    const launcher = document.createElement("div");

    launcher.className = "wc-assistant__launcher";

    const bubble = document.createElement("button");

    bubble.type = "button";
    bubble.className = "wc-assistant__bubble";
    bubble.textContent = "Pergunte ao assistente WCorp!";

    bubble.setAttribute(
      "aria-controls",
      panel.id
    );

    bubble.setAttribute(
      "aria-expanded",
      "false"
    );

    const button = document.createElement("button");

    button.type = "button";
    button.className = "wc-assistant__button";

    button.setAttribute(
      "aria-label",
      "Abrir Assistente WCorp"
    );

    button.setAttribute(
      "aria-controls",
      panel.id
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.appendChild(
      assistantIcon()
    );

    launcher.append(
      bubble,
      button
    );

    assistant.append(
      panel,
      launcher
    );

    document.body.appendChild(
      assistant
    );

    const input = form.querySelector(
      ".wc-assistant__input"
    );
    const sendButton = form.querySelector(
      ".wc-assistant__send"
    );

    let closeTimer = 0;
    let restoredScrollTop = null;
    let assistantIsResponding = false;
    const state = loadState();
    const conversation = window.WCorpAssistantRag.createConversation(getAssistantPipeline(), state?.history);
    const assistantViewportMargin = 12;
    let lastLauncherAnchor = null;

    const clampAssistantPanelPosition = (value, min, max) =>
      Math.min(
        Math.max(value, min),
        Math.max(min, max)
      );

    const readPixelValue = (
      value,
      fallback
    ) => {
      const number =
        Number.parseFloat(value);

      return Number.isFinite(number)
        ? number
        : fallback;
    };

    const readAssistantFixedAnchor = () => {
      const style =
        window.getComputedStyle(assistant);
      const right =
        readPixelValue(
          style.right,
          assistantViewportMargin
        );
      const bottom =
        readPixelValue(
          style.bottom,
          assistantViewportMargin
        );

      return {
        right:
          window.innerWidth - right,
        bottom:
          window.innerHeight - bottom
      };
    };

    const readLauncherAnchor = () => {
      if (
        assistant.classList.contains(
          "wc-assistant--open"
        ) ||
        assistant.classList.contains(
          "wc-assistant--closing"
        )
      ) {
        lastLauncherAnchor =
          readAssistantFixedAnchor();

        return lastLauncherAnchor;
      }

      const launcherRect =
        launcher.getBoundingClientRect();

      if (
        launcherRect.width &&
        launcherRect.height
      ) {
        lastLauncherAnchor = {
          right:
            launcherRect.right,
          bottom:
            launcherRect.bottom
        };
      }

      return lastLauncherAnchor ||
        readAssistantFixedAnchor();
    };

    const positionAssistantPanel = (
      anchor = readLauncherAnchor()
    ) => {
      if (panel.hidden) {
        return;
      }

      const panelWidth =
        panel.offsetWidth;
      const panelHeight =
        panel.offsetHeight;

      if (
        !anchor ||
        !panelWidth ||
        !panelHeight
      ) {
        return;
      }

      const maxLeft =
        window.innerWidth -
        panelWidth -
        assistantViewportMargin;
      const desiredLeft =
        anchor.right -
        panelWidth;

      const desiredBottom =
        window.innerHeight -
        anchor.bottom;

      const maxBottom =
        window.innerHeight -
        assistantViewportMargin -
        panelHeight;

      const left =
        clampAssistantPanelPosition(
          desiredLeft,
          assistantViewportMargin,
          maxLeft
        );

      const bottom =
        clampAssistantPanelPosition(
          desiredBottom,
          assistantViewportMargin,
          maxBottom
        );

      panel.style.setProperty(
        "--wc-assistant-panel-left",
        `${Math.round(left)}px`
      );
      panel.style.setProperty(
        "--wc-assistant-panel-bottom",
        `${Math.round(bottom)}px`
      );
    };

    const scheduleAssistantPanelPosition = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          positionAssistantPanel();
        });
      });
    };

    /*
     * ============================
     * ESTADO / CONVERSA
     * ============================
     */

    const serializeConversation = () =>
      Array.from(messages.children).map((element) => {
        if (
          element.matches(".wc-assistant__message--source, .wc-assistant__message--followup") ||
          element.classList.contains(
            "wc-assistant__typing"
          ) ||
          element.classList.contains(
            "wc-assistant__message--temporary"
          )
        ) {
          return null;
        }

        if (
          element.classList.contains(
            "wc-assistant__suggestions"
          )
        ) {
          return {
            type: "suggestions"
          };
        }

        return {
          type: element.classList.contains(
            "wc-assistant__message--user"
          )
            ? "user"
            : "assistant",

          text: element.dataset.text || element.textContent,
          kind: element.dataset.kind,
          sourceIds: JSON.parse(element.dataset.sourceIds || "[]")
        };
      }).filter(Boolean);

    const saveState = (
      open = assistant.classList.contains(
        "wc-assistant--open"
      )
    ) => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            version: 2,
            history: conversation.history(),
            open,
            inputValue: input?.value || "",
            messagesScrollTop:
              messages.scrollTop,
            conversation:
              serializeConversation()
          })
        );
      } catch (_error) {
        // sessionStorage indisponível.
      }
    };

    const appendInitialConversation = () => {
      messages.appendChild(
        createHtmlMessage(
          "<strong>Olá! Sou o Assistente WCorp.</strong><br><strong>Qual é a sua dúvida hoje?</strong>"
        )
      );

      messages.appendChild(
        createSuggestions()
      );
    };

    const scrollConversationToBottom = () => {
      messages.scrollTop =
        messages.scrollHeight;
    };

    const scheduleConversationScrollToBottom = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollConversationToBottom);
      });

      window.setTimeout(scrollConversationToBottom, 180);
    };

    const setAssistantBusy = (busy) => {
      assistantIsResponding = busy;

      if (sendButton) {
        sendButton.disabled = busy;
      }
    };

    const restoreConversation = (state) => {
      const conversation =
        Array.isArray(state?.conversation)
          ? state.conversation
          : [];

      if (!conversation.length) {
        appendInitialConversation();
        return;
      }

      conversation.forEach((item) => {
        if (item.type === "suggestions") {
          messages.appendChild(
            createSuggestions()
          );

          return;
        }

        if (item.type === "user") {
          messages.appendChild(createMessage(String(item.text || ""), true));
          return;
        }
        const ids = Array.isArray(item.sourceIds) ? item.sourceIds : [];
        // Saved assistant text is also untrusted; never rewrite the user's text.
        try { getAssistantPipeline().validateMessage(String(item.text || ""), ids); }
        catch (_) {
          messages.appendChild(createMessage(window.WCorpAssistantRag.TECHNICAL_ERROR));
          return;
        }
        const message = appendAssistantResponse(messages, {message: String(item.text || ""), kind: item.kind});
        if (ids.length) {
          getAssistantPipeline().initialize().then(() => {
            const sources = getAssistantPipeline().references(ids);
            if (!item.kind) {
              message.dataset.kind = "answer";
              appendFollowUp(message);
            }
            appendOfficialSources(message, sources);
            message.dataset.sourceIds = JSON.stringify(sources.map((source) => source.sourceId));
            saveState();
          }).catch((error) => console.error("Não foi possível restaurar as referências públicas:", error));
        }
      });
    };

    const updateControls = (open) => {
      bubble.setAttribute(
        "aria-expanded",
        String(open)
      );

      button.setAttribute(
        "aria-expanded",
        String(open)
      );

      button.setAttribute(
        "aria-label",
        open
          ? "Fechar Assistente WCorp"
          : "Abrir Assistente WCorp"
      );
    };

    const finishClose = () => {
      window.clearTimeout(closeTimer);

      panel.hidden = true;

      assistant.classList.remove(
        "wc-assistant--closing"
      );

      updateControls(false);

      saveState(false);
    };

    const setOpen = (
      open,
      options = {}
    ) => {
      window.clearTimeout(
        closeTimer
      );

      if (open) {
        assistant.classList.remove(
          "wc-assistant--closing"
        );

        const launcherAnchor =
          readLauncherAnchor();

        panel.hidden = false;

        positionAssistantPanel(
          launcherAnchor
        );

        assistant.classList.add(
          "wc-assistant--open"
        );

        updateControls(true);

        saveState(true);

        window.setTimeout(() => {
          input?.focus();

          scrollConversationToBottom();

          restoredScrollTop =
            messages.scrollTop;

          saveState(true);
        }, 80);

        scheduleConversationScrollToBottom();
        scheduleAssistantPanelPosition();

        return;
      }

      if (panel.hidden) {
        assistant.classList.remove(
          "wc-assistant--open",
          "wc-assistant--closing"
        );

        updateControls(false);

        saveState(false);

        return;
      }

      assistant.classList.remove(
        "wc-assistant--open"
      );

      updateControls(false);

      if (
        options.immediate ||
        isReducedMotion()
      ) {
        finishClose();
        return;
      }

      assistant.classList.add(
        "wc-assistant--closing"
      );

      closeTimer = window.setTimeout(
        finishClose,
        190
      );
    };

    const toggle = () =>
      setOpen(panel.hidden);

    bubble.addEventListener(
      "click",
      toggle
    );

    button.addEventListener(
      "click",
      toggle
    );

    close.addEventListener(
      "click",
      () => setOpen(false)
    );

    if (
      window.wcorpAssistantEscapeHandler
    ) {
      document.removeEventListener(
        "keydown",
        window.wcorpAssistantEscapeHandler
      );
    }

    window.wcorpAssistantEscapeHandler =
      (event) => {
        if (
          event.key === "Escape" &&
          !panel.hidden
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "keydown",
      window.wcorpAssistantEscapeHandler
    );

    /*
     * ============================
     * ENVIO DA PERGUNTA
     * ============================
     */

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        if (assistantIsResponding) {
          return;
        }

        const value =
          input.value.trim();

        if (!value) {
          return;
        }

        messages.appendChild(
          createMessage(
            value,
            true
          )
        );

        input.value = "";

        scrollConversationToBottom();

        saveState(true);

        const typingMessage =
          createTypingMessage();
        setAssistantBusy(true);

        messages.appendChild(typingMessage);

        scrollConversationToBottom();

        try {
          const finalAnswer = await conversation.send(value, {
            onAck(ack) {
              typingMessage.remove();
              const acknowledgement = createMessage(ack);
              acknowledgement.dataset.kind = "ack";
              messages.append(acknowledgement, typingMessage);
              scrollConversationToBottom();
            }
          });

          typingMessage.remove();

          appendAssistantResponse(messages, finalAnswer);
        } catch (error) {
          console.error(
            "Erro ao consultar Hermes:",
            error
          );

          typingMessage.remove();

          messages.appendChild(
            createMessage(
              window.WCorpAssistantRag.TECHNICAL_ERROR
            )
          );
        } finally {
          typingMessage.remove();
          setAssistantBusy(false);
        }

        scrollConversationToBottom();

        saveState(true);
      }
    );

    input?.addEventListener(
      "input",
      () =>
        saveState(!panel.hidden)
    );

    messages.addEventListener(
      "scroll",
      () =>
        saveState(!panel.hidden),
      {
        passive: true
      }
    );

    panel.addEventListener(
      "animationend",
      (event) => {
        if (
          event.animationName ===
          "wc-assistant-close"
        ) {
          finishClose();
        }
      }
    );

    window.addEventListener(
      "resize",
      scheduleAssistantPanelPosition,
      {
        passive: true
      }
    );

    window.addEventListener(
      "orientationchange",
      scheduleAssistantPanelPosition,
      {
        passive: true
      }
    );

    if (
      window.document$ &&
      typeof window.document$.subscribe ===
        "function"
    ) {
      window.document$.subscribe(
        scheduleAssistantPanelPosition
      );
    }

    /*
     * ============================
     * RESTAURAÇÃO
     * ============================
     */

    restoreConversation(
      state
    );

    if (
      input &&
      state?.inputValue
    ) {
      input.value =
        state.inputValue;
    }

    restoredScrollTop =
      Number.isFinite(
        state?.messagesScrollTop
      )
        ? state.messagesScrollTop
        : null;

    window.setTimeout(
      scheduleConversationScrollToBottom,
      0
    );

    if (state?.open) {
      setOpen(true, {
        immediate: true
      });
    } else {
      panel.hidden = true;

      assistant.classList.remove(
        "wc-assistant--open",
        "wc-assistant--closing"
      );

      updateControls(false);
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeAssistant
  );

  if (
    window.document$ &&
    typeof window.document$.subscribe ===
      "function"
  ) {
    window.document$.subscribe(
      initializeAssistant
    );
  }
})();
