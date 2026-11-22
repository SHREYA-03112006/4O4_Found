import redis
from config import REDIS_URL, DEV_MODE

try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
except Exception:
    if DEV_MODE:
        from fakeredis import FakeRedis
        redis_client = FakeRedis(decode_responses=True)
    else:
        raise

def get_redis():
    return redis_client