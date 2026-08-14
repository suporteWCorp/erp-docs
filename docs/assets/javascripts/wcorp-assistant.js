(function () {
  const storageKey = "wcorpAssistantSession";
  const avatarStorageKey = "wcorpAssistantAvatar";

  const assistantAvatars = [
    "assets/avatar_homem_oculos.png",
    "assets/avatar_mulher.png",
    "assets/avatar_mulher_afro.png",
    "assets/avatar_homem_azul.png"
  ];

  const suggestions = [
    { label: "Como emitir uma NF-e?", href: "como-fazer/faturar-nota/" },
    { label: "Como cadastrar um cliente?", href: "como-fazer/cadastrar-cliente/" },
    { label: "Como gerar um pedido?", href: "como-fazer/fazer-pedido-venda/" },
    { label: "Como cancelar uma nota?", href: "como-fazer/cancelar-nfe/" }
  ];

  let assistantSearchPromise = null;

  function rootUrl() {
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

    return message;
  }

  function createHtmlMessage(html) {
    const message = document.createElement("div");

    message.className = "wc-assistant__message";
    message.innerHTML = html;

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
      return JSON.parse(
        sessionStorage.getItem(storageKey) || "null"
      );
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
   * BUSCA LOCAL DA DOCUMENTAÇÃO
   * ============================
   */

  function getSearchIndexUrl() {
    return new URL(
      "search/search_index.json",
      rootUrl()
    ).href;
  }

  async function loadSearchIndex() {
    if (assistantSearchPromise) {
      return assistantSearchPromise;
    }

    assistantSearchPromise = fetch(getSearchIndexUrl())
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Falha ao carregar índice de busca: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        return Array.isArray(data?.docs)
          ? data.docs
          : [];
      })
      .catch((error) => {
        console.error(
          "Assistente WCorp: não foi possível carregar o índice de busca.",
          error
        );

        return [];
      });

    return assistantSearchPromise;
  }

  function normalizeAssistantSearch(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function getAssistantCategory(doc) {
    const location = normalizeAssistantSearch(doc.location);
    const title = normalizeAssistantSearch(doc.title);

    if (
      location.includes("/rejeic") ||
      location.includes("erros-e-solucoes") ||
      title.includes("rejeicao")
    ) {
      return "Rejeição";
    }

    if (
      location.includes("/como-fazer/") ||
      location.includes("/guias/")
    ) {
      return "Guia";
    }

    if (
      location.includes("/manual/") ||
      location.includes("/manuais/")
    ) {
      return "Manual";
    }

    return "Conteúdo";
  }

  function scoreAssistantResult(doc, term) {
    const query = normalizeAssistantSearch(term);

    const title = normalizeAssistantSearch(doc.title);
    const text = normalizeAssistantSearch(doc.text);
    const location = normalizeAssistantSearch(doc.location);

    let score = 0;

    if (!query) {
      return score;
    }

    if (title === query) {
      score += 100;
    }

    if (title.includes(query)) {
      score += 60;
    }

    if (location.includes(query)) {
      score += 40;
    }

    if (text.includes(query)) {
      score += 20;
    }

    const words = query
      .split(/\s+/)
      .filter(Boolean);

    words.forEach((word) => {
      if (title.includes(word)) {
        score += 12;
      }

      if (text.includes(word)) {
        score += 4;
      }
    });

    return score;
  }

  function getAssistantResults(docs, query) {
    return docs
      .map((doc) => ({
        doc,
        score: scoreAssistantResult(doc, query)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.doc);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createAssistantAnswer(query, results) {
    if (!results.length) {
      return {
        html: `
          <strong>Não encontrei uma orientação específica.</strong>
          <br>
          Tente informar o código, nome da tela ou mensagem completa.
          <br><br>
          Caso seja uma falha do sistema, você pode abrir um chamado no Suporte.
        `
      };
    }

    const top = results[0];

    const category = getAssistantCategory(top);

    const title =
      top.title ||
      "Conteúdo encontrado";

    let href = rootUrl();

    if (top.location) {
      try {
        href = new URL(top.location, rootUrl()).href;
      } catch (_error) {
        href = rootUrl();
      }
    }

    let intro = "";

    switch (category) {
      case "Rejeição":
        intro = "Encontrei uma orientação relacionada a essa rejeição.";
        break;

      case "Guia":
        intro = "Encontrei um guia que pode ajudar com essa operação.";
        break;

      case "Manual":
        intro = "Encontrei o manual relacionado a essa tela.";
        break;

      default:
        intro = "Encontrei um conteúdo que pode ajudar.";
        break;
    }

    return {
      html: `
        <strong>${escapeHtml(intro)}</strong>
        <br>
        ${escapeHtml(title)}
        <br><br>
        <a
          class="wc-assistant__result-link"
          href="${escapeHtml(href)}"
        >
          Abrir conteúdo completo →
        </a>
      `
    };
  }

  /*
   * ============================
   * INICIALIZAÇÃO
   * ============================
   */

  function initializeAssistant() {
    if (document.querySelector(".wc-assistant")) {
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

    let closeTimer = 0;
    let restoredScrollTop = null;

    /*
     * ============================
     * ESTADO / CONVERSA
     * ============================
     */

    const serializeConversation = () =>
      Array.from(messages.children).map((element) => {
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

          html: element.innerHTML
        };
      });

    const saveState = (
      open = assistant.classList.contains(
        "wc-assistant--open"
      )
    ) => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
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

        const message =
          document.createElement("div");

        message.className =
          `wc-assistant__message${
            item.type === "user"
              ? " wc-assistant__message--user"
              : ""
          }`;

        message.innerHTML =
          item.html || "";

        messages.appendChild(
          message
        );
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
        panel.hidden = false;

        assistant.classList.remove(
          "wc-assistant--closing"
        );

        assistant.classList.add(
          "wc-assistant--open"
        );

        updateControls(true);

        saveState(true);

        window.setTimeout(() => {
          input?.focus();

          messages.scrollTop =
            Number.isFinite(
              restoredScrollTop
            )
              ? restoredScrollTop
              : messages.scrollHeight;

          restoredScrollTop =
            messages.scrollTop;

          saveState(true);
        }, 80);

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

        messages.scrollTop =
          messages.scrollHeight;

        saveState(true);

        const loadingMessage =
          createMessage(
            "Vou procurar na Central de Ajuda..."
          );

        messages.appendChild(
          loadingMessage
        );

        messages.scrollTop =
          messages.scrollHeight;

        const docs =
          await loadSearchIndex();

        const results =
          getAssistantResults(
            docs,
            value
          );

        loadingMessage.remove();

        const answer =
          createAssistantAnswer(
            value,
            results
          );

        messages.appendChild(
          createHtmlMessage(
            answer.html
          )
        );

        messages.scrollTop =
          messages.scrollHeight;

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

    /*
     * ============================
     * RESTAURAÇÃO
     * ============================
     */

    const state =
      loadState();

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
      () => {
        messages.scrollTop =
          Number.isFinite(
            restoredScrollTop
          )
            ? restoredScrollTop
            : messages.scrollHeight;
      },
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