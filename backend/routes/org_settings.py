from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database.postgres import get_db
from middleware.auth import require_org_admin
from services.org_service import update_org, get_org_by_id
from schemas.organization import OrgUpdate
from config import UPLOAD_DIR
import os
import json

router = APIRouter(prefix="/org/settings", tags=["org_settings"])


@router.get("")
def get_settings(user: dict = Depends(require_org_admin), db: Session = Depends(get_db)):
    org = get_org_by_id(db, user["org_id"])
    if not org:
        raise HTTPException(404, "Organization not found")
    return {
        "name": org.name,
        "subdomain": org.subdomain,
        "email_domain": org.email_domain,
        "logo_url": org.logo_url,
        "favicon_url": org.favicon_url,
        "theme_id": org.theme_id,
        "brand_primary_color": org.brand_primary_color,
        "brand_secondary_color": org.brand_secondary_color,
        "custom_css": org.custom_css,
        "map_provider": org.map_provider,
        "map_tile_url": org.map_tile_url,
        "map_default_lat": org.map_default_lat,
        "map_default_lng": org.map_default_lng,
        "map_default_zoom": org.map_default_zoom,
    }


@router.put("")
def update_settings(data: OrgUpdate, user: dict = Depends(require_org_admin), db: Session = Depends(get_db)):
    org = update_org(db, user["org_id"], data.model_dump(exclude_none=True))
    if not org:
        raise HTTPException(404, "Organization not found")
    return {"status": "updated"}


@router.post("/logo")
async def upload_logo(file: UploadFile = File(...), user: dict = Depends(require_org_admin), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
    path = os.path.join(UPLOAD_DIR, f"org_{user['org_id']}_logo{ext}")
    content = await file.read()
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with open(path, "wb") as f:
        f.write(content)
    update_org(db, user["org_id"], {"logo_url": f"/uploads/org_{user['org_id']}_logo{ext}"})
    return {"logo_url": f"/uploads/org_{user['org_id']}_logo{ext}"}


@router.post("/favicon")
async def upload_favicon(file: UploadFile = File(...), user: dict = Depends(require_org_admin), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1] if file.filename else ".ico"
    path = os.path.join(UPLOAD_DIR, f"org_{user['org_id']}_favicon{ext}")
    content = await file.read()
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with open(path, "wb") as f:
        f.write(content)
    update_org(db, user["org_id"], {"favicon_url": f"/uploads/org_{user['org_id']}_favicon{ext}"})
    return {"favicon_url": f"/uploads/org_{user['org_id']}_favicon{ext}"}


@router.get("/preview")
def preview_theme(theme: str, user: dict = Depends(require_org_admin)):
    theme_path = os.path.join("themes", f"{theme}.json")
    if not os.path.exists(theme_path):
        raise HTTPException(404, "Theme not found")
    with open(theme_path) as f:
        return json.load(f)