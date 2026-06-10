export default function CollapsibleSection({ label, icon, badge, badgeColor, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: open ? "8px 8px 0 0" : 8, padding: "9px 12px",
          cursor: "pointer", textAlign: "left",
        }}
      >
        {icon && <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>}
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{label}</span>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10,
            background: (badgeColor || "var(--accent)") + "18",
            color: badgeColor || "var(--accent)",
          }}>
            {badge}
          </span>
        )}
        <svg
          viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ color: "var(--text3)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          border: "1px solid var(--border)", borderTop: "none",
          borderRadius: "0 0 8px 8px", overflow: "hidden",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
