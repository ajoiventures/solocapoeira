# SOLO LEVELING: CAPOEIRA
## Technical Developer Documentation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Data Models](#3-data-models)
4. [State Management](#4-state-management)
5. [Component Reference](#5-component-reference)
6. [Data Layer Reference](#6-data-layer-reference)
7. [XP & Progression System](#7-xp--progression-system)
8. [Quest Generation System](#8-quest-generation-system)
9. [Bonus Quest System](#9-bonus-quest-system)
10. [Extending the App](#10-extending-the-app)
11. [Build & Development](#11-build--development)
12. [Design System](#12-design-system)

---

## 1. Architecture Overview

```
Solo Leveling: Capoeira
├── Frontend: React (Vite, no TypeScript, no Tailwind)
├── State: Custom useStore hook — Zustand-like, LocalStorage-backed
├── Routing: Manual page state (useState in App.jsx — no React Router)
├── Styling: Plain CSS with CSS custom properties (App.css)
├── Persistence: LocalStorage (key: "solo_leveling_state_v1")
├── Build: Vite 8.x
└── Runtime: Browser-only SPA — no server, no API, no auth
```

### Key Design Decisions

**No router.** Navigation is a `page` state string in `App.jsx`. Pages are conditionally rendered. This keeps the bundle small and eliminates URL-based state complexity for a single-user local app.

**No backend.** All state lives in LocalStorage. The app is fully offline-capable. This is intentional — it is a personal training tool, not a social platform.

**No TypeScript.** Kept plain JS to minimize tooling friction during rapid iteration. The data models are documented here; type annotations can be added via JSDoc if desired.

**No Tailwind.** CSS custom properties (`var(--accent)`, etc.) in `App.css` provide a design token system with dark theme support. All component styles are co-located in `App.css`.

---

## 2. Project Structure

```
src/
├── App.jsx                  # Root: page routing, header, nav
├── App.css                  # All component styles + CSS variables
├── index.css                # Minimal reset (box-sizing, body margin)
│
├── store/
│   └── useStore.js          # Global state + all actions (LocalStorage-backed)
│
├── data/
│   ├── movements.js         # 70+ movement definitions
│   ├── trees.js             # 11 skill tree definitions + mastery levels
│   ├── bossTests.js         # Boss test definitions
│   ├── sprint.js            # Sprint 1 week plan + foundation rotation
│   ├── annualProgram.js     # Full 52-week annual program
│   └── bonusQuests.js       # RANKS, XP helpers, 52-week bonus quest bank
│
└── pages/
    ├── DailyQuest.jsx       # Main daily quest screen + timer + bonus quest
    ├── SkillTrees.jsx       # Movement tree browser + mastery display
    ├── MovementDetail.jsx   # Single movement detail page
    ├── BossTests.jsx        # Boss test list + attempt/pass tracking
    ├── PainLog.jsx          # Daily pain logging + 7-day trend chart
    ├── TrainingPlan.jsx     # Full plan: annual, sprint, movements, bosses, rank road
    └── Settings.jsx         # Player name, week control, thresholds, reset

docs/
├── HANDBOOK.md              # User training handbook (this program's user doc)
└── DEVELOPER.md             # This file
```

---

## 3. Data Models

### Movement

Defined in `src/data/movements.js`. Each entry in the `MOVEMENTS` array:

```js
{
  id: string,                    // unique snake_case ID
  name: string,                  // display name (Portuguese)
  meaning: string,               // English translation
  tree: string,                  // matches a SKILL_TREES[].id
  tier: number,                  // 1–5 within the tree
  category: string[],            // ["kick"], ["floor"], ["base"], etc.
  prerequisites: string[],       // array of movement IDs required
  difficulty: number,            // 1–9 (maps to E/E+/D/D+/C/C+/B/A/S)
  physicalRequirements: string[], // e.g. ["hamstring flexibility", "hip rotation"]
  progressions: string[],        // ordered list of drill steps
  commonWeaknesses: string[],    // common form errors
  unlockTest: string | null,     // criteria to unlock (mastery level 2→3)
  masteryTest: string | null,    // criteria for full mastery (level 4→5)
  sourceUrl: string | null,      // Minhoquinho reference URL
  tutorialUrl: string | null,    // external tutorial URL
  videoUrl: string | null,       // reference video URL
  notes: string | null,          // coaching notes
}
```

### Skill Tree

Defined in `src/data/trees.js`:

```js
{
  id: string,         // matches Movement.tree
  name: string,       // display name
  icon: string,       // emoji
  color: string,      // hex color for tree accent
  description: string,
  maxTier: number,    // highest tier in this tree (used for rendering)
}
```

### Boss Test

Defined in `src/data/bossTests.js`:

```js
{
  id: string,
  name: string,
  subtitle: string,
  tree: string,
  tier: number,
  requirements: [
    {
      label: string,   // human-readable
      metric: string,  // what is being measured
      target: string,  // the passing standard
    }
  ],
  reward: string,      // description of what passing unlocks
  xp: number,         // XP awarded on pass
  isTemplate: boolean, // weekly boss template (not a named boss)
}
```

### Sprint Week

Defined in `src/data/sprint.js` as `SPRINT_1.weeks[]`:

```js
{
  week: number,
  theme: string,
  focus: string,     // one-sentence coaching cue
  skills: string[],  // movement IDs targeted this week
  boss: string,      // boss ID (optional)
  notes: string,     // coaching notes for the week
}
```

### Bonus Quest (runtime object returned by `buildBonusQuest`)

```js
{
  id: "bonus_quest",
  label: "BONUS QUEST",
  subtitle: string,    // "Sprint X · Month Y · Theme"
  goal: string,        // specific movement/skill being targeted
  focus: string,       // one-sentence coaching cue
  strength: Exercise[],
  conditioning: Exercise[],
  flexibility: Exercise[],
  xpReward: number,
  color: string,
  icon: string,
}
```

### Exercise (inside bonus quest sections)

```js
{
  id: string,          // unique within the week
  icon: string,        // emoji
  label: string,       // exercise name + volume (e.g. "Pike Push-Ups × 4×10")
  sets: string,        // detailed execution instructions
  why: string,         // rationale — why this exercise for this goal
}
```

### Annual Program Sprint

Defined in `src/data/annualProgram.js` as `ANNUAL_PROGRAM[]`:

```js
{
  id: string,
  number: number,         // 1–4
  name: string,
  title: string,
  weeks: number,          // number of weeks in this sprint
  weekRange: string,      // e.g. "Weeks 1–12"
  color: string,
  rankTarget: string,
  theme: string,
  philosophy: string,
  primaryGoals: string[],
  movements: string[],    // movement IDs featured this sprint
  bosses: string[],       // boss IDs in this sprint
  bonusFocus: string,
  weeklyBonusTheme: string[],
  byMonth: MonthSummary[],
  weeks: WeekDetail[],    // full week-by-week breakdown
}
```

---

## 4. State Management

All state lives in `src/store/useStore.js`. The hook returns `{ state, ...actions }`.

### State Shape

```js
{
  movementProgress: {
    [movementId]: {
      masteryLevel: number,   // 0–5
      reps: number,           // total logged reps
      lastPracticed: string,  // ISO date string
    }
  },
  painLog: [
    {
      date: string,           // ISO date string (YYYY-MM-DD)
      foot: number,           // 0–10
      knee: number,
      wrist: number,
      shoulder: number,
      lowerBack: number,
    }
  ],
  sessionLog: [
    {
      date: string,
      movements: string[],    // quest IDs completed
      xpEarned: number,
      notes: string,
    }
  ],
  bossProgress: {
    [bossId]: {
      passed: boolean,
      attempts: number,
      lastAttempt: string,    // ISO date
      passedDate: string | null,
    }
  },
  player: {
    name: string,
    totalXP: number,
    streakDays: number,
    lastTrainedDate: string,
    currentWeek: number,
    settings: {
      painThreshold: number,  // 0–10, gates high-pain adaptations
      vestWeight: number,     // kg, for display only
    }
  },
  todayQuest: {
    date: string,             // YYYY-MM-DD — resets daily
    completed: string[],      // quest IDs completed today
    skipped: string[],
    bonusCompleted: boolean,
  },
  settings: {
    hunterName: string,
    painThreshold: number,
    vestWeight: number,
  }
}
```

### Actions

```js
// Movement mastery
setMasteryLevel(movementId: string, level: number): void
incrementReps(movementId: string, count: number): void

// Pain logging
logPain(painData: { foot, knee, wrist, shoulder, lowerBack }): void
getTodayPain(): PainEntry | null
getRecentPainTrend(region: string, days: number): number[]

// Quest management
completeQuestItem(questId: string): void         // toggles — adds if absent, removes if present
completeBonusQuest(xpAmount: number): void
completeAllQuestsAndLog(questIds: string[]): void // used by auto-complete at noon

// Session logging
logSession({ movements, xpEarned, notes }): void

// Boss tests
passBoss(bossId: string, xpReward: number): void
recordBossAttempt(bossId: string): void
isBossPassed(bossId: string): boolean

// Settings + week
updateSettings(partial: Partial<settings>): void
setCurrentWeek(week: number): void
advanceWeek(): void                              // increments currentWeek by 1

// Derived (computed, not stored)
getUnlockedMovementIds(): string[]
getMasteryLevel(movementId: string): number      // returns 0 if not started

// Reset
resetAll(): void                                 // wipes all state to defaults
```

### LocalStorage Persistence

The store serializes the entire state object to JSON on every mutation:

```js
const STORAGE_KEY = "solo_leveling_state_v1";
// On load: JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_STATE
// On every action: localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
```

To migrate state schema: change `STORAGE_KEY` to a new version string and provide a migration function that transforms old state to new state on first load.

### Unlock Logic

`getUnlockedMovementIds()` returns movement IDs where all prerequisites have mastery ≥ 3:

```js
MOVEMENTS.filter(m =>
  m.prerequisites.every(prereqId =>
    (state.movementProgress[prereqId]?.masteryLevel || 0) >= 3
  )
).map(m => m.id)
```

Movements with empty prerequisites arrays are always unlocked (Tier 1 foundational movements).

---

## 5. Component Reference

### `App.jsx`

Root component. Owns `page` and `selectedMovement` state. Renders the header, active page, and bottom navigation.

**Props:** none  
**Navigation:** `navigate(page: string, data?: any)` — navigates to a page, optionally passing data (used for `navigate("movement", movementId)`)  
**Active nav highlight:** `movement` page highlights `trees` or `plan` depending on origin context.

### `DailyQuest.jsx`

Main training screen. Builds quests via `buildDailyQuests(store)`, renders quest items, bonus quest, timer, sprint progress, and session log button.

**Key internals:**
- `buildDailyQuests(store)` — pure function, returns 5-item quest array
- `useAutoComplete(quests, store, questState)` — `useEffect` that sets a `setTimeout` to fire noon auto-complete
- `msUntilAutoComplete()` — returns ms until next noon
- `Timer` component — internal, not exported. Owns its own `seconds`, `running`, `target` state.

**Flow conditioning quest:** dynamically built from `unlockedIds` and `FLOW_TIERS` constant. Falls back to foundation loop if nothing is unlocked.

### `SkillTrees.jsx`

Browses movements by tree. Imports `DiffRankBadge` from `TrainingPlan.jsx`.

**Props:** `{ store, navigate }`  
**Key state:** `activeTree` (string)  
**Movement card click:** calls `navigate("movement", movement.id)`

### `MovementDetail.jsx`

Full detail view for a single movement. Imports `DiffRankBadge` and `DIFF_RANK` from `TrainingPlan.jsx`.

**Props:** `{ movementId: string, store, navigate }`

### `TrainingPlan.jsx`

The largest component. Exports `DiffRankBadge` and `DIFF_RANK` (used by `SkillTrees` and `MovementDetail`).

**Exported:**
```js
export const DIFF_RANK  // { [1-9]: { rank, label, color, bg } }
export function DiffRankBadge({ difficulty, size })
```

**Tabs:** `year1` | `sprint1` | `weeks` | `movements` | `bosses` | `rankroad`

**`AnnualTab`:** renders `ANNUAL_PROGRAM` with 52-week pixel timeline, monthly calendar, sprint cards with drill-down (philosophy, by-month, goals, bosses, bonus themes, movements, collapsible week-by-week).

### `PainLog.jsx`

**Props:** `{ store }`  
Renders 5 pain sliders (0–10), real-time training guidance per region, 7-day foot trend chart (canvas-free, CSS bar chart), and pain history list.

### `BossTests.jsx`

**Props:** `{ store, navigate }`  
Renders all `BOSS_TESTS`. Each card shows requirements, pass status, attempt count. Pass / fail buttons call store actions.

### `Settings.jsx`

**Props:** `{ store }`  
Hunter name input, week selector (calls `store.setCurrentWeek`), pain threshold slider, vest weight slider, Minhoquinho reference links, reset all button.

---

## 6. Data Layer Reference

### `src/data/movements.js`

```js
export const MOVEMENTS: Movement[]
export function getMovementById(id: string): Movement | undefined
export function getMovementsByTree(tree: string): Movement[]
export function getMovementsByTier(tier: number): Movement[]
export function getUnlockedMovements(unlockedIds: string[]): Movement[]
```

### `src/data/trees.js`

```js
export const SKILL_TREES: SkillTree[]
export const MASTERY_LEVELS: { level: number, label: string, color: string }[]
```

### `src/data/bossTests.js`

```js
export const BOSS_TESTS: BossTest[]
```

### `src/data/sprint.js`

```js
export const SPRINT_1: {
  name: string,
  weeks: SprintWeek[],   // 12 items
}
export const FOUNDATION_ROTATION: {
  [0-6]: {               // 0 = Sunday
    label: string,
    duration: number,
    movements: string[], // movement IDs
  }
}
export const DAILY_QUEST_STRUCTURE: QuestSlotDefinition[]
```

### `src/data/annualProgram.js`

```js
export const ANNUAL_PROGRAM: Sprint[]    // 4 sprints
export const MONTHLY_OVERVIEW: MonthSummary[]  // 12 months
```

### `src/data/bonusQuests.js`

```js
export const RANKS: Rank[]
export function getRank(level: number): Rank
export function getNextRank(level: number): Rank | null
export function getLevelFromXP(xp: number): number
export function getXPForLevel(level: number): number
export function getLevelProgress(xp: number): { level: number, pct: number }
export function buildBonusQuest(week: number, dow: number, level: number): BonusQuest
```

`buildBonusQuest` clamps `week` to `[1, 52]`, falls back to Week 1 if the key is missing. `dow` (0–6) is currently unused in the new structure but retained in the signature for future day-of-week modifiers.

---

## 7. XP & Progression System

### Level Formula

```js
level = Math.floor(totalXP / 100) + 1
```

Level 1 = 0 XP. Level 2 = 100 XP. Level N = (N-1) × 100 XP. Linear — no curve.

### Rank Thresholds

```js
const RANKS = [
  { rank: "F", minLevel: 1   },
  { rank: "E", minLevel: 30  },  // 2,900 XP
  { rank: "D", minLevel: 70  },  // 6,900 XP
  { rank: "C", minLevel: 120 },  // 11,900 XP
  { rank: "B", minLevel: 180 },  // 17,900 XP
  { rank: "A", minLevel: 250 },  // 24,900 XP
  { rank: "S", minLevel: 330 },  // 32,900 XP
]
```

### Difficulty-to-Rank Mapping

```js
const DIFF_RANK = {
  1: { rank: "E",  label: "E-rank",  color: "#94a3b8", bg: "#1e293b" },
  2: { rank: "E+", label: "E+-rank", color: "#60a5fa", bg: "#1e3a5f" },
  3: { rank: "D",  label: "D-rank",  color: "#34d399", bg: "#064e3b" },
  4: { rank: "D+", label: "D+-rank", color: "#6ee7b7", bg: "#065f46" },
  5: { rank: "C",  label: "C-rank",  color: "#fbbf24", bg: "#451a03" },
  6: { rank: "C+", label: "C+-rank", color: "#fcd34d", bg: "#422006" },
  7: { rank: "B",  label: "B-rank",  color: "#fb923c", bg: "#431407" },
  8: { rank: "A",  label: "A-rank",  color: "#f472b6", bg: "#500724" },
  9: { rank: "S",  label: "S-rank",  color: "#a78bfa", bg: "#2e1065" },
}
```

---

## 8. Quest Generation System

`buildDailyQuests(store)` in `DailyQuest.jsx` generates the 5-slot quest array on every render. It is a pure function (no side effects, deterministic given the same store state and current time).

### Generation Logic

```
1. Get today's DOW (0–6)
2. Look up FOUNDATION_ROTATION[dow] for Slot 2
3. Get unlockedIds from store
4. Get todayPain from store (getTodayPain())
5. Set highPain = foot > 3 || knee > 3 || wrist > 3
6. Get player.currentWeek, look up SPRINT_1.weeks[week-1]
7. Filter sprint week skills to only unlocked IDs
8. Build 5 quest objects
```

### Flow Conditioning Quest Generation

```js
const FLOW_TIERS = [
  { ids: ["ginga", "cocorinha", "esquiva_baixa"], label: "Foundation loop" },
  { ids: ["negativa", "role", "esquiva_paralela"], label: "Low game entries" },
  { ids: ["meia_lua_de_frente", "queixada", "armada"], label: "Base kicks" },
  { ids: ["meia_lua_de_compasso"], label: "MLDC" },
  { ids: ["au_basico", "au_controlado"], label: "Au" },
  { ids: ["bananeira_wall", "bananeira_wall_30s"], label: "Inversion" },
  { ids: ["corta_capim", "rasteira", "tesoura_de_angola"], label: "Sweeps" },
  { ids: ["queda_de_rins_prep", "queda_de_rins_5s"], label: "Floor balance" },
]
```

For each tier, only `available` IDs (intersection with `unlockedIds`) are included. Each available tier becomes one round in the flow sequence. The final 2 minutes are always a free-form chain of everything.

### Auto-Complete

`useAutoComplete` sets a single `setTimeout` to fire at the next noon. On fire:
- If not already completed, calls `store.completeAllQuestsAndLog(questIds)`
- Uses a `firedRef` to prevent double-fire

```js
function msUntilAutoComplete() {
  const noon = new Date();
  noon.setHours(12, 0, 0, 0);
  if (noon <= new Date()) noon.setDate(noon.getDate() + 1);
  return noon.getTime() - Date.now();
}
```

---

## 9. Bonus Quest System

### Weekly Bonus Bank (`WEEKLY_BONUS`)

A plain object keyed by week number (1–52). Each value has the shape:

```js
{
  goal: string,          // specific movement/skill this week targets
  block: string,         // "Sprint X · Month Y"
  theme: string,         // descriptive theme for the week
  focus: string,         // one-sentence coaching cue
  strength: Exercise[],  // 2–3 exercises
  conditioning: Exercise[], // 1–2 drills
  flexibility: Exercise[], // 1–2 stretches
  xpBonus: number,       // base XP for completing this week's bonus
}
```

### `buildBonusQuest(week, dow, level)`

```js
function buildBonusQuest(week, dow, level) {
  const weekKey = Math.min(Math.max(1, week), 52);
  const weekBonus = WEEKLY_BONUS[weekKey] || WEEKLY_BONUS[1];

  const levelTier = Math.floor(level / 30);  // 0 at level 1, 1 at level 30, etc.
  const totalXP = weekBonus.xpBonus + levelTier * 25;

  return {
    id: "bonus_quest",
    label: "BONUS QUEST",
    subtitle: `${weekBonus.block} · ${weekBonus.theme}`,
    goal: weekBonus.goal,
    focus: weekBonus.focus,
    strength: weekBonus.strength || [],
    conditioning: weekBonus.conditioning || [],
    flexibility: weekBonus.flexibility || [],
    xpReward: totalXP,
    color: "#7c3aed",
    icon: "⚡",
  };
}
```

`dow` is currently unused but retained for future day-of-week micro-bonus layers.

### Rendering in `DailyQuest.jsx`

The bonus quest section renders three labeled sections:

```jsx
[
  { key: "strength",    label: "💪 STRENGTH",    color: "#f97316" },
  { key: "conditioning",label: "🔥 CONDITIONING",color: "#f87171" },
  { key: "flexibility", label: "🧘 FLEXIBILITY",  color: "#38bdf8" },
].map(({ key, label, color, items: bonusQuest[key] }) =>
  items.length > 0 && (
    <div>
      <div className="section-label">{label}</div>
      {items.map(ex => <ExerciseCard ex={ex} />)}
    </div>
  )
)
```

---

## 10. Extending the App

### Adding a New Movement

1. Add an entry to the `MOVEMENTS` array in `src/data/movements.js`
2. Set `prerequisites` to existing movement IDs (empty array = always unlocked)
3. Set `tree` to match an existing `SKILL_TREES[].id`
4. Set `tier` to the appropriate tier within that tree
5. Add `difficulty` 1–9

The movement will automatically appear in:
- Skill Trees page (in the correct tree + tier)
- Movement detail page (via navigate)
- Flow conditioning quest (if its ID is in `FLOW_TIERS`)
- Sprint week skill list (if referenced in `sprint.js`)

### Adding a New Skill Tree

1. Add an entry to `SKILL_TREES` in `src/data/trees.js`
2. Set `id`, `name`, `icon`, `color`, `description`, `maxTier`
3. Add movements with `tree: yourNewTreeId`

### Adding a New Boss Test

1. Add an entry to `BOSS_TESTS` in `src/data/bossTests.js`
2. Reference it in the relevant sprint week's `boss` field in `sprint.js` or `annualProgram.js`

### Adding a New Sprint Week

1. Edit `SPRINT_1.weeks` in `src/data/sprint.js`
2. Add the week's `theme`, `focus`, `skills`, `boss`, and `notes`
3. Add the corresponding entry to `WEEKLY_BONUS` in `bonusQuests.js`

### Modifying the XP Curve

The level formula is in `useStore.js`:
```js
// Anywhere getLevelFromXP is used:
Math.floor(totalXP / 100) + 1
```

Also update `getLevelFromXP` in `bonusQuests.js` (same formula, used for display). Both must match. If you change the formula, update `STORAGE_KEY` to force a state reset for existing users.

### Adding a New Page

1. Create `src/pages/NewPage.jsx`
2. Import and render it in `App.jsx` under a new `page` condition
3. Add a nav button in the bottom nav array (if it should be top-level)
4. Call `navigate("newpage")` from anywhere to navigate to it

### Changing the Persistence Key

```js
// src/store/useStore.js
const STORAGE_KEY = "solo_leveling_state_v2"; // bump version
```

Bumping the key wipes existing state. Provide a migration function if existing user data must be preserved:

```js
function migrateState(oldState) {
  // transform v1 → v2 fields
  return { ...oldState, newField: defaultValue };
}

const raw = localStorage.getItem("solo_leveling_state_v1");
const migrated = raw ? migrateState(JSON.parse(raw)) : null;
const initialState = migrated || DEFAULT_STATE;
```

---

## 11. Build & Development

### Prerequisites

- Node.js 18+
- npm 9+

### Development

```bash
npm install
npm run dev          # starts Vite dev server at localhost:5173
```

### Production Build

```bash
npm run build        # outputs to dist/
npm run preview      # serves dist/ locally for verification
```

### Bundle Size (current)

```
dist/assets/index.js    ~407 kB raw / ~111 kB gzip
dist/assets/index.css   ~9.7 kB raw / ~2.5 kB gzip
```

The JS bundle is large primarily because `annualProgram.js` and `bonusQuests.js` contain large inline data objects (52 weeks of detailed exercise programming). If bundle size becomes a concern, these can be split into lazy-loaded chunks or moved to a separate JSON file loaded at runtime.

### Environment

No environment variables. The app is fully self-contained. No `.env` files required.

---

## 12. Design System

All design tokens are CSS custom properties in `App.css`:

### Color Tokens

```css
:root {
  --bg:       #0a0a0f;   /* page background */
  --bg2:      #111118;   /* card background */
  --bg3:      #1a1a24;   /* elevated card */
  --border:   #2a2a3a;   /* card borders */
  --text:     #e2e8f0;   /* primary text */
  --text2:    #94a3b8;   /* secondary text */
  --text3:    #475569;   /* tertiary / hint text */
  --accent:   #7c3aed;   /* purple — primary action */
  --green:    #10b981;   /* success / mastered */
  --yellow:   #f59e0b;   /* warning / C-rank */
  --red:      #ef4444;   /* pain / danger */
}
```

### Rank Colors

Each rank has a specific color used for badges, progress bars, and accents:

```
F: #6b7280 (gray)
E: #3b82f6 (blue)
D: #10b981 (green)
C: #f59e0b (amber)
B: #f97316 (orange)
A: #ec4899 (pink)
S: #7c3aed (purple)
```

### Component Classes

Key CSS classes in `App.css`:

| Class | Description |
|-------|-------------|
| `.page` | Page wrapper — padding, flex column layout |
| `.card` | Base card — bg2 background, border, border-radius |
| `.card-header` | Flex row with title + subtitle |
| `.btn` | Base button |
| `.btn-primary` | Accent-colored button |
| `.btn-secondary` | Muted/outline button |
| `.btn-success` | Green success button |
| `.btn-full` | Full-width button |
| `.btn-sm` | Small button |
| `.quest-item` | Quest card wrapper |
| `.quest-item.done` | Quest card in completed state |
| `.quest-check` | The circular checkbox |
| `.quest-check.checked` | Checked state (green fill) |
| `.progress-bar` | Progress bar track |
| `.progress-fill` | Progress bar fill |
| `.tier-badge` | Tier number chip (T1–T5) |
| `.mastery-dots` | Five-dot mastery indicator container |
| `.mastery-dot` | Individual dot |
| `.mastery-dot.filled` | In-progress dot |
| `.mastery-dot.mastered` | Gold mastered dot |
| `.movement-card` | Movement list item in Skill Trees |
| `.movement-card.locked` | Grayed-out locked state |
| `.tree-tab` | Tree selector tab |
| `.tree-tab.active` | Active tree tab |
| `.nav-btn` | Bottom navigation button |
| `.nav-btn.active` | Active nav state |
| `.timer-display` | Large monospace time display |
| `.sprint-week` | Week dot grid container |
| `.week-dot` | Individual sprint week dot |
| `.week-dot.current` | Current week highlight |
| `.week-dot.done` | Completed week |
| `.chip` | Inline label chip |
| `.chip-locked` through `.chip-mastered` | Mastery level chip colors |

### Typography Scale

The app uses no custom fonts — system monospace for the timer display, system sans-serif elsewhere. Font sizes follow a loose scale:

```css
9px   — metadata, hints, tertiary labels
10px  — secondary labels, why text
11px  — body copy in quest items, movement items
12px  — standard body
13px  — emphasized body, exercise labels
14px  — card titles, section labels
15px  — page sub-headers
18px  — large stats, rank numbers
22px  — XP header level
32px  — tree icons
```

---

*Solo Leveling: Capoeira — Developer Documentation*  
*Stack: Vite 8 · React 18 · Plain CSS · LocalStorage*
