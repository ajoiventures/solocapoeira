import { useCallback } from "react";
import { track } from "../lib/analytics.js";
import { XP_PER_LEVEL } from "../data/constants.js";
import { getStoreMestreLineage, getStoreLineageProgress } from "../data/storeMestreLineage.js";
import { canAdvancePhase, getPhaseProgress } from "../data/trainingPhases.js";
import { getMestreSequenceIds } from "../data/mestreSequenceUnlocks.js";
import { getCoreOrishaCount, getOrishaMetaById } from "../data/orishaIndex.js";
import { getPrestigeMultiplier } from "./storeCalculations.js";

const MESTRE_CONCEPT_TREE_MAP = {
  "mestre_bimba": "malandragem",
  "mestre_pastinha": "malicia",
  "mestre_waldemar": "mandinga",
  "mestre_besouro": "malicia",
  "mestre_joao_grande": "mandinga",
  "mestre_joao_pequeno": "malicia",
  "mestre_caiçara": "malicia",
  "mestre_gato_preto": "malicia",
  "mestre_cobra_mansa": "mandinga",
  "mestre_nenel": "malicia",
  "mestre_santo_amaro": "mandinga",
  "mestre_nô": "malicia",
  "mestre_canjiquinha": "malicia",
  "mestre_moa_cartorio": "mandinga",
  "mestre_moraes": "malicia",
  "mestre_suassuna": "mandinga",
  "mestre_brasilia_ferrez": "malandragem",
  "mestre_gildo": "malandragem",
  "mestre_grao": "malandragem",
  "mestre_papai": "malandragem",
  "mestre_talo": "malandragem",
  "mestre_bom_jesus": "mandinga",
  "mestre_sinha": "mandinga",
  "mestre_polêmica": "mandinga",
  "mestre_zulu": "mandinga",
  "mestre_amen": "mandinga",
  "mestre_david_moura": "malandragem",
  "mestre_pe_de_bananeira": "mandinga",
  "mestre_acordeon": "mandinga",
  "mestre_malicia": "malicia",
  "mestre_mandinga": "mandinga",
  "mestre_malandragem": "malandragem",
};

const CONCEPT_TREE_MESTRES = ["mestre_malicia", "mestre_mandinga", "mestre_malandragem"];

