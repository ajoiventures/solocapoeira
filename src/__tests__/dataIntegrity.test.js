/**
 * dataIntegrity.test.js
 * Cross-reference tests for all data files.
 * The 9 missing movement ID bug and 24 unmapped Mestre bugs were found manually.
 * These tests ensure they can never silently regress.
 */

import { describe, it, expect } from "vitest";
import { MOVEMENTS } from "../data/movements.js";
import { BOSS_TESTS } from "../data/bossTests.js";
import { SPRINT_1 } from "../data/sprint.js";
import { getAllMestres, getMestreProgressionRank, getMestresByProgression } from "../data/mestres.js";
import { getAllCoreOrishas } from "../data/orishas.js";
import { ACHIEVEMENTS, checkAchievements } from "../data/achievements.js";
import { BONUS_CHALLENGES, getDailyBonusChallenge } from "../data/bonusChallenges.js";
import { getMestreSequences } from "../data/mestreSequences.js";

// ──────────────────────────────────────────────────────────────────
// MOVEMENTS data integrity
// ──────────────────────────────────────────────────────────────────
describe("movements.js — data integrity", () => {
  const ids = MOVEMENTS.map((m) => m.id);

  it("all movement IDs are unique", () => {
    const counts = {};
    ids.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    const dupes = Object.entries(counts).filter(([, c]) => c > 1).map(([id]) => id);
    expect(dupes, `Duplicate movement IDs found: ${dupes.join(", ")}`).toHaveLength(0);
  });

  it("every movement has required fields", () => {
    MOVEMENTS.forEach((m) => {
      expect(m.id,       `${m.id} missing id`).toBeTruthy();
      expect(m.name,     `${m.id} missing name`).toBeTruthy();
      expect(m.tree,     `${m.id} missing tree`).toBeTruthy();
      expect(typeof m.tier, `${m.id} tier must be number`).toBe("number");
    });
  });

  it("every prerequisite references a real movement ID", () => {
    const idSet = new Set(ids);
    MOVEMENTS.forEach((m) => {
      (m.prerequisites || []).forEach((prereq) => {
        expect(idSet.has(prereq),
          `${m.id} has unknown prerequisite: "${prereq}"`).toBe(true);
      });
    });
  });

  it("all drillCard IDs are unique across all movements", () => {
    const drillIds = MOVEMENTS.flatMap((m) => (m.drillCards || []).map((d) => d.id));
    const unique = new Set(drillIds);
    expect(unique.size).toBe(drillIds.length);
  });

  it("drillCard chain IDs reference real movements", () => {
    const idSet = new Set(ids);
    MOVEMENTS.forEach((m) => {
      (m.drillCards || []).forEach((d) => {
        (d.chain || []).forEach((chainId) => {
          expect(idSet.has(chainId),
            `${m.id} drillCard "${d.id}" has unknown chain ID: "${chainId}"`).toBe(true);
        });
      });
    });
  });
});

// ──────────────────────────────────────────────────────────────────
// BOSS_TESTS data integrity
// ──────────────────────────────────────────────────────────────────
describe("bossTests.js — data integrity", () => {
  const movementIds = new Set(MOVEMENTS.map((m) => m.id));

  it("every boss has a unique ID", () => {
    const ids = BOSS_TESTS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all movementId fields in requirements reference real movements", () => {
    BOSS_TESTS.forEach((b) => {
      (b.requirements || []).forEach((req) => {
        if (req.movementId) {
          expect(movementIds.has(req.movementId),
            `Boss "${b.id}" req "${req.label}" has unknown movementId: "${req.movementId}"`
          ).toBe(true);
        }
      });
    });
  });
});

