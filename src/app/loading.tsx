/**
 * Route-level loading state.
 *
 * Almost every route here is prerendered static HTML, so this rarely shows —
 * it covers slow client-side navigations and the dynamic `/contact/success`
 * route. Deliberately quiet: a full-bleed spinner would fight the preloader
 * and read as a second intro.
 */
export default function Loading() {
  return (
    <div
      className="shell flex min-h-[70svh] items-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <span
          className="block h-px w-10 animate-pulse bg-accent"
          aria-hidden="true"
        />
        <span className="eyebrow">Loading</span>
      </div>
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
