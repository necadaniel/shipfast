import { ImageResponse } from "next/og";
import config from "@/config";

// Social preview card, generated at build time from config.ts — so it rebrands
// itself when you change appName/appDescription. Nothing to redesign by hand.
//
// Prefer a hand-made image? Delete this file and drop in `opengraph-image.png`
// (1200x630) instead; Next picks up either one.

export const alt = `${config.appName} — ${config.appDescription}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0b1220 0%, #16233d 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 20,
            marginRight: 24,
            background: config.colors.main,
            fontSize: 40,
          }}
        >
          ⚡
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
          {config.appName}
        </div>
      </div>

      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: -2,
          maxWidth: 900,
        }}
      >
        {config.appDescription}
      </div>

      <div
        style={{
          marginTop: 48,
          fontSize: 30,
          color: "#93a4c0",
        }}
      >
        {config.domainName}
      </div>
    </div>,
    { ...size }
  );
}
