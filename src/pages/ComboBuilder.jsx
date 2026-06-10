import { useState, useMemo } from "react";
import { MOVEMENTS } from "../data/movements.js";
import { getMuscles } from "../data/muscleMap.js";

const MAX_STEPS = 8;
const MIN_STEPS = 2;

const COMBO_TAGS = [
  { id: "offensive", label: "⚔️ Offensive", color: "#C95252" },
  { id: "defensive", label: "🛡️ Defensive", color: "#4F7CFF" },
  { id: "ground",    label: "🌿 Ground",    color: "#2E8C78" },
  { id: "acrobatic", label: "✨ Acrobatic", color: "#7C3AED" },
  { id: "flow",      label: "🌊 Flow",      color: "#D9A441" },
];

function MovementPicker({ onSelect, exclude = [] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return MOVEMENTS
      .filter(m => !exclude.includes(m.id) &&
        (m.name.toLowerCase().includes(q) || m.tree.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [query, exclude]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search movement…"
        autoFocus
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12,
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--text)", outline: "none",
        }}
      />
      {results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,.4)", overflow: "hidden",
        }}>
          {results.map(m => (
            <button key={m.id} onClick={() => { onSelect(m); setQuery(""); }}
              style={{
                width: "100%", textAlign: "left", padding: "9px 12px", background: "none",
                border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer",
                display: "flex", gap: 10, alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{m.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{m.tree} · Tier {m.tier}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComboBuilder({ store, onBack }) {
  const combos = store.state.combos || [];
  const [view, setView] = useState("list"); // "list" | "build" | "detail"
  const [selected, setSelected] = useState(null);
  const [steps, setSteps] = useState([]);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("flow");
  const [adding, setAdding] = useState(false);
  const [practicing, setPracticing] = useState(false);
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceStartTime, setPracticeStartTime] = useState(null);

  function saveCombo() {
    if (steps.length < MIN_STEPS || !name.trim()) return;
    const combo = {
      id: `combo_${Date.now()}`,
      name: name.trim(),
      tag,
      steps: steps.map(m => m.id),
      createdAt: new Date().toISOString(),
    };
    store.update?.(s => ({ ...s, combos: [combo, ...(s.combos || [])] }));
    setView("list");
    setSteps([]);
    setName("");
  }

  function deleteCombo(id) {
    store.update?.(s => ({ ...s, combos: (s.combos || []).filter(c => c.id !== id) }));
    if (selected?.id === id) setSelected(null);
    setView("list");
  }

  function resolveSteps(combo) {
    return combo.steps.map(id => MOVEMENTS.find(m => m.id === id)).filter(Boolean);
  }

  function finishPractice(resolved, endTime) {
    const completionTime = practiceStartTime ? Math.max(0, Math.round(endTime - practiceStartTime)) : null;
    store.logComboPractice?.(selected.id, completionTime);
    resolved.forEach((m) => store.incrementReps?.(m.id, 1));
    setPracticing(false);
    setPracticeStep(0);
    setPracticeStartTime(null);
  }

  // Practice mode
  if (practicing && selected) {
    const resolved = resolveSteps(selected);
    const current = resolved[practiceStep];
    const isDone = practiceStep >= resolved.length;

    return (
      <div className="page">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setPracticing(false); setPracticeStep(0); setPracticeStartTime(null); }}
            style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 20, cursor: "pointer" }}>
            ←
          </button>
          <div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5 }}>Practising</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{selected.name}</div>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {resolved.map((m, i) => (
            <div key={m.id} style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0,
              background: i < practiceStep ? "var(--green)" : i === practiceStep ? "var(--accent)" : "var(--surface2)",
              color: i <= practiceStep ? "#fff" : "var(--text3)",
              border: `2px solid ${i === practiceStep ? "var(--accent)" : "transparent"}`,
            }}>
              {i < practiceStep ? "✓" : i + 1}
            </div>
          ))}
        </div>

        {isDone ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", marginBottom: 8 }}>Combo Complete</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>{selected.name} — {resolved.length} movements</div>
            <button onClick={() => { setPracticeStep(0); }}
              style={{ padding: "10px 28px", borderRadius: 8, background: "var(--accent)", border: "none",
                color: "#0A1018", fontWeight: 700, fontSize: 13, cursor: "pointer", marginRight: 8 }}>
              Repeat
            </button>
            <button onClick={(event) => finishPractice(resolved, event.timeStamp)}
              style={{ padding: "10px 28px", borderRadius: 8, background: "var(--surface2)",
                border: "1px solid var(--border)", color: "var(--text)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                Step {practiceStep + 1} of {resolved.length}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", marginBottom: 4 }}>{current?.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{current?.tree} · Tier {current?.tier}</div>
              {current && getMuscles(current.id) && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                  {getMuscles(current.id).primary.map(m => (
                    <span key={m} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4,
                      background: "rgba(212,133,74,.15)", color: "var(--orange)" }}>{m}</span>
                  ))}
                </div>
              )}
            </div>
            {practiceStep < resolved.length - 1 && (
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginBottom: 12 }}>
                Next: <strong style={{ color: "var(--text)" }}>{resolved[practiceStep + 1]?.name}</strong>
              </div>
            )}
            <button onClick={() => setPracticeStep(s => s + 1)}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: "var(--accent)",
                border: "none", color: "#0A1018", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              {practiceStep < resolved.length - 1 ? `Next → ${resolved[practiceStep + 1]?.name}` : "Finish Combo ✓"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Build view
  if (view === "build") {
    return (
      <div className="page">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setView("list"); setSteps([]); setName(""); }}
            style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 20, cursor: "pointer" }}>
            ←
          </button>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>Build Combo</div>
        </div>

        {/* Name */}
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Combo name…"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)",
            outline: "none", marginBottom: 12 }} />

        {/* Tag */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {COMBO_TAGS.map(t => (
            <button key={t.id} onClick={() => setTag(t.id)}
              style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                border: `1px solid ${tag === t.id ? t.color : "var(--border)"}`,
                background: tag === t.id ? `${t.color}22` : "var(--surface2)",
                color: tag === t.id ? t.color : "var(--text3)", cursor: "pointer",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 12 }}>
          {steps.map((m, i) => (
            <div key={`${m.id}-${i}`} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
              marginBottom: 6,
            }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#0A1018", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{m.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{m.tree} · Tier {m.tier}</div>
              </div>
              <button onClick={() => setSteps(s => s.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 16, cursor: "pointer", padding: 4 }}>
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add movement */}
        {steps.length < MAX_STEPS && (
          adding ? (
            <div style={{ marginBottom: 12 }}>
              <MovementPicker
                onSelect={m => { setSteps(s => [...s, m]); setAdding(false); }}
                exclude={[]}
              />
              <button onClick={() => setAdding(false)}
                style={{ marginTop: 6, fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              style={{
                width: "100%", padding: "10px", borderRadius: 8, marginBottom: 12,
                background: "var(--surface2)", border: "1px dashed var(--border)", color: "var(--text3)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
              + Add movement {steps.length > 0 ? `(${steps.length}/${MAX_STEPS})` : ""}
            </button>
          )
        )}

        <button
          disabled={steps.length < MIN_STEPS || !name.trim()}
          onClick={saveCombo}
          style={{
            width: "100%", padding: "12px", borderRadius: 10, background: "var(--accent)",
            border: "none", color: "#0A1018", fontWeight: 800, fontSize: 13, cursor: "pointer",
            opacity: steps.length < MIN_STEPS || !name.trim() ? 0.4 : 1,
          }}>
          Save Combo ({steps.length} movements)
        </button>
        {steps.length < MIN_STEPS && (
          <div style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 6 }}>
            Add at least {MIN_STEPS} movements
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="page">
      {onBack && (
        <button onClick={onBack}
          style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 20, cursor: "pointer", marginBottom: 8 }}>
          ←
        </button>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="page-title" style={{ marginBottom: 2 }}>Combo Builder</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Chain movements. Practice sequences.</div>
        </div>
        <button onClick={() => setView("build")}
          style={{ padding: "8px 16px", borderRadius: 8, background: "var(--accent)", border: "none",
            color: "#0A1018", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          + New
        </button>
      </div>

      {combos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🥊</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No combos yet</div>
          <div style={{ fontSize: 12, maxWidth: 260, margin: "0 auto" }}>
            Build a combo by chaining 2–8 movements. Then practice it step by step.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {combos.map(combo => {
            const t = COMBO_TAGS.find(t => t.id === combo.tag) || COMBO_TAGS[4];
            const resolved = resolveSteps(combo);
            const avgTier = resolved.length > 0 ? Math.round(resolved.reduce((sum, m) => sum + (m.tier || 1), 0) / resolved.length) : 1;
            const difficulty = avgTier <= 2 ? "Beginner" : avgTier <= 4 ? "Intermediate" : "Advanced";
            const stats = store.state.comboStats?.[combo.id] || { timesPracticed: 0, lastPracticed: null };
            const lastPracticedDate = stats.lastPracticed ? new Date(stats.lastPracticed).toLocaleDateString() : null;

            return (
              <div key={combo.id} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderLeft: `3px solid ${t.color}`, borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)" }}>{combo.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                        background: `${t.color}18`, color: t.color }}>{t.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                        background: "rgba(255,215,0,.15)", color: "var(--yellow)" }}>
                        {difficulty} T{avgTier}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {resolved.map((m, i) => (
                        <span key={`${m.id}-${i}`} style={{ fontSize: 10, color: "var(--text3)" }}>
                          {m.name}{i < resolved.length - 1 ? " →" : ""}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 10, color: "var(--text3)" }}>
                      <span>{combo.steps.length} movements</span>
                      <span>Practiced {stats.timesPracticed}x</span>
                      {lastPracticedDate && <span>Last: {lastPracticedDate}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={(event) => { setSelected(combo); setPracticing(true); setPracticeStep(0); setPracticeStartTime(event.timeStamp); }}
                      style={{ padding: "6px 12px", borderRadius: 6, background: "var(--accent)", border: "none",
                        color: "#0A1018", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                      Practice
                    </button>
                    <button onClick={() => deleteCombo(combo.id)}
                      style={{ padding: "6px 10px", borderRadius: 6, background: "none",
                        border: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, cursor: "pointer" }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
