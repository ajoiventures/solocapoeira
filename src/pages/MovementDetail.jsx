import { useState, useCallback, useEffect } from "react";
import { getMovementById, getRepsToMastery, MOVEMENTS } from "../data/movements.js";
import { getMuscles } from "../data/muscleMap.js";
import { SKILL_TREES } from "../data/trees.js";
import { DiffRankBadge, DIFF_RANK } from "./TrainingPlan.jsx";
import { getSequencesForMovement, RANK_META, SEQ_TYPES } from "../data/sequences.js";
import { calculateIntegrationBonuses } from "../data/orishaStatSystem.js";

const MASTERY_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];
const MASTERY_CHIP_CLASS = ["chip-locked", "chip-aware", "chip-learning", "chip-practicing", "chip-competent", "chip-mastered"];

export default function MovementDetail({ movementId, store, navigate, onBack, backContext }) {
  const [repInput, setRepInput] = useState("");
  const [noteVal, setNoteVal] = useState(() => store.getMovementNote?.(movementId) || "");
  const [nowMs] = useState(() => Date.now());

  // Reset note when navigating to a different movement
  useEffect(() => {
    const timer = setTimeout(() => {
      setNoteVal(store.getMovementNote?.(movementId) || "");
    }, 0);
    return () => clearTimeout(timer);
  }, [movementId, store]);

  const handleNoteBlur = useCallback(() => {
    store.setMovementNote?.(movementId, noteVal);
  }, [movementId, noteVal, store]);

  const m = getMovementById(movementId);
  if (!m) return <div className="page"><div className="card">Movement not found.</div></div>;

  const masteryLevel = store.getMasteryLevel(m.id);
  const currentReps = store.getMovementReps(m.id);

  // Apply Orisha stat bonuses to rep thresholds (strength reduces required reps)
  const orishaBonus = calculateIntegrationBonuses(
    store.state.orishasIntegrated || [],
    store.isEhiAscended?.() || false
  );
  const baseThresholds = getRepsToMastery(m.id);
  // Strength bonus: each % reduces thresholds proportionally (cap 30%)
  const strengthReduction = Math.min(orishaBonus.strength || 0, 0.30);
  const thresholds = strengthReduction > 0
    ? baseThresholds.map((t, i) => i === 0 ? 0 : Math.max(1, Math.ceil(t * (1 - strengthReduction))))
    : baseThresholds;

  const unlockedIds = store.getUnlockedMovementIds();
  const isUnlocked = unlockedIds.includes(m.id) || m.prerequisites.length === 0;
  const tree = SKILL_TREES.find((t) => t.id === m.tree);
  const practiceInstructions = m.profile?.practiceInstructions || m.instructions || [];
  const coachingCues = m.profile?.coachingCues || [];
  const safetyNotes = m.profile?.safetyNotes || [];

  // Rep progress toward next mastery level
  const nextLevel = masteryLevel < 5 ? masteryLevel + 1 : 5;
  const repTarget = thresholds[nextLevel];
  const repBase   = thresholds[masteryLevel] || 0;
  const repsDone  = Math.min(currentReps, repTarget);
  const repPct    = repTarget > repBase ? Math.min(100, ((repsDone - repBase) / (repTarget - repBase)) * 100) : 100;
  const repsLeft  = Math.max(0, repTarget - currentReps);

  const handleAddReps = (n) => {
    store.incrementReps(m.id, n);
    setRepInput("");
  };

  const backPage   = backContext?.backTo    ?? "movement";
  const backLabel  = backContext?.backLabel ?? `${m.tree} Tree`;
  const handleBack = onBack || (() => navigate(backPage));

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Back */}
      <div className="detail-back" onClick={handleBack}>
        ← {backLabel}
      </div>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-name">{m.name}</div>
        <div className="detail-meaning">{m.meaning}</div>
        <div className="detail-badges">
          <span className={`tier-badge tier-${m.tier}`}>Tier {m.tier}</span>
          <span className={`chip ${MASTERY_CHIP_CLASS[masteryLevel]}`}>{MASTERY_LABELS[masteryLevel]}</span>
          {tree && (
            <span style={{ fontSize: 11, color: tree.color }}>{tree.icon} {tree.name}</span>
          )}
          {!isUnlocked && (
            <span className="chip chip-locked">🔒 Locked</span>
          )}
        </div>
      </div>

      {/* Practice Profile */}
      <div className="detail-section">
        <div className="detail-section-title">Practice Profile</div>
        {m.profile?.overview && (
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10 }}>
            {m.profile.overview}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {practiceInstructions.map((instruction, i) => (
            <div
              key={`${m.id}-instruction-${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1fr",
                gap: 8,
                alignItems: "start",
                padding: "8px 10px",
                background: "var(--surface2)",
                borderRadius: 7,
              }}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: (tree?.color || "var(--accent)") + "24",
                color: tree?.color || "var(--accent)",
                fontSize: 10,
                fontWeight: 900,
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.45 }}>
                {instruction}
              </span>
            </div>
          ))}
        </div>
        {(coachingCues.length > 0 || safetyNotes.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 10 }}>
            {coachingCues.length > 0 && (
              <div style={{ padding: 10, background: "var(--surface2)", borderRadius: 7 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800, marginBottom: 6 }}>COACHING CUES</div>
                {coachingCues.map((cue) => (
                  <div key={cue} style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.45, marginBottom: 4 }}>
                    - {cue}
                  </div>
                ))}
              </div>
            )}
            {safetyNotes.length > 0 && (
              <div style={{ padding: 10, background: "var(--surface2)", borderRadius: 7 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800, marginBottom: 6 }}>SAFETY</div>
                {safetyNotes.map((note) => (
                  <div key={note} style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.45, marginBottom: 4 }}>
                    - {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rep Progress */}
      <div className="detail-section">
        <div className="detail-section-title">Rep Progress</div>

        {/* This week stats */}
        {(() => {
          const log = (store.state?.repLog || []).filter((e) => e.movementId === m.id);
          const startOfWeek = (() => {
            const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().split("T")[0];
          })();
          const thisWeek = log.filter((e) => e.date >= startOfWeek).reduce((s, e) => s + e.count, 0);
          const activeDays = new Set(log.map((e) => e.date)).size;
          if (thisWeek === 0 && activeDays === 0) return null;
          return (
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              {thisWeek > 0 && (
                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>
                  {thisWeek} reps this week
                </div>
              )}
              {activeDays > 0 && (
                <div style={{ fontSize: 10, color: "var(--text3)" }}>
                  {activeDays} active day{activeDays !== 1 ? "s" : ""} total
                </div>
              )}
            </div>
          );
        })()}

        {/* 30-day comparison */}
        {(() => {
          const log = (store.state?.repLog || []).filter((e) => e.movementId === m.id);
          const now = nowMs;
          const d30ago = new Date(now - 30 * 86400000).toISOString().split("T")[0];
          const d60ago = new Date(now - 60 * 86400000).toISOString().split("T")[0];
          const last30 = log.filter((e) => e.date >= d30ago).reduce((s, e) => s + e.count, 0);
          const prev30 = log.filter((e) => e.date >= d60ago && e.date < d30ago).reduce((s, e) => s + e.count, 0);
          if (last30 === 0 && prev30 === 0) return null;
          const growth = prev30 > 0 ? ((last30 - prev30) / prev30 * 100).toFixed(0) : null;
          const mastNow = masteryLevel;
          const repsAt30ago = currentReps - last30;
          const thresholds = [0, 5, 50, 200, 600, 1200];
          let mastThen = 0;
          for (let i = 5; i >= 0; i--) { if (repsAt30ago >= thresholds[i]) { mastThen = i; break; } }
          const LABELS = ["Locked","Aware","Drilling","Owning","Flowing","Instinct"];
          const advanced = mastNow > mastThen;
          return (
            <div style={{
              background: "var(--surface2)", borderRadius: 8, padding: "8px 12px",
              marginBottom: 10, border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", letterSpacing: 1.2,
                textTransform: "uppercase", marginBottom: 6 }}>30-Day Progress</div>
              <div style={{ display: "flex", gap: 16 }}>
                {last30 > 0 && (
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>
                      {last30.toLocaleString()}
                      {growth !== null && (
                        <span style={{ fontSize: 10, color: Number(growth) >= 0 ? "var(--green)" : "var(--warn,#C95252)",
                          fontWeight: 700, marginLeft: 5 }}>
                          {Number(growth) >= 0 ? "▲" : "▼"}{Math.abs(growth)}%
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>reps this month</div>
                  </div>
                )}
                {advanced && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--green)" }}>
                      {LABELS[mastThen]} → {LABELS[mastNow]}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text3)" }}>mastery gained</div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>
              {currentReps.toLocaleString()} reps total
            </span>
            {masteryLevel < 5 ? (
              <span style={{ fontSize: 10, color: "var(--text3)" }}>
                {repsLeft.toLocaleString()} to {MASTERY_LABELS[nextLevel]}
              </span>
            ) : (
              <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700 }}>
                Instinct ✓
              </span>
            )}
          </div>
          <div style={{ background: "var(--progress-track, var(--surface2))", borderRadius: 4, height: 7, overflow: "hidden" }}>
            <div style={{
              width: `${repPct}%`,
              height: "100%",
              borderRadius: 4,
              background: masteryLevel >= 5 ? "var(--green)" : (tree?.color || "var(--accent)"),
              transition: "width 0.3s ease",
            }} />
          </div>
          {masteryLevel < 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ fontSize: 9, color: "var(--text3)" }}>{MASTERY_LABELS[masteryLevel]}</span>
              <span style={{ fontSize: 9, color: "var(--text3)" }}>{MASTERY_LABELS[nextLevel]} @ {repTarget.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Milestone chips for all levels */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((lvl) => {
            const reached = currentReps >= thresholds[lvl];
            return (
              <div key={lvl} style={{
                fontSize: 9, padding: "2px 7px", borderRadius: 12,
                background: reached ? (tree?.color || "var(--accent)") + "28" : "var(--surface2)",
                color: reached ? (tree?.color || "var(--accent)") : "var(--text3)",
                border: `1px solid ${reached ? (tree?.color || "var(--accent)") + "55" : "transparent"}`,
                fontWeight: reached ? 700 : 400,
              }}>
                {MASTERY_LABELS[lvl]} {reached ? "✓" : `${thresholds[lvl].toLocaleString()}`}
              </div>
            );
          })}
        </div>

        {/* Log reps */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {[1, 5, 10, 20].map((n) => (
            <button key={n}
              onClick={() => handleAddReps(n)}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 6,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text2)", cursor: "pointer", fontWeight: 600,
              }}>
              +{n}
            </button>
          ))}
          <input
            type="number"
            min="1"
            placeholder="custom"
            value={repInput}
            onChange={(e) => setRepInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && Number(repInput) > 0) handleAddReps(Number(repInput)); }}
            style={{
              width: 70, fontSize: 11, padding: "4px 8px", borderRadius: 6,
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", outline: "none",
            }}
          />
          {repInput && Number(repInput) > 0 && (
            <button
              onClick={() => handleAddReps(Number(repInput))}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 6,
                background: tree?.color || "var(--accent)", border: "none",
                color: "#fff", cursor: "pointer", fontWeight: 700,
              }}>
              Log
            </button>
          )}
        </div>
      </div>

      {/* Quick drill timer */}
      <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
        {[5, 10].map((mins) => (
          <button
            key={mins}
            onClick={() => navigate("berimbau", {
              rounds: 1,
              workSecs: mins * 60,
              label: `${m.name} — ${mins} min drill`,
              toque: "angola",
            })}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 11, fontWeight: 800,
              border: "1px solid var(--border)", background: "var(--surface2)",
              color: "var(--text2)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Drill {mins} min
          </button>
        ))}
      </div>

      {/* Instinct banner */}
      {masteryLevel >= 5 && (
        <div style={{
          margin: "0 0 2px",
          padding: "12px 16px",
          borderRadius: 12,
          background: (tree?.color || "var(--accent)") + "18",
          border: `1px solid ${tree?.color || "var(--accent)"}55`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>✦</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: tree?.color || "var(--accent)" }}>
              Instinct
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>
              {m.masteryTest}
            </div>
          </div>
        </div>
      )}

      {/* Advance prompt — appears when rep threshold for next level is crossed */}
      {masteryLevel < 5 && currentReps >= thresholds[masteryLevel + 1] && (
        <div style={{
          margin: "0 0 2px",
          padding: "14px 16px",
          borderRadius: 12,
          background: (tree?.color || "var(--accent)") + "18",
          border: `2px solid ${tree?.color || "var(--accent)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: tree?.color || "var(--accent)" }}>
              ▲ Ready to advance
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {currentReps.toLocaleString()} reps — threshold for {MASTERY_LABELS[masteryLevel + 1]} reached
            </div>
          </div>
          <button
            onClick={() => store.setMasteryLevel(m.id, masteryLevel + 1)}
            style={{
              padding: "8px 16px", borderRadius: 10, fontWeight: 900, fontSize: 12,
              border: "none", background: tree?.color || "var(--accent)",
              color: "#fff", cursor: "pointer", flexShrink: 0,
              boxShadow: `0 0 12px ${(tree?.color || "var(--accent)") + "66"}`,
            }}
          >
            → {MASTERY_LABELS[masteryLevel + 1]}
          </button>
        </div>
      )}

      {/* Difficulty */}
      <div className="detail-section">
        <div className="detail-section-title">Difficulty</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DiffRankBadge difficulty={m.difficulty} />
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            {["", "Beginner", "Easy", "Easy+", "Moderate", "Challenging", "Hard", "Very Hard", "Expert", "Elite"][m.difficulty]}
          </span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.difficulty}/9</span>
        </div>
        {/* Pip bar */}
        <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
          {[1,2,3,4,5,6,7,8,9].map((i) => {
            const dr = DIFF_RANK[m.difficulty];
            return (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i <= m.difficulty ? (dr?.color || "var(--accent)") : "var(--surface3)",
              }} />
            );
          })}
        </div>
      </div>

      {/* Physical requirements */}
      {m.physicalRequirements?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Physical Requirements</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {m.physicalRequirements.map((r) => (
              <span key={r} style={{ fontSize: 11, padding: "2px 8px", background: "var(--surface2)", borderRadius: 4, color: "var(--text2)" }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Anatomy — muscles worked */}
      {(() => {
        const muscles = getMuscles(m.id);
        if (!muscles) return null;
        return (
          <div className="detail-section">
            <div className="detail-section-title">Muscles Worked</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "var(--orange)", letterSpacing: 1.2,
                  textTransform: "uppercase", marginBottom: 6 }}>Primary</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {muscles.primary.map((muscle) => (
                    <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "var(--text)" }}>{muscle}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text3)", letterSpacing: 1.2,
                  textTransform: "uppercase", marginBottom: 6 }}>Secondary</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {muscles.secondary.map((muscle) => (
                    <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--surface3)",
                        border: "1px solid var(--border2)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "var(--text2)" }}>{muscle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Prerequisites */}
      {m.prerequisites?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Prerequisites</div>
          <div className="prereq-list">
            {m.prerequisites.map((pid) => {
              const prereq = getMovementById(pid);
              const met = store.getMasteryLevel(pid) >= 2;
              return (
                <div key={pid} className="prereq-item">
                  <span style={{ color: met ? "var(--green)" : "var(--text3)" }}>{met ? "✓" : "○"}</span>
                  <span
                    style={{ cursor: "pointer", color: met ? "var(--text)" : "var(--text3)" }}
                    onClick={() => prereq && navigate("skill", pid)}
                  >
                    {prereq ? prereq.name : pid}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unlocks */}
      {(() => {
        const unlocks = MOVEMENTS.filter((mv) => mv.prerequisites.includes(m.id));
        if (unlocks.length === 0) return null;
        return (
          <div className="detail-section">
            <div className="detail-section-title">Unlocks</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
              Reach Drilling (level 2) to unlock:
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {unlocks.map((mv) => {
                const mvTree = SKILL_TREES.find((t) => t.id === mv.tree);
                const mvMastery = store.getMasteryLevel(mv.id) || 0;
                const isUnlocked = mvMastery >= 1;
                return (
                  <button
                    key={mv.id}
                    onClick={() => navigate("skill", mv.id)}
                    style={{
                      fontSize: 11, padding: "4px 10px", borderRadius: 20,
                      background: isUnlocked ? (mvTree?.color || "var(--accent)") + "18" : "var(--surface2)",
                      border: `1px solid ${isUnlocked ? (mvTree?.color || "var(--accent)") + "55" : "var(--border)"}`,
                      color: isUnlocked ? (mvTree?.color || "var(--accent)") : "var(--text3)",
                      cursor: "pointer", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    {mvTree && <span>{mvTree.icon}</span>}
                    {mv.name}
                    {isUnlocked && <span style={{ fontSize: 9 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Drill Cards ── */}
      {m.drillCards?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Practice Drills</div>
          {m.drillCards.map((drill) => (
            <div
              key={drill.id}
              style={{
                borderRadius: 10,
                border: `1px solid ${tree?.color || "var(--accent)"}33`,
                background: (tree?.color || "var(--accent)") + "08",
                padding: "14px 14px",
                marginBottom: 10,
              }}
            >
              {/* Header: title + reps */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                  {drill.title}
                </div>
                {drill.reps && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--text3)", flexShrink: 0, marginLeft: 8,
                  }}>
                    {drill.reps}
                  </div>
                )}
              </div>

              {/* Movement chain chips */}
              {drill.chain?.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {drill.chain.map((id, ci) => {
                    const mv = getMovementById(id);
                    return mv ? (
                      <span key={id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          onClick={() => navigate("skill", id, { backTo: "skill", backLabel: m.name })}
                          style={{
                            fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 700,
                            background: (tree?.color || "var(--accent)") + "15",
                            border: `1px solid ${tree?.color || "var(--accent)"}33`,
                            color: tree?.color || "var(--accent)", cursor: "pointer",
                          }}
                        >
                          {mv.name}
                        </button>
                        {ci < drill.chain.length - 1 && (
                          <span style={{ fontSize: 10, color: "var(--text3)" }}>→</span>
                        )}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Cue — the one thing to feel */}
              {drill.cue && (
                <div style={{
                  fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10,
                  borderLeft: "2px solid var(--border)", paddingLeft: 8,
                }}>
                  {drill.cue}
                </div>
              )}

              {/* Steps */}
              {drill.steps?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                  {drill.steps.map((step, si) => (
                    <div key={si} style={{ display: "flex", gap: 10 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                        color: tree?.color || "var(--accent)",
                        background: (tree?.color || "var(--accent)") + "15",
                        border: `1px solid ${tree?.color || "var(--accent)"}22`,
                        borderRadius: 4, padding: "2px 5px", marginTop: 1,
                        lineHeight: 1.4,
                      }}>
                        {si + 1}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Watch for */}
              {drill.watchFor?.length > 0 && (
                <div style={{
                  background: "var(--surface2)", borderRadius: 6,
                  padding: "8px 10px", marginBottom: 10,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
                    Watch for
                  </div>
                  {drill.watchFor.map((w, wi) => (
                    <div key={wi} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                      <span style={{ color: "var(--red)", fontSize: 10, flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: 11, color: "var(--text2)" }}>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Anchor — closing feel */}
              {drill.anchor && (
                <div style={{
                  fontSize: 11, color: "var(--text3)", fontStyle: "italic", lineHeight: 1.5,
                  borderTop: "1px solid var(--border)", paddingTop: 8,
                }}>
                  {drill.anchor}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progressions */}
      {m.progressions?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Progression Steps</div>
          {m.progressions.map((p, i) => (
            <div key={i} className="progression-item">
              <span className="prog-num">{i + 1}</span>
              <span style={{ color: "var(--text)" }}>{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* Common weaknesses */}
      {m.commonWeaknesses?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Common Weaknesses</div>
          {m.commonWeaknesses.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "var(--red)" }}>✗</span>
              <span style={{ color: "var(--text2)" }}>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tests */}
      <div className="detail-section">
        <div className="detail-section-title">Tests</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4, letterSpacing: 1 }}>UNLOCK TEST</div>
          <div style={{ fontSize: 13, padding: "8px 12px", background: "var(--surface2)", borderRadius: 6 }}>{m.unlockTest}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4, letterSpacing: 1 }}>MASTERY TEST</div>
          <div style={{ fontSize: 13, padding: "8px 12px", background: "var(--surface2)", borderRadius: 6, color: "var(--green)" }}>{m.masteryTest}</div>
        </div>
      </div>

      {/* Notes */}
      {m.notes && (
        <div className="detail-section">
          <div className="detail-section-title">Notes</div>
          <div style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>{m.notes}</div>
        </div>
      )}

      {/* Sequences */}
      {(() => {
        const seqs = getSequencesForMovement(m.id);
        if (seqs.length === 0) return null;
        return (
          <div className="detail-section">
            <div className="detail-section-title">Appears In Sequences</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {seqs.map((seq) => {
                const rank = RANK_META[seq.rank] || {};
                const seqType = SEQ_TYPES[seq.type] || {};
                return (
                  <div
                    key={seq.id}
                    onClick={() => navigate("sequence", seq.id, { backTo: "skill", backLabel: m.name })}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", borderRadius: 9,
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                      background: rank.color + "22", color: rank.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 12,
                    }}>
                      {seq.rank}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{seq.name}</div>
                      <span style={{
                        fontSize: 10, color: seqType.color || "var(--accent)",
                      }}>
                        {seqType.label || seq.type}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, color: "var(--text3)" }}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* External links + YouTube embed */}
      <div className="detail-section">
        <div className="detail-section-title">Resources</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Tutorial embed — inline if watch?v= URL, else external link */}
          {m.tutorialUrl && (() => {
            const ytMatch = m.tutorialUrl.match(/[?&]v=([^&]+)/);
            const videoId = ytMatch?.[1];
            if (videoId) {
              return (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase",
                    letterSpacing: 1.2, marginBottom: 6 }}>Tutorial</div>
                  <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10,
                    overflow: "hidden", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                      title={`${m.name} tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>
              );
            }
            return (
              <a href={m.tutorialUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                  background: "rgba(79,124,255,0.10)", border: "1px solid rgba(79,124,255,0.30)" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🎬</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Tutorial</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>youtube.com</div>
                  </div>
                  <span style={{ color: "var(--text3)" }}>↗</span>
                </div>
              </a>
            );
          })()}

          {/* Video link — search results open externally, watch URLs embed */}
          {m.videoUrl && (() => {
            const ytMatch = m.videoUrl.match(/[?&]v=([^&]+)/);
            const videoId = ytMatch?.[1];
            if (videoId && !m.tutorialUrl) {
              return (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase",
                    letterSpacing: 1.2, marginBottom: 6 }}>Video</div>
                  <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10,
                    overflow: "hidden", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                      title={`${m.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>
              );
            }
            return (
              <a href={m.videoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                  background: "rgba(201,82,82,0.10)", border: "1px solid rgba(201,82,82,0.30)" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>▶</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Watch on YouTube</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>youtube.com/results</div>
                  </div>
                  <span style={{ color: "var(--text3)" }}>↗</span>
                </div>
              </a>
            );
          })()}
          {(m.sourceUrl || (!m.videoUrl && !m.tutorialUrl)) && (
            <a href={m.sourceUrl || "https://www.minhoquinho.com/capoeira-movement-library"} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                background: "var(--surface2)", border: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>📖</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Minhoquinho Library</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>minhoquinho.com</div>
                </div>
                <span style={{ color: "var(--text3)" }}>↗</span>
              </div>
            </a>
          )}
          {!m.videoUrl && !m.tutorialUrl && (
            <a
              href={`https://www.youtube.com/results?search_query=capoeira+${encodeURIComponent(m.name)}`}
              target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                background: "var(--surface2)", border: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Search YouTube</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>capoeira {m.name}</div>
                </div>
                <span style={{ color: "var(--text3)" }}>↗</span>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* My Notes */}
      <div className="detail-section">
        <div className="detail-section-title">My Notes</div>
        <textarea
          value={noteVal}
          onChange={(e) => setNoteVal(e.target.value)}
          onBlur={handleNoteBlur}
          placeholder="Add your cues, corrections, feelings…"
          rows={3}
          style={{
            width: "100%", boxSizing: "border-box",
            fontSize: 12, padding: "8px 10px", borderRadius: 8,
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--text)", outline: "none", resize: "vertical",
            fontFamily: "inherit", lineHeight: 1.6,
          }}
        />
        {noteVal && (
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4, textAlign: "right" }}>
            Saved on blur
          </div>
        )}
      </div>

      {/* Mastery control */}
      <div className="detail-section">
        <div className="detail-section-title">Set Mastery Level</div>
        <div className="mastery-selector">
          {MASTERY_LABELS.map((label, i) => (
            <button
              key={i}
              className={`mastery-btn${masteryLevel === i ? " selected" : ""}`}
              onClick={() => store.setMasteryLevel(m.id, i)}
            >
              {i} — {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
