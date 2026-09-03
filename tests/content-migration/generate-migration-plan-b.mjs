import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MIGRATION_DIR = path.join(ROOT, "tests", "content-migration");
const INVENTORY_PATH = path.join(MIGRATION_DIR, "inventory.json");
const JSON_OUT = path.join(MIGRATION_DIR, "migration-plan-b.json");
const MD_OUT = path.join(MIGRATION_DIR, "PLANO_MIGRACAO_B.md");

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8"));
const allItems = inventory.items || [];
const classBItems = allItems.filter((item) => item.class === "B" && item.included_in_totals);

function toPosix(value) {
  return value.replace(/\\/g, "/");
}

function repoPath(...parts) {
  return toPosix(path.relative(ROOT, path.join(ROOT, ...parts)));
}

function stripFrontMatter(markdown) {
  if (!markdown.startsWith("---")) return markdown;
  const end = markdown.indexOf("\n---", 3);
  return end === -1 ? markdown : markdown.slice(end + 4);
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableIdFor(item) {
  if (item.front_matter?.id) return item.front_matter.id;
  return slugify(path.basename(item.path, ".md"));
}

function typeFolder(type) {
  return type === "Guia" ? "guias" : "manuais";
}

function assetTarget(item, id, assetPath, kind) {
  const base = path.basename(assetPath);
  const assetRoot = kind === "image" ? "images" : "videos";
  return `docs/assets/${assetRoot}/${typeFolder(item.type)}/${id}/${base}`;
}

function readMarkdown(item) {
  return fs.readFileSync(path.join(ROOT, item.path), "utf8");
}

function deriveDescription(markdown) {
  const body = stripFrontMatter(markdown)
    .replace(/\r\n/g, "\n")
    .split("\n");

  let inHtml = false;
  let buffer = [];
  let passedH1 = false;

  for (const rawLine of body) {
    const line = rawLine.trim();
    if (!line) {
      if (buffer.length) break;
      continue;
    }
    if (line.startsWith("# ")) {
      passedH1 = true;
      continue;
    }
    if (line.startsWith("##")) {
      if (!buffer.length) return null;
      break;
    }
    if (!passedH1 && line.startsWith("#")) continue;
    if (line.startsWith("--8<--")) continue;
    if (/^`[^`]+`\.?$/.test(line)) continue;
    if (/navegador.*v[ií]deo/i.test(line)) continue;
    if (line.startsWith("!!!") || line.startsWith("???")) continue;
    if (line.startsWith("|") || line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) continue;
    if (line.startsWith("![") || line.includes("<video") || line.includes("<source")) continue;
    if (line.startsWith("<div") || line.startsWith("</div")) {
      inHtml = !line.startsWith("</div");
      continue;
    }
    if (inHtml) continue;
    if (line.startsWith("<")) continue;

    buffer.push(line.replace(/\s+/g, " "));
  }

  const description = buffer.join(" ").replace(/\s+/g, " ").trim();
  if (!description) return null;
  if (description.length > 260) return `${description.slice(0, 257).trim()}...`;
  return description;
}

function extractRelatedLinks(markdown) {
  const body = stripFrontMatter(markdown).replace(/\r\n/g, "\n");
  const match = body.match(/^##\s+Veja tamb[eé]m\s*\n([\s\S]*?)(?=^##\s+|$)/im);
  if (!match) return [];
  const section = match[1];
  const links = [];
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkPattern.exec(section))) {
    links.push(linkMatch[1].split(/\s+/)[0]);
  }
  return links;
}

function resolveMarkdownLink(fromItem, href) {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (!cleanHref || /^[a-z]+:/i.test(cleanHref)) return null;
  if (!cleanHref.endsWith(".md")) return null;

  const fromDir = path.dirname(path.join(ROOT, fromItem.path));
  const absolute = path.normalize(path.resolve(fromDir, cleanHref));
  if (!absolute.startsWith(ROOT)) return null;
  return toPosix(path.relative(ROOT, absolute));
}

const itemByPath = new Map(
  allItems.map((item) => [
    toPosix(item.path),
    {
      ...item,
      recommended_id: stableIdFor(item),
    },
  ]),
);

function relatedPlan(item, markdown) {
  const ids = {
    related_manual: [],
    related_guides: [],
    deferred_or_blocked: [],
    unresolved_or_non_content: [],
  };

  const frontMatterManual = item.related?.front_matter_manual || [];
  const frontMatterGuides = item.related?.front_matter_guides || [];
  for (const id of frontMatterManual) ids.related_manual.push(id);
  for (const id of frontMatterGuides) ids.related_guides.push(id);

  const markdownLinks = [
    ...(item.related?.markdown_links || []),
    ...extractRelatedLinks(markdown),
  ];

  for (const href of [...new Set(markdownLinks)]) {
    const resolvedPath = resolveMarkdownLink(item, href);
    const target = resolvedPath ? itemByPath.get(resolvedPath) : null;
    if (!target) {
      ids.unresolved_or_non_content.push({ href, resolved_path: resolvedPath });
      continue;
    }
    if (target.class === "C" || target.class === "D") {
      ids.deferred_or_blocked.push({
        href,
        path: target.path,
        id: target.recommended_id,
        class: target.class,
        title: target.title,
      });
      continue;
    }
    if (target.type === "Manual") ids.related_manual.push(target.recommended_id);
    if (target.type === "Guia") ids.related_guides.push(target.recommended_id);
  }

  ids.related_manual = [...new Set(ids.related_manual)];
  ids.related_guides = [...new Set(ids.related_guides)];
  return ids;
}

function conversionPlan(item, markdown) {
  const conversions = [];
  const html = new Set(item.html_manual || []);

  if (item.has_manual_prerequisites_html) {
    conversions.push({
      type: "wc-prereq-list",
      action: "converter wrapper HTML para lista Markdown preservando os itens atuais",
    });
  }
  if ((item.videos?.html_sources || []).length) {
    conversions.push({
      type: "video",
      action: "converter tag <video>/<source> para link Markdown com .wc-video-link",
      count: item.videos.html_sources.length,
    });
  }
  if (html.has("br")) {
    conversions.push({
      type: "br",
      action: "remover <br> e manter quebras naturais em Markdown",
    });
  }
  if (/wc-screen-block/.test(markdown)) {
    conversions.push({
      type: "wc-screen-block",
      action: "preservar imagem e converter/remover wrapper se o componente V1 ja renderizar o bloco automaticamente",
    });
  }
  const remaining = [...html].filter((tag) => !["br", "div", "source", "video"].includes(tag));
  for (const tag of remaining) {
    conversions.push({
      type: tag,
      action: "revisar HTML manual antes da migracao",
    });
  }
  return conversions;
}

function assetMoves(item, id) {
  const moves = [];
  for (const image of item.images || []) {
    if (!image.local_asset) continue;
    const to = assetTarget(item, id, image.local_asset, "image");
    moves.push({
      kind: "image",
      from: image.local_asset,
      to,
      already_in_v1_location: toPosix(image.local_asset) === to,
    });
  }
  for (const video of item.videos?.html_sources || []) {
    if (!video.local_asset) continue;
    const to = assetTarget(item, id, video.local_asset, "video");
    moves.push({
      kind: "video",
      from: video.local_asset,
      to,
      markdown_after_migration: `[Assistir video](${toPosix(path.relative(path.dirname(item.path), to))}){ .wc-video-link }`,
      already_in_v1_location: toPosix(video.local_asset) === to,
    });
  }
  for (const video of item.videos?.markdown || []) {
    if (!video.local_asset) continue;
    const to = assetTarget(item, id, video.local_asset, "video");
    moves.push({
      kind: "video",
      from: video.local_asset,
      to,
      already_in_v1_location: toPosix(video.local_asset) === to,
    });
  }
  return moves;
}

function migrationRisks(item, related, conversions, assets, description) {
  const risks = [];
  if (!description) risks.push("description deve ficar vazia ou ser revisada; nao ha paragrafo introdutorio claro");
  if (related.deferred_or_blocked.length) risks.push("ha relacionados apontando para Classe C/D; nao migrar esses links automaticamente nesta etapa");
  if (related.unresolved_or_non_content.length) risks.push("ha links de Veja tambem para paginas fora do escopo Guia/Manual ou nao resolvidas");
  if (assets.some((asset) => !asset.already_in_v1_location)) risks.push("assets precisam ser movidos para pasta previsivel por conteudo");
  if (conversions.some((conversion) => conversion.type === "video")) risks.push("video HTML exige conferencia visual apos build real");
  if ((item.front_matter?.keys || []).some((key) => key.startsWith("error_"))) risks.push("front matter legado de erro deve ser removido se nao tiver uso no padrao V1");
  if (item.reasons?.some((reason) => /tabelas extensas/.test(reason))) risks.push("manual com tabelas deve preservar estrutura sem reformatacao editorial");
  return risks;
}

function buildItemPlan(item) {
  const id = stableIdFor(item);
  const markdown = readMarkdown(item);
  const description = deriveDescription(markdown);
  const related = relatedPlan(item, markdown);
  const conversions = conversionPlan(item, markdown);
  const assets = assetMoves(item, id);
  const metadata = {
    id,
    title: item.title,
    type: item.type.toLowerCase(),
    category: item.category,
    description,
    difficulty: item.migration_difficulty || null,
    screen_path: item.type === "Manual" ? `${item.category} > ${item.title}` : null,
    related_manual: related.related_manual,
    related_guides: related.related_guides,
  };

  return {
    path: item.path,
    title: item.title,
    nav_title: item.nav_title,
    type: item.type,
    category: item.category,
    class: item.class,
    recommended_metadata: metadata,
    current_assets: assets.map((asset) => asset.from),
    asset_moves: assets,
    html_to_convert: conversions,
    related_resolution: related,
    prerequisites: item.prerequisites || [],
    risks_or_human_review: migrationRisks(item, related, conversions, assets, description),
  };
}

const plans = classBItems.map(buildItemPlan);

const waveDefinitions = [
  {
    id: "onda-1-guias-administracao",
    title: "ONDA 1 - Guias de Administracao",
    risk: "medio",
    match: (item) => item.type === "Guia" && item.category === "Administração",
  },
  {
    id: "onda-2-guias-comercial-estoque",
    title: "ONDA 2 - Guias Comercial e Estoque",
    risk: "medio",
    match: (item) => item.type === "Guia" && ["Comercial", "Estoque"].includes(item.category),
  },
  {
    id: "onda-3-guias-faturamento",
    title: "ONDA 3 - Guias de Faturamento",
    risk: "medio",
    match: (item) => item.type === "Guia" && item.category === "Faturamento",
  },
  {
    id: "onda-4-guias-compras-financeiro",
    title: "ONDA 4 - Guias Compras e Financeiro",
    risk: "medio",
    match: (item) => item.type === "Guia" && ["Compras", "Financeiro"].includes(item.category),
  },
  {
    id: "onda-5-manuais-comercial-faturamento",
    title: "ONDA 5 - Manuais Comercial e Faturamento",
    risk: "medio",
    match: (item) => item.type === "Manual" && ["Comercial", "Faturamento"].includes(item.category),
  },
  {
    id: "onda-6-manuais-materiais-relatorios-administracao",
    title: "ONDA 6 - Manuais Materiais, Relatorios e Administracao",
    risk: "medio",
    match: (item) => item.type === "Manual" && ["Materiais", "Relatórios", "Administração"].includes(item.category),
  },
];

const waves = waveDefinitions.map((wave) => ({
  id: wave.id,
  title: wave.title,
  risk: wave.risk,
  count: plans.filter(wave.match).length,
  files: plans.filter(wave.match).map((item) => item.path),
  transformations: summarizeTransformations(plans.filter(wave.match)),
}));

function summarizeTransformations(items) {
  const counts = {
    front_matter_v1: items.length,
    asset_moves: 0,
    wc_prereq_list: 0,
    html_video: 0,
    br: 0,
    wc_screen_block: 0,
    related_to_ids: 0,
  };
  for (const item of items) {
    counts.asset_moves += item.asset_moves.filter((asset) => !asset.already_in_v1_location).length;
    counts.related_to_ids += item.related_resolution.related_manual.length + item.related_resolution.related_guides.length;
    for (const conversion of item.html_to_convert) {
      if (conversion.type === "wc-prereq-list") counts.wc_prereq_list += 1;
      if (conversion.type === "video") counts.html_video += conversion.count || 1;
      if (conversion.type === "br") counts.br += 1;
      if (conversion.type === "wc-screen-block") counts.wc_screen_block += 1;
    }
  }
  return counts;
}

const summary = {
  generated_at: new Date().toISOString(),
  scope: "Plano de migracao estrutural dos conteudos Classe B para o Padrao de Conteudo V1. Nao altera docs/.",
  totals: {
    class_b_contents: plans.length,
    guides: plans.filter((item) => item.type === "Guia").length,
    manuals: plans.filter((item) => item.type === "Manual").length,
    assets_to_move: plans.flatMap((item) => item.asset_moves).filter((asset) => !asset.already_in_v1_location).length,
    html_conversions: plans.flatMap((item) => item.html_to_convert).length,
    unresolved_related_links: plans.flatMap((item) => item.related_resolution.unresolved_or_non_content).length,
    deferred_related_links: plans.flatMap((item) => item.related_resolution.deferred_or_blocked).length,
  },
  transformations: summarizeTransformations(plans),
};

const output = {
  ...summary,
  waves,
  items: plans,
  rollback_strategy: [
    "Executar migracao inicialmente em staging gerado fora de docs/ e revisar diff.",
    "Aplicar por onda/modulo em commits pequenos.",
    "Antes de cada onda, registrar git status e manter commit anterior como ponto de retorno.",
    "Se o build real falhar, reverter apenas o commit da onda afetada.",
    "Nao excluir assets antigos na mesma onda; manter duplicados ate confirmar search_index, paginas e midias no build real.",
  ],
};

fs.writeFileSync(JSON_OUT, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(MD_OUT, renderMarkdown(output));

function renderMarkdown(data) {
  const lines = [];
  lines.push("# Plano de Migracao Classe B - Padrao de Conteudo V1");
  lines.push("");
  lines.push("> Escopo: diagnostico e plano executavel. Nenhum arquivo em `docs/` foi migrado por esta etapa.");
  lines.push("");
  lines.push("## Resumo");
  lines.push("");
  lines.push(`- Conteudos Classe B: ${data.totals.class_b_contents}`);
  lines.push(`- Guias: ${data.totals.guides}`);
  lines.push(`- Manuais: ${data.totals.manuals}`);
  lines.push(`- Assets a mover: ${data.totals.assets_to_move}`);
  lines.push(`- Conversoes HTML planejadas: ${data.totals.html_conversions}`);
  lines.push(`- Links relacionados nao resolvidos/fora de Guia-Manual: ${data.totals.unresolved_related_links}`);
  lines.push(`- Links relacionados adiados por apontarem para Classe C/D: ${data.totals.deferred_related_links}`);
  lines.push("");
  lines.push("## Ondas de Migracao");
  lines.push("");
  for (const wave of data.waves) {
    lines.push(`### ${wave.title}`);
    lines.push("");
    lines.push(`- Quantidade: ${wave.count}`);
    lines.push(`- Risco: ${wave.risk}`);
    lines.push(`- Transformacoes: front matter V1 (${wave.transformations.front_matter_v1}), assets (${wave.transformations.asset_moves}), prerequisitos HTML (${wave.transformations.wc_prereq_list}), videos HTML (${wave.transformations.html_video}), <br> (${wave.transformations.br}), screen-block (${wave.transformations.wc_screen_block}), relacionados por ID (${wave.transformations.related_to_ids})`);
    lines.push("");
    lines.push("| Arquivo | ID recomendado | Tipo | Categoria | Risco principal |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const item of data.items.filter((candidate) => wave.files.includes(candidate.path))) {
      lines.push(`| \`${item.path}\` | \`${item.recommended_metadata.id}\` | ${item.type} | ${item.category} | ${item.risks_or_human_review[0] || "baixo"} |`);
    }
    lines.push("");
  }
  lines.push("## Plano por Conteudo");
  lines.push("");
  for (const item of data.items) {
    lines.push(`### ${item.title}`);
    lines.push("");
    lines.push(`- Arquivo atual: \`${item.path}\``);
    lines.push(`- ID estavel recomendado: \`${item.recommended_metadata.id}\``);
    lines.push(`- title: \`${item.recommended_metadata.title}\``);
    lines.push(`- type: \`${item.recommended_metadata.type}\``);
    lines.push(`- category: \`${item.recommended_metadata.category}\``);
    lines.push(`- description sugerida: ${item.recommended_metadata.description ? `\`${item.recommended_metadata.description}\`` : "_pendente/revisar_"}`);
    lines.push(`- difficulty: \`${item.recommended_metadata.difficulty || ""}\``);
    lines.push(`- screen_path: ${item.recommended_metadata.screen_path ? `\`${item.recommended_metadata.screen_path}\`` : "_nao aplicavel_"}`);
    lines.push(`- related_manual: ${item.recommended_metadata.related_manual.length ? item.recommended_metadata.related_manual.map((id) => `\`${id}\``).join(", ") : "_nenhum_"}`);
    lines.push(`- related_guides: ${item.recommended_metadata.related_guides.length ? item.recommended_metadata.related_guides.map((id) => `\`${id}\``).join(", ") : "_nenhum_"}`);
    lines.push("");
    lines.push("Assets a mover:");
    if (item.asset_moves.length) {
      for (const asset of item.asset_moves) {
        lines.push(`- ${asset.kind}: \`${asset.from}\` -> \`${asset.to}\`${asset.already_in_v1_location ? " (ja esta no destino V1)" : ""}`);
      }
    } else {
      lines.push("- Nenhum asset identificado.");
    }
    lines.push("");
    lines.push("HTML/conversoes:");
    if (item.html_to_convert.length) {
      for (const conversion of item.html_to_convert) {
        lines.push(`- \`${conversion.type}\`: ${conversion.action}${conversion.count ? ` (${conversion.count})` : ""}`);
      }
    } else {
      lines.push("- Nenhuma conversao HTML identificada.");
    }
    lines.push("");
    lines.push("Riscos/revisao humana:");
    if (item.risks_or_human_review.length) {
      for (const risk of item.risks_or_human_review) lines.push(`- ${risk}`);
    } else {
      lines.push("- Sem risco especifico alem da validacao visual/build real.");
    }
    lines.push("");
  }
  lines.push("## Assets a Mover");
  lines.push("");
  const moves = data.items.flatMap((item) => item.asset_moves.filter((asset) => !asset.already_in_v1_location).map((asset) => ({ ...asset, item })));
  if (moves.length) {
    lines.push("| Conteudo | Tipo | Origem | Destino |");
    lines.push("| --- | --- | --- | --- |");
    for (const move of moves) {
      lines.push(`| \`${move.item.recommended_metadata.id}\` | ${move.kind} | \`${move.from}\` | \`${move.to}\` |`);
    }
  } else {
    lines.push("Nenhum asset precisa ser movido.");
  }
  lines.push("");
  lines.push("## Conversoes de HTML");
  lines.push("");
  lines.push(`- \`wc-prereq-list\`: ${data.transformations.wc_prereq_list}`);
  lines.push(`- \`<video>/<source>\`: ${data.transformations.html_video}`);
  lines.push(`- \`<br>\`: ${data.transformations.br}`);
  lines.push(`- \`wc-screen-block\`: ${data.transformations.wc_screen_block}`);
  lines.push("");
  lines.push("## Itens que Exigem Revisao");
  lines.push("");
  const needsReview = data.items.filter((item) => item.risks_or_human_review.length);
  for (const item of needsReview) {
    lines.push(`- \`${item.path}\`: ${item.risks_or_human_review.join("; ")}`);
  }
  lines.push("");
  lines.push("## Estrategia de Rollback");
  lines.push("");
  for (const step of data.rollback_strategy) lines.push(`- ${step}`);
  lines.push("");
  lines.push("## Observacoes");
  lines.push("");
  lines.push("- Esta etapa e somente estrutural; nao inventa conteudo editorial nem altera informacao operacional.");
  lines.push("- Conteudos Classe C e D permanecem fora do plano.");
  lines.push("- A execucao real deve ocorrer somente apos o padrao V1 passar no build Docker/MkDocs real.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

console.log(`Plano gerado: ${repoPath("tests", "content-migration", "PLANO_MIGRACAO_B.md")}`);
console.log(`JSON gerado: ${repoPath("tests", "content-migration", "migration-plan-b.json")}`);
console.log(`Conteudos Classe B: ${summary.totals.class_b_contents}`);
