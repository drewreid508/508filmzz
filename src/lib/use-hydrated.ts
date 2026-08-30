"use client";

import { useSyncExternalStore } from "react";

/** Nothing to subscribe to: the value flips once, at hydration, and never again. */
const subscribe = () => () => {};

/**
 * False in the prerendered HTML and through the first hydration pass, true once
 * React has taken over the page.
 *
 * Use it to disable anything whose only behaviour lives in JavaScript. The
 * booking form is the case that matters: it is fully rendered and typeable in
 * the static HTML, but `onSubmit` does not exist until hydration finishes. A
 * submit before that point falls through to the browser's native handler, which
 * — with no `method` or `action` — issues a GET to the same page and writes
 * every field into the query string.
 *
 * That loses the booking *and* puts the visitor's name, email, phone and
 * message into the URL, the browser history, and the Referer header of the next
 * request. The window is short, but it is longest on exactly the connection
 * that matters here: a phone on mobile data.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
