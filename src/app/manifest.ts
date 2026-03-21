import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parla",
    short_name: "Parla",
    description: "High-tempo English phrase recall trainer",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#335dff",
    lang: "en",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
