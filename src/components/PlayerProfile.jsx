import { useMemo, useState } from "react";
import { getRank } from "../data/rankUtils.js";
import { getAllCoreOrishas, getOrishaById } from "../data/orishas.js";
import { calculateIntegrationBonuses, getBonusDescriptions } from "../data/orishaStatSystem.js";

const TITLES = [
  { id: "first_session",    label: "The Beginner",          color: "#6b7280" },
  { id: "streak_7",         label: "Week Warrior",           color: "#D4854A" },
  { id: "streak_30",        label: "Month of Axé",           color: "#D9A441" },
  { id: "first_owning",     label: "Owning the Game",        color: "#4F7CFF" },
  { id: "first_instinct",   label: "The Instinct",           color: "#D9A441" },
  { id: "five_instinct",    label: "Five-Star Capoeirista",  color: "#D9A441" },
  { id: "first_boss",       label: "Boss Tested",            color: "#D4854A" },
  { id: "first_mestre",     label: "Mestre Slayer",          color: "#D9A441" },
  { id: "five_mestres",     label: "Path of Masters",        color: "#D9A441" },
  { id: "all_mestres",      label: "Living Lineage",         color: "#7C3AED" },
  { id: "first_orisha",     label: "Ogun Expanded",          color: "#7C3AED" },
  { id: "ehi_ascended",     label: "Ehi Ascended",           color: "#D9A441" },
  { id: "reps_10000",       label: "Ten Thousand",           color: "#2E8C78" },
  { id: "concept_tree_maxed", label: "Tree of Knowledge",    color: "#2E8C78" },
  { id: "rank_S",           label: "Mestre",                 color: "#94a3b8" },
];

/**
 * Displays player's current spiritual path, rank, XP, and integrated Orisha bonuses
 */
