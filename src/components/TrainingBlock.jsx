/* eslint-disable react-refresh/only-export-components */
import { getMovementById } from "../data/movements.js";

/**
 * TrainingBlock — scan-friendly training session format
 * Designed to be read through transitions: glance, act, glance again.
 *
 * Props:
 *   header       { title, subtitle, anchor }   — session identity
 *   phases       Array<Phase>                  — 2-min blocks
 *   finisher     { label, items }              — optional close card
 *   accentColor  string                        — CSS color
 *   navigate     function                      — for movement chips
 *
 * Phase shape:
 *   { num, timeLabel, chain, cue, bullets, moves[], note }
 */

function MovementChip({ id, navigate }) {
  const mv = getMovementById(id);
  if (!mv) return null;
  return (
    <button
      onClick={() => navigate?.("skill", id)}
      style={{
        fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 700,
        background: "var(--surface2)", border: "1px solid var(--border)",
        color: "var(--blue)", cursor: "pointer", flexShrink: 0,
      }}
    >
      {mv.name} ›
    </button>
  );
}

export default function TrainingBlock({ header, phases = [], finisher, accentColor = "var(--accent)", navigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Session header */}
      {header && (
        <div style={{
          borderRadius: 8, padding: "12px 14px",
          background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
          border: `1px solid ${accentColor}33`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "var(--text)", marginBottom: 2 }}>
            {header.title}
          </div>
          {header.subtitle && (
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: header.anchor ? 8 : 0 }}>
              {header.subtitle}
            </div>
          )}
          {header.anchor && (
            <div style={{
              fontSize: 12, fontWeight: 700, fontStyle: "italic",
              color: accentColor, borderTop: `1px solid ${accentColor}22`, paddingTop: 8,
            }}>
              › {header.anchor}
            </div>
          )}
        </div>
      )}

      {/* Phases */}
      {phases.map((phase, i) => (
        <div key={i} className="card" style={{ padding: "12px 14px" }}>
          {/* Phase header row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <div style={{
              fontSize: 11, fontWeight: 900, color: "#fff",
              background: accentColor, borderRadius: 5,
              padding: "2px 7px", flexShrink: 0,
            }}>
              {phase.num !== undefined ? `${phase.num}` : String(i + 1)}
            </div>
            {phase.timeLabel && (
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", flexShrink: 0 }}>
                {phase.timeLabel}
              </div>
            )}
            {phase.chain && (
              <div style={{
                fontSize: 12, fontWeight: 800, color: "var(--text)", flex: 1,
                overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
              }}>
                {phase.chain}
              </div>
            )}
          </div>

          {/* Cue — the one thing to feel */}
          {phase.cue && (
            <div style={{
              fontSize: 12, fontWeight: 700, fontStyle: "italic",
              color: accentColor, marginBottom: 8,
            }}>
              › {phase.cue}
            </div>
          )}

          {/* Bullets */}
          {phase.bullets?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
              {phase.bullets.map((b, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: accentColor, fontWeight: 900, fontSize: 11, flexShrink: 0 }}>
                    {j + 1}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.45 }}>{b}</span>
                </div>
              ))}
            </div>
          )}

          {/* Movement chips */}
          {phase.moves?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: phase.note ? 8 : 0 }}>
              {phase.moves.map((id) => (
                <MovementChip key={id} id={id} navigate={navigate} />
              ))}
            </div>
          )}

          {/* Closing note */}
          {phase.note && (
            <div style={{
              fontSize: 11, color: "var(--text3)", fontStyle: "italic",
              borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: phase.moves?.length ? 0 : 4,
            }}>
              {phase.note}
            </div>
          )}
        </div>
      ))}

      {/* Finisher */}
      {finisher && (
        <div style={{
          borderRadius: 8, padding: "12px 14px",
          background: "var(--surface2)", border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>
            {finisher.label}
          </div>
          {finisher.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: "var(--border)", flexShrink: 0 }}>□</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Convert Orisha executionFocus.trainingInstructions → TrainingBlock phases
 */
export function orishaToPhases(executionFocus) {
  if (!executionFocus?.trainingInstructions) return [];
  return Object.entries(executionFocus.trainingInstructions).map(([, phase], i) => ({
    num: i + 1,
    timeLabel: phase.reps ? `${phase.reps} reps · ${phase.tempo || ""}` : phase.tempo || "",
    chain: phase.focus,
    cue: phase.cue,
    bullets: phase.instructions || [],
    moves: phase.keyMovements || [],
    note: phase[Object.keys(phase).find((k) => k.endsWith("Teaching"))] || null,
  }));
}

/**
 * Convert Mestre teaching_methodology + class_structure → TrainingBlock phases
 */
export function mestreToPhases(mestre) {
  const cs = mestre.teaching_methodology?.class_structure || [];
  const emph = mestre.teaching_methodology?.emphasis || [];
  const sigs = mestre.signature_techniques || [];
  const tempo = mestre.teaching_methodology?.tempo || "";

  return cs.map((phase, i) => {
    const sig = sigs[i];
    return {
      num: i + 1,
      timeLabel: tempo ? `${tempo}` : "",
      chain: phase,
      cue: emph[i] || emph[0] || "",
      bullets: sig ? [`Signature: ${sig.name} — ${sig.description}`] : [],
      moves: sig?.id ? [sig.id] : [],
      note: null,
    };
  });
}

/**
 * Convert PracticePlan sessions → TrainingBlock phases
 */
export function planToPhases(plan) {
  return (plan.sessions || []).map((session) => ({
    num: session.session,
    timeLabel: `${session.minutes} min${session.orisha ? ` · ${session.orisha}` : ""}`,
    chain: session.name,
    cue: session.goal,
    bullets: session.instructions || [],
    moves: session.moves || [],
    note: null,
  }));
}
