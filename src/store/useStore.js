import { useState, useEffect, useCallback, useRef } from "react";
import { track } from "../lib/analytics.js";
import { identifyUser, resetAnalyticsUser } from "../lib/analytics.js";
import { getUnlockedMovementIdsFromProgress } from "../data/movementIndex.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { getStoreMestreLineage, getStoreLineageProgress } from "../data/storeMestreLineage.js";
import { canAdvancePhase, getPhaseProgress } from "../data/trainingPhases.js";
import { getMestreSequenceIds } from "../data/mestreSequenceUnlocks.js";
import { getCoreOrishaCount, getOrishaMetaById } from "../data/orishaIndex.js";
import {
  buildOrishaProgress,
  debounce,
  defaultState,
  loadStoreState,
  pushCloudState,
  runMigrations,
  saveStoreState,
} from "./storePersistence.js";
import { applyPostUpdateEffects } from "./storeUpdatePipeline.js";
import { getPrestigeMultiplier } from "./storeCalculations.js";
import { useMovementActions } from "./useMovementActions.js";
import { useBossActions } from "./useBossActions.js";
import { useRecoveryActions } from "./useRecoveryActions.js";
import { useQuestActions } from "./useQuestActions.js";

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

  // Settings ────────────────────────────────────────────────────
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

  // ═══════════════════════════════════════════════════════════════════════
  // DOMAIN 5: SEQUENCES & ACHIEVEMENTS (Practice Log, Unlocks, Progress)
  // ═══════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════
  // DOMAIN 6: PRESTIGE & PROGRESSION (Mestre Lineage, Orisha, NG+)
  // ═══════════════════════════════════════════════════════════════════════

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
    track.bonusChallengeCompleted(doneKey, xp);
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

  // Combo practice logging
  const logComboPractice = useCallback((comboId, completionTimeMs) => {
    update((s) => {
      const stats = s.comboStats?.[comboId] || { timesPracticed: 0, lastPracticed: null, bestTime: null };
      return {
        ...s,
        comboStats: {
          ...s.comboStats,
          [comboId]: {
            timesPracticed: (stats.timesPracticed || 0) + 1,
            lastPracticed: new Date().toISOString(),
            bestTime: completionTimeMs && (!stats.bestTime || completionTimeMs < stats.bestTime)
              ? completionTimeMs
              : stats.bestTime,
          },
        },
      };
    });
  }, [update]);

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
