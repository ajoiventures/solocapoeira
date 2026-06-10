/**
 * snapshots.test.js — A-QA-06
 * Data snapshot tests: lock the shape of critical data structures.
 * If a refactor silently changes state schema, achievement list, game math output,
 * or movement data shape — these tests catch it before it reaches users.
 *
 * Run: npm test
 * Update snapshots (after intentional changes): npm test -- --update-snapshots
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, it, expect, vi } from "vitest";
import { computeVIG, computePrestigeMultiplier, computeMasteryLevel } from "../data/gameLogic.js";
import { ACHIEVEMENTS } from "../data/achievements.js";
import { MOVEMENTS } from "../data/movements.js";
import { getAllMestres } from "../data/mestres.js";
import { getAllCoreOrishas } from "../data/orishas.js";
import { MONTHLY_CHALLENGES } from "../data/monthlyChallenges.js";
import { BONUS_CHALLENGES } from "../data/bonusChallenges.js";
import DailyQuest from "../pages/DailyQuest.jsx";

const SNAPSHOT_DATE = "2026-06-06T14:00:00.000Z";
const SNAPSHOT_TODAY = "2026-06-06";

afterEach(() => {
  vi.useRealTimers();
});

function makeDailyStore(overrides = {}) {
  const state = {
    player: {
      totalXP: 0,
      level: 1,
      currentSprint: "sprint_1",
      currentWeek: 1,
      streakDays: 0,
      lastTrainingDate: null,
      spiritualPath: "Ogun (Core)",
      ...(overrides.player || {}),
    },
    todayQuest: {
      date: SNAPSHOT_TODAY,
      completed: [],
      skipped: [],
      bonusItems: [],
      bonusXP: 0,
      ...(overrides.todayQuest || {}),
    },
    movementProgress: overrides.movementProgress || {},
    repLog: overrides.repLog || [],
    sessionLog: overrides.sessionLog || [],
    stepsLog: overrides.stepsLog || {},
    bonusChallengesDone: overrides.bonusChallengesDone || {},
    painLog: overrides.painLog || {},
    restDays: overrides.restDays || [],
    graceTokens: overrides.graceTokens || 0,
    orishasIntegrated: overrides.orishasIntegrated || [],
    conceptTreeProgress: overrides.conceptTreeProgress || { malicia: 0, malandragem: 0, mandinga: 0 },
    bonusLogs: overrides.bonusLogs || {},
    apf: overrides.apf || { recoveryLog: {}, pillars: {} },
  };

  return {
    state,
    getTodayPain: () => state.painLog[SNAPSHOT_TODAY] || null,
    getRecoveryForDate: (date = SNAPSHOT_TODAY) => state.apf.recoveryLog?.[date] || { hydrationMl: 0, sleepHours: 0 },
    getHydrationOz: () => 0,
    logRecoveryOz: vi.fn(),
    completeQuestItem: vi.fn(),
    getStreakDays: () => ({ streak: state.player.streakDays || 0, inGrace: false }),
    getWeeklyConsistency: () => overrides.weeklyConsistency || { trained: 0, total: 7 },
    isRestDay: (date = SNAPSHOT_TODAY) => state.restDays.includes(date),
    getCurrentPhase: () => overrides.currentPhase || 1,
    getPhaseCompletionPercent: () => overrides.phaseCompletion ?? 0,
    canAdvanceToNextPhase: () => overrides.canAdvancePhase || false,
    getWeekSummary: () => overrides.weekSummary || { sessions: 0, xpEarned: 0, masteryAdvances: 0, repsLogged: 0 },
    getMasteryLevel: (id) => state.movementProgress[id]?.masteryLevel || 0,
    getMovementReps: (id) => state.movementProgress[id]?.reps || 0,
    isMestreDefeated: () => false,
    isOrishaIntegrated: () => false,
    markRestDay: vi.fn(),
    useGraceToken: vi.fn(),
    completeAllQuestsAndLog: vi.fn(),
    logSession: vi.fn(),
    logSteps: vi.fn(),
    incrementReps: vi.fn(),
    toggleBonusItem: vi.fn(),
    logBonusExercise: vi.fn(),
    completeBonusChallenge: vi.fn(),
  };
}

function renderDailySummary(store) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(SNAPSHOT_DATE));
  const html = renderToStaticMarkup(React.createElement(DailyQuest, { store, navigate: vi.fn() }));
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return {
    questCards: (html.match(/class="quest-item/g) || []).length,
    checkedQuestCards: (html.match(/quest-check checked/g) || []).length,
    completeButtons: (html.match(/aria-label="Complete /g) || []).length,
    undoButtons: (html.match(/aria-label="Undo /g) || []).length,
    hasDailyQuestHeader: text.includes("Daily Quest"),
    hasCompleteHeader: text.includes("Complete"),
    hasRestDayHeader: store.isRestDay(SNAPSHOT_TODAY),
    hasBonusQuest: text.includes("Bonus Quest"),
    hasLogSession: text.includes("Log Session"),
    hasBodyRequired: text.includes("Log body check") && text.includes("Required daily"),
    hasBodyLogged: text.includes("Body logged"),
    hasWeeklyReport: text.includes("This week") || text.includes("This Week"),
    hasRestSuggestion: text.includes("Take Rest Day"),
    progressText: (text.match(/\d\/5/) || [null])[0],
    weekText: (text.match(/Week \d+/) || [null])[0],
  };
}

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
describe("DailyQuest page states - render snapshots", () => {
  it("Day 1 new user state", () => {
    const store = makeDailyStore();
    expect(renderDailySummary(store)).toMatchInlineSnapshot(`
      {
        "checkedQuestCards": 0,
        "completeButtons": 5,
        "hasBodyLogged": false,
        "hasBodyRequired": true,
        "hasBonusQuest": false,
        "hasCompleteHeader": false,
        "hasDailyQuestHeader": true,
        "hasLogSession": false,
        "hasRestDayHeader": false,
        "hasRestSuggestion": false,
        "hasWeeklyReport": false,
        "progressText": "0/5",
        "questCards": 5,
        "undoButtons": 0,
        "weekText": "Week 1",
      }
    `);
  });

  it("mid-sprint partial progress state", () => {
    const store = makeDailyStore({
      player: { totalXP: 840, level: 9, currentWeek: 6, streakDays: 4 },
      todayQuest: { completed: ["q_foot", "q_foundation"] },
      painLog: { [SNAPSHOT_TODAY]: { foot: 1, knee: 0, wrist: 0, shoulder: 1, lowerBack: 0 } },
      movementProgress: {
        ginga: { masteryLevel: 3, reps: 220 },
        negativa: { masteryLevel: 2, reps: 60 },
      },
      repLog: [{ movementId: "ginga", count: 40, date: SNAPSHOT_TODAY }],
      weeklyConsistency: { trained: 3, total: 7 },
      weekSummary: { sessions: 3, xpEarned: 310, masteryAdvances: 1, repsLogged: 140 },
      currentPhase: 2,
      phaseCompletion: 42,
    });

    expect(renderDailySummary(store)).toMatchInlineSnapshot(`
      {
        "checkedQuestCards": 2,
        "completeButtons": 3,
        "hasBodyLogged": true,
        "hasBodyRequired": false,
        "hasBonusQuest": false,
        "hasCompleteHeader": false,
        "hasDailyQuestHeader": true,
        "hasLogSession": false,
        "hasRestDayHeader": false,
        "hasRestSuggestion": false,
        "hasWeeklyReport": true,
        "progressText": "2/5",
        "questCards": 5,
        "undoButtons": 2,
        "weekText": "Week 6",
      }
    `);
  });

  it("rest day state", () => {
    const store = makeDailyStore({
      player: { totalXP: 1200, level: 13, currentWeek: 3, streakDays: 7 },
      restDays: [SNAPSHOT_TODAY],
      graceTokens: 1,
      weeklyConsistency: { trained: 5, total: 7 },
      painLog: { [SNAPSHOT_TODAY]: { foot: 7, knee: 2, wrist: 0, shoulder: 1, lowerBack: 1 } },
    });

    expect(renderDailySummary(store)).toMatchInlineSnapshot(`
      {
        "checkedQuestCards": 0,
        "completeButtons": 5,
        "hasBodyLogged": true,
        "hasBodyRequired": false,
        "hasBonusQuest": false,
        "hasCompleteHeader": false,
        "hasDailyQuestHeader": false,
        "hasLogSession": false,
        "hasRestDayHeader": true,
        "hasRestSuggestion": false,
        "hasWeeklyReport": false,
        "progressText": null,
        "questCards": 5,
        "undoButtons": 0,
        "weekText": "Week 3",
      }
    `);
  });

  it("all quests done state exposes bonus and session logging", () => {
    const store = makeDailyStore({
      player: { totalXP: 2200, level: 23, currentWeek: 8, streakDays: 12 },
      todayQuest: { completed: ["q_foot", "q_foundation", "q_primary", "q_conditioning", "q_mobility"] },
      painLog: { [SNAPSHOT_TODAY]: { foot: 0, knee: 0, wrist: 0, shoulder: 0, lowerBack: 0 } },
      weeklyConsistency: { trained: 6, total: 7 },
      weekSummary: { sessions: 6, xpEarned: 980, masteryAdvances: 2, repsLogged: 420 },
    });

    expect(renderDailySummary(store)).toMatchInlineSnapshot(`
      {
        "checkedQuestCards": 5,
        "completeButtons": 0,
        "hasBodyLogged": true,
        "hasBodyRequired": false,
        "hasBonusQuest": true,
        "hasCompleteHeader": true,
        "hasDailyQuestHeader": false,
        "hasLogSession": true,
        "hasRestDayHeader": false,
        "hasRestSuggestion": false,
        "hasWeeklyReport": true,
        "progressText": "5/5",
        "questCards": 5,
        "undoButtons": 5,
        "weekText": "Week 8",
      }
    `);
  });
});
describe("Data counts — snapshot", () => {
  it("total movements count", () => {
    expect(MOVEMENTS.length).toMatchInlineSnapshot(`238`);
  });

  it("achievements count = 27", () => {
    expect(ACHIEVEMENTS.length).toMatchInlineSnapshot(`27`);
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
        "streak_100",
        "streak_3",
        "streak_30",
        "streak_60",
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
