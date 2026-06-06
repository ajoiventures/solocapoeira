import { useState, useMemo, memo } from "react";
import FirstUseTooltip from "../components/FirstUseTooltip.jsx";
import { SKILL_TREES } from "../data/trees.js";
import { MOVEMENTS, getMovementsByTree, getMovementById } from "../data/movements.js";
import { SPRINT_1 } from "../data/sprint.js";
import { getMovementPhaseInfo } from "../data/movementPhases.js";
import { DiffRankBadge } from "./TrainingPlan.jsx";
import { SEQUENCES, RANK_META, SEQ_TYPES, RANK_ORDER } from "../data/sequences.js";

const MASTERY_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];
const MASTERY_CHIP_CLASS = ["chip-locked", "chip-aware", "chip-learning", "chip-practicing", "chip-competent", "chip-mastered"];

const MASTERY_FILTERS = [
  { id: "all",      label: "All" },
  { id: "locked",   label: "Locked" },
  { id: "progress", label: "In Progress" },
  { id: "mastered", label: "Mastered" },
  { id: "rusty",    label: "⚡ Rusty" },
];

const VIRTUAL_MOVEMENT_ROW_HEIGHT = 96;
const VIRTUAL_MOVEMENT_OVERSCAN = 6;
const VIRTUAL_MOVEMENT_MAX_HEIGHT = 560;

