import json
import uuid
from sqlalchemy.orm import Session
from models.organization import Organization, OrgMember, OrgApiKey, OrgSession
from models.consent import EmailConsentLog
from schemas.organization import OrgCreate, OrgMemberCreate
from services.auth_service import hash_password, create_delegated_session_token
from datetime import datetime, timedelta, timezone


def _uid(val: str) -> uuid.UUID:
    return uuid.UUID(val) if isinstance(val, str) else val


def create_org(db: Session, data: OrgCreate) -> Organization:
    org = Organization(name=data.name, email_domain=data.email_domain, subdomain=data.subdomain)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


def get_org_by_subdomain(db: Session, subdomain: str) -> Organization | None:
    return db.query(Organization).filter(Organization.subdomain == subdomain).first()


def get_org_by_id(db: Session, org_id: str) -> Organization | None:
    return db.query(Organization).filter(Organization.id == _uid(org_id)).first()


def update_org(db: Session, org_id: str, data: dict) -> Organization | None:
    org = get_org_by_id(db, _uid(org_id))
    if not org:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(org, key, value)
    db.commit()
    db.refresh(org)
    return org


def create_member(db: Session, data: OrgMemberCreate) -> OrgMember:
    member = OrgMember(
        org_id=data.org_id,
        email=data.email,
        password_hash=hash_password(data.password) if data.password else None,
        display_name=data.display_name,
        role=data.role,
        email_consent=data.email_consent,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def get_member_by_email(db: Session, email: str) -> OrgMember | None:
    return db.query(OrgMember).filter(OrgMember.email == email).first()


def get_member_by_id(db: Session, member_id: str) -> OrgMember | None:
    return db.query(OrgMember).filter(OrgMember.id == _uid(member_id)).first()


def get_member_by_google_id(db: Session, google_id: str) -> OrgMember | None:
    return db.query(OrgMember).filter(OrgMember.google_id == google_id).first()


def create_api_key(db: Session, org_id: str, name: str, permissions: list[str]) -> tuple[OrgApiKey, str]:
    raw_key = create_delegated_session_token()
    key = OrgApiKey(org_id=_uid(org_id), key_hash=hash_password(raw_key), name=name, permissions=permissions)
    db.add(key)
    db.commit()
    db.refresh(key)
    return key, raw_key


def create_delegated_session(db: Session, org_id: str, external_user_id: str, session_metadata: dict | None, ttl: int) -> OrgSession:
    expires = datetime.now(timezone.utc) + timedelta(seconds=ttl)
    session = OrgSession(
        org_id=_uid(org_id),
        external_user_id=external_user_id,
        external_session_id=create_delegated_session_token(),
        session_metadata=json.dumps(session_metadata) if session_metadata else None,
        expires_at=expires,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def update_email_consent(db: Session, member_id: str, new_value: bool, ip: str = "") -> bool:
    member = get_member_by_id(db, member_id)
    if not member:
        return False
    old = member.email_consent
    member.email_consent = new_value
    log = EmailConsentLog(member_id=_uid(member_id), previous_value=old, new_value=new_value, changed_by_ip=ip)
    db.add(log)
    db.commit()
    return True