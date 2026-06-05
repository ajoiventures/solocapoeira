import { useState } from "react";

const TERMS = [
  // Core Practice
  { term: "Ginga", meaning: "The swing", context: "The fundamental rocking movement of Capoeira — the base from which all attacks and defenses emerge.", category: "Movement" },
  { term: "Jogo", meaning: "The game", context: "The dialogue between two capoeiristas in the roda — not a fight, a conversation in movement.", category: "Practice" },
  { term: "Roda", meaning: "The circle", context: "The circle formed by players and musicians where the jogo takes place. Sacred space — enter and exit with respect.", category: "Practice" },
  { term: "Ginga", meaning: "The swing", context: "The fundamental rocking movement — the base from which all attacks and defenses emerge.", category: "Movement" },
  { term: "Esquiva", meaning: "Dodge / Escape", context: "Any evasive movement away from an attack. There are many types: baixa, paralela, de costas, lateral.", category: "Movement" },
  { term: "Au", meaning: "Cartwheel", context: "The foundational acrobatic movement. Mastered in many variants: controlado, fechado, batido, sem mão.", category: "Movement" },
  { term: "Bananeira", meaning: "Banana tree / Handstand", context: "The handstand. Called banana tree because you're inverted like an upside-down tree.", category: "Movement" },
  { term: "Macaco", meaning: "Monkey", context: "The back handspring/flip. Named for the primate-like back arch and spring.", category: "Movement" },
  { term: "Rasteira", meaning: "Foot sweep", context: "A low sweep targeting the opponent's supporting foot. One of the most used takedowns.", category: "Movement" },
  { term: "Meia Lua de Compasso", meaning: "Half moon of the compass", context: "The signature spinning kick. Both hands touch the floor as the leg sweeps in a wide arc. The compass is the pivot point.", category: "Movement" },
  { term: "Queda de Rins", meaning: "Kidney fall / drop", context: "A one-arm balance with the elbow braced against the kidney/hip. Core floreio position.", category: "Movement" },
  { term: "Negativa", meaning: "The negative", context: "A ground-level escape — one leg extended, body low to the floor. Foundation of the low game.", category: "Movement" },
  { term: "Rolê", meaning: "The roll", context: "A low rolling movement that transitions direction while staying near the floor.", category: "Movement" },
  // Music
  { term: "Berimbau", meaning: "Berimbau (onomatopoeic)", context: "The single-string musical bow that leads the roda. The rhythm it plays dictates the energy and type of game.", category: "Music" },
  { term: "Atabaque", meaning: "Drum", context: "The tall conga-like drum. Provides the rhythmic foundation under the berimbau.", category: "Music" },
  { term: "Pandeiro", meaning: "Tambourine", context: "The hand-held frame drum. Fills in rhythmic texture between berimbau and atabaque.", category: "Music" },
  { term: "Toque", meaning: "Touch / Rhythm", context: "A specific rhythmic pattern played on the berimbau. Each toque calls for a different style of game.", category: "Music" },
  { term: "Angola", meaning: "Angola (the country)", context: "The oldest style of Capoeira, and also the name of the slow, low toque. Angola jogo is close, low, and deeply strategic.", category: "Music" },
  { term: "São Bento Grande", meaning: "Saint Benedict the Great", context: "The most common toque for Capoeira Regional. Medium-to-fast pace, upright game.", category: "Music" },
  { term: "Iúna", meaning: "A type of bird", context: "Fast, advanced toque — reserved for mestres and high-level players. Only played for the best in the roda.", category: "Music" },
  { term: "Corrido", meaning: "Running / Flowing", context: "Fast-paced toque for acrobatic, showy games. High energy.", category: "Music" },
  // Culture
  { term: "Axé", meaning: "Life force / Energy", context: "Yoruba word for divine energy. In Capoeira: the spirit, the positive energy brought to the roda.", category: "Culture" },
  { term: "Mandinga", meaning: "Magic / Deception", context: "The art of using feints, misdirection, and psychological games within the jogo. Not just physical skill — strategic.", category: "Culture" },
  { term: "Malícia", meaning: "Cunning / Trickery", context: "Shrewd intelligence in the game. Reading the opponent, setting traps, making them commit before you do.", category: "Culture" },
  { term: "Ginga", meaning: "Style / Swag", context: "Beyond the movement: an attitude of fluid, unpredictable motion that makes you hard to read.", category: "Culture" },
  { term: "Chamada", meaning: "The call", context: "A formal invitation within the game — one player calls, the other must answer. A moment of ritual pause and tension.", category: "Practice" },
  { term: "Batizado", meaning: "Baptism", context: "The graduation event. New students are 'baptized' into Capoeira — their first official cord ceremony.", category: "Culture" },
  { term: "Mestre", meaning: "Master", context: "The highest rank. A Mestre has dedicated decades to Capoeira — teaching, playing, preserving, and evolving the art.", category: "Rank" },
  { term: "Contramestre", meaning: "Counter-master", context: "One step below Mestre. Highly advanced instructor — the Mestre's right hand in the group.", category: "Rank" },
  { term: "Professor", meaning: "Professor", context: "An advanced rank with their own class. Has developed a clear personal game and teaching ability.", category: "Rank" },
  { term: "Instrutor", meaning: "Instructor", context: "Can teach classes independently. Has strong technical foundation and musical range.", category: "Rank" },
  { term: "Aluno", meaning: "Student", context: "The general term for a student of Capoeira at any early stage.", category: "Rank" },
  { term: "Cordão / Corda", meaning: "Cord / Belt", context: "The colored cord worn around the waist indicating rank, like a belt in other martial arts.", category: "Rank" },
  { term: "Grupo", meaning: "Group / School", context: "Your Capoeira lineage — the school you belong to. Groups have their own cordão systems and musical traditions.", category: "Culture" },
  { term: "Jogo de Dentro", meaning: "Inside game", context: "Close-range, body-to-body game. Requires comfort with proximity, sweeps, and takedowns at short range.", category: "Practice" },
  { term: "Jogo de Fora", meaning: "Outside game", context: "Distant game — kicks and acrobatics from range. The 'showier' game.", category: "Practice" },
  { term: "Floreio", meaning: "Flourish", context: "Acrobatic movements done for beauty rather than combat — showing skill, creativity, and body control.", category: "Movement" },
  { term: "Queda", meaning: "Fall", context: "A controlled fall or takedown. Queda de Rins, Queda de Quatro — falling is a skill.", category: "Movement" },
  { term: "Sequência", meaning: "Sequence", context: "A practiced combination of movements — attack, defense, counter. The vocabulary of the game.", category: "Practice" },
  { term: "Ginga de Angola", meaning: "Angola swing", context: "The low, deeper ginga style used in Angola Capoeira — closer to the floor, more circular.", category: "Movement" },
  { term: "Entrada", meaning: "Entry", context: "The moment you enter the roda — both a physical act and a ritual. The au de entrada is the classic entry cartwheel.", category: "Practice" },
];

