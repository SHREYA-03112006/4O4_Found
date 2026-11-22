import json
import os

from fastapi import APIRouter

from schemas.search import SearchQuery, SearchResponse
from services.search_service import hybrid_search
from services.ai_service import get_text_embedding, get_embedding
from services.tray_service import get_tray, add_to_tray, remove_from_tray


router = APIRouter(tags=["search"])


@router.post("/search", response_model=SearchResponse)
def search_items(query: SearchQuery):

    text_embedding = None
    image_embedding = None
    exclude = None

    if query.text and query.text.strip():
        try:
            text_embedding = get_text_embedding(
                query.text.strip()
            )
        except Exception:
            text_embedding = None

    if query.image_path:
        try:
            image_path = query.image_path

            if os.path.exists(image_path):
                with open(image_path, "rb") as f:
                    image_bytes = f.read()

                image_embedding = get_embedding(image_bytes)

        except Exception:
            image_embedding = None

    cursor = query.cursor

    if query.cursor and ":" in query.cursor:
        parts = query.cursor.split(":", 1)

        cursor = parts[0]

        if parts[1]:
            try:
                exclude = json.loads(parts[1])
            except json.JSONDecodeError:
                exclude = None

    return hybrid_search(
        query_text_embedding=text_embedding,
        query_image_embedding=image_embedding,
        status_filter=query.status_filter,
        category=query.category,
        color=query.color,
        brand=query.brand,
        confidence_min=query.confidence_min,
        cursor=cursor,
        limit=query.limit,
        exclude_ids=exclude,
        raw_query_text=query.text.strip() if query.text else None,
    )


@router.post("/tray/add")
def tray_add(
    session_id: str,
    item_id: str
):
    add_to_tray(session_id, item_id)

    return {
        "status": "added"
    }


@router.post("/tray/remove")
def tray_remove(
    session_id: str,
    item_id: str
):
    remove_from_tray(session_id, item_id)

    return {
        "status": "removed"
    }


@router.get("/tray")
def tray_get(session_id: str):

    items = get_tray(session_id)

    return {
        "items": items
    }