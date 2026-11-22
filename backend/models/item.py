import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from database.postgres import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String(10), nullable=False)
    category = Column(String(50))
    color = Column(String(50))
    brand = Column(String(100))
    title = Column(String(200))
    description = Column(Text)
    ai_description = Column(Text)
    image_path = Column(String(500))
    location_description = Column(Text)
    drop_location = Column(Text)
    pickup_lat = Column(Float)
    pickup_lng = Column(Float)
    finder_contact = Column(Text)
    contact_message = Column(Text)
    verification_token = Column(String(64))
    verification_question = Column(Text)
    verification_answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
