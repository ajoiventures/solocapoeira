import { useState, useEffect, useRef, useMemo } from "react";
import { getMovementById, MOVEMENTS } from "../data/movements.js";
import { SKILL_TREES } from "../data/trees.js";
import { FOUNDATION_ROTATION, SPRINT_1 } from "../data/sprint.js";
import { buildBonusQuest, getRank, getLevelFromXP, getLevelProgress } from "../data/bonusQuests.js";
import { getDailyExtras, getSandSession } from "../data/extraWork.js";
import { isMovementAvailableInPhase } from "../data/movementPhases.js";
import StepsTracker from "../components/StepsTracker.jsx";
import { getAllMestres } from "../data/mestres.js";
import { getCurrentMonthChallenge } from "../data/monthlyChallenges.js";
import { getAllCoreOrishas } from "../data/orishas.js";
import { BOSS_TESTS } from "../data/bossTests.js";
import { SEQUENCES, RANK_META, SEQ_TYPES, RANK_ORDER } from "../data/sequences.js";
import FlowSessionCard from "../components/FlowSessionCard.jsx";
import DailyBonusChallenge from "../components/DailyBonusChallenge.jsx";
import SessionLogBlock from "../components/SessionLogBlock.jsx";
import CheckInCard from "../components/daily/CheckInCard.jsx";
import CollapsibleSection from "../components/daily/CollapsibleSection.jsx";
import BonusSection from "../components/daily/BonusSection.jsx";
import NeedsDrillingCard from "../components/daily/NeedsDrillingCard.jsx";

function buildDailyQuests(store) {
  const today = new Date();
  const dow = today.getDay();
  const rotation = FOUNDATION_ROTATION[dow];
  const painToday = store.getTodayPain();
  const highPain = painToday && (painToday.foot > 3 || painToday.knee > 3 || painToday.wrist > 3);
  const currentPhase = store.getCurrentPhase?.() ?? 1;

  const quests = [];

  // 1. Foot quest — always
  quests.push({
    id: "q_foot",
    slot: 1,
    label: "Foot Protocol",
    tree: "Foot",
    icon: "🦶",
    duration: "5 min",
    xp: 20,
    items: [
      { text: "Foot rolling",     movementId: "foot_rolling", detail: "2 min each foot" },
      { text: "Short foot drill", movementId: "short_foot",   detail: "10 × 10s each foot" },
      { text: "Toe yoga",         movementId: "toe_yoga",     detail: "10 reps each foot" },
    ],
    color: "#86efac",
  });

  // 2. Foundation quest — always (rotated, phase-gated)
  // Uses per-movement drill instructions from FOUNDATION_ROTATION.drills[]
  // Filter to movements available in current phase
  const foundationDrills = rotation.drills.filter((d) => isMovementAvailableInPhase(d.id, currentPhase));
  quests.push({
    id: "q_foundation",
    slot: 2,
    label: rotation.label,
    tree: "Foundation",
    icon: "🏛️",
    duration: `${rotation.duration} min`,
    xp: 30,
    items: foundationDrills.map((d) => ({ text: d.instruction, movementId: d.id })),
    color: "#4ade80",
  });

  // 3. Skill Drill — specific drill protocol from sprint week (not a movement list)
  const week = store.state.player.currentWeek || 1;
  const sprintWeek = SPRINT_1.weeks[Math.min(week - 1, SPRINT_1.weeks.length - 1)];

  quests.push({
    id: "q_primary",
    slot: 3,
    label: `Week ${week}: ${sprintWeek.theme}`,
    tree: "Sprint",
    icon: "⚡",
    duration: "15 min",
    xp: 50,
    items: sprintWeek.drills.map((s) => ({ text: s })),
    color: "#f97316",
    notes: sprintWeek.focus,
  });

  // 4. Flow Conditioning — timed challenge, NOT a movement list
  // Purpose is cardiovascular + muscular endurance, not skill drilling (that's Slot 3)
  if (!highPain) {
    const cond = sprintWeek.conditioning;

    quests.push({
      id: "q_conditioning",
      slot: 4,
      label: cond.label,
      tree: "Conditioning",
      icon: "🔥",
      duration: "10 min",
      xp: 30,
      notes: `${cond.rounds} round${cond.rounds !== 1 ? "s" : ""} × ${cond.duration}`,
      items: [
        { text: cond.challenge, rounds: cond.rounds, movementIds: cond.movementIds || [], duration: cond.duration },
        { text: "Rest 60s between rounds (slow ginga — never fully stop)" },
        { text: cond.anchor },
      ],
      color: "#f87171",
    });
  } else {
    quests.push({
      id: "q_conditioning",
      slot: 4,
      label: "Light Mobility — High Pain Day",
      tree: "Conditioning",
      icon: "🩹",
      duration: "10 min",
      xp: 20,
      items: [
        { text: "Hip CARs — 5 each side" },
        { text: "Wrist circles — 20 each direction" },
        { text: "Gentle bridge hold 3×10s" },
      ],
      color: "#f87171",
    });
  }

  // 5. Mobility / recovery — always
  quests.push({
    id: "q_mobility",
    slot: 5,
    label: "Recovery / Mobility",
    tree: "Recovery",
    icon: "🌿",
    duration: "5 min",
    xp: 20,
    items: [
      { text: "Hip CARs — 5 each side" },
      { text: "Calf stretch 30s each" },
      { text: "Wrist deload — 20 circles each direction" },
    ],
    color: "#38bdf8",
  });

  return quests;
}

