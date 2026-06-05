// Axis Progression Framework — metadata, gain maps, computation helpers

// ── Pillar metadata ──────────────────────────────────────────────────────────
export const APF_PILLARS = [
  { key: "for", label: "Force",      abbr: "FOR", color: "#f97316", icon: "💪",
    description: "Raw power via compound lifting" },
  { key: "vel", label: "Velocity",   abbr: "VEL", color: "#f87171", icon: "⚡",
    description: "Acceleration and rapid direction shifts" },
  { key: "res", label: "Resilience", abbr: "RES", color: "#38bdf8", icon: "🛡️",
    description: "Tissue integrity and injury mitigation" },
  { key: "nut", label: "Nutrition",  abbr: "NUT", color: "#4ade80", icon: "🥚",
    description: "Biological chemistry and fuel efficiency" },
  { key: "fnd", label: "Foundation", abbr: "FND", color: "#a78bfa", icon: "🏛️",
    description: "Tactical positioning and rhythm mastery" },
  { key: "fld", label: "Fluidity",   abbr: "FLD", color: "#2dd4bf", icon: "🌊",
    description: "Spatial adaptability and reflexive balance" },
];

// ── Pool metadata ────────────────────────────────────────────────────────────
export const APF_POOLS = [
  { key: "vig", label: "Vigor",  abbr: "VIG", max: 9999, color: "#3b82f6", icon: "💧",
    description: "Hydration + Sleep — daily operational runway" },
  { key: "eng", label: "Energy", abbr: "ENG", max: 999,  color: "#f59e0b", icon: "⚡",
    description: "Nutrition habits — metabolic fuel capacity" },
];

// ── Dynamic outputs ──────────────────────────────────────────────────────────
// All formulas return 0–100. pools = { vig: 0-9999, eng: 0-999 }
export const APF_OUTPUTS = [
  {
    key: "strikePower",
    label: "Strike Power",
    icon: "⚔️",
    pillars: ["for", "vel"],
    poolDependent: false,
    formula: (p) => (p.for / 255 + p.vel / 255) / 2 * 100,
  },
  {
    key: "evasionRating",
    label: "Evasion Rating",
    icon: "💨",
    pillars: ["vel", "fld"],
    poolDependent: false,
    formula: (p) => (p.vel / 255 + p.fld / 255) / 2 * 100,
  },
  {
    key: "inversionMastery",
    label: "Inversion Mastery",
    icon: "🙃",
    pillars: ["for", "res"],
    poolDependent: false,
    formula: (p) => (p.for / 255 + p.res / 255) / 2 * 100,
  },
  {
    key: "strategicCunning",
    label: "Strategic Cunning",
    icon: "🧠",
    pillars: ["fnd", "nut"],
    poolDependent: false,
    formula: (p) => (p.fnd / 255 + p.nut / 255) / 2 * 100,
  },
  {
    key: "rhythmSync",
    label: "Rhythm Sync",
    icon: "🎵",
    pillars: ["fnd", "vel"],
    poolDependent: false,
    formula: (p) => (p.fnd / 255 + p.vel / 255) / 2 * 100,
  },
  {
    key: "impactAbsorption",
    label: "Impact Absorption",
    icon: "🪨",
    pillars: ["res"],
    poolDependent: true,
    poolKey: "vig",
    formula: (p, pools) => (p.res / 255 * 0.4 + pools.vig / 9999 * 0.6) * 100,
  },
  {
    key: "heartRateRecovery",
    label: "HR Recovery",
    icon: "❤️",
    pillars: ["res"],
    poolDependent: true,
    poolKey: "eng",
    formula: (p, pools) => (p.res / 255 * 0.4 + pools.eng / 999 * 0.6) * 100,
  },
];

// ── Gain maps ────────────────────────────────────────────────────────────────

// Quest → Pillar. Applied ONCE on completion; un-completing does NOT reverse.
export const QUEST_PILLAR_MAP = {
  q_foot:         { res: 0.5 },
  q_foundation:   { fnd: 0.5 },
  q_primary:      { fnd: 0.3, vel: 0.3 },
  q_conditioning: { vel: 0.5 },
  q_mobility:     { fld: 0.3, res: 0.2 },
};

// Tree → Pillar. Multiplied by movement.tier before applying.
export const TREE_PILLAR_MAP = {
  Foundation:      { fnd: 1.0 },
  Kick:            { vel: 0.8, for: 0.2 },
  Au:              { fld: 1.0 },
  Bananeira:       { fld: 0.7, res: 0.3 },
  "Queda de Rins": { res: 0.8, fld: 0.2 },
  Macaco:          { fld: 0.7, for: 0.3 },
  "Floor Game":    { fld: 0.8, fnd: 0.2 },
  Sweep:           { vel: 0.7, for: 0.3 },
  Foot:            { res: 1.0 },
  Strength:        { for: 0.8, res: 0.2 },
  Conditioning:    { vel: 0.8, res: 0.2 },
};

// Boss → Pillar. +3 to primary pillar on first pass only.
// weekly_boss_template excluded. sprint_1_final gives a balanced bonus.
export const BOSS_PILLAR_GAINS = {
  foot_boss_1:      { res: 3 },
  foot_boss_2:      { res: 3 },
  foot_boss_3:      { res: 3 },
  bananeira_boss_1: { fld: 3 },
  bananeira_boss_2: { fld: 3 },
  bananeira_boss_3: { fld: 3 },
  au_base_boss:     { fld: 3 },
  flow_boss_1:      { vel: 3 },
  flow_boss_5min:   { vel: 3 },
  sprint_1_final:   { res: 2, fld: 2, vel: 1, fnd: 1, for: 1 },
};

// ── Computation helpers ──────────────────────────────────────────────────────

// VIG from today's recovery log entry (max 9999).
// Perfect day: 3500 ml (≈118 oz / ~64 oz hits ~91%) + 9 h sleep → 9999
export function computeVIG({ hydrationMl = 0, sleepHours = 0 } = {}) {
  const h = Number.isFinite(hydrationMl) ? hydrationMl : 0;
  const s = Number.isFinite(sleepHours) ? sleepHours : 0;
  return Math.min(9999, Math.round((h / 3500) * 5000 + (s / 9) * 4999));
}

// Apply a gains object to a pillars object, capping each key at 255.
export function applyGains(pillars, gains) {
  const next = { ...pillars };
  for (const [key, amount] of Object.entries(gains)) {
    if (key in next) next[key] = Math.min(255, next[key] + amount);
  }
  return next;
}

export const DEFAULT_PILLARS = { for: 0, vel: 0, res: 0, nut: 0, fnd: 0, fld: 0 };
