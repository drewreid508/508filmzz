import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card. Built from primitives so it needs no remote assets. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Viewfinder brackets */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 48,
            width: 56,
            height: 56,
            borderTop: "3px solid #1e90ff",
            borderLeft: "3px solid #1e90ff",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 48,
            width: 56,
            height: 56,
            borderBottom: "3px solid #1e90ff",
            borderRight: "3px solid #1e90ff",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.42)",
            textTransform: "uppercase",
          }}
        >
          508 Filmzz
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            ONE VISION.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            EVERY DETAIL.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 26,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          <div style={{ display: "flex", width: 64, height: 3, background: "#1e90ff" }} />
          Premium cinematic films for automotive, businesses, and outdoor brands
        </div>
      </div>
    ),
    size
  );
}
