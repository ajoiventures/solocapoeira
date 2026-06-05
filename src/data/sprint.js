// 12-Week Sprint 1: Foot Rebuild + Bananeira + Au Base + Flow Engine
//
// QUALITY STANDARD throughout this sprint:
// Every drill has a "clean rep" definition. That is the target — not reps, not time.
// Reps and time are how you accumulate clean reps. Never accumulate sloppy ones.
// The alien/cat-like standard: loaded, silent, controlled entry AND exit every rep.

export const SPRINT_1 = {
  id: "sprint_1",
  name: "Sprint 1",
  theme: "Foot Rebuild + Bananeira + Au Base + Flow Engine",
  durationWeeks: 12,
  primaryTargets: [
    "Reduce plantar fasciitis symptoms",
    "Rebuild arch activation",
    "60-second wall bananeira — stacked, controlled",
    "Au Controlado — slow arc, silent hands, both sides equal",
    "Roda endurance — 3 × 10-min games with quality held",
    "Clean MLDC — both hands to the floor, pivot doesn't slide",
    "No knee pain increase",
  ],
  weeks: [
    {
      week: 1,
      theme: "Baseline Testing",
      focus: "Establish exact starting points. Every result is a Week 12 comparison. Log honestly — a bad baseline beats a dishonest one. Quality standard this week: observe. Don't try to perform.",
      skills: ["ginga", "negativa", "role", "au_basico", "bananeira_wall", "foot_rolling", "short_foot"],
      boss: null,
      notes: "Log pain before and after each session: foot / knee / wrist / shoulder (0–10 each). You need these numbers.",
      drills: [
        "Ginga Baseline — 10 min continuous",
        "Au Básico Baseline — 3 × 5 each side, rest 60s between",
        "Wall Bananeira Baseline — 10 kick-up attempts, 30s rest between",
      ],
      conditioning: {
        label: "Baseline Flow Round",
        rounds: 2,
        duration: "3 min",
        challenge: "Ginga → esquiva baixa right → ginga → esquiva baixa left → au right → ginga → au left → ginga. Continuous.",
        anchor: "Count transition pauses — that number is your Week 12 comparison.",
        movementIds: ["ginga", "au_basico"],
      },
    },
    {
      week: 2,
      theme: "Foot + Foundation",
      focus: "Foot protocol every session. Foundation quality over volume. Quality standard this week: every movement has a controlled descent — no dropping, no crashing. Descend in 2–3 counts. The descent is the skill.",
      skills: ["cocorinha", "esquiva_baixa", "esquiva_paralela", "ginga", "foot_rolling", "short_foot", "toe_yoga"],
      boss: null,
      notes: "Log foot pain daily. 5 min foundation every session.",
      drills: [
        "Cocorinha × 20 — 3-count descent, heels flat, 2s hold",
        "Esquiva Baixa × 12 each side — 3s hold at depth",
        "Esquiva Paralela × 10 each side",
      ],
      conditioning: {
        label: "Foundation Conditioning",
        rounds: 3,
        duration: "90s",
        challenge: "Ginga → cocorinha → esquiva baixa → return. Continuous.",
        anchor: "Round 3 = round 1.",
        movementIds: ["ginga", "cocorinha", "esquiva_baixa"],
      },
    },
    {
      week: 3,
      theme: "Au Base",
      focus: "Cartwheel mechanics. Both sides equal — not 'good side and other side.' Quality standard this week: hands land silently. If it sounds like a slap, the landing is wrong. Slow it down until it's silent.",
      skills: ["au_basico", "au_de_frente", "au_controlado"],
      boss: null,
      notes: "Wrist prep before every session. Log wrist pain after every au set.",
      drills: [
        "Au Básico × 8 each side — 1s pause, both hands on floor",
        "Au de Frente × 6 each side — ginga to ginga, no pause",
        "Au Controlado × 5 each side — 2s hold at top",
      ],
      conditioning: {
        label: "Au Endurance Block",
        rounds: 3,
        duration: "2 min",
        challenge: "Ginga → au → ginga. Alternating sides, continuous.",
        anchor: "Au in round 3 = au in round 1.",
        movementIds: ["ginga", "au_basico"],
      },
    },
    {
      week: 4,
      theme: "Bananeira Capacity",
      focus: "Build wall hold time. Quality standard this week: a stacked hold is not the same as an arched hold. They look similar from outside but feel completely different. Heels over hips over shoulders — that is the only acceptable position.",
      skills: ["bananeira_wall", "bananeira_wall_30s", "wrist_prep"],
      boss: null,
      notes: "Aim: 30s wall hold by end of week. Log every hold time.",
      drills: [
        "Wall Bananeira — max hold × 3, rest 3 min between",
        "Bananeira kick-up × 15 attempts",
        "Shoulder taps in bananeira hold × 3 × 8",
      ],
      conditioning: {
        label: "Inversion + Au Circuit",
        rounds: 3,
        duration: "2 min",
        challenge: "Au × 3 each side → bananeira kick-up × 3 attempts. Repeat.",
        anchor: "Au mechanics must hold after the bananeira sets.",
        movementIds: ["au_basico", "bananeira_wall"],
      },
    },
    {
      week: 5,
      theme: "Low Game",
      focus: "Floor game vocabulary. Low and slow. Quality standard this week: you don't rise. Every transition happens along the floor, not up-then-back-down. Rising is the most common error in the low game. If you rise, you've left the game.",
      skills: ["negativa", "role", "corta_capim", "gorila", "resistencia"],
      boss: null,
      notes: "Knee pain check every session. Stop if knee pain exceeds 3/10.",
      drills: [
        "Negativa × 10 each side — 3s hold, exit directly to rolê",
        "Rolê × 12 each direction — full arc, chin tucked",
        "Corta Capim × 8 — slow sweep",
        "Wall Bananeira — max hold × 2",
      ],
      conditioning: {
        label: "Low Game Endurance",
        rounds: 3,
        duration: "2 min",
        challenge: "Stay below knee height. Ginga low → negativa → rolê → repeat.",
        anchor: "Round 3 = round 1.",
        movementIds: ["ginga", "negativa", "role"],
      },
    },
    {
      week: 6,
      theme: "MLDC Mechanics",
      focus: "Introduce the signature kick. Slow and precise. Quality standard this week: both hands touch the floor. A MLDC where the hands don't reach is a different movement. 5 quality reps this week builds more than 50 rushed ones.",
      skills: ["meia_lua_de_compasso", "queixada", "armada"],
      boss: null,
      notes: "5 MLDC reps each side max. Quality over quantity.",
      drills: [
        "MLDC × 5 each side — slow, both hands to floor",
        "Queixada × 10 each side",
        "Armada × 8 each side — full spin",
        "Wall Bananeira — max hold × 2, aim 30s",
      ],
      conditioning: {
        label: "Kick + Escape Conditioning",
        rounds: 3,
        duration: "2 min",
        challenge: "Ginga → kick (queixada or armada) → esquiva → ginga. 2 MLDC per round.",
        anchor: "Both hands to floor on every MLDC.",
        movementIds: ["ginga", "queixada", "armada", "meia_lua_de_compasso"],
      },
    },
    {
      week: 7,
      theme: "Au Fechado Introduction",
      focus: "Closed cartwheel. Legs form one unit at the top. Quality standard this week: legs-together is the only focus. There is no speed yet. A fast sloppy au fechado is a step backward. Slow and closed beats fast and open every time.",
      skills: ["au_fechado", "auzinho", "au_reversao"],
      boss: null,
      notes: "Only unlock if Bananeira Boss I passed. Shoulders must be ready.",
      drills: [
        "Au Controlado × 5 each side — 2s hold at top",
        "Au Fechado × 5 each side — legs together at apex",
        "Auzinho × 8 each side — tight arc",
        "Au Básico → Au Fechado × 5 each side",
      ],
      conditioning: {
        label: "Au Variation Circuit",
        rounds: 3,
        duration: "2 min",
        challenge: "Au básico → au fechado → au básico. Both sides per round.",
        anchor: "Fechado compactness holds in round 3.",
        movementIds: ["au_basico", "au_fechado"],
      },
    },
    {
      week: 8,
      theme: "Conditioning Push",
      focus: "Flow endurance. Quality standard this week: 5 minutes is not a fitness test. It is a quality test. The real question is not 'can you last 5 minutes' — it is 'does the movement at minute 4 look like minute 1?' If not, that is your exact training edge.",
      skills: ["ginga", "negativa", "role", "cocorinha"],
      boss: "flow_boss_1",
      notes: "Aim: 3-min flow with quality held. Then attempt 5-min.",
      drills: [
        "3-min continuous flow — everything",
        "Weakest link drill × 10 — isolated",
        "3-min flow — repeat",
      ],
      conditioning: {
        label: "5-Minute Quality Test",
        rounds: 1,
        duration: "5 min",
        challenge: "5 minutes non-stop. Every movement. No choreography.",
        anchor: "Score each minute 1–5 on quality. Note the minute it drops.",
        movementIds: ["ginga"],
      },
    },
    {
      week: 9,
      theme: "Queda de Rins Prep",
      focus: "Side balance. Elbow-hip connection. Quality standard this week: the QdR is a lock, not a lean. The elbow seats into the hip socket. If it's on the side of the body, it will collapse. Feel the difference between sitting on the socket and leaning against the side.",
      skills: ["queda_de_rins_prep", "queda_de_rins_5s", "fuga"],
      boss: null,
      notes: "Shoulder pain check. Start light.",
      drills: [
        "Au Controlado × 8 each side — 2s hold at top",
        "QdR Prep × 10 each side — elbow in socket, 3s hold",
        "QdR 5s × 5 each side — timed holds",
        "Fuga × 8",
        "Wall Bananeira — max hold × 2, target 45s",
      ],
      conditioning: {
        label: "Floor Balance + Flow",
        rounds: 3,
        duration: "2 min",
        challenge: "Flow normally. 1 QdR hold per round — return to flow immediately after.",
        anchor: "QdR controlled, not panicked, when entered from flow.",
        movementIds: ["ginga", "queda_de_rins_prep"],
      },
    },
    {
      week: 10,
      theme: "Macaco Preparation",
      focus: "Bridge work. Shoulder prep. Handstand confidence. Quality standard this week: the macaquinho is not a shortcut — it is more demanding than it looks. The reach must be slow and controlled. Control in macaquinho is the quality marker for macaco later.",
      skills: ["ponte", "macaquinho", "bananeira_wall_60s"],
      boss: null,
      notes: "No macaco yet. Only bridge + macaquinho.",
      drills: [
        "Bridge (Ponte) × 10 — 5s hold each",
        "Macaquinho × 5 each side",
        "Wall Bananeira — max hold × 3, target 45s",
      ],
      conditioning: {
        label: "2-Game Block",
        rounds: 2,
        duration: "7 min",
        challenge: "2 roda games × 7 min. Rest 3 min between.",
        anchor: "Game 2 quality = game 1 quality.",
        movementIds: ["au_basico", "bananeira_wall", "ponte"],
      },
    },
    {
      week: 11,
      theme: "Integration",
      focus: "Chain movements together. Quality standard this week: no stops, no resets, no thinking between movements. A chain drill with a pause between every movement is not a chain — it is isolated movements in sequence. The goal is for the exit of one movement to become the entry of the next.",
      skills: ["mldc_role", "bananeira_au_entry", "negativa", "role", "ginga"],
      boss: null,
      notes: "MLDC → Rolê as one motion. Au → Bananeira entry attempted.",
      drills: [
        "Au Controlado × 10 each side — 2s hold at top",
        "Wall Bananeira — max hold × 2, target 50s · Au → Bananeira entry × 3",
        "MLDC → Rolê × 5 each side — no pause",
        "Chain drill × 5 each side — ginga → kick → escape → rolê → au",
      ],
      conditioning: {
        label: "3-Game Block",
        rounds: 3,
        duration: "7 min",
        challenge: "3 roda games × 7 min. Rest 3 min between.",
        anchor: "Note which movements held quality through all 3 games.",
        movementIds: ["ginga", "meia_lua_de_compasso", "role"],
      },
    },
    {
      week: 12,
      theme: "Boss Testing Week",
      focus: "Test everything. Validate the quality, not just the numbers. Quality standard this week: compare to Week 1 and describe what changed qualitatively. The time on bananeira is one number. Does it feel like a different movement? That is the real answer.",
      skills: [],
      boss: "sprint_1_final",
      notes: "Test: Foot Boss I + Bananeira I + Au Base Boss + 5-min Flow Boss.",
      drills: [
        "Wall Bananeira — max hold × 3 (compare to Week 1)",
        "Au Controlado × 10 each side — 2s hold (compare to Week 3)",
        "MLDC × 5 each side — hands to floor (compare to Week 6)",
      ],
      conditioning: {
        label: "Boss: 3 × 10-Min Roda Games",
        rounds: 3,
        duration: "10 min",
        challenge: "3 roda games × 10 min. Rest 3 min between. Everything.",
        anchor: "Sprint 1 exit grade: score overall quality 1–10 after game 3.",
        movementIds: ["ginga"],
      },
    },
  ],
};

