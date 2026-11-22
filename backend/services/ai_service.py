import requests
import base64
import json
from config import HF_API_TOKEN, TOKEN_BUDGET_PER_AI_CALL

HF_HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}

DETECTION_MODEL = "facebook/detr-resnet-50"
CAPTION_MODEL = "Salesforce/blip-image-captioning-base"
EMBEDDING_MODEL = "sentence-transformers/clip-ViT-B-32-multilingual-v1"

def query_hf(model: str, payload: dict) -> dict:
    url = f"https://api-inference.huggingface.co/models/{model}"
    resp = requests.post(url, headers=HF_HEADERS, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()

def detect_objects(image_bytes: bytes):
    encoded = base64.b64encode(image_bytes).decode()
    result = query_hf(DETECTION_MODEL, {"inputs": encoded})
    objects = []
    for item in result:
        label = item.get("label", "object")
        score = item.get("score", 0)
        if score > 0.5:
            objects.append({"label": label, "confidence": round(score, 3)})
    return objects

def generate_caption(image_bytes: bytes):
    encoded = base64.b64encode(image_bytes).decode()
    result = query_hf(CAPTION_MODEL, {"inputs": encoded})
    if isinstance(result, list) and len(result) > 0:
        return result[0].get("generated_text", "")
    return ""

def get_embedding(image_bytes: bytes):
    encoded = base64.b64encode(image_bytes).decode()
    result = query_hf(EMBEDDING_MODEL, {
        "inputs": {"image": encoded},
        "parameters": {"pooling": "mean"}
    })
    if isinstance(result, list):
        return result[0]
    return result

def get_text_embedding(text: str):
    result = query_hf(EMBEDDING_MODEL, {"inputs": text})
    if isinstance(result, list):
        return result[0]
    return result