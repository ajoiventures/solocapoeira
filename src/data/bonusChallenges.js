/**
 * bonusChallenges.js — 30 rotating daily bonus challenges.
 * Seeded by date so every user gets the same challenge each day.
 * Each challenge has: id, title, desc, type, xp, icon.
 */

export const BONUS_CHALLENGES = [
  { id: "bc_01", icon: "🌀", xp: 75,  title: "Ginga Marathon",        desc: "10 minutes of continuous ginga — no stopping. Count your direction changes." },
  { id: "bc_02", icon: "⚡", xp: 60,  title: "Century Cocorinha",     desc: "50 cocorinhas in a single set. Heels flat, chest tall every rep." },
  { id: "bc_03", icon: "🎯", xp: 80,  title: "Au Gauntlet",           desc: "10 clean au basico each side — then 5 au controlado each side. No rushing." },
  { id: "bc_04", icon: "🔥", xp: 50,  title: "Negativa Flow",         desc: "Ginga → negativa left → rolê → negativa right → rolê → back to ginga. 10 full cycles." },
  { id: "bc_05", icon: "💪", xp: 70,  title: "Wall Hold",             desc: "Total 2 minutes of wall bananeira today. Can be split into multiple holds." },
  { id: "bc_06", icon: "🌊", xp: 55,  title: "Esquiva Drill",         desc: "50 alternating esquiva baixa. Left, right, left, right. Controlled descent every rep." },
  { id: "bc_07", icon: "🎵", xp: 65,  title: "Rhythm Session",        desc: "Train for exactly 15 minutes to music. Pick a Capoeira playlist. No phone during." },
  { id: "bc_08", icon: "🦶", xp: 45,  title: "Foot Foundation",       desc: "10 min foot protocol: rolling → short foot → toe yoga. Log each exercise." },
  { id: "bc_09", icon: "🗡️", xp: 90,  title: "Kick Chain",            desc: "Queixada → armada → MLDC. 8 reps each, both sides. Controlled landings only." },
  { id: "bc_10", icon: "🔄", xp: 65,  title: "Rolê Spiral",           desc: "20 continuous rolê — don't stop between reps. The floor is your partner." },
  { id: "bc_11", icon: "🧠", xp: 55,  title: "Slow Motion",           desc: "Pick any 3 movements and perform each in 5x slow motion. Feel every position." },
  { id: "bc_12", icon: "⏱️", xp: 75,  title: "Tabata Foundation",     desc: "8 rounds: 20s ginga + 10s hold cocorinha. Rest only in the holds." },
  { id: "bc_13", icon: "🌿", xp: 60,  title: "Angola Meditation",     desc: "15 min low game only — ginga baixo, negativa, rolê. No kicks. Just presence." },
  { id: "bc_14", icon: "💫", xp: 85,  title: "Sequence Practice",     desc: "Run any one sequence from your library 10 times end-to-end. Clean over fast." },
  { id: "bc_15", icon: "🏃", xp: 50,  title: "Mobility Circuit",      desc: "Hip CARs × 10 each → wrist circles × 30 → bridge holds × 5 × 10s. Full circuit." },
  { id: "bc_16", icon: "🎭", xp: 70,  title: "Mirror Work",           desc: "30 minutes training in front of a mirror or phone camera. Watch your own ginga." },
  { id: "bc_17", icon: "🌙", xp: 55,  title: "Late Game",             desc: "Train after 8pm if you haven't already — test how your body moves when tired." },
  { id: "bc_18", icon: "🔁", xp: 65,  title: "Both Sides Equal",      desc: "For every movement today, consciously perform more reps on your weaker side." },
  { id: "bc_19", icon: "📿", xp: 80,  title: "Mandinga Drill",        desc: "5 min slow ginga focusing only on upper body softness. Arms like water, not wood." },
  { id: "bc_20", icon: "🌍", xp: 60,  title: "Ground Session",        desc: "20 min floor-only game: negativa, rolê, queda de quatro, rasteira setups. Stay low." },
  { id: "bc_21", icon: "💥", xp: 90,  title: "Power Hour",            desc: "Log at least 200 total reps across any movements today. Volume builds the base." },
  { id: "bc_22", icon: "🎶", xp: 65,  title: "Berimbau Tempo",        desc: "Set berimbau timer to São Bento Pequeno. Train to that rhythm for 10 min without stopping." },
  { id: "bc_23", icon: "🤸", xp: 75,  title: "Inversion Day",         desc: "20 au basico + 10 au controlado + 5 wall bananeira holds (20s each). Hands before feet." },
  { id: "bc_24", icon: "🧘", xp: 50,  title: "Breathe Through It",    desc: "Every time you want to stop a set — take one breath, keep moving. 20 min session." },
  { id: "bc_25", icon: "⚔️", xp: 85,  title: "Mestre Study",          desc: "Watch 15 min of Capoeira video. Write one thing you noticed in today's training notes." },
  { id: "bc_26", icon: "🔢", xp: 60,  title: "Rep Ladder",            desc: "1 ginga step → 2 → 4 → 8 → 16 → 32. Ladder up without stopping at each rung." },
  { id: "bc_27", icon: "🧲", xp: 70,  title: "Catch and Release",     desc: "20 ginga → cocorinha × 3 → back to ginga. The escape should feel automatic." },
  { id: "bc_28", icon: "🌀", xp: 55,  title: "Flow State",            desc: "Train 12 minutes without any goal — just move. No counting, no targets, no plan." },
  { id: "bc_29", icon: "🗺️", xp: 80,  title: "Weak Spot Audit",       desc: "Find your 3 lowest mastery movements. Do 20 reps of each. Log every set." },
  { id: "bc_30", icon: "👑", xp: 100, title: "Full Deck",             desc: "Complete every standard quest today AND log 100+ reps in free training. King mode." },
];

/**
 * Get today's bonus challenge — deterministic by date so it's the same all day.
 */
export function getDailyBonusChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % BONUS_CHALLENGES.length;
  return BONUS_CHALLENGES[idx];
}
