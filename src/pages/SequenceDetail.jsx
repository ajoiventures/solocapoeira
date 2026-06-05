import { useState, useEffect, useCallback } from "react";
import { getRankSequenceById, RANK_META, SEQ_TYPES } from "../data/sequences.js";
import { getMovementById } from "../data/movements.js";
import { SKILL_TREES } from "../data/trees.js";

const MASTERY_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];
const MASTERY_COLORS = ["var(--text3)", "var(--blue)", "#8b5cf6", "var(--orange)", "var(--green)", "var(--accent)"];

const STEP_SECS = 10; // seconds per step before auto-advance

function PracticeMode({ seq, rank, onClose, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STEP_SECS);
  const [paused, setPaused] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [done, setDone] = useState(false);

  const totalSteps = seq.steps.length;

  const next = useCallback(() => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx((i) => i + 1);
      setTimeLeft(STEP_SECS);
    } else {
      // Round complete
      setRounds((r) => r + 1);
      setDone(true);
    }
  }, [stepIdx, totalSteps]);

  const prev = () => {
    if (stepIdx > 0) { setStepIdx((i) => i - 1); setTimeLeft(STEP_SECS); }
  };

  const repeatRound = () => { setStepIdx(0); setTimeLeft(STEP_SECS); setDone(false); };

  useEffect(() => {
    if (paused || done) return;
    if (timeLeft <= 0) {
      const advanceTimer = setTimeout(next, 0);
      return () => clearTimeout(advanceTimer);
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, paused, done, next]);

  const pct = ((STEP_SECS - timeLeft) / STEP_SECS) * 100;
  const currentStep = seq.steps[stepIdx] || "";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: rank.color }}>{seq.rank} · {seq.name}</div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
            Step {stepIdx + 1}/{totalSteps} · Round {rounds + 1}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 20, cursor: "pointer", padding: 6 }}
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface2)" }}>
        <div style={{
          height: "100%", background: rank.color,
          width: `${((stepIdx) / totalSteps) * 100}%`,
          transition: "width 0.3s",
        }} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 28px" }}>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: rank.color, marginBottom: 4 }}>Round {rounds} Complete</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 32 }}>{totalSteps} steps done</div>
            <button
              onClick={repeatRound}
              style={{ padding: "12px 28px", borderRadius: 12, fontWeight: 800, fontSize: 14, border: "none", background: rank.color, color: "#fff", cursor: "pointer", marginBottom: 12, width: "100%" }}
            >
              ↺ Again
            </button>
            <button
              onClick={() => { onComplete(); onClose(); }}
              style={{ padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 13, border: `1px solid ${rank.color}`, background: "transparent", color: rank.color, cursor: "pointer", width: "100%" }}
            >
              ✓ Mark Practiced & Exit
            </button>
          </div>
        ) : (
          <>
            {/* Step number */}
            <div style={{
              width: 52, height: 52, borderRadius: 12, marginBottom: 20,
              background: rank.color + "22", color: rank.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 20,
            }}>
              {stepIdx + 1}
            </div>

            {/* Step text */}
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", textAlign: "center", lineHeight: 1.5, marginBottom: 32, maxWidth: 320 }}>
              {currentStep}
            </div>

            {/* Countdown ring */}
            <div style={{ fontSize: 36, fontWeight: 900, color: timeLeft <= 3 ? rank.color : "var(--text2)", marginBottom: 8 }}>
              {paused ? "⏸" : timeLeft}
            </div>
            <div style={{ width: 200, height: 4, borderRadius: 2, background: "var(--surface2)", overflow: "hidden", marginBottom: 32 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: rank.color, transition: "width 1s linear" }} />
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {!done && (
        <div style={{ padding: "16px 20px", display: "flex", gap: 10 }}>
          <button
            onClick={prev}
            disabled={stepIdx === 0}
            style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1px solid var(--border)", background: "var(--surface2)", color: stepIdx === 0 ? "var(--text3)" : "var(--text)", cursor: stepIdx === 0 ? "not-allowed" : "pointer" }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setPaused((v) => !v)}
            style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 800, fontSize: 13, border: `1px solid ${rank.color}`, background: rank.color + "22", color: rank.color, cursor: "pointer" }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={next}
            style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", cursor: "pointer" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr + "T12:00:00")) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff} days ago`;
}

export default function SequenceDetail({ sequenceId, store, navigate, onBack, backContext }) {
  const [justPracticed, setJustPracticed] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const seq = getRankSequenceById(sequenceId);
  if (!seq) return <div className="page"><div className="card">Sequence not found.</div></div>;

  const rank = RANK_META[seq.rank] || {};
  const seqType = SEQ_TYPES[seq.type] || {};
  const backPage   = backContext?.backTo    ?? "movement";
  const backLabel  = backContext?.backLabel ?? "Sequences";
  const handleBack = onBack || (() => navigate(backPage));

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Back */}
      <div className="detail-back" onClick={handleBack}>
        ← {backLabel}
      </div>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-name">{seq.name}</div>
        <div className="detail-meaning" style={{ color: rank.color }}>{rank.label} — {rank.cordName}</div>
        <div className="detail-badges">
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 700,
            background: rank.color + "22", color: rank.color,
            border: `1px solid ${rank.color}44`,
          }}>
            {seq.rank} Rank
          </span>
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 600,
            background: (seqType.color || "var(--accent)") + "22",
            color: seqType.color || "var(--accent)",
            border: `1px solid ${(seqType.color || "var(--accent)") + "44"}`,
          }}>
            {seqType.label || seq.type}
          </span>
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 600,
            background: "var(--surface2)", color: "var(--text3)",
            border: "1px solid var(--border)",
          }}>
            Difficulty {seq.difficulty}/9
          </span>
        </div>
      </div>

      {/* Practice mode overlay */}
      {practiceMode && (
        <PracticeMode
          seq={seq}
          rank={rank}
          onClose={() => setPracticeMode(false)}
          onComplete={() => { store?.markSequencePracticed?.(seq.id); setJustPracticed(true); }}
        />
      )}

      {/* Practice Mode button */}
      <button
        onClick={() => setPracticeMode(true)}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 10, fontWeight: 800, fontSize: 14,
          border: `2px solid ${rank.color}`, background: rank.color + "18",
          color: rank.color, cursor: "pointer", marginBottom: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Practice Mode — Step by Step
      </button>

      {/* Context */}
      {seq.context && (
        <div className="detail-section">
          <div className="detail-section-title">Why This Sequence</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{seq.context}</div>
        </div>
      )}

      {/* Movements involved */}
      {seq.movements?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Movements</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {seq.movements.map((mid) => {
              const mv = getMovementById(mid);
              if (!mv) return null;
              const masteryLevel = store ? store.getMasteryLevel(mid) : 0;
              const masteryColor = MASTERY_COLORS[masteryLevel] || "var(--text3)";
              const tree = SKILL_TREES.find((t) => t.id === mv.tree);
              return (
                <button
                  key={mid}
                  onClick={() => navigate("skill", mid, { backTo: "sequence", backLabel: seq.name })}
                  style={{
                    fontSize: 11, padding: "5px 10px", borderRadius: 20,
                    background: masteryLevel >= 1 ? masteryColor + "18" : "var(--surface2)",
                    border: `1px solid ${masteryLevel >= 1 ? masteryColor + "55" : "var(--border)"}`,
                    color: masteryLevel >= 1 ? masteryColor : "var(--text3)",
                    cursor: "pointer", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  {tree && <span style={{ fontSize: 10 }}>{tree.icon}</span>}
                  {mv.name}
                  <span style={{ fontSize: 9, opacity: 0.8 }}>{MASTERY_LABELS[masteryLevel]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="detail-section">
        <div className="detail-section-title">Sequence Steps</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {seq.steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "10px 12px", borderRadius: 8,
              background: "var(--surface2)", border: "1px solid var(--border)",
            }}>
              <div style={{
                minWidth: 24, height: 24, borderRadius: 6,
                background: rank.color + "22", color: rank.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Practice prescription */}
      {seq.reps && (
        <div className="detail-section">
          <div className="detail-section-title">Practice Prescription</div>
          <div style={{
            fontSize: 13, padding: "10px 14px",
            background: rank.color + "12",
            border: `1px solid ${rank.color}33`,
            borderRadius: 8, color: "var(--text)",
            fontWeight: 600,
          }}>
            {seq.reps}
          </div>
        </div>
      )}

      {/* Notes */}
      {seq.notes && (
        <div className="detail-section">
          <div className="detail-section-title">Coach's Note</div>
          <div style={{
            fontSize: 12, color: "var(--text2)", fontStyle: "italic",
            padding: "8px 12px", background: "var(--surface2)", borderRadius: 6,
            borderLeft: `3px solid ${rank.color}`,
          }}>
            {seq.notes}
          </div>
        </div>
      )}

      {/* Mark Practiced */}
      <div className="detail-section">
        {(() => {
          const lastDate = store?.getSeqLastPracticed?.(seq.id);
          const when = daysSince(lastDate);
          const isPracticed = justPracticed || (lastDate === new Date().toISOString().split("T")[0]);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  store?.markSequencePracticed?.(seq.id);
                  setJustPracticed(true);
                }}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10, fontWeight: 800, fontSize: 13,
                  border: `2px solid ${isPracticed ? "var(--green)" : rank.color}`,
                  background: isPracticed ? "rgba(46,140,120,0.12)" : rank.color + "18",
                  color: isPracticed ? "var(--green)" : rank.color,
                  cursor: "pointer",
                }}
              >
                {isPracticed ? "✓ Practiced Today" : "Mark Practiced"}
              </button>
              {when && !isPracticed && (
                <span style={{ fontSize: 11, color: "var(--text3)", flexShrink: 0 }}>
                  Last: {when}
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
