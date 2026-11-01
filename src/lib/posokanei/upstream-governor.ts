/**
 * Upstream Governor & Anti-Ban Protection for posokanei.gov.gr
 *
 * Enforces:
 * 1. Strict Outgoing Rate Limit: Minimum 800ms gap between consecutive requests to posokanei.gov.gr.
 * 2. Sequential Request Queue: Only 1 request in-flight at any time to prevent burst bans.
 * 3. Circuit Breaker: If posokanei.gov.gr returns HTTP 429, 403, or 503, immediately
 *    trips the breaker (30 minutes on 403 cloud geo-block, 60 seconds on 429/503).
 *    During this window, 0 requests are sent to the upstream government API, and cached/fallback data is served instantly.
 */

interface CircuitBreakerState {
  isOpen: boolean;
  openedAt: number;
  cooldownMs: number;
  lastFailureStatus?: number;
  failureCount: number;
}

export class UpstreamGovernor {
  private static lastRequestTime = 0;
  private static readonly MIN_INTERVAL_MS = 800; // 800ms minimum interval (~1.25 req/sec max)
  private static executionQueue: Promise<void> = Promise.resolve();

  private static circuitBreaker: CircuitBreakerState = {
    isOpen: false,
    openedAt: 0,
    cooldownMs: 60 * 1000,
    failureCount: 0,
  };

  /**
   * Check if circuit breaker is currently open (tripped)
   */
  public static isCircuitOpen(): boolean {
    if (!this.circuitBreaker.isOpen) return false;

    const now = Date.now();
    const elapsed = now - this.circuitBreaker.openedAt;

    if (elapsed >= this.circuitBreaker.cooldownMs) {
      // Cooldown expired, half-open: allow next request to test
      this.circuitBreaker.isOpen = false;
      this.circuitBreaker.lastFailureStatus = undefined;
      return false;
    }

    return true;
  }

  /**
   * Get remaining cooldown time in seconds if circuit is open
   */
  public static getRemainingCooldownSeconds(): number {
    if (!this.circuitBreaker.isOpen) return 0;
    const elapsed = Date.now() - this.circuitBreaker.openedAt;
    const remaining = Math.max(0, this.circuitBreaker.cooldownMs - elapsed);
    return Math.ceil(remaining / 1000);
  }

  /**
   * Report an upstream response status. If 429/403/503, trips the circuit breaker.
   */
  public static reportUpstreamStatus(status: number): void {
    if (status === 403) {
      // Cloud datacenter IP geo-block (e.g., Vercel AWS Lambda): cool down for 30 minutes
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.openedAt = Date.now();
      this.circuitBreaker.cooldownMs = 30 * 60 * 1000;
      this.circuitBreaker.lastFailureStatus = status;
      this.circuitBreaker.failureCount++;
      console.info(
        `[Upstream Governor] Upstream posokanei.gov.gr returned HTTP 403 (geo-fenced). Serving verified local catalog for 30m.`
      );
    } else if (status === 429 || status === 503) {
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.openedAt = Date.now();
      this.circuitBreaker.cooldownMs = 60 * 1000;
      this.circuitBreaker.lastFailureStatus = status;
      this.circuitBreaker.failureCount++;
      console.info(
        `[Upstream Governor] Circuit breaker active on HTTP ${status} from posokanei.gov.gr. Cooling down for 60s.`
      );
    } else if (status >= 200 && status < 300) {
      this.circuitBreaker.failureCount = 0;
    }
  }

  /**
   * Queues an execution with sequential execution and rate limiting.
   * If the circuit breaker is open, immediately invokes fallbackFn without contacting posokanei.gov.gr.
   */
  public static async execute<T>(
    operationName: string,
    action: () => Promise<T>,
    fallbackAction: () => Promise<T> | T
  ): Promise<T> {
    // 1. If circuit breaker is open, avoid contacting upstream completely
    if (this.isCircuitOpen()) {
      return fallbackAction();
    }

    // 2. Chain onto the sequential queue to prevent concurrent blasts
    return new Promise<T>((resolve) => {
      this.executionQueue = this.executionQueue
        .then(async () => {
          // Double-check circuit breaker inside queue
          if (this.isCircuitOpen()) {
            resolve(fallbackAction());
            return;
          }

          // Enforce minimum gap between consecutive upstream calls
          const now = Date.now();
          const elapsed = now - this.lastRequestTime;
          if (elapsed < this.MIN_INTERVAL_MS) {
            const delay = this.MIN_INTERVAL_MS - elapsed;
            await new Promise((r) => setTimeout(r, delay));
          }

          this.lastRequestTime = Date.now();

          try {
            const result = await action();
            resolve(result);
          } catch (error) {
            console.info(`[Upstream Governor] Operation "${operationName}" using local fallback:`, error);
            resolve(fallbackAction());
          }
        })
        .catch(() => {
          resolve(fallbackAction());
        });
    });
  }
}