// ──────────────────────────────────────────────────────────────────
// SPRINT data integrity
// ──────────────────────────────────────────────────────────────────
describe("sprint.js — data integrity", () => {
  const movementIds = new Set(MOVEMENTS.map((m) => m.id));

  it("Sprint 1 has 12 weeks", () => {
    expect(SPRINT_1.weeks.length).toBe(12);
  });

  it("all sprint skills[] reference real movement IDs", () => {
    SPRINT_1.weeks.forEach((week) => {
      (week.skills || []).forEach((id) => {
        expect(movementIds.has(id),
          `Week ${week.week} skills has unknown movement: "${id}"`).toBe(true);
      });
      (week.conditioning?.movementIds || []).forEach((id) => {
        expect(movementIds.has(id),
          `Week ${week.week} conditioning.movementIds has unknown movement: "${id}"`).toBe(true);
      });
    });
  });
});

// ──────────────────────────────────────────────────────────────────
// MESTRES data integrity
// ──────────────────────────────────────────────────────────────────
describe("mestres.js — data integrity", () => {
  const mestres = getAllMestres();
  const movementIds = new Set(MOVEMENTS.map((m) => m.id));

  it("all Mestres have required fields", () => {
    mestres.forEach((m) => {
      expect(m.id,   `Mestre missing id`).toBeTruthy();
      expect(m.name, `${m.id} missing name`).toBeTruthy();
    });
  });

  it("Mestre requirement movementIds reference real movements", () => {
    mestres.forEach((m) => {
      (m.requirements || []).forEach((req) => {
        if (req.type === "movement" && req.movementId) {
          expect(movementIds.has(req.movementId),
            `Mestre "${m.id}" req has unknown movementId: "${req.movementId}"`
          ).toBe(true);
        }
      });
    });
  });

  it("concept tree IDs in requirements are valid tree names", () => {
    const validTrees = new Set(["mandinga", "malandragem", "malicia"]);
    mestres.forEach((m) => {
      (m.requirements || []).forEach((req) => {
        if (req.type === "concept_tree" && req.treeId) {
          expect(validTrees.has(req.treeId),
            `Mestre "${m.id}" has unknown treeId: "${req.treeId}"`
          ).toBe(true);
        }
      });
    });
  });

  it("Mestre progression ladder covers every unique Mestre and keeps founders late", () => {
    const progression = getMestresByProgression();
    const progressionIds = progression.map((m) => m.id);
    const uniqueProgressionIds = new Set(progressionIds);

    expect(progression).toHaveLength(mestres.length);
    expect(uniqueProgressionIds.size).toBe(mestres.length);
    progression.forEach((mestre) => {
      expect(
        getMestreProgressionRank(mestre.id),
        `${mestre.id} missing explicit progression rank`
      ).toBeLessThan(Number.MAX_SAFE_INTEGER);
    });
    expect(progression[0].id).not.toBe("mestre_bimba");
    expect(progression.at(-1).id).toBe("mestre_bimba");
    expect(getMestreProgressionRank("mestre_bimba")).toBeGreaterThan(getMestreProgressionRank("mestre_besouro"));
    expect(getMestreProgressionRank("mestre_pastinha")).toBeGreaterThan(getMestreProgressionRank("mestre_waldemar"));
  });
});

// ──────────────────────────────────────────────────────────────────
// ORISHAS data integrity
// ──────────────────────────────────────────────────────────────────
describe("orishas.js — data integrity", () => {
  const orishas = getAllCoreOrishas();
  const movementIds = new Set(MOVEMENTS.map((m) => m.id));

  it("all Orishas have required fields", () => {
    orishas.forEach((o) => {
      expect(o.id,   `Orisha missing id`).toBeTruthy();
      expect(o.name, `${o.id} missing name`).toBeTruthy();
    });
  });

  it("Orisha requirement movementIds reference real movements", () => {
    orishas.forEach((o) => {
      (o.requirements || []).forEach((req) => {
        if (req.movementId) {
          expect(movementIds.has(req.movementId),
            `Orisha "${o.id}" req has unknown movementId: "${req.movementId}"`
          ).toBe(true);
        }
      });
    });
  });
});

