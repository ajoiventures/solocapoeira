# E2E Phase Progression Testing — Solo Leveling

## Overview
Complete walk-through of Phase 1 → 4 progression, verifying all gates, unlocks, and mechanics work seamlessly.

---

## Phase 1: Angola Foundation (Levels 1-7)

### Initial State
- **Current Phase**: 1/4
- **PhaseIndicator** shows: "🇦🇴 Angola Foundation" + 0% progress
- **ConceptTrees**: Mandinga visible, Malandragem visible, **Malícia locked** (shows "🔒 Malícia unlocks in Phase 2")
- **SkillTrees**: Only Phase 1 movements visible (26 core + 7 secondary)
  - Phase 2-4 movements show "🔒 Phase X" badge
- **BossTests**: Only Phase 1 Mestres show (e.g., Bimba, Pastinha, João Pequeno)
  - Phase 2+ Mestres locked with gate message
- **DailyQuest**: Foundation drills filtered to Phase 1 movements only

### Phase 1 Requirements
- [ ] **Mandinga**: 0 → 3 (defeat 3 Mandinga-focused Mestres)
- [ ] **Malandragem**: 0 → 2 (defeat 2 Malandragem-focused Mestres)
- [ ] **Movement mastery**: 5+ movements at Flowing (level 4+)
- [ ] **Concept tree gates**: All Phase 1 Mestres defeated or concept tree levels reached

### Progress Tracking
1. **Daily training**: Do foundation drills, build XP, unlock movements
2. **Concept trees**: Watch mastery climb Mandinga → 1 → 2 → 3
3. **Boss tests**: Defeat Mestres
   - Defeat Bimba (Mandinga) → Mandinga +1
   - Defeat Pastinha (Malandragem) → Malandragem +1
   - Defeat João Pequeno (Mandinga) → Mandinga +2
   - Defeat Mestre Nô (Malandragem) → Malandragem +2
4. **PhaseIndicator**: Progress bar grows 0% → 100%
5. **Phase Progress page**: Phase 1 node shows ✓ checkmark when ready

### Phase 1 Completion
- PhaseIndicator shows "Phase 1 Complete! ✨" and "Advance to Phase 2" button becomes enabled
- Tap "Advance →" button
- **PhaseAdvancementRitual** plays (5 seconds):
  - 🇦🇴 Angola Foundation fades in
  - ⬆️ arrow animates
  - 🔶 Regional Foundation appears (Phase 2 color)
  - Achievement cards show "New Movements Unlocked" + "Concept Tree Advanced"
  - "Your Angola foundation supports everything ahead. Stay grounded."
- Ritual closes, player returns to DailyQuest with new phase active

---

## Phase 2: Angola Progressing + Regional (Levels 8-17)

### Post-Advancement
- **Current Phase**: 2/4 (phase counter in header updated)
- **PhaseIndicator**: Shows "🔶 Angola Progressing + Regional" + 0% progress
- **Phase Progress page**: Phase 1 node shows ✓, Phase 2 node is now active (highlighted)
- **phasesCompleted array**: Includes `1`

### Unlocked Content
- **Malícia tree**: Now visible (was locked)
- **New movements**: Phase 2 additions now visible (26 regional + speed)
  - Chapa, Chapa Giratória, Lateral Escape, etc. show as "Available"
  - Phase 3-4 movements still "🔒 Phase X"
- **New Mestres**: Phase 2 Mestres now available (e.g., Brasília Ferrez, Sinha, Suassuna)
- **ConceptTrees page**: Malícia section unlocks, shows "0 → 2" target for Phase 2

### Phase 2 Requirements
- [ ] **Mandinga**: 3 → 5 (continue Angola deepening)
- [ ] **Malandragem**: 2 → 3 (Angola connection)
- [ ] **Malícia**: 0 → 2 (fast game reading)
- [ ] **Movement mastery**: Regional movements reach Owning (level 3+)

