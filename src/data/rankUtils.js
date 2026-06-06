import { XP_PER_LEVEL } from "./constants.js";

// Capoeira cord ranks mapped to Solo Leveling tiers.
export const RANKS = [
  {
    rank: "U", minLevel: 1, color: "#6b7280",
    label: "U — No Cord", cordName: "Sem Cordão",
    desc: "Raw starting point. No muscle memory. Every movement is thought, not feeling. The body hasn't learned yet — it's just willing.",
  },
  {
    rank: "G", minLevel: 8, color: "#16a34a",
    label: "G — Green Cord", cordName: "Aluno Batizado",
    desc: "Baptized. Ginga lives in the body — rough, uncertain, but yours. First kicks land. You move through the roda with intent, not just survival.",
  },
  {
    rank: "F", minLevel: 17, color: "#84cc16",
    label: "F — Green/Yellow", cordName: "Aluno Entrada",
    desc: "Sequences begin to chain. Rhythm is emerging. The body is starting to understand: escape, attack, flow — without full stops between each thought.",
  },
  {
    rank: "E", minLevel: 28, color: "#ca8a04",
    label: "E — Yellow Cord", cordName: "Aluno Guerreiro",
    desc: "Muscle memory is building. Berimbau drives your timing. Advanced movements enter the vocabulary. The body is being remade, rep by rep.",
  },
  {
    rank: "D", minLevel: 42, color: "#0891b2",
    label: "D — Blue/Yellow", cordName: "Aluno Graduado",
    desc: "Precision enters the game. Footwork sharpens. Strategy stops being reactive and starts being read. Movement has texture — not just steps, but intention.",
  },
  {
    rank: "C", minLevel: 58, color: "#2563eb",
    label: "C — Blue Cord", cordName: "Instrutor",
    desc: "Movement quality is unmistakable. Transitions are clean. Other players feel the difference before they can name it. The body moves like it knows.",
  },
  {
    rank: "B", minLevel: 76, color: "#0d9488",
    label: "B — Blue/Yellow/Green", cordName: "Professor",
    desc: "Economy of motion. Nothing wasted. Every kick, every dodge, every au — controlled, deliberate, earned. Watching you move teaches others without words.",
  },
  {
    rank: "A", minLevel: 100, color: "#7c3aed",
    label: "A — Four Cords", cordName: "Contramestre",
    desc: "The body has been remade. One year of elite daily work lives in the muscles. Fluidity others can't explain. Close to something rare — the movement doesn't look trained, it looks natural.",
  },
  {
    rank: "S", minLevel: 130, color: "#d4d4d8",
    label: "S — White Cord", cordName: "Mestre",
    desc: "Beyond rank. The movement doesn't look human. Cat-like. Alien. Loaded spring, zero effort, perfect control. The kind of body that makes people stop mid-conversation and stare. This is what all the work was always for.",
  },
];

export function getRank(level) {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}

export function getNextRank(level) {
  for (const rank of RANKS) {
    if (level < rank.minLevel) return rank;
  }
  return null;
}

export function getLevelFromXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPForLevel(level) {
  return (level - 1) * XP_PER_LEVEL;
}

export function getLevelProgress(xp) {
  const level = getLevelFromXP(xp);
  const current = getXPForLevel(level);
  const next = getXPForLevel(level + 1);
  return { level, pct: ((xp - current) / (next - current)) * 100 };
}
