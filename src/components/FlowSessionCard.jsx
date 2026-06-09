import { useState, useRef, useEffect } from "react";

const FLOW_DURATION = 1200; // 20 minutes

export default function FlowSessionCard({ store }) {
  const [phase, setPhase] = useState("idle"); // idle | running | paused | done
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= FLOW_DURATION) {
            clearInterval(intervalRef.current);
            setPhase("done");
            return FLOW_DURATION;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const remaining = FLOW_DURATION - elapsed;
  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const pct = (elapsed / FLOW_DURATION) * 100;

  if (phase === "done") {
    return (
      <div className="card" style={{ borderLeft: "3px solid var(--green)", textAlign: "center", padding: "16px" }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🌀</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>Flow Session Complete</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12 }}>20 minutes of free practice. The body remembers.</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            store.logSession({ movements: [], xpEarned: 100, notes: "Flow session — 20 min free practice" });
            setPhase("idle"); setElapsed(0);
          }}
        >
          Log Flow Session +100 XP
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderLeft: "3px solid var(--blue)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "rgba(79,124,255,0.12)", border: "1px solid rgba(79,124,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          🌀
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--blue)", letterSpacing: 1.5,
            textTransform: "uppercase", marginBottom: 2 }}>Flow Session</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: phase === "idle" ? 0 : 6 }}>
            {phase === "idle" ? "20 min free practice — no plan, just move" : `${mins}:${secs} remaining`}
          </div>
          {phase !== "idle" && (
            <div style={{ height: 3, borderRadius: 2, background: "var(--surface3)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`,
                background: "var(--blue)", transition: "width 1s linear" }} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {phase === "idle" && (
            <button onClick={() => setPhase("running")}
              style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 8,
                background: "var(--blue)", color: "#fff", border: "none", cursor: "pointer" }}>
              Start
            </button>
          )}
          {phase === "running" && (
            <button onClick={() => setPhase("paused")}
              style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 8,
                background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)", cursor: "pointer" }}>
              Pause
            </button>
          )}
          {phase === "paused" && (<>
            <button onClick={() => setPhase("running")}
              style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 8,
                background: "var(--blue)", color: "#fff", border: "none", cursor: "pointer" }}>
              Resume
            </button>
            <button onClick={() => { setPhase("idle"); setElapsed(0); }}
              style={{ fontSize: 11, padding: "7px 10px", borderRadius: 8,
                background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)", cursor: "pointer" }}>
              ✕
            </button>
          </>)}
        </div>
      </div>
    </div>
  );
}
