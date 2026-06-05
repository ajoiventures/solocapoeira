/**
 * BackButton — consistent back navigation across all detail pages.
 * Uses onBack() if provided (nav stack), otherwise falls back to navigate(fallbackPage).
 */
export default function BackButton({ onBack, fallback, navigate, label }) {
  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (navigate && fallback) navigate(fallback);
  };

  return (
    <button
      onClick={handleBack}
      style={{
        background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
        display: "flex", alignItems: "center", gap: 4, padding: "4px 0",
        fontSize: 13, marginBottom: 16,
      }}
    >
      <svg
        viewBox="0 0 24 24" width="16" height="16"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      {label || "Back"}
    </button>
  );
}
