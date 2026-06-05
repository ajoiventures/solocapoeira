import { getMestreById } from "../data/mestres.js";
import { getMestreSequences } from "../data/mestreSequences.js";
import { getMovementById } from "../data/movements.js";
import { getMestreQuotes } from "../data/mestreQuotes.js";

function BackBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
        display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 0", marginBottom: 20,
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      {label}
    </button>
  );
}

function Chip({ label, color = "var(--text3)", bg = "var(--surface2)" }) {
  return (
    <span style={{
      fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700,
      background: bg, border: "1px solid var(--border)", color, flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function MoveChip({ id, navigate, backTo, backLabel }) {
  const mv = getMovementById(id);
  if (!mv) return null;
  return (
    <button
      onClick={() => navigate("skill", id, { backTo, backLabel })}
      style={{
        fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
        background: "rgba(217,164,65,0.12)", border: "1px solid rgba(217,164,65,0.35)",
        color: "var(--accent)", cursor: "pointer",
      }}
    >
      {mv.name} ›
    </button>
  );
}

function ScanCard({ num, chain, cue, bullets = [], chips = [], note, accentColor = "var(--accent)", navigate, backTo, backLabel }) {
  return (
    <div className="card" style={{ padding: "12px 14px", marginBottom: 10 }}>
      {/* Row: number + chain */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: cue ? 5 : 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#fff",
          background: accentColor, borderRadius: 5, padding: "2px 7px", flexShrink: 0,
        }}>
          {num}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>
          {chain}
        </span>
      </div>

      {/* Cue */}
      {cue && (
        <div style={{
          fontSize: 11, color: "var(--text2)", lineHeight: 1.4, marginBottom: 8,
          borderLeft: "2px solid var(--border)", paddingLeft: 8,
        }}>
          {cue}
        </div>
      )}

      {/* Bullets */}
      {bullets.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: chips.length ? 10 : 0 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: accentColor, fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      )}

      {/* Movement chips */}
      {chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: note ? 8 : 0 }}>
          {chips.map((id) => (
            <MoveChip key={id} id={id} navigate={navigate} backTo={backTo} backLabel={backLabel} />
          ))}
        </div>
      )}

      {/* Note */}
      {note && (
        <div style={{
          fontSize: 11, color: "var(--text3)", fontStyle: "italic",
          borderTop: "1px solid var(--border)", paddingTop: 8,
          marginTop: (bullets.length || chips.length) ? 0 : 0,
        }}>
          {note}
        </div>
      )}
    </div>
  );
}

