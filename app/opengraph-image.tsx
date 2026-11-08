import { ImageResponse } from "next/og";

export const alt = "SAMPeer Studio by Syed Mukheeth | Get noticed. Remembered. Chosen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori renders this card outside the page and cannot read CSS custom
   properties, so the theme is copied here as literals. They mirror the dark
   tokens in app/globals.css: canvas, ink, muted, accent-text and the ribbon
   sweep. Change both together. */
const CANVAS = "#090715";
const INK = "#f2ecf6";
const MUTED = "#aea6be";
const ACCENT_TEXT = "#c67eff";
const RIBBON = "linear-gradient(100deg, #540db5 0%, #8425f1 45%, #e994ff 100%)";

/** On-brand dark OG card. Default font: satori needs TTF/OTF, not woff2. */
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
        {/* the logo's sweep, the same single use as the site's footer rule */}
        <div style={{ height: 10, width: "100%", backgroundImage: RIBBON }} />
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
