import { ImageResponse } from "next/og";
import { EXAM, SKILL_AREAS, WEIGHT_SCALE } from "./exam-outline";
import { SITE_URL } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded 1200×630 social card: title, context line and the blueprint bars. */
export function renderOgImage({ title, context }: { title: string; context: string }) {
  const fontSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#0e1726", fontFamily: "sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 56px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 700 }}>
            <div style={{ width: 52, height: 52, borderRadius: 13, background: "#0177d1", display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, padding: "0 11px" }}>
              {[0.62, 1, 0.62, 0.62].map((w, i) => (
                <div key={i} style={{ height: 5, width: `${w * 100}%`, borderRadius: 3, background: "#ffffff", opacity: i < 2 ? 1 : 1 - (i - 1) * 0.2 }} />
              ))}
            </div>
            <span>AI-200</span>
            <span style={{ color: "#0177d1", marginLeft: -8 }}>Learn</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, display: "flex" }}>{title}</div>
            <div style={{ fontSize: 28, color: "#5b6b82", display: "flex" }}>{context}</div>
          </div>
          <div style={{ fontSize: 24, color: "#5b6b82", display: "flex" }}>Free and open source · {new URL(SITE_URL).host}</div>
        </div>
        <div style={{ width: 330, background: "#f6f8fb", borderLeft: "2px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, padding: "0 44px" }}>
          {SKILL_AREAS.map((a) => {
            const [lo, hi] = a.weightRange;
            return (
              <div key={a.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 20, color: "#0e1726", display: "flex" }}>{a.title}</div>
                <div style={{ display: "flex", height: 14, width: "100%", background: "#e8f2fc", borderRadius: 7, gap: 3 }}>
                  <div style={{ width: `${(lo / WEIGHT_SCALE) * 100}%`, background: "#0177d1", borderRadius: 7 }} />
                  <div style={{ width: `${((hi - lo) / WEIGHT_SCALE) * 100}%`, background: "#9cc9f5", borderRadius: 7 }} />
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 18, color: "#5b6b82", display: "flex" }}>{EXAM.code} exam weight by skill area</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
