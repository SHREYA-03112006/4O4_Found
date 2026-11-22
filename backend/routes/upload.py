import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from config import UPLOAD_DIR, MAX_IMAGE_SIZE

router = APIRouter(tags=["upload"])
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files are allowed")
    data = await file.read()
    if len(data) > MAX_IMAGE_SIZE:
        raise HTTPException(400, f"Image too large. Max {MAX_IMAGE_SIZE // 1024} KB")
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(data)
    return {"filename": filename, "path": path, "size": len(data)}