import { useMemo, useState } from "react";
import { BIMBA_SEQUENCES, RANK_META, SEQUENCES, SEQ_TYPES } from "../data/sequences.js";
import { getMovementById } from "../data/movements.js";

function sequenceMovements(seq) {
  return seq.movements || seq.prerequisiteMovements || [];
}

function isSequenceUnlocked(seq, store) {
  const moves = sequenceMovements(seq);
  if (!moves.length) return true;
  return moves.every((id) => (store.getMasteryLevel?.(id) || 0) >= 1);
}

export default function SequencesLibrary({ store, navigate }) {
  const [query, setQuery] = useState("");
  const [rank, setRank] = useState("all");
  const [lock, setLock] = useState("all");

  const allSequences = useMemo(() => {
    const rankSequences = SEQUENCES.map((seq) => ({
      ...seq,
      source: "Rank",
      rankLabel: RANK_META[seq.rank]?.label || seq.rank,
      typeLabel: SEQ_TYPES[seq.type]?.label || seq.type,
    }));
    const bimbaSequences = BIMBA_SEQUENCES.map((seq) => ({
      ...seq,
      source: "Bimba",
      rank: "regional",
      rankLabel: "Regional",
      typeLabel: "Partner Drill",
    }));
    return [...rankSequences, ...bimbaSequences];
  }, []);

  const filtered = allSequences.filter((seq) => {
    const q = query.trim().toLowerCase();
    const moves = sequenceMovements(seq).map((id) => getMovementById(id)?.name || id);
    const haystack = [seq.name, seq.description, seq.theme, seq.source, seq.rankLabel, ...moves].join(" ").toLowerCase();
    const unlocked = isSequenceUnlocked(seq, store);
    return (!q || haystack.includes(q)) &&
      (rank === "all" || seq.rank === rank) &&
      (lock === "all" || (lock === "unlocked" ? unlocked : !unlocked));
  });

  const ranks = [...new Set(allSequences.map((seq) => seq.rank).filter(Boolean))];

  return (
    <div className="page">
      <div className="page-title">Sequences</div>
      <div className="card" style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sequences, moves, ranks..."
          style={{ width: "100%", padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <select value={rank} onChange={(e) => setRank(e.target.value)} style={{ flex: 1, padding: 8, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value="all">All ranks</option>
            {ranks.map((r) => <option key={r} value={r}>{RANK_META[r]?.label || r}</option>)}
          </select>
          <select value={lock} onChange={(e) => setLock(e.target.value)} style={{ flex: 1, padding: 8, background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <option value="all">All access</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>{filtered.length} sequence profiles</div>
      {filtered.map((seq) => {
        const moves = sequenceMovements(seq);
        const unlocked = isSequenceUnlocked(seq, store);
        return (
          <div key={`${seq.source}-${seq.id}`} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{seq.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{seq.source} · {seq.rankLabel} · {seq.typeLabel}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? "var(--green)" : "var(--red)" }}>{unlocked ? "Unlocked" : "Locked"}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10 }}>{seq.description || seq.theme}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {moves.map((id) => {
                const mv = getMovementById(id);
                const mastered = (store.getMasteryLevel?.(id) || 0) >= 1;
                return (
                  <button key={id} onClick={() => navigate("skill", id, { backTo: "sequencesLib", backLabel: "Sequences" })} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: mastered ? "rgba(46,140,120,0.12)" : "var(--surface2)", color: mastered ? "var(--green)" : "var(--text2)", cursor: "pointer" }}>
                    {mv?.name || id}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("sequence", seq.id, { backTo: "sequencesLib", backLabel: "Sequences" })}>
              Quick Practice
            </button>
          </div>
        );
      })}
    </div>
  );
}
