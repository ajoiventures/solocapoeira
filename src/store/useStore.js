import { useState, useEffect, useCallback, useRef } from "react";
import { track } from "../lib/analytics.js";
import { identifyUser, resetAnalyticsUser } from "../lib/analytics.js";
import { getMovementMetaById, getUnlockedMovementIdsFromProgress } from "../data/movementIndex.js";
import { QUEST_PILLAR_MAP, TREE_PILLAR_MAP, BOSS_PILLAR_GAINS, applyGains, DEFAULT_PILLARS } from "../data/apf.js";
import { isNutritionHabitId } from "../data/nutritionHabitIds.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { getStoreMestreLineage, getStoreLineageProgress } from "../data/storeMestreLineage.js";
import { canAdvancePhase, getPhaseProgress } from "../data/trainingPhases.js";
import { getMestreSequenceIds } from "../data/mestreSequenceUnlocks.js";
import { getCoreOrishaCount, getOrishaMetaById } from "../data/orishaIndex.js";
import { checkAchievements, getAchievementById } from "../data/achievements.js";
import { RANKS } from "../data/rankUtils.js";
import { mlToOz, ozToMl } from "../data/units.js";

const STORAGE_KEY = "solo_leveling_state_v1";
const STATE_VERSION = 2; // bump this when schema changes require migration

// ── State migrations ──────────────────────────────────────────────
// Each migration runs once when a user with an older save loads the app.
// Add new entries at the bottom. Never remove old ones.
const MIGRATIONS = [
  {
    version: 2,
    description: "Add graceTokens, earnedTitles, activeTitle, bonusChallengesDone",
    migrate(state) {
      return {
        ...state,
        graceTokens:        state.graceTokens        ?? 0,
        earnedTitles:       state.earnedTitles        ?? [],
        activeTitle:        state.activeTitle         ?? null,
        bonusChallengesDone: state.bonusChallengesDone ?? {},
        earnedAchievements: state.earnedAchievements  ?? [],
        lastKnownRank:      state.lastKnownRank       ?? "U",
      };
    },
  },
];

function runMigrations(state) {
  const currentVersion = state._version || 1;
  let migrated = { ...state };
  let didMigrate = false;

  for (const m of MIGRATIONS) {
    if (m.version > currentVersion) {
      migrated = m.migrate(migrated);
      didMigrate = true;
    }
  }

  if (didMigrate) {
    migrated._version = STATE_VERSION;
  }

  return migrated;
}

function buildOrishaProgress(integratedIds = [], existingProgress = {}) {
  const now = new Date().toISOString();
  return integratedIds.reduce((progress, orishaId) => ({
    ...progress,
    [orishaId]: {
      integrated: true,
      masteredAt: existingProgress[orishaId]?.masteredAt || now,
      xp: existingProgress[orishaId]?.xp || 0,
      ...(existingProgress[orishaId] || {}),
    },
  }), { ...existingProgress });
}

const defaultState = () => ({
  // Movement progress: { [movementId]: { masteryLevel: 0-5, reps: 0, notes: "", unlockedAt: null, masteredAt: null } }
  movementProgress: {},
  // Pain log: { date: { foot: 0, knee: 0, wrist: 0, shoulder: 0, lowerBack: 0 } }
  painLog: {},
  // Session log: [{ date, duration, movements: [], notes, xpEarned }]
  sessionLog: [],
  // Rep activity log: [{ movementId, count, date }] — max 1000 entries, newest first
  repLog: [],
  // Sequence practice log: [{ seqId, date }] — newest first
  seqLog: [],
  // Unlocked Mestre sequences: array of sequence IDs unlocked by defeating Mestres
  unlockedSequences: [],
  // Mastery milestones queue: [{ movementId, movementName, level, xp, date }] — newest first, max 20
  masteryMilestones: [],
  // Concept tree milestones queue: [{ tree, newLevel, id }] — newest first, max 10
  conceptMilestones: [],
  // One-time intro shown after first concept tree advancement
  seenConceptIntro: false,
  // Earned achievements: array of achievement IDs
  earnedAchievements: [],
  // Achievement toast queue: [{ id, title, desc, icon, color }]
  achievementQueue: [],
  // Last known rank key — used to detect rank-up
  lastKnownRank: "U",
  // Rest days: Set stored as array of date strings ["2025-06-01", ...]
  restDays: [],
  // Boss tests: { [bossId]: { passed: false, attempts: 0, passedAt: null } }
  bossProgress: {},
  // Mestre progress: { [mestreId]: { defeated: false, progressionTier: 0-3, defeatedAt: null, xpAwarded: false } }
  mestreProgress: {},
  // Lineage rewards: { [lineageKey]: { unlocked: false, unlockedAt: null } }
  lineageRewards: {},
  // Training phase progress: { currentPhase: 1-4, phaseCompletedAt: null, phaseCompletionPercent: 0 }
  trainingPhase: {
    currentPhase: 1,
    phaseCompletedAt: null,
    phaseCompletionPercent: 0,
    phasesCompleted: [],
  },
  // Concept tree progression: { [treeId]: level 0-5 }
  conceptTreeProgress: { malicia: 0, malandragem: 0, mandinga: 0 },
  // Orisha integration: array of Orisha IDs that have been integrated
  orishasIntegrated: [],
  // Ticket-compatible aliases and detail map.
  integratedOrishas: [],
  orishaProgress: {},
  // Prestige mode / NG+ progression
  prestige: {
    rank: 0,
    active: false,
    trialsCompleted: {},
    lastAscendedAt: null,
  },
  // Ehi status: { isAscended: false, ascendedAt: null, prestigeMode: false, prestigeCosmetics: [] }
  ehiStatus: {
    isAscended: false,
    ascendedAt: null,
    prestigeMode: false,
    prestigeCosmetics: [],
  },
  // Player stats
  player: {
    totalXP: 0,
    level: 1,
    currentSprint: "sprint_1",
    currentWeek: 1,
    streakDays: 0,
    lastTrainingDate: null,
    spiritualPath: "Ogun (Core)",  // "Ogun (Core) + Obatala + Ifa + ..."
  },
  // Quest state for today
  todayQuest: {
    date: null,
    completed: [],
    skipped: [],
    bonusItems: [],   // exercise IDs checked today
    bonusXP: 0,
  },
  // Persistent bonus exercise logs: { [exerciseId]: [{ date, value }] }
  bonusLogs: {},
  // Daily steps log: { [date]: { count: number, xpAwarded: number } }
  stepsLog: {},
  // Axis Progression Framework
  apf: {
    pillars: { for: 0, vel: 0, res: 0, nut: 0, fnd: 0, fld: 0 },
    recoveryLog: {}, // { [date]: { hydrationMl: number, sleepHours: number } }
  },
  // Settings
  settings: {
    name: "Hunter",
    showTutorialLinks: true,
    painThreshold: 3,
    vestWeight: 0,
  },
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState(), _version: STATE_VERSION };
    const saved = runMigrations(JSON.parse(raw));
    const def = defaultState();
    const integratedOrishas = saved.integratedOrishas || saved.orishasIntegrated || [];
    const orishaProgress = buildOrishaProgress(integratedOrishas, saved.orishaProgress || {});
    // Deep-merge nested objects so new keys added to defaults survive old saves
    return {
      ...def,
      ...saved,
      player:     { ...def.player,     ...(saved.player     || {}) },
      apf:        { ...def.apf,        ...(saved.apf        || {}), recoveryLog: saved.apf?.recoveryLog || {} },
      todayQuest: { ...def.todayQuest, ...(saved.todayQuest || {}) },
      settings:   { ...def.settings,   ...(saved.settings   || {}) },
      ehiStatus:  { ...def.ehiStatus,  ...(saved.ehiStatus  || {}) },
      repLog:     saved.repLog         || [],
      seqLog:     saved.seqLog         || [],
      unlockedSequences: saved.unlockedSequences || [],
      masteryMilestones: saved.masteryMilestones || [],
      conceptMilestones: saved.conceptMilestones || [],
      earnedAchievements: saved.earnedAchievements || [],
      achievementQueue: [], // never restore queue — cleared on reload
      lastKnownRank: saved.lastKnownRank || "U",
      bonusChallengesDone: saved.bonusChallengesDone || {},
      graceTokens: saved.graceTokens ?? 0, // max 3, earned at 7-day streak milestones
      earnedTitles: saved.earnedTitles || [], // prestige cosmetic title IDs
      activeTitle: saved.activeTitle || null,
      combos: saved.combos || [],
      restDays:   saved.restDays       || [],
      mestreProgress: saved.mestreProgress || {},
      lineageRewards: saved.lineageRewards || {},
      trainingPhase: saved.trainingPhase || { currentPhase: 1, phaseCompletedAt: null, phaseCompletionPercent: 0, phasesCompleted: [] },
      conceptTreeProgress: saved.conceptTreeProgress || { malicia: 0, malandragem: 0, mandinga: 0 },
      orishasIntegrated: integratedOrishas,
      integratedOrishas,
      orishaProgress,
      prestige: { ...def.prestige, ...(saved.prestige || {}) },
    };
  } catch {
    return defaultState();
  }
}

