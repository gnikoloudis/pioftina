export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message || "Assertion failed: condition is false");
  }
}

export function assertEquals<T>(actual: T, expected: T, message?: string): void {
  const isMatch =
    actual === expected ||
    JSON.stringify(actual) === JSON.stringify(expected);

  if (!isMatch) {
    const defaultMsg = `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`;
    throw new AssertionError(message ? `${message} (${defaultMsg})` : defaultMsg);
  }
}

export function assertApproxEquals(
  actual: number,
  expected: number,
  tolerance: number = 0.01,
  message?: string
): void {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    const defaultMsg = `Expected ~${expected} (±${tolerance}), but got ${actual} (diff: ${diff.toFixed(4)})`;
    throw new AssertionError(message ? `${message} (${defaultMsg})` : defaultMsg);
  }
}

export function assertInRange(
  val: number,
  min: number,
  max: number,
  message?: string
): void {
  if (val < min || val > max) {
    const defaultMsg = `Expected value between ${min} and ${max}, but got ${val}`;
    throw new AssertionError(message ? `${message} (${defaultMsg})` : defaultMsg);
  }
}

export function assertContains(
  container: string | any[],
  item: any,
  message?: string
): void {
  let contains = false;
  if (typeof container === "string") {
    contains = container.includes(String(item));
  } else if (Array.isArray(container)) {
    contains = container.some((elem) => elem === item || JSON.stringify(elem) === JSON.stringify(item));
  }

  if (!contains) {
    const defaultMsg = `Expected container to contain ${JSON.stringify(item)}`;
    throw new AssertionError(message ? `${message} (${defaultMsg})` : defaultMsg);
  }
}

export async function assertThrows(
  fn: () => Promise<any> | any,
  message?: string
): Promise<void> {
  let threw = false;
  try {
    await fn();
  } catch (_) {
    threw = true;
  }
  if (!threw) {
    throw new AssertionError(message || "Expected function to throw an error, but it did not");
  }
}
