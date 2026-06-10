import { useCallback } from "react";
import { buildOrishaProgress, defaultState } from "./storePersistence.js";

export function useSettingsActions(update, setState) {
  const updateSettings = useCallback((newSettings) => {
    update((state) => ({
      ...state,
      settings: { ...state.settings, ...newSettings },
    }));
  }, [update]);

  const setCurrentWeek = useCallback((week) => {
    update((state) => ({
      ...state,
      player: { ...state.player, currentWeek: Math.max(1, Math.min(12, week)) },
    }));
  }, [update]);

  const advanceWeek = useCallback(() => {
    update((state) => ({
      ...state,
      player: { ...state.player, currentWeek: Math.min(12, (state.player.currentWeek || 1) + 1) },
    }));
  }, [update]);

  const resetAll = useCallback(() => {
    setState(defaultState());
  }, [setState]);

  const restoreState = useCallback((savedData) => {
    const defaults = defaultState();
    const integratedOrishas = savedData.integratedOrishas || savedData.orishasIntegrated || [];

    setState({
      ...defaults,
      ...savedData,
      player: { ...defaults.player, ...(savedData.player || {}) },
      apf: { ...defaults.apf, ...(savedData.apf || {}), recoveryLog: savedData.apf?.recoveryLog || {} },
      todayQuest: { ...defaults.todayQuest, ...(savedData.todayQuest || {}) },
      settings: { ...defaults.settings, ...(savedData.settings || {}) },
      ehiStatus: { ...defaults.ehiStatus, ...(savedData.ehiStatus || {}) },
      repLog: savedData.repLog || [],
      seqLog: savedData.seqLog || [],
      unlockedSequences: savedData.unlockedSequences || [],
      restDays: savedData.restDays || [],
      mestreProgress: savedData.mestreProgress || {},
      orishasIntegrated: integratedOrishas,
      integratedOrishas,
      orishaProgress: buildOrishaProgress(integratedOrishas, savedData.orishaProgress || {}),
      prestige: { ...defaults.prestige, ...(savedData.prestige || {}) },
    });
  }, [setState]);

  const resetXP = useCallback(() => {
    update((state) => ({
      ...state,
      player: { ...state.player, totalXP: 0, level: 1 },
    }));
  }, [update]);

  return {
    updateSettings,
    setCurrentWeek,
    advanceWeek,
    resetAll,
    restoreState,
    resetXP,
  };
}