function Timer() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState(300); // seconds
  const tickRef = useRef(null);
  const startRef = useRef(0);  // Date.now() at last resume
  const accRef   = useRef(0);  // ms accumulated before last pause

  useEffect(() => {
    if (running) {
      startRef.current = Date.now();
      tickRef.current = setInterval(() => {
        setElapsed(accRef.current + Date.now() - startRef.current);
      }, 50);
    } else {
      clearInterval(tickRef.current);
      accRef.current = elapsed;
    }
    return () => clearInterval(tickRef.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const targetMs  = target * 1000;
  const pct       = Math.min((elapsed / targetMs) * 100, 100);
  const isComplete = elapsed >= targetMs;

  const totalSecs = Math.floor(elapsed / 1000);
  const mins = String(Math.floor(totalSecs / 60)).padStart(2, "0");
  const secs = String(totalSecs % 60).padStart(2, "0");
  const cs   = String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0");

  function reset() {
    setElapsed(0);
    setRunning(false);
    accRef.current = 0;
  }

  const PRESETS = [
    { label: "2m", s: 120 },
    { label: "3m", s: 180 },
    { label: "5m", s: 300 },
    { label: "7m", s: 420 },
    { label: "10m", s: 600 },
  ];

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="card-header">
        <span className="card-title">Flow Timer</span>
        <div style={{ display: "flex", gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.s}
              className="btn btn-sm btn-secondary"
              style={target === p.s ? { background: "var(--accent)", color: "#fff" } : {}}
              onClick={() => { setTarget(p.s); reset(); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="timer-display" style={{ color: isComplete ? "var(--green)" : "var(--text)" }}>
        {mins}:{secs}
        <span style={{ fontSize: "0.42em", letterSpacing: 1, opacity: 0.70, verticalAlign: "middle", marginLeft: 2 }}>
          .{cs}
        </span>
      </div>
      <div className="timer-label">
        {isComplete ? "✓ COMPLETE" : `${PRESETS.find((p) => p.s === target)?.label || ""} target`}
      </div>
      <div className="progress-bar" style={{ marginTop: 10 }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: isComplete ? "var(--green)" : "var(--accent)" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button
          className="btn btn-primary"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "⏸ Pause" : elapsed > 0 ? "▶ Resume" : "▶ Start"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Returns ms until 12h after today's midnight (i.e. noon)
function msUntilAutoComplete() {
  const now = new Date();
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (noon <= now) noon.setDate(noon.getDate() + 1);
  return noon.getTime() - now.getTime();
}

function useAutoComplete(quests, store, questState) {
  const firedRef = useRef(false);
  const today = new Date().toISOString().split("T")[0];
  const alreadyDone = questState.completed.length === quests.length && questState.date === today;

  useEffect(() => {
    if (alreadyDone || firedRef.current) return;
    const delay = msUntilAutoComplete();
    const id = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        store.completeAllQuestsAndLog(quests.map((q) => q.id));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [alreadyDone, quests.length]);
}

// ── Sand Session Card ─────────────────────────────────────────────────────────
function SandSessionCard({ navigate }) {
  const [open, setOpen] = useState(false);
  const [doneIds, setDoneIds] = useState(new Set());
  const session = getSandSession();

  const totalExs = session.sections.reduce((s, sec) => s + (sec.exercises?.filter(Boolean).length || 0), 0);
  const doneCount = doneIds.size;
  const xpEarned = doneCount >= totalExs ? session.totalXP : doneCount >= Math.ceil(totalExs * 0.5) ? Math.round(session.totalXP * 0.6) : 0;

  function toggleEx(id) {
    setDoneIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div className="card" style={{ borderColor: doneCount >= totalExs ? "var(--yellow)" : open ? "rgba(217,164,65,0.3)" : "var(--border)" }}>
      {/* Header — always visible */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontSize: 22 }}>🏖️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Bonus</div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>
            {session.estimatedMinutes} min · {totalExs} exercises · {session.sections.length} sections
          </div>
        </div>
        {xpEarned > 0 && (
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)" }}>+{xpEarned} XP</span>
        )}
        <span style={{ fontSize: 12, color: "var(--text3)" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Progress bar */}
      {doneCount > 0 && (
        <div className="progress-bar" style={{ marginTop: 8, marginBottom: 0 }}>
          <div className="progress-fill" style={{ width: `${Math.round((doneCount / totalExs) * 100)}%`, background: doneCount >= totalExs ? "var(--yellow)" : "var(--accent)", transition: "width 0.3s" }} />
        </div>
      )}

      {/* Notice */}
      {open && (
        <div style={{ marginTop: 10, fontSize: 10, color: "var(--text3)", padding: "6px 10px", borderRadius: 6, background: "var(--surface2)", fontStyle: "italic", lineHeight: 1.5 }}>
          {session.notice}
        </div>
      )}

      {/* Sections */}
      {open && session.sections.map((sec, si) => {
        const secExs = (sec.exercises || []).filter(Boolean);
        const secDone = secExs.filter((ex) => doneIds.has(ex.id)).length;
        return (
          <div key={si} style={{ marginTop: 14 }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{sec.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8 }}>{sec.label}</div>
                <div style={{ fontSize: 9, color: "var(--text3)" }}>{sec.duration} · {sec.purpose}</div>
              </div>
              <div style={{ fontSize: 10, color: secDone === secExs.length ? "var(--green)" : "var(--text3)", fontWeight: 700 }}>
                {secDone}/{secExs.length}
              </div>
            </div>

            {/* Exercises */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {secExs.map((ex) => {
                const done = doneIds.has(ex.id);
                return (
                  <div key={ex.id} style={{
                    borderRadius: 8, border: `1px solid ${done ? "rgba(46,140,120,0.4)" : "var(--border)"}`,
                    background: done ? "rgba(46,140,120,0.06)" : "var(--surface2)",
                    padding: "8px 10px", opacity: done ? 0.7 : 1, transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <button
                        onClick={() => toggleEx(ex.id)}
                        style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", color: done ? "var(--green)" : "var(--text3)", padding: 0, flexShrink: 0, marginTop: 1 }}
                      >
                        {done ? "✓" : "○"}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: done ? "var(--text3)" : "var(--text)", textDecoration: done ? "line-through" : "none" }}>
                            {ex.label}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--yellow)" }}>+{ex.xp} XP</span>
                        </div>
                        {!done && (
                          <>
                            <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, marginBottom: 3 }}>{ex.sets}</div>
                            <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.4, marginBottom: 4 }}>{ex.cues}</div>
                            {ex.relatedMovements?.length > 0 && (
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {ex.relatedMovements.map((id) => {
                                  const mv = getMovementById(id);
                                  if (!mv) return null;
                                  return (
                                    <button key={id} onClick={() => navigate("skill", id)}
                                      style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "var(--surface3)", border: "1px solid var(--border)", color: "var(--blue)", cursor: "pointer" }}>
                                      {mv.name} ›
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Completion */}
      {open && doneCount > 0 && (
        <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8, background: doneCount >= totalExs ? "rgba(217,164,65,0.10)" : "var(--surface2)", border: `1px solid ${doneCount >= totalExs ? "rgba(217,164,65,0.4)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: doneCount >= totalExs ? "var(--yellow)" : "var(--text3)", fontWeight: 700 }}>
            {doneCount >= totalExs ? "🏖️ Full session complete" : `${doneCount}/${totalExs} exercises · ${Math.round((doneCount / totalExs) * 100)}%`}
          </div>
          {xpEarned > 0 && (
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)" }}>+{xpEarned} XP</span>
          )}
        </div>
      )}
    </div>
  );
}

function WeekContextCard({ week, navigate }) {
  const weekData = SPRINT_1.weeks.find((w) => w.week === week);
  if (!weekData) return null;
  const boss = weekData.boss ? BOSS_TESTS.find((b) => b.id === weekData.boss) : null;
  return (
    <div className="card" style={{ padding: "10px 14px", marginBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>
            Week {week} Focus
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginTop: 3 }}>{weekData.theme}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2, lineHeight: 1.4 }}>
            {weekData.focus?.split(".")[0]}.
          </div>
        </div>
        {boss && (
          <button
            onClick={() => navigate("roda")}
            style={{
              flexShrink: 0, padding: "5px 10px", borderRadius: 8, fontWeight: 800,
              fontSize: 10, border: "1px solid var(--red)", background: "rgba(201,82,82,0.12)",
              color: "var(--red)", cursor: "pointer",
            }}
          >
            💀 Boss this week
          </button>
        )}
      </div>
    </div>
  );
}

// ── Pain Context Warning (#36) ───────────────────────────────────
function PainWarningBanner({ store }) {
  const pain = store.getTodayPain?.();
  if (!pain) return null;
  const scores = [pain.foot, pain.knee, pain.wrist, pain.shoulder, pain.lowerBack].filter(Boolean);
  const maxPain = Math.max(0, ...scores);
  if (maxPain < 5) return null;
  const isHigh = maxPain >= 7;
  return (
    <div style={{
      padding: "8px 14px", borderRadius: 8, marginBottom: 0,
      background: isHigh ? "rgba(201,82,82,0.12)" : "rgba(217,164,65,0.12)",
      border: `1px solid ${isHigh ? "var(--red)" : "var(--yellow)"}55`,
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 11, fontWeight: 600,
      color: isHigh ? "var(--red)" : "var(--yellow)",
    }}>
      <span>{isHigh ? "⛔" : "⚠"}</span>
      <span>
        Pain {maxPain}/10 logged today
        {isHigh ? " — reduce intensity, skip high-impact" : " — listen to your body"}
      </span>
    </div>
  );
}

// ── Newly Available Movements Card (#37) ────────────────────────
function NewlyAvailableCard({ store, navigate }) {
  const [open, setOpen] = useState(false);
  const available = useMemo(() => {
    const completed = Object.entries(store.state.movementProgress || {})
      .filter(([, v]) => v.masteryLevel >= 2).map(([k]) => k);
    return MOVEMENTS
      .filter((m) =>
        (store.getMasteryLevel(m.id) || 0) === 0 &&
        m.prerequisites.length > 0 &&
        m.prerequisites.every((p) => completed.includes(p))
      )
      .sort((a, b) => a.tier - b.tier)
      .slice(0, 4);
  }, [store.state.movementProgress]);

  if (available.length === 0) return null;

  return (
    <div className="card" style={{ padding: "10px 14px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔓</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--green)" }}>
            Newly Available
          </span>
          <span style={{
            fontSize: 10, padding: "1px 7px", borderRadius: 20, fontWeight: 700,
            background: "var(--green)" + "22", color: "var(--green)",
          }}>
            {available.length}
          </span>
        </div>
        <span style={{ fontSize: 14, color: "var(--text3)", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {available.map((m) => {
            const tree = SKILL_TREES.find((t) => t.id === m.tree);
            return (
              <div
                key={m.id}
                onClick={() => navigate("skill", m.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                  background: "var(--surface2)", border: "1px solid var(--green)33",
                }}
              >
                {tree && <span style={{ fontSize: 13, flexShrink: 0 }}>{tree.icon}</span>}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{m.name}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 6 }}>{m.meaning}</span>
                </div>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)" }}>
                  T{m.tier}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sequence of the Day Card (#38) ──────────────────────────────
function SequenceOfTheDayCard({ store, navigate }) {
  const [dayOfYear] = useState(() => {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  });

  const seq = useMemo(() => {
    // Score sequences: eligible if >= 50% of movements at mastery 2+
    const eligible = SEQUENCES
      .map((s) => {
        const met = s.movements.filter((mid) => (store.getMasteryLevel(mid) || 0) >= 2).length;
        const pct = s.movements.length ? met / s.movements.length : 0;
        const rankIdx = RANK_ORDER.indexOf(s.rank);
        return { s, pct, rankIdx };
      })
      .filter(({ pct }) => pct >= 0.5)
      .sort((a, b) => b.rankIdx - a.rankIdx || b.pct - a.pct);

    if (eligible.length === 0) return null;
    return eligible[dayOfYear % eligible.length].s;
  }, [dayOfYear, store]);

  if (!seq) return null;
  const rank = RANK_META[seq.rank] || {};
  const seqType = SEQ_TYPES[seq.type] || {};

  return (
    <div className="card" style={{ padding: "10px 14px" }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
        Sequence of the Day
      </div>
      <div
        onClick={() => navigate("sequence", seq.id, { backTo: "daily", backLabel: "Daily" })}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
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
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{seq.name}</div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 2 }}>
            <span style={{ fontSize: 10, color: seqType.color || "var(--accent)" }}>{seqType.label || seq.type}</span>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>{seq.movements.length} movements</span>
          </div>
        </div>
        <span style={{ fontSize: 14, color: "var(--text3)" }}>›</span>
      </div>
    </div>
  );
}

function ExtraWorkSection({ allExtras, dailyExtras, checkedBonusItems, store, navigate, SECTION_COLORS, SECTION_LABELS, sectionLabel = "Optional Extra Work", sectionIcon = "⚡" }) {
  const [open, setOpen] = useState(false);
  const [openCats, setOpenCats] = useState({});
  const doneCount = allExtras.filter((ex) => checkedBonusItems.includes(ex.id)).length;
  const totalXP   = allExtras.reduce((s, e) => s + (e.xp || 0), 0);

  const toggleCat = (cat) => setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Level 1: outer header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: open ? "8px 8px 0 0" : 8, padding: "9px 12px",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14 }}>{sectionIcon}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
          {sectionLabel}
        </span>
        {doneCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: "rgba(46,140,120,0.15)", color: "var(--green)" }}>
            {doneCount}/{allExtras.length}
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)", flexShrink: 0 }}>
          +{totalXP} XP
        </span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ color: "var(--text3)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{ border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
          {["strength", "conditioning", "core", "sand"].map((cat) => {
            const items = dailyExtras[cat] || [];
            if (!items.length) return null;
            const catDone  = items.filter((ex) => checkedBonusItems.includes(ex.id)).length;
            const catColor = SECTION_COLORS[cat];
            const catOpen  = !!openCats[cat];

            return (
              <div key={cat}>
                {/* Level 2: category header */}
                <button
                  onClick={() => toggleCat(cat)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    background: "var(--surface2)", borderBottom: "1px solid var(--border)",
                    padding: "8px 12px", cursor: "pointer", textAlign: "left",
                    border: "none", borderTop: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: catColor, flex: 1 }}>
                    {SECTION_LABELS[cat]}
                  </span>
                  <span style={{ fontSize: 10, color: catDone === items.length && catDone > 0 ? "var(--green)" : "var(--text3)", fontWeight: 700 }}>
                    {catDone}/{items.length}
                  </span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ color: "var(--text3)", flexShrink: 0, transform: catOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Exercise list */}
                {catOpen && (
                  <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6, background: "var(--surface)" }}>
                    {items.map((ex) => {
                      const checked = checkedBonusItems.includes(ex.id);
                      if (checked) {
                        return (
                          <div key={ex.id} style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                            borderRadius: 8, background: "rgba(46,140,120,0.06)", border: "1px solid var(--green)",
                          }}>
                            <span style={{ fontSize: 14 }}>{ex.icon}</span>
                            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--green)", textDecoration: "line-through", opacity: 0.75 }}>
                              {ex.label}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)" }}>+{ex.xp} XP</span>
                            <button
                              onClick={() => store.toggleBonusItem(ex.id, ex.xp)}
                              style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700, border: "1px solid var(--green)", background: "rgba(46,140,120,0.15)", color: "var(--green)", cursor: "pointer" }}
                            >✓</button>
                          </div>
                        );
                      }
                      return (
                        <div key={ex.id} style={{ padding: "8px 10px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{ex.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, cursor: "pointer", marginBottom: 2 }} onClick={() => navigate("exercise", ex)}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{ex.label}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)", flexShrink: 0 }}>+{ex.xp} XP ›</span>
                              </div>
                              <div style={{ fontSize: 10, color: "var(--text3)" }}>{ex.muscles?.join(" · ")}</div>
                              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{ex.sets}</div>
                              {ex.relatedMovements?.length > 0 && (
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                                  {ex.relatedMovements.map((id) => {
                                    const mv = getMovementById(id);
                                    return mv ? (
                                      <button key={id} onClick={(e) => { e.stopPropagation(); navigate("skill", id); }}
                                        style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: "var(--surface3)", border: "1px solid var(--border)", color: "var(--blue)", cursor: "pointer" }}>
                                        {mv.name} ›
                                      </button>
                                    ) : null;
                                  })}
                                </div>
                              )}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                                <span style={{ fontSize: 10, color: "var(--text3)" }}>Why: {ex.why}</span>
                                <button
                                  onClick={() => store.toggleBonusItem(ex.id, ex.xp)}
                                  style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid var(--border)", background: "var(--surface3)", color: "var(--text3)", cursor: "pointer" }}
                                >Do it</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Collapsible section wrapper ────────────────────────────────────────────
// Kept during the Daily Quest extraction pass; A-ENG-02 will either mount or remove these.
const LEGACY_DAILY_QUEST_CARDS = [
  SandSessionCard,
  WeekContextCard,
  NewlyAvailableCard,
  SequenceOfTheDayCard,
  ExtraWorkSection,
];
void LEGACY_DAILY_QUEST_CARDS;


export default function DailyQuest({ store, navigate }) {
  const today = new Date().toISOString().split("T")[0];
  const { todayQuest, player } = store.state;
  const questState = todayQuest.date === today ? todayQuest : { date: today, completed: [], skipped: [], bonusItems: [], bonusXP: 0 };
  const quests = buildDailyQuests(store);
  const doneCount = quests.filter((q) => questState.completed.includes(q.id)).length;
  const allDone = doneCount === quests.length;
  const checkedBonusItems = questState.bonusItems || [];
  const painToday = store.getTodayPain();
  const dow = new Date().getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week = player.currentWeek || 1;
  const level = getLevelFromXP(player.totalXP);
  const rank = getRank(level);
  const { streak = 0, inGrace = false } = store.getStreakDays?.() ?? {};
  const todayStr = new Date().toISOString().split("T")[0];
  const restToday = store.isRestDay?.(todayStr) ?? false;
  const { pct: levelPct } = getLevelProgress(player.totalXP);
  const bonusQuest = buildBonusQuest(week, dow, level);
  const dailyExtras = getDailyExtras(week, dow);
  const [sessionCelebration, setSessionCelebration] = useState(null); // { xp, streak, questCount }

  useAutoComplete(quests, store, questState);

  const currentPhase = store.getCurrentPhase?.() ?? 1;
  const phaseCompletion = store.getPhaseCompletionPercent?.() ?? 0;

  const [bonusOpen, setBonusOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  return (
    <div className="page">
      {/* ── Slim tappable header strip ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
        padding: "8px 12px", borderRadius: 10,
        background: "var(--surface2)", border: "1px solid var(--border)",
      }}>
        {/* Focus / Phase — tappable */}
        <button
          onClick={() => navigate("progression")}
          style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            textAlign: "left", padding: 0,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>
            Focus
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>
            Phase {currentPhase} · {phaseCompletion}%
          </div>
        </button>

        <div style={{ width: 1, height: 28, background: "var(--border)" }} />

        {/* Rank + Level — tappable */}
        <button
          onClick={() => navigate("progression")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            textAlign: "center", padding: "0 8px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: rank.color }}>{rank.rank} · LV {level}</div>
          <div style={{ height: 3, borderRadius: 2, background: "var(--surface)", overflow: "hidden", marginTop: 3, width: 48 }}>
            <div style={{ height: "100%", width: `${levelPct}%`, background: rank.color, borderRadius: 2 }} />
          </div>
        </button>

        <div style={{ width: 1, height: 28, background: "var(--border)" }} />

        {/* XP — tappable */}
        <button
          onClick={() => navigate("progression")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            textAlign: "right", padding: 0,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)" }}>
            {player.totalXP.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: "var(--text3)" }}>XP</div>
        </button>
      </div>

      {/* Session complete overlay */}
      {sessionCelebration && (
        <div
          onClick={() => setSessionCelebration(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.82)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 32, animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)", borderRadius: 20, padding: "32px 28px",
              maxWidth: 340, width: "100%", textAlign: "center",
              border: `2px solid ${rank.color}`,
              boxShadow: `0 0 40px ${rank.color}44`,
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 8 }}>🎯</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: rank.color, marginBottom: 4 }}>
              Session Complete
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>
              {dayNames[dow]} · Week {week}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--yellow)" }}>
                  +{sessionCelebration.xp}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>XP EARNED</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)" }}>
                  🔥{sessionCelebration.streak}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>DAY STREAK</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--green)" }}>
                  {sessionCelebration.questCount}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>QUESTS</div>
              </div>
            </div>

            {sessionCelebration.newLevel && (
              <div style={{
                marginBottom: 20, padding: "10px 16px", borderRadius: 12,
                background: rank.color + "22", border: `1px solid ${rank.color}55`,
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: rank.color }}>
                  ⬆ Level {sessionCelebration.newLevel}!
                </div>
              </div>
            )}

            <button
              onClick={() => setSessionCelebration(null)}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 12, fontWeight: 900,
                fontSize: 15, border: "none", background: rank.color, color: "#fff", cursor: "pointer",
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
      {/* Quest header — day, progress, rest toggle, streak */}
      <div className="card" style={{
        background: "var(--surface)",
        borderColor: restToday ? "var(--blue)" : allDone ? "var(--green)" : "var(--border)",
        padding: "12px 14px", marginBottom: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>
              {dayNames[dow]} · Week {week}
            </span>
            {streak >= 1 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: inGrace ? "var(--yellow)" : restToday ? "var(--blue)" : "var(--accent)" }}>
                {inGrace ? "⚡" : restToday ? "🛌" : "🔥"}{streak}
              </span>
            )}
            {(store.state.graceTokens || 0) > 0 && (
              <button
                title={`${store.state.graceTokens} Grace Token${store.state.graceTokens > 1 ? "s" : ""} — protect your streak`}
                onClick={() => store.useGraceToken?.()}
                style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                  background: "rgba(212,133,74,0.15)", border: "1px solid rgba(212,133,74,0.35)",
                  color: "var(--orange)", cursor: "pointer",
                }}
              >
                🛡️{store.state.graceTokens}
              </button>
            )}
          </div>
          <button
            onClick={() => store.markRestDay?.(todayStr)}
            style={{
              fontSize: 10, padding: "3px 9px", borderRadius: 20, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${restToday ? "var(--blue)" : "var(--border)"}`,
              background: restToday ? "rgba(79,124,255,0.15)" : "var(--surface2)",
              color: restToday ? "var(--blue)" : "var(--text3)",
            }}
          >
            {restToday ? "🛌 Rest" : "Rest Day"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            {restToday ? "Rest Day" : allDone ? "✓ Complete" : "Daily Quest"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!restToday && <span style={{ fontSize: 12, color: "var(--text2)" }}>{doneCount}/{quests.length}</span>}
            {!restToday && (
              <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>
                +{quests.reduce((sum, q) => sum + (q.xp || 0), 0)} XP
              </span>
            )}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(doneCount / quests.length) * 100}%`, background: allDone ? "var(--green)" : "var(--accent)" }} />
        </div>
      </div>

      {/* Monthly community challenge */}
      {(() => {
        const c = getCurrentMonthChallenge();
        const now = new Date();
        const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
        const monthName = now.toLocaleString("default", { month: "long" });

        // Calculate progress
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        const progress = c.movementId
          ? (store.state.repLog || [])
            .filter((e) => e.movementId === c.movementId && e.date >= monthStart)
            .reduce((s, e) => s + e.count, 0)
          : (store.state.sessionLog || []).filter((s) => s.date >= monthStart).length;

        const pct = Math.min(100, Math.round((progress / c.target) * 100));
        const done = pct >= 100;

        return (
          <button
            onClick={() => c.movementId && navigate("skill", c.movementId)}
            style={{
              width: "100%", textAlign: "left", cursor: c.movementId ? "pointer" : "default",
              background: done ? `${c.color}18` : "var(--surface2)",
              border: `1px solid ${done ? c.color + "55" : "var(--border)"}`,
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: c.color, letterSpacing: 1.5,
                  textTransform: "uppercase", marginBottom: 1 }}>{monthName} Challenge</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{c.title}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: done ? c.color : "var(--text3)", flexShrink: 0 }}>
                {done ? "✓ Done" : `${daysLeft}d left`}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--surface3)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: c.color, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: 10, color: done ? c.color : "var(--text3)", fontWeight: 700, flexShrink: 0 }}>
                {progress.toLocaleString()}/{c.target} {c.unit}
              </span>
            </div>
          </button>
        );
      })()}

      {/* Weekly report — show Sunday + Monday */}
      {(() => {
        const dow = new Date().getDay(); // 0=Sun, 1=Mon
        if (dow !== 0 && dow !== 1) return null;
        const summary = store.getWeekSummary?.() || {};
        const { sessions = 0, xpEarned = 0, masteryAdvances = 0, repsLogged = 0 } = summary;
        if (sessions === 0) return null;

        // Best movement this week
        const weekStart = (() => {
          const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().split("T")[0];
        })();
        const repsByMovement = {};
        (store.state.repLog || [])
          .filter((e) => e.date >= weekStart)
          .forEach((e) => { repsByMovement[e.movementId] = (repsByMovement[e.movementId] || 0) + e.count; });
        const topId = Object.entries(repsByMovement).sort((a, b) => b[1] - a[1])[0]?.[0];
        const topName = topId?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";

        return (
          <div style={{
            background: "linear-gradient(135deg, rgba(217,164,65,0.08), rgba(46,140,120,0.08))",
            border: "1px solid rgba(217,164,65,0.25)", borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", marginBottom: 10 }}>
              📋 This Week's Report
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: topName ? 10 : 0 }}>
              {[
                { v: sessions, l: "Sessions" },
                { v: `+${xpEarned}`, l: "XP Earned" },
                { v: repsLogged.toLocaleString(), l: "Total Reps" },
                { v: masteryAdvances || "—", l: "Advancements" },
              ].map(({ v, l }) => (
                <div key={l} style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{v}</div>
                  <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.8 }}>{l}</div>
                </div>
              ))}
            </div>
            {topName && (
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                Best movement: <span style={{ fontWeight: 700, color: "var(--text)" }}>{topName}</span>
                <span style={{ color: "var(--text3)", marginLeft: 6 }}>({repsByMovement[topId]} reps)</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Smart rest day suggestion */}
      {(() => {
        const { trained = 0 } = store.getWeeklyConsistency?.() || {};
        const today = new Date().toISOString().split("T")[0];
        const painLog = store.state.painLog || {};
        const todayPain = painLog[today] || {};
        const highPain = Object.values(todayPain).some((v) => v >= 7);
        const dismissed = store.state.restDayBannerDismissed === today;
        const isRestDay = (store.state.restDays || []).includes(today);

        if (dismissed || isRestDay || trained < 5 || !highPain) return null;

        return (
          <div style={{
            background: "rgba(79,124,255,0.08)", border: "1px solid rgba(79,124,255,0.25)",
            borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💙</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", marginBottom: 2 }}>
                You've trained {trained} days this week
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
                Pain is elevated today. Your body adapts during recovery — a rest day now builds the next 5 sessions.
              </div>
            </div>
            <button
              onClick={() => store.markRestDay?.(today)}
              style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, border: "none",
                background: "var(--blue)", color: "#fff", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
            >
              Take Rest Day
            </button>
          </div>
        );
      })()}

      {/* Pain warning (if applicable) */}
      <PainWarningBanner store={store} />

      {/* Weekly summary — only show if there's something to show */}
      {(() => {
        const summary = store.getWeekSummary?.() || {};
        const { sessions = 0, xpEarned = 0, masteryAdvances = 0, repsLogged = 0 } = summary;
        if (sessions === 0 && repsLogged === 0) return null;
        const stats = [
          sessions > 0 && { label: "Sessions", value: sessions, color: "var(--green)" },
          xpEarned > 0 && { label: "XP", value: `+${xpEarned}`, color: "var(--yellow)" },
          repsLogged > 0 && { label: "Reps", value: repsLogged.toLocaleString(), color: "var(--blue)" },
          masteryAdvances > 0 && { label: "Advances", value: masteryAdvances, color: "var(--accent)" },
        ].filter(Boolean);
        return (
          <div style={{
            display: "flex", gap: 6, padding: "8px 12px",
            background: "var(--surface2)", borderRadius: 8,
            border: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.2, alignSelf: "center", marginRight: 4 }}>
              This week
            </span>
            {stats.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: 8, color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Mestre / Orisha path teaser */}
      {(() => {
        const mestres = getAllMestres();
        const orishas = getAllCoreOrishas();
        const defeatedCount = mestres.filter((m) => store.isMestreDefeated?.(m.id)).length;
        const integratedCount = (store.state.orishasIntegrated || []).length;
        const ct = store.state.conceptTreeProgress || {};

        // ── Phase 1: no Mestres defeated yet — show nearest Mestre ──
        if (defeatedCount === 0) {
          // Score each Mestre using their own requirements array
          const scored = mestres
            .filter((m) => !store.isMestreDefeated?.(m.id))
            .map((m) => {
              const reqs = m.requirements || [];
              const checkable = reqs.filter((r) => r.type === "movement" || r.type === "concept_tree");
              const met = checkable.filter((r) => {
                if (r.type === "movement") {
                  return (store.getMasteryLevel(r.movementId) || 0) >= (r.targetLevel || 2);
                }
                if (r.type === "concept_tree") {
                  return (ct[r.treeId] || 0) >= (r.targetLevel || 1);
                }
                return false;
              }).length;
              const total = checkable.length || 1;
              return { m, met, total, pct: Math.round((met / total) * 100) };
            })
            .sort((a, b) => b.pct - a.pct);

          const best = scored[0];
          if (!best) return null;
          const { m: mestre, met, total, pct } = best;
          const remaining = total - met;
          const barColor = pct >= 60 ? "var(--green)" : pct >= 30 ? "var(--accent)" : "var(--text3)";
          const mestreColor = mestre.color || "#D9A441";

          return (
            <button onClick={() => navigate("roda", null, null)}
              style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "var(--surface2)",
                border: `1px solid ${mestreColor}33`, borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: `${mestreColor}18`, border: `1px solid ${mestreColor}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {mestre.icon || "🗡️"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: mestreColor, letterSpacing: 1.5,
                  textTransform: "uppercase", marginBottom: 2 }}>Next Mestre</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                  {mestre.name}
                  <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 400, marginLeft: 6 }}>
                    {mestre.style || mestre.subtitle}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: "var(--surface3)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: barColor, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 10, color: barColor, fontWeight: 700, flexShrink: 0 }}>
                    {remaining > 0 ? `${remaining} req${remaining > 1 ? "s" : ""} left` : "Ready!"}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text3)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          );
        }

        // ── Phase 2: Mestres started — show Orisha path when trees have progress ──
        const anyTreeProgress = Object.values(ct).some((v) => v > 0);
        if (anyTreeProgress && integratedCount < 16) {
          const pendingOrishas = orishas.filter((o) => !store.isOrishaIntegrated?.(o.id));
          if (!pendingOrishas.length) return null;

          // Find the most accessible Orisha (fewest unmet reqs)
          const scored = pendingOrishas.map((o) => {
            const treeLvl = ct[o.conceptTree] || ct[o.primaryTree] || 0;
            const needed  = o.requiredTreeLevel || 1;
            const met     = Math.min(treeLvl, needed);
            return { o, pct: Math.round((met / needed) * 100) };
          }).sort((a, b) => b.pct - a.pct);

          const { o: orisha, pct } = scored[0];
          const color = orisha.color || "#7C3AED";
          const barColor = pct >= 80 ? "var(--green)" : pct >= 50 ? color : "var(--text3)";

          return (
            <button onClick={() => navigate("roda")}
              style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "var(--surface2)",
                border: `1px solid ${color}33`, borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {orisha.icon || "✨"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 1.5,
                  textTransform: "uppercase", marginBottom: 2 }}>Next Orisha · {integratedCount}/16</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                  {orisha.name}
                  <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 400, marginLeft: 6 }}>
                    {orisha.domain || orisha.subtitle}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: "var(--surface3)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: barColor, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 10, color: barColor, fontWeight: 700, flexShrink: 0 }}>
                    {pct >= 100 ? "Ready!" : `${pct}% ready`}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text3)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          );
        }

        return null;
      })()}

      {/* Check-in: body + recovery */}
      <CheckInCard store={store} navigate={navigate} painToday={painToday} />

      {/* Quest items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {quests.map((q) => {
          const done = questState.completed.includes(q.id);
          return (
            <div key={q.id} className={`quest-item${done ? " done" : ""}`}>
              <div
                className={`quest-check${done ? " checked" : ""}`}
                style={done ? {} : { borderColor: q.color }}
                onClick={() => store.completeQuestItem(q.id, q.xp || 0)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    store.completeQuestItem(q.id, q.xp || 0);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${done ? "Undo" : "Complete"} ${q.label}`}
                aria-pressed={done}
              >
                {done && "✓"}
              </div>
              <div className="quest-content">
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                  onClick={() => navigate("workout", q)}
                >
                  <span>{q.icon}</span>
                  <span className="quest-label">{q.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: done ? "var(--green)" : "var(--yellow)", fontWeight: 700 }}>+{q.xp} XP</span>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>{q.duration}</span>
                  <span style={{ fontSize: 14, color: "var(--text3)", marginLeft: 2 }}>›</span>
                </div>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {q.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 11, color: "var(--text2)", display: "flex", gap: 6 }}>
                      <span style={{ color: q.color }}>›</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                {q.notes && (
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>{q.notes}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BONUS QUEST — collapsible, unlocks when all daily done ── */}
      {allDone && (() => {
        const allExercises = [...bonusQuest.strength, ...bonusQuest.conditioning, ...bonusQuest.flexibility];
        const xpPer = Math.round(bonusQuest.xpReward / (allExercises.length || 1));
        const doneAll = allExercises.length > 0 && allExercises.every((ex) => checkedBonusItems.includes(ex.id));
        const doneCount = allExercises.filter((ex) => checkedBonusItems.includes(ex.id)).length;

        return (
          <CollapsibleSection
            label={doneAll ? "Bonus Complete" : "Bonus Quest"}
            icon={doneAll ? "✅" : "⚡"}
            badge={`${doneCount}/${allExercises.length}`}
            badgeColor={doneAll ? "var(--green)" : "var(--accent)"}
            open={bonusOpen}
            onToggle={() => setBonusOpen((v) => !v)}
          >
          <div style={{ padding: "0 12px 12px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{doneAll ? "✅" : "⚡"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: doneAll ? "var(--green)" : "var(--accent)" }}>
                    {doneAll ? "BONUS COMPLETE" : "BONUS QUEST UNLOCKED"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{bonusQuest.subtitle}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--yellow)" }}>
                  {doneCount}/{allExercises.length} · +{checkedBonusItems.filter(id => allExercises.find(e => e.id === id)).length * xpPer} XP
                </div>
                <div style={{ fontSize: 9, color: "var(--text3)" }}>~{xpPer} XP each</div>
              </div>
            </div>

            {/* Goal + focus */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              Goal: {bonusQuest.goal}
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)", fontStyle: "italic", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
              {bonusQuest.focus}
            </div>

            {/* Three sections */}
            {[
              { key: "strength",     label: "💪 STRENGTH",     color: "#f97316", items: bonusQuest.strength },
              { key: "conditioning", label: "🔥 CONDITIONING", color: "#f87171", items: bonusQuest.conditioning },
              { key: "flexibility",  label: "🧘 FLEXIBILITY",  color: "#38bdf8", items: bonusQuest.flexibility },
            ].map(({ key, label, color, items }) => items.length > 0 && (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color, marginBottom: 8 }}>{label}</div>
                {items.map((ex) => {
                  const checked = checkedBonusItems.includes(ex.id);
                  const logs = (store.state.bonusLogs?.[ex.id] || []).slice(-3);
                  return (
                    <div
                      key={ex.id}
                      style={{
                        display: "flex", gap: 10, marginBottom: 12,
                        padding: "10px 10px", borderRadius: 8,
                        background: checked ? "rgba(16,185,129,0.06)" : "var(--surface2)",
                        border: `1px solid ${checked ? "var(--green)" : "var(--border)"}`,
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{ex.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, cursor: "pointer" }}
                          onClick={() => navigate("exercise", { ...ex, xp: xpPer })}
                        >
                          <div style={{ fontSize: 13, fontWeight: 700, color: checked ? "var(--green)" : "var(--text)" }}>
                            {ex.label}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--yellow)" }}>+{xpPer} XP</span>
                            <span style={{ fontSize: 14, color: "var(--text3)" }}>›</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{ex.sets}</div>
                        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>Why: {ex.why}</div>

                        {/* Log input */}
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Log result (e.g. 22 reps, 45s)…"
                            defaultValue={logs.find(l => l.date === today)?.value || ""}
                            onBlur={(e) => store.logBonusExercise(ex.id, e.target.value)}
                            style={{
                              flex: 1, fontSize: 11, padding: "4px 8px", borderRadius: 6,
                              background: "var(--surface)", border: "1px solid var(--border)",
                              color: "var(--text)", outline: "none",
                            }}
                          />
                          <button
                            onClick={() => store.toggleBonusItem(ex.id, xpPer)}
                            style={{
                              padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                              border: `1px solid ${checked ? "var(--green)" : "var(--accent)"}`,
                              background: checked ? "rgba(16,185,129,0.15)" : "rgba(124,58,237,0.15)",
                              color: checked ? "var(--green)" : "var(--accent)",
                              cursor: "pointer", flexShrink: 0,
                            }}
                          >
                            {checked ? "✓ Done" : "Mark Done"}
                          </button>
                        </div>

                        {/* Past log entries */}
                        {logs.length > 0 && (
                          <div style={{ marginTop: 6 }}>
                            {logs.map((l, i) => (
                              <div key={i} style={{ fontSize: 10, color: "var(--text3)", display: "flex", gap: 6 }}>
                                <span style={{ color: "var(--text3)", opacity: 0.6 }}>{l.date}</span>
                                <span style={{ color: "var(--text2)" }}>{l.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          </CollapsibleSection>
        );
      })()}

      {/* ── BONUS — unlocks when all daily quests done ── */}
      {allDone && (() => {
        const allExtras = [
          ...(dailyExtras.strength || []),
          ...(dailyExtras.conditioning || []),
          ...(dailyExtras.core || []),
          ...(dailyExtras.sand || []),
        ];
        const ALL_COLORS = { strength: "#f97316", conditioning: "#f87171", core: "#4BB5C8", sand: "#d97706" };
        const ALL_LABELS = { strength: "💪 Strength", conditioning: "🔥 Conditioning", core: "🧘 Core", sand: "🏖️ Sand" };
        const sandSession = getSandSession();
        const hasSandSession = sandSession?.sections?.length > 0;
        if (allExtras.length === 0 && !hasSandSession) return null;
        return (
          <BonusSection
            allExtras={allExtras}
            dailyExtras={dailyExtras}
            checkedBonusItems={checkedBonusItems}
            store={store}
            navigate={navigate}
            allColors={ALL_COLORS}
            allLabels={ALL_LABELS}
            sandSession={hasSandSession ? sandSession : null}
          />
        );
      })()}

      {/* Flow session mode */}
      {allDone && <FlowSessionCard store={store} />}

      {/* Daily bonus challenge — seeded by date, always different */}
      {allDone && <DailyBonusChallenge store={store} />}

      {/* Daily Steps — collapsible, counter visible */}
      <StepsTracker store={store} />

      {/* Flow Timer — collapsible */}
      <CollapsibleSection
        label="Flow Timer"
        icon="⏱"
        open={timerOpen}
        onToggle={() => setTimerOpen((v) => !v)}
      >
        <Timer />
      </CollapsibleSection>

      {/* Needs Drilling — only render when there are items */}
      <NeedsDrillingCard store={store} navigate={navigate} />

      {doneCount === quests.length && !sessionCelebration && (
        <SessionLogBlock
          xp={50 + doneCount * 10}
          onLog={(xp, notes) => {
            const prevLevel = level;
            store.logSession({ movements: quests.map((q) => q.id), xpEarned: xp, notes });
            const newLevel = getLevelFromXP(player.totalXP + xp);
            const { streak: newStreak = 0 } = store.getStreakDays?.() ?? {};
            setSessionCelebration({
              xp,
              streak: newStreak || streak + 1,
              questCount: doneCount,
              newLevel: newLevel > prevLevel ? newLevel : null,
            });
          }}
        />
      )}
    </div>
  );
}