function VirtualizedMovementList({ movements, renderMovement }) {
  const [scrollTop, setScrollTop] = useState(0);
  const viewportHeight = Math.min(
    VIRTUAL_MOVEMENT_MAX_HEIGHT,
    Math.max(VIRTUAL_MOVEMENT_ROW_HEIGHT * 2, movements.length * VIRTUAL_MOVEMENT_ROW_HEIGHT)
  );
  const totalHeight = movements.length * VIRTUAL_MOVEMENT_ROW_HEIGHT;
  const firstVisible = Math.floor(scrollTop / VIRTUAL_MOVEMENT_ROW_HEIGHT);
  const visibleCount = Math.ceil(viewportHeight / VIRTUAL_MOVEMENT_ROW_HEIGHT);
  const startIndex = Math.max(0, firstVisible - VIRTUAL_MOVEMENT_OVERSCAN);
  const endIndex = Math.min(movements.length, firstVisible + visibleCount + VIRTUAL_MOVEMENT_OVERSCAN);
  const visibleMovements = movements.slice(startIndex, endIndex);

  return (
    <div
      className="virtual-movement-list"
      style={{ height: viewportHeight }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      role="list"
      aria-label={`${movements.length} movement search results`}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleMovements.map((movement, visibleIndex) => {
          const absoluteIndex = startIndex + visibleIndex;
          return (
            <div
              key={movement.id}
              className="virtual-movement-row"
              style={{ transform: `translateY(${absoluteIndex * VIRTUAL_MOVEMENT_ROW_HEIGHT}px)` }}
              role="listitem"
            >
              {renderMovement(movement)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MasteryDots({ level }) {
  return (
    <div className="mastery-dots">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`mastery-dot${i <= level ? (level === 5 ? " mastered" : " filled") : ""}`}
        />
      ))}
    </div>
  );
}

const MovementCard = memo(function MovementCard({ movement, masteryLevel, isUnlocked, onClick, onQuickLog, currentReps, lastTrained, currentPhase, todayStr, nowMs }) {
  const phaseInfo = getMovementPhaseInfo(movement.id);
  const isPhaseGated = currentPhase < phaseInfo.availableFrom;
  const locked = (!isUnlocked || isPhaseGated) && masteryLevel === 0;
  const isInstinct = masteryLevel === 5;
  const daysSinceTraining = lastTrained
    ? Math.floor((nowMs - new Date(lastTrained + "T12:00:00")) / 86400000)
    : null;
  const isRusty = masteryLevel >= 2 && daysSinceTraining !== null && daysSinceTraining >= 14;
  const lastTrainedLabel = (() => {
    if (!lastTrained) return null;
    if (lastTrained === todayStr) return "today";
    return `${daysSinceTraining}d ago`;
  })();
  return (
    <div
      className={`movement-card${locked ? " locked" : ""}`}
      onClick={locked ? undefined : onClick}
      style={isInstinct ? {
        borderColor: "var(--accent)",
        background: "var(--accent)" + "0a",
        boxShadow: "0 0 0 1px var(--accent)44",
      } : undefined}
    >
      <div className="movement-card-info">
        <div className="movement-name" style={isInstinct ? { color: "var(--accent)" } : undefined}>
          {isInstinct && <span style={{ marginRight: 4, fontSize: 10 }}>✦</span>}
          {movement.name}
        </div>
        <div className="movement-meaning">{movement.meaning}</div>
        <div className="movement-meta">
          <span className={`tier-badge tier-${movement.tier}`}>T{movement.tier}</span>
          <DiffRankBadge difficulty={movement.difficulty} size="sm" />
          {isRusty && (
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 20, fontWeight: 700,
              background: "rgba(212,133,74,0.15)", color: "var(--orange)",
              border: "1px solid rgba(212,133,74,0.3)",
            }}>⚡ Rusty</span>
          )}
          {isInstinct ? (
            <span style={{
              fontSize: 10, padding: "1px 7px", borderRadius: 20, fontWeight: 800,
              background: "var(--accent)" + "22", color: "var(--accent)",
              border: "1px solid var(--accent)55",
            }}>✦ Instinct</span>
          ) : isPhaseGated ? (
            <span style={{
              fontSize: 10, padding: "1px 7px", borderRadius: 20, fontWeight: 700,
              background: "rgba(100,100,100,0.2)", color: "var(--text3)",
              border: "1px solid rgba(100,100,100,0.3)",
            }}>🔒 Phase {phaseInfo.availableFrom}</span>
          ) : (
            <span className={`chip ${MASTERY_CHIP_CLASS[masteryLevel]}`}>{MASTERY_LABELS[masteryLevel]}</span>
          )}
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <MasteryDots level={masteryLevel} />
        {!locked && onQuickLog && (
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onQuickLog(); }}
              style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 800,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--accent)", cursor: "pointer",
              }}
            >
              +5
            </button>
            {movement.tier === 1 && (
              <FirstUseTooltip
                id="quick-log-btn"
                title="Quick Log"
                body="Tap +5 to log 5 reps instantly. Reps build mastery — keep going until you hit Drilling, Owning, then Instinct."
                position="bottom"
              />
            )}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          {currentReps > 0 && (
            <div style={{ fontSize: 8, color: "var(--text3)", fontWeight: 600 }}>
              {currentReps >= 1000 ? `${(currentReps / 1000).toFixed(1)}k` : currentReps}r
            </div>
          )}
          {lastTrainedLabel && (
            <div style={{ fontSize: 8, color: lastTrainedLabel === "today" ? "var(--green)" : "var(--text3)", fontWeight: 600 }}>
              {lastTrainedLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prev, next) =>
  prev.masteryLevel  === next.masteryLevel  &&
  prev.isUnlocked    === next.isUnlocked    &&
  prev.currentReps   === next.currentReps   &&
  prev.lastTrained   === next.lastTrained   &&
  prev.currentPhase  === next.currentPhase  &&
  prev.movement.id   === next.movement.id
);

function SequenceCard({ seq, onClick, lastPracticed, todayStr, sevenDaysAgo, nowMs }) {
  const rank = RANK_META[seq.rank] || {};
  const seqType = SEQ_TYPES[seq.type] || {};
  const recentlyPracticed = lastPracticed && lastPracticed >= sevenDaysAgo;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 10,
        background: "var(--card-bg, var(--surface))",
        border: `1px solid ${recentlyPracticed ? "var(--green)" : "var(--card-border, var(--border))"}`,
        cursor: "pointer", marginBottom: 6,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: rank.color + "22", color: rank.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: 14,
      }}>
        {seq.rank}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{seq.name}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{
            fontSize: 10, padding: "1px 6px", borderRadius: 10,
            background: (seqType.color || "var(--accent)") + "22",
            color: seqType.color || "var(--accent)",
          }}>
            {seqType.label || seq.type}
          </span>
          <span style={{ fontSize: 10, color: "var(--text3)" }}>
            {seq.movements.length} movement{seq.movements.length !== 1 ? "s" : ""}
          </span>
          {recentlyPracticed && (
            <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700 }}>
              {lastPracticed === todayStr ? "✓ today" : `✓ ${Math.floor((nowMs - new Date(lastPracticed + "T12:00:00")) / 86400000)}d ago`}
            </span>
          )}
        </div>
      </div>
      <span style={{ fontSize: 16, color: "var(--text3)" }}>›</span>
    </div>
  );
}

