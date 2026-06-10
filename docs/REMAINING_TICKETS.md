# Solo Leveling — Remaining Tickets & Roadmap

## Summary
- **Completed**: 131 tickets on the public board.
- **Blocked**: 2 platform/workflow items (`A-INF-05`, `A-QA-05`).
- **Current batch**: stabilization and ticket reconciliation before more content expansion.
- **Next build order**: architecture split, PWA verification, then mobile/accessibility polish.

---

## Stabilization Batch — Execute First

These tickets prevent the repeated loop where new feature work starts while the gates and project surfaces disagree.

- **A-PM-04**: Reconcile ticket board and execution order.
  - `tickets.html`, this roadmap, and the handbook must agree on the next sequence.
  - Web/PWA remains first; app wrapper work comes after production reliability is proven.

- **A-QA-07**: Restore clean local QA gate.
  - `npm run lint -- --quiet` must pass.
  - React purity, stale imports, and generated test artifact noise must be fixed before feature batches.

- **A-OPS-04**: Generated artifact hygiene.
  - Ignore `test-results/` and `playwright-report/`.
  - Playwright runs must not create commit/deploy loops.

## Next Execution Batches

### Batch 1 — Architecture Debt
- **A-ENG-01**: Split `useStore.js` into domain slices.
  - **A-ENG-01a done**: Extracted persistence/default state/migrations/cloud push into `src/store/storePersistence.js`.
  - **A-ENG-01b done**: Extracted achievement/rank post-update effects into `src/store/storeUpdatePipeline.js`.
  - **A-ENG-01c done**: Extracted movement action callbacks into `src/store/useMovementActions.js`.
  - **A-ENG-01d done**: Extracted boss test action callbacks into `src/store/useBossActions.js`.
  - **A-ENG-01e done**: Extracted recovery/session action callbacks into `src/store/useRecoveryActions.js`.
  - **A-ENG-01f done**: Extracted daily quest action callbacks into `src/store/useQuestActions.js`.
  - Next: sequence, settings/reset, and prestige action slices.
- **A-ENG-02**: Split `DailyQuest.jsx`; mount or remove retained legacy cards during extraction.
- **B-ENG-08**: Memo/callback audit after store boundaries are stable.

### Batch 2 — PWA Reliability
- **B-OPS-03**: Offline-first verification on the production Netlify app.
- **B-OPS-02**: Lighthouse/performance budget pass.
- **A-INF-05 / A-QA-05**: Resolve GitHub Actions runner/workflow-scope blockers when the platform token path is available.

### Batch 3 — Mobile and Accessibility Polish
- **B-UX-04**: Mobile touch targets and one-hand ergonomics.
- **C-UX-08**: Reduced motion mode.
- **C-UX-09**: Landscape orientation layout.
- **C-UX-10**: Color blind mode.

---

## PHASE 4: ORISHA INTEGRATION & TRANSCENDENCE

### Core Orisha System (Priority 1)
- **#65**: Create `src/data/orishas.js` with 8 Orisha bosses + Ehi ascension
  - 16 Orishas total (8 pairs): Ogun, Yemaya, Shango, Oshun, Orunmila, Elegba, Oya, Iemanja
  - Ehi as transcendence state (emerges after all 16 integrated)
  - Each Orisha: icon, color, mastery requirements, signature movements, narrative
  - Lineage connections: some Orishas build on Angola, Regional, Contemporary

- **#66**: Wire Orisha integration into player store
  - Add `orishaProgress: { [orishaId]: { integrated: bool, masteredAt: date, xp: num } }` to store
  - Add `integratedOrishas: []` array tracking which Orishas are active
  - Create helper functions: `getCurrentOrishas()`, `getOrishaById()`, `canIntegrateOrisha()`, `integrateOrisha()`
  - Store persistence across sessions

- **#67**: Extend BossTests UI to show Orisha path separate from Mestres
  - Add "Orishas" tab alongside "Mestres" + "Sequences"
  - Show Orisha cards with color + icon + requirements
  - Display integration progress per Orisha
  - Show which concept trees gate each Orisha (Angola foundation must be strong)

### Orisha Mechanics (Priority 1-2)
- **#68**: Implement Ehi ascension transformation ritual
  - When all 16 Orishas integrated → Ehi ascension unlocks
  - Dramatic full-screen ritual similar to PhaseAdvancementRitual
  - Show all 16 Orisha icons converging to single Ehi symbol
  - Award special cosmetic: "Ehi Ascended" title + aura effect
  - Unlock prestige mode automatically

