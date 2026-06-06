import { useState } from "react";
import { getPhaseById } from "../data/trainingPhases.js";
import { getRank, getNextRank, getLevelFromXP, getLevelProgress } from "../data/rankUtils.js";
import { SPRINT_1 } from "../data/sprint.js";

export default function ProgressionDetail({ store, navigate, onBack, backContext }) {
  const { player } = store.state;
  const level       = getLevelFromXP(player.totalXP);
  const rank        = getRank(level);
  const nextRank    = getNextRank(level);
  const { pct: levelPct } = getLevelProgress(player.totalXP);
  const week        = player.currentWeek || 1;

  const currentPhase    = store.getCurrentPhase?.() ?? 1;
  const phaseCompletion = store.getPhaseCompletionPercent?.() ?? 0;
  const canAdvance      = store.canAdvanceToNextPhase?.() ?? false;
  const phase     = getPhaseById(currentPhase);
  const nextPhase = currentPhase < 4 ? getPhaseById(currentPhase + 1) : null;
  const weekData  = SPRINT_1.weeks?.[Math.min(week - 1, 11)];
  const ct        = store.state.conceptTreeProgress || {};

  const backLabel  = backContext?.backLabel || "Daily";
  const handleBack = onBack || (() => navigate("daily"));
  const [ritual, setRitual] = useState(null); // { fromPhase, toPhase }

  return (
    <div className="page">

      {/* ── Phase Advancement Ritual Overlay ── */}
      {ritual && (
        <div
          onClick={() => setRitual(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9500,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, animation: "fadeIn 0.35s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 380, textAlign: "center",
              background: `linear-gradient(160deg, #08101A 0%, #111C2A 100%)`,
              border: `2px solid ${ritual.toPhase.color}55`,
              borderRadius: 18,
              boxShadow: `0 0 80px ${ritual.toPhase.color}33, 0 24px 60px rgba(0,0,0,0.9)`,
              padding: "36px 28px",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Phase glow */}
            <div style={{
              position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
              width: 280, height: 280, borderRadius: "50%",
              background: `radial-gradient(circle, ${ritual.toPhase.color}20 0%, transparent 65%)`,
              pointerEvents: "none",
            }} />

            {/* Transition arrow */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 28, opacity: 0.5 }}>{ritual.fromPhase.icon}</span>
              <span style={{ fontSize: 20, color: ritual.toPhase.color }}>→</span>
              <span style={{ fontSize: 40 }}>{ritual.toPhase.icon}</span>
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: ritual.toPhase.color, textTransform: "uppercase", marginBottom: 8 }}>
              Phase Advancement
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: "#EDE8DE", marginBottom: 6 }}>
              {ritual.toPhase.name}
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: 20, lineHeight: 1.5 }}>
              {ritual.toPhase.description}
            </div>

            {/* What's new */}
            {ritual.toPhase.movementFocus?.length > 0 && (
              <div style={{
                textAlign: "left", background: "rgba(255,255,255,0.04)",
                borderRadius: 8, padding: "12px 14px", marginBottom: 20,
                borderLeft: `3px solid ${ritual.toPhase.color}55`,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                  New Focus
                </div>
                {ritual.toPhase.movementFocus.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: ritual.toPhase.color, fontSize: 10 }}>›</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setRitual(null)}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 8,
                fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none",
                background: ritual.toPhase.color, color: "#0A1018",
              }}
            >
              Begin {ritual.toPhase.name} →
            </button>
          </div>
        </div>
      )}

      {/* Back */}
      <button
        onClick={handleBack}
        style={{
          background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
          display: "flex", alignItems: "center", gap: 4, fontSize: 13,
          padding: "4px 0", marginBottom: 18,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        {backLabel}
      </button>

      {/* ── PHASE ── */}
      {phase && (
        <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${phase.color}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 30, lineHeight: 1 }}>{phase.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: phase.color }}>{phase.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                Phase {currentPhase} of 4 · {phase.description}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--surface2)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${phaseCompletion}%`, background: phase.color, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: phase.color, flexShrink: 0 }}>{phaseCompletion}%</span>
          </div>

          {/* Focus */}
          {phase.movementFocus?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                Focus: {phase.movementFocus.slice(0, 2).join(", ")}
              </div>
              {phase.movementFocus.slice(2).map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 2 }}>
                  <span style={{ color: phase.color, fontSize: 10 }}>•</span>
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Concept tree targets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
            {[
              { id: "mandinga",    color: "#2E8C78" },
              { id: "malandragem", color: "#D4854A" },
              { id: "malicia",     color: "#4F7CFF" },
            ].map(({ id, color }) => {
              const data = phase.conceptTrees?.[id];
              if (!data || data.end <= data.start) return null;
              const current = ct[id] || 0;
              return (
                <div key={id} style={{ background: "var(--surface2)", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "capitalize", color: "var(--text3)", marginBottom: 2 }}>{id}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color }}>{current}/{data.end}</div>
                  <div style={{ fontSize: 9, color: "var(--text3)" }}>target</div>
                </div>
              );
            })}
          </div>

          {/* Advance button */}
          {canAdvance && currentPhase < 4 && nextPhase && (
            <button
              className="btn btn-primary"
              style={{ width: "100%", background: phase.color, border: "none" }}
              onClick={() => {
                setRitual({ fromPhase: phase, toPhase: nextPhase });
                store.advanceToNextPhase?.();
              }}
            >
              Advance to {nextPhase.name} →
            </button>
          )}

          {/* Next phase */}
          {nextPhase && (
            <div style={{
              marginTop: 10, padding: "8px 10px", background: "var(--surface2)", borderRadius: 6,
              fontSize: 11, color: "var(--text3)", lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 600, color: "var(--text2)" }}>Next: {nextPhase.name} {nextPhase.icon}</span>
              <span style={{ marginLeft: 6 }}>{nextPhase.description}</span>
            </div>
          )}
        </div>
      )}

      {/* ── RANK ── */}
      <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${rank.color}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: rank.color + "18", border: `1px solid ${rank.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: rank.color,
          }}>
            {rank.rank}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: rank.color }}>{rank.label}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2, lineHeight: 1.5 }}>{rank.desc}</div>
          </div>
        </div>

        {/* Level + XP */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: rank.color }}>LV {level}</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, borderRadius: 3, background: "var(--surface2)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${levelPct}%`, background: rank.color, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
              {player.totalXP.toLocaleString()} XP
            </div>
          </div>
        </div>

        {nextRank && (
          <div style={{ fontSize: 11, color: "var(--text3)" }}>
            Next: <span style={{ color: nextRank.color, fontWeight: 600 }}>{nextRank.label}</span> at LV {nextRank.minLevel}
          </div>
        )}
      </div>

      {/* ── SPRINT ── */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Sprint 1</span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Week {week}/12</span>
        </div>

        {/* Week dots */}
        <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
          {Array.from({ length: 12 }, (_, i) => {
            const w = i + 1;
            const done = w < week;
            const current = w === week;
            return (
              <div
                key={i}
                style={{
                  width: 26, height: 26, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: done ? "var(--green)" : current ? "var(--accent)" : "var(--surface2)",
                  color: done || current ? "#fff" : "var(--text3)",
                  border: current ? "none" : "1px solid var(--border)",
                }}
              >
                {w}
              </div>
            );
          })}
        </div>

        {/* Week theme */}
        {weekData && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
              Week {week} Focus
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{weekData.theme}</div>
          </div>
        )}

        <button
          className="btn btn-secondary btn-sm"
          disabled={week >= 12}
          onClick={() => { store.advanceWeek(); }}
        >
          Advance to Week {Math.min(week + 1, 12)} →
        </button>
      </div>
    </div>
  );
}
