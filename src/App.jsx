import { useState, useEffect, useCallback, Component, lazy, Suspense } from "react";
import { useStore } from "./store/useStore.js";
import { track } from "./lib/analytics.js";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    import("./lib/sentry.js").then(({ captureError }) =>
      captureError(error, { componentStack: info.componentStack })
    );
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 32, textAlign: "center", minHeight: 240,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ fontSize: 28 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>This page ran into an error</div>
        <div style={{ fontSize: 12, color: "var(--text3)", maxWidth: 280 }}>
          Your training data is safe. The error has been reported.
        </div>
        <button
          className="btn btn-primary btn-sm"
          style={{ marginTop: 8 }}
          onClick={() => this.setState({ error: null })}
        >
          Try again
        </button>
      </div>
    );
  }
}

import { getRank, getLevelFromXP } from "./data/rankUtils.js";
import MasteryToast from "./components/MasteryToast.jsx";
import AchievementToast from "./components/AchievementToast.jsx";
import "./App.css";

const SkillTrees = lazy(() => import("./pages/SkillTrees.jsx"));
const MovementDetail = lazy(() => import("./pages/MovementDetail.jsx"));
const BossTests = lazy(() => import("./pages/BossTests.jsx"));
const DailyQuest = lazy(() => import("./pages/DailyQuest.jsx"));
const PainLog = lazy(() => import("./pages/PainLog.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const TrainingPlan = lazy(() => import("./pages/TrainingPlan.jsx"));
const Nutrition = lazy(() => import("./pages/Nutrition.jsx"));
const Stats = lazy(() => import("./pages/Stats.jsx"));
const WorkoutDetail = lazy(() => import("./pages/WorkoutDetail.jsx"));
const ExerciseDetail = lazy(() => import("./pages/ExerciseDetail.jsx"));
const BoxingTimer = lazy(() => import("./pages/BoxingTimer.jsx"));
const SequenceDetail = lazy(() => import("./pages/SequenceDetail.jsx"));
const WorkoutGenerator = lazy(() => import("./pages/WorkoutGenerator.jsx"));
const Glossary = lazy(() => import("./pages/Glossary.jsx"));
const ComboBuilder = lazy(() => import("./pages/ComboBuilder.jsx"));
const BerimbauTimer = lazy(() => import("./pages/BerimbauTimer.jsx"));
const MestreDetail = lazy(() => import("./pages/MestreDetail.jsx"));
const MestresLibrary = lazy(() => import("./pages/MestresLibrary.jsx"));
const ConceptTrees = lazy(() => import("./pages/ConceptTrees.jsx"));
const PhaseProgress = lazy(() => import("./pages/PhaseProgress.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const SequencesLibrary = lazy(() => import("./pages/SequencesLibrary.jsx"));
const MovementsLibrary = lazy(() => import("./pages/MovementsLibrary.jsx"));
const PracticePlanDetail = lazy(() => import("./pages/PracticePlanDetail.jsx"));
const OrishaDetail = lazy(() => import("./pages/OrishaDetail.jsx"));
const ProgressionDetail = lazy(() => import("./pages/ProgressionDetail.jsx"));
const Leaderboards = lazy(() => import("./pages/Leaderboards.jsx"));

function RouteLoader() {
  return (
    <div style={{ padding: 24, color: "var(--text3)", fontSize: 12 }}>
      Loading...
    </div>
  );
}

// ── SVG Nav Icons ─────────────────────────────────────────────────────────
const NAV_ICONS = {
  daily: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  movement: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
      <line x1="12" y1="7" x2="12" y2="12"/>
      <line x1="12" y1="12" x2="5" y2="17"/>
      <line x1="12" y1="12" x2="19" y2="17"/>
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="14" x2="10" y2="14"/><line x1="8" y1="18" x2="13" y2="18"/>
    </svg>
  ),
  roda: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
    </svg>
  ),
  body: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  axe: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  concepts: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
      <circle cx="12" cy="4" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="12" cy="20" r="1.5"/>
    </svg>
  ),
  timer: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="9" y1="2" x2="15" y2="2"/>
    </svg>
  ),
  glossary: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v10H6.5A2.5 2.5 0 0 1 4 9.5v-5A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  orishas: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4"/>
      <path d="M12 18v4"/>
      <path d="M2 12h4"/>
      <path d="M18 12h4"/>
      <path d="M4.9 4.9l2.8 2.8"/>
      <path d="M16.3 16.3l2.8 2.8"/>
      <path d="M19.1 4.9l-2.8 2.8"/>
      <path d="M7.7 16.3l-2.8 2.8"/>
    </svg>
  ),
  mestres: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  movementsLib: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
      <line x1="12" y1="7" x2="12" y2="12"/>
      <line x1="12" y1="12" x2="5" y2="17"/>
      <line x1="12" y1="12" x2="19" y2="17"/>
    </svg>
  ),
  sequencesLib: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  generator: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  more: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
    </svg>
  ),
};

