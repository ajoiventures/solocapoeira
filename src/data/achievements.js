/**
 * achievements.js — 25 core achievements.
 * Each has: id, title, desc, icon, color, category.
 * Checked in useStore on relevant state changes.
 */

export const ACHIEVEMENTS = [
  // ── First Steps ──────────────────────────────────────────────────
  {
    id: "first_session",
    title: "First Steps",
    desc: "Log your first training session",
    icon: "🎯",
    color: "#2E8C78",
    category: "training",
  },
  {
    id: "first_mastery",
    title: "Aware",
    desc: "Advance your first movement to Drilling",
    icon: "⚡",
    color: "#4F7CFF",
    category: "mastery",
  },
  {
    id: "first_100_reps",
    title: "Century",
    desc: "Log 100 total reps on any movement",
    icon: "💯",
    color: "#D4854A",
    category: "training",
  },
  // ── Streak ───────────────────────────────────────────────────────
  {
    id: "streak_3",
    title: "3-Day Streak",
    desc: "Train 3 days in a row",
    icon: "🔥",
    color: "#D4854A",
    category: "streak",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    desc: "Train 7 days in a row",
    icon: "🔥",
    color: "#C95252",
    category: "streak",
  },
  {
    id: "streak_30",
    title: "Month of Axé",
    desc: "Train 30 days in a row",
    icon: "🔥",
    color: "#D9A441",
    category: "streak",
  },
  // ── Mastery ──────────────────────────────────────────────────────
  {
    id: "first_owning",
    title: "Owning It",
    desc: "Reach Owning mastery on any movement",
    icon: "🎖️",
    color: "#D4854A",
    category: "mastery",
  },
  {
    id: "first_instinct",
    title: "Instinct",
    desc: "Reach Instinct mastery — the movement disappears into you",
    icon: "✦",
    color: "#D9A441",
    category: "mastery",
  },
  {
    id: "five_instinct",
    title: "Five Stars",
    desc: "Reach Instinct on 5 different movements",
    icon: "✦✦",
    color: "#D9A441",
    category: "mastery",
  },
  // ── Rank ─────────────────────────────────────────────────────────
  {
    id: "rank_G",
    title: "Green Cord",
    desc: "Earn your first cord rank — Aluno Batizado",
    icon: "🟢",
    color: "#16a34a",
    category: "rank",
  },
  {
    id: "rank_E",
    title: "Yellow Cord",
    desc: "The Warrior Student — Aluno Guerreiro",
    icon: "🟡",
    color: "#ca8a04",
    category: "rank",
  },
  {
    id: "rank_C",
    title: "Blue Cord — Instrutor",
    desc: "Instructor rank. You are now qualified to teach.",
    icon: "🔵",
    color: "#2563eb",
    category: "rank",
  },
  {
    id: "rank_S",
    title: "Mestre",
    desc: "White Cord — the apex. 20+ years of mastery.",
    icon: "⚪",
    color: "#94a3b8",
    category: "rank",
  },
  // ── Boss Path ────────────────────────────────────────────────────
  {
    id: "first_boss",
    title: "First Trial",
    desc: "Pass your first boss test",
    icon: "⚔️",
    color: "#D4854A",
    category: "boss",
  },
  {
    id: "first_mestre",
    title: "Mestre Slayer",
    desc: "Defeat your first Mestre — enter the master's path",
    icon: "🗡️",
    color: "#D9A441",
    category: "boss",
  },
  {
    id: "five_mestres",
    title: "Path of Masters",
    desc: "Defeat 5 Mestres",
    icon: "🗡️",
    color: "#D9A441",
    category: "boss",
  },
  {
    id: "all_mestres",
    title: "Lineage Complete",
    desc: "Defeat all 27 Mestres — you carry every lineage",
    icon: "👑",
    color: "#D9A441",
    category: "boss",
  },
  // ── Orisha Path ──────────────────────────────────────────────────
  {
    id: "first_orisha",
    title: "Ogun Expands",
    desc: "Integrate your first Orisha",
    icon: "✨",
    color: "#7C3AED",
    category: "orisha",
  },
  {
    id: "five_orishas",
    title: "Spirit Grows",
    desc: "Integrate 5 Orishas",
    icon: "✨",
    color: "#7C3AED",
    category: "orisha",
  },
  {
    id: "ehi_ascended",
    title: "Ehi Ascended",
    desc: "All 16 Orishas integrated — you are the practice itself",
    icon: "🌟",
    color: "#D9A441",
    category: "orisha",
  },
  // ── Volume ───────────────────────────────────────────────────────
  {
    id: "reps_1000",
    title: "1,000 Reps",
    desc: "Log 1,000 total reps across all movements",
    icon: "📊",
    color: "#2E8C78",
    category: "training",
  },
  {
    id: "reps_10000",
    title: "10,000 Reps",
    desc: "Ten thousand reps. The body remembers.",
    icon: "📊",
    color: "#D9A441",
    category: "training",
  },
  {
    id: "sessions_10",
    title: "10 Sessions",
    desc: "Complete 10 training sessions",
    icon: "📋",
    color: "#2E8C78",
    category: "training",
  },
  {
    id: "sessions_50",
    title: "50 Sessions",
    desc: "50 sessions — you are no longer a beginner",
    icon: "📋",
    color: "#D4854A",
    category: "training",
  },
  {
    id: "concept_tree_maxed",
    title: "Tree of Knowledge",
    desc: "Reach level 5 in any concept tree",
    icon: "🌳",
    color: "#2E8C78",
    category: "concepts",
  },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id) || null;
}

