import { useState } from "react";
import { computeVIG } from "../../data/apf.js";
import { ozToMl } from "../../data/units.js";

export default function CheckInCard({ store, navigate, painToday }) {
  const today = new Date().toISOString().split("T")[0];
  const rec = store.getRecoveryForDate?.(today) || { hydrationMl: 0, sleepHours: 0 };
  const [hydration, setHydration] = useState(String(store.getHydrationOz?.(today) || ""));
  const [sleep, setSleep] = useState(String(rec.sleepHours || ""));

  const hydrationMl = ozToMl(hydration);
  const vig = computeVIG({ hydrationMl, sleepHours: parseFloat(sleep) || 0 });
  const vigPct = Math.min(100, (vig / 9999) * 100);

  function commit(ozVal, sleepVal) {
    store.logRecoveryOz({ hydrationOz: ozVal, sleepHours: parseFloat(sleepVal) || 0 });
  }

  function addHydration(oz) {
    const next = (parseFloat(hydration) || 0) + oz;
    setHydration(String(next));
    commit(next, sleep);
  }

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button
          onClick={() => navigate("body")}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            background: painToday ? "var(--surface2)" : "rgba(217,164,65,0.08)",
            border: `1px solid ${painToday ? "var(--border)" : "rgba(217,164,65,0.3)"}`,
            borderRadius: 8, padding: "7px 10px", cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ fontSize: 16 }}>{painToday ? "Done" : "Body"}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: painToday ? "var(--text2)" : "var(--accent)" }}>
              {painToday ? "Body logged" : "Log body check"}
            </div>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>
              {painToday ? "Foot · Knee · Wrist" : "Required daily"}
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate("axe")}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: "var(--surface2)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "7px 12px", cursor: "pointer", gap: 3,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: vig > 5000 ? "var(--blue)" : "var(--text3)" }}>
            {Math.round(vigPct)}%
          </div>
          <div style={{ fontSize: 9, color: "var(--text3)" }}>VIG</div>
        </button>
      </div>

      <div style={{ height: 3, borderRadius: 2, background: "var(--surface2)", overflow: "hidden", marginBottom: 10 }}>
        <div style={{ height: "100%", width: `${vigPct}%`, background: "var(--blue)", borderRadius: 2, transition: "width 0.3s" }} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 9, color: "var(--text3)", display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Water (oz)
          </label>
          <input
            type="number" value={hydration} min={0}
            onChange={(event) => setHydration(event.target.value)}
            onBlur={(event) => commit(event.target.value, sleep)}
            onKeyDown={(event) => event.key === "Enter" && commit(hydration, sleep)}
            style={{ width: "100%", padding: "6px 8px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 12 }}
            placeholder="0"
          />
          <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
            {[8, 16, 32].map((oz) => (
              <button key={oz} onClick={() => addHydration(oz)}
                style={{ flex: 1, fontSize: 9, fontWeight: 700, padding: "3px 0", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--blue)", cursor: "pointer" }}
              >+{oz}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 9, color: "var(--text3)", display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Sleep (hrs)
          </label>
          <input
            type="number" value={sleep} min={0} max={12} step={0.5}
            onChange={(event) => setSleep(event.target.value)}
            onBlur={(event) => commit(hydration, event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && commit(hydration, sleep)}
            style={{ width: "100%", padding: "6px 8px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 12 }}
            placeholder="0"
          />
          <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
            {[6, 7.5, 9].map((hours) => (
              <button key={hours} onClick={() => { setSleep(String(hours)); commit(hydration, hours); }}
                style={{ flex: 1, fontSize: 9, fontWeight: 700, padding: "3px 0", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--accent)", cursor: "pointer" }}
              >{hours}h</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