export function useProgressionActions(state, update) {
  const defeatMestre = useCallback((mestreId, xp = 0) => {
    update((storeState) => {
      const alreadyAwarded = storeState.mestreProgress[mestreId]?.xpAwarded;
      const xpToAdd = alreadyAwarded ? 0 : Math.round(xp * getPrestigeMultiplier(storeState));
      const conceptTreeBonus = CONCEPT_TREE_MESTRES.includes(mestreId) ? 2 : 1;
      const conceptTree = MESTRE_CONCEPT_TREE_MAP[mestreId];
      const newConceptProgress = { ...storeState.conceptTreeProgress };
      let newConceptMilestones = [...(storeState.conceptMilestones || [])];

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

      const lineage = getStoreMestreLineage(mestreId);
      const newLineageRewards = { ...storeState.lineageRewards };
      if (lineage && !storeState.lineageRewards[lineage.key]?.unlocked) {
        const defeatedMestres = Object.keys(storeState.mestreProgress)
          .filter((id) => storeState.mestreProgress[id]?.defeated)
          .concat([mestreId]);
        const progress = getStoreLineageProgress(lineage.key, defeatedMestres);
        if (progress.completed) {
          newLineageRewards[lineage.key] = {
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            reward: lineage.reward,
          };
        }
      }

      const newUnlockedSequences = [...storeState.unlockedSequences];
      getMestreSequenceIds(mestreId).forEach((sequenceId) => {
        if (!newUnlockedSequences.includes(sequenceId)) {
          newUnlockedSequences.push(sequenceId);
        }
      });

      return {
        ...storeState,
        mestreProgress: {
          ...storeState.mestreProgress,
          [mestreId]: {
            defeated: true,
            progressionTier: 3,
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
          ...storeState.player,
          totalXP: storeState.player.totalXP + xpToAdd,
          level: Math.floor((storeState.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
      };
    });
    track.mestresDefeated(mestreId);
  }, [update]);

  const isMestreDefeated = useCallback(
    (mestreId) => !!state.mestreProgress[mestreId]?.defeated,
    [state.mestreProgress]
  );

  const integrateOrisha = useCallback((orishaId, xp = 0) => {
    update((storeState) => {
      const alreadyIntegrated = storeState.orishasIntegrated.includes(orishaId);
      const xpToAdd = alreadyIntegrated ? 0 : xp;
      const masteredAt = storeState.orishaProgress?.[orishaId]?.masteredAt || new Date().toISOString();
      const newIntegrated = alreadyIntegrated
        ? storeState.orishasIntegrated
        : [...storeState.orishasIntegrated, orishaId];
      const allIntegrated = newIntegrated.length >= getCoreOrishaCount();
      const newEhiStatus = allIntegrated && !storeState.ehiStatus.isAscended
        ? {
            ...storeState.ehiStatus,
            isAscended: true,
            ascendedAt: masteredAt,
            prestigeMode: true,
            prestigeCosmetics: [
              ...new Set([...(storeState.ehiStatus.prestigeCosmetics || []), "Ehi Ascended", "Ehi Crown", "Spirit Aura", "Eternal Title"]),
            ],
          }
        : storeState.ehiStatus;
      const newPrestige = allIntegrated && !storeState.ehiStatus.isAscended
        ? { ...(storeState.prestige || {}), active: true, lastAscendedAt: masteredAt }
        : storeState.prestige;
      const pathString = newIntegrated.length === 0
        ? "Ogun (Core)"
        : `Ogun (Core) + ${newIntegrated.length} Orishas integrated`;

      return {
        ...storeState,
        orishasIntegrated: newIntegrated,
        integratedOrishas: newIntegrated,
        orishaProgress: {
          ...(storeState.orishaProgress || {}),
          [orishaId]: {
            ...(storeState.orishaProgress?.[orishaId] || {}),
            integrated: true,
            masteredAt,
            xp: (storeState.orishaProgress?.[orishaId]?.xp || 0) + xpToAdd,
          },
        },
        ehiStatus: newEhiStatus,
        prestige: newPrestige,
        player: {
          ...storeState.player,
          totalXP: storeState.player.totalXP + xpToAdd,
          level: Math.floor((storeState.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
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
    if (state.ehiStatus.isAscended) return "Ehi Ascended (All 16 integrated)";
    if (state.orishasIntegrated.length === 0) return "Ogun (Core)";
    return `Ogun (Core) + ${state.orishasIntegrated.length}/${getCoreOrishaCount()} Orishas`;
  }, [state.orishasIntegrated, state.ehiStatus.isAscended]);

  const isEhiAscended = useCallback(
    () => state.ehiStatus.isAscended,
    [state.ehiStatus.isAscended]
  );

  const canIntegrateOrisha = useCallback((orishaId) => {
    if (state.orishasIntegrated.includes(orishaId)) {
      return { canIntegrate: true, reason: "already_integrated" };
    }

    const orisha = getOrishaMetaById(orishaId);
    if (!orisha) return { canIntegrate: false, reason: "orisha_not_found" };

    const mandinga = state.conceptTreeProgress.mandinga || 0;
    const malandragem = state.conceptTreeProgress.malandragem || 0;
    const malicia = state.conceptTreeProgress.malicia || 0;
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

    const requirements = orisha.gatingRequirements || {};
    if (requirements.mandinga && mandinga < requirements.mandinga) {
      return { canIntegrate: false, reason: "insufficient_mandinga", required: requirements.mandinga, current: mandinga };
    }
    if (requirements.malandragem && malandragem < requirements.malandragem) {
      return { canIntegrate: false, reason: "insufficient_malandragem", required: requirements.malandragem, current: malandragem };
    }
    if (requirements.malicia && malicia < requirements.malicia) {
      return { canIntegrate: false, reason: "insufficient_malicia", required: requirements.malicia, current: malicia };
    }
    if (requirements.minPhase && state.trainingPhase.currentPhase < requirements.minPhase) {
      return {
        canIntegrate: false,
        reason: "insufficient_phase",
        required: requirements.minPhase,
        current: state.trainingPhase.currentPhase,
      };
    }

    return { canIntegrate: true, reason: "gates_passed" };
  }, [state.orishasIntegrated, state.conceptTreeProgress, state.trainingPhase.currentPhase]);

  const getOrishaGatingStatus = useCallback((orishaId) => canIntegrateOrisha(orishaId), [canIntegrateOrisha]);

  const getCurrentOrishas = useCallback(() => (
    state.orishasIntegrated.map((orishaId) => getOrishaMetaById(orishaId)).filter(Boolean)
  ), [state.orishasIntegrated]);

  const getPrestigeXPMultiplier = useCallback(() => (
    Number(getPrestigeMultiplier(state).toFixed(2))
  ), [state]);

  const beginPrestigeRun = useCallback(() => {
    update((storeState) => {
      if (!storeState.ehiStatus.isAscended) return storeState;
      const nextRank = (storeState.prestige?.rank || 0) + 1;
      return {
        ...storeState,
        prestige: {
          ...(storeState.prestige || {}),
          rank: nextRank,
          active: true,
          startedAt: new Date().toISOString(),
        },
        player: {
          ...storeState.player,
          totalXP: 0,
          level: 1,
          spiritualPath: `Ehi Ascended - Prestige ${nextRank}`,
        },
        trainingPhase: {
          ...storeState.trainingPhase,
          currentPhase: 1,
          phaseCompletionPercent: 0,
          phasesCompleted: [],
        },
      };
    });
  }, [update]);

  const completePrestigeTrial = useCallback((trialId, reward = {}) => {
    update((storeState) => {
      if (!storeState.ehiStatus.isAscended) return storeState;
      const alreadyCompleted = !!storeState.prestige?.trialsCompleted?.[trialId];
      const xpToAdd = alreadyCompleted ? 0 : Math.round((reward.xp || 0) * 2);
      const cosmetics = reward.cosmetic
        ? [...new Set([...(storeState.ehiStatus.prestigeCosmetics || []), reward.cosmetic])]
        : storeState.ehiStatus.prestigeCosmetics;

      return {
        ...storeState,
        prestige: {
          ...(storeState.prestige || {}),
          active: true,
          trialsCompleted: {
            ...(storeState.prestige?.trialsCompleted || {}),
            [trialId]: {
              completed: true,
              completedAt: storeState.prestige?.trialsCompleted?.[trialId]?.completedAt || new Date().toISOString(),
              reward,
            },
          },
        },
        ehiStatus: {
          ...storeState.ehiStatus,
          prestigeCosmetics: cosmetics,
        },
        player: {
          ...storeState.player,
          totalXP: storeState.player.totalXP + xpToAdd,
          level: Math.floor((storeState.player.totalXP + xpToAdd) / XP_PER_LEVEL) + 1,
        },
      };
    });
  }, [update]);

  const consumeGraceToken = useCallback(() => {
    update((storeState) => {
      if ((storeState.graceTokens || 0) <= 0) return storeState;
      const today = new Date().toISOString().split("T")[0];
      return {
        ...storeState,
        graceTokens: storeState.graceTokens - 1,
        restDays: [...(storeState.restDays || []), today].slice(-60),
      };
    });
  }, [update]);

  const completeBonusChallenge = useCallback((doneKey, xp) => {
    track.bonusChallengeCompleted(doneKey, xp);
    update((storeState) => {
      const xpToAdd = Math.round(xp * getPrestigeMultiplier(storeState));
      const newXP = storeState.player.totalXP + xpToAdd;
      return {
        ...storeState,
        bonusChallengesDone: { ...(storeState.bonusChallengesDone || {}), [doneKey]: true },
        player: { ...storeState.player, totalXP: newXP, level: Math.floor(newXP / XP_PER_LEVEL) + 1 },
      };
    });
  }, [update]);

  const dismissAchievement = useCallback((qid) => {
    update((storeState) => ({
      ...storeState,
      achievementQueue: (storeState.achievementQueue || []).filter((achievement) => achievement.qid !== qid),
    }));
  }, [update]);

  const dismissConceptMilestone = useCallback((id) => {
    update((storeState) => ({
      ...storeState,
      conceptMilestones: (storeState.conceptMilestones || []).filter((milestone) => milestone.id !== id),
    }));
  }, [update]);

  const dismissMilestone = useCallback((id) => {
    update((storeState) => ({
      ...storeState,
      masteryMilestones: (storeState.masteryMilestones || []).filter((milestone) => milestone.id !== id),
    }));
  }, [update]);

  const clearMilestones = useCallback(() => {
    update((storeState) => ({ ...storeState, masteryMilestones: [] }));
  }, [update]);

  const getCurrentPhase = useCallback(() => state.trainingPhase.currentPhase, [state.trainingPhase.currentPhase]);

  const getPhaseCompletionPercent = useCallback(() => {
    const currentPhase = state.trainingPhase.currentPhase;
    return getPhaseProgress(
      currentPhase,
      state.conceptTreeProgress,
      Object.keys(state.mestreProgress).filter((id) => state.mestreProgress[id]?.defeated)
    );
  }, [state.trainingPhase.currentPhase, state.conceptTreeProgress, state.mestreProgress]);

  const canAdvanceToNextPhase = useCallback(() => (
    canAdvancePhase(state.trainingPhase.currentPhase, state)
  ), [state]);

  const advanceToNextPhase = useCallback(() => {
    if (!canAdvancePhase(state.trainingPhase.currentPhase, state)) {
      console.warn("Cannot advance phase: requirements not met");
      return false;
    }

    update((storeState) => {
      const nextPhase = storeState.trainingPhase.currentPhase + 1;
      return {
        ...storeState,
        trainingPhase: {
          ...storeState.trainingPhase,
          currentPhase: nextPhase,
          phaseCompletedAt: new Date().toISOString(),
          phasesCompleted: [...(storeState.trainingPhase.phasesCompleted || []), storeState.trainingPhase.currentPhase],
          phaseCompletionPercent: 0,
        },
      };
    });
    return true;
  }, [state, update]);

  const isPhaseAccessible = useCallback((phaseId) => {
    if (phaseId === 1) return true;
    return state.trainingPhase.phasesCompleted.includes(phaseId - 1);
  }, [state.trainingPhase.phasesCompleted]);

  return {
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
    consumeGraceToken,
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
  };
}
