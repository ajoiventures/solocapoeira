/**
 * Movement Phase Mapping — Tags movements by phase priority
 * Maps to #88: Tag all movements with phase priority
 *
 * Phase 1 (Angola): Foundation + low game + powerful inversions
 * Phase 2 (Angola + Regional): Phase 1 + speed + directness
 * Phase 3 (Angola + Contemporary): Phase 1-2 + athleticism + aerials
 * Phase 4 (All Integrated): All movements, Angola as foundation
 */

export const MOVEMENT_PHASES = {
  // ─── PHASE 1: ANGOLA FOUNDATION ─────────────────────────────────────
  phase_1_core: [
    // Foundation - always
    "ginga",
    "cocorinha",
    "esquiva_baixa",
    "meia_lua_de_compasso",
    "negativa",
    "role",
    "queixada",
    "armada",
    "au_basico",
    "bananeira_wall",
    "ponte",

    // Low game Angola
    "roda_baixa",
    "chamada_angola",
    "ginga_meditativa",
    "ginga_baixo",
    "berimbau_call_response",
    "coracao_aberto",

    // Ground work
    "queda_de_rins",
    "queda_de_costas",
    "banda",
    "rasteira",

    // Powerful inversions
    "mortal_lateral",
    "parafuso",
    "macaco",

    // Angola rhythmic
    "ritmo_do_coracao",
    "musica_no_corpo",

    // Angola escape
    "lateral",
    "escorregueta",
  ],

  phase_1_secondary: [
    // Supporting movements
    "pirueta",
    "meia_volta",
    "trocacao",
    "volta_do_mundo",
    "testada",
    "cabeçada",
    "joelhada",
  ],

  // ─── PHASE 2: ANGOLA + REGIONAL ─────────────────────────────────────
  phase_2_additions: [
    // Regional speed
    "chapa",
    "chapa_giratoria",
    "lateral_escape",
    "cintura_desprezada",
    "alavanca",
    "encruzilhada",
    "pe_de_mao",
    "tesoura",
    "tesoura_de_mao",
    "roleta",
    "cabra",

    // Regional kicks
    "pisao",
    "ponteira",
    "jab_circular",
    "bico_de_coruja",
    "sapata",
    "rabo_de_arraia",

    // Reading/Malícia movements
    "falseio_de_corpo",
    "olhar_longe",
    "olho_para_olho",
    "silencio_estrategico",

    // Regional combinations
    "ataque_encadeado",
    "defesa_regional",
    "saida_regional",
    "criacao_de_espaco",
    "chamada_de_cintura",

    // Hybrid
    "danca_e_luta",
  ],

  phase_2_secondary: [
    // Supporting
    "soco_rapido",
    "defesa_de_mao",
    "deslocamento_rapido",
    "negacao_do_ataque",
  ],

  // ─── PHASE 3: ANGOLA + CONTEMPORARY ─────────────────────────────────
  phase_3_additions: [
    // Contemporary acrobatics
    "au_sem_mao",
    "au_fechado",
    "au_controlado",
    "salto",
    "aero_traca",
    "flip_jump",
    "helicopter",

    // Contemporary athleticism
    "saque_by_armada",
    "saque_by_queixada",
    "flying_kick",
    "double_spin",

    // High level sequences
    "fluxo_continuo",
    "sequencia_ofensiva",
    "jogo_defensivo",
    "transicao_fluida",
  ],

  phase_3_secondary: [
    // Conditioning aerials
    "short_foot",
    "toe_yoga",
    "foot_rolling",
  ],

  // ─── PHASE 4: ALL INTEGRATED ─────────────────────────────────────────
  phase_4_additions: [
    // Transcendence
    "liberdade_no_jogo",
    "presenca_espiritual",
    "energia_que_flui",
    "influencia_do_jogo",
    "sincronizacao_com_parceiro",
    "movimentacao_alta",
    "movimentacao_baixa",
    "musica_no_berimbau",
  ],
};

/**
 * Get phase tags for a movement
 * Returns: { availableFrom: 1, priority: "core" | "secondary" | "addition" }
 */
export function getMovementPhaseInfo(movementId) {
  // Check Phase 1 core
  if (MOVEMENT_PHASES.phase_1_core.includes(movementId)) {
    return { availableFrom: 1, priority: "core" };
  }

  // Check Phase 1 secondary
  if (MOVEMENT_PHASES.phase_1_secondary.includes(movementId)) {
    return { availableFrom: 1, priority: "secondary" };
  }

  // Check Phase 2 additions
  if (MOVEMENT_PHASES.phase_2_additions.includes(movementId)) {
    return { availableFrom: 2, priority: "addition" };
  }

  // Check Phase 2 secondary
  if (MOVEMENT_PHASES.phase_2_secondary.includes(movementId)) {
    return { availableFrom: 2, priority: "secondary" };
  }

  // Check Phase 3 additions
  if (MOVEMENT_PHASES.phase_3_additions.includes(movementId)) {
    return { availableFrom: 3, priority: "addition" };
  }

  // Check Phase 3 secondary
  if (MOVEMENT_PHASES.phase_3_secondary.includes(movementId)) {
    return { availableFrom: 3, priority: "secondary" };
  }

  // Check Phase 4 additions
  if (MOVEMENT_PHASES.phase_4_additions.includes(movementId)) {
    return { availableFrom: 4, priority: "addition" };
  }

  // Default: available from Phase 1
  return { availableFrom: 1, priority: "secondary" };
}

/**
 * Get movements available in a given phase
 */
export function getMovementsForPhase(phase) {
  const movements = [];

  if (phase >= 1) {
    movements.push(...MOVEMENT_PHASES.phase_1_core);
    movements.push(...MOVEMENT_PHASES.phase_1_secondary);
  }

  if (phase >= 2) {
    movements.push(...MOVEMENT_PHASES.phase_2_additions);
    movements.push(...MOVEMENT_PHASES.phase_2_secondary);
  }

  if (phase >= 3) {
    movements.push(...MOVEMENT_PHASES.phase_3_additions);
    movements.push(...MOVEMENT_PHASES.phase_3_secondary);
  }

  if (phase >= 4) {
    movements.push(...MOVEMENT_PHASES.phase_4_additions);
  }

  return [...new Set(movements)]; // Remove duplicates
}

/**
 * Get priority-ordered movements for a phase
 */
export function getPhaseMovementsOrdered(phase) {
  const core = phase >= 1 ? MOVEMENT_PHASES.phase_1_core : [];
  const secondary = [
    ...MOVEMENT_PHASES.phase_1_secondary,
    ...(phase >= 2 ? MOVEMENT_PHASES.phase_2_secondary : []),
    ...(phase >= 3 ? MOVEMENT_PHASES.phase_3_secondary : []),
  ];
  const additions = [
    ...(phase >= 2 ? MOVEMENT_PHASES.phase_2_additions : []),
    ...(phase >= 3 ? MOVEMENT_PHASES.phase_3_additions : []),
    ...(phase >= 4 ? MOVEMENT_PHASES.phase_4_additions : []),
  ];

  return { core, secondary, additions };
}

/**
 * Check if movement is available in phase
 */
export function isMovementAvailableInPhase(movementId, currentPhase) {
  const info = getMovementPhaseInfo(movementId);
  return currentPhase >= info.availableFrom;
}