- **#69**: Create Ehi prestige mode system (NG+ challenges)
  - After Ehi ascension, prestige mode becomes available
  - Player can reset to Level 1 but keep cosmetics + "Prestige Rank" counter
  - 2x XP multiplier in prestige
  - Special prestige-only movements unlock (high-level aerials, transcendence techniques)
  - Prestige badges showing multiple playthroughs (⭐⭐⭐ etc.)

- **#70**: Wire prestige trials into Roda page (prestige mode section)
  - Show prestige-specific boss tests (harder versions of Mestres + Orishas)
  - Prestige trials have higher XP rewards + cosmetic unlocks
  - Display prestige rank prominently
  - Show "Ascend again?" button when eligible

### Orisha Progression & Gating (Priority 2)
- **#72**: Angola-style gating on Orisha requirements
  - Orishas cannot be integrated until Angola foundation reaches threshold (Mandinga 5+, Malandragem 4+)
  - Some Orishas require specific concept trees (e.g., Shango needs Malícia 2+)
  - Regional/Contemporary mastery helps certain Orishas but not required
  - First Orisha (Ogun - always available after Angola Phase) acts as gateway

- **#71**: Update player profile to show Ogun core + integrated Orishas path
  - Profile page redesign: show Ogun as primary identity + ring of integrated Orishas
  - Display integration timeline (when each Orisha was integrated)
  - Show Ehi ascension status (locked/ready/ascended)
  - Prestige badges visible on profile

### Orisha Aesthetics & Flavor (Priority 2-3)
- **#73**: Create visual Orisha integration animations (aura growth)
  - When Orisha integrates: glow animation around player icon
  - Aura grows as more Orishas integrate (1 Orisha = subtle glow, 16 = blazing aura)
  - Particle effects on Orisha defeat cards
  - Ehi ascension: full-screen light burst + aura transformation

- **#74**: Add Orisha flavor text and spiritual narratives
  - Each Orisha has: name, title, description, mastery quote, victory message
  - Integration narrative: how each Orisha teaches Angola fluency
  - Ehi narrative: "You are no longer Ogun learning the Orishas. You are all of them flowing as one."
  - Prestige narrative: "Return to the beginning, carrying all you have learned."

- **#75**: Build integration stat system (Ogun + Orisha bonuses compound)
  - Ogun: +5% Mandinga mastery speed per Orisha integrated
  - Each Orisha grants +2% XP in prestige mode
  - Integration multiplier: base XP × (1 + 0.05 × numIntegrated)
  - Display integration stat on Axé page

---

## PHASE 5: MESTRE & MOVEMENT LIBRARY EXPANSION

### Mestre Content (Priority 2)
- **#51**: Add all 27+ historical Capoeira Mestres as boss tests
  - Current: ~12 Mestres in bossTests.js
  - Add: Pastinha's lineage (João Pequeno, Waldemar, Canjiquinha, etc.)
  - Add: Regional lineage depth (Brasília Ferrez, Sinha, David Moura, etc.)
  - Add: Contemporary masters (Pé de Bananeira, Moraes, Moa do Cartório, etc.)
  - Verify: 27+ unique Mestres with distinct styles

- **#52**: Wire Mestre boss requirements to concept tree progression
  - Currently: only concept tree gates block Mestres
  - Add: movement mastery gates (must have 3+ movements at Flowing level)
  - Add: phase requirements (Phase 2 Mestres unavailable until Phase 2 reached)
  - Add: lineage progression (can't fight Pastinha's successor until Pastinha defeated)

- **#53**: Create Mestre lineage cards on Roda page showing skill path
  - Lineage tree visualization: Pastinha → descendants → their students
  - Shows progression path for player (who to fight in order)
  - Visual hierarchy: founder at top, branches down
  - Shows defeat status + rewards

- **#55**: Mestre boss completion reward: unlock Mestre signature sequence
  - Each Mestre has a unique sequence (5-8 moves) inspired by their style
  - Unlocks in Sequences library when Mestre is defeated
  - Can practice sequence on Daily page
  - Sequence includes Mestre's signature kicks/ground moves

### Mestre Victory & Flavor (Priority 2-3)
- **#59**: Mestre victory scenes: flavor text + skill demonstration
  - On boss defeat: modal showing Mestre's response quote
  - Shows which Mestre signature sequence was unlocked
  - Brief video description: "Watch Mestre Pastinha's Roda Flow sequence →"
  - XP reward + concept tree advancement shown

