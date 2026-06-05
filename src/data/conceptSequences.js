const CONCEPT_ADVANCED_SEQUENCE_DATA = {
  mandinga: {
    context: "Orisha presence and Mestre ritual authority",
    sessionPolicy: { minSessions: 3, maxSessions: "10+", unitMinutes: 10 },
    keyPrinciples: ["presence", "ritual timing", "chamada", "energy control"],
    bossLine: "Mandinga bosses test whether the room feels your movement before speed appears.",
    sequences: [
      { session: 1, name: "Presence Opens the Roda", minutes: 10, orisha: "Ogun", mestre: "Pastinha", moves: ["ginga", "chamada", "negativa", "role"], goal: "Hold calm authority for 10 minutes without rushing the game." },
      { session: 2, name: "Rhythm Break and Return", minutes: 10, orisha: "Elegba", mestre: "Joao Pequeno", moves: ["ginga", "falseio_de_corpo", "mandinga_ritmica", "cocorinha"], goal: "Change rhythm five times and return to control without losing balance." },
      { session: 3, name: "Chamada Under Pressure", minutes: 10, orisha: "Obatala", mestre: "Moraes", moves: ["chamada", "olho_para_olho", "esquiva_baixa", "role"], goal: "Use chamada entries to slow the game and reset the emotional tempo." },
      { session: 4, name: "Hidden Power Low Game", minutes: 10, orisha: "Nana Buruku", mestre: "Cobra Mansa", moves: ["ginga_em_baixo", "queda_de_rins", "negativa", "mandinga_completa"], goal: "Stay low, patient, and unreadable for the full round." },
      { session: 5, name: "Mandinga Boss Sequence", minutes: 10, orisha: "Ehi", mestre: "Pastinha", moves: ["ginga", "mandinga_completa", "chamada", "role"], goal: "Complete a 10-minute boss session where presence, timing, and restraint guide every exchange." },
    ],
  },
  malandragem: {
    context: "Street wisdom, survival, and adaptive Mestre gamecraft",
    sessionPolicy: { minSessions: 3, maxSessions: "10+", unitMinutes: 10 },
    keyPrinciples: ["adaptation", "position", "resourcefulness", "escape to advantage"],
    bossLine: "Malandragem bosses test whether you can solve the game while tired and crowded.",
    sequences: [
      { session: 1, name: "Escape Becomes Entry", minutes: 10, orisha: "Yemaya", mestre: "Waldemar", moves: ["negativa", "role", "vingativa", "ginga"], goal: "Turn every escape into a new attacking angle." },
      { session: 2, name: "Street Angle Control", minutes: 10, orisha: "Elegba", mestre: "Bimba", moves: ["ginga", "esquiva_lateral", "bencao", "au_basico"], goal: "Use angles and exits to stay safe while taking space." },
      { session: 3, name: "Crowded Roda Survival", minutes: 10, orisha: "Babaluaye", mestre: "Canjiquinha", moves: ["cocorinha", "negativa", "rolinho", "malandragem_completa"], goal: "Stay composed through resets, collisions, and imperfect openings." },
      { session: 4, name: "Bait and Slip", minutes: 10, orisha: "Oshun", mestre: "Sujino", moves: ["falseio_de_corpo", "esquiva_baixa", "queixada", "role"], goal: "Offer three readable baits, then leave through a better line." },
      { session: 5, name: "Malandragem Boss Sequence", minutes: 10, orisha: "Ehi", mestre: "Bimba", moves: ["ginga", "malandragem_completa", "vingativa", "au_basico"], goal: "Complete a 10-minute boss session built on cunning, exits, and tactical patience." },
    ],
  },
  malicia: {
    context: "Reading, deception, feints, and opponent-pattern control",
    sessionPolicy: { minSessions: 3, maxSessions: "10+", unitMinutes: 10 },
    keyPrinciples: ["reading", "baiting", "counter timing", "psychological control"],
    bossLine: "Malicia bosses test whether you can make the other player reveal the answer first.",
    sequences: [
      { session: 1, name: "Read Before Moving", minutes: 10, orisha: "Ifa", mestre: "Bimba", moves: ["ginga", "olho_para_olho", "esquiva_baixa", "martelo"], goal: "Name the opponent's likely entry before you counter." },
      { session: 2, name: "False Door Counter", minutes: 10, orisha: "Elegba", mestre: "Sinhozinho", moves: ["falseio_de_corpo", "armada", "cocorinha", "bencao"], goal: "Show a false opening, then counter without rushing." },
      { session: 3, name: "Pattern Trap", minutes: 10, orisha: "Oshosi", mestre: "Camisa", moves: ["ginga", "queixada", "meia_lua_de_compasso", "malicia"], goal: "Repeat one pattern until it is believed, then break it cleanly." },
      { session: 4, name: "Counter the Counter", minutes: 10, orisha: "Shango", mestre: "Moraes", moves: ["armada", "esquiva_lateral", "chapa", "role"], goal: "Draw a counter and answer it with a prepared second layer." },
      { session: 5, name: "Malicia Boss Sequence", minutes: 10, orisha: "Ehi", mestre: "Pastinha", moves: ["ginga", "malicia_fluente", "olho_para_olho", "meia_lua_de_compasso"], goal: "Complete a 10-minute boss session where reading and deception decide the exchange." },
    ],
  },
};

export function getConceptAdvancedSequences(conceptId) {
  return CONCEPT_ADVANCED_SEQUENCE_DATA[conceptId] || null;
}

export function getAllConceptAdvancedSequences() {
  return CONCEPT_ADVANCED_SEQUENCE_DATA;
}
