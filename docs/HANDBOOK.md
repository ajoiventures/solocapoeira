# SOLO LEVELING: CAPOEIRA
## Training Handbook — Year 1 Program

> *"Every day you train, you become someone the previous version of you could not have been."*

---

## Table of Contents

1. [Welcome & Philosophy](#1-welcome--philosophy)
2. [Getting Started](#2-getting-started)
3. [The Ranking System](#3-the-ranking-system)
4. [Daily Quest System](#4-daily-quest-system)
5. [The Bonus Quest](#5-the-bonus-quest)
6. [Sprint 1 Program — MLDC → Au → Handstand](#6-sprint-1-program--mldc--au--handstand)
7. [Skill Trees & Movements](#7-skill-trees--movements)
8. [Boss Tests](#8-boss-tests)
9. [Pain Management Protocol](#9-pain-management-protocol)
10. [Annual Program Overview](#10-annual-program-overview)
11. [Training Philosophy](#11-training-philosophy)
12. [FAQ](#12-faq)

---

## 1. Welcome & Philosophy

**Solo Leveling: Capoeira** is a self-directed, progressive training system built around one principle: every session must move you measurably closer to mastery. The app is not a class scheduler or a video library. It is a *mission system* — daily quests, weekly skill targets, quarterly boss tests, and an annual arc from F-rank to S-rank.

The inspiration is the Solo Leveling universe: a hunter who trains alone, levels up through repeated effort, and eventually surpasses everyone around them through sheer accumulated work. That is what this program demands of you.

**What the app tracks:**
- Your daily training completion (per quest slot)
- Your movement mastery level (0–5 per movement)
- Your pain state (5 body regions, 0–10)
- Your XP and rank progression
- Your boss test pass/fail history
- Your session log

**What the app does not do:**
- It does not correct your form. That requires a teacher, a mirror, or video.
- It does not replace class. It supplements and structures your solo practice.
- It does not adjust automatically to missed days. You decide when to advance weeks.

---

## Builder Operating Rule

When developing the app, stabilize the web/PWA first. Do not start new Orisha, Mestre, mobile-wrapper, or native-app expansion while the local QA gate is red or while the ticket board and roadmap disagree.

Current execution order:

1. Restore clean gates: lint, tests, build, connective audit, and smoke checks.
2. Reconcile tickets: `tickets.html`, `docs/REMAINING_TICKETS.md`, and this handbook must describe the same next batch.
3. Pay architecture debt: split `useStore.js`, split `DailyQuest.jsx`, then run the render/memo audit.
4. Verify production PWA reliability: live env keys, offline behavior, Supabase sync, PostHog events, and Sentry error capture.
5. Only then continue advanced Orisha/Mestre sequence content and app conversion work.

---

## 2. Getting Started

### First Session Checklist

1. **Log your pain** — Before anything else, open the Pain tab (🩹) and log today's state for all five regions: foot, knee, wrist, shoulder, lower back. A score of 0 means no pain. A score of 10 means you cannot train that body part today. Be honest. The quest system adapts.

2. **Complete the Week 1 Baseline** — Your first bonus quest is diagnostic. Log real numbers: max push-ups, dead hang time, hamstring fold depth, overhead shoulder gap. These become your Week 12 comparison points. Do not sandbag.

3. **Navigate the app:**
   - **⚔️ Quest** — Today's training. Five slots + bonus quest. This is your main screen.
   - **🌀 Trees** — Your movement library. Browse all movements, see mastery levels, tap for details.
   - **📋 Plan** — Full training plan: annual program, Sprint 1 weeks, movement database, boss tests, rank road.
   - **💀 Bosses** — Boss test tracker. Attempt and record results.
   - **🩹 Pain** — Daily pain log. Trend charts. Training guidance.

4. **Set your current week** — Go to Plan → Settings (gear icon) and confirm you are on Week 1. The app will advance weeks as you progress.

### Navigation Notes

- Tapping a movement card in Skill Trees opens the full movement detail page (progressions, unlock test, mastery test, physical requirements).
- Settings are accessed from inside the Plan page, not the bottom nav.
- The bonus quest only appears after all five daily quest slots are completed.

---

## 3. The Ranking System

Your rank reflects your cumulative training volume and skill mastery. It is not awarded by a teacher — it is earned through consistent daily work.

| Rank | Level Range | Color | Milestone |
|------|-------------|-------|-----------|
| F — Unranked | 1–29 | Gray | Beginning the journey |
| E — Novice Hunter | 30–69 | Blue | Foundations taking shape |
| D — Awakened | 70–119 | Green | Movement vocabulary building |
| C — Fighter | 120–179 | Amber | Flow emerging |
| B — Elite Fighter | 180–249 | Orange | Bananeira, Au Batido territory |
| A — Hunter | 250–329 | Pink | MLDC to Bananeira. CDO territory |
| S — Shadow Hunter | 330+ | Purple | Full roda. Full flow. Mastery |

### XP Formula

```
Level = floor(Total XP / 100) + 1
```

Every 100 XP = 1 level. Linear progression — no exponential wall, no grinding slump.

### XP Sources

| Source | XP |
|--------|----|
| Base daily quest completion | ~100 XP (varies by quest count) |
| Bonus quest completion | 150–250 XP (scales with week + level) |
| Boss test passed | 200–500 XP (varies by boss) |

### Time to S-Rank

| Training Pattern | Estimated Time |
|-----------------|----------------|
| Daily quests only | ~11 months |
| Daily quests + bonus quest | ~6 months |
| Inconsistent (5 days/week) | ~15 months |

S-rank requires Level 330, which requires 32,900 XP. At 100 XP/day base: 329 days. At 225 XP/day average (with bonus): ~146 days.

---

## 4. Daily Quest System

Every day, the app generates five quest slots tailored to your current week, pain state, and unlocked movements.

### The Five Slots

**Slot 1 — Foot Protocol (always)**
Duration: 5 minutes. Non-negotiable. Foot health is the foundation of every Capoeira movement. If your feet are not progressing, nothing above them will.

Contents:
- Foot rolling — 2 minutes each foot
- Short foot drill — 10 × 10-second holds each foot
- Toe yoga — 10 reps each direction

**Slot 2 — Foundation Rotation (always)**
Duration: 10–15 minutes. A rotating schedule of foundation movements keyed to day of week. The body learns foundation patterns through daily repetition, not weekly practice.

| Day | Focus |
|-----|-------|
| Sunday | Ginga + Cocorinha depth |
| Monday | Esquiva Baixa + Negativa |
| Tuesday | Rolê + Aranha |
| Wednesday | Ginga variations + Giro |
| Thursday | Esquiva Paralela + Esquiva de Costas |
| Friday | Corrupião + Volta de Lado |
| Saturday | Full Foundation Flow |

**Slot 3 — Primary Skill (sprint week)**
Duration: 15 minutes. The target skill from your current sprint week. Only unlocked movements appear here. If nothing is unlocked, foundational movements fill the slot.

**Slot 4 — Flow Conditioning**
Duration: 10 minutes. A structured flow sequence built from your unlocked movements, organized by tier:

1. Foundation loop: Ginga → Cocorinha → Esquiva Baixa
2. Low game entries: Negativa → Rolê → Esquiva Paralela
3. Base kicks: Meia Lua de Frente → Queixada → Armada
4. MLDC (when unlocked): Meia Lua de Compasso
5. Au (when unlocked): Au Básico → Au Controlado
6. Inversion (when unlocked): Bananeira
7. Sweeps (when unlocked): Corta Capim → Rasteira
8. Floor balance (when unlocked): Queda de Rins

On high-pain days, this slot switches to a light mobility protocol: Hip CARs, wrist circles, gentle bridges.

**Slot 5 — Recovery / Mobility (always)**
Duration: 5 minutes. Hip CARs, calf stretch, wrist deload. Mandatory. The training adapts through recovery, not during it.

### Completing Quests

Tap the circle on any quest to mark it complete. Tapping again unchecks it (toggle). The progress bar updates in real time.

### Auto-Complete

If training was completed but you forgot to log it, the app auto-completes all quests and logs the session at **noon each day**. This fires once and cannot be undone.

### Session Logging

After all five quests are complete, a "Log Session" button appears. Tap it to record the session and earn XP. The session is saved to your history.

---

## 5. The Bonus Quest

The bonus quest unlocks **only after all five daily quest slots are completed**. This is intentional — it is a reward for full daily completion, not a shortcut.

The bonus quest is a targeted strength + conditioning + flexibility block. Every week, the exercises are specifically chosen to build the physical qualities that week's movement goal demands.

### Structure

Each bonus quest contains three labeled sections:

**💪 STRENGTH** — 2–3 exercises building the specific muscles and patterns the goal requires. These are not generic. If the week's goal is the MLDC hand plant, the strength section trains the exact shoulder loading angle of the MLDC hand plant.

**🔥 CONDITIONING** — 1–2 drills that apply the strength under movement load. The conditioning section always includes the actual drill you are working toward.

**🧘 FLEXIBILITY** — 1–2 stretches targeting the specific range limits of the goal. The *why* is always stated — you should understand what you are opening and why it matters.

### XP Scaling

Bonus XP scales with level:
```
Bonus XP = weekly base XP + (floor(level / 30) × 25)
```
At Level 30, you earn 25 extra XP per bonus completion. At Level 60, 50 extra. This compounds over the year.

---

## 6. Sprint 1 Program — MLDC → Au → Handstand

Sprint 1 (Weeks 1–12) has a single overarching skill goal:

> **Meia Lua de Compasso → hand plant → slow hip lift → slow au arc → pause at top → handstand hold → slow descent**

This is the foundation of a high-level Capoeira game: the ability to transition from any spinning kick into a controlled inversion. Master this and you have the physical language for everything that follows.

### Why This Specific Chain?

MLDC is the most important kick in regional Capoeira — powerful, deceptive, and the platform for the game's most advanced inversions. The hand plant at the end of MLDC is where the floor game meets the aerial game. If you can slowly lift your hips from that position and hold a handstand, you have:

- Hip hinge strength (the kick)
- Rotational core control (the spin)
- Wrist/shoulder joint armor (the plant)
- Core compression (the hip lift)
- Overhead pressing endurance (the hold)
- Eccentric shoulder control (the slow descent)

Every other movement in the game draws from at least one of these.

### The Three Phases

#### Phase 1 — Joint Armor + Prerequisites (Weeks 1–4)

**Goal:** Build the body's tolerance for the demands ahead. Nothing here is flashy. Everything here is essential.

| Week | Target | Key Drill |
|------|--------|-----------|
| 1 | Baseline diagnostic | Log max push-ups, dead hang, hamstring fold, shoulder overhead gap |
| 2 | Wrist + shoulder armor | 4-quadrant wrist loading, scapular push-ups, slow au with hand floor pause |
| 3 | MLDC mechanics | Single-leg RDL, rotational core, MLDC floor touch drill (hold 1s) |
| 4 | Inversion endurance | Wall bananeira holds, wall shoulder taps, slow au 2-second floor pause |

By Week 4, both hands should touch the floor on every MLDC rep, and you should be holding a wall bananeira for 15+ seconds.

#### Phase 2 — MLDC Hand Plant + Slow Hip Lift (Weeks 5–8)

**Goal:** Connect the MLDC to the floor. Lean weight into hands. Begin lifting the hips.

| Week | Target | Key Drill |
|------|--------|-----------|
| 5 | MLDC hand plant | MLDC → plant both hands → hold 2s → stand (8 reps each side, 5 rounds) |
| 6 | Slow hip lift | MLDC plant → lean in → lift hips 1–3 inches off floor → hold 1s → lower |
| 7 | Slow au arc pauses | 3-checkpoint au: pause 2s at entry + top + exit |
| 8 | MLDC → au entry | Full MLDC → hands → lean → first 90° of arc (quality over height) |

The hip lift in Week 6 is the hardest drill in Phase 2. Even 1 inch off the floor counts. The L-sit and hollow body work from the bonus quests directly feeds this drill.

#### Phase 3 — Slow Au + Handstand Chain + Boss (Weeks 9–12)

**Goal:** Complete the chain. Pause at the top. Do it from both sides.

| Week | Target | Key Drill |
|------|--------|-----------|
| 9 | Handstand hold | Slow au → pause 3s at top → slow descent (wall hold target: 25–30s) |
| 10 | Full chain | MLDC → plant → lift → arc → 2s handstand hold → slow descent |
| 11 | Both sides, 5s hold | Weak-side dedicated volume, 5-second wall holds, both-side chain drill |
| 12 | Boss test | MLDC both sides → slow au → 3s handstand → slow exit. 10-min flow with chains |

### Sprint 1 Boss Test Criteria

To pass the Sprint 1 boss, you must demonstrate:

1. MLDC from dominant side → hands touch floor → slow au → pause 3+ seconds at top → slow exit
2. Same from non-dominant side (hold standard: 2+ seconds acceptable)
3. Wall bananeira hold: 30+ seconds
4. 10-minute flow round that includes at least 3 successful MLDC → au chain transitions
5. Flexibility delta: meaningful improvement in at least 3 of 4 measured ranges (hamstring, hip rotation, wrist extension, shoulder flexion)

---

## 7. Skill Trees & Movements

The app tracks 70+ Capoeira movements across 11 skill trees. Each movement has a mastery level from 0 (locked) to 5 (mastered).

### Mastery Levels

| Level | Label | Meaning |
|-------|-------|---------|
| 0 | Locked | Prerequisites not met |
| 1 | Aware | You have seen or tried the movement |
| 2 | Learning | You can perform the shape with concentration |
| 3 | Practicing | Consistent reps, form still breaks under fatigue |
| 4 | Competent | Reliable in isolation, beginning to use in flow |
| 5 | Mastered | Available in flow, both sides, under pressure |

### Unlocking Movements

A movement unlocks when its prerequisites reach mastery level 3 or higher. Tier 1 movements with no prerequisites are available from Day 1.

### The 11 Trees

| Tree | Focus | Key Movements |
|------|-------|---------------|
| Foundation | Base game literacy | Ginga, Cocorinha, Esquiva, Negativa, Rolê |
| Kick | Offensive vocabulary | MLDF, Queixada, Armada, MLDC, Martelo |
| Au | Cartwheel progressions | Au Básico, Au Controlado, Au Fechado, Au Batido |
| Bananeira | Handstand family | Wall 15s → 30s → 60s → Freestand → Exit variants |
| Queda de Rins | Lateral floor balance | Prep → 5s → 10s → Switch |
| Macaco | Back flip family | Macaquinho → Macaco → Macaco Ginga → Macaco Au |
| Floor Game | Low movement vocabulary | Aranha, Resistência, Gorila, Fuga, Ponte |
| Sweep | Takedown techniques | Corta Capim, Rasteira, Tesoura de Angola |
| Foot | Foot conditioning | Foot Rolling, Short Foot, Tibialis Raise, Calf Raise |
| Strength | Cross-training | Turkish Get-Up, Goblet Squat, Kettlebell Swing |
| Conditioning | Endurance work | Hip CARs, Cossack Squat |

### Difficulty Ranks

Every movement is ranked E through S by physical demand:

| Rank | Difficulty | Example Movements |
|------|-----------|-------------------|
| E | 1 | Ginga, Cocorinha, Esquiva Baixa |
| E+ | 2 | Negativa, Rolê, Meia Lua de Frente |
| D | 3 | Queixada, Armada, Au Básico |
| D+ | 4 | MLDC, Au Controlado, Bananeira Wall 30s |
| C | 5 | Au Fechado, Queda de Rins 10s, MLDC → Rolê |
| C+ | 6 | Au Batido, Escorpião, Au Reversão |
| B | 7 | Macaco, Freestand Bananeira, Au Navalha |
| A | 8 | Au Batido in flow, MLDC → Bananeira |
| S | 9 | Au CDO, Macaco Au, Au Trancado |

---

## 8. Boss Tests

Boss tests are quarterly skill checkpoints. They cannot be simulated in training — you must attempt them when ready and record the result.

### Boss Test Structure

Each boss test has:
- **Requirements** — specific measurable criteria (hold time, rep count, quality standard)
- **Reward** — XP and mastery unlocks
- **Attempt history** — every failed attempt is logged; progress toward the target is visible

### Sprint 1 Boss Tests

| Boss | Test | Criteria |
|------|------|---------|
| Foot Boss I | Foot protocol mastery | Foot rolling 2 min pain-free + short foot 10×10s + toe yoga 10 reps |
| Au Base Boss | Slow au chain | MLDC both sides → slow au → 3s handstand → slow exit |
| Bananeira Boss I | Wall hold 30s | Continuous 30-second wall bananeira, both sides attempted |
| Flow Boss I | 5-minute flow | 5 minutes unbroken movement including ginga, escapes, kicks |

### Attempting a Boss Test

1. Navigate to **💀 Bosses**
2. Tap the boss you want to attempt
3. Review the criteria
4. Attempt the test — record pass or fail
5. On pass: XP is awarded and any unlock is triggered
6. On fail: attempt is logged; retry any time

There is no cooldown on boss test attempts. Fail, learn, retry.

---

## 9. Pain Management Protocol

Pain is information. The app uses daily pain logging to adapt your training, not cancel it.

### Pain Regions & Scale

Log 0–10 for each region before training. Use this guide:

| Score | Meaning | Training Modification |
|-------|---------|----------------------|
| 0–2 | Normal training sensation | Full training |
| 3–4 | Noticeable discomfort | Avoid high-load movements in that region |
| 5–6 | Significant pain | Substitute mobility-only for affected tree |
| 7–10 | Sharp or acute pain | Rest that region completely |

### Automatic Adaptations

When the app detects high pain (any region > 3), the flow conditioning quest switches to a light mobility protocol. Specific pain gates:

| Pain Region | Gate (score ≥) | Automatic Substitution |
|-------------|----------------|----------------------|
| Foot | 4 | No jumps, no impact loading |
| Knee | 3 | No deep squats, no kicks with that leg |
| Wrist | 3 | No au, no bananeira, no floor plants |
| Shoulder | 4 | No au, no bananeira, reduce push volume |
| Lower Back | 4 | No MLDC, no macaco, no bridge |

### 7-Day Foot Trend

The Pain page shows a 7-day trend chart for foot pain. If the trend is rising, the program deloads the foot quest automatically. A rising foot pain trend over 5+ days means: rest the foot training and see a professional.

---

## 10. Annual Program Overview

Year 1 covers four sprints across 52 weeks. Each sprint has a primary goal, a boss test, and a bonus quest focus.

### Sprint 1 — Foundation (Weeks 1–12)
**Goal:** MLDC → slow au → handstand chain  
**Boss:** Au Base Boss + Bananeira Wall 30s  
**Rank target:** E-rank (Level 30)  
**Bonus focus:** Joint armor, MLDC mechanics, slow au pauses, handstand chain

### Sprint 2 — Building (Weeks 13–24)
**Goal:** Au Fechado mastery, MLDC as combination, Bananeira 60s, Queda de Rins 10s, 7-minute roda  
**Boss:** Au Fechado Boss + Bananeira Boss II + Flow Boss  
**Rank target:** D-rank (Level 70)  
**Bonus focus:** Adductor + closed-leg strength, kick-to-movement chains, inversion endurance

### Sprint 3 — Integration (Weeks 25–36)
**Goal:** Macaco, Au Batido, full floor game, 10-minute roda  
**Boss:** Macaco Boss + Au Batido Boss + Floor Boss  
**Rank target:** C-rank (Level 120)  
**Bonus focus:** Back flexibility, explosive hip power, inversion exit control, sweep mechanics

### Sprint 4 — Mastery (Weeks 37–52)
**Goal:** CDO territory, full roda game, MLDC → Bananeira chain, S-rank  
**Boss:** Annual Boss — all Sprint bosses re-tested  
**Rank target:** S-rank (Level 330)  
**Bonus focus:** Maximum output, bilateral mastery, flow integration

---

## 11. Training Philosophy

### The Hunter Principle

In Solo Leveling, the protagonist does not wait for a teacher to tell him he is ready. He trains until the results speak. This program is built on the same principle: **the work is the answer**. Show up every day, do the quests, attempt the bosses, and the rank changes.

### Slow Is Fast

Every drill in Sprint 1 emphasizes control over speed. A slow au that pauses at the top is worth ten fast cartwheels that crash through. Speed is a product of strength and pattern — not a training method. Train slow, train controlled, and speed emerges when the body is ready.

### The Weak Side Rule

Every skill must be trained on both sides. The dominant side is where you show off. The non-dominant side is where you are honest. Boss tests in this program include non-dominant side standards. Train the weak side every week, not as an afterthought.

### Pain Is a Signal, Not a Punishment

Pain during training is the body telling you something specific. Log it, read it, and adapt. The common mistake is to either ignore pain (injury) or stop entirely (regression). The app is designed to keep you training through the pain-free zones while protecting the affected areas.

### The One-Year Bet

S-rank in 6 months is possible with perfect bonus completion. Eleven months is realistic with consistent daily quests. The bet you are making is simple: show up every day for one year, do the work, and emerge as someone who can move in ways that are genuinely remarkable.

---

## 12. FAQ

**Q: I missed three days. Do I advance the week?**  
A: Only advance the week when you feel the current week's goal is reasonably trained. Missing days is fine — just do not advance artificially. The program compounds. Rushing it breaks the foundation.

**Q: My wrist hurts during au. Should I stop?**  
A: Log the pain score. If wrist > 3, skip au and bananeira. Continue foot, foundation, and conditioning (without floor plants). Add extra wrist mobility work. Return to au only when wrist score is ≤ 2 for three consecutive days.

**Q: I can't do a pull-up yet.**  
A: Substitute dead hangs × max time. Work toward a 30-second dead hang first. From there, add a resistance band-assisted pull-up. Dead hang endurance is the prerequisite — not the pull-up itself.

**Q: The MLDC hip lift is impossible. I cannot get off the floor.**  
A: That is normal in Week 6. The drill is about learning the weight transfer. Even shifting 80% of your weight into your hands while one foot lifts 1 cm counts as progress. The L-sit and hollow body work in the bonus quest is building the prerequisite in parallel. Trust the process.

**Q: Can I do this if I have never trained Capoeira before?**  
A: Yes. Tier 1 movements have no prerequisites and are designed for absolute beginners. The program starts from the floor up. However, if you have access to a Capoeira teacher even once per week, combine that with this system — the class sharpens what the solo practice builds.

**Q: What if I miss a boss?**  
A: There is no penalty for missing a boss or failing one. Attempt it when you feel ready. The rank road does not require bosses to advance — XP from daily training is sufficient. Bosses are checkpoints, not gates.

---

*Version 1.0 — Sprint 1 Edition*  
*Solo Leveling: Capoeira is designed for self-directed training. It does not replace qualified instruction, medical advice, or a qualified Capoeira teacher.*
