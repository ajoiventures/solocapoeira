import { useState } from "react";
import { SPRINT_1, FOUNDATION_ROTATION } from "../data/sprint.js";
import { ANNUAL_PROGRAM, MONTHLY_OVERVIEW } from "../data/annualProgram.js";
import { MOVEMENTS, getMovementById } from "../data/movements.js";
import { BOSS_TESTS } from "../data/bossTests.js";
import { RANKS, buildBonusQuest } from "../data/bonusQuests.js";
import { SKILL_TREES } from "../data/trees.js";
import { BIMBA_SEQUENCES, TAYLOR_WORKOUTS } from "../data/sequences.js";

// ── Difficulty → Rank mapping ──────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const DIFF_RANK = [
  null,            // 0 — unused
  { rank: "E",  label: "E",  color: "#4F7CFF" },  // 1
  { rank: "E+", label: "E+", color: "#4F7CFF" },  // 2
  { rank: "D",  label: "D",  color: "#2E8C78" },  // 3
  { rank: "D+", label: "D+", color: "#2E8C78" },  // 4
  { rank: "C",  label: "C",  color: "#D9A441" },  // 5
  { rank: "C+", label: "C+", color: "#D9A441" },  // 6
  { rank: "B",  label: "B",  color: "#D4854A" },  // 7
  { rank: "A",  label: "A",  color: "#C95252" },  // 8
  { rank: "S",  label: "S",  color: "#D4854A" },  // 9
];

export function DiffRankBadge({ difficulty, size = "normal" }) {
  const dr = DIFF_RANK[difficulty];
  if (!dr) return null;
  const pad = size === "sm" ? "1px 5px" : "2px 7px";
  const fs = size === "sm" ? 9 : 10;
  return (
    <span style={{
      padding: pad, borderRadius: 4, fontSize: fs, fontWeight: 800,
      letterSpacing: 1, color: dr.color, background: dr.color + "22",
      display: "inline-block",
    }}>
      {dr.label}
    </span>
  );
}

// ── Section helpers ─────────────────────────────────────────────
const MASTERY_PILL_COLORS = ["var(--text3)", "#4F7CFF", "#8b5cf6", "var(--orange)", "var(--green)", "var(--accent)"];
const MASTERY_PILL_LABELS = ["○", "Aware", "Drilling", "Owning", "Flowing", "✦"];

function MovementPill({ id, navigate, store }) {
  const m = getMovementById(id);
  if (!m) return <span style={{ fontSize: 11, color: "var(--text3)", padding: "2px 8px", background: "var(--surface3)", borderRadius: 20 }}>{id}</span>;
  const masteryLevel = store ? (store.getMasteryLevel(id) || 0) : 0;
  const masteryColor = MASTERY_PILL_COLORS[masteryLevel];
  return (
    <span
      onClick={() => navigate?.("skill", id)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 11, padding: "3px 10px", borderRadius: 20,
        background: masteryLevel >= 1 ? masteryColor + "18" : "var(--surface2)",
        border: `1px solid ${masteryLevel >= 1 ? masteryColor + "55" : "var(--border)"}`,
        cursor: navigate ? "pointer" : "default", whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: masteryLevel >= 1 ? masteryColor : "var(--text)" }}>{m.name}</span>
      <span style={{ fontSize: 8, fontWeight: 800, color: masteryColor }}>{MASTERY_PILL_LABELS[masteryLevel]}</span>
    </span>
  );
}