export default function MestreDetail({ mestreId, store, navigate, onBack, backContext }) {
  const mestre = getMestreById(mestreId);
  if (!mestre) return null;

  const defeated   = store.isMestreDefeated(mestre.id);
  const tier       = store.state.mestreProgress[mestre.id]?.progressionTier || 0;
  const sequences  = getMestreSequences(mestre.id);
  const backLabel  = backContext?.backLabel || "Mestres";
  const backTo     = backContext?.backTo    || "mestres";
  const handleBack = onBack || (() => navigate(backTo));
  const tierLabels = ["Apprentice", "Student", "Practitioner"];

  const cs    = mestre.teaching_methodology?.class_structure || [];
  const emph  = mestre.teaching_methodology?.emphasis        || [];
  const sigs  = mestre.signature_techniques || [];
  const tempo = mestre.teaching_methodology?.tempo || "";

  return (
    <div className="page">
      <BackBtn label={backLabel} onClick={handleBack} />

      {/* ── Identity card ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{defeated ? "🎖" : "⚔"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{mestre.name}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>
              {mestre.full_name} · {mestre.years_lived}
            </div>
            <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, marginTop: 3 }}>
              {mestre.style}
            </div>
            {defeated && (
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, marginTop: 4 }}>
                ✓ {tierLabels[Math.min(tier, 2)]}
              </div>
            )}
          </div>
        </div>

        {/* Subtitle + philosophy as tight bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {mestre.subtitle && (
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11 }}>•</span>
              <span style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>{mestre.subtitle}</span>
            </div>
          )}
          {mestre.philosophy && (
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11 }}>›</span>
              <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.45 }}>"{mestre.philosophy}"</span>
            </div>
          )}
          {mestre.historical_role && (
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "var(--text3)", fontWeight: 700, fontSize: 11 }}>—</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{mestre.historical_role}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Training Method ── */}
      {cs.length > 0 && (
        <>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "var(--text3)",
            textTransform: "uppercase", letterSpacing: 1.5,
            marginBottom: 8,
          }}>
            Training Method · {mestre.teaching_methodology?.approach}
            {tempo ? ` · ${tempo}` : ""}
          </div>

          {cs.map((phase, i) => {
            const sig  = sigs[i] || sigs[0];
            const cue  = emph[i] || emph[0] || "";
            const bullets = [];
            if (sig?.description) bullets.push(sig.description);
            if (mestre.teaching_methodology?.class_structure?.[i]) {
              // extra hints from the approach string
            }
            return (
              <ScanCard
                key={i}
                num={i + 1}
                chain={phase}
                cue={cue}
                bullets={bullets}
                chips={sig?.id ? [sig.id] : []}
                note={null}
                accentColor="var(--yellow)"
                navigate={navigate}
                backTo="mestre"
                backLabel={mestre.name}
              />
            );
          })}
        </>
      )}

      {/* ── Requirements ── */}
      {mestre.requirements?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "var(--text3)",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
          }}>
            Requirements to Defeat
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {mestre.requirements.map((req, i) => (
              <div key={i} style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                padding: "7px 10px", background: "var(--surface2)",
                borderRadius: 6, borderLeft: "3px solid var(--yellow)",
              }}>
                <span style={{ color: "var(--text3)", flexShrink: 0 }}>□</span>
                <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4 }}>{req.label}</span>
                {req.movementId && (() => {
                  const mv = getMovementById(req.movementId);
                  return mv ? (
                    <button
                      onClick={() => navigate("skill", req.movementId, { backTo: "mestre", backLabel: mestre.name })}
                      style={{
                        fontSize: 9, padding: "1px 6px", borderRadius: 6, flexShrink: 0,
                        background: "var(--surface)", border: "1px solid var(--border)",
                        color: "var(--blue)", cursor: "pointer", fontWeight: 700,
                      }}
                    >{mv.name} ›</button>
                  ) : null;
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5 Advanced Sequences ── */}
      {sequences.length > 0 && (
        <>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "var(--text3)",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>5 Sequences</span>
            <span style={{ color: sequences.length >= 5 ? "var(--green)" : "var(--yellow)" }}>
              {sequences.length}/5 {defeated ? "unlocked" : "locked"}
            </span>
          </div>

          {sequences.slice(0, 5).map((seq, i) => (
            <div
              key={seq.id}
              className="card"
              style={{
                marginBottom: 10, padding: "12px 14px",
                borderLeft: `3px solid ${seq.difficulty >= 5 ? "var(--accent)" : "var(--blue)"}`,
                opacity: defeated ? 1 : 0.45,
              }}
            >
              {/* Seq header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
                  background: seq.difficulty >= 5 ? "var(--accent)" : "var(--blue)",
                  borderRadius: 5, padding: "2px 7px",
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>
                  {seq.name}
                </span>
                <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>
                  +{seq.xp} XP
                </span>
              </div>

              {/* Style chip + description bullet */}
              <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                <Chip label={seq.style} />
                <Chip label={`D${seq.difficulty}`} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "var(--blue)", fontWeight: 700, fontSize: 11 }}>›</span>
                <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4 }}>{seq.description}</span>
              </div>

              {/* Move chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(seq.moves || []).map((id) => (
                  <MoveChip key={id} id={id} navigate={navigate} backTo="mestre" backLabel={mestre.name} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── Outcome card ── */}
      {!defeated && mestre.victory_text && (
        <div className="card" style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.06))",
          border: "1px solid rgba(255,215,0,0.25)", marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--yellow)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Victory
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--yellow)", fontWeight: 700, fontSize: 11 }}>›</span>
            <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{mestre.victory_text}</span>
          </div>
        </div>
      )}

      {defeated && (
        <div className="card" style={{
          background: "linear-gradient(135deg, rgba(46,140,120,0.08), rgba(79,124,255,0.06))",
          border: "1px solid rgba(46,140,120,0.25)", marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--green)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
            ✓ Mastered
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>
            {new Date(store.state.mestreProgress[mestre.id]?.defeatedAt).toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>
      )}

      {/* ── Quotes ── */}
      {(() => {
        const quotes = getMestreQuotes(mestre.id);
        if (!quotes.length) return null;
        return (
          <div className="card">
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase",
              letterSpacing: 1.5, marginBottom: 12 }}>
              In Their Words
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quotes.map((q, i) => (
                <div key={i} style={{
                  paddingLeft: 12, borderLeft: "2px solid var(--accent)",
                }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic",
                    marginBottom: 3 }}>
                    "{q.text}"
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600 }}>
                    — {q.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
