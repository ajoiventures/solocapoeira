import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react";
import { haptics } from "../utils/haptics.js";
import { BOSS_TESTS } from "../data/bossTests.js";
import { SKILL_TREES } from "../data/trees.js";
import { getMovementById } from "../data/movements.js";
import { getMestreById, getMestresByProgression } from "../data/mestres.js";
import { getMestreSequences } from "../data/mestreSequences.js";
import { getAllCoreOrishas } from "../data/orishas.js";
import { getPrestigeTrialsByTier } from "../data/prestigeTrials.js";
import { buildRequirementPracticePlan } from "../data/requirementPracticePlans.js";
import MestreLineageVisualization from "../components/MestreLineageVisualization.jsx";
import EhiAscensionRitual from "../components/EhiAscensionRitual.jsx";

// ═══════════════════════════════════════════════════════════════════════════════════
// ORIGINAL BOSS CARD (for legacy BossTests)
// ═══════════════════════════════════════════════════════════════════════════════════
function getRequirementChecks(store, ownerKey) {
  return new Set(store.state.requirementChecks?.[ownerKey] || []);
}

const BossCard = memo(function BossCard({ boss, passed, store, navigate }) {
  const ownerKey = `archived_boss:${boss.id}`;
  const checkedReqs = getRequirementChecks(store, ownerKey);
  const tree = SKILL_TREES.find((t) => t.id === boss.tree);
  const attempts = store.state.bossProgress[boss.id]?.attempts || 0;
  const allReqsDone = checkedReqs.size >= boss.requirements.length;
  const practiceOwner = {
    ownerType: "archived_boss",
    ownerId: boss.id,
    ownerName: boss.name,
    ownerStyle: tree?.name || boss.tree,
    ownerTier: "archive",
    ownerHistory: boss.subtitle,
    ownerPhilosophy: boss.reward,
    ownerSkills: boss.requirements?.map((req) => req.movementId || req.label).filter(Boolean),
  };

  // Readiness: movement mastery + concept tree gates; pain/metric reqs counted as "checkable"
  const readiness = (() => {
    if (!boss.requirements?.length) return 100;
    const met = boss.requirements.filter((r) => {
      if (r.movementId) {
        return (store.getMasteryLevel(r.movementId) || 0) >= 2;
      }
      if (r.metric === "malicia_level" || r.metric === "mandinga_level" || r.metric === "malandragem_level") {
        const treeKey = r.metric.replace("_level", "");
        return (store.state.conceptTreeProgress[treeKey] || 0) >= (r.target || 1);
      }
      // Pain requirements: check today's pain log
      if (r.metric && r.metric.includes("pain") && r.lte) {
        const todayPain = store.getTodayPain?.();
        const bodyPart = r.metric.replace("_pain", "");
        const score = todayPain?.[bodyPart] ?? 10;
        return score <= r.target;
      }
      // Metric-tracked goals without a value in store are unknown — count as unmet (honest)
      if (r.metric) return false;
      // Pure label-only requirements (no metric, no movementId) count as self-reported
      return false;
    }).length;
    return Math.round((met / boss.requirements.length) * 100);
  })();

  const toggleReq = (i) => {
    store.toggleRequirementCheck?.(ownerKey, i);
  };

  return (
    <div className={`boss-card${passed ? " passed" : ""}`}>
      {boss.xp && !boss.isTemplate && (
        <div className="boss-xp">+{boss.xp} XP</div>
      )}

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 24 }}>
          {passed ? "✅" : "💀"}
        </span>
        <div>
          <div className="boss-card-title">{boss.name}</div>
          <div className="boss-card-sub">{boss.subtitle}</div>
        </div>
      </div>

      {/* Tree tag + readiness */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        {tree && (
          <span style={{ fontSize: 10, color: tree.color, fontWeight: 700 }}>
            {tree.icon} {tree.name} Tree
          </span>
        )}
        {!passed && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--surface2)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2, transition: "width 0.4s",
                width: `${readiness}%`,
                background: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--red)",
              }} />
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, flexShrink: 0,
              color: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--text3)",
            }}>
              {readiness}%
            </span>
          </div>
        )}
      </div>

      {/* Requirements — with per-row checkboxes + movement chips */}
      <div className="boss-requirements" style={{ marginTop: 10 }}>
        {boss.requirements.map((req, i) => {
          const reqDone = checkedReqs.has(String(i));
          const mv = req.movementId ? getMovementById(req.movementId) : null;
          const plan = !mv ? buildRequirementPracticePlan(practiceOwner, req, i) : null;

          // Check concept tree requirement
          let conceptStatus = null;
          if (req.metric === "malicia_level" || req.metric === "mandinga_level" || req.metric === "malandragem_level") {
            const tree = req.metric.replace("_level", "");
            const currentLevel = store.state.conceptTreeProgress[tree] || 0;
            const isMetRequired = currentLevel >= req.target;
            conceptStatus = {
              tree: tree.charAt(0).toUpperCase() + tree.slice(1),
              current: currentLevel,
              required: req.target,
              isMet: isMetRequired,
            };
          }

          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 0",
                borderBottom: i < boss.requirements.length - 1 ? "1px solid var(--border)" : "none",
                opacity: reqDone ? 0.5 : 1,
              }}
            >
              {/* Checkbox toggle */}
              <button
                aria-label={`${reqDone ? "Undo" : "Complete"} requirement ${i + 1} for ${boss.name}`}
                data-testid={`requirement-${ownerKey}-${i}`}
                onClick={() => toggleReq(i)}
                style={{
                  fontSize: 15, background: "none", border: "none", cursor: "pointer",
                  flexShrink: 0, color: reqDone ? "var(--green)" : "var(--border)",
                  padding: 0, lineHeight: 1,
                }}
              >
                {reqDone ? "✓" : "○"}
              </button>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: 12, color: "var(--text2)",
                textDecoration: reqDone ? "line-through" : "none",
              }}>
                {req.label}
              </span>

              {/* Movement chip */}
              {mv && (
                <button
                  onClick={() => navigate?.("skill", req.movementId, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 6,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--blue)", cursor: "pointer", flexShrink: 0, fontWeight: 600,
                  }}
                >
                  {mv.name} ›
                </button>
              )}
              {plan && (
                <button
                  onClick={() => navigate?.("practicePlan", plan, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 6,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--accent)", cursor: "pointer", flexShrink: 0, fontWeight: 700,
                  }}
                >
                  Plan
                </button>
              )}

              {/* Concept tree gate badge */}
              {conceptStatus && (
                <div style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 20, flexShrink: 0, fontWeight: 700,
                  background: conceptStatus.isMet ? "rgba(46,140,120,0.2)" : "rgba(201,82,82,0.2)",
                  color: conceptStatus.isMet ? "var(--green)" : "var(--red)",
                  border: `1px solid ${conceptStatus.isMet ? "var(--green)" : "var(--red)"}22`,
                }}>
                  {conceptStatus.tree} {conceptStatus.current}/{conceptStatus.required}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reward */}
      {boss.reward && (
        <div className="boss-reward">🏆 {boss.reward}</div>
      )}

      {/* Attempt counter */}
      {attempts > 0 && !passed && (
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
          {attempts} attempt{attempts > 1 ? "s" : ""}
        </div>
      )}
      {passed && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "var(--green)", marginBottom: boss.reward ? 6 : 0 }}>
            ✓ Passed — {new Date(store.state.bossProgress[boss.id]?.passedAt).toLocaleDateString()}
          </div>
          {boss.reward && (
            <div style={{
              fontSize: 11, color: "var(--accent)", fontWeight: 600,
              background: "rgba(217,164,65,0.1)", border: "1px solid rgba(217,164,65,0.25)",
              borderRadius: 6, padding: "6px 10px",
            }}>
              🏆 {boss.reward}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!boss.isTemplate && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {!passed && (
            <>
              <button
                className="btn btn-success btn-sm"
                style={{ opacity: allReqsDone ? 1 : 0.45, fontWeight: allReqsDone ? 800 : 600 }}
                onClick={() => store.passBoss(boss.id, boss.xp || 0)}
              >
                ✓ Mark Passed
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => store.recordBossAttempt(boss.id)}
              >
                ✗ Attempt Failed
              </button>
            </>
          )}
          {passed && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => store.unpassBoss(boss.id)}
              >
                ↺ Re-test
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
                onClick={() => store.unmarkBoss(boss.id)}
              >
                ✕ Unmark
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (don't re-render), false to re-render
  return (
    prevProps.boss?.id === nextProps.boss?.id &&
    prevProps.passed === nextProps.passed &&
    prevProps.store === nextProps.store &&
    prevProps.navigate === nextProps.navigate
  );
});

