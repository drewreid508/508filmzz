/**
 * The first-month offer, in one place.
 *
 * Nothing anywhere hard-codes a discounted figure. Prices are written once, as
 * the headline monthly rate, and every reduced number on the site is derived
 * from that at build time — so raising a package price can never leave a stale
 * "first month" figure behind it on another page.
 */

/**
 * The promo code, uppercase. Comparison is case- and space-insensitive, so a
 * phone keyboard's autocapitalise and a stray trailing space both still work —
 * a code that fails because someone typed " first15" is a lost booking.
 */
export const PROMO_CODE = "FIRST15";

/** True for anything a person plausibly meant as the code. */
export function isPromoCode(input: string): boolean {
  return input.replace(/[\s-]/g, "").toUpperCase() === PROMO_CODE;
}

/** Percentage off the first purchase. */
export const FIRST_MONTH_DISCOUNT = 0.15;

/** Months a monthly package runs before it can go month-to-month. */
export const MINIMUM_MONTHS = 3;

/**
 * Pulls the number out of a price string and applies the discount, preserving
 * the way the original was written.
 *
 * Prices are strings — "$700+", "$1,000+" — because they are starting points
 * rather than quotes, and the trailing "+" is what says so. That has to survive
 * the arithmetic, or the discounted figure reads as an exact price and invites
 * an argument on the invoice.
 *
 * Returns null for anything with no number in it, which is how the custom tier
 * ("Custom quote") opts out without a special case at the call site.
 */
export function discountedPrice(price: string | null): string | null {
  if (!price) return null;

  const match = /([\d,]+(?:\.\d+)?)/.exec(price);
  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;

  const reduced = Math.round(value * (1 - FIRST_MONTH_DISCOUNT));

  // Rebuild from the original so "$" and a trailing "+" come back unchanged.
  return price.replace(match[1], reduced.toLocaleString("en-US"));
}

/** "15%" — written once, so the copy cannot drift from the arithmetic. */
export const DISCOUNT_LABEL = `${Math.round(FIRST_MONTH_DISCOUNT * 100)}%`;

/**
 * The three figures a promo panel needs, from a price string.
 *
 * Returns null when there is no number to work from — a custom quote — which is
 * how the custom tier opts out without a special case at every call site.
 *
 * Cents are kept only when they exist: a 15% cut of $750 is $637.50 and writing
 * it as $638 would be a different number from the one on the invoice.
 */
export function discountBreakdown(price: string | null): {
  original: string;
  saving: string;
  total: string;
} | null {
  if (!price) return null;
  const match = /([\d,]+(?:\.\d+)?)/.exec(price);
  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;

  const saving = value * FIRST_MONTH_DISCOUNT;
  const total = value - saving;

  const money = (n: number) =>
    n % 1 === 0
      ? n.toLocaleString("en-US")
      : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return {
    original: price,
    saving: `$${money(saving)}`,
    total: price.replace(match[1], money(total)),
  };
}
