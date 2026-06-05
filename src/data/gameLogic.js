/**
 * gameLogic.js — pure functions extracted from useStore for testability.
 * No React, no hooks, no side effects. Import anywhere including test files.
 */

export const XP_PER_LEVEL_VALUE = 600;
export const RAW_MASTERY_THRESHOLDS = [0, 5, 50, 200, 600, 1200];
export const MASTERY_LABELS = ["Locked", "Aware", "Drilling", "Owning", "Flowing", "Instinct"];

/**
 * Compute the VIG (Vigor) score from hydration (ml) and sleep (hours).
 * Max: 9999. Perfect day: 3500ml + 9h.
 * 64 oz (~1893ml) hits ~27% of the hydration component = VIG ~2700 from water alone.
 */
export function computeVIG({ hydrationMl = 0, sleepHours = 0 } = {}) {
  const h = Number.isFinite(hydrationMl) ? hydrationMl : 0;
  const s = Number.isFinite(sleepHours) ? sleepHours : 0;
  return Math.min(9999, Math.round((h / 3500) * 5000 + (s / 9) * 4999));
}

/**
 * Prestige multiplier applied to all XP grants.
 * Formula: (1 + orishasCount × 0.02) × (prestigeMode ? 2 : 1)
 * No Orishas, no prestige → 1.0 (no bonus).
 * 16 Orishas, no prestige → 1.32.
 * 16 Orishas + prestige → 2.64.
 */
export function computePrestigeMultiplier({ orishasCount = 0, prestigeMode = false } = {}) {
  const integratedBonus = 1 + (orishasCount * 0.02);
  const ehiBonus = prestigeMode ? 2 : 1;
  return integratedBonus * ehiBonus;
}

/**
 * Calculate adjusted mastery thresholds factoring in Orisha strength bonus.
 * Strength bonus: min(orishasCount × 0.05, 0.30) — max 30% reduction.
 * Threshold 0 (locked) is always 0.
 */
export function computeMasteryThresholds(orishasCount = 0) {
  const strengthBonus = Math.min(orishasCount * 0.05, 0.30);
  if (strengthBonus === 0) return [...RAW_MASTERY_THRESHOLDS];
  return RAW_MASTERY_THRESHOLDS.map((t, i) =>
    i === 0 ? 0 : Math.max(1, Math.ceil(t * (1 - strengthBonus)))
  );
}

/**
 * Determine mastery level from total reps, given a thresholds array.
 * Starts from currentLevel (never goes backwards).
 * Returns new mastery level (1–5).
 */
export function computeMasteryLevel(totalReps, currentLevel = 1, thresholds = RAW_MASTERY_THRESHOLDS) {
  let level = currentLevel;
  for (let lvl = currentLevel + 1; lvl <= 5; lvl++) {
    if (totalReps >= thresholds[lvl]) level = lvl;
    else break;
  }
  return level;
}

/**
 * XP awarded when mastery auto-advances.
 * Formula: 50 × tier × newLevel × prestigeMultiplier
 */
export function computeMasteryXP(tier = 1, newLevel = 1, prestigeMultiplier = 1) {
  return Math.round(50 * tier * newLevel * prestigeMultiplier);
}

/**
 * Level from total XP. Level 1 starts at 0 XP.
 */
export function computeLevel(totalXP, xpPerLevel = XP_PER_LEVEL_VALUE) {
  return Math.floor(totalXP / xpPerLevel) + 1;
}

/**
 * XP needed to reach a given level.
 */
export function xpForLevel(level, xpPerLevel = XP_PER_LEVEL_VALUE) {
  return (level - 1) * xpPerLevel;
}

/**
 * Progress percentage within the current level (0–100).
 */
export function levelProgress(totalXP, xpPerLevel = XP_PER_LEVEL_VALUE) {
  return ((totalXP % xpPerLevel) / xpPerLevel) * 100;
}