// ──────────────────────────────────────────────────────────────────
// ACHIEVEMENTS integrity
// ──────────────────────────────────────────────────────────────────
describe("achievements.js — data integrity", () => {
  it("all achievement IDs are unique", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every achievement has required fields", () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(a.id,    `Achievement missing id`).toBeTruthy();
      expect(a.title, `${a.id} missing title`).toBeTruthy();
      expect(a.desc,  `${a.id} missing desc`).toBeTruthy();
      expect(a.icon,  `${a.id} missing icon`).toBeTruthy();
    });
  });

  it("checkAchievements returns no duplicates for same state", () => {
    const state = {
      earnedAchievements: [],
      sessionLog: [{ date: "2025-01-01", xpEarned: 100 }],
      repLog: [],
      movementProgress: { ginga: { masteryLevel: 2, reps: 50 } },
      player: { streakDays: 3, level: 1 },
      mestreProgress: {},
      bossProgress: {},
      orishasIntegrated: [],
      conceptTreeProgress: { mandinga: 0, malandragem: 0, malicia: 0 },
      masteryMilestones: [],
    };
    const earned = checkAchievements(state);
    expect(new Set(earned).size).toBe(earned.length);
  });

  it("checkAchievements never returns already-earned achievements", () => {
    const state = {
      earnedAchievements: ["first_session", "streak_3"],
      sessionLog: [{ date: "2025-01-01" }],
      repLog: [],
      movementProgress: {},
      player: { streakDays: 5, level: 1 },
      mestreProgress: {},
      bossProgress: {},
      orishasIntegrated: [],
      conceptTreeProgress: {},
      masteryMilestones: [],
    };
    const earned = checkAchievements(state);
    expect(earned).not.toContain("first_session");
    expect(earned).not.toContain("streak_3");
  });
});

// ──────────────────────────────────────────────────────────────────
// BONUS CHALLENGES integrity
// ──────────────────────────────────────────────────────────────────
describe("bonusChallenges.js — data integrity", () => {
  it("has exactly 30 challenges", () => {
    expect(BONUS_CHALLENGES.length).toBe(30);
  });

  it("all challenge IDs are unique", () => {
    const ids = BONUS_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every challenge has required fields", () => {
    BONUS_CHALLENGES.forEach((c) => {
      expect(c.id,    `Challenge missing id`).toBeTruthy();
      expect(c.title, `${c.id} missing title`).toBeTruthy();
      expect(c.desc,  `${c.id} missing desc`).toBeTruthy();
      expect(c.xp,    `${c.id} missing xp`).toBeGreaterThan(0);
    });
  });

  it("getDailyBonusChallenge always returns a valid challenge", () => {
    const challenge = getDailyBonusChallenge();
    expect(challenge).toBeTruthy();
    expect(challenge.id).toBeTruthy();
    expect(challenge.xp).toBeGreaterThan(0);
  });

  it("getDailyBonusChallenge is deterministic — same result twice", () => {
    expect(getDailyBonusChallenge().id).toBe(getDailyBonusChallenge().id);
  });
});

// ──────────────────────────────────────────────────────────────────
// MESTRE SEQUENCES cross-reference
// ──────────────────────────────────────────────────────────────────
describe("mestreSequences.js — movement ID cross-reference", () => {
  const mestres = getAllMestres();

  it("getMestreSequences returns an array for known Mestres", () => {
    // Test the two most prominent Mestres
    const bimbaSeqs = getMestreSequences("mestre_bimba");
    const pastinhaSeqs = getMestreSequences("mestre_pastinha");
    expect(Array.isArray(bimbaSeqs)).toBe(true);
    expect(Array.isArray(pastinhaSeqs)).toBe(true);
  });

  it("all normalized Mestres expose five signature sequence slots", () => {
    mestres.forEach((mestre) => {
      expect(getMestreSequences(mestre.id).length, `${mestre.id} sequence count`).toBeGreaterThanOrEqual(5);
    });
  });
});