// ── Nav Definitions ───────────────────────────────────────────────────────
const PRIMARY_NAV = [
  { id: "daily",    label: "Daily"    },
  { id: "movement", label: "Movement" },
  { id: "training", label: "Training" },
  { id: "roda",     label: "Roda"     },
];
const SECONDARY_CATEGORIES = [
  {
    label: "Body",
    items: [
      { id: "body",  label: "Body" },
      { id: "fuel",  label: "Fuel"     },
    ],
  },
  {
    label: "Progress",
    items: [
      { id: "axe",          label: "Axé"          },
      { id: "profile",      label: "Profile"      },
      { id: "leaderboards", label: "Leaderboards" },
    ],
  },
  {
    label: "Spirit",
    items: [
      { id: "orishas",  label: "Orishas"  },
      { id: "concepts", label: "Concepts" },
    ],
  },
  {
    label: "Library",
    items: [
      { id: "movement",     label: "Skill Trees" },
      { id: "mestres",      label: "Mestres"     },
      { id: "movementsLib", label: "Movements"   },
      { id: "sequencesLib", label: "Sequences"   },
      { id: "glossary",     label: "Glossary"    },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "timer",        label: "Timer"      },
      { id: "generator",    label: "Generator"  },
      { id: "comboBuilder", label: "Combos"     },
    ],
  },
];

const SECONDARY_NAV = SECONDARY_CATEGORIES.flatMap((c) => c.items);
const SECONDARY_IDS = SECONDARY_NAV.map((n) => n.id);

// ── Desktop Sidebar ───────────────────────────────────────────────────────
const SIDEBAR_SECONDARY = [
  {
    label: "Body",
    items: [
      { id: "body",    label: "Recovery" },
      { id: "fuel",    label: "Fuel"     },
    ],
  },
  {
    label: "Progress",
    items: [
      { id: "axe",          label: "Axé"          },
      { id: "profile",      label: "Profile"      },
      { id: "leaderboards", label: "Leaderboards" },
    ],
  },
  {
    label: "Spirit",
    items: [
      { id: "orishas",  label: "Orishas"  },
      { id: "concepts", label: "Concepts" },
    ],
  },
  {
    label: "Library",
    items: [
      { id: "movement",     label: "Skill Trees" },
      { id: "mestres",      label: "Mestres"     },
      { id: "movementsLib", label: "Movements"   },
      { id: "sequencesLib", label: "Sequences"   },
      { id: "glossary",     label: "Glossary"    },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "timer",        label: "Timer"     },
      { id: "generator",    label: "Generator" },
      { id: "comboBuilder", label: "Combos 🥊" },
    ],
  },
];

