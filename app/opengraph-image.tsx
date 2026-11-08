import { ImageResponse } from "next/og";

export const alt = "SAMPeer Studio by Syed Mukheeth | Get noticed. Remembered. Chosen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori renders this card outside the page and cannot read CSS custom
   properties, so the theme is copied here as literals. They mirror the night
   tokens in app/globals.css (.night): canvas, ink, muted and the orange
   accent. Change both together. */
const CANVAS = "#0e0f11";
const INK = "#f3f3f1";
const MUTED = "#a9aaad";
const ACCENT_TEXT = "#ff6a33";
const RULE = "#2b2c2f";

/** On-brand night OG card. Default font: satori needs TTF/OTF, not woff2. */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: CANVAS,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        {/* the hairline that opens every chapter on the site */}
        <div style={{ height: 1, width: "100%", background: RULE }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 80,
          }}
        >
          <div style={{ fontSize: 28, color: MUTED, letterSpacing: -0.5 }}>
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
            <span style={{ color: ACCENT_TEXT }}>Chosen.</span>
          </div>
          <div style={{ fontSize: 26, color: MUTED }}>
            Websites, automation and founder brands, by Syed Mukheeth
          </div>
        </div>
      </div>
    ),
    size,
  );
}
