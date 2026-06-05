// ═══════════════════════════════════════════════════════════════════════════════════
// PRESTIGE TRIALS — 10 NG+ Challenges for Ehi-Ascended Players
// Solo Leveling Capoeira Training App
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * After Ehi ascension (all 16 Orishas integrated), players unlock 10 Prestige Trials.
 * These are mastery challenges that test integrated understanding across all dimensions.
 * Completing trials grants 2x XP and prestige cosmetics.
 */

export const PRESTIGE_TRIALS = [
  {
    id: "prestige_trial_1",
    tier: 1,
    name: "The Warrior's Circle",
    subtitle: "Ogun's Trial — Pure Power",
    icon: "⚔",
    description:
      "Master 50 consecutive ginga baixo repetitions with perfect form. " +
      "Ogun tests your foundation.",
    spiritualFocus: "Ogun: Strength, boundaries, unwavering commitment",
    requirements: [
      { label: "Ginga em Baixo × 50 reps, unbroken form" },
      { label: "No step-ups allowed — stay grounded" },
      { label: "Maintain 60-80 BPM rhythm throughout" },
    ],
    reward: {
      xp: 500,
      cosmetic: "Ogun's Iron Aura",
      badge: "⚔ Warrior",
    },
    difficulty: "⭐⭐",
  },

  {
    id: "prestige_trial_2",
    tier: 1,
    name: "The Ancestor's Wisdom",
    subtitle: "Obatala's Trial — Patience",
    icon: "👑",
    description:
      "Complete a full 20-minute jogo (game) demonstrating only defensive movements. " +
      "Never attack. Only escape and evade. Obatala teaches restraint.",
    spiritualFocus: "Obatala: Wisdom, tradition, the long view",
    requirements: [
      { label: "20-minute jogo without initiating attack" },
      { label: "Minimum 30 escapes using varied techniques" },
      { label: "Partner must rate your rhythm 8+/10" },
    ],
    reward: {
      xp: 500,
      cosmetic: "Obatala's White Aura",
      badge: "👑 Elder",
    },
    difficulty: "⭐⭐",
  },

  {
    id: "prestige_trial_3",
    tier: 1,
    name: "The Ocean's Flow",
    subtitle: "Yemaya's Trial — Adaptability",
    icon: "🌊",
    description:
      "Switch between 3 different styles (Angola, Regional, Contemporary) seamlessly " +
      "during a 15-minute jogo. Yemaya flows like water.",
    spiritualFocus: "Yemaya: Protection, mother of all, fluid strength",
    requirements: [
      { label: "Angola, Regional, Contemporary sections (5 min each)" },
      { label: "Smooth transitions between styles" },
      { label: "Maintain rhythm quality across all sections" },
    ],
    reward: {
      xp: 500,
      cosmetic: "Yemaya's Tide Aura",
      badge: "🌊 Fluidic",
    },
    difficulty: "⭐⭐",
  },

  {
    id: "prestige_trial_4",
    tier: 2,
    name: "The Storm's Fury",
    subtitle: "Shango's Trial — Passion",
    icon: "⚡",
    description:
      "Execute 100 consecutive kicks of varied types (queixada, meia lua, armada, etc) " +
      "with explosive power and perfect landing. Shango demands fire.",
    spiritualFocus: "Shango: Power, passion, righteous action",
    requirements: [
      { label: "100 total kicks (no repeats of same type consecutively)" },
      { label: "All kicks land with control, no wobbles" },
      { label: "Average tempo 120+ BPM throughout" },
    ],
    reward: {
      xp: 750,
      cosmetic: "Shango's Lightning Aura",
      badge: "⚡ Thunderous",
    },
    difficulty: "⭐⭐⭐",
  },

  {
    id: "prestige_trial_5",
    tier: 2,
    name: "The Trickster's Game",
    subtitle: "Elegba's Trial — Cunning",
    icon: "🎭",
    description:
      "Win 5 consecutive jogo matches using only malícia and evasion. " +
      "No direct attacks allowed. Elegba teaches the art of deception.",
    spiritualFocus: "Elegba: Crossroads, trickery, communication",
    requirements: [
      { label: "5 games in a row without losing" },
      { label: "No direct attacks — only counters and traps" },
      { label: "Opponent consistently caught off-guard" },
    ],
    reward: {
      xp: 750,
      cosmetic: "Elegba's Mask Aura",
      badge: "🎭 Cunning",
    },
    difficulty: "⭐⭐⭐",
  },

  {
    id: "prestige_trial_6",
    tier: 2,
    name: "The Healer's Compassion",
    subtitle: "Babaluaye's Trial — Resilience",
    icon: "🌿",
    description:
      "Complete a full body pain assessment and recovery plan, then train through " +
      "minor discomfort for 30 days using proper form. Babaluaye teaches healing.",
    spiritualFocus: "Babaluaye: Healing, overcoming obstacles, resilience",
    requirements: [
      { label: "Daily 30-minute training sessions for 30 days" },
      { label: "Zero form-breaking due to pain" },
      { label: "Weekly recovery log (sleep, hydration, stretching)" },
    ],
    reward: {
      xp: 750,
      cosmetic: "Babaluaye's Green Aura",
      badge: "🌿 Resilient",
    },
    difficulty: "⭐⭐⭐",
  },

  {
    id: "prestige_trial_7",
    tier: 3,
    name: "The Foresight",
    subtitle: "Ifa's Trial — Mastery",
    icon: "🔮",
    description:
      "Execute a 30-minute jogo where you anticipate and counter every opponent move " +
      "before it happens, 80% accuracy minimum. Ifa knows all patterns.",
    spiritualFocus: "Ifa: Divination, knowledge, foresight, mastery",
    requirements: [
      { label: "30-minute continuous jogo" },
      { label: "80%+ successful anticipations" },
      { label: "Partner confirms you 'read' their game perfectly" },
    ],
    reward: {
      xp: 1000,
      cosmetic: "Ifa's Oracle Aura",
      badge: "🔮 Oracle",
    },
    difficulty: "⭐⭐⭐⭐",
  },

  {
    id: "prestige_trial_8",
    tier: 3,
    name: "The Integration",
    subtitle: "All 16 Unified — The Path",
    icon: "✨",
    description:
      "Teach a complete 90-minute class showcasing all 16 Orisha dimensions, " +
      "with students learning techniques from each path. You are now a Mestre.",
    spiritualFocus: "Integration: All 16 Orishas flowing as one",
    requirements: [
      { label: "90-minute structured class" },
      { label: "Minimum 8 students, all engaged" },
      { label: "Cover at least 12 of 16 Orisha dimensions" },
    ],
    reward: {
      xp: 1000,
      cosmetic: "Ehi's Golden Aura",
      badge: "✨ Mestre",
    },
    difficulty: "⭐⭐⭐⭐",
  },

  {
    id: "prestige_trial_9",
    tier: 3,
    name: "The Transcendence",
    subtitle: "Ehi's Trial — Your Eternal Self",
    icon: "👻",
    description:
      "Perform a 60-minute solo demonstration where every single technique flows " +
      "seamlessly into the next, with zero pauses, perfect rhythm, and complete spiritual presence.",
    spiritualFocus: "Ehi: You are eternal. Capoeira is you. You are Capoeira.",
    requirements: [
      { label: "60 continuous minutes" },
      { label: "All 6 skill levels represented (locked through instinct)" },
      { label: "Zero technical errors; perfect flow state" },
    ],
    reward: {
      xp: 1500,
      cosmetic: "Ehi's Eternal Crown",
      badge: "👻 Transcendent",
    },
    difficulty: "⭐⭐⭐⭐⭐",
  },

  {
    id: "prestige_trial_10",
    tier: 3,
    name: "The Legacy",
    subtitle: "Beyond Ehi — Your Eternal Path",
    icon: "🏛",
    description:
      "Document and share your Capoeira journey with the next generation. " +
      "Create training materials, mentor 3+ students to white cord level, and " +
      "establish your own lineage.",
    spiritualFocus: "Legacy: You pass the knowledge forward. Capoeira is eternal.",
    requirements: [
      { label: "3+ students reach white cord minimum" },
      { label: "Create and share video/written guides (3+ pieces)" },
      { label: "Demonstrate lineage teaching for 90 days" },
    ],
    reward: {
      xp: 1500,
      cosmetic: "Your Personal Crest",
      badge: "🏛 Legendary",
    },
    difficulty: "⭐⭐⭐⭐⭐",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

export function getPrestigeTrialById(id) {
  return PRESTIGE_TRIALS.find((t) => t.id === id);
}

export function getPrestigeTrialsByTier(tier) {
  return PRESTIGE_TRIALS.filter((t) => t.tier === tier);
}

export function getAllPrestigeTrials() {
  return PRESTIGE_TRIALS;
}
