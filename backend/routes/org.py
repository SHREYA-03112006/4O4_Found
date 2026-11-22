from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.postgres import get_db
from middleware.auth import require_org_member, require_org_admin, require_api_key
from services.org_service import (
    create_delegated_session, get_org_by_id, update_org,
)
from services.auth_service import create_access_token
from schemas.organization import (
    SessionCreateRequest, SessionCreateResponse,
    SessionValidateRequest, SessionValidateResponse,
    OrgUpdate, OrgBrandingResponse,
)
from models.organization import OrgSession
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/org", tags=["org"])


@router.post("/sessions/create", response_model=SessionCreateResponse)
def create_session(data: SessionCreateRequest, auth: dict = Depends(require_api_key), db: Session = Depends(get_db)):
    session = create_delegated_session(db, auth["org_id"], data.external_user_id, data.metadata, data.ttl)
    return SessionCreateResponse(
        session_token=session.external_session_id,
        expires_at=session.expires_at,
    )


@router.post("/sessions/validate", response_model=SessionValidateResponse)
def validate_session(data: SessionValidateRequest, auth: dict = Depends(require_api_key), db: Session = Depends(get_db)):
    session = db.query(OrgSession).filter(
        OrgSession.external_session_id == data.session_token,
        OrgSession.is_valid == True,
    ).first()
    if not session:
        return SessionValidateResponse(valid=False)
    if session.expires_at and session.expires_at < datetime.now(timezone.utc):
        session.is_valid = False
        db.commit()
        return SessionValidateResponse(valid=False)
    return SessionValidateResponse(
        valid=True,
        external_user_id=session.external_user_id,
        metadata=session.session_metadata,
    )


@router.post("/sessions/revoke")
def revoke_session(data: SessionValidateRequest, auth: dict = Depends(require_api_key), db: Session = Depends(get_db)):
    session = db.query(OrgSession).filter(
        OrgSession.external_session_id == data.session_token,
    ).first()
    if session:
        session.is_valid = False
        db.commit()
    return {"status": "revoked"}


@router.get("/branding", response_model=OrgBrandingResponse)
def get_branding(auth: dict = Depends(require_api_key), db: Session = Depends(get_db)):
    org = get_org_by_id(db, auth["org_id"])
    if not org:
        raise HTTPException(404, "Organization not found")
    return OrgBrandingResponse(
        name=org.name,
        logo_url=org.logo_url,
        favicon_url=org.favicon_url,
        theme_id=org.theme_id,
        brand_primary_color=org.brand_primary_color,
        brand_secondary_color=org.brand_secondary_color,
        custom_css=org.custom_css,
        map_provider=org.map_provider,
        map_tile_url=org.map_tile_url,
        map_default_lat=org.map_default_lat,
        map_default_lng=org.map_default_lng,
        map_default_zoom=org.map_default_zoom,
    )


@router.get("/profile")
def get_profile(auth: dict = Depends(require_api_key), db: Session = Depends(get_db)):
    org = get_org_by_id(db, auth["org_id"])
    if not org:
        raise HTTPException(404, "Organization not found")
    return {"name": org.name, "subdomain": org.subdomain, "email_domain": org.email_domain}


@router.post("/items/report")
def report_item(auth: dict = Depends(require_api_key)):
    return {"status": "not_implemented", "message": "Coming soon"}


@router.get("/items")
def list_org_items(auth: dict = Depends(require_api_key)):
    return {"status": "not_implemented", "message": "Coming soon"}


@router.post("/claim")
def org_claim(auth: dict = Depends(require_api_key)):
    return {"status": "not_implemented", "message": "Coming soon"}


@router.get("/stats")
def org_stats(auth: dict = Depends(require_api_key)):
    return {"status": "not_implemented", "message": "Coming soon"}