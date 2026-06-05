import { getPhaseById } from "../data/trainingPhases.js";

/**
 * Phase Indicator — Shows current training phase and progression
 * Maps to #79: PhaseIndicator component
 */
export default function PhaseIndicator({ currentPhase, completionPercent, canAdvance, onAdvance }) {
  const phase = getPhaseById(currentPhase);
  if (!phase) return null;

  const nextPhase = currentPhase < 4 ? getPhaseById(currentPhase + 1) : null;

  return (
    <div className="card" style={{ marginBottom: 16, borderLeft: `4px solid ${phase.color}` }}>
      {/* Current phase header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 32 }}>{phase.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: phase.color }}>
            {phase.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
            Phase {currentPhase} of 4 · {phase.description}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        background: "var(--surface2)",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)" }}>
            Phase Progress
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: phase.color, marginLeft: "auto" }}>
            {completionPercent}%
          </span>
        </div>
        <div style={{
          height: 6,
          borderRadius: 3,
          background: "var(--surface3)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${completionPercent}%`,
            background: phase.color,
            transition: "width 0.4s ease-out",
          }} />
        </div>
      </div>

      {/* Phase details */}
      <div style={{
        background: "var(--surface3)",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 11,
        color: "var(--text2)",
      }}>
        <div style={{ marginBottom: 6, fontWeight: 700, color: "var(--text)" }}>
          Focus: {phase.movementFocus.slice(0, 2).join(", ")}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.5 }}>
          {phase.movementFocus.slice(2).map((f, i) => (
            <div key={i}>• {f}</div>
          ))}
        </div>
      </div>

      {/* Concept tree requirements */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 12,
      }}>
        {Object.entries(phase.conceptTrees).map(([tree, data]) => (
          data.end > data.start && (
            <div
              key={tree}
              style={{
                background: "var(--surface2)",
                borderRadius: 6,
                padding: 8,
                textAlign: "center",
                fontSize: 10,
              }}
            >
              <div style={{
                fontWeight: 700,
                textTransform: "capitalize",
                marginBottom: 2,
                color: "var(--text)",
              }}>
                {tree}
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 800,
                color: tree === "mandinga" ? "#2E8C78" : tree === "malandragem" ? "#D4854A" : "#4F7CFF",
              }}>
                {data.start}→{data.end}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Advance button */}
      {canAdvance && currentPhase < 4 && (
        <button
          onClick={onAdvance}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: phase.color,
            border: "none",
            borderRadius: 6,
            color: "white",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          ⬆️ Advance to {nextPhase?.name}
        </button>
      )}

      {/* Next phase preview */}
      {nextPhase && (
        <div style={{
          background: "var(--surface2)",
          borderRadius: 6,
          padding: 10,
          fontSize: 11,
          opacity: 0.7,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text2)" }}>
            Next: {nextPhase.name} {nextPhase.icon}
          </div>
          <div style={{ color: "var(--text3)", fontSize: 10, lineHeight: 1.4 }}>
            {nextPhase.description}
          </div>
        </div>
      )}
    </div>
  );
}
