import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const docsDir = path.join(repoRoot, "docs");
const resultPath = path.join(scriptDir, "latest-results.json");
const catalogPath = path.join(docsDir, "assets", "data", "content-catalog.json");

const validTypes = new Set(["guia", "manual"]);
const validDifficulties = new Set(["facil", "intermediario", "avancado"]);
const validStatuses = new Set(["published", "draft", "deprecated"]);
const requiredFields = ["id", "title", "type", "category"];

function normalizeSlash(value) {
  return value.replace(/\\/g, "/");
}

function stripQuotes(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let activeKey = null;

  lines.forEach((line) => {
    if (!line.trim() || line.trim().startsWith("#")) return;

    const listMatch = line.match(/^\s*-\s*(.+?)\s*$/);
    if (listMatch && activeKey) {
      if (!Array.isArray(data[activeKey])) data[activeKey] = [];
      data[activeKey].push(stripQuotes(listMatch[1]));
      return;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!keyMatch) return;

    activeKey = keyMatch[1];
    const rawValue = keyMatch[2] || "";

    data[activeKey] = rawValue.trim()
      ? stripQuotes(rawValue)
      : [];
  });

  return data;
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = normalizeSlash(path.relative(repoRoot, fullPath));

    if (entry.isDirectory()) {
      if (relative === "docs/shared") continue;
      files.push(...await listMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return [value];
}

function screenPathParts(value) {
  if (Array.isArray(value)) return value.map(stripQuotes).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(">")
    .map((part) => stripQuotes(part))
    .filter(Boolean);
}

function markdownUrl(relativePath) {
  return relativePath
    .replace(/^docs\//, "")
    .replace(/(^|\/)index\.md$/, "$1")
    .replace(/\.md$/, "/");
}

function localAssetPath(markdownPath, href) {
  if (!href || /^(?:https?:)?\/\//i.test(href) || href.startsWith("#")) {
    return null;
  }

  const cleanHref = href
    .replace(/[?#].*$/, "")
    .replace(/^<|>$/g, "");

  return path.resolve(path.dirname(markdownPath), cleanHref);
}

function findMarkdownImages(markdown) {
  return Array.from(markdown.matchAll(/!\[[^\]]*]\(([^)]+)\)/g))
    .map((match) => match[1].trim());
}

function findMarkdownVideos(markdown) {
  return Array.from(markdown.matchAll(/\[[^\]]+]\(([^)]+)\)\{[^}]*\.wc-video-link[^}]*}/g))
    .map((match) => match[1].trim());
}

