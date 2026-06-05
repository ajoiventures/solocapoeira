import { getMovementById } from "./movements.js";
import { getConceptAdvancedSequences } from "./conceptSequences.js";
import { getMestreSequences } from "./mestreSequences.js";

const SESSION_POLICY = { minSessions: 3, maxSessions: "10+", unitMinutes: 10 };

const CONCEPT_LABELS = {
  malicia: "Malicia",
  mandinga: "Mandinga",
  malandragem: "Malandragem",
  wisdom: "Wisdom",
  rhythm: "Rhythm",
  ceremony: "Ceremony",
};

const MOVE_SETS = {
  angola: ["ginga_baixo", "roda_baixa", "negativa", "role", "rasteira", "queda_de_rins", "banda", "chamada"],
  peaceful: ["ginga", "chamada", "ritmo_do_coracao", "musica_no_corpo", "negativa", "role", "cocorinha", "au_controlado"],
  strategy: ["ginga", "olho_para_olho", "falseio_de_corpo", "esquiva_baixa", "armada", "meia_lua_de_compasso", "bencao", "cocorinha"],
  rhythm: ["ginga", "ritmo_do_coracao", "musica_no_corpo", "negativa", "role", "volta_do_mundo", "chamada", "cocorinha"],
  roda: ["ginga", "entrada_de_jogo", "esquiva_baixa", "role", "saida_de_jogo", "negativa", "rasteira", "au_basico"],
  phase: ["ginga", "cocorinha", "esquiva_baixa", "negativa", "role", "au_basico", "queixada", "armada"],
  regional: ["ginga", "lateral", "armada", "queixada", "au_basico", "chapa", "meia_lua_de_compasso", "bencao"],
  default: ["ginga", "cocorinha", "esquiva_baixa", "negativa", "role", "au_basico", "queixada", "armada"],
};

export const ADVANCED_INVERSION_MOVES = [
  "au_basico",
  "au_controlado",
  "au_fechado",
  "bananeira_wall",
  "bananeira_au_entry",
  "queda_de_rins",
  "queda_de_rins_switch",
  "macaco",
  "macaco_au",
  "au_sem_mao",
  "au_helicoptero",
  "folha_seca",
];

const ADVANCED_FINISHERS = [
  "meia_lua_de_compasso",
  "armada",
  "queixada",
  "rasteira",
  "banda",
  "chapa",
  "bencao",
  "vingativa",
  "rabo_de_arraia",
  "volta_do_mundo",
];

const ORISHA_PRINCIPLES = {
  Ogun: ["grounded strength", "clear boundaries", "low Angola pressure"],
  Obatala: ["calm timing", "peaceful control", "ancestral discipline"],
  Ifa: ["reading patterns", "anticipation", "decision before motion"],
  Elegba: ["entry timing", "crossroads", "change of angle"],
  Yemaya: ["adaptive flow", "safe exits", "return to center"],
  Shango: ["justice timing", "counter power", "clean decision"],
  Oshun: ["soft bait", "graceful escape", "controlled invitation"],
  Oshosi: ["targeting", "tracking", "precise entry"],
  Ehi: ["integrated identity", "whole-system flow", "pressure-tested clarity"],
};

