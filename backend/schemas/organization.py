from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class OrgCreate(BaseModel):
    name: str
    email_domain: Optional[str] = None
    subdomain: Optional[str] = None
    theme_id: Optional[str] = "default"
    brand_primary_color: Optional[str] = None
    brand_secondary_color: Optional[str] = None


class OrgResponse(BaseModel):
    id: UUID
    name: str
    email_domain: Optional[str]
    subdomain: Optional[str]
    logo_url: Optional[str]
    favicon_url: Optional[str]
    theme_id: str
    brand_primary_color: Optional[str]
    brand_secondary_color: Optional[str]
    map_provider: str
    map_tile_url: Optional[str]
    map_default_lat: Optional[str]
    map_default_lng: Optional[str]
    map_default_zoom: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OrgUpdate(BaseModel):
    name: Optional[str] = None
    email_domain: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    theme_id: Optional[str] = None
    brand_primary_color: Optional[str] = None
    brand_secondary_color: Optional[str] = None
    custom_css: Optional[str] = None
    map_provider: Optional[str] = None
    map_tile_url: Optional[str] = None


class OrgMemberCreate(BaseModel):
    org_id: UUID
    email: str
    password: Optional[str] = None
    display_name: Optional[str] = None
    role: Optional[str] = "member"
    email_consent: Optional[bool] = True


class OrgMemberResponse(BaseModel):
    id: UUID
    org_id: UUID
    email: str
    display_name: Optional[str]
    role: str
    email_consent: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OrgLogin(BaseModel):
    email: str
    password: str


class OrgRegister(BaseModel):
    org_name: str
    admin_email: str
    admin_password: str
    display_name: Optional[str] = None
    email_consent: Optional[bool] = True
    subdomain: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    org_id: UUID
    member_id: UUID
    role: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ApiKeyCreate(BaseModel):
    name: str
    permissions: Optional[list[str]] = ["read"]


class ApiKeyResponse(BaseModel):
    id: UUID
    name: str
    permissions: list[str]
    is_active: bool
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class SessionCreateRequest(BaseModel):
    external_user_id: str
    metadata: Optional[dict] = None
    ttl: Optional[int] = 3600


class SessionCreateResponse(BaseModel):
    session_token: str
    expires_at: datetime


class SessionValidateRequest(BaseModel):
    session_token: str


class SessionValidateResponse(BaseModel):
    valid: bool
    external_user_id: Optional[str]
    metadata: Optional[dict]


class OrgBrandingResponse(BaseModel):
    name: str
    logo_url: Optional[str]
    favicon_url: Optional[str]
    theme_id: str
    brand_primary_color: Optional[str]
    brand_secondary_color: Optional[str]
    custom_css: Optional[str]
    map_provider: str
    map_tile_url: Optional[str]
    map_default_lat: Optional[str]
    map_default_lng: Optional[str]
    map_default_zoom: str