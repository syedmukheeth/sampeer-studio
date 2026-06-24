import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** On-brand favicon: indigo S-mark on off-black. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#6c63ff",
          fontSize: 44,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 14,
        }}
      >
        S
      </div>
    ),
    size,
  );
}
