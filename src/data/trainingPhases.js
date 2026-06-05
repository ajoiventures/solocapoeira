/**
 * Training Phases — 4-Phase Angola-Centric Progression
 * Angola is primary and continues deepening through all phases
 */

export const TRAINING_PHASES = [
  {
    id: 1,
    name: "Angola Foundation",
    icon: "🌍",
    color: "#2E8C78",
    description: "Master Angola's spiritual foundation. Low game, grounding, power.",
    duration: "8-12 weeks",

    conceptTrees: {
      mandinga: { start: 0, end: 3, focus: "Spiritual foundation, presence, power" },
      malandragem: { start: 0, end: 2, focus: "Angola cunning, grounding, patience" },
      malicia: { start: 0, end: 0, focus: "Not yet — Angola doesn't need reading speed" },
    },

    movementFocus: [
      "Roda Baixa (foundation)",
      "Negativa (Angola escape)",
      "Queda (falls, flow)",
      "Sweeps (ground work)",
      "Powerful inversions (au, mortal)",
      "Ginga baixa (low, meditative)",
    ],

    mestres: [
      "mestre_pastinha",  // Angola founder
      "mestre_nenel",     // Angola lineage
      "mestre_santo",     // Angola lineage
      "mestre_canjiquinha", // Rhythm master
      "mestre_besouro",   // Warrior Angola
      "mestre_valmir",    // Angola/warrior hybrid
      "mestre_waldemar",  // Angola synthesis founder
      "mestre_amancio",   // Angola lineage continuation
    ],

    requirements: {
      mandinga: 3,
      malandragem: 2,
      masterMovements: ["roda_baixa", "negativa", "au_basico"],
      trainingHours: 50,
      mestresDefeated: 3, // Pastinha + 2 others
    },

    rewards: {
      title: "Angola Mestre Apprentice",
      cosmetic: "Angola Master's Cord",
      bonus: "+20% Mandinga, +15% Malandragem",
      unlocksPhase: 2,
    },

    narrative:
      "You have grounded yourself in Angola. Low, slow, powerful. The spiritual foundation is solid. " +
      "Now you are ready to expand your game while keeping Angola as your anchor.",
  },

  {
    id: 2,
    name: "Angola Progressing + Regional",
    icon: "⚡",
    color: "#4F7CFF",
    description: "Angola continues deepening. Learn Regional speed while staying grounded.",
    duration: "8-12 weeks",

    conceptTrees: {
      mandinga: { start: 3, end: 4, focus: "Deeper spiritual power, resilience under pressure" },
      malandragem: { start: 2, end: 3, focus: "Advanced cunning, grounded tactics" },
      malicia: { start: 0, end: 2, focus: "Read fast opponents, directness recognition" },
    },

    movementFocus: [
      "Angola continues: roda baixa advancement",
      "Regional added: armada, lateral, speed kicks",
      "Reading fast opponents while staying low",
      "Powerful responses to Regional speed",
      "Hybrid Angola/Regional sequences",
    ],

    mestres: [
      "mestre_bimba",     // Regional founder
      "mestre_acordeon",  // Regional lineage
      "mestre_grão",      // Regional continuation
      "mestre_paulo_santos", // Regional adaptation
      "mestre_toni_vargas", // Regional emphasis
      "mestre_gildo",     // Hybrid Angola/Regional
    ],

    requirements: {
      phaseGate: 1, // Must complete Phase 1 first
      mandinga: 3,
      malandragem: 2,
      malicia: 2, // New requirement
      masterMovements: ["armada", "lateral", "roda_baixa"],
      trainingHours: 60,
      mestresDefeated: 3, // Bimba + 2 others
    },

    rewards: {
      title: "Regional Speed Reader",
      cosmetic: "Hybrid Angola/Regional Cord",
      bonus: "+15% Malícia, Angola progression continues",
      unlocksPhase: 3,
    },

    narrative:
      "Angola deepens as you learn Regional speed. You are not Regional—you are Angola learning to read fast opponents. " +
      "Your grounding lets you counter directness with spiritual power. Angola remains your foundation.",
  },

  {
    id: 3,
    name: "Angola Progressing + Contemporary Mastery",
    icon: "🎪",
    color: "#D4854A",
    description: "Angola continues. Master Contemporary athleticism while grounded.",
    duration: "8-12 weeks",

    conceptTrees: {
      mandinga: { start: 4, end: 5, focus: "Master spiritual power, transcendence" },
      malandragem: { start: 3, end: 4, focus: "Complete cunning mastery" },
      malicia: { start: 2, end: 3, focus: "Master reading all opponent types" },
    },

    movementFocus: [
      "Angola continues: roda baixa mastery",
      "Contemporary added: aerials, explosiveness, athleticism",
      "Reading athleticism while maintaining Angola base",
      "Powerful inversions executed at speed",
      "Angola grounding supporting all aerial techniques",
    ],

    mestres: [
      "mestre_nestor",    // Contemporary pioneer
      "mestre_cobra",     // Contemporary athleticism
      "mestre_sergio",    // Contemporary rhythm
      "mestre_waldemar",  // Synthesis master (already mentioned, moved here for phase 3)
      "mestre_gildo",     // Advanced hybrid (phase 2 continuation)
      "mestre_decânio",   // Contemporary legacy
    ],

    requirements: {
      phaseGate: 2, // Must complete Phases 1+2
      mandinga: 4,
      malandragem: 3,
      malicia: 3, // Advanced reading
      masterMovements: ["au_basico", "parafuso", "mortal_lateral", "roda_baixa"],
      trainingHours: 70,
      mestresDefeated: 3, // Nestor + 2 others
    },

    rewards: {
      title: "Contemporary Master",
      cosmetic: "Four-Cord Master",
      bonus: "+20% all styles, Angola continues to deepen",
      unlocksPhase: 4,
    },

    narrative:
      "You are now capable in all styles. But Angola is still your root. Contemporary athleticism flows from Angola grounding. " +
      "You have mastered the expansion. Now integrate everything into one unified vision.",
  },

  {
    id: 4,
    name: "All Integrated - Transcendence",
    icon: "✨",
    color: "#D9A441",
    description: "All styles flowing through Angola foundation. Ehi ascension path opens.",
    duration: "Ongoing",

    conceptTrees: {
      mandinga: { start: 5, end: 5, focus: "Full mastery, transcendence available" },
      malandragem: { start: 4, end: 4, focus: "Complete mastery" },
      malicia: { start: 3, end: 3, focus: "Complete mastery" },
    },

    movementFocus: [
      "All movements accessible",
      "Angola as the conscious foundation",
      "Seamless style integration",
      "Ehi transcendence available",
      "Infinite variation and improvisation",
    ],

    mestres: [
      "mestre_nô",        // Synthesis master (if exists)
      // Integration Mestres TBD based on lineage rewards
    ],

    requirements: {
      phaseGate: 3, // Must complete Phases 1, 2, 3
      mandinga: 5,
      malandragem: 4,
      malicia: 3,
      allMestresChallenged: true,
      trainingHours: 100, // Ongoing
    },

    rewards: {
      title: "Capoeira Master - Angola Foundation",
      cosmetic: "White Cord (Mestre equivalent)",
      bonus: "+30% all concepts, Ehi ascension available",
      unlocksOrishas: true,
    },

    narrative:
      "You have integrated all of Capoeira while staying rooted in Angola. Every style flows from Angola's foundation. " +
      "You are ready for the spiritual journey. The Orishas await.",
  },
];

