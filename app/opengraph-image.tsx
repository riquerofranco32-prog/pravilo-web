import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0f1c",
        color: "#f2f4f8",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2,
          display: "flex",
        }}
      >
        PRAVILO <span style={{ color: "#e6294a", marginLeft: 16 }}>ARG</span>
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#8b93a7",
          marginTop: 24,
          display: "flex",
        }}
      >
        Primer Centro Pravilo de Argentina — Plottier, Neuquén
      </div>
    </div>,
    { ...size },
  );
}
