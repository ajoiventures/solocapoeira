/**
 * gameLogic.test.js
 * Unit tests for core game math — the functions that already broke silently once.
 * Run: npm test
 */

import { describe, it, expect } from "vitest";
import {
  computeVIG,
  computePrestigeMultiplier,
  computeMasteryThresholds,
  computeMasteryLevel,
  computeMasteryXP,
  computeLevel,
  xpForLevel,
  levelProgress,
  RAW_MASTERY_THRESHOLDS,
} from "../data/gameLogic.js";

// ─────────────────────────────────────────────
// VIG — Vigor score
// ─────────────────────────────────────────────
describe("computeVIG", () => {
  it("returns 0 for no input", () => {
    expect(computeVIG()).toBe(0);
    expect(computeVIG({})).toBe(0);
  });

  it("caps at 9999 — never exceeds maximum", () => {
    expect(computeVIG({ hydrationMl: 9999, sleepHours: 24 })).toBe(9999);
  });

  it("perfect day (3500ml + 9h) hits 9999", () => {
    expect(computeVIG({ hydrationMl: 3500, sleepHours: 9 })).toBe(9999);
  });

  it("64 oz (≈1893ml) + 8h sleep produces meaningful VIG (>5000)", () => {
    // 64 oz = ~1893ml. Should hit >5000 combined with 8h sleep
    const vig = computeVIG({ hydrationMl: 1893, sleepHours: 8 });
    expect(vig).toBeGreaterThan(5000);
  });

  it("8 oz (≈237ml) + 0h sleep produces very low VIG (<500)", () => {
    expect(computeVIG({ hydrationMl: 237, sleepHours: 0 })).toBeLessThan(500);
  });

  it("sleep alone contributes to VIG", () => {
    const onlySleep = computeVIG({ hydrationMl: 0, sleepHours: 9 });
    expect(onlySleep).toBeGreaterThan(4000);
  });

  it("hydration alone contributes to VIG", () => {
    const onlyWater = computeVIG({ hydrationMl: 3500, sleepHours: 0 });
    expect(onlyWater).toBeGreaterThan(4000);
  });

  it("result is always a whole number", () => {
    const vig = computeVIG({ hydrationMl: 1000, sleepHours: 7 });
    expect(Number.isInteger(vig)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Prestige Multiplier — XP scaling
// ─────────────────────────────────────────────
describe("computePrestigeMultiplier", () => {
  it("no Orishas, no prestige → exactly 1.0 (no bonus)", () => {
    expect(computePrestigeMultiplier()).toBe(1.0);
    expect(computePrestigeMultiplier({ orishasCount: 0, prestigeMode: false })).toBe(1.0);
  });

  it("1 Orisha integrated → 1.02 multiplier", () => {
    expect(computePrestigeMultiplier({ orishasCount: 1 })).toBeCloseTo(1.02);
  });

  it("16 Orishas, no prestige → 1.32", () => {
    expect(computePrestigeMultiplier({ orishasCount: 16 })).toBeCloseTo(1.32);
  });

  it("prestige mode alone doubles (no Orishas) → 2.0", () => {
    expect(computePrestigeMultiplier({ orishasCount: 0, prestigeMode: true })).toBe(2.0);
  });

  it("16 Orishas + prestige mode → 2.64", () => {
    expect(computePrestigeMultiplier({ orishasCount: 16, prestigeMode: true })).toBeCloseTo(2.64);
  });

  it("multiplier is always >= 1.0", () => {
    expect(computePrestigeMultiplier({ orishasCount: 0, prestigeMode: false })).toBeGreaterThanOrEqual(1.0);
  });

  it("each Orisha adds exactly 0.02 to the base", () => {
    for (let i = 0; i <= 16; i++) {
      const m = computePrestigeMultiplier({ orishasCount: i, prestigeMode: false });
      expect(m).toBeCloseTo(1 + i * 0.02, 5);
    }
  });
});

// ─────────────────────────────────────────────
// Mastery Thresholds — Orisha strength reduction
// ─────────────────────────────────────────────
describe("computeMasteryThresholds", () => {
  it("0 Orishas → raw thresholds unchanged", () => {
    expect(computeMasteryThresholds(0)).toEqual(RAW_MASTERY_THRESHOLDS);
  });

  it("threshold 0 (Locked) is always 0 regardless of bonus", () => {
    expect(computeMasteryThresholds(16)[0]).toBe(0);
    expect(computeMasteryThresholds(6)[0]).toBe(0);
  });

  it("6 Orishas (30% max cap) → thresholds reduced by 30%", () => {
    // 6 × 0.05 = 0.30 — hits the cap
    const thresholds = computeMasteryThresholds(6);
    // threshold[1] = ceil(5 × 0.70) = ceil(3.5) = 4
    expect(thresholds[1]).toBe(4);
    // threshold[5] = ceil(1200 × 0.70) = 840
    expect(thresholds[5]).toBe(840);
  });

  it("bonus caps at 30% even with more Orishas", () => {
    const at6 = computeMasteryThresholds(6);
    const at16 = computeMasteryThresholds(16);
    expect(at6).toEqual(at16); // both hit the 30% cap
  });

  it("all thresholds remain >= 1 (except index 0)", () => {
    const thresholds = computeMasteryThresholds(16);
    thresholds.slice(1).forEach((t) => expect(t).toBeGreaterThanOrEqual(1));
  });

  it("thresholds are always ascending after reduction", () => {
    const thresholds = computeMasteryThresholds(4);
    for (let i = 1; i < thresholds.length; i++) {
      expect(thresholds[i]).toBeGreaterThan(thresholds[i - 1]);
    }
  });
});

// ─────────────────────────────────────────────
// Mastery Level — auto-advance logic
// ─────────────────────────────────────────────
describe("computeMasteryLevel", () => {
  it("below first threshold → stays at current level", () => {
    expect(computeMasteryLevel(4, 1)).toBe(1); // needs 5 for Drilling
  });

  it("exactly at threshold → advances to that level", () => {
    // thresholds = [0, 5, 50, 200, 600, 1200]
    // Loop starts at prevMastery+1, checks thresholds[lvl]
    // Starting at level 1 (Aware), loop checks thresholds[2]=50 for level 2 (Drilling)
    expect(computeMasteryLevel(50, 1)).toBe(2);   // 50 reps → Drilling
    expect(computeMasteryLevel(200, 1)).toBe(3);  // 200 reps → Owning
    expect(computeMasteryLevel(600, 1)).toBe(4);  // 600 reps → Flowing
    expect(computeMasteryLevel(1200, 1)).toBe(5); // 1200 reps → Instinct
  });

  it("starting from level 0 uses thresholds[1]=5 as first gate", () => {
    expect(computeMasteryLevel(4, 0)).toBe(0);  // below 5
    expect(computeMasteryLevel(5, 0)).toBe(1);  // exactly 5 → Aware
  });

  it("skips levels when reps jump multiple thresholds at once", () => {
    // Starting at Aware (1), 1200 reps → should reach Instinct (5)
    expect(computeMasteryLevel(1200, 1)).toBe(5);
  });

  it("never goes backwards — currentLevel is the floor", () => {
    // Even if reps are very low, level never drops below currentLevel
    expect(computeMasteryLevel(0, 3)).toBe(3);
    expect(computeMasteryLevel(0, 5)).toBe(5);
  });

  it("maxes out at 5 (Instinct)", () => {
    expect(computeMasteryLevel(99999, 1)).toBe(5);
  });

  it("1 rep below threshold does not advance", () => {
    // thresholds[3]=200 gates level 3, thresholds[4]=600 gates level 4, thresholds[5]=1200 gates level 5
    expect(computeMasteryLevel(49, 1)).toBe(1);   // needs thresholds[2]=50 for level 2
    expect(computeMasteryLevel(199, 2)).toBe(2);  // needs thresholds[3]=200 for level 3
    expect(computeMasteryLevel(599, 3)).toBe(3);  // needs thresholds[4]=600 for level 4
    expect(computeMasteryLevel(1199, 4)).toBe(4); // needs thresholds[5]=1200 for level 5
  });

  it("uses custom thresholds when provided", () => {
    const reduced = [0, 4, 35, 140, 420, 840]; // 30% reduction
    // Starting at level 1, need reduced[2]=35 for level 2
    expect(computeMasteryLevel(34, 1, reduced)).toBe(1); // just below
    expect(computeMasteryLevel(35, 1, reduced)).toBe(2); // exactly at threshold
    expect(computeMasteryLevel(840, 1, reduced)).toBe(5);
  });
});

// ─────────────────────────────────────────────
// Mastery XP — reward for advancing
// ─────────────────────────────────────────────
describe("computeMasteryXP", () => {
  it("tier 1, level 2, no prestige → 100 XP", () => {
    expect(computeMasteryXP(1, 2, 1.0)).toBe(100); // 50 × 1 × 2 × 1
  });

  it("tier 2, level 3, no prestige → 300 XP", () => {
    expect(computeMasteryXP(2, 3, 1.0)).toBe(300); // 50 × 2 × 3 × 1
  });

  it("prestige multiplier doubles XP when 2.0", () => {
    const base = computeMasteryXP(1, 2, 1.0);
    const prestige = computeMasteryXP(1, 2, 2.0);
    expect(prestige).toBe(base * 2);
  });

  it("XP scales with mastery level (higher level = more XP)", () => {
    const lvl2 = computeMasteryXP(1, 2, 1.0);
    const lvl5 = computeMasteryXP(1, 5, 1.0);
    expect(lvl5).toBeGreaterThan(lvl2);
  });

  it("result is always a whole number", () => {
    const xp = computeMasteryXP(2, 3, 1.32);
    expect(Number.isInteger(xp)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Level & XP progression
// ─────────────────────────────────────────────
describe("computeLevel", () => {
  it("0 XP → Level 1", () => {
    expect(computeLevel(0)).toBe(1);
  });

  it("599 XP → still Level 1 (just below threshold)", () => {
    expect(computeLevel(599)).toBe(1);
  });

  it("600 XP → Level 2", () => {
    expect(computeLevel(600)).toBe(2);
  });

  it("1200 XP → Level 3", () => {
    expect(computeLevel(1200)).toBe(3);
  });

  it("Green Cord rank requires level 8 → needs 4200 XP", () => {
    expect(computeLevel(4200)).toBe(8);
  });

  it("always positive", () => {
    expect(computeLevel(0)).toBeGreaterThan(0);
  });
});

describe("xpForLevel", () => {
  it("Level 1 requires 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("Level 2 requires 600 XP", () => {
    expect(xpForLevel(2)).toBe(600);
  });

  it("Level 100 requires 59400 XP", () => {
    expect(xpForLevel(100)).toBe(59400);
  });
});

describe("levelProgress", () => {
  it("0 XP → 0% progress", () => {
    expect(levelProgress(0)).toBe(0);
  });

  it("300 XP → 50% progress (halfway through Level 1)", () => {
    expect(levelProgress(300)).toBeCloseTo(50);
  });

  it("599 XP → ~99.8% progress", () => {
    expect(levelProgress(599)).toBeCloseTo(99.83, 1);
  });

  it("600 XP (Level 2 start) → 0% progress in new level", () => {
    expect(levelProgress(600)).toBe(0);
  });

  it("always returns 0–100", () => {
    [0, 100, 599, 600, 1200, 9999].forEach((xp) => {
      const p = levelProgress(xp);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    });
  });
});

// ─────────────────────────────────────────────
// Integration: XP grant chain
// ─────────────────────────────────────────────
describe("XP grant chain — prestige multiplier always applied", () => {
  it("no Orishas: 100 base XP → 100 awarded", () => {
    const mult = computePrestigeMultiplier({ orishasCount: 0, prestigeMode: false });
    expect(Math.round(100 * mult)).toBe(100);
  });

  it("16 Orishas: 100 base XP → 132 awarded", () => {
    const mult = computePrestigeMultiplier({ orishasCount: 16, prestigeMode: false });
    expect(Math.round(100 * mult)).toBe(132);
  });

  it("prestige mode: 100 base XP → 200 awarded", () => {
    const mult = computePrestigeMultiplier({ orishasCount: 0, prestigeMode: true });
    expect(Math.round(100 * mult)).toBe(200);
  });

  it("16 Orishas + prestige: 100 base XP → 264 awarded", () => {
    const mult = computePrestigeMultiplier({ orishasCount: 16, prestigeMode: true });
    expect(Math.round(100 * mult)).toBe(264);
  });

  it("mastery XP uses prestige multiplier", () => {
    const noPrestige = computeMasteryXP(1, 3, computePrestigeMultiplier({ orishasCount: 0 }));
    const withPrestige = computeMasteryXP(1, 3, computePrestigeMultiplier({ orishasCount: 0, prestigeMode: true }));
    expect(withPrestige).toBe(noPrestige * 2);
  });
});

// ─────────────────────────────────────────────
// Regression: bugs found in the Haiku audit
// ─────────────────────────────────────────────
describe("Regression tests — bugs found in audit", () => {
  it("BUG-01: prestige multiplier is never below 1.0 (was never applied = 0 bonus)", () => {
    // The multiplier was once not applied — this test would have caught it
    const mult = computePrestigeMultiplier({ orishasCount: 0, prestigeMode: false });
    expect(mult).toBe(1.0); // not 0, not undefined
    expect(typeof mult).toBe("number");
  });

  it("BUG-02: mastery never advances to level 0 (was possible with bad threshold logic)", () => {
    // currentLevel=1 with 0 reps should stay at 1, not drop to 0
    expect(computeMasteryLevel(0, 1)).toBe(1);
  });

  it("BUG-03: VIG does not return NaN for edge inputs", () => {
    expect(Number.isNaN(computeVIG({ hydrationMl: NaN, sleepHours: NaN }))).toBe(false);
    expect(Number.isNaN(computeVIG({ hydrationMl: undefined, sleepHours: undefined }))).toBe(false);
  });

  it("BUG-04: oz conversion (8oz = 237ml) produces valid VIG signal", () => {
    // 8 oz × 29.5735 = 236.6ml
    const oz8 = Math.round(8 * 29.5735);
    const vig = computeVIG({ hydrationMl: oz8, sleepHours: 0 });
    expect(vig).toBeGreaterThan(0);
    expect(vig).toBeLessThan(9999);
  });

  it("BUG-05: mastery thresholds with Orisha bonus never produce negative values", () => {
    const thresholds = computeMasteryThresholds(100); // even with absurd input
    thresholds.forEach((t) => expect(t).toBeGreaterThanOrEqual(0));
  });
});
