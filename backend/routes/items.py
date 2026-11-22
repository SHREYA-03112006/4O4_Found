import json
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.postgres import get_db
from database.redis import get_redis
from models.item import Item
from schemas.item import ItemCreate, ItemResponse, ItemListParams
from services.ai_service import get_embedding, get_text_embedding

VECTOR_KEY = "item:vector"

router = APIRouter(tags=["items"])


def _store_item_embedding(item: Item):
    """Generate embedding from item image + description and store in Redis."""
    r = get_redis()
    vectors = []

    if item.image_path and os.path.exists(item.image_path):
        try:
            with open(item.image_path, "rb") as f:
                img_bytes = f.read()
            vec = get_embedding(img_bytes)
            if vec and isinstance(vec, list):
                vectors.append(vec)
        except Exception:
            pass

    text = item.description or item.ai_description
    if text:
        try:
            vec = get_text_embedding(text)
            if vec and isinstance(vec, list):
                vectors.append(vec)
        except Exception:
            pass

    if vectors:
        avg = [sum(dim) / len(vectors) for dim in zip(*vectors)]
        r.set(f"{VECTOR_KEY}:{item.id}", json.dumps(avg))


@router.post("/items", response_model=ItemResponse)
def create_item(data: ItemCreate, db: Session = Depends(get_db)):
    item = Item(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    _store_item_embedding(item)
    return item


@router.get("/items", response_model=list[ItemResponse])
def list_items(params: ItemListParams = Depends(), db: Session = Depends(get_db)):
    query = db.query(Item)
    if params.status:
        query = query.filter(Item.status == params.status)
    if params.category:
        query = query.filter(Item.category == params.category)
    if params.color:
        query = query.filter(Item.color == params.color)
    if params.brand:
        query = query.filter(Item.brand == params.brand)
    offset = (params.page - 1) * params.limit
    return query.offset(offset).limit(params.limit).all()


@router.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: str, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.id == item_id).first()