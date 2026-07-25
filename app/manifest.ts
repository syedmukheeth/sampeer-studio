import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SAMPeer Studio",
    short_name: "SAMPeer",
    description: "The growth layer your startup is missing.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0b",
    theme_color: "#0a0b0b",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
