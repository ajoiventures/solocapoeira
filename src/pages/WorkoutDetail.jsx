import { useState, useEffect, useRef } from "react";
import { getMovementById } from "../data/movements.js";

function parseSecs(duration) {
  if (!duration) return 300;
  const s = String(duration).trim();
  if (s.includes("min")) return parseInt(s) * 60;
  if (s.endsWith("s"))   return parseInt(s);
  return 300;
}

// Extract duration only for sustained/hold efforts — not rep-based drills
// Shows ⏱ on: "Ginga × 3 min", "hold 30s", "balance 60s", "non-stop"
// Skips: "Au × 5 each side", "Cocorinha × 20", "pause 2s"
function parseDrillSecs(text) {
  if (!text) return null;
  // "X min" always qualifies (sustained effort)
  const m = text.match(/(\d+)\s*min/i);
  if (m) return parseInt(m[1]) * 60;
  // Seconds only qualify if the drill is a hold / balance / continuous effort
  const isSustained = /hold|balance|continuous|non.?stop|flow|seconds?\b/i.test(text);
  if (!isSustained) return null;
  const s = text.match(/\b(\d+)\s*s(?:ec|econds?)?\b/i);
  if (s) { const v = parseInt(s[1]); return v >= 5 ? v : null; }
  return null;
}

