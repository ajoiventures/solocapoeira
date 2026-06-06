import { useState, useMemo, useCallback } from "react";
import { APF_PILLARS, APF_OUTPUTS, computeVIG } from "../data/apf.js";
import { WEEKLY_NUTRITION_HABITS } from "../data/nutritionPlan.js";
import { MOVEMENTS } from "../data/movements.js";
import { SKILL_TREES } from "../data/trees.js";
import PlayerProfile from "../components/PlayerProfile.jsx";
import { calculateIntegrationBonuses, getBonusDescriptions } from "../data/orishaStatSystem.js";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { mlToOz, ozToMl } from "../data/units.js";

function computePools(state) {
  const today = new Date().toISOString().split("T")[0];
  const rec = state.apf?.recoveryLog?.[today] || { hydrationMl: 0, sleepHours: 0 };
  const vig = computeVIG(rec);
  const quest = state.todayQuest?.date === today ? state.todayQuest : { bonusItems: [] };
  const habitIds = new Set(WEEKLY_NUTRITION_HABITS.map((h) => h.id));
  const checked = (quest.bonusItems || []).filter((id) => habitIds.has(id)).length;
  const eng = Math.round((checked / WEEKLY_NUTRITION_HABITS.length) * 999);
  return { vig, eng, hydrationMl: rec.hydrationMl || 0, sleepHours: rec.sleepHours || 0 };
}

function Bar({ value, max, color, height = 6 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: "var(--surface2)", borderRadius: 4, height, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s", minWidth: pct > 0 ? 4 : 0 }} />
    </div>
  );
}

function PillarAbbr({ abbr, color }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
      background: color + "22", color, border: `1px solid ${color}44`,
      marginRight: 3, letterSpacing: 0.5,
    }}>{abbr}</span>
  );
}

// ── Activity Heatmap ──────────────────────────────────────────────
const DAY_ABBRS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function repColor(count, accent) {
  if (!count) return "var(--surface2)";
  if (count < 10)  return (accent || "var(--accent)") + "33";
  if (count < 30)  return (accent || "var(--accent)") + "66";
  if (count < 80)  return (accent || "var(--accent)") + "aa";
  return accent || "var(--accent)";
}

