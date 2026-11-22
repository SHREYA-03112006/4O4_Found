from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.auth_service import decode_token, verify_password
from database.postgres import get_db
from sqlalchemy.orm import Session
from models.organization import OrgApiKey

bearer_scheme = HTTPBearer(auto_error=False)


def _make_auth_dependency(roles: list[str] | None):
    def dependency(request: Request, credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)):
        token = None
        if credentials:
            token = credentials.credentials
        if not token:
            token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(401, "Not authenticated")

        payload = decode_token(token)
        if payload is None:
            raise HTTPException(401, "Invalid or expired token")
        if payload.get("type") != "access":
            raise HTTPException(401, "Invalid token type")

        if roles and payload.get("role") not in roles:
            raise HTTPException(403, "Insufficient permissions")

        return {
            "member_id": payload["sub"],
            "org_id": payload["org_id"],
            "role": payload["role"],
        }
    return dependency


require_org_member = _make_auth_dependency(None)
require_org_admin = _make_auth_dependency(["admin"])


def require_api_key(db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)):
    if not credentials:
        raise HTTPException(401, "API key required")
    keys = db.query(OrgApiKey).filter(OrgApiKey.is_active == True).all()
    for key in keys:
        if verify_password(credentials.credentials, key.key_hash):
            return {"org_id": str(key.org_id), "key_name": key.name, "permissions": key.permissions}
    raise HTTPException(401, "Invalid API key")