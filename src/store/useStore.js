import { useState, useEffect, useCallback, useRef } from "react";
import { identifyUser, resetAnalyticsUser } from "../lib/analytics.js";
import { getUnlockedMovementIdsFromProgress } from "../data/movementIndex.js";
import {
  debounce,
  loadStoreState,
  pushCloudState,
  runMigrations,
  saveStoreState,
} from "./storePersistence.js";
import { applyPostUpdateEffects } from "./storeUpdatePipeline.js";
import { useMovementActions } from "./useMovementActions.js";
import { useBossActions } from "./useBossActions.js";
import { useRecoveryActions } from "./useRecoveryActions.js";
import { useQuestActions } from "./useQuestActions.js";
import { useSettingsActions } from "./useSettingsActions.js";
import { useSequenceActions } from "./useSequenceActions.js";
import { useProgressionActions } from "./useProgressionActions.js";

export function useStore() {
  const [state, setState] = useState(loadStoreState);
  const pushDebounced = useRef(debounce((s) => {
    void pushCloudState(s, (status, syncTime) => {
      setState((prev) => ({
        ...prev,
        cloudSyncStatus: status,
        lastCloudSyncTime: syncTime || prev.lastCloudSyncTime,
      }));
    });
  }, 3000)).current;

  // Persist to localStorage on every state change
  useEffect(() => {
    saveStoreState(state);
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
            setState((local) => {
              void pushCloudState(local, (status, syncTime) => {
                setState((prev) => ({
                  ...prev,
                  cloudSyncStatus: status,
                  lastCloudSyncTime: syncTime || prev.lastCloudSyncTime,
                }));
              });
              return local;
            });
          }
        } else {
          resetAnalyticsUser();
          import("../lib/sentry.js").then(({ setSentryUser }) => setSentryUser(null));
          // Reset cloud sync status on sign-out
          setState((prev) => ({ ...prev, cloudSyncStatus: "idle", lastCloudSyncTime: null }));
        }
      });
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  // Core updater - runs cross-cutting achievement and rank-up checks after mutations.
  const update = useCallback((fn) => {
    setState((prev) => applyPostUpdateEffects(fn(prev)));
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // DOMAIN 1: PLAYER PROGRESSION (Movements, Mastery, Training Phases)
  // ═══════════════════════════════════════════════════════════════════════

  const { setMasteryLevel, incrementReps } = useMovementActions(update);

  // ═══════════════════════════════════════════════════════════════════════
  const {
    logPain,
    getTodayPain,
    logSession,
    logRecovery,
    logRecoveryOz,
    getRecoveryForDate,
    getHydrationOz,
    logSteps,
    markRestDay,
    isRestDay,
  } = useRecoveryActions(state, update);

  const { passBoss, unpassBoss, unmarkBoss, recordBossAttempt } = useBossActions(update);

  const {
    completeQuestItem,
    toggleBonusItem,
    logBonusExercise,
    completeAllQuestsAndLog,
  } = useQuestActions(update);

  const {
    updateSettings,
    setCurrentWeek,
    advanceWeek,
    resetAll,
    restoreState,
    resetXP,
  } = useSettingsActions(update, setState);

  // Derived State ────────────────────────────────────────────────
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

  const {
    setMovementNote,
    getMovementNote,
    markSequencePracticed,
    getSeqLastPracticed,
    logComboPractice,
  } = useSequenceActions(state, update);

  // Rep Log helpers ──────────────────────────────────────────────
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


  // ═══════════════════════════════════════════════════════════════════════
  const {
    defeatMestre,
    isMestreDefeated,
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
    useGraceToken,
    completeBonusChallenge,
    dismissAchievement,
    dismissConceptMilestone,
    dismissMilestone,
    clearMilestones,
    getCurrentPhase,
    getPhaseCompletionPercent,
    canAdvanceToNextPhase,
    advanceToNextPhase,
    isPhaseAccessible,
  } = useProgressionActions(state, update);

  return {
    state,
    setMasteryLevel,
    incrementReps,
    logPain,
    getTodayPain,
    logSession,
    logComboPractice,
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
