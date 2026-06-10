import { useState, useMemo } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getISOWeek(dateStr) {
  // Returns "YYYY-Www" string so we can group by week
  const d = new Date(dateStr + "T12:00:00");
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getWeekLabel(weekKey) {
  // Parse back to a human label like "Week of Jun 2"
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  const jan1 = new Date(year, 0, 1);
  const startOfWeek = new Date(jan1);
  startOfWeek.setDate(jan1.getDate() + (week - 1) * 7 - jan1.getDay());
  return "Week of " + startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── SessionCard ───────────────────────────────────────────────────────────────

function SessionCard({ session }) {
  const [open, setOpen] = useState(false);
  const hasNotes = Boolean(session.notes?.trim());
  const movCount = (session.movements || []).length;

  return (
    <div
      style={{
        borderRadius: 8,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Summary row */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          cursor: hasNotes ? "pointer" : "default",
        }}
      >
        {/* Date */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
            {formatDate(session.date)}
          </div>
          {movCount > 0 && (
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
              {movCount} quest{movCount !== 1 ? "s" : ""} completed
            </div>
          )}
        </div>

        {/* XP chip */}
        {session.xpEarned > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--yellow)",
              background: "rgba(217,164,65,0.12)",
              border: "1px solid rgba(217,164,65,0.3)",
              borderRadius: 6,
              padding: "2px 8px",
              flexShrink: 0,
            }}
          >
            +{session.xpEarned} XP
          </span>
        )}

        {/* Notes indicator */}
        {hasNotes && (
          <span
            style={{
              fontSize: 12,
              color: open ? "var(--accent)" : "var(--text3)",
              flexShrink: 0,
            }}
          >
            {open ? "▲" : "▼"}
          </span>
        )}
      </div>

      {/* Expanded notes */}
      {open && hasNotes && (
        <div
          style={{
            padding: "8px 14px 12px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface2)",
            fontSize: 12,
            color: "var(--text2)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          "{session.notes}"
        </div>
      )}
    </div>
  );
}

// ── WeekGroup ─────────────────────────────────────────────────────────────────

function WeekGroup({ weekKey, sessions }) {
  const totalXP = sessions.reduce((sum, s) => sum + (s.xpEarned || 0), 0);
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Week header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "var(--text3)",
            textTransform: "uppercase",
          }}
        >
          {getWeekLabel(weekKey)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </span>
          {totalXP > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--yellow)",
              }}
            >
              +{totalXP} XP
            </span>
          )}
        </div>
      </div>

      {/* Session cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sessions.map((s) => (
          <SessionCard key={s.id || s.date} session={s} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SessionHistory({ store, onBack }) {
  const [query, setQuery] = useState("");

  const sessions = store.state?.sessionLog || [];
  const totalXP = sessions.reduce((sum, s) => sum + (s.xpEarned || 0), 0);
  const sessionCount = sessions.length;

  // Filter by notes query
  const filtered = useMemo(() => {
    if (!query.trim()) return sessions;
    const q = query.toLowerCase();
    return sessions.filter(
      (s) =>
        s.notes?.toLowerCase().includes(q) ||
        s.date?.includes(q)
    );
  }, [sessions, query]);

  // Group by week
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((s) => {
      const key = s.date ? getISOWeek(s.date) : "unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });
    // Sort weeks newest first
    return [...map.entries()].sort((a, b) => (b[0] > a[0] ? 1 : -1));
  }, [filtered]);

  const withNotes = sessions.filter((s) => s.notes?.trim()).length;

  return (
    <div className="page">
      {/* Header */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--text3)",
            fontSize: 20,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          ←
        </button>
      )}

      <div style={{ marginBottom: 16 }}>
        <div className="page-title">Training History</div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          All sessions · up to 200 stored
        </div>
      </div>

      {/* Summary strip */}
      {sessionCount > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Sessions", value: sessionCount, color: "var(--accent)" },
            { label: "Total XP", value: `+${totalXP.toLocaleString()}`, color: "var(--yellow)" },
            { label: "With Notes", value: withNotes, color: "var(--text2)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                flex: 1,
                borderRadius: 8,
                padding: "10px 12px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {sessionCount > 0 && (
        <div style={{ marginBottom: 16, position: "relative" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes or date…"
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 13,
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {sessionCount === 0 && (
        <div
          className="card"
          style={{ textAlign: "center", padding: "36px 20px" }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            No sessions yet
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
            Complete your daily quests and tap "Log Session" on the Daily page to start building your training history.
          </div>
        </div>
      )}

      {/* No search results */}
      {sessionCount > 0 && filtered.length === 0 && (
        <div
          className="card"
          style={{ textAlign: "center", padding: "24px 20px" }}
        >
          <div style={{ fontSize: 13, color: "var(--text3)" }}>
            No sessions match "{query}"
          </div>
        </div>
      )}

      {/* Grouped sessions */}
      {grouped.map(([weekKey, weekSessions]) => (
        <WeekGroup key={weekKey} weekKey={weekKey} sessions={weekSessions} />
      ))}
    </div>
  );
}