function fmtDrill(secs) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60), s = secs % 60;
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, "0")}`;
}

function getRoundBlocks(rounds) {
  if (rounds <= 3) return [Array.from({ length: rounds }, (_, i) => i + 1)];
  const total = Math.ceil(rounds / 3) * 3;
  const blocks = [];
  for (let i = 0; i < total; i += 3) blocks.push([i + 1, i + 2, i + 3]);
  return blocks;
}

export default function WorkoutDetail({ quest, store, navigate, onBack, backLabel }) {
  const [doneDrills, setDoneDrills] = useState(new Set());
  const [logValues, setLogValues] = useState({});
  const autoCompletedRef = useRef(false);

  const q = quest || { items: [], id: null, xp: 0 };

  // Check if this quest is already marked complete in the store
  const today = new Date().toISOString().split("T")[0];
  const isQuestDone = store
    ? store.state.todayQuest.date === today &&
      store.state.todayQuest.completed.includes(q.id)
    : false;

  const toggleDrill = (key) => {
    setDoneDrills((prev) => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  // Count total checkable units for progress
  const totalUnits = q.items.reduce((sum, item) => {
    if (item.rounds) return sum + Math.ceil(item.rounds / 3) * 3;
    return sum + 1;
  }, 0);
  const doneUnits = doneDrills.size;

  // Auto-complete the quest in the store when all drills are checked
  useEffect(() => {
    if (
      store &&
      totalUnits > 0 &&
      doneUnits >= totalUnits &&
      !isQuestDone &&
      !autoCompletedRef.current
    ) {
      autoCompletedRef.current = true;
      store.completeQuestItem(q.id, q.xp);
    }
  }, [doneUnits, totalUnits]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!quest) return null;

  return (
    <div className="page">
      {/* Back button */}
      <button
        onClick={onBack || (() => navigate("daily"))}
        style={{
          background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
          display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13, marginBottom: 16,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {backLabel || "Daily"}
      </button>

      {/* Quest-complete banner */}
      {(isQuestDone || (doneUnits >= totalUnits && totalUnits > 0)) && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
          background: "rgba(46,140,120,0.12)", border: "1px solid var(--green)",
          borderRadius: 10, marginBottom: 14,
        }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)" }}>Quest Complete</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>+{q.xp} XP awarded · Progress saved</div>
          </div>
        </div>
      )}

      {/* Quest header card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{q.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{q.label}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {q.duration} · {q.tree}
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--yellow)" }}>+{q.xp} XP</div>
        </div>
        {q.notes && (
          <div style={{
            marginTop: 10, fontSize: 11, color: "var(--text3)", fontStyle: "italic",
            padding: "8px 10px", background: "var(--surface2)", borderRadius: 6,
          }}>
            {q.notes}
          </div>
        )}

        {/* Progress bar */}
        {totalUnits > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
              <span>{doneUnits}/{totalUnits} done</span>
              {doneUnits === totalUnits && totalUnits > 0 && (
                <span style={{ color: "var(--green)", fontWeight: 700 }}>✓ Complete</span>
              )}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(doneUnits / totalUnits) * 100}%`,
                  background: doneUnits === totalUnits ? "var(--green)" : q.color,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Drill cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.items.map((item, i) => {
          const drillKey = String(i);
          const isDone = doneDrills.has(drillKey);
          const movement = item.movementId ? getMovementById(item.movementId) : null;
          const isCardTappable = !!movement && !item.rounds;

          // Items with rounds → per-round checkbox blocks
          if (item.rounds) {
            const blocks = getRoundBlocks(item.rounds);

            return (
              <div key={i} className="card">
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    minWidth: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: q.color + "22", color: q.color, fontWeight: 600, fontSize: 13,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>

                {/* Movement chips */}
                {item.movementIds?.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                    {item.movementIds.map((id) => {
                      const mv = getMovementById(id);
                      if (!mv) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => navigate("skill", id, { backTo: "workout", backLabel: q.label })}
                          style={{
                            fontSize: 11, padding: "5px 12px", borderRadius: 6, fontWeight: 600,
                            background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.4)", color: "var(--accent)",
                            cursor: "pointer",
                          }}
                        >
                          {mv.name} ›
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Timer launch buttons */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <button
                    onClick={() => navigate("timer", {
                      rounds: item.rounds,
                      workSecs: parseSecs(item.duration),
                      restSecs: 60,
                      label: item.text,
                    })}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      padding: "6px 10px", borderRadius: 8,
                      background: "#C9525218", border: "1px solid #C9525244",
                      color: "#C95252", cursor: "pointer", fontSize: 11, fontWeight: 600,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Timer — {item.rounds} × {item.duration || "?"}
                  </button>
                  <button
                    onClick={() => navigate("berimbau", {
                      rounds: item.rounds,
                      workSecs: parseSecs(item.duration),
                      restSecs: 60,
                      label: item.text,
                    })}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 12px", borderRadius: 8,
                      background: "#16a34a18", border: "1px solid #16a34a44",
                      color: "#16a34a", cursor: "pointer", fontSize: 11, fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    🎵 Berimbau
                  </button>
                </div>

                {/* Round blocks */}
                {blocks.map((block, bi) => {
                  const isBonus = block[0] > item.rounds;
                  return (
                    <div key={bi} style={{ marginBottom: bi < blocks.length - 1 ? 8 : 0 }}>
                      {isBonus && (
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>
                          Bonus
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        {block.map((roundNum) => {
                          const rKey = `${i}_${roundNum}`;
                          const rDone = doneDrills.has(rKey);
                          const isExtra = roundNum > item.rounds;
                          return (
                            <button
                              key={roundNum}
                              onClick={() => toggleDrill(rKey)}
                              style={{
                                flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                                border: `1px solid ${rDone ? "var(--green)" : isExtra ? "var(--border)" : q.color + "55"}`,
                                background: rDone ? "rgba(46,140,120,0.15)" : isExtra ? "var(--surface2)" : q.color + "11",
                                color: rDone ? "var(--green)" : isExtra ? "var(--text3)" : q.color,
                                cursor: "pointer", transition: "all 0.15s",
                                textDecoration: rDone ? "line-through" : "none",
                                opacity: isExtra ? 0.6 : 1,
                              }}
                            >
                              {rDone ? "✓" : `R${roundNum}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Roll-up: compact done row
          if (isDone) {
            return (
              <div
                key={i}
                className="card"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  border: "1px solid var(--green)",
                  background: "rgba(46,140,120,0.06)",
                  padding: "10px 14px",
                }}
              >
                <div style={{
                  minWidth: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 11,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "var(--text2)", textDecoration: "line-through", opacity: 0.7 }}>
                  {item.text}
                </div>
                <button
                  onClick={() => toggleDrill(drillKey)}
                  style={{
                    flexShrink: 0, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    border: "1px solid var(--green)", background: "rgba(46,140,120,0.15)",
                    color: "var(--green)", cursor: "pointer",
                  }}
                >
                  ✓
                </button>
              </div>
            );
          }

          // Normal drill card — tappable if has movement
          const drillSecs = parseDrillSecs(item.detail) ?? parseDrillSecs(item.text);
          // Split item.text into bullets if it contains " — " separators or is in bullets array
          const rawBullets = item.bullets || [];
          const textBullets = item.text.includes(" — ")
            ? item.text.split(" — ").filter(Boolean)
            : [];
          const bullets = rawBullets.length > 0 ? rawBullets : textBullets;
          const mainLabel = bullets.length > 0
            ? (movement?.name || item.text.split(" — ")[0])
            : item.text;

          return (
            <div
              key={i}
              className="card"
              style={{ cursor: isCardTappable ? "pointer" : "default", padding: "12px 14px" }}
              onClick={isCardTappable ? () => navigate("skill", item.movementId, { backTo: "workout", backLabel: q.label }) : undefined}
            >
              {/* Header row: number + label + checkmark */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: bullets.length || item.detail || item.cue ? 6 : 0 }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: q.color + "22", color: q.color, fontWeight: 700, fontSize: 12,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>
                  {mainLabel}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDrill(drillKey); }}
                  style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 7,
                    border: `1.5px solid ${q.color + "88"}`,
                    background: "var(--surface2)", color: "var(--text3)",
                    cursor: "pointer", fontSize: 13, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  ○
                </button>
              </div>

              {/* Cue line */}
              {item.cue && (
                <div style={{
                  fontSize: 11, color: "var(--text2)", lineHeight: 1.4,
                  marginBottom: 6, marginLeft: 36,
                  borderLeft: "2px solid var(--border)", paddingLeft: 8,
                }}>
                  {item.cue}
                </div>
              )}
              {!item.cue && item.detail && !drillSecs && (
                <div style={{
                  fontSize: 11, color: "var(--text3)", marginBottom: 6, marginLeft: 36,
                }}>
                  {item.detail}
                </div>
              )}

              {/* Bullet points */}
              {bullets.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 36, marginBottom: 8 }}>
                  {bullets.map((b, bi) => (
                    <div key={bi} style={{ display: "flex", gap: 7 }}>
                      <span style={{ color: q.color, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4 }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Movement chip */}
              {movement && (
                <div style={{ marginLeft: 36, marginBottom: drillSecs ? 6 : 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate("skill", item.movementId, { backTo: "workout", backLabel: q.label }); }}
                    style={{
                      fontSize: 11, padding: "5px 12px", borderRadius: 6, fontWeight: 600,
                      background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.4)", color: "var(--accent)",
                      cursor: "pointer",
                    }}
                  >
                    {movement.name} ›
                  </button>
                </div>
              )}

              {/* Timer chip */}
              {drillSecs && (
                <div style={{ marginLeft: 36 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("timer", { rounds: 1, workSecs: drillSecs, restSecs: 0, label: item.text });
                    }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      color: "var(--text3)", fontSize: 10, fontWeight: 600,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="13" r="8"/><line x1="12" y1="9" x2="12" y2="13"/>
                    </svg>
                    {fmtDrill(drillSecs)}
                  </button>
                </div>
              )}

              {/* Log input — only for drills with a quantitative detail */}
              {item.detail && (
                <input
                  type="text"
                  placeholder="Log result…"
                  value={logValues[i] || ""}
                  onChange={(e) => setLogValues((prev) => ({ ...prev, [i]: e.target.value }))}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: 8, marginLeft: 36, width: "calc(100% - 36px)",
                    fontSize: 11, padding: "5px 8px",
                    borderRadius: 6, background: "var(--surface2)",
                    border: "1px solid var(--border)", color: "var(--text)", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