function ActivityHeatmap({ heatmapData, restDays }) {
  const [selected, setSelected] = useState(null);
  const restSet = new Set(restDays || []);

  // Build 52-week grid (364 days + today = 365 cells)
  const { weeks } = useMemo(() => {
    const today = new Date();
    // Pad so we start on Sunday
    const todayDay = today.getDay(); // 0=Sun
    const totalDays = 364 + todayDay + 1; // enough to fill full weeks back to Sunday
    const days = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    // Chunk into weeks of 7
    const wks = [];
    for (let i = 0; i < days.length; i += 7) wks.push(days.slice(i, i + 7));
    return { weeks: wks };
  }, [heatmapData]);

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* Day-of-week labels */}
      <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <div style={{ width: 18 }} />
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d} style={{
            width: 12, fontSize: 8, color: "var(--text3)",
            textAlign: "center", fontWeight: 700,
          }}>
            {d % 2 === 0 ? DAY_ABBRS[d] : ""}
          </div>
        ))}
      </div>

      {/* Grid: each column = one week */}
      <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {week.map((date) => {
              const reps = heatmapData.get(date) || 0;
              const isToday = date === todayStr;
              const isFuture = date > todayStr;
              const isSelected = selected?.date === date;
              const isRest = restSet.has(date) && reps === 0;
              const cellBg = isFuture ? "transparent"
                : reps > 0 ? repColor(reps, "var(--accent)")
                : isRest ? "rgba(79,124,255,0.25)"
                : "var(--surface2)";
              return (
                <div
                  key={date}
                  onClick={() => !isFuture && setSelected(isSelected ? null : { date, reps, isRest })}
                  title={`${date}: ${reps > 0 ? reps + " reps" : isRest ? "Rest day" : "No training"}`}
                  style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: cellBg,
                    cursor: isFuture ? "default" : "pointer",
                    border: isToday ? "1px solid var(--accent)" : isSelected ? "1px solid var(--text2)" : "none",
                    opacity: isFuture ? 0 : 1,
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected day tooltip */}
      {selected && (
        <div style={{
          marginTop: 8, padding: "7px 12px", borderRadius: 8,
          background: "var(--surface2)", border: "1px solid var(--border)",
          fontSize: 12, color: "var(--text2)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>{new Date(selected.date + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
          <span style={{ fontWeight: 800, color: selected.reps > 0 ? "var(--accent)" : selected.isRest ? "var(--blue)" : "var(--text3)" }}>
            {selected.reps > 0 ? `${selected.reps} reps` : selected.isRest ? "🛌 Rest day" : "No training"}
          </span>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 9, color: "var(--text3)" }}>Less</span>
        {[0, 5, 20, 50, 100].map((v) => (
          <div key={v} style={{
            width: 10, height: 10, borderRadius: 2,
            background: repColor(v, "var(--accent)"),
            border: "1px solid var(--border)",
          }} />
        ))}
        <span style={{ fontSize: 9, color: "var(--text3)" }}>More</span>
      </div>
    </div>
  );
}

export default function Stats({ store }) {
  const { state } = store;
  const pillars = state.apf?.pillars || { for: 0, vel: 0, res: 0, nut: 0, fnd: 0, fld: 0 };
  const pools = computePools(state);

  const { streak = 0, inGrace = false } = store.getStreakDays?.() ?? {};
  const longestStreak = store.getLongestStreak?.() ?? 0;
  const heatmapData = store.getRepHeatmapData?.() ?? new Map();
  const weeklyConsistency = store.getWeeklyConsistency?.() ?? { trained: 0, total: 7 };

  // Computed for share card
  const totalMastered = MOVEMENTS.filter((m) => (store.getMasteryLevel(m.id) || 0) >= 5).length;
  const topTrees = useMemo(() => {
    return SKILL_TREES
      .map((t) => {
        const mvs = MOVEMENTS.filter((m) => m.tree === t.id);
        const mastered = mvs.filter((m) => (store.getMasteryLevel(m.id) || 0) >= 5).length;
        return { ...t, mastered, total: mvs.length, pct: mvs.length ? mastered / mvs.length : 0 };
      })
      .filter((t) => t.total > 0)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  }, [store]);

  const handleShare = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 750;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0B111C";
    ctx.fillRect(0, 0, 750, 400);

    // Gold accent bar
    ctx.fillStyle = "#D9A441";
    ctx.fillRect(0, 0, 750, 4);

    // Title
    ctx.fillStyle = "#D9A441";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("CAPOEIRA LEVELING", 40, 40);

    // Level + Name
    ctx.fillStyle = "#F7F1E8";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.fillText(`Level ${state.player.level}`, 40, 100);

    ctx.fillStyle = "#AAB3C2";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(state.settings?.name || "Hunter", 40, 125);

    // Stats row
    const stats = [
      { label: "STREAK", value: `${streak}d`, color: "#D9A441" },
      { label: "MASTERED", value: String(totalMastered), color: "#2E8C78" },
      { label: "LONGEST", value: `${longestStreak}d`, color: "#4F7CFF" },
    ];
    stats.forEach((s, i) => {
      const x = 40 + i * 200;
      const y = 175;
      ctx.fillStyle = s.color;
      ctx.font = "bold 32px system-ui, sans-serif";
      ctx.fillText(s.value, x, y);
      ctx.fillStyle = "#6F7A8A";
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.fillText(s.label, x, y + 18);
    });

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 215);
    ctx.lineTo(710, 215);
    ctx.stroke();

    // Top trees
    ctx.fillStyle = "#6F7A8A";
    ctx.font = "bold 10px system-ui, sans-serif";
    ctx.fillText("TOP TREES", 40, 240);
    topTrees.forEach((t, i) => {
      const x = 40 + i * 225;
      const y = 290;
      const barW = 180;
      const barH = 6;
      // Bar background
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.roundRect(x, y - barH, barW, barH, 3);
      ctx.fill();
      // Bar fill
      ctx.fillStyle = t.color || "#D9A441";
      ctx.beginPath();
      ctx.roundRect(x, y - barH, barW * t.pct, barH, 3);
      ctx.fill();
      // Label
      ctx.fillStyle = "#F7F1E8";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText(`${t.icon} ${t.name}`, x, y - 14);
      ctx.fillStyle = "#6F7A8A";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(`${t.mastered}/${t.total}`, x, y + 16);
    });

    // Footer
    ctx.fillStyle = "#6F7A8A";
    ctx.font = "11px system-ui, sans-serif";
    const dateStr = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    ctx.fillText(`Generated ${dateStr}`, 40, 375);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "progress.png", { type: "image/png" })] })) {
        navigator.share({
          title: `Level ${state.player.level} Capoeira Progress`,
          files: [new File([blob], "progress.png", { type: "image/png" })],
        }).catch(() => {});
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `capoeira-level-${state.player.level}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }
    }, "image/png");
  }, [state, streak, inGrace, longestStreak, totalMastered, topTrees]);

  const today = new Date().toISOString().split("T")[0];
  const rec = store.getRecoveryForDate?.(today) || { hydrationMl: 0, sleepHours: 0 };

  const [hydration, setHydration] = useState(String(mlToOz(rec.hydrationMl) || ""));
  const [sleep, setSleep] = useState(String(rec.sleepHours || ""));

  function commitRecovery(newHydration, newSleep) {
    const s = parseFloat(newSleep) || 0;
    store.logRecoveryOz({ hydrationOz: newHydration, sleepHours: s });
  }

  function addHydration(oz) {
    const current = parseFloat(hydration) || 0;
    const next = current + oz;
    setHydration(String(next));
    commitRecovery(next, parseFloat(sleep) || 0);
  }

  const liveVIG = computeVIG({
    hydrationMl: ozToMl(hydration),
    sleepHours: parseFloat(sleep) || 0,
  });

  const pillarLookup = Object.fromEntries(APF_PILLARS.map((p) => [p.key, p]));
  const orishaBonuses = calculateIntegrationBonuses(state.orishasIntegrated || [], store.isEhiAscended?.() || false);
  const bonusDescriptions = getBonusDescriptions(orishaBonuses);
  const prestigeMultiplier = store.getPrestigeXPMultiplier?.() || 1;

  return (
    <div className="page">
      <div className="page-title">Axé</div>

      {/* ── Spiritual Path (Player Profile) ───────────────────── */}
      <PlayerProfile store={store} />

      <div className="card">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
          <span className="card-title">Orisha Stat Stack</span>
          <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 800 }}>XP x{prestigeMultiplier.toFixed(2)}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            ["Strength", orishaBonuses.strength, "var(--orange)"],
            ["Speed", orishaBonuses.speed, "var(--blue)"],
            ["Resilience", orishaBonuses.resilience, "var(--green)"],
            ["Spiritual", orishaBonuses.spiritualMastery, "var(--accent)"],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: "var(--surface2)", borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color }}>
                {label === "Spiritual" ? `+${Math.round(value || 0)}` : `+${Math.round((value || 0) * 100)}%`}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
          Ogun core plus {state.orishasIntegrated?.length || 0}/16 integrated Orishas. Ehi and prestige multipliers are included in the displayed XP stack.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {bonusDescriptions.length > 0 ? bonusDescriptions.map((desc) => (
            <span key={desc} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, background: "var(--surface2)", color: "var(--text2)" }}>{desc}</span>
          )) : (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Integrate Ogun to begin activating stat bonuses.</span>
          )}
        </div>
      </div>

      {/* ── Streak + Heatmap ───────────────────────────────────── */}
      <div className="card">
        {/* Streak row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{inGrace ? "⚡" : "🔥"}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: inGrace ? "var(--yellow)" : "var(--accent)", lineHeight: 1 }}>
              {streak} <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)" }}>day streak</span>
              {inGrace && <span style={{ fontSize: 11, color: "var(--yellow)", marginLeft: 6 }}>⚡ grace</span>}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
              Longest: {longestStreak} days · {weeklyConsistency.trained}/{weeklyConsistency.total} this week
            </div>
          </div>
          {streak >= 7 && (
            <div style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 800,
              padding: "3px 10px", borderRadius: 20,
              background: "var(--accent)", color: "#000",
            }}>
              {streak >= 30 ? "🏆 ELITE" : streak >= 14 ? "⚡ HOT" : "🎯 ON FIRE"}
            </div>
          )}
        </div>

        {/* Activity heatmap */}
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>
          Rep Activity — Last 365 Days
        </div>
        <ActivityHeatmap heatmapData={heatmapData} restDays={state.restDays || []} />
      </div>

      {/* ── Recovery Pools ─────────────────────────────────────── */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>Recovery Pools</div>

        {/* VIG */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>💧</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>VIG</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Vigor</span>
            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "var(--blue)" }}>
              {liveVIG.toLocaleString()} / 9999
            </span>
          </div>
          <Bar value={liveVIG} max={9999} color="var(--blue)" height={8} />

          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>
                HYDRATION (oz)
              </label>
              <input
                type="number"
                value={hydration}
                min={0}
                onChange={(e) => setHydration(e.target.value)}
                onBlur={(e) => commitRecovery(e.target.value, sleep)}
                onKeyDown={(e) => e.key === "Enter" && commitRecovery(hydration, sleep)}
                style={{
                  width: "100%", padding: "7px 10px", background: "var(--surface2)",
                  border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 13,
                }}
                placeholder="0"
              />
              <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                {[8, 16, 32].map((oz) => (
                  <button
                    key={oz}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: 10, padding: "4px 0" }}
                    onClick={() => addHydration(oz)}
                  >
                    +{oz}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>
                SLEEP (hours)
              </label>
              <input
                type="number"
                value={sleep}
                min={0}
                max={12}
                step={0.5}
                onChange={(e) => setSleep(e.target.value)}
                onBlur={(e) => commitRecovery(hydration, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitRecovery(hydration, sleep)}
                style={{
                  width: "100%", padding: "7px 10px", background: "var(--surface2)",
                  border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 13,
                }}
                placeholder="0"
              />
              <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                {[6, 7.5, 9].map((h) => (
                  <button
                    key={h}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: 10, padding: "4px 0" }}
                    onClick={() => { setSleep(String(h)); commitRecovery(hydration, h); }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ENG */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)" }}>ENG</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Energy</span>
            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "var(--yellow)" }}>
              {pools.eng} / 999
            </span>
          </div>
          <Bar value={pools.eng} max={999} color="var(--yellow)" height={8} />
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>
            Auto-calculated from nutrition habits — log on the 🥚 Food tab
          </div>
        </div>
      </div>

      {/* ── Primary Pillars ─────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span className="card-title">Primary Pillars</span>
          <span style={{ fontSize: 10, color: "var(--text3)" }}>cap 255</span>
        </div>
        {Object.values(pillars).every((v) => v === 0) && (
          <div style={{ textAlign: "center", padding: "12px 0 8px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🌱</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Pillars grow with every quest and mastery unlock</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>Complete daily quests and boss tests to start building</div>
          </div>
        )}
        {APF_PILLARS.map((pillar) => {
          const val = pillars[pillar.key] || 0;
          const hasValue = val > 0;
          return (
            <div key={pillar.key} style={{ marginBottom: 10, opacity: hasValue ? 1 : 0.62 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{pillar.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: pillar.color, minWidth: 30 }}>{pillar.abbr}</span>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{pillar.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: hasValue ? pillar.color : "var(--text3)" }}>
                  {hasValue ? val.toFixed(1) : "—"}
                </span>
                {hasValue && <span style={{ fontSize: 10, color: "var(--text3)" }}>/ 255</span>}
              </div>
              <Bar value={val} max={255} color={pillar.color} height={5} />
            </div>
          );
        })}
      </div>

      {/* ── Dynamic Outputs ─────────────────────────────────────── */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>Dynamic Outputs</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12 }}>
          Computed from pillars + daily pools. Pool-dependent outputs reset each day.
        </div>
        {APF_OUTPUTS.map((output) => {
          const val = output.formula(pillars, { vig: pools.vig, eng: pools.eng });
          const isLow = val < 0.1;
          return (
            <div key={output.key} style={{ marginBottom: 12, opacity: isLow ? 0.62 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{output.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{output.label}</span>
                {output.poolDependent && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
                    background: "rgba(79,124,255,0.15)", color: "var(--blue)", border: "1px solid rgba(79,124,255,0.3)",
                  }}>DAILY</span>
                )}
                <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "var(--accent2)" }}>
                  {val.toFixed(1)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Bar value={val} max={100} color="var(--accent)" height={5} />
                <span style={{ fontSize: 10, color: "var(--text3)", whiteSpace: "nowrap" }}>/ 100</span>
              </div>
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {output.pillars.map((pk) => {
                  const p = pillarLookup[pk];
                  return p ? <PillarAbbr key={pk} abbr={p.abbr} color={p.color} /> : null;
                })}
                {output.poolDependent && (
                  <span style={{
                    fontSize: 9, padding: "1px 5px", borderRadius: 3,
                    background: "rgba(79,124,255,0.1)", color: "var(--blue)", border: "1px solid rgba(79,124,255,0.2)",
                  }}>
                    {output.poolKey === "vig" ? "VIG" : "ENG"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Training Journal ──────────────────────────────────── */}
      {(() => {
        const entries = (state.sessionLog || []).filter((s) => s.notes?.trim()).slice(0, 4);
        if (!entries.length) return null;
        return (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 10 }}>Training Journal</div>
            {entries.map((s, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 3 }}>{s.date}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.55, fontStyle: "italic" }}>
                  "{s.notes}"
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Session History ────────────────────────────────────── */}
      {(() => {
        const sessions = (state.sessionLog || []).slice(0, 14);
        if (sessions.length === 0) return (
          <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>No sessions logged yet</div>
            <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>
              Complete your daily quests and tap "Log Session" on the Daily page. Each session records your XP, movements, and recovery data here.
            </div>
          </div>
        );
        // Group by week label
        const getWeekLabel = (dateStr) => {
          const d = new Date(dateStr + "T12:00:00");
          const now = new Date();
          const diffDays = Math.floor((now - d) / 86400000);
          if (diffDays < 7) return "This week";
          if (diffDays < 14) return "Last week";
          return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " week";
        };
        const grouped = [];
        let currentGroup = null;
        sessions.forEach((s) => {
          const label = getWeekLabel(s.date);
          if (!currentGroup || currentGroup.label !== label) {
            currentGroup = { label, sessions: [] };
            grouped.push(currentGroup);
          }
          currentGroup.sessions.push(s);
        });
        return (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Session History</div>
            {grouped.map((g) => (
              <div key={g.label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6 }}>
                  {g.label}
                </div>
                {g.sessions.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", minWidth: 72 }}>
                      {new Date(s.date + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <div style={{ flex: 1, fontSize: 11, color: "var(--text2)" }}>
                      {s.autoCompleted ? "Auto-completed" : `${(s.movements || []).length} quest${(s.movements || []).length !== 1 ? "s" : ""}`}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)" }}>+{s.xpEarned} XP</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Recent Achievements ────────────────────────────────── */}
      {(() => {
        const MASTERY_LABELS_A = ["", "Aware", "Drilling", "Owning", "Flowing", "✦ Instinct"];
        const MASTERY_COLORS_A = ["", "var(--blue)", "#8b5cf6", "var(--orange)", "var(--green)", "var(--accent)"];
        // Build achievement list from movementProgress
        const mvAchievements = Object.entries(state.movementProgress || {})
          .flatMap(([id, p]) => {
            const events = [];
            if (p.masteredAt) events.push({ date: p.masteredAt, id, level: 5 });
            else if (p.masteryLevel >= 1 && p.unlockedAt) events.push({ date: p.unlockedAt, id, level: p.masteryLevel });
            return events;
          })
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 10);
        const bossAchievements = Object.entries(state.bossProgress || {})
          .filter(([, p]) => p.passed && p.passedAt)
          .map(([id, p]) => ({ date: p.passedAt, bossId: id }))
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5);
        const all = [...mvAchievements.map((a) => ({ ...a, type: "mastery" })), ...bossAchievements.map((a) => ({ ...a, type: "boss" }))]
          .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
        if (all.length === 0) return (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 8 }}>Recent Achievements</div>
            <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: "12px 0" }}>
              Complete quests and advance mastery to start your log.
            </div>
          </div>
        );
        return (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Recent Achievements</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {all.map((a, i) => {
                const dateStr = new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
                if (a.type === "mastery") {
                  const mv = MOVEMENTS.find((m) => m.id === a.id);
                  const tree = mv ? SKILL_TREES.find((t) => t.id === mv.tree) : null;
                  const color = MASTERY_COLORS_A[a.level] || "var(--accent)";
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        background: color + "22", color, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800,
                      }}>
                        {tree?.icon || "⚡"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{mv?.name || a.id}</span>
                        <span style={{ fontSize: 11, color, marginLeft: 6 }}>{MASTERY_LABELS_A[a.level]}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>{dateStr}</span>
                    </div>
                  );
                }
                // Boss
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: "rgba(201,82,82,0.18)", color: "var(--red)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>💀</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{a.bossId}</span>
                      <span style={{ fontSize: 11, color: "var(--green)", marginLeft: 6 }}>Boss defeated</span>
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>{dateStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Share Progress ──────────────────────────────────────── */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 8 }}>Share Progress</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12 }}>
          Generates a PNG card: level, streak, mastered movements, top trees.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 100, padding: "10px 12px", borderRadius: 8, background: "var(--surface2)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "var(--accent)" }}>Lv {state.player.level}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>LEVEL</div>
          </div>
          <div style={{ flex: 1, minWidth: 100, padding: "10px 12px", borderRadius: 8, background: "var(--surface2)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "var(--green)" }}>{totalMastered}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>MASTERED</div>
          </div>
          <div style={{ flex: 1, minWidth: 100, padding: "10px 12px", borderRadius: 8, background: "var(--surface2)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "var(--accent)" }}>🔥 {streak}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 2 }}>STREAK</div>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="btn btn-primary"
          style={{ width: "100%", padding: "11px 0", fontWeight: 800, fontSize: 13 }}
        >
          📤 Export Progress Card
        </button>
      </div>

      {/* ── Achievements ─────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="card-title">Achievements</div>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>
            {(state.earnedAchievements || []).length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {ACHIEVEMENTS.map((a) => {
            const earned = (state.earnedAchievements || []).includes(a.id);
            return (
              <div
                key={a.id}
                title={earned ? `${a.title} — ${a.desc}` : "???"}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "8px 4px", borderRadius: 8, textAlign: "center",
                  background: earned ? a.color + "18" : "var(--surface2)",
                  border: `1px solid ${earned ? a.color + "44" : "var(--border)"}`,
                  opacity: earned ? 1 : 0.35,
                  transition: "opacity 0.2s",
                  cursor: earned ? "default" : "not-allowed",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>{a.icon}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: earned ? a.color : "var(--text3)", lineHeight: 1.3 }}>
                  {earned ? a.title.split(" ").slice(0, 2).join(" ") : "???"}
                </div>
              </div>
            );
          })}
        </div>
        {(state.earnedAchievements || []).length === 0 && (
          <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 12 }}>
            Log your first session to earn your first badge
          </div>
        )}
      </div>
    </div>
  );
}