function DesktopSidebar({ page, navigate }) {
  return (
    <aside className="desktop-sidebar">
      {/* ── Scrollable secondary sections ── */}
      <div className="sidebar-scroll">
        {SIDEBAR_SECONDARY.map((section, si) => (
          <div key={section.label}>
            {si > 0 && <div className="sidebar-divider" />}
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-btn${page === item.id ? " active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <span className="nav-icon">{NAV_ICONS[item.id] || NAV_ICONS.movement}</span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

    </aside>
  );
}

// ── Secondary Drawer ──────────────────────────────────────────────────────
function SecondaryDrawer({ isOpen, onClose, page, navigate }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)" }}
        />
      )}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: `translateX(-50%) translateY(${isOpen ? "0" : "110%"})`,
        width: "100%", maxWidth: 480,
        background: "var(--surface)",
        borderTop: "1px solid var(--nav-border, var(--border))",
        borderRadius: "14px 14px 0 0",
        paddingBottom: "calc(var(--nav-h) + 8px)",
        zIndex: 50,
        transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.25)",
        overflowY: "auto",
        maxHeight: "70vh",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Categories */}
        <div style={{ padding: "0 16px 8px" }}>
          {SECONDARY_CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: 16 }}>
              {/* Category label */}
              <div style={{
                fontSize: 9, fontWeight: 700, color: "var(--text3)",
                textTransform: "uppercase", letterSpacing: 1.8,
                marginBottom: 6, paddingLeft: 2,
              }}>
                {cat.label}
              </div>

              {/* Items row */}
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(cat.items.length, 4)}, 1fr)`, gap: 6 }}>
                {cat.items.map((item) => {
                  const isActive = page === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { navigate(item.id); onClose(); }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 4, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
                        border: isActive
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        background: isActive
                          ? "rgba(217,164,65,0.1)"
                          : "var(--surface2)",
                        color: isActive ? "var(--accent)" : "var(--text2)",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {NAV_ICONS[item.id] || NAV_ICONS.movement}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Onboarding Modal ──────────────────────────────────────────────────────
const ONBOARDING_SLIDES = [
  {
    icon: "🌀",
    title: "Welcome to the Roda",
    body: "Every rep you log advances a Concept Tree — Mandinga, Malandragem, or Malícia. These three trees are the hidden engine behind everything. They gate your Mestres, your Orishas, and your prestige path.",
    cta: "Show me how →",
    accent: "#2E8C78",
    detail: "Ginga builds Mandinga · Negativa builds Malandragem · Malícia comes last",
  },
  {
    icon: "🗡️",
    title: "27 Mestre Bosses",
    body: "The Roda tab holds 27 real Capoeira Mestres as boss tests. Each Mestre requires concept tree levels to challenge. Defeat them to unlock their 5 signature sequences and advance your trees.",
    cta: "And then? →",
    accent: "#D4854A",
    detail: "Mestre Pastinha · Mestre Bimba · Mestre Besouro · and 24 more",
  },
  {
    icon: "✨",
    title: "16 Orishas + Ehi",
    body: "Defeat enough Mestres and you unlock Orisha integration. Each Orisha grants stat bonuses that reduce your mastery rep thresholds. Integrate all 16 and your Ehi — your divine core — ascends. Prestige mode unlocks ×2 XP forever.",
    cta: "Start Training",
    accent: "#D9A441",
    detail: "Ogun is your core · integrate Orishas to amplify · Ehi is the final form",
  },
];

function OnboardingModal({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [exiting, setExiting] = useState(false);
  const s = ONBOARDING_SLIDES[slide];
  const isLast = slide === ONBOARDING_SLIDES.length - 1;
  const color = s.accent || "var(--accent)";

  function advance() {
    if (isLast) { onDone(); return; }
    setExiting(true);
    setTimeout(() => { setSlide(slide + 1); setExiting(false); }, 180);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "linear-gradient(160deg, #08101A 0%, #111C2A 100%)",
        border: `2px solid ${color}44`,
        borderRadius: 18, padding: "36px 28px",
        maxWidth: 380, width: "100%", textAlign: "center",
        boxShadow: `0 0 60px ${color}22, 0 20px 60px rgba(0,0,0,0.8)`,
        position: "relative", overflow: "hidden",
        opacity: exiting ? 0 : 1, transform: exiting ? "scale(0.97)" : "scale(1)",
        transition: "opacity 0.18s, transform 0.18s",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
          width: 240, height: 240, borderRadius: "50%",
          background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* Slide counter */}
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color, textTransform: "uppercase", marginBottom: 20 }}>
          {slide + 1} of {ONBOARDING_SLIDES.length}
        </div>

        {/* Icon */}
        <div style={{ fontSize: 52, marginBottom: 16, lineHeight: 1 }}>{s.icon}</div>

        {/* Title */}
        <div style={{ fontSize: 20, fontWeight: 800, color: "#EDE8DE", marginBottom: 14, lineHeight: 1.25 }}>
          {s.title}
        </div>

        {/* Body */}
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 16 }}>
          {s.body}
        </div>

        {/* Detail hint */}
        {s.detail && (
          <div style={{
            fontSize: 11, color, fontStyle: "italic", marginBottom: 24,
            padding: "8px 12px", background: `${color}12`,
            borderRadius: 8, border: `1px solid ${color}22`,
          }}>
            {s.detail}
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {ONBOARDING_SLIDES.map((sl, i) => (
            <div key={i} style={{
              height: 4, borderRadius: 2,
              width: i === slide ? 24 : 8,
              background: i === slide ? color : "rgba(255,255,255,0.15)",
              transition: "all 0.25s",
            }} />
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            width: "100%", padding: "13px 0", borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
            background: color, color: "#0A1018", marginBottom: 12,
          }}
          onClick={advance}
        >
          {s.cta}
        </button>

        <button
          onClick={onDone}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer" }}
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const store = useStore();
  const [page, setPage] = useState("daily");
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [selectedMestre, setSelectedMestre] = useState(null);
  const [selectedOrisha, setSelectedOrisha] = useState(null);
  const [selectedPracticePlan, setSelectedPracticePlan] = useState(null);
  const [timerConfig, setTimerConfig] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // layout: "auto" = follow screen width, "desktop" = force desktop, "mobile" = force mobile
  const [layoutMode, setLayoutMode] = useState(() => localStorage.getItem("sl_layout") || "auto");
  const cycleLayout = () => {
    const next = layoutMode === "auto" ? "desktop" : layoutMode === "desktop" ? "mobile" : "auto";
    setLayoutMode(next);
    localStorage.setItem("sl_layout", next);
  };
  const layoutClass = layoutMode === "desktop" ? "layout-desktop" : layoutMode === "mobile" ? "layout-mobile" : "";
  // Navigation stack — each entry is { page, data, label }
  // Top of stack = where the current page came from
  const [navStack, setNavStack] = useState([]);
  const [navDir, setNavDir] = useState("forward"); // "forward" | "back"
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("seen_onboarding")
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("sl_theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sl_theme", theme);
  }, [theme]);

  useEffect(() => {
    track.pageView(page);
  }, [page]);

  useEffect(() => {
    const stored = localStorage.getItem("sl_font_size") || "default";
    const px = { small: "11px", default: "13px", large: "15px" }[stored] || "13px";
    document.documentElement.style.setProperty("--base-font-size", px);
  }, []);

  function dismissOnboarding() {
    localStorage.setItem("seen_onboarding", "1");
    setShowOnboarding(false);
  }

  // Label for a page — used in back button text
  const PAGE_LABELS = {
    daily: "Daily", progression: "Progression", movement: "Movement", training: "Training",
    roda: "Boss Roda", orishas: "Orishas", body: "Body", fuel: "Fuel",
    axe: "Axé", profile: "Profile", leaderboards: "Leaderboards", concepts: "Concepts", phases: "Phases",
    mestres: "Mestres", movementsLib: "Moves", sequencesLib: "Sequences",
    glossary: "Glossary", timer: "Timer", berimbau: "Berimbau",
    workout: "Workout", exercise: "Exercise", skill: "Movement",
    sequence: "Sequence", mestre: "Mestre", orisha: "Orisha", practicePlan: "Practice Plan",
  };

  const navigate = useCallback((p, data = null, ctx = null) => {
    setNavDir("forward");
    // Update selected data for detail pages
    if (p === "skill"        && data) setSelectedMovement(data);
    if (p === "sequence"     && data) setSelectedSequence(data);
    if (p === "practicePlan" && data) setSelectedPracticePlan(data);
    if (p === "workout"      && data) setSelectedWorkout(data);
    if (p === "exercise"     && data) setSelectedExercise(data);
    if (p === "mestre"       && data) setSelectedMestre(data);
    if (p === "orisha"       && data) setSelectedOrisha(data);
    if (p === "timer"   || p === "berimbau") setTimerConfig(data ?? null);

    setPage((currentPage) => {
      // Build stack entry for where we currently are
      const currentEntry = {
        page: currentPage,
        label: ctx?.backLabel || PAGE_LABELS[currentPage] || currentPage,
        // snapshot of current selected data so we can restore if user goes back
        movement: selectedMovement,
        sequence: selectedSequence,
        mestre: selectedMestre,
        orisha: selectedOrisha,
        practicePlan: selectedPracticePlan,
        workout: selectedWorkout,
        exercise: selectedExercise,
        timerConfig,
      };

      setNavStack((stack) => {
        // If navigating to a primary nav page (Daily/Movement/Training/Roda/drawer pages),
        // clear the stack — these are "root" pages
        const rootPages = new Set([
          "daily","movement","training","roda","orishas","body","fuel",
          "axe","profile","leaderboards","concepts","phases","mestres","movementsLib",
          "sequencesLib","glossary","comboBuilder","settings",
        ]);
        if (rootPages.has(p)) return [];
        // Otherwise push current location onto the stack
        return [...stack, currentEntry];
      });

      return p;
    });

    setDrawerOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovement, selectedSequence, selectedMestre, selectedPracticePlan, selectedWorkout, selectedExercise, timerConfig]);

  // Go back one level in the navigation stack
  const goBack = useCallback(() => {
    setNavDir("back");
    setNavStack((stack) => {
      if (!stack.length) {
        setPage("daily");
        return [];
      }
      const prev = stack[stack.length - 1];
      setPage(prev.page);
      // Restore selected data for the previous page
      if (prev.movement   !== undefined) setSelectedMovement(prev.movement);
      if (prev.sequence   !== undefined) setSelectedSequence(prev.sequence);
      if (prev.mestre     !== undefined) setSelectedMestre(prev.mestre);
      if (prev.orisha     !== undefined) setSelectedOrisha(prev.orisha);
      if (prev.practicePlan !== undefined) setSelectedPracticePlan(prev.practicePlan);
      if (prev.workout    !== undefined) setSelectedWorkout(prev.workout);
      if (prev.exercise   !== undefined) setSelectedExercise(prev.exercise);
      if (prev.timerConfig !== undefined) setTimerConfig(prev.timerConfig);
      return stack.slice(0, -1);
    });
  }, []);

  // Derive backContext from top of stack for pages that still use it
  const backContext = navStack.length > 0
    ? { backTo: navStack[navStack.length - 1].page, backLabel: navStack[navStack.length - 1].label }
    : null;

  const { player } = store.state;
  const level = getLevelFromXP(player.totalXP);
  const rank = getRank(level);
  const { streak: headerStreak = 0, inGrace: headerGrace = false } = store.getStreakDays?.() ?? {};

  return (
    <div className={`app${layoutClass ? ` ${layoutClass}` : ""}`}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      {showOnboarding && <OnboardingModal onDone={dismissOnboarding} />}

      <header className="app-header">
        <div className="header-left">
          <span className="app-title">SOLO LEVELING</span>
          <span className="app-subtitle">CAPOEIRA</span>
        </div>
        <div className="header-right">
          {/* Layout toggle: auto → desktop → mobile */}
          <button
            onClick={cycleLayout}
            title={`Layout: ${layoutMode} — click to cycle`}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 6px", color: "var(--eh-nav-muted)",
              display: "flex", alignItems: "center", gap: 3,
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {layoutMode === "desktop" ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ) : layoutMode === "mobile" ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><rect x="7" y="6" width="4" height="8" rx="1" strokeDasharray="2 1"/></svg>
            )}
          </button>
          <div className="player-stats">
            <span
              className="stat-chip level"
              style={{ background: rank.color + "33", color: rank.color, borderColor: rank.color + "55" }}
            >
              {rank.rank} · LV {level}
            </span>
            <span className="stat-chip xp">{player.totalXP.toLocaleString()} XP</span>
            {headerStreak >= 2 && (
              <span className="stat-chip streak" style={{ color: headerGrace ? "var(--yellow)" : "var(--accent)" }}>
                {headerGrace ? "⚡" : "🔥"}{headerStreak}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate(page === "settings" ? "daily" : "settings")}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px 6px",
              color: page === "settings" ? "var(--accent)" : "var(--text3)",
              display: "flex", alignItems: "center",
            }}
            aria-label={page === "settings" ? "Close settings" : "Settings"}
          >
            {page === "settings" ? (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mastery milestone toasts — global, above all pages */}
      <MasteryToast store={store} />
      <AchievementToast store={store} />

      <DesktopSidebar page={page} navigate={navigate} />

      <main id="main-content" className="app-main" data-nav-dir={navDir}>
        <ErrorBoundary key={page}>
          <Suspense fallback={<RouteLoader />}>
            {page === "daily"    && <DailyQuest store={store} navigate={navigate} />}
            {page === "workout"  && <WorkoutDetail quest={selectedWorkout} store={store} navigate={navigate} onBack={goBack} backLabel={backContext?.backLabel || "Daily"} />}
            {page === "timer"    && <BoxingTimer config={timerConfig} navigate={navigate} onBack={goBack} backLabel={backContext?.backLabel || "Back"} />}
            {page === "exercise" && selectedExercise && (
              <ExerciseDetail
                exercise={selectedExercise}
                navigate={navigate}
                onBack={goBack}
                onToggleDone={() => {
                  store.toggleBonusItem(selectedExercise.id, selectedExercise.xp);
                  setSelectedExercise({ ...selectedExercise });
                }}
                isDone={store.state.todayQuest?.bonusItems?.includes(selectedExercise.id)}
              />
            )}
            {page === "movement" && <SkillTrees store={store} navigate={navigate} />}
            {page === "skill"    && selectedMovement && (
              <MovementDetail movementId={selectedMovement} store={store} navigate={navigate} onBack={goBack} backContext={backContext} />
            )}
            {page === "sequence" && selectedSequence && (
              <SequenceDetail sequenceId={selectedSequence} store={store} navigate={navigate} onBack={goBack} backContext={backContext} />
            )}
            {page === "practicePlan" && selectedPracticePlan && (
              <PracticePlanDetail plan={selectedPracticePlan} navigate={navigate} onBack={goBack} backContext={backContext} />
            )}
            {page === "training"   && <TrainingPlan store={store} navigate={navigate} />}
            {page === "generator"  && <WorkoutGenerator store={store} navigate={navigate} onBack={goBack} />}
            {page === "berimbau"   && <BerimbauTimer config={timerConfig} navigate={navigate} onBack={goBack} backLabel={backContext?.backLabel || "Back"} />}
            {page === "roda"     && <BossTests store={store} navigate={navigate} />}
            {page === "orishas"  && <BossTests store={store} navigate={navigate} initialTab="orishas" />}
            {page === "mestres"  && <BossTests store={store} navigate={navigate} initialTab="masters" />}
            {page === "body"     && <PainLog store={store} />}
            {page === "fuel"     && <Nutrition store={store} />}
            {page === "axe"      && <Stats store={store} onNavigate={navigate} />}
            {page === "settings" && <Settings store={store} theme={theme} setTheme={setTheme} navigate={navigate} />}
            {page === "profile"       && <Profile store={store} navigate={navigate} />}
            {page === "leaderboards"  && <Leaderboards store={store} onBack={goBack} />}
            {page === "mestre"    && selectedMestre && <MestreDetail mestreId={selectedMestre} store={store} navigate={navigate} onBack={goBack} backContext={backContext} />}
            {page === "orisha"    && selectedOrisha  && <OrishaDetail orishaId={selectedOrisha} store={store} navigate={navigate} onBack={goBack} backContext={backContext} />}
            {page === "concepts"  && <ConceptTrees store={store} navigate={navigate} />}
            {page === "phases"    && <PhaseProgress store={store} navigate={navigate} />}
            {page === "movementsLib" && <MovementsLibrary store={store} navigate={navigate} />}
            {page === "sequencesLib" && <SequencesLibrary store={store} navigate={navigate} />}
            {page === "glossary"    && <Glossary navigate={navigate} />}
            {page === "comboBuilder" && <ComboBuilder store={store} navigate={navigate} onBack={goBack} />}
            {page === "progression" && <ProgressionDetail store={store} navigate={navigate} onBack={goBack} backContext={backContext} />}
          </Suspense>
        </ErrorBoundary>
      </main>

      <nav className="bottom-nav">
        {PRIMARY_NAV.map((item) => (
          <button
            key={item.id}
            aria-label={item.label}
            aria-current={page === item.id ? "page" : undefined}
            className={`nav-btn${
              page === item.id ||
              (page === "skill"    && (item.id === "movement" || item.id === "training")) ||
              (page === "sequence" && item.id === "movement") ||
              (page === "workout"    && item.id === "daily") ||
              (page === "generator" && item.id === "training") ||
              (page === "berimbau" && item.id === "daily") ||
              (page === "exercise" && item.id === "daily") ||
              (page === "timer"    && item.id === "daily" && timerConfig !== null)
                ? " active"
                : ""
            }`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{NAV_ICONS[item.id]}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button
          className={`nav-btn nav-btn-more${(SECONDARY_IDS.includes(page) || (page === "timer" && !timerConfig)) ? " active" : ""}`}
          onClick={() => setDrawerOpen((o) => !o)}
        >
          <span className="nav-icon">{NAV_ICONS.more}</span>
          <span className="nav-label">More</span>
        </button>
      </nav>

      <SecondaryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        page={page}
        navigate={navigate}
      />
    </div>
  );
}
