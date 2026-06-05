/**
 * statePersistence.test.js
 * Tests that the state schema handles new keys correctly when loading old saves.
 * Deep-merge must preserve new defaultState keys when they don't exist in saved data.
 * Schema changes that break old saves silently lose user data.
 */

import { describe, it, expect } from "vitest";
import { checkAchievements } from "../data/achievements.js";
import { computePrestigeMultiplier, computeVIG, computeMasteryLevel } from "../data/gameLogic.js";

// Simulate what a v1 save (pre-achievement system) looks like
const OLD_SAVE_V1 = {
  player: { totalXP: 1500, level: 3, streakDays: 7, lastTrainingDate: "2025-01-15" },
  movementProgress: {
    ginga:    { masteryLevel: 3, reps: 210, notes: "" },
    negativa: { masteryLevel: 2, reps: 60,  notes: "" },
  },
  sessionLog: [
    { date: "2025-01-15", xpEarned: 150, movements: ["ginga"] },
    { date: "2025-01-14", xpEarned: 100, movements: ["negativa"] },
  ],
  repLog: [
    { movementId: "ginga",    count: 50, date: "2025-01-15" },
    { movementId: "negativa", count: 20, date: "2025-01-14" },
  ],
  bossProgress: { foot_boss_1: { passed: true, passedAt: "2025-01-10" } },
  mestreProgress: {},
  orishasIntegrated: [],
  conceptTreeProgress: { mandinga: 1, malandragem: 0, malicia: 0 },
  painLog: {},
  restDays: [],
  apf: { recoveryLog: {} },
  // NOTE: earnedAchievements, graceTokens, lastKnownRank, bonusChallengesDone NOT present
  // These are new keys added after v1 — the deep-merge must handle them
};

// ──────────────────────────────────────────────────────────────────
// Deep-merge behaviour
// ──────────────────────────────────────────────────────────────────
describe("State persistence — old save compatibility", () => {
  it("checkAchievements works on v1 save (no earnedAchievements key)", () => {
    const stateWithMissingKey = { ...OLD_SAVE_V1 }; // no earnedAchievements
    expect(() => checkAchievements(stateWithMissingKey)).not.toThrow();
    const earned = checkAchievements(stateWithMissingKey);
    expect(Array.isArray(earned)).toBe(true);
  });

  it("checkAchievements detects first_session from v1 save", () => {
    const earned = checkAchievements(OLD_SAVE_V1);
    expect(earned).toContain("first_session");
  });

  it("checkAchievements detects streak_7 from 7-day streak in v1 save", () => {
    const earned = checkAchievements(OLD_SAVE_V1);
    expect(earned).toContain("streak_7");
  });

  it("checkAchievements detects first_owning from v1 mastery data", () => {
    const earned = checkAchievements(OLD_SAVE_V1);
    expect(earned).toContain("first_owning"); // ginga is at level 3 = Owning
  });

  it("checkAchievements detects first_boss from v1 bossProgress", () => {
    const earned = checkAchievements(OLD_SAVE_V1);
    expect(earned).toContain("first_boss");
  });

  it("never awards achievements already in earnedAchievements on reload", () => {
    const stateWithSome = {
      ...OLD_SAVE_V1,
      earnedAchievements: ["first_session", "streak_7", "first_boss"],
    };
    const earned = checkAchievements(stateWithSome);
    expect(earned).not.toContain("first_session");
    expect(earned).not.toContain("streak_7");
    expect(earned).not.toContain("first_boss");
  });
});

// ──────────────────────────────────────────────────────────────────
// Prestige multiplier with missing orishasIntegrated
// ──────────────────────────────────────────────────────────────────
describe("computePrestigeMultiplier — missing/undefined fields", () => {
  it("handles undefined orishasCount gracefully", () => {
    expect(() => computePrestigeMultiplier({})).not.toThrow();
    expect(computePrestigeMultiplier({})).toBe(1.0);
  });

  it("handles null orishasCount gracefully", () => {
    expect(computePrestigeMultiplier({ orishasCount: null })).toBe(1.0);
  });
});

// ──────────────────────────────────────────────────────────────────
// computeVIG with missing/corrupted recovery data
// ──────────────────────────────────────────────────────────────────
describe("computeVIG — malformed recovery log entries", () => {
  it("handles empty object (new day, nothing logged yet)", () => {
    expect(computeVIG({})).toBe(0);
  });

  it("handles partial entry (only hydration logged, no sleep)", () => {
    const vig = computeVIG({ hydrationMl: 2000 });
    expect(vig).toBeGreaterThan(0);
    expect(vig).toBeLessThan(9999);
  });

  it("handles partial entry (only sleep logged, no hydration)", () => {
    const vig = computeVIG({ sleepHours: 8 });
    expect(vig).toBeGreaterThan(0);
    expect(vig).toBeLessThan(9999);
  });

  it("handles string values that came from old localStorage (corrupted)", () => {
    // Old saves might have stored strings if there was a serialization bug
    const vig = computeVIG({ hydrationMl: "2000", sleepHours: "7" });
    // Should not crash — NaN guard handles this
    expect(Number.isNaN(vig)).toBe(false);
    expect(typeof vig).toBe("number");
  });
});

// ──────────────────────────────────────────────────────────────────
// computeMasteryLevel — missing movementProgress
// ──────────────────────────────────────────────────────────────────
describe("computeMasteryLevel — edge state scenarios", () => {
  it("new movement (never trained, reps=0, level=1) stays at 1", () => {
    expect(computeMasteryLevel(0, 1)).toBe(1);
  });

  it("movement loaded from save with high level stays high even at 0 reps delta", () => {
    // If a user has Instinct (5) and we add 0 reps, should never drop
    expect(computeMasteryLevel(0, 5)).toBe(5);
  });

  it("movement with many reps correctly advances through all levels", () => {
    // From 0 reps, 1200 total reps should reach Instinct
    const level = computeMasteryLevel(1200, 0);
    expect(level).toBe(5); // 0→Aware→Drilling→Owning→Flowing→Instinct
  });
});

// ──────────────────────────────────────────────────────────────────
// Monthly challenge progress calculation
// ──────────────────────────────────────────────────────────────────
describe("monthlyChallenges.js — getCurrentMonthChallenge", () => {
  it("returns a valid challenge for the current month", async () => {
    const { getCurrentMonthChallenge, MONTHLY_CHALLENGES } = await import("../data/monthlyChallenges.js");
    const c = getCurrentMonthChallenge();
    expect(c).toBeTruthy();
    expect(c.title).toBeTruthy();
    expect(c.target).toBeGreaterThan(0);
    expect(MONTHLY_CHALLENGES).toHaveLength(12);
  });
});
