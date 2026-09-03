import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const docsDir = path.join(repoRoot, "docs");
const inventoryPath = path.join(scriptDir, "inventory.json");
const reportPath = path.join(scriptDir, "INVENTARIO_CONTEUDO.md");

function normalizeSlash(value) {
  return String(value).replace(/\\/g, "/");
}

function stripQuotes(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {};

  const data = {};
  let activeKey = null;

  match[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith("#")) return;

    const list = line.match(/^\s*-\s*(.+?)\s*$/);
    if (list && activeKey) {
      if (!Array.isArray(data[activeKey])) data[activeKey] = [];
      data[activeKey].push(stripQuotes(list[1]));
      return;
    }

    const key = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!key) return;

    activeKey = key[1];
    data[activeKey] = key[2]?.trim() ? stripQuotes(key[2]) : [];
  });

  return data;
}

function firstHeading(markdown) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "";
}

function findMarkdownImages(markdown) {
  return [...markdown.matchAll(/!\[([^\]]*)]\(([^)]+)\)/g)]
    .map((match) => ({ alt: match[1].trim(), href: match[2].trim() }));
}

function findMarkdownVideoLinks(markdown) {
  return [...markdown.matchAll(/\[([^\]]+)]\(([^)]+)\)\{[^}]*\.wc-video-link[^}]*}/g)]
    .map((match) => ({ text: match[1].trim(), href: match[2].trim() }));
}

function findHtmlVideos(markdown) {
  return [...markdown.matchAll(/<source\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1].trim());
}

function findYoutubeLinks(markdown) {
  return [...markdown.matchAll(/\[[^\]]+]\((https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^)]+)\)/gi)]
    .map((match) => match[1].trim());
}

function findMarkdownLinks(markdown) {
  return [...markdown.matchAll(/(?<!!)(?:\[[^\]]+])\(([^)]+)\)/g)]
    .map((match) => match[1].trim());
}

function uniqueHtmlTags(markdown) {
  return [...new Set(
    [...markdown.matchAll(/<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi)]
      .map((match) => match[1].toLowerCase())
  )].sort();
}

function sectionText(markdown, headingText) {
  const lines = markdown.split(/\r?\n/);
  const normalizedHeading = headingText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const start = lines.findIndex((line) => {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (!match) return false;
    return match[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === normalizedHeading;
  });

  if (start < 0) return "";

  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    body.push(lines[index]);
  }

  return body.join("\n").trim();
}

