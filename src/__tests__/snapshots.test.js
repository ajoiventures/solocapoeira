/**
 * snapshots.test.js — A-QA-06
 * Data snapshot tests: lock the shape of critical data structures.
 * If a refactor silently changes state schema, achievement list, game math output,
 * or movement data shape — these tests catch it before it reaches users.
 *
 * Run: npm test
 * Update snapshots (after intentional changes): npm test -- --update-snapshots
 */

import { describe, it, expect } from "vitest";
import { computeVIG, computePrestigeMultiplier, computeMasteryLevel } from "../data/gameLogic.js";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { MOVEMENTS } from "../data/movements.js";
import { getAllMestres } from "../data/mestres.js";
import { getAllCoreOrishas } from "../data/orishas.js";
import { MONTHLY_CHALLENGES } from "../data/monthlyChallenges.js";
import { BONUS_CHALLENGES } from "../data/bonusChallenges.js";

// ──────────────────────────────────────────────────────────────────
// Game logic output snapshots
// Catches silent regressions in the core math — e.g., if VIG formula changes,
// or mastery thresholds shift, these fail immediately.
// ──────────────────────────────────────────────────────────────────
describe("Game logic — output snapshots", () => {
  it("computeVIG: full hydration + full sleep = max VIG", () => {
    const vig = computeVIG({ hydrationMl: 3500, sleepHours: 9 });
    expect(vig).toMatchInlineSnapshot(`9999`);
  });

  it("computeVIG: half hydration + half sleep = ~half VIG", () => {
    const vig = computeVIG({ hydrationMl: 1750, sleepHours: 4.5 });
    expect(vig).toMatchInlineSnapshot(`5000`);
  });

  it("computeVIG: zero inputs = 0", () => {
    expect(computeVIG({ hydrationMl: 0, sleepHours: 0 })).toMatchInlineSnapshot(`0`);
  });

  it("computePrestigeMultiplier: no orishas, no prestige = 1.0", () => {
    expect(computePrestigeMultiplier({ orishasCount: 0, prestigeMode: false }))
      .toMatchInlineSnapshot(`1`);
  });

  it("computePrestigeMultiplier: 8 orishas + prestige mode", () => {
    expect(computePrestigeMultiplier({ orishasCount: 8, prestigeMode: true }))
      .toMatchInlineSnapshot(`2.32`);
  });

  it("computePrestigeMultiplier: 16 orishas (Ehi) + prestige mode", () => {
    expect(computePrestigeMultiplier({ orishasCount: 16, prestigeMode: true }))
      .toMatchInlineSnapshot(`2.64`);
  });

  it("computeMasteryLevel: mastery thresholds are [0,5,50,200,600,1200]", () => {
    expect(computeMasteryLevel(0, 1)).toMatchInlineSnapshot(`1`);    // Aware
    expect(computeMasteryLevel(5, 1)).toMatchInlineSnapshot(`1`);    // still Aware (threshold exclusive)
    expect(computeMasteryLevel(50, 1)).toMatchInlineSnapshot(`2`);   // Drilling
    expect(computeMasteryLevel(200, 1)).toMatchInlineSnapshot(`3`);  // Owning
    expect(computeMasteryLevel(600, 1)).toMatchInlineSnapshot(`4`);  // Flowing
    expect(computeMasteryLevel(1200, 1)).toMatchInlineSnapshot(`5`); // Instinct
  });
});

// ──────────────────────────────────────────────────────────────────
// Data count snapshots
// Catches accidental deletions or duplications of data records.
// ──────────────────────────────────────────────────────────────────
describe("Data counts — snapshot", () => {
  it("total movements count", () => {
    expect(MOVEMENTS.length).toMatchInlineSnapshot(`238`);
  });

  it("achievements count = 25", () => {
    expect(ACHIEVEMENTS.length).toMatchInlineSnapshot(`25`);
  });

  it("Mestres count", () => {
    expect(getAllMestres().length).toMatchInlineSnapshot(`43`);
  });

  it("Core Orishas count", () => {
    expect(getAllCoreOrishas().length).toMatchInlineSnapshot(`16`);
  });

  it("monthly challenges = 12", () => {
    expect(MONTHLY_CHALLENGES.length).toMatchInlineSnapshot(`12`);
  });

  it("bonus challenges = 30", () => {
    expect(BONUS_CHALLENGES.length).toMatchInlineSnapshot(`30`);
  });
});

