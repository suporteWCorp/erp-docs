"""Publish the assistant allowlist from the actual MkDocs navigation."""
import json
from pathlib import Path


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
    target.write_text(json.dumps({'pages': sorted(set(pages))}), encoding='utf-8')
