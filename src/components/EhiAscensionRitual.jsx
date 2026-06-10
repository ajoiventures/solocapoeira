import { useState, useEffect } from "react";

// Color map for Orishas whose data doesn't include colors
const ORISHA_COLORS = {
  orisha_ogun:        "#8B0000",
  orisha_obatala:     "#C0C0C0",
  orisha_ifa:         "#FFD700",
  orisha_yemaya:      "#1E90FF",
  orisha_shango:      "#DC143C",
  orisha_oshun:       "#FFB347",
  orisha_oya:         "#9400D3",
  orisha_elegba:      "#FF4500",
  orisha_babaluaye:   "#8B7355",
  orisha_ibeji:       "#00CED1",
  orisha_aje:         "#2E8B57",
  orisha_oshosi:      "#556B2F",
  orisha_nana_buruku: "#800080",
  orisha_erinle:      "#20B2AA",
  orisha_oba:         "#B8860B",
  orisha_shun:        "#DAA520",
};

function getOrishaColor(id) {
  return ORISHA_COLORS[id] || "#D4A017";
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const SLIDES = [
  {
    phase: "gather",
    title: "All Sixteen Orishas Flow",
    body: "You have walked the full circle. Every spirit has been received — from Ogun's iron will to Oya's storm wisdom. The roda never ends; it only deepens.",
    accent: "#6B46C1",
  },
  {
    phase: "merge",
    title: "The Ogun Core Holds",
    body: "You began as Ogun — warrior, boundary-setter, iron in the fire. Each Orisha did not replace you. They flowed into you. Ogun is still the core. But now the core holds everything.",
    accent: "#8B0000",
  },
  {
    phase: "transcend",
    title: "You Are No Longer Learning",
    body: "You are no longer Ogun learning the Orishas. You are all of them flowing as one. The practitioner has become the practice. The student has become the song.",
    accent: "#D4A017",
  },
  {
    phase: "ehi",
    title: "EHI ASCENDS",
    body: "Your divine guardian — the Ehi — awakens. It was always there, watching through every rep, every bout, every fall and rise. Now it speaks.",
    accent: "#D4A017",
    isEhi: true,
  },
  {
    phase: "prestige",
    title: "Prestige Mode Unlocked",
    body: "The roda never ends. It only reveals new depths. You carry all you have learned into the next cycle. Every rep earns ×2 XP. Every integration multiplies. Return to the beginning — carrying everything.",
    accent: "#D4A017",
    isFinal: true,
  },
];

export default function EhiAscensionRitual({ integratedOrishas = [], onDismiss }) {
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(() => prefersReducedMotion());
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) return undefined;
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [visible]);

  const reducedMotion = prefersReducedMotion();

  function advance() {
    if (slide < SLIDES.length - 1) {
      if (reducedMotion) {
        setSlide((s) => s + 1);
      } else {
        setExiting(true);
        setTimeout(() => { setSlide((s) => s + 1); setExiting(false); }, 200);
      }
    }
  }

  function dismiss() {
    setVisible(false);
    setTimeout(onDismiss, reducedMotion ? 0 : 300);
  }

  const s = SLIDES[slide];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.96)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 30%, ${s.accent}18 0%, transparent 65%)`,
        transition: "background 0.6s",
      }} />

      <div style={{
        background: "linear-gradient(160deg, #060D16 0%, #0E1A28 100%)",
        border: `2px solid ${s.accent}55`,
        borderRadius: 20, padding: "32px 24px",
        maxWidth: 400, width: "100%", textAlign: "center",
        boxShadow: `0 0 80px ${s.accent}22, 0 24px 64px rgba(0,0,0,0.9)`,
        position: "relative", overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.2s, transform 0.2s",
      }}>
        {/* Inner glow accent */}
        <div style={{
          position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
          width: 260, height: 260, borderRadius: "50%",
          background: `radial-gradient(circle, ${s.accent}20 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.6s",
        }} />

        {/* Slide counter */}
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 3,
          color: s.accent, textTransform: "uppercase", marginBottom: 20, opacity: 0.7,
        }}>
          {slide + 1} / {SLIDES.length}
        </div>

        {/* Content varies by phase */}
        {s.phase === "gather" && (
          <OrishaGrid orishas={integratedOrishas} />
        )}

        {s.phase === "merge" && (
          <MergeVisual accent={s.accent} />
        )}

        {s.phase === "transcend" && (
          <TranscendVisual accent={s.accent} />
        )}

        {s.phase === "ehi" && (
          <EhiSymbol accent={s.accent} />
        )}

        {s.phase === "prestige" && (
          <PrestigeVisual accent={s.accent} />
        )}

        {/* Title */}
        <div style={{
          fontSize: s.isEhi ? 22 : 17,
          fontWeight: 900,
          color: s.isEhi ? "#D4A017" : "#EDE8DE",
          marginBottom: 12,
          letterSpacing: s.isEhi ? 3 : 0.5,
          lineHeight: 1.2,
          textTransform: s.isEhi ? "uppercase" : "none",
        }}>
          {s.title}
        </div>

        {/* Body */}
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.6)",
          lineHeight: 1.75, marginBottom: 20,
        }}>
          {s.body}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 20 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              height: 3, borderRadius: 2,
              width: i === slide ? 20 : 6,
              background: i <= slide ? s.accent : "rgba(255,255,255,0.12)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* CTA */}
        {s.isFinal ? (
          <button
            onClick={dismiss}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 10,
              fontWeight: 800, fontSize: 14, cursor: "pointer", border: "none",
              background: `linear-gradient(135deg, #D4A017, #B8860B)`,
              color: "#0A1018", letterSpacing: 1,
            }}
          >
            Enter Prestige ✦
          </button>
        ) : (
          <button
            onClick={advance}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 10,
              fontWeight: 700, fontSize: 13, cursor: "pointer", border: `1px solid ${s.accent}44`,
              background: `${s.accent}18`, color: s.accent,
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}

