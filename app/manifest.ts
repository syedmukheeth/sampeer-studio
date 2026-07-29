import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SAMPeer Studio",
    short_name: "SAMPeer",
    description: "The growth layer your startup is missing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f9",
    theme_color: "#f7f5f9",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
