import { getMovementById } from "../data/movements.js";

// ── helpers ─────────────────────────────────────────────────────────────────

/** Strip "Express: …" block and "Requirement focus: X." from a string */
function cleanInstruction(str) {
  return str
    .replace(/\s*Express:.*?(?=Sequence:|Requirement focus:|$)/s, "")
    .replace(/\s*Sequence:.*?(?=\.|$)/s, "")
    .replace(/\s*Requirement focus:\s*"[^"]*"\.\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Extract just "Express: …" once from a goal string */
function extractExpress(str) {
  const m = str.match(/Express:\s*(.*?)(?=Sequence:|$)/s);
  return m ? m[1].trim().replace(/\s+/g, " ") : null;
}

/** Extract the "Minute 0-2:" time label */
function extractTimeLabel(inst) {
  const m = inst.match(/^(Minute\s*\d+[-–]\d+)\s*:/i);
  return m ? m[1] : null;
}

/**
 * Wrap any movement name found in `text` with a styled span.
 * Returns an array of React-renderable parts.
 */
function HighlightMoves({ text, moveNames, accentColor }) {
  if (!moveNames.length || !text) return <span>{text}</span>;

  // Build a regex that matches any of the movement names (longest first)
  const sorted = [...moveNames].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `(${sorted.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const isMove = sorted.some((n) => n.toLowerCase() === part.toLowerCase());
        return isMove ? (
          <strong key={i} style={{ color: accentColor, fontWeight: 700 }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

/** Small chip for the chip row */
function MoveChip({ id, navigate, backTo, backLabel }) {
  const mv = getMovementById(id);
  if (!mv) return null;
  return (
    <button
      onClick={() => navigate?.("skill", id, { backTo, backLabel })}
      style={{
        fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
        background: "rgba(217,164,65,0.12)", border: "1px solid rgba(217,164,65,0.35)",
        color: "var(--accent)", cursor: "pointer", letterSpacing: 0.2,
      }}
    >
      {mv.name} ›
    </button>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export default function PracticePlanDetail({ plan, navigate, onBack, backContext }) {
  if (!plan) {
    return (
      <div className="page">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate?.("roda")}>← Boss Roda</button>
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Practice profile missing</div>
        </div>
      </div>
    );
  }

  const backTo    = backContext?.backTo    || "roda";
  const backLabel = backContext?.backLabel || "Boss Roda";
  const handleBack = onBack || (() => navigate(backTo));
  const sessions  = plan.sessions || [];

  // Build a lookup: id → name for all movements that appear in any session
  const allMoveIds = [...new Set(sessions.flatMap((s) => s.moves || []))];
  return (
    <div className="page">
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 14 }}
        onClick={handleBack}
      >
        ← {backLabel}
      </button>

      {/* Identity strip */}
      <div style={{
        borderRadius: 8, padding: "12px 14px", marginBottom: 14,
        background: "rgba(217,164,65,0.08)", border: "1px solid rgba(217,164,65,0.25)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {plan.title}
        </div>
        {plan.requirementLabel && (
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 1 }}>□</span>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>{plan.requirementLabel}</span>
          </div>
        )}
        {plan.context && (
          <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{plan.context}</div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {[
            `10 min / session`,
            `${plan.sessionPolicy?.minSessions || 3}–${plan.sessionPolicy?.maxSessions || "10+"} sessions`,
            plan.ownerName && `${plan.ownerType}: ${plan.ownerName}`,
          ].filter(Boolean).map((label) => (
            <span key={label} style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700,
              background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text3)",
            }}>{label}</span>
          ))}
        </div>
      </div>

      {/* Principles */}
      {plan.principles?.length > 0 && (
        <div className="card" style={{ marginBottom: 14, padding: "10px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Key Principles
          </div>
          {plan.principles.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sessions */}
      {sessions.map((session) => {
        const sessionMoveIds   = session.moves || [];
        const sessionMoveNames = sessionMoveIds.map((id) => getMovementById(id)?.name).filter(Boolean);

        // Parse once-only content from goal
        const expressText  = extractExpress(session.goal || "");
        const cleanGoal    = (session.goal || "")
          .replace(/\s*Express:.*$/s, "")
          .replace(/\s*Sequence:.*$/s, "")
          .trim();

        return (
          <div key={`${plan.id}_${session.session}`} className="card" style={{ marginBottom: 10, padding: "12px 14px" }}>

            {/* Session header */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "var(--accent)",
                background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.35)", borderRadius: 5,
                padding: "2px 7px", flexShrink: 0,
              }}>
                {session.session}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>
                {session.name}
              </span>
              <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>
                {session.minutes} min
              </span>
            </div>

            {/* Context chips */}
            {(session.orisha || session.mestre) && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {session.orisha && (
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700,
                    background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.3)", color: "var(--accent)",
                  }}>{session.orisha}</span>
                )}
                {session.mestre && (
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700,
                    background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text3)",
                  }}>{session.mestre}</span>
                )}
              </div>
            )}

            {/* Goal — plain text, no decoration */}
            {cleanGoal && (
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 8 }}>
                <HighlightMoves text={cleanGoal} moveNames={sessionMoveNames} accentColor="var(--accent)" />
              </div>
            )}

            {/* Express concept — 1–2 lines, subtle left border */}
            {expressText && (
              <div style={{
                fontSize: 11, color: "var(--text3)", lineHeight: 1.5, marginBottom: 10,
                borderLeft: "2px solid var(--border)", paddingLeft: 8,
              }}>
                {expressText.split(/[.;]+/).filter((s) => s.trim()).slice(0, 2).map((s, i) => (
                  <div key={i}>{s.trim()}</div>
                ))}
              </div>
            )}

            {/* Phase bullets */}
            {(session.instructions || []).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                {session.instructions.map((inst, i) => {
                  const timeLabel = extractTimeLabel(inst);
                  const cleaned   = cleanInstruction(inst)
                    .replace(/^Minute\s*\d+[-–]\d+\s*:\s*/i, "")
                    .trim();
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      {/* Time badge — amber text on tinted bg */}
                      {timeLabel ? (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "var(--text2)",
                          background: "var(--surface3, var(--surface2))",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 4, padding: "2px 6px",
                          flexShrink: 0, marginTop: 2, whiteSpace: "nowrap",
                          letterSpacing: 0.3,
                        }}>
                          {timeLabel.replace("Minute ", "")}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 10, color: "var(--text3)", fontWeight: 600,
                          flexShrink: 0, marginTop: 2, minWidth: 14,
                        }}>
                          {i + 1}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
                        <HighlightMoves
                          text={cleaned}
                          moveNames={sessionMoveNames}
                          accentColor="var(--accent)"
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Movement chips */}
            {sessionMoveIds.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                {sessionMoveIds.map((id) => (
                  <MoveChip key={id} id={id} navigate={navigate} backTo="practicePlan" backLabel={plan.title} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* After-session log checklist */}
      {allMoveIds.length > 0 && (
        <div style={{
          borderRadius: 8, padding: "12px 14px",
          background: "var(--surface2)", border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Log — Which Movement Broke the Boss Identity?
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allMoveIds.map((id) => {
              const mv = getMovementById(id);
              return mv ? (
                <button
                  key={id}
                  onClick={() => navigate?.("skill", id, { backTo: "practicePlan", backLabel: plan.title })}
                  style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 700,
                    background: "var(--surface)", border: "1px solid var(--border)",
                    color: "var(--text2)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--border)" }}>□</span>
                  {mv.name}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
