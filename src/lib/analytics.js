import posthog from "posthog-js";

const key  = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";
const enabled = Boolean(key);

export function initAnalytics() {
  if (!enabled) return;
  posthog.init(key, {
    api_host: host,
    autocapture: false,        // manual events only — no noise
    capture_pageview: false,   // SPA — we fire these manually
    persistence: "localStorage",
  });
}

function capture(event, props = {}) {
  if (!enabled) return;
  posthog.capture(event, props);
}

// ── Core tracking events ──────────────────────────────────────────
// Call these from the store after each action.

export const track = {
  // Called once on first open
  appOpened: (props = {}) =>
    capture("app_opened", props),

  // Page navigation
  pageView: (page) =>
    capture("page_view", { page }),

  // Rep logging — most important event
  repsLogged: (movementId, count, masteryLevel) =>
    capture("reps_logged", { movementId, count, masteryLevel }),

  // Mastery advance — key retention signal
  masteryAdvanced: (movementId, fromLevel, toLevel) =>
    capture("mastery_advanced", { movementId, fromLevel, toLevel }),

  // Session completed
  sessionCompleted: (xpEarned, movementsLogged) =>
    capture("session_completed", { xpEarned, movementsLogged }),

  // Mestre defeated — major milestone
  mestresDefeated: (mestreId) =>
    capture("mestre_defeated", { mestreId }),

  // Orisha integrated
  orishaIntegrated: (orishaId, totalIntegrated) =>
    capture("orisha_integrated", { orishaId, totalIntegrated }),

  // Streak milestone
  streakReached: (days) =>
    capture("streak_reached", { days }),

  // Achievement unlocked
  achievementUnlocked: (achievementId) =>
    capture("achievement_unlocked", { achievementId }),

  // Flow session completed
  flowSessionCompleted: (durationSeconds) =>
    capture("flow_session_completed", { durationSeconds }),

  // Daily bonus challenge completed
  bonusChallengeCompleted: (challengeId, xp) =>
    capture("bonus_challenge_completed", { challengeId, xp }),

  // Rank up
  rankUp: (newRank) =>
    capture("rank_up", { newRank }),
};

// Identify user after auth
export function identifyUser(userId, props = {}) {
  if (!enabled) return;
  posthog.identify(userId, props);
}

export function resetAnalyticsUser() {
  if (!enabled) return;
  posthog.reset();
}
