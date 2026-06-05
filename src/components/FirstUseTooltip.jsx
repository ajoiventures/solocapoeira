/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";

const SEEN_KEY = "sl_seen_tooltips";

function getSeenTooltips() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); }
  catch { return new Set(); }
}

function markSeen(id) {
  const seen = getSeenTooltips();
  seen.add(id);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

/**
 * Shows a one-shot tooltip the first time a user encounters a feature.
 * Once dismissed, never shows again.
 *
 * Usage:
 *   <FirstUseTooltip id="concept-trees" title="Concept Trees" body="Defeat Mestres to advance..." />
 */
export default function FirstUseTooltip({ id, title, body, position = "bottom", accent = "var(--accent)" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getSeenTooltips().has(id)) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [id]);

  function dismiss() {
    markSeen(id);
    setVisible(false);
  }

  if (!visible) return null;

  const posStyles = {
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <div
      role="tooltip"
      style={{
        position: "absolute", zIndex: 9000,
        ...posStyles[position],
        background: "var(--surface)",
        border: `1px solid ${accent}55`,
        borderRadius: 10,
        padding: "12px 14px",
        width: 230,
        boxShadow: `0 4px 24px rgba(0,0,0,.4), 0 0 0 1px ${accent}22`,
        pointerEvents: "auto",
        animation: "tooltipIn .18s ease",
      }}
    >
      <style>{`@keyframes tooltipIn{from{opacity:0;transform:${posStyles[position].transform} translateY(-4px)}to{opacity:1;transform:${posStyles[position].transform}}}`}</style>
      {/* Arrow */}
      <div style={{
        position: "absolute",
        ...(position === "bottom" ? { top: -5, left: "50%", marginLeft: -5 } :
            position === "top"    ? { bottom: -5, left: "50%", marginLeft: -5 } :
            position === "right"  ? { left: -5, top: "50%", marginTop: -5 } :
                                    { right: -5, top: "50%", marginTop: -5 }),
        width: 10, height: 10,
        background: "var(--surface)",
        border: `1px solid ${accent}55`,
        transform: "rotate(45deg)",
        borderRadius: 2,
        clipPath: position === "bottom" ? "inset(0 0 50% 0)" :
                  position === "top"    ? "inset(50% 0 0 0)" :
                  position === "right"  ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
      }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10 }}>
        {body}
      </div>
      <button
        onClick={dismiss}
        style={{ fontSize: 10, fontWeight: 700, color: accent, background: `${accent}18`,
          border: `1px solid ${accent}33`, borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}
      >
        Got it
      </button>
    </div>
  );
}

// Hook for tooltip state without the UI component
export function useFirstUse(id) {
  const [shown, setShown] = useState(() => !getSeenTooltips().has(id));
  const dismiss = () => { markSeen(id); setShown(false); };
  return [shown, dismiss];
}
