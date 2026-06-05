// ═══════════════════════════════════════════════════════════════════════════════════
// MESTRE LINEAGE SYSTEM — Teaching Progression Paths
// Solo Leveling Capoeira Training App
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Mestre Lineage defines the progression path through the Mestre system.
 * After defeating a Mestre, you unlock their teaching lineage and can progress to students/variations.
 */

export const MESTRE_LINEAGES = {
  // BIMBA LINEAGE → Regional Progression
  "mestre_bimba": {
    name: "Bimba Lineage — The Regional Way",
    founder: "mestre_bimba",
    style: "Regional",
    description: "The systematic, efficient path. Speed and directness lead to mastery.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_bimba",
        title: "Founder",
        unlocks: ["regional_basics", "numbered_sequences"],
      },
      {
        order: 2,
        mestre: "mestre_acordeon",
        title: "Rhythm Master Student",
        unlocks: ["rhythm_synchronization", "berimbau_mastery"],
      },
      {
        order: 3,
        mestre: "mestre_grão",
        title: "Power Lineage",
        unlocks: ["raw_strength", "grounded_power"],
      },
      {
        order: 4,
        mestre: "mestre_paulo_santos",
        title: "Modern Evolution",
        unlocks: ["contemporary_regional", "athletic_expression"],
      },
    ],
    reward: {
      title: "Regional Master",
      cosmetic: "Bimba's Strategic Crown",
      bonus: "+15% speed and directness",
    },
  },

  // PASTINHA LINEAGE → Angola Progression
  "mestre_pastinha": {
    name: "Pastinha Lineage — The Angola Way",
    founder: "mestre_pastinha",
    style: "Angola",
    description: "The traditional, spiritual path. Patience and wisdom unlock transcendence.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_pastinha",
        title: "Founder of Angola",
        unlocks: ["angola_foundation", "malicia_training"],
      },
      {
        order: 2,
        mestre: "mestre_nenel",
        title: "Pure Angola Traditionalist",
        unlocks: ["authentic_angola", "ginga_pura"],
      },
      {
        order: 3,
        mestre: "mestre_santo",
        title: "Spiritual Guardian",
        unlocks: ["spiritual_angola", "orixá_alignment"],
      },
      {
        order: 4,
        mestre: "mestre_nestor",
        title: "Contemporary Philosopher",
        unlocks: ["philosophical_angola", "consciousness_training"],
      },
    ],
    reward: {
      title: "Angola Elder",
      cosmetic: "Pastinha's Ancestral Wisdom Crown",
      bonus: "+20% spiritual mastery and reading ability",
    },
  },

  // WALDEMAR LINEAGE → Hybrid Masters
  "mestre_waldemar": {
    name: "Waldemar Lineage — The Hybrid Path",
    founder: "mestre_waldemar",
    style: "Angola/Regional Hybrid",
    description: "The balanced path. Master both Angola and Regional, then transcend both.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_waldemar",
        title: "Hybrid Synthesizer",
        unlocks: ["balanced_capoeira", "style_blending"],
      },
      {
        order: 2,
        mestre: "mestre_gildo",
        title: "Finesse Specialist",
        unlocks: ["subtle_technique", "precision_training"],
      },
      {
        order: 3,
        mestre: "mestre_amancio",
        title: "Researcher & Scientist",
        unlocks: ["biomechanical_mastery", "technical_analysis"],
      },
      {
        order: 4,
        mestre: "mestre_decânio",
        title: "Historical Keeper",
        unlocks: ["historical_knowledge", "authentic_synthesis"],
      },
    ],
    reward: {
      title: "Hybrid Master",
      cosmetic: "Waldemar's Balanced Crown",
      bonus: "+15% versatility and style blending",
    },
  },

  // BESOURO LINEAGE → Warrior Progression
  "mestre_besouro": {
    name: "Besouro Lineage — The Warrior Way",
    founder: "mestre_besouro",
    style: "Angola",
    description: "The combat path. Resistance, strength, and unbreakable spirit.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_besouro",
        title: "Legendary Warrior",
        unlocks: ["resistance_training", "warrior_spirit"],
      },
      {
        order: 2,
        mestre: "mestre_valmir",
        title: "Artistic Warrior",
        unlocks: ["combat_artistry", "expressive_power"],
      },
      {
        order: 3,
        mestre: "mestre_moraes",
        title: "Global Warrior",
        unlocks: ["international_style", "cultural_integration"],
      },
    ],
    reward: {
      title: "Unbreakable Warrior",
      cosmetic: "Besouro's Resilience Crown",
      bonus: "+20% resilience and combat effectiveness",
    },
  },

  // CANJIQUINHA LINEAGE → Rhythmic Masters
  "mestre_canjiquinha": {
    name: "Canjiquinha Lineage — The Rhythm Way",
    founder: "mestre_canjiquinha",
    style: "Regional",
    description: "The musical path. Rhythm becomes movement, movement becomes music.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_canjiquinha",
        title: "Rhythm Founder",
        unlocks: ["rhythmic_foundation", "musical_sync"],
      },
      {
        order: 2,
        mestre: "mestre_valmir",
        title: "Dance Integration",
        unlocks: ["dance_fusion", "artistic_rhythm"],
      },
      {
        order: 3,
        mestre: "mestre_sergio",
        title: "Martial Rhythm Synthesis",
        unlocks: ["martial_rhythm", "cross_cultural_sync"],
      },
    ],
    reward: {
      title: "Rhythm Master",
      cosmetic: "Canjiquinha's Musical Crown",
      bonus: "+25% rhythm mastery and berimbau synchronization",
    },
  },

  // CONTEMPORARY LINEAGE → Modern Masters
  "mestre_toni_vargas": {
    name: "Contemporary Lineage — The Modern Way",
    founder: "mestre_toni_vargas",
    style: "Contemporary",
    description: "The evolution path. Honor tradition while embracing the future.",
    progressionPath: [
      {
        order: 1,
        mestre: "mestre_toni_vargas",
        title: "Global Ambassador",
        unlocks: ["modern_teaching", "global_reach"],
      },
      {
        order: 2,
        mestre: "mestre_cobra_additional",
        title: "Digital Pioneer",
        unlocks: ["digital_mastery", "modern_accessibility"],
      },
      {
        order: 3,
        mestre: "mestre_paulo_santos",
        title: "Evolution Guide",
        unlocks: ["future_capoeira", "innovation_mastery"],
      },
    ],
    reward: {
      title: "Modern Master",
      cosmetic: "Contemporary Crown",
      bonus: "+20% teaching effectiveness and global influence",
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// PROGRESSION TREE VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Get lineage progression for a Mestre
 * Shows the teaching path they belong to
 */
export function getMestreLineage(mestreId) {
  for (const lineageKey in MESTRE_LINEAGES) {
    const lineage = MESTRE_LINEAGES[lineageKey];
    const mestreInLineage = lineage.progressionPath.find((p) => p.mestre === mestreId);
    if (mestreInLineage) {
      return {
        ...lineage,
        currentMestre: mestreInLineage,
        nextMestres: lineage.progressionPath.filter((p) => p.order > mestreInLineage.order),
        previousMestres: lineage.progressionPath.filter((p) => p.order < mestreInLineage.order),
      };
    }
  }
  return null;
}

/**
 * Get next Mestre to defeat in a lineage
 */
export function getNextMestreInLineage(mestreId) {
  const lineage = getMestreLineage(mestreId);
  if (!lineage || !lineage.nextMestres.length) return null;
  return lineage.nextMestres[0]; // Next in order
}

/**
 * Create simplified lineage groupings for newer Mestres not yet in detailed progressions
 * These show style-based collections rather than strict historical lineages
 */
const STYLE_LINEAGES = {
  "angola_traditionalists": {
    name: "Angola Traditionalists — The Path of Patience",
    founder: "angola_traditionalists",
    style: "Angola",
    description: "Masters who preserved the ancestral Angola game through deep meditation and malícia.",
    progressionPath: [
      { order: 1, mestre: "mestre_pastinha", title: "Founder of Angola", unlocks: ["angola_foundation"] },
      { order: 2, mestre: "mestre_caiçara", title: "Deep Angola Keeper", unlocks: ["angola_depth"] },
      { order: 3, mestre: "mestre_cobra_mansa", title: "The Patient Artist", unlocks: ["flow_mastery"] },
      { order: 4, mestre: "mestre_gato_preto", title: "The Deceptive Master", unlocks: ["deception_mastery"] },
      { order: 5, mestre: "mestre_santo_amaro", title: "The Spiritual Warrior", unlocks: ["spiritual_mastery"] },
    ],
    reward: { title: "Angola Elder", cosmetic: "Ancestral Wisdom Crown", bonus: "+20% Angola fluency" },
  },

  "regional_strikers": {
    name: "Regional Strikers — The Path of Power",
    founder: "regional_strikers",
    style: "Regional",
    description: "Masters who weaponized Capoeira with systematic kicks and relentless speed.",
    progressionPath: [
      { order: 1, mestre: "mestre_bimba", title: "Founder of Regional", unlocks: ["regional_foundation"] },
      { order: 2, mestre: "mestre_brasilia_ferrez", title: "The Regional Pioneer", unlocks: ["regional_evolution"] },
      { order: 3, mestre: "mestre_gildo", title: "The Relentless Striker", unlocks: ["speed_mastery"] },
      { order: 4, mestre: "mestre_grão", title: "The Tactical Master", unlocks: ["strategy_mastery"] },
      { order: 5, mestre: "mestre_talo", title: "The Bridge Builder", unlocks: ["hybrid_mastery"] },
    ],
    reward: { title: "Regional Master", cosmetic: "Strategic Crown", bonus: "+20% Regional speed" },
  },

  "contemporary_artists": {
    name: "Contemporary Artists — The Path of Freedom",
    founder: "contemporary_artists",
    style: "Contemporary",
    description: "Masters who liberated Capoeira, creating aerial innovations and freestyle expression.",
    progressionPath: [
      { order: 1, mestre: "mestre_polêmica", title: "Contemporary Virtuoso", unlocks: ["contemporary_foundation"] },
      { order: 2, mestre: "mestre_zulu", title: "The Aerial Pioneer", unlocks: ["aerial_mastery"] },
      { order: 3, mestre: "mestre_david_moura", title: "The Contemporarian", unlocks: ["freestyle_mastery"] },
      { order: 4, mestre: "mestre_amen", title: "The Freedom Seeker", unlocks: ["liberation_mastery"] },
      { order: 5, mestre: "mestre_pe_de_bananeira", title: "The Aerial Innovator", unlocks: ["inversion_mastery"] },
    ],
    reward: { title: "Contemporary Master", cosmetic: "Freedom Crown", bonus: "+20% Contemporary flow" },
  },

  "historical_keepers": {
    name: "Historical Keepers — The Path of Wisdom",
    founder: "historical_keepers",
    style: "Angola/Mixed",
    description: "Ancient masters who encoded Capoeira's spiritual essence into movement and rhythm.",
    progressionPath: [
      { order: 1, mestre: "mestre_canjiquinha", title: "The Mangueira Legend", unlocks: ["historical_foundation"] },
      { order: 2, mestre: "mestre_moa_cartorio", title: "The Wise Keeper", unlocks: ["wisdom_mastery"] },
      { order: 3, mestre: "mestre_moraes", title: "The Defender", unlocks: ["defense_mastery"] },
      { order: 4, mestre: "mestre_sinha", title: "The Lion Heart", unlocks: ["power_mastery"] },
      { order: 5, mestre: "mestre_suassuna", title: "The Capoeira Poet", unlocks: ["poetry_mastery"] },
    ],
    reward: { title: "Keeper of Wisdom", cosmetic: "Ancestral Keeper's Crown", bonus: "+20% heritage mastery" },
  },

  "hybrid_masters": {
    name: "Hybrid Masters — The Path of Balance",
    founder: "hybrid_masters",
    style: "Angola/Regional/Contemporary",
    description: "Masters who bridged styles, creating unique syntheses that transcend tradition.",
    progressionPath: [
      { order: 1, mestre: "mestre_waldemar", title: "Hybrid Synthesizer", unlocks: ["hybrid_foundation"] },
      { order: 2, mestre: "mestre_bom_jesus", title: "The Powerful Traditionalist", unlocks: ["strength_mastery"] },
      { order: 3, mestre: "mestre_nenel", title: "The Teaching Master", unlocks: ["teaching_mastery"] },
      { order: 4, mestre: "mestre_acordeon", title: "The Musical Master", unlocks: ["rhythm_mastery"] },
      { order: 5, mestre: "mestre_nô", title: "The Patient Strategist", unlocks: ["patience_mastery"] },
    ],
    reward: { title: "Master of All Ways", cosmetic: "Harmonic Crown", bonus: "+20% versatility" },
  },

  "aerial_dancers": {
    name: "Aerial Dancers — The Path of Sky",
    founder: "aerial_dancers",
    style: "Contemporary/Aerial",
    description: "Masters who conquered gravity itself, making the impossible dance.",
    progressionPath: [
      { order: 1, mestre: "mestre_joao_grande", title: "Hawk of the Sky", unlocks: ["aerial_foundation"] },
      { order: 2, mestre: "mestre_caiçara", title: "Deep Angola Keeper", unlocks: ["grounded_aerial"] },
      { order: 3, mestre: "mestre_papai", title: "The Fast Master", unlocks: ["speed_aerial"] },
      { order: 4, mestre: "mestre_gato_preto", title: "The Deceptive Master", unlocks: ["deceptive_aerial"] },
    ],
    reward: { title: "Sky Master", cosmetic: "Aerial Crown", bonus: "+20% inversion safety" },
  },
};

/**
 * Get all lineages (includes both historical lineages and style-based groupings)
 */
export function getAllLineages() {
  return [...Object.values(MESTRE_LINEAGES), ...Object.values(STYLE_LINEAGES)];
}

/**
 * Get lineage progress: how many in this lineage have been defeated
 */
export function getLineageProgress(lineageKey, defeatedMestres) {
  const lineage = MESTRE_LINEAGES[lineageKey];
  if (!lineage) return null;

  const defeated = lineage.progressionPath.filter((p) =>
    defeatedMestres.includes(p.mestre)
  ).length;

  return {
    lineageName: lineage.name,
    defeated,
    total: lineage.progressionPath.length,
    percentComplete: Math.round((defeated / lineage.progressionPath.length) * 100),
    isComplete: defeated === lineage.progressionPath.length,
    reward: lineage.reward,
  };
}