export default function SkillTrees({ store, navigate }) {
  const [view, setView] = useState("trees"); // "trees" | "sequences"
  const [activeTree, setActiveTree] = useState("Foundation");
  const [activeRank, setActiveRank] = useState("U");
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateContext] = useState(() => {
    const now = new Date();
    const nowMs = now.getTime();
    return {
      nowMs,
      todayStr: now.toISOString().split("T")[0],
      sevenDaysAgo: new Date(nowMs - 7 * 86400000).toISOString().split("T")[0],
    };
  });

  const currentPhase = store.getCurrentPhase?.() ?? 1;
  const unlockedIds = store.getUnlockedMovementIds();
  const tree = SKILL_TREES.find((t) => t.id === activeTree);
  const movements = getMovementsByTree(activeTree);

  // Stats for active tree
  const total = movements.length;
  const unlocked = movements.filter((m) => unlockedIds.includes(m.id)).length;
  const mastered = movements.filter((m) => (store.getMasteryLevel(m.id) || 0) >= 5).length;

  // Per-tree mastery count badges
  const treeCounts = useMemo(() => {
    const counts = {};
    SKILL_TREES.forEach((t) => {
      const mvs = MOVEMENTS.filter((m) => m.tree === t.id);
      counts[t.id] = {
        mastered: mvs.filter((m) => (store.getMasteryLevel(m.id) || 0) >= 5).length,
        total: mvs.length,
      };
    });
    return counts;
  }, [store]);

  // Mastery-filtered movements for active tree
  const filteredMovements = movements.filter((m) => {
    const lvl = store.getMasteryLevel(m.id) || 0;
    if (masteryFilter === "locked") return lvl === 0;
    if (masteryFilter === "progress") return lvl >= 1 && lvl < 5;
    if (masteryFilter === "mastered") return lvl >= 5;
    if (masteryFilter === "rusty") {
      if (lvl < 2) return false;
      const last = store.getMovementLastTrained?.(m.id);
      if (!last) return false;
      const days = Math.floor((dateContext.nowMs - new Date(last + "T12:00:00")) / 86400000);
      return days >= 14;
    }
    return true;
  });

  // Group by tier
  const maxTier = tree?.maxTier || 5;
  const tiers = [];
  for (let t = 1; t <= maxTier; t++) {
    const items = filteredMovements.filter((m) => m.tier === t);
    if (items.length > 0) tiers.push({ tier: t, items });
  }

  // Sequences for active rank
  const rankSeqs = SEQUENCES.filter((s) => s.rank === activeRank);
  const totalSeqs = SEQUENCES.length;

  // Last-trained lookup map: movementId → most recent date
  const lastTrainedMap = useMemo(() => {
    const map = new Map();
    (store.state?.repLog || []).forEach(({ movementId, date }) => {
      if (!map.has(movementId) || date > map.get(movementId)) map.set(movementId, date);
    });
    return map;
  }, [store.state?.repLog]);

  // Search results — across all movements + sequences
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { movements: [], sequences: [] };
    const mvResults = MOVEMENTS.filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.meaning.toLowerCase().includes(q) ||
      m.tree.toLowerCase().includes(q) ||
      (m.category || []).some((c) => c.toLowerCase().includes(q))
    );
    const seqResults = SEQUENCES.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.context || "").toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.rank.toLowerCase().includes(q)
    );
    return { movements: mvResults, sequences: seqResults };
  }, [searchQuery]);

  return (
    <div className="page">
      {/* Page title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="page-title">Movement</span>
        <span style={{ fontSize: 11, color: "var(--text2)" }}>
          {MOVEMENTS.length} moves · {totalSeqs} sequences
        </span>
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <svg
          viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--text3)", pointerEvents: "none",
          }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search movements & sequences…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "8px 32px 8px 30px", borderRadius: 10, fontSize: 13,
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--text)", outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text3)", fontSize: 18, lineHeight: 1, padding: 2,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── SEARCH RESULTS ── */}
      {isSearching && (
        <div>
          {searchResults.movements.length === 0 && searchResults.sequences.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text3)", fontSize: 13 }}>
              No results for "{searchQuery}"
            </div>
          )}

          {searchResults.movements.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
                color: "var(--text3)", textTransform: "uppercase", marginBottom: 6, marginTop: 4,
              }}>
                Movements ({searchResults.movements.length})
              </div>
              <VirtualizedMovementList
                key={searchQuery}
                movements={searchResults.movements}
                renderMovement={(m) => (
                  <MovementCard
                    movement={m}
                    masteryLevel={store.getMasteryLevel(m.id)}
                    isUnlocked={unlockedIds.includes(m.id) || m.prerequisites.length === 0}
                    onClick={() => navigate("skill", m.id)}
                    onQuickLog={() => store.incrementReps(m.id, 5)}
                    currentReps={store.getMovementReps(m.id)}
                    lastTrained={lastTrainedMap.get(m.id)}
                    currentPhase={currentPhase}
                    todayStr={dateContext.todayStr}
                    nowMs={dateContext.nowMs}
                  />
                )}
              />
            </>
          )}

          {searchResults.sequences.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
                color: "var(--text3)", textTransform: "uppercase", marginBottom: 6,
              }}>
                Sequences ({searchResults.sequences.length})
              </div>
              {searchResults.sequences.map((seq) => (
                <SequenceCard
                  key={seq.id}
                  seq={seq}
                  lastPracticed={store.getSeqLastPracticed?.(seq.id)}
                  todayStr={dateContext.todayStr}
                  sevenDaysAgo={dateContext.sevenDaysAgo}
                  nowMs={dateContext.nowMs}
                  onClick={() => navigate("sequence", seq.id, { backTo: "movement", backLabel: "Sequences" })}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* ── NORMAL VIEW (hidden while searching) ── */}
      {!isSearching && (
        <>
          {/* ── Sprint Focus strip ── */}
          {(() => {
            const week = store.state.player?.currentWeek || 1;
            const weekData = SPRINT_1.weeks?.[Math.min(week - 1, 11)];
            const focusIds = weekData?.skills || [];
            if (!focusIds.length) return null;
            return (
              <div style={{
                marginBottom: 10,
                background: "var(--surface2)", borderRadius: 8,
                padding: "10px 12px", border: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5 }}>
                    Week {week} Focus
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>
                    {weekData.theme}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {focusIds.map((id) => {
                    const mv = getMovementById(id);
                    if (!mv) return null;
                    const lvl = store.getMasteryLevel(id) || 0;
                    const chipClass = ["chip-locked","chip-aware","chip-learning","chip-practicing","chip-competent","chip-mastered"][lvl];
                    return (
                      <button
                        key={id}
                        onClick={() => navigate("skill", id, { backTo: "movement", backLabel: "Movement" })}
                        className={`chip ${chipClass}`}
                        style={{ cursor: "pointer", border: "none", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}
                      >
                        {mv.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Concept Tree progress strip */}
          {(() => {
            const ct = store.state.conceptTreeProgress || {};
            const trees = [
              { id: "mandinga",    label: "Mandinga",    icon: "🎵", color: "#E5A400" },
              { id: "malandragem", label: "Malandragem", icon: "🧠", color: "#4F7CFF" },
              { id: "malicia",     label: "Malícia",     icon: "🎭", color: "#7C3AED" },
            ];
            const anyProgress = trees.some((t) => (ct[t.id] || 0) > 0);
            return (
              <div
                onClick={() => navigate("concepts")}
                style={{
                  display: "flex", gap: 6, marginBottom: 10,
                  background: "var(--surface2)", borderRadius: 8,
                  padding: "8px 10px", cursor: "pointer",
                  border: "1px solid var(--border)",
                }}
              >
                {trees.map((t) => {
                  const lvl = ct[t.id] || 0;
                  return (
                    <div key={t.id} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "var(--text3)", marginBottom: 3, fontWeight: 700 }}>
                        {t.icon} {t.label}
                      </div>
                      <div style={{
                        height: 4, borderRadius: 2,
                        background: "var(--surface3)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${(lvl / 5) * 100}%`,
                          background: t.color,
                          transition: "width 0.4s",
                        }} />
                      </div>
                      <div style={{ fontSize: 9, color: t.color, fontWeight: 800, marginTop: 2 }}>
                        {lvl}/5
                      </div>
                    </div>
                  );
                })}
                {!anyProgress && (
                  <button
                    onClick={() => navigate("roda")}
                    style={{
                      flex: 1, background: "none", border: "none", cursor: "pointer",
                      textAlign: "left", padding: 0,
                    }}
                  >
                    <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600, marginBottom: 2 }}>
                      Concept Trees — not started
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text3)", lineHeight: 1.5 }}>
                      Defeat a Mestre in the Roda to advance Mandinga, Malandragem, or Malícia. Trees gate Orisha integration.
                    </div>
                    <div style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700, marginTop: 4 }}>
                      Go to Roda →
                    </div>
                  </button>
                )}
              </div>
            );
          })()}

          {/* View toggle */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button
              onClick={() => setView("trees")}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 8, fontWeight: 700,
                fontSize: 12, border: "1px solid var(--border)", cursor: "pointer",
                background: view === "trees" ? "var(--accent)" : "var(--surface2)",
                color: view === "trees" ? "#fff" : "var(--text2)",
              }}
            >
              Skill Trees
            </button>
            <button
              onClick={() => setView("sequences")}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 8, fontWeight: 700,
                fontSize: 12, border: "1px solid var(--border)", cursor: "pointer",
                background: view === "sequences" ? "var(--accent)" : "var(--surface2)",
                color: view === "sequences" ? "#fff" : "var(--text2)",
              }}
            >
              Sequences
            </button>
          </div>

          {/* ── SKILL TREES VIEW ── */}
          {view === "trees" && (
            <>
              {/* Tree tabs with mastered/total badges */}
              <div className="tree-tabs">
                {SKILL_TREES.map((t) => {
                  const counts = treeCounts[t.id] || { mastered: 0, total: 0 };
                  const isActive = activeTree === t.id;
                  return (
                    <button
                      key={t.id}
                      className={`tree-tab${isActive ? " active" : ""}`}
                      onClick={() => { setActiveTree(t.id); setMasteryFilter("all"); }}
                    >
                      <span>{t.icon} {t.name}</span>
                      <span style={{
                        display: "block", fontSize: 9, fontWeight: 700, marginTop: 2,
                        color: isActive ? t.color : "var(--text3)",
                      }}>
                        {counts.mastered}/{counts.total}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tree header */}
              {tree && (
                <div className="card">
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 32 }}>{tree.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{tree.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{tree.description}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{total}</div>
                          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Total</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: tree.color }}>{unlocked}</div>
                          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Unlocked</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--green)" }}>{mastered}</div>
                          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Mastered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 10 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${total ? (mastered / total) * 100 : 0}%`, background: tree.color }}
                    />
                  </div>
                </div>
              )}

              {/* Mastery filter pills */}
              <div style={{ position: "relative", display: "flex", gap: 5, marginBottom: 8, overflowX: "auto", paddingBottom: 2 }}>
                <FirstUseTooltip
                  id="mastery-filters"
                  title="Filter by mastery"
                  body="Filter your tree by mastery stage — Needs Drilling shows what to train today. ⚡ Rusty highlights movements you haven't touched in 14+ days."
                  position="bottom"
                  accent="var(--blue)"
                />
                {MASTERY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMasteryFilter(f.id)}
                    style={{
                      flexShrink: 0, padding: "4px 12px", borderRadius: 20, fontSize: 11,
                      fontWeight: 700, cursor: "pointer",
                      border: `1px solid ${masteryFilter === f.id ? "var(--accent)" : "var(--border)"}`,
                      background: masteryFilter === f.id ? "var(--accent)" : "var(--surface2)",
                      color: masteryFilter === f.id ? "#fff" : "var(--text2)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Tier groups */}
              {tiers.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: "var(--text3)", fontSize: 13 }}>
                  No movements match this filter.
                </div>
              ) : (
                tiers.map(({ tier, items }) => (
                  <div key={tier} className="tier-group">
                    <div className="tier-label">TIER {tier}</div>
                    <div className="tier-movements">
                      {items.map((m) => (
                        <MovementCard
                          key={m.id}
                          movement={m}
                          masteryLevel={store.getMasteryLevel(m.id)}
                          isUnlocked={unlockedIds.includes(m.id) || m.prerequisites.length === 0}
                          onClick={() => navigate("skill", m.id)}
                          onQuickLog={() => store.incrementReps(m.id, 5)}
                          currentReps={store.getMovementReps(m.id)}
                          lastTrained={lastTrainedMap.get(m.id)}
                          currentPhase={currentPhase}
                          todayStr={dateContext.todayStr}
                          nowMs={dateContext.nowMs}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* ── SEQUENCES VIEW ── */}
          {view === "sequences" && (
            <>
              {/* Rank tabs */}
              <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4, marginBottom: 8 }}>
                {RANK_ORDER.map((r) => {
                  const rm = RANK_META[r];
                  const count = SEQUENCES.filter((s) => s.rank === r).length;
                  return (
                    <button
                      key={r}
                      onClick={() => setActiveRank(r)}
                      style={{
                        flexShrink: 0, padding: "5px 10px", borderRadius: 20,
                        fontWeight: 700, fontSize: 11, cursor: "pointer",
                        border: `1px solid ${activeRank === r ? rm.color : "var(--border)"}`,
                        background: activeRank === r ? rm.color + "22" : "var(--surface2)",
                        color: activeRank === r ? rm.color : "var(--text3)",
                      }}
                    >
                      {r} · {count}
                    </button>
                  );
                })}
              </div>

              {/* Rank header */}
              {(() => {
                const rm = RANK_META[activeRank];
                return (
                  <div className="card" style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: rm.color + "22", color: rm.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: 20,
                      }}>
                        {activeRank}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: rm.color }}>{rm.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{rm.cordName}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{rankSeqs.length}</div>
                        <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Sequences</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Sequence cards */}
              {rankSeqs.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "28px 20px",
                  background: "var(--surface2)", borderRadius: 10,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🗡️</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                    No sequences at this rank yet
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, marginBottom: 14 }}>
                    Defeat Mestres on the Roda to unlock their 5 signature sequences. Each Mestre unlocks a unique movement chain.
                  </div>
                  <button
                    onClick={() => navigate("roda")}
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "7px 18px", borderRadius: 8,
                      background: "var(--accent)", color: "#0A1018", border: "none", cursor: "pointer",
                    }}
                  >
                    Go to Roda →
                  </button>
                </div>
              ) : (
                rankSeqs.map((seq) => (
                  <SequenceCard
                    key={seq.id}
                    seq={seq}
                    lastPracticed={store.getSeqLastPracticed?.(seq.id)}
                    todayStr={dateContext.todayStr}
                    sevenDaysAgo={dateContext.sevenDaysAgo}
                    nowMs={dateContext.nowMs}
                    onClick={() => navigate("sequence", seq.id, { backTo: "movement", backLabel: "Sequences" })}
                  />
                ))
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