// Deduplicate by term+category
const UNIQUE_TERMS = TERMS.filter((t, i, arr) => arr.findIndex((x) => x.term === t.term && x.category === t.category) === i);

const CATEGORIES = ["All", ...new Set(UNIQUE_TERMS.map((t) => t.category))];

export default function Glossary({ navigate }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = UNIQUE_TERMS.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const q = query.trim().toLowerCase();
    const matchQ = !q || t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.context.toLowerCase().includes(q);
    return matchCat && matchQ;
  }).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="page">
      {/* Back */}
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => navigate?.("settings")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", gap: 4, padding: "4px 0", fontSize: 13 }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Settings
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="page-title">Glossary</span>
        <span style={{ fontSize: 11, color: "var(--text3)" }}>{filtered.length} terms</span>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text" placeholder="Search terms…" value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px 8px 30px", borderRadius: 10, fontSize: 13, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink: 0, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            border: `1px solid ${cat === c ? "var(--accent)" : "var(--border)"}`,
            background: cat === c ? "var(--accent)" : "var(--surface2)",
            color: cat === c ? "#fff" : "var(--text2)",
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Terms */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((t) => (
          <div key={t.term + t.category} className="card" style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{t.term}</span>
              <span style={{ fontSize: 11, color: "var(--accent)", fontStyle: "italic" }}>{t.meaning}</span>
              <span style={{
                marginLeft: "auto", flexShrink: 0, fontSize: 9, padding: "1px 7px", borderRadius: 20, fontWeight: 700,
                background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)",
              }}>
                {t.category}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{t.context}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "var(--text3)" }}>No terms match "{query}"</div>
        )}
      </div>
    </div>
  );
}
