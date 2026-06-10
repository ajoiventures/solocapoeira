import { useCallback } from "react";
import { track } from "../lib/analytics.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { mlToOz, ozToMl } from "../data/units.js";

export function useRecoveryActions(state, update) {
  const logPain = useCallback((scores) => {
    const date = new Date().toISOString().split("T")[0];
    update((storeState) => ({
      ...storeState,
      painLog: {
        ...storeState.painLog,
        [date]: { ...scores, timestamp: new Date().toISOString() },
      },
    }));
  }, [update]);

  const getTodayPain = useCallback(() => {
    const date = new Date().toISOString().split("T")[0];
    return state.painLog[date] || null;
  }, [state.painLog]);

  const logSession = useCallback((sessionData) => {
    if (sessionData.durationSeconds) {
      track.flowSessionCompleted(sessionData.durationSeconds);
    }
    update((storeState) => {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = storeState.player.lastTrainingDate;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const streak = lastDate === yesterday ? storeState.player.streakDays + 1 : 1;

      return {
        ...storeState,
        sessionLog: [
          { ...sessionData, date: today, id: Date.now() },
          ...storeState.sessionLog.slice(0, 199),
        ],
        player: {
          ...storeState.player,
          totalXP: storeState.player.totalXP + (sessionData.xpEarned || 0),
          level: Math.floor((storeState.player.totalXP + (sessionData.xpEarned || 0)) / XP_PER_LEVEL) + 1,
          streakDays: streak,
          lastTrainingDate: today,
        },
      };
    });
  }, [update]);

  const logRecovery = useCallback(({ hydrationMl, sleepHours }) => {
    const date = new Date().toISOString().split("T")[0];
    update((storeState) => ({
      ...storeState,
      apf: {
        ...storeState.apf,
        recoveryLog: {
          ...storeState.apf.recoveryLog,
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

  const logSteps = useCallback((total, meta = {}) => {
    const today = new Date().toISOString().split("T")[0];
    update((storeState) => {
      const prev = storeState.stepsLog?.[today] || { total: 0, count: 0, xpAwarded: 0, training: 0, normal: 0, periods: {} };
      const newXP = total >= 15000 ? 50 : total >= 10000 ? 30 : total >= 8000 ? 20 : total >= 5000 ? 10 : 0;
      const xpDelta = newXP - (prev.xpAwarded || 0);
      const newPlayerXP = Math.max(0, storeState.player.totalXP + xpDelta);
      const delta = meta.delta || 0;
      const isTraining = meta.mode === "training";
      const prevPeriods = prev.periods || {};
      const period = meta.period;

      return {
        ...storeState,
        stepsLog: {
          ...storeState.stepsLog,
          [today]: {
            total,
            count: total,
            xpAwarded: newXP,
            training: (prev.training || 0) + (isTraining ? delta : 0),
            normal: (prev.normal || 0) + (!isTraining && delta > 0 ? delta : 0),
            periods: period
              ? { ...prevPeriods, [period]: (prevPeriods[period] || 0) + delta }
              : prevPeriods,
          },
        },
        player: xpDelta !== 0 ? {
          ...storeState.player,
          totalXP: newPlayerXP,
          level: Math.floor(newPlayerXP / XP_PER_LEVEL) + 1,
        } : storeState.player,
      };
    });
  }, [update]);

  const markRestDay = useCallback((date) => {
    const day = date || new Date().toISOString().split("T")[0];
    update((storeState) => {
      const already = storeState.restDays.includes(day);
      return {
        ...storeState,
        restDays: already
          ? storeState.restDays.filter((restDay) => restDay !== day)
          : [...storeState.restDays, day],
      };
    });
  }, [update]);

  const isRestDay = useCallback(
    (date) => state.restDays.includes(date || new Date().toISOString().split("T")[0]),
    [state.restDays]
  );

  return {
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
  };
}
