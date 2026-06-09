import PlayerProfile from "../components/PlayerProfile.jsx";
import TitlesPanel from "../components/TitlesPanel.jsx";

/**
 * Player Profile Page — Shows Spiritual Path, Stat Bonuses, and Integration Progress
 */
export default function Profile({ store, navigate }) {
  const activeTitle = store.state?.activeTitle || null;

  const handleSelectTitle = (titleId) => {
    store.update((s) => ({ ...s, activeTitle: titleId === s.activeTitle ? null : titleId }));
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate("settings")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text2)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            padding: "4px 0",
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <span className="page-title">Spiritual Path</span>
      </div>

      <PlayerProfile store={store} />

      <div style={{ marginTop: 24 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Titles &amp; Prestige</div>
        <TitlesPanel
          state={store.state}
          activeTitle={activeTitle}
          onSelectTitle={handleSelectTitle}
        />
      </div>
    </div>
  );
}
