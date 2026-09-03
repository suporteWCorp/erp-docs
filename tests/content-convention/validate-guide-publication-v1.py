import json
import re
from collections import Counter
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
GUIDES = DOCS / "como-fazer"
CATALOG = DOCS / "assets" / "data" / "content-catalog.json"
CONTENT_INFO = DOCS / "assets" / "data" / "content-info.json"
INDEX = GUIDES / "index.md"
MKDOCS = REPO / "mkdocs.yml"
SEARCH_INDEX = REPO / "site" / "search" / "search_index.json"
POPULAR_LINKS = DOCS / "shared" / "portal" / "mais-acessados.md"
RESULT = Path(__file__).with_name("latest-guide-publication-v1.json")


def parse_front_matter(markdown):
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?", markdown)
    if not match:
        return {}

    data = {}
    active = None
    for line in match.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue

        list_match = re.match(r"^\s+-\s*(.+?)\s*$", line)
        if list_match and active:
            data.setdefault(active, [])
            if not isinstance(data[active], list):
                data[active] = []
            data[active].append(list_match.group(1).strip().strip("\"'"))
            continue

        key_match = re.match(r"^([A-Za-z0-9_-]+):(?:\s*(.*))?$", line)
        if not key_match:
            continue

        active = key_match.group(1)
        raw = (key_match.group(2) or "").strip()
        data[active] = raw.strip("\"'") if raw else []

    return data


def heading(markdown):
    match = re.search(r"^#\s+(.+)$", markdown, re.MULTILINE)
    return match.group(1).strip() if match else ""


def markdown_videos(markdown):
    return [
        match.group(1).strip()
        for match in re.finditer(
            r"\[[^\]]+]\(([^)]+\.(?:mp4|webm|ogg)[^)]*)\)\{[^}]*\.wc-video-link[^}]*}",
            markdown,
            re.IGNORECASE,
        )
    ]


def html_videos(markdown):
    return [
        match.group(1).strip()
        for match in re.finditer(
            r"<source\s+[^>]*src=[\"']([^\"']+\.(?:mp4|webm|ogg)[^\"']*)[\"']",
            markdown,
            re.IGNORECASE,
        )
    ]


def asset_exists(markdown_path, href):
    clean = re.sub(r"[?#].*$", "", href).strip("<>")
    return (markdown_path.parent / clean).resolve().exists()


def page_path_from_file(markdown_path):
    return f"como-fazer/{markdown_path.stem}"


def parse_cards():
    markdown = INDEX.read_text(encoding="utf-8")
    cards = []
    current_category = ""

    for line in markdown.splitlines():
        category_match = re.match(r"^##\s+(.+?)\s*$", line)
        if category_match:
            current_category = category_match.group(1).strip()
            continue

        link_match = re.search(r"\[Consultar guia]\(([^)]+\.md)\)", line)
        if link_match:
            cards.append({
                "path": f"como-fazer/{Path(link_match.group(1)).stem}",
                "category": current_category,
            })

    return cards


def parse_nav_guides():
    lines = MKDOCS.read_text(encoding="utf-8").splitlines()
    in_guides = False
    current_category = ""
    guides = []

    for line in lines:
        if re.match(r"^  - Guia:\s*$", line):
            in_guides = True
            continue

        if in_guides and re.match(r"^  - [^ ].*:\s*$", line):
            break

        if not in_guides:
            continue

        category_match = re.match(r"^      - ([^:]+):\s*$", line)
        if category_match:
            current_category = category_match.group(1).strip()
            continue

        guide_match = re.search(r"como-fazer/([^.\s]+)\.md", line)
        if guide_match:
            if guide_match.group(1) == "index":
                continue
            guides.append({
                "path": f"como-fazer/{guide_match.group(1)}",
                "category": current_category,
            })

    return guides


def search_excluded(front_matter):
    return front_matter.get("search") == [] or front_matter.get("search") == {"exclude": True}


def has_search_exclude_block(markdown):
    return bool(re.search(r"^search:\s*\n\s+exclude:\s*true\s*$", markdown, re.MULTILINE))


def search_index_locations():
    if not SEARCH_INDEX.exists():
        return []

    data = json.loads(SEARCH_INDEX.read_text(encoding="utf-8"))
    return [str(doc.get("location", "")).split("#")[0].strip("/") for doc in data.get("docs", [])]


def popular_guide_links():
    markdown = POPULAR_LINKS.read_text(encoding="utf-8") if POPULAR_LINKS.exists() else ""
    links = []

    for href in re.findall(r"\[[^\]]+]\(([^)]+)\)", markdown):
        if href.startswith("como-fazer/") and href.endswith(".md"):
            links.append(href.removesuffix(".md"))

    return links


