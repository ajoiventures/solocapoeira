import { useEffect, useRef, useState, memo } from "react";
import { getSequencesForMovement } from "../data/sequences.js";

const LazyMovementCard = memo(function LazyMovementCard({ movement, level, navigate }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sequences, setSequences] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { rootMargin: "100px" } // Start loading 100px before visible
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Load sequences only when visible
  useEffect(() => {
    if (isVisible && !sequences) {
      setSequences(getSequencesForMovement(movement.id));
    }
  }, [isVisible, movement.id, sequences]);

  return (
    <button
      ref={ref}
      className="card"
      onClick={() => navigate("skill", movement.id, { backTo: "movementsLib", backLabel: "Movements" })}
      style={{ width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 8, padding: 12 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{movement.name}</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>{movement.meaning || movement.tree}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: level >= 5 ? "var(--accent)" : level > 0 ? "var(--green)" : "var(--text3)", flexShrink: 0 }}>
          M{level}
        </div>
      </div>
      {isVisible && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {(movement.category || []).slice(0, 4).map((cat) => (
            <span key={cat} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--surface2)", color: "var(--text3)" }}>
              {cat}
            </span>
          ))}
          {sequences && (
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(79,124,255,0.12)", color: "var(--blue)" }}>
              {sequences.length} sequence uses
            </span>
          )}
        </div>
      )}
    </button>
  );
});

export default LazyMovementCard;
