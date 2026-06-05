import { useState } from "react";
import {
  NUTRITION_PILLARS,
  ANNUAL_NUTRITION_PLAN,
  WEEKLY_NUTRITION_HABITS,
  CALORIE_TARGETS,
  EGG_CUP_MATRIX,
} from "../data/nutritionPlan.js";

// ── Pillar Card ─────────────────────────────────────────────────
function PillarCard({ pillar, expanded, onToggle }) {
  const p = pillar;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${expanded ? p.color : "var(--border)"}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: expanded ? `${p.color}11` : "transparent",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: p.color + "22",
            border: `2px solid ${p.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {p.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: p.color, fontWeight: 800, marginBottom: 2 }}>
            PILLAR {p.number}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 1 }}>{p.subtitle}</div>
        </div>
        <span style={{ color: "var(--text3)", fontSize: 12, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>

          {/* One-liner */}
          <div
            style={{
              margin: "12px 0",
              padding: "10px 12px",
              background: p.color + "15",
              borderLeft: `3px solid ${p.color}`,
              borderRadius: "0 8px 8px 0",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1.5,
            }}
          >
            {p.oneLiner}
          </div>

          {/* Principle */}
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.7, marginBottom: 14 }}>
            {p.principle}
          </div>

          {/* Rules */}
          {p.rules && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                THE RULES
              </div>
              {p.rules.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>›</span>
                  <span style={{ color: "var(--text2)", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Meal framework (pillar 1) */}
          {p.mealFramework && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                YOUR DAILY MEAL FRAMEWORK
              </div>
              {Object.entries(p.mealFramework).map(([key, val]) => {
                const labelMap = {
                  meal1_preworkout: "Pre-Workout",
                  meal2_postworkout: "Post-Workout",
                  meal3_midday: "Midday",
                  meal4_evening: "Evening",
                  snack_beforebed: "Before Bed",
                };
                return (
                  <div key={key} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: p.color,
                        flexShrink: 0,
                        width: 72,
                        paddingTop: 1,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {labelMap[key] || key}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>{val}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Your diet application */}
          {p.yourDietApplication && (
            <div
              style={{
                padding: "10px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--green)",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              🥚 <strong>Your diet:</strong> {p.yourDietApplication}
            </div>
          )}

          {/* Protein targets (pillar 2) */}
          {p.targets && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                YOUR PROTEIN TARGETS
              </div>
              {Object.entries(p.targets).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, color: "var(--text3)", flexShrink: 0, width: 100, paddingTop: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                    {k.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Your foods ranked (pillar 2) */}
          {p.yourFoodsRanked && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                YOUR FOODS RANKED
              </div>
              {p.yourFoodsRanked.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 10px",
                    background: i % 2 === 0 ? "var(--surface2)" : "transparent",
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: p.color + "33",
                        color: p.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{f.food}</span>
                    <span style={{ fontSize: 10, color: p.color, marginLeft: "auto" }}>
                      {f.perUnit || f.perServing}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3, paddingLeft: 26 }}>{f.notes}</div>
                </div>
              ))}
            </div>
          )}

          {/* Carb sources (pillar 3) */}
          {p.carbSources && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                YOUR CARB SOURCES
              </div>
              {p.carbSources.map((c, i) => (
                <div key={i} style={{ padding: "8px 10px", background: "var(--surface2)", borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{c.food}</span>
                    <span style={{ fontSize: 10, color: p.color, fontWeight: 600, flexShrink: 0 }}>{c.per100g || c.per100ml}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--green)", marginTop: 3 }}>⏰ {c.timing}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{c.cost}</div>
                </div>
              ))}
            </div>
          )}

          {/* Training day vs rest (pillar 3) */}
          {p.trainingDayVsRest && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                TRAINING VS REST
              </div>
              {Object.entries(p.trainingDayVsRest).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: k === "trainingDay" ? "var(--green)" : k === "hardDay" ? "var(--yellow)" : "var(--text3)",
                      flexShrink: 0,
                      width: 70,
                      paddingTop: 1,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Micronutrients (pillar 4) */}
          {p.micronutrients && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                KEY MICRONUTRIENTS
              </div>
              {p.micronutrients.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    background: "var(--surface2)",
                    borderRadius: 8,
                    marginBottom: 8,
                    borderLeft: `3px solid ${p.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{m.nutrient}</span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 7px",
                        borderRadius: 10,
                        background: "var(--surface2)",
                        color: m.status === "adequate" ? "var(--green)" : m.status === "critical_gap" ? "var(--red)" : "var(--orange)",
                        fontWeight: 700,
                        flexShrink: 0,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {m.status?.replace("_", " ")}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, lineHeight: 1.5 }}>{m.why}</div>
                  <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>✓ {m.fix}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recovery protocols (pillar 5) */}
          {p.postWorkoutProtocol && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                POST-WORKOUT PROTOCOL
              </div>
              {Object.entries(p.postWorkoutProtocol).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, color: "var(--text3)", flexShrink: 0, width: 80, paddingTop: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                    {k.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {p.preSleepProtocol && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                PRE-SLEEP PROTOCOL
              </div>
              {Object.entries(p.preSleepProtocol).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, color: "var(--text3)", flexShrink: 0, width: 80, paddingTop: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                    {k.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Budget optimization (pillar 6) */}
          {p.weeklyGroceryMinimums && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                WEEKLY GROCERY MINIMUMS
              </div>
              {Object.entries(p.weeklyGroceryMinimums).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, width: 90, color: "var(--text)" }}>
                    {k.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {p.eggCupOptimization && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                EGG CUP FORMULA UPGRADES
              </div>
              {Object.entries(p.eggCupOptimization).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, color: p.color, flexShrink: 0, width: 80, paddingTop: 1, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
                    {k.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Source */}
          <div style={{ fontSize: 9, color: "var(--text3)", fontStyle: "italic", marginTop: 8 }}>
            📚 {p.sourceBook}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pillars Tab ─────────────────────────────────────────────────
function PillarsTab() {
  const [expanded, setExpanded] = useState(1);
  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Macro targets strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        {[
          { value: CALORIE_TARGETS.trainingDay.totalKcal, label: "Train kcal",  color: "var(--green)",  bg: "var(--chip-competent-bg)" },
          { value: CALORIE_TARGETS.restDay.totalKcal,     label: "Rest kcal",   color: "var(--text2)", bg: "var(--surface2)" },
          { value: `${CALORIE_TARGETS.trainingDay.protein_g}g`, label: "Protein", color: "var(--blue)",   bg: "var(--chip-aware-bg)" },
          { value: `${CALORIE_TARGETS.trainingDay.carbs_g}g`,   label: "Carbs",   color: "var(--orange)", bg: "var(--chip-practicing-bg)" },
        ].map(({ value, label, color, bg }) => (
          <div key={label} style={{ padding: "10px 12px", background: bg, border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {NUTRITION_PILLARS.map((p) => (
        <PillarCard
          key={p.id}
          pillar={p}
          expanded={expanded === p.number}
          onToggle={() => setExpanded(expanded === p.number ? null : p.number)}
        />
      ))}
    </div>
  );
}

// ── Annual Plan Tab ─────────────────────────────────────────────
// Helper: parse "1–12" or "13–24" week strings into [start, end]
function parseWeeks(weeksStr) {
  const parts = (weeksStr || "").split(/[-–—]/);
  return [parseInt(parts[0]) || 1, parseInt(parts[1]) || 12];
}

// Helper: render a sample day (array of strings or object)
function SampleDayList({ label, items, color }) {
  if (!items) return null;
  const entries = Array.isArray(items) ? items : Object.values(items);
  return (
    <div className="card" style={{ borderColor: color + "44" }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: color, fontWeight: 700, marginBottom: 10 }}>
        {label}
      </div>
      {entries.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: color, fontWeight: 700, flexShrink: 0 }}>›</span>
          <span style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

function AnnualPlanTab({ store }) {
  const currentWeek = store.state.player.currentWeek || 1;
  const [view, setView] = useState(null); // null = overview, sprintId = drill-down

  const sprints = ANNUAL_NUTRITION_PLAN.sprints;

  if (!view) {
    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Overview heading */}
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>
            YEAR 1 NUTRITION
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{ANNUAL_NUTRITION_PLAN.title}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{ANNUAL_NUTRITION_PLAN.subtitle}</div>
        </div>

        {sprints.map((sprint, idx) => {
          const [wStart, wEnd] = parseWeeks(sprint.weeks);
          const isActive = currentWeek >= wStart && currentWeek <= wEnd;
          const isDone = currentWeek > wEnd;
          const num = idx + 1;
          return (
            <div
              key={sprint.sprintId}
              className="card"
              style={{
                borderColor: isActive ? sprint.color : isDone ? sprint.color + "66" : "var(--border)",
                cursor: "pointer",
              }}
              onClick={() => setView(sprint.sprintId)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: 8,
                    background: sprint.color + "22", border: `2px solid ${sprint.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 900, color: sprint.color, flexShrink: 0,
                  }}
                >
                  {isDone ? "✓" : isActive ? "▶" : num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800 }}>
                      S{num} — {sprint.nutritionPhase}
                    </span>
                    {isActive && (
                      <span style={{ fontSize: 9, color: sprint.color, fontWeight: 800, letterSpacing: 1 }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>
                    Weeks {sprint.weeks} · {sprint.phase}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6, lineHeight: 1.5 }}>
                    {sprint.primaryGoal}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--chip-competent-bg)", color: "var(--green)", borderRadius: 20, fontWeight: 600 }}>
                      {sprint.calorieTarget}
                    </span>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--chip-aware-bg)", color: "var(--blue)", borderRadius: 20, fontWeight: 600 }}>
                      {sprint.proteinTarget}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 18, color: "var(--text3)", flexShrink: 0 }}>›</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const sprintIdx = sprints.findIndex((s) => s.sprintId === view);
  const sprint = sprints[sprintIdx];
  if (!sprint) return null;
  const num = sprintIdx + 1;

  return (
    <div>
      <div
        onClick={() => setView(null)}
        style={{ padding: "12px 16px 0", fontSize: 11, color: "var(--text3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
      >
        ← Back to Plan
      </div>

      <div style={{ padding: "10px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 8,
              background: sprint.color + "22", border: `2px solid ${sprint.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: sprint.color,
            }}
          >
            {num}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>S{num} — {sprint.nutritionPhase}</div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>
              Weeks {sprint.weeks} · {sprint.phase}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 10, fontStyle: "italic", lineHeight: 1.6 }}>
          {sprint.primaryGoal}
        </div>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Macro targets */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Calories", val: sprint.calorieTarget, color: "#2E8C78" },
            { label: "Protein", val: sprint.proteinTarget, color: "#4F7CFF" },
            { label: "Carbs", val: sprint.carbTarget, color: "#D9A441" },
          ].filter(t => t.val).map((t) => (
            <div key={t.label} style={{ flex: 1, padding: "8px 6px", background: "var(--surface)", border: `1px solid ${t.color}44`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: t.color, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: "var(--text2)", lineHeight: 1.4 }}>{t.val}</div>
            </div>
          ))}
        </div>

        {/* Key focuses */}
        {sprint.keyFocuses && (
          <div className="card">
            <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--text3)", fontWeight: 700, marginBottom: 10 }}>
              KEY FOCUSES
            </div>
            {sprint.keyFocuses.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 7 }}>
                <span style={{ color: sprint.color, fontWeight: 700, flexShrink: 0 }}>›</span>
                <span style={{ color: "var(--text2)", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* All sample day arrays found on this sprint */}
        {Object.entries(sprint)
          .filter(([k, v]) => (k.startsWith("sampleDay") || k.startsWith("sampleDay")) && Array.isArray(v))
          .map(([k, v]) => (
            <SampleDayList
              key={k}
              label={k.replace("sampleDay", "Sample ").replace(/([A-Z])/g, " $1").trim().toUpperCase()}
              items={v}
              color={sprint.color}
            />
          ))}

        {/* Taper detail (Sprint 4 specific) */}
        {sprint.taperNutritionDetail && (
          <div className="card" style={{ borderColor: sprint.color + "44" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: sprint.color, fontWeight: 700, marginBottom: 10 }}>
              TAPER PROTOCOL
            </div>
            {Object.entries(sprint.taperNutritionDetail).map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: sprint.color, flexShrink: 0, width: 90, paddingTop: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                  {k.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Nutrition checkpoints */}
        {sprint.nutritionBossTests && (
          <div className="card" style={{ borderColor: "rgba(201,82,82,0.35)" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--red)", fontWeight: 700, marginBottom: 10 }}>
              💀 NUTRITION CHECKPOINTS
            </div>
            {sprint.nutritionBossTests.map((b, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Week {b.week}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, lineHeight: 1.5 }}>{b.test}</div>
                {b.pass && (
                  <div style={{ fontSize: 10, color: "var(--green)", marginTop: 4 }}>✓ Pass: {b.pass}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Habits Tab ──────────────────────────────────────────────────
function HabitsTab({ store }) {
  const today = new Date().toISOString().split("T")[0];
  const quest = store.state.todayQuest;
  const isToday = quest.date === today;

  const pillarColors = {
    1: "#2E8C78",  // green
    2: "#4F7CFF",  // blue
    3: "#D9A441",  // amber
    4: "#9B6DD4",  // purple
    5: "#C95252",  // red
    6: "#4BB5C8",  // cyan
  };

  const pillarNames = {
    1: "Energy Timing",
    2: "Protein Architecture",
    3: "Carb Periodization",
    4: "Micronutrient Armor",
    5: "Recovery Stack",
    6: "Budget Optimization",
  };

  const checked = isToday ? (quest.bonusItems || []) : [];
  const totalXP = WEEKLY_NUTRITION_HABITS.reduce((sum, h) => sum + (checked.includes(h.id) ? h.xp : 0), 0);
  const maxXP = WEEKLY_NUTRITION_HABITS.reduce((sum, h) => sum + h.xp, 0);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

      {/* XP progress */}
      <div className="card" style={{ borderColor: "var(--accent)" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>
          TODAY'S NUTRITION XP
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>{totalXP} XP</span>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>/ {maxXP} max</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${maxXP > 0 ? (totalXP / maxXP) * 100 : 0}%`, background: "var(--accent)" }}
          />
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>
          Check habits you completed today — XP is added to your total
        </div>
      </div>

      {/* Habit list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_NUTRITION_HABITS.map((habit) => {
          const isDone = checked.includes(habit.id);
          const color = pillarColors[habit.pillar] || "var(--accent)";
          return (
            <div
              key={habit.id}
              onClick={() => store.toggleBonusItem(habit.id, habit.xp)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: isDone ? color + "18" : "var(--surface)",
                border: `1px solid ${isDone ? color : "var(--border)"}`,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${isDone ? color : "var(--border)"}`,
                  background: isDone ? color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isDone && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? "var(--text)" : "var(--text2)" }}>
                  {habit.label}
                </div>
                <div style={{ fontSize: 10, color: color, marginTop: 2 }}>
                  Pillar {habit.pillar} — {pillarNames[habit.pillar]}
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: isDone ? color : "var(--text3)",
                  flexShrink: 0,
                }}
              >
                +{habit.xp} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Egg Cup Tab ─────────────────────────────────────────────────
function EggCupTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div className="card" style={{ borderColor: "var(--yellow)" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--yellow)", fontWeight: 700, marginBottom: 6 }}>
          THE EGG CUP FORMULA
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
          {EGG_CUP_MATRIX.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>
          {EGG_CUP_MATRIX.description || EGG_CUP_MATRIX.baseRecipe}
        </div>
      </div>

      {/* 7-day matrix */}
      {EGG_CUP_MATRIX.weekdayVariations.map((dayStr, i) => {
        const [descPart, notePart] = dayStr.split(" — ");
        const colonIdx = descPart.indexOf(": ");
        const dayLabel = colonIdx > -1 ? descPart.slice(0, colonIdx) : days[i];
        const ingredients = colonIdx > -1 ? descPart.slice(colonIdx + 2) : descPart;
        const isToday = i === todayIdx;
        return (
          <div
            key={i}
            className="card"
            style={{ borderColor: isToday ? "var(--yellow)" : "var(--border)", background: isToday ? "var(--surface2)" : "var(--card-bg)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: isToday ? "var(--yellow)" : "var(--surface3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: isToday ? "#000" : "var(--text3)",
                  flexShrink: 0,
                }}
              >
                {dayLabel}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{days[i]}</div>
                <div style={{ fontSize: 10, color: isToday ? "var(--yellow)" : "var(--text3)" }}>
                  {isToday ? "TODAY" : `Day ${i + 1}`}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
                {ingredients}
              </div>
              {notePart && (
                <div style={{ marginTop: 4, padding: "6px 8px", background: "#D9A44118", borderRadius: 6, fontSize: 10, color: "var(--yellow)", lineHeight: 1.5 }}>
                  📚 {notePart}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────
const TABS = [
  { id: "pillars", label: "6 Pillars" },
  { id: "plan", label: "Annual Plan" },
  { id: "habits", label: "Habits" },
  { id: "eggcup", label: "Egg Cup" },
];

export default function Nutrition({ store }) {
  const [tab, setTab] = useState("pillars");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Page header */}
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--text3)", fontWeight: 700 }}>NUTRITION</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>Shadow Hunter Protocol</div>
      </div>

      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "10px 16px",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0,
              padding: "5px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: tab === t.id ? "var(--accent)" : "var(--border)",
              background: tab === t.id ? "var(--accent)" : "var(--surface)",
              color: tab === t.id ? "#fff" : "var(--text3)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "pillars" && <PillarsTab />}
        {tab === "plan"    && <AnnualPlanTab store={store} />}
        {tab === "habits"  && <HabitsTab store={store} />}
        {tab === "eggcup"  && <EggCupTab />}
      </div>
    </div>
  );
}
