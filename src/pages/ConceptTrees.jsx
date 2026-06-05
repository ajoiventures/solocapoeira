import { useState } from "react";
import { getPhaseById } from "../data/trainingPhases.js";
import { getConceptAdvancedSequences } from "../data/conceptSequences.js";
import { getMovementById } from "../data/movements.js";

/**
 * Concept Trees Page - Shows phase-gated Malícia, Malandragem, Mandinga progression
 * Maps to #80-83: Phase-specific concept tree restructuring
 * Maps to #58: Concept tree UI: show mastery progress on trees page
 */
const CONCEPT_TREES = [
  {
    id: "malicia",
    name: "Malícia",
    icon: "🎭",
    description: "Reading your opponent. Deception, awareness, and strategic thinking.",
    color: "#4F7CFF",
    levels: [
      {
        level: 1,
        name: "Beginner Reader",
        description: "Can read basic opponent patterns",
        requirements: ["Play 5 games", "Escape 10 attacks"],
        bonus: "+5% opponent prediction",
      },
      {
        level: 2,
        name: "Intermediate Analyst",
        description: "Anticipate mid-game shifts",
        requirements: ["Win 3 games", "Play 15 games total"],
        bonus: "+10% reading accuracy",
      },
      {
        level: 3,
        name: "Advanced Strategist",
        description: "Counter-plan before attacks happen",
        requirements: ["Win 7 games", "Execute 50 strategic escapes"],
        bonus: "+15% strategic advantage",
      },
      {
        level: 4,
        name: "Master Deceiver",
        description: "Control the entire game flow",
        requirements: ["Win 15 games", "Perfect reads in 10 games"],
        bonus: "+20% game control",
      },
      {
        level: 5,
        name: "Legendary Malicioso",
        description: "Know what your opponent will do before they do",
        requirements: ["Win 30 games", "Defeat 3 Mestres", "Integrate 5 Orishas"],
        bonus: "+30% predictive mastery",
      },
    ],
  },
  {
    id: "malandragem",
    name: "Malandragem",
    icon: "🎪",
    description: "The street wisdom. Cunning, adaptability, and survival smarts.",
    color: "#D4854A",
    levels: [
      {
        level: 1,
        name: "Street Aware",
        description: "Understand basic cunning tactics",
        requirements: ["Complete 5 daily quests", "Learn 5 movements"],
        bonus: "+5% situational awareness",
      },
      {
        level: 2,
        name: "Cunning Student",
        description: "Apply tricks in training",
        requirements: ["Complete 10 daily quests", "Master ginga"],
        bonus: "+10% tactical flexibility",
      },
      {
        level: 3,
        name: "Wily Practitioner",
        description: "Blend multiple strategies seamlessly",
        requirements: ["Complete 25 daily quests", "Play 10 games"],
        bonus: "+15% strategy blending",
      },
      {
        level: 4,
        name: "Master Trickster",
        description: "Outmaneuver opponents consistently",
        requirements: ["Complete 50 daily quests", "Win 10 games"],
        bonus: "+20% outmaneuvering",
      },
      {
        level: 5,
        name: "Legendary Malandreiro",
        description: "The streets taught you everything",
        requirements: ["Complete 100 daily quests", "Defeat 3 Mestres", "3-month streak"],
        bonus: "+30% street smarts mastery",
      },
    ],
  },
  {
    id: "mandinga",
    name: "Mandinga",
    icon: "✨",
    description: "The spiritual power. Magic, presence, and the ineffable.",
    color: "#2E8C78",
    levels: [
      {
        level: 1,
        name: "Awakening Presence",
        description: "Feel the energy of movement",
        requirements: ["Meditate 5 times", "Play Angola", "Feel the rhythm"],
        bonus: "+5% spiritual awareness",
      },
      {
        level: 2,
        name: "Growing Power",
        description: "Channel spiritual energy into technique",
        requirements: ["Meditate 15 times", "Play 5 Angola games"],
        bonus: "+10% energy channeling",
      },
      {
        level: 3,
        name: "Connected Master",
        description: "Your movement becomes art and magic",
        requirements: ["Integrate 3 Orishas", "Play 10 Angola games", "Master low game"],
        bonus: "+15% spiritual connection",
      },
      {
        level: 4,
        name: "Spiritual Guide",
        description: "Others feel your presence in the roda",
        requirements: ["Integrate 7 Orishas", "Win 5 Angola games", "Teach 5+ people"],
        bonus: "+20% spiritual influence",
      },
      {
        level: 5,
        name: "Legendary Mandingueiro",
        description: "You are one with the spirit of Capoeira",
        requirements: ["Integrate 12 Orishas", "Defeat 5 Mestres", "Achieve flow state 20 times"],
        bonus: "+30% mandinga transcendence",
      },
    ],
  },
];

