import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.postgres import get_db
from database.redis import get_redis
from models.item import Item
from models.message import ClaimMessage


VECTOR_KEY = "item:vector"

router = APIRouter(tags=["claim"])


class ClaimSubmit(BaseModel):
    item_id: str
    session_id: str
    claimant_message: str
    verification_answer: str | None = None


class ClaimVerify(BaseModel):
    claim_id: str
    verification_token: str | None = None


def _remove_item_vector(item_id: str):
    """Remove item vector from Redis when item is recovered."""
    r = get_redis()
    r.delete(f"{VECTOR_KEY}:{item_id}")


@router.post("/claim")
def submit_claim(
    data: ClaimSubmit,
    db: Session = Depends(get_db)
):
    # Convert item_id string to UUID
    try:
        item_uuid = uuid.UUID(data.item_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid item ID"
        )

    # Find item
    item = (
        db.query(Item)
        .filter(Item.id == item_uuid)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    # Create claim
    claim = ClaimMessage(
        item_id=item_uuid,
        session_id=data.session_id,
        claimant_message=data.claimant_message,
        verification_answer=data.verification_answer,
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)

    # Verify answer
    if item.verification_answer and data.verification_answer:

        submitted_answer = data.verification_answer.strip().lower()
        correct_answer = item.verification_answer.strip().lower()

        if submitted_answer == correct_answer:

            claim.status = "approved"
            item.status = "recovered"

            db.commit()

            # Remove recovered item from vector search
            _remove_item_vector(str(item.id))

            return {
                "status": "approved",
                "claim_id": str(claim.id),
                "drop_location": item.drop_location,
                "finder_contact": item.finder_contact,
            }

    # Answer incorrect or verification not available
    return {
        "status": "pending",
        "claim_id": str(claim.id)
    }


@router.get("/claim/{claim_id}/handoff")
def get_handoff(
    claim_id: str,
    db: Session = Depends(get_db)
):
    try:
        claim_uuid = uuid.UUID(claim_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid claim ID"
        )

    claim = (
        db.query(ClaimMessage)
        .filter(ClaimMessage.id == claim_uuid)
        .first()
    )

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    if claim.status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Claim not yet approved"
        )

    item = (
        db.query(Item)
        .filter(Item.id == claim.item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return {
        "drop_location": item.drop_location,
        "finder_contact": item.finder_contact,
        "claim_status": claim.status,
    }


@router.get("/items/{item_id}/finder-check")
def finder_check(
    item_id: str,
    session_id: str,
    db: Session = Depends(get_db)
):
    try:
        item_uuid = uuid.UUID(item_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid item ID"
        )

    item = (
        db.query(Item)
        .filter(Item.id == item_uuid)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    claims = (
        db.query(ClaimMessage)
        .filter(ClaimMessage.item_id == item_uuid)
        .all()
    )

    return {
        "has_claims": len(claims) > 0,
        "claim_count": len(claims),
        "item_status": item.status,
    }


@router.post("/claim/verify")
def verify_claim(
    data: ClaimVerify,
    db: Session = Depends(get_db)
):
    try:
        claim_uuid = uuid.UUID(data.claim_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid claim ID"
        )

    claim = (
        db.query(ClaimMessage)
        .filter(ClaimMessage.id == claim_uuid)
        .first()
    )

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    item = (
        db.query(Item)
        .filter(Item.id == claim.item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    if (
        data.verification_token
        and item.verification_token
    ):
        if data.verification_token == item.verification_token:

            claim.status = "approved"
            item.status = "recovered"

            db.commit()

            _remove_item_vector(str(item.id))

            return {
                "status": "approved",
                "drop_location": item.drop_location,
                "finder_contact": item.finder_contact,
            }

    return {
        "status": claim.status
    }