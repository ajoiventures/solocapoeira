import { useState } from "react";
import { getOrishaById } from "../data/orishas.js";
import { getMovementById } from "../data/movements.js";
import { calculateIntegrationBonuses } from "../data/orishaStatSystem.js";

function MoveChip({ id, navigate, backLabel }) {
  const mv = getMovementById(id);
  if (!mv) return null;
  return (
    <button
      onClick={() => navigate("skill", id, { backTo: "orisha", backLabel })}
      style={{
        fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
        background: "var(--surface2)", border: "1px solid var(--border)",
        color: "var(--blue)", cursor: "pointer",
      }}
    >
      {mv.name} ›
    </button>
  );
}

function Section({ title, children, color }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: color || "var(--text3)",
        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Bullet({ text, color, marker = "•" }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
      <span style={{ color: color || "var(--text3)", flexShrink: 0, fontSize: 11 }}>{marker}</span>
      <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

export default function OrishaDetail({ orishaId, store, navigate, onBack, backContext }) {
  const orisha = getOrishaById(orishaId);
  const [auraFlash, setAuraFlash] = useState(false);
  if (!orisha) return null;

  const integrated  = store.isOrishaIntegrated(orishaId);
  const gating      = store.canIntegrateOrisha(orishaId);
  const backLabel   = backContext?.backLabel || "Orishas";
  const backTo      = backContext?.backTo    || "orishas";
  const handleBack  = onBack || (() => navigate(backTo));
  const color       = orisha.color || "var(--accent)";

  // Stat bonuses for THIS Orisha alone
  const bonuses = calculateIntegrationBonuses([orishaId], false);
  const statEntries = Object.entries(bonuses)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  // Training phases from executionFocus
  const phases = orisha.executionFocus?.trainingInstructions
    ? Object.entries(orisha.executionFocus.trainingInstructions).map(([, p]) => p)
    : [];

  return (
    <div className="page">
      {/* Integration aura flash */}
      {auraFlash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9000, pointerEvents: "none",
          background: `radial-gradient(ellipse at center, ${color}55 0%, ${color}22 40%, transparent 70%)`,
          animation: "auraFade 1.8s ease-out forwards",
        }} />
      )}

      {/* Back */}
      <button
        onClick={handleBack}
        style={{
          background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
          display: "flex", alignItems: "center", gap: 4, fontSize: 13,
          padding: "4px 0", marginBottom: 18,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        {backLabel}
      </button>

      {/* ── Identity ── */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 10, flexShrink: 0,
            background: color + "20", border: `1px solid ${color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
          }}>
            {orisha.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
              {orisha.name}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 4 }}>
              {orisha.subtitle}
            </div>
            {integrated && (
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✨ Integrated</div>
            )}
          </div>
        </div>

        {/* Domain */}
        <div style={{
          fontSize: 11, color: "var(--text3)", lineHeight: 1.5,
          borderLeft: `2px solid ${color}44`, paddingLeft: 8,
        }}>
          {orisha.spiritualDomain}
        </div>
      </div>

      {/* ── Spiritual Lesson ── */}
      {orisha.spiritualLesson && (
        <Section title="Spiritual Lesson" color={color}>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
            {orisha.spiritualLesson}
          </div>
        </Section>
      )}

      {/* ── Capoeira Dimension ── */}
      {orisha.capoeiraDimension && (
        <Section title="Capoeira Dimension" color={color}>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            {orisha.capoeiraDimension}
          </div>
        </Section>
      )}

      {/* ── Historical Context ── */}
      {orisha.historicalContext && (
        <Section title="Historical Context" color={color}>
          <div style={{
            fontSize: 12, color: "var(--text2)", lineHeight: 1.6,
            padding: "8px 10px", background: "var(--surface2)", borderRadius: 6,
          }}>
            {orisha.historicalContext}
          </div>
        </Section>
      )}

      {/* ── Execution Focus ── */}
      {orisha.executionFocus && (
        <Section title="How to Train Under This Orisha" color={color}>
          {orisha.executionFocus.philosophy && (
            <Bullet marker="›" text={orisha.executionFocus.philosophy} color={color} />
          )}
          {orisha.executionFocus.movementStyle && (
            <Bullet text={orisha.executionFocus.movementStyle} />
          )}
          {orisha.executionFocus.tacticalApproach && (
            <Bullet text={orisha.executionFocus.tacticalApproach} />
          )}
        </Section>
      )}

      {/* ── Training Phases ── */}
      {phases.length > 0 && (
        <>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--text3)",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>
            Training Phases
          </div>
          {phases.map((phase, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, padding: "12px 14px" }}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "var(--text2)",
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                  letterSpacing: 0.3,
                }}>
                  {phase.tempo || `Phase ${i + 1}`}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>
                  {phase.focus}
                </span>
              </div>

              {/* Cue */}
              {phase.cue && (
                <div style={{
                  fontSize: 11, color: "var(--text2)", lineHeight: 1.4, marginBottom: 8,
                  borderLeft: "2px solid var(--border)", paddingLeft: 8,
                }}>
                  {phase.cue}
                </div>
              )}

              {/* Instructions as bullets */}
              {(phase.instructions || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: phase.ogunTeaching ? 8 : 0 }}>
                  {phase.instructions.map((inst, j) => (
                    <div key={j} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: color, fontWeight: 700, fontSize: 10, flexShrink: 0, marginTop: 2 }}>
                        {j + 1}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.45 }}>
                        {inst.replace(/^Step\s*\d+[:.]\s*/i, "")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Orisha teaching quote */}
              {(phase.ogunTeaching || phase.teaching) && (
                <div style={{
                  fontSize: 11, color: "var(--text3)", fontStyle: "italic", lineHeight: 1.5,
                  borderTop: "1px solid var(--border)", paddingTop: 8,
                }}>
                  {phase.ogunTeaching || phase.teaching}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* ── Integration Requirements ── */}
      {(orisha.requirements || []).length > 0 && (
        <Section title="Requirements to Integrate" color={color}>
          {orisha.requirements.map((req, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              padding: "7px 10px", background: "var(--surface2)",
              borderRadius: 6, borderLeft: `2px solid ${color}44`,
              marginBottom: i < orisha.requirements.length - 1 ? 6 : 0,
            }}>
              <span style={{ color: "var(--text3)", flexShrink: 0 }}>□</span>
              <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4, flex: 1 }}>
                {req.label}
                {req.narrative && (
                  <span style={{ display: "block", fontSize: 11, color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>
                    {req.narrative}
                  </span>
                )}
              </span>
              {req.movementId && (
                <MoveChip id={req.movementId} navigate={navigate} backLabel={orisha.name} />
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Stat Bonuses ── */}
      {statEntries.length > 0 && (
        <Section title="Stat Bonuses on Integration" color={color}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {statEntries.map(([stat, val]) => (
              <div key={stat} style={{
                background: "var(--surface2)", borderRadius: 6, padding: "8px 10px",
              }}>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2, textTransform: "capitalize" }}>
                  {stat.replace(/_/g, " ")}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color }}>
                  +{Math.round(val * 100)}%
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Concept Affinities ── */}
      {orisha.conceptAffinities && (
        <Section title="Concept Affinities" color={color}>
          {Object.entries(orisha.conceptAffinities)
            .filter(([, v]) => v.level !== "none")
            .map(([tree, data]) => (
              <div key={tree} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "6px 0", borderBottom: "1px solid var(--border)",
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  background: data.level === "core" ? color + "20" : "var(--surface2)",
                  border: `1px solid ${data.level === "core" ? color + "44" : "var(--border)"}`,
                  color: data.level === "core" ? color : "var(--text3)",
                  flexShrink: 0, marginTop: 1, textTransform: "capitalize",
                }}>
                  {data.level}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>
                    {tree}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{data.description}</div>
                </div>
              </div>
            ))}
        </Section>
      )}

      {/* ── Sacred context ── */}
      {(orisha.sacred_number || orisha.sacred_day || orisha.symbols?.length) && (
        <Section title="Sacred Correspondences" color={color}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {orisha.sacred_number && (
              <span style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 6,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text2)",
              }}>
                #{orisha.sacred_number}
              </span>
            )}
            {orisha.sacred_day && (
              <span style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 6,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text2)",
              }}>
                {orisha.sacred_day}
              </span>
            )}
            {(orisha.symbols || []).map((s) => (
              <span key={s} style={{
                fontSize: 11, padding: "3px 8px", borderRadius: 6,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text3)",
              }}>
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* ── Gating lock or Integrate button ── */}
      {!integrated && (
        <div className="card" style={{ marginBottom: 12 }}>
          {!gating.canIntegrate ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Angola Gate Locked
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>
                {gating.reason.replaceAll("_", " ")}
              </div>
            </>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: "100%", fontWeight: 700 }}
              onClick={() => {
                store.integrateOrisha(orishaId, 250);
                setAuraFlash(true);
                setTimeout(() => setAuraFlash(false), 1800);
              }}
            >
              ✨ Integrate {orisha.name}
            </button>
          )}
        </div>
      )}

      {integrated && (
        <div className="card" style={{
          background: `${color}0c`, border: `1px solid ${color}33`,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
            Integrated
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            {orisha.integrationNarrative || `${orisha.name} flows through your Ogun core.`}
          </div>
        </div>
      )}
    </div>
  );
}
