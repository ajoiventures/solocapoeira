# Linear Setup Guide — Solo Leveling

**Goal:** Set up Linear as the single source of truth for all project work.

---

## 1. Initial Setup (5 min)

1. Go to **linear.app** → Sign up
2. Create workspace: **Solo Leveling**
3. Create team: **Engineering**
4. Add yourself as the only team member (add others when they join)
5. Create project: **Solo Leveling** (key: `SL`)

---

## 2. Configure States

Go to **Project Settings → Workflow → States**

Create these states in order:
- **Backlog** (gray) — not yet started
- **Todo** (gray) — ready to start, in backlog sprint
- **In Progress** (blue) — actively working
- **In Review** (purple) — waiting on external (Sentry setup, deploy, etc.)
- **Done** (green) — shipped and verified

---

## 3. Set Up Cycles

Go to **Project Settings → Cycles**

Create cycles matching Sprints:
- **Phase A — Foundation** (2 weeks) — Tests, CI/CD, auth, error monitoring
- **Phase B — Core Loop** (2 weeks) — State mgmt, rep logging, progression
- **Phase C — Performance** (2 weeks) — Virtual scroll, React.memo, Lighthouse
- **Phase D — Polish** (2 weeks) — Accessibility, tooltips, combo builder, E2E tests

---

## 4. Create Labels

Go to **Project Settings → Labels**

Create these (used for filtering):
- **Infrastructure** (purple) — database, auth, monitoring, CI/CD
- **Frontend** (blue) — UI, components, styling
- **Testing** (green) — unit tests, E2E, QA
- **Data** (orange) — game data, content, migrations
- **Performance** (red) — optimization, bundle size, render efficiency
- **Docs** (gray) — handbook, guides, documentation
- **Blocked** (red) — waiting on external dependency
- **High Risk** (orange) — refactoring, major rewrites

---

## 5. GitHub Integration

Go to **Project Settings → Integrations → GitHub**

Connect your GitHub repo:
- Repo: `paulirumudomon/Solo-Leveling` (or your fork)
- Auto-link PRs by issue key (e.g., `SL-42` in commit → auto-links)
- When PR merges → auto-mark ticket Done

---

## 6. Slack Integration (Optional)

Go to **Workspace Settings → Integrations → Slack**

- Get updates when tickets move to In Progress / Done
- Daily digest of your assigned tickets

---

## 7. Create All Phase A Tickets

Copy each ticket below, create in Linear with these fields:

**Template:**
- **Title:** [from below]
- **Description:** [from below]
- **Cycle:** Phase A — Foundation
- **Priority:** High (unless noted)
- **Labels:** [from below]
- **Estimate:** [from below, in story points: 1/2/3/5/8]

---

### Phase A Tickets

#### A-INF-01: Supabase + Auth
- **Title:** Set up Supabase cloud database + email magic link auth
- **Description:** Create Supabase project, user_state table with RLS policy, email auth flow. Settings page shows Cloud Sync card when env vars loaded.
- **Labels:** Infrastructure
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** User can sign in with email, Cloud Sync card appears, state saves to Supabase

#### A-INF-02: Sentry Error Monitoring
- **Title:** Wire Sentry for automatic error reporting
- **Description:** Install @sentry/react, init in main.jsx, wrap app in ErrorBoundary. Test: throw error in app, verify appears in Sentry dashboard.
- **Labels:** Infrastructure
- **Priority:** High
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** Sentry dashboard shows test error, ErrorBoundary shows branded fallback

#### A-INF-03: PostHog Analytics
- **Title:** Set up PostHog event tracking
- **Description:** Install posthog-js, init in main.jsx, wire 12 core events (repsLogged, masteryAdvanced, sessionCompleted, etc.) into store actions.
- **Labels:** Infrastructure, Data
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** posthog.com dashboard shows live events when you log reps

#### A-INF-04: GitHub Actions CI/CD
- **Title:** Automate tests, lint, build, and deploy on push
- **Description:** Create .github/workflows/ci.yml (test + build on PR), deploy.yml (auto-deploy to Vercel/Netlify on merge to main).
- **Labels:** Infrastructure
- **Priority:** High
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** Green checkmark on GitHub PR, auto-deploy on merge