export function getPhaseById(phaseId) {
  return TRAINING_PHASES.find((p) => p.id === phaseId);
}

export function getPhaseProgress(currentPhase, conceptProgress, mestresDefeated) {
  const phase = getPhaseById(currentPhase);
  if (!phase) return 0;

  // Calculate completion %
  const mandingaProgress = Math.min(100, (conceptProgress.mandinga / phase.requirements.mandinga) * 100);
  const malandrgemProgress = Math.min(100, (conceptProgress.malandragem / phase.requirements.malandragem) * 100);
  const maliciaProgress = phase.requirements.malicia
    ? Math.min(100, (conceptProgress.malicia / phase.requirements.malicia) * 100)
    : 100;
  const mestreProgress = Math.min(100, (mestresDefeated.length / phase.requirements.mestresDefeated) * 100);

  return Math.round((mandingaProgress + malandrgemProgress + maliciaProgress + mestreProgress) / 4);
}

export function canAdvancePhase(currentPhase, state) {
  const phase = getPhaseById(currentPhase);
  if (!phase || currentPhase === 4) return false;

  // Check all requirements met
  const mandingaMet = state.conceptTreeProgress.mandinga >= phase.requirements.mandinga;
  const malandrgemMet = state.conceptTreeProgress.malandragem >= phase.requirements.malandragem;
  const maliciaMet = !phase.requirements.malicia || state.conceptTreeProgress.malicia >= phase.requirements.malicia;
  const mestresMet = Object.values(state.mestreProgress).filter((m) => m.defeated).length >= phase.requirements.mestresDefeated;

  return mandingaMet && malandrgemMet && maliciaMet && mestresMet;
}

export function getNextPhase(currentPhase) {
  if (currentPhase < 4) return getPhaseById(currentPhase + 1);
  return null;
}
