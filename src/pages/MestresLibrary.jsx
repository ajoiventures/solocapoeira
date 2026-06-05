import { useState } from "react";
import { MESTRES } from "../data/mestres.js";
import { BOSS_TESTS } from "../data/bossTests.js";

/**
 * Mestres Library - Reference page for all Mestres
 * Browse lineages, styles, and historical information
 * Maps to #96: Layout reorganization - move Mestre reference to secondary nav
 */
export default function MestresLibrary({ store, navigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLineage, setSelectedLineage] = useState(null);

  // Get all unique lineages
  const lineages = Array.from(new Set(MESTRES.map((m) => m.lineage)));

  // Helper to get boss data for a mestre
  const getBossData = (mestreId) => {
    return BOSS_TESTS.find((b) => b.id === mestreId);
  };

  // Filter Mestres by search + lineage
  const filtered = MESTRES.filter((m) => {
    const matchesSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLineage = !selectedLineage || m.lineage === selectedLineage;
    return matchesSearch && matchesLineage;
  });

  // Get defeat status for each Mestre
  const getMestreStatus = (mestreId) => {
    const defeated = store.state.mestreProgress?.[mestreId]?.defeated ?? false;
    const boss = getBossData(mestreId);
    return { defeated, boss };
  };

  const handleMestreTap = (mestreId) => {
    navigate("mestre", mestreId, { backTo: "mestres", backLabel: "Mestres" });
  };

  return (
    <div className="page">
      <div className="page-title">Mestres of Capoeira</div>

      {/* Search & Filter */}
      <div className="card">
        <input
          type="text"
          placeholder="Search Mestres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            color: "var(--text)",
            fontSize: 13,
            marginBottom: 12,
          }}
        />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedLineage(null)}
            className={`btn btn-sm${selectedLineage === null ? " btn-primary" : " btn-secondary"}`}
            style={{ fontSize: 11 }}
          >
            All Lineages
          </button>
          {lineages.sort().map((lineage) => (
            <button
              key={lineage}
              onClick={() => setSelectedLineage(lineage)}
              className={`btn btn-sm${selectedLineage === lineage ? " btn-primary" : " btn-secondary"}`}
              style={{ fontSize: 11 }}
            >
              {lineage}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
          {filtered.length} Mestre{filtered.length !== 1 ? "s" : ""}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length > 0 ? (
            filtered.map((mestre) => {
              const { defeated, boss } = getMestreStatus(mestre.id);
              return (
                <div
                  key={mestre.id}
                  onClick={() => handleMestreTap(mestre.id)}
                  className="card"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderColor: defeated ? "var(--green)" : "var(--border)",
                    background: defeated ? "var(--surface2)" : "var(--surface)",
                  }}
                  onMouseEnter={(e) => {
                    if (e.currentTarget) e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget) e.currentTarget.style.borderColor = defeated ? "var(--green)" : "var(--border)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      fontSize: 32,
                      minWidth: 40,
                      textAlign: "center",
                    }}>
                      {defeated ? "✓" : "🥋"}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: defeated ? "var(--green)" : "var(--text)",
                        marginBottom: 2,
                      }}>
                        {mestre.name}
                      </div>

                      <div style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginBottom: 6,
                      }}>
                        {mestre.lineage} · {mestre.style}
                      </div>

                      <div style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        lineHeight: 1.4,
                        marginBottom: 8,
                      }}>
                        {mestre.description}
                      </div>

                      {boss && (
                        <div style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}>
                          {boss.conceptGates && boss.conceptGates.length > 0 && (
                            <div style={{
                              fontSize: 10,
                              padding: "4px 8px",
                              background: "var(--surface3)",
                              borderRadius: 4,
                              color: "var(--text3)",
                            }}>
                              Requires: {boss.conceptGates.map((g) => `${g.tree} ${g.level}`).join(", ")}
                            </div>
                          )}
                          {boss.xp && (
                            <div style={{
                              fontSize: 10,
                              padding: "4px 8px",
                              background: "var(--yellow)" + "22",
                              borderRadius: 4,
                              color: "var(--yellow)",
                              fontWeight: 700,
                            }}>
                              +{boss.xp} XP
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {defeated && (
                      <div style={{
                        fontSize: 24,
                        opacity: 0.5,
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              textAlign: "center",
              padding: 32,
              color: "var(--text3)",
              fontSize: 13,
            }}>
              No Mestres found
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 10 }}>
          YOUR PROGRESS
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
              Defeated
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--green)",
            }}>
              {filtered.filter((m) => getMestreStatus(m.id).defeated).length} / {filtered.length}
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
              All Mestres
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--blue)",
            }}>
              {MESTRES.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
