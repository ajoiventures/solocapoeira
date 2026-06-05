import { useState, useEffect, useRef } from "react";

// ── Web Audio bell synthesis ─────────────────────────────────────────────────
let _ctx = null;
function audioCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function bell(strikes = 1, hz = 880) {
  try {
    const ctx = audioCtx();
    for (let i = 0; i < strikes; i++) {
      const t = ctx.currentTime + i * 0.65;
      [hz, hz * 2.756].forEach((f) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f;
        g.gain.setValueAtTime(0.45, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
        o.start(t); o.stop(t + 1.6);
      });
    }
  } catch {
    // Audio can be blocked until a user gesture unlocks the browser audio context.
  }
}

function beep(count = 3) {
  try {
    const ctx = audioCtx();
    for (let i = 0; i < count; i++) {
      const t = ctx.currentTime + i * 0.28;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 660;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.start(t); o.stop(t + 0.16);
    }
  } catch {
    // Audio can be blocked until a user gesture unlocks the browser audio context.
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(s) {
  const sec = Math.max(0, s);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

const ADJ = {
  width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)",
  background: "var(--surface2)", cursor: "pointer", fontSize: 20, fontWeight: 700,
  color: "var(--text)", lineHeight: 1, flexShrink: 0,
};

function Row({ label, value, onDec, onInc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={ADJ} onClick={onDec}>−</button>
        <span style={{ fontSize: 17, fontWeight: 800, minWidth: 60, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <button style={ADJ} onClick={onInc}>+</button>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BoxingTimer({ config, navigate }) {
  const initRounds = config?.rounds    ?? 3;
  const initWork   = config?.workSecs  ?? 300;   // 5 min default
  const initRest   = config?.restSecs  ?? 60;    // 60s default

  const [cfgRounds, setCfgRounds] = useState(initRounds);
  const [cfgWork,   setCfgWork]   = useState(initWork);
  const [cfgRest,   setCfgRest]   = useState(initRest);

  // All timer state in a ref — avoids stale closures in setInterval
  const initialTimer = { phase: "idle", round: 1, left: initWork, running: false, warned: false };
  const [timerState, setTimerState] = useState(initialTimer);
  const timerRef = useRef(initialTimer);
  const cfg = useRef({ rounds: initRounds, work: initWork, rest: initRest });
  const iv  = useRef(null);

  const commitTimer = (nextOrUpdater) => {
    const next = typeof nextOrUpdater === "function"
      ? nextOrUpdater(timerRef.current)
      : nextOrUpdater;
    timerRef.current = next;
    setTimerState(next);
  };

  // Keep cfg ref synced with settings state
  useEffect(() => { cfg.current = { rounds: cfgRounds, work: cfgWork, rest: cfgRest }; }, [cfgRounds, cfgWork, cfgRest]);

  const clearIv = () => { clearInterval(iv.current); iv.current = null; };

  const reset = () => {
    clearIv();
    commitTimer({ phase: "idle", round: 1, left: cfg.current.work, running: false, warned: false });
  };

  // Reset when user changes work duration from settings
  useEffect(() => {
    if (timerRef.current.phase === "idle") {
      commitTimer((current) => ({ ...current, left: cfgWork }));
    }
  }, [cfgWork]);

  const tick = () => {
    iv.current = setInterval(() => {
      const r = timerRef.current, c = cfg.current;
      if (!r.running) { clearIv(); return; }

      let next = { ...r, left: r.left - 1 };

      // 3-beep countdown warning
      if (next.left === 3 && !next.warned) {
        next = { ...next, warned: true };
        beep(3);
      }

      if (next.left <= 0) {
        if (r.phase === "work") {
          if (r.round >= c.rounds) {
            // All done
            bell(3, 880);
            next = { phase: "done", round: r.round, left: 0, running: false, warned: false };
            clearIv();
          } else {
            // Work → Rest
            bell(2, 780);
            next = { phase: "rest", round: r.round, left: c.rest, running: true, warned: false };
          }
        } else {
          // Rest → next Work round
          bell(1, 880);
          next = { phase: "work", round: r.round + 1, left: c.work, running: true, warned: false };
        }
      }
      commitTimer(next);
    }, 1000);
  };

  const start = () => {
    const current = timerRef.current;
    if (current.phase === "idle") {
      bell(1, 880);
      commitTimer({ ...current, phase: "work", left: cfg.current.work, running: true });
    } else {
      commitTimer({ ...current, running: true });
    }
    clearIv();
    tick();
  };

  const pause = () => {
    clearIv();
    commitTimer((current) => ({ ...current, running: false }));
  };

  const { phase, round, left, running } = timerState;
  const totalTime = phase === "rest" ? cfgRest : cfgWork;
  const pct = totalTime > 0 ? (left / totalTime) * 100 : 100;

  const COLOR = { idle: "#4F7CFF", work: "#C95252", rest: "#2E8C78", done: "#D9A441" };
  const c = COLOR[phase] ?? "#4F7CFF";

  const phaseLabel = { idle: "Ready", work: "Work", rest: "Rest", done: "Done" }[phase];

  return (
    <div className="page">
      {/* Back */}
      <button
        onClick={() => { reset(); navigate("daily"); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13, marginBottom: 20 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      {/* Config summary chip */}
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, textAlign: "center" }}>
        {cfgRounds} × {fmt(cfgWork)} work · {fmt(cfgRest)} rest
      </div>

      {/* Main face */}
      <div
        className="card"
        style={{ textAlign: "center", padding: "36px 20px 32px", background: c + "12", borderColor: c + "55" }}
      >
        {/* Phase */}
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: c, marginBottom: 6 }}>
          {phaseLabel}
        </div>

        {/* Round */}
        {(phase === "work" || phase === "rest") && (
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12, fontWeight: 600 }}>
            Round {round} / {cfgRounds}
          </div>
        )}

        {/* Big clock */}
        <div style={{ fontSize: 82, fontWeight: 900, letterSpacing: -4, color: c, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {phase === "done" ? "✓" : fmt(phase === "idle" ? cfgWork : left)}
        </div>

        {/* Progress bar */}
        {(phase === "work" || phase === "rest") && (
          <div style={{ margin: "20px auto 0", height: 6, background: "var(--progress-track)", borderRadius: 3, maxWidth: 280, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, background: c, width: `${pct}%`, transition: "width 0.95s linear" }} />
          </div>
        )}

        {phase === "done" && (
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 12 }}>
            {cfgRounds} round{cfgRounds !== 1 ? "s" : ""} complete 🔔
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {phase !== "done" && (
          running
            ? (
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: 18, fontWeight: 800, padding: "13px 0" }} onClick={pause}>
                ⏸ Pause
              </button>
            )
            : (
              <button
                className="btn btn-primary"
                style={{ flex: 1, fontSize: 18, fontWeight: 800, padding: "13px 0", background: c, borderColor: c }}
                onClick={start}
              >
                {phase === "idle" ? "▶ Start" : "▶ Resume"}
              </button>
            )
        )}
        {phase === "done" && (
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 16, fontWeight: 800, background: "#4F7CFF", borderColor: "#4F7CFF" }} onClick={reset}>
            ↺ Again
          </button>
        )}
        <button className="btn btn-secondary" style={{ fontSize: 18, minWidth: 50, fontWeight: 700 }} onClick={reset}>
          ↺
        </button>
      </div>

      {/* Settings — only visible when idle */}
      {phase === "idle" && (
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>
            Timer Settings
          </div>

          <Row
            label="Rounds"
            value={String(cfgRounds)}
            onDec={() => setCfgRounds((r) => Math.max(1, r - 1))}
            onInc={() => setCfgRounds((r) => Math.min(20, r + 1))}
          />
          <Row
            label="Work"
            value={fmt(cfgWork)}
            onDec={() => setCfgWork((w) => Math.max(30, w - 30))}
            onInc={() => setCfgWork((w) => w + 30)}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Rest</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button style={ADJ} onClick={() => setCfgRest((r) => Math.max(0, r - 30))}>−</button>
              <span style={{ fontSize: 17, fontWeight: 800, minWidth: 60, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{cfgRest === 0 ? "None" : fmt(cfgRest)}</span>
              <button style={ADJ} onClick={() => setCfgRest((r) => r + 30)}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
