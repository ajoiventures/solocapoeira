/**
 * haptics.js — Tactile feedback patterns via navigator.vibrate.
 * Silently no-ops on unsupported devices (iOS Safari, desktop).
 */

function vibrate(pattern) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch { /* ignore */ }
}

export const haptics = {
  /** Short single tap — quest item done, button confirm */
  light: ()   => vibrate(30),

  /** Double tap — mastery advance, rep logged */
  advance: () => vibrate([40, 20, 40]),

  /** Triple punch — achievement unlocked */
  achievement: () => vibrate([60, 25, 60, 25, 60]),

  /** Rank up — sustained rumble */
  rankUp: () => vibrate([100, 40, 100, 40, 200]),

  /** Mestre defeat — dramatic pattern */
  victory: () => vibrate([80, 40, 80, 40, 80, 40, 160]),

  /** Orisha integration — rising pattern */
  orisha: () => vibrate([40, 20, 60, 20, 100, 20, 160]),

  /** Ehi ascension — full celebration */
  ehi: () => vibrate([100, 30, 100, 30, 200, 30, 100, 30, 400]),
};
