from database.redis import get_redis

TRAY_TTL = 172800

def get_tray(session_id: str) -> list[str]:
    r = get_redis()
    members = r.smembers(f"session:{session_id}:tray")
    return list(members)

def add_to_tray(session_id: str, item_id: str):
    r = get_redis()
    key = f"session:{session_id}:tray"
    r.sadd(key, item_id)
    r.expire(key, TRAY_TTL)

def remove_from_tray(session_id: str, item_id: str):
    r = get_redis()
    r.srem(f"session:{session_id}:tray", item_id)