const OWNER_SIGNATURE_MOVE_SETS = {
  ogun: ["ginga_baixo", "roda_baixa", "rasteira", "queixada", "armada", "queda_de_rins", "banda", "au_basico"],
  obatala: ["ginga", "chamada", "ritmo_do_coracao", "musica_no_corpo", "negativa", "role", "au_controlado", "bananeira_wall", "queda_de_rins"],
  ifa: ["olho_para_olho", "falseio_de_corpo", "ginga", "esquiva_baixa", "armada", "meia_lua_de_compasso", "bananeira_au_entry", "queda_de_rins"],
  elegba: ["entrada_de_jogo", "ginga", "falseio_de_corpo", "volta_do_mundo", "esquiva_lateral", "au_basico", "macaco", "saida_de_jogo"],
  yemaya: ["ginga", "role", "negativa", "esquiva_baixa", "au_controlado", "bananeira_role_exit", "chamada", "volta_do_mundo"],
  shango: ["ginga", "armada", "chapa", "meia_lua_de_compasso", "queda_de_rins", "au_basico", "macaco", "rasteira"],
  oshun: ["ginga", "falseio_de_corpo", "queixada", "role", "au_controlado", "bananeira_wall", "chamada", "negativa"],
  oshosi: ["ginga", "olho_para_olho", "bencao", "chapa", "rasteira", "au_basico", "bananeira_au_entry", "armada"],
  "nana buruku": ["roda_baixa", "ginga_baixo", "negativa", "queda_de_rins", "queda_de_costas", "bananeira_wall", "role", "rasteira"],
  "mestre joao grande": ["ginga_meditativa", "chamada_angola", "roda_baixa", "negativa", "role", "queda_de_rins", "au_controlado", "bananeira_wall", "rasteira"],
  "mestre canjiquinha": ["ginga", "pirueta", "meia_volta", "volta_do_mundo", "negativa", "role", "au_basico", "macaco", "meia_lua_de_compasso"],
  "mestre pastinha": ["ginga_meditativa", "roda_baixa", "chamada_angola", "negativa", "queda_de_rins", "rasteira", "bananeira_wall", "role"],
  "mestre bimba": ["ginga", "lateral", "armada", "queixada", "chapa", "au_basico", "macaco", "cintura_desprezada"],
};