#### A-INF-05: Code Splitting & Bundle Optimization
- **Title:** Set up code splitting and tree-shaking
- **Description:** Configure Vite for dynamic imports, lazy-load pages, verify bundle < 200KB gzipped. Run `npm run build` and check dist/ size.
- **Labels:** Performance, Infrastructure
- **Priority:** Medium
- **Estimate:** 2
- **Blocked:** False
- **Done When:** dist/ bundle < 200KB, lighthouse score > 90

#### A-ENG-01: Split useStore.js (1400 lines)
- **Title:** Refactor useStore.js into domain slices
- **Description:** Extract usePlayerStore, useMovementStore, useBossStore, useRecoveryStore, useSessionStore. Each handles its own state + actions.
- **Labels:** Frontend, High Risk
- **Priority:** High
- **Estimate:** 8
- **Dependencies:** None (but risky)
- **Done When:** All 118 tests pass, no perf regression

#### A-ENG-02: Split DailyQuest.jsx (1900 lines)
- **Title:** Extract DailyQuest subcomponents
- **Description:** Pull out FlowSessionCard, DailyBonusChallenge, SessionLogBlock as standalone .jsx files. Keep state in parent.
- **Labels:** Frontend
- **Priority:** High
- **Estimate:** 5
- **Dependencies:** A-ENG-01
- **Done When:** File < 500 lines, tests pass, no visual changes

#### A-ENG-03: Add React.memo to high-churn components
- **Title:** Optimize re-renders with React.memo
- **Description:** Memo MovementCard (custom comparator), BossCard, StatCard. Log before/after renders with React DevTools Profiler.
- **Labels:** Performance
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** MovementCard re-renders only when own data changes

#### A-ENG-04: Remove !important from CSS
- **Title:** Increase CSS specificity, remove !important declarations
- **Description:** Audit App.css, find 8 !important instances, increase selector specificity instead (e.g., `.app.layout-desktop` instead of `.app-header !important`).
- **Labels:** Frontend
- **Priority:** Medium
- **Estimate:** 1
- **Dependencies:** None
- **Done When:** 0 !important except prefers-reduced-motion

#### A-QA-01: Unit Test Coverage for Game Logic
- **Title:** Write Vitest unit tests for gameLogic.js
- **Description:** Test computeVIG(), computeMasteryLevel(), computePrestigeMultiplier(). Snapshot game logic outputs. Target: 30+ tests.
- **Labels:** Testing
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** 30+ tests, all passing, snapshots locked

#### A-QA-02: Data Integrity Snapshots
- **Title:** Lock data counts and shapes with snapshot tests
- **Description:** Vitest snapshots for MOVEMENTS (238), ACHIEVEMENTS (25), Mestres (43), Orishas (16). Any rename/add/remove fails the test.
- **Labels:** Testing, Data
- **Priority:** High
- **Estimate:** 2
- **Dependencies:** A-QA-01
- **Done When:** 19 snapshot tests, all passing

#### A-QA-03: Accessibility Audit & Fixes
- **Title:** WCAG AA compliance (aria-labels, focus rings, keyboard nav)
- **Description:** Add aria-label to nav, aria-current="page", :focus-visible ring, .sr-only utility, skip-to-content link.
- **Labels:** Testing, Frontend
- **Priority:** Medium
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** axe scan passes, keyboard-only nav works

#### A-QA-04: E2E Smoke Tests with Playwright
- **Title:** Write critical path E2E tests
- **Description:** 11 tests across app load, navigation, rep logging, search, settings, resilience. Run in CI after unit tests.
- **Labels:** Testing
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** All 11 tests pass, CI runs them on every push

#### A-QA-05: Lighthouse Performance Audit
- **Title:** Hit Lighthouse targets: LCP < 2.5s, CLS < 0.1, bundle < 200KB
- **Description:** Run lighthouse locally, identify bottlenecks, optimize images, virtual scroll, code split. Target: 90+ on all metrics.
- **Labels:** Performance, Testing
- **Priority:** High
- **Estimate:** 5
- **Dependencies:** A-INF-05, A-ENG-03
- **Done When:** Lighthouse score 90+, all metrics green

---

### Phase B Tickets (create in Backlog, assign to cycle later)

#### B-ENG-05: Virtual Scroll on Movement List
- **Title:** Add windowing to search results (cap at 40 visible)
- **Description:** Use custom windowing (not a library), render only 40 movements at a time in search, show "40 of N" hint.
- **Labels:** Performance, Frontend
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** Search with 100+ results only renders 40, smooth scroll

