import { useState, useMemo } from "react";
import { SKILL_TREES } from "../data/trees.js";
import { MOVEMENTS, getMovementsByTree } from "../data/movements.js";

const DURATIONS = [15, 30, 45, 60];
const FOCUSES = [
  { id: "drill",  label: "Drill Volume",   desc: "High reps, focused practice. Best for building mastery." },
  { id: "flow",   label: "Flow Practice",  desc: "Fewer movements, more time on each. Best for integration." },
  { id: "mixed",  label: "Mixed",          desc: "Balance of drilling new skills and flowing with known ones." },
];

// Approximate minutes per drill block based on mastery and difficulty
function blockMinutes(masteryLevel, difficulty, focus) {
  const base = focus === "drill" ? 2.5 : focus === "flow" ? 5 : 3.5;
  const difficultyMod = 1 + (difficulty - 1) * 0.1; // harder = slightly more time
  const masteryMod = masteryLevel <= 1 ? 1.3 : masteryLevel <= 2 ? 1.1 : masteryLevel >= 4 ? 0.8 : 1;
  return Math.round(base * difficultyMod * masteryMod * 10) / 10;
}

// Priority score for which movements to pick (lower = higher priority)
function priorityScore(masteryLevel) {
  // Prioritize: Aware(1) > Drilling(2) > Owning(3) > Locked(0) > Flowing(4) > Instinct(5)
  const order = { 1: 0, 2: 1, 3: 2, 0: 3, 4: 4, 5: 5 };
  return order[masteryLevel] ?? 3;
}

function generateQuest(tree, durationMin, focus, store) {
  const allMovements = tree === "Mixed"
    ? MOVEMENTS.filter((m) => !["Foot", "Strength", "Conditioning"].includes(m.tree))
    : getMovementsByTree(tree);

  // Score and sort movements
  const scored = allMovements
    .map((m) => ({
      m,
      masteryLevel: store.getMasteryLevel(m.id) || 0,
      mins: blockMinutes(store.getMasteryLevel(m.id) || 0, m.difficulty, focus),
    }))
    .sort((a, b) => {
      const ps = priorityScore(a.masteryLevel) - priorityScore(b.masteryLevel);
      if (ps !== 0) return ps;
      return a.m.difficulty - b.m.difficulty; // lower difficulty first within same priority
    });

  // Greedily fill up to durationMin
  const items = [];
  let used = 0;
  const overhead = 3; // warm-up + transition buffer
  const available = durationMin - overhead;

  for (const { m, masteryLevel, mins } of scored) {
    if (used + mins > available) continue;
    const repsGuide = masteryLevel <= 1
      ? "5 each side — focus on shape"
      : masteryLevel <= 2
      ? "10 each side — quality reps"
      : masteryLevel <= 3
      ? "15 each side — smooth transitions"
      : "Flow for the full duration";

    items.push({
      text: `${m.name} — ${repsGuide}`,
      movementId: m.id,
      detail: `${mins} min`,
    });
    used += mins;
    if (used >= available) break;
  }

  const treeObj = SKILL_TREES.find((t) => t.id === tree);
  return {
    id: `gen_${Date.now()}`,
    label: `Generated: ${tree === "Mixed" ? "Mixed Session" : tree + " Focus"}`,
    icon: treeObj?.icon || "⚡",
    color: treeObj?.color || "var(--accent)",
    xp: Math.round(durationMin * 2.5),
    duration: `${durationMin} min`,
    tree: tree === "Mixed" ? "Mixed" : tree,
    notes: `${focus === "drill" ? "Drill volume" : focus === "flow" ? "Flow practice" : "Mixed"} · ${items.length} movements · ~${durationMin} min`,
    items,
  };
}

export default function WorkoutGenerator({ store, navigate }) {
  const [selectedTree, setSelectedTree] = useState("Foundation");
  const [duration, setDuration] = useState(30);
  const [focus, setFocus] = useState("drill");
  const [preview, setPreview] = useState(null);

  const generatorTrees = [
    { id: "Mixed", name: "Mixed", icon: "⚡", color: "var(--accent)" },
    ...SKILL_TREES.filter((t) => !["Foot", "Strength", "Conditioning"].includes(t.id)),
  ];

  const generated = useMemo(() => {
    if (!preview) return null;
    return generateQuest(selectedTree, duration, focus, store);
  }, [preview, selectedTree, duration, focus, store]);

  const handleGenerate = () => {
    setPreview(true);
  };

  const handleStart = () => {
    const quest = generateQuest(selectedTree, duration, focus, store);
    navigate("workout", quest);
  };

  return (
    <div className="page">
      {/* Back */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate("training")}
          style={{
            background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
            display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Training
        </button>
      </div>

      <div className="page-title" style={{ marginBottom: 4 }}>Workout Generator</div>
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
        Build a custom session from your movement library
      </div>

      {/* Tree picker */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
          Tree Focus
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {generatorTrees.map((t) => {
            const isActive = selectedTree === t.id;
            const color = t.color || "var(--accent)";
            return (
              <button
                key={t.id}
                onClick={() => { setSelectedTree(t.id); setPreview(false); }}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  border: `1px solid ${isActive ? color : "var(--border)"}`,
                  background: isActive ? (color + "22") : "var(--surface2)",
                  color: isActive ? color : "var(--text2)",
                }}
              >
                {t.icon} {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration picker */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
          Duration
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => { setDuration(d); setPreview(false); }}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                border: `1px solid ${duration === d ? "var(--accent)" : "var(--border)"}`,
                background: duration === d ? "var(--accent)" : "var(--surface2)",
                color: duration === d ? "#fff" : "var(--text2)",
              }}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Focus picker */}
      <div className="card">
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
          Focus
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {FOCUSES.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFocus(f.id); setPreview(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 9, cursor: "pointer", textAlign: "left",
                border: `1px solid ${focus === f.id ? "var(--accent)" : "var(--border)"}`,
                background: focus === f.id ? "var(--accent)" + "15" : "var(--surface2)",
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${focus === f.id ? "var(--accent)" : "var(--border)"}`,
                background: focus === f.id ? "var(--accent)" : "transparent",
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: focus === f.id ? "var(--accent)" : "var(--text)" }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{f.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 10, fontWeight: 800,
          fontSize: 14, border: "none", background: "var(--accent)", color: "#000",
          cursor: "pointer", marginBottom: 12,
        }}
      >
        ⚡ Generate Session
      </button>

      {/* Preview */}
      {preview && generated && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{generated.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{generated.label}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{generated.notes}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--yellow)" }}>+{generated.xp} XP</div>
          </div>

          {/* Drill list preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
            {generated.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 10px", borderRadius: 7,
                background: "var(--surface2)", border: "1px solid var(--border)",
              }}>
                <div style={{
                  minWidth: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: (generated.color || "var(--accent)") + "22",
                  color: generated.color || "var(--accent)",
                  fontWeight: 800, fontSize: 11,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{item.text}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>{item.detail}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10, fontWeight: 800,
              fontSize: 14, border: "none", background: "var(--green)", color: "#fff",
              cursor: "pointer",
            }}
          >
            Start Session →
          </button>
        </div>
      )}
    </div>
  );
}
