from pydantic import BaseModel
from typing import Optional


class SearchQuery(BaseModel):
    text: Optional[str] = None
    image_path: Optional[str] = None
    confidence_min: float = 0.0
    status_filter: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None
    cursor: Optional[str] = None
    limit: int = 10


class SearchMatch(BaseModel):
    item_id: str
    title: Optional[str]
    description: Optional[str]
    image_path: Optional[str]
    status: str
    confidence: float
    category: Optional[str]
    color: Optional[str]
    brand: Optional[str]
    drop_location: Optional[str]
    pickup_lat: Optional[float]
    pickup_lng: Optional[float]
    verification_question: Optional[str] = None


class SearchResponse(BaseModel):
    matches: list[SearchMatch]
    next_cursor: Optional[str]
    total_estimate: int