function slug(value) {
  return String(value || "practice")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ownerKey(owner = {}) {
  return String(owner.ownerName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ownerText(owner = {}) {
  return [
    owner.ownerName,
    owner.ownerStyle,
    owner.ownerTier,
    owner.ownerHistory,
    owner.ownerPhilosophy,
    owner.ownerQualities,
    ...(owner.ownerSkills || []),
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ownerQualityMoves(owner = {}) {
  const text = ownerText(owner);
  const direct = OWNER_SIGNATURE_MOVE_SETS[ownerKey(owner)] || [];
  const skillMoves = (owner.ownerSkills || []).map((skill) =>
    String(skill).toLowerCase().replace(/[^a-z0-9_]+/g, "_")
  );
  const inferred = [];

  if (text.includes("angola") || text.includes("low") || text.includes("grounded") || text.includes("ancestral")) {
    inferred.push("ginga_meditativa", "roda_baixa", "chamada_angola", "negativa", "queda_de_rins", "rasteira");
  }
  if (text.includes("regional") || text.includes("fast") || text.includes("direct") || text.includes("speed")) {
    inferred.push("ginga", "lateral", "armada", "queixada", "chapa", "au_basico");
  }
  if (text.includes("contemporary") || text.includes("acrobatic") || text.includes("aerial")) {
    inferred.push("au_fechado", "au_sem_mao", "macaco", "macaco_au", "bananeira_au_entry", "folha_seca");
  }
  if (text.includes("peace") || text.includes("wisdom") || text.includes("ancestor") || text.includes("balance")) {
    inferred.push("chamada", "ritmo_do_coracao", "musica_no_corpo", "au_controlado", "bananeira_wall", "role");
  }
  if (text.includes("playful") || text.includes("art") || text.includes("dance")) {
    inferred.push("pirueta", "meia_volta", "volta_do_mundo", "danca_e_luta", "au_basico", "macaco");
  }
  if (text.includes("read") || text.includes("malicia") || text.includes("strategy") || text.includes("eye")) {
    inferred.push("olho_para_olho", "falseio_de_corpo", "esquiva_baixa", "armada", "bananeira_au_entry", "queda_de_rins");
  }
  if (text.includes("mandinga") || text.includes("ritual") || text.includes("ceremony")) {
    inferred.push("ritmo_do_coracao", "musica_no_corpo", "chamada", "volta_do_mundo", "bananeira_wall", "queda_de_rins");
  }
  if (text.includes("malandragem") || text.includes("street") || text.includes("escape")) {
    inferred.push("negativa", "role", "vingativa", "falseio_de_corpo", "au_basico", "macaco");
  }

  return uniqueMoves([...direct, ...skillMoves, ...inferred]);
}

function uniqueMoves(moves) {
  const seen = new Set();
  return [...(moves || [])]
    .filter(Boolean)
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function rotate(list, index) {
  if (!list.length) return [];
  const offset = index % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

function cleanMoves(moves, targetLength = 9) {
  const list = uniqueMoves([...rotate(moves || [], 0), ...MOVE_SETS.default, ...ADVANCED_INVERSION_MOVES, ...ADVANCED_FINISHERS]);
  return list.slice(0, Math.max(7, Math.min(targetLength, list.length)));
}

function ensureAdvancedRequirements(moves, index, targetLength = 9) {
  const chain = cleanMoves(moves, targetLength);
  const presentInversions = new Set(chain.filter((id) => ADVANCED_INVERSION_MOVES.includes(id)));
  for (const inversion of rotate(ADVANCED_INVERSION_MOVES, index)) {
    if (presentInversions.size >= 2) break;
    if (!presentInversions.has(inversion)) {
      const replaceIndex = Math.max(4, chain.length - 1 - presentInversions.size);
      chain[replaceIndex] = inversion;
      presentInversions.add(inversion);
    }
  }
  return uniqueMoves(chain).slice(0, targetLength);
}

function buildAdvancedMoveChain(baseMoves, index, owner = {}, requirement = {}) {
  const label = `${requirement.label || ""} ${owner.ownerStyle || ""}`.toLowerCase();
  const ownerMoves = ownerQualityMoves(owner);
  const inversionStart = requirement.treeId === "malicia"
    ? ["bananeira_au_entry", "queda_de_rins", "au_controlado"]
    : requirement.treeId === "mandinga"
      ? ["bananeira_wall", "queda_de_rins", "au_basico"]
      : requirement.treeId === "malandragem"
        ? ["au_basico", "macaco", "queda_de_rins_switch"]
        : label.includes("peace") || label.includes("meditation")
    ? ["au_controlado", "bananeira_wall", "queda_de_rins"]
    : label.includes("regional") || label.includes("speed")
      ? ["au_basico", "au_fechado", "macaco"]
      : ["queda_de_rins", "au_basico", "bananeira_au_entry"];
  const advanced = rotate([...inversionStart, ...ADVANCED_INVERSION_MOVES], index);
  const finishers = rotate(ADVANCED_FINISHERS, index + 2);
  const baseSource = requirement.type === "concept_tree"
    ? [...baseMoves, ...ownerMoves]
    : [...ownerMoves, ...baseMoves];
  const base = rotate(uniqueMoves(baseSource), index);
  const targetLength = index >= 4 ? 10 : 9;
  const chain = uniqueMoves([
    ...base.slice(0, 4),
    advanced[0],
    finishers[0],
    advanced[1],
    ...base.slice(4),
    finishers[1],
    advanced[2],
    finishers[2],
  ]);
  return ensureAdvancedRequirements(chain, index, targetLength);
}

function movementNames(moves) {
  return cleanMoves(moves).map((id) => getMovementById(id)?.name || titleCase(id));
}

function pickMoveSet(requirement = {}, owner = {}) {
  const label = `${requirement.label || ""} ${requirement.metric || ""} ${requirement.treeId || ""} ${owner.ownerStyle || ""}`.toLowerCase();
  const ownerMoves = ownerQualityMoves(owner);
  if (label.includes("signature") || requirement.type === "sequence") {
    const sequence = getMestreSequences(owner.ownerId)?.[0];
    if (sequence?.moves?.length) return uniqueMoves([...ownerMoves, ...sequence.moves]);
  }
  if (label.includes("malicia") || label.includes("anticip") || label.includes("strategy") || label.includes("read")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.strategy]);
  if (label.includes("mandinga") || label.includes("ceremony") || label.includes("ritual")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.rhythm]);
  if (label.includes("malandragem") || label.includes("regional") || label.includes("video")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.regional]);
  if (label.includes("angola") || label.includes("low") || label.includes("baixo")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.angola]);
  if (label.includes("peace") || label.includes("meditation") || label.includes("history") || label.includes("wisdom")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.peaceful]);
  if (label.includes("roda") || label.includes("game") || label.includes("entry") || label.includes("exit")) return uniqueMoves([...ownerMoves, ...MOVE_SETS.roda]);
  if (requirement.type === "phase") return uniqueMoves([...ownerMoves, ...MOVE_SETS.phase]);
  return uniqueMoves([...ownerMoves, ...MOVE_SETS.default]);
}

function ownerPrinciples(owner = {}, requirement = {}) {
  const ownerName = String(owner.ownerName || "").replace(/^Mestre\s+/i, "");
  const concept = requirement.treeId ? CONCEPT_LABELS[requirement.treeId] || titleCase(requirement.treeId) : null;
  const base = [
    owner.ownerType === "mestre" ? `${ownerName || "Mestre"} method` : `${owner.ownerName || "Boss"} principle`,
    concept ? `${concept} application` : "movement-based proof",
    "10-minute repeatable practice",
  ];
  const orisha = ORISHA_PRINCIPLES[owner.ownerName] || ORISHA_PRINCIPLES.Ehi;
  return [...new Set([...base, ...orisha])].slice(0, 5);
}

function ownerSequenceFactors(owner = {}, requirement = {}) {
  const concept = requirement.treeId ? CONCEPT_LABELS[requirement.treeId] || titleCase(requirement.treeId) : null;
  const text = ownerText(owner);
  const factors = [
    owner.ownerQualities,
    owner.ownerPhilosophy,
    concept ? `${concept} decision-making` : null,
  ];
  if (text.includes("angola")) factors.push("Angola lineage patience and low-game authority");
  if (text.includes("regional")) factors.push("Regional directness and efficient attack lines");
  if (text.includes("peace") || text.includes("wisdom")) factors.push("peaceful resolution through restraint, timing, and balance");
  if (text.includes("malicia") || text.includes("read")) factors.push("reading before striking and hiding intention");
  if (text.includes("mandinga") || text.includes("ritual")) factors.push("ritual presence, rhythm, and ceremony");
  if (text.includes("malandragem") || text.includes("street")) factors.push("resourceful escape, baiting, and survival angles");
  return factors.filter(Boolean).slice(0, 4).join("; ");
}

function sessionCountFor(owner = {}, requirement = {}) {
  const target = Number(requirement.targetLevel || requirement.target || requirement.minPhase || 0);
  if (owner.ownerType === "orisha" && /core|paramount/i.test(owner.ownerTier || "")) return 5;
  if (owner.ownerType === "mestre" && /founder|legendary/i.test(owner.ownerTier || "")) return 5;
  if (target >= 5) return 5;
  if (target >= 3) return 4;
  return 3;
}

function buildGenericSessions(owner, requirement, moves) {
  const count = sessionCountFor(owner, requirement);
  const ownerName = owner.ownerName || "Boss";
  const label = requirement.label || "Practice requirement";
  const factors = ownerSequenceFactors(owner, requirement);
  const templates = [
    ["Advanced Foundation Chain", "Build the requirement from base rhythm into two inversion checkpoints and a clean grounded exit."],
    ["Entry, Inversion, Recovery", "Enter calmly, pass through an inversion under control, and recover without breaking the requirement's intention."],
    ["Pressure Variation Round", "Change angle and height repeatedly while every exchange resolves through a named movement link."],
    ["Roda Decision Chain", `Use ${ownerName}'s principle to choose when to enter, invert, counter, and leave.`],
    ["Boss Proof Sequence", "Complete the full advanced chain with no dead movement and no repeated answer to the same pressure."],
  ];

  return templates.slice(0, count).map(([name, goal], index) => {
    const chain = buildAdvancedMoveChain(moves, index, owner, requirement);
    const names = movementNames(chain);
    return {
      session: index + 1,
      name: `${ownerName} ${name}`,
      minutes: 10,
      goal: `${goal} Express: ${factors}. Sequence: ${names.slice(0, 7).join(" -> ")}${names[7] ? ` -> ${names[7]}` : ""}.`,
      moves: chain,
      instructions: [
        `Minute 0-2: Establish ${names[0]} -> ${names[1]} -> ${names[2]} while expressing ${factors}. Requirement focus: "${label}".`,
        `Minute 2-4: Add ${names[3]} into ${names[4]}; the inversion must show the boss quality, not just athletic difficulty.`,
        `Minute 4-6: Flow ${names[5]} -> ${names[6]} -> ${names[7]} as the pressure response; make the decision match the history/skill profile.`,
        `Minute 6-8: Add ${names[8]}${names[9] ? ` -> ${names[9]}` : ""}; recover through the safest linked movement without abandoning the concept.`,
        "Minute 8-10: Run the full chain twice: once for lineage quality, once for roda pressure. Log which movement failed to express the boss identity.",
      ],
    };
  });
}

function buildConceptPlan(owner, requirement, index) {
  const pack = getConceptAdvancedSequences(requirement.treeId);
  if (!pack) return null;
  const conceptName = CONCEPT_LABELS[requirement.treeId] || titleCase(requirement.treeId);
  const ownerName = owner.ownerName || conceptName;
  const factors = ownerSequenceFactors(owner, requirement);
  const sessions = pack.sequences.map((sequence, sequenceIndex) => {
    const chain = buildAdvancedMoveChain(sequence.moves, sequenceIndex, owner, requirement);
    const names = movementNames(chain);
    return {
      session: sequence.session,
      name: `${ownerName}: ${sequence.name}`,
      minutes: 10,
      goal: `${sequence.goal} Express: ${factors}. Advanced chain: ${names.slice(0, 8).join(" -> ")}.`,
      orisha: sequence.orisha,
      mestre: sequence.mestre,
      moves: chain,
      instructions: [
        `Minute 0-2: Establish ${conceptName} through ${names[0]} -> ${names[1]} -> ${names[2]} while expressing ${factors}.`,
        `Minute 2-4: Add the first inversion checkpoint, ${names[3]} -> ${names[4]}, and make it serve the concept rather than decoration.`,
        `Minute 4-6: Pressure-test ${names[5]} -> ${names[6]} -> ${names[7]} as the opponent changes rhythm and the boss identity stays visible.`,
        `Minute 6-8: Add ${names[8]}${names[9] ? ` -> ${names[9]}` : ""}; choose the exit that best expresses the Orisha/Mestre qualities.`,
        "Minute 8-10: Run the full advanced sequence twice, changing only timing and intention. The movement order remains fixed.",
      ],
    };
  });

  return {
    id: `req_${slug(owner.ownerType)}_${slug(owner.ownerId)}_${slug(requirement.treeId)}_${index}`,
    title: `${ownerName} ${conceptName} Level ${requirement.targetLevel || 1}+ Practice Profile`,
    ownerType: owner.ownerType,
    ownerName,
    requirementLabel: requirement.label,
    context: `${pack.context}. This profile converts the gate into linked 10-minute sessions with named movements.`,
    sessionPolicy: SESSION_POLICY,
    principles: pack.keyPrinciples,
    sessions,
  };
}

export function buildRequirementPracticePlan(owner = {}, requirement = {}, index = 0) {
  if (!requirement || requirement.movementId || requirement.type === "movement") return null;
  const conceptPlan = requirement.type === "concept_tree" ? buildConceptPlan(owner, requirement, index) : null;
  if (conceptPlan) return conceptPlan;

  const ownerName = owner.ownerName || "Boss";
  const moves = pickMoveSet(requirement, owner);
  const sessions = buildGenericSessions(owner, requirement, moves);

  return {
    id: `req_${slug(owner.ownerType)}_${slug(owner.ownerId)}_${slug(requirement.type || requirement.metric || "gate")}_${index}`,
    title: `${ownerName} ${requirement.label || "Requirement"} Practice Profile`,
    ownerType: owner.ownerType || "boss",
    ownerName,
    requirementLabel: requirement.label || "Practice requirement",
    context: `${ownerName} requires this as a concrete practice profile: 10-minute sessions, named movements, direct instructions, and a proof goal for each round.`,
    sessionPolicy: SESSION_POLICY,
    principles: ownerPrinciples(owner, requirement),
    sessions,
  };
}

export function getRequirementPlanMovementIds(plan) {
  return [...new Set((plan?.sessions || []).flatMap((session) => session.moves || []))];
}