// ═══════════════════════════════════════════════════════════════════════════════════
// MESTRE CARD
// ═══════════════════════════════════════════════════════════════════════════════════
function MestreCard({ mestre, store, navigate, onDefeat }) {
  const ownerKey = `mestre:${mestre.id}`;
  const checkedReqs = getRequirementChecks(store, ownerKey);
  const defeated = store.isMestreDefeated(mestre.id);
  const tierLabels = ["Apprentice", "Student", "Practitioner"];
  const tier = store.state.mestreProgress[mestre.id]?.progressionTier || 0;
  const allReqsDone = checkedReqs.size >= mestre.requirements.length;
  const practiceOwner = {
    ownerType: "mestre",
    ownerId: mestre.id,
    ownerName: mestre.name,
    ownerStyle: mestre.style,
    ownerTier: mestre.tier,
    ownerHistory: mestre.historical_context || mestre.historical_role,
    ownerPhilosophy: mestre.philosophy,
    ownerSkills: mestre.signature_techniques?.map((technique) => technique.id || technique.name).filter(Boolean),
    ownerQualities: mestre.style_characteristics,
  };

  const toggleReq = (i) => {
    store.toggleRequirementCheck?.(ownerKey, i);
  };

  // Check concept tree gates
  const conceptTreeRequirements = mestre.requirements?.filter((r) => r.type === "concept_tree") || [];
  const conceptTreeGatesMet = conceptTreeRequirements.every((req) => {
    const treeId = req.treeId;
    const requiredLevel = req.targetLevel || 1;
    const currentLevel = store.state.conceptTreeProgress[treeId] || 0;
    return currentLevel >= requiredLevel;
  });

  const unmetConceptTree = conceptTreeRequirements.find((req) => {
    const treeId = req.treeId;
    const requiredLevel = req.targetLevel || 1;
    const currentLevel = store.state.conceptTreeProgress[treeId] || 0;
    return currentLevel < requiredLevel;
  });

  const readiness = (() => {
    if (!mestre.requirements?.length) return 100;
    const met = mestre.requirements.filter((r) =>
      !r.movementId || (store.getMasteryLevel(r.movementId) || 0) >= 2
    ).length;
    return Math.round((met / mestre.requirements.length) * 100);
  })();

  // If concept tree gates not met, show locked state
  if (!defeated && !conceptTreeGatesMet) {
    const treeNames = { malicia: "Malícia", malandragem: "Malandragem", mandinga: "Mandinga" };
    const lockMsg = unmetConceptTree ? `${treeNames[unmetConceptTree.treeId]} Lvl ${unmetConceptTree.targetLevel || 1}` : "Locked";
    const lockPlan = unmetConceptTree ? buildRequirementPracticePlan(practiceOwner, unmetConceptTree, 0) : null;

    return (
      <div className="card" style={{ marginBottom: 12, opacity: 0.6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text3)" }}>{mestre.name}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
              {mestre.style} · {mestre.years_lived}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 11, color: "var(--text3)", padding: "8px 10px",
          background: "var(--surface2)", borderRadius: 6, textAlign: "center",
        }}>
          🌳 Unlock {lockMsg}
        </div>
        {lockPlan && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", marginTop: 8, fontSize: 11 }}
            onClick={() => navigate?.("practicePlan", lockPlan, { backTo: "roda", backLabel: "Boss Roda" })}
          >
            Open Practice Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* Header - clickable */}
      <button
        onClick={() => navigate("mestre", mestre.id)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: 0,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 28 }}>{defeated ? "🎖" : "⚔"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{mestre.name}</div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
            {mestre.style} · {mestre.years_lived}
          </div>
        </div>
        {defeated && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>
            {tierLabels[Math.min(tier, 2)]}
          </div>
        )}
      </button>

      {/* Subtitle */}
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8, fontStyle: "italic" }}>
        {mestre.subtitle}
      </div>

      {/* Readiness bar */}
      {!defeated && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--surface2)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2, transition: "width 0.4s",
              width: `${readiness}%`,
              background: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--red)",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800, flexShrink: 0,
            color: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--text3)",
          }}>
            {readiness}%
          </span>
        </div>
      )}

      {/* Requirements */}
      <div style={{ marginBottom: 12 }}>
        {mestre.requirements.map((req, i) => {
          const reqDone = checkedReqs.has(String(i));
          const mv = req.movementId ? getMovementById(req.movementId) : null;
          const plan = !mv ? buildRequirementPracticePlan(practiceOwner, req, i) : null;
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 0",
                borderBottom: i < mestre.requirements.length - 1 ? "1px solid var(--border)" : "none",
                opacity: reqDone ? 0.5 : 1,
              }}
            >
              <button
                aria-label={`${reqDone ? "Undo" : "Complete"} requirement ${i + 1} for ${mestre.name}`}
                data-testid={`requirement-${ownerKey}-${i}`}
                onClick={() => toggleReq(i)}
                style={{
                  fontSize: 12, background: "none", border: "none", cursor: "pointer",
                  flexShrink: 0, color: reqDone ? "var(--green)" : "var(--border)",
                  padding: 0, lineHeight: 1,
                }}
              >
                {reqDone ? "✓" : "○"}
              </button>
              <span style={{
                flex: 1, fontSize: 11, color: "var(--text2)",
                textDecoration: reqDone ? "line-through" : "none",
              }}>
                {req.label}
              </span>
              {mv && (
                <button
                  onClick={() => navigate?.("skill", req.movementId, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 16,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--blue)", cursor: "pointer", flexShrink: 0, fontWeight: 600,
                  }}
                >
                  {mv.name} ›
                </button>
              )}
              {plan && (
                <button
                  onClick={() => navigate?.("practicePlan", plan, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 16,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--accent)", cursor: "pointer", flexShrink: 0, fontWeight: 700,
                  }}
                >
                  Plan
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action button */}
      <div style={{ display: "flex", gap: 8 }}>
        {!defeated && (
          <>
            <button
              className="btn btn-success btn-sm"
              style={{ opacity: allReqsDone ? 1 : 0.45, fontWeight: 700 }}
              disabled={!allReqsDone}
              onClick={() => {
                if (readiness < 80) {
                  alert(`⚠️ Boss Readiness Gate: You are only ${readiness}% ready. Recommend 80%+ before attempting this Mestre.`);
                  return;
                }
                onDefeat?.(mestre.id, 500);
              }}
            >
              ⚔ Defeat
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: 11 }}
              disabled
            >
              {allReqsDone && readiness >= 80 ? "✓ Ready" : `Requires ${100 - readiness}% more prep`}
            </button>
          </>
        )}
        {defeated && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: 11, color: "var(--green)" }}
          >
            ✓ Mastered {new Date(store.state.mestreProgress[mestre.id]?.defeatedAt).toLocaleDateString()}
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// ORISHA CARD
// ═══════════════════════════════════════════════════════════════════════════════════
const ORISHA_DISPLAY_COLORS = {
  orisha_ogun: "#8B0000", orisha_obatala: "#C0C0C0", orisha_ifa: "#FFD700",
  orisha_yemaya: "#1E90FF", orisha_shango: "#DC143C", orisha_oshun: "#FFB347",
  orisha_oya: "#9400D3", orisha_elegba: "#FF4500", orisha_babaluaye: "#8B7355",
  orisha_ibeji: "#00CED1", orisha_aje: "#2E8B57", orisha_oshosi: "#556B2F",
  orisha_nana_buruku: "#800080", orisha_erinle: "#20B2AA", orisha_oba: "#B8860B",
  orisha_shun: "#DAA520",
};