- **#60**: Build Mestre boss progression tree in bossTests.js
  - Current tree is flat (all Mestres independent)
  - Add: lineage field to each Mestre { lineage: "Pastinha", style: "Angola", ... }
  - Add: progression logic (unlocks dependent on defeating others)
  - Add: advanced Mestres require multiple prerequisite Mestres defeated

---

## PHASE 6: MOVEMENT & TECHNIQUE EXPANSION

### Movement Library Expansion (Priority 2)
- **#54**: Add remaining ~60 movements from Wikipedia Capoeira techniques list
  - Current: ~120 movements in movements.js
  - Add: rare Angola ground techniques
  - Add: Regional directness variations
  - Add: Contemporary freestyle high-level moves
  - Add: advanced acrobatic combinations
  - Phase-gate new movements appropriately

### Movement Mastery Features (Priority 2-3)
- **#57**: Movement mastery milestone celebrations
  - When movement reaches each level (Aware, Drilling, Owning, Flowing, Instinct):
    - Modal celebration showing achievement
    - XP bonus awarded (+50 XP per level)
    - Concept tree progression: +10% toward next tree level
  - Instinct (level 5): special celebration with "⭐ Instinct Mastery" badge

- **#58**: Concept tree UI: show mastery progress on trees page
  - Current: ConceptTrees page shows level but not progress toward next level
  - Add: progress bar per concept tree (e.g., "Mandinga 3/5")
  - Add: rep count showing progress to next level (e.g., "120/150 reps to Level 4")
  - Add: movement breakdown (which movements contribute to which trees)
  - Add: forecasted completion date

---

## UI/UX ENHANCEMENTS & POLISH

### Navigation & Discovery (Priority 2)
- Create **Sequences Library** page (secondary nav)
  - Browse all unlocked sequences by category (Angola, Regional, Contemporary, Mixed)
  - Search + filter by difficulty
  - Show "Required XP" for locked sequences
  - Quick-practice button from library

- Create **Movements Category Page** (optional secondary nav)
  - Browse all 120+ movements grouped by type
  - Filter: Phase, Style (Angola/Regional/Contemporary), Mastery level
  - Show movement preview + video link
  - Show which sequences use each movement

### Profile & Progress (Priority 2)
- Expand **Profile page** with:
  - Ogun identity + integrated Orishas visual (after #71)
  - Prestige rank display (after #69)
  - Total playtime tracked
  - Favorite movements (user-selected)
  - Badges earned (movement milestones, phase completions, Mestre victories)

### Data & Settings (Priority 3)
- Extend **Settings page** with:
  - Movement library export (CSV of all movement data)
  - Training statistics export
  - Data backup/restore with timestamp
  - Training preferences (difficulty, XP scaling, etc.)

---

## KNOWN ISSUES & TECH DEBT

### Critical Fixes
- None currently blocking

### Nice-to-Have Improvements
- Movement phase availability: verify all 60+ new movements are properly phase-gated
- Prestige mode XP scaling: ensure 2x multiplier stacks properly with integration bonuses
- Orisha color contrast: verify colors work in both light/dark themes
- Mobile responsiveness: test Orishas section on smaller screens

---

## PRIORITY RANKING

### Must-Have (Next Sprint)
1. **#65-71**: Orisha system core + store integration (2-3 days)
2. **#68**: Ehi ascension ritual (1 day)
3. **#69-70**: Prestige mode system + Roda UI (1-2 days)

### Should-Have (Following Sprint)
1. **#51-53**: Expand Mestres to 27+ with lineage (1 day)
2. **#54**: Add ~60 new movements (1-2 days)
3. **#57-58**: Movement milestones + concept tree progress UI (1 day)

### Nice-to-Have (Future Sprints)
1. **#59-60**: Mestre victory scenes + flavor (1 day)
2. **#72-75**: Advanced gating + aesthetics (1-2 days)
3. Library pages + profile expansion (1-2 days)

---

## Estimated Scope

| Category | Tickets | Est. Time | Priority |
|----------|---------|-----------|----------|
| Orisha System | 11 | 6-8 days | 🔴 Critical |
| Mestre Expansion | 5 | 2-3 days | 🟡 High |
| Movement Library | 2 | 2-3 days | 🟡 High |
| UI/UX Polish | 5+ | 2-3 days | 🟢 Medium |
| **TOTAL** | **25+** | **12-17 days** | |

---

## Next Action
Start with **Ticket #65: Create Orishas.js data** — foundational for all subsequent Orisha work.

