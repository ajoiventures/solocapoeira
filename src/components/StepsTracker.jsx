import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const THRESHOLD_UP   = 1.8;  // m/s² — acceleration (no gravity) to start a step
const THRESHOLD_DOWN = 1.0;  // fall back below this to complete the step
const MIN_STEP_MS    = 260;  // minimum ms between steps (~4 steps/sec max)
const SAVE_EVERY     = 15;   // flush to store every N steps

const SPM_TRAINING   = 110;  // cadence ≥ this → training
const SPM_WALKING    = 50;   // cadence ≥ this → walking; below = idle
const CADENCE_WIN_MS = 8000; // rolling window for cadence calculation

const XP_TIERS = [
  { min: 5000,  xp: 10,  label: "5k"  },
  { min: 8000,  xp: 20,  label: "8k"  },
  { min: 10000, xp: 30,  label: "10k" },
  { min: 15000, xp: 50,  label: "15k" },
];

function stepsXP(n) {
  let xp = 0;
  for (const t of XP_TIERS) if (n >= t.min) xp = t.xp;
  return xp;
}

function todayKey()  { return new Date().toISOString().split("T")[0]; }
function weekKey(d)  { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); return x.toISOString().split("T")[0]; }
function monthKey(d) { return d.slice(0, 7); }
function yearKey(d)  { return d.slice(0, 4); }

function getPeriod() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function formatN(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
  return String(n || 0);
}

