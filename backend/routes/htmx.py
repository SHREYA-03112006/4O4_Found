from fastapi import APIRouter, Request, Depends, Query
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from database.postgres import get_db
from models.item import Item
from services.search_service import hybrid_search
from services.ai_service import get_text_embedding

router = APIRouter(prefix="/api/html", tags=["htmx"])
templates = Jinja2Templates(directory="templates")


def _get_embedding(text: str):
    if text and text.strip():
        try:
            return get_text_embedding(text.strip())
        except Exception:
            return None
    return None


@router.get("/search-results", response_class=HTMLResponse)
def htmx_search_results(
    request: Request,
    text: str = "",
    status_filter: str = "found",
    category: str = "",
    color: str = "",
    brand: str = "",
    confidence_min: float = 0.0,
    cursor: str = "",
    db: Session = Depends(get_db),
):
    embedding = _get_embedding(text)
    result = hybrid_search(
        query_embedding=embedding,
        status_filter=status_filter or None,
        category=category or None,
        color=color or None,
        brand=brand or None,
        confidence_min=confidence_min,
        cursor=cursor or None,
        limit=10,
    )
    return templates.TemplateResponse("search_results.html", {
        "request": request,
        "matches": [m.model_dump() for m in result.matches],
        "next_cursor": result.next_cursor,
    })


@router.get("/results-page", response_class=HTMLResponse)
def htmx_results_page(
    request: Request,
    cursor: str = "",
    status_filter: str = "found",
    category: str = "",
    color: str = "",
    brand: str = "",
    confidence_min: float = 0.0,
    db: Session = Depends(get_db),
):
    result = hybrid_search(
        query_embedding=None,
        status_filter=status_filter or None,
        category=category or None,
        color=color or None,
        brand=brand or None,
        confidence_min=confidence_min,
        cursor=cursor or None,
        limit=5,
    )
    return templates.TemplateResponse("search_results.html", {
        "request": request,
        "matches": [m.model_dump() for m in result.matches],
        "next_cursor": result.next_cursor,
    })