/**
 * muscleMap.js — Anatomy guide
 * Maps movement IDs to primary and secondary muscles engaged.
 * Used by MovementDetail to render the "Muscles Worked" card.
 * Source: Sports science references for Capoeira-specific biomechanics.
 */

const MUSCLE_MAP = {
  // ── Foundation ─────────────────────────────────────────────────
  ginga:              { primary: ["Hip flexors", "Glutes", "Calves"], secondary: ["Core", "Adductors", "Tibialis anterior"] },
  cocorinha:          { primary: ["Quadriceps", "Glutes", "Calves"], secondary: ["Core", "Hip flexors", "Ankles"] },
  esquiva_baixa:      { primary: ["Quadriceps", "Glutes", "Core"], secondary: ["Hip flexors", "Hamstrings", "Calves"] },
  negativa:           { primary: ["Quadriceps", "Hip flexors", "Core"], secondary: ["Adductors", "Glutes", "Calves"] },
  role:               { primary: ["Hip flexors", "Core", "Glutes"], secondary: ["Quadriceps", "Adductors", "Shoulders"] },
  au_basico:          { primary: ["Shoulders", "Triceps", "Core"], secondary: ["Hip flexors", "Glutes", "Wrists"] },
  bananeira:          { primary: ["Shoulders", "Triceps", "Core"], secondary: ["Traps", "Wrists", "Glutes"] },
  ponte:              { primary: ["Shoulders", "Spinal erectors", "Glutes"], secondary: ["Hamstrings", "Triceps", "Hip flexors"] },
  queda_de_rins:      { primary: ["Core", "Obliques", "Shoulders"], secondary: ["Triceps", "Hip flexors", "Lats"] },

  // ── Kicks ──────────────────────────────────────────────────────
  meia_lua_de_frente: { primary: ["Hamstrings", "Hip flexors", "Glutes"], secondary: ["Core", "Adductors", "Calves"] },
  meia_lua_de_compasso: { primary: ["Hamstrings", "Glutes", "Core"], secondary: ["Hip flexors", "Calves", "Obliques"] },
  armada:             { primary: ["Quadriceps", "Hip flexors", "Core"], secondary: ["Glutes", "Calves", "Obliques"] },
  queixada:           { primary: ["Hip flexors", "Quadriceps", "Core"], secondary: ["Glutes", "Adductors", "Calves"] },
  bencao:             { primary: ["Quadriceps", "Hip flexors", "Core"], secondary: ["Glutes", "Calves", "Hamstrings"] },
  martelo:            { primary: ["Hip flexors", "Quadriceps", "Core"], secondary: ["Glutes", "Calves", "Obliques"] },
  chapa:              { primary: ["Quadriceps", "Glutes", "Core"], secondary: ["Hip flexors", "Calves", "Hamstrings"] },
  ponteira:           { primary: ["Hip flexors", "Quadriceps", "Core"], secondary: ["Calves", "Glutes", "Hamstrings"] },
  gancho:             { primary: ["Hamstrings", "Glutes", "Core"], secondary: ["Hip flexors", "Calves", "Obliques"] },
  rasteira:           { primary: ["Glutes", "Hamstrings", "Core"], secondary: ["Adductors", "Calves", "Hip flexors"] },

  // ── Acrobatics ─────────────────────────────────────────────────
  macaco:             { primary: ["Shoulders", "Glutes", "Core"], secondary: ["Triceps", "Hip flexors", "Hamstrings"] },
  au_sem_maos:        { primary: ["Core", "Hip flexors", "Glutes"], secondary: ["Shoulders", "Quadriceps", "Calves"] },
  parafuso:           { primary: ["Hip flexors", "Core", "Glutes"], secondary: ["Quadriceps", "Calves", "Obliques"] },
  giro:               { primary: ["Core", "Obliques", "Hip flexors"], secondary: ["Glutes", "Calves", "Shoulders"] },

  // ── Strikes ────────────────────────────────────────────────────
  galopante:          { primary: ["Deltoids", "Triceps", "Core"], secondary: ["Forearms", "Pecs", "Obliques"] },
  cutilada:           { primary: ["Deltoids", "Forearms", "Core"], secondary: ["Triceps", "Obliques", "Pecs"] },
  godeme:             { primary: ["Triceps", "Deltoids", "Core"], secondary: ["Forearms", "Pecs", "Obliques"] },

  // ── Takedowns ──────────────────────────────────────────────────
  tesoura:            { primary: ["Adductors", "Core", "Hip flexors"], secondary: ["Glutes", "Hamstrings", "Calves"] },
  vingativa:          { primary: ["Core", "Glutes", "Hip flexors"], secondary: ["Quadriceps", "Hamstrings", "Calves"] },
};

const DEFAULT_MUSCLES = {
  primary:   ["Core", "Hip flexors", "Glutes"],
  secondary: ["Calves", "Quadriceps"],
};

export function getMuscles(movementId) {
  return MUSCLE_MAP[movementId] || null;
}

// Visual grouping for the anatomy card
export const MUSCLE_GROUPS = {
  "Core & Spine": ["Core", "Obliques", "Spinal erectors"],
  "Hips & Glutes": ["Hip flexors", "Glutes", "Adductors", "Hamstrings"],
  "Legs": ["Quadriceps", "Calves", "Tibialis anterior", "Ankles"],
  "Upper Body": ["Shoulders", "Deltoids", "Triceps", "Pecs", "Traps", "Lats", "Forearms", "Wrists"],
};

export function getMuscleGroup(muscle) {
  for (const [group, muscles] of Object.entries(MUSCLE_GROUPS)) {
    if (muscles.some(m => m.toLowerCase() === muscle.toLowerCase())) return group;
  }
  return "Other";
}