export default function PlayerProfile({ store }) {
  const { player } = store.state;
  const level = useMemo(() => Math.floor(player.totalXP / 100) + 1, [player.totalXP]);
  const rank = useMemo(() => getRank(level), [level]);
  const ehiReadiness = store.getEhiReadiness();
  const isEhiAscended = store.isEhiAscended();
  const orishaPath = store.getOrishaPath();
  const allOrishas = useMemo(() => getAllCoreOrishas(), []);
  const integratedIds = store.state.orishasIntegrated || [];
  const prestige = store.state.prestige || {};
  const cosmetics = store.state.ehiStatus?.prestigeCosmetics || [];
  const orishaProgress = store.state.orishaProgress || {};
  const earnedAchievements = store.state.earnedAchievements || [];
  const timeline = useMemo(() => integratedIds
    .map((orishaId) => ({ orisha: getOrishaById(orishaId), progress: orishaProgress[orishaId] }))
    .filter((entry) => entry.orisha)
    .sort((a, b) => String(b.progress?.masteredAt || "").localeCompare(String(a.progress?.masteredAt || ""))),
  [integratedIds, orishaProgress]);

  const integratedCount = integratedIds.length;
  const statBonuses = useMemo(
    () => calculateIntegrationBonuses(integratedIds, isEhiAscended),
    [integratedIds, isEhiAscended]
  );
  const bonusDescriptions = useMemo(() => getBonusDescriptions(statBonuses), [statBonuses]);

  // Titles — earned from achievements
  const earnedTitleIds = useMemo(() => new Set(earnedAchievements), [earnedAchievements]);
  const availableTitles = useMemo(() => TITLES.filter((t) => earnedTitleIds.has(t.id)), [earnedTitleIds]);
  const activeTitle = useMemo(() => (
    store.state.activeTitle
      ? TITLES.find((t) => t.id === store.state.activeTitle)
      : availableTitles[availableTitles.length - 1] || null
  ), [store.state.activeTitle, availableTitles]);
  const [showTitlePicker, setShowTitlePicker] = useState(false);

  // Ehi bonuses (when all 16 integrated)
  const ehiBonuses = useMemo(() => isEhiAscended ? {
    allStats: 1.5,
    xpGeneration: 2.0,
    spiritualMastery: 100,
  } : null, [isEhiAscended]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main profile card */}
      <div className="card">
        {/* Header with rank and name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            background: `${rank.color}22`,
            border: `2px solid ${rank.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 800,
            color: rank.color,
          }}>
            {rank.rank}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
              {player.name}
            </div>
            <div style={{
              fontSize: 13,
              color: rank.color,
              fontWeight: 700,
              marginTop: 2,
            }}>
              {rank.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
              Level {level} • {player.totalXP.toLocaleString()} XP
            </div>
            {/* Active title */}
            {activeTitle && (
              <button
                onClick={() => setShowTitlePicker((o) => !o)}
                style={{
                  marginTop: 6, fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 20, border: `1px solid ${activeTitle.color}44`,
                  background: `${activeTitle.color}18`, color: activeTitle.color,
                  cursor: "pointer",
                }}
              >
                {activeTitle.label} {availableTitles.length > 1 ? "›" : ""}
              </button>
            )}
          </div>
        </div>

        {/* Title picker */}
        {showTitlePicker && availableTitles.length > 1 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", letterSpacing: 1.5,
              textTransform: "uppercase", marginBottom: 6 }}>Select Title</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {availableTitles.map((t) => (
                <button key={t.id}
                  onClick={() => {
                    store.update?.((s) => ({ ...s, activeTitle: t.id }));
                    setShowTitlePicker(false);
                  }}
                  style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    border: `1px solid ${t.color}55`, background: `${t.color}18`,
                    color: t.color, cursor: "pointer",
                    outline: store.state.activeTitle === t.id ? `2px solid ${t.color}` : "none",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spiritual path */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(100,50,200,0.1))",
          border: "1px solid rgba(255,215,0,0.2)",
          borderRadius: 6,
          padding: 12,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}>
            ✨ Spiritual Path
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 4,
          }}>
            {orishaPath}
          </div>

          {/* Ehi readiness bar */}
          {!isEhiAscended && (
            <div style={{ marginTop: 8 }}>
              <div style={{
                fontSize: 10,
                color: "var(--text3)",
                marginBottom: 4,
              }}>
                {ehiReadiness.integrated}/{ehiReadiness.total} Orishas integrated
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <div style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: "var(--surface2)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    borderRadius: 2,
                    width: `${ehiReadiness.percentReady}%`,
                    background: ehiReadiness.percentReady >= 80
                      ? "var(--green)"
                      : ehiReadiness.percentReady >= 50
                      ? "var(--yellow)"
                      : "var(--red)",
                    transition: "width 0.4s ease-out",
                  }} />
                </div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  flexShrink: 0,
                  color: ehiReadiness.percentReady >= 80
                    ? "var(--green)"
                    : ehiReadiness.percentReady >= 50
                    ? "var(--yellow)"
                    : "var(--text3)",
                }}>
                  {ehiReadiness.percentReady}%
                </span>
              </div>
            </div>
          )}

          {isEhiAscended && (
            <div style={{
              fontSize: 11,
              color: "var(--accent)",
              marginTop: 6,
              fontStyle: "italic",
            }}>
              🔱 You are Ehi. All 16 Orishas flow through your Ogun core.
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {/* Training stats */}
          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text3)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              Training
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                Streak: <span style={{ fontWeight: 700, color: "var(--yellow)" }}>
                  {store.getStreakDays()?.streak || 0} days
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                Sprint: <span style={{ fontWeight: 700 }}>
                  {player.currentSprint}
                </span>
              </div>
            </div>
          </div>

          {/* Spiritual stats */}
          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}>
              Spiritual
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                Mastery: <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                  {Math.round(statBonuses.spiritualMastery || 0)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                Integrated: <span style={{ fontWeight: 700 }}>
                  {integratedCount}/16
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ogun core and full Orisha path */}
      <div className="card">
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
          Ogun Core Path
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(139,0,0,0.12)", border: "2px solid #8B0000",
            color: "#8B0000", fontSize: 22, fontWeight: 900,
          }}>
            OG
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Ogun is the iron center</div>
            <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>
              Every integration layers onto the warrior core: discipline, tools, protection, and path-clearing.
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
          {allOrishas.map((orisha) => {
            const active = integratedIds.includes(orisha.id);
            return (
              <div
                key={orisha.id}
                title={`${orisha.name}${active ? " integrated" : " locked"}`}
                style={{
                  aspectRatio: "1",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: active ? `${orisha.color}22` : "var(--surface2)",
                  border: `1px solid ${active ? orisha.color : "var(--border)"}`,
                  color: active ? orisha.color : "var(--text3)",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {active ? "I" : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stat bonuses from integration */}
      <div className="card">
        <div style={{
          fontSize: 12,
          fontWeight: 800,
          color: "var(--text)",
          marginBottom: 12,
        }}>
          ⚡ Integrated Orisha Bonuses
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}>
          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
              Strength
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--orange)" }}>
              +{Math.round((statBonuses.strength || 0) * 100)}%
            </div>
          </div>

          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
              Speed
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--blue)" }}>
              +{Math.round((statBonuses.speed || 0) * 100)}%
            </div>
          </div>

          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
              Resilience
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--green)" }}>
              +{Math.round((statBonuses.resilience || 0) * 100)}%
            </div>
          </div>

          <div style={{
            background: "var(--surface2)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
              Spiritual Mastery
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent)" }}>
              +{Math.round(statBonuses.spiritualMastery)}
            </div>
          </div>
        </div>
        {bonusDescriptions.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {bonusDescriptions.slice(0, 6).map((desc) => (
              <span key={desc} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, background: "var(--surface2)", color: "var(--text2)" }}>
                {desc}
              </span>
            ))}
          </div>
        )}
      </div>

      {timeline.length > 0 && (
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
            Integration Timeline
          </div>
          {timeline.slice(0, 5).map(({ orisha, progress }) => (
            <div key={orisha.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: "1px solid var(--border)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: orisha.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{orisha.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{progress?.masteredAt ? new Date(progress.masteredAt).toLocaleDateString() : "Integrated"}</div>
              </div>
              <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 800 }}>+{progress?.xp || 0} XP</span>
            </div>
          ))}
        </div>
      )}

      {/* Integrated Orishas (if any) */}
      {integratedCount > 0 && (
        <div className="card">
          <div style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: 12,
          }}>
            👑 Integrated Orishas ({integratedCount}/16)
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}>
            {store.state.orishasIntegrated.map((orishaId) => {
              const orisha = getOrishaById(orishaId);
              return orisha ? (
                <div
                  key={orishaId}
                  style={{
                    background: `${orisha.color}22`,
                    border: `2px solid ${orisha.color}`,
                    borderRadius: 8,
                    padding: 10,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: 20 }}>{orisha.icon}</div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--text2)",
                  }}>
                    {orisha.name}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Ehi bonuses (if ascended) */}
      {isEhiAscended && ehiBonuses && (
        <div className="card" style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(100,50,200,0.1))",
          border: "2px solid rgba(255,215,0,0.4)",
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--accent)",
            marginBottom: 12,
          }}>
            ✨ Ehi Ascension Bonuses
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}>
            <div style={{
              background: "rgba(255,215,0,0.1)",
              borderRadius: 6,
              padding: 10,
            }}>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
                All Stats
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent)" }}>
                ×{ehiBonuses.allStats}
              </div>
            </div>

            <div style={{
              background: "rgba(255,215,0,0.1)",
              borderRadius: 6,
              padding: 10,
            }}>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
                XP Generation
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--yellow)" }}>
                ×{ehiBonuses.xpGeneration}
              </div>
            </div>

            <div style={{
              background: "rgba(255,215,0,0.1)",
              borderRadius: 6,
              padding: 10,
              gridColumn: "1 / -1",
            }}>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
                Spiritual Mastery
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent)" }}>
                +{ehiBonuses.spiritualMastery}
              </div>
            </div>
          </div>
        </div>
      )}

      {(prestige.rank > 0 || cosmetics.length > 0) && (
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
            Prestige Badges
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 10, padding: "4px 8px", borderRadius: 5, background: "rgba(255,215,0,0.12)", color: "var(--accent)", fontWeight: 800 }}>
              Prestige Rank {prestige.rank || 0}
            </span>
            {cosmetics.map((cosmetic) => (
              <span key={cosmetic} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 5, background: "var(--surface2)", color: "var(--text2)", fontWeight: 700 }}>
                {cosmetic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