// Daily Foundation Rotation
// Quality standard for ALL foundation drills:
// The descent is controlled. The hold is active. The exit is clean.
// A drill completed sloppily is not completed.
export const FOUNDATION_ROTATION = {
  0: { // Sunday — slow technical day
    label: "Technical Review",
    duration: 10,
    drills: [
      { id: "ginga",         instruction: "Ginga × 3 min — slow, full weight transfer" },
      { id: "cocorinha",     instruction: "Cocorinha × 20 — 3-count descent, heels flat, 2s hold" },
      { id: "esquiva_baixa", instruction: "Esquiva Baixa × 10 each side — 3s hold at depth" },
    ],
  },
  1: { // Monday — ginga + escapes
    label: "Ginga + Escapes",
    duration: 7,
    drills: [
      { id: "ginga",         instruction: "Ginga × 2 min — directional change every 4 steps" },
      { id: "esquiva_baixa", instruction: "Esquiva Baixa × 15 each side — enter from ginga step" },
      { id: "negativa",      instruction: "Negativa × 10 each side — hip open, 2s hold, exit controlled" },
    ],
  },
  2: { // Tuesday — low game
    label: "Ginga + Low Game",
    duration: 7,
    drills: [
      { id: "ginga",     instruction: "Ginga × 2 min — stay low, knees bent" },
      { id: "cocorinha", instruction: "Cocorinha × 15 — from ginga step, no neutral at top" },
      { id: "role",      instruction: "Rolê × 10 each direction — continuous arc, chin tucked" },
    ],
  },
  3: { // Wednesday — back escapes
    label: "Ginga + Back Escapes",
    duration: 7,
    drills: [
      { id: "ginga",             instruction: "Ginga × 2 min — arm swing, eyes scanning" },
      { id: "esquiva_de_costas", instruction: "Esquiva de Costas × 10 each side — eyes forward" },
      { id: "giro",              instruction: "Giro × 8 each direction — shoulder leads" },
    ],
  },
  4: { // Thursday — endurance
    label: "Ginga + Endurance",
    duration: 8,
    drills: [
      { id: "ginga",            instruction: "Ginga × 3 min non-stop — arms at shoulder height throughout" },
      { id: "esquiva_paralela", instruction: "Esquiva Paralela × 12 each side — return directly to ginga" },
      { id: "resistencia",      instruction: "Resistência × 3 × 20s holds — hips low, core braced" },
    ],
  },
  5: { // Friday — flow day
    label: "Ginga + Flow",
    duration: 8,
    drills: [
      { id: "ginga",    instruction: "Ginga × 2 min — flows into esquivas and negativa" },
      { id: "negativa", instruction: "Negativa × 10 each side — enter from ginga, exit to rolê" },
      { id: "role",     instruction: "Rolê × 10 each direction — complete the full arc" },
      { id: "aranha",   instruction: "Aranha × 3 min — low spider crawl, both directions" },
    ],
  },
  6: { // Saturday — mixed full flow
    label: "Mixed Foundation Flow",
    duration: 10,
    drills: [
      { id: "ginga",         instruction: "Ginga × 2 min" },
      { id: "cocorinha",     instruction: "Cocorinha × 15 — from ginga step, no neutral" },
      { id: "esquiva_baixa", instruction: "Esquiva Baixa × 10 each side — chain into rolê" },
      { id: "negativa",      instruction: "Negativa → Rolê × 8 each side — as one motion" },
      { id: "role",          instruction: "Free rolê × 2 min" },
    ],
  },
};

// Daily Quest Structure
export const DAILY_QUEST_STRUCTURE = [
  { slot: 1, label: "Foot Quest", tree: "Foot", duration: 5, always: true },
  { slot: 2, label: "Foundation Quest", tree: "Foundation", duration: 7, always: true },
  { slot: 3, label: "Primary Skill Quest", tree: null, duration: 15, always: false },
  { slot: 4, label: "Strength or Conditioning", tree: ["Strength", "Conditioning"], duration: 10, always: false },
  { slot: 5, label: "Mobility / Recovery", tree: null, duration: 5, always: true },
];
