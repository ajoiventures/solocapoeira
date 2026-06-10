import { useEffect, useRef, useState } from "react";

export default function FlowTimer() {
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState(300); // seconds
  const tickRef = useRef(null);
  const startRef = useRef(0);  // Date.now() at last resume
  const accRef   = useRef(0);  // ms accumulated before last pause

  useEffect(() => {
    if (running) {
      startRef.current = Date.now();
      tickRef.current = setInterval(() => {
        setElapsed(accRef.current + Date.now() - startRef.current);
      }, 50);
    } else {
      clearInterval(tickRef.current);
      accRef.current = elapsed;
    }
    return () => clearInterval(tickRef.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const targetMs  = target * 1000;
  const pct       = Math.min((elapsed / targetMs) * 100, 100);
  const isComplete = elapsed >= targetMs;

  const totalSecs = Math.floor(elapsed / 1000);
  const mins = String(Math.floor(totalSecs / 60)).padStart(2, "0");
  const secs = String(totalSecs % 60).padStart(2, "0");
  const cs   = String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0");

  function reset() {
    setElapsed(0);
    setRunning(false);
    accRef.current = 0;
  }

  const PRESETS = [
    { label: "2m", s: 120 },
    { label: "3m", s: 180 },
    { label: "5m", s: 300 },
    { label: "7m", s: 420 },
    { label: "10m", s: 600 },
  ];

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="card-header">
        <span className="card-title">Flow Timer</span>
        <div style={{ display: "flex", gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.s}
              className="btn btn-sm btn-secondary"
              style={target === p.s ? { background: "var(--accent)", color: "#fff" } : {}}
              onClick={() => { setTarget(p.s); reset(); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="timer-display" style={{ color: isComplete ? "var(--green)" : "var(--text)" }}>
        {mins}:{secs}
        <span style={{ fontSize: "0.42em", letterSpacing: 1, opacity: 0.70, verticalAlign: "middle", marginLeft: 2 }}>
          .{cs}
        </span>
      </div>
      <div className="timer-label">
        {isComplete ? "✓ COMPLETE" : `${PRESETS.find((p) => p.s === target)?.label || ""} target`}
      </div>
      <div className="progress-bar" style={{ marginTop: 10 }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: isComplete ? "var(--green)" : "var(--accent)" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button
          className="btn btn-primary"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "⏸ Pause" : elapsed > 0 ? "▶ Resume" : "▶ Start"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
