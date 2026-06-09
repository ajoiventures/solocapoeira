import { useState } from "react";

export default function SessionLogBlock({ xp, onLog }) {
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div>
      {open && (
        <div style={{ marginBottom: 8 }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What felt different today? Optional note..."
            maxLength={280}
            style={{
              width: "100%", minHeight: 72, borderRadius: 8, padding: "8px 10px",
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 12, lineHeight: 1.5, resize: "vertical",
              fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn btn-success btn-full"
          style={{ flex: 1 }}
          onClick={() => onLog(xp, notes)}
        >
          ✓ Log Session (+{xp} XP)
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          title="Add training note"
          style={{
            padding: "0 12px", borderRadius: 8, border: "1px solid var(--border)",
            background: open ? "var(--surface3)" : "var(--surface2)",
            color: "var(--text2)", cursor: "pointer", fontSize: 14, flexShrink: 0,
          }}
        >
          ✏️
        </button>
      </div>
    </div>
  );
}
