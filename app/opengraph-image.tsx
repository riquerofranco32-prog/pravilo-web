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
        background: "#120f0d",
        color: "#f4efe8",
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
        PRAVILO <span style={{ color: "#b8402c", marginLeft: 16 }}>ARG</span>
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#9c9187",
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
