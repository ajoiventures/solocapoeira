import { useMemo } from "react";
import { getAvailableTitles, getTitleById } from "../data/titles.js";

export default function TitlesPanel({ state, activeTitle, onSelectTitle }) {
  const availableTitles = useMemo(() => getAvailableTitles(state), [state]);
  const earnedTitles = useMemo(() => availableTitles.filter(t => t.earned), [availableTitles]);

  const activeInfo = activeTitle ? getTitleById(activeTitle) : null;
  const categoryGroups = useMemo(() => {
    return earnedTitles.reduce((groups, title) => {
      const cat = title.category;
      groups[cat] = groups[cat] || [];
      groups[cat].push(title);
      return groups;
    }, {});
  }, [earnedTitles]);

  return (
    <div>
      {/* Active Title Display */}
      {activeInfo && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(100,50,200,0.1))",
          border: "2px solid rgba(255,215,0,0.2)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
            Active Title
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "var(--yellow)", marginBottom: 4 }}>
            {activeInfo.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>
            {activeInfo.description}
          </div>
        </div>
      )}

      {/* Earned Titles */}
      {earnedTitles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Titles Coming Soon</div>
          <div style={{ fontSize: 11 }}>Complete challenges to earn cosmetic titles</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>
            Earned Titles ({earnedTitles.length})
          </div>
          {Object.entries(categoryGroups).map(([category, titles]) => (
            <div key={category} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
                {category === "streak" && "🔥 Streak"}
                {category === "level" && "📈 Level"}
                {category === "mastery" && "🎯 Mastery"}
                {category === "boss" && "🗡️ Combat"}
                {category === "mestre" && "👺 Mestre"}
                {category === "orisha" && "✨ Orishas"}
                {category === "prestige" && "🌙 Prestige"}
                {category === "special" && "⭐ Special"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {titles.map(title => (
                  <button
                    key={title.id}
                    onClick={() => onSelectTitle(title.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: activeTitle === title.id ? "rgba(255,215,0,0.15)" : "var(--surface2)",
                      border: activeTitle === title.id ? "2px solid var(--yellow)" : "1px solid var(--border)",
                      color: "var(--text)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 200ms",
                    }}
                    onMouseEnter={(e) => {
                      if (activeTitle !== title.id) {
                        e.currentTarget.style.borderColor = "var(--text2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = activeTitle === title.id ? "var(--yellow)" : "var(--border)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: activeTitle === title.id ? "var(--yellow)" : "var(--text)" }}>
                          {title.name}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                          {title.description}
                        </div>
                      </div>
                      {activeTitle === title.id && (
                        <div style={{ fontSize: 16, flexShrink: 0 }}>✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
