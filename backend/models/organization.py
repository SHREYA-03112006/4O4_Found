import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from database.postgres import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    email_domain = Column(String(100))
    subdomain = Column(String(100), unique=True)
    logo_url = Column(Text)
    favicon_url = Column(Text)
    theme_id = Column(String(50), default="default")
    brand_primary_color = Column(String(7))
    brand_secondary_color = Column(String(7))
    custom_css = Column(Text)
    map_provider = Column(String(20), default="openstreetmap")
    map_tile_url = Column(Text)
    map_default_lat = Column(String(20))
    map_default_lng = Column(String(20))
    map_default_zoom = Column(String(2), default="15")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OrgMember(Base):
    __tablename__ = "org_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255))
    google_id = Column(String(255))
    display_name = Column(String(200))
    role = Column(String(20), default="member")
    email_consent = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OrgApiKey(Base):
    __tablename__ = "org_api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    key_hash = Column(String(255), nullable=False)
    name = Column(String(100))
    permissions = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class OrgSession(Base):
    __tablename__ = "org_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    external_user_id = Column(String(255), nullable=False)
    external_session_id = Column(String(255))
    session_metadata = Column(Text)
    is_valid = Column(Boolean, default=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)