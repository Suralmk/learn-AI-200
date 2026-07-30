import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Learn AI-200 — Azure AI Cloud Developer Associate study notes and practice exams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1f33 0%, #0177d1 55%, #38bdf8 100%)",
          padding: 64,
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "white",
              color: "#0177d1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            A2
          </div>
          Microsoft Azure · AI Cloud Developer
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            AI-200 Study Notes
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              maxWidth: 900,
              lineHeight: 1.35,
              opacity: 0.95,
            }}
          >
            Free study guides, practice questions, and mock exams for the
            Azure AI Cloud Developer Associate certification.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <span>ai-200.sura.work</span>
          <span>Exam prep · Code samples · Quizzes</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
