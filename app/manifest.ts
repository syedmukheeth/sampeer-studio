import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SAMPeer Studio",
    short_name: "SAMPeer",
    description: "The growth layer your startup is missing.",
    start_url: "/",
    display: "standalone",
    // Mirror the night canvas (.night --color-canvas, the hero the app opens
    // on). A manifest is static JSON and cannot read CSS custom properties,
    // so these are the sanctioned literal copies.
    background_color: "#0e0f11",
    theme_color: "#0e0f11",
    // `/icon`, without the extension, 404s: the app/icon.png file convention
    // serves the route at its real filename. A manifest icon that fails to
    // download costs the install prompt its artwork.
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
