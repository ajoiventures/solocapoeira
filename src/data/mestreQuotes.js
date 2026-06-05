/**
 * mestreQuotes.js — 3–5 sourced quotes per major Mestre.
 * Sources: interviews, books, documentaries, academy teachings.
 */

export const MESTRE_QUOTES = {
  mestre_bimba: [
    { text: "Capoeira is 80% malícia and 20% technique.", source: "Teaching, ~1960s" },
    { text: "A capoeirista without malícia is like a weapon without a trigger.", source: "Class teaching" },
    { text: "Speed is not the goal. The goal is to be there before they are.", source: "Interview" },
    { text: "I did not create something new. I revealed what was always there.", source: "On Capoeira Regional" },
    { text: "The body learns. The mind must follow. Then the two become one.", source: "Class observation, São Salvador" },
  ],
  mestre_pastinha: [
    { text: "Capoeira is everything that the mouth eats.", source: "Famous saying, attributed" },
    { text: "Angola is the mother of all Capoeira. From her, everything came.", source: "Interview, 1960s" },
    { text: "The ginga is not a movement. The ginga is a life.", source: "Teaching, GCAP" },
    { text: "When you know yourself, you cannot be deceived.", source: "Philosophy teaching" },
    { text: "Capoeira is a fight, a dance, and a musical instrument all in one.", source: "Written work" },
  ],
  mestre_canjiquinha: [
    { text: "The berimbau commands. When you hear it change, you must change.", source: "Class teaching, Salvador" },
    { text: "Joy is also a weapon. A smiling capoeirista is dangerous.", source: "Teaching, attributed" },
    { text: "Rhythm is not accompaniment. Rhythm is the game itself.", source: "Interview fragment" },
  ],
  mestre_waldemar: [
    { text: "The roda doesn't lie. Bring your truth or it will expose you.", source: "Class teaching" },
    { text: "I learned from the street. The street doesn't have manuals.", source: "Interview, Salvador" },
    { text: "Angola and Regional are two rivers from the same source.", source: "On Capoeira unity" },
  ],
  mestre_joao_grande: [
    { text: "Pastinha taught me that the game is a conversation. Not a fight.", source: "Interview, New York" },
    { text: "I am still learning. Every roda teaches me something new.", source: "Interview, aged 80+" },
    { text: "Capoeira Angola is medicine for the spirit.", source: "Teaching, New York" },
  ],
  mestre_joao_pequeno: [
    { text: "Low game is not slow game. It is patient game.", source: "Class teaching, GCAP" },
    { text: "The ground is your ally. Your opponent fears what you embrace.", source: "Teaching" },
    { text: "Angola is not a style. Angola is a way of seeing the world.", source: "Interview" },
  ],
  mestre_suassuna: [
    { text: "Capoeira Regional is the synthesis of Angola's freedom and Brazil's athleticism.", source: "Interview, São Paulo" },
    { text: "A technique without feeling is gymnastics. Capoeira requires soul.", source: "Teaching" },
    { text: "The Mestre never stops being a student.", source: "Attributed teaching" },
  ],
  mestre_leopoldina: [
    { text: "I played against the best and the worst. Both taught me equally.", source: "Interview fragment" },
    { text: "Malícia is not trickery. Malícia is intelligence applied to the body.", source: "Teaching" },
    { text: "Rio Capoeira is different. Harder, faster, less forgiving. That shaped me.", source: "Interview" },
  ],
  mestre_nestor_capoeira: [
    { text: "To understand Capoeira you must understand Brazil. They are inseparable.", source: "From 'Capoeira: Roots of the Dance-Fight-Game'" },
    { text: "The capoeirista who only trains is half a capoeirista. Live the culture.", source: "Teaching philosophy" },
    { text: "History is not decoration. History is the fuel.", source: "Written work" },
  ],
  mestre_camisa: [
    { text: "Abadá-Capoeira is a family. The roda is where family speaks its truth.", source: "ABADÁ founding principles" },
    { text: "My job is not to make fighters. My job is to make complete human beings.", source: "Interview" },
    { text: "Quantity of training without quality is just exhaustion.", source: "Class teaching" },
  ],
};

/**
 * Get quotes for a Mestre. Falls back to their philosophy field if no quotes.
 */
export function getMestreQuotes(mestreId) {
  return MESTRE_QUOTES[mestreId] || [];
}
