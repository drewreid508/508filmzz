/**
 * Every notification channel returns this shape and never throws. The booking
 * route runs all three independently so a failure in one (an expired Twilio
 * balance, a Sheets permission change) can never cost you the lead.
 */
export type ChannelResult = {
  ok: boolean;
  /** True when the channel isn't configured — not an error, just not set up. */
  skipped?: boolean;
  error?: string;
};

export const skipped = (why: string): ChannelResult => ({
  ok: false,
  skipped: true,
  error: why,
});

export const failed = (error: unknown): ChannelResult => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error),
});
