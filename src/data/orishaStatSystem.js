// ═══════════════════════════════════════════════════════════════════════════════════
// ORISHA STAT SYSTEM — Integration Bonuses & Compound Effects
// Solo Leveling Capoeira Training App
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Each Orisha provides unique stat bonuses when integrated into the player.
 * Bonuses compound as more Orishas are integrated.
 * Ehi ascension (all 16 integrated) unlocks transcendent bonuses.
 */

export const ORISHA_STAT_BONUSES = {
  // TIER 1: PARAMOUNT ORISHAS
  orisha_ogun: {
    name: "Ogun",
    strength: 0.12,        // +12% strength per rep
    resilience: 0.08,      // +8% resilience
    spiritualMastery: 15,  // +15 flat
    description: "Warrior strength flows through you. Your power is undeniable.",
  },

  orisha_obatala: {
    name: "Obatala",
    wisdom: 0.10,          // +10% wise decision-making (fewer mistakes)
    resilience: 0.10,      // +10% resilience
    spiritualMastery: 12,  // +12 flat
    description: "Ancient wisdom guides your movements. Patience grants power.",
  },

  orisha_yemaya: {
    name: "Yemaya",
    adaptability: 0.08,    // +8% flexibility in transitions
    speed: 0.06,           // +6% speed
    spiritualMastery: 12,  // +12 flat
    description: "Like water, you flow and adapt. Flexibility is strength.",
  },

  orisha_shango: {
    name: "Shango",
    strength: 0.10,        // +10% strength
    speed: 0.09,           // +9% speed
    spiritualMastery: 14,  // +14 flat
    description: "Lightning fills your movements. Explosive power ignites.",
  },

  orisha_oshun: {
    name: "Oshun",
    grace: 0.08,           // +8% form quality (fewer form breaks)
    speed: 0.07,           // +7% speed
    spiritualMastery: 11,  // +11 flat
    description: "Grace and beauty elevate every movement.",
  },

  orisha_oya: {
    name: "Oya",
    speed: 0.10,           // +10% speed
    adaptability: 0.09,    // +9% adaptability
    spiritualMastery: 13,  // +13 flat
    description: "Wind-like speed and transformation power flows.",
  },

  orisha_elegba: {
    name: "Elegba",
    malicia: 0.12,         // +12% malícia tree progression
    adaptability: 0.08,    // +8% adaptability
    spiritualMastery: 12,  // +12 flat
    description: "Cunning and trickery sharpen your malícia.",
  },

  orisha_ifa: {
    name: "Ifa",
    foresight: 0.10,       // +10% anticipation accuracy
    wisdom: 0.09,          // +9% pattern recognition
    spiritualMastery: 16,  // +16 flat (oracle!)
    description: "Foresight and pattern mastery grant divine knowledge.",
  },

  // TIER 2: MAJOR ORISHAS
  orisha_babaluaye: {
    name: "Babaluaye",
    resilience: 0.12,      // +12% resilience (healing)
    recovery: 0.15,        // +15% recovery speed from fatigue
    spiritualMastery: 12,  // +12 flat
    description: "Healing energy mends your body and spirit.",
  },

  orisha_ibeji: {
    name: "Ibeji",
    balance: 0.10,         // +10% balance in asymmetric movements
    speed: 0.08,           // +8% speed
    spiritualMastery: 11,  // +11 flat
    description: "Twin balance and harmony flow through you.",
  },

  orisha_aje: {
    name: "Aje",
    abundance: 0.08,       // +8% XP generation
    growth: 0.09,          // +9% progression speed
    spiritualMastery: 13,  // +13 flat
    description: "Abundance multiplies your growth exponentially.",
  },

  orisha_oshosi: {
    name: "Oshosi",
    precision: 0.11,       // +11% precision in kicks/strikes
    focus: 0.09,           // +9% focus (fewer distractions)
    spiritualMastery: 12,  // +12 flat
    description: "Hunter's precision and focus sharpen every technique.",
  },

  orisha_nana_buruku: {
    name: "Nana Buruku",
    wisdom: 0.11,          // +11% ancestral wisdom
    resilience: 0.09,      // +9% resilience (ancient strength)
    spiritualMastery: 15,  // +15 flat (elder!)
    description: "Ancestral knowledge grants timeless strength.",
  },

  orisha_erinle: {
    name: "Erinle",
    healing: 0.12,         // +12% healing
    harmony: 0.10,         // +10% movement harmony
    spiritualMastery: 12,  // +12 flat
    description: "Healing waters restore you completely.",
  },

  orisha_oba: {
    name: "Oba",
    partnership: 0.10,     // +10% team synergy
    power: 0.08,           // +8% combined power
    spiritualMastery: 11,  // +11 flat
    description: "Partnership and unity amplify your strength.",
  },

  orisha_shun: {
    name: "Shun",
    expression: 0.09,      // +9% self-expression (personalization)
    creativity: 0.08,      // +8% creative technique variation
    spiritualMastery: 10,  // +10 flat
    description: "Personal expression flows uniquely through you.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// EHI ASCENSION BONUSES (all 16 integrated)
// ═══════════════════════════════════════════════════════════════════════════════════

export const EHI_BONUSES = {
  allStats: 1.5,              // +50% to all stat effects
  xpGeneration: 2.0,          // 2× XP from all activities
  spiritualMastery: 100,      // +100 flat bonus
  repThreshold: 0.5,          // Rep thresholds reduced by 50%
  recoveryMultiplier: 1.8,    // 80% faster recovery
  repMultiplier: 1.5,         // 50% more reps count
};

// ═══════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Calculate total stat bonuses from integrated Orishas
 * @param {string[]} integratedOrishaIds - Array of integrated Orisha IDs
 * @param {boolean} isEhiAscended - Whether all 16 are integrated
 * @returns {Object} Aggregated stat bonuses
 */
export function calculateIntegrationBonuses(integratedOrishaIds, isEhiAscended = false) {
  const baseBonuses = {
    strength: 0,
    speed: 0,
    resilience: 0,
    wisdom: 0,
    adaptability: 0,
    malicia: 0,
    foresight: 0,
    balance: 0,
    precision: 0,
    grace: 0,
    healing: 0,
    recovery: 0,
    spiritualMastery: 0,
    abundance: 0,
    growth: 0,
    harmony: 0,
    partnership: 0,
    expression: 0,
    creativity: 0,
    focus: 0,
    power: 0,
  };

  // Sum bonuses from each integrated Orisha
  integratedOrishaIds.forEach((orishaId) => {
    const bonus = ORISHA_STAT_BONUSES[orishaId];
    if (bonus) {
      Object.entries(bonus).forEach(([stat, value]) => {
        if (stat !== "name" && stat !== "description" && stat in baseBonuses) {
          baseBonuses[stat] += value;
        }
      });
    }
  });

  // Apply Ehi multiplier if ascended
  if (isEhiAscended) {
    Object.keys(baseBonuses).forEach((stat) => {
      if (stat !== "spiritualMastery") {
        baseBonuses[stat] *= EHI_BONUSES.allStats;
      }
    });
    baseBonuses.spiritualMastery = (baseBonuses.spiritualMastery || 0) + EHI_BONUSES.spiritualMastery;
  }

  return baseBonuses;
}

/**
 * Calculate rep thresholds with integration bonuses applied
 * @param {Object} baseTresholds - Base rep thresholds by level
 * @param {Object} bonuses - Aggregated bonuses from calculateIntegrationBonuses
 * @returns {Object} Adjusted thresholds
 */
export function applyBonusesToRepThresholds(baseThresholds, bonuses) {
  const adjusted = { ...baseThresholds };

  // Reduce thresholds based on growth/abundance bonuses
  const reductionMultiplier = 1 - Math.min((bonuses.abundance || 0) / 100, 0.2); // Max 20% reduction

  Object.keys(adjusted).forEach((level) => {
    adjusted[level] = Math.ceil(adjusted[level] * reductionMultiplier);
  });

  return adjusted;
}

/**
 * Calculate XP earned from a training session with integration bonuses
 * @param {number} baseXP - Base XP before bonuses
 * @param {Object} bonuses - Aggregated bonuses
 * @param {boolean} isEhiAscended - Whether in prestige mode
 * @returns {number} Final XP earned
 */
export function calculateXPWithBonuses(baseXP, bonuses, isEhiAscended = false) {
  let xp = baseXP;

  // Apply abundance bonus
  if (bonuses.abundance) {
    xp *= 1 + bonuses.abundance;
  }

  // Apply Ehi 2× multiplier
  if (isEhiAscended) {
    xp *= EHI_BONUSES.xpGeneration;
  }

  return Math.round(xp);
}

/**
 * Get descriptive text of which bonuses are active
 * @param {Object} bonuses - Aggregated bonuses
 * @returns {string[]} Array of bonus descriptions
 */
export function getBonusDescriptions(bonuses) {
  const descriptions = [];

  if (bonuses.strength > 0) {
    descriptions.push(`⚔ Strength +${Math.round(bonuses.strength * 100)}%`);
  }
  if (bonuses.speed > 0) {
    descriptions.push(`⚡ Speed +${Math.round(bonuses.speed * 100)}%`);
  }
  if (bonuses.resilience > 0) {
    descriptions.push(`🛡 Resilience +${Math.round(bonuses.resilience * 100)}%`);
  }
  if (bonuses.malicia > 0) {
    descriptions.push(`🎭 Malícia +${Math.round(bonuses.malicia * 100)}%`);
  }
  if (bonuses.recovery > 0) {
    descriptions.push(`💚 Recovery +${Math.round(bonuses.recovery * 100)}%`);
  }
  if (bonuses.spiritualMastery > 0) {
    descriptions.push(`✨ Spiritual Mastery +${Math.round(bonuses.spiritualMastery)}`);
  }

  return descriptions;
}

export function getOrishaById(id) {
  return ORISHA_STAT_BONUSES[id];
}
