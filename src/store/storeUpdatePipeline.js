import { track } from "../lib/analytics.js";
import { checkAchievements, getAchievementById } from "../data/achievements.js";
import { RANKS } from "../data/rankUtils.js";

export function applyPostUpdateEffects(next) {
  const newlyEarned = checkAchievements(next);
  if (newlyEarned.length > 0) {
    newlyEarned.forEach((id) => track.achievementUnlocked(id));
    const newQueue = [
      ...(next.achievementQueue || []),
      ...newlyEarned.map((id) => {
        const achievement = getAchievementById(id);
        return {
          id,
          title: achievement?.title || id,
          desc: achievement?.desc || "",
          icon: achievement?.icon || "🏆",
          color: achievement?.color || "var(--accent)",
          qid: `${id}_${Date.now()}`,
        };
      }),
    ].slice(0, 5);

    return {
      ...next,
      earnedAchievements: [...(next.earnedAchievements || []), ...newlyEarned],
      achievementQueue: newQueue,
    };
  }

  const level = next.player?.level || 1;
  const currentRank = RANKS.slice().reverse().find((rank) => level >= rank.minLevel)?.rank || "U";
  const lastRank = next.lastKnownRank || "U";

  if (currentRank !== lastRank) {
    track.rankUp(currentRank);
    const rankObj = RANKS.find((rank) => rank.rank === currentRank);
    const rankQueue = [{
      id: `rank_${currentRank}`,
      title: rankObj?.label || currentRank,
      desc: rankObj?.desc || "",
      icon: "🎖️",
      color: rankObj?.color || "var(--accent)",
      qid: `rank_${currentRank}_${Date.now()}`,
      isRankUp: true,
    }];

    return {
      ...next,
      lastKnownRank: currentRank,
      achievementQueue: [...(next.achievementQueue || []), ...rankQueue].slice(0, 5),
    };
  }

  return next;
}
