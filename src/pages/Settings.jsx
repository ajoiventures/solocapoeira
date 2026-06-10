import { useState, useRef } from "react";
import { SPRINT_1 } from "../data/sprint.js";
import { SPRINT_2 } from "../data/sprint2.js";
import { isSupabaseEnabled } from "../lib/supabase.js";
import CloudSyncStatus from "../components/CloudSyncStatus.jsx";

function exportData(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `solo-leveling-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const FONT_SIZES = [
  { val: "small",   label: "Small",   px: "11px" },
  { val: "default", label: "Default", px: "13px" },
  { val: "large",   label: "Large",   px: "15px" },
];

export default function Settings({ store, theme, setTheme, navigate }) {
  const [fontSize, setFontSizeState] = useState(
    () => localStorage.getItem("sl_font_size") || "default"
  );

  function applyFontSize(val) {
    setFontSizeState(val);
    localStorage.setItem("sl_font_size", val);
    const px = FONT_SIZES.find((f) => f.val === val)?.px || "13px";
    document.documentElement.style.setProperty("--base-font-size", px);
  }

  const [colorBlind, setColorBlindState] = useState(
    () => localStorage.getItem("sl_color_blind") === "true"
  );

  function applyColorBlind(enabled) {
    setColorBlindState(enabled);
    localStorage.setItem("sl_color_blind", enabled ? "true" : "false");
    document.documentElement.setAttribute("data-color-blind", enabled ? "true" : "false");
  }
  const { settings, player, sessionLog } = store.state;
  const [name, setName] = useState(settings.name);
  const importRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null); // null | "ok" | "error"

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.movementProgress) throw new Error("Invalid backup — missing movementProgress");
        store.restoreState(data);
        setImportStatus("ok");
      } catch {
        setImportStatus("error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmXPReset, setConfirmXPReset] = useState(false);

  const totalSessions = sessionLog.length;

  const weeks = Array.from({ length: 24 }, (_, i) => i + 1);
  function getWeekTheme(w) {
    return w <= 12 ? SPRINT_1.weeks[w - 1]?.theme : SPRINT_2.weeks[w - 13]?.theme;
  }

  return (
    <div className="page">
      <div className="page-title">Settings</div>

      {/* Player summary */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Hunter Profile</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{player.level}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--yellow)" }}>{player.totalXP.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>XP</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--orange)" }}>{player.streakDays}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Streak</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--green)" }}>{totalSessions}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Sessions</div>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 4 }}>HUNTER NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", background: "var(--surface2)",
              border: "1px solid var(--border)", borderRadius: 6,
              color: "var(--text)", fontSize: 14,
            }}
          />
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => store.updateSettings({ name })}
        >
          Save Name
        </button>
      </div>

      {/* Spiritual Path */}
      <button
        onClick={() => navigate("profile")}
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(100,50,200,0.1))",
          border: "2px solid rgba(255,215,0,0.2)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          padding: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,215,0,0.4)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,215,0,0.2)"}
      >
        <div style={{ padding: 16 }}>
          <div className="card-title" style={{ marginBottom: 8, fontSize: 14, textAlign: "left" }}>
            ✨ Spiritual Path
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
            {store.getOrishaPath()}
          </div>
          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
            View stat bonuses and integrated Orishas →
          </div>
        </div>
      </button>

      {/* Sprint controls */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Sprint Control</div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>
          Current week: {player.currentWeek || 1}/24 — {getWeekTheme(player.currentWeek || 1)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 11, color: "var(--text3)" }}>Jump to week:</label>
          <select
            value={player.currentWeek || 1}
            onChange={(e) => store.setCurrentWeek(Number(e.target.value))}
            style={{
              padding: "6px 10px", background: "var(--surface2)",
              border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 12,
            }}
          >
            {weeks.map((w) => (
              <option key={w} value={w}>Week {w} — {getWeekTheme(w)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pain threshold */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 8 }}>Safety Threshold</div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>
          Pain threshold: {settings.painThreshold}/10 — quests adapt when pain exceeds this.
        </div>
        <input
          type="range" min={1} max={6} value={settings.painThreshold}
          onChange={(e) => store.updateSettings({ painThreshold: Number(e.target.value) })}
          className="pain-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text3)" }}>
          <span>1 — Very strict</span><span>6 — Permissive</span>
        </div>
      </div>

      {/* Vest weight */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 8 }}>Vest Weight</div>
        <div style={{ fontSize: 24, fontWeight: 800, textAlign: "center", color: "var(--yellow)", marginBottom: 8 }}>
          {settings.vestWeight} lb
        </div>
        <input
          type="range" min={0} max={40} step={5} value={settings.vestWeight}
          onChange={(e) => store.updateSettings({ vestWeight: Number(e.target.value) })}
          className="pain-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text3)" }}>
          <span>0 lb</span><span>40 lb max</span>
        </div>
      </div>

      {/* Links */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>References</div>
        {[
          { label: "Minhoquinho Movement Library", url: "https://www.minhoquinho.com/capoeira-movement-library" },
          { label: "Minhoquinho Tutorials", url: "https://www.minhoquinho.com/capoeira-tutorials" },
          { label: "Minhoquinho Workouts", url: "https://www.minhoquinho.com/capoeira-workout" },
        ].map(({ label, url }) => (
          <a key={url} className="ext-link" href={url} target="_blank" rel="noreferrer" style={{ display: "flex", marginBottom: 8 }}>
            📖 {label} ↗
          </a>
        ))}
      </div>

      {/* Data export */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 8 }}>Data Backup</div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>
          Export all your progress — XP, mastery levels, session history, pain logs — as a JSON file.
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => exportData(store.state)}
        >
          💾 Export Progress (JSON)
        </button>
      </div>

      {/* Cloud Sync / Auth */}
      {isSupabaseEnabled && (
        <CloudSyncStatus
          syncStatus={store.state.cloudSyncStatus}
          lastSyncTime={store.state.lastCloudSyncTime}
        />
      )}
      {!isSupabaseEnabled && (
        <div className="card" style={{ borderColor: "rgba(201,82,82,.3)" }}>
          <div className="card-title" style={{ marginBottom: 8 }}>Cloud Sync Disabled</div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            Supabase is not configured in this build. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to the production environment, then redeploy.
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 14 }}>Appearance</div>

        {/* Theme */}
        {setTheme && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Theme</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                {theme === "dark" ? "Dark — RPG Command Center" : "Light — Ehimare"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ val: "light", label: "☀ Light" }, { val: "dark", label: "◐ Dark" }].map(({ val, label }) => (
                <button key={val} className={`btn btn-sm${theme === val ? " btn-primary" : " btn-secondary"}`}
                  style={{ minWidth: 60 }} onClick={() => setTheme(val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Font size */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Text Size</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {FONT_SIZES.find((f) => f.val === fontSize)?.label || "Default"} ({FONT_SIZES.find((f) => f.val === fontSize)?.px})
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {FONT_SIZES.map(({ val, label }) => (
              <button key={val} className={`btn btn-sm${fontSize === val ? " btn-primary" : " btn-secondary"}`}
                style={{ minWidth: 50 }} onClick={() => applyFontSize(val)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Color blind mode */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Color Blind Mode</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {colorBlind ? "On — blue/orange palette" : "Off — default palette"}
            </div>
          </div>
          <button
            className={`btn btn-sm${colorBlind ? " btn-primary" : " btn-secondary"}`}
            style={{ minWidth: 60 }}
            onClick={() => applyColorBlind(!colorBlind)}
          >
            {colorBlind ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Reference */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Reference</div>
        <button
          onClick={() => navigate?.("glossary")}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
            background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10,
            cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{ fontSize: 18 }}>📚</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Capoeira Glossary</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>40 terms — Portuguese to English</div>
          </div>
          <span style={{ color: "var(--text3)" }}>›</span>
        </button>
      </div>

      {/* Export / Import */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Export / Import</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, lineHeight: 1.5 }}>
          Back up your progress or transfer to another device.
        </div>
        <button
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => exportData(store.state)}
        >
          📤 Export Backup (JSON)
        </button>
        <button
          className="btn btn-secondary btn-sm"
          style={{ width: "100%" }}
          onClick={() => importRef.current?.click()}
        >
          📥 Import Backup
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
        {importStatus === "ok" && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--green)", fontWeight: 700 }}>
            ✓ Import successful — data restored
          </div>
        )}
        {importStatus === "error" && (
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--red)", fontWeight: 700 }}>
            ✗ Invalid file — must be a Solo Leveling backup JSON
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: "var(--red)" }}>
        <div className="card-title" style={{ color: "var(--red)", marginBottom: 8 }}>Danger Zone</div>

        {/* Reset XP only */}
        {!confirmXPReset ? (
          <button className="btn btn-danger btn-sm" style={{ marginBottom: 8 }} onClick={() => setConfirmXPReset(true)}>
            Reset XP &amp; Level to 0
          </button>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>
              This resets XP to 0 and level to 1. All other progress (mastery, bosses, logs) stays intact.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-danger btn-sm" onClick={() => { store.resetXP(); setConfirmXPReset(false); }}>
                Yes, Reset XP
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmXPReset(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {!confirmReset ? (
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset(true)}>
            Reset All Progress
          </button>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>
              This will delete all mastery levels, pain logs, session history, and XP. Are you sure?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-danger btn-sm" onClick={() => { store.resetAll(); setConfirmReset(false); }}>
                Yes, Reset Everything
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GDPR — Privacy & Data */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 8 }}>Privacy & Your Data</div>
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, marginBottom: 14 }}>
          Your training data is stored locally first. If Cloud Sync is enabled, it is backed up to Supabase.
          Error reporting and product analytics only run when Sentry and PostHog keys are configured.
        </div>
        <button
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => exportData(store.state)}
        >
          📋 Download My Data (JSON)
        </button>
        <GdprDeleteButton />
      </div>
    </div>
  );
}

function GdprDeleteButton() {
  const [step, setStep] = useState(0); // 0=idle, 1=confirm, 2=deleted

  if (step === 2) return (
    <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", padding: "10px 0" }}>
      All data deleted. Reload the page to start fresh.
    </div>
  );

  if (step === 1) return (
    <div style={{ background: "rgba(201,82,82,.08)", border: "1px solid rgba(201,82,82,.25)",
      borderRadius: 8, padding: "12px 14px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>
        Permanently delete all training data?
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12, lineHeight: 1.5 }}>
        This removes all reps, sessions, mastery levels, Mestre progress, and settings from this device.
        This cannot be undone.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn btn-danger btn-sm"
          style={{ flex: 1 }}
          onClick={() => {
            localStorage.clear();
            setStep(2);
          }}
        >
          Delete everything
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <button
      className="btn btn-secondary btn-sm"
      style={{ width: "100%", color: "var(--red)", borderColor: "rgba(201,82,82,.3)" }}
      onClick={() => setStep(1)}
    >
      🗑️ Delete All My Data
    </button>
  );
}
