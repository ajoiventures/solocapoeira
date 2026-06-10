const STORAGE_KEY = "solo_leveling_state_v1";
const STATE_VERSION = 3;

const MIGRATIONS = [
  {
    version: 2,
    description: "Add graceTokens, earnedTitles, activeTitle, bonusChallengesDone",
    migrate(state) {
      return {
        ...state,
        graceTokens: state.graceTokens ?? 0,
        earnedTitles: state.earnedTitles ?? [],
        activeTitle: state.activeTitle ?? null,
        bonusChallengesDone: state.bonusChallengesDone ?? {},
        earnedAchievements: state.earnedAchievements ?? [],
        lastKnownRank: state.lastKnownRank ?? "U",
      };
    },
  },
  {
    version: 3,
    description: "Add comboStats (combo practice tracking from Phase B)",
    migrate(state) {
      return {
        ...state,
        comboStats: state.comboStats ?? {},
      };
    },
  },
];

export function runMigrations(state) {
  const currentVersion = state._version || 1;
  let migrated = { ...state };
  let didMigrate = false;

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      migrated = migration.migrate(migrated);
      didMigrate = true;
    }
  }

  if (didMigrate) {
    migrated._version = STATE_VERSION;
  }

  return migrated;
}

export function buildOrishaProgress(integratedIds = [], existingProgress = {}) {
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

export const defaultState = () => ({
  movementProgress: {},
  painLog: {},
  sessionLog: [],
  repLog: [],
  seqLog: [],
  unlockedSequences: [],
  masteryMilestones: [],
  conceptMilestones: [],
  seenConceptIntro: false,
  earnedAchievements: [],
  achievementQueue: [],
  lastKnownRank: "U",
  restDays: [],
  bossProgress: {},
  mestreProgress: {},
  lineageRewards: {},
  trainingPhase: {
    currentPhase: 1,
    phaseCompletedAt: null,
    phaseCompletionPercent: 0,
    phasesCompleted: [],
  },
  conceptTreeProgress: { malicia: 0, malandragem: 0, mandinga: 0 },
  orishasIntegrated: [],
  integratedOrishas: [],
  orishaProgress: {},
  prestige: {
    rank: 0,
    active: false,
    trialsCompleted: {},
    lastAscendedAt: null,
  },
  ehiStatus: {
    isAscended: false,
    ascendedAt: null,
    prestigeMode: false,
    prestigeCosmetics: [],
  },
  player: {
    totalXP: 0,
    level: 1,
    currentSprint: "sprint_1",
    currentWeek: 1,
    streakDays: 0,
    lastTrainingDate: null,
    spiritualPath: "Ogun (Core)",
  },
  todayQuest: {
    date: null,
    completed: [],
    skipped: [],
    bonusItems: [],
    bonusXP: 0,
  },
  bonusLogs: {},
  stepsLog: {},
  apf: {
    pillars: { for: 0, vel: 0, res: 0, nut: 0, fnd: 0, fld: 0 },
    recoveryLog: {},
  },
  settings: {
    name: "Hunter",
    showTutorialLinks: true,
    painThreshold: 3,
    vestWeight: 0,
  },
  cloudSyncStatus: "idle",
  lastCloudSyncTime: null,
});

export function loadStoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState(), _version: STATE_VERSION };
    const saved = runMigrations(JSON.parse(raw));
    const def = defaultState();
    const integratedOrishas = saved.integratedOrishas || saved.orishasIntegrated || [];
    const orishaProgress = buildOrishaProgress(integratedOrishas, saved.orishaProgress || {});

    return {
      ...def,
      ...saved,
      player: { ...def.player, ...(saved.player || {}) },
      apf: { ...def.apf, ...(saved.apf || {}), recoveryLog: saved.apf?.recoveryLog || {} },
      todayQuest: { ...def.todayQuest, ...(saved.todayQuest || {}) },
      settings: { ...def.settings, ...(saved.settings || {}) },
      ehiStatus: { ...def.ehiStatus, ...(saved.ehiStatus || {}) },
      repLog: saved.repLog || [],
      seqLog: saved.seqLog || [],
      unlockedSequences: saved.unlockedSequences || [],
      masteryMilestones: saved.masteryMilestones || [],
      conceptMilestones: saved.conceptMilestones || [],
      earnedAchievements: saved.earnedAchievements || [],
      achievementQueue: [],
      lastKnownRank: saved.lastKnownRank || "U",
      bonusChallengesDone: saved.bonusChallengesDone || {},
      graceTokens: saved.graceTokens ?? 0,
      earnedTitles: saved.earnedTitles || [],
      activeTitle: saved.activeTitle || null,
      combos: saved.combos || [],
      comboStats: saved.comboStats || {},
      restDays: saved.restDays || [],
      mestreProgress: saved.mestreProgress || {},
      lineageRewards: saved.lineageRewards || {},
      trainingPhase: saved.trainingPhase || { currentPhase: 1, phaseCompletedAt: null, phaseCompletionPercent: 0, phasesCompleted: [] },
      conceptTreeProgress: saved.conceptTreeProgress || { malicia: 0, malandragem: 0, mandinga: 0 },
      orishasIntegrated: integratedOrishas,
      integratedOrishas,
      orishaProgress,
      prestige: { ...def.prestige, ...(saved.prestige || {}) },
      cloudSyncStatus: saved.cloudSyncStatus || "idle",
      lastCloudSyncTime: saved.lastCloudSyncTime || null,
    };
  } catch {
    return defaultState();
  }
}

function estimateStorageKB(str) {
  return (str.length * 2) / 1024;
}

export function saveStoreState(state) {
  try {
    const serialized = JSON.stringify(state);
    const kb = estimateStorageKB(serialized);
    if (kb > 4500) {
      console.warn(`[store] Storage at ${Math.round(kb)}KB - approaching limit. Trimming repLog.`);
      const trimmed = { ...state, repLog: (state.repLog || []).slice(-500) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return;
    }
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    if (err?.name === "QuotaExceededError") {
      try {
        const minimal = {
          ...state,
          repLog: (state.repLog || []).slice(-200),
          sessionLog: (state.sessionLog || []).slice(-50),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
      } catch {
        console.error("[store] localStorage full - could not save state.");
      }
    }
  }
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export async function pushCloudState(state, onStatusChange) {
  try {
    onStatusChange?.("syncing");
    const { pushState } = await import("../lib/cloudSync.js");
    await pushState(state);
    onStatusChange?.("idle", new Date().toISOString());
  } catch (error) {
    console.error("[store] Cloud sync failed:", error);
    onStatusChange?.("error");
    setTimeout(() => onStatusChange?.("idle"), 3000);
  }
}