export default function ConceptTrees({ store, navigate }) {
  const [selectedTree, setSelectedTree] = useState("mandinga");
  const currentPhase = store.getCurrentPhase?.() ?? 1;
  const phaseData = getPhaseById(currentPhase);

  const tree = CONCEPT_TREES.find((t) => t.id === selectedTree);
  const playerMasteryLevel = store.state.conceptTreeProgress || { malicia: 0, malandragem: 0, mandinga: 0 };
  const currentLevel = playerMasteryLevel[selectedTree] || 0;

  // Determine which trees are accessible in current phase
  const accessibleTrees = CONCEPT_TREES.filter((t) => {
    if (t.id === "malicia") return currentPhase >= 2; // Malícia unlocks Phase 2+
    return true; // Mandinga and Malandragem always available
  });

  // Get phase targets for selected tree
  const phaseTarget = phaseData?.conceptTrees?.[selectedTree];
  const maxLevelThisPhase = phaseTarget?.end || 5;
  const advancedSequencePack = getConceptAdvancedSequences(selectedTree);

  return (
    <div className="page">
      <div className="page-title">Concept Trees</div>

      {/* Phase info + Tree selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text3)",
          marginBottom: 8,
          textTransform: "uppercase",
        }}>
          Phase {currentPhase}: {phaseData?.name}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {accessibleTrees.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTree(t.id)}
              className={`btn btn-sm ${selectedTree === t.id ? "btn-primary" : "btn-secondary"}`}
              style={{
                flex: 1,
                fontWeight: selectedTree === t.id ? 800 : 600,
                color: t.color,
                opacity: accessibleTrees.includes(t) ? 1 : 0.4,
              }}
              disabled={!accessibleTrees.includes(t)}
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tree details */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 40 }}>{tree.icon}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
              {tree.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {tree.description}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{
          background: "var(--surface2)",
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)" }}>
              Current Level: {currentLevel}
            </span>
            <span style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>
              Phase target: {phaseTarget?.start || 0}→{maxLevelThisPhase}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: "var(--surface3)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                borderRadius: 3,
                width: `${(currentLevel / 5) * 100}%`,
                background: tree.color,
                transition: "width 0.4s ease-out",
              }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: tree.color }}>
              {currentLevel}/5
            </span>
          </div>
        </div>
      </div>

      {/* Phase lock warning for Malícia in Phase 1 */}
      {selectedTree === "malicia" && currentPhase === 1 && (
        <div style={{
          background: "rgba(79,124,255,0.15)",
          border: "1px solid #4F7CFF",
          borderRadius: 6,
          padding: 10,
          marginBottom: 12,
          fontSize: 11,
          color: "#4F7CFF",
        }}>
          🔒 Malícia unlocks in Phase 2 (Angola Progressing + Regional).
          Focus on Mandinga & Malandragem in Phase 1.
        </div>
      )}

      {advancedSequencePack && (
        <div className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${tree.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text)" }}>
                Advanced Boss Sequences
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5, marginTop: 3 }}>
                {advancedSequencePack.context}
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 900, color: tree.color, textAlign: "right", flexShrink: 0 }}>
              {advancedSequencePack.sessionPolicy.minSessions}-{advancedSequencePack.sessionPolicy.maxSessions}<br />
              10-min sessions
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {advancedSequencePack.keyPrinciples.map((principle) => (
              <span key={principle} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, background: tree.color + "18", color: tree.color, fontWeight: 800 }}>
                {principle}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 12 }}>
            {advancedSequencePack.bossLine}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {advancedSequencePack.sequences.map((sequence) => (
              <div key={sequence.session} style={{ padding: 10, borderRadius: 6, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text)" }}>
                    Session {sequence.session}: {sequence.name}
                  </div>
                  <div style={{ fontSize: 10, color: tree.color, fontWeight: 900, flexShrink: 0 }}>
                    {sequence.minutes} min
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 7 }}>
                  Orisha: {sequence.orisha} · Mestre: {sequence.mestre}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, marginBottom: 8 }}>
                  {sequence.goal}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sequence.moves.map((moveId) => {
                    const movement = getMovementById(moveId);
                    return (
                      <button
                        key={moveId}
                        onClick={() => navigate?.("skill", moveId, { backTo: "concepts", backLabel: tree.name })}
                        style={{
                          fontSize: 10,
                          padding: "3px 7px",
                          borderRadius: 5,
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--blue)",
                          cursor: "pointer",
                        }}
                      >
                        {movement?.name || moveId}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progression levels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tree.levels.map((level) => {
          const isUnlocked = currentLevel >= level.level;
          const isCurrent = currentLevel === level.level;
          const isAvailableThisPhase = level.level <= maxLevelThisPhase;

          return (
            <div
              key={level.level}
              className="card"
              style={{
                opacity: isUnlocked ? 1 : isAvailableThisPhase ? 0.6 : 0.3,
                borderLeft: isCurrent ? `4px solid ${tree.color}` : isAvailableThisPhase ? `4px solid ${tree.color}44` : "4px solid var(--border)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: isUnlocked ? tree.color + "33" : "var(--surface2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: isUnlocked ? tree.color : "var(--text3)",
                  fontSize: 18,
                }}>
                  {isUnlocked ? "✓" : level.level}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                    {level.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                    {level.description}
                  </div>
                </div>

                {isCurrent && (
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: tree.color,
                    background: tree.color + "22",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}>
                    Current
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div style={{
                background: "var(--surface2)",
                borderRadius: 6,
                padding: 10,
                marginBottom: 10,
              }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text2)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}>
                  Requirements
                </div>
                {level.requirements.map((req, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>
                    • {req}
                  </div>
                ))}
              </div>

              {/* Bonus */}
              <div style={{
                fontSize: 11,
                color: tree.color,
                fontWeight: 600,
                padding: "6px 10px",
                background: tree.color + "11",
                borderRadius: 4,
              }}>
                ✨ {level.bonus}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
