import { getDailyBonusChallenge } from "../data/bonusChallenges.js";

export default function DailyBonusChallenge({ store }) {
  const today = new Date().toISOString().split("T")[0];
  const challenge = getDailyBonusChallenge();
  const doneKey = `bonus_${challenge.id}_${today}`;
  const done = !!(store.state.bonusChallengesDone || {})[doneKey];

  function markDone() {
    store.completeBonusChallenge?.(doneKey, challenge.xp);
  }

  return (
    <div className="card" style={{
      borderLeft: "3px solid var(--accent)",
      opacity: done ? 0.6 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "rgba(217,164,65,0.12)", border: "1px solid rgba(217,164,65,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>
          {done ? "✓" : challenge.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Daily Challenge
            </span>
            <span style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700 }}>+{challenge.xp} XP</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            {challenge.title}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.55, marginBottom: done ? 0 : 10 }}>
            {challenge.desc}
          </div>
          {!done && (
            <button
              onClick={markDone}
              style={{
                fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 8,
                background: "var(--accent)", color: "#0A1018", border: "none", cursor: "pointer",
              }}
            >
              Mark Complete +{challenge.xp} XP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