def main():
    errors = []
    warnings = []
    guide_rows = []

    for markdown_path in sorted(GUIDES.glob("*.md")):
        if markdown_path.name == "index.md":
            continue

        markdown = markdown_path.read_text(encoding="utf-8")
        fm = parse_front_matter(markdown)
        md_videos = markdown_videos(markdown)
        legacy_videos = html_videos(markdown)
        all_videos = md_videos + legacy_videos
        asset_status = [asset_exists(markdown_path, video) for video in all_videos]
        published_v1 = (
            fm.get("type") == "guia" and
            fm.get("status") == "published" and
            bool(md_videos) and
            all(asset_exists(markdown_path, video) for video in md_videos)
        )

        if published_v1:
            classification = "GUIA_VALIDO"
        elif all_videos and not all(asset_status):
            classification = "ASSET_AUSENTE"
        elif all_videos:
            classification = "LEGADO_COM_VIDEO_FORA_DA_V1"
        else:
            classification = "SEM_VIDEO"

        if not published_v1 and not has_search_exclude_block(markdown):
            errors.append(f"{markdown_path.relative_to(REPO).as_posix()}: guia invalido sem search.exclude")

        guide_rows.append({
            "path": page_path_from_file(markdown_path),
            "file": markdown_path.relative_to(REPO).as_posix(),
            "id": fm.get("id", ""),
            "title": fm.get("title") or heading(markdown),
            "category": fm.get("category", ""),
            "status": fm.get("status", ""),
            "markdownVideos": md_videos,
            "legacyHtmlVideos": legacy_videos,
            "publishedV1": published_v1,
            "classification": classification,
        })

    valid_paths = {row["path"] for row in guide_rows if row["publishedV1"]}
    valid_rows = {row["path"]: row for row in guide_rows if row["publishedV1"]}
    cards = parse_cards()
    nav_guides = parse_nav_guides()
    card_paths = {card["path"] for card in cards}
    nav_paths = {item["path"] for item in nav_guides}

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    catalog_guides = [
        item for item in catalog.get("items", [])
        if item.get("type") == "guia" and item.get("status") == "published"
    ]
    catalog_paths = {
        str(item.get("url", "")).strip("/").removesuffix("/")
        for item in catalog_guides
    }

    if card_paths != valid_paths:
        errors.append(f"cards divergentes dos guias validos: cards={sorted(card_paths)} validos={sorted(valid_paths)}")

    if nav_paths != valid_paths:
        errors.append(f"nav divergente dos guias validos: nav={sorted(nav_paths)} validos={sorted(valid_paths)}")

    if catalog_paths != valid_paths:
        errors.append(f"catalogo divergente dos guias validos: catalogo={sorted(catalog_paths)} validos={sorted(valid_paths)}")

    for item in catalog_guides:
        if not item.get("videos"):
            errors.append(f"{item.get('id')}: guia publicado no catalogo sem videos")

    content_info = json.loads(CONTENT_INFO.read_text(encoding="utf-8"))
    for path, info in content_info.items():
        if not path.startswith("como-fazer/"):
            continue

        if path in valid_paths:
            if not info.get("videoAvailable"):
                errors.append(f"{path}: content-info sem videoAvailable para guia V1 publicado")
            expected_title = valid_rows[path]["title"]
            if info.get("title") != expected_title:
                errors.append(f"{path}: titulo divergente no content-info: {info.get('title')} != {expected_title}")
        else:
            if info.get("popular"):
                errors.append(f"{path}: guia fora da V1 ainda marcado como popular")
            if info.get("videoAvailable"):
                errors.append(f"{path}: guia fora da V1 ainda marcado com videoAvailable")

    invalid_popular_links = sorted(set(popular_guide_links()) - valid_paths)
    if invalid_popular_links:
        errors.append(f"links de Mais acessados apontam para guias fora da V1: {invalid_popular_links}")

    invalid_paths = {row["path"] for row in guide_rows if not row["publishedV1"]}
    indexed_invalid = sorted(invalid_paths.intersection(search_index_locations()))
    if indexed_invalid:
        errors.append(f"guias invalidos presentes no search_index: {indexed_invalid}")

    assistant_source = (DOCS / "assets" / "javascripts" / "wcorp-assistant.js").read_text(encoding="utf-8")
    if "isAssistantBlockedGuideDoc" not in assistant_source or "loadAssistantPublishedGuidePaths" not in assistant_source:
        errors.append("Assistente sem filtro estrutural de guias publicados")

    result = {
        "summary": {
            "pass": not errors,
            "totalGuideFiles": len(guide_rows),
            "publishedGuides": len(valid_paths),
            "invalidGuides": len(invalid_paths),
            "cardCount": len(cards),
            "navCount": len(nav_guides),
            "catalogGuideCount": len(catalog_guides),
            "errorCount": len(errors),
            "warningCount": len(warnings),
        },
        "categoryCounts": {
            "cards": dict(Counter(card["category"] for card in cards)),
            "nav": dict(Counter(item["category"] for item in nav_guides)),
            "publishedV1": dict(Counter(row["category"] for row in guide_rows if row["publishedV1"])),
        },
        "guides": guide_rows,
        "cards": cards,
        "nav": nav_guides,
        "catalogGuides": catalog_guides,
        "popularGuideLinks": popular_guide_links(),
        "indexedInvalidGuides": indexed_invalid,
        "warnings": warnings,
        "errors": errors,
    }

    RESULT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result["summary"], ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
