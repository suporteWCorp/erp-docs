import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLAN_PATH = path.join(ROOT, "tests", "content-migration", "migration-plan-b.json");
const STAGING_ROOT = path.join(ROOT, "tests", "content-migration", "dry-run");

const runtimeArgs =
  typeof process !== "undefined"
    ? process.argv.slice(2)
    : globalThis.__MIGRATE_CLASS_B_ARGS__ || ["--dry-run"];

const args = new Set(runtimeArgs);
const values = runtimeArgs;

function valueFor(flag) {
  const index = values.indexOf(flag);
  return index >= 0 ? values[index + 1] : null;
}

function toPosix(value) {
  return value.replace(/\\/g, "/");
}

function usage() {
  console.log(`
Uso:
  node tests/content-migration/migrate-class-b.mjs --dry-run [--wave onda-1-guias-administracao]
  node tests/content-migration/migrate-class-b.mjs --dry-run [--module Faturamento]
  node tests/content-migration/migrate-class-b.mjs --write-staging --wave onda-1-guias-administracao

Seguranca:
  - O script nunca escreve em docs/.
  - --dry-run e o modo padrao.
  - --write-staging escreve somente em tests/content-migration/dry-run/.
  - Use --force apenas para sobrescrever arquivos de staging.
`);
}

if (args.has("--help")) {
  usage();
} else {
  await main();
}

async function main() {
  if (!fs.existsSync(PLAN_PATH)) {
    throw new Error("migration-plan-b.json nao encontrado. Execute generate-migration-plan-b.mjs primeiro.");
  }

  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
  const waveId = valueFor("--wave");
  const moduleName = valueFor("--module");
  const writeStaging = args.has("--write-staging");
  const force = args.has("--force");

  let selected = plan.items;
  if (waveId) {
    const wave = plan.waves.find((candidate) => candidate.id === waveId);
    if (!wave) throw new Error(`Onda inexistente: ${waveId}`);
    selected = selected.filter((item) => wave.files.includes(item.path));
  }
  if (moduleName) {
    selected = selected.filter((item) => item.category.toLowerCase() === moduleName.toLowerCase());
  }

  console.log(`Conteudos selecionados: ${selected.length}`);
  for (const item of selected) {
    console.log(`- ${item.path} -> ${item.recommended_metadata.id}`);
    for (const asset of item.asset_moves) {
      if (!asset.already_in_v1_location) console.log(`  asset: ${asset.from} -> ${asset.to}`);
    }
  }

  if (!writeStaging) {
    console.log("Dry-run concluido. Nenhum arquivo foi escrito.");
    return;
  }

  fs.mkdirSync(STAGING_ROOT, { recursive: true });
  for (const item of selected) {
    const sourcePath = path.join(ROOT, item.path);
    const source = fs.readFileSync(sourcePath, "utf8");
    const converted = convertContent(source, item);
    const targetPath = path.join(STAGING_ROOT, item.path);

    if (!targetPath.startsWith(STAGING_ROOT)) {
      throw new Error(`Destino fora de staging: ${targetPath}`);
    }
    if (fs.existsSync(targetPath) && !force) {
      throw new Error(`Staging ja existe: ${targetPath}. Use --force para sobrescrever somente staging.`);
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, converted);
  }

  console.log(`Staging criado em ${toPosix(path.relative(ROOT, STAGING_ROOT))}`);
}

function convertContent(markdown, item) {
  let next = markdown;

  next = next.replace(/^---[\s\S]*?\n---\s*/m, "");

  const metadata = item.recommended_metadata;
  const frontMatter = [
    "---",
    `id: ${metadata.id}`,
    `title: ${JSON.stringify(metadata.title)}`,
    `type: ${metadata.type}`,
    `category: ${JSON.stringify(metadata.category)}`,
  ];
  if (metadata.description) frontMatter.push(`description: ${JSON.stringify(metadata.description)}`);
  if (metadata.difficulty) frontMatter.push(`difficulty: ${JSON.stringify(metadata.difficulty)}`);
  if (metadata.screen_path) frontMatter.push(`screen_path: ${JSON.stringify(metadata.screen_path)}`);
  if (metadata.related_manual.length) {
    frontMatter.push("related_manual:");
    metadata.related_manual.forEach((id) => frontMatter.push(`  - ${id}`));
  }
  if (metadata.related_guides.length) {
    frontMatter.push("related_guides:");
    metadata.related_guides.forEach((id) => frontMatter.push(`  - ${id}`));
  }
  frontMatter.push("---", "");

  next = next
    .replace(/<div class="wc-prereq-list" markdown>\s*/g, "")
    .replace(/\s*<\/div>/g, "")
    .replace(/<br\s*\/?>/g, "")
    .replace(/<video[\s\S]*?<\/video>/g, (match) => {
      const src = match.match(/<source\s+src="([^"]+)"/)?.[1];
      if (!src) return match;
      const planned = item.asset_moves.find((asset) => asset.kind === "video" && asset.from.endsWith(path.basename(src)));
      const href = planned ? toPosix(path.relative(path.dirname(item.path), planned.to)) : src;
      return `[Assistir video](${href}){ .wc-video-link }`;
    });

  if (
    item.related_resolution.deferred_or_blocked.length === 0 &&
    item.related_resolution.unresolved_or_non_content.length === 0
  ) {
    next = next.replace(/\n##\s+Veja tamb[eé]m\s*\n[\s\S]*?(?=\n##\s+|$)/i, "");
  }

  return `${frontMatter.join("\n")}${next.trimStart()}`;
}
