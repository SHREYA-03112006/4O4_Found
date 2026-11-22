from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database.postgres import get_db
from services.auth_service import (
    create_access_token, create_refresh_token, decode_token,
    verify_password, hash_password,
)
from services.org_service import (
    create_org, create_member, get_member_by_email, get_member_by_id,
    get_member_by_google_id, get_org_by_id, update_email_consent,
)
from schemas.organization import (
    OrgCreate, OrgRegister, OrgLogin, TokenResponse, RefreshRequest,
    OrgMemberResponse, OrgUpdate,
)
from middleware.auth import require_org_admin, require_org_member
from models.organization import Organization
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
import httpx

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(data: OrgRegister, db: Session = Depends(get_db)):
    existing = get_member_by_email(db, data.admin_email)
    if existing:
        raise HTTPException(400, "Email already registered")

    org = create_org(db, OrgCreate(name=data.org_name, subdomain=data.subdomain))
    member = create_member(db, type("", (), dict(
        org_id=org.id,
        email=data.admin_email,
        password=data.admin_password,
        display_name=data.display_name,
        role="admin",
        email_consent=data.email_consent,
    ))())

    return {
        "org_id": str(org.id),
        "member_id": str(member.id),
        "message": "Organization created successfully",
    }


@router.post("/login", response_model=TokenResponse)
def login(data: OrgLogin, db: Session = Depends(get_db)):
    member = get_member_by_email(db, data.email)
    if not member or not member.password_hash:
        raise HTTPException(401, "Invalid email or password")
    if not verify_password(data.password, member.password_hash):
        raise HTTPException(401, "Invalid email or password")
    if not member.is_active:
        raise HTTPException(403, "Account is disabled")

    access = create_access_token(str(member.id), str(member.org_id), member.role)
    refresh = create_refresh_token(str(member.id), str(member.org_id))

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        org_id=member.org_id,
        member_id=member.id,
        role=member.role,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid or expired refresh token")

    member = get_member_by_id(db, payload["sub"])
    if not member or not member.is_active:
        raise HTTPException(401, "Member not found or disabled")

    access = create_access_token(str(member.id), str(member.org_id), member.role)
    new_refresh = create_refresh_token(str(member.id), str(member.org_id))

    return TokenResponse(
        access_token=access,
        refresh_token=new_refresh,
        org_id=member.org_id,
        member_id=member.id,
        role=member.role,
    )


@router.get("/me", response_model=OrgMemberResponse)
def me(user: dict = Depends(require_org_member), db: Session = Depends(get_db)):
    member = get_member_by_id(db, user["member_id"])
    if not member:
        raise HTTPException(404, "Member not found")
    return member


@router.post("/consent")
def consent(
    email_consent: bool,
    request: Request,
    user: dict = Depends(require_org_member),
    db: Session = Depends(get_db),
):
    ip = request.client.host if request.client else ""
    ok = update_email_consent(db, user["member_id"], email_consent, ip)
    if not ok:
        raise HTTPException(404, "Member not found")
    return {"status": "updated", "email_consent": email_consent}


@router.put("/org", response_model=OrgUpdate)
def update_org(
    data: OrgUpdate,
    user: dict = Depends(require_org_admin),
    db: Session = Depends(get_db),
):
    from services.org_service import update_org as update_org_svc
    org = update_org_svc(db, user["org_id"], data.model_dump(exclude_none=True))
    if not org:
        raise HTTPException(404, "Organization not found")
    return data


@router.post("/google")
async def google_auth(code: str, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(500, "Google OAuth not configured")

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": "",
                "grant_type": "authorization_code",
            },
        )
        if token_res.status_code != 200:
            raise HTTPException(400, "Failed to exchange Google code")

        tokens = token_res.json()
        id_token = tokens.get("id_token")

        userinfo_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        if userinfo_res.status_code != 200:
            raise HTTPException(400, "Failed to get Google user info")

        userinfo = userinfo_res.json()
        google_id = userinfo["sub"]
        email = userinfo["email"]

    member = get_member_by_google_id(db, google_id)
    if member:
        if not member.is_active:
            raise HTTPException(403, "Account is disabled")
    else:
        org = db.query(Organization).filter(
            Organization.email_domain == email.split("@")[1]
        ).first()
        if not org:
            raise HTTPException(403, "No organization found for this email domain")
        member_data = type("", (), dict(
            org_id=org.id,
            email=email,
            password=None,
            display_name=userinfo.get("name"),
            role="member",
            email_consent=True,
        ))()
        member = create_member(db, member_data)
        member.google_id = google_id
        db.commit()

    access = create_access_token(str(member.id), str(member.org_id), member.role)
    refresh = create_refresh_token(str(member.id), str(member.org_id))

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        org_id=member.org_id,
        member_id=member.id,
        role=member.role,
    )