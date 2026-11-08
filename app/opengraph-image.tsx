import { ImageResponse } from "next/og";

export const alt = "SAMPeer Studio by Syed Mukheeth | Get noticed. Remembered. Chosen.";
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
          background: "#f7f5f9",
          color: "#19181c",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#6b6873", letterSpacing: -0.5 }}>
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
          <span>Get noticed. Remembered.</span>
          <span style={{ color: "#5b21b6" }}>Chosen.</span>
        </div>
        <div style={{ fontSize: 26, color: "#6b6873" }}>
          Websites · Automation · Founder brand, by Syed Mukheeth
        </div>
      </div>
    ),
    size,
  );
}
