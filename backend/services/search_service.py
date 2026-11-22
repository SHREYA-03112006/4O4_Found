import json
import math

from database.postgres import SessionLocal
from database.redis import get_redis
from models.item import Item
from schemas.search import SearchMatch, SearchResponse


VECTOR_KEY = "item:vector"


def hybrid_search(
    query_text_embedding: list[float] | None,
    query_image_embedding: list[float] | None,
    status_filter: str | None,
    category: str | None,
    color: str | None,
    brand: str | None,
    confidence_min: float,
    cursor: str | None,
    limit: int,
    exclude_ids: list[str] | None = None,
) -> SearchResponse:

    r = get_redis()
    db = SessionLocal()

    seen_ids = set(exclude_ids or [])

    # -----------------------------
    # DATABASE QUERY
    # -----------------------------

    query = db.query(Item)

    # Recovered items should not appear
    query = query.filter(
        Item.status != "recovered"
    )

    if status_filter:
        query = query.filter(
            Item.status == status_filter
        )

    if category:
        query = query.filter(
            Item.category == category
        )

    if color:
        query = query.filter(
            Item.color == color
        )

    if brand:
        query = query.filter(
            Item.brand == brand
        )

    pg_items = {
        str(item.id): item
        for item in query.all()
        if str(item.id) not in seen_ids
    }

    scored = []

    # -----------------------------
    # CALCULATE SIMILARITY
    # -----------------------------

    for item_id, item in pg_items.items():

        text_score = None
        image_score = None

        # -------------------------
        # TEXT SIMILARITY
        # -------------------------

        if query_text_embedding:

            stored_text = r.get(
                f"{VECTOR_KEY}:text:{item_id}"
            )

            if stored_text:

                stored_text_vec = json.loads(
                    stored_text
                )

                text_score = cosine_similarity(
                    query_text_embedding,
                    stored_text_vec
                )

        # -------------------------
        # IMAGE SIMILARITY
        # -------------------------

        if query_image_embedding:

            stored_image = r.get(
                f"{VECTOR_KEY}:image:{item_id}"
            )

            if stored_image:

                stored_image_vec = json.loads(
                    stored_image
                )

                image_score = cosine_similarity(
                    query_image_embedding,
                    stored_image_vec
                )

        # -------------------------
        # COMBINE SCORES
        # -------------------------

        if (
            text_score is not None
            and image_score is not None
        ):

            confidence = (
                0.5 * text_score
                + 0.5 * image_score
            )

        elif image_score is not None:

            confidence = image_score

        elif text_score is not None:

            confidence = text_score

        else:

            # No vector available
            continue

        # -------------------------
        # CONFIDENCE FILTER
        # -------------------------

        if confidence >= confidence_min:

            scored.append(
                (
                    item_id,
                    confidence
                )
            )

    # -----------------------------
    # SORT BY BEST MATCH
    # -----------------------------

    scored.sort(
        key=lambda x: x[1],
        reverse=True
    )

    total = len(scored)

    # -----------------------------
    # PAGINATION
    # -----------------------------

    start = int(cursor) if cursor else 0

    end = start + limit

    page = scored[start:end]

    next_cursor = (
        str(end)
        if end < total
        else None
    )

    # -----------------------------
    # BUILD RESPONSE
    # -----------------------------

    matches = []

    for item_id, confidence in page:

        item = pg_items[item_id]

        matches.append(
            SearchMatch(
                item_id=item_id,
                title=item.title,
                description=(
                    item.description
                    or item.ai_description
                ),
                image_path=item.image_path,
                status=item.status,
                confidence=round(
                    confidence,
                    3
                ),
                category=item.category,
                color=item.color,
                brand=item.brand,
                drop_location=item.drop_location,
                pickup_lat=item.pickup_lat,
                pickup_lng=item.pickup_lng,
                verification_question=(
                    item.verification_question
                ),
            )
        )

    db.close()

    return SearchResponse(
        matches=matches,
        next_cursor=next_cursor,
        total_estimate=total,
    )


# =================================
# COSINE SIMILARITY
# =================================

def cosine_similarity(
    a: list[float],
    b: list[float]
) -> float:

    dot = sum(
        x * y
        for x, y in zip(a, b)
    )

    na = math.sqrt(
        sum(x * x for x in a)
    )

    nb = math.sqrt(
        sum(x * x for x in b)
    )

    if not na or not nb:
        return 0.0

    return dot / (na * nb)