// ── Overview Tab ────────────────────────────────────────────────
function OverviewTab() {
  const totalMovements = MOVEMENTS.length;

  // Count movements per difficulty rank
  const rankCounts = {};
  MOVEMENTS.forEach((m) => {
    const dr = DIFF_RANK[m.difficulty];
    if (dr) rankCounts[dr.rank] = (rankCounts[dr.rank] || 0) + 1;
  });

  return (
    <div>
      {/* Sprint summary card */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--accent)", fontWeight: 700, marginBottom: 6 }}>
            SPRINT 1 — 12 WEEKS
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{SPRINT_1.theme}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
            {SPRINT_1.primaryTargets.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <span style={{ color: "var(--accent)" }}>›</span>
                <span style={{ color: "var(--text2)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty rank breakdown */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 12 }}>
            MOVEMENT DIFFICULTY BREAKDOWN — {totalMovements} TOTAL
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["E", "E+", "D", "D+", "C", "C+", "B", "A", "S"].map((r) => {
              const count = rankCounts[r] || 0;
              const dr = Object.values(DIFF_RANK).find((d) => d && d.rank === r);
              const pct = Math.round((count / totalMovements) * 100);
              return (
                <div key={r}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: dr?.color }}>{r} Rank</span>
                    <span style={{ color: "var(--text3)" }}>{count} movements ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: dr?.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily structure */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 12 }}>
            DAILY QUEST STRUCTURE
          </div>
          {[
            { slot: 1, label: "Foot Protocol", dur: "5 min", color: "var(--green)", always: true },
            { slot: 2, label: "Foundation Rotation", dur: "7–10 min", color: "var(--green)", always: true },
            { slot: 3, label: "Sprint Week Focus", dur: "15 min", color: "var(--orange)", always: false },
            { slot: 4, label: "Flow / Conditioning", dur: "10 min", color: "var(--red)", always: false },
            { slot: 5, label: "Recovery / Mobility", dur: "5 min", color: "var(--blue)", always: true },
            { slot: 6, label: "⚡ BONUS QUEST", dur: "+150–250 XP", color: "#c4893a", always: false, bonus: true },
          ].map(({ slot, label, dur, color, always, bonus }) => (
            <div key={slot} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: "1px solid var(--border)",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: bonus ? "var(--accent)" : "var(--surface3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: bonus ? "#fff" : color, flexShrink: 0,
              }}>
                {bonus ? "★" : slot}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: bonus ? "var(--accent)" : "var(--text)" }}>{label}</div>
                {always && !bonus && <div style={{ fontSize: 9, color: "var(--text3)" }}>EVERY DAY</div>}
                {bonus && <div style={{ fontSize: 9, color: "var(--text3)" }}>UNLOCKS WHEN ALL DAILY DONE</div>}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{dur}</div>
            </div>
          ))}
        </div>

        {/* Foundation rotation */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 12 }}>
            FOUNDATION ROTATION
          </div>
          {Object.entries(FOUNDATION_ROTATION).map(([dow, rot]) => {
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return (
              <div key={dow} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                <div style={{ width: 32, fontSize: 11, fontWeight: 700, color: "var(--text3)", flexShrink: 0, paddingTop: 1 }}>
                  {dayNames[dow]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{rot.label}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {rot.drills.map((d) => {
                      const m = getMovementById(d.id);
                      return m ? (
                        <span key={d.id} style={{ fontSize: 10, color: "var(--text2)", padding: "1px 6px", background: "var(--surface2)", borderRadius: 10 }}>
                          {m.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>{rot.duration}m</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Weeks Tab ───────────────────────────────────────────────────
function WeeksTab({ navigate, currentWeek, store }) {
  const [expanded, setExpanded] = useState(currentWeek || 1);
  const [advanceConfirm, setAdvanceConfirm] = useState(false);

  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      {SPRINT_1.weeks.map((w) => {
        const isOpen = expanded === w.week;
        const isCurrent = w.week === currentWeek;
        const isPast = w.week < currentWeek;
        const boss = w.boss ? BOSS_TESTS.find((b) => b.id === w.boss) : null;
        const bonusPreview = buildBonusQuest(w.week, 6, 1); // Saturday sample

        const borderColor = isCurrent ? "var(--accent)" : isPast ? "var(--green)" : "var(--border)";

        return (
          <div
            key={w.week}
            className="card"
            style={{ borderColor, padding: 0, overflow: "hidden" }}
          >
            {/* Header row — always visible */}
            <div
              onClick={() => setExpanded(isOpen ? null : w.week)}
              style={{
                padding: "12px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                background: isCurrent ? "var(--surface2)" : "transparent",
              }}
            >
              {/* Week dot */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
                background: isCurrent ? "var(--accent)" : isPast ? "var(--green)" : "var(--surface3)",
                color: isCurrent || isPast ? "#fff" : "var(--text3)",
              }}>
                {isPast ? "✓" : w.week}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  Week {w.week}
                  {isCurrent && <span style={{ fontSize: 9, fontWeight: 800, color: "var(--accent)", letterSpacing: 1 }}>CURRENT</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 1 }}>{w.theme}</div>
              </div>

              {boss && (
                <span style={{ fontSize: 10, color: "var(--red)", fontWeight: 700, flexShrink: 0 }}>💀 BOSS</span>
              )}
              <span style={{ color: "var(--text3)", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Expanded body */}
            {isOpen && (
              <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }}>

                {/* Focus */}
                <div style={{ padding: "10px 0 8px", fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>
                  {w.focus}
                </div>

                {/* Skills */}
                {w.skills.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                      MOVEMENTS THIS WEEK
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {w.skills.map((id) => (
                        <MovementPill key={id} id={id} navigate={navigate} store={store} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Boss */}
                {boss && (
                  <div style={{ marginBottom: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "var(--red)", marginBottom: 6 }}>
                      💀 {boss.name} — {boss.subtitle}
                    </div>
                    {boss.requirements.map((r, i) => (
                      <div key={i} style={{ fontSize: 11, color: "var(--text3)", display: "flex", gap: 6, marginBottom: 3 }}>
                        <span>◦</span><span>{r.label}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: "var(--yellow)", marginTop: 6 }}>🏆 {boss.reward}</div>
                  </div>
                )}

                {/* Bonus quest preview */}
                <div style={{ marginBottom: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                    ⚡ BONUS QUEST — {bonusPreview.subtitle}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text2)", marginBottom: 8, fontStyle: "italic" }}>
                    {bonusPreview.focus}
                  </div>
                  {[...bonusPreview.strength, ...bonusPreview.conditioning, ...bonusPreview.flexibility].slice(0, 4).map((ex) => (
                    <div key={ex.id} style={{ fontSize: 11, color: "var(--text3)", display: "flex", gap: 6, marginBottom: 3 }}>
                      <span>{ex.icon}</span>
                      <span><strong style={{ color: "var(--text2)" }}>{ex.label}</strong> — {ex.sets}</span>
                    </div>
                  ))}
                  {([...bonusPreview.strength, ...bonusPreview.conditioning, ...bonusPreview.flexibility].length > 4) && (
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>
                      +{[...bonusPreview.strength, ...bonusPreview.conditioning, ...bonusPreview.flexibility].length - 4} more exercises
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "var(--yellow)", marginTop: 8 }}>+{bonusPreview.xpReward} XP</div>
                </div>

                {/* Notes */}
                {w.notes && (
                  <div style={{ fontSize: 11, color: "var(--text3)", padding: "8px 10px", background: "var(--surface3)", borderRadius: 6 }}>
                    📋 {w.notes}
                  </div>
                )}

                {/* Advance week button — only on current week */}
                {isCurrent && currentWeek < 12 && (
                  <div style={{ marginTop: 12 }}>
                    {advanceConfirm ? (
                      <div style={{
                        padding: "10px 12px", borderRadius: 8,
                        background: "var(--accent)" + "18", border: "1px solid var(--accent)",
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
                          Advance to Week {currentWeek + 1}?
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>
                          {SPRINT_1.weeks.find((wk) => wk.week === currentWeek + 1)?.theme}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => { store.advanceWeek(); setAdvanceConfirm(false); }}
                            style={{
                              flex: 1, padding: "8px 0", borderRadius: 8, fontWeight: 800, fontSize: 12,
                              border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer",
                            }}
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => setAdvanceConfirm(false)}
                            style={{
                              flex: 1, padding: "8px 0", borderRadius: 8, fontWeight: 700, fontSize: 12,
                              border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAdvanceConfirm(true)}
                        style={{
                          width: "100%", padding: "9px 0", borderRadius: 8, fontWeight: 800, fontSize: 12,
                          border: "1px solid var(--accent)", background: "transparent",
                          color: "var(--accent)", cursor: "pointer",
                        }}
                      >
                        → Complete Week {currentWeek} · Advance to Week {currentWeek + 1}
                      </button>
                    )}
                  </div>
                )}
                {isCurrent && currentWeek >= 12 && (
                  <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "var(--green)" + "18", border: "1px solid var(--green)", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--green)" }}>🏆 Sprint 1 Complete</div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Movements Tab ───────────────────────────────────────────────
function MovementsTab({ navigate }) {
  const [filterRank, setFilterRank] = useState("ALL");
  const [filterTree, setFilterTree] = useState("ALL");

  const ranks = ["ALL", "E", "E+", "D", "D+", "C", "C+", "B", "A", "S"];

  let filtered = MOVEMENTS;
  if (filterRank !== "ALL") {
    filtered = filtered.filter((m) => DIFF_RANK[m.difficulty]?.rank === filterRank);
  }
  if (filterTree !== "ALL") {
    filtered = filtered.filter((m) => m.tree === filterTree);
  }

  // Group by rank
  const grouped = {};
  filtered.forEach((m) => {
    const r = DIFF_RANK[m.difficulty]?.rank || "?";
    if (!grouped[r]) grouped[r] = [];
    grouped[r].push(m);
  });

  const rankOrder = ["E", "E+", "D", "D+", "C", "C+", "B", "A", "S"];

  return (
    <div>
      {/* Rank filter */}
      <div style={{ padding: "10px 16px 0", display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
        {ranks.map((r) => {
          const dr = Object.values(DIFF_RANK).find((d) => d && d.rank === r);
          const active = filterRank === r;
          return (
            <button
              key={r}
              onClick={() => setFilterRank(r)}
              style={{
                flexShrink: 0, padding: "4px 12px", borderRadius: 20, border: "1px solid",
                borderColor: active ? (dr?.color || "var(--accent)") : "var(--border)",
                background: active ? (dr?.bg || "var(--accent)") : "var(--surface)",
                color: active ? (dr?.color || "#fff") : "var(--text3)",
                fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Tree filter */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
        <button
          onClick={() => setFilterTree("ALL")}
          style={{
            flexShrink: 0, padding: "3px 10px", borderRadius: 20, border: "1px solid",
            borderColor: filterTree === "ALL" ? "var(--accent)" : "var(--border)",
            background: filterTree === "ALL" ? "var(--accent)" : "var(--surface)",
            color: filterTree === "ALL" ? "#fff" : "var(--text3)",
            fontSize: 10, fontWeight: 600, cursor: "pointer",
          }}
        >
          All Trees
        </button>
        {SKILL_TREES.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTree(t.id)}
            style={{
              flexShrink: 0, padding: "3px 10px", borderRadius: 20, border: "1px solid",
              borderColor: filterTree === t.id ? t.color : "var(--border)",
              background: filterTree === t.id ? t.color + "33" : "var(--surface)",
              color: filterTree === t.id ? t.color : "var(--text3)",
              fontSize: 10, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding: "0 16px 10px", fontSize: 11, color: "var(--text3)" }}>
        {filtered.length} movements
      </div>

      {/* Grouped list */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {rankOrder
          .filter((r) => grouped[r]?.length)
          .map((r) => {
            const dr = Object.values(DIFF_RANK).find((d) => d && d.rank === r);
            return (
              <div key={r}>
                <div style={{
                  fontSize: 10, letterSpacing: 2, fontWeight: 800, marginBottom: 8,
                  color: dr?.color, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>{r} RANK</span>
                  <span style={{ color: "var(--text3)", fontWeight: 400 }}>— {grouped[r].length} movements</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {grouped[r].map((m) => {
                    const tree = SKILL_TREES.find((t) => t.id === m.tree);
                    return (
                      <div
                        key={m.id}
                        onClick={() => navigate("skill", m.id)}
                        style={{
                          background: "var(--surface)", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "10px 12px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 10,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text2)" }}>{m.meaning}</div>
                          <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {tree && (
                              <span style={{ fontSize: 9, color: tree.color, fontWeight: 700 }}>{tree.icon} {tree.name}</span>
                            )}
                            <span style={{ fontSize: 9, color: "var(--text3)" }}>Tier {m.tier}</span>
                            {m.prerequisites.length > 0 && (
                              <span style={{ fontSize: 9, color: "var(--text3)" }}>
                                Needs: {m.prerequisites.length} prereq{m.prerequisites.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <DiffRankBadge difficulty={m.difficulty} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ── Bosses Tab ──────────────────────────────────────────────────
function BossesTab({ store }) {
  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      {BOSS_TESTS.filter((b) => !b.isTemplate).map((boss) => {
        const passed = store.isBossPassed(boss.id);
        const tree = SKILL_TREES.find((t) => t.id === boss.tree);
        return (
          <div
            key={boss.id}
            className="card"
            style={{ borderColor: passed ? "var(--green)" : "var(--border)" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{passed ? "✅" : "💀"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{boss.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{boss.subtitle}</div>
                {tree && (
                  <div style={{ fontSize: 10, color: tree.color, marginTop: 3 }}>
                    {tree.icon} {tree.name}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--yellow)" }}>+{boss.xp} XP</div>
            </div>

            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {boss.requirements.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 11 }}>
                  <span style={{ color: "var(--text3)" }}>◦</span>
                  <span style={{ color: "var(--text2)" }}>{r.label}</span>
                </div>
              ))}
            </div>

            {boss.reward && (
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--yellow)", padding: "6px 10px", background: "var(--surface3)", borderRadius: 6 }}>
                🏆 {boss.reward}
              </div>
            )}

            {passed && (
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--green)" }}>
                ✓ Passed {new Date(store.state.bossProgress[boss.id]?.passedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Rank Road Tab ───────────────────────────────────────────────
function RankRoadTab() {
  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6, marginBottom: 4 }}>
        S-rank takes ~11 months of daily base training. Complete the bonus quest daily and reach S in ~6 months.
      </div>

      {RANKS.map((r, i) => {
        const next = RANKS[i + 1];
        const levelsInRange = next ? next.minLevel - r.minLevel : "∞";
        const daysBase = Math.round((r.minLevel - 1) * 100 / 100);
        const daysBonus = Math.round((r.minLevel - 1) * 100 / 225);
        // Movements accessible at this rank difficulty
        const diffMin = i === 0 ? 1 : [1,1,1,3,5,7,8,9][i] || 1;
        const diffMax = [2,4,4,6,6,7,8,9][i] || 9;
        const accessibleMoves = MOVEMENTS.filter((m) => m.difficulty >= diffMin && m.difficulty <= diffMax).length;

        return (
          <div
            key={r.rank}
            className="card"
            style={{ borderColor: r.color, overflow: "hidden" }}
          >
            {/* Rank header */}
            <div style={{
              background: `linear-gradient(90deg, ${r.color}22, transparent)`,
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 12, margin: "-14px -14px 14px",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: r.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 900, color: "#fff", flexShrink: 0,
              }}>
                {r.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: r.color }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{r.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>LV {r.minLevel}</div>
                <div style={{ fontSize: 9, color: "var(--text3)" }}>
                  {next ? `→ LV ${next.minLevel - 1}` : "MAX"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ textAlign: "center", padding: "8px", background: "var(--surface2)", borderRadius: 6 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{daysBase}</div>
                <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Days base</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px", background: "var(--surface2)", borderRadius: 6 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>{daysBonus}</div>
                <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Days +bonus</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px", background: "var(--surface2)", borderRadius: 6 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{levelsInRange}</div>
                <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Levels</div>
              </div>
            </div>

            {/* XP required */}
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--text3)" }}>
              {((r.minLevel - 1) * 100).toLocaleString()} XP required · ~{accessibleMoves} movements in difficulty range
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Annual Tab ──────────────────────────────────────────────────
function AnnualTab({ store, navigate }) {
  const currentWeek = store.state.player.currentWeek || 1;
  const [view, setView] = useState("year");          // "year" | sprint id
  const [expandedWeek, setExpandedWeek] = useState(null);

  if (view === "year") {
    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Hero */}
        <div className="card" style={{ borderColor: "var(--accent)", background: "var(--card-bg)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--accent)", fontWeight: 800 }}>YEAR 1</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{ANNUAL_PROGRAM.title}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{ANNUAL_PROGRAM.subtitle}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>52</div>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Weeks</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>4</div>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Sprints</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>12</div>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Bosses</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>S</div>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>End Rank</div>
            </div>
          </div>
          {/* 52-week bar */}
          <div style={{ marginTop: 12, display: "flex", gap: 2, flexWrap: "wrap" }}>
            {Array.from({ length: 52 }, (_, i) => {
              const w = i + 1;
              const sprint = ANNUAL_PROGRAM.sprints.find((s) => w >= s.weekRange[0] && w <= s.weekRange[1]);
              const isPast = w < currentWeek;
              const isCurrent = w === currentWeek;
              return (
                <div
                  key={w}
                  title={`Week ${w}`}
                  style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: isCurrent ? "var(--accent)" : isPast ? sprint?.color : "var(--surface3)",
                    opacity: isCurrent ? 1 : isPast ? 0.8 : 0.3,
                    border: isCurrent ? "2px solid var(--accent)" : "none",
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>Week {currentWeek} of 52</div>
        </div>

        {/* Monthly calendar */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 12 }}>
            12-MONTH CALENDAR
          </div>
          {MONTHLY_OVERVIEW.map((m) => {
            const sprint = ANNUAL_PROGRAM.sprints.find((s) => s.title === m.phase);
            const [wStart, wEnd] = m.weeks.split("–").map(Number);
            const isCurrent = currentWeek >= wStart && currentWeek <= wEnd;
            const isPast = currentWeek > wEnd;
            return (
              <div
                key={m.month}
                style={{
                  display: "flex", gap: 10, padding: "9px 0",
                  borderBottom: "1px solid var(--border)",
                  background: isCurrent ? "rgba(124,58,237,0.05)" : "transparent",
                }}
              >
                {/* Month number */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800,
                  background: isCurrent ? "var(--accent)" : isPast ? m.color : "var(--surface3)",
                  color: isCurrent || isPast ? "#fff" : "var(--text3)",
                }}>
                  {isPast ? "✓" : m.month}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</span>
                    {isCurrent && <span style={{ fontSize: 9, color: "var(--accent)", fontWeight: 800, letterSpacing: 1 }}>NOW</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>
                    Weeks {m.weeks} · {m.phase}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{m.body}</div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>
                    {sprint?.rankTarget?.split("→")[1]?.trim() || ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sprint cards */}
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700 }}>4 SPRINTS</div>
        {ANNUAL_PROGRAM.sprints.map((s) => {
          const isActive = currentWeek >= s.weekRange[0] && currentWeek <= s.weekRange[1];
          const isDone = currentWeek > s.weekRange[1];
          return (
            <div
              key={s.id}
              className="card"
              style={{ borderColor: isActive ? s.color : isDone ? s.color + "88" : "var(--border)", cursor: "pointer" }}
              onClick={() => setView(s.id)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, background: s.color + "22",
                  border: `2px solid ${s.color}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, fontWeight: 900, color: s.color, flexShrink: 0,
                }}>
                  {isDone ? "✓" : isActive ? "▶" : s.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>{s.name} — {s.title}</span>
                    {isActive && <span style={{ fontSize: 9, color: s.color, fontWeight: 800, letterSpacing: 1 }}>ACTIVE</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Weeks {s.weekLabel} · {s.rankTarget}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 5, lineHeight: 1.5 }}>{s.theme}</div>
                </div>
                <div style={{ fontSize: 18, color: "var(--text3)", flexShrink: 0 }}>›</div>
              </div>
              {/* Goal pills */}
              <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
                {s.primaryGoals.slice(0, 4).map((g, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "2px 8px", background: s.color + "22", color: s.color, borderRadius: 20, fontWeight: 600 }}>
                    {g}
                  </span>
                ))}
                {s.primaryGoals.length > 4 && (
                  <span style={{ fontSize: 10, color: "var(--text3)", padding: "2px 6px" }}>+{s.primaryGoals.length - 4} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Sprint drill-down ──────────────────────────────────────────
  const sprint = ANNUAL_PROGRAM.sprints.find((s) => s.id === view);
  if (!sprint) return null;

  return (
    <div>
      {/* Back */}
      <div
        onClick={() => setView("year")}
        style={{ padding: "12px 16px 0", fontSize: 11, color: "var(--text3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
      >
        ← Back to Year View
      </div>

      {/* Sprint header */}
      <div style={{ padding: "10px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8, background: sprint.color + "22",
            border: `2px solid ${sprint.color}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, fontWeight: 900, color: sprint.color,
          }}>
            {sprint.number}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{sprint.name} — {sprint.title}</div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>Weeks {sprint.weekLabel} · {sprint.rankTarget}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 10, fontStyle: "italic", lineHeight: 1.6 }}>
          {sprint.philosophy}
        </div>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Monthly breakdown */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 10 }}>BY MONTH</div>
          {sprint.byMonth.map((m) => (
            <div key={m.month} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: sprint.color, letterSpacing: 1 }}>MONTH {m.month}</span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>Weeks {m.weeks}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{m.body}</div>
            </div>
          ))}
        </div>

        {/* Primary goals */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 10 }}>SPRINT GOALS</div>
          {sprint.primaryGoals.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: sprint.color, fontWeight: 700 }}>›</span>
              <span style={{ color: "var(--text2)" }}>{g}</span>
            </div>
          ))}
        </div>

        {/* Boss tests */}
        <div className="card" style={{ borderColor: "rgba(201,82,82,0.3)" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--red)", fontWeight: 700, marginBottom: 10 }}>💀 BOSS TESTS</div>
          {sprint.bosses.map((b, i) => (
            <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Bonus quest */}
        <div className="card" style={{ borderColor: "rgba(124,58,237,0.25)" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>⚡ BONUS QUEST FOCUS</div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{sprint.bonusFocus}</div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {sprint.weeklyBonusTheme.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 11 }}>
                <span style={{ color: sprint.color, fontWeight: 700, flexShrink: 0, width: 20 }}>W{sprint.weekRange[0] + i}</span>
                <span style={{ color: "var(--text2)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All movements */}
        <div className="card">
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 10 }}>MOVEMENTS THIS SPRINT</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sprint.movements.map((name) => (
              <span key={name} style={{ fontSize: 11, padding: "3px 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 20 }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Week-by-week */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 10 }}>WEEK BY WEEK</div>
          {sprint.weeks.map((w) => {
            const isOpen = expandedWeek === w.week;
            const isCurrent = w.week === currentWeek;
            const isPast = w.week < currentWeek;
            return (
              <div
                key={w.week}
                style={{
                  background: "var(--surface)", border: "1px solid",
                  borderColor: isCurrent ? sprint.color : isPast ? sprint.color + "44" : "var(--border)",
                  borderRadius: 10, marginBottom: 8, overflow: "hidden",
                }}
              >
                <div
                  onClick={() => setExpandedWeek(isOpen ? null : w.week)}
                  style={{ padding: "11px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                    background: isCurrent ? sprint.color : isPast ? sprint.color + "88" : "var(--surface3)",
                    color: isCurrent || isPast ? "#fff" : "var(--text3)",
                  }}>
                    {isPast ? "✓" : w.week}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      Week {w.week} — {w.theme}
                      {isCurrent && <span style={{ fontSize: 9, color: sprint.color, fontWeight: 800, letterSpacing: 1 }}>NOW</span>}
                      {w.boss && <span style={{ fontSize: 9, color: "var(--red)", fontWeight: 800 }}>💀</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{w.focus}</div>
                  </div>
                  <span style={{ color: "var(--text3)", fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 14px 12px", borderTop: "1px solid var(--border)" }}>
                    {w.skills?.length > 0 && (
                      <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", marginBottom: 6 }}>SKILLS</div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {w.skills.map((id) => (
                            <MovementPill key={id} id={id} navigate={navigate} store={store} />
                          ))}
                        </div>
                      </div>
                    )}
                    {w.notes && (
                      <div style={{ fontSize: 11, color: "var(--text3)", padding: "7px 10px", background: "var(--surface3)", borderRadius: 6 }}>
                        📋 {w.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Sequences Tab ───────────────────────────────────────────────
const DIFF_COLORS = ["#4F7CFF","#4F7CFF","#4F7CFF","#2E8C78","#2E8C78","#D9A441","#D9A441","#D4854A","#C95252","#D4854A"];

function SequencesTab({ navigate, store }) {
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("sequences"); // "sequences" | "conditioning"

  if (view === "conditioning") {
    return (
      <div style={{ padding: 16 }}>
        <button
          onClick={() => setView("sequences")}
          style={{ fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}
        >
          ← Back to Sequences
        </button>

        <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>
          GERARD TAYLOR — CAPOEIRA CONDITIONING (2005)
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 16, lineHeight: 1.5 }}>
          Solo conditioning workouts built from core capoeira movements. Each session 7–10 minutes. Do one anytime — before training, on rest days, or stacked for longer sessions.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TAYLOR_WORKOUTS.map((w) => (
            <div key={w.id} className="card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{w.description}</div>
                </div>
                <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: "var(--red)", background: "var(--surface2)", padding: "3px 10px", borderRadius: 20 }}>
                  {w.duration}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                {w.target.map((t) => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 8px", background: "var(--surface3)", color: "var(--text3)", borderRadius: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {w.exercises.map((ex, i) => (
                  <div key={i} style={{ padding: "8px 10px", background: "var(--surface2)", borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--red)" }}>{ex.move}</div>
                    {(ex.reps || ex.duration) && (
                      <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                        {ex.reps ? `${ex.reps} reps` : ex.duration}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3, fontStyle: "italic" }}>{ex.note}</div>
                  </div>
                ))}
              </div>
              {w.sets && (
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>
                  {w.sets} sets · {w.format}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Header + switch */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--text3)", fontWeight: 700 }}>MESTRE BIMBA</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>8 Training Sequences</div>
        </div>
        <button
          onClick={() => setView("conditioning")}
          style={{
            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
            border: "1px solid var(--red)", color: "var(--red)", background: "transparent", cursor: "pointer",
          }}
        >
          🔥 Conditioning
        </button>
      </div>

      <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 16, lineHeight: 1.5 }}>
        Partner drills — each sequence encodes attack, defense, and counter-attack. Train both roles. Solo: shadow the full sequence, both sides.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BIMBA_SEQUENCES.map((seq) => {
          const isOpen = expanded === seq.id;
          const diffColor = DIFF_COLORS[seq.difficulty] || "#7c3aed";
          return (
            <div
              key={seq.id}
              className="card"
              style={{ padding: 0, overflow: "hidden", borderColor: isOpen ? diffColor : "var(--border)" }}
            >
              {/* Header */}
              <div
                onClick={() => setExpanded(isOpen ? null : seq.id)}
                style={{
                  padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                  background: isOpen ? `${diffColor}11` : "transparent",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: diffColor + "33",
                  border: `2px solid ${diffColor}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 900, color: diffColor,
                }}>
                  {seq.number}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{seq.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{seq.theme}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: diffColor + "33", color: diffColor, fontWeight: 800 }}>
                    D{seq.difficulty}
                  </span>
                  <span style={{ color: "var(--text3)", fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)" }}>

                  {/* Description */}
                  <div style={{ padding: "10px 0 8px", fontSize: 12, color: "var(--text2)", fontStyle: "italic", lineHeight: 1.5 }}>
                    {seq.description}
                  </div>

                  {/* Prerequisites */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 6 }}>REQUIRES</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {seq.prerequisiteMovements.map((id) => (
                        <MovementPill key={id} id={id} navigate={navigate} store={store} />
                      ))}
                    </div>
                  </div>

                  {/* Partner steps */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>PARTNER SEQUENCE</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {seq.steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "5px 8px", background: "var(--surface2)", borderRadius: 6 }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 800,
                            background: step.role === "A" ? diffColor + "44" : "var(--surface3)",
                            color: step.role === "A" ? diffColor : "var(--text3)",
                          }}>
                            {step.role}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text2)" }}>{step.move}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solo variant */}
                  <div style={{ marginBottom: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--blue)", fontWeight: 700, marginBottom: 6 }}>SOLO SHADOW DRILL</div>
                    {seq.soloVariant.map((line, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>
                        <span style={{ color: "var(--blue)" }}>›</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>

                  {/* Drill instructions */}
                  <div style={{ padding: "8px 10px", background: "var(--surface3)", borderRadius: 6, fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
                    📋 {seq.drillInstructions}
                  </div>

                  {seq.notes && (
                    <div style={{ marginTop: 8, padding: "6px 10px", background: "var(--surface2)", borderRadius: 6, fontSize: 11, color: "var(--orange)", fontStyle: "italic" }}>
                      ⚠️ {seq.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────
const TABS = [
  { id: "annual",    label: "Year 1" },
  { id: "overview",  label: "Sprint 1" },
  { id: "weeks",     label: "12 Weeks" },
  { id: "sequences", label: "Sequences" },
  { id: "moves",     label: "Movements" },
  { id: "bosses",    label: "Bosses" },
  { id: "ranks",     label: "Rank Road" },
];

export default function TrainingPlan({ store, navigate }) {
  const [tab, setTab] = useState("annual");
  const currentWeek = store.state.player.currentWeek || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Page header */}
      <div style={{ padding: "12px 16px 0", flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--text3)", fontWeight: 700 }}>TRAINING PLAN</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>Year 1 — 52 Weeks</div>
          {/* Sprint 1 progress bar */}
          <div style={{ marginTop: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>
                Sprint 1 · Week {currentWeek}/12
              </span>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>
                {Math.round((currentWeek / 12) * 100)}%
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "var(--surface2)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2, background: "var(--accent)",
                width: `${Math.min(100, (currentWeek / 12) * 100)}%`,
                transition: "width 0.3s",
              }} />
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("generator")}
          style={{
            marginTop: 4, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            border: "1px solid var(--accent)", background: "var(--accent)" + "18",
            color: "var(--accent)", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Generate
        </button>
      </div>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: 6, padding: "10px 16px 10px", paddingRight: 24, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: "1px solid",
              borderColor: tab === t.id ? "var(--accent)" : "var(--border)",
              background: tab === t.id ? "var(--accent)" : "var(--surface)",
              color: tab === t.id ? "#fff" : "var(--text3)",
              fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "annual"    && <AnnualTab store={store} navigate={navigate} />}
        {tab === "overview"  && <OverviewTab />}
        {tab === "weeks"     && <WeeksTab navigate={navigate} currentWeek={currentWeek} store={store} />}
        {tab === "sequences" && <SequencesTab navigate={navigate} store={store} />}
        {tab === "moves"     && <MovementsTab navigate={navigate} />}
        {tab === "bosses"    && <BossesTab store={store} />}
        {tab === "ranks"     && <RankRoadTab />}
      </div>
    </div>
  );
}