#### B-ENG-06: localStorage Quota Protection
- **Title:** Guard against localStorage quota exceeded
- **Description:** Estimate bytes, warn at 3MB, auto-trim repLog/sessionLog before hard limit. Never crash the app.
- **Labels:** Frontend
- **Priority:** Medium
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** QuotaExceededError caught and handled gracefully

#### B-ENG-07: State Migration System
- **Title:** Create versioned state migrations
- **Description:** Add STATE_VERSION = 2, MIGRATIONS array. Each migration is one-directional, runs once on old saves.
- **Labels:** Frontend, Data
- **Priority:** Medium
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** Schema changes don't break old saves

#### B-UX-01: First-Use Contextual Tooltips
- **Title:** Add FirstUseTooltip component
- **Description:** Show once-per-id tooltips on first visit (ginga +5 button, mastery filters). Persist dismissal to localStorage.
- **Labels:** Frontend
- **Priority:** Medium
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** Tooltips appear once per feature, then never again

#### B-UX-02: Cloud Sync Auth UI
- **Title:** Email magic link sign-in card in Settings
- **Description:** Settings → Cloud Sync card. Email input → "Send link" button → "Check your email" confirmation. Auto-fetch cloud state on sign-in.
- **Labels:** Frontend, Infrastructure
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** A-INF-01
- **Done When:** User can sign in with email, state syncs to cloud, Supabase row appears

#### B-OPS-01: GDPR Data Deletion
- **Title:** "Delete all my data" button in Settings
- **Description:** Two-step confirmation, names exactly what's deleted (reps, mastery, sessions, etc.), clears localStorage on confirm.
- **Labels:** Frontend, Infrastructure
- **Priority:** High
- **Estimate:** 1
- **Dependencies:** None
- **Done When:** Button works, localStorage clears, app resets to Day 0

---

### Phase C Tickets

#### C-CNT-01: Sprint 2 Program (Weeks 13–24)
- **Title:** Write 12-week Sprint 2 curriculum
- **Description:** Kicks + Defence + Combat Rhythm. 12 weeks, drills per week, quality standards, conditioning rounds. JSON format matching Sprint 1.
- **Labels:** Data
- **Priority:** High
- **Estimate:** 5
- **Dependencies:** None
- **Done When:** SPRINT_2 export exists, 12 weeks, all fields match Sprint 1 structure

#### C-CNT-02: Movement Anatomy Guide
- **Title:** Map all 238 movements to primary/secondary muscles
- **Description:** muscleMap.js with {primary: [], secondary: []} for every movement. Render in MovementDetail card.
- **Labels:** Data, Frontend
- **Priority:** Medium
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** Anatomy card renders in MovementDetail, all 238 movements mapped

#### C-GAM-01: Combo Builder UI
- **Title:** Build combo chaining + practice mode
- **Description:** ComboBuilder page: build 2-8 movement combos, tag (offensive/defensive), practice step-by-step with progress dots.
- **Labels:** Frontend, Data
- **Priority:** Medium
- **Estimate:** 5
- **Dependencies:** None
- **Done When:** Can create, list, delete, and practice combos

#### C-GAM-02: Flow Session Improvements
- **Title:** Add visual feedback to FlowSession
- **Description:** Progress bar, timer visual, achievement popup, mastery unlock animation.
- **Labels:** Frontend
- **Priority:** Medium
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** Animations smooth, 60fps, feels rewarding

---

### Phase D Tickets

#### D-OPS-01: Pre-Ship Checklist
- **Title:** qa.html — interactive QA checklist
- **Description:** 46 checks across visual, interaction, mobile, a11y, performance, error states. Live scoring, localStorage persistence.
- **Labels:** Testing, Frontend
- **Priority:** High
- **Estimate:** 3
- **Dependencies:** None
- **Done When:** qa.html loads, checks persist, letter grades update

#### D-OPS-02: Handbook Living Document
- **Title:** handbook.html — product development reference
- **Description:** 6 written chapters + 8 stubs. Covers core loop, AI workflow, project anatomy, week one, retention, shipping.
- **Labels:** Docs, Frontend
- **Priority:** Medium
- **Estimate:** 5
- **Dependencies:** None
- **Done When:** handbook.html has all 6 chapters, sidebar nav works