function OrishaCard({ orisha, store, navigate }) {
  const ownerKey = `orisha:${orisha.id}`;
  const checkedReqs = getRequirementChecks(store, ownerKey);
  const [justIntegrated, setJustIntegrated] = useState(false);
  const integrated = store.isOrishaIntegrated(orisha.id);
  const gatingStatus = store.canIntegrateOrisha(orisha.id);
  const orishaColor = orisha.color || orisha.colors?.[0] || ORISHA_DISPLAY_COLORS[orisha.id] || "var(--accent)";
  const requirements = orisha.requirements || [];
  const allReqsDone = checkedReqs.size >= requirements.length;
  const practiceOwner = {
    ownerType: "orisha",
    ownerId: orisha.id,
    ownerName: orisha.name,
    ownerStyle: orisha.spiritualDomain,
    ownerTier: orisha.tier,
    ownerHistory: orisha.historicalContext,
    ownerPhilosophy: orisha.spiritualLesson,
    ownerSkills: orisha.signature_techniques,
    ownerQualities: orisha.capoeiraDimension,
  };

  const toggleReq = (i) => {
    store.toggleRequirementCheck?.(ownerKey, i);
  };

  const handleIntegrate = () => {
    if (!gatingStatus.canIntegrate) return;
    store.integrateOrisha(orisha.id, 250);
    haptics.advance();
    setJustIntegrated(true);
    setTimeout(() => setJustIntegrated(false), 2000);
  };

  const readiness = (() => {
    if (!requirements.length) return 100;
    const met = requirements.filter((r) => {
      if (r.movementId) return (store.getMasteryLevel(r.movementId) || 0) >= 2;
      if (r.type === "concept_tree") return (store.state.conceptTreeProgress[r.treeId] || 0) >= (r.targetLevel || 1);
      if (r.type === "phase") return store.state.trainingPhase.currentPhase >= (r.minPhase || 1);
      return true;
    }).length;
    return Math.round((met / requirements.length) * 100);
  })();

  return (
    <>
      <div className="card" style={{
        marginBottom: 12,
        outline: justIntegrated ? `2px solid ${orishaColor}` : "none",
        boxShadow: justIntegrated ? `0 0 24px ${orishaColor}44` : "none",
        transition: "outline 0.3s, box-shadow 0.3s",
      }}>
        {/* Header — tappable → OrishaDetail */}
        <button
          onClick={() => navigate("orisha", orisha.id, { backTo: "orishas", backLabel: "Orishas" })}
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            textAlign: "left", padding: 0, marginBottom: 8,
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <span style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
            background: orishaColor + "18",
            border: `1px solid ${orishaColor}33`,
          }}>
            {orisha.icon || (integrated ? "✨" : "⚡")}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{orisha.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
              {orisha.subtitle}
            </div>
          </div>
          {integrated && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", flexShrink: 0 }}>
              ✨ Integrated
            </span>
          )}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text3)", flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

      {/* Readiness bar */}
      {!integrated && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--surface2)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2, transition: "width 0.4s",
              width: `${readiness}%`,
              background: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--red)",
            }} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800, flexShrink: 0,
            color: readiness >= 80 ? "var(--green)" : readiness >= 50 ? "var(--yellow)" : "var(--text3)",
          }}>
            {readiness}%
          </span>
        </div>
      )}

      {/* Requirements */}
      <div style={{ marginBottom: 12 }}>
        {requirements.map((req, i) => {
          const reqDone = checkedReqs.has(String(i));
          const mv = req.movementId ? getMovementById(req.movementId) : null;
          const plan = !mv ? buildRequirementPracticePlan(practiceOwner, req, i) : null;
          const conceptCurrent = req.type === "concept_tree"
            ? store.state.conceptTreeProgress[req.treeId] || 0
            : null;
          const phaseCurrent = req.type === "phase"
            ? store.state.trainingPhase.currentPhase
            : null;
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 0",
                borderBottom: i < requirements.length - 1 ? "1px solid var(--border)" : "none",
                opacity: reqDone ? 0.5 : 1,
              }}
            >
              <button
                aria-label={`${reqDone ? "Undo" : "Complete"} requirement ${i + 1} for ${orisha.name}`}
                data-testid={`requirement-${ownerKey}-${i}`}
                onClick={() => toggleReq(i)}
                style={{
                  fontSize: 12, background: "none", border: "none", cursor: "pointer",
                  flexShrink: 0, color: reqDone ? "var(--green)" : "var(--border)",
                  padding: 0, lineHeight: 1,
                }}
              >
                {reqDone ? "✓" : "○"}
              </button>
              <span style={{
                flex: 1, fontSize: 11, color: "var(--text2)",
                textDecoration: reqDone ? "line-through" : "none",
              }}>
                {req.label}
              </span>
              {mv && (
                <button
                  onClick={() => navigate?.("skill", req.movementId, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 16,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--blue)", cursor: "pointer", flexShrink: 0, fontWeight: 600,
                  }}
                >
                  {mv.name} ›
                </button>
              )}
              {plan && (
                <button
                  onClick={() => navigate?.("practicePlan", plan, { backTo: "roda", backLabel: "Boss Roda" })}
                  style={{
                    fontSize: 9, padding: "1px 6px", borderRadius: 16,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--accent)", cursor: "pointer", flexShrink: 0, fontWeight: 700,
                  }}
                >
                  Plan
                </button>
              )}
              {conceptCurrent !== null && (
                <span style={{
                  fontSize: 9, padding: "1px 6px", borderRadius: 16,
                  background: conceptCurrent >= (req.targetLevel || 1) ? "rgba(46,140,120,0.2)" : "rgba(201,82,82,0.2)",
                  color: conceptCurrent >= (req.targetLevel || 1) ? "var(--green)" : "var(--red)",
                  fontWeight: 700,
                }}>
                  {conceptCurrent}/{req.targetLevel || 1}
                </span>
              )}
              {phaseCurrent !== null && (
                <span style={{
                  fontSize: 9, padding: "1px 6px", borderRadius: 16,
                  background: phaseCurrent >= (req.minPhase || 1) ? "rgba(46,140,120,0.2)" : "rgba(201,82,82,0.2)",
                  color: phaseCurrent >= (req.minPhase || 1) ? "var(--green)" : "var(--red)",
                  fontWeight: 700,
                }}>
                  Phase {phaseCurrent}/{req.minPhase || 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!integrated && !gatingStatus.canIntegrate && (
        <div style={{
          fontSize: 11,
          color: "var(--red)",
          background: "rgba(201,82,82,0.1)",
          border: "1px solid rgba(201,82,82,0.2)",
          borderRadius: 6,
          padding: "8px 10px",
          marginBottom: 10,
        }}>
          Angola gate locked: {gatingStatus.reason.replaceAll("_", " ")}
        </div>
      )}

      {/* Action button */}
      <div style={{ display: "flex", gap: 8 }}>
        {!integrated && (
          <>
            <button
              className="btn btn-success btn-sm"
              style={{ opacity: allReqsDone && gatingStatus.canIntegrate ? 1 : 0.45, fontWeight: 700 }}
              disabled={!allReqsDone || !gatingStatus.canIntegrate}
              onClick={handleIntegrate}
            >
              ✨ Integrate
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: 11 }}
              disabled
            >
              Requires {100 - readiness}% more prep
            </button>
          </>
        )}
        {integrated && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: 11, color: "var(--accent)" }}
          >
            ✨ Flowing through you
          </button>
        )}
      </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// PRESTIGE TRIAL CARD
