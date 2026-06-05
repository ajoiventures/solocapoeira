import { useEffect } from "react";
import { haptics } from "../utils/haptics.js";

/**
 * AchievementToast — global overlay for achievement unlocks and rank-ups.
 * Reads store.state.achievementQueue. Each toast auto-dismisses after 5s.
 * Rank-ups get a larger treatment.
 */
export default function AchievementToast({ store }) {
  const queue = (store.state.achievementQueue || []).slice(0, 2);

  useEffect(() => {
    if (!queue.length) return;
    const first = queue[0];
    if (first?.isRankUp) haptics.rankUp();
    else haptics.achievement();

    const timers = queue.map((a) =>
      setTimeout(() => store.dismissAchievement?.(a.qid), 5000)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.map((a) => a.qid).join(",")]);

  if (!queue.length) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "calc(var(--nav-h, 56px) + 12px)",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 448,
      zIndex: 8500,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      pointerEvents: "none",
    }}>
      {queue.map((a) => {
        const isRankUp = a.isRankUp;
        const color = a.color || "var(--accent)";

        if (isRankUp) {
          return (
            <div key={a.qid} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 8, padding: "16px 20px", borderRadius: 14,
              background: "linear-gradient(135deg, #0A1018, #141F2C)",
              border: `2px solid ${color}66`,
              boxShadow: `0 0 40px ${color}33, 0 8px 32px rgba(0,0,0,0.7)`,
              textAlign: "center", pointerEvents: "auto",
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: 3, textTransform: "uppercase" }}>
                Rank Up
              </div>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{a.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#EDE8DE" }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{a.desc}</div>
              <button
                onClick={() => store.dismissAchievement?.(a.qid)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", marginTop: 4 }}
              >
                Continue →
              </button>
            </div>
          );
        }

        return (
          <div key={a.qid} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10,
            background: "var(--surface)",
            border: `1px solid ${color}44`,
            boxShadow: `0 2px 16px rgba(0,0,0,0.3), 0 0 0 1px ${color}22`,
            pointerEvents: "auto",
          }}>
            {/* Badge */}
            <div style={{
              width: 38, height: 38, borderRadius: 8, flexShrink: 0,
              background: color + "18", border: `1px solid ${color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              {a.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>
                Achievement Unlocked
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1, lineHeight: 1.4 }}>
                {a.desc}
              </div>
            </div>

            <button
              onClick={() => store.dismissAchievement?.(a.qid)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, padding: "2px 4px", lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