function hasManualAuthoringHtml(markdown) {
  return /<video\b/i.test(markdown) || /class=["'][^"']*\bwc-prereq-list\b/i.test(markdown);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}

function duplicateItems(items) {
  const seen = new Set();
  const duplicates = new Set();

  items.forEach((item) => {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  });

  return [...duplicates];
}

function relatedReferenceErrors(content, idSet) {
  const errors = [];

  content.forEach((item) => {
    item.related_manual.forEach((id) => {
      if (!idSet.has(id)) errors.push(`${item.path}: related_manual inexistente: ${id}`);
    });

    item.related_guides.forEach((id) => {
      if (!idSet.has(id)) errors.push(`${item.path}: related_guides inexistente: ${id}`);
    });
  });

  return errors;
}

function catalogItem(item) {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    category: item.category,
    description: item.description,
    difficulty: item.difficulty,
    status: item.status,
    url: item.url,
    screen_path: item.screen_path,
    related_manual: item.related_manual,
    related_guides: item.related_guides,
    videos: item.videos,
    tags: item.tags
  };
}

async function run() {
  const markdownFiles = await listMarkdownFiles(docsDir);
  const content = [];
  const errors = [];
  const warnings = [];

  for (const filePath of markdownFiles) {
    const markdown = await fs.readFile(filePath, "utf8");
    const frontMatter = parseFrontMatter(markdown);
    if (!frontMatter) continue;

    const adopted = Boolean(frontMatter.id || validTypes.has(frontMatter.type));
    if (!adopted) continue;

    const relativePath = normalizeSlash(path.relative(repoRoot, filePath));
    const item = {
      path: relativePath,
      id: frontMatter.id || "",
      title: frontMatter.title || "",
      type: frontMatter.type || "",
      category: frontMatter.category || "",
      description: frontMatter.description || "",
      difficulty: frontMatter.difficulty || "",
      status: frontMatter.status || "",
      url: markdownUrl(relativePath),
      screen_path: screenPathParts(frontMatter.screen_path),
      related_manual: asArray(frontMatter.related_manual),
      related_guides: asArray(frontMatter.related_guides),
      tags: asArray(frontMatter.tags),
      images: findMarkdownImages(markdown),
      videos: findMarkdownVideos(markdown)
    };

    content.push(item);

    requiredFields.forEach((field) => {
      if (!frontMatter[field]) {
        errors.push(`${relativePath}: campo obrigatorio ausente: ${field}`);
      }
    });

    if (frontMatter.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontMatter.id)) {
      errors.push(`${relativePath}: id invalido: ${frontMatter.id}`);
    }

    if (frontMatter.type && !validTypes.has(frontMatter.type)) {
      errors.push(`${relativePath}: type invalido: ${frontMatter.type}`);
    }

    if (frontMatter.type === "guia" && !relativePath.startsWith("docs/como-fazer/")) {
      errors.push(`${relativePath}: guia fora de docs/como-fazer/`);
    }

    if (frontMatter.difficulty && !validDifficulties.has(frontMatter.difficulty)) {
      errors.push(`${relativePath}: difficulty invalido: ${frontMatter.difficulty}`);
    }

    if (frontMatter.status && !validStatuses.has(frontMatter.status)) {
      errors.push(`${relativePath}: status invalido: ${frontMatter.status}`);
    }

    if (frontMatter.type === "manual" && frontMatter.screen_path && !item.screen_path.length) {
      errors.push(`${relativePath}: screen_path invalido`);
    }

    if (hasManualAuthoringHtml(markdown)) {
      errors.push(`${relativePath}: HTML manual desnecessario para autoria comum`);
    }

    if (frontMatter.type === "guia" && frontMatter.status === "published" && !item.videos.length) {
      errors.push(`${relativePath}: guia publicado sem video`);
    }

    const duplicateRelated = duplicateItems([...item.related_manual, ...item.related_guides]);
    duplicateRelated.forEach((id) => {
      errors.push(`${relativePath}: relacionado duplicado: ${id}`);
    });

    for (const href of [...item.images, ...item.videos]) {
      const assetPath = localAssetPath(filePath, href);
      if (assetPath && !await exists(assetPath)) {
        errors.push(`${relativePath}: asset inexistente: ${href}`);
      }
    }

    if (!frontMatter.description) {
      warnings.push(`${relativePath}: description ausente`);
    }
  }

  const ids = content.map((item) => item.id).filter(Boolean);
  duplicateItems(ids).forEach((id) => {
    errors.push(`id duplicado: ${id}`);
  });

  const idSet = new Set(ids);
  errors.push(...relatedReferenceErrors(content, idSet));

  const selfTests = {
    missingRelatedDetection: relatedReferenceErrors([{
      path: "self-test.md",
      id: "self-test",
      related_manual: ["id-inexistente"],
      related_guides: []
    }], new Set(["self-test"])).length === 1,
    multipleVideosDetection: findMarkdownVideos([
      "[Video 1](../assets/videos/guias/exemplo/passo-1.mp4){ .wc-video-link }",
      "[Video 2](../assets/videos/guias/exemplo/passo-2.mp4){ .wc-video-link }"
    ].join("\n\n")).length === 2,
    manualHtmlDetection: hasManualAuthoringHtml("<video controls></video>") === true
  };

  Object.entries(selfTests).forEach(([name, passed]) => {
    if (!passed) errors.push(`self-test falhou: ${name}`);
  });

  const catalog = {
    generatedAt: new Date().toISOString(),
    source: "Gerado a partir do front matter dos conteudos adotados pela convencao interna.",
    status: "catalogo tecnico para resolucao de IDs; nao substitui build real do MkDocs.",
    items: content
      .map(catalogItem)
      .sort((a, b) => a.id.localeCompare(b.id, "pt-BR"))
  };

  const result = {
    generatedAt: new Date().toISOString(),
    scope: "Valida somente conteudos que adotaram o front matter interno com id/type/category/title.",
    adoptedContentCount: content.length,
    ids: ids.length,
    duplicateIds: duplicateItems(ids),
    content,
    catalogPath: normalizeSlash(path.relative(repoRoot, catalogPath)),
    selfTests,
    warnings,
    errors,
    summary: {
      pass: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length
    }
  };

  await fs.mkdir(scriptDir, { recursive: true });
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await fs.writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  if (errors.length) {
    throw new Error(`Validacao de conteudo falhou com ${errors.length} erro(s). Veja ${normalizeSlash(path.relative(repoRoot, resultPath))}.`);
  }

  return result;
}

const result = await run();
console.log(JSON.stringify(result.summary, null, 2));
