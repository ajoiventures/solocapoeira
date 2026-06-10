import { useCallback } from "react";
import { track } from "../lib/analytics.js";
import { getMovementMetaById } from "../data/movementIndex.js";
import { TREE_PILLAR_MAP, applyGains, DEFAULT_PILLARS } from "../data/apf.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { getPrestigeMultiplier } from "./storeCalculations.js";

export function useMovementActions(update) {
  const setMasteryLevel = useCallback((movementId, level) => {
    update((state) => {
      const prevLevel = state.movementProgress[movementId]?.masteryLevel || 0;
      const isIncrease = level > prevLevel;
      const movement = getMovementMetaById(movementId);
      let newPillars = state.apf?.pillars || DEFAULT_PILLARS;

      if (isIncrease) {
        const treeGains = movement && TREE_PILLAR_MAP[movement.tree];
        if (treeGains && movement) {
          const scaled = Object.fromEntries(
            Object.entries(treeGains).map(([key, value]) => [key, value * (movement.tier || 1)])
          );
          newPillars = applyGains(newPillars, scaled);
        }
      }

      const baseXp = isIncrease ? 50 * (movement?.tier || 1) * level : 0;
      const xpGain = baseXp > 0 ? Math.round(baseXp * getPrestigeMultiplier(state)) : 0;
      const newXP = state.player.totalXP + xpGain;

      return {
        ...state,
        movementProgress: {
          ...state.movementProgress,
          [movementId]: {
            ...(state.movementProgress[movementId] || {}),
            masteryLevel: level,
            unlockedAt: state.movementProgress[movementId]?.unlockedAt || new Date().toISOString(),
            masteredAt: level === 5 ? new Date().toISOString() : state.movementProgress[movementId]?.masteredAt,
          },
        },
        player: xpGain > 0 ? {
          ...state.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        } : state.player,
        apf: { ...state.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const incrementReps = useCallback((movementId, reps = 1) => {
    update((state) => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const lastDate = state.player.lastTrainingDate;
      const newStreak = lastDate === today
        ? state.player.streakDays
        : lastDate === yesterday
        ? state.player.streakDays + 1
        : 1;

      const newEntry = { movementId, count: reps, date: today };
      const newRepLog = [newEntry, ...state.repLog].slice(0, 1000);
      const prev = state.movementProgress[movementId] || { masteryLevel: 1, reps: 0 };
      const newTotalReps = (prev.reps || 0) + reps;
      const strengthBonus = Math.min((state.orishasIntegrated?.length || 0) * 0.05, 0.30);
      const rawThresholds = [0, 5, 50, 200, 600, 1200];
      const thresholds = strengthBonus > 0
        ? rawThresholds.map((threshold, index) => index === 0 ? 0 : Math.max(1, Math.ceil(threshold * (1 - strengthBonus))))
        : rawThresholds;
      const prevMastery = prev.masteryLevel || 1;
      let newMastery = prevMastery;

      for (let level = prevMastery + 1; level <= 5; level++) {
        if (newTotalReps >= thresholds[level]) newMastery = level;
        else break;
      }

      const masteryAdvanced = newMastery > prevMastery;
      const movement = getMovementMetaById(movementId);
      const masteryXp = masteryAdvanced
        ? Math.round(50 * (movement?.tier || 1) * newMastery * getPrestigeMultiplier(state))
        : 0;
      const newMilestones = masteryAdvanced ? [
        {
          movementId,
          movementName: movement?.name || movementId,
          level: newMastery,
          xp: masteryXp,
          date: today,
          id: `${movementId}_${newMastery}_${Date.now()}`,
        },
        ...(state.masteryMilestones || []),
      ].slice(0, 20) : (state.masteryMilestones || []);

      track.repsLogged(movementId, reps, newMastery);
      if (masteryAdvanced) track.masteryAdvanced(movementId, prevMastery, newMastery);
      if (newStreak > (state.player.streakDays || 0) && [3, 7, 14, 30, 60, 100].includes(newStreak)) {
        track.streakReached(newStreak);
      }

      return {
        ...state,
        movementProgress: {
          ...state.movementProgress,
          [movementId]: {
            ...prev,
            reps: newTotalReps,
            masteryLevel: newMastery,
            masteredAt: newMastery === 5 && prevMastery < 5 ? today : prev.masteredAt,
          },
        },
        graceTokens: (newStreak % 7 === 0 && newStreak > (state.player.streakDays || 0))
          ? Math.min(3, (state.graceTokens || 0) + 1)
          : (state.graceTokens || 0),
        masteryMilestones: newMilestones,
        repLog: newRepLog,
        player: {
          ...state.player,
          streakDays: newStreak,
          lastTrainingDate: today,
          totalXP: state.player.totalXP + masteryXp,
          level: Math.floor((state.player.totalXP + masteryXp) / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  return { setMasteryLevel, incrementReps };
}
