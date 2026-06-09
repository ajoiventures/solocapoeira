/**
 * Cosmetic Titles & Ranks
 * Earned through achievements and milestones — purely cosmetic
 * Compatible with earnedAchievements tracking system
 */

export const TITLES = [
  // Existing core titles (earned via achievements)
  { id: "first_session",    label: "The Beginner",          name: "🎯 The Beginner", color: "#6b7280", category: "achievement", tier: 1 },
  { id: "streak_7",         label: "Week Warrior",           name: "🔥 Week Warrior", color: "#D4854A", category: "streak", tier: 1 },
  { id: "streak_30",        label: "Month of Axé",           name: "🔥 Month of Axé", color: "#D9A441", category: "streak", tier: 2 },
  { id: "first_owning",     label: "Owning the Game",        name: "⚔️ Owning the Game", color: "#4F7CFF", category: "achievement", tier: 1 },
  { id: "first_instinct",   label: "The Instinct",           name: "🎯 The Instinct", color: "#D9A441", category: "achievement", tier: 1 },
  { id: "five_instinct",    label: "Five-Star Capoeirista",  name: "⭐ Five-Star Capoeirista", color: "#D9A441", category: "mastery", tier: 2 },
  { id: "first_boss",       label: "Boss Tested",            name: "🗡️ Boss Tested", color: "#D4854A", category: "boss", tier: 1 },
  { id: "first_mestre",     label: "Mestre Slayer",          name: "👺 Mestre Slayer", color: "#D9A441", category: "mestre", tier: 1 },
  { id: "five_mestres",     label: "Path of Masters",        name: "👑 Path of Masters", color: "#D9A441", category: "mestre", tier: 2 },
  { id: "all_mestres",      label: "Living Lineage",         name: "🌟 Living Lineage", color: "#7C3AED", category: "mestre", tier: 3 },
  { id: "first_orisha",     label: "Ogun Expanded",          name: "✨ Ogun Expanded", color: "#7C3AED", category: "orisha", tier: 1 },
  { id: "ehi_ascended",     label: "Ehi Ascended",           name: "👑 Ehi Ascended", color: "#D9A441", category: "prestige", tier: 3 },
  { id: "reps_10000",       label: "Ten Thousand",           name: "💪 Ten Thousand", color: "#2E8C78", category: "training", tier: 2 },
  { id: "concept_tree_maxed", label: "Tree of Knowledge",    name: "🌳 Tree of Knowledge", color: "#2E8C78", category: "knowledge", tier: 3 },
  { id: "rank_S",           label: "Mestre",                 name: "👑 Mestre", color: "#94a3b8", category: "rank", tier: 4 },

  // New cosmetic titles
  { id: "streak_60",        label: "Diamond Streak",         name: "💎 Diamond Streak", color: "#4F7CFF", category: "streak", tier: 3 },
  { id: "streak_100",       label: "Immortal Warrior",       name: "👑 Immortal Warrior", color: "#FFD700", category: "streak", tier: 4 },
];

/**
 * Check if player has earned a title based on current state
 */
export function checkTitleEarned(titleId, state) {
  if (!state) return false;

  const { player, movementProgress, bossProgress, mestreProgress, orishaProgress, prestige } = state;
  const level = player?.level || 0;
  const streak = player?.streakDays || 0;
  const masteredCount = Object.values(movementProgress || {}).filter(m => m.masteryLevel === 5).length;
  const bossesDefeated = Object.values(bossProgress || {}).filter(b => b.passed).length;
  const mestresDefeated = Object.values(mestreProgress || {}).filter(m => m.defeated).length;
  const orishasIntegrated = Object.keys(orishaProgress || {}).filter(id => orishaProgress[id]?.integrated).length;
  const prestigeRuns = prestige?.rank || 0;
  const combosCreated = (state.combos || []).length;
  const sessionsLogged = (state.sessionLog || []).length;

  switch (titleId) {
    // Streak
    case "streak_7": return streak >= 7;
    case "streak_14": return streak >= 14;
    case "streak_30": return streak >= 30;
    case "streak_60": return streak >= 60;
    case "streak_100": return streak >= 100;

    // Level
    case "level_10": return level >= 10;
    case "level_25": return level >= 25;
    case "level_50": return level >= 50;
    case "level_99": return level >= 99;

    // Mastery
    case "mastery_50": return masteredCount >= 50;
    case "mastery_100": return masteredCount >= 100;
    case "mastery_200": return masteredCount >= 200;

    // Bosses/Mestres
    case "boss_slayer": return bossesDefeated >= 10; // assume 10 bosses
    case "mestre_hunter": return mestresDefeated >= 43; // all mestres
    case "orisha_blessed": return orishasIntegrated >= 16; // all orishas

    // Prestige
    case "prestige_1": return prestigeRuns >= 1;
    case "prestige_3": return prestigeRuns >= 3;
    case "prestige_5": return prestigeRuns >= 5;

    // Special
    case "first_combo": return combosCreated >= 1;
    case "trainer": return sessionsLogged >= 50;
    case "elder": return (state.earnedAchievements?.length || 0) > 0 && level >= 20; // proxy for age

    default: return false;
  }
}

/**
 * Get title display info
 */
export function getTitleById(titleId) {
  return TITLES.find(t => t.id === titleId);
}

/**
 * Get all available titles with earned status
 */
export function getAvailableTitles(state) {
  return TITLES.map(title => ({
    ...title,
    earned: checkTitleEarned(title.id, state),
  }));
}
