import { ImageResponse } from "next/og";

export const alt = "SAMPeer Studio | The growth layer your startup is missing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** On-brand paper OG card. Default font (Clash is woff2, not satori-friendly). */
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
          background: "#fafaf8",
          color: "#1a1a19",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#6e6e69", letterSpacing: -0.5 }}>
          SAMPeer Studio
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
          <span style={{ color: "#3f6152" }}>They go unnoticed.</span>
        </div>
        <div style={{ fontSize: 26, color: "#6e6e69" }}>
          The growth layer your startup is missing.
        </div>
      </div>
    ),
    size,
  );
}
