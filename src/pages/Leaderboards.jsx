import { useState, useMemo } from "react";

// Mock leaderboard data for demo
const MOCK_PLAYERS = [
  { id: "player_001", name: "Mestre Silva", level: 87, totalXP: 8700, streak: 142, rank: "S+" },
  { id: "player_002", name: "Capoeira Queen", level: 76, totalXP: 7600, streak: 98, rank: "S" },
  { id: "player_003", name: "Axé Master", level: 72, totalXP: 7200, streak: 87, rank: "A+" },
  { id: "player_004", name: "Roda Warrior", level: 68, totalXP: 6800, streak: 71, rank: "A" },
  { id: "player_005", name: "Ginga Flow", level: 64, totalXP: 6400, streak: 63, rank: "A" },
  { id: "player_006", name: "Berimbau Sage", level: 59, totalXP: 5900, streak: 51, rank: "B+" },
  { id: "player_007", name: "Ogun's Chosen", level: 55, totalXP: 5500, streak: 45, rank: "B+" },
  { id: "player_008", name: "Spiritual Path", level: 51, totalXP: 5100, streak: 38, rank: "B" },
];

export default function Leaderboards({ store, onBack }) {
  const [tab, setTab] = useState("xp"); // "xp" | "streak"

  // Current player stats
  const playerXP = store.state?.player?.totalXP || 0;
  const playerLevel = Math.floor(playerXP / 100) + 1;
  const playerStreak = store.state?.player?.streakDays || 0;
  const playerName = store.state?.settings?.name || "Hunter";

  // Sorted leaderboards
  const xpLeaderboard = useMemo(
    () => [...MOCK_PLAYERS].sort((a, b) => b.totalXP - a.totalXP),
    []
  );

  const streakLeaderboard = useMemo(
    () => [...MOCK_PLAYERS].sort((a, b) => b.streak - a.streak),
    []
  );

  const currentLeaderboard = tab === "xp" ? xpLeaderboard : streakLeaderboard;
  const playerRank = currentLeaderboard.findIndex(p => p.id === "player_you") + 1 || currentLeaderboard.length + 1;
  const playerPosition = currentLeaderboard.length + 1;

  const getRankColor = (rank) => {
    if (rank.startsWith("S+")) return "var(--yellow)";
    if (rank.startsWith("S")) return "var(--yellow)";
    if (rank.startsWith("A")) return "var(--accent)";
    if (rank.startsWith("B")) return "var(--green)";
    return "var(--text3)";
  };

  return (
    <div className="page">
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--text3)",
            fontSize: 20,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          ←
        </button>
      )}

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Leaderboards</div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          Global rankings by XP and Streak
        </div>
      </div>

      {/* Your Rank Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(79,124,255,0.1), rgba(100,50,200,0.1))",
          border: "2px solid rgba(79,124,255,0.2)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          Your Ranking
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>{playerName}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
              Level {playerLevel} • {playerXP.toLocaleString()} XP
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              {playerStreak}-day streak
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--blue)", marginBottom: 4 }}>
              #{playerPosition}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>
              {tab === "xp" ? "XP" : "Streak"} Leaderboard
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setTab("xp")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            border: tab === "xp" ? "2px solid var(--accent)" : "1px solid var(--border)",
            background: tab === "xp" ? "rgba(79,124,255,0.1)" : "var(--surface2)",
            color: tab === "xp" ? "var(--accent)" : "var(--text2)",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          💪 XP Ranking
        </button>
        <button
          onClick={() => setTab("streak")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            border: tab === "streak" ? "2px solid var(--accent)" : "1px solid var(--border)",
            background: tab === "streak" ? "rgba(79,124,255,0.1)" : "var(--surface2)",
            color: tab === "streak" ? "var(--accent)" : "var(--text2)",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          🔥 Streak Ranking
        </button>
      </div>

      {/* Leaderboard List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {currentLeaderboard.map((player, index) => (
          <div
            key={player.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${getRankColor(player.rank)}`,
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Rank Number */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: index < 3 ? `${getRankColor(player.rank)}22` : "var(--surface2)",
                border: `2px solid ${getRankColor(player.rank)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: index < 3 ? 16 : 14,
                color: getRankColor(player.rank),
                flexShrink: 0,
              }}
            >
              {index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
            </div>

            {/* Player Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>
                {player.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>
                {tab === "xp"
                  ? `Level ${player.level} • ${player.totalXP.toLocaleString()} XP`
                  : `${player.streak}-day streak`}
              </div>
            </div>

            {/* Rank Badge */}
            <div
              style={{
                padding: "3px 9px",
                borderRadius: 6,
                background: `${getRankColor(player.rank)}18`,
                color: getRankColor(player.rank),
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {player.rank}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 20 }}>
        🌍 Ranked against hunters worldwide
      </div>
    </div>
  );
}
