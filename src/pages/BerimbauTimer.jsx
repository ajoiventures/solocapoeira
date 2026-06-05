import { useState, useEffect, useRef, useCallback } from "react";

const TOQUES = [
  {
    id: "angola",
    name: "Angola",
    bpm: 60,
    color: "#16a34a",
    desc: "Slow, deep game. Low to the ground.",
    accent: [1, 5],   // beat indices (0-based) that get accent pulse
    beats: 8,
  },
  {
    id: "sao_bento_grande",
    name: "São Bento Grande",
    bpm: 100,
    color: "#D9A441",
    desc: "Regional game. Medium pace, dynamic.",
    accent: [0, 2, 4],
    beats: 6,
  },
  {
    id: "iuna",
    name: "Iúna",
    bpm: 130,
    color: "#C95252",
    desc: "Fast, aggressive. Mestre's game only.",
    accent: [0, 3],
    beats: 4,
  },
];

function createTick(audioCtx, freq = 880, vol = 0.25) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.15);
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function BerimbauTimer({ config, navigate }) {
  const [toqueId, setToqueId] = useState(config?.toque || "angola");
  const [isRunning, setIsRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [, setBeatCount] = useState(0); // total beats since start
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [roundSecsLeft, setRoundSecsLeft] = useState(config?.workSecs || 180);
  const [roundsLeft, setRoundsLeft] = useState(config?.rounds || 3);
  const [phase, setPhase] = useState("work"); // "work" | "rest"
  const [pulse, setPulse] = useState(false);

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const beatRef = useRef(null);

  const toque = TOQUES.find((t) => t.id === toqueId) || TOQUES[0];
  const intervalMs = Math.round(60000 / toque.bpm);

  const workSecs = config?.workSecs || 180;
  const restSecs = config?.restSecs || 60;
  const totalRounds = config?.rounds || 3;

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Beat ticker
  useEffect(() => {
    if (!isRunning) {
      clearInterval(beatRef.current);
      return;
    }
    const tickFn = () => {
      setBeatCount((prev) => {
        const next = prev + 1;
        const beatPos = next % toque.beats;
        setBeat(beatPos);
        const isAccent = toque.accent.includes(beatPos);
        setPulse(true);
        setTimeout(() => setPulse(false), 120);
        if (soundEnabled) {
          try {
            const ctx = getAudioCtx();
            createTick(ctx, isAccent ? 1200 : 660, isAccent ? 0.35 : 0.15);
          } catch {
            // Audio playback can be blocked until the browser receives a user gesture.
          }
        }
        return next;
      });
    };
    beatRef.current = setInterval(tickFn, intervalMs);
    return () => clearInterval(beatRef.current);
  }, [isRunning, intervalMs, toque, soundEnabled, getAudioCtx]);

  // Round countdown
  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setRoundSecsLeft((prev) => {
        if (prev <= 1) {
          if (phase === "work") {
            if (roundsLeft <= 1) {
              setIsRunning(false);
              setRoundsLeft(0);
              setPhase("done");
              return 0;
            }
            setPhase("rest");
            return restSecs;
          } else {
            setRoundsLeft((r) => r - 1);
            setPhase("work");
            return workSecs;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning, phase, roundsLeft, workSecs, restSecs]);

  const handleStart = () => {
    setIsRunning(true);
    setRoundSecsLeft(workSecs);
    setRoundsLeft(totalRounds);
    setPhase("work");
    setBeatCount(0);
  };
  const handlePause = () => setIsRunning((v) => !v);
  const handleReset = () => {
    setIsRunning(false);
    setRoundSecsLeft(workSecs);
    setRoundsLeft(totalRounds);
    setPhase("work");
    setBeatCount(0);
    setBeat(0);
  };

  const isDone = phase === "done";
  const isRest = phase === "rest";

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Back */}
      <div style={{ width: "100%", marginBottom: 16 }}>
        <button
          onClick={() => navigate("daily")}
          style={{
            background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
            display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Daily
        </button>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase" }}>
          Berimbau Timer
        </div>
        {config?.label && (
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{config.label}</div>
        )}
      </div>

      {/* Toque selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {TOQUES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setToqueId(t.id); handleReset(); }}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${toqueId === t.id ? t.color : "var(--border)"}`,
              background: toqueId === t.id ? t.color + "22" : "var(--surface2)",
              color: toqueId === t.id ? t.color : "var(--text3)",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Big pulse circle */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        {/* Outer ring (accent pulse) */}
        <div style={{
          position: "absolute", inset: -16,
          borderRadius: "50%",
          border: `2px solid ${toque.color}`,
          opacity: pulse && toque.accent.includes(beat) ? 0.7 : 0.12,
          transform: pulse && toque.accent.includes(beat) ? "scale(1.06)" : "scale(1)",
          transition: "all 0.12s ease-out",
        }} />
        {/* Main circle */}
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          background: isDone
            ? "rgba(46,140,120,0.15)"
            : isRest
            ? "rgba(79,124,255,0.12)"
            : toque.color + "18",
          border: `3px solid ${isDone ? "var(--green)" : isRest ? "var(--blue)" : toque.color}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transform: pulse ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.08s ease-out, border-color 0.3s",
        }}>
          {isDone ? (
            <>
              <div style={{ fontSize: 36 }}>✅</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--green)", marginTop: 6 }}>Complete!</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36, fontWeight: 900, color: isRest ? "var(--blue)" : toque.color, lineHeight: 1 }}>
                {fmtTime(roundSecsLeft)}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                {isRest ? "Rest" : `Round ${totalRounds - roundsLeft + 1} / ${totalRounds}`}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: toque.color, marginTop: 2 }}>
                {toque.bpm} BPM
              </div>
            </>
          )}
        </div>
      </div>

      {/* Beat indicators */}
      {isRunning && !isDone && (
        <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
          {Array.from({ length: toque.beats }, (_, i) => (
            <div
              key={i}
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: beat === i
                  ? toque.color
                  : toque.accent.includes(i)
                  ? toque.color + "55"
                  : "var(--surface2)",
                border: `1px solid ${toque.accent.includes(i) ? toque.color + "88" : "var(--border)"}`,
                transition: "background 0.05s",
              }}
            />
          ))}
        </div>
      )}

      {/* Toque description */}
      <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginBottom: 20, fontStyle: "italic" }}>
        {toque.desc}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 280 }}>
        {!isRunning && !isDone ? (
          <button
            onClick={handleStart}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 800, fontSize: 14,
              border: "none", background: toque.color, color: "#fff", cursor: "pointer",
            }}
          >
            ▶ Start
          </button>
        ) : null}
        {isRunning && !isDone ? (
          <>
            <button
              onClick={handlePause}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 800, fontSize: 14,
                border: `2px solid ${toque.color}`, background: "transparent", color: toque.color, cursor: "pointer",
              }}
            >
              ⏸ Pause
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: "12px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text3)", cursor: "pointer",
              }}
            >
              ↺
            </button>
          </>
        ) : null}
        {isDone && (
          <button
            onClick={handleReset}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, fontWeight: 800, fontSize: 14,
              border: "none", background: "var(--green)", color: "#fff", cursor: "pointer",
            }}
          >
            ↺ Again
          </button>
        )}
      </div>

      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled((v) => !v)}
        style={{
          marginTop: 14, background: "none", border: "none", cursor: "pointer",
          color: "var(--text3)", fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 5,
        }}
      >
        {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>
    </div>
  );
}
