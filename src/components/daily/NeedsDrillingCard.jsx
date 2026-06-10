import { useState } from "react";
import { MOVEMENTS } from "../../data/movements.js";
import { SKILL_TREES } from "../../data/trees.js";

const MASTERY_ND_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];
const MASTERY_ND_COLORS = ["var(--text3)", "var(--blue)", "#8b5cf6", "var(--orange)", "var(--green)", "var(--accent)"];

export default function NeedsDrillingCard({ store, navigate }) {
  const [open, setOpen] = useState(false);

  // Movements at mastery 1–2 with >10 reps (proves intentional practice)
  const needsDrilling = MOVEMENTS
    .filter((m) => {
      const lvl = store.getMasteryLevel(m.id) || 0;
      const reps = store.getMovementReps(m.id) || 0;
      return (lvl === 1 || lvl === 2) && reps > 10;
    })
    .map((m) => ({
      m,
      masteryLevel: store.getMasteryLevel(m.id) || 0,
      reps: store.getMovementReps(m.id) || 0,
    }))
    .sort((a, b) => a.reps - b.reps)
    .slice(0, 5);

  // Check if user has any reps at all — if not, show a nudge
  const anyReps = MOVEMENTS.some((m) => (store.getMovementReps(m.id) || 0) > 0);

  if (needsDrilling.length === 0) {
    // Only show the empty state hint if user has started training but nothing needs drilling yet
    if (!anyReps) return null;
    return (
      <div style={{
        padding: "14px 16px", background: "var(--surface2)", borderRadius: 10,
        border: "1px solid var(--border)", textAlign: "center",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>
          Nothing needs drilling yet
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>
          Log 10+ reps on any movement at Aware or Drilling level — it will appear here as a focused practice target.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "10px 14px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔧</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Needs Drilling</span>
          <span style={{
            fontSize: 10, padding: "1px 7px", borderRadius: 20, fontWeight: 700,
            background: "var(--surface2)", color: "var(--text3)",
          }}>
            {needsDrilling.length}
          </span>
        </div>
        <span style={{ fontSize: 14, color: "var(--text3)", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
      </button>

      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {needsDrilling.map(({ m, masteryLevel, reps }) => {
            const tree = SKILL_TREES.find((t) => t.id === m.tree);
            const color = MASTERY_ND_COLORS[masteryLevel];
            return (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px", borderRadius: 8,
                background: "var(--surface2)", border: "1px solid var(--border)",
              }}>
                {tree && <span style={{ fontSize: 12, flexShrink: 0 }}>{tree.icon}</span>}
                <div
                  style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                  onClick={() => navigate("skill", m.id)}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{m.name}</div>
                  <div style={{ fontSize: 10, color, fontWeight: 600 }}>
                    {MASTERY_ND_LABELS[masteryLevel]} · {reps} reps
                  </div>
                </div>
                <button
                  onClick={() => store.incrementReps(m.id, 5)}
                  style={{
                    fontSize: 11, padding: "3px 9px", borderRadius: 10, fontWeight: 800,
                    background: color + "22", border: `1px solid ${color}44`,
                    color, cursor: "pointer", flexShrink: 0,
                  }}
                >
                  +5
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