// Estimate bytes used by the store (rough: 2 bytes/char in UTF-16)
function estimateStorageKB(str) {
  return (str.length * 2) / 1024;
}

function save(state) {
  try {
    const serialized = JSON.stringify(state);
    const kb = estimateStorageKB(serialized);
    // Warn at 3MB, hard cap at 4.5MB (localStorage limit ~5MB)
    if (kb > 4500) {
      console.warn(`[store] Storage at ${Math.round(kb)}KB — approaching limit. Trimming repLog.`);
      // Emergency trim: keep only last 500 rep entries
      const trimmed = { ...state, repLog: (state.repLog || []).slice(-500) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return;
    }
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    if (err?.name === "QuotaExceededError") {
      // Last resort: trim aggressively and retry
      try {
        const minimal = {
          ...state,
          repLog: (state.repLog || []).slice(-200),
          sessionLog: (state.sessionLog || []).slice(-50),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
      } catch {
        // Truly full — can't save. Don't crash the app.
        console.error("[store] localStorage full — could not save state.");
      }
    }
  }
}

// Debounce helper — calls fn at most once per `delay` ms
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

async function pushCloudState(state) {
  const { pushState } = await import("../lib/cloudSync.js");
  return pushState(state);
}

export function useStore() {
  const [state, setState] = useState(load);
  const pushDebounced = useRef(debounce((s) => {
    void pushCloudState(s);
  }, 3000)).current;

  // Persist to localStorage on every state change
  useEffect(() => {
    save(state);
    // Debounced cloud push — only fires if user is signed in (pushState checks internally)
    pushDebounced(state);
  }, [state]);

  // Auth change listener — pull cloud state on sign-in, push immediately, clear on sign-out
  useEffect(() => {
    let unsubscribe = () => {};
    let isActive = true;

    import("../lib/cloudSync.js").then(({ onAuthChange, pullState }) => {
      if (!isActive) return;
      unsubscribe = onAuthChange(async (user) => {
        if (user) {
          identifyUser(user.id, { email: user.email });
          import("../lib/sentry.js").then(({ setSentryUser }) => setSentryUser(user.id));
          const cloud = await pullState();
          if (cloud) {
            // Cloud has data — merge it in (cloud wins)
            setState((local) => runMigrations({ ...local, ...cloud, achievementQueue: [] }));
          } else {
            // First sign-in — push local state to cloud immediately
            setState((local) => { void pushCloudState(local); return local; });
          }
        } else {
          resetAnalyticsUser();
          import("../lib/sentry.js").then(({ setSentryUser }) => setSentryUser(null));
        }
      });
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  // ── Core updater — runs achievement + rank-up checks after every mutation ──
  const update = useCallback((fn) => {
    setState((prev) => {
      const next = fn(prev);

      // ── Achievement check ────────────────────────────────────────
      const newlyEarned = checkAchievements(next);
      if (newlyEarned.length > 0) {
        const newQueue = [
          ...(next.achievementQueue || []),
          ...newlyEarned.map((id) => {
            const a = getAchievementById(id);
            return { id, title: a?.title || id, desc: a?.desc || "", icon: a?.icon || "🏆", color: a?.color || "var(--accent)", qid: `${id}_${Date.now()}` };
          }),
        ].slice(0, 5);
        return {
          ...next,
          earnedAchievements: [...(next.earnedAchievements || []), ...newlyEarned],
          achievementQueue: newQueue,
        };
      }

      // ── Rank-up check ───────────────────────────────────────────
      const level = next.player?.level || 1;
      const currentRank = RANKS.slice().reverse().find((r) => level >= r.minLevel)?.rank || "U";
      const lastRank = next.lastKnownRank || "U";
      if (currentRank !== lastRank) {
        const rankObj = RANKS.find((r) => r.rank === currentRank);
        const rankQueue = [{
          id: `rank_${currentRank}`,
          title: rankObj?.label || currentRank,
          desc: rankObj?.desc || "",
          icon: "🎖️",
          color: rankObj?.color || "var(--accent)",
          qid: `rank_${currentRank}_${Date.now()}`,
          isRankUp: true,
        }];
        return {
          ...next,
          lastKnownRank: currentRank,
          achievementQueue: [...(next.achievementQueue || []), ...rankQueue].slice(0, 5),
        };
      }

      return next;
    });
  }, []);

  // ── Prestige XP multiplier helper (used internally) ────────────
  function getPrestigeMultiplier(s) {
    const integratedBonus = 1 + ((s.orishasIntegrated?.length || 0) * 0.02);
    const ehiBonus = s.ehiStatus?.prestigeMode ? 2 : 1;
    return integratedBonus * ehiBonus;
  }

  // ── Movement Actions ────────────────────────────────────────────
  const setMasteryLevel = useCallback((movementId, level) => {
    update((s) => {
      const prevLevel = s.movementProgress[movementId]?.masteryLevel || 0;
      const isIncrease = level > prevLevel;
      const movement = getMovementMetaById(movementId);
      let newPillars = s.apf?.pillars || DEFAULT_PILLARS;
      if (isIncrease) {
        const treeGains = movement && TREE_PILLAR_MAP[movement.tree];
        if (treeGains && movement) {
          const scaled = Object.fromEntries(
            Object.entries(treeGains).map(([k, v]) => [k, v * (movement.tier || 1)])
          );
          newPillars = applyGains(newPillars, scaled);
        }
      }
      // Award XP on advancement: 50 × tier × new mastery level × prestige multiplier
      const baseXp = isIncrease
        ? 50 * (movement?.tier || 1) * level
        : 0;
      const xpGain = baseXp > 0 ? Math.round(baseXp * getPrestigeMultiplier(s)) : 0;
      const newXP = s.player.totalXP + xpGain;
      return {
        ...s,
        movementProgress: {
          ...s.movementProgress,
          [movementId]: {
            ...(s.movementProgress[movementId] || {}),
            masteryLevel: level,
            unlockedAt: s.movementProgress[movementId]?.unlockedAt || new Date().toISOString(),
            masteredAt: level === 5 ? new Date().toISOString() : s.movementProgress[movementId]?.masteredAt,
          },
        },
        player: xpGain > 0 ? {
          ...s.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        } : s.player,
        apf: { ...s.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const incrementReps = useCallback((movementId, reps = 1) => {
    update((s) => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const lastDate = s.player.lastTrainingDate;
      const newStreak = lastDate === today
        ? s.player.streakDays
        : lastDate === yesterday
        ? s.player.streakDays + 1
        : 1;
      // Append to rep log, keep newest first, max 1000 entries
      const newEntry = { movementId, count: reps, date: today };
      const newRepLog = [newEntry, ...s.repLog].slice(0, 1000);

      // Auto-advance mastery when rep threshold crossed
      const prev = s.movementProgress[movementId] || { masteryLevel: 1, reps: 0 };
      const newTotalReps = (prev.reps || 0) + reps;
      // Apply Orisha strength bonus to thresholds (same reduction as MovementDetail display)
      const strengthBonus = Math.min((s.orishasIntegrated?.length || 0) * 0.05, 0.30);
      const rawThresholds = [0, 5, 50, 200, 600, 1200];
      const thresholds = strengthBonus > 0
        ? rawThresholds.map((t, i) => i === 0 ? 0 : Math.max(1, Math.ceil(t * (1 - strengthBonus))))
        : rawThresholds;
      const prevMastery = prev.masteryLevel || 1;
      let newMastery = prevMastery;
      for (let lvl = prevMastery + 1; lvl <= 5; lvl++) {
        if (newTotalReps >= thresholds[lvl]) newMastery = lvl;
        else break;
      }
      const masteryAdvanced = newMastery > prevMastery;
      const movement = getMovementMetaById(movementId);
      // XP for mastery advance (only if auto-advanced)
      const masteryXp = masteryAdvanced
        ? Math.round(50 * (movement?.tier || 1) * newMastery * getPrestigeMultiplier(s))
        : 0;

      // Push milestone to queue
      const newMilestones = masteryAdvanced ? [
        {
          movementId,
          movementName: movement?.name || movementId,
          level: newMastery,
          xp: masteryXp,
          date: today,
          id: `${movementId}_${newMastery}_${Date.now()}`,
        },
        ...(s.masteryMilestones || []),
      ].slice(0, 20) : (s.masteryMilestones || []);

      // Fire analytics
      track.repsLogged(movementId, reps, newMastery);
      if (masteryAdvanced) track.masteryAdvanced(movementId, prevMastery, newMastery);
      if (newStreak > (s.player.streakDays || 0) && [3, 7, 14, 30, 60, 100].includes(newStreak)) {
        track.streakReached(newStreak);
      }

      return {
        ...s,
        movementProgress: {
          ...s.movementProgress,
          [movementId]: {
            ...prev,
            reps: newTotalReps,
            masteryLevel: newMastery,
            masteredAt: newMastery === 5 && prevMastery < 5 ? today : prev.masteredAt,
          },
        },
        // Grant grace token at every 7-day streak milestone (max 3)
        graceTokens: (newStreak % 7 === 0 && newStreak > (s.player.streakDays || 0))
          ? Math.min(3, (s.graceTokens || 0) + 1)
          : (s.graceTokens || 0),
        masteryMilestones: newMilestones,
        repLog: newRepLog,
        player: {
          ...s.player,
          streakDays: newStreak,
          lastTrainingDate: today,
          totalXP: s.player.totalXP + masteryXp,
          level: Math.floor((s.player.totalXP + masteryXp) / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  // ── Pain Logging ────────────────────────────────────────────────
  const logPain = useCallback((scores) => {
    const date = new Date().toISOString().split("T")[0];
    update((s) => ({
      ...s,
      painLog: {
        ...s.painLog,
        [date]: { ...scores, timestamp: new Date().toISOString() },
      },
    }));
  }, [update]);

  const getTodayPain = useCallback(() => {
    const date = new Date().toISOString().split("T")[0];
    return state.painLog[date] || null;
  }, [state.painLog]);

  // ── Session Logging ─────────────────────────────────────────────
  const logSession = useCallback((sessionData) => {
    update((s) => {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = s.player.lastTrainingDate;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const streak = lastDate === yesterday ? s.player.streakDays + 1 : 1;

      return {
        ...s,
        sessionLog: [
          { ...sessionData, date: today, id: Date.now() },
          ...s.sessionLog.slice(0, 199), // Keep last 200
        ],
        player: {
          ...s.player,
          totalXP: s.player.totalXP + (sessionData.xpEarned || 0),
          level: Math.floor((s.player.totalXP + (sessionData.xpEarned || 0)) / XP_PER_LEVEL) + 1,
          streakDays: streak,
          lastTrainingDate: today,
        },
      };
    });
  }, [update]);

  // ── Boss Tests ──────────────────────────────────────────────────
  const passBoss = useCallback((bossId, xp = 0) => {
    update((s) => {
      const alreadyAwarded = s.bossProgress[bossId]?.xpAwarded;
      const xpToAdd = alreadyAwarded ? 0 : Math.round(xp * getPrestigeMultiplier(s));
      const currentPillars = s.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!alreadyAwarded && BOSS_PILLAR_GAINS[bossId])
        ? applyGains(currentPillars, BOSS_PILLAR_GAINS[bossId])
        : currentPillars;
      return {
        ...s,
        bossProgress: {
          ...s.bossProgress,
          [bossId]: {
            passed: true,
            passedAt: new Date().toISOString(),
            attempts: (s.bossProgress[bossId]?.attempts || 0) + 1,
            xpAwarded: true,
            xpAmount: xp,
          },
        },
        player: {
          ...s.player,
          totalXP: s.player.totalXP + xpToAdd,
          level: Math.floor((s.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
        apf: { ...s.apf, pillars: newPillars },
      };
    });
  }, [update]);

  // Re-test: unmark passed, keep XP (won't re-award on next pass)
  const unpassBoss = useCallback((bossId) => {
    update((s) => ({
      ...s,
      bossProgress: {
        ...s.bossProgress,
        [bossId]: {
          ...(s.bossProgress[bossId] || {}),
          passed: false,
          passedAt: null,
        },
      },
    }));
  }, [update]);

  // Unmark: unmark AND subtract XP (for accidental clicks)
  const unmarkBoss = useCallback((bossId) => {
    update((s) => {
      const xp = s.bossProgress[bossId]?.xpAmount || 0;
      const newXP = Math.max(0, s.player.totalXP - xp);
      return {
        ...s,
        bossProgress: {
          ...s.bossProgress,
          [bossId]: {
            ...(s.bossProgress[bossId] || {}),
            passed: false,
            passedAt: null,
            xpAwarded: false,
            xpAmount: 0,
          },
        },
        player: {
          ...s.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  const recordBossAttempt = useCallback((bossId) => {
    update((s) => ({
      ...s,
      bossProgress: {
        ...s.bossProgress,
        [bossId]: {
          ...(s.bossProgress[bossId] || {}),
          passed: false,
          attempts: (s.bossProgress[bossId]?.attempts || 0) + 1,
        },
      },
    }));
  }, [update]);

  // ── Quest ────────────────────────────────────────────────────────
  const completeQuestItem = useCallback((questId, xp = 0) => {
    const today = new Date().toISOString().split("T")[0];
    update((s) => {
      const quest = s.todayQuest.date === today ? s.todayQuest : { date: today, completed: [], skipped: [], bonusItems: [], bonusXP: 0 };
      const alreadyDone = quest.completed.includes(questId);
      const scaledXP = !alreadyDone && xp > 0 ? Math.round(xp * getPrestigeMultiplier(s)) : xp;
      const xpDelta = alreadyDone ? -xp : scaledXP;
      const newXP = Math.max(0, s.player.totalXP + xpDelta);
      const currentPillars = s.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!alreadyDone && QUEST_PILLAR_MAP[questId])
        ? applyGains(currentPillars, QUEST_PILLAR_MAP[questId])
        : currentPillars;
      return {
        ...s,
        todayQuest: {
          ...quest,
          completed: alreadyDone
            ? quest.completed.filter((id) => id !== questId)
            : [...quest.completed, questId],
        },
        player: xp > 0 ? {
          ...s.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        } : s.player,
        apf: { ...s.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const toggleBonusItem = useCallback((exerciseId, xp) => {
    const today = new Date().toISOString().split("T")[0];
    update((s) => {
      const quest = s.todayQuest.date === today ? s.todayQuest : { date: today, completed: s.todayQuest.completed, skipped: [], bonusItems: [], bonusXP: 0 };
      const already = quest.bonusItems?.includes(exerciseId);
      const newItems = already
        ? (quest.bonusItems || []).filter((id) => id !== exerciseId)
        : [...(quest.bonusItems || []), exerciseId];
      const xpDelta = already ? -xp : xp;
      const newXP = Math.max(0, s.player.totalXP + xpDelta);
      const isNutritionHabit = isNutritionHabitId(exerciseId);
      const currentPillars = s.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!already && isNutritionHabit)
        ? applyGains(currentPillars, { nut: 0.1 })
        : currentPillars;
      return {
        ...s,
        todayQuest: { ...quest, bonusItems: newItems, bonusXP: (quest.bonusXP || 0) + xpDelta },
        player: { ...s.player, totalXP: newXP, level: Math.floor(newXP / XP_PER_LEVEL) + 1 },
        apf: { ...s.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const logBonusExercise = useCallback((exerciseId, value) => {
    const today = new Date().toISOString().split("T")[0];
    update((s) => {
      const prev = s.bonusLogs?.[exerciseId] || [];
      const filtered = prev.filter((e) => e.date !== today);
      return {
        ...s,
        bonusLogs: {
          ...s.bonusLogs,
          [exerciseId]: value.trim() ? [...filtered, { date: today, value: value.trim() }] : filtered,
        },
      };
    });
  }, [update]);

  const completeAllQuestsAndLog = useCallback((questIds, totalXP = 150) => {
    const today = new Date().toISOString().split("T")[0];
    update((s) => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const lastDate = s.player.lastTrainingDate;
      const streak = lastDate === yesterday || lastDate === today ? s.player.streakDays + (lastDate === today ? 0 : 1) : 1;
      const xp = totalXP;
      return {
        ...s,
        todayQuest: { ...s.todayQuest, date: today, completed: questIds, skipped: [] },
        sessionLog: [
          { date: today, id: Date.now(), movements: questIds, xpEarned: xp, notes: "Auto-completed at 12h", autoCompleted: true },
          ...s.sessionLog.slice(0, 199),
        ],
        player: {
          ...s.player,
          totalXP: s.player.totalXP + xp,
          level: Math.floor((s.player.totalXP + xp) / XP_PER_LEVEL) + 1,
          streakDays: streak,
          lastTrainingDate: today,
        },
      };
    });
  }, [update]);

  // ── APF Recovery ────────────────────────────────────────────────
  const logRecovery = useCallback(({ hydrationMl, sleepHours }) => {
    const date = new Date().toISOString().split("T")[0];
    update((s) => ({
      ...s,
      apf: {
        ...s.apf,
        recoveryLog: {
          ...s.apf.recoveryLog,
          [date]: { hydrationMl, sleepHours },
        },
      },
    }));
  }, [update]);

  const logRecoveryOz = useCallback(({ hydrationOz, sleepHours }) => {
    logRecovery({ hydrationMl: ozToMl(hydrationOz), sleepHours });
  }, [logRecovery]);

  const getRecoveryForDate = useCallback((date = new Date().toISOString().split("T")[0]) => (
    state.apf?.recoveryLog?.[date] || { hydrationMl: 0, sleepHours: 0 }
  ), [state.apf?.recoveryLog]);

  const getHydrationOz = useCallback((date = new Date().toISOString().split("T")[0]) => (
    mlToOz(getRecoveryForDate(date).hydrationMl)
  ), [getRecoveryForDate]);

  // ── Steps ────────────────────────────────────────────────────────
  // logSteps(total, meta?)
  //   total  — cumulative step count for today
  //   meta   — { delta, mode: "training"|"walking"|"idle", period: "morning"|"afternoon"|"evening"|"night" }
  const logSteps = useCallback((total, meta = {}) => {
    const today = new Date().toISOString().split("T")[0];
    update((s) => {
      const prev = s.stepsLog?.[today] || { total: 0, count: 0, xpAwarded: 0, training: 0, normal: 0, periods: {} };

      const newXP = total >= 15000 ? 50 : total >= 10000 ? 30 : total >= 8000 ? 20 : total >= 5000 ? 10 : 0;
      const xpDelta = newXP - (prev.xpAwarded || 0);
      const newPlayerXP = Math.max(0, s.player.totalXP + xpDelta);

      // Accumulate training vs normal steps
      const delta  = meta.delta || 0;
      const isTraining = meta.mode === "training";
      const newTraining = (prev.training || 0) + (isTraining ? delta : 0);
      const newNormal   = (prev.normal   || 0) + (!isTraining && delta > 0 ? delta : 0);

      // Accumulate period counts
      const prevPeriods = prev.periods || {};
      const period = meta.period;
      const newPeriods = period
        ? { ...prevPeriods, [period]: (prevPeriods[period] || 0) + delta }
        : prevPeriods;

      return {
        ...s,
        stepsLog: {
          ...s.stepsLog,
          [today]: {
            total,
            count: total,          // keep legacy key in sync
            xpAwarded: newXP,
            training: newTraining,
            normal: newNormal,
            periods: newPeriods,
          },
        },
        player: xpDelta !== 0 ? {
          ...s.player,
          totalXP: newPlayerXP,
          level: Math.floor(newPlayerXP / XP_PER_LEVEL) + 1,
        } : s.player,
      };
    });
  }, [update]);

  // ── Settings ────────────────────────────────────────────────────
  const updateSettings = useCallback((newSettings) => {
    update((s) => ({
      ...s,
      settings: { ...s.settings, ...newSettings },
    }));
  }, [update]);

  const setCurrentWeek = useCallback((week) => {
    update((s) => ({
      ...s,
      player: { ...s.player, currentWeek: Math.max(1, Math.min(12, week)) },
    }));
  }, [update]);

  const advanceWeek = useCallback(() => {
    update((s) => ({
      ...s,
      player: { ...s.player, currentWeek: Math.min(12, (s.player.currentWeek || 1) + 1) },
    }));
  }, [update]);

  // ── Derived State ────────────────────────────────────────────────
  const getUnlockedMovementIds = useCallback(() => {
    return getUnlockedMovementIdsFromProgress(state.movementProgress);
  }, [state.movementProgress]);

  const getMasteryLevel = useCallback(
    (movementId) => state.movementProgress[movementId]?.masteryLevel || 0,
    [state.movementProgress]
  );

  const getMovementReps = useCallback(
    (movementId) => state.movementProgress[movementId]?.reps || 0,
    [state.movementProgress]
  );

  const isBossPassed = useCallback((bossId) => !!state.bossProgress[bossId]?.passed, [state.bossProgress]);

  // ── Movement Notes ───────────────────────────────────────────────
  const setMovementNote = useCallback((movementId, note) => {
    update((s) => ({
      ...s,
      movementProgress: {
        ...s.movementProgress,
        [movementId]: {
          ...(s.movementProgress[movementId] || { masteryLevel: 0, reps: 0 }),
          notes: note,
        },
      },
    }));
  }, [update]);

  const getMovementNote = useCallback(
    (movementId) => state.movementProgress[movementId]?.notes || "",
    [state.movementProgress]
  );

  // ── Sequence Practice Log ────────────────────────────────────────
  const markSequencePracticed = useCallback((seqId) => {
    const date = new Date().toISOString().split("T")[0];
    update((s) => ({
      ...s,
      seqLog: [{ seqId, date }, ...s.seqLog].slice(0, 500),
    }));
  }, [update]);

  const getSeqLastPracticed = useCallback((seqId) => {
    const entry = state.seqLog.find((e) => e.seqId === seqId);
    return entry ? entry.date : null;
  }, [state.seqLog]);

  // ── Rep Log helpers ──────────────────────────────────────────────
  // Returns a Map<dateStr, totalReps> for the last `days` days
  const getRepHeatmapData = useCallback((days = 365) => {
    const map = new Map();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    state.repLog.forEach(({ date, count }) => {
      if (date >= cutoffStr) {
        map.set(date, (map.get(date) || 0) + count);
      }
    });
    return map;
  }, [state.repLog]);

  // ── Rest Days ────────────────────────────────────────────────────
  const markRestDay = useCallback((date) => {
    const d = date || new Date().toISOString().split("T")[0];
    update((s) => {
      const already = s.restDays.includes(d);
      return {
        ...s,
        restDays: already ? s.restDays.filter((x) => x !== d) : [...s.restDays, d],
      };
    });
  }, [update]);

  const isRestDay = useCallback(
    (date) => state.restDays.includes(date || new Date().toISOString().split("T")[0]),
    [state.restDays]
  );

  // All "active" dates = trained days + rest days
  const getActiveDates = useCallback(() => {
    const trained = new Set(state.repLog.map((e) => e.date));
    state.restDays.forEach((d) => trained.add(d));
    return [...trained].sort();
  }, [state.repLog, state.restDays]);

  // Compute current streak with 1-day grace window
  // Grace: if last active day was 2 days ago (not yesterday), streak continues
  // but caller receives { streak, inGrace: true }
  const getStreakDays = useCallback(() => {
    const dates = getActiveDates().reverse(); // newest first
    if (dates.length === 0) return { streak: 0, inGrace: false };
    const today = new Date().toISOString().split("T")[0];
    const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().split("T")[0];

    // Check if the most recent active day is today, yesterday, or 2 days ago (grace)
    const mostRecent = dates[0];
    if (mostRecent !== today && mostRecent !== daysAgo(1) && mostRecent !== daysAgo(2)) {
      return { streak: 0, inGrace: false };
    }
    const inGrace = mostRecent === daysAgo(2);

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = Math.round((prev - curr) / 86400000);
      // Allow gap of 1 (consecutive) or 2 (grace day used) — but only once
      if (diff === 1) {
        streak++;
      } else if (diff === 2) {
        // Grace gap — counts but don't allow another gap
        streak++;
        // After using grace, check if the next pair is truly consecutive
      } else {
        break;
      }
    }
    return { streak, inGrace };
  }, [getActiveDates]);

  // Longest streak ever
  const getLongestStreak = useCallback(() => {
    const dates = getActiveDates(); // oldest first
    if (dates.length === 0) return 0;
    let longest = 1, current = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.round(
        (new Date(dates[i]) - new Date(dates[i - 1])) / 86400000
      );
      if (diff <= 2) { current++; if (current > longest) longest = current; }
      else current = 1;
    }
    return longest;
  }, [getActiveDates]);

  // Weekly consistency: how many of Mon–Sun this week had activity
  const getWeeklyConsistency = useCallback(() => {
    const today = new Date();
    const dow = today.getDay(); // 0=Sun
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((dow + 6) % 7)); // Mon
    const active = new Set(getActiveDates());
    let trained = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const ds = d.toISOString().split("T")[0];
      if (ds > today.toISOString().split("T")[0]) break; // don't count future days
      if (active.has(ds)) trained++;
    }
    const daysElapsed = ((dow + 6) % 7) + 1; // Mon=1 … Sun=7
    return { trained, total: daysElapsed };
  }, [getActiveDates]);

  // Returns the most recent date a movement was trained, or null
  const getMovementLastTrained = useCallback((movementId) => {
    const entry = state.repLog.find((e) => e.movementId === movementId);
    return entry?.date || null;
  }, [state.repLog]);

  const getWeekSummary = useCallback(() => {
      const dow = new Date().getDay();
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - ((dow + 6) % 7));
    const weekStart = startOfWeek.toISOString().split("T")[0];

    const sessions = state.sessionLog.filter((s) => (s.date || "") >= weekStart).length;
    const xpEarned = state.sessionLog
      .filter((s) => (s.date || "") >= weekStart)
      .reduce((sum, s) => sum + (s.xpEarned || 0), 0);
    const masteryAdvances = (state.masteryMilestones || [])
      .filter((m) => (m.date || "") >= weekStart).length;
    const repsLogged = (state.repLog || [])
      .filter((r) => (r.date || "") >= weekStart)
      .reduce((sum, r) => sum + (r.count || 0), 0);

    return { sessions, xpEarned, masteryAdvances, repsLogged };
  }, [state.sessionLog, state.masteryMilestones, state.repLog]);

  const getRecentPainTrend = useCallback(() => {
    const dates = Object.keys(state.painLog).sort().slice(-7);
    return dates.map((d) => ({ date: d, ...state.painLog[d] }));
  }, [state.painLog]);

  const resetAll = useCallback(() => {
    setState(defaultState());
  }, []);

  const restoreState = useCallback((savedData) => {
    // Merge with defaults so new keys survive old backups
    const def = defaultState();
    const integratedOrishas = savedData.integratedOrishas || savedData.orishasIntegrated || [];
    setState({
      ...def,
      ...savedData,
      player:     { ...def.player,     ...(savedData.player     || {}) },
      apf:        { ...def.apf,        ...(savedData.apf        || {}), recoveryLog: savedData.apf?.recoveryLog || {} },
      todayQuest: { ...def.todayQuest, ...(savedData.todayQuest || {}) },
      settings:   { ...def.settings,   ...(savedData.settings   || {}) },
      ehiStatus:  { ...def.ehiStatus,  ...(savedData.ehiStatus  || {}) },
      repLog:     savedData.repLog         || [],
      seqLog:     savedData.seqLog         || [],
      unlockedSequences: savedData.unlockedSequences || [],
      restDays:   savedData.restDays       || [],
      mestreProgress: savedData.mestreProgress || {},
      orishasIntegrated: integratedOrishas,
      integratedOrishas,
      orishaProgress: buildOrishaProgress(integratedOrishas, savedData.orishaProgress || {}),
      prestige: { ...def.prestige, ...(savedData.prestige || {}) },
    });
  }, []);

  const resetXP = useCallback(() => {
    update((s) => ({
      ...s,
      player: { ...s.player, totalXP: 0, level: 1 },
    }));
  }, [update]);

  // ── Mestre Progression ──────────────────────────────────────────────
  const defeatMestre = useCallback((mestreId, xp = 0) => {
    update((s) => {
      const alreadyAwarded = s.mestreProgress[mestreId]?.xpAwarded;
      const xpToAdd = alreadyAwarded ? 0 : Math.round(xp * getPrestigeMultiplier(s));

      // Map ALL Mestres to concept tree progression (each defeat +1 to their primary tree)
      // Malícia = reading, deception, awareness
      // Mandinga = rhythm, spiritual power, charisma
      // Malandragem = strategy, intelligence, efficiency
      const conceptTreeMap = {
        // Angola founders — deep malícia and mandinga
        "mestre_bimba":           "malandragem", // systematic Regional → strategic mastery
        "mestre_pastinha":        "malicia",      // Angola deception and wisdom
        "mestre_waldemar":        "mandinga",     // hybrid rhythm and spirit
        "mestre_besouro":         "malicia",      // warrior deception, resistance
        "mestre_joao_grande":     "mandinga",     // aerial spirit, sky mastery
        "mestre_joao_pequeno":    "malicia",      // Angola ground game reading

        // Angola lineage
        "mestre_caiçara":         "malicia",      // deep Angola, low game awareness
        "mestre_gato_preto":      "malicia",      // deceptive master
        "mestre_cobra_mansa":     "mandinga",     // patient artist, spiritual flow
        "mestre_nenel":           "malicia",      // teaching through reading
        "mestre_santo_amaro":     "mandinga",     // spiritual warrior
        "mestre_nô":              "malicia",      // patient strategist
        "mestre_canjiquinha":     "malicia",      // Mangueira deception
        "mestre_moa_cartorio":    "mandinga",     // wise keeper of knowledge
        "mestre_moraes":          "malicia",      // defensive reading mastery
        "mestre_suassuna":        "mandinga",     // poetic expression, rhythm

        // Regional lineage
        "mestre_brasilia_ferrez": "malandragem",  // systematic Regional pioneer
        "mestre_gildo":           "malandragem",  // relentless efficiency
        "mestre_grao":            "malandragem",  // tactical master
        "mestre_papai":           "malandragem",  // speed = efficient strategy
        "mestre_talo":            "malandragem",  // bridge builder, synthesis
        "mestre_bom_jesus":       "mandinga",     // power rooted in tradition
        "mestre_sinha":           "mandinga",     // lion heart, courageous spirit

        // Contemporary lineage
        "mestre_polêmica":        "mandinga",     // contemporary freedom, expression
        "mestre_zulu":            "mandinga",     // aerial innovation, sky spirit
        "mestre_amen":            "mandinga",     // freedom seeker, creative spirit
        "mestre_david_moura":     "malandragem",  // evolutionary contemporary
        "mestre_pe_de_bananeira": "mandinga",     // inversion mastery, transcendence
        "mestre_acordeon":        "mandinga",     // musical rhythm master

        // Concept tree masters (these advance their own tree by 2)
        "mestre_malicia":         "malicia",
        "mestre_mandinga":        "mandinga",
        "mestre_malandragem":     "malandragem",
      };

      // Concept tree masters grant +2 instead of +1
      const conceptTreeBonus = ["mestre_malicia", "mestre_mandinga", "mestre_malandragem"].includes(mestreId) ? 2 : 1;

      const conceptTree = conceptTreeMap[mestreId];
      const newConceptProgress = { ...s.conceptTreeProgress };
      let newConceptMilestones = [...(s.conceptMilestones || [])];

      if (conceptTree && !alreadyAwarded) {
        const current = newConceptProgress[conceptTree] || 0;
        const next = Math.min(5, current + conceptTreeBonus);
        newConceptProgress[conceptTree] = next;
        if (next > current) {
          newConceptMilestones = [
            { tree: conceptTree, newLevel: next, id: `${conceptTree}_${next}_${Date.now()}` },
            ...newConceptMilestones,
          ].slice(0, 10);
        }
      }

      // Check lineage completion and unlock lineage rewards
      const lineage = getStoreMestreLineage(mestreId);
      const newLineageRewards = { ...s.lineageRewards };

      if (lineage && !s.lineageRewards[lineage.key]?.unlocked) {
        // Get all Mestres and check which are defeated
        const defeatedMestres = Object.keys(s.mestreProgress)
          .filter((mid) => s.mestreProgress[mid]?.defeated)
          .concat([mestreId]); // Include the one just defeated

        const progress = getStoreLineageProgress(lineage.key, defeatedMestres);
        // Unlock reward if all Mestres in lineage are defeated
        if (progress.completed) {
          newLineageRewards[lineage.key] = {
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            reward: lineage.reward,
          };
        }
      }

      // Unlock 5 signature sequences for this Mestre
      const mestreSequenceIds = getMestreSequenceIds(mestreId);
      const newUnlockedSequences = [...s.unlockedSequences];
      mestreSequenceIds.forEach((sequenceId) => {
        if (!newUnlockedSequences.includes(sequenceId)) {
          newUnlockedSequences.push(sequenceId);
        }
      });

      return {
        ...s,
        mestreProgress: {
          ...s.mestreProgress,
          [mestreId]: {
            defeated: true,
            progressionTier: 3,  // Practitioner tier
            defeatedAt: new Date().toISOString(),
            xpAwarded: true,
            xpAmount: xp,
            unlockedReward: `${mestreId}_reward`,
          },
        },
        lineageRewards: newLineageRewards,
        conceptTreeProgress: newConceptProgress,
        conceptMilestones: newConceptMilestones,
        unlockedSequences: newUnlockedSequences,
        player: {
          ...s.player,
          totalXP: s.player.totalXP + xpToAdd,
          level: Math.floor((s.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
      };
    });
    track.mestresDefeated(mestreId);
  }, [update]);

  const isMestreDefeated = useCallback(
    (mestreId) => !!state.mestreProgress[mestreId]?.defeated,
    [state.mestreProgress]
  );

  // ── Orisha Integration ──────────────────────────────────────────────
  const integrateOrisha = useCallback((orishaId, xp = 0) => {
    update((s) => {
      const alreadyIntegrated = s.orishasIntegrated.includes(orishaId);
      const xpToAdd = alreadyIntegrated ? 0 : xp;
      const masteredAt = s.orishaProgress?.[orishaId]?.masteredAt || new Date().toISOString();
      const newIntegrated = alreadyIntegrated
        ? s.orishasIntegrated
        : [...s.orishasIntegrated, orishaId];
      const totalOrishas = getCoreOrishaCount();

      // Check if all core Orishas are now integrated
      const allIntegrated = newIntegrated.length >= totalOrishas;
      const newEhiStatus = allIntegrated && !s.ehiStatus.isAscended
        ? {
            ...s.ehiStatus,
            isAscended: true,
            ascendedAt: masteredAt,
            prestigeMode: true,
            prestigeCosmetics: [
              ...new Set([...(s.ehiStatus.prestigeCosmetics || []), "Ehi Ascended", "Ehi Crown", "Spirit Aura", "Eternal Title"]),
            ],
          }
        : s.ehiStatus;
      const newPrestige = allIntegrated && !s.ehiStatus.isAscended
        ? { ...(s.prestige || {}), active: true, lastAscendedAt: masteredAt }
        : s.prestige;

      // Update spiritual path display
      const pathString = newIntegrated.length === 0
        ? "Ogun (Core)"
        : `Ogun (Core) + ${newIntegrated.length} Orishas integrated`;

      return {
        ...s,
        orishasIntegrated: newIntegrated,
        integratedOrishas: newIntegrated,
        orishaProgress: {
          ...(s.orishaProgress || {}),
          [orishaId]: {
            ...(s.orishaProgress?.[orishaId] || {}),
            integrated: true,
            masteredAt,
            xp: (s.orishaProgress?.[orishaId]?.xp || 0) + xpToAdd,
          },
        },
        ehiStatus: newEhiStatus,
        prestige: newPrestige,
        player: {
          ...s.player,
          totalXP: s.player.totalXP + xpToAdd,
          level: Math.floor((s.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
          spiritualPath: pathString,
        },
      };
    });
    track.orishaIntegrated(orishaId, state.orishasIntegrated.length + 1);
  }, [update, state.orishasIntegrated]);

  const isOrishaIntegrated = useCallback(
    (orishaId) => state.orishasIntegrated.includes(orishaId),
    [state.orishasIntegrated]
  );

  const getEhiReadiness = useCallback(() => {
    const integrated = state.orishasIntegrated.length;
    const total = getCoreOrishaCount();
    return {
      integrated,
      total,
      percentReady: Math.round((integrated / total) * 100),
      isReady: integrated >= total,
    };
  }, [state.orishasIntegrated]);

  const getOrishaPath = useCallback(() => {
    if (state.ehiStatus.isAscended) {
      return "Ehi Ascended (All 16 integrated)";
    }
    if (state.orishasIntegrated.length === 0) {
      return "Ogun (Core)";
    }
    return `Ogun (Core) + ${state.orishasIntegrated.length}/${getCoreOrishaCount()} Orishas`;
  }, [state.orishasIntegrated, state.ehiStatus.isAscended]);

  const isEhiAscended = useCallback(
    () => state.ehiStatus.isAscended,
    [state.ehiStatus.isAscended]
  );

  // ── Angola-Style Gating on Orisha Integration ──────────────────────────
  const canIntegrateOrisha = useCallback((orishaId) => {
    if (state.orishasIntegrated.includes(orishaId)) {
      return { canIntegrate: true, reason: "already_integrated" };
    }

    const orisha = getOrishaMetaById(orishaId);
    if (!orisha) {
      return { canIntegrate: false, reason: "orisha_not_found" };
    }

    // Angola foundation gates: Mandinga + Malandragem requirements
    const mandinga = state.conceptTreeProgress.mandinga || 0;
    const malandragem = state.conceptTreeProgress.malandragem || 0;
    const malicia = state.conceptTreeProgress.malicia || 0;

    // Ogun is the gateway Orisha and can be integrated earlier.
    const foundationGate = orishaId === "orisha_ogun"
      ? { mandinga: 1, malandragem: 1 }
      : { mandinga: 3, malandragem: 2 };
    if (mandinga < foundationGate.mandinga || malandragem < foundationGate.malandragem) {
      return {
        canIntegrate: false,
        reason: "insufficient_angola_foundation",
        required: foundationGate,
        current: { mandinga, malandragem },
      };
    }

    // Specific Orisha requirements
    const reqs = orisha.gatingRequirements || {};

    if (reqs.mandinga && mandinga < reqs.mandinga) {
      return {
        canIntegrate: false,
        reason: "insufficient_mandinga",
        required: reqs.mandinga,
        current: mandinga,
      };
    }

    if (reqs.malandragem && malandragem < reqs.malandragem) {
      return {
        canIntegrate: false,
        reason: "insufficient_malandragem",
        required: reqs.malandragem,
        current: malandragem,
      };
    }

    if (reqs.malicia && malicia < reqs.malicia) {
      return {
        canIntegrate: false,
        reason: "insufficient_malicia",
        required: reqs.malicia,
        current: malicia,
      };
    }

    // Phase gating
    if (reqs.minPhase && state.trainingPhase.currentPhase < reqs.minPhase) {
      return {
        canIntegrate: false,
        reason: "insufficient_phase",
        required: reqs.minPhase,
        current: state.trainingPhase.currentPhase,
      };
    }

    // All gates passed
    return { canIntegrate: true, reason: "gates_passed" };
  }, [state.orishasIntegrated, state.conceptTreeProgress, state.trainingPhase.currentPhase]);

  const getOrishaGatingStatus = useCallback((orishaId) => {
    const status = canIntegrateOrisha(orishaId);
    return status;
  }, [canIntegrateOrisha]);

  const getCurrentOrishas = useCallback(() => {
    return state.orishasIntegrated.map((orishaId) => getOrishaMetaById(orishaId)).filter(Boolean);
  }, [state.orishasIntegrated]);

  const getPrestigeXPMultiplier = useCallback(() => {
    const integratedBonus = 1 + (state.orishasIntegrated.length * 0.02);
    const ehiBonus = state.ehiStatus.prestigeMode ? 2 : 1;
    return Number((integratedBonus * ehiBonus).toFixed(2));
  }, [state.orishasIntegrated.length, state.ehiStatus.prestigeMode]);

  const beginPrestigeRun = useCallback(() => {
    update((s) => {
      if (!s.ehiStatus.isAscended) return s;
      const nextRank = (s.prestige?.rank || 0) + 1;
      return {
        ...s,
        prestige: {
          ...(s.prestige || {}),
          rank: nextRank,
          active: true,
          startedAt: new Date().toISOString(),
        },
        player: {
          ...s.player,
          totalXP: 0,
          level: 1,
          spiritualPath: `Ehi Ascended - Prestige ${nextRank}`,
        },
        trainingPhase: {
          ...s.trainingPhase,
          currentPhase: 1,
          phaseCompletionPercent: 0,
          phasesCompleted: [],
        },
      };
    });
  }, [update]);

  const completePrestigeTrial = useCallback((trialId, reward = {}) => {
    update((s) => {
      if (!s.ehiStatus.isAscended) return s;
      const alreadyCompleted = !!s.prestige?.trialsCompleted?.[trialId];
      const xpToAdd = alreadyCompleted ? 0 : Math.round((reward.xp || 0) * 2);
      const cosmetics = reward.cosmetic
        ? [...new Set([...(s.ehiStatus.prestigeCosmetics || []), reward.cosmetic])]
        : s.ehiStatus.prestigeCosmetics;
      return {
        ...s,
        prestige: {
          ...(s.prestige || {}),
          active: true,
          trialsCompleted: {
            ...(s.prestige?.trialsCompleted || {}),
            [trialId]: {
              completed: true,
              completedAt: s.prestige?.trialsCompleted?.[trialId]?.completedAt || new Date().toISOString(),
              reward,
            },
          },
        },
        ehiStatus: {
          ...s.ehiStatus,
          prestigeCosmetics: cosmetics,
        },
        player: {
          ...s.player,
          totalXP: s.player.totalXP + xpToAdd,
          level: Math.floor((s.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  // ── Mastery Milestones ──────────────────────────────────────────────────
  const useGraceToken = useCallback(() => {
    update((s) => {
      if ((s.graceTokens || 0) <= 0) return s;
      // Extend the grace window by 1 day — mark today as a rest day so streak survives
      const today = new Date().toISOString().split("T")[0];
      return {
        ...s,
        graceTokens: s.graceTokens - 1,
        restDays: [...(s.restDays || []), today].slice(-60),
      };
    });
  }, [update]);

  const completeBonusChallenge = useCallback((doneKey, xp) => {
    update((s) => {
      const mult = getPrestigeMultiplier(s);
      const xpToAdd = Math.round(xp * mult);
      const newXP = s.player.totalXP + xpToAdd;
      return {
        ...s,
        bonusChallengesDone: { ...(s.bonusChallengesDone || {}), [doneKey]: true },
        player: { ...s.player, totalXP: newXP, level: Math.floor(newXP / XP_PER_LEVEL) + 1 },
      };
    });
  }, [update]);

  const dismissAchievement = useCallback((qid) => {
    update((s) => ({
      ...s,
      achievementQueue: (s.achievementQueue || []).filter((a) => a.qid !== qid),
    }));
  }, [update]);

  const dismissConceptMilestone = useCallback((id) => {
    update((s) => ({
      ...s,
      conceptMilestones: (s.conceptMilestones || []).filter((m) => m.id !== id),
    }));
  }, [update]);

  const dismissMilestone = useCallback((id) => {
    update((s) => ({
      ...s,
      masteryMilestones: (s.masteryMilestones || []).filter((m) => m.id !== id),
    }));
  }, [update]);

  const clearMilestones = useCallback(() => {
    update((s) => ({ ...s, masteryMilestones: [] }));
  }, [update]);

  // ── Training Phase Management ──────────────────────────────────────────
  const getCurrentPhase = useCallback(() => state.trainingPhase.currentPhase, [state.trainingPhase.currentPhase]);

  const getPhaseCompletionPercent = useCallback(() => {
    const currentPhase = state.trainingPhase.currentPhase;
    return getPhaseProgress(currentPhase, state.conceptTreeProgress, Object.keys(state.mestreProgress).filter((id) => state.mestreProgress[id]?.defeated));
  }, [state.trainingPhase.currentPhase, state.conceptTreeProgress, state.mestreProgress]);

  const canAdvanceToNextPhase = useCallback(() => {
    return canAdvancePhase(state.trainingPhase.currentPhase, state);
  }, [state]);

  const advanceToNextPhase = useCallback(() => {
    if (!canAdvancePhase(state.trainingPhase.currentPhase, state)) {
      console.warn("Cannot advance phase: requirements not met");
      return false;
    }

    update((s) => {
      const nextPhase = s.trainingPhase.currentPhase + 1;
      return {
        ...s,
        trainingPhase: {
          ...s.trainingPhase,
          currentPhase: nextPhase,
          phaseCompletedAt: new Date().toISOString(),
          phasesCompleted: [...(s.trainingPhase.phasesCompleted || []), s.trainingPhase.currentPhase],
          phaseCompletionPercent: 0, // Reset for new phase
        },
      };
    });
    return true;
  }, [state, update]);

  const isPhaseAccessible = useCallback((phaseId) => {
    if (phaseId === 1) return true; // Phase 1 always accessible
    return state.trainingPhase.phasesCompleted.includes(phaseId - 1);
  }, [state.trainingPhase.phasesCompleted]);

  return {
    state,
    setMasteryLevel,
    incrementReps,
    logPain,
    getTodayPain,
    logSession,
    logRecovery,
    passBoss,
    unpassBoss,
    unmarkBoss,
    recordBossAttempt,
    completeQuestItem,
    toggleBonusItem,
    logBonusExercise,
    completeAllQuestsAndLog,
    updateSettings,
    setCurrentWeek,
    advanceWeek,
    logSteps,
    getUnlockedMovementIds,
    getMasteryLevel,
    getMovementReps,
    dismissMilestone,
    clearMilestones,
    update, // exposed for direct state mutations (title selection, etc.)
    useGraceToken,
    completeBonusChallenge,
    dismissAchievement,
    dismissConceptMilestone,
    isBossPassed,
    getRecentPainTrend,
    getRepHeatmapData,
    getStreakDays,
    getLongestStreak,
    getWeeklyConsistency,
    getWeekSummary,
    getMovementLastTrained,
    getRecoveryForDate,
    getHydrationOz,
    logRecoveryOz,
    markRestDay,
    isRestDay,
    setMovementNote,
    getMovementNote,
    markSequencePracticed,
    getSeqLastPracticed,
    resetAll,
    restoreState,
    resetXP,
    // Mestre progression
    defeatMestre,
    isMestreDefeated,
    // Orisha integration
    integrateOrisha,
    isOrishaIntegrated,
    getEhiReadiness,
    getOrishaPath,
    isEhiAscended,
    canIntegrateOrisha,
    getOrishaGatingStatus,
    getCurrentOrishas,
    getPrestigeXPMultiplier,
    beginPrestigeRun,
    completePrestigeTrial,
    // Training phase management
    getCurrentPhase,
    getPhaseCompletionPercent,
    canAdvanceToNextPhase,
    advanceToNextPhase,
    isPhaseAccessible,
  };
}
