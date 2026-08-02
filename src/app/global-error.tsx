"use client";

/**
 * Last-resort boundary. Replaces the entire document when the root layout
 * itself throws, so it cannot rely on globals.css, fonts, the header, or any
 * component that might be the thing that broke — every style here is inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#1e90ff",
              margin: 0,
            }}
          >
            508 Filmzz
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 8vw, 3.5rem)",
              lineHeight: 1.05,
              margin: "1.25rem 0 0",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              margin: "1.25rem 0 0",
            }}
          >
            The site failed to load. Try again, or reach me directly on{" "}
            <a href="tel:+18649154071" style={{ color: "#1e90ff" }}>
              (864) 915-4071
            </a>
            .
          </p>
          <div
            style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}
          >
            <button
              onClick={reset}
              style={{
                background: "#fff",
                color: "#0a0a0a",
                border: 0,
                padding: "0.9rem 1.75rem",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/*
              A plain <a> is deliberate. global-error replaces the whole
              document because the root layout threw — the router that
              next/link depends on is exactly what may be broken. A hard
              navigation is the only reliable way out.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fff",
                padding: "0.9rem 1.75rem",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </div>
          {error.digest && (
            <p
              style={{
                marginTop: "2.5rem",
                fontSize: "0.7rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.36)",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