function OrishaGrid({ orishas }) {
  const NAMES = {
    orisha_ogun: "Ogun", orisha_obatala: "Obatala", orisha_ifa: "Ifa",
    orisha_yemaya: "Yemaya", orisha_shango: "Shango", orisha_oshun: "Oshun",
    orisha_oya: "Oya", orisha_elegba: "Elegba", orisha_babaluaye: "Babaluaye",
    orisha_ibeji: "Ibeji", orisha_aje: "Aje", orisha_oshosi: "Oshosi",
    orisha_nana_buruku: "Nana", orisha_erinle: "Erinle", orisha_oba: "Oba",
    orisha_shun: "Shun",
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
        letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
      }}>
        16 Orishas Received
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 4,
      }}>
        {orishas.slice(0, 16).map((id) => {
          const color = getOrishaColor(id);
          return (
            <div key={id} style={{
              padding: "6px 2px", borderRadius: 6,
              background: color + "18", border: `1px solid ${color}44`,
              fontSize: 9, fontWeight: 700, color,
              textAlign: "center", letterSpacing: 0.5,
            }}>
              {NAMES[id] || id.replace("orisha_", "")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MergeVisual({ accent }) {
  return (
    <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `2px solid ${accent}44`,
          animation: "spin 8s linear infinite",
        }} />
        {/* Core */}
        <div style={{
          position: "absolute", inset: 12, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}33, transparent 70%)`,
          border: `2px solid ${accent}88`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          ⚔
        </div>
      </div>
    </div>
  );
}

function TranscendVisual({ accent }) {
  return (
    <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: accent, opacity: 0.9,
        padding: "10px 16px",
        background: accent + "12",
        border: `1px solid ${accent}33`,
        borderRadius: 8, letterSpacing: 1,
        fontStyle: "italic",
      }}>
        "The student has become the song."
      </div>
    </div>
  );
}

function EhiSymbol({ accent }) {
  return (
    <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}44 0%, ${accent}11 60%, transparent 80%)`,
        border: `2px solid ${accent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
        boxShadow: `0 0 40px ${accent}55, 0 0 80px ${accent}22`,
      }}>
        ✦
      </div>
    </div>
  );
}

function PrestigeVisual({ accent }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex", justifyContent: "center", gap: 12, marginBottom: 12,
      }}>
        {["×2 XP", "All Bonuses", "Spirit Aura"].map((label) => (
          <div key={label} style={{
            padding: "6px 10px", borderRadius: 8,
            background: accent + "18", border: `1px solid ${accent}44`,
            fontSize: 10, fontWeight: 700, color: accent,
          }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
