import { useCallback } from "react";

export function useSequenceActions(state, update) {
  const setMovementNote = useCallback((movementId, note) => {
    update((storeState) => ({
      ...storeState,
      movementProgress: {
        ...storeState.movementProgress,
        [movementId]: {
          ...(storeState.movementProgress[movementId] || { masteryLevel: 0, reps: 0 }),
          notes: note,
        },
      },
    }));
  }, [update]);

  const getMovementNote = useCallback(
    (movementId) => state.movementProgress[movementId]?.notes || "",
    [state.movementProgress]
  );

  const markSequencePracticed = useCallback((seqId) => {
    const date = new Date().toISOString().split("T")[0];
    update((storeState) => ({
      ...storeState,
      seqLog: [{ seqId, date }, ...storeState.seqLog].slice(0, 500),
    }));
  }, [update]);

  const getSeqLastPracticed = useCallback((seqId) => {
    const entry = state.seqLog.find((item) => item.seqId === seqId);
    return entry ? entry.date : null;
  }, [state.seqLog]);

  const logComboPractice = useCallback((comboId, completionTimeMs) => {
    update((storeState) => {
      const stats = storeState.comboStats?.[comboId] || { timesPracticed: 0, lastPracticed: null, bestTime: null };
      return {
        ...storeState,
        comboStats: {
          ...storeState.comboStats,
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
    setMovementNote,
    getMovementNote,
    markSequencePracticed,
    getSeqLastPracticed,
    logComboPractice,
  };
}
