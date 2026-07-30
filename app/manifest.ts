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
    // `/icon`, without the extension, 404s: the app/icon.png file convention
    // serves the route at its real filename. A manifest icon that fails to
    // download costs the install prompt its artwork.
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