### Progress Tracking
1. **Daily training**: Drills now mix Angola foundation + Regional speed
2. **Concept trees**: 
   - Malícia progresses 0 → 1 → 2 as you practice Falseio, Olho para Olho, etc.
3. **Boss tests**: 
   - Defeat Brasília Ferrez (Regional mastery) → unlock Regional style
   - Defeat Sinha (Malícia) → Malícia +1
   - Continue until all 4 Phase 2 Mestres defeated
4. **PhaseIndicator**: Progress bar fills 0% → 100%
5. **Movement mastery**: Phase 2 regional movements reach mastery levels

### Phase 2 Completion
- All requirements met
- "Advance to Phase 3" button enabled
- PhaseAdvancementRitual plays again

---

## Phase 3: Angola Progressing + Contemporary Mastery (Levels 18-25)

### Post-Advancement
- **Current Phase**: 3/4
- **PhaseIndicator**: Shows "🟣 Angola Progressing + Contemporary" + 0% progress
- **phasesCompleted array**: Includes `1, 2`

### Unlocked Content
- **New movements**: Phase 3 aerials/acrobatics (17 contemporary + athleticism)
  - Au sem mão, Au fechado, Salto, Aero Traça, etc. now visible
  - Phase 4 movements still locked
- **New Mestres**: Phase 3 Mestres available (e.g., Caiçara, Polêmica, David Moura)
- **ConceptTrees**: Same trees (Mandinga/Malandragem/Malícia) but deeper targets
  - Mandinga: 5 → 6, Malandragem: 3 → 4, Malícia: 2 → 3

### Phase 3 Requirements
- [ ] **Movement mastery**: Contemporary aerials reach Flowing (level 4)
- [ ] **Athleticism**: 8+ high-level kicks + flips
- [ ] **Angola foundation**: Still deepening (Mandinga/Malandragem progress)
- [ ] **Style integration**: Show Angola-Contemporary balance

### Progress Tracking
1. **Daily training**: Contemporary drills appear, blending aerials with Angola core
2. **Skill Trees**: Contemporary section prominent but with Angola foundation emphasis
3. **Boss tests**: Defeat Phase 3 Mestres
4. **Movement cards**: Show both Angola core + Contemporary additions
5. **PhaseIndicator**: Progress bar fills toward Phase 4

### Phase 3 Completion
- All requirements met
- "Advance to Phase 4 — Transcendence" button enabled
- PhaseAdvancementRitual plays (special message: "All styles flow through Angola. Transcendence awaits.")

---

## Phase 4: All Integrated — Transcendence (Levels 26-130+)

### Post-Advancement
- **Current Phase**: 4/4 (final phase)
- **PhaseIndicator**: Shows "💫 All Integrated - Transcendence" + progress tracking
- **Phase Progress page**: All phases show ✓ checkmarks, Phase 4 is active
- **phasesCompleted array**: Includes `1, 2, 3`

### Unlocked Content
- **All movements**: Phase 4 transcendence movements available (8 high-level techniques)
  - Liberdade no Jogo, Presença Espiritual, Energia que Flui, etc.
- **All Mestres**: Phase 4 Mestres available
- **Orisha path**: (Future ticket) Ehi ascension unlocks after Phase 4 completion
- **Prestige mode**: (Future ticket) NG+ challenges activate

### Phase 4 Characteristics
- **Angola foundation is core**: All training still emphasizes Angola development
- **Seamless style blending**: Drills flow through Angola → Regional → Contemporary → back to Angola
- **Master-level progression**: XP curves extend 26-130+
- **Transcendence mechanics**: (Future) Orisha integration, Ehi unlocks
- **No phase advance button**: Phase 4 is terminal phase; progress tracked by level instead

### Continuing Progress in Phase 4
- PhaseIndicator shows progress toward prestige mode unlock
- Concept trees remain active for continued mastery
- Movement mastery continues refining (Flowing → Instinct)
- Orishas available as secondary boss path (when implemented)

---

## Testing Checklist

