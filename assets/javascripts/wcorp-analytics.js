(function () {
  // Preencher após deploy do Worker: window.WCORP_ANALYTICS_ENDPOINT = "https://.../analytics".
  const endpoint = window.WCORP_ANALYTICS_ENDPOINT || "https://wcorp-analytics.waveconcept.workers.dev/analytics";
  const allowedEvents = new Set(["CARD_CLICK", "SEARCH", "ASSISTANT_CONTENT_CLICK", "GUIDE_OPEN"]);
  let catalogPromise = null;
  let popularityPromise = null;
  let lastGuideOpenKey = "";

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname)
      ? new URL(".", logo.href).href
      : logo.href;
  }

  function cleanPath(value) {
    const raw = String(value || "");
    if (raw && !/^[a-z][a-z\d+.-]*:/i.test(raw) && !raw.startsWith("/")) {
      return raw.replace(/^\/+/, "").replace(/\/index\.html$/, "").replace(/\/+$/, "");
    }

    try {
      const root = new URL(rootUrl());
      const url = new URL(raw || window.location.href, window.location.href);
      const base = root.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
      const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
      return path.replace(/^\/+/, "").replace(/\/index\.html$/, "").replace(/\/+$/, "");
    } catch (_error) {
      return "";
    }
  }

  function cleanText(value, maxLength) {
    return String(value || "").replace(/[<>{}\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function loadCatalog() {
    if (catalogPromise) return catalogPromise;
    catalogPromise = fetch(new URL("assets/data/content-catalog.json", rootUrl()).href)
      .then((response) => response.ok ? response.json() : { items: [] })
      .catch(() => ({ items: [] }));
    return catalogPromise;
  }

  async function contentFromLink(link) {
    const path = cleanPath(link?.href);
    if (!path) return null;

    const catalog = await loadCatalog();
    const item = (catalog.items || []).find((entry) => cleanPath(entry.url) === path);
    return item?.id && item?.type
      ? { content_id: item.id, type: item.type, path }
      : null;
  }

  function popularUrl() {
    try {
      const url = new URL(endpoint);
      url.pathname = url.pathname.replace(/\/analytics\/?$/, "/popular");
      url.search = "?type=guia";
      return url.href;
    } catch (_error) {
      return "";
    }
  }

  function catalogItemFromCurrentPage(catalog) {
    const path = cleanPath(window.location.href);
    return (catalog.items || []).find((entry) => cleanPath(entry.url) === path) || null;
  }

  function payloadFor(event, data = {}) {
    if (!allowedEvents.has(event)) return null;

    const payload = { event };
    if (data.content_id) payload.content_id = cleanText(data.content_id, 96);
    if (data.type) payload.type = cleanText(data.type, 40);
    if (data.source) payload.source = cleanText(data.source, 40);
    if (data.path) payload.path = cleanPath(data.path);
    if (Number.isInteger(data.position)) payload.position = data.position;
    if (Number.isInteger(data.result_count)) payload.result_count = data.result_count;
    if (typeof data.has_results === "boolean") payload.has_results = data.has_results;
    return payload;
  }

  function track(event, data) {
    const payload = endpoint && payloadFor(event, data);
    if (!payload) return;

    try {
      fetch(endpoint, {
        method: "POST",
        mode: "cors",
        keepalive: true,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_error) {
      // Analytics nunca pode quebrar a Central.
    }
  }

  function trackGuideOpen() {
    if (!endpoint) return;

    loadCatalog().then((catalog) => {
      const item = catalogItemFromCurrentPage(catalog);
      if (!item || item.type !== "guia" || item.status !== "published") {
        lastGuideOpenKey = "";
        return;
      }

      const path = cleanPath(item.url);
      const key = `${item.id}|${path}`;
      if (key === lastGuideOpenKey) return;

      lastGuideOpenKey = key;
      track("GUIDE_OPEN", {
        content_id: item.id,
        type: "guia",
        source: "page",
        path
      });
    });
  }

  function getGuidePopularity() {
    if (popularityPromise) return popularityPromise;

    const url = popularUrl();
    popularityPromise = url
      ? fetch(url, { method: "GET", mode: "cors" })
        .then((response) => response.ok ? response.json() : { ok: false, items: [] })
        .catch(() => ({ ok: false, items: [] }))
      : Promise.resolve({ ok: false, items: [] });

    return popularityPromise;
  }

  document.addEventListener("click", (event) => {
    if (!endpoint) return;

    const assistantLink = event.target.closest(".wc-assistant__result-link[href]");
    const cardLink = assistantLink || event.target.closest(".wc-card a[href]");
    if (!cardLink) return;

    contentFromLink(cardLink).then((content) => {
      if (!content) return;

      if (assistantLink) {
        const card = assistantLink.closest(".wc-assistant__result");
        const cards = Array.from(card?.parentElement?.children || []);
        track("ASSISTANT_CONTENT_CLICK", {
          content_id: content.content_id,
          type: content.type,
          position: Math.max(0, cards.indexOf(card)) + 1
        });
        return;
      }

      track("CARD_CLICK", { ...content, source: "card" });
    });
  }, true);

  window.WCorpAnalytics = {
    track,
    getGuidePopularity,
    trackSearch(data = {}) {
      track("SEARCH", {
        result_count: data.result_count,
        has_results: data.has_results
      });
    }
  };

  document.addEventListener("DOMContentLoaded", trackGuideOpen);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(trackGuideOpen);
  }
})();
