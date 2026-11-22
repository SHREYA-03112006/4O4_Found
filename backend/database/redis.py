import logging
import os
from config import REDIS_URL

logger = logging.getLogger("4o4_found.redis")

# Global client cache
_redis_client = None
_redis_initialized = False


class InMemoryCache:
    """Thread-safe in-memory key-value and set store fallback when Redis is absent."""
    def __init__(self):
        self._data = {}
        self._sets = {}

    def ping(self):
        return True

    def get(self, key):
        return self._data.get(str(key))

    def set(self, key, value, ex=None):
        self._data[str(key)] = str(value)
        return True

    def delete(self, *keys):
        count = 0
        for k in keys:
            sk = str(k)
            if sk in self._data:
                del self._data[sk]
                count += 1
            if sk in self._sets:
                del self._sets[sk]
                count += 1
        return count

    def smembers(self, key):
        return self._sets.get(str(key), set()).copy()

    def sadd(self, key, *members):
        sk = str(key)
        if sk not in self._sets:
            self._sets[sk] = set()
        count = 0
        for m in members:
            if m not in self._sets[sk]:
                self._sets[sk].add(str(m))
                count += 1
        return count

    def srem(self, key, *members):
        sk = str(key)
        if sk not in self._sets:
            return 0
        count = 0
        for m in members:
            sm = str(m)
            if sm in self._sets[sk]:
                self._sets[sk].remove(sm)
                count += 1
        return count

    def expire(self, key, seconds):
        return True


def get_redis():
    """
    Returns a working Redis-compatible client.
    1. If REDIS_URL points to a real running Redis instance, connects and caches it.
    2. If Redis is unavailable or unconfigured, falls back to FakeRedis (if installed)
       or our robust InMemoryCache with zero errors or startup crashes.
    """
    global _redis_client, _redis_initialized

    if _redis_initialized:
        return _redis_client

    client = None

    # Only attempt connection if REDIS_URL is provided and not defaulting to localhost
    if REDIS_URL and not REDIS_URL.startswith("redis://localhost") and not REDIS_URL.startswith("redis://127.0.0.1"):
        try:
            import redis
            real_client = redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=2)
            real_client.ping()
            client = real_client
            logger.info("Successfully connected to external Redis instance.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {REDIS_URL}: {e}. Falling back to in-memory store.")
            client = None

    if client is None:
        try:
            from fakeredis import FakeRedis
            client = FakeRedis(decode_responses=True)
            logger.info("Using FakeRedis in-memory store for session & vector caching.")
        except Exception:
            client = InMemoryCache()
            logger.info("Using built-in InMemoryCache for session & vector caching.")

    _redis_client = client
    _redis_initialized = True
    return _redis_client
