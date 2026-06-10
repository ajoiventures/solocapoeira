import { useCallback } from "react";
import { QUEST_PILLAR_MAP, applyGains, DEFAULT_PILLARS } from "../data/apf.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { isNutritionHabitId } from "../data/nutritionHabitIds.js";
import { getPrestigeMultiplier } from "./storeCalculations.js";

export function useQuestActions(update) {
  const getTodayQuest = (state, today) => (
    state.todayQuest.date === today
      ? { drills: {}, ...state.todayQuest }
      : { date: today, completed: [], skipped: [], bonusItems: [], bonusXP: 0, drills: {} }
  );

  const completeQuestItem = useCallback((questId, xp = 0) => {
    const today = new Date().toISOString().split("T")[0];
    update((state) => {
      const quest = getTodayQuest(state, today);
      const alreadyDone = quest.completed.includes(questId);
      const scaledXP = !alreadyDone && xp > 0 ? Math.round(xp * getPrestigeMultiplier(state)) : xp;
      const xpDelta = alreadyDone ? -xp : scaledXP;
      const newXP = Math.max(0, state.player.totalXP + xpDelta);
      const currentPillars = state.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!alreadyDone && QUEST_PILLAR_MAP[questId])
        ? applyGains(currentPillars, QUEST_PILLAR_MAP[questId])
        : currentPillars;

      return {
        ...state,
        todayQuest: {
          ...quest,
          completed: alreadyDone
            ? quest.completed.filter((id) => id !== questId)
            : [...quest.completed, questId],
        },
        player: xp > 0 ? {
          ...state.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        } : state.player,
        apf: { ...state.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const toggleBonusItem = useCallback((exerciseId, xp) => {
    const today = new Date().toISOString().split("T")[0];
    update((state) => {
      const quest = state.todayQuest.date === today
        ? state.todayQuest
        : { date: today, completed: state.todayQuest.completed, skipped: [], bonusItems: [], bonusXP: 0 };
      const already = quest.bonusItems?.includes(exerciseId);
      const newItems = already
        ? (quest.bonusItems || []).filter((id) => id !== exerciseId)
        : [...(quest.bonusItems || []), exerciseId];
      const xpDelta = already ? -xp : xp;
      const newXP = Math.max(0, state.player.totalXP + xpDelta);
      const currentPillars = state.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!already && isNutritionHabitId(exerciseId))
        ? applyGains(currentPillars, { nut: 0.1 })
        : currentPillars;

      return {
        ...state,
        todayQuest: { ...quest, bonusItems: newItems, bonusXP: (quest.bonusXP || 0) + xpDelta },
        player: { ...state.player, totalXP: newXP, level: Math.floor(newXP / XP_PER_LEVEL) + 1 },
        apf: { ...state.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const toggleQuestDrill = useCallback((questId, drillKey, totalUnits, xp = 0) => {
    if (!questId || !drillKey) return;
    const today = new Date().toISOString().split("T")[0];
    update((state) => {
      const quest = getTodayQuest(state, today);
      const currentKeys = quest.drills?.[questId] || [];
      const alreadyChecked = currentKeys.includes(drillKey);
      const nextKeys = alreadyChecked
        ? currentKeys.filter((key) => key !== drillKey)
        : [...currentKeys, drillKey];
      const parentDone = quest.completed.includes(questId);
      const wasAllDrillsDone = totalUnits > 0 && currentKeys.length >= totalUnits;
      const allDrillsDone = totalUnits > 0 && nextKeys.length >= totalUnits;
      const shouldAddParent = allDrillsDone && !parentDone;
      const shouldRemoveParent = wasAllDrillsDone && !allDrillsDone && parentDone;
      const scaledXP = shouldAddParent && xp > 0 ? Math.round(xp * getPrestigeMultiplier(state)) : xp;
      const xpDelta = shouldAddParent ? scaledXP : shouldRemoveParent ? -xp : 0;
      const newXP = Math.max(0, state.player.totalXP + xpDelta);
      const currentPillars = state.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = shouldAddParent && QUEST_PILLAR_MAP[questId]
        ? applyGains(currentPillars, QUEST_PILLAR_MAP[questId])
        : currentPillars;

      return {
        ...state,
        todayQuest: {
          ...quest,
          drills: {
            ...(quest.drills || {}),
            [questId]: nextKeys,
          },
          completed: shouldAddParent
            ? [...quest.completed, questId]
            : shouldRemoveParent
              ? quest.completed.filter((id) => id !== questId)
              : quest.completed,
        },
        player: xpDelta !== 0 ? {
          ...state.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        } : state.player,
        apf: { ...state.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const logBonusExercise = useCallback((exerciseId, value) => {
    const today = new Date().toISOString().split("T")[0];
    update((state) => {
      const prev = state.bonusLogs?.[exerciseId] || [];
      const filtered = prev.filter((entry) => entry.date !== today);

      return {
        ...state,
        bonusLogs: {
          ...state.bonusLogs,
          [exerciseId]: value.trim() ? [...filtered, { date: today, value: value.trim() }] : filtered,
        },
      };
    });
  }, [update]);

  const completeAllQuestsAndLog = useCallback((questIds, totalXP = 150) => {
    const today = new Date().toISOString().split("T")[0];
    update((state) => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const lastDate = state.player.lastTrainingDate;
      const streak = lastDate === yesterday || lastDate === today
        ? state.player.streakDays + (lastDate === today ? 0 : 1)
        : 1;

      return {
        ...state,
        todayQuest: { ...state.todayQuest, date: today, completed: questIds, skipped: [] },
        sessionLog: [
          { date: today, id: Date.now(), movements: questIds, xpEarned: totalXP, notes: "Auto-completed at 12h", autoCompleted: true },
          ...state.sessionLog.slice(0, 199),
        ],
        player: {
          ...state.player,
          totalXP: state.player.totalXP + totalXP,
          level: Math.floor((state.player.totalXP + totalXP) / XP_PER_LEVEL) + 1,
          streakDays: streak,
          lastTrainingDate: today,
        },
      };
    });
  }, [update]);

  return {
    completeQuestItem,
    toggleQuestDrill,
    toggleBonusItem,
    logBonusExercise,
    completeAllQuestsAndLog,
  };
}
