const METHOD_META = {
  maximal:    { label: "Maximal",    color: "#f87171", desc: "1–3 reps at near-max load — builds neural drive, rate of force development, and motor coordination." },
  dynamic:    { label: "Dynamic",    color: "#f97316", desc: "Submaximal load at maximum speed — develops power, velocity, and explosiveness." },
  repeated:   { label: "Repeated",   color: "#4ade80", desc: "8–15 reps to or near failure — drives hypertrophy and recruits high-threshold motor units." },
  submaximal: { label: "Submaximal", color: "#38bdf8", desc: "Moderate reps, not to failure — builds strength-endurance and movement quality." },
};

const EQUIP_LABEL = {
  bodyweight: { icon: "🤸", label: "Bodyweight" },
  kettlebell: { icon: "🔔", label: "Kettlebell" },
  vest:       { icon: "🦺", label: "Weighted Vest" },
};

import { getMovementById } from "../data/movements.js";

export default function ExerciseDetail({ exercise, onBack, onToggleDone, isDone, navigate }) {
  if (!exercise) return null;
  const ex = exercise;
  const method = METHOD_META[ex.method] || null;
  const equip  = EQUIP_LABEL[ex.equipment] || { icon: "⚙️", label: ex.equipment };

  return (
    <div className="page">
      {/* Back */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
            display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      </div>

      {/* Header card */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{ex.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>{ex.label}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                background: "var(--surface2)", color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                {equip.icon} {equip.label}
              </span>
              {method && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: method.color + "22", color: method.color, textTransform: "uppercase", letterSpacing: 0.8,
                }}>
                  {method.label}
                </span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--yellow)" }}>+{ex.xp} XP</div>
        </div>

        {/* Muscles */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {ex.muscles.map((m) => (
            <span key={m} style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 20,
              background: "var(--surface2)", color: "var(--text2)", textTransform: "capitalize",
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Sets */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6 }}>Prescription</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>{ex.sets}</div>
      </div>

      {/* Technique cues */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Technique Cues</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{ex.cues}</div>
      </div>

      {/* Why */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Why This Works</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{ex.why}</div>
        {ex.dynamicCorrespondence && (
          <div style={{
            marginTop: 10, padding: "8px 10px", borderRadius: 6,
            background: "var(--surface2)", borderLeft: "3px solid var(--accent)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--accent)", letterSpacing: 1, marginBottom: 3 }}>CAPOEIRA TRANSFER</div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{ex.dynamicCorrespondence}</div>
          </div>
        )}
      </div>

      {/* Capoeira Movements */}
      {ex.relatedMovements?.length > 0 && (
        <div className="card">
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Capoeira Movements</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ex.relatedMovements.map((id) => {
              const mv = getMovementById(id);
              if (!mv) return null;
              return (
                <button
                  key={id}
                  onClick={() => navigate?.("skill", id)}
                  style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 20,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--blue)", cursor: "pointer", fontWeight: 600,
                  }}
                >
                  {mv.name} ›
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Method */}
      {method && (
        <div className="card">
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Training Method</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
              background: method.color + "22", color: method.color,
            }}>
              {method.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{method.desc}</div>
        </div>
      )}

      {/* Mark done */}
      {onToggleDone && (
        <button
          onClick={onToggleDone}
          className={`btn ${isDone ? "btn-secondary" : "btn-primary"}`}
          style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 800 }}
        >
          {isDone ? "✓ Marked Done" : "Mark as Done"}
        </button>
      )}
    </div>
  );
}
