import { useState } from "react";
import { computeVIG } from "../data/apf.js";

const PAIN_AREAS = [
  { id: "foot", label: "Foot / Arch", icon: "🦶", note: "Plantar fascia, arch, heel" },
  { id: "knee", label: "Knee", icon: "🦵", note: "Cap, ligaments, inner/outer" },
  { id: "wrist", label: "Wrist", icon: "🤲", note: "For au/bananeira training" },
  { id: "shoulder", label: "Shoulder", icon: "💪", note: "For inversions and au" },
  { id: "lowerBack", label: "Lower Back", icon: "🏃", note: "For macaco, bridge, MLDC" },
];

function painColor(v) {
  if (v === 0) return "var(--green)";
  if (v <= 2) return "#84cc16";
  if (v <= 4) return "var(--yellow)";
  if (v <= 6) return "var(--orange)";
  return "var(--red)";
}

function painLabel(v) {
  if (v === 0) return "None";
  if (v <= 2) return "Mild";
  if (v <= 4) return "Moderate";
  if (v <= 6) return "Significant";
  if (v <= 8) return "High";
  return "Severe";
}

export default function PainLog({ store }) {
  const today = new Date().toISOString().split("T")[0];
  const [nowMs] = useState(() => Date.now());
  const existing = store.state.painLog[today] || {};
  const [values, setValues] = useState({
    foot: existing.foot ?? 0,
    knee: existing.knee ?? 0,
    wrist: existing.wrist ?? 0,
    shoulder: existing.shoulder ?? 0,
    lowerBack: existing.lowerBack ?? 0,
  });
  const [saved, setSaved] = useState(!!existing.timestamp);

  const set = (id, val) => {
    setValues((v) => ({ ...v, [id]: val }));
    setSaved(false);
  };

  const save = () => {
    store.logPain(values);
    setSaved(true);
  };

  const trend = store.getRecentPainTrend();

  return (
    <div className="page">
      <div className="page-title">Pain Log</div>

      {/* Today's input */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Today — {today}</span>
          {saved && <span style={{ fontSize: 11, color: "var(--green)" }}>✓ Saved</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PAIN_AREAS.map(({ id, label, icon, note }) => (
            <div key={id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{icon} {label}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 8 }}>{note}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: painColor(values[id]), lineHeight: 1 }}>
                    {values[id]}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: painColor(values[id]), letterSpacing: 0.5, marginTop: 2 }}>
                    {painLabel(values[id])}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={values[id]}
                onChange={(e) => set(id, Number(e.target.value))}
                className="pain-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>
                <span>0 — None</span>
                <span>10 — Severe</span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={save}>
          {saved ? "✓ Saved" : "Save Today's Pain"}
        </button>
      </div>

      {/* Safety check */}
      <div className="card" style={{ borderColor: values.foot > 3 || values.knee > 3 || values.wrist > 3 ? "var(--red)" : "var(--border)" }}>
        <div className="card-title" style={{ marginBottom: 8 }}>Training Guidance</div>
        {values.foot > 3 && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 6 }}>
            ⚠ Foot pain {values.foot}/10 — Skip dynamic footwork. Foot protocol only.
          </div>
        )}
        {values.knee > 3 && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 6 }}>
            ⚠ Knee pain {values.knee}/10 — No deep squats, skip negativa/rolê.
          </div>
        )}
        {values.wrist > 3 && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 6 }}>
            ⚠ Wrist pain {values.wrist}/10 — No au or bananeira today.
          </div>
        )}
        {values.shoulder > 3 && (
          <div style={{ fontSize: 12, color: "var(--orange)", marginBottom: 6 }}>
            ⚠ Shoulder pain {values.shoulder}/10 — Light inversions only.
          </div>
        )}
        {values.lowerBack > 3 && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 6 }}>
            ⚠ Lower back pain {values.lowerBack}/10 — No macaco, bridge, or MLDC.
          </div>
        )}
        {Object.values(values).every((v) => v <= 3) && (
          <div style={{ fontSize: 12, color: "var(--green)" }}>
            ✓ All pain ≤ 3 — Full training cleared.
          </div>
        )}
      </div>

      {/* 7-day trend — all areas */}
      {trend.length > 1 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>7-Day Trend</div>
          {/* Day labels */}
          <div style={{ display: "flex", marginBottom: 6, paddingLeft: 90 }}>
            {trend.map((d) => (
              <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text3)" }}>
                {new Date(d.date + "T12:00:00").toLocaleDateString("en", { weekday: "narrow" })}
              </div>
            ))}
          </div>
          {PAIN_AREAS.map(({ id, label, icon }) => {
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8 }}>
                {/* Label */}
                <div style={{ width: 90, flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{icon}</span>
                  <span style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>{label.split(" /")[0]}</span>
                </div>
                {/* Bars */}
                {trend.map((d) => {
                  const val = d[id] || 0;
                  return (
                    <div
                      key={d.date}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
                      title={`${d.date}: ${val}/10`}
                    >
                      <div style={{ height: 32, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                        <div style={{
                          width: "70%", borderRadius: 2,
                          height: val > 0 ? `${(val / 10) * 32}px` : 2,
                          background: val > 0 ? painColor(val) : "var(--surface2)",
                          transition: "height 0.3s",
                        }} />
                      </div>
                      <span style={{ fontSize: 8, color: val > 0 ? painColor(val) : "var(--text3)", fontWeight: 700 }}>
                        {val > 0 ? val : "·"}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 30-day VIG trend ── */}
      {(() => {
        const recoveryLog = store.state.apf?.recoveryLog || {};
        const now = nowMs;
        const days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(now - (29 - i) * 86400000);
          const key = d.toISOString().split("T")[0];
          const rec = recoveryLog[key] || {};
          return { key, vig: rec.hydrationMl !== undefined ? computeVIG(rec) : null };
        });
        const hasData = days.some((d) => d.vig !== null);
        if (!hasData) return null;

        const vals = days.map((d) => d.vig ?? 0);
        const max = Math.max(...vals, 1);
        const avg = Math.round(vals.filter(Boolean).reduce((s, v) => s + v, 0) / (vals.filter(Boolean).length || 1));
        const H = 48;

        return (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div className="card-title">30-Day VIG Trend</div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>avg {avg.toLocaleString()}</span>
            </div>
            <svg width="100%" height={H + 16} viewBox={`0 0 ${days.length * 8} ${H + 16}`} preserveAspectRatio="none">
              {/* Baseline */}
              <line x1="0" y1={H} x2={days.length * 8} y2={H} stroke="var(--border)" strokeWidth="1" />
              {/* Bars */}
              {days.map((d, i) => {
                if (!d.vig) return null;
                const h = Math.max(2, Math.round((d.vig / max) * H));
                const pct = d.vig / 9999;
                const col = pct >= 0.8 ? "var(--green)" : pct >= 0.5 ? "var(--accent)" : "var(--warn, #C95252)";
                return <rect key={i} x={i * 8 + 1} y={H - h} width={6} height={h} rx={2} fill={col} opacity={0.85} />;
              })}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        );
      })()}

      {/* Full log */}
      <div>
        <div className="section-title">Pain History</div>
        {Object.entries(store.state.painLog)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 14)
          .map(([date, data]) => (
            <div key={date} className="card card-sm" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{date}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {PAIN_AREAS.map(({ id, icon }) => (
                    data[id] !== undefined && (
                      <span key={id} style={{ fontSize: 11, color: painColor(data[id]) }}>
                        {icon}{data[id]}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
