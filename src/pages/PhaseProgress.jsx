import { TRAINING_PHASES, getPhaseById, getPhaseProgress } from "../data/trainingPhases.js";

/**
 * Phase Progress Page - Complete 4-phase journey visualization
 * Maps to #92: Phase Progress page showing all phases
 */
export default function PhaseProgress({ store }) {
  const currentPhase = store.getCurrentPhase?.() ?? 1;
  const phasesCompleted = store.state.trainingPhase?.phasesCompleted || [];

  return (
    <div className="page">
      <div className="page-title">Training Path</div>

      {/* Journey Timeline */}
      <div style={{
        position: "relative",
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
      }}>
        {/* Vertical line connecting phases */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--border)",
          transform: "translateX(-50%)",
        }} />

        {/* Phases */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TRAINING_PHASES.map((phase) => {
            const isActive = phase.id === currentPhase;
            const isCompleted = phasesCompleted.includes(phase.id);
            const progress = getPhaseProgress(phase.id, store.state.conceptTreeProgress, Object.keys(store.state.mestreProgress).filter((id) => store.state.mestreProgress[id]?.defeated));

            return (
              <div key={phase.id} style={{ position: "relative" }}>
                {/* Phase node */}
                <div style={{
                  position: "absolute",
                  left: "50%",
                  top: 24,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: isCompleted ? "var(--green)" : isActive ? phase.color : "var(--surface2)",
                  border: isActive ? `3px solid ${phase.color}` : "2px solid var(--border)",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                }}>
                  {isCompleted ? "✓" : phase.id}
                </div>

                {/* Phase content */}
                <div style={{
                  marginLeft: "calc(50% + 30px)",
                  padding: 16,
                  background: isActive ? `${phase.color}11` : "var(--surface2)",
                  border: isActive ? `2px solid ${phase.color}` : "1px solid var(--border)",
                  borderRadius: 8,
                  position: "relative",
                }}>
                  {/* Phase header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{phase.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: isActive ? phase.color : "var(--text)",
                        marginBottom: 2,
                      }}>
                        Phase {phase.id}: {phase.name}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: "var(--text3)",
                      }}>
                        {phase.description}
                      </div>
                    </div>
                    {isCompleted && (
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--green)",
                        background: "var(--green)22",
                        padding: "4px 8px",
                        borderRadius: 4,
                      }}>
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Progress bar (if active) */}
                  {isActive && (
                    <div style={{
                      background: "var(--surface3)",
                      borderRadius: 6,
                      padding: 10,
                      marginBottom: 12,
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--text3)",
                      }}>
                        <span>Phase Progress</span>
                        <span style={{ color: phase.color }}>{progress}%</span>
                      </div>
                      <div style={{
                        height: 6,
                        borderRadius: 3,
                        background: "var(--surface2)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: phase.color,
                          transition: "width 0.4s ease-out",
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Focus areas */}
                  <div style={{
                    background: "var(--surface3)",
                    borderRadius: 6,
                    padding: 10,
                    marginBottom: 12,
                  }}>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}>
                      Training Focus
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 6,
                    }}>
                      {phase.movementFocus.slice(0, 4).map((focus, i) => (
                        <div key={i} style={{
                          fontSize: 10,
                          color: "var(--text2)",
                          padding: 4,
                          background: "var(--surface2)",
                          borderRadius: 4,
                        }}>
                          • {focus}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concept targets */}
                  <div style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 12,
                  }}>
                    {Object.entries(phase.conceptTrees).map(([tree, data]) => (
                      data.end > data.start && (
                        <div
                          key={tree}
                          style={{
                            flex: 1,
                            textAlign: "center",
                            padding: 8,
                            background: "var(--surface2)",
                            borderRadius: 4,
                            fontSize: 10,
                          }}
                        >
                          <div style={{
                            fontWeight: 700,
                            textTransform: "capitalize",
                            marginBottom: 2,
                            color: "var(--text3)",
                          }}>
                            {tree}
                          </div>
                          <div style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: tree === "mandinga" ? "#2E8C78" : tree === "malandragem" ? "#D4854A" : "#4F7CFF",
                          }}>
                            {data.start}→{data.end}
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Mestre count */}
                  <div style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    padding: 8,
                    background: "var(--surface2)",
                    borderRadius: 4,
                    textAlign: "center",
                  }}>
                    🎖 {phase.mestres.length} Mestres to Defeat
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Card */}
      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>
          Your Journey
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          <div style={{
            padding: 10,
            background: "var(--surface2)",
            borderRadius: 6,
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 10,
              color: "var(--text3)",
              marginBottom: 4,
              fontWeight: 700,
            }}>
              Current Phase
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: getPhaseById(currentPhase).color,
            }}>
              {currentPhase} / 4
            </div>
          </div>

          <div style={{
            padding: 10,
            background: "var(--surface2)",
            borderRadius: 6,
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 10,
              color: "var(--text3)",
              marginBottom: 4,
              fontWeight: 700,
            }}>
              Completed Phases
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--green)",
            }}>
              {phasesCompleted.length} / 4
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 12,
          padding: 10,
          background: "var(--surface2)",
          borderRadius: 6,
          fontSize: 11,
          color: "var(--text2)",
          lineHeight: 1.6,
        }}>
          {currentPhase === 1 && (
            <>
              <strong>Phase 1: Angola Foundation</strong>
              <br />
              Master low game, grounding, and spiritual power. Build your Mandinga + Malandragem foundation before learning Regional speed.
            </>
          )}
          {currentPhase === 2 && (
            <>
              <strong>Phase 2: Angola Progressing + Regional</strong>
              <br />
              Angola deepens as you learn Regional speed and directness. Develop Malícia to read fast opponents. Stay grounded.
            </>
          )}
          {currentPhase === 3 && (
            <>
              <strong>Phase 3: Angola Progressing + Contemporary Mastery</strong>
              <br />
              Angola continues. Master Contemporary athleticism and acrobatics. All styles flowing from Angola foundation.
            </>
          )}
          {currentPhase === 4 && (
            <>
              <strong>Phase 4: All Integrated - Transcendence</strong>
              <br />
              Every style flows through Angola. Master-level integration. Orishas await. Prestige mode activated.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