/**
 * Check which achievements should be earned given the current store state.
 * Returns array of achievement IDs that are newly earned (not in earnedAchievements).
 */
export function checkAchievements(state) {
  const earned = new Set(state.earnedAchievements || []);
  const newlyEarned = [];

  function check(id, condition) {
    if (!earned.has(id) && condition) newlyEarned.push(id);
  }

  const sessions = (state.sessionLog || []).length;
  const totalReps = Object.values(state.movementProgress || {})
    .reduce((sum, p) => sum + (p?.reps || 0), 0);
  const masteryLevels = Object.values(state.movementProgress || {})
    .map((p) => p?.masteryLevel || 0);
  const instinctCount = masteryLevels.filter((l) => l >= 5).length;
  const owningCount = masteryLevels.filter((l) => l >= 3).length;
  const drillingCount = masteryLevels.filter((l) => l >= 2).length;
  const streak = state.player?.streakDays || 0;
  const mestreDefeats = Object.values(state.mestreProgress || {})
    .filter((p) => p?.defeated).length;
  const passedBosses = Object.values(state.bossProgress || {})
    .filter((p) => p?.passed).length;
  const orishasCount = (state.orishasIntegrated || []).length;
  const level = state.player?.level || 1;
  const ct = state.conceptTreeProgress || {};

  // Training
  check("first_session", sessions >= 1);
  check("sessions_10",   sessions >= 10);
  check("sessions_50",   sessions >= 50);
  check("first_100_reps", totalReps >= 100);
  check("reps_1000",     totalReps >= 1000);
  check("reps_10000",    totalReps >= 10000);

  // Streak
  check("streak_3",  streak >= 3);
  check("streak_7",  streak >= 7);
  check("streak_30", streak >= 30);

  // Mastery
  check("first_mastery",  drillingCount >= 1);
  check("first_owning",   owningCount >= 1);
  check("first_instinct", instinctCount >= 1);
  check("five_instinct",  instinctCount >= 5);

  // Rank (use level thresholds from bonusQuests.js)
  check("rank_G", level >= 8);
  check("rank_E", level >= 28);
  check("rank_C", level >= 58);
  check("rank_S", level >= 130);

  // Boss
  check("first_boss",   passedBosses >= 1);
  check("first_mestre", mestreDefeats >= 1);
  check("five_mestres", mestreDefeats >= 5);
  check("all_mestres",  mestreDefeats >= 27);

  // Orisha
  check("first_orisha", orishasCount >= 1);
  check("five_orishas", orishasCount >= 5);
  check("ehi_ascended", orishasCount >= 16);

  // Concepts
  check("concept_tree_maxed",
    Math.max(ct.mandinga || 0, ct.malandragem || 0, ct.malicia || 0) >= 5);

  return newlyEarned;
}
