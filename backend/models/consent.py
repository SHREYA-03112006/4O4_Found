import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from database.postgres import Base


class EmailConsentLog(Base):
    __tablename__ = "email_consent_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = Column(UUID(as_uuid=True), ForeignKey("org_members.id"), nullable=False)
    previous_value = Column(Boolean)
    new_value = Column(Boolean, nullable=False)
    changed_by_ip = Column(String(45))
    created_at = Column(DateTime, default=datetime.utcnow)