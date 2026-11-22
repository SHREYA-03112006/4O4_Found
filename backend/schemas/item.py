from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class ItemCreate(BaseModel):
    status: str
    category: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_path: Optional[str] = None
    location_description: Optional[str] = None
    drop_location: Optional[str] = None
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    finder_contact: Optional[str] = None
    contact_message: Optional[str] = None
    verification_question: Optional[str] = None
    verification_answer: Optional[str] = None

class ItemResponse(BaseModel):
    id: UUID
    status: str
    category: Optional[str]
    color: Optional[str]
    brand: Optional[str]
    title: Optional[str]
    description: Optional[str]
    ai_description: Optional[str]
    image_path: Optional[str]
    drop_location: Optional[str]
    pickup_lat: Optional[float]
    pickup_lng: Optional[float]
    location_description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ItemListParams(BaseModel):
    status: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None
    page: int = 1
    limit: int = 20