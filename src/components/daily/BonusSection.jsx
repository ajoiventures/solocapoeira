import { useState } from "react";
import { getMovementById } from "../../data/movements.js";

export default function BonusSection({
  allExtras,
  dailyExtras,
  checkedBonusItems,
  store,
  navigate,
  allColors,
  allLabels,
  sandSession,
}) {
  const [open, setOpen] = useState(false);
  const [openCats, setOpenCats] = useState({});
  const [openSandSecs, setOpenSandSecs] = useState({});
  const extraDone = allExtras.filter((exercise) => checkedBonusItems.includes(exercise.id)).length;
  const extraXP = allExtras.reduce((sum, exercise) => sum + (exercise.xp || 0), 0);
  const sandTotalExs = sandSession?.sections?.reduce((sum, section) => (
    sum + (section.exercises?.filter(Boolean).length || 0)
  ), 0) || 0;
  // Use checkedBonusItems (persisted to store) instead of local state
  const sandDone = sandSession?.sections?.reduce((sum, section) =>
    sum + (section.exercises || []).filter((ex) => ex && checkedBonusItems.includes(ex.id)).length
  , 0) || 0;
  const sandXP = sandSession
    ? sandDone >= sandTotalExs && sandTotalExs > 0
      ? sandSession.totalXP
      : sandDone >= Math.ceil(sandTotalExs * 0.5)
      ? Math.round(sandSession.totalXP * 0.6)
      : 0
    : 0;
  const totalXP = extraXP + (sandSession?.totalXP || 0);
  const totalDone = extraDone + sandDone;
  const totalItems = allExtras.length + sandTotalExs;

  function toggleCat(cat) {
    setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function toggleSandSec(index) {
    setOpenSandSecs((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <button
        onClick={() => setOpen((value) => !value)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: open ? "8px 8px 0 0" : 8, padding: "9px 12px",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14 }}>⚡</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Bonus</span>
        {totalDone > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: "rgba(46,140,120,0.15)", color: "var(--green)" }}>
            {totalDone}/{totalItems}
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)", flexShrink: 0 }}>+{totalXP} XP</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ color: "var(--text3)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{ border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
          {["strength", "conditioning", "core", "sand"].map((cat) => {
            const items = dailyExtras[cat] || [];
            if (!items.length) return null;
            const catDone = items.filter((exercise) => checkedBonusItems.includes(exercise.id)).length;
            const catColor = allColors[cat];
            const catOpen = !!openCats[cat];

            return (
              <div key={cat}>
                <button
                  onClick={() => toggleCat(cat)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    background: "var(--surface2)", borderBottom: "1px solid var(--border)",
                    padding: "8px 12px", cursor: "pointer", textAlign: "left",
                    border: "none", borderTop: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: catColor, flex: 1 }}>{allLabels[cat]}</span>
                  <span style={{ fontSize: 10, color: catDone === items.length && catDone > 0 ? "var(--green)" : "var(--text3)", fontWeight: 700 }}>
                    {catDone}/{items.length}
                  </span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ color: "var(--text3)", flexShrink: 0, transform: catOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {catOpen && (
                  <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6, background: "var(--surface)" }}>
                    {items.map((exercise) => (
                      <BonusExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        checked={checkedBonusItems.includes(exercise.id)}
                        store={store}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {sandSession && sandSession.sections?.length > 0 && (
            <SandSessionPanel
              sandSession={sandSession}
              sandDone={sandDone}
              sandTotalExs={sandTotalExs}
              sandXP={sandXP}
              checkedBonusItems={checkedBonusItems}
              openCats={openCats}
              openSandSecs={openSandSecs}
              toggleCat={toggleCat}
              toggleSandSec={toggleSandSec}
              store={store}
            />
          )}
        </div>
      )}
    </div>
  );
}

function BonusExerciseRow({ exercise, checked, store, navigate }) {
  if (checked) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, background: "rgba(46,140,120,0.06)", border: "1px solid var(--green)" }}>
        <span style={{ fontSize: 14 }}>{exercise.icon}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--green)", textDecoration: "line-through", opacity: 0.75 }}>{exercise.label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)" }}>+{exercise.xp} XP</span>
        <button onClick={() => store.toggleBonusItem(exercise.id, exercise.xp)}
          style={{ fontSize: 10, padding: "6px 10px", borderRadius: 6, fontWeight: 700, border: "1px solid var(--green)", background: "rgba(46,140,120,0.15)", color: "var(--green)", cursor: "pointer", minHeight: 32, touchAction: "manipulation" }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>{exercise.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, cursor: "pointer", marginBottom: 2 }} onClick={() => navigate("exercise", exercise)}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{exercise.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)", flexShrink: 0 }}>+{exercise.xp} XP</span>
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>{exercise.muscles?.join(" · ")}</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{exercise.sets}</div>
          {exercise.relatedMovements?.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
              {exercise.relatedMovements.map((id) => {
                const movement = getMovementById(id);
                return movement ? (
                  <button key={id} onClick={(event) => { event.stopPropagation(); navigate("skill", id); }}
                    style={{ fontSize: 9, padding: "4px 8px", borderRadius: 6, background: "var(--surface3)", border: "1px solid var(--border)", color: "var(--blue)", cursor: "pointer", minHeight: 28, touchAction: "manipulation" }}>
                    {movement.name}
                  </button>
                ) : null;
              })}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>Why: {exercise.why}</span>
            <button onClick={() => store.toggleBonusItem(exercise.id, exercise.xp)}
              style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid var(--border)", background: "var(--surface3)", color: "var(--text3)", cursor: "pointer", minHeight: 36, touchAction: "manipulation" }}>Do it</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SandSessionPanel({
  sandSession,
  sandDone,
  sandTotalExs,
  sandXP,
  checkedBonusItems,
  openCats,
  openSandSecs,
  toggleCat,
  toggleSandSec,
  store,
}) {
  return (
    <div>
      <button
        onClick={() => toggleCat("_sand_session")}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          background: "var(--surface2)", padding: "8px 12px", cursor: "pointer", textAlign: "left",
          border: "none", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706" }}>Beach Session</span>
        <span style={{
          fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--text3)", marginLeft: 4, flexShrink: 0,
        }}>
          {sandSession.estimatedMinutes} min
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: sandDone > 0 ? "var(--yellow)" : "var(--text3)", fontWeight: 700 }}>
          {sandDone}/{sandTotalExs}
        </span>
        {sandXP > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)", marginLeft: 6 }}>+{sandXP} XP</span>
        )}
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ color: "var(--text3)", flexShrink: 0, transform: openCats["_sand_session"] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {openCats["_sand_session"] && (
        <div style={{ background: "var(--surface)" }}>
          {sandSession.sections.map((section, sectionIndex) => {
            const sectionExercises = (section.exercises || []).filter(Boolean);
            const sectionDone = sectionExercises.filter((exercise) => checkedBonusItems.includes(exercise.id)).length;
            const sectionOpen = !!openSandSecs[sectionIndex];
            return (
              <div key={sectionIndex}>
                <button
                  onClick={() => toggleSandSec(sectionIndex)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    background: "var(--surface2)", padding: "7px 16px", cursor: "pointer", textAlign: "left",
                    border: "none", borderTop: sectionIndex > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span style={{ fontSize: 12 }}>{section.icon}</span>
                  <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: "var(--text2)" }}>{section.label}</span>
                  <span style={{ fontSize: 9, color: "var(--text3)" }}>{section.duration}</span>
                  <span style={{ fontSize: 10, color: sectionDone === sectionExercises.length && sectionDone > 0 ? "var(--green)" : "var(--text3)", fontWeight: 700, marginLeft: 8 }}>
                    {sectionDone}/{sectionExercises.length}
                  </span>
                </button>
                {sectionOpen && (
                  <div style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {sectionExercises.map((exercise) => {
                      const done = checkedBonusItems.includes(exercise.id);
                      return (
                        <div key={exercise.id} style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                          borderRadius: 8, background: done ? "rgba(46,140,120,0.06)" : "var(--surface2)",
                          border: `1px solid ${done ? "var(--green)" : "var(--border)"}`,
                        }}>
                          <button onClick={() => store.toggleBonusItem(exercise.id, exercise.xp)}
                            style={{ fontSize: 13, background: "none", border: "none", cursor: "pointer", color: done ? "var(--green)" : "var(--text3)", padding: "6px 8px", minHeight: 36, touchAction: "manipulation" }}>
                            {done ? "Done" : "Open"}
                          </button>
                          <span style={{ flex: 1, fontSize: 11, color: done ? "var(--text3)" : "var(--text)", textDecoration: done ? "line-through" : "none", fontWeight: 600 }}>
                            {exercise.label}
                          </span>
                          <span style={{ fontSize: 9, color: "var(--yellow)", fontWeight: 700 }}>+{exercise.xp} XP</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
