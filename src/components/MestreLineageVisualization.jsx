import { getMestreById } from "../data/mestres.js";
import { getAllLineages, getLineageProgress } from "../data/mestreLineage.js";

/**
 * Mestre Lineage Visualization - Shows teaching progression paths
 */
export default function MestreLineageVisualization({ store, navigate }) {
  const defeatedMestres = store.state.mestreProgress;
  const defeatedMestreIds = Object.keys(defeatedMestres).filter((id) => defeatedMestres[id].defeated);

  const lineages = getAllLineages();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {lineages.map((lineage) => {
        const progress = getLineageProgress(lineage.founder, defeatedMestreIds);

        return (
          <div key={lineage.founder} className="card">
            {/* Lineage header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: 4,
              }}>
                {lineage.name}
              </div>
              <div style={{
                fontSize: 11,
                color: "var(--text3)",
                marginBottom: 8,
              }}>
                {lineage.description}
              </div>

              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: "var(--surface2)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    borderRadius: 3,
                    width: `${progress.percentComplete}%`,
                    background: progress.isComplete ? "var(--accent)" : "var(--yellow)",
                    transition: "width 0.4s ease-out",
                  }} />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: progress.isComplete ? "var(--accent)" : "var(--yellow)",
                  flexShrink: 0,
                }}>
                  {progress.defeated}/{progress.total}
                </span>
              </div>
            </div>

            {/* Lineage progression steps */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
              {lineage.progressionPath.map((step, i) => {
                const mestre = getMestreById(step.mestre);
                const isDefeated = defeatedMestreIds.includes(step.mestre);
                const isCurrent = i === progress.defeated; // Next to defeat

                return (
                  <div
                    key={i}
                    onClick={() => navigate("mestre", step.mestre)}
                    role="button"
                    tabIndex={0}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {/* Connection arrow (not on last) */}
                    {i < lineage.progressionPath.length - 1 && (
                      <div style={{
                        position: "absolute",
                        top: 20,
                        left: "60%",
                        right: "-30%",
                        height: 2,
                        background: isDefeated ? "var(--green)" : "var(--border)",
                        zIndex: 0,
                      }} />
                    )}

                    {/* Step circle */}
                    <div style={{
                      position: "relative",
                      zIndex: 1,
                      marginBottom: 8,
                    }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isDefeated
                          ? "var(--green)"
                          : isCurrent
                          ? "var(--yellow)"
                          : "var(--surface2)",
                        border: isCurrent ? "3px solid var(--yellow)" : "2px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        fontSize: 20,
                        fontWeight: 800,
                        color: isDefeated ? "white" : "var(--text)",
                        transition: "all 0.3s ease",
                      }}>
                        {isDefeated ? "✓" : i + 1}
                      </div>
                    </div>

                    {/* Mestre name */}
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isDefeated ? "var(--green)" : isCurrent ? "var(--yellow)" : "var(--text2)",
                      marginBottom: 2,
                    }}>
                      {mestre?.name || "Unknown"}
                    </div>

                    {/* Step title */}
                    <div style={{
                      fontSize: 9,
                      color: "var(--text3)",
                      marginBottom: 4,
                    }}>
                      {step.title}
                    </div>

                    {/* Status */}
                    <div style={{
                      fontSize: 8,
                      color: isDefeated ? "var(--green)" : "var(--text3)",
                      fontWeight: 600,
                    }}>
                      {isDefeated ? "Defeated" : isCurrent ? "Next" : "Locked"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lineage reward */}
            {progress.isComplete && (
              <div style={{
                marginTop: 16,
                padding: 10,
                background: "rgba(255,215,0,0.1)",
                borderRadius: 6,
                border: "1px solid rgba(255,215,0,0.3)",
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: 4,
                }}>
                  🏆 Lineage Complete: {progress.reward.title}
                </div>
                <div style={{
                  fontSize: 10,
                  color: "var(--text2)",
                }}>
                  {progress.reward.cosmetic} — {progress.reward.bonus}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
