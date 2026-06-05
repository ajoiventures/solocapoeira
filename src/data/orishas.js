// ═══════════════════════════════════════════════════════════════════════════════════
// ORISHAS.JS — Complete 16 Orishas + Ehi Spiritual System
// Solo Leveling Capoeira Training App
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * SPIRITUAL FRAMEWORK:
 *
 * TIER 0 (Supreme): Olorun (Creator — represented as source, not direct encounter)
 * TIER 1 (Paramount): Obatala, Yemaya, Shango, Ogun
 * TIER 2 (Major): Oshun, Oya, Elegba, Ifa/Orumila
 * TIER 3 (Important): Babaluaye, Ibeji, Aje, Oshosi, Nana Buruku, Erinle, Oba
 * TIER 4 (Transcendence): Ehi (Emerges when all 16 integrated into Ogun core)
 *
 * PROGRESSION MODEL:
 * 1. Master Ogun (Core identity — always present)
 * 2. Integrate each of the 16 Orishas (defeat/train with each)
 * 3. All 16 flow through your Ogun foundation
 * 4. Ehi awakens: You become your eternal spirit containing all 16
 * 5. Prestige: Ehi Trials test integrated mastery across all dimensions
 */

export const ORISHAS = [
  // ═══════════════════════════════════════════════════════════════════════════════════
  // TIER 1: PARAMOUNT ORISHAS
  // ═══════════════════════════════════════════════════════════════════════════════════

  // OGUN — The Warrior, Master of Boundaries & Iron Will
  {
    id: "orisha_ogun",
    name: "Ogun",
    tier: "core",  // Ogun is your permanent core
    subtitle: "The Warrior, Master of Boundaries",
    spiritualDomain: "Iron, war, strength, obstacles, labor, innovation, boundaries",

    capoeiraDimension: "Warrior spirit, grounded power, direct strikes, Angola dominance",

    spiritualLesson:
      "The Lesson of Sacred Boundaries: " +
      "Strength comes through struggle. Set clear limits. Know when to fight, when to retreat. " +
      "Your iron will clears obstacles. Your boundaries protect the sacred.",

    historicalContext:
      "Ogun is the first Orisha to work iron. He clears paths. He protects warriors. " +
      "In Capoeira, Ogun represents enslaved Africans who refused to break, who fought for freedom.",

    colors: ["#2d5016", "#8B0000"],  // Dark green and dark red
    symbols: ["iron", "machete", "boundary", "warrior spirit"],
    sacred_number: 7,
    sacred_day: "Tuesday",
    sacred_objects: ["iron tools", "root vegetables", "rum"],

    // Ogun's signature techniques
    signature_techniques: [
      "ginga_baixo_ogun",
      "queixada_forte",
      "rasteira_ogun",
      "armada_poderosa",
    ],

    // Core Ogun requirement (always gated for new players)
    requirements: [
      {
        label: "Ginga em Baixo mastery level 2+",
        type: "movement",
        movementId: "ginga_baixo",
        targetLevel: 2,
        narrative: "Ogun: 'Ground yourself. Your foundation must be solid.'",
      },
      {
        label: "Win 5 games in low Angola position",
        type: "gameplay",
        metric: "angola_low_game_wins",
        target: 5,
        narrative: "Ogun: 'Show me your warrior strength. Prove you can overcome.',",
      },
      {
        label: "Malícia tree level 1+",
        type: "concept_tree",
        treeId: "malicia",
        targetLevel: 1,
        narrative: "Ogun: 'Read your opponent. Boundaries require understanding.'",
      },
    ],

    // OGUN'S EXECUTION INSTRUCTIONS
    executionFocus: {
      philosophy: "Direct. Powerful. No wasted motion. Grounded.",
      movementStyle: "Slow, heavy, controlled. Every movement has purpose.",
      tacticalApproach: "Read opponent. Set boundaries. Strike with precision.",

      // How to train under Ogun
      trainingInstructions: {
        phase_1_foundation: {
          focus: "Ginga em Baixo — Low Angola foundation",
          instructions: [
            "Step 1: Drop your hips low. Stay close to earth.",
            "Step 2: Rock slowly (60-80 BPM). Feel the weight in your legs.",
            "Step 3: Ginga should feel HEAVY, not light. You're grounded.",
            "Step 4: Repeat 50 times. Your body learns the low-stance foundation.",
          ],
          reps: 50,
          tempo: "60-80 BPM (slow)",
          cue: "Heavy. Grounded. Warrior stance.",
          ogunTeaching:
            "Ogun says: 'Stay low. Strength comes from connection to earth. " +
            "Never rise above your foundation.'",
        },

        phase_2_power: {
          focus: "Queixada Forte — Powerful strike",
          instructions: [
            "Step 1: From low ginga, prepare queixada",
            "Step 2: Hip rotation — LET YOUR HIPS LEAD",
            "Step 3: Strike with FULL body weight — not just leg",
            "Step 4: Heel connects with power. Snap back immediately.",
            "Step 5: Return to low ginga. Repeat.",
          ],
          reps: 80,
          tempo: "80-100 BPM (medium)",
          cue: "Power. Precision. Body rotation.",
          ogunTeaching:
            "Ogun says: 'Every strike must have intention. " +
            "Your whole body commits. No hesitation.'",
        },

        phase_3_application: {
          focus: "Low-game warrior combat",
          instructions: [
            "Step 1: Spar in low Angola position (5-minute games)",
            "Step 2: Practice grounded strikes — Queixada, Rasteira, Armada from low stance",
            "Step 3: Read opponent's weight distribution",
            "Step 4: Strike when they're committed to one position",
            "Step 5: Defend using low-game escapes",
          ],
          reps: "5 games × 5 min",
          tempo: "Angola tempo (60-80 BPM in game)",
          cue: "Warrior awareness. Read and strike.",
          ogunTeaching:
            "Ogun says: 'In battle, awareness determines victory. " +
            "Read before you strike.'",
        },
      },
    },

    conceptAffinities: {
      malicia: {
        level: "core",
        description: "Ogun reads through observation and boundary-setting",
        bonus: "+15% malicia_effectiveness",
      },
      malandragem: {
        level: "secondary",
        description: "Ogun exploits space through strategic positioning",
        bonus: "+10% malandragem_efficiency",
      },
      mandinga: {
        level: "none",
        description: "Ogun rejects theatrical charm — pure warrior",
      },
    },

    bonuses: {
      strength: 20,
      boundaries: 15,
      perseverance: 12,
      malicia_effectiveness: 10,
      damage_output: 8,
      directness: 6,
    },

    progressionTiers: [
      {
        name: "Ogun's Student",
        xpReward: 200,
        requirements: ["Ginga em Baixo level 2+"],
      },
      {
        name: "Ogun's Warrior",
        xpReward: 300,
        requirements: ["5 Angola wins", "Malícia 1+"],
      },
      {
        name: "Ogun's Child",
        xpReward: 500,
        requirements: ["Queixada Forte mastery", "Win 10 low-game battles"],
        unlockedContent: ["Warrior's meditation", "Low-game dominance sequences"],
      },
    ],

    reward: {
      xp: 500,
      title: "Ogun's Warrior",
      description:
        "Iron will. Sacred boundaries. Ogun accepts you as a warrior. " +
        "Your strength flows from earth. Your strikes are precision.",
    },

    victoryText: (playerName) =>
      `Ogun's presence fills the space. The air grows heavy. Iron chains materialize. ` +
      `"${playerName}," his voice resonates like metal on metal, ` +
      `"you understand struggle. You understand boundaries. ` +
      `You move from earth, not air. This is good. ` +
      `You are Ogun's child now. Your warrior spirit is awakened."`,

    playerIntegration: {
      coreIdentity: true,
      displayText: "Ogun (Core Identity)",
      badge: "⚔️ Warrior of Ogun",
      auraColor: "#2d5016",
      statusMessage: "Your Ogun nature is unshakable. Boundaries protect you.",
    },

    repRequirements: {
      1: 25,   // Aware
      2: 75,   // Drilling
      3: 150,  // Owning
      4: 300,  // Flowing
      5: 500,  // Instinct
    },
  },

  // OBATALA — The Owner of White Cloth, Master of Wisdom & Creation
  {
    id: "orisha_obatala",
    name: "Obatala",
    tier: "paramount",
    subtitle: "The Owner of White Cloth, Master of Wisdom & Peace",
    spiritualDomain: "Creation, purity, wisdom, peace, balance, ancestors, spirituality",

    capoeiraDimension:
      "Ancestral connection, measured wisdom, peaceful resolution, artistic mastery, balance between traditions",

    spiritualLesson:
      "The Lesson of Sacred Purity: " +
      "Speak only when necessary. Your words carry weight. " +
      "Seek balance, not extremes. Connect with ancestors. " +
      "Creation requires stillness before action.",

    historicalContext:
      "Obatala is the chief Orisha after Olorun. He created humanity. " +
      "In Capoeira, Obatala represents the ancestral lineage keepers, " +
      "those who preserve tradition while remaining peaceful.",

    colors: ["#FFFFFF", "#C0C0C0"],  // White and silver
    symbols: ["white cloth", "staff", "crown", "peacock feather"],
    sacred_number: 8,
    sacred_day: "Friday/Sunday (varies)",
    sacred_objects: ["white cloth", "white items", "incense", "ancestor items"],

    signature_techniques: [
      "ginga_obatala_peaceful",
      "negativa_controlled",
      "rolê_wisdom",
      "au_mastery",
    ],

    requirements: [
      {
        label: "Complete meditation on Capoeira history (narrative quest)",
        type: "narrative",
        lore_key: "obatala_ancestral_wisdom",
        narrative: "Obatala: 'You must know where you come from.'",
      },
      {
        label: "Win 3 games by PEACEFUL RESOLUTION (not domination)",
        type: "gameplay",
        metric: "peaceful_game_wins",
        target: 3,
        narrative: "Obatala: 'Show me you can de-escalate. Wisdom knows when NOT to strike.'",
      },
      {
        label: "Obatala tree level 1+ (if it exists) or understand Capoeira philosophy",
        type: "concept_tree",
        treeId: "wisdom",  // Hypothetical wisdom concept
        targetLevel: 1,
        narrative: "Obatala: 'Seek understanding, not victory.'",
      },
    ],

    executionFocus: {
      philosophy: "Peaceful. Measured. Connected to ancestors. Balanced.",
      movementStyle: "Slow, graceful, controlled. Every movement has spiritual significance.",
      tacticalApproach: "Avoid conflict. Resolve through wisdom. Balance offensive and defensive.",

      trainingInstructions: {
        phase_1_meditation: {
          focus: "Ancestral connection — Slow, meditative ginga",
          instructions: [
            "Step 1: Stand in ginga, eyes closed or lowered",
            "Step 2: Feel the ground beneath your feet — ancestors below, sky above",
            "Step 3: Move VERY SLOWLY. Each swing is a prayer.",
            "Step 4: Think of ancestors — those who survived, who taught, who sacrificed",
            "Step 5: Ginga becomes a conversation with the past",
          ],
          reps: 40,
          tempo: "40-50 BPM (meditative)",
          cue: "Slow. Connected. Ancestral presence.",
          obatalaTeaching:
            "Obatala says: 'Slow your mind. Listen to those before you. " +
            "They guide every step.'",
        },

        phase_2_wisdom: {
          focus: "Peaceful resolution — Reading without striking",
          instructions: [
            "Step 1: In slow sparring, practice READING opponent's movements",
            "Step 2: Anticipate their next move WITHOUT attacking yet",
            "Step 3: Move defensively — escape, dodge, evade",
            "Step 4: Only strike if opponent commits aggression",
            "Step 5: Prioritize UNDERSTANDING over DOMINATION",
          ],
          reps: "5 games × 5 min",
          tempo: "Angola tempo (60-80 BPM)",
          cue: "Understand. Balance. De-escalate.",
          obatalaTeaching:
            "Obatala says: 'Wisdom is knowing when NOT to fight. " +
            "Peace is stronger than violence.'",
        },
      },
    },

    conceptAffinities: {
      mandinga: {
        level: "secondary",
        description: "Obatala uses presence and grace",
      },
      malicia: {
        level: "secondary",
        description: "Obatala reads through wisdom, not deception",
      },
      malandragem: {
        level: "secondary",
        description: "Obatala follows rules; doesn't exploit gaps",
      },
    },

    bonuses: {
      wisdom: 20,
      ancestral_connection: 15,
      peaceful_resolution: 12,
      balance: 10,
      artistic_expression: 8,
    },

    reward: {
      xp: 600,
      title: "Obatala's Student",
      description:
        "You understand the ancestors. Wisdom guides your movement. " +
        "You seek balance, not victory. Obatala recognizes you as a keeper of tradition.",
    },

    victoryText: (playerName) =>
      `Obatala appears surrounded by white light. His voice is gentle, ancient. ` +
      `${playerName}, you have learned patience. This is good. ` +
      `You honor the ancestors. You understand that Capoeira is not about winning battles — ` +
      `it is about preserving culture, healing trauma, and connecting to what came before. ` +
      `You are now a guardian of tradition.`,

    playerIntegration: {
      displayText: "Guided by Obatala",
      badge: "✨ Ancestral Guardian",
      auraColor: "#FFFFFF",
      statusMessage: "Wisdom and ancestors flow through you.",
    },

    repRequirements: {
      1: 28,
      2: 90,
      3: 180,
      4: 360,
      5: 600,
    },
  },

  // IFA/ORUMILA — The Keeper of Secrets, Master of Destiny & Divination
  {
    id: "orisha_ifa",
    name: "Ifa (Orumila)",
    tier: "major",
    subtitle: "The Keeper of Secrets, Master of Destiny & Divination",
    spiritualDomain:
      "Divination, wisdom, destiny, knowledge, secrets, communication between worlds, fate",

    capoeiraDimension:
      "Strategic foresight, reading patterns, anticipating opponent movement, " +
      "understanding the deeper game within the game",

    spiritualLesson:
      "The Lesson of Divine Knowledge: " +
      "Everything follows patterns. Learn to read them. " +
      "Your destiny is written, but your choices shape it. " +
      "True power is knowing what will happen before it happens.",

    historicalContext:
      "Ifa is the oracle system of Yoruba culture. Orumila is the Orisha of divination. " +
      "In Capoeira, Ifa represents those who understand the deep game — " +
      "those who read not just opponent movement, but the flow of energy itself.",

    colors: ["#FFD700", "#8B4513"],  // Gold and brown
    symbols: ["divination board", "secrets", "knowledge", "cosmic order"],
    sacred_number: 16,  // The 16 Odu (paths of Ifa)
    sacred_day: "Monday",
    sacred_objects: ["divination board", "sacred nuts", "wisdom texts"],

    signature_techniques: [
      "negativa_prophetic",
      "reading_opponent",
      "anticipation_based_strike",
      "pattern_recognition",
    ],

    requirements: [
      {
        label: "Read and understand Capoeira strategy texts (narrative)",
        type: "narrative",
        lore_key: "ifa_strategy_mastery",
        narrative: "Ifa: 'Knowledge is power. Learn from books, games, and ancestors.'",
      },
      {
        label: "Win 5 games by ANTICIPATION (reading opponent 3+ moves ahead)",
        type: "gameplay",
        metric: "anticipation_wins",
        target: 5,
        narrative: "Ifa: 'Show me you can see the future. Read what will happen.'",
      },
      {
        label: "Malícia tree level 2+ (deep reading)",
        type: "concept_tree",
        treeId: "malicia",
        targetLevel: 2,
        narrative: "Ifa: 'Not just reading — understanding the PATTERN of deception.'",
      },
    ],

    executionFocus: {
      philosophy: "Prophetic. Pattern-based. Strategic foresight. Knowledge-driven.",
      movementStyle: "Calculated, anticipatory. Movements based on prediction, not reaction.",
      tacticalApproach: "Read patterns. Anticipate sequences. Move where opponent WILL be, not where they are.",

      trainingInstructions: {
        phase_1_pattern_reading: {
          focus: "Learning to see patterns in opponent behavior",
          instructions: [
            "Step 1: Watch opponent's ginga for 30 seconds without attacking",
            "Step 2: Notice their rhythm — fast or slow? Predictable or random?",
            "Step 3: Notice their favorite attacks — do they repeat sequences?",
            "Step 4: Notice their defense — where do they move when you attack?",
            "Step 5: Document the pattern. Can you predict their next 3 moves?",
          ],
          reps: "5 sparring sessions, 5 min each",
          tempo: "Variable (match opponent)",
          cue: "Pattern. Prediction. Foresight.",
          ifaTeaching:
            "Ifa says: 'Everything follows a pattern. The 16 Odu teach all paths. " +
            "Learn to see them.'",
        },

        phase_2_anticipation: {
          focus: "Moving to where opponent WILL be, not where they are",
          instructions: [
            "Step 1: Opponent begins an attack",
            "Step 2: Predict where they'll move next (not where they are now)",
            "Step 3: Move to INTERCEPT that predicted position",
            "Step 4: Strike or defend based on prediction, not reaction",
            "Step 5: Test: How many times did you predict correctly?",
          ],
          reps: "10 sparring sessions, measuring prediction accuracy",
          tempo: "Medium (80-100 BPM)",
          cue: "Foresight. Anticipation. Divine knowledge.",
          ifaTeaching:
            "Ifa says: 'The best defense is knowing what they'll do before they do it.'",
        },
      },
    },

    conceptAffinities: {
      malicia: {
        level: "core",
        description: "Ifa reads deception patterns deeply",
        bonus: "+20% malicia_reading_depth",
      },
      mandinga: {
        level: "secondary",
        description: "Ifa understands psychological rhythms",
      },
      malandragem: {
        level: "secondary",
        description: "Ifa exploits game knowledge",
      },
    },

    bonuses: {
      divination: 25,
      pattern_recognition: 20,
      anticipation: 15,
      strategic_foresight: 12,
      knowledge_bonus: 10,
    },

    reward: {
      xp: 650,
      title: "Ifa's Oracle",
      description:
        "You can see patterns others miss. You know what will happen before it happens. " +
        "Ifa recognizes you as a keeper of divine knowledge.",
    },

    victoryText: (playerName) =>
      `Ifa's voice echoes from everywhere and nowhere. ` +
      `${playerName}, you have learned to see. ` +
      `The 16 Odu reveal themselves to those who listen. ` +
      `You understand that Capoeira is not random — it follows patterns. ` +
      `Your destiny is written, but knowledge sets you free. ` +
      `You are now an oracle of the roda.`,

    playerIntegration: {
      displayText: "Blessed by Ifa",
      badge: "🔮 Oracle of the Roda",
      auraColor: "#FFD700",
      statusMessage: "Divine knowledge flows through you. You see what others miss.",
    },

    repRequirements: {
      1: 32,
      2: 115,
      3: 230,
      4: 460,
      5: 765,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // REMAINING 13 ORISHAS (Summary structure)
  // ═══════════════════════════════════════════════════════════════════════════════════

  // YEMAYA — The Ocean Mother
  {
    id: "orisha_yemaya",
    name: "Yemaya",
    tier: "paramount",
    subtitle: "The Ocean Mother, Master of Protection & Infinite Depth",
    spiritualDomain: "Ocean, motherhood, protection, fertility, infinite abundance, healing",
    capoeiraDimension: "Protective gameplay, infinite stamina, deep wisdom, emotional intelligence",
    spiritualLesson:
      "The Lesson of Infinite Protection: " +
      "Like the ocean, contain multitudes. Protect those under your care fiercely. " +
      "Your depth is your strength. Healing flows from you.",
    bonuses: { protection: 20, stamina: 20, wisdom: 15, healing: 10 },
    repRequirements: { 1: 25, 2: 80, 3: 160, 4: 320, 5: 600 },
  },

  // SHANGO — The King of Thunder
  {
    id: "orisha_shango",
    name: "Shango",
    tier: "paramount",
    subtitle: "The King of Thunder, Master of Passion & Authority",
    spiritualDomain: "Thunder, lightning, fire, passion, justice, leadership, creativity",
    capoeiraDimension: "Explosive power, rapid strikes, passionate gameplay, creative expression",
    spiritualLesson:
      "The Lesson of Passionate Authority: " +
      "Strike decisively when the moment comes. Leadership means accountability. " +
      "Transform raw passion into creative power.",
    bonuses: { speed: 20, explosiveness: 18, leadership: 12, creativity: 10 },
    repRequirements: { 1: 28, 2: 90, 3: 180, 4: 360, 5: 600 },
  },

  // OSHUN — The Mother of Rivers
  {
    id: "orisha_oshun",
    name: "Oshun",
    tier: "major",
    subtitle: "The Mother of Rivers, Master of Beauty & Abundance",
    spiritualDomain: "Rivers, love, beauty, fertility, sexuality, sensuality, prosperity",
    capoeiraDimension: "Graceful movement, magnetic gameplay, flow-based defense, abundance mindset",
    spiritualLesson:
      "The Lesson of Sacred Flow: " +
      "Move like water — around obstacles, not through them. " +
      "Beauty and strength coexist. Abundance flows to the generous.",
    bonuses: { grace: 20, flow: 18, magnetism: 15, abundance: 10 },
    repRequirements: { 1: 25, 2: 80, 3: 160, 4: 320, 5: 550 },
  },

  // OYA — The Warrior Queen
  {
    id: "orisha_oya",
    name: "Oya",
    tier: "major",
    subtitle: "The Warrior Queen, Master of Transformation & Storms",
    spiritualDomain: "Wind, storms, transformation, rebirth, death, warrior femininity, boundaries",
    capoeiraDimension: "Rapid adaptation, transformation through challenge, female warrior power, area effects",
    spiritualLesson:
      "The Lesson of Transformative Storms: " +
      "Embrace change. Stand alone if necessary. Destroy what no longer serves. " +
      "Female strength is not masculine — it is fierce independence.",
    bonuses: { mobility: 20, adaptation: 18, warrior_spirit: 15, transformation: 12 },
    repRequirements: { 1: 28, 2: 95, 3: 190, 4: 380, 5: 630 },
  },

  // ELEGBA — The Trickster
  {
    id: "orisha_elegba",
    name: "Elegba (Exu)",
    tier: "major",
    subtitle: "The Trickster, Master of Crossroads & Communication",
    spiritualDomain: "Crossroads, choices, trickery, communication, cunning, boundaries, luck",
    capoeiraDimension: "Multiple pathways, dodge mechanics, luck-based crits, boundary enforcement",
    spiritualLesson:
      "The Lesson of Trickster Wisdom: " +
      "Every moment offers multiple paths. Cunning defeats brute strength. " +
      "See hidden options. Words create reality.",
    bonuses: { cunning: 20, luck: 15, communication: 12, adaptability: 10 },
    repRequirements: { 1: 25, 2: 85, 3: 170, 4: 340, 5: 565 },
  },

  // BABALUAYE — The Healer Through Suffering
  {
    id: "orisha_babaluaye",
    name: "Babaluaye",
    tier: "important",
    subtitle: "The Healer Through Suffering, Master of Transformation & Compassion",
    spiritualDomain: "Healing, disease, suffering, transformation, compassion, mercy",
    capoeiraDimension: "Healing abilities, resilience through hardship, compassionate gameplay",
    spiritualLesson:
      "The Lesson of Sacred Suffering: " +
      "Pain teaches. Healing comes from understanding suffering. " +
      "Compassion is born from hardship overcome.",
    bonuses: { healing: 20, resilience: 18, compassion: 15, transformation: 12 },
    repRequirements: { 1: 30, 2: 100, 3: 200, 4: 400, 5: 665 },
  },

  // IBEJI — The Twins
  {
    id: "orisha_ibeji",
    name: "Ibeji",
    tier: "important",
    subtitle: "The Twins, Master of Duality & Innocence",
    spiritualDomain: "Twins, duality, balance, innocence, luck, joy, playfulness",
    capoeiraDimension: "Paired mechanics, lucky crits, paradox mastery, playful defense",
    spiritualLesson:
      "The Lesson of Sacred Duality: " +
      "Opposites create wholeness. Innocence contains power. " +
      "Joy and seriousness coexist.",
    bonuses: { luck: 18, duality: 20, joy: 15, balance: 12 },
    repRequirements: { 1: 22, 2: 75, 3: 150, 4: 300, 5: 500 },
  },

  // AJE — Goddess of Wealth
  {
    id: "orisha_aje",
    name: "Aje",
    tier: "important",
    subtitle: "The Goddess of Wealth, Master of Prosperity & Commerce",
    spiritualDomain: "Wealth, prosperity, commerce, abundance, business, success",
    capoeiraDimension: "Prosperity mechanics, abundance gameplay, XP multipliers, resource generation",
    spiritualLesson:
      "The Lesson of Sacred Prosperity: " +
      "Generosity creates abundance. Work generates wealth. " +
      "Prosperity is spiritual, not just material.",
    bonuses: { prosperity: 20, abundance: 18, commerce: 12, xp_generation: 15 },
    repRequirements: { 1: 25, 2: 80, 3: 160, 4: 320, 5: 550 },
  },

  // OSHOSI — The Hunter
  {
    id: "orisha_oshosi",
    name: "Oshosi",
    tier: "important",
    subtitle: "The Hunter, Master of Precision & Mastery",
    spiritualDomain: "Hunting, precision, mastery, focus, wilderness, strategic excellence",
    capoeiraDimension: "Precision strikes, focus-based gameplay, hunting sequences, accuracy",
    spiritualLesson:
      "The Lesson of Sacred Precision: " +
      "Master requires focus. Every arrow finds its target. " +
      "Excellence is built through deliberate practice.",
    bonuses: { precision: 20, focus: 18, mastery: 15, accuracy: 12 },
    repRequirements: { 1: 28, 2: 95, 3: 190, 4: 380, 5: 630 },
  },

  // NANA BURUKU — Ancient Earth Mother
  {
    id: "orisha_nana_buruku",
    name: "Nana Buruku",
    tier: "important",
    subtitle: "Ancient Earth Mother, Master of Ancestral Wisdom",
    spiritualDomain: "Earth, ancient wisdom, elderly ancestors, time, deep knowledge",
    capoeiraDimension: "Ancestral gameplay, time-based mechanics, deep protection, elder wisdom",
    spiritualLesson:
      "The Lesson of Ancestral Time: " +
      "Those before you hold all answers. Honor the elderly. " +
      "Patience reveals what rushing conceals.",
    bonuses: { ancestral_wisdom: 25, patience: 20, protection: 15, time_mastery: 10 },
    repRequirements: { 1: 32, 2: 110, 3: 220, 4: 440, 5: 730 },
  },

  // ERINLE — The Herbalist
  {
    id: "orisha_erinle",
    name: "Erinle",
    tier: "important",
    subtitle: "The Herbalist, Master of Medicine & Forest Wisdom",
    spiritualDomain: "Herbalism, medicine, forests, healing plants, natural knowledge",
    capoeiraDimension: "Healing items, herbalism-based stamina, nature connection gameplay",
    spiritualLesson:
      "The Lesson of Natural Healing: " +
      "Nature provides. Plants contain medicine. " +
      "Healing requires understanding the environment.",
    bonuses: { herbalism: 20, natural_healing: 18, stamina: 15, nature_connection: 12 },
    repRequirements: { 1: 25, 2: 85, 3: 170, 4: 340, 5: 565 },
  },

  // OBA — The Queen
  {
    id: "orisha_oba",
    name: "Oba",
    tier: "important",
    subtitle: "The Queen, Master of Partnership & Feminine Power",
    spiritualDomain: "Marriage, partnership, feminine authority, power through unity, co-rulership",
    capoeiraDimension: "Partnership mechanics, co-leadership gameplay, balanced power dynamics",
    spiritualLesson:
      "The Lesson of Sacred Partnership: " +
      "Power multiplies through partnership. Co-leadership is strength, not weakness. " +
      "Feminine authority stands equal.",
    bonuses: { partnership: 20, feminine_power: 18, unity: 15, leadership: 12 },
    repRequirements: { 1: 25, 2: 85, 3: 170, 4: 340, 5: 565 },
  },

  // SHUN — The Intimate River
  {
    id: "orisha_shun",
    name: "Shun",
    tier: "important",
    subtitle: "The Intimate River, Master of Personal Feminine Expression",
    spiritualDomain:
      "Rivers, personal expression, intimacy, sensuality, individual femininity",
    capoeiraDimension:
      "Personal flow gameplay, intimate connection, individual expression mastery",
    spiritualLesson:
      "The Lesson of Intimate Expression: " +
      "Your unique flow is sacred. Express yourself. " +
      "Intimacy strengthens community.",
    bonuses: { personal_flow: 20, expression: 18, intimacy: 15, femininity: 12 },
    repRequirements: { 1: 22, 2: 75, 3: 150, 4: 300, 5: 500 },
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // TIER 4: EHI — THE TRANSCENDENCE
  // ═══════════════════════════════════════════════════════════════════════════════════

  {
    id: "ehi_transcendence",
    name: "Ehi",
    tier: "transcendence",
    subtitle: "Your Eternal Guardian Spirit — The Integration of All 16",

    spiritualDomain:
      "Your personal eternal spirit. The unified consciousness containing all 16 Orishas. " +
      "The aspect of you that exists beyond life and death. Your true self.",

    capoeiraDimension:
      "You are no longer learning FROM the Orishas. You ARE the Orishas unified. " +
      "Your Capoeira becomes a expression of complete spiritual mastery.",

    spiritualLesson:
      "The Awakening of Ehi: " +
      "You have integrated Ogun's strength, Obatala's wisdom, Ifa's foresight, " +
      "Yemaya's protection, Shango's passion, Oshun's grace, Oya's transformation, " +
      "Elegba's cunning, Babaluaye's compassion, Ibeji's balance, Aje's abundance, " +
      "Oshosi's precision, Nana Buruku's ancestral knowledge, Erinle's healing, " +
      "Oba's partnership, and Shun's personal expression. " +
      "\n\n" +
      "All 16 flow through your Ogun core. " +
      "Your Ehi awakens. You are eternal. You are whole.",

    historicalContext:
      "In Yoruba tradition, Ehi is your personal spiritual guardian—the part of you that " +
      "exists beyond birth and death. After integrating all 16 Orishas, your Ehi emerges. " +
      "You have become the bridge between physical and spiritual, mortal and eternal.",

    // Ehi is NOT a boss to defeat — it's a state to achieve
    not_a_boss: true,
    is_transformation: true,

    transformationRequirements: {
      all_16_orishas_integrated: true,
      minimum_integrated: 16,
      minimum_level_per_orisha: 3,  // Owning level or higher
      prerequisite_mastery: {
        ogun_core: "Level 5 (Instinct)",
        concept_trees: {
          malicia: 5,
          malandragem: 5,
          mandinga: 5,
        },
      },
    },

    ascensionText: (playerName) =>
      `The roda dissolves. All 16 Orishas stand before you in unity. ` +
      `Their voices become one voice—YOUR voice. ` +
      `\n\n` +
      `"${playerName}," Ogun says, but it is also Obatala, Ifa, Yemaya, Shango, ` +
      `Oshun, Oya, Elegba, Babaluaye, Ibeji, Aje, Oshosi, Nana Buruku, Erinle, Oba, Shun. ` +
      `\n\n` +
      `"You have walked the path of the warrior. You have learned from us. ` +
      `We do not stand above you anymore. We flow THROUGH you. ` +
      `Your Ehi—your eternal self—awakens. ` +
      `\n\n` +
      `You are no longer mortal. You are eternal. ` +
      `You contain multitudes. You ARE Capoeira. " ` +
      `\n\n` +
      `Light envelops you. Your body becomes translucent, then brilliant. ` +
      `When you solidify, you are changed. Not in form, but in essence. ` +
      `You are Ehi. Your ancestor. Your eternal guardian. Your true self.`,

    playerIntegration: {
      displayText: "Ehi Ascended",
      badge: "✨ Your Ehi Awakens",
      auraColor: "#FFD700",
      profileTransformation: "Shows all 16 integrated, unified with Ogun core",
      statusMessage:
        "You are eternal. All 16 Orishas flow through you. " +
        "You ARE Capoeira. Begin your Prestige Trials.",
    },

    prestigeMode: {
      enabled: true,
      trials_available: 10,
      xp_multiplier: 2.0,
      cosmetics_unlocked: ["Ehi Crown", "Spirit Aura", "Eternal Title"],
      description:
        "You have transcended. Now master the integration. " +
        "Ehi Trials test your mastery across all 16 dimensions simultaneously.",
    },

    bonuses: {
      all_stats: 1.5,  // 50% bonus to all stats
      spiritual_mastery: 100,
      eternal_presence: 50,
      xp_generation: 2.0,  // 2x XP from all activities
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

const ORISHA_META = {
  orisha_ogun: { icon: "⚔", color: "#8B0000", gates: { mandinga: 1, malandragem: 1, malicia: 1, minPhase: 1 } },
  orisha_obatala: { icon: "⚪", color: "#D7D7D7", gates: { mandinga: 3, malandragem: 2, minPhase: 2 } },
  orisha_ifa: { icon: "🔮", color: "#D4A017", gates: { mandinga: 4, malandragem: 3, malicia: 2, minPhase: 2 } },
  orisha_yemaya: { icon: "🌊", color: "#1E88E5", gates: { mandinga: 3, malandragem: 2, minPhase: 2 } },
  orisha_shango: { icon: "⚡", color: "#C62828", gates: { mandinga: 3, malandragem: 3, malicia: 2, minPhase: 2 } },
  orisha_oshun: { icon: "💧", color: "#E5A400", gates: { mandinga: 4, malandragem: 2, minPhase: 2 } },
  orisha_oya: { icon: "🌪", color: "#7E57C2", gates: { mandinga: 4, malandragem: 4, minPhase: 3 } },
  orisha_elegba: { icon: "🗝", color: "#6D4C41", gates: { mandinga: 4, malandragem: 4, malicia: 3, minPhase: 3 } },
  orisha_babaluaye: { icon: "☤", color: "#7CB342", gates: { mandinga: 5, malandragem: 4, minPhase: 3 } },
  orisha_ibeji: { icon: "∞", color: "#26A69A", gates: { mandinga: 5, malandragem: 4, minPhase: 3 } },
  orisha_aje: { icon: "✦", color: "#C0A000", gates: { mandinga: 5, malandragem: 4, minPhase: 3 } },
  orisha_oshosi: { icon: "◎", color: "#2E7D32", gates: { mandinga: 5, malandragem: 5, malicia: 3, minPhase: 4 } },
  orisha_nana_buruku: { icon: "◈", color: "#795548", gates: { mandinga: 5, malandragem: 5, minPhase: 4 } },
  orisha_erinle: { icon: "✚", color: "#00897B", gates: { mandinga: 5, malandragem: 5, minPhase: 4 } },
  orisha_oba: { icon: "♛", color: "#AD1457", gates: { mandinga: 5, malandragem: 5, minPhase: 4 } },
  orisha_shun: { icon: "≈", color: "#F06292", gates: { mandinga: 5, malandragem: 5, minPhase: 4 } },
};

function makeGateRequirements(orisha) {
  const gates = ORISHA_META[orisha.id]?.gates || {};
  const requirements = [];
  if (gates.mandinga) {
    requirements.push({ label: `Mandinga tree level ${gates.mandinga}+`, type: "concept_tree", treeId: "mandinga", targetLevel: gates.mandinga });
  }
  if (gates.malandragem) {
    requirements.push({ label: `Malandragem tree level ${gates.malandragem}+`, type: "concept_tree", treeId: "malandragem", targetLevel: gates.malandragem });
  }
  if (gates.malicia) {
    requirements.push({ label: `Malicia tree level ${gates.malicia}+`, type: "concept_tree", treeId: "malicia", targetLevel: gates.malicia });
  }
  if (gates.minPhase) {
    requirements.push({ label: `Training Phase ${gates.minPhase}+`, type: "phase", minPhase: gates.minPhase });
  }
  return requirements;
}

function makeOrishaFlavor(orisha) {
  const name = orisha.name || "This Orisha";
  const domain = orisha.spiritualDomain || orisha.subtitle || orisha.capoeiraDimension || "spiritual mastery";
  const lesson = orisha.spiritualLesson || orisha.philosophy || orisha.teaching || `Train ${domain} until it becomes visible in your movement.`;
  return {
    masteryQuote: orisha.masteryQuote || `${name} teaches that ${domain} must be practiced, tested, and embodied.`,
    victoryMessage: orisha.victoryMessage || `You have integrated ${name}. ${lesson}`,
    integrationNarrative: orisha.integrationNarrative || `${name} now flows through the Ogun core: ${lesson}`,
    prestigeCopy: orisha.prestigeCopy || `In prestige work, ${name} asks you to express ${domain} under fatigue, pressure, and play.`,
  };
}

function normalizeOrisha(orisha) {
  if (!orisha) return null;
  const meta = ORISHA_META[orisha.id] || {};
  const flavor = makeOrishaFlavor(orisha);
  return {
    ...orisha,
    ...flavor,
    color: orisha.color || orisha.colors?.[0] || meta.color || "#D4A017",
    icon: orisha.icon || meta.icon || "✦",
    requirements: Array.isArray(orisha.requirements) && orisha.requirements.length > 0
      ? orisha.requirements
      : makeGateRequirements(orisha),
    gatingRequirements: meta.gates || {},
  };
}

export function getOrishaById(id) {
  return normalizeOrisha(ORISHAS.find((o) => o.id === id));
}

export function getOrishasByTier(tier) {
  return ORISHAS.filter((o) => o.tier === tier).map(normalizeOrisha);
}

export function getAllCoreOrishas() {
  return ORISHAS.filter((o) => o.tier !== "transcendence").map(normalizeOrisha);
}

export function getEhi() {
  return normalizeOrisha(ORISHAS.find((o) => o.tier === "transcendence"));
}

export function calculateEhiReadiness(integratedOrishas) {
  const coreOrishas = getAllCoreOrishas();
  const totalNeeded = coreOrishas.length;
  const percentReady = (integratedOrishas.length / totalNeeded) * 100;
  return {
    integrated: integratedOrishas.length,
    total: totalNeeded,
    percentReady: percentReady,
    isReady: integratedOrishas.length === totalNeeded,
  };
}