#### D-OPS-03: Tools Reference Page
- **Title:** tools.html — complete dev toolkit reference
- **Description:** All infrastructure (Supabase, Sentry, PostHog, GitHub), dev stack (React, Vite, TypeScript, Vitest, Playwright), game data (movements, achievements, etc.).
- **Labels:** Docs, Frontend
- **Priority:** Low
- **Estimate:** 2
- **Dependencies:** None
- **Done When:** tools.html lists all 15+ tools with links and descriptions

---

## 8. Set Up Views

Go to **Project** and create these views:

### View 1: All Work (Table)
- **Name:** All Work
- **Type:** Table
- **Sort:** Priority DESC, then Due Date ASC
- **Group:** None
- **Filters:** None (shows everything)

### View 2: This Cycle (Board)
- **Name:** This Cycle
- **Type:** Board
- **Group By:** State (Backlog, Todo, In Progress, In Review, Done)
- **Filter:** Cycle = Current Cycle
- **Order:** Due Date

### View 3: Blocked Issues
- **Name:** Blocked
- **Type:** Table
- **Filter:** Label = Blocked
- **Sort:** Priority DESC

### View 4: High Risk Refactors
- **Name:** High Risk
- **Type:** Table
- **Filter:** Label = High Risk
- **Sort:** Estimate DESC

---

## 9. Automate with Cycles

Set up automatic cycle scheduling:

1. **Phase A — Foundation** (2 weeks starting now)
   - Tickets: A-INF-01 through A-QA-05
   - Auto-start when all Phase A-ENG-04 marked Done

2. **Phase B — Core Loop** (2 weeks)
   - Tickets: B-ENG-05 through B-OPS-01
   - Blocks: Phase A complete

3. **Phase C — Performance** (2 weeks)
   - Tickets: C-CNT-01 through C-GAM-02

4. **Phase D — Polish** (2 weeks)
   - Tickets: D-OPS-01 through D-OPS-03

---

## 10. Set Default Issue Template

Go to **Project Settings → Issue Templates**

Create default template:

```
## Summary
[1-2 sentence description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass

## Technical Notes
[any architecture, dependencies, or gotchas]

## Related
SL-XX (link other tickets)
```

---

## 11. Keyboard Shortcuts & Quick Links

Save these:

| Action | Keyboard |
|---|---|
| New issue | `Cmd+N` or `Ctrl+N` |
| Search | `Cmd+K` or `Ctrl+K` |
| Cycle view | `V` then `C` |
| Your work | `V` then `M` |

---

## 12. Workflow Rules (Optional but Recommended)

Go to **Project Settings → Automations**

Create these rules:

**Rule 1:** When cycle starts → move all Todo issues to In Progress? No. Keep as Todo and let you pull them manually.

**Rule 2:** When GitHub PR merged with `SL-XX` in commit → move SL-XX to Done. YES, enable this.

**Rule 3:** When issue has label "In Review" → notify you in Slack. YES, enable this.

---

## 13. First Session

1. Open **All Work** view
2. Click **Phase A — Foundation** cycle
3. See all Phase A tickets
4. Click on A-INF-01 (Supabase)
5. Change state → **Todo** (it's in Backlog by default)
6. Change state → **In Progress** when you start
7. Link GitHub PR: `SL-1` in commit message auto-links
8. When done → change to **Done**, PR auto-closes the issue

---

## 14. Daily Ritual

Every morning:

1. Open **This Cycle** board view
2. See **In Progress** column → what you're working on
3. See **Todo** column → what's next
4. See **Done** column → what shipped yesterday

---

## Pro Tips

- **Estimates:** 1=30min, 2=1hr, 3=2hrs, 5=half-day, 8=full-day
- **Priority:** Only mark 3-4 things "High" per cycle. Rest are Medium.
- **Dependencies:** Use them liberally — helps you unblock yourself
- **Comments:** Add context as you work, helps future-you and future teammates
- **Labels:** Overuse them for filtering. You'll want to slice by Frontend + High Risk, etc.

---

## Next: Notion or Handbook?

Once Phase A ships, you can decide:
- **Keep Linear** as the ticketing system, **handbook.html** as the playbook
- **Move to Notion** if you hire and want cross-functional planning (design specs, roadmap, etc.)

For now: Linear for work, handbook.html for "how we do work."

---

## Done!

You now have:
- ✅ Workspace + Team + Project
- ✅ All 35+ Phase A-D tickets
- ✅ Cycles and automation
- ✅ GitHub integration
- ✅ Views for different workflows

**Next step:** Open linear.app and start creating these tickets. Takes ~30 min to enter them all.

