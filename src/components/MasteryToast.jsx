import { useEffect } from "react";
import { haptics } from "../utils/haptics.js";

const MASTERY_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];
const MASTERY_COLORS = {
  1: "var(--blue)",
  2: "#7C3AED",
  3: "var(--orange)",
  4: "var(--green)",
  5: "var(--accent)",
};
const TREE_COLORS = { mandinga: "#2E8C78", malandragem: "#D4854A", malicia: "#4F7CFF" };

export default function MasteryToast({ store }) {
  const milestones = (store.state.masteryMilestones || []).slice(0, 2);
  const conceptMilestones = (store.state.conceptMilestones || []).slice(0, 1);
  const allToasts = [
    ...milestones.map((m) => ({ ...m, kind: "mastery" })),
    ...conceptMilestones.map((m) => ({ ...m, kind: "concept" })),
  ].slice(0, 3);

  useEffect(() => {
    if (!allToasts.length) return;
    // Fire haptic for the first new toast
    const first = allToasts[0];
    if (first?.kind === "mastery" && first?.level === 5) haptics.victory();
    else if (first?.kind === "mastery") haptics.advance();
    else if (first?.kind === "concept") haptics.orisha();

    const timers = allToasts.map((m) =>
      setTimeout(() => {
        if (m.kind === "mastery") store.dismissMilestone?.(m.id);
        else store.dismissConceptMilestone?.(m.id);
      }, 4500)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allToasts.map((m) => m.id).join(",")]);

  if (!allToasts.length) return null;

  return (
    <div style={{
      position: "fixed",
      top: "calc(var(--header-h, 52px) + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 448,
      zIndex: 8000,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      pointerEvents: "none",
    }}>
      {allToasts.map((m) => {
        if (m.kind === "concept") {
          const color = TREE_COLORS[m.tree] || "var(--accent)";
          return (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              borderRadius: 10, background: "var(--surface)",
              border: `1px solid ${color}44`,
              boxShadow: `0 2px 16px rgba(0,0,0,0.3), 0 0 0 1px ${color}22`,
              pointerEvents: "auto",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: color + "18", border: `1px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color,
              }}>
                {m.newLevel}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
                  {m.tree}
                </div>
                <div style={{ fontSize: 11, color, fontWeight: 600 }}>
                  Level {m.newLevel}
                  {m.newLevel === 1 && (
                    <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 400, marginLeft: 6 }}>
                      — gates Orishas
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => store.dismissConceptMilestone?.(m.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, padding: "2px 4px", lineHeight: 1 }}>×</button>
            </div>
          );
        }
        const color = MASTERY_COLORS[m.level] || "var(--accent)";
        const isInstinct = m.level === 5;
        return (
          <div key={m.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            borderRadius: 10, background: "var(--surface)",
            border: `1px solid ${color}44`,
            boxShadow: `0 2px 16px rgba(0,0,0,0.3), 0 0 0 1px ${color}22`,
            pointerEvents: "auto",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: color + "18", border: `1px solid ${color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isInstinct ? 18 : 14, fontWeight: 700, color,
            }}>
              {isInstinct ? "✦" : m.level}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{m.movementName}</div>
              <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 1 }}>
                {MASTERY_LABELS[m.level]}
                {m.xp > 0 && <span style={{ color: "var(--yellow)", marginLeft: 6 }}>+{m.xp} XP</span>}
              </div>
            </div>
            <button onClick={() => store.dismissMilestone?.(m.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, padding: "2px 4px", lineHeight: 1 }}>×</button>
          </div>
        );
      })}
    </div>
  );
}