function localAssetPath(markdownPath, href) {
  if (!href || /^(?:https?:)?\/\//i.test(href) || href.startsWith("#")) {
    return null;
  }

  const cleanHref = href.replace(/[?#].*$/, "").replace(/^<|>$/g, "");

  if (/^(?:\.\.\/)+assets\//.test(cleanHref)) {
    return normalizeSlash(path.join("docs", cleanHref.replace(/^(?:\.\.\/)+/, "")));
  }

  return normalizeSlash(path.relative(repoRoot, path.resolve(path.dirname(markdownPath), cleanHref)));
}

function estimateModuleFromPath(relativePath) {
  const first = relativePath.split("/")[1] || "";
  const map = {
    administracao: "Administração",
    colaboradores: "Colaboradores",
    comercial: "Comercial",
    compras: "Compras",
    contratos: "Contratos",
    faturamento: "Faturamento",
    financeiro: "Financeiro",
    fornecedores: "Fornecedores",
    materiais: "Materiais",
    producao: "Produção",
    relatorios: "Relatórios",
    servicos: "Serviços",
    transportes: "Transportes"
  };

  return map[first] || "";
}

function parseNavEntries(mkdocs, sectionName) {
  const lines = mkdocs.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `  - ${sectionName}:`);
  if (start < 0) return [];

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^  - [^\s].*:/.test(lines[index])) {
      end = index;
      break;
    }
  }

  const entries = [];
  let category = "";

  lines.slice(start + 1, end).forEach((line) => {
    const rootEntry = line.match(/^\s{6}-\s+([^:]+):\s+(.+\.md)\s*$/);
    if (rootEntry) {
      entries.push({
        navTitle: rootEntry[1].trim(),
        category: rootEntry[1].trim(),
        file: rootEntry[2].trim(),
        overview: true
      });
      return;
    }

    const categoryMatch = line.match(/^\s{6}-\s+([^:]+):\s*$/);
    if (categoryMatch) {
      category = categoryMatch[1].trim();
      return;
    }

    const child = line.match(/^\s{10}-\s+([^:]+):\s+(.+\.md)\s*$/);
    if (child) {
      entries.push({
        navTitle: child[1].trim(),
        category,
        file: child[2].trim(),
        overview: child[1].trim().toLowerCase() === "visão geral"
      });
    }
  });

  return entries;
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function classify(entry, data) {
  const reasons = [];
  let contentClass = "A";
  let difficulty = "baixa";
  const markdown = data.markdown;
  const frontMatter = data.frontMatter;
  const isV1 = Boolean(frontMatter.id && frontMatter.title && frontMatter.type && frontMatter.category);
  const hasManualPrereqHtml = /class=["'][^"']*\bwc-prereq-list\b/i.test(markdown);
  const hasHtmlVideo = /<video\b/i.test(markdown);
  const hasScreenBlock = /class=["'][^"']*\bwc-screen-block\b/i.test(markdown);
  const hasHomeGrid = /class=["'][^"']*\bwc-home-grid\b/i.test(markdown);
  const hasListingIntro = /wc-listing-intro/.test(markdown);
  const hasPlaceholder = /\b(em breve|em preparação|preparação para publicação|em desenvolvimento)\b/i.test(markdown);
  const hasVejaTambem = /^##\s+Veja também\s*$/mi.test(markdown);
  const oldAsset = data.localAssets.some((asset) => asset && /docs\/assets\/(?:images\/guias\/)?[^/]+\.(?:png|mp4|webm|ogg)$/i.test(asset) && !/docs\/assets\/(?:images|videos)\/(?:guias|manuais)\//i.test(asset));
  const specialTables = (markdown.match(/^\|.+\|$/gm) || []).length >= 6;
  const maybeMismatch = entry.kind === "Guia"
    ? !/^como\s+/i.test(data.title) && !/^cadastro de material$/i.test(data.title)
    : /^como\s+/i.test(data.title);

  if (entry.overview || hasHomeGrid || hasListingIntro) {
    contentClass = "C";
    difficulty = "alta";
    reasons.push("página de índice/visão geral com layout especial");
  }

  if (hasPlaceholder) {
    contentClass = "D";
    difficulty = "revisão humana";
    reasons.push("conteúdo em breve/em preparação, possível obsoleto ou incompleto");
  }

  if (!isV1) reasons.push("sem front matter V1 completo");
  if (hasManualPrereqHtml) {
    if (contentClass === "A") contentClass = "B";
    difficulty = "média";
    reasons.push("pré-requisitos usam HTML wc-prereq-list convertível para Markdown");
  }
  if (hasHtmlVideo) {
    if (contentClass !== "D") contentClass = "B";
    difficulty = "média";
    reasons.push("vídeo em HTML deve virar link Markdown .wc-video-link");
  }
  if (hasScreenBlock) {
    if (contentClass === "A" && !isV1) contentClass = "B";
    reasons.push("imagem em wc-screen-block, avaliar se mantém ou simplifica Markdown");
  }
  if (oldAsset) {
    if (contentClass === "A") contentClass = "B";
    difficulty = "média";
    reasons.push("assets fora da pasta previsível por conteúdo");
  }
  if (hasVejaTambem && !isV1) {
    if (contentClass === "A") contentClass = "B";
    reasons.push("Veja também manual deve virar IDs no front matter");
  }
  if (data.markdownVideos.length > 1 || data.htmlVideos.length > 1) {
    if (contentClass !== "D") contentClass = "C";
    difficulty = "alta";
    reasons.push("múltiplos vídeos exigem conferência de ordem/contexto");
  }
  if (data.youtubeLinks.length) {
    if (contentClass !== "D" && contentClass !== "C") contentClass = "C";
    difficulty = "média";
    reasons.push("link de YouTube exige decisão de padrão para vídeo externo");
  }
  if (specialTables && entry.kind === "Manual") {
    if (contentClass === "A") contentClass = "B";
    reasons.push("manual com tabelas extensas, migração precisa preservar estrutura");
  }
  if (maybeMismatch) {
    if (contentClass !== "D") contentClass = "C";
    if (difficulty === "baixa") difficulty = "média";
    reasons.push("tipo editorial precisa revisão pela definição Guia/Manual");
  }
  if (isV1 && contentClass !== "D") {
    contentClass = "A";
    difficulty = "já compatível";
    reasons.unshift("front matter V1 completo e migração trivial");
  }
  if (!reasons.length) {
    reasons.push("estrutura simples, migração de metadata/relacionados parece trivial");
  }

  return { class: contentClass, difficulty, reasons };
}

function markdownList(values) {
  return values.length ? values.map((value) => `  - ${value}`).join("\n") : "  - Nenhum identificado";
}

function assetSummary(item) {
  return {
    images: item.images.map((image) => image.local_asset || image.href),
    videos: [
      ...item.videos.markdown.map((video) => video.local_asset || video.href),
      ...item.videos.html_sources.map((video) => video.local_asset || video.href),
      ...item.videos.youtube
    ]
  };
}

function buildMarkdown(inventory) {
  const lines = [];
  lines.push("# Inventário de Adoção do Padrão de Conteúdo V1");
  lines.push("");
  lines.push("Inventário diagnóstico. Nenhum Guia ou Manual foi migrado nesta etapa.");
  lines.push("");
  lines.push("## Critérios de Classificação");
  lines.push("");
  lines.push("- A — já compatível ou migração trivial.");
  lines.push("- B — precisa reorganizar assets/metadata.");
  lines.push("- C — possui estrutura especial que exige revisão humana.");
  lines.push("- D — possível conteúdo duplicado/obsoleto/suspeito.");
  lines.push("");
  lines.push("## Resumo");
  lines.push("");
  lines.push(`- Total de Guias: ${inventory.counts.total_guides}`);
  lines.push(`- Total de Manuais: ${inventory.counts.total_manuals}`);
  lines.push(`- Páginas Visão geral/índice fora dos totais principais: ${inventory.counts.overview_pages}`);
  lines.push(`- Classe A: ${inventory.counts.by_class.A}`);
  lines.push(`- Classe B: ${inventory.counts.by_class.B}`);
  lines.push(`- Classe C: ${inventory.counts.by_class.C}`);
  lines.push(`- Classe D: ${inventory.counts.by_class.D}`);
  lines.push("");
  lines.push("## Principais Exceções");
  lines.push("");
  lines.push("- Muitos Guias legados usam `<div class=\"wc-prereq-list\">`, `<br>` e vídeos HTML; isso é convertível, mas exige reorganização controlada.");
  lines.push("- Alguns Manuais são páginas de visão geral ou páginas em preparação; elas não devem ser migradas automaticamente como conteúdo final.");
  lines.push("- O piloto `comercial-clientes.md` já possui front matter V1 e relação por ID, mas ainda usa `wc-screen-block` para o print; manter ou simplificar deve ser uma decisão editorial/visual posterior.");
  lines.push("- Há vídeos externos do YouTube em Manual; a convenção V1 cobre bem arquivos `.mp4`, mas vídeo externo precisa decisão de padrão antes de migração em massa.");
  lines.push("");

  ["Guia", "Manual"].forEach((kind) => {
    lines.push(`## ${kind}s`);
    lines.push("");
    inventory.items.filter((item) => item.type === kind && item.included_in_totals).forEach((item) => {
      const assets = assetSummary(item);
      lines.push(`### ${item.title}`);
      lines.push("");
      lines.push(`- Caminho: \`${item.path}\``);
      lines.push(`- Tipo: ${item.type}`);
      lines.push(`- Módulo/categoria: ${item.category}`);
      lines.push(`- Classificação: ${item.class} (${item.migration_difficulty})`);
      lines.push(`- Front matter V1: ${item.front_matter.present && item.front_matter.id && item.front_matter.type && item.front_matter.category ? "sim" : "não"}`);
      lines.push(`- Imagens: ${assets.images.length ? assets.images.map((value) => `\`${value}\``).join(", ") : "nenhuma"}`);
      lines.push(`- Vídeos: ${assets.videos.length ? assets.videos.map((value) => `\`${value}\``).join(", ") : "nenhum"}`);
      lines.push(`- HTML manual: ${item.html_manual.length ? item.html_manual.map((value) => `\`${value}\``).join(", ") : "nenhum"}`);
      lines.push(`- Pré-requisitos: ${item.prerequisites.length ? "sim" : "não"}${item.has_manual_prerequisites_html ? " (HTML wc-prereq-list)" : ""}`);
      lines.push(`- Relacionados: ${item.related.markdown_section_present ? "seção Markdown" : "não"}${item.related.front_matter_manual.length || item.related.front_matter_guides.length ? " + front matter por ID" : ""}`);
      lines.push(`- Estrutura especial: ${item.structure_special.length ? item.structure_special.join("; ") : "nenhuma relevante"}`);
      lines.push("- Motivos:");
      lines.push(markdownList(item.reasons));
      lines.push("");
    });
  });

  lines.push("## Páginas Visão Geral / Índice");
  lines.push("");
  inventory.items.filter((item) => !item.included_in_totals).forEach((item) => {
    lines.push(`- \`${item.path}\` — ${item.title} — ${item.type} — Classe ${item.class}: ${item.reasons.join("; ")}`);
  });
  lines.push("");
  lines.push("## Assets Compartilhados por Vários Conteúdos");
  lines.push("");
  if (inventory.assets.referenced_by_multiple_contents.length) {
    inventory.assets.referenced_by_multiple_contents.forEach((asset) => {
      lines.push(`- \`${asset.asset}\`: ${asset.referenced_by.join(", ")}`);
    });
  } else {
    lines.push("- Nenhum asset local foi referenciado por mais de um conteúdo inventariado.");
  }
  lines.push("");
  lines.push("## Candidatos a Assets Órfãos");
  lines.push("");
  if (inventory.assets.orphan_candidates.length) {
    inventory.assets.orphan_candidates.forEach((item) => {
      lines.push(`- \`${item.asset}\` — ${item.note}`);
    });
  } else {
    lines.push("- Nenhum candidato encontrado.");
  }
  lines.push("");
  lines.push("## HTML que Pode Virar Markdown");
  lines.push("");
  if (inventory.review_lists.html_convertible_to_markdown.length) {
    inventory.review_lists.html_convertible_to_markdown.forEach((item) => {
      lines.push(`- \`${item.path}\` — ${item.title}: ${item.html.map((tag) => `<${tag}>`).join(", ")}`);
    });
  } else {
    lines.push("- Nenhum caso encontrado.");
  }
  lines.push("");
  lines.push("## Conteúdos que Exigem Decisão Humana");
  lines.push("");
  if (inventory.review_lists.human_decision_required.length) {
    inventory.review_lists.human_decision_required.forEach((item) => {
      lines.push(`- \`${item.path}\` — ${item.title} — Classe ${item.class}: ${item.reasons.join("; ")}`);
    });
  } else {
    lines.push("- Nenhum caso crítico encontrado.");
  }
  lines.push("");
  lines.push("## Estimativa Geral de Migração");
  lines.push("");
  lines.push("- Guias: migração majoritariamente média, por causa de pré-requisitos em HTML, vídeos HTML e links relacionados manuais.");
  lines.push("- Manuais: migração dividida entre páginas simples/triviais e páginas com placeholder/visão geral que precisam decisão editorial.");
  lines.push("- Estratégia recomendada: migrar primeiro Classe A, depois B por módulo, e deixar C/D para revisão humana antes de qualquer alteração.");
  lines.push("");

  return lines.join("\n");
}

async function run() {
  const mkdocs = await fs.readFile(path.join(repoRoot, "mkdocs.yml"), "utf8");
  const entries = [
    ...parseNavEntries(mkdocs, "Guia").map((entry) => ({ ...entry, kind: "Guia" })),
    ...parseNavEntries(mkdocs, "Manual").map((entry) => ({ ...entry, kind: "Manual" }))
  ];
  const referencedAssets = new Map();
  const items = [];

  for (const entry of entries) {
    const markdownPath = path.join(docsDir, entry.file);
    const markdown = await fs.readFile(markdownPath, "utf8");
    const frontMatter = parseFrontMatter(markdown);
    const images = findMarkdownImages(markdown);
    const markdownVideos = findMarkdownVideoLinks(markdown);
    const htmlVideos = findHtmlVideos(markdown);
    const youtubeLinks = findYoutubeLinks(markdown);
    const htmlTags = uniqueHtmlTags(markdown);
    const prerequisites = sectionText(markdown, "Pré-requisitos");
    const related = sectionText(markdown, "Veja também");
    const localAssets = [...images.map((image) => image.href), ...markdownVideos.map((video) => video.href), ...htmlVideos]
      .map((href) => localAssetPath(markdownPath, href))
      .filter(Boolean);
    const title = frontMatter.title || firstHeading(markdown) || entry.navTitle;
    const data = { markdown, frontMatter, images, markdownVideos, htmlVideos, youtubeLinks, htmlTags, prerequisites, related, localAssets, title };
    const classification = classify(entry, data);

    localAssets.forEach((asset) => {
      if (!referencedAssets.has(asset)) referencedAssets.set(asset, []);
      referencedAssets.get(asset).push(`docs/${entry.file}`);
    });

    items.push({
      path: `docs/${entry.file}`,
      title,
      nav_title: entry.navTitle,
      type: entry.kind,
      category: entry.overview ? "Visão geral" : (entry.category || frontMatter.category || estimateModuleFromPath(`docs/${entry.file}`)),
      included_in_totals: !entry.overview,
      class: classification.class,
      migration_difficulty: classification.difficulty,
      reasons: classification.reasons,
      front_matter: {
        present: Object.keys(frontMatter).length > 0,
        keys: Object.keys(frontMatter),
        id: frontMatter.id || "",
        type: frontMatter.type || "",
        category: frontMatter.category || ""
      },
      images: images.map((image) => ({ ...image, local_asset: localAssetPath(markdownPath, image.href) })),
      videos: {
        markdown: markdownVideos.map((video) => ({ ...video, local_asset: localAssetPath(markdownPath, video.href) })),
        html_sources: htmlVideos.map((href) => ({ href, local_asset: localAssetPath(markdownPath, href) })),
        youtube: youtubeLinks
      },
      html_manual: htmlTags,
      has_manual_prerequisites_html: /class=["'][^"']*\bwc-prereq-list\b/i.test(markdown),
      prerequisites: prerequisites ? prerequisites.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [],
      related: {
        front_matter_manual: Array.isArray(frontMatter.related_manual) ? frontMatter.related_manual : [],
        front_matter_guides: Array.isArray(frontMatter.related_guides) ? frontMatter.related_guides : [],
        markdown_section_present: Boolean(related),
        markdown_links: related ? findMarkdownLinks(related) : []
      },
      structure_special: classification.reasons.filter((reason) => /especial|vídeo|YouTube|tabelas|tipo editorial|preparação|wc-screen-block/i.test(reason))
    });
  }

  const primary = items.filter((item) => item.included_in_totals);
  const counts = {
    total_guides: primary.filter((item) => item.type === "Guia").length,
    total_manuals: primary.filter((item) => item.type === "Manual").length,
    by_class: {
      A: primary.filter((item) => item.class === "A").length,
      B: primary.filter((item) => item.class === "B").length,
      C: primary.filter((item) => item.class === "C").length,
      D: primary.filter((item) => item.class === "D").length
    },
    overview_pages: items.filter((item) => !item.included_in_totals).length
  };
  const assetFiles = (await listFiles(path.join(docsDir, "assets")))
    .filter((file) => /\.(png|jpe?g|gif|webp|svg|mp4|webm|ogg)$/i.test(file))
    .map((file) => normalizeSlash(path.relative(repoRoot, file)));
  const referencedSet = new Set([...referencedAssets.keys()]);
  const sharedAssets = [...referencedAssets.entries()]
    .filter(([, refs]) => refs.length > 1)
    .map(([asset, refs]) => ({ asset, referenced_by: refs }));
  const orphanCandidates = assetFiles
    .filter((asset) => !referencedSet.has(asset))
    .filter((asset) => !/docs\/assets\/(?:wcorp-|avatar_)/i.test(asset))
    .map((asset) => ({
      asset,
      note: "Não referenciado diretamente por Guia/Manual inventariado; confirmar uso por CSS/JS antes de remover."
    }));
  const editorialReview = primary.filter((item) => item.reasons.some((reason) => /tipo editorial|em breve|preparação|obsoleto|incompleto/i.test(reason)));
  const htmlConvertible = primary
    .filter((item) => item.has_manual_prerequisites_html || item.videos.html_sources.length || item.html_manual.includes("br"))
    .map((item) => ({ path: item.path, title: item.title, html: item.html_manual, notes: item.reasons }));
  const inventory = {
    generated_at: new Date().toISOString(),
    scope: "Inventário diagnóstico dos conteúdos de Guia e Manual publicados no mkdocs.yml. Não migra conteúdo.",
    counting_rule: "Totais principais excluem páginas Visão geral/index. Elas aparecem em items com included_in_totals=false.",
    counts,
    items,
    assets: {
      referenced_by_multiple_contents: sharedAssets,
      orphan_candidates: orphanCandidates
    },
    review_lists: {
      human_decision_required: editorialReview.map((item) => ({ path: item.path, title: item.title, class: item.class, reasons: item.reasons })),
      html_convertible_to_markdown: htmlConvertible
    }
  };

  await fs.mkdir(scriptDir, { recursive: true });
  await fs.writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  await fs.writeFile(reportPath, buildMarkdown(inventory), "utf8");

  return inventory;
}

const inventory = await run();
console.log(JSON.stringify(inventory.counts, null, 2));
