import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis client
// Note: These environment variables need to be set in .env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "http://localhost:8079",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "example_token",
})

// Create rate limiter
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
})

// Rate limit by IP
export async function rateLimitByIP(ip: string) {
  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    return { success, limit, reset, remaining }
  } catch (error) {
    // Fallback if Redis fails or is not configured
    console.warn("Rate limiting failed, allowing request:", error)
    return { success: true, limit: 10, reset: 0, remaining: 10 }
  }
}
