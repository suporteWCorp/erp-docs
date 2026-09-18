(function () {
  const manualAreas = {
    comercial: "Comercial",
    faturamento: "Documentos Fiscais",
    financeiro: "Financeiro",
    colaboradores: "Cadastros",
    fornecedores: "Cadastros",
    materiais: "Estoque",
    servicos: "Comercial",
    contratos: "Comercial",
    compras: "Compras",
    producao: "Produção",
    transportes: "Documentos Fiscais",
    relatorios: "Administração",
    administracao: "Administração"
  };

  const ignoredTagWords = new Set([
    "como", "para", "uma", "das", "dos", "com", "sem", "geral", "visao", "manual", "wcorp"
  ]);

  function rootUrl() {
    const logo = document.querySelector(".md-header__button.md-logo[href]");
    if (!logo) return new URL("/", window.location.href).href;
    return /\/index\.html$/.test(new URL(logo.href).pathname) ? new URL(".", logo.href).href : logo.href;
  }

  function relativePath() {
    const root = new URL(rootUrl()).pathname.replace(/\/+$/, "");
    const path = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
    return path.startsWith(root) ? path.slice(root.length) || "/" : path;
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function pageTitle() {
    const heading = document.querySelector(".md-content__inner > h1");
    if (!heading) return "";
    const copy = heading.cloneNode(true);
    copy.querySelectorAll(".headerlink").forEach((link) => link.remove());
    return copy.textContent.trim();
  }

  function tagsFrom(values) {
    const tags = [];
    values.filter(Boolean).forEach((value) => {
      tags.push(value.trim());
      normalize(value).split(/[^a-z0-9]+/).forEach((word) => {
        if (word.length >= 3 && !ignoredTagWords.has(word)) tags.push(word);
      });
    });
    return [...new Set(tags.filter(Boolean))];
  }

  function explicitContext() {
    const element = document.getElementById("wc-page-error-context");
    if (!element) return null;
    return {
      area: element.dataset.area || "",
      category: element.dataset.category || "",
      tags: tagsFrom((element.dataset.tags || "").split(","))
    };
  }

  function inferredManualContext() {
    const path = relativePath();
    const moduleSlug = path.split("/").filter(Boolean)[0];
    const area = manualAreas[moduleSlug];
    if (!area) return null;

    const title = pageTitle();
    const slug = path.split("/").filter(Boolean).pop() || "";
    return {
      area,
      category: title,
      tags: tagsFrom([title, slug.replace(/-/g, " ")])
    };
  }

  function pageContext() {
    const path = relativePath();
    const explicit = explicitContext();
    if (explicit) return explicit;
    if (path.startsWith("/como-fazer/")) return null;
    if (/^\/[^/]+\/[^/]+-geral$/.test(path)) return null;
    return inferredManualContext();
  }

  function buildErrorsUrl(context) {
    const url = new URL("erros-solucoes/", rootUrl());
    url.searchParams.set("area", context.area);
    if (context.category) url.searchParams.set("category", context.category);
    if (context.tags.length) url.searchParams.set("tags", context.tags.join(","));
    return url.href;
  }

  function initializeContextHelp() {
    const content = document.querySelector(".md-content__inner");
    if (!content) return;
    content.querySelector(".wc-context-help")?.remove();
  }

  document.addEventListener("DOMContentLoaded", initializeContextHelp);
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initializeContextHelp);
  }
})();
