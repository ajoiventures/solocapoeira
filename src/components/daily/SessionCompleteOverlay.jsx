export default function SessionCompleteOverlay({ celebration, rank, dayLabel, week, onClose }) {
  if (!celebration) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: "32px 28px",
          maxWidth: 340,
          width: "100%",
          textAlign: "center",
          border: `2px solid ${rank.color}`,
          boxShadow: `0 0 40px ${rank.color}44`,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎯</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: rank.color, marginBottom: 4 }}>
          Session Complete
        </div>
        <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>
          {dayLabel} · Week {week}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--yellow)" }}>
              +{celebration.xp}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>XP EARNED</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)" }}>
              🔥{celebration.streak}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>DAY STREAK</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--green)" }}>
              {celebration.questCount}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>QUESTS</div>
          </div>
        </div>

        {celebration.newLevel && (
          <div style={{
            marginBottom: 20,
            padding: "10px 16px",
            borderRadius: 12,
            background: rank.color + "22",
            border: `1px solid ${rank.color}55`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: rank.color }}>
              ↑ Level {celebration.newLevel}!
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: 15,
            border: "none",
            background: rank.color,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