// ──────────────────────────────────────────────────────────────────
// Data shape snapshots
// Catches field renames or schema changes in key data records.
// ──────────────────────────────────────────────────────────────────
describe("Data shapes — snapshot", () => {
  it("Movement record shape (ginga)", () => {
    const ginga = MOVEMENTS.find(m => m.id === "ginga");
    expect(Object.keys(ginga).sort()).toMatchInlineSnapshot(`
      [
        "category",
        "commonWeaknesses",
        "difficulty",
        "drillCards",
        "id",
        "masteryTest",
        "meaning",
        "name",
        "notes",
        "physicalRequirements",
        "prerequisites",
        "progressions",
        "sourceUrl",
        "tier",
        "tree",
        "tutorialUrl",
        "unlockTest",
        "videoUrl",
      ]
    `);
  });

  it("Achievement record shape", () => {
    const first = ACHIEVEMENTS[0];
    expect(Object.keys(first).sort()).toMatchInlineSnapshot(`
      [
        "category",
        "color",
        "desc",
        "icon",
        "id",
        "title",
      ]
    `);
  });

  it("Monthly challenge record shape", () => {
    expect(Object.keys(MONTHLY_CHALLENGES[0]).sort()).toMatchInlineSnapshot(`
      [
        "color",
        "desc",
        "icon",
        "month",
        "movementId",
        "target",
        "title",
        "unit",
      ]
    `);
  });

  it("Mestre record has required fields", () => {
    const bimba = getAllMestres().find(m => m.id === "mestre_bimba");
    expect(bimba).toBeTruthy();
    expect(bimba.name).toMatchInlineSnapshot(`"Mestre Bimba"`);
    expect(Array.isArray(bimba.requirements)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────────
// Achievement IDs snapshot
// Locks the full set of achievement IDs — adding/removing/renaming any
// achievement without updating this test is caught immediately.
// ──────────────────────────────────────────────────────────────────
describe("Achievement IDs — locked set", () => {
  it("all achievement IDs match expected set", () => {
    const ids = ACHIEVEMENTS.map(a => a.id).sort();
    expect(ids).toMatchInlineSnapshot(`
      [
        "all_mestres",
        "concept_tree_maxed",
        "ehi_ascended",
        "first_100_reps",
        "first_boss",
        "first_instinct",
        "first_mastery",
        "first_mestre",
        "first_orisha",
        "first_owning",
        "first_session",
        "five_instinct",
        "five_mestres",
        "five_orishas",
        "rank_C",
        "rank_E",
        "rank_G",
        "rank_S",
        "reps_1000",
        "reps_10000",
        "sessions_10",
        "sessions_50",
        "streak_3",
        "streak_30",
        "streak_7",
      ]
    `);
  });
});

// ──────────────────────────────────────────────────────────────────
// Movement tree distribution
// Catches major reclassification of movements across trees.
// ──────────────────────────────────────────────────────────────────
describe("Movement tree distribution — snapshot", () => {
  it("movement counts per tree", () => {
    const counts = MOVEMENTS.reduce((acc, m) => {
      acc[m.tree] = (acc[m.tree] || 0) + 1;
      return acc;
    }, {});
    // Sort by tree name for determinism
    const sorted = Object.fromEntries(Object.entries(counts).sort());
    expect(sorted).toMatchInlineSnapshot(`
      {
        "Angola": 8,
        "Au": 22,
        "Bananeira": 13,
        "Combination": 6,
        "Conditioning": 11,
        "Contemporary": 5,
        "Defense": 2,
        "Flip": 3,
        "Floor Game": 8,
        "Foot": 10,
        "Foundation": 34,
        "Ground": 2,
        "Kick": 36,
        "Macaco": 13,
        "Malandragem": 5,
        "Malícia": 9,
        "Mandinga": 9,
        "Punch": 2,
        "Queda de Rins": 7,
        "Regional": 5,
        "Strength": 8,
        "Strike": 2,
        "Sweep": 18,
      }
    `);
  });
});
