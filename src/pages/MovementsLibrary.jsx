import { useMemo, useState } from "react";
import { MOVEMENTS, getMovementById } from "../data/movements.js";
import { getSequencesForMovement } from "../data/sequences.js";
import { SKILL_TREES } from "../data/trees.js";

export default function MovementsLibrary({ store, navigate }) {
  const [query, setQuery] = useState("");
  const [tree, setTree] = useState("all");
  const [phase, setPhase] = useState("all");
  const [mastery, setMastery] = useState("all");

  const trees = useMemo(() => [...new Set(MOVEMENTS.map((m) => m.tree).filter(Boolean))], []);
  const phases = useMemo(() => [...new Set(MOVEMENTS.map((m) => m.phase || m.tier).filter(Boolean))].sort((a, b) => Number(a) - Number(b)), []);

  const filtered = MOVEMENTS.map((m) => getMovementById(m.id)).filter(Boolean).filter((movement) => {
    const q = query.trim().toLowerCase();
    const level = store.getMasteryLevel?.(movement.id) || 0;
    const haystack = [movement.name, movement.meaning, movement.tree, ...(movement.category || [])].join(" ").toLowerCase();
    return (!q || haystack.includes(q)) &&
      (tree === "all" || movement.tree === tree) &&
      (phase === "all" || String(movement.phase || movement.tier) === phase) &&
      (mastery === "all" || (mastery === "mastered" ? level >= 5 : mastery === "started" ? level > 0 && level < 5 : level === 0));
  });

  const grouped = filtered.reduce((acc, movement) => {
    const key = movement.tree || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(movement);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-title">Movements</div>
      <div className="card" style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movement profiles..."
          style={{ width: "100%", padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", marginBottom: 10 }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <select value={tree} onChange={(e) => setTree(e.target.value)} style={{ padding: 8, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value="all">All trees</option>
            {trees.map((t) => <option key={t} value={t}>{SKILL_TREES.find((treeMeta) => treeMeta.id === t)?.name || t}</option>)}
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value)} style={{ padding: 8, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value="all">All phases</option>
            {phases.map((p) => <option key={p} value={String(p)}>Phase/Tier {p}</option>)}
          </select>
          <select value={mastery} onChange={(e) => setMastery(e.target.value)} style={{ gridColumn: "1 / -1", padding: 8, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value="all">All mastery</option>
            <option value="new">Not started</option>
            <option value="started">In progress</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>{filtered.length} movement profiles</div>
      {Object.entries(grouped).map(([group, movements]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div className="section-title">{group} · {movements.length}</div>
          {movements.map((movement) => {
            const level = store.getMasteryLevel?.(movement.id) || 0;
            const sequences = getSequencesForMovement(movement.id);
            return (
              <button
                key={movement.id}
                className="card"
                onClick={() => navigate("skill", movement.id, { backTo: "movementsLib", backLabel: "Movements" })}
                style={{ width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 8, padding: 12 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{movement.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{movement.meaning || movement.tree}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: level >= 5 ? "var(--accent)" : level > 0 ? "var(--green)" : "var(--text3)" }}>M{level}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                  {(movement.category || []).slice(0, 4).map((cat) => <span key={cat} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--surface2)", color: "var(--text3)" }}>{cat}</span>)}
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(79,124,255,0.12)", color: "var(--blue)" }}>{sequences.length} sequence uses</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
