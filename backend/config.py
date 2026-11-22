import os
from dotenv import load_dotenv

load_dotenv()

DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./404_found.db" if DEV_MODE else "postgresql://postgres:postgres@localhost:5432/404_found",
)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_IMAGE_SIZE = int(os.getenv("MAX_IMAGE_SIZE", "5242880"))
TOKEN_BUDGET_PER_SEARCH = int(os.getenv("TOKEN_BUDGET_PER_SEARCH", "1000"))
TOKEN_BUDGET_PER_AI_CALL = int(os.getenv("TOKEN_BUDGET_PER_AI_CALL", "500"))

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production" if DEV_MODE else "")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
JWT_REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7"))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
ORG_DEFAULT_THEME = os.getenv("ORG_DEFAULT_THEME", "school")