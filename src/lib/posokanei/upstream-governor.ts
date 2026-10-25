/**
 * Upstream Governor & Anti-Ban Protection for posokanei.gov.gr
 *
 * Enforces:
 * 1. Strict Outgoing Rate Limit: Minimum 800ms gap between consecutive requests to posokanei.gov.gr.
 * 2. Sequential Request Queue: Only 1 request in-flight at any time to prevent burst bans.
 * 3. Circuit Breaker: If posokanei.gov.gr returns HTTP 429, 403, or 503, immediately
 *    trips the breaker for 60 seconds. During this window, 0 requests are sent to the
 *    upstream government API, and cached/fallback data is served instantly.
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
    cooldownMs: 60 * 1000, // 60 seconds cooldown upon 429/403/503
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
    if (status === 429 || status === 403 || status === 503) {
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.openedAt = Date.now();
      this.circuitBreaker.lastFailureStatus = status;
      this.circuitBreaker.failureCount++;
      console.warn(
        `[Upstream Governor] Circuit breaker TRIPPED on HTTP ${status} from posokanei.gov.gr. Cooling down for ${this.circuitBreaker.cooldownMs / 1000}s to avoid IP ban.`
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
      const waitSec = this.getRemainingCooldownSeconds();
      console.info(
        `[Upstream Governor] Circuit breaker is OPEN (${waitSec}s remaining). Serving fallback for "${operationName}" without contacting posokanei.gov.gr.`
      );
      return fallbackAction();
    }

    // 2. Chain onto the sequential queue to prevent concurrent blasts
    return new Promise<T>((resolve, reject) => {
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
            // In case of network timeout or unexpected error, resolve with fallback
            console.warn(`[Upstream Governor] Operation "${operationName}" threw error:`, error);
            resolve(fallbackAction());
          }
        })
        .catch((err) => {
          console.error(`[Upstream Governor] Queue processing error:`, err);
          resolve(fallbackAction());
        });
    });
  }
}