### ✅ Phase Data & Store
- [ ] `TRAINING_PHASES` array loads correctly (4 phases defined)
- [ ] `store.getCurrentPhase()` returns correct phase ID (1, 2, 3, 4)
- [ ] `store.getPhaseCompletionPercent()` calculates progress correctly
- [ ] `store.canAdvanceToNextPhase()` returns true only when all requirements met
- [ ] `store.advanceToNextPhase()` increments phase and adds to `phasesCompleted` array
- [ ] Phase state persists across reload (localStorage saved/loaded)

### ✅ PhaseIndicator Component
- [ ] Displays correct phase icon, name, description
- [ ] Progress bar shows 0-100% based on requirements
- [ ] Concept tree targets grid shows correct ranges (Mandinga 0→3, etc.)
- [ ] Movement focus grid displays phase-specific focus areas
- [ ] "Advance to Next Phase" button appears only when canAdvance=true
- [ ] Button click triggers PhaseAdvancementRitual
- [ ] Phase status changes after ritual completes

### ✅ ConceptTrees Page
- [ ] Malícia locked in Phase 1 (shows "🔒 Malícia unlocks in Phase 2")
- [ ] Malícia becomes visible when Phase 2 reached
- [ ] Progress targets match phase (Mandinga 0→3 in Phase 1, 3→5 in Phase 2, etc.)
- [ ] Level buttons beyond phase target are grayed out (can't select Level 4 Mandinga in Phase 1)
- [ ] Page header shows "Phase N: [Name]"

### ✅ SkillTrees Page
- [ ] Phase 1: Only 26 core + 7 secondary movements visible
- [ ] Phase 2: Adds 26 regional + speed movements
- [ ] Phase 3: Adds 17 contemporary + athletic movements
- [ ] Phase 4: Adds 8 transcendence movements
- [ ] Locked movements show "🔒 Phase X" badge
- [ ] Tap phase-locked movement → see badge but cannot access details
- [ ] Movement cards update availability as phase advances

### ✅ BossTests Page
- [ ] Phase 1: Only ~8 Phase 1 Mestres visible
  - Bimba, Pastinha, João Pequeno, Mestre Nô, etc.
- [ ] Phase 2+: Locked Mestres show "🔒 Unlock Mandinga Lvl X" gate message
- [ ] Defeating Mestres unlocks concept tree levels (gate removal)
- [ ] Phase 2: New Mestres appear (Brasília Ferrez, Sinha, etc.)
- [ ] Phase 3: Contemporary Mestres appear
- [ ] Phase 4: Final Mestres available

### ✅ DailyQuest Page
- [ ] PhaseIndicator rendered at top with progress
- [ ] Foundation drills filtered: only Phase 1 movements in rotation
- [ ] Phase advance button integration works (triggers ritual)
- [ ] Ritual displays before returning to Daily page
- [ ] After Phase 2 advance: foundation drill movement IDs still valid (e.g., "ginga" in Phase 1 & 2)

### ✅ PhaseProgress Page (Timeline)
- [ ] 4 phase nodes visible with icons + colors
- [ ] Active phase node highlighted with border
- [ ] Completed phases show ✓ checkmark
- [ ] Future phases are grayed out
- [ ] Progress bar shown only for active phase
- [ ] Phase narratives change per phase (Phase 1 vs 2 vs 3 vs 4 text)
- [ ] Current status card shows "Phase N / 4" and "X / 4 Completed"

### ✅ PhaseAdvancementRitual Animation
- [ ] Ritual triggers when "Advance to Next Phase" button clicked
- [ ] Timeline correct: Enter (0ms) → Ritual (600ms) → Reveal (2200ms) → Close (5000ms)
- [ ] Old phase name fades in (first 600ms)
- [ ] Up arrow animates (400-1600ms)
- [ ] New phase icon bounces
- [ ] New phase name emerges with color + glow
- [ ] Achievement cards appear with fade-in stagger
- [ ] Phase-specific message displays (different for P2/P3/P4)
- [ ] Ritual closes cleanly without affecting page state

### ✅ Movement Phase Availability
- [ ] `getMovementPhaseInfo(id)` returns correct availableFrom for all movements
- [ ] `isMovementAvailableInPhase(id, phase)` works correctly
- [ ] Phase 1: ginga, cocorinha, meia_lua_de_compasso available
- [ ] Phase 2: chapa, tesoura added
- [ ] Phase 3: au_sem_mao, flip_jump added
- [ ] Phase 4: liberdade_no_jogo, presenca_espiritual added

### ✅ Concept Tree Gates
- [ ] Phase 1 Mestres require Mandinga 1+, Malandragem 1+
- [ ] Phase 2 Mestres require Malícia 1+ (unlocked only in Phase 2)
- [ ] Concept tree progress gates block boss spawning
- [ ] Defeating Mestres unlocks next concept tree level
- [ ] BossTests shows lock message when concept tree gate not met

### ✅ Cross-Page Integration
- [ ] Advancing phase updates ConceptTrees availability
- [ ] Advancing phase updates SkillTrees visibility
- [ ] Advancing phase updates BossTests visibility
- [ ] All pages reflect new phase consistently
- [ ] No stale data between page navigations

---

## Manual Test Flow (20 minutes)

### Setup
1. **Reset app**: Clear localStorage, reload page
2. **Verify Phase 1**: currentPhase = 1, 0% progress

### Test Phase 1 → 2 (5 min)
1. Open BossTests
2. Defeat Bimba (Mandinga requirement met)
3. Open ConceptTrees, verify Mandinga = 1
4. Return to DailyQuest
5. Check PhaseIndicator progress bar (should be ~25%)
6. Repeat: defeat Pastinha (Mandinga 2), João Pequeno (Mandinga 3)
7. Defeat Mestre Nô (Malandragem 2)
8. PhaseIndicator should show ~95%+ progress
9. "Advance to Phase 2" button enabled
10. **Click Advance** → PhaseAdvancementRitual plays

### Test Phase 2 State (3 min)
1. After ritual closes, verify Phase = 2
2. Open ConceptTrees → Malícia now visible
3. Open SkillTrees → Regional movements visible (Chapa, Tesoura, etc.)
4. Open BossTests → New Phase 2 Mestres visible
5. Return to DailyQuest → PhaseProgress page shows Phase 1 ✓, Phase 2 active

### Test Phase 2 → 3 (5 min)
1. Defeat 4 Phase 2 Mestres (mix of Regional, Malícia focus)
2. Advance Malandragem, Malícia concept trees
3. PhaseIndicator shows ~70% progress
4. Complete remaining Phase 2 requirements
5. Button enabled → **Advance to Phase 3**

### Test Phase 3 State (3 min)
1. After ritual, verify Phase = 3
2. SkillTrees shows Contemporary aerials (Au sem mão, Flip, etc.)
3. Phase Progress page shows P1 ✓, P2 ✓, P3 active

### Test Phase 4 (2 min)
1. Defeat remaining Phase 3 Mestres
2. Advance to Phase 4
3. Verify all 4 phases in phasesCompleted
4. Phase Progress shows all ✓
5. PhaseIndicator shows "Phase 4/4" (no advance button)

---

## Edge Cases to Verify

- [ ] Refresh page during phase advancement → state persists
- [ ] Navigate away during ritual → ritual completes on return
- [ ] Concept tree mastery advances before Mestre defeated → gate doesn't block unnecessarily
- [ ] Player at Phase 2 defeats Phase 1 Mestre → no duplicate rewards
- [ ] Player resets training (if such feature exists) → phase doesn't reset
- [ ] Phase data missing from store → defaults to Phase 1
- [ ] Fast advance through phases → all gates respected

---

## Success Criteria

✅ All 4 phases accessible and progressing correctly  
✅ Phase gates prevent early unlocks  
✅ Advancement ritual is smooth and engaging  
✅ UI reflects phase changes immediately  
✅ Concept tree gates work as intended  
✅ Movement availability matches phase  
✅ Mestre visibility matches phase gates  
✅ State persists across page reloads  
✅ No console errors during progression  

