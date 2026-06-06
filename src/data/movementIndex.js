// Generated lightweight movement metadata for startup/store logic.
// Do not add profile, instruction, or media fields here; keep rich data in movements.js.
export const MOVEMENT_INDEX = [
  {
    "id": "ginga",
    "name": "Ginga",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "cocorinha",
    "name": "Cocorinha",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "esquiva_baixa",
    "name": "Esquiva Baixa",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "negativa",
    "name": "Negativa",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "role",
    "name": "Rolê",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "negativa"
    ]
  },
  {
    "id": "esquiva_paralela",
    "name": "Esquiva Paralela",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "esquiva_de_costas",
    "name": "Esquiva de Costas",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa",
      "esquiva_paralela"
    ]
  },
  {
    "id": "esquiva_escala",
    "name": "Esquiva Escala",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_paralela"
    ]
  },
  {
    "id": "giro",
    "name": "Giro",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "aranha",
    "name": "Aranha",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "negativa",
      "role"
    ]
  },
  {
    "id": "resistencia",
    "name": "Resistência",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "negativa",
      "cocorinha"
    ]
  },
  {
    "id": "gorila",
    "name": "Gorila",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "cocorinha",
      "negativa"
    ]
  },
  {
    "id": "corrupio",
    "name": "Corrupio",
    "tree": "Foundation",
    "tier": 4,
    "prerequisites": [
      "role",
      "giro",
      "resistencia"
    ]
  },
  {
    "id": "volta_de_lado",
    "name": "Volta de Lado",
    "tree": "Foundation",
    "tier": 4,
    "prerequisites": [
      "role",
      "giro"
    ]
  },
  {
    "id": "volta_por_cima",
    "name": "Volta Por Cima",
    "tree": "Foundation",
    "tier": 4,
    "prerequisites": [
      "volta_de_lado",
      "role"
    ]
  },
  {
    "id": "meia_lua_de_frente",
    "name": "Meia Lua de Frente",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "queixada",
    "name": "Queixada",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "meia_lua_de_frente"
    ]
  },
  {
    "id": "armada",
    "name": "Armada",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "queixada"
    ]
  },
  {
    "id": "bencao",
    "name": "Bênção",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "chapa",
    "name": "Chapa",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "martelo",
    "name": "Martelo",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "meia_lua_de_frente"
    ]
  },
  {
    "id": "meia_lua_de_compasso",
    "name": "Meia Lua de Compasso",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "queixada",
      "meia_lua_de_frente",
      "esquiva_baixa"
    ]
  },
  {
    "id": "chicote",
    "name": "Chicote",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "martelo",
      "armada"
    ]
  },
  {
    "id": "chapeu_de_couro",
    "name": "Chapéu de Couro",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "armada",
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "esporao",
    "name": "Esporão",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "chapa",
      "bencao"
    ]
  },
  {
    "id": "escorpiao",
    "name": "Escorpião",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "bananeira_wall",
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "mldc_role",
    "name": "Meia Lua de Compasso → Rolê",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso",
      "role"
    ]
  },
  {
    "id": "mldc_bananeira",
    "name": "Meia Lua de Compasso → Bananeira",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso",
      "bananeira_freestand"
    ]
  },
  {
    "id": "armada_au",
    "name": "Armada → Au",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "armada",
      "au_basico"
    ]
  },
  {
    "id": "au_basico",
    "name": "Au Básico",
    "tree": "Au",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "au_de_frente",
    "name": "Au de Frente",
    "tree": "Au",
    "tier": 1,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "au_controlado",
    "name": "Au Controlado",
    "tree": "Au",
    "tier": 1,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "au_fechado",
    "name": "Au Fechado",
    "tree": "Au",
    "tier": 2,
    "prerequisites": [
      "au_basico",
      "au_controlado",
      "bananeira_wall_30s"
    ]
  },
  {
    "id": "auzinho",
    "name": "Au-Zinho",
    "tree": "Au",
    "tier": 2,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "au_reversao",
    "name": "Au Reversão",
    "tree": "Au",
    "tier": 2,
    "prerequisites": [
      "au_basico",
      "au_de_frente"
    ]
  },
  {
    "id": "au_pesado",
    "name": "Au Pesado",
    "tree": "Au",
    "tier": 2,
    "prerequisites": [
      "au_basico",
      "au_controlado"
    ]
  },
  {
    "id": "au_batido",
    "name": "Au Batido",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_basico",
      "au_fechado",
      "bananeira_wall_60s"
    ]
  },
  {
    "id": "au_chibata",
    "name": "Au Chibata",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_batido"
    ]
  },
  {
    "id": "au_navalha",
    "name": "Au Navalha",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_batido",
      "au_fechado"
    ]
  },
  {
    "id": "au_amazonas",
    "name": "Au Amazonas",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_batido",
      "au_fechado"
    ]
  },
  {
    "id": "au_de_cabeca",
    "name": "Au de Cabeça",
    "tree": "Au",
    "tier": 4,
    "prerequisites": [
      "au_batido",
      "bananeira_freestand"
    ]
  },
  {
    "id": "au_de_costas",
    "name": "Au de Costas",
    "tree": "Au",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "macaco"
    ]
  },
  {
    "id": "au_queda_de_rins",
    "name": "Au Queda de Rins",
    "tree": "Au",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "queda_de_rins_10s"
    ]
  },
  {
    "id": "au_trancado",
    "name": "Au Trançado",
    "tree": "Au",
    "tier": 4,
    "prerequisites": [
      "au_fechado",
      "au_batido"
    ]
  },
  {
    "id": "au_cdo",
    "name": "Au Cordão de Ouro",
    "tree": "Au",
    "tier": 5,
    "prerequisites": [
      "au_batido",
      "au_navalha",
      "au_trancado",
      "bananeira_freestand"
    ]
  },
  {
    "id": "au_macaco_em_pe",
    "name": "Au Macaco em Pé",
    "tree": "Au",
    "tier": 5,
    "prerequisites": [
      "macaco",
      "au_basico",
      "bananeira_freestand"
    ]
  },
  {
    "id": "bananeira_wall",
    "name": "Wall Bananeira",
    "tree": "Bananeira",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "bananeira_wall_30s",
    "name": "Bananeira Wall 30s",
    "tree": "Bananeira",
    "tier": 2,
    "prerequisites": [
      "bananeira_wall"
    ]
  },
  {
    "id": "bananeira_wall_60s",
    "name": "Bananeira Wall 60s",
    "tree": "Bananeira",
    "tier": 2,
    "prerequisites": [
      "bananeira_wall_30s"
    ]
  },
  {
    "id": "bananeira_freestand_3s",
    "name": "Bananeira Freestand 3s",
    "tree": "Bananeira",
    "tier": 3,
    "prerequisites": [
      "bananeira_wall_60s"
    ]
  },
  {
    "id": "bananeira_freestand",
    "name": "Bananeira Freestand 10s",
    "tree": "Bananeira",
    "tier": 3,
    "prerequisites": [
      "bananeira_freestand_3s"
    ]
  },
  {
    "id": "bananeira_au_entry",
    "name": "Au → Bananeira",
    "tree": "Bananeira",
    "tier": 4,
    "prerequisites": [
      "bananeira_freestand_3s",
      "au_basico"
    ]
  },
  {
    "id": "bananeira_role_exit",
    "name": "Bananeira → Rolê",
    "tree": "Bananeira",
    "tier": 4,
    "prerequisites": [
      "bananeira_freestand_3s",
      "role"
    ]
  },
  {
    "id": "queda_de_rins_prep",
    "name": "Queda de Rins Prep",
    "tree": "Queda de Rins",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "queda_de_rins_5s",
    "name": "Queda de Rins 5s",
    "tree": "Queda de Rins",
    "tier": 2,
    "prerequisites": [
      "queda_de_rins_prep"
    ]
  },
  {
    "id": "queda_de_rins_10s",
    "name": "Queda de Rins 10s",
    "tree": "Queda de Rins",
    "tier": 2,
    "prerequisites": [
      "queda_de_rins_5s"
    ]
  },
  {
    "id": "queda_de_rins_switch",
    "name": "Queda de Rins Switch",
    "tree": "Queda de Rins",
    "tier": 3,
    "prerequisites": [
      "queda_de_rins_10s"
    ]
  },
  {
    "id": "fuga",
    "name": "Fuga",
    "tree": "Queda de Rins",
    "tier": 3,
    "prerequisites": [
      "queda_de_rins_10s",
      "role"
    ]
  },
  {
    "id": "ponte",
    "name": "Ponte",
    "tree": "Macaco",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "macaquinho",
    "name": "Macaquinho",
    "tree": "Macaco",
    "tier": 2,
    "prerequisites": [
      "ponte"
    ]
  },
  {
    "id": "macaco",
    "name": "Macaco",
    "tree": "Macaco",
    "tier": 3,
    "prerequisites": [
      "macaquinho",
      "bananeira_wall_60s",
      "ponte"
    ]
  },
  {
    "id": "macaco_ginga",
    "name": "Macaco → Ginga",
    "tree": "Macaco",
    "tier": 4,
    "prerequisites": [
      "macaco"
    ]
  },
  {
    "id": "macaco_au",
    "name": "Macaco → Au",
    "tree": "Macaco",
    "tier": 5,
    "prerequisites": [
      "macaco",
      "au_basico"
    ]
  },
  {
    "id": "corta_capim",
    "name": "Corta Capim",
    "tree": "Floor Game",
    "tier": 1,
    "prerequisites": [
      "negativa",
      "role"
    ]
  },
  {
    "id": "contra_corta_capim",
    "name": "Contra Corta Capim",
    "tree": "Floor Game",
    "tier": 2,
    "prerequisites": [
      "corta_capim",
      "negativa"
    ]
  },
  {
    "id": "tesoura_de_angola",
    "name": "Tesoura de Angola",
    "tree": "Floor Game",
    "tier": 4,
    "prerequisites": [
      "role",
      "negativa",
      "corta_capim"
    ]
  },
  {
    "id": "parada_de_cabeca",
    "name": "Parada de Cabeça",
    "tree": "Bananeira",
    "tier": 2,
    "prerequisites": [
      "bananeira_wall"
    ]
  },
  {
    "id": "giro_de_cabeca",
    "name": "Giro de Cabeça",
    "tree": "Bananeira",
    "tier": 4,
    "prerequisites": [
      "parada_de_cabeca",
      "au_basico",
      "corrupio"
    ]
  },
  {
    "id": "rasteira",
    "name": "Rasteira",
    "tree": "Sweep",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "negativa"
    ]
  },
  {
    "id": "foot_rolling",
    "name": "Foot Rolling",
    "tree": "Foot",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "short_foot",
    "name": "Short Foot Drill",
    "tree": "Foot",
    "tier": 1,
    "prerequisites": [
      "foot_rolling"
    ]
  },
  {
    "id": "toe_yoga",
    "name": "Toe Yoga",
    "tree": "Foot",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "tibialis_raise",
    "name": "Tibialis Raise",
    "tree": "Foot",
    "tier": 2,
    "prerequisites": [
      "short_foot"
    ]
  },
  {
    "id": "single_leg_balance",
    "name": "Single-Leg Balance",
    "tree": "Foot",
    "tier": 2,
    "prerequisites": [
      "short_foot"
    ]
  },
  {
    "id": "calf_raise",
    "name": "Calf Raise",
    "tree": "Foot",
    "tier": 2,
    "prerequisites": []
  },
  {
    "id": "goblet_squat",
    "name": "Goblet Squat",
    "tree": "Strength",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "kettlebell_swing",
    "name": "Kettlebell Swing",
    "tree": "Strength",
    "tier": 1,
    "prerequisites": [
      "goblet_squat"
    ]
  },
  {
    "id": "turkish_get_up",
    "name": "Turkish Get-Up",
    "tree": "Strength",
    "tier": 2,
    "prerequisites": [
      "kettlebell_swing"
    ]
  },
  {
    "id": "wrist_prep",
    "name": "Wrist Prep Protocol",
    "tree": "Strength",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "hip_cars",
    "name": "Hip CARs",
    "tree": "Strength",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "au_pushup",
    "name": "Au Push-Up",
    "tree": "Strength",
    "tier": 2,
    "prerequisites": [
      "au_basico",
      "wrist_prep"
    ]
  },
  {
    "id": "bananeira_pushup",
    "name": "Bananeira Push-Up",
    "tree": "Bananeira",
    "tier": 3,
    "prerequisites": [
      "bananeira_wall_30s",
      "wrist_prep"
    ]
  },
  {
    "id": "bridge_pushup",
    "name": "Bridge Push-Up",
    "tree": "Macaco",
    "tier": 2,
    "prerequisites": [
      "ponte"
    ]
  },
  {
    "id": "cobra_running",
    "name": "Cobra Running",
    "tree": "Strength",
    "tier": 1,
    "prerequisites": []
  },
  {
    "id": "moenda",
    "name": "Moenda",
    "tree": "Bananeira",
    "tier": 2,
    "prerequisites": [
      "parada_de_cabeca"
    ]
  },
  {
    "id": "cossack_squat",
    "name": "Cossack Squat",
    "tree": "Strength",
    "tier": 2,
    "prerequisites": [
      "goblet_squat"
    ]
  },
  {
    "id": "tesoura",
    "name": "Tesoura",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "negativa"
    ]
  },
  {
    "id": "banda",
    "name": "Banda",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "ginga"
    ]
  },
  {
    "id": "vingativa",
    "name": "Vingativa",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "banda",
      "esquiva_baixa"
    ]
  },
  {
    "id": "armada_rasteira",
    "name": "Armada + Rasteira",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "armada",
      "rasteira"
    ]
  },
  {
    "id": "rabo_de_arraia",
    "name": "Rabo de Arraia",
    "tree": "Sweep",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso",
      "rasteira"
    ]
  },
  {
    "id": "joelhada",
    "name": "Joelhada",
    "tree": "Sweep",
    "tier": 5,
    "prerequisites": [
      "vingativa",
      "banda"
    ]
  },
  {
    "id": "negativa_rolê_flow",
    "name": "Negativa → Rolê Flow",
    "tree": "Floor Game",
    "tier": 3,
    "prerequisites": [
      "negativa",
      "role",
      "corta_capim"
    ]
  },
  {
    "id": "relógio",
    "name": "Relógio",
    "tree": "Floor Game",
    "tier": 3,
    "prerequisites": [
      "role",
      "corta_capim",
      "negativa"
    ]
  },
  {
    "id": "chapinha",
    "name": "Chapinha",
    "tree": "Floor Game",
    "tier": 4,
    "prerequisites": [
      "corta_capim",
      "relógio",
      "au_basico"
    ]
  },
  {
    "id": "piaçava",
    "name": "Piaçava",
    "tree": "Floor Game",
    "tier": 5,
    "prerequisites": [
      "relógio",
      "chapinha",
      "queda_de_rins_switch"
    ]
  },
  {
    "id": "queda_de_rins_extensao",
    "name": "Queda de Rins Extensão",
    "tree": "Queda de Rins",
    "tier": 4,
    "prerequisites": [
      "queda_de_rins_switch"
    ]
  },
  {
    "id": "rins_flow",
    "name": "Queda de Rins Flow",
    "tree": "Queda de Rins",
    "tier": 5,
    "prerequisites": [
      "queda_de_rins_extensao",
      "fuga"
    ]
  },
  {
    "id": "foot_loaded_carry",
    "name": "Loaded Arch Carry",
    "tree": "Foot",
    "tier": 3,
    "prerequisites": [
      "tibialis_raise",
      "calf_raise"
    ]
  },
  {
    "id": "plyometric_calf",
    "name": "Plyometric Calf",
    "tree": "Foot",
    "tier": 4,
    "prerequisites": [
      "foot_loaded_carry",
      "single_leg_balance"
    ]
  },
  {
    "id": "foot_ginga_integration",
    "name": "Full Ginga Foot Integration",
    "tree": "Foot",
    "tier": 5,
    "prerequisites": [
      "plyometric_calf"
    ]
  },
  {
    "id": "foot_mastery",
    "name": "Foot Mastery — Plantar Fascia Healed",
    "tree": "Foot",
    "tier": 6,
    "prerequisites": [
      "foot_ginga_integration"
    ]
  },
  {
    "id": "macaco_no_mao",
    "name": "Macaco Sem Mão",
    "tree": "Macaco",
    "tier": 4,
    "prerequisites": [
      "macaco",
      "bananeira_freestand_3s"
    ]
  },
  {
    "id": "ginga_endurance",
    "name": "Ginga Endurance — 5 Min",
    "tree": "Conditioning",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "jogo_basico",
    "name": "Jogo Básico — Roda Entry",
    "tree": "Conditioning",
    "tier": 1,
    "prerequisites": [
      "ginga_endurance",
      "cocorinha",
      "esquiva_baixa"
    ]
  },
  {
    "id": "flow_round_5min",
    "name": "Flow Round — 5 Min Quality",
    "tree": "Conditioning",
    "tier": 2,
    "prerequisites": [
      "jogo_basico",
      "meia_lua_de_frente",
      "role"
    ]
  },
  {
    "id": "hiit_capoeira",
    "name": "HIIT Capoeira Protocol",
    "tree": "Conditioning",
    "tier": 2,
    "prerequisites": [
      "jogo_basico"
    ]
  },
  {
    "id": "flow_round_10min",
    "name": "Flow Round — 10 Min",
    "tree": "Conditioning",
    "tier": 3,
    "prerequisites": [
      "flow_round_5min",
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "roda_simulation",
    "name": "Roda Simulation — 2 × 10 Min",
    "tree": "Conditioning",
    "tier": 4,
    "prerequisites": [
      "flow_round_10min",
      "rasteira"
    ]
  },
  {
    "id": "flow_round_20min",
    "name": "Flow Round — 20 Min",
    "tree": "Conditioning",
    "tier": 5,
    "prerequisites": [
      "roda_simulation"
    ]
  },
  {
    "id": "multi_partner_roda",
    "name": "Multi-Partner Roda",
    "tree": "Conditioning",
    "tier": 6,
    "prerequisites": [
      "flow_round_20min"
    ]
  },
  {
    "id": "batizado_conditioning",
    "name": "Batizado Conditioning",
    "tree": "Conditioning",
    "tier": 7,
    "prerequisites": [
      "multi_partner_roda"
    ]
  },
  {
    "id": "roda_advanced",
    "name": "Advanced Roda Game",
    "tree": "Conditioning",
    "tier": 8,
    "prerequisites": [
      "batizado_conditioning"
    ]
  },
  {
    "id": "roda_mestre",
    "name": "Roda — Mestre-Level Endurance",
    "tree": "Conditioning",
    "tier": 9,
    "prerequisites": [
      "roda_advanced"
    ]
  },
  {
    "id": "esquiva_lateral",
    "name": "Esquiva Lateral",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "queda_de_quatro",
    "name": "Queda de Quatro",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "negativa_lateral",
    "name": "Negativa Lateral",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "negativa"
    ]
  },
  {
    "id": "gato",
    "name": "Gato",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "negativa_lateral",
      "role"
    ]
  },
  {
    "id": "ponteira",
    "name": "Ponteira",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "galopante",
    "name": "Galopante",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "chapa"
    ]
  },
  {
    "id": "chapa_de_costas",
    "name": "Chapa de Costas",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "chapa"
    ]
  },
  {
    "id": "chapa_giratoria",
    "name": "Chapa Giratória",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "chapa",
      "armada"
    ]
  },
  {
    "id": "chapa_no_chao",
    "name": "Chapa no Chão",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "esquiva_baixa",
      "chapa"
    ]
  },
  {
    "id": "martelo_giratoria",
    "name": "Martelo Giratório",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "martelo",
      "armada"
    ]
  },
  {
    "id": "armada_pulada",
    "name": "Armada Pulada",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "armada",
      "au_basico"
    ]
  },
  {
    "id": "mldc_sem_mao",
    "name": "MLDC sem Mão",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "parafuso",
    "name": "Parafuso",
    "tree": "Kick",
    "tier": 5,
    "prerequisites": [
      "armada_pulada"
    ]
  },
  {
    "id": "escorpiao_cabeca",
    "name": "Escorpião Cabeça no Chão",
    "tree": "Kick",
    "tier": 5,
    "prerequisites": [
      "escorpiao",
      "bananeira_wall"
    ]
  },
  {
    "id": "au_cruzado",
    "name": "Aú Cruzado",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_controlado"
    ]
  },
  {
    "id": "au_quebrado",
    "name": "Aú Quebrado",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_controlado"
    ]
  },
  {
    "id": "invergado",
    "name": "Invergado",
    "tree": "Au",
    "tier": 3,
    "prerequisites": [
      "au_fechado",
      "bananeira_wall"
    ]
  },
  {
    "id": "au_sem_mao",
    "name": "Aú sem Mão",
    "tree": "Au",
    "tier": 5,
    "prerequisites": [
      "au_batido",
      "macaco"
    ]
  },
  {
    "id": "bananeira_fechado",
    "name": "Bananeira Fechado",
    "tree": "Bananeira",
    "tier": 3,
    "prerequisites": [
      "bananeira_freestand"
    ]
  },
  {
    "id": "piao_de_mao",
    "name": "Pião de Mão",
    "tree": "Bananeira",
    "tier": 4,
    "prerequisites": [
      "bananeira_fechado",
      "giro_de_cabeca"
    ]
  },
  {
    "id": "s_dobrado",
    "name": "S-Dobrado",
    "tree": "Macaco",
    "tier": 4,
    "prerequisites": [
      "macaco",
      "macaco_au"
    ]
  },
  {
    "id": "mola",
    "name": "Mola",
    "tree": "Macaco",
    "tier": 4,
    "prerequisites": [
      "macaco_ginga",
      "ponte"
    ]
  },
  {
    "id": "salto_mortal",
    "name": "Salto Mortal",
    "tree": "Macaco",
    "tier": 5,
    "prerequisites": [
      "macaco_no_mao"
    ]
  },
  {
    "id": "helicoptero",
    "name": "Helicóptero",
    "tree": "Macaco",
    "tier": 5,
    "prerequisites": [
      "au_sem_mao",
      "s_dobrado"
    ]
  },
  {
    "id": "encruzilhada",
    "name": "Encruzilhada",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "ginga"
    ]
  },
  {
    "id": "alavanca",
    "name": "Alavanca",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "encruzilhada",
      "banda"
    ]
  },
  {
    "id": "pisao",
    "name": "Pisão",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "jab_circular",
    "name": "Jab Circular",
    "tree": "Punch",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "soco_rapido"
    ]
  },
  {
    "id": "bico_de_coruja",
    "name": "Bico de Coruja",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "queixada",
      "armada"
    ]
  },
  {
    "id": "sapata",
    "name": "Sapata",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "mortal_lateral",
    "name": "Mortal Lateral",
    "tree": "Flip",
    "tier": 2,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "pirueta",
    "name": "Pirueta",
    "tree": "Flip",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "pe_de_mao",
    "name": "Pé de Mão",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "ginga"
    ]
  },
  {
    "id": "chamada_de_cintura",
    "name": "Chamada de Cintura",
    "tree": "Ground",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "chamada_angola"
    ]
  },
  {
    "id": "queda_de_costas",
    "name": "Queda de Costas",
    "tree": "Ground",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "roda_baixa",
    "name": "Roda Baixa",
    "tree": "Angola",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "chamada_angola",
    "name": "Chamada Angola",
    "tree": "Angola",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "roda_baixa"
    ]
  },
  {
    "id": "berimbau_call_response",
    "name": "Berimbau Call & Response",
    "tree": "Angola",
    "tier": 2,
    "prerequisites": [
      "roda_baixa"
    ]
  },
  {
    "id": "saida_regional",
    "name": "Saída Regional",
    "tree": "Regional",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "ataque_encadeado",
    "name": "Ataque Encadeado",
    "tree": "Regional",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "queixada",
      "armada"
    ]
  },
  {
    "id": "defesa_regional",
    "name": "Defesa Regional",
    "tree": "Regional",
    "tier": 1,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "falseio_de_corpo",
    "name": "Falseio de Corpo",
    "tree": "Malícia",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "olhar_longe",
    "name": "Olhar Longe",
    "tree": "Malícia",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "silencio_estrategico",
    "name": "Silêncio Estratégico",
    "tree": "Malícia",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "olhar_longe"
    ]
  },
  {
    "id": "presenca_espiritual",
    "name": "Presença Espiritual",
    "tree": "Mandinga",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "energia_que_flui",
    "name": "Energia que Flui",
    "tree": "Mandinga",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "influencia_do_jogo",
    "name": "Influência do Jogo",
    "tree": "Mandinga",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "presenca_espiritual"
    ]
  },
  {
    "id": "meia_volta",
    "name": "Meia Volta",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "trocacao",
    "name": "Trocação",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "volta_do_mundo",
    "name": "Volta do Mundo",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "au_basico"
    ]
  },
  {
    "id": "soco_rapido",
    "name": "Soco Rápido",
    "tree": "Punch",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "defesa_de_mao",
    "name": "Defesa de Mão",
    "tree": "Defense",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "deslocamento_rapido",
    "name": "Deslocamento Rápido",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "sequencia_ofensiva",
    "name": "Sequência Ofensiva",
    "tree": "Combination",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "queixada",
      "armada"
    ]
  },
  {
    "id": "jogo_defensivo",
    "name": "Jogo Defensivo",
    "tree": "Combination",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "transicao_fluida",
    "name": "Transição Fluida",
    "tree": "Combination",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "coracao_aberto",
    "name": "Coração Aberto",
    "tree": "Angola",
    "tier": 3,
    "prerequisites": [
      "roda_baixa",
      "ginga"
    ]
  },
  {
    "id": "ginga_meditativa",
    "name": "Ginga Meditativa",
    "tree": "Angola",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "ritmo_do_coracao",
    "name": "Ritmo do Coração",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "olho_para_olho",
    "name": "Olho para Olho",
    "tree": "Malícia",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "negacao_do_ataque",
    "name": "Negação do Ataque",
    "tree": "Defense",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "criacao_de_espaco",
    "name": "Criação de Espaço",
    "tree": "Regional",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "musica_no_corpo",
    "name": "Música no Corpo",
    "tree": "Mandinga",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "danca_e_luta",
    "name": "Dança e Luta",
    "tree": "Combination",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "queixada"
    ]
  },
  {
    "id": "liberdade_no_jogo",
    "name": "Liberdade no Jogo",
    "tree": "Angola",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "roda_baixa"
    ]
  },
  {
    "id": "cabecada",
    "name": "Cabeçada",
    "tree": "Strike",
    "tier": 2,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "escorregueta",
    "name": "Escorregueta",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "testada",
    "name": "Testada",
    "tree": "Strike",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "roleta",
    "name": "Roleta",
    "tree": "Flip",
    "tier": 2,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "cabra",
    "name": "Cabra",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "tesoura_de_mao",
    "name": "Tesoura de Mão",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "tesoura",
      "au_basico"
    ]
  },
  {
    "id": "ponta_pe",
    "name": "Ponta Pé",
    "tree": "Kick",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "ginga_fechada",
    "name": "Ginga Fechada",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "ginga_aberta",
    "name": "Ginga Aberta",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "movimentacao_baixa",
    "name": "Movimentação Baixa",
    "tree": "Angola",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "roda_baixa"
    ]
  },
  {
    "id": "movimentacao_alta",
    "name": "Movimentação Alta",
    "tree": "Regional",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "saida_regional"
    ]
  },
  {
    "id": "musica_no_berimbau",
    "name": "Música no Berimbau",
    "tree": "Angola",
    "tier": 2,
    "prerequisites": [
      "roda_baixa",
      "berimbau_call_response"
    ]
  },
  {
    "id": "fluxo_continuo",
    "name": "Fluxo Contínuo",
    "tree": "Combination",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "transicao_fluida"
    ]
  },
  {
    "id": "sincronizacao_com_parceiro",
    "name": "Sincronização com Parceiro",
    "tree": "Combination",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "trocacao"
    ]
  },
  {
    "id": "ginga_baixo",
    "name": "Ginga Baixo",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "cocorinha"
    ]
  },
  {
    "id": "queda_de_rins",
    "name": "Queda de Rins",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "negativa",
      "role"
    ]
  },
  {
    "id": "lateral_escape",
    "name": "Lateral Escape",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "flying_kick",
    "name": "Flying Kick",
    "tree": "Contemporary",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "chapa",
      "salto"
    ]
  },
  {
    "id": "double_spin",
    "name": "Double Spin",
    "tree": "Contemporary",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso",
      "armada",
      "au_basico"
    ]
  },
  {
    "id": "helicopter",
    "name": "Helicoptero",
    "tree": "Contemporary",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "bananeira_wall",
      "double_spin"
    ]
  },
  {
    "id": "flip_jump",
    "name": "Flip Jump",
    "tree": "Contemporary",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "salto"
    ]
  },
  {
    "id": "salto",
    "name": "Salto",
    "tree": "Contemporary",
    "tier": 3,
    "prerequisites": [
      "au_basico"
    ]
  },
  {
    "id": "cintura_desprezada",
    "name": "Cintura Desprezada",
    "tree": "Foundation",
    "tier": 3,
    "prerequisites": [
      "rasteira",
      "banda"
    ]
  },
  {
    "id": "balanco",
    "name": "Balanço",
    "tree": "Foundation",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "esquiva_diagonal",
    "name": "Esquiva Diagonal",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "esquiva_baixa"
    ]
  },
  {
    "id": "queda_de_tres",
    "name": "Queda de Três",
    "tree": "Foundation",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "negativa"
    ]
  },
  {
    "id": "chapa_lateral",
    "name": "Chapa Lateral",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "chapa"
    ]
  },
  {
    "id": "chapa_baixa",
    "name": "Chapa Baixa",
    "tree": "Kick",
    "tier": 2,
    "prerequisites": [
      "ginga",
      "chapa"
    ]
  },
  {
    "id": "gancho",
    "name": "Gancho",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "martelo",
      "armada"
    ]
  },
  {
    "id": "gancho_giratorio",
    "name": "Gancho Giratório",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "gancho",
      "armada"
    ]
  },
  {
    "id": "raiz",
    "name": "Raiz",
    "tree": "Kick",
    "tier": 3,
    "prerequisites": [
      "ginga",
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "voo_do_morcego",
    "name": "Voo do Morcego",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "chapa",
      "au_basico"
    ]
  },
  {
    "id": "meia_lua_solta",
    "name": "Meia Lua Solta",
    "tree": "Kick",
    "tier": 4,
    "prerequisites": [
      "meia_lua_de_compasso"
    ]
  },
  {
    "id": "au_helicoptero",
    "name": "Aú Helicóptero",
    "tree": "Au",
    "tier": 4,
    "prerequisites": [
      "au_batido",
      "au_fechado"
    ]
  },
  {
    "id": "folha_seca",
    "name": "Folha Seca",
    "tree": "Macaco",
    "tier": 3,
    "prerequisites": [
      "macaco",
      "role"
    ]
  },
  {
    "id": "mariposa",
    "name": "Mariposa",
    "tree": "Macaco",
    "tier": 4,
    "prerequisites": [
      "macaco",
      "au_sem_mao"
    ]
  },
  {
    "id": "piao_de_cabeca",
    "name": "Pião de Cabeça",
    "tree": "Floor Game",
    "tier": 4,
    "prerequisites": [
      "parada_de_cabeca",
      "relógio"
    ]
  },
  {
    "id": "arrastao",
    "name": "Arrastão",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "ginga"
    ]
  },
  {
    "id": "rasteira_do_chao",
    "name": "Rasteira do Chão",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira",
      "negativa"
    ]
  },
  {
    "id": "rasteira_em_pe",
    "name": "Rasteira em Pé",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "rasteira"
    ]
  },
  {
    "id": "tesoura_angola",
    "name": "Tesoura de Angola",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "tesoura",
      "negativa"
    ]
  },
  {
    "id": "tesoura_de_frente",
    "name": "Tesoura de Frente",
    "tree": "Sweep",
    "tier": 3,
    "prerequisites": [
      "tesoura",
      "queda_de_quatro"
    ]
  },
  {
    "id": "banda_de_costas",
    "name": "Banda de Costas",
    "tree": "Sweep",
    "tier": 2,
    "prerequisites": [
      "banda",
      "esquiva_de_costas"
    ]
  },
  {
    "id": "tombo_de_ladeira",
    "name": "Tombo de Ladeira",
    "tree": "Sweep",
    "tier": 4,
    "prerequisites": [
      "au_basico",
      "rasteira"
    ]
  },
  {
    "id": "finta_basica",
    "name": "Finta Básica",
    "tree": "Malícia",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "mudanca_de_velocidade",
    "name": "Mudança de Velocidade",
    "tree": "Malícia",
    "tier": 2,
    "prerequisites": [
      "finta_basica"
    ]
  },
  {
    "id": "olhar_falso",
    "name": "Olhar Falso",
    "tree": "Malícia",
    "tier": 3,
    "prerequisites": [
      "mudanca_de_velocidade"
    ]
  },
  {
    "id": "camuflagem",
    "name": "Camuflagem",
    "tree": "Malícia",
    "tier": 4,
    "prerequisites": [
      "olhar_falso"
    ]
  },
  {
    "id": "malicia_fluente",
    "name": "Malícia Fluente",
    "tree": "Malícia",
    "tier": 5,
    "prerequisites": [
      "camuflagem"
    ]
  },
  {
    "id": "ginga_expressiva",
    "name": "Ginga Expressiva",
    "tree": "Mandinga",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "teatro_no_jogo",
    "name": "Teatro no Jogo",
    "tree": "Mandinga",
    "tier": 2,
    "prerequisites": [
      "ginga_expressiva"
    ]
  },
  {
    "id": "chamada_com_presenca",
    "name": "Chamada com Presença",
    "tree": "Mandinga",
    "tier": 3,
    "prerequisites": [
      "teatro_no_jogo"
    ]
  },
  {
    "id": "hipnose_do_movimento",
    "name": "Hipnose do Movimento",
    "tree": "Mandinga",
    "tier": 4,
    "prerequisites": [
      "chamada_com_presenca"
    ]
  },
  {
    "id": "mandinga_completa",
    "name": "Mandinga Completa",
    "tree": "Mandinga",
    "tier": 5,
    "prerequisites": [
      "hipnose_do_movimento"
    ]
  },
  {
    "id": "conservacao_de_energia",
    "name": "Conservação de Energia",
    "tree": "Malandragem",
    "tier": 1,
    "prerequisites": [
      "ginga"
    ]
  },
  {
    "id": "exploracao_do_espaco",
    "name": "Exploração do Espaço",
    "tree": "Malandragem",
    "tier": 2,
    "prerequisites": [
      "conservacao_de_energia"
    ]
  },
  {
    "id": "leitura_do_jogo",
    "name": "Leitura do Jogo",
    "tree": "Malandragem",
    "tier": 3,
    "prerequisites": [
      "exploracao_do_espaco"
    ]
  },
  {
    "id": "jogo_inteligente",
    "name": "Jogo Inteligente",
    "tree": "Malandragem",
    "tier": 4,
    "prerequisites": [
      "leitura_do_jogo"
    ]
  },
  {
    "id": "malandragem_completa",
    "name": "Malandragem Completa",
    "tree": "Malandragem",
    "tier": 5,
    "prerequisites": [
      "jogo_inteligente"
    ]
  }
];

const MOVEMENT_META_BY_ID = new Map(MOVEMENT_INDEX.map((movement) => [movement.id, movement]));

export function getMovementMetaById(id) {
  return MOVEMENT_META_BY_ID.get(id) || null;
}

export function getUnlockedMovementIdsFromProgress(movementProgress = {}) {
  const completed = new Set(
    Object.entries(movementProgress)
      .filter(([, value]) => (value?.masteryLevel || 0) >= 2)
      .map(([id]) => id)
  );

  return MOVEMENT_INDEX
    .filter((movement) => movement.prerequisites.every((id) => completed.has(id)))
    .map((movement) => movement.id);
}
