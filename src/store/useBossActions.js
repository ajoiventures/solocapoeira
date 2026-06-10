import { useCallback } from "react";
import { BOSS_PILLAR_GAINS, applyGains, DEFAULT_PILLARS } from "../data/apf.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { getPrestigeMultiplier } from "./storeCalculations.js";

export function useBossActions(update) {
  const passBoss = useCallback((bossId, xp = 0) => {
    update((state) => {
      const alreadyAwarded = state.bossProgress[bossId]?.xpAwarded;
      const xpToAdd = alreadyAwarded ? 0 : Math.round(xp * getPrestigeMultiplier(state));
      const currentPillars = state.apf?.pillars || DEFAULT_PILLARS;
      const newPillars = (!alreadyAwarded && BOSS_PILLAR_GAINS[bossId])
        ? applyGains(currentPillars, BOSS_PILLAR_GAINS[bossId])
        : currentPillars;

      return {
        ...state,
        bossProgress: {
          ...state.bossProgress,
          [bossId]: {
            passed: true,
            passedAt: new Date().toISOString(),
            attempts: (state.bossProgress[bossId]?.attempts || 0) + 1,
            xpAwarded: true,
            xpAmount: xp,
          },
        },
        player: {
          ...state.player,
          totalXP: state.player.totalXP + xpToAdd,
          level: Math.floor((state.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
        apf: { ...state.apf, pillars: newPillars },
      };
    });
  }, [update]);

  const unpassBoss = useCallback((bossId) => {
    update((state) => ({
      ...state,
      bossProgress: {
        ...state.bossProgress,
        [bossId]: {
          ...(state.bossProgress[bossId] || {}),
          passed: false,
          passedAt: null,
        },
      },
    }));
  }, [update]);

  const unmarkBoss = useCallback((bossId) => {
    update((state) => {
      const xp = state.bossProgress[bossId]?.xpAmount || 0;
      const newXP = Math.max(0, state.player.totalXP - xp);

      return {
        ...state,
        bossProgress: {
          ...state.bossProgress,
          [bossId]: {
            ...(state.bossProgress[bossId] || {}),
            passed: false,
            passedAt: null,
            xpAwarded: false,
            xpAmount: 0,
          },
        },
        player: {
          ...state.player,
          totalXP: newXP,
          level: Math.floor(newXP / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  const recordBossAttempt = useCallback((bossId) => {
    update((state) => ({
      ...state,
      bossProgress: {
        ...state.bossProgress,
        [bossId]: {
          ...(state.bossProgress[bossId] || {}),
          passed: false,
          attempts: (state.bossProgress[bossId]?.attempts || 0) + 1,
        },
      },
    }));
  }, [update]);

  return { passBoss, unpassBoss, unmarkBoss, recordBossAttempt };
}
