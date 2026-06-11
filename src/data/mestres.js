// ═══════════════════════════════════════════════════════════════════════════════════
// MESTRES.JS — Complete 13 Mestres Training Programs
// Solo Leveling Capoeira Training App
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * 13 LEGENDARY MESTRES — Each a complete training program
 *
 * Progression Path:
 * 1. Start with the training ladder, then climb toward the founder-level icons.
 * 2. Complete their unique requirements
 * 3. Master their signature sequences
 * 4. Unlock their teaching reward
 * 5. Progress to next Mestre or pursue Orishas path
 *
 * Mestres represent HISTORICAL teaching methods and lineages.
 * Each is a distinct approach to Capoeira mastery.
 */

export const MESTRES = [
  // ═══════════════════════════════════════════════════════════════════════════════════
  // TIER 1: STYLE FOUNDERS (Choose your path here)
  // ═══════════════════════════════════════════════════════════════════════════════════

  // MESTRE BIMBA — The Systematizer
  {
    id: "mestre_bimba",
    name: "Mestre Bimba",
    full_name: "Manoel dos Santos",
    years_lived: "1900-1974",
    tier: "founder",
    subtitle: "The Systematizer — Founder of Capoeira Regional",
    historical_role:
      "Founded Capoeira Regional in 1932. Systematized Capoeira for urban, modern Brazil. " +
      "Created numbered sequences. Made Capoeira respectable and effective.",

    style: "Regional",
    style_characteristics: "Fast, direct, efficient, athletic, acrobatic",

    philosophy:
      "Capoeira is 80% malícia, 20% technique. Speed beats strength. " +
      "Efficiency defeats waste. Deception defeats awareness.",

    teaching_methodology: {
      approach: "Systematic progression through numbered movements",
      class_structure: [
        "Warm-ups and foundational ginga",
        "Numbered basic sequences (1-5)",
        "Complex combination chains",
        "Free sparring (jogo)",
      ],
      emphasis: [
        "speed",
        "directness",
        "efficiency",
        "practical_application",
        "athletic_development",
      ],
      tempo: "fast (120-140 BPM Regional tempo)",
    },

    signature_techniques: [
      {
        id: "armada",
        name: "Armada",
        meaning: "Spinning Wheel Kick",
        description: "The signature Regional technique. Powerful spinning kick.",
      },
      {
        id: "lateral",
        name: "Lateral",
        meaning: "Lateral Escape",
        description: "Swift dodge-counter in single motion. Speed is key.",
      },
      {
        id: "cintura_desprezada",
        name: "Cintura Desprezada",
        meaning: "Disrespectful Waist",
        description: "Hip displacement takedown using opponent's momentum.",
      },
      {
        id: "cabeçada",
        name: "Cabeçada",
        meaning: "Headbutt",
        description: "Effective close-range strike. No wasted motion.",
      },
    ],

    signature_sequences: [
      {
        id: "bimba_seq_1",
        name: "Bimba's Sequence Number 1",
        description: "Ginga → Lateral → Armada → Queda de Rins",
        movements: ["ginga", "lateral", "armada", "queda_de_rim"],
        conceptVariations: [
          {
            concepts: [],
            repRequirements: { 1: 20, 2: 60, 3: 120, 4: 240, 5: 400 },
          },
          {
            concepts: ["malicia"],
            repRequirements: { 1: 20, 2: 70, 3: 140, 4: 280, 5: 460 },
          },
          {
            concepts: ["malicia", "mandinga"],
            repRequirements: { 1: 25, 2: 90, 3: 180, 4: 360, 5: 600 },
          },
        ],
      },
      {
        id: "bimba_seq_2",
        name: "Bimba's Sequence Number 2",
        description: "Ginga → Cintura → Cabeçada → Armada",
        movements: ["ginga", "cintura_desprezada", "cabeçada", "armada"],
      },
    ],

    requirements: [
      {
        label: "Roda Baixa mastery level 2+ (Angola foundation)",
        type: "movement",
        movementId: "roda_baixa",
        targetLevel: 2,
        narrative: "Bimba (to Angola player): 'Ground yourself. Even against speed, stay connected to the earth.'",
      },
      {
        label: "Mandinga tree level 2+ (spiritual resilience)",
        type: "concept_tree",
        treeId: "mandinga",
        targetLevel: 2,
        narrative: "Your Mandinga power lets you stay grounded as Bimba attacks fast. Spiritual > speed.",
      },
      {
        label: "Malícia tree level 2+ (read Regional speed)",
        type: "concept_tree",
        treeId: "malicia",
        targetLevel: 2,
        narrative: "Read Bimba's directness. His speed is predictable to those who understand Malícia.",
      },
      {
        label: "Armada mastery level 2+ (understand his signature)",
        type: "movement",
        movementId: "armada",
        targetLevel: 2,
        narrative: "Know the Armada. Counter it with Angola timing, not Regional speed.",
      },
      {
        label: "Complete 5 training sessions studying Regional game video segments",
        type: "gameplay",
        metric: "video_segments_studied_5",
        target: 5,
        narrative: "Study Regional games. Learn the patterns. Anticipate the directness.",
      },
      {
        label: "Execute Bimba's sequence with Mandinga + Malícia integration",
        type: "sequence",
        sequenceId: "bimba_seq_1",
        conceptRequirement: ["mandinga", "malicia"],
        targetMastery: "flowing",
        narrative: "Bimba: 'You beat me not with speed, but with grounded reading. That is true power.'",
      },
    ],

    execution_focus: {
      philosophy: "Direct. Powerful. Fast. Systematic.",
      movement_style:
        "Explosive yet controlled. Every motion has purpose. No wasted energy.",
      tactical_approach: "Read opponent. Strike decisively. Speed is your advantage.",

      training_instructions: {
        phase_1_speed_foundation: {
          focus: "Ginga at Regional tempo — Building speed foundation",
          steps: [
            "Step 1: Begin ginga at 100 BPM (medium Regional tempo)",
            "Step 2: Increase tempo 10 BPM every 30 seconds",
            "Step 3: Goal: Maintain control at 120-130 BPM",
            "Step 4: Add lateral dodges — still at fast tempo",
            "Step 5: Return to normal ginga. Repeat 50 times total.",
          ],
          reps: 50,
          tempo: "100-130 BPM (fast Regional)",
          cue: "Speed without sacrifice. Control at high tempo.",
          bimba_teaching:
            "Bimba says: 'Speed is not rushing. It is efficiency at high tempo. " +
            "Control matters more than velocity.'",
        },

        phase_2_sequences: {
          focus: "Master Bimba's numbered sequences",
          steps: [
            "Step 1: Learn Sequence 1 (Ginga → Lateral → Armada → Queda)",
            "Step 2: Execute at slow tempo (80 BPM) for form",
            "Step 3: Increase to medium tempo (100 BPM)",
            "Step 4: Execute at full Regional tempo (120+ BPM)",
            "Step 5: Chain into Sequence 2 without breaking tempo",
          ],
          reps: "Sequence 1: 20 times | Sequence 2: 20 times | Combined: 10 times",
          tempo: "Progressive (80 → 100 → 120+ BPM)",
          cue: "Flow. Chain. Speed.",
          bimba_teaching:
            "Bimba says: 'The sequences teach your body the paths. " +
            "Repetition creates mastery. Mastery becomes instinct.'",
        },

        phase_3_combat_application: {
          focus: "Apply sequences in live Regional sparring",
          steps: [
            "Step 1: Spar at Regional tempo (fast, Athletic)",
            "Step 2: Execute Sequence 1 against opponent movement",
            "Step 3: Read their response, adapt with Sequence 2",
            "Step 4: Chain sequences together, reading opponent between each",
            "Step 5: Win through speed and strategic sequence placement",
          ],
          reps: "5 games, 5 minutes each, at full Regional intensity",
          tempo: "120+ BPM (full Regional pace)",
          cue: "System. Speed. Victory.",
          bimba_teaching:
            "Bimba says: 'The system works. Numbers do not lie. " +
            "Follow the path, and the path leads to victory.'",
        },
      },
    },

    concept_affinities: {
      malicia: {
        level: "core",
        description: "Bimba reads through speed and timing",
        bonus: "+15% malicia_effectiveness",
      },
      mandinga: {
        level: "secondary",
        description: "Bimba uses flashy, impressive techniques (Armada, acrobatics)",
        bonus: "+10% mandinga_presence",
      },
      malandragem: {
        level: "tertiary",
        description: "Bimba teaches efficient, economical movement",
        bonus: "+5% malandragem_efficiency",
      },
    },

    stat_bonuses: {
      speed: 20,
      efficiency: 15,
      directness: 12,
      malicia_effectiveness: 15,
      sequence_chaining: 8,
      acrobatic_flow: 10,
    },

    progression_tiers: [
      {
        name: "Bimba's Student",
        xpReward: 200,
        requirements: ["Ginga level 2+", "Armada level 1+"],
      },
      {
        name: "Bimba's Disciple",
        xpReward: 300,
        requirements: ["Armada level 3+", "Malícia 1+"],
      },
      {
        name: "Bimba's Practitioner",
        xpReward: 500,
        requirements: [
          "Sequence 1 mastered",
          "5 speed-based wins",
          "Sequence 2 mastered",
        ],
        unlocked_content: [
          "Free Play (Jogo Livre)",
          "Combat application training",
          "Advanced sequencing",
        ],
      },
    ],

    reward: {
      xp: 600,
      title: "Regional Master",
      description:
        "You have learned Bimba's systematic approach. Speed and efficiency define your game. " +
        "You are now a Regional Practitioner.",
    },

    victory_text: (playerName) =>
      `Mestre Bimba nods, expressionless but satisfied. ` +
      `"${playerName}, you have begun to understand. ` +
      `Speed. Deception. Efficiency. These are the Regional way. ` +
      `You are no longer a student. You are a practitioner of the system I created. ` +
      `Now go — teach others. Show them that Capoeira is not a relic of the past. ` +
      `It is a martial art for the modern world."`,

    player_integration: {
      displayText: "Trained by Mestre Bimba",
      badge: "⚡ Regional Practitioner",
      auraColor: "#ff6b6b",
      statusMessage: "Your speed is your weapon. Efficiency is your philosophy.",
      skillGain: "1.2x speed-based movements, 1.3x sequence mastery",
    },

    rep_requirements: {
      1: 25,
      2: 75,
      3: 150,
      4: 300,
      5: 500,
    },
  },

  // MESTRE PASTINHA — The Preserver
  {
    id: "mestre_pastinha",
    name: "Mestre Pastinha",
    full_name: "Vicente Ferreira Pastinha",
    years_lived: "1889-1981",
    tier: "founder",
    subtitle: "The Preserver — Founder of Traditional Capoeira Angola",
    historical_role:
      "Established Capoeira Angola as distinct lineage during Bimba's modernization. " +
      "Preserved African traditions and spiritual connection. Defended Angola against extinction.",

    style: "Angola",
    style_characteristics: "Slow, grounded, strategic, spiritual, rhythm-focused, low-game mastery",

    philosophy:
      "Capoeira Angola is the mother of all Capoeiras. Patience defeats aggression. " +
      "Observation defeats ignorance. Capoeira is spiritual practice, not sport.",

    teaching_methodology: {
      approach: "Oral tradition, storytelling, spiritual grounding",
      class_structure: [
        "Ritual opening (connection to ancestors)",
        "Slow ginga practice (grounding)",
        "Ground-level techniques (low game)",
        "Reading-focused games (jogo with awareness)",
      ],
      emphasis: [
        "patience",
        "spiritual_connection",
        "ground_game",
        "reading_opponent",
        "rhythm",
        "ancestral_understanding",
      ],
      tempo: "slow (60-80 BPM Angola tempo)",
    },

    signature_techniques: [
      {
        id: "rolê",
        name: "Rolê",
        meaning: "The Roll",
        description: "Low rolling escape movement. Foundation of Angola ground game.",
      },
      {
        id: "rasteira",
        name: "Rasteira",
        meaning: "Leg Sweep",
        description: "Low-impact takedown. Requires positioning and timing.",
      },
      {
        id: "tesoura",
        name: "Tesoura",
        meaning: "Scissors",
        description: "Leg scissor takedown. Deep ground game understanding required.",
      },
      {
        id: "ginga_baixo",
        name: "Ginga de Angola",
        meaning: "Angola Swing",
        description: "Low, grounded ginga. Closer to earth than Regional.",
      },
    ],

    signature_sequences: [
      {
        id: "pastinha_seq_1",
        name: "Pastinha's Ginga de Angola",
        description: "Slow, meditative Angola ginga with ancestral connection",
        movements: ["ginga_baixo"],
      },
      {
        id: "pastinha_seq_2",
        name: "Pastinha's Reading Game",
        description: "Low-game sparring emphasizing observation over aggression",
        movements: [],  // All movements allowed
      },
    ],

    requirements: [
      {
        label: "Roda Baixa mastery level 3+ (deep Angola grounding)",
        type: "movement",
        movementId: "roda_baixa",
        targetLevel: 3,
        narrative: "Pastinha: 'The low ginga is Angola's soul. Mastery means becoming it.'",
      },
      {
        label: "Mandinga tree level 3+ (spiritual mastery)",
        type: "concept_tree",
        treeId: "mandinga",
        targetLevel: 3,
        narrative: "Pastinha's power is Mandinga. To match him, your spirit must be as deep.",
      },
      {
        label: "Malandragem tree level 2+ (Angola cunning)",
        type: "concept_tree",
        treeId: "malandragem",
        targetLevel: 2,
        narrative: "Pastinha taught street wisdom. Know Angola's tricks and patience.",
      },
      {
        label: "Negativa mastery level 2+ (Angola's escape)",
        type: "movement",
        movementId: "negativa",
        targetLevel: 2,
        narrative: "Negativa is Angola. Master the escape that Pastinha perfected.",
      },
      {
        label: "Complete 10 Angola game video segments (study Pastinha's style)",
        type: "gameplay",
        metric: "angola_segments_studied_10",
        target: 10,
        narrative: "Watch Angola masters. Learn Pastinha's rhythm, timing, patience.",
      },
      {
        label: "10+ hours low-game training (slow, meditative Angola practice)",
        type: "gameplay",
        metric: "angola_training_hours_10",
        target: 10,
        narrative: "Pastinha: 'You must know Angola in your bones. This takes time.'",
      },
    ],

    execution_focus: {
      philosophy: "Patient. Spiritual. Connected. Strategic.",
      movement_style:
        "Slow, deliberate, controlled. Every movement has spiritual significance.",
      tactical_approach: "Observe deeply. Read patterns. Move only when understanding is complete.",

      training_instructions: {
        phase_1_ancestral_meditation: {
          focus: "Ancestral Connection — Slow, meditative ginga",
          steps: [
            "Step 1: Stand in ginga, eyes closed or lowered",
            "Step 2: Feel ancestors beneath you — those who fought, survived, taught",
            "Step 3: Move VERY SLOWLY (40-50 BPM). Each swing is a prayer.",
            "Step 4: Ginga becomes a conversation with the past",
            "Step 5: After 40 repetitions, reflect: What did you feel?",
          ],
          reps: 40,
          tempo: "40-50 BPM (meditative)",
          cue: "Slow. Connected. Ancestral presence.",
          pastinha_teaching:
            "Pastinha says: 'Slow your mind. Listen to those before you. " +
            "They guide every step.'",
        },

        phase_2_ground_game_mastery: {
          focus: "Low-game techniques — Rolê, Rasteira, Tesoura",
          steps: [
            "Step 1: Practice Rolê in slow Angola tempo (60-70 BPM)",
            "Step 2: Focus on control, not speed — stay low, stay grounded",
            "Step 3: Practice Rasteira from grounded position",
            "Step 4: Combine: Ginga → Rolê → Rasteira → back to ginga",
            "Step 5: Repeat until movements are fluid and low",
          ],
          reps: "60 repetitions across all three techniques",
          tempo: "60-80 BPM (Angola tempo)",
          cue: "Low. Grounded. Controlled.",
          pastinha_teaching:
            "Pastinha says: 'The lower you stay, the harder you are to defeat. " +
            "Ground-level mastery is Angola mastery.'",
        },

        phase_3_reading_game: {
          focus: "Peaceful resolution — Reading without aggressive striking",
          steps: [
            "Step 1: In slow Angola sparring, practice READING opponent's movements",
            "Step 2: Anticipate their next move WITHOUT attacking yet",
            "Step 3: Move defensively — escape, dodge, evade",
            "Step 4: Only strike if opponent commits aggression",
            "Step 5: Prioritize UNDERSTANDING over DOMINATION",
          ],
          reps: "5 games, 5 minutes each, at Angola tempo",
          tempo: "60-80 BPM (Angola pace)",
          cue: "Understanding. Balance. Reading.",
          pastinha_teaching:
            "Pastinha says: 'Wisdom is knowing when NOT to fight. " +
            "Peace is stronger than violence.'",
        },
      },
    },

    concept_affinities: {
      malicia: {
        level: "core",
        description: "Pastinha reads through patient observation",
        bonus: "+15% malicia_reading",
      },
      malandragem: {
        level: "secondary",
        description: "Pastinha exploits game knowledge and space",
        bonus: "+10% malandragem_efficiency",
      },
      mandinga: {
        level: "none",
        description: "Pastinha rejects theatrical charm — substance over style",
      },
    },

    stat_bonuses: {
      patience: 20,
      reading_opponent: 15,
      ground_control: 15,
      spiritual_presence: 12,
      malicia_effectiveness: 15,
      stamina_efficiency: 10,
    },

    progression_tiers: [
      {
        name: "Pastinha's Student",
        xpReward: 200,
        requirements: ["Ginga em Baixo level 2+"],
      },
      {
        name: "Pastinha's Guardian",
        xpReward: 300,
        requirements: ["Understand Angola philosophy", "Malícia 1+"],
      },
      {
        name: "Pastinha's Keeper",
        xpReward: 500,
        requirements: [
          "3 patience-based wins",
          "5 reading-focused games",
          "Rolê/Rasteira/Tesoura mastery",
        ],
        unlocked_content: [
          "Angola preservation sequences",
          "Ancestral teaching methods",
          "Sacred games",
        ],
      },
    ],

    reward: {
      xp: 600,
      title: "Angola Guardian",
      description:
        "You understand tradition. You honor ancestors. You know that Capoeira is more than sport. " +
        "You are now a guardian of Angola.",
    },

    victory_text: (playerName) =>
      `Mestre Pastinha sits quietly, eyes closed. When he opens them, they pierce through you. ` +
      `"${playerName}, you have learned patience. This is good. ` +
      `Capoeira is not about speed or acrobatics. It is about understanding. " ` +
      `He stands slowly, moves with deliberate grace. ` +
      `"You are now guardian of Angola. Preserve it. Teach it. Never forget where we come from."`,

    player_integration: {
      displayText: "Student of Mestre Pastinha",
      badge: "🌍 Angola Guardian",
      auraColor: "#22c55e",
      statusMessage: "In the slowness, all truth is revealed.",
      skillGain: "1.2x Angola-style movements, 1.5x reading_opponent",
    },

    rep_requirements: {
      1: 28,
      2: 90,
      3: 180,
      4: 360,
      5: 600,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // TIER 2: SPECIALIST MESTRES (11 more — Summary structure)
  // ═══════════════════════════════════════════════════════════════════════════════════

  // João Grande — Aerial Specialist
  {
    id: "mestre_joao_grande",
    name: "Mestre João Grande",
    full_name: "João Grande",
    years_lived: "1933-2014",
    tier: "specialist",
    subtitle: "Hawk of the Sky — Master of Aerial Inversions",
    historical_role:
      "Legendary student of Pastinha. Master of aerial inversions. Brought Angola to international prominence.",
    style: "Angola (Aerial focus)",
    philosophy:
      "Aerial inversions reveal vulnerability. Mastery of inversion = mastery of fear. " +
      "Movement is meditation.",
    signature_techniques: [
      "parafuso",
      "mortaja",
      "bananeira",
      "ponte",
      "queda_de_rins",
    ],
    concept_affinities: {
      malicia: { level: "secondary", bonus: "+10% reading_from_inversion" },
      mandinga: { level: "secondary", bonus: "+15% aerial_grace" },
    },
    stat_bonuses: {
      aerial_mastery: 20,
      balance: 18,
      fear_mastery: 15,
      meditation: 12,
    },
    rep_requirements: { 1: 30, 2: 100, 3: 200, 4: 400, 5: 665 },
  },

  // João Pequeno — Ground Game Master
  {
    id: "mestre_joao_pequeno",
    name: "Mestre João Pequeno",
    full_name: "João Pequeno (Cobra Mansa)",
    years_lived: "1917-2011",
    tier: "specialist",
    subtitle: "Cobra Mansa — Master of the Low Game",
    historical_role:
      "Senior student of Pastinha. Unparalleled ground game expert. Lived longest of major Mestres.",
    style: "Angola (Ground focus)",
    philosophy:
      "The lower you stay, the harder you are to defeat. Economy of motion. Precision over flashiness.",
    signature_techniques: [
      "tesoura_lateral",
      "varredura",
      "queda_em_pé",
      "ginga_baixo",
      "sapata",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+15% ground_reading" },
      malandragem: { level: "secondary", bonus: "+12% leg_sweep_efficiency" },
    },
    stat_bonuses: {
      ground_mastery: 25,
      leg_techniques: 20,
      economy_of_motion: 15,
      precision: 12,
    },
    rep_requirements: { 1: 32, 2: 110, 3: 220, 4: 440, 5: 730 },
  },

  // Waldemar — Sequencing Master
  {
    id: "mestre_waldemar",
    name: "Mestre Waldemar",
    full_name: "Waldemar (Nativo)",
    years_lived: "1915-1990",
    tier: "specialist",
    subtitle: "Sequencing Master — Creator of the Golden Sequence",
    historical_role:
      "Developed complex sequences in Regional. Created first documented curriculum. Influenced sport Capoeira.",
    style: "Regional (Sequencing focus)",
    philosophy: "Structure creates mastery. Repetition builds excellence. Sequences are the path.",
    signature_techniques: [
      "sequência_do_ouro",
      "martelo",
      "meia_lua_de_frente",
      "pião",
      "escorregão",
    ],
    concept_affinities: {
      malicia: { level: "secondary", bonus: "+10% sequence_reading" },
      mandinga: { level: "secondary", bonus: "+12% sequence_flow" },
    },
    stat_bonuses: {
      sequencing: 25,
      progression_teaching: 18,
      athletic_development: 15,
      complexity_mastery: 12,
    },
    rep_requirements: { 1: 28, 2: 95, 3: 190, 4: 380, 5: 630 },
  },

  // Besouro Mangangá — Legendary Warrior
  {
    id: "mestre_besouro",
    name: "Mestre Besouro Mangangá",
    full_name: "Manuel Henrique Abreu",
    years_lived: "1860-1918",
    tier: "legendary",
    subtitle: "The Legendary Invincible — Symbol of Resistance",
    historical_role:
      "Semi-legendary Capoeira master. Symbolizes Capoeira resistance. Subject of folklore. Spiritual reverence.",
    style: "Angola/Warrior synthesis",
    philosophy:
      "Capoeira is resistance. Movement is spiritual protection. Malícia is psychological warfare.",
    signature_techniques: [
      "cabeçada_de_corá",
      "ginga_invisibilidade",
      "chibata_evasion",
      "malícia_lendária",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+25% legendary_deception" },
      mandinga: { level: "secondary", bonus: "+15% mystical_presence" },
    },
    stat_bonuses: {
      legendary_warrior: 25,
      malicia_mastery: 25,
      spiritual_protection: 20,
      evasion: 18,
      resistance_power: 15,
    },
    rep_requirements: { 1: 35, 2: 125, 3: 250, 4: 500, 5: 830 },
  },

  // Canjiquinha — Rhythm & Ceremony Master
  {
    id: "mestre_canjiquinha",
    name: "Mestre Canjiquinha",
    full_name: "Antônio Conceição",
    years_lived: "1914-1999",
    tier: "specialist",
    subtitle: "Rhythm Master — Keeper of Angola Ceremony",
    historical_role:
      "Student of Pastinha. Brought Angola to Salvador restoration and cultural pride. " +
      "Emphasized rhythm and ritual.",
    style: "Angola (Rhythm & Ceremony focus)",
    philosophy:
      "Rhythm is heartbeat of tradition. Drummers are teachers. Community welfare supersedes achievement.",
    signature_techniques: [
      "rolê_contínuo",
      "negaça",
      "cabeçada_baixo",
      "rabo_de_arraia",
      "armada_baixa",
    ],
    concept_affinities: {
      malicia: { level: "secondary", bonus: "+12% rhythm_reading" },
      malandragem: { level: "secondary", bonus: "+10% community_wisdom" },
    },
    stat_bonuses: {
      rhythm_mastery: 20,
      ceremony: 18,
      drumming_awareness: 15,
      community_power: 12,
    },
    rep_requirements: { 1: 25, 2: 85, 3: 170, 4: 340, 5: 565 },
  },

  // Sombra — Historical Systemizer
  {
    id: "mestre_sombra",
    name: "Mestre Sombra",
    full_name: "Waldeloir Rego",
    years_lived: "1923-2014",
    tier: "specialist",
    subtitle: "Historical Systemizer — Bridge Between Tradition & Academia",
    historical_role:
      "Angola master who studied history extensively. Bridged tradition and modern academia. " +
      "Documented Capoeira evolution.",
    style: "Angola (Historical focus)",
    philosophy:
      "Understanding history enhances practice. Capoeira's effectiveness lies in adaptability. " +
      "Documentation preserves tradition.",
    signature_techniques: [
      "tesoura_cruzada",
      "rolê_com_negaça",
      "banda_tripé",
      "galopante",
      "pé_de_capoeira",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+15% historical_reading" },
      malandragem: { level: "secondary", bonus: "+12% strategic_knowledge" },
    },
    stat_bonuses: {
      historical_knowledge: 25,
      documentation: 20,
      adaptive_mastery: 15,
      theory_practice_balance: 12,
    },
    rep_requirements: { 1: 28, 2: 100, 3: 200, 4: 400, 5: 665 },
  },

  // Traira — Combat Sparring Master
  {
    id: "mestre_traira",
    name: "Mestre Traira",
    full_name: "Manoel Nascimento do Livramento",
    years_lived: "1915-2005",
    tier: "specialist",
    subtitle: "Combat Master — Legendary for Sparring Ability",
    historical_role:
      "Renowned Regional master. Legendary sparring ability. Influenced competitive Capoeira development.",
    style: "Regional (Combat focus)",
    philosophy:
      "Sparring reveals truth. Speed and timing beat power. Adaptability trumps predetermined moves.",
    signature_techniques: [
      "entrada_lateral",
      "queda_de_lado",
      "pontapé",
      "armada_rápida",
      "cintura",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+20% combat_reading" },
      malandragem: { level: "secondary", bonus: "+10% tactical_adaptation" },
    },
    stat_bonuses: {
      sparring_mastery: 25,
      combat_readiness: 20,
      real_time_adaptation: 18,
      efficiency: 15,
    },
    rep_requirements: { 1: 30, 2: 105, 3: 210, 4: 420, 5: 700 },
  },

  // Remo — Acrobatics Pioneer
  {
    id: "mestre_remo",
    name: "Mestre Remo",
    full_name: "Hilário Ferreira",
    years_lived: "1925-2000",
    tier: "specialist",
    subtitle: "Acrobatics Pioneer — Master of Flow",
    historical_role:
      "Pioneered acrobatic sequences in Regional. Elevated Capoeira's visual and athletic dimension.",
    style: "Regional (Acrobatics focus)",
    philosophy:
      "Capoeira as physical poetry. Mastery enables impossible-seeming movements. Continuous flow.",
    signature_techniques: [
      "meia_lua_com_pión",
      "salto",
      "pirueta",
      "sequência_de_flips",
      "transition_mastery",
    ],
    concept_affinities: {
      mandinga: { level: "core", bonus: "+20% acrobatic_grace" },
      malicia: { level: "secondary", bonus: "+10% aerial_reading" },
    },
    stat_bonuses: {
      acrobatic_flow: 25,
      athleticism: 22,
      continuous_transition: 18,
      body_control: 15,
    },
    rep_requirements: { 1: 32, 2: 110, 3: 220, 4: 440, 5: 730 },
  },

  // Gato — Psychological Malícia Master
  {
    id: "mestre_gato",
    name: "Mestre Gato",
    full_name: "Gaston Santos",
    years_lived: "1920-2006",
    tier: "specialist",
    subtitle: "Malícia Master — Master of Psychological Warfare",
    historical_role:
      "Angola specialist. Legendary for psychological gameplay and deception tactics. " +
      "Elevated malícia as strategic tool.",
    style: "Angola (Psychological focus)",
    philosophy:
      "Malícia is ultimate weapon. Victory comes from opponent's confusion. " +
      "Patience rewards observation.",
    signature_techniques: [
      "negaça_múltipla",
      "ginga_deceptiva",
      "armadilha",
      "sapata_enganação",
      "leitura_profunda",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+25% psychological_mastery" },
      malandragem: { level: "secondary", bonus: "+15% game_understanding" },
    },
    stat_bonuses: {
      psychological_mastery: 30,
      deception_depth: 25,
      patience_power: 20,
      opponent_reading: 18,
    },
    rep_requirements: { 1: 35, 2: 125, 3: 250, 4: 500, 5: 830 },
  },

  // Abigail — Gender-Breaking Pioneer
  {
    id: "mestre_abigail",
    name: "Mestre Abigail",
    full_name: "Mestre Abigail",
    years_lived: "1933-2013",
    tier: "specialist",
    subtitle: "Gender-Breaking Pioneer — Technique Over Strength",
    historical_role:
      "First major female Mestre. Broke gender barriers in male-dominated Capoeira. " +
      "Demonstrated technique transcends gender.",
    style: "Angola/Regional synthesis (Technique focus)",
    philosophy:
      "Technique and spirituality transcend gender. Leverage and timing beat strength. " +
      "Community before achievement.",
    signature_techniques: [
      "armada_precisa",
      "ginga_com_centro",
      "tesoura_de_controle",
      "transições_fluidas",
      "defesa_espiritual",
    ],
    concept_affinities: {
      mandinga: { level: "core", bonus: "+20% feminine_grace" },
      malicia: { level: "secondary", bonus: "+15% technical_reading" },
    },
    stat_bonuses: {
      technical_precision: 25,
      leverage_mastery: 20,
      spiritual_defense: 18,
      inclusive_teaching: 15,
    },
    rep_requirements: { 1: 28, 2: 95, 3: 190, 4: 380, 5: 630 },
  },

  // Cobra Mansa — Modern Synthesizer
  {
    id: "mestre_cobra_mansa",
    name: "Mestre Cobra Mansa",
    full_name: "Paulo Campodónico",
    years_lived: "1950-present",
    tier: "modern",
    subtitle: "Hybrid Master — Bridges Regional & Angola",
    historical_role:
      "Modern hybrid master. Bridges Regional athleticism and Angola depth. " +
      "Influential teacher for contemporary Capoeira.",
    style: "Angola/Regional hybrid",
    philosophy:
      "Both traditions are valid. Versatility creates unbeatable practitioners. " +
      "Respect lineages while innovating.",
    signature_techniques: [
      "armada_regional_em_tempo_angola",
      "rolê_com_pión",
      "ginga_híbrida",
      "combinações_versáteis",
      "leitura_dupla",
    ],
    concept_affinities: {
      malicia: { level: "core", bonus: "+18% hybrid_reading" },
      malandragem: { level: "secondary", bonus: "+15% strategic_synthesis" },
      mandinga: { level: "secondary", bonus: "+12% style_blending" },
    },
    stat_bonuses: {
      versatility: 25,
      hybrid_mastery: 20,
      style_synthesis: 18,
      modern_innovation: 12,
    },
    rep_requirements: { 1: 32, 2: 115, 3: 230, 4: 460, 5: 765 },
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // TIER 3: REGIONAL & CONTEMPORARY MESTRES (14 additional)
  // ═══════════════════════════════════════════════════════════════════════════════════

  // MESTRE MORAES
  {
    id: "mestre_moraes",
    name: "Mestre Moraes",
    full_name: "Luiz Renato Vieira Moraes",
    years_lived: "1950-present",
    tier: "regional",
    subtitle: "The Bahian Master — Capoeira Tourism Pioneer",
    style: "Regional/Contemporary",
    philosophy: "Capoeira belongs to the people. Teach globally while honoring roots.",
    teaching_methodology: { approach: "Cultural preservation + accessibility", class_structure: ["History", "Fundamentals", "Performance"], emphasis: ["heritage", "tourism", "global reach"] },
    signature_techniques: [
      { id: "meia_lua_virada", name: "Meia Lua Virada", meaning: "Reverse Wheel", description: "Spinning kick with hip rotation." },
    ],
    requirements: [{ label: "Regional style mastery" }],
    stat_bonuses: { cultural_influence: 20, global_reach: 25 },
    rep_requirements: { 1: 25, 2: 75, 3: 150, 4: 300, 5: 500 },
  },

  // MESTRE ACORDEON
  {
    id: "mestre_acordeon",
    name: "Mestre Acordeon",
    full_name: "Mestre Acordeon",
    years_lived: "1948-2005",
    tier: "regional",
    subtitle: "The Rhythm Master — Berimbau Virtuoso",
    style: "Regional",
    philosophy: "The berimbau speaks. Listen, and your body will respond.",
    teaching_methodology: { approach: "Rhythm-first training", class_structure: ["Rhythm", "Movement", "Integration"], emphasis: ["berimbau", "rhythm", "synchronization"] },
    signature_techniques: [
      { id: "armada_ritmo", name: "Armada com Ritmo", meaning: "Kick with Rhythm", description: "Armada perfectly synchronized to berimbau rhythm." },
    ],
    requirements: [{ label: "Berimbau listening level 2+" }],
    stat_bonuses: { rhythm_mastery: 30, musical_sync: 25 },
    rep_requirements: { 1: 28, 2: 95, 3: 190, 4: 380, 5: 630 },
  },

  // MESTRE GILDO
  {
    id: "mestre_gildo",
    name: "Mestre Gildo",
    full_name: "Gildo Alfinete",
    years_lived: "1931-2005",
    tier: "regional",
    subtitle: "The Finesse Master — Subtle Technique Specialist",
    style: "Angola/Regional Hybrid",
    philosophy: "Big movements are for big bodies. Master the subtle art.",
    teaching_methodology: { approach: "Detail-focused refinement", class_structure: ["Subtle angles", "Precise timing", "Advanced applications"], emphasis: ["finesse", "detail", "subtlety"] },
    signature_techniques: [
      { id: "queixada_sutil", name: "Queixada Sutil", meaning: "Subtle Kick", description: "Small, precise queixada that moves like a whisper." },
    ],
    requirements: [{ label: "Angola mastery level 2+" }],
    stat_bonuses: { finesse: 28, precision: 24 },
    rep_requirements: { 1: 30, 2: 105, 3: 210, 4: 420, 5: 700 },
  },

  // MESTRE DECÂNIO
  {
    id: "mestre_decanio",
    name: "Mestre Decânio",
    full_name: "Decanio dos Santos",
    years_lived: "1927-2005",
    tier: "regional",
    subtitle: "The Capoeira Historian — Living Archive",
    style: "Angola",
    philosophy: "To know where you're going, you must know where you've been.",
    teaching_methodology: { approach: "Historical context first", class_structure: ["History", "Philosophy", "Movement"], emphasis: ["tradition", "history", "understanding"] },
    signature_techniques: [
      { id: "ginga_ancestral", name: "Ginga Ancestral", meaning: "Ancestral Ginga", description: "Ginga performed exactly as ancestors did, preserving authentic rhythm." },
    ],
    requirements: [{ label: "Angola foundation level 2+" }],
    stat_bonuses: { historical_knowledge: 35, authenticity: 26 },
    rep_requirements: { 1: 26, 2: 85, 3: 170, 4: 340, 5: 565 },
  },

  // MESTRE PAULO DOS SANTOS
  {
    id: "mestre_paulo_santos",
    name: "Mestre Paulo dos Santos",
    full_name: "Paulo dos Santos",
    years_lived: "1942-present",
    tier: "contemporary",
    subtitle: "The Modernizer — Contemporary Capoeira Pioneer",
    style: "Contemporary",
    philosophy: "Respect tradition, but embrace evolution. Capoeira lives.",
    teaching_methodology: { approach: "Modern + traditional fusion", class_structure: ["Contemporary basics", "Fusion techniques", "Personal expression"], emphasis: ["innovation", "fusion", "evolution"] },
    signature_techniques: [
      { id: "aerial_ginga", name: "Aerial Ginga", meaning: "Flying Ginga", description: "Ginga integrated with acrobatic elements for dynamic flow." },
    ],
    requirements: [{ label: "Regional mastery level 2+" }],
    stat_bonuses: { innovation: 32, athletic_expression: 28 },
    rep_requirements: { 1: 29, 2: 110, 3: 220, 4: 440, 5: 730 },
  },

  // MESTRE NESTOR CAPOEIRA
  {
    id: "mestre_nestor",
    name: "Mestre Nestor Capoeira",
    full_name: "Nestor Capoeira de Santos",
    years_lived: "1950-present",
    tier: "contemporary",
    subtitle: "The Philosopher — Capoeira as Way of Life",
    style: "Angola",
    philosophy: "Capoeira is not a sport. It is a philosophy, a resistance, a way of being.",
    teaching_methodology: { approach: "Spiritual + martial", class_structure: ["Philosophy", "Movement", "Meditation"], emphasis: ["spirituality", "resistance", "consciousness"] },
    signature_techniques: [
      { id: "meditacao_movimento", name: "Meditação em Movimento", meaning: "Meditation in Movement", description: "Slow, contemplative ginga that becomes moving meditation." },
    ],
    requirements: [{ label: "Angola level 2+", label2: "Spiritual maturity" }],
    stat_bonuses: { spiritual_depth: 30, consciousness: 28 },
    rep_requirements: { 1: 27, 2: 90, 3: 180, 4: 360, 5: 600 },
  },

  // MESTRE GRÃO
  {
    id: "mestre_grao",
    name: "Mestre Grão",
    full_name: "João do Grão",
    years_lived: "1935-2008",
    tier: "regional",
    subtitle: "The Strength Master — Power & Grounding",
    style: "Regional",
    philosophy: "Power without control is chaos. Ground yourself first.",
    teaching_methodology: { approach: "Strength foundation", class_structure: ["Grounding", "Power building", "Control"], emphasis: ["strength", "foundation", "stability"] },
    signature_techniques: [
      { id: "armada_poderosa_grao", name: "Armada Poderosa", meaning: "Powerful Spin", description: "Armada with maximum rotational power and grounded control." },
    ],
    requirements: [{ label: "Regional kicks level 2+" }],
    stat_bonuses: { raw_power: 32, grounding: 26 },
    rep_requirements: { 1: 31, 2: 120, 3: 240, 4: 480, 5: 800 },
  },

  // MESTRE VALMIR
  {
    id: "mestre_valmir",
    name: "Mestre Valmir",
    full_name: "Valmir Assunção",
    years_lived: "1940-present",
    tier: "contemporary",
    subtitle: "The Dancer — Capoeira as Art Form",
    style: "Contemporary",
    philosophy: "Every movement is art. Dance your resistance.",
    teaching_methodology: { approach: "Artistic expression", class_structure: ["Dance basics", "Performance", "Personal style"], emphasis: ["artistry", "expression", "beauty"] },
    signature_techniques: [
      { id: "ginga_danca", name: "Ginga Dança", meaning: "Dance Ginga", description: "Ginga with fluid dance movements, blending capoeira and contemporary dance." },
    ],
    requirements: [{ label: "Movement fluidity level 2+" }],
    stat_bonuses: { artistry: 30, fluidity: 32 },
    rep_requirements: { 1: 28, 2: 100, 3: 200, 4: 400, 5: 665 },
  },

  // MESTRE TONI VARGAS
  {
    id: "mestre_toni_vargas",
    name: "Mestre Toni Vargas",
    full_name: "Antonio Vargas",
    years_lived: "1948-present",
    tier: "contemporary",
    subtitle: "The Global Advocate — International Ambassador",
    style: "Contemporary",
    philosophy: "Capoeira transcends borders. Teach the world.",
    teaching_methodology: { approach: "Global teaching", class_structure: ["Basics", "World application", "Cultural exchange"], emphasis: ["accessibility", "global reach", "cultural exchange"] },
    signature_techniques: [
      { id: "armada_global", name: "Armada Global", meaning: "Worldwide Spin", description: "Armada adapted for teaching across cultures and body types." },
    ],
    requirements: [{ label: "Regional level 2+", label2: "Teaching experience" }],
    stat_bonuses: { global_influence: 28, teaching: 30 },
    rep_requirements: { 1: 27, 2: 92, 3: 185, 4: 370, 5: 615 },
  },

  // MESTRE NENEL
  {
    id: "mestre_nenel",
    name: "Mestre Nenel",
    full_name: "Nenel Silva",
    years_lived: "1938-2008",
    tier: "regional",
    subtitle: "The Traditionalist — Pure Angola Lineage",
    style: "Angola",
    philosophy: "Angola is the truth. Everything else is decoration.",
    teaching_methodology: { approach: "Pure Angola tradition", class_structure: ["Foundation", "Sequences", "Mastery"], emphasis: ["tradition", "purity", "authenticity"] },
    signature_techniques: [
      { id: "ginga_pura", name: "Ginga Pura", meaning: "Pure Ginga", description: "Ginga in its most authentic, undiluted form." },
    ],
    requirements: [{ label: "Angola commitment level 2+" }],
    stat_bonuses: { traditionalism: 34, authenticity: 28 },
    rep_requirements: { 1: 26, 2: 87, 3: 175, 4: 350, 5: 580 },
  },

  // MESTRE SÉRGIO
  {
    id: "mestre_sergio",
    name: "Mestre Sérgio",
    full_name: "Sérgio Oliveira",
    years_lived: "1952-present",
    tier: "contemporary",
    subtitle: "The Hybrid Master — East meets West",
    style: "Capoeira/Martial Arts Fusion",
    philosophy: "All martial arts are one. Learn from all, master your own.",
    teaching_methodology: { approach: "Martial arts synthesis", class_structure: ["Capoeira foundation", "Cross-training", "Integration"], emphasis: ["fusion", "martial mastery", "synthesis"] },
    signature_techniques: [
      { id: "capoeira_kung_fu", name: "Capoeira + Kung Fu", meaning: "Fusion Kick", description: "Capoeira kick with kung fu footwork efficiency." },
    ],
    requirements: [{ label: "Regional mastery level 2+", label2: "Martial arts foundation" }],
    stat_bonuses: { martial_synthesis: 30, combat_efficiency: 28 },
    rep_requirements: { 1: 30, 2: 108, 3: 215, 4: 430, 5: 715 },
  },

  // MESTRE COBRA MANSA (Extended)
  {
    id: "mestre_cobra_additional",
    name: "Mestre Cobra (Contemporary Line)",
    full_name: "Contemporary Cobra Lineage",
    years_lived: "1990-present",
    tier: "contemporary",
    subtitle: "The Modern Guardian — Digital Age Capoeira",
    style: "Contemporary",
    philosophy: "Preserve tradition through modern means. Social media is the new roda.",
    teaching_methodology: { approach: "Digital + in-person", class_structure: ["Online foundation", "In-person refinement", "Global community"], emphasis: ["digital teaching", "accessibility", "community"] },
    signature_techniques: [
      { id: "armada_viral", name: "Armada Viral", meaning: "Trending Spin", description: "Armada optimized for video performance and digital teaching." },
    ],
    requirements: [{ label: "Contemporary level 2+", label2: "Digital literacy" }],
    stat_bonuses: { digital_influence: 32, accessibility: 26 },
    rep_requirements: { 1: 28, 2: 105, 3: 210, 4: 420, 5: 700 },
  },

  // MESTRE AMÂNCIO
  {
    id: "mestre_amancio",
    name: "Mestre Amâncio",
    full_name: "Amâncio Miranda Filho",
    years_lived: "1936-2005",
    tier: "regional",
    subtitle: "The Capoeira Researcher — Movement Scientist",
    style: "Angola/Regional Hybrid",
    philosophy: "Understand the mechanics, and you understand the spirit.",
    teaching_methodology: { approach: "Biomechanics + tradition", class_structure: ["Movement analysis", "Historical research", "Technical mastery"], emphasis: ["research", "biomechanics", "understanding"] },
    signature_techniques: [
      { id: "queixada_scientific", name: "Queixada Analítica", meaning: "Analytical Kick", description: "Queixada deconstructed to teach optimal biomechanics." },
    ],
    requirements: [{ label: "Movement understanding level 2+" }],
    stat_bonuses: { technical_knowledge: 32, biomechanical_mastery: 28 },
    rep_requirements: { 1: 29, 2: 112, 3: 225, 4: 450, 5: 750 },
  },

  // MESTRE SANTO
  {
    id: "mestre_santo",
    name: "Mestre Santo",
    full_name: "Santo Alves de Santana",
    years_lived: "1934-2009",
    tier: "regional",
    subtitle: "The Spiritual Guide — Capoeira as Orixá Path",
    style: "Angola",
    philosophy: "Every movement is a prayer. Every game is a ceremony.",
    teaching_methodology: { approach: "Spiritual + martial", class_structure: ["Orixá introduction", "Spiritual ginga", "Ceremonial practice"], emphasis: ["spirituality", "orixas", "ceremony"] },
    signature_techniques: [
      { id: "ginga_espiritual", name: "Ginga Espiritual", meaning: "Spiritual Ginga", description: "Ginga performed as a spiritual ceremony honoring the orixás." },
    ],
    requirements: [{ label: "Spiritual readiness level 2+" }],
    stat_bonuses: { spiritual_mastery: 36, ceremonial_knowledge: 26 },
    rep_requirements: { 1: 25, 2: 82, 3: 165, 4: 330, 5: 550 },
  },

  // NEWLY SEQUENCED MESTRES (Added in BATCH 6)
  // Angola Lineage
  {
    id: "mestre_caiçara",
    name: "Mestre Caiçara",
    full_name: "Caiçara da Silva",
    years_lived: "1920-1985",
    tier: "master",
    subtitle: "Deep Angola Keeper",
    style: "Angola",
    philosophy: "The roda speaks to those who listen with their feet.",
    teaching_methodology: { approach: "Traditional Angola", class_structure: ["Low game mastery", "Malícia training", "Rhythm synchronization"], emphasis: ["tradition", "low game", "reading"] },
    signature_techniques: [{ id: "roda_baixa", name: "Roda Baixa", meaning: "Low Game", description: "The foundational low-game technique of Angola." }],
    requirements: [{ label: "Rolê mastery 3+" }],
    stat_bonuses: { malicia: 30, tradition: 28 },
    rep_requirements: { 1: 30, 2: 100, 3: 220, 4: 480, 5: 850 },
    victory_text: "The depths of Angola reveal themselves. You have learned patience and presence.",
  },
  {
    id: "mestre_gato_preto",
    name: "Mestre Gato Preto",
    full_name: "Gato Preto de Mangueira",
    years_lived: "1918-1995",
    tier: "master",
    subtitle: "The Deceptive Master",
    style: "Angola",
    philosophy: "The eye that looks is the eye that falls.",
    teaching_methodology: { approach: "Deception & reading", class_structure: ["Body reading", "Feints and tricks", "Escape mastery"], emphasis: ["malicia", "reading", "deception"] },
    signature_techniques: [{ id: "falseio_de_corpo", name: "Falseio de Corpo", meaning: "Body Feint", description: "Deceiving through body movement." }],
    requirements: [{ label: "Negativa mastery 3+" }],
    stat_bonuses: { deception: 32, reading: 30 },
    rep_requirements: { 1: 28, 2: 95, 3: 210, 4: 460, 5: 800 },
    victory_text: "Your deception becomes clarity. The opponent reads your truth.",
  },
  {
    id: "mestre_cobra_mansa",
    name: "Mestre Cobra Mansa",
    full_name: "Cobra Mansa dos Santos",
    years_lived: "1922-1998",
    tier: "master",
    subtitle: "The Patient Artist",
    style: "Angola",
    philosophy: "Patience is the serpent's greatest teacher.",
    teaching_methodology: { approach: "Artistic flow", class_structure: ["Meditation through ginga", "Artistic expression", "Flow state"], emphasis: ["flow", "art", "patience"] },
    signature_techniques: [{ id: "danca_e_luta", name: "Dança e Luta", meaning: "Dance and Fight", description: "Movement that blurs the line between dance and combat." }],
    requirements: [{ label: "Ginga mastery 3+" }],
    stat_bonuses: { flow: 32, artistry: 30 },
    rep_requirements: { 1: 25, 2: 85, 3: 185, 4: 410, 5: 720 },
    victory_text: "Your patience becomes poetry. The roda flows through your body.",
  },
  {
    id: "mestre_nenel",
    name: "Mestre Nenel",
    full_name: "Nenel Amado",
    years_lived: "1925-2002",
    tier: "master",
    subtitle: "The Teaching Master",
    style: "Angola",
    philosophy: "Teaching is the highest form of understanding.",
    teaching_methodology: { approach: "Pedagogical Angola", class_structure: ["Structured progression", "Student mentoring", "Deep Angola"], emphasis: ["teaching", "tradition", "mentorship"] },
    signature_techniques: [{ id: "ritmo_do_coracao", name: "Ritmo do Coração", meaning: "Rhythm of the Heart", description: "Movement synchronized with the heartbeat of Capoeira." }],
    requirements: [{ label: "Rolê mastery 3+" }],
    stat_bonuses: { teaching: 34, tradition: 28 },
    rep_requirements: { 1: 26, 2: 88, 3: 195, 4: 430, 5: 760 },
    victory_text: "You understand teaching through the roda. Your students will learn from your hands.",
  },
  {
    id: "mestre_santo_amaro",
    name: "Mestre Santo Amaro",
    full_name: "Santo Amaro da Purificação",
    years_lived: "1920-1990",
    tier: "master",
    subtitle: "The Spiritual Warrior",
    style: "Angola",
    philosophy: "Every kick is a prayer to the ancestors.",
    teaching_methodology: { approach: "Spiritual Angola", class_structure: ["Orixá knowledge", "Spiritual ginga", "Warrior spirit"], emphasis: ["spirituality", "strength", "heritage"] },
    signature_techniques: [{ id: "queda_de_rins", name: "Queda de Rins", meaning: "Kidney Drop", description: "A devastating Angola takedown." }],
    requirements: [{ label: "Queda de Rins mastery 3+" }],
    stat_bonuses: { spirituality: 32, strength: 30 },
    rep_requirements: { 1: 30, 2: 105, 3: 235, 4: 520, 5: 920 },
    victory_text: "The ancestors flow through your movements. You are their instrument.",
  },
  {
    id: "mestre_nô",
    name: "Mestre Nô",
    full_name: "Nô das Águas",
    years_lived: "1919-1992",
    tier: "master",
    subtitle: "The Patient Strategist",
    style: "Angola",
    philosophy: "The quiet mind reads all moves.",
    teaching_methodology: { approach: "Strategic reading", class_structure: ["Game analysis", "Patient play", "Deep strategy"], emphasis: ["strategy", "reading", "patience"] },
    signature_techniques: [{ id: "olho_para_olho", name: "Olho para Olho", meaning: "Eye to Eye", description: "Direct confrontation through gaze and presence." }],
    requirements: [{ label: "Negativa mastery 3+" }],
    stat_bonuses: { strategy: 32, reading: 30 },
    rep_requirements: { 1: 27, 2: 92, 3: 205, 4: 450, 5: 790 },
    victory_text: "Your patience has become strength. You read the game perfectly.",
  },

  // Regional Lineage
  {
    id: "mestre_gildo",
    name: "Mestre Gildo",
    full_name: "Gildo dos Santos",
    years_lived: "1928-2005",
    tier: "master",
    subtitle: "The Relentless Striker",
    style: "Regional",
    philosophy: "Speed and power overcome hesitation.",
    teaching_methodology: { approach: "Aggressive Regional", class_structure: ["Fast combinations", "Power kicks", "Speed training"], emphasis: ["speed", "power", "combinations"] },
    signature_techniques: [{ id: "chapa", name: "Chapa", meaning: "Slap Kick", description: "Fast, direct kicks that dominate the game." }],
    requirements: [{ label: "Chapa mastery 3+" }],
    stat_bonuses: { speed: 32, power: 30 },
    rep_requirements: { 1: 28, 2: 95, 3: 210, 4: 460, 5: 800 },
    victory_text: "Your strikes are unstoppable. The Regional path flows through your feet.",
  },
  {
    id: "mestre_grao",
    name: "Mestre Grão",
    full_name: "Mestre Grão Silva",
    years_lived: "1925-2001",
    tier: "master",
    subtitle: "The Tactical Master",
    style: "Regional",
    philosophy: "Intelligence beats force.",
    teaching_methodology: { approach: "Tactical Regional", class_structure: ["Strategic play", "Combination theory", "Game reading"], emphasis: ["tactics", "combinations", "strategy"] },
    signature_techniques: [{ id: "armada_global", name: "Armada Global", meaning: "Complete Armada", description: "Mastery of all armada variations." }],
    requirements: [{ label: "Armada mastery 3+" }],
    stat_bonuses: { tactics: 32, strategy: 30 },
    rep_requirements: { 1: 29, 2: 100, 3: 225, 4: 480, 5: 850 },
    victory_text: "Tactics and speed are now inseparable in your game. Regional mastery is yours.",
  },
  {
    id: "mestre_papai",
    name: "Mestre Papai",
    full_name: "Papai do Regional",
    years_lived: "1930-2002",
    tier: "master",
    subtitle: "The Fast Master",
    style: "Regional",
    philosophy: "The fastest kick is the one the opponent never sees.",
    teaching_methodology: { approach: "Speed-focused Regional", class_structure: ["Rapid-fire combinations", "Quick transitions", "Velocity training"], emphasis: ["speed", "flow", "transitions"] },
    signature_techniques: [{ id: "deslocamento_rapido", name: "Deslocamento Rápido", meaning: "Fast Movement", description: "Rapid repositioning in the roda." }],
    requirements: [{ label: "Chapa mastery 2+" }],
    stat_bonuses: { speed: 34, flow: 28 },
    rep_requirements: { 1: 25, 2: 82, 3: 180, 4: 390, 5: 680 },
    victory_text: "Your speed is now your greatest weapon. You move like lightning.",
  },
  {
    id: "mestre_brasilia_ferrez",
    name: "Mestre Brasília Ferrez",
    full_name: "Brasília Ferrez",
    years_lived: "1922-1993",
    tier: "master",
    subtitle: "The Regional Pioneer",
    style: "Regional",
    philosophy: "Regional Capoeira is the modern path forward.",
    teaching_methodology: { approach: "Pioneer Regional", class_structure: ["Systematic techniques", "Numbered sequences", "Modern training"], emphasis: ["systematization", "power", "efficiency"] },
    signature_techniques: [{ id: "sequencia_regional", name: "Sequência Regional", meaning: "Regional Sequence", description: "Systematic regional combinations." }],
    requirements: [{ label: "Martelo mastery 3+" }],
    stat_bonuses: { power: 32, efficiency: 30 },
    rep_requirements: { 1: 30, 2: 105, 3: 235, 4: 520, 5: 920 },
    victory_text: "The Regional revolution is complete in your technique. You have transcended the form.",
  },
  {
    id: "mestre_talo",
    name: "Mestre Talo",
    full_name: "Talo da Silva",
    years_lived: "1927-2000",
    tier: "master",
    subtitle: "The Bridge Builder",
    style: "Regional/Angola",
    philosophy: "Angola and Regional are one roda, one spirit.",
    teaching_methodology: { approach: "Hybrid synthesis", class_structure: ["Angola + Regional", "Bridge techniques", "Unified philosophy"], emphasis: ["integration", "balance", "synthesis"] },
    signature_techniques: [{ id: "saida_regional", name: "Saída Regional", meaning: "Regional Exit", description: "Smooth transitions between Angola and Regional." }],
    requirements: [{ label: "Ginga mastery 3+" }],
    stat_bonuses: { versatility: 32, synthesis: 30 },
    rep_requirements: { 1: 27, 2: 92, 3: 205, 4: 450, 5: 790 },
    victory_text: "You have bridged Angola and Regional. Your synthesis is complete.",
  },
  {
    id: "mestre_bom_jesus",
    name: "Mestre Bom Jesus",
    full_name: "Bom Jesus de Santana",
    years_lived: "1920-1995",
    tier: "master",
    subtitle: "The Powerful Traditionalist",
    style: "Angola/Regional",
    philosophy: "Power rooted in tradition is unstoppable.",
    teaching_methodology: { approach: "Traditional power", class_structure: ["Strong Angola", "Powerful kicks", "Grounded technique"], emphasis: ["power", "tradition", "strength"] },
    signature_techniques: [{ id: "meia_lua_de_compasso", name: "Meia Lua de Compasso", meaning: "Compass Half-Moon", description: "A powerful, traditional kick." }],
    requirements: [{ label: "Meia Lua mastery 3+" }],
    stat_bonuses: { power: 34, tradition: 28 },
    rep_requirements: { 1: 32, 2: 112, 3: 250, 4: 550, 5: 980 },
    victory_text: "Your power flows from the earth itself. Traditional strength is your birthright.",
  },

  // Contemporary Lineage
  {
    id: "mestre_polêmica",
    name: "Mestre Polêmica",
    full_name: "Polêmica da Silva",
    years_lived: "1945-present",
    tier: "master",
    subtitle: "Contemporary Virtuoso",
    style: "Contemporary",
    philosophy: "Capoeira is freedom of expression.",
    teaching_methodology: { approach: "Contemporary flow", class_structure: ["Aerial mastery", "Freestyle expression", "Modern fusion"], emphasis: ["freedom", "innovation", "flow"] },
    signature_techniques: [{ id: "au_fechado", name: "Au Fechado", meaning: "Closed Cartwheel", description: "Advanced aerial technique." }],
    requirements: [{ label: "Au Fechado mastery 3+" }],
    stat_bonuses: { freedom: 32, innovation: 30 },
    rep_requirements: { 1: 28, 2: 95, 3: 210, 4: 460, 5: 800 },
    victory_text: "Your freedom in the roda is complete. Contemporary mastery flows through you.",
  },
  {
    id: "mestre_zulu",
    name: "Mestre Zulu",
    full_name: "Zulu da Silva",
    years_lived: "1948-present",
    tier: "master",
    subtitle: "The Aerial Pioneer",
    style: "Contemporary",
    philosophy: "The sky is the limit only if you believe it.",
    teaching_methodology: { approach: "Aerial innovation", class_structure: ["Inversions", "Aerial sequences", "Modern acrobatics"], emphasis: ["innovation", "aerials", "athleticism"] },
    signature_techniques: [{ id: "flying_kick", name: "Flying Kick", meaning: "Aerial Kick", description: "Revolutionary aerial kick technique." }],
    requirements: [{ label: "Au Fechado mastery 3+" }],
    stat_bonuses: { innovation: 32, athleticism: 30 },
    rep_requirements: { 1: 30, 2: 105, 3: 235, 4: 520, 5: 920 },
    victory_text: "You have conquered the sky. Aerial mastery is now your domain.",
  },
  {
    id: "mestre_amen",
    name: "Mestre Amen",
    full_name: "Amen da Silva",
    years_lived: "1950-present",
    tier: "master",
    subtitle: "The Freedom Seeker",
    style: "Contemporary",
    philosophy: "Every movement is a prayer for freedom.",
    teaching_methodology: { approach: "Freestyle liberation", class_structure: ["Freestyle creation", "Personal expression", "Spiritual freedom"], emphasis: ["freedom", "creativity", "spirituality"] },
    signature_techniques: [{ id: "liberdade_no_jogo", name: "Liberdade no Jogo", meaning: "Freedom in Play", description: "Complete freedom of expression in the roda." }],
    requirements: [{ label: "Freestyle mastery 2+" }],
    stat_bonuses: { freedom: 34, creativity: 28 },
    rep_requirements: { 1: 25, 2: 82, 3: 180, 4: 390, 5: 680 },
    victory_text: "Freedom is now your truth. Your expression is unstoppable.",
  },
  {
    id: "mestre_david_moura",
    name: "Mestre David Moura",
    full_name: "David Moura",
    years_lived: "1940-present",
    tier: "master",
    subtitle: "The Contemporarian",
    style: "Contemporary",
    philosophy: "Evolution is the only constant in Capoeira.",
    teaching_methodology: { approach: "Evolutionary contemporary", class_structure: ["Modern technique", "Fusion styles", "Future vision"], emphasis: ["evolution", "fusion", "innovation"] },
    signature_techniques: [{ id: "sequencia_ofensiva", name: "Sequência Ofensiva", meaning: "Offensive Sequence", description: "Modern offensive combinations." }],
    requirements: [{ label: "Au Fechado mastery 3+" }],
    stat_bonuses: { innovation: 32, evolution: 30 },
    rep_requirements: { 1: 29, 2: 100, 3: 225, 4: 480, 5: 850 },
    victory_text: "You have evolved beyond tradition. Contemporary mastery is your evolution.",
  },
  {
    id: "mestre_pe_de_bananeira",
    name: "Mestre Pé de Bananeira",
    full_name: "Pé de Bananeira Silva",
    years_lived: "1935-2010",
    tier: "master",
    subtitle: "The Aerial Innovator",
    style: "Contemporary",
    philosophy: "Inversions are the gateway to transcendence.",
    teaching_methodology: { approach: "Inversion mastery", class_structure: ["Bananeira technique", "Handstand balance", "Aerial control"], emphasis: ["inversions", "balance", "control"] },
    signature_techniques: [{ id: "bananeira_wall", name: "Bananeira Wall", meaning: "Wall Bananeira", description: "Advanced wall-assisted inversion." }],
    requirements: [{ label: "Bananeira Wall mastery 3+" }],
    stat_bonuses: { balance: 32, control: 30 },
    rep_requirements: { 1: 28, 2: 95, 3: 210, 4: 460, 5: 800 },
    victory_text: "You have transcended gravity. Inversion mastery flows through your body.",
  },

  // Historical/Hybrid Mestres
  {
    id: "mestre_acordeon",
    name: "Mestre Acordeon",
    full_name: "Acordeon da Silva",
    years_lived: "1924-2000",
    tier: "master",
    subtitle: "The Musical Master",
    style: "Angola",
    philosophy: "The berimbau speaks the language of Capoeira.",
    teaching_methodology: { approach: "Musical rhythm", class_structure: ["Berimbau mastery", "Rhythm training", "Musical meditation"], emphasis: ["rhythm", "music", "harmony"] },
    signature_techniques: [{ id: "ritmo_sincronia", name: "Ritmo Sincronizado", meaning: "Synchronized Rhythm", description: "Movement perfectly synchronized with music." }],
    requirements: [{ label: "Rhythm mastery 2+" }],
    stat_bonuses: { rhythm: 34, harmony: 28 },
    rep_requirements: { 1: 25, 2: 82, 3: 180, 4: 390, 5: 680 },
    victory_text: "The berimbau sings through your movements. Musical mastery is yours.",
  },
  {
    id: "mestre_canjiquinha",
    name: "Mestre Canjiquinha",
    full_name: "Canjiquinha de Mangueira",
    years_lived: "1910-1999",
    tier: "master",
    subtitle: "The Mangueira Legend",
    style: "Angola",
    philosophy: "Mangueira is in the blood of Angola.",
    teaching_methodology: { approach: "Mangueira tradition", class_structure: ["Mangueira lineage", "Angola foundation", "Historical preservation"], emphasis: ["heritage", "tradition", "authenticity"] },
    signature_techniques: [{ id: "mangueira_ginga", name: "Ginga de Mangueira", meaning: "Mangueira Ginga", description: "The distinctive Mangueira ginga style." }],
    requirements: [{ label: "Rasteira mastery 3+" }],
    stat_bonuses: { heritage: 34, tradition: 28 },
    rep_requirements: { 1: 30, 2: 105, 3: 235, 4: 520, 5: 920 },
    victory_text: "You carry Mangueira's legacy forward. Heritage flows through your technique.",
  },
  {
    id: "mestre_moa_cartorio",
    name: "Mestre Moa do Cartório",
    full_name: "Moa do Cartório",
    years_lived: "1920-2005",
    tier: "master",
    subtitle: "The Wise Keeper",
    style: "Angola",
    philosophy: "Knowledge is preserved through the roda.",
    teaching_methodology: { approach: "Keeper of knowledge", class_structure: ["Historical Angola", "Deep wisdom", "Oral tradition"], emphasis: ["wisdom", "history", "knowledge"] },
    signature_techniques: [{ id: "cocorinha", name: "Cocorinha", meaning: "Squat", description: "The foundational Angola squat." }],
    requirements: [{ label: "Cocorinha mastery 3+" }],
    stat_bonuses: { wisdom: 34, knowledge: 28 },
    rep_requirements: { 1: 26, 2: 88, 3: 195, 4: 430, 5: 760 },
    victory_text: "You are now a keeper of wisdom. The ancestors acknowledge you.",
  },
  {
    id: "mestre_moraes",
    name: "Mestre Moraes",
    full_name: "Moraes Silva",
    years_lived: "1918-2003",
    tier: "master",
    subtitle: "The Defender",
    style: "Angola",
    philosophy: "The best offense is knowing when not to attack.",
    teaching_methodology: { approach: "Defensive mastery", class_structure: ["Defense techniques", "Escape mastery", "Strategic retreat"], emphasis: ["defense", "wisdom", "strategy"] },
    signature_techniques: [{ id: "esquiva_completa", name: "Esquiva Completa", meaning: "Complete Dodge", description: "Comprehensive dodging technique." }],
    requirements: [{ label: "Esquiva Baixa mastery 3+" }],
    stat_bonuses: { defense: 32, wisdom: 30 },
    rep_requirements: { 1: 27, 2: 92, 3: 205, 4: 450, 5: 790 },
    victory_text: "Your defense is now impenetrable. You understand the art of survival.",
  },
  {
    id: "mestre_sinha",
    name: "Mestre Sinha",
    full_name: "Sinha de Mangueira",
    years_lived: "1925-2002",
    tier: "master",
    subtitle: "The Lion Heart",
    style: "Angola/Regional",
    philosophy: "Courage comes from the heart, not the muscles.",
    teaching_methodology: { approach: "Courageous spirit", class_structure: ["Power with heart", "Brave technique", "Spiritual strength"], emphasis: ["courage", "power", "spirit"] },
    signature_techniques: [{ id: "queixada_poderosa", name: "Queixada Poderosa", meaning: "Powerful Kick", description: "A kick backed by pure heart." }],
    requirements: [{ label: "Queixada mastery 3+" }],
    stat_bonuses: { courage: 32, power: 30 },
    rep_requirements: { 1: 30, 2: 105, 3: 235, 4: 520, 5: 920 },
    victory_text: "Your heart roars like a lion. Courage is now your strength.",
  },
  {
    id: "mestre_suassuna",
    name: "Mestre Suassuna",
    full_name: "Suassuna da Silva",
    years_lived: "1935-2008",
    tier: "master",
    subtitle: "The Capoeira Poet",
    style: "Angola",
    philosophy: "Capoeira is poetry written by the body.",
    teaching_methodology: { approach: "Artistic Angola", class_structure: ["Movement as art", "Musical expression", "Poetic ginga"], emphasis: ["artistry", "poetry", "expression"] },
    signature_techniques: [{ id: "ginga_poetica", name: "Ginga Poética", meaning: "Poetic Ginga", description: "Ginga as artistic expression." }],
    requirements: [{ label: "Ginga mastery 3+" }],
    stat_bonuses: { artistry: 34, poetry: 28 },
    rep_requirements: { 1: 26, 2: 88, 3: 195, 4: 430, 5: 760 },
    victory_text: "Your body speaks poetry. The world now understands your art.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

const MESTRE_PROGRESSION_ORDER = [
  "mestre_cobra_additional",
  "mestre_paulo_santos",
  "mestre_sergio",
  "mestre_valmir",
  "mestre_toni_vargas",
  "mestre_pe_de_bananeira",
  "mestre_david_moura",
  "mestre_amen",
  "mestre_zulu",
  "mestre_polêmica",
  "mestre_papai",
  "mestre_talo",
  "mestre_brasilia_ferrez",
  "mestre_grao",
  "mestre_gildo",
  "mestre_acordeon",
  "mestre_nestor",
  "mestre_moraes",
  "mestre_decanio",
  "mestre_santo",
  "mestre_amancio",
  "mestre_sinha",
  "mestre_suassuna",
  "mestre_bom_jesus",
  "mestre_santo_amaro",
  "mestre_gato_preto",
  "mestre_caiçara",
  "mestre_nô",
  "mestre_moa_cartorio",
  "mestre_abigail",
  "mestre_remo",
  "mestre_traira",
  "mestre_sombra",
  "mestre_gato",
  "mestre_canjiquinha",
  "mestre_joao_pequeno",
  "mestre_joao_grande",
  "mestre_cobra_mansa",
  "mestre_nenel",
  "mestre_waldemar",
  "mestre_besouro",
  "mestre_pastinha",
  "mestre_bimba",
];

const MESTRE_PROGRESSION_RANKS = new Map(
  MESTRE_PROGRESSION_ORDER.map((id, index) => [id, index + 1])
);

function buildHistoricalContext(mestre) {
  const role = mestre.historical_context || mestre.historicalContext || mestre.historical_role;
  if (role && String(role).trim()) return role;

  const name = mestre.full_name || mestre.name || "This Mestre";
  const years = mestre.years_lived ? ` (${mestre.years_lived})` : "";
  const style = mestre.style || "Capoeira";
  const subtitle = mestre.subtitle ? `${mestre.subtitle}. ` : "";
  const approach = mestre.teaching_methodology?.approach
    ? `Their teaching approach centers on ${mestre.teaching_methodology.approach}. `
    : "";
  const philosophy = mestre.philosophy ? `Philosophy: "${mestre.philosophy}"` : "";

  return `${subtitle}${name}${years} is represented here as a ${style} lineage figure whose training path preserves a distinct Capoeira method. ${approach}${philosophy}`.trim();
}

export function normalizeMestre(mestre) {
  if (!mestre) return null;
  const requirements = Array.isArray(mestre.requirements) && mestre.requirements.length > 0
    ? mestre.requirements
    : [
      { label: `${mestre.style || "Capoeira"} foundation practice 3+ sessions` },
      { label: `${mestre.name || "Mestre"} signature sequence study` },
      { label: "Roda application with clean entry, response, and exit" },
    ];
  return {
    ...mestre,
    full_name: mestre.full_name || mestre.name,
    years_lived: mestre.years_lived || "dates unknown",
    style: mestre.style || "Capoeira",
    historical_role: mestre.historical_role || buildHistoricalContext(mestre),
    historical_context: buildHistoricalContext(mestre),
    teaching_methodology: mestre.teaching_methodology || {
      approach: "Lineage-based practice",
      class_structure: ["Foundation", "Sequence", "Roda application"],
      emphasis: ["movement", "music", "malicia"],
      tempo: "adaptive",
    },
    signature_techniques: mestre.signature_techniques || [],
    requirements,
  };
}

export function getMestreById(id) {
  return normalizeMestre(MESTRES.find((m) => m.id === id));
}

function uniqueMestres(list) {
  const seen = new Set();
  return list.filter((mestre) => {
    if (!mestre?.id || seen.has(mestre.id)) return false;
    seen.add(mestre.id);
    return true;
  });
}

export function getMestresByTier(tier) {
  return uniqueMestres(MESTRES.filter((m) => m.tier === tier)).map(normalizeMestre);
}

export function getMestresByStyle(style) {
  return uniqueMestres(MESTRES.filter((m) => m.style?.includes(style))).map(normalizeMestre);
}

export function getStyleFounders() {
  return uniqueMestres(MESTRES.filter((m) => m.tier === "founder")).map(normalizeMestre);
}

export function getAllMestres() {
  return uniqueMestres(MESTRES).map(normalizeMestre);
}

export function getMestreProgressionRank(mestreId) {
  return MESTRE_PROGRESSION_RANKS.get(mestreId) || Number.MAX_SAFE_INTEGER;
}

export function getMestresByProgression() {
  return getAllMestres()
    .map((mestre) => ({
      ...mestre,
      progressionRank: getMestreProgressionRank(mestre.id),
    }))
    .sort((a, b) => a.progressionRank - b.progressionRank || a.name.localeCompare(b.name));
}

export function getMestreCount() {
  return uniqueMestres(MESTRES).length;
}
