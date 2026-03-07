import Redis from "ioredis";

const REDIS_DEFAULT_CACHE_TIME = 5 * 60;

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("Connected to Redis"));

export function saveToCache(
  key: string,
  value: string,
  ttl: number = REDIS_DEFAULT_CACHE_TIME,
) {
  return redis.setex(key, ttl, value);
}

export async function saveToCacheVoid(
  key: string,
  value: string,
  ttl: number = REDIS_DEFAULT_CACHE_TIME,
) {
  await redis.setex(key, ttl, value);
}

export async function getFromCache(key: string): Promise<string | null> {
  return redis.get(key);
}