// ── Main component ─────────────────────────────────────────────────────────
export default function StepsTracker({ store }) {
  const tod = todayKey();
  const stepsLog = store.state.stepsLog || {};

  // ── Stored base count for today (loaded once on mount) ──────────────────
  const baseRef    = useRef((stepsLog[tod]?.total ?? stepsLog[tod]?.count) || 0);
  const liveRef    = useRef(0);         // steps since last save
  const accLiveRef = useRef(0);         // total live steps this session (for display)
  const [baseTotal, setBaseTotal]       = useState(() => (stepsLog[tod]?.total ?? stepsLog[tod]?.count) || 0);
  const [liveDisplay, setLiveDisplay]   = useState(0);

  // ── Sensor state ────────────────────────────────────────────────────────
  const [status, setStatus]       = useState("idle"); // idle | counting | paused | denied | unsupported
  const [mode, setMode]           = useState("idle"); // idle | walking | training
  const stepTimesRef              = useRef([]);        // timestamps for cadence
  const peakRef                   = useRef(false);
  const lastStepMsRef             = useRef(0);
  const listenerRef               = useRef(null);

  // ── View state ──────────────────────────────────────────────────────────
  const [view, setView]           = useState("day");   // day | week | month | year

  // ── Background / visibility ─────────────────────────────────────────────
  const wasCountingRef = useRef(false);
  const bgStartRef     = useRef(null);
  const [bgMinutes, setBgMinutes]   = useState(0); // minutes app was hidden

  // ── Derived today total ─────────────────────────────────────────────────
  const totalToday = baseTotal + liveDisplay;

  // ── Save helper ─────────────────────────────────────────────────────────
  const flushSave = useCallback((extraSteps = 0) => {
    const steps = liveRef.current + extraSteps;
    if (steps === 0) return;
    const newTotal = baseRef.current + accLiveRef.current;
    store.logSteps(newTotal, { delta: steps, mode, period: getPeriod() });
    liveRef.current = 0;
  }, [store, mode]);

  // ── Step handler (attached to DeviceMotionEvent) ────────────────────────
  const handleMotion = useCallback((e) => {
    const a = e.acceleration; // acceleration WITHOUT gravity
    if (!a || a.x == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const now = Date.now();

    // Peak detection with hysteresis
    if (!peakRef.current && mag > THRESHOLD_UP) {
      peakRef.current = true;
    } else if (peakRef.current && mag < THRESHOLD_DOWN) {
      peakRef.current = false;
      if (now - lastStepMsRef.current < MIN_STEP_MS) return; // debounce
      lastStepMsRef.current = now;

      // Update cadence window
      stepTimesRef.current.push(now);
      stepTimesRef.current = stepTimesRef.current.filter(t => now - t <= CADENCE_WIN_MS);
      const spm = (stepTimesRef.current.length / (CADENCE_WIN_MS / 1000)) * 60;
      const newMode = spm >= SPM_TRAINING ? "training" : spm >= SPM_WALKING ? "walking" : "idle";
      setMode(newMode);

      // Count the step
      liveRef.current     += 1;
      accLiveRef.current  += 1;
      setLiveDisplay(accLiveRef.current);

      // Periodic save
      if (liveRef.current >= SAVE_EVERY) flushSave();
    }
  }, [flushSave, setLiveDisplay]);

  // ── Start / stop sensor ─────────────────────────────────────────────────
  const startCounting = useCallback(async () => {
    if (typeof window.DeviceMotionEvent === "undefined") {
      setStatus("unsupported"); return;
    }
    // iOS 13+ requires explicit user permission
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const r = await DeviceMotionEvent.requestPermission();
        if (r !== "granted") { setStatus("denied"); return; }
      } catch { setStatus("denied"); return; }
    }
    listenerRef.current = handleMotion;
    window.addEventListener("devicemotion", handleMotion, { passive: true });
    setStatus("counting");
    wasCountingRef.current = true;
  }, [handleMotion]);

  const stopCounting = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("devicemotion", listenerRef.current);
      listenerRef.current = null;
    }
    flushSave();
    setStatus("paused");
    wasCountingRef.current = false;
  }, [flushSave]);

  // ── Auto-start on mount (Android: no prompt needed) ─────────────────────
  useEffect(() => {
    if (typeof window.DeviceMotionEvent === "undefined") {
      const timer = setTimeout(() => setStatus("unsupported"), 0);
      return () => clearTimeout(timer);
    }
    if (typeof DeviceMotionEvent.requestPermission !== "function") {
      // Not iOS — start immediately
      const timer = setTimeout(startCounting, 0);
      return () => clearTimeout(timer);
    }
    // iOS: wait for user tap (startCounting called from button)
  }, []); // eslint-disable-line

  // ── Pause/resume on visibility change ───────────────────────────────────
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        if (status === "counting") {
          wasCountingRef.current = true;
          bgStartRef.current = Date.now();
          stopCounting();
          setStatus("paused");
        }
      } else {
        // App is visible again
        if (bgStartRef.current) {
          const mins = Math.round((Date.now() - bgStartRef.current) / 60000);
          if (mins > 0) setBgMinutes(mins);
          bgStartRef.current = null;
        }
        if (wasCountingRef.current) {
          startCounting();
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [status, startCounting, stopCounting]);

  // ── Flush on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (listenerRef.current) window.removeEventListener("devicemotion", listenerRef.current);
      if (liveRef.current > 0) {
        const newTotal = baseRef.current + accLiveRef.current;
        store.logSteps(newTotal, { delta: liveRef.current, mode, period: getPeriod() });
      }
    };
  }, []); // eslint-disable-line

  // ── Aggregation helpers ──────────────────────────────────────────────────
  function getStepsForDate(d) {
    const e = stepsLog[d];
    return e ? (e.total ?? e.count ?? 0) : 0;
  }

  // Today (live total including unsaved)
  const todayFull = totalToday;

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const steps = key === tod ? todayFull : getStepsForDate(key);
    return { key, steps, label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2) };
  });

  // Weekly total (current week Mon→today)
  const weekTotal = Object.entries(stepsLog).reduce((s, [k, v]) => {
    if (weekKey(k) === weekKey(tod)) return s + (v.total ?? v.count ?? 0);
    return s;
  }, 0) + liveDisplay;

  // Monthly
  const monthTotal = Object.entries(stepsLog).reduce((s, [k, v]) => {
    if (monthKey(k) === monthKey(tod)) return s + (v.total ?? v.count ?? 0);
    return s;
  }, 0) + liveDisplay;

  // Annual
  const yearTotal = Object.entries(stepsLog).reduce((s, [k, v]) => {
    if (yearKey(k) === yearKey(tod)) return s + (v.total ?? v.count ?? 0);
    return s;
  }, 0) + liveDisplay;

  // Today periods
  const periods = stepsLog[tod]?.periods || {};

  // Training steps today
  const trainingToday = (stepsLog[tod]?.training || 0);
  const normalToday   = (stepsLog[tod]?.normal   || 0);

  // ── UI helpers ────────────────────────────────────────────────────────────
  const xp     = stepsXP(todayFull);
  const GOAL   = 10000;
  const pct    = Math.min((todayFull / GOAL) * 100, 100);
  const maxBar = Math.max(...last7.map(d => d.steps), GOAL);

  const STATUS_COLOR = { counting: "var(--green)", paused: "#d97706", denied: "var(--red)", unsupported: "var(--text3)", idle: "var(--text3)" };
  const STATUS_LABEL = { counting: "● Counting", paused: "⏸ Paused", denied: "✗ Denied", unsupported: "✗ No sensor", idle: "Tap to start" };
  const MODE_LABEL   = { idle: "Idle", walking: "Walking", training: "Training" };
  const MODE_COLOR   = { idle: "var(--text3)", walking: "var(--blue)", training: "var(--red)" };

  // ── Manual add (when away) ────────────────────────────────────────────────
  const [manualInput, setManualInput] = useState("");
  function commitManual() {
    const n = parseInt(manualInput.replace(/\D/g, ""), 10);
    if (!isNaN(n) && n > 0) {
      const newBase = (stepsLog[tod]?.total ?? stepsLog[tod]?.count ?? 0) + n;
      baseRef.current = newBase;
      setBaseTotal(newBase);
      store.logSteps(newBase, { delta: n, mode: "normal", period: getPeriod() });
      setManualInput("");
      setBgMinutes(0);
    }
  }

  const [expanded, setExpanded] = useState(false);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="card" style={{ borderColor: pct >= 100 ? "var(--yellow)" : status === "counting" ? "rgba(46,140,120,0.4)" : "var(--border)" }}>

      {/* ── Header row — always visible, tappable to expand ── */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <span style={{ fontSize: 18 }}>👣</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Steps</span>
            <span style={{
              fontSize: 16, fontWeight: 800, letterSpacing: -0.5,
              color: pct >= 100 ? "var(--yellow)" : "var(--text)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {todayFull.toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>/ 10k</span>
          </div>
          {/* Slim progress bar */}
          <div style={{ height: 3, borderRadius: 2, background: "var(--surface2)", overflow: "hidden", marginTop: 4 }}>
            <div style={{
              height: "100%", borderRadius: 2, width: `${pct}%`,
              background: pct >= 100 ? "var(--yellow)" : status === "counting" ? "var(--green)" : "var(--accent)",
              transition: "width 0.4s",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {xp > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)" }}>+{xp} XP</span>}
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            background: "var(--surface2)", border: `1px solid ${STATUS_COLOR[status]}`,
            color: STATUS_COLOR[status],
          }}>
            {status === "counting" ? "●" : status === "paused" ? "⏸" : status === "denied" ? "✗" : status === "unsupported" ? "✗" : "○"}
          </span>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ color: "var(--text3)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ── Expanded content ── */}
      {!expanded && null}
      {expanded && <>
        <div style={{ marginTop: 12, marginBottom: 10, height: 1, background: "var(--border)" }} />

        {/* Start/stop button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <button
            onClick={(e) => { e.stopPropagation(); status === "counting" ? stopCounting() : startCounting(); }}
            style={{
              fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
              background: "var(--surface2)", border: `1px solid ${STATUS_COLOR[status]}`,
              color: STATUS_COLOR[status], cursor: "pointer",
            }}
          >
            {STATUS_LABEL[status]}
          </button>
        </div>

      {/* ── Big number + mode ── */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -2, lineHeight: 1, color: pct >= 100 ? "var(--yellow)" : "var(--text)", fontVariantNumeric: "tabular-nums" }}>
          {todayFull.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {status === "counting" && (
            <span style={{ color: MODE_COLOR[mode], fontWeight: 700 }}>
              {mode === "training" ? "🔥 " : mode === "walking" ? "🚶 " : "💤 "}{MODE_LABEL[mode]}
            </span>
          )}
          {liveDisplay > 0 && <span style={{ color: "var(--green)", fontWeight: 700 }}>+{liveDisplay} this session</span>}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <div className="progress-fill" style={{
          width: `${pct}%`,
          background: pct >= 100 ? "var(--yellow)" : status === "counting" ? "var(--green)" : "var(--accent)",
          transition: "width 0.4s",
        }} />
      </div>

      {/* ── XP tiers ── */}
      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {XP_TIERS.map(t => {
          const hit = todayFull >= t.min;
          return (
            <div key={t.min} style={{ flex: 1, textAlign: "center", padding: "4px 0", borderRadius: 6,
              background: hit ? "rgba(217,164,65,0.12)" : "var(--surface2)",
              border: `1px solid ${hit ? "var(--yellow)" : "var(--border)"}` }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: hit ? "var(--yellow)" : "var(--text3)" }}>{t.label}</div>
              <div style={{ fontSize: 9, color: hit ? "var(--yellow)" : "var(--text3)" }}>+{t.xp} XP</div>
            </div>
          );
        })}
      </div>

      {/* ── "Back from background" prompt ── */}
      {bgMinutes > 0 && (
        <div style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(217,164,65,0.10)", border: "1px solid rgba(217,164,65,0.35)" }}>
          <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, marginBottom: 6 }}>
            App was away for ~{bgMinutes} min — add steps manually?
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="number" value={manualInput} placeholder="Steps to add…"
              onChange={e => setManualInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && commitManual()}
              style={{ flex: 1, fontSize: 12, padding: "5px 8px", borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button onClick={commitManual} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer" }}>Add</button>
            <button onClick={() => setBgMinutes(0)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text3)", cursor: "pointer" }}>Skip</button>
          </div>
        </div>
      )}

      {/* ── View tabs ── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {["day", "week", "month", "year"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, fontSize: 10, fontWeight: 700, padding: "4px 0", borderRadius: 6,
            background: view === v ? "var(--accent)" : "var(--surface2)",
            border: `1px solid ${view === v ? "var(--accent)" : "var(--border)"}`,
            color: view === v ? "#fff" : "var(--text3)", cursor: "pointer",
            textTransform: "uppercase", letterSpacing: 0.8,
          }}>
            {v}
          </button>
        ))}
      </div>

      {/* ── Day view ── */}
      {view === "day" && (
        <div>
          {/* Training vs normal split */}
          {(trainingToday + normalToday) > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 8, background: "rgba(201,82,82,0.10)", border: "1px solid rgba(201,82,82,0.3)" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--red)" }}>{(trainingToday).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>🔥 Training</div>
              </div>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 8, background: "rgba(79,124,255,0.10)", border: "1px solid rgba(79,124,255,0.3)" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--blue)" }}>{(normalToday).toLocaleString()}</div>
                <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>🚶 Normal</div>
              </div>
            </div>
          )}

          {/* Time of day breakdown */}
          {Object.values(periods).some(v => v > 0) && (
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[
                { k: "morning",   label: "AM",    icon: "🌅" },
                { k: "afternoon", label: "PM",    icon: "☀️" },
                { k: "evening",   label: "EVE",   icon: "🌆" },
                { k: "night",     label: "NIGHT", icon: "🌙" },
              ].map(({ k, label, icon }) => (
                <div key={k} style={{ flex: 1, textAlign: "center", padding: "5px 2px", borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>{formatN(periods[k] || 0)}</div>
                  <div style={{ fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Background tracking notice */}
          <div style={{ fontSize: 10, color: "var(--text3)", padding: "6px 8px", borderRadius: 6, background: "var(--surface2)", lineHeight: 1.5 }}>
            ⚠️ <strong>Background:</strong> Web apps cannot count steps when the screen is off or another app is in front. Keep this app visible for auto-counting, or use the manual input below for steps taken away.
          </div>

          {/* Manual override */}
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 10, color: "var(--text3)", cursor: "pointer", userSelect: "none", listStyle: "none", paddingBottom: 4 }}>
              ✎ Set total manually
            </summary>
            <div style={{ display: "flex", gap: 6, paddingTop: 4 }}>
              <input
                type="number" min="0"
                placeholder="Set full day total…"
                onKeyDown={e => { if (e.key === "Enter") { const n = parseInt(e.target.value, 10); if (!isNaN(n)) { baseRef.current = n; accLiveRef.current = 0; liveRef.current = 0; setLiveDisplay(0); store.logSteps(n, { delta: 0, mode: "normal", period: getPeriod() }); e.target.value = ""; } } }}
                style={{ flex: 1, fontSize: 13, fontWeight: 700, padding: "6px 10px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none", textAlign: "center" }}
              />
            </div>
          </details>
        </div>
      )}

      {/* ── Week view — bar chart ── */}
      {view === "week" && (
        <div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64, marginBottom: 8 }}>
            {last7.map(d => {
              const h = Math.max(4, Math.round((d.steps / maxBar) * 60));
              const isToday = d.key === tod;
              return (
                <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "var(--text3)", fontWeight: isToday ? 800 : 400 }}>
                    {d.steps >= 1000 ? `${(d.steps/1000).toFixed(1)}k` : d.steps || "—"}
                  </div>
                  <div style={{ width: "100%", background: "var(--surface2)", borderRadius: 4, height: 48, display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: h, borderRadius: 4, background: d.steps >= 10000 ? "var(--yellow)" : isToday ? "var(--green)" : "var(--accent)", opacity: isToday ? 1 : 0.6, transition: "height 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "var(--text3)" }}>{d.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "var(--text3)" }}>This week</span>
            <span style={{ fontWeight: 800, color: "var(--text)" }}>{weekTotal.toLocaleString()} steps</span>
          </div>
        </div>
      )}

      {/* ── Month view ── */}
      {view === "month" && (() => {
        const monthKey2 = tod.slice(0, 7);
        const daysInMonth = new Date(parseInt(tod.slice(0, 4)), parseInt(tod.slice(5, 7)), 0).getDate();
        const dayTotals = Array.from({ length: daysInMonth }, (_, i) => {
          const d = `${monthKey2}-${String(i + 1).padStart(2, "0")}`;
          return getStepsForDate(d);
        });
        const maxDay = Math.max(...dayTotals, 1);
        return (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 48, marginBottom: 8 }}>
              {dayTotals.map((s, i) => {
                const h = Math.max(2, Math.round((s / maxDay) * 44));
                const isToday2 = i + 1 === parseInt(tod.slice(8));
                return (
                  <div key={i} style={{ flex: 1, height: 44, display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: h, borderRadius: 2, background: s >= 10000 ? "var(--yellow)" : isToday2 ? "var(--green)" : "var(--accent)", opacity: isToday2 ? 1 : 0.55 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "var(--text3)" }}>{new Date().toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
              <span style={{ fontWeight: 800, color: "var(--text)" }}>{monthTotal.toLocaleString()} steps</span>
            </div>
          </div>
        );
      })()}

      {/* ── Year view ── */}
      {view === "year" && (() => {
        const year = parseInt(tod.slice(0, 4));
        const monthTotals = Array.from({ length: 12 }, (_, i) => {
          const m = `${year}-${String(i + 1).padStart(2, "0")}`;
          return Object.entries(stepsLog).reduce((s, [k, v]) => k.startsWith(m) ? s + (v.total ?? v.count ?? 0) : s, 0);
        });
        const maxM = Math.max(...monthTotals, 1);
        const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
        return (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56, marginBottom: 8 }}>
              {monthTotals.map((s, i) => {
                const h = Math.max(2, Math.round((s / maxM) * 52));
                const isCur = i + 1 === parseInt(tod.slice(5, 7));
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ width: "100%", height: 52, background: "var(--surface2)", borderRadius: 4, display: "flex", alignItems: "flex-end" }}>
                      <div style={{ width: "100%", height: h, borderRadius: 4, background: isCur ? "var(--green)" : "var(--accent)", opacity: isCur ? 1 : 0.55 }} />
                    </div>
                    <div style={{ fontSize: 8, color: isCur ? "var(--yellow)" : "var(--text3)" }}>{MONTHS[i]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "var(--text3)" }}>{year}</span>
              <span style={{ fontWeight: 800, color: "var(--text)" }}>{yearTotal.toLocaleString()} steps · {Math.round(yearTotal * 0.000762).toLocaleString()} km</span>
            </div>
          </div>
        );
      })()}

      </>}

    </div>
  );
}
