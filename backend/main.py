from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database.postgres import Base, engine
from models.item import Item
from models.message import ClaimMessage
from models.organization import Organization, OrgMember, OrgApiKey, OrgSession
from models.consent import EmailConsentLog
from routes.items import router as items_router
from routes.search import router as search_router
from routes.claim import router as claim_router
from routes.upload import router as upload_router
from routes.htmx import router as htmx_router
from routes.auth import router as auth_router
from routes.org import router as org_router
from routes.org_settings import router as org_settings_router
from config import UPLOAD_DIR
import os

app = FastAPI(title="4O4_Found API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(claim_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(htmx_router)
app.include_router(auth_router)
app.include_router(org_router)
app.include_router(org_settings_router)

os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/api/health")
def health():
    return {"status": "ok"}