// ═══════════════════════════════════════════════════════════════════════════════════
function PrestigeTrialCard({ trial, store, completed }) {
  const [expanded, setExpanded] = useState(false);
  const ownerKey = `prestige:${trial.id}`;
  const checkedReqs = getRequirementChecks(store, ownerKey);
  const requirements = trial.requirements || [];
  const ready = requirements.length === 0 || checkedReqs.size >= requirements.length;

  const toggleReq = (index) => {
    store.toggleRequirementCheck?.(ownerKey, index);
  };

  return (
    <div className="card" style={{ marginBottom: 12, opacity: completed ? 0.7 : 1 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{trial.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>
              {trial.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {trial.subtitle}
            </div>
          </div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--yellow)",
            textAlign: "right",
          }}>
            {trial.difficulty}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          {/* Description */}
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 12 }}>
            {trial.description}
          </div>

          {/* Spiritual focus */}
          <div style={{
            fontSize: 11,
            color: "var(--accent)",
            fontStyle: "italic",
            marginBottom: 12,
            padding: "8px 10px",
            background: "var(--surface2)",
            borderRadius: 6,
          }}>
            ✨ {trial.spiritualFocus}
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>
              Requirements:
            </div>
            {trial.requirements.map((req, i) => (
              <div key={i} style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>
                • {req.label}
              </div>
            ))}
          </div>

          {!completed && requirements.length > 0 && (
            <div style={{ marginBottom: 12, padding: "8px 10px", background: "var(--surface2)", borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6 }}>
                Readiness Gate
              </div>
              {requirements.map((req, i) => {
                const checked = checkedReqs.has(String(i));
                return (
                  <button
                    key={i}
                    aria-label={`${checked ? "Undo" : "Complete"} requirement ${i + 1} for ${trial.name}`}
                    data-testid={`requirement-${ownerKey}-${i}`}
                    onClick={() => toggleReq(i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 0",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      color: checked ? "var(--green)" : "var(--text3)",
                      fontSize: 11,
                    }}
                  >
                    <span style={{ fontWeight: 900 }}>{checked ? "✓" : "○"}</span>
                    <span style={{ textDecoration: checked ? "line-through" : "none" }}>{req.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Reward */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 6,
            padding: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)", marginBottom: 6 }}>
              🏆 Reward
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                • {trial.reward.xp.toLocaleString()} XP
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                • Cosmetic: {trial.reward.cosmetic}
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                • Badge: {trial.reward.badge}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div style={{ marginTop: 12 }}>
            {completed ? (
              <button
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", color: "var(--green)", fontSize: 12 }}
              >
                ✓ Completed
              </button>
            ) : (
              <button
                className="btn btn-success btn-sm"
                style={{ width: "100%", fontSize: 12, opacity: ready ? 1 : 0.45 }}
                disabled={!ready}
                onClick={() => store.completePrestigeTrial(trial.id, trial.reward)}
              >
                {ready ? "Complete Trial" : `Check ${requirements.length - checkedReqs.size} more requirement${requirements.length - checkedReqs.size === 1 ? "" : "s"}`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN BOSS TESTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════════
export default function BossTests({ store, navigate, initialTab = "orishas" }) {
  const [tab, setTab] = useState(initialTab);  // "masters", "lineage", "orishas", "prestige", or "legacy"
  const [victoryBanner, setVictoryBanner] = useState(null); // { name, victoryText, xp, sequences }
  const [showEhiRitual, setShowEhiRitual] = useState(false);
  const isEhiAscended = store.isEhiAscended();
  const prevEhiRef = useRef(isEhiAscended);

  // Detect Ehi ascension moment — show full ritual
  useEffect(() => {
    if (!prevEhiRef.current && isEhiAscended) {
      setShowEhiRitual(true);
    }
    prevEhiRef.current = isEhiAscended;
  }, [isEhiAscended]);

  // Intercept defeatMestre to show victory scene
  const defeatMestreWithVictory = useCallback((mestreId, xp) => {
    store.defeatMestre(mestreId, xp);
    haptics.victory();
    const mestre = getMestreById(mestreId);
    if (mestre) {
      const seqs = getMestreSequences(mestreId) || [];
      setVictoryBanner({
        name: mestre.name,
        subtitle: mestre.subtitle || mestre.style,
        lineage: mestre.lineage || "",
        victoryText: mestre.victory_text || `You have defeated ${mestre.name}. Their wisdom now flows through you.`,
        xp,
        sequences: seqs.slice(0, 3).map((s) => s.name || s.id),
        totalSeqs: seqs.length,
        color: mestre.color || "#D9A441",
        icon: mestre.icon || "🎖",
      });
    }
  }, [store]);

  const { bossProgress, mestreProgress, orishasIntegrated } = store.state;

  // Legacy boss tests
  const regularBosses = useMemo(() => BOSS_TESTS.filter((b) => !b.isTemplate), []);
  const passedBosses = useMemo(() => regularBosses.filter((b) => store.isBossPassed(b.id)), [regularBosses, bossProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  const pendingBosses = useMemo(() => regularBosses.filter((b) => !store.isBossPassed(b.id)), [regularBosses, bossProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mestres
  const mestres = useMemo(() => getMestresByProgression(), []);
  const defeatedMestres = useMemo(() => mestres.filter((m) => store.isMestreDefeated(m.id)), [mestres, mestreProgress]); // eslint-disable-line react-hooks/exhaustive-deps
  const pendingMestres = useMemo(() => mestres.filter((m) => !store.isMestreDefeated(m.id)), [mestres, mestreProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Orishas
  const orishas = useMemo(() => getAllCoreOrishas(), []);
  const integratedOrishas = useMemo(() => orishas.filter((o) => store.isOrishaIntegrated(o.id)), [orishas, orishasIntegrated]); // eslint-disable-line react-hooks/exhaustive-deps
  const pendingOrishas = useMemo(() => orishas.filter((o) => !store.isOrishaIntegrated(o.id)), [orishas, orishasIntegrated]); // eslint-disable-line react-hooks/exhaustive-deps
  const ehiReadiness = useMemo(() => store.getEhiReadiness(), [orishasIntegrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prestige trials — static data, memoize once
  const tier1Trials = useMemo(() => getPrestigeTrialsByTier(1), []);
  const tier2Trials = useMemo(() => getPrestigeTrialsByTier(2), []);
  const tier3Trials = useMemo(() => getPrestigeTrialsByTier(3), []);

  return (
    <div className="page">
      {/* Mestre Victory Scene — full overlay */}
      {victoryBanner && (
        <div
          onClick={() => setVictoryBanner(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 400, borderRadius: 16,
              background: `linear-gradient(160deg, #0A1018 0%, #141F2C 100%)`,
              border: `2px solid ${victoryBanner.color}66`,
              boxShadow: `0 0 60px ${victoryBanner.color}33, 0 20px 60px rgba(0,0,0,0.8)`,
              padding: "28px 24px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Glow behind icon */}
            <div style={{
              position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
              width: 200, height: 200, borderRadius: "50%",
              background: `radial-gradient(circle, ${victoryBanner.color}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* Icon */}
            <div style={{ fontSize: 52, marginBottom: 6, position: "relative" }}>
              {victoryBanner.icon}
            </div>

            {/* Label */}
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: victoryBanner.color, textTransform: "uppercase", marginBottom: 6 }}>
              Defeated
            </div>

            {/* Name */}
            <div style={{ fontSize: 22, fontWeight: 800, color: "#EDE8DE", marginBottom: 4, lineHeight: 1.2 }}>
              {victoryBanner.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginBottom: 18 }}>
              {victoryBanner.subtitle}
              {victoryBanner.lineage ? ` · ${victoryBanner.lineage}` : ""}
            </div>

            {/* Victory text */}
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.65,
              marginBottom: 20, padding: "12px 14px",
              background: "rgba(255,255,255,0.05)", borderRadius: 8,
              borderLeft: `3px solid ${victoryBanner.color}66`,
              textAlign: "left",
            }}>
              {victoryBanner.victoryText}
            </div>

            {/* Rewards */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "center" }}>
              <div style={{
                flex: 1, background: "rgba(217,164,65,0.12)", border: "1px solid rgba(217,164,65,0.3)",
                borderRadius: 8, padding: "8px 12px",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#D9A441" }}>+{victoryBanner.xp}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>XP</div>
              </div>
              <div style={{
                flex: 1, background: `${victoryBanner.color}18`, border: `1px solid ${victoryBanner.color}33`,
                borderRadius: 8, padding: "8px 12px",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: victoryBanner.color }}>{victoryBanner.totalSeqs}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Sequences</div>
              </div>
            </div>

            {/* Unlocked sequence names */}
            {victoryBanner.sequences?.length > 0 && (
              <div style={{ marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                  Unlocked
                </div>
                {victoryBanner.sequences.map((name, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                    <span style={{ fontSize: 10, color: victoryBanner.color }}>›</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{name}</span>
                  </div>
                ))}
                {victoryBanner.totalSeqs > 3 && (
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    +{victoryBanner.totalSeqs - 3} more in Sequences Library
                  </div>
                )}
              </div>
            )}

            {/* Dismiss */}
            <button
              onClick={() => setVictoryBanner(null)}
              style={{
                width: "100%", padding: "11px 0", borderRadius: 8, fontWeight: 700,
                fontSize: 13, border: `1px solid ${victoryBanner.color}44`,
                background: `${victoryBanner.color}18`, color: victoryBanner.color, cursor: "pointer",
              }}
            >
              Continue Training
            </button>
          </div>
        </div>
      )}

      {/* Ehi Ascension Ritual — full-screen ceremony */}
      {showEhiRitual && (
        <EhiAscensionRitual
          integratedOrishas={store.state.orishasIntegrated || []}
          onDismiss={() => { setShowEhiRitual(false); setTab("prestige"); }}
        />
      )}

      {/* Page title + status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="page-title">Boss Roda</span>
        <span style={{ fontSize: 11, color: "var(--text2)" }}>
          {tab === "masters" && `${defeatedMestres.length}/${mestres.length} Mestre Bosses`}
          {tab === "orishas" && `${integratedOrishas.length}/${orishas.length} Orisha Bosses`}
          {tab === "prestige" && "Prestige Mode"}
          {tab === "legacy" && `${passedBosses.length}/${regularBosses.length} Archived Trials`}
        </span>
      </div>

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setTab("orishas")}
          className={`btn btn-sm ${tab === "orishas" ? "btn-primary" : "btn-secondary"}`}
          style={{ flex: 1, fontWeight: tab === "orishas" ? 800 : 600 }}
        >
          Orisha Bosses
        </button>
        <button
          onClick={() => setTab("masters")}
          className={`btn btn-sm ${tab === "masters" ? "btn-primary" : "btn-secondary"}`}
          style={{ flex: 1, fontWeight: tab === "masters" ? 800 : 600 }}
        >
          Mestre Bosses
        </button>
        <button
          onClick={() => setTab("lineage")}
          className={`btn btn-sm ${tab === "lineage" ? "btn-primary" : "btn-secondary"}`}
          style={{ flex: 1, fontWeight: tab === "lineage" ? 800 : 600 }}
        >
          Lineage
        </button>
        {isEhiAscended && (
          <button
            onClick={() => setTab("prestige")}
            className={`btn btn-sm ${tab === "prestige" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1, fontWeight: tab === "prestige" ? 800 : 600 }}
          >
            Prestige ✨
          </button>
        )}
      </div>

      {/* MESTRES TAB — Phase Organized */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={() => setTab("legacy")}
          className={`btn btn-sm ${tab === "legacy" ? "btn-primary" : "btn-secondary"}`}
          style={{ fontSize: 10, opacity: tab === "legacy" ? 1 : 0.72 }}
        >
          Trial Archive
        </button>
      </div>

      {tab === "masters" && (
        <>
          {/* Current Phase Section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text3)",
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
              ⭐ Phase {store.getCurrentPhase?.()} Mestres
            </div>
            {pendingMestres.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pendingMestres.map((mestre) => (
                  <MestreCard key={mestre.id} mestre={mestre} store={store} navigate={navigate} onDefeat={defeatMestreWithVictory} />
                ))}
              </div>
            )}
          </div>

          {defeatedMestres.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--green)",
                marginBottom: 8,
                textTransform: "uppercase",
              }}>
                ✓ Mastered
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {defeatedMestres.map((mestre) => (
                  <MestreCard key={mestre.id} mestre={mestre} store={store} navigate={navigate} onDefeat={defeatMestreWithVictory} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ORISHAS TAB */}
      {tab === "orishas" && (
        <>
          {/* Ehi Readiness */}
          <div className="card" style={{ marginBottom: 16, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Ehi Ascension</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                  {isEhiAscended ? "All 16 integrated — You are Ehi" : `${ehiReadiness.integrated}/16 Orishas flowing through you`}
                </div>
              </div>
              {isEhiAscended && (
                <div style={{ fontSize: 24 }}>✨</div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--surface2)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 0.4s",
                  width: `${ehiReadiness.percentReady}%`,
                  background: isEhiAscended ? "var(--accent)" : ehiReadiness.percentReady >= 80 ? "var(--green)" : "var(--yellow)",
                }} />
              </div>
              <span style={{
                fontSize: 12, fontWeight: 800, flexShrink: 0,
                color: isEhiAscended ? "var(--accent)" : ehiReadiness.percentReady >= 80 ? "var(--green)" : "var(--yellow)",
              }}>
                {ehiReadiness.percentReady}%
              </span>
            </div>
          </div>

          {/* Day-1 path explainer — shown when no Orishas unlocked yet */}
          {integratedOrishas.length === 0 && (() => {
            const ct = store.state.conceptTreeProgress || {};
            const totalProgress = (ct.mandinga || 0) + (ct.malandragem || 0) + (ct.malicia || 0);
            if (totalProgress > 0) return null; // concept trees started — they know the path
            return (
              <div style={{
                background: "var(--surface2)", borderRadius: 12,
                border: "1px solid var(--border)", padding: "20px 18px",
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
                  How to reach the Orishas
                </div>
                {[
                  { n: 1, color: "#D9A441", icon: "📿", text: "Train daily — your reps advance the 3 Concept Trees (Mandinga, Malandragem, Malícia)" },
                  { n: 2, color: "#D4854A", icon: "🗡️", text: "Defeat Mestres in the Masters tab — each defeat advances your trees by 1–2 levels" },
                  { n: 3, color: "#2E8C78", icon: "✨", text: "When trees are high enough, Orisha cards unlock here — integrate them to gain stat bonuses" },
                  { n: 4, color: "#7C3AED", icon: "🌟", text: "Integrate all 16 Orishas → Ehi ascends → Prestige mode unlocks ×2 XP" },
                ].map(({ n, color, icon, text }) => (
                  <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                      background: color + "20", border: `1px solid ${color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color,
                    }}>
                      {n}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.55 }}>
                      <span style={{ marginRight: 6 }}>{icon}</span>{text}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setTab("masters")}
                  style={{
                    width: "100%", padding: "10px 0", borderRadius: 8, marginTop: 4,
                    fontWeight: 700, fontSize: 12, cursor: "pointer", border: "none",
                    background: "rgba(217,164,65,0.15)", color: "var(--accent)",
                  }}
                >
                  View Mestre Bosses → start here
                </button>
              </div>
            );
          })()}

          {pendingOrishas.length > 0 && (
            <div>
              <div className="section-title">Active Orisha Bosses</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pendingOrishas.map((orisha) => (
                  <OrishaCard key={orisha.id} orisha={orisha} store={store} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {integratedOrishas.length > 0 && (
            <div>
              <div className="section-title">Integrated</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {integratedOrishas.map((orisha) => (
                  <OrishaCard key={orisha.id} orisha={orisha} store={store} navigate={navigate} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* MESTRE LINEAGE TAB */}
      {tab === "lineage" && (
        <>
          <div style={{
            background: "linear-gradient(135deg, rgba(218,166,74,0.1), rgba(79,124,255,0.1))",
            border: "1px solid rgba(218,166,74,0.2)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 8,
            }}>
              🔗 Mestre Lineages
            </div>
            <div style={{
              fontSize: 12,
              color: "var(--text2)",
              lineHeight: 1.5,
            }}>
              Each Mestre belongs to a teaching lineage. Defeat Mestres in order to unlock the next teacher in the path and claim the lineage reward.
            </div>
          </div>

          <MestreLineageVisualization store={store} navigate={navigate} />
        </>
      )}

      {/* PRESTIGE TRIALS TAB */}
      {tab === "prestige" && isEhiAscended && (
        <>
          {/* Prestige header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(100,50,200,0.1))",
            border: "2px solid rgba(255,215,0,0.3)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--accent)",
              marginBottom: 8,
            }}>
              ✨ Welcome to Prestige Mode ✨
            </div>
            <div style={{
              fontSize: 12,
              color: "var(--text2)",
              lineHeight: 1.5,
            }}>
              You have ascended as Ehi. These 10 Prestige Trials test your mastery across all spiritual dimensions.
              Complete them to unlock cosmetics and earn 2× XP from all activities.
              <br />
              <br />
              Completing all trials establishes your lineage as a legendary Mestre.
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
              Prestige Rank {store.state.prestige?.rank || 0}
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>
              XP Multiplier {store.getPrestigeXPMultiplier?.() || 2}x
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: "100%" }}
              onClick={() => store.beginPrestigeRun?.()}
            >
              Ascend Again
            </button>
          </div>

          {/* Tier 1 trials */}
          {tier1Trials.length > 0 && (
            <div>
              <div className="section-title">Tier 1 — Foundation Trials</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tier1Trials.map((trial) => (
                  <PrestigeTrialCard
                    key={trial.id}
                    trial={trial}
                    store={store}
                    completed={!!store.state.prestige?.trialsCompleted?.[trial.id]?.completed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tier 2 trials */}
          {tier2Trials.length > 0 && (
            <div>
              <div className="section-title">Tier 2 — Mastery Trials</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tier2Trials.map((trial) => (
                  <PrestigeTrialCard
                    key={trial.id}
                    trial={trial}
                    store={store}
                    completed={!!store.state.prestige?.trialsCompleted?.[trial.id]?.completed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tier 3 trials */}
          {tier3Trials.length > 0 && (
            <div>
              <div className="section-title">Tier 3 — Transcendence Trials</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tier3Trials.map((trial) => (
                  <PrestigeTrialCard
                    key={trial.id}
                    trial={trial}
                    store={store}
                    completed={!!store.state.prestige?.trialsCompleted?.[trial.id]?.completed}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* LEGACY BOSS TESTS TAB */}
      {tab === "legacy" && (
        <>
          {pendingBosses.length > 0 && (
            <div>
              <div className="section-title">Archived Active Trials</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pendingBosses.map((boss) => (
                  <BossCard key={boss.id} boss={boss} passed={false} store={store} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {passedBosses.length > 0 && (
            <div>
              <div className="section-title">Archived Completed Trials</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {passedBosses.map((boss) => (
                  <BossCard key={boss.id} boss={boss} passed={true} store={store} navigate={navigate} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
