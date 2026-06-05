/**
 * monthlyChallenges.js — 12 monthly community challenges, one per month.
 * Tied to real Capoeira history dates where possible.
 */

export const MONTHLY_CHALLENGES = [
  { month: 1,  icon: "🌊", color: "#4F7CFF", title: "January Foundation",     movementId: "ginga",                target: 500, unit: "Ginga reps",      desc: "500 ginga reps this month. The foundation of everything." },
  { month: 2,  icon: "💙", color: "#2563eb", title: "February Flow",          movementId: "role",                 target: 300, unit: "Rolê reps",        desc: "300 rolê reps. February is for flow — low game, connected movement." },
  { month: 3,  icon: "🌿", color: "#2E8C78", title: "March Ground",           movementId: "negativa",             target: 300, unit: "Negativa reps",    desc: "300 negativa reps. March — getting low, getting real." },
  { month: 4,  icon: "⚡", color: "#D4854A", title: "April Power",            movementId: "meia_lua_de_compasso", target: 200, unit: "MLDC reps",        desc: "200 meia lua de compasso. April is for the signature kick." },
  { month: 5,  icon: "✨", color: "#7C3AED", title: "May Mandinga",           movementId: null,                   target: 10,  unit: "sessions",         desc: "10 training sessions in May. Consistency is Mandinga." },
  { month: 6,  icon: "🔥", color: "#D9A441", title: "June Axé",              movementId: "au_basico",            target: 200, unit: "Au reps",           desc: "200 au básico reps. Mestre Bimba's birthday month — honour it with inversions." },
  { month: 7,  icon: "🏖️", color: "#D4854A", title: "July Sand",             movementId: "cocorinha",            target: 400, unit: "Cocorinha reps",   desc: "400 cocorinha. July heat — train low, stay cool." },
  { month: 8,  icon: "🌍", color: "#2E8C78", title: "August Angola",         movementId: "queda_de_rins",        target: 150, unit: "Queda de Rins",    desc: "150 queda de rins reps. August honours Angola month." },
  { month: 9,  icon: "🎵", color: "#D9A441", title: "September Rhythm",      movementId: null,                   target: 15,  unit: "sessions",         desc: "15 sessions in September. Consistency + rhythm = Capoeira." },
  { month: 10, icon: "🗡️", color: "#C95252", title: "October Malícia",       movementId: "esquiva_baixa",        target: 300, unit: "Esquiva reps",     desc: "300 esquiva baixa reps. October — the month of deception and reading." },
  { month: 11, icon: "🌙", color: "#4F7CFF", title: "November Strength",     movementId: "bananeira_wall",       target: 30,  unit: "wall holds (30s+)", desc: "30 wall bananeira holds of 30+ seconds. Build the base before December." },
  { month: 12, icon: "👑", color: "#D9A441", title: "December Culmination",  movementId: null,                   target: 20,  unit: "sessions",         desc: "20 sessions in December. End the year stronger than you started it." },
];

export function getCurrentMonthChallenge() {
  const month = new Date().getMonth() + 1; // 1-12
  return MONTHLY_CHALLENGES.find((c) => c.month === month) || MONTHLY_CHALLENGES[0];
}
