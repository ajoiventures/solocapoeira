import { useState } from "react";
import { createBlankSegment } from "../data/videoSegments.js";

/**
 * Video Segment Editor - Fill in segments while watching video
 * Maps to video game training requirement tracking
 */
export default function VideoSegmentEditor({ game, onAddSegment, onUpdateSegment }) {
  const [newSegmentCount, setNewSegmentCount] = useState(1);

  const handleAddSegment = () => {
    const segment = createBlankSegment(game.id, (game.segments?.length || 0) + 1);
    onAddSegment?.(segment);
    setNewSegmentCount(newSegmentCount + 1);
  };

  const handleUpdateSegment = (segmentId, field, value) => {
    const segment = game.segments?.find((s) => s.id === segmentId);
    if (!segment) return;

    let updates = { [field]: value };

    // Auto-calculate duration if times changed
    if (field === "startTime" || field === "endTime") {
      const start = field === "startTime" ? value : segment.startTime;
      const end = field === "endTime" ? value : segment.endTime;
      updates.durationSeconds = Math.max(0, end - start);
    }

    onUpdateSegment?.(segmentId, updates);
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimeInput = (timeStr) => {
    // Parse "2:30" or "150" (seconds)
    if (timeStr.includes(":")) {
      const [m, s] = timeStr.split(":").map(Number);
      return m * 60 + s;
    }
    return Number(timeStr) || 0;
  };

  return (
    <div className="page">
      {/* Video info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
          {game.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
          {game.opponent ? `vs ${game.opponent}` : "Opponent TBA"} ·
          {game.totalDuration > 0 ? ` ${formatTime(game.totalDuration)} total` : " Duration TBA"}
        </div>
        <div style={{
          background: "var(--surface2)",
          borderRadius: 6,
          padding: 8,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>
            Segments: {game.segments?.length || 0}
            {game.segments?.length > 0 && (
              <span style={{ marginLeft: 8, color: "var(--green)" }}>
                {game.segments.filter((s) => s.trained).length} trained
              </span>
            )}
          </div>
          <div style={{
            height: 4,
            borderRadius: 2,
            background: "var(--surface3)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${game.segments?.length > 0 ? (game.segments.filter((s) => s.trained).length / game.segments.length) * 100 : 0}%`,
              background: "var(--green)",
              transition: "width 0.3s",
            }} />
          </div>
        </div>
      </div>

      {/* Add segment button */}
      <button
        onClick={handleAddSegment}
        style={{
          width: "100%",
          padding: "10px 16px",
          marginBottom: 16,
          background: "var(--surface2)",
          border: "1px dashed var(--border)",
          borderRadius: 8,
          color: "var(--blue)",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        + Add Segment
      </button>

      {/* Segment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {game.segments?.map((segment) => (
          <div
            key={segment.id}
            className="card"
            style={{
              opacity: segment.trained ? 0.7 : 1,
              borderLeft: segment.trained ? "4px solid var(--green)" : "4px solid var(--border)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={segment.trained}
                onChange={(e) =>
                  handleUpdateSegment(segment.id, "trained", e.target.checked)
                }
                style={{ cursor: "pointer", width: 18, height: 18 }}
              />
              <input
                type="text"
                value={segment.title}
                onChange={(e) =>
                  handleUpdateSegment(segment.id, "title", e.target.value)
                }
                placeholder="Segment title"
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  background: "transparent",
                  border: "none",
                  color: "var(--text)",
                  padding: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                {segment.durationSeconds}s
              </span>
            </div>

            {/* Timing */}
            <div style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                  Start (mm:ss)
                </label>
                <input
                  type="text"
                  placeholder="0:00"
                  defaultValue={formatTime(segment.startTime)}
                  onBlur={(e) =>
                    handleUpdateSegment(segment.id, "startTime", parseTimeInput(e.target.value))
                  }
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginTop: 2,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
              </div>
              <span style={{ color: "var(--text3)" }}>→</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                  End (mm:ss)
                </label>
                <input
                  type="text"
                  placeholder="2:30"
                  defaultValue={formatTime(segment.endTime)}
                  onBlur={(e) =>
                    handleUpdateSegment(segment.id, "endTime", parseTimeInput(e.target.value))
                  }
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginTop: 2,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                What happens in this segment?
              </label>
              <textarea
                value={segment.description}
                onChange={(e) =>
                  handleUpdateSegment(segment.id, "description", e.target.value)
                }
                placeholder="e.g., Mestre opens with ginga feints, opponent responds with lateral escape..."
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: 4,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: "inherit",
                  minHeight: 60,
                  resize: "vertical",
                  color: "var(--text)",
                }}
              />
            </div>

            {/* Techniques & Focus */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                  Techniques (comma-separated)
                </label>
                <input
                  type="text"
                  value={segment.techniques.join(", ")}
                  onChange={(e) =>
                    handleUpdateSegment(
                      segment.id,
                      "techniques",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                  placeholder="ginga, armada, lateral..."
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginTop: 4,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
              </div>
              <div style={{ width: 80 }}>
                <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                  Difficulty
                </label>
                <select
                  value={segment.difficulty}
                  onChange={(e) =>
                    handleUpdateSegment(segment.id, "difficulty", Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    marginTop: 4,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}/5
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Focus & Notes */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>
                Training focus
              </label>
              <input
                type="text"
                value={segment.focus}
                onChange={(e) =>
                  handleUpdateSegment(segment.id, "focus", e.target.value)
                }
                placeholder="e.g., defensive malícia, reading opponent"
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  marginTop: 4,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
            </div>

            {/* Training stats */}
            {segment.trained && (
              <div style={{
                background: "var(--surface3)",
                borderRadius: 6,
                padding: 8,
                fontSize: 11,
                color: "var(--text3)",
              }}>
                ✓ Trained {segment.repCount || 0}× · Last: {segment.lastTrained ? new Date(segment.lastTrained).toLocaleDateString() : "N/A"}
              </div>
            )}
          </div>
        ))}
      </div>

      {!game.segments?.length && (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "var(--text3)",
          fontSize: 12,
        }}>
          📹 Watch the video and add segments as you identify key exchanges
        </div>
      )}
    </div>
  );
}
