import { ImageResponse } from "next/og";

export const alt = "Sampeer Studio | The growth layer your startup is missing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** On-brand dark OG card. Default font (Clash is woff2, not satori-friendly). */
export default function OG() {
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
          color: "#f5f5f0",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#8a8a85", letterSpacing: -0.5 }}>
          Sampeer Studio
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          <span>Most startups don&apos;t fail.</span>
          <span style={{ color: "#6c63ff" }}>They go unnoticed.</span>
        </div>
        <div style={{ fontSize: 26, color: "#8a8a85" }}>
          The growth layer your startup is missing.
        </div>
      </div>
    ),
    size,
  );
}
