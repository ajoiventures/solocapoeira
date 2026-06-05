/**
 * Mestre Signature Sequences — 5 advanced sequences per Mestre
 * 27 Mestres × 5 sequences = 135 total signature sequences
 * Unlocked when player defeats each Mestre
 *
 * Maps to: Mestre signature sequence unlock system
 */

import { MESTRES } from "./mestres.js";

export const MESTRE_SEQUENCES = {
  // ═══════════════════════════════════════════════════════════════════════════════════
  // PASTINHA LINEAGE (Angola Pure)
  // ═══════════════════════════════════════════════════════════════════════════════════

  pastinha: [
    {
      id: "seq_pastinha_1",
      name: "Pastinha's Ginga Meditation",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga_meditativa", "negativa", "role", "queda_de_rins", "ginga_meditativa"],
      description: "The master's meditation in motion. Pure Angola grounding.",
      xp: 150,
    },
    {
      id: "seq_pastinha_2",
      name: "Pastinha's Low Game Dominance",
      style: "Angola",
      difficulty: 4,
      moves: ["roda_baixa", "chamada_angola", "queda_de_costas", "ginga_baixo", "rasteira"],
      description: "Master the lowest roda. Feet work that sweeps opponents.",
      xp: 150,
    },
    {
      id: "seq_pastinha_3",
      name: "Pastinha's Escape Flow",
      style: "Angola",
      difficulty: 4,
      moves: ["lateral", "escorregueta", "negativa", "role", "lateral"],
      description: "Flowing escapes that confuse the attack.",
      xp: 150,
    },
    {
      id: "seq_pastinha_4",
      name: "Pastinha's Rhythmic Foundation",
      style: "Angola",
      difficulty: 4,
      moves: ["ritmo_do_coracao", "musica_no_corpo", "ginga", "cocorinha", "ritmo_do_coracao"],
      description: "Every movement is a song. Music is the foundation.",
      xp: 150,
    },
    {
      id: "seq_pastinha_5",
      name: "Pastinha's Angola Mastery",
      style: "Angola",
      difficulty: 5,
      moves: ["ginga_meditativa", "roda_baixa", "queda_de_rins", "rasteira", "coracao_aberto"],
      description: "The complete Angola philosophy embodied in motion.",
      xp: 200,
    },
  ],

  mestre_no: [
    {
      id: "seq_mestren_1",
      name: "Mestre Nô's Shadow Game",
      style: "Angola",
      difficulty: 4,
      moves: ["olhar_longe", "falseio_de_corpo", "ginga", "negativa", "role"],
      description: "Read your opponent before they move. Malícia through silence.",
      xp: 150,
    },
    {
      id: "seq_mestren_2",
      name: "Mestre Nô's Patience Test",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga_meditativa", "silencio_estrategico", "olho_para_olho", "cocorinha", "ginga"],
      description: "Wait. Watch. Strike when the moment is perfect.",
      xp: 150,
    },
    {
      id: "seq_mestren_3",
      name: "Mestre Nô's Low Escape",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga_baixo", "queda_de_costas", "banda", "roda_baixa", "lateral"],
      description: "Low game escapes that show deep Angola knowledge.",
      xp: 150,
    },
    {
      id: "seq_mestren_4",
      name: "Mestre Nô's Strategic Defense",
      style: "Angola",
      difficulty: 4,
      moves: ["negativa", "role", "queda_de_rins", "esquiva_baixa", "cocorinha"],
      description: "Defensive mastery that teaches humility.",
      xp: 150,
    },
    {
      id: "seq_mestren_5",
      name: "Mestre Nô's Eternal Roda",
      style: "Angola",
      difficulty: 5,
      moves: ["olho_para_olho", "silencio_estrategico", "ginga_meditativa", "queda_de_rins", "coracao_aberto"],
      description: "The eternal cycle of the roda embodied by one of Angola's greatest.",
      xp: 200,
    },
  ],

  joao_pequeno: [
    {
      id: "seq_joao_1",
      name: "João Pequeno's Powerful Kicks",
      style: "Angola",
      difficulty: 4,
      moves: ["meia_lua_de_compasso", "queixada", "armada", "ginga", "meia_lua_de_compasso"],
      description: "Small body, powerful technique. Direct Angola strikes.",
      xp: 150,
    },
    {
      id: "seq_joao_2",
      name: "João Pequeno's Ground Control",
      style: "Angola",
      difficulty: 4,
      moves: ["roda_baixa", "rasteira", "queda_de_rins", "banda", "negativa"],
      description: "Control the ground. Control the game.",
      xp: 150,
    },
    {
      id: "seq_joao_3",
      name: "João Pequeno's Offensive Ginga",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga", "meia_lua_de_compasso", "queixada", "armada", "ginga"],
      description: "Attack and defense flow as one in the ginga.",
      xp: 150,
    },
    {
      id: "seq_joao_4",
      name: "João Pequeno's Takedown Game",
      style: "Angola",
      difficulty: 4,
      moves: ["queixada", "rasteira", "queda_de_costas", "banda", "negativa"],
      description: "Bring your opponent down. Control from below.",
      xp: 150,
    },
    {
      id: "seq_joao_5",
      name: "João Pequeno's Angola Legacy",
      style: "Angola",
      difficulty: 5,
      moves: ["ginga", "meia_lua_de_compasso", "rasteira", "queda_de_rins", "coracao_aberto"],
      description: "A lineage master's complete style: power, technique, wisdom.",
      xp: 200,
    },
  ],

  waldemar: [
    {
      id: "seq_waldemar_1",
      name: "Waldemar's Inversions",
      style: "Angola",
      difficulty: 4,
      moves: ["mortal_lateral", "parafuso", "macaco", "au_basico", "ginga"],
      description: "Powerful inversions grounded in Angola.",
      xp: 150,
    },
    {
      id: "seq_waldemar_2",
      name: "Waldemar's Low Power",
      style: "Angola",
      difficulty: 4,
      moves: ["queda_de_rins", "queda_de_costas", "banda", "rasteira", "roda_baixa"],
      description: "Strength from the ground up.",
      xp: 150,
    },
    {
      id: "seq_waldemar_3",
      name: "Waldemar's Kick Power",
      style: "Angola",
      difficulty: 4,
      moves: ["meia_lua_de_compasso", "armada", "queixada", "negativa", "au_basico"],
      description: "Angular kicks powered by Angola rotation.",
      xp: 150,
    },
    {
      id: "seq_waldemar_4",
      name: "Waldemar's Acrobatic Flow",
      style: "Angola",
      difficulty: 4,
      moves: ["macaco", "au_basico", "mortal_lateral", "ginga", "role"],
      description: "Flowing movements that show advanced Angola skill.",
      xp: 150,
    },
    {
      id: "seq_waldemar_5",
      name: "Waldemar's Complete Mastery",
      style: "Angola",
      difficulty: 5,
      moves: ["ginga", "mortal_lateral", "rasteira", "au_basico", "coracao_aberto"],
      description: "The full range of Angola technique: ground, kicks, inversions, flow.",
      xp: 200,
    },
  ],

  canjiquinha: [
    {
      id: "seq_canjiquinha_1",
      name: "Canjiquinha's Playful Ginga",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga", "pirueta", "meia_volta", "volta_do_mundo", "ginga"],
      description: "Joy and skill dancing together.",
      xp: 150,
    },
    {
      id: "seq_canjiquinha_2",
      name: "Canjiquinha's Creative Escapes",
      style: "Angola",
      difficulty: 4,
      moves: ["negativa", "role", "lateral", "escorregueta", "cocorinha"],
      description: "Inventive ways out of every corner.",
      xp: 150,
    },
    {
      id: "seq_canjiquinha_3",
      name: "Canjiquinha's Flowing Combinations",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga", "queixada", "negativa", "role", "ginga"],
      description: "Movements flow like music.",
      xp: 150,
    },
    {
      id: "seq_canjiquinha_4",
      name: "Canjiquinha's Artistic Roda",
      style: "Angola",
      difficulty: 4,
      moves: ["pirueta", "meia_lua_de_compasso", "cocorinha", "negativa", "au_basico"],
      description: "Capoeira as art form.",
      xp: 150,
    },
    {
      id: "seq_canjiquinha_5",
      name: "Canjiquinha's Angola Grace",
      style: "Angola",
      difficulty: 5,
      moves: ["ginga", "pirueta", "negativa", "au_basico", "coracao_aberto"],
      description: "Graceful Angola with playful spirit.",
      xp: 200,
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════════════
  // REGIONAL LINEAGE (Speed & Directness)
  // ═══════════════════════════════════════════════════════════════════════════════════

  brasilia_ferrez: [
    {
      id: "seq_brasilia_1",
      name: "Brasília's Speed Game",
      style: "Regional",
      difficulty: 4,
      moves: ["chapa", "chapa_giratoria", "queixada", "armada", "lateral_escape"],
      description: "Fast directness. Regional power.",
      xp: 150,
    },
    {
      id: "seq_brasilia_2",
      name: "Brasília's Kick Combinations",
      style: "Regional",
      difficulty: 4,
      moves: ["pisao", "ponteira", "rabo_de_arraia", "chapa", "ginga"],
      description: "Rapid-fire kicks that attack from all angles.",
      xp: 150,
    },
    {
      id: "seq_brasilia_3",
      name: "Brasília's Reading Game",
      style: "Regional",
      difficulty: 4,
      moves: ["olho_para_olho", "falseio_de_corpo", "chapa", "armada", "lateral"],
      description: "Fast reads. Faster attacks.",
      xp: 150,
    },
    {
      id: "seq_brasilia_4",
      name: "Brasília's Offensive Flow",
      style: "Regional",
      difficulty: 4,
      moves: ["ataque_encadeado", "queixada", "rabo_de_arraia", "chapa", "au_basico"],
      description: "One attack leads to another. Relentless.",
      xp: 150,
    },
    {
      id: "seq_brasilia_5",
      name: "Brasília's Regional Mastery",
      style: "Regional",
      difficulty: 5,
      moves: ["chapa", "ataque_encadeado", "rabo_de_arraia", "olho_para_olho", "au_basico"],
      description: "The complete Regional style: speed, directness, intelligence.",
      xp: 200,
    },
  ],

  sinha: [
    {
      id: "seq_sinha_1",
      name: "Sinha's Fast Footwork",
      style: "Regional",
      difficulty: 4,
      moves: ["deslocamento_rapido", "chapa", "lateral_escape", "queixada", "ginga"],
      description: "Footwork so fast you can barely see it.",
      xp: 150,
    },
    {
      id: "seq_sinha_2",
      name: "Sinha's Hand Combat",
      style: "Regional",
      difficulty: 4,
      moves: ["soco_rapido", "defesa_de_mao", "chapa", "cintura_desprezada", "ginga"],
      description: "Hands up, defending and attacking.",
      xp: 150,
    },
    {
      id: "seq_sinha_3",
      name: "Sinha's Malícia Reading",
      style: "Regional",
      difficulty: 4,
      moves: ["malicia", "olho_para_olho", "falseio_de_corpo", "chapa", "lateral"],
      description: "Read and counter. Fast intelligence.",
      xp: 150,
    },
    {
      id: "seq_sinha_4",
      name: "Sinha's Space Control",
      style: "Regional",
      difficulty: 4,
      moves: ["criacao_de_espaco", "deslocamento_rapido", "chapa", "armada", "au_basico"],
      description: "Control the roda distance. Set your terms.",
      xp: 150,
    },
    {
      id: "seq_sinha_5",
      name: "Sinha's Regional Complete",
      style: "Regional",
      difficulty: 5,
      moves: ["chapa", "malicia", "soco_rapido", "deslocamento_rapido", "au_basico"],
      description: "Fast, intelligent, commanding Regional style.",
      xp: 200,
    },
  ],

  david_moura: [
    {
      id: "seq_david_1",
      name: "David Moura's Kick Arsenal",
      style: "Regional",
      difficulty: 4,
      moves: ["chapa", "rabo_de_arraia", "pisao", "ponteira", "queixada"],
      description: "Kicks from every angle and height.",
      xp: 150,
    },
    {
      id: "seq_david_2",
      name: "David Moura's Directness",
      style: "Regional",
      difficulty: 4,
      moves: ["chapa_giratoria", "lateral_escape", "cintura_desprezada", "armada", "au_basico"],
      description: "No wasted movement. Pure directness.",
      xp: 150,
    },
    {
      id: "seq_david_3",
      name: "David Moura's Transition Game",
      style: "Regional",
      difficulty: 4,
      moves: ["saida_regional", "criacao_de_espaco", "chapa", "lateral", "ginga"],
      description: "Always transitioning to the next attack.",
      xp: 150,
    },
    {
      id: "seq_david_4",
      name: "David Moura's Combination Power",
      style: "Regional",
      difficulty: 4,
      moves: ["rabo_de_arraia", "queixada", "chapa", "armada", "au_basico"],
      description: "Combinations that overwhelm defenses.",
      xp: 150,
    },
    {
      id: "seq_david_5",
      name: "David Moura's Regional Authority",
      style: "Regional",
      difficulty: 5,
      moves: ["chapa", "rabo_de_arraia", "ataque_encadeado", "lateral_escape", "au_basico"],
      description: "Commanding presence. Masterful technique.",
      xp: 200,
    },
  ],

  suassuna: [
    {
      id: "seq_suassuna_1",
      name: "Suassuna's Philosophical Ginga",
      style: "Regional",
      difficulty: 4,
      moves: ["ginga", "danca_e_luta", "chapa", "armada", "cocorinha"],
      description: "Dance and fight as one philosophy.",
      xp: 150,
    },
    {
      id: "seq_suassuna_2",
      name: "Suassuna's Cultural Grounding",
      style: "Regional",
      difficulty: 4,
      moves: ["ritmo_do_coracao", "musica_no_corpo", "chapa", "queixada", "ginga"],
      description: "Regional technique rooted in cultural wisdom.",
      xp: 150,
    },
    {
      id: "seq_suassuna_3",
      name: "Suassuna's Teaching Flow",
      style: "Regional",
      difficulty: 4,
      moves: ["negacao_do_ataque", "defesa_regional", "chapa", "lateral", "au_basico"],
      description: "Teaching through the game.",
      xp: 150,
    },
    {
      id: "seq_suassuna_4",
      name: "Suassuna's Artistic Regional",
      style: "Regional",
      difficulty: 4,
      moves: ["danca_e_luta", "chapa", "armada", "pirueta", "meia_volta"],
      description: "Regional with artistic flow.",
      xp: 150,
    },
    {
      id: "seq_suassuna_5",
      name: "Suassuna's Regional Philosophy",
      style: "Regional",
      difficulty: 5,
      moves: ["ginga", "danca_e_luta", "ataque_encadeado", "ritmo_do_coracao", "au_basico"],
      description: "Regional as philosophy and art form.",
      xp: 200,
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CONTEMPORARY LINEAGE (Athleticism & Aerials)
  // ═══════════════════════════════════════════════════════════════════════════════════

  pe_de_bananeira: [
    {
      id: "seq_banana_1",
      name: "Pé de Bananeira's Inversions",
      style: "Contemporary",
      difficulty: 4,
      moves: ["au_sem_mao", "au_fechado", "au_controlado", "bananeira_wall", "ginga"],
      description: "Handstand mastery at the highest level.",
      xp: 150,
    },
    {
      id: "seq_banana_2",
      name: "Pé de Bananeira's Aerial Attacks",
      style: "Contemporary",
      difficulty: 4,
      moves: ["saque_by_armada", "flying_kick", "salto", "ginga", "au_basico"],
      description: "Attacks that come from the air.",
      xp: 150,
    },
    {
      id: "seq_banana_3",
      name: "Pé de Bananeira's Acrobatic Flow",
      style: "Contemporary",
      difficulty: 4,
      moves: ["au_sem_mao", "flip_jump", "helicopter", "ginga", "cocorinha"],
      description: "Flowing acrobatics that astound.",
      xp: 150,
    },
    {
      id: "seq_banana_4",
      name: "Pé de Bananeira's Handstand Combinations",
      style: "Contemporary",
      difficulty: 4,
      moves: ["bananeira_wall", "au_fechado", "au_controlado", "ponte", "ginga"],
      description: "Balance and power from inverted positions.",
      xp: 150,
    },
    {
      id: "seq_banana_5",
      name: "Pé de Bananeira's Aerial Mastery",
      style: "Contemporary",
      difficulty: 5,
      moves: ["au_sem_mao", "flying_kick", "bananeira_wall", "flip_jump", "au_basico"],
      description: "The complete aerial artist. Mastery of the sky.",
      xp: 200,
    },
  ],

  moraes: [
    {
      id: "seq_moraes_1",
      name: "Moraes's Speed Kicks",
      style: "Contemporary",
      difficulty: 4,
      moves: ["rabo_de_arraia", "chapa", "flying_kick", "double_spin", "ginga"],
      description: "Fast, powerful kicks with contemporary spin.",
      xp: 150,
    },
    {
      id: "seq_moraes_2",
      name: "Moraes's Continuous Flow",
      style: "Contemporary",
      difficulty: 4,
      moves: ["fluxo_continuo", "sequencia_ofensiva", "chapa", "au_basico", "ginga"],
      description: "Unbroken sequences of attack.",
      xp: 150,
    },
    {
      id: "seq_moraes_3",
      name: "Moraes's High Game",
      style: "Contemporary",
      difficulty: 4,
      moves: ["flying_kick", "saque_by_armada", "salto", "au_fechado", "ginga"],
      description: "Game played at maximum height and speed.",
      xp: 150,
    },
    {
      id: "seq_moraes_4",
      name: "Moraes's Transition Game",
      style: "Contemporary",
      difficulty: 4,
      moves: ["transicao_fluida", "fluxo_continuo", "au_basico", "armada", "ginga"],
      description: "Smooth transitions between positions.",
      xp: 150,
    },
    {
      id: "seq_moraes_5",
      name: "Moraes's Contemporary Mastery",
      style: "Contemporary",
      difficulty: 5,
      moves: ["fluxo_continuo", "flying_kick", "double_spin", "transicao_fluida", "au_basico"],
      description: "Contemporary capoeira at its peak: speed, flow, athleticism.",
      xp: 200,
    },
  ],

  moa_cartorio: [
    {
      id: "seq_moa_1",
      name: "Moa's Ginga Dynamics",
      style: "Contemporary",
      difficulty: 4,
      moves: ["ginga", "chapa", "au_basico", "armada", "queixada"],
      description: "Modern interpretation of ancient ginga.",
      xp: 150,
    },
    {
      id: "seq_moa_2",
      name: "Moa's Freestyle Expression",
      style: "Contemporary",
      difficulty: 4,
      moves: ["liberdade_no_jogo", "fluxo_continuo", "au_fechado", "salto", "ginga"],
      description: "Free expression within Capoeira structure.",
      xp: 150,
    },
    {
      id: "seq_moa_3",
      name: "Moa's Modern Sequences",
      style: "Contemporary",
      difficulty: 4,
      moves: ["sequencia_ofensiva", "jogo_defensivo", "au_basico", "chapa", "ginga"],
      description: "Sequences designed for modern game.",
      xp: 150,
    },
    {
      id: "seq_moa_4",
      name: "Moa's Athletic Presence",
      style: "Contemporary",
      difficulty: 4,
      moves: ["double_spin", "flying_kick", "au_fechado", "ginga", "cocorinha"],
      description: "Athletic prowess on display.",
      xp: 150,
    },
    {
      id: "seq_moa_5",
      name: "Moa's Contemporary Vision",
      style: "Contemporary",
      difficulty: 5,
      moves: ["liberdade_no_jogo", "sequencia_ofensiva", "flying_kick", "au_basico", "ginga"],
      description: "Capoeira reimagined for the modern era.",
      xp: 200,
    },
  ],

  // Additional Mestres (simplified for brevity, but follow same pattern)
  // Each should have 5 sequences following the same structure

  mestre_acordeon: [
    {
      id: "seq_acordeon_1",
      name: "Mestre Acordeon's Musical Ginga",
      style: "Angola",
      difficulty: 4,
      moves: ["ginga", "ritmo_do_coracao", "musica_no_corpo", "negativa", "cocorinha"],
      description: "Every move is a note in a larger song.",
      xp: 150,
    },
    {
      id: "seq_acordeon_2",
      name: "Mestre Acordeon's Berimbau Response",
      style: "Angola",
      difficulty: 4,
      moves: ["berimbau_call_response", "ginga", "queixada", "armada", "negativa"],
      description: "Responding to the berimbau's call.",
      xp: 150,
    },
    {
      id: "seq_acordeon_3",
      name: "Mestre Acordeon's Low Rhythm",
      style: "Angola",
      difficulty: 4,
      moves: ["roda_baixa", "ginga_baixo", "ritmo_do_coracao", "queda_de_rins", "role"],
      description: "Low game played in perfect rhythm.",
      xp: 150,
    },
    {
      id: "seq_acordeon_4",
      name: "Mestre Acordeon's Dance Combat",
      style: "Angola",
      difficulty: 4,
      moves: ["danca_e_luta", "ginga", "meia_lua_de_compasso", "queixada", "ginga"],
      description: "Dance and combat as one unified expression.",
      xp: 150,
    },
    {
      id: "seq_acordeon_5",
      name: "Mestre Acordeon's Musical Mastery",
      style: "Angola",
      difficulty: 5,
      moves: ["ritmo_do_coracao", "berimbau_call_response", "danca_e_luta", "negativa", "coracao_aberto"],
      description: "Music and Capoeira inseparable.",
      xp: 200,
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MESTRES (Remaining 14)
  // ═══════════════════════════════════════════════════════════════════════════════════

  caiçara: [
    { id: "seq_caiçara_1", name: "Caiçara's Angola Depth", style: "Angola", difficulty: 4, moves: ["ginga_meditativa", "roda_baixa", "queda_de_rins", "negativa", "cocorinha"], description: "Deep Angola knowledge grounded in tradition.", xp: 150 },
    { id: "seq_caiçara_2", name: "Caiçara's Low Game Mastery", style: "Angola", difficulty: 4, moves: ["roda_baixa", "rasteira", "banda", "queda_de_costas", "ginga_baixo"], description: "Low roda played with precision.", xp: 150 },
    { id: "seq_caiçara_3", name: "Caiçara's Rhythmic Flow", style: "Angola", difficulty: 4, moves: ["ritmo_do_coracao", "musica_no_corpo", "ginga", "queixada", "negativa"], description: "Movement synchronized with music.", xp: 150 },
    { id: "seq_caiçara_4", name: "Caiçara's Takedown Game", style: "Angola", difficulty: 4, moves: ["queixada", "rasteira", "queda_de_rins", "banda", "role"], description: "Ground control through Angola technique.", xp: 150 },
    { id: "seq_caiçara_5", name: "Caiçara's Angola Complete", style: "Angola", difficulty: 5, moves: ["ginga_meditativa", "roda_baixa", "rasteira", "au_basico", "coracao_aberto"], description: "Complete Angola mastery expressed.", xp: 200 },
  ],

  polêmica: [
    { id: "seq_polêmica_1", name: "Polêmica's Contemporary Speed", style: "Contemporary", difficulty: 4, moves: ["chapa", "au_basico", "salto", "queixada", "ginga"], description: "Contemporary athleticism meets Angola foundation.", xp: 150 },
    { id: "seq_polêmica_2", name: "Polêmica's Aerial Mastery", style: "Contemporary", difficulty: 4, moves: ["au_sem_mao", "au_fechado", "flip_jump", "helicopter", "ginga"], description: "Aerial sophistication and control.", xp: 150 },
    { id: "seq_polêmica_3", name: "Polêmica's Flowing Style", style: "Contemporary", difficulty: 4, moves: ["fluxo_continuo", "transicao_fluida", "sequencia_ofensiva", "au_basico", "ginga"], description: "Unbroken flow between positions.", xp: 150 },
    { id: "seq_polêmica_4", name: "Polêmica's Kick Combinations", style: "Contemporary", difficulty: 4, moves: ["rabo_de_arraia", "flying_kick", "double_spin", "chapa", "au_basico"], description: "Kicks that express full athleticism.", xp: 150 },
    { id: "seq_polêmica_5", name: "Polêmica's Contemporary Transcendence", style: "Contemporary", difficulty: 5, moves: ["liberdade_no_jogo", "fluxo_continuo", "flying_kick", "au_fechado", "coracao_aberto"], description: "Contemporary as spiritual expression.", xp: 200 },
  ],

  gato_preto: [
    { id: "seq_gato_1", name: "Gato Preto's Deceptive Game", style: "Angola", difficulty: 4, moves: ["falseio_de_corpo", "olhar_longe", "ginga", "negativa", "queixada"], description: "Reading and deceiving your opponent.", xp: 150 },
    { id: "seq_gato_2", name: "Gato Preto's Strategic Defense", style: "Angola", difficulty: 4, moves: ["negativa", "role", "lateral", "esquiva_baixa", "cocorinha"], description: "Defense as a teaching moment.", xp: 150 },
    { id: "seq_gato_3", name: "Gato Preto's Low Game Control", style: "Angola", difficulty: 4, moves: ["roda_baixa", "queda_de_rins", "ginga_baixo", "rasteira", "banda"], description: "Ground mastery and control.", xp: 150 },
    { id: "seq_gato_4", name: "Gato Preto's Escape Flows", style: "Angola", difficulty: 4, moves: ["lateral", "escorregueta", "role", "negativa", "au_basico"], description: "Fluid escapes from any position.", xp: 150 },
    { id: "seq_gato_5", name: "Gato Preto's Angola Wisdom", style: "Angola", difficulty: 5, moves: ["falseio_de_corpo", "roda_baixa", "negativa", "au_basico", "coracao_aberto"], description: "Angola as street wisdom and survival.", xp: 200 },
  ],

  cobra_mansa: [
    { id: "seq_cobra_1", name: "Cobra Mansa's Flowing Ginga", style: "Angola", difficulty: 4, moves: ["ginga", "danca_e_luta", "pirueta", "negativa", "ginga"], description: "Ginga as meditation and power.", xp: 150 },
    { id: "seq_cobra_2", name: "Cobra Mansa's Artistic Roda", style: "Angola", difficulty: 4, moves: ["pirueta", "meia_volta", "volta_do_mundo", "negativa", "ginga"], description: "Capoeira as pure artistry.", xp: 150 },
    { id: "seq_cobra_3", name: "Cobra Mansa's Strategic Game", style: "Angola", difficulty: 4, moves: ["olho_para_olho", "ginga_meditativa", "cocorinha", "queixada", "negativa"], description: "Strategy expressed through movement.", xp: 150 },
    { id: "seq_cobra_4", name: "Cobra Mansa's Low Presence", style: "Angola", difficulty: 4, moves: ["ginga_baixo", "cocorinha", "roda_baixa", "queda_de_rins", "role"], description: "Power in humility and grounding.", xp: 150 },
    { id: "seq_cobra_5", name: "Cobra Mansa's Angola Transcendence", style: "Angola", difficulty: 5, moves: ["danca_e_luta", "ginga_meditativa", "negativa", "au_basico", "coracao_aberto"], description: "Movement as spiritual practice.", xp: 200 },
  ],

  bom_jesus: [
    { id: "seq_bj_1", name: "Bom Jesus's Angola Foundation", style: "Angola", difficulty: 4, moves: ["ginga", "meia_lua_de_compasso", "queixada", "negativa", "cocorinha"], description: "Angola grounded in tradition.", xp: 150 },
    { id: "seq_bj_2", name: "Bom Jesus's Kick Power", style: "Angola", difficulty: 4, moves: ["meia_lua_de_compasso", "armada", "queixada", "rabo_de_arraia", "ginga"], description: "Powerful angular kicks.", xp: 150 },
    { id: "seq_bj_3", name: "Bom Jesus's Ground Control", style: "Angola", difficulty: 4, moves: ["queda_de_rins", "rasteira", "banda", "queda_de_costas", "ginga"], description: "Master the ground game.", xp: 150 },
    { id: "seq_bj_4", name: "Bom Jesus's Roda Presence", style: "Angola", difficulty: 4, moves: ["ginga", "negativa", "cocorinha", "role", "au_basico"], description: "Commanding presence in the roda.", xp: 150 },
    { id: "seq_bj_5", name: "Bom Jesus's Angola Mastery", style: "Angola", difficulty: 5, moves: ["ginga", "meia_lua_de_compasso", "rasteira", "au_basico", "coracao_aberto"], description: "Complete Angola expression.", xp: 200 },
  ],

  gildo: [
    { id: "seq_gildo_1", name: "Gildo's Regional Kicks", style: "Regional", difficulty: 4, moves: ["chapa", "rabo_de_arraia", "pisao", "ponteira", "queixada"], description: "Regional kick arsenal mastery.", xp: 150 },
    { id: "seq_gildo_2", name: "Gildo's Direct Attack", style: "Regional", difficulty: 4, moves: ["chapa_giratoria", "lateral_escape", "ataque_encadeado", "armada", "au_basico"], description: "Regional directness and power.", xp: 150 },
    { id: "seq_gildo_3", name: "Gildo's Speed Game", style: "Regional", difficulty: 4, moves: ["deslocamento_rapido", "chapa", "soco_rapido", "defesa_de_mao", "ginga"], description: "Fast, relentless attacks.", xp: 150 },
    { id: "seq_gildo_4", name: "Gildo's Combination Chains", style: "Regional", difficulty: 4, moves: ["rabo_de_arraia", "queixada", "chapa", "lateral", "au_basico"], description: "Combinations that overwhelm.", xp: 150 },
    { id: "seq_gildo_5", name: "Gildo's Regional Authority", style: "Regional", difficulty: 5, moves: ["chapa", "ataque_encadeado", "rabo_de_arraia", "lateral_escape", "au_basico"], description: "Complete Regional mastery.", xp: 200 },
  ],

  grao: [
    { id: "seq_grao_1", name: "Grão's Kick Precision", style: "Regional", difficulty: 4, moves: ["chapa", "pisao", "ponteira", "bico_de_coruja", "sapata"], description: "Kicks from every angle.", xp: 150 },
    { id: "seq_grao_2", name: "Grão's Strategic Reading", style: "Regional", difficulty: 4, moves: ["olho_para_olho", "falseio_de_corpo", "chapa", "lateral", "ginga"], description: "Fast reading and counter-attacks.", xp: 150 },
    { id: "seq_grao_3", name: "Grão's Transition Mastery", style: "Regional", difficulty: 4, moves: ["saida_regional", "criacao_de_espaco", "deslocamento_rapido", "chapa", "au_basico"], description: "Seamless transitions between attacks.", xp: 150 },
    { id: "seq_grao_4", name: "Grão's Malicia Game", style: "Regional", difficulty: 4, moves: ["malicia", "olho_para_olho", "chapa", "lateral_escape", "ginga"], description: "Intelligent, deceptive play.", xp: 150 },
    { id: "seq_grao_5", name: "Grão's Regional Excellence", style: "Regional", difficulty: 5, moves: ["chapa", "malicia", "saida_regional", "lateral_escape", "au_basico"], description: "Regional technique perfected.", xp: 200 },
  ],

  nenel: [
    { id: "seq_nenel_1", name: "Nenel's Angola Roots", style: "Angola", difficulty: 4, moves: ["ginga", "roda_baixa", "queda_de_rins", "negativa", "cocorinha"], description: "Angola foundation deeply grounded.", xp: 150 },
    { id: "seq_nenel_2", name: "Nenel's Teaching Game", style: "Angola", difficulty: 4, moves: ["negativa", "role", "cocorinha", "queixada", "ginga"], description: "Teaching through the game.", xp: 150 },
    { id: "seq_nenel_3", name: "Nenel's Rhythmic Movement", style: "Angola", difficulty: 4, moves: ["ritmo_do_coracao", "musica_no_corpo", "ginga", "negativa", "queixada"], description: "Movement synchronized with berimbau.", xp: 150 },
    { id: "seq_nenel_4", name: "Nenel's Low Game Mastery", style: "Angola", difficulty: 4, moves: ["roda_baixa", "ginga_baixo", "queda_de_rins", "banda", "role"], description: "Low roda as spiritual practice.", xp: 150 },
    { id: "seq_nenel_5", name: "Nenel's Angola Wisdom", style: "Angola", difficulty: 5, moves: ["ginga", "roda_baixa", "ritmo_do_coracao", "au_basico", "coracao_aberto"], description: "Angola as complete philosophy.", xp: 200 },
  ],

  santo_amaro: [
    { id: "seq_santo_1", name: "Santo Amaro's Angola Journey", style: "Angola", difficulty: 4, moves: ["ginga_meditativa", "roda_baixa", "cocorinha", "negativa", "ginga"], description: "Angola as spiritual path.", xp: 150 },
    { id: "seq_santo_2", name: "Santo Amaro's Ground Mastery", style: "Angola", difficulty: 4, moves: ["queda_de_rins", "banda", "queda_de_costas", "rasteira", "ginga"], description: "Complete ground work mastery.", xp: 150 },
    { id: "seq_santo_3", name: "Santo Amaro's Flow State", style: "Angola", difficulty: 4, moves: ["ginga", "negativa", "role", "queixada", "au_basico"], description: "Movement in perfect harmony.", xp: 150 },
    { id: "seq_santo_4", name: "Santo Amaro's Strategic Defense", style: "Angola", difficulty: 4, moves: ["negativa", "esquiva_baixa", "cocorinha", "role", "lateral"], description: "Defense as wisdom teaching.", xp: 150 },
    { id: "seq_santo_5", name: "Santo Amaro's Angola Transcendence", style: "Angola", difficulty: 5, moves: ["ginga_meditativa", "queda_de_rins", "negativa", "au_basico", "coracao_aberto"], description: "Angola mastery transcends the game.", xp: 200 },
  ],

  papai: [
    { id: "seq_papai_1", name: "Papai's Regional Kicks", style: "Regional", difficulty: 4, moves: ["chapa", "rabo_de_arraia", "pisao", "bico_de_coruja", "ginga"], description: "Regional kick technique mastery.", xp: 150 },
    { id: "seq_papai_2", name: "Papai's Speed Attacks", style: "Regional", difficulty: 4, moves: ["deslocamento_rapido", "chapa", "lateral_escape", "soco_rapido", "au_basico"], description: "Fast, aggressive Regional style.", xp: 150 },
    { id: "seq_papai_3", name: "Papai's Combination Mastery", style: "Regional", difficulty: 4, moves: ["ataque_encadeado", "rabo_de_arraia", "queixada", "chapa", "lateral"], description: "Relentless attack combinations.", xp: 150 },
    { id: "seq_papai_4", name: "Papai's Space Control", style: "Regional", difficulty: 4, moves: ["criacao_de_espaco", "deslocamento_rapido", "chapa", "lateral", "ginga"], description: "Control the distance in roda.", xp: 150 },
    { id: "seq_papai_5", name: "Papai's Regional Dominance", style: "Regional", difficulty: 5, moves: ["chapa", "ataque_encadeado", "rabo_de_arraia", "lateral_escape", "au_basico"], description: "Regional style mastered completely.", xp: 200 },
  ],

  zulu: [
    { id: "seq_zulu_1", name: "Zulu's Contemporary Power", style: "Contemporary", difficulty: 4, moves: ["au_basico", "flying_kick", "salto", "double_spin", "ginga"], description: "Contemporary athleticism expressed.", xp: 150 },
    { id: "seq_zulu_2", name: "Zulu's Aerial Techniques", style: "Contemporary", difficulty: 4, moves: ["au_sem_mao", "au_fechado", "au_controlado", "flip_jump", "ginga"], description: "Sophisticated aerial movements.", xp: 150 },
    { id: "seq_zulu_3", name: "Zulu's Flowing Combinations", style: "Contemporary", difficulty: 4, moves: ["fluxo_continuo", "sequencia_ofensiva", "transicao_fluida", "au_basico", "ginga"], description: "Unbroken flow between techniques.", xp: 150 },
    { id: "seq_zulu_4", name: "Zulu's Modern Expression", style: "Contemporary", difficulty: 4, moves: ["liberdade_no_jogo", "fluxo_continuo", "flying_kick", "au_fechado", "ginga"], description: "Contemporary Capoeira reimagined.", xp: 150 },
    { id: "seq_zulu_5", name: "Zulu's Contemporary Mastery", style: "Contemporary", difficulty: 5, moves: ["fluxo_continuo", "flying_kick", "au_fechado", "sequencia_ofensiva", "coracao_aberto"], description: "Complete contemporary mastery.", xp: 200 },
  ],

  no: [
    { id: "seq_no_1", name: "Nô's Game Reading", style: "Angola", difficulty: 4, moves: ["olho_para_olho", "silencio_estrategico", "ginga", "negativa", "cocorinha"], description: "Deep reading of opponent intention.", xp: 150 },
    { id: "seq_no_2", name: "Nô's Patient Game", style: "Angola", difficulty: 4, moves: ["ginga_meditativa", "olhar_longe", "roda_baixa", "negativa", "ginga"], description: "Patience as tactical mastery.", xp: 150 },
    { id: "seq_no_3", name: "Nô's Strategic Defense", style: "Angola", difficulty: 4, moves: ["negativa", "role", "lateral", "esquiva_baixa", "cocorinha"], description: "Defense teaches the opponent.", xp: 150 },
    { id: "seq_no_4", name: "Nô's Low Game Wisdom", style: "Angola", difficulty: 4, moves: ["roda_baixa", "ginga_baixo", "queda_de_rins", "rasteira", "negativa"], description: "Low game as spiritual expression.", xp: 150 },
    { id: "seq_no_5", name: "Nô's Angola Transcendence", style: "Angola", difficulty: 5, moves: ["olho_para_olho", "ginga_meditativa", "negativa", "au_basico", "coracao_aberto"], description: "Angola mastery transcends the game.", xp: 200 },
  ],

  talo: [
    { id: "seq_talo_1", name: "Talo's Hybrid Style", style: "Regional", difficulty: 4, moves: ["ginga", "chapa", "meia_lua_de_compasso", "queixada", "au_basico"], description: "Angola foundation with Regional speed.", xp: 150 },
    { id: "seq_talo_2", name: "Talo's Balanced Game", style: "Regional", difficulty: 4, moves: ["negativa", "chapa", "lateral", "queixada", "ginga"], description: "Balance between Angola and Regional.", xp: 150 },
    { id: "seq_talo_3", name: "Talo's Strategic Attack", style: "Regional", difficulty: 4, moves: ["ataque_encadeado", "chapa", "rabo_de_arraia", "lateral_escape", "au_basico"], description: "Strategic attack from Angola base.", xp: 150 },
    { id: "seq_talo_4", name: "Talo's Transition Game", style: "Regional", difficulty: 4, moves: ["saida_regional", "criacao_de_espaco", "ginga", "chapa", "au_basico"], description: "Smooth transitions between styles.", xp: 150 },
    { id: "seq_talo_5", name: "Talo's Integrated Mastery", style: "Regional", difficulty: 5, moves: ["ginga", "chapa", "ataque_encadeado", "lateral_escape", "coracao_aberto"], description: "Integration of Angola and Regional.", xp: 200 },
  ],

  amen: [
    { id: "seq_amen_1", name: "Amen's Contemporary Vision", style: "Contemporary", difficulty: 4, moves: ["au_basico", "salto", "flip_jump", "chapa", "ginga"], description: "Contemporary Capoeira vision.", xp: 150 },
    { id: "seq_amen_2", name: "Amen's Modern Flow", style: "Contemporary", difficulty: 4, moves: ["fluxo_continuo", "sequencia_ofensiva", "au_fechado", "flying_kick", "ginga"], description: "Modern flowing style.", xp: 150 },
    { id: "seq_amen_3", name: "Amen's Athletic Expression", style: "Contemporary", difficulty: 4, moves: ["double_spin", "au_sem_mao", "helicopter", "au_basico", "ginga"], description: "Athleticism as art form.", xp: 150 },
    { id: "seq_amen_4", name: "Amen's Freestyle Mastery", style: "Contemporary", difficulty: 4, moves: ["liberdade_no_jogo", "fluxo_continuo", "sequencia_ofensiva", "transicao_fluida", "au_basico"], description: "Complete freestyle expression.", xp: 150 },
    { id: "seq_amen_5", name: "Amen's Contemporary Excellence", style: "Contemporary", difficulty: 5, moves: ["liberdade_no_jogo", "fluxo_continuo", "flying_kick", "au_fechado", "coracao_aberto"], description: "Contemporary Capoeira mastered.", xp: 200 },
  ],
};

/**
 * Get all sequences for a specific Mestre
 */
export function getMestreSequences(mestreId) {
  const key = resolveMestreSequenceKey(mestreId);
  const sequences = key ? MESTRE_SEQUENCES[key] : createFallbackMestreSequences(mestreId);
  return sequences.map((sequence) => ({
    ...sequence,
    mestreId,
  }));
}

function resolveMestreSequenceKey(mestreId) {
  const rawId = String(mestreId || "");
  const withoutPrefix = rawId.replace(/^mestre_/, "");
  const ascii = withoutPrefix.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const candidates = [
    rawId,
    withoutPrefix,
    ascii,
    `mestre_${withoutPrefix}`,
    `mestre_${ascii}`,
    withoutPrefix.replace(/^joao_/, "joao_"),
    withoutPrefix.replace(/^moa_do_/, "moa_"),
    withoutPrefix.replace(/^moa_/, "moa_"),
    withoutPrefix.replace(/^pe_de_/, "pe_de_"),
    withoutPrefix.replace(/^santo$/, "santo_amaro"),
    withoutPrefix.replace(/^gato$/, "gato_preto"),
    withoutPrefix.replace(/^cobra_additional$/, "cobra_mansa"),
  ];
  return candidates.find((candidate) => MESTRE_SEQUENCES[candidate]) || null;
}

function labelFromMestreId(mestreId) {
  return String(mestreId || "mestre")
    .replace(/^mestre_/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createFallbackMestreSequences(mestreId) {
  const baseId = String(mestreId || "mestre").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, "_");
  const mestreName = labelFromMestreId(mestreId);
  const templates = [
    ["Foundation Control", ["ginga", "negativa", "cocorinha", "role", "ginga"]],
    ["Low Game Pressure", ["roda_baixa", "rasteira", "queda_de_rins", "banda", "negativa"]],
    ["Signature Kick Chain", ["queixada", "armada", "meia_lua_de_compasso", "lateral", "ginga"]],
    ["Roda Reading Flow", ["olho_para_olho", "falseio_de_corpo", "ginga_meditativa", "esquiva_baixa", "ginga"]],
    ["Advanced Mastery Roda", ["ginga", "au_basico", "rasteira", "meia_lua_de_compasso", "coracao_aberto"]],
  ];

  return templates.map(([name, moves], index) => ({
    id: `seq_${baseId}_${index + 1}`,
    name: `${mestreName}'s ${name}`,
    style: "Advanced",
    difficulty: index === 4 ? 5 : 4,
    moves,
    description: `Advanced sequence inspired by ${mestreName}'s teaching path.`,
    xp: index === 4 ? 200 : 150,
    generated: true,
    mestreId,
  }));
}

/**
 * Get single sequence by ID
 */
export function getSequenceById(sequenceId) {
  for (const mestreSeqs of getAllMestreSequencesByMestre()) {
    const seq = mestreSeqs.find((s) => s.id === sequenceId);
    if (seq) return seq;
  }
  return null;
}

/**
 * Get all Mestre sequences (flattened)
 */
export function getAllMestreSequences() {
  return getAllMestreSequencesByMestre().flat();
}

function getAllMestreSequencesByMestre() {
  const uniqueMestreIds = [...new Set(MESTRES.map((mestre) => mestre.id))];
  return uniqueMestreIds.map((mestreId) => getMestreSequences(mestreId));
}

/**
 * Get sequences by style
 */
export function getSequencesByStyle(style) {
  return getAllMestreSequences().filter((s) => s.style === style);
}

/**
 * Get sequences by difficulty
 */
export function getSequencesByDifficulty(difficulty) {
  return getAllMestreSequences().filter((s) => s.difficulty === difficulty);
}
