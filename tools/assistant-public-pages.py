"""Publish the assistant allowlist from the actual MkDocs navigation."""
import json
from pathlib import Path

_metadata = {}


def page_key(path):
    path = path[:-3]
    return '' if path == 'index' else path.removesuffix('/index')


def on_nav(nav, config, **kwargs):
    # Reset on every build (including mkdocs serve). Only navigation pages qualify.
    _metadata.clear()
    catalog_file = Path(config['docs_dir']) / 'assets/data/content-catalog.json'
    items = json.loads(catalog_file.read_text(encoding='utf-8'))['items']
    existing = {item['url'].strip('/'): item for item in items}
    for page in nav.pages:
        key = page_key(page.file.src_uri)
        item = existing.get(key, {})
        _metadata[key] = {
            'title': page.title,
            'type': item.get('type', 'documentacao'),
            'category': item.get('category', ''),
            'description': str(item.get('description', ''))[:240],
        }


def on_page_content(html, page, **kwargs):
    key = page_key(page.file.src_uri)
    if key in _metadata:
        _metadata[key] = {
            'title': page.title,
            'type': page.meta.get('type', _metadata[key]['type']),
            'category': page.meta.get('category', _metadata[key]['category']),
            'description': str(page.meta.get('description', _metadata[key]['description']))[:240],
        }
    return html


def on_post_build(config, **kwargs):
    pages = []

    def visit(value):
        if isinstance(value, str) and value.endswith('.md'):
            path = value[:-3]
            if path == 'index':
                path = ''
            elif path.endswith('/index'):
                path = path[:-6]
            pages.append(path)
        elif isinstance(value, dict):
            for child in value.values():
                visit(child)
        elif isinstance(value, list):
            for child in value:
                visit(child)

    visit(config['nav'])
    target = Path(config['site_dir']) / 'assets/data/assistant-public-pages.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    public_pages = sorted(set(pages))
    catalog = [dict(sourceId=key, **_metadata[key]) for key in public_pages]
    target.write_text(json.dumps({'pages': public_pages, 'catalog': catalog}, ensure_ascii=False), encoding='utf-8')
