import json
import os
from typing import Optional

THEMES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "themes")
_cache: dict[str, dict] = {}


def _load_theme(name: str) -> Optional[dict]:
    path = os.path.join(THEMES_DIR, f"{name}.json")
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)


def get_theme(name: str, org_overrides: Optional[dict] = None) -> dict:
    if name not in _cache:
        base = _load_theme(name) or _load_theme("school") or {}
        _cache[name] = base
    theme = dict(_cache[name])
    result = {
        "name": theme.get("name", "school"),
        "label": theme.get("label", "School / University"),
        "colors": dict(theme.get("colors", {})),
        "fontFamily": theme.get("fontFamily", "'Inter', system-ui, sans-serif"),
        "borderRadius": theme.get("borderRadius", "0.5rem"),
        "mapProvider": theme.get("mapProvider", "openstreetmap"),
    }
    if org_overrides:
        if org_overrides.get("brand_primary_color"):
            result["colors"]["primary"] = org_overrides["brand_primary_color"]
        if org_overrides.get("brand_secondary_color"):
            result["colors"]["secondary"] = org_overrides["brand_secondary_color"]
        if org_overrides.get("map_provider"):
            result["mapProvider"] = org_overrides["map_provider"]
        if org_overrides.get("map_tile_url"):
            result["mapTileUrl"] = org_overrides["map_tile_url"]
    return result


def list_themes() -> list[dict]:
    themes = []
    if not os.path.isdir(THEMES_DIR):
        return themes
    for fname in sorted(os.listdir(THEMES_DIR)):
        if fname.endswith(".json"):
            theme = _load_theme(fname[:-5])
            if theme:
                themes.append({"name": theme["name"], "label": theme["label"]})
    return themes


def clear_cache():
    _cache.clear()