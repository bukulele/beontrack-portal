/**
 * Simple in-memory rate limiter
 *
 * For production, consider using Redis or a dedicated rate limiting service
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanup();
  }

  /**
   * Check if a request is allowed
   * @param {string} identifier - Unique identifier (IP, email, userId, etc.)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} { allowed: boolean, retryAfter?: number }
   */
  check(identifier, maxRequests, windowMs) {
    const now = Date.now();
    const key = identifier;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key);

    // Remove expired requests
    const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    this.requests.set(key, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
      const oldestRequest = Math.min(...validRequests);
      const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000); // seconds
      return { allowed: false, retryAfter };
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return { allowed: true };
  }

  /**
   * Cleanup old entries every 10 minutes
   */
  cleanup() {
    setInterval(() => {
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour

      for (const [key, timestamps] of this.requests.entries()) {
        const validTimestamps = timestamps.filter(ts => now - ts < maxAge);
        if (validTimestamps.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, validTimestamps);
        }
      }
    }, 10 * 60 * 1000); // Every 10 minutes
  }

  /**
   * Clear all rate limit data for an identifier
   */
  reset(identifier) {
    this.requests.delete(identifier);
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  // OTP: 5 requests per 15 minutes per email
  OTP_SEND: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

  // File upload: 20 uploads per 5 minutes per user
  FILE_UPLOAD: { maxRequests: 20, windowMs: 5 * 60 * 1000 },

  // Document upload specifically: 10 per 5 minutes
  DOCUMENT_UPLOAD: { maxRequests: 10, windowMs: 5 * 60 * 1000 },
};

/**
 * Check rate limit for a specific action
 * @param {string} identifier - Unique identifier
 * @param {string} action - Action type (key from RATE_LIMITS)
 * @returns {Object} { allowed: boolean, retryAfter?: number }
 */
export function checkRateLimit(identifier, action) {
  const config = RATE_LIMITS[action];
  if (!config) {
    throw new Error(`Unknown rate limit action: ${action}`);
  }
  return rateLimiter.check(identifier, config.maxRequests, config.windowMs);
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier) {
  rateLimiter.reset(identifier);
}

export default rateLimiter;
