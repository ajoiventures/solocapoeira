// Bonus Quest System
// S-rank (level 100) takes ~1 year of 3x/week training (~150 sessions × 300 XP = 45,000 XP).
export {
  RANKS,
  getRank,
  getNextRank,
  getLevelFromXP,
  getXPForLevel,
  getLevelProgress,
} from "./rankUtils.js";

const WEEKLY_BONUS = {
  // -- SPRINT 1: Foundation (Weeks 1-12)
  // 3-month block goal: MLDC -> slow au -> handstand
  // Phase 1 (Wks 1-4): Joint armor + MLDC prerequisites
  // Phase 2 (Wks 5-8): MLDC hand plant + slow hip lift off floor
  // Phase 3 (Wks 9-12): Slow au pauses + handstand chain + boss test

  1: {
    goal: "Establish hard numbers for Week 12 comparison — push-up max, dead hang time, hamstring range, shoulder reach",
    block: "Sprint 1 - Month 1",
    theme: "Diagnostic Baseline + Armor Foundation",
    focus: "Every rep you do today becomes a reference point. Week 12 you will repeat these exact protocols. The numbers only matter if you do them properly now.",
    strength: [
      {
        id: "s1_max_pushup",
        icon: "💪",
        label: "Max Push-Up Test — 2 sets",
        sets: "Set 1: push-ups to absolute failure — elbows tuck, chest touches floor, full lockout each rep, no sagging. Count every clean rep. Stop the moment form breaks. Rest exactly 3 min. Set 2: same protocol, max reps again. Log both totals: S1: ___ / S2: ___.",
        why: "Shoulder pressing baseline. The handstand and au require sustained overhead load. These numbers tell you exactly how much shoulder armor you need to build.",
      },
      {
        id: "s1_dead_hang",
        icon: "🏋️",
        label: "Dead Hang — 3 max sets",
        sets: "Hang from a bar with both hands, arms fully extended, feet off the floor. Hold until grip completely fails — not until it's uncomfortable, until you literally cannot hold on. Rest exactly 2 min between sets. Log each time in seconds: S1: ___s / S2: ___s / S3: ___s.",
        why: "Grip and scapular stability baseline. Every au, every MLDC hand plant, and every bananeira kick-up demands this. Under 20s per set = priority target for Weeks 2–4.",
      },
      {
        id: "s1_wrist_load",
        icon: "🤲",
        label: "Wrist Tolerance Protocol — 4 positions",
        sets: "Position 1 — Forward-facing: both palms flat on floor, fingers pointing toward knees. Load slowly until you feel the stretch. Hold 30s. Position 2 — Backward-facing: fingers pointing away. Hold 30s. Position 3 — Side-facing right: hold 30s. Position 4 — Side-facing left: hold 30s. Then: wrist circles 20 each direction. Log pain in each position 0–10. Sharp pain = stop that position. Ache = normal.",
        why: "The MLDC hand plant hits the wrist from a rotated lateral angle — not straight. All four quadrants need tolerance before you can train the actual skill safely.",
      },
    ],
    conditioning: [
      {
        id: "c1_ginga_base",
        icon: "🌀",
        label: "10-Min Continuous Ginga",
        sets: "Set a 10-minute timer. Ginga from the moment it starts: feet never stop moving, arms active, weight shifting side to side. If you stop moving, note the time and get back in immediately. Log: (1) time of first stop — if you made the full 10 min write COMPLETE. (2) heart rate: were you controlled or gassed at minute 5? (3) foot pain after (0–10).",
        why: "Roda endurance baseline. 10 minutes is a short roda. If you cannot ginga for 10 min, conditioning is the first limiter to fix — before skill, before strength.",
      },
    ],
    flexibility: [
      {
        id: "f1_hamstring",
        icon: "🧘",
        label: "Hamstring Baseline — Standing Fold",
        sets: "Stand on a flat surface, feet hip-width, knees fully locked straight. Slowly fold forward and reach toward the floor. Hold the deepest position you can reach with zero knee bend for 2 minutes. Do not force — find your current range and stay there. Log exactly what you can reach: Floor / Top of feet / Ankles / Mid-shin / Knees. Log which hamstring felt tighter.",
        why: "MLDC hand-to-floor reach is directly limited by hamstring length. Your result here tells you how many weeks of flexibility work stand between you and a clean MLDC hand plant.",
      },
      {
        id: "f1_shoulder_flex",
        icon: "🧘",
        label: "Shoulder Flexion Baseline — Wall Reach",
        sets: "Stand with your back flat against a wall, feet 6 inches from the baseboard. Raise both arms overhead and try to touch the wall with the back of your wrists and forearms. Keep lower back flat against the wall — do not arch. Hold for 2 min. Log the gap between your wrists and the wall in inches. If you can touch: log 0 and note whether the lower back stayed flat.",
        why: "Handstand requires full shoulder flexion — arms straight up with no gap. That gap you just measured is exactly how much mobility work separates you from a clean bananeira line.",
      },
    ],
    xpBonus: 150,
  },

  2: {
    goal: "Wrist + shoulder armor -- build joint tolerance for MLDC hand plant",
    block: "Sprint 1 - Month 1",
    theme: "Wrist Conditioning + Scapular Control Foundation",
    focus: "The MLDC hand plant hits the wrist from a rotated lateral position. Armor the wrist from all four quadrants before the drill can be practiced safely.",
    strength: [
      { id: "s2_scap_pu",      icon: "💪", label: "Scapular Push-Ups x 4x20", sets: "Arms fully straight. Protract (push floor away) -- retract (let chest sag). Slow. No elbow bend.", why: "Scapular control is the #1 safety mechanism for every au and handstand." },
      { id: "s2_wrist_prog",   icon: "🤲", label: "Progressive Wrist Loading x 4 rounds", sets: "Round 1: forward-facing 30s. Round 2: backward-facing 30s. Round 3: side-facing 30s each. Round 4: rotation hold 30s.", why: "MLDC hand plant comes from a spinning position -- the wrist angle is diagonal. All four quadrants must be conditioned." },
      { id: "s2_pike_pu",      icon: "💪", label: "Pike Push-Ups x 4x10",     sets: "Hips as high as possible. Lower crown toward floor. Press fully overhead. Slow.", why: "Overhead pressing strength is the prerequisite for holding any handstand." },
    ],
    conditioning: [
      { id: "c2_au_slow",      icon: "🌀", label: "Slow Au x 3 rounds",       sets: "10 au each side per round. Go 50% speed. Pause 1 second when both hands are on floor.", why: "The pause at floor contact is the same position as the MLDC hand plant. Start feeling weight on hands from a cartwheel." },
    ],
    flexibility: [
      { id: "f2_wrist_ext",    icon: "🧘", label: "Wrist Extension Stretch",sets: "Fingers toward knees on floor x 3 min. Fingers to sides 2 min each. Shift weight gently.", why: "Handstand wrist angle needs 90 degrees extension. Most wrists sit at 60. Daily stretching closes this gap." },
      { id: "f2_thoracic",     icon: "🧘", label: "Thoracic Extension",     sets: "Foam roller on mid-back x 4 min. Arms overhead. Breathe into each spinal segment.", why: "Thoracic mobility = shoulder elevation = cleaner au overhead line. Tight t-spine is the hidden handstand limiter." },
    ],
    xpBonus: 155,
  },

  3: {
    goal: "MLDC mechanics -- hamstring + hip rotation + hand-to-floor reach",
    block: "Sprint 1 - Month 1",
    theme: "MLDC Foundation -- Hip Hinge + Rotational Strength",
    focus: "MLDC is a spinning hip hinge kick. Before the hand plant, the kick must be reliable. This week builds the hip mechanics and first practice of touching the floor.",
    strength: [
      { id: "s3_rdl",          icon: "🦵", label: "Single-Leg RDL x 4x10",     sets: "10 each side. Hinge at hip -- feel the hamstring load. Return slow and controlled.", why: "The MLDC loading phase is a single-leg hip hinge. This is the exact strength pattern." },
      { id: "s3_rotational",   icon: "⚖️", label: "Rotational Core x 4x12",   sets: "12 each side. Resistance band or slow bodyweight rotation. Full range -- controlled return.", why: "MLDC sweeps through the transverse plane. Rotational core strength = kick control through the arc." },
      { id: "s3_floor_plant",  icon: "🤲", label: "MLDC Floor Touch Drill x 3x10", sets: "10 slow MLDC each side. Goal: both hands touch floor at deepest point. Hold 1 second.", why: "This is the exact moment before the au begins. Get comfortable placing both hands on floor from the MLDC position." },
    ],
    conditioning: [
      { id: "c3_mldc_vol",     icon: "🌀", label: "MLDC Volume Drill x 4 rounds", sets: "10 slow MLDC each side per round. 90 sec rest. Log: do hands reach floor?", why: "Hamstring endurance for MLDC. The kick must survive fatigue before it can transition to a handstand." },
    ],
    flexibility: [
      { id: "f3_hamstring",    icon: "🧘", label: "Hamstring Flexibility Block", sets: "Standing fold 3 min + seated single-leg fold 2 min each + PNF: 5s contract, relax, deeper x 3 each side.", why: "MLDC hand-to-floor reach is directly limited by hamstring length. Every cm of flexibility = deeper floor reach." },
      { id: "f3_hip_rotation", icon: "🧘", label: "Hip Internal Rotation", sets: "Seated figure-4 2 min each + prone hip IR 2 min each + pigeon 2 min each.", why: "MLDC rotates through the hip. Internal rotation range is the joint range the kick travels through." },
    ],
    xpBonus: 160,
  },

  4: {
    goal: "Slow au with floor pause -- shoulder endurance in the handstand position",
    block: "Sprint 1 - Month 2",
    theme: "Slow Au + Wall Handstand -- Inversion Endurance",
    focus: "A slow au is a handstand in motion. The body has to be strong enough to pause at the top. This week builds that endurance specifically.",
    strength: [
      { id: "s4_wall_tap",     icon: "🙃", label: "Wall Shoulder Taps x 4x8", sets: "In wall bananeira. One shoulder at a time -- lift slowly. 8 each side. Do not rush.", why: "Unilateral shoulder loading in the handstand position is the exact strength required to slow an au and hold at top." },
      { id: "s4_wall_hold",    icon: "🙃", label: "Wall Bananeira Hold x 5 attempts", sets: "Max hold each attempt. Record best time. 3 min rest. Target: 15+ seconds.", why: "The handstand hold time directly measures the shoulder endurance your slow au will require." },
      { id: "s4_pullup",       icon: "🏋️", label: "Pull-Ups x 5 sets max",    sets: "Max reps each set. 2 min rest. Log total.", why: "Lat + serratus strength stabilizes the shoulder girdle during inversion and slows descent from handstand." },
    ],
    conditioning: [
      { id: "c4_slow_au",      icon: "🌀", label: "Slow Au Pause Drill x 4 rounds", sets: "5 au each side per round. On every rep: pause 2 seconds when both hands are on floor. Slow the arc.", why: "The slow pause at floor contact is Phase 1's version of the MLDC hand plant position." },
    ],
    flexibility: [
      { id: "f4_overhead",     icon: "🧘", label: "Overhead Shoulder Line", sets: "Doorframe shoulder stretch 2 min each + floor overhead lat 3 min + cross-body 2 min each.", why: "Shoulder flexion range is the ceiling of your handstand line. Every degree opened now is a cleaner au overhead." },
      { id: "f4_wrist_full",   icon: "🧘", label: "Full Wrist Mobility Circuit", sets: "Extension 2 min + flexion 2 min + side-facing 2 min each + loaded back-of-hand 2 min.", why: "Four weeks of daily wrist work should be creating meaningful extension range. Do not skip this." },
    ],
    xpBonus: 165,
  },

  5: {
    goal: "MLDC hand plant -- lean forward, absorb weight, hold the floor position",
    block: "Sprint 1 - Month 2",
    theme: "MLDC to Floor -- Weight Transfer + Shoulder Loading",
    focus: "MLDC, plant both hands, lean weight into hands, hold the floor position 2 seconds. This is the beginning of the au. The body must accept weight from a spinning hip-hinged position.",
    strength: [
      { id: "s5_lateral_pu",   icon: "💪", label: "Lateral Shoulder Loading x 4x10", sets: "Push-up position, walk hands to one side until one arm is at 60 degrees, press. 10 each side.", why: "The MLDC hand plant is a lateral-facing shoulder load. Train the shoulder from this angle specifically." },
      { id: "s5_hollow_hold",  icon: "⚖️", label: "Hollow Body Hold x 5x20s", sets: "Lower back flat on floor. Arms overhead, legs straight out. 20-sec holds. Breathe.", why: "Hollow body tension holds the shape in the handstand and slows the au arc." },
      { id: "s5_scap_press",   icon: "💪", label: "Scapular Push-Ups into Press x 4x15", sets: "5 scapular reps (straight arms) then flow into 10 full push-ups. Continuous.", why: "Trains the exact sequence of the MLDC landing: absorb (scap) then press (push-up)." },
    ],
    conditioning: [
      { id: "c5_mldc_plant",   icon: "🌀", label: "MLDC Hand Plant Drill x 5 rounds", sets: "8 MLDC each side. On every rep: plant both hands and hold 2 sec before standing. Rest 90 sec.", why: "The specific drill. MLDC, hands on floor, pause, stand. This exact rep is the foundation of MLDC to au." },
    ],
    flexibility: [
      { id: "f5_hamstring",    icon: "🧘", label: "Hamstring Deepening Block", sets: "Standing fold 3 min + PNF: 5s contract, 10s deeper x 5 rounds. Log final range.", why: "Deeper hamstring = lower hand plant from MLDC = less distance to travel into au." },
      { id: "f5_shoulder_int", icon: "🧘", label: "Shoulder Internal Rotation", sets: "Sleeper stretch 3 min each + behind-back reach + towel assist 2 min each.", why: "Internal rotation allows the arm to rotate correctly during the au arc. Without it the shoulder compensates." },
    ],
    xpBonus: 170,
  },

  6: {
    goal: "Slow hip lift from floor -- MLDC hand plant, hips off ground, hold",
    block: "Sprint 1 - Month 2",
    theme: "Hip Float -- Core Compression + Shoulder Press to Lift",
    focus: "Hardest week in Phase 2. From the MLDC hand plant position: weight into hands, slowly lift hips and feet off the ground, hold 2 seconds. Core compresses hips toward chest while shoulders press and stabilize.",
    strength: [
      { id: "s6_lsit",         icon: "⚖️", label: "L-Sit Progression x 5 sets", sets: "Chairs or parallettes. Tucked L-sit 10-20s per set. Log best time. Progress: tuck, one leg, full L.", why: "L-sit is the exact core compression pattern used to lift the hips off the floor from the MLDC hand plant." },
      { id: "s6_hollow_press", icon: "💪", label: "Hollow Body into Press Combo x 4x10", sets: "Hollow hold on back, roll to hands, press to push-up. 10 reps. Maintain hollow through transition.", why: "Trains the core-to-shoulder press transition. Core initiates hip compression, shoulders follow." },
      { id: "s6_lat_pull",     icon: "🏋️", label: "Pull-Ups x 5 sets max + Dead Hang x 3x30s", sets: "Alternate pull-up set then dead hang. Log pull-up reps and hang time.", why: "The shoulder girdle must support full bodyweight during the MLDC hip lift. Hang endurance builds that capacity." },
    ],
    conditioning: [
      { id: "c6_hip_float",    icon: "🌀", label: "MLDC Hand Plant Hip Lift Drill x 4 rounds", sets: "5 each side per round. MLDC, plant hands, lean weight in, lift hips 1-3 inches, hold 1s, lower. 90 sec rest.", why: "The actual drill. 1 inch off floor counts. Feel weight transfer and core compression working together." },
    ],
    flexibility: [
      { id: "f6_hip_flexor",   icon: "🧘", label: "Hip Flexor Release",   sets: "Couch stretch 3 min each + low lunge 2 min each + elevated back foot 2 min each.", why: "Tight hip flexors resist the hip lift. Releasing them lets the hips come up with less effort." },
      { id: "f6_wrist_load",   icon: "🧘", label: "Loaded Wrist Mobility", sets: "Forward extension hold with bodyweight 3 min + back-of-hand on floor 2 min + side circles 2 min.", why: "The MLDC hip lift puts maximum wrist load while the body is off-balance." },
    ],
    xpBonus: 175,
  },

  7: {
    goal: "Slow au arc -- pause at 3 points: entry, top, exit",
    block: "Sprint 1 - Month 2",
    theme: "Slow Au Pause Drill -- Shoulder + Core Control Through the Arc",
    focus: "Break the au into 3 checkpoints: (1) hands on floor = weight transferred, (2) hips at vertical = hollow body hold, (3) feet descending = controlled lowering. Pause 2 seconds at each point.",
    strength: [
      { id: "s7_pike_press",   icon: "💪", label: "Pike Push-Ups x 5x12",    sets: "Hips high. Press slow -- 3 sec down, 1 sec up. 12 reps x 5.", why: "The handstand top of the au requires sustained overhead pressing. This volume builds the endurance for the pause." },
      { id: "s7_side_plank",   icon: "⚖️", label: "Side Plank x 4x45s",      sets: "45 sec each side. Hips stacked. Do not let them sag.", why: "Lateral core fires during arc transitions. Without this, the body twists or drops instead of pausing cleanly." },
      { id: "s7_wrist_fist",   icon: "🤲", label: "Wrist Push-Up Progression x 3x10", sets: "10 push-ups on fists + 10 on fingertips + 10 supported back-of-hands. Log pain level.", why: "Fist and fingertip push-ups strengthen wrist intrinsic muscles that stabilize during the au arc pause." },
    ],
    conditioning: [
      { id: "c7_3point_au",    icon: "🌀", label: "3-Point Slow Au x 4 rounds", sets: "5 au each side. Pause 2 sec at: entry (hands on floor) + top (hips over shoulders) + exit (one foot descending). Rest 2 min.", why: "This drill directly trains the slow controlled au. The 3 pauses force the body to hold positions it normally rushes through." },
    ],
    flexibility: [
      { id: "f7_shoulder_full",icon: "🧘", label: "Full Shoulder Mobility Circuit", sets: "Overhead lat 3 min + pec doorframe 2 min + cross-body 2 min each + thoracic roller 3 min.", why: "Shoulder range must be fully open for the handstand top. Every restriction shows up as a bent elbow at the top." },
      { id: "f7_hamstring_deep",icon: "🧘", label: "Hamstring Maximum Range", sets: "PNF standing fold x 5 rounds (5s contract, 10s deeper). Seated straddle 4 min. Log today's range.", why: "Deeper hamstring = lower center of mass at au entry = smoother transition into the handstand arc." },
    ],
    xpBonus: 175,
  },

  8: {
    goal: "MLDC into slow au entry -- connecting the kick to the handstand floor",
    block: "Sprint 1 - Month 3",
    theme: "MLDC to Au Chain -- Hip Hinge Into Handstand Entry",
    focus: "The full movement begins. MLDC, plant hands, lean weight in, slow hip lift, begin the au arc. You do not need to complete the handstand. Goal: smooth transition from MLDC into the first 90 degrees of the au. Quality over height.",
    strength: [
      { id: "s8_mldc_str",     icon: "🦵", label: "MLDC Strength Block x 4x8", sets: "8 slow MLDC each side. On every rep: pause at floor with hands planted. Feel the load. Slow return to standing.", why: "MLDC kick mechanics must be solid and fatigue-resistant before adding the au." },
      { id: "s8_shoulder_end", icon: "💪", label: "Wall Handstand Shoulder Endurance x 6 sets", sets: "Hold wall bananeira max time. 3 min rest. Log each hold. Target: 20+ seconds.", why: "The au will briefly put the full body in handstand. The shoulder must survive this under MLDC-accumulated fatigue." },
      { id: "s8_core_press",   icon: "⚖️", label: "L-Sit into Tuck into Press Circuit x 4 rounds", sets: "L-sit 10s, pull knees to chest, press up to standing. 5 reps per round. Continuous.", why: "Exact motor pattern: compress (L-sit), tuck, press. This is MLDC hand plant, hip lift, au exit." },
    ],
    conditioning: [
      { id: "c8_mldc_au",      icon: "🌀", label: "MLDC into Au Entry Drill x 5 rounds", sets: "4 reps each side. Full MLDC, hands on floor, lean forward, slow au entry. Do not rush past the hand plant. 2 min rest.", why: "The chain drill. The transition between MLDC and au is the skill being built. Slow is the goal." },
    ],
    flexibility: [
      { id: "f8_hip_hamstring", icon: "🧘", label: "Hip Hinge Flexibility Block", sets: "Standing fold 3 min + PNF hamstring x 5 rounds + forward fold with rotation 2 min each side.", why: "Deeper MLDC hand plant = lower hips when au begins = less height needed to enter the handstand arc." },
      { id: "f8_wrist_deep",   icon: "🧘", label: "Deep Wrist Conditioning", sets: "Full wrist mobility circuit 6 min total. Every angle. Loaded and unloaded.", why: "Week 8 wrist load is higher than any previous week. The MLDC + au combination doubles the wrist demand." },
    ],
    xpBonus: 180,
  },

  9: {
    goal: "Slow au with handstand pause -- hold at top for 3+ seconds",
    block: "Sprint 1 - Month 3",
    theme: "Handstand Hold at Au Top -- Shoulder + Balance + Hollow Body",
    focus: "The arc must now stop at the top. Hips over shoulders, legs vertical, hollow body, 3 seconds minimum. From any starting position. Then descend slow. Hardest pure strength target of Sprint 1.",
    strength: [
      { id: "s9_wall_endur",   icon: "🙃", label: "Wall Bananeira Endurance x 6 sets", sets: "Hold max time. 3 min rest. Target: 25-30 seconds. Log every session.", why: "30-second wall hold = reliable handstand. The au top is a momentary handstand requiring this strength to pause in." },
      { id: "s9_hollow_rock",  icon: "⚖️", label: "Hollow Body Rockings x 4x10", sets: "10 rocks per set. Maintain hollow throughout. No arm push -- core drives the rock.", why: "Hollow body rocking trains the exact core shape needed at the top of the au handstand." },
      { id: "s9_neg_press",    icon: "💪", label: "Negative Handstand Push-Up x 4x5", sets: "From wall bananeira -- lower crown to floor in 5 seconds. Press back up. 5 reps.", why: "Eccentric shoulder press = ability to hold and lower from handstand top instead of dumping onto one foot." },
    ],
    conditioning: [
      { id: "c9_au_hold",      icon: "🌀", label: "Slow Au, Top Hold, Slow Exit x 5 rounds", sets: "3 au each side per round. Pause 3 seconds at handstand top. Slow descent. Rest 3 min between rounds.", why: "The target drill. Slow in -- hold -- slow out. Every rep is valuable." },
    ],
    flexibility: [
      { id: "f9_shoulder_max", icon: "🧘", label: "Maximum Shoulder Flexion Work", sets: "Wall overhead slide 3 min + floor overhead lat 3 min + doorframe stretch 2 min each arm.", why: "By week 9 shoulder flexion should be noticeably improved. Push to your new maximum." },
      { id: "f9_thoracic",     icon: "🧘", label: "Thoracic Extension Deep", sets: "Foam roller 5 min -- move slowly through every segment. Arms overhead on each spot.", why: "Fully open t-spine = fully vertical handstand line." },
    ],
    xpBonus: 185,
  },

  10: {
    goal: "MLDC into slow au into handstand -- complete the full chain from the kick",
    block: "Sprint 1 - Month 3",
    theme: "Full Chain -- MLDC Into Handstand",
    focus: "All three phases connect this week. MLDC, hand plant, lean into hands, slow hip lift, arc up, pause 2 seconds at top, slow descent. Do it from both sides. Slow. 3-5 good reps.",
    strength: [
      { id: "s10_chain_str",   icon: "💪", label: "Chain Strength Circuit x 5 rounds", sets: "Single-leg RDL 5 each + pike push-up 8 + hollow hold 20s + L-sit 10s + pull-up max. Rest 2 min.", why: "Hits every component: MLDC strength (RDL) + handstand press (pike) + core (hollow + L-sit) + girdle (pull-up)." },
      { id: "s10_wall_fatigue",icon: "🏋️", label: "Wall Handstand into Shoulder Taps x 4 sets", sets: "Hold wall bananeira 20s, 5 shoulder taps each side, hold 10s more.", why: "Handstand endurance under shoulder fatigue. The chain puts the handstand at end of MLDC -- shoulder is already working." },
    ],
    conditioning: [
      { id: "c10_full_chain",  icon: "🌀", label: "MLDC into Au into Handstand Full Chain x 5 rounds", sets: "3 full chain reps each side. Slow. Pause 2 sec at handstand top. 3 min rest between rounds.", why: "The complete drill. This is the Sprint 1 skill goal made into training volume." },
      { id: "c10_flow_test",   icon: "🔥", label: "5-Min Flow with MLDC to Au Attempts", sets: "5-min continuous flow. Include at least 3 MLDC to au attempts. Log which ones hit the handstand.", why: "The chain must work inside moving context, not just as an isolated drill." },
    ],
    flexibility: [
      { id: "f10_full_mob",    icon: "🧘", label: "Full Chain Mobility Reset", sets: "Hamstring 3 min + hip flexor 2 min each + wrist circuit 4 min + shoulder overhead 3 min.", why: "Every joint in the chain gets opened after the hardest training week." },
    ],
    xpBonus: 195,
  },

  11: {
    goal: "MLDC into au into handstand from both sides -- 5-second hold, any entry",
    block: "Sprint 1 - Month 3",
    theme: "Consolidation -- Full Chain Both Sides + Hold Extension",
    focus: "Increase the hold to 5 seconds. Practice from both your strong and weak MLDC side. The weak side will be harder -- that is exactly what must be trained. The chain must not be one-sided.",
    strength: [
      { id: "s11_weak_side",   icon: "🦵", label: "Weak-Side MLDC Floor Plant x 5x8", sets: "8 reps on weaker side only. Hands reach floor every rep. Hold 2 seconds.", why: "The weak-side au chain always falls behind. Dedicated volume prevents a permanent one-sided game." },
      { id: "s11_5sec_wall",   icon: "🙃", label: "5-Sec Wall Bananeira x 6 attempts", sets: "Hold for exactly 5 counted seconds -- full stillness. Rest 3 min between. Log how many of 6 you hold clean.", why: "5-second wall hold = 5-second au top pause." },
      { id: "s11_pike_max",    icon: "💪", label: "Pike Push-Ups Max Set",    sets: "1 max set -- log number. Compare to Week 2. Aim for 20+ at this point.", why: "Shoulder press progression check at Week 11. Should show meaningful growth from wrist/shoulder armor phase." },
    ],
    conditioning: [
      { id: "c11_both_sides",  icon: "🌀", label: "Both-Side Chain Drill x 6 rounds", sets: "3 full chain reps strong side + 3 weak side per round. 5-sec top hold target. 3 min rest.", why: "6 rounds of bilateral chain training. By Week 12 boss, both sides must work." },
    ],
    flexibility: [
      { id: "f11_hamstring_max",icon: "🧘", label: "Hamstring Maximum Test", sets: "Standing fold -- log vs. Week 1 and Week 3. PNF 5 rounds. Push to new maximum.", why: "Week 11 is the last flexibility push before boss week." },
      { id: "f11_shoulder_inv",icon: "🧘", label: "Inversion Shoulder Stretch", sets: "In wall bananeira -- let shoulder stretch passively 2 min. Switch. Then full overhead circuit 4 min.", why: "Shoulder stretch tested under inversion load -- the closest stretch to the actual handstand position." },
    ],
    xpBonus: 210,
  },

  12: {
    goal: "Boss week -- MLDC into slow au into handstand hold, both sides, clean",
    block: "Sprint 1 - Month 3 - BOSS WEEK",
    theme: "Sprint 1 Boss -- The Full Chain Tested",
    focus: "This is not a training session. This is a proof of 12 weeks. The test: MLDC from both sides, slow au, pause 3 seconds at handstand, slow exit. Log your best attempt each side. Compare every number to Week 1.",
    strength: [
      { id: "s12_max_pushup",  icon: "💪", label: "Max Push-Up Test x 3 sets", sets: "Max reps each. 3 min rest. Compare to Week 1 baseline.", why: "12-week shoulder pressing delta. This measures the armor foundation of the entire program." },
      { id: "s12_wall_hold",   icon: "🙃", label: "Max Wall Bananeira Hold x 3 attempts", sets: "Record each hold. Compare to Week 4. Target: 30+ seconds.", why: "30-second wall hold was the Phase 1 target. If you are here, the handstand pause in the au is sustainable." },
      { id: "s12_max_hang",    icon: "🏋️", label: "Dead Hang x 3 max sets",   sets: "Max time each. Compare to Week 1.", why: "Shoulder girdle endurance delta. Shows what 12 weeks of au and bananeira drilling built." },
    ],
    conditioning: [
      { id: "c12_boss_chain",  icon: "🌀", label: "Boss Test: MLDC into Au into Handstand -- Both Sides", sets: "3 attempts each side. Best attempt logged. Video if possible. Judge: does top hold 3 sec? Is arc slow?", why: "This is the Sprint 1 boss. The movement you trained for 12 weeks. Do it clean." },
      { id: "c12_flow_round",  icon: "🔥", label: "10-Min Flow Round With Chains", sets: "Full game simulation -- include MLDC to au chains throughout. Log how many successful chain transitions occur.", why: "The chain must exist inside real flow, not just as a drill. This is the true test of integration." },
    ],
    flexibility: [
      { id: "f12_full_assess", icon: "🧘", label: "Full 12-Week Flexibility Assessment", sets: "Hamstring + hip rotation + wrist extension + shoulder flexion. Log ranges vs. Week 1.", why: "The flexibility delta shows what daily work opened over 12 weeks." },
    ],
    xpBonus: 250,
  },

  // ── SPRINT 2: Building (Weeks 13–24) ─────────────────────────────
  // 3-month block goal: au fechado, MLDC as combination, bananeira 60s, queda de rins 10s, 7-min roda

  13: {
    goal: "Au Fechado — closed-leg landing control",
    block: "Sprint 2 · Month 4",
    theme: "Adductor Strength + Landing Control",
    focus: "Au fechado is only as good as the landing. The landing needs specific strength.",
    strength: [
      { id: "s_adductor_iso", icon: "🦵", label: "Adductor Isometric × 4×30s", sets: "Ball between knees — squeeze. 30s hold. 4 sets.", why: "Isometric adductor strength maintains the closed-leg position in au fechado." },
      { id: "s_single_leg",   icon: "🦵", label: "Single-Leg Squat × 3×10",  sets: "10 each side. Slow — use wall if needed.", why: "Single-leg landing strength = the direct demand of au fechado landing." },
      { id: "s_pike_pu2",     icon: "💪", label: "Pike Push-Ups × 5×10",     sets: "Increase height of hips each set. Aim for wall handstand push-up angle.", why: "Overhead pressing endurance for the longer bananeira holds that au fechado transitions into." },
    ],
    conditioning: [
      { id: "c_au_ladder",    icon: "🌀", label: "Au Ladder × 5 rounds",     sets: "10 au basico + 8 au controlado + 5 au fechado each side. Rest 2 min. Repeat.", why: "Progressive au conditioning — builds closed-leg form under accumulated shoulder fatigue." },
    ],
    flexibility: [
      { id: "f_adductor_ecce",icon: "🧘", label: "Eccentric Adductor Stretch", sets: "Copenhagen plank 3×15s each + lying adductor drop 3 min each", why: "Eccentric adductor flexibility allows the legs to hold together while decelerating from the arc." },
    ],
    xpBonus: 170,
  },

  14: {
    goal: "MLDC as combination — link kick to movement",
    block: "Sprint 2 · Month 4",
    theme: "Hip Power + Transition Speed",
    focus: "MLDC must now exit into something. Train the transition capacity.",
    strength: [
      { id: "s_hip_thrust",  icon: "🦵", label: "Hip Thrusts × 4×15",      sets: "15 reps. 2-sec hold at top. Heavy if possible.", why: "Hip extension power drives the MLDC → rolê exit speed." },
      { id: "s_rotational2", icon: "🔄", label: "Rotational Power × 3×12", sets: "Med ball slam or resistance band rotation. 12 each side.", why: "Rotational speed in the kick translates directly to MLDC control and combination options." },
      { id: "s_core_carry",  icon: "💪", label: "Suitcase Carry × 4×30s",  sets: "30s each side. Heavy. Slow walk. Core braced.", why: "Lateral core stability under load — the stabilization layer under every MLDC." },
    ],
    conditioning: [
      { id: "c_mldc_combo",  icon: "🌀", label: "MLDC Combination Drill × 4×5 min", sets: "MLDC → rolê → ginga → repeat. 5 min continuous. 2 min rest. 4 rounds.", why: "Conditioning the combination specifically. Builds the aerobic + neuromuscular capacity for linked movement." },
    ],
    flexibility: [
      { id: "f_ham_hip",     icon: "🧘", label: "Hamstring + Hip Flexor Block", sets: "PNF hamstring 3 min each + couch stretch 3 min each", why: "MLDC power requires hamstring length and hip flexor release simultaneously. Open both." },
    ],
    xpBonus: 175,
  },

  15: {
    goal: "Full Tier 1 kick set — leg strength + balance under fatigue",
    block: "Sprint 2 · Month 4",
    theme: "Kick Conditioning + Single-Leg Balance",
    focus: "Every kick in the vocabulary requires single-leg balance under fatigue. Train the platform first.",
    strength: [
      { id: "s_slb_loaded",  icon: "🦵", label: "Single-Leg Balance + Reach × 3×10", sets: "10 each side. Reach forward/side/back on each rep.", why: "Dynamic single-leg balance = the platform every kick launches from." },
      { id: "s_kick_circuit",icon: "⚡", label: "Kick Strength Circuit × 3×10", sets: "10 slow meia lua de frente + 10 queixada + 10 martelo each side. Focus control.", why: "Kick-specific leg conditioning under accumulated fatigue." },
      { id: "s_squat_jump",  icon: "🦵", label: "Squat Jumps × 4×10",       sets: "Explosive. Land soft. Immediate next rep.", why: "Leg power and plyometric conditioning for kick explosiveness." },
    ],
    conditioning: [
      { id: "c_kick_flow",   icon: "🌀", label: "Kick Flow × 4×4 min",     sets: "All Tier 1 kicks in rotation with ginga and esquiva. 4 min non-stop. 2 min rest.", why: "Kick endurance in context. This is what a roda demands of the kicking vocabulary." },
    ],
    flexibility: [
      { id: "f_hip_kick",    icon: "🧘", label: "Hip Flexion + Rotation Block", sets: "High kick stretch 3 min each + hip rotation stretch 2 min each", why: "Kick height is limited by hip flexion range. Open it and every kick immediately reaches higher." },
    ],
    xpBonus: 175,
  },

  16: {
    goal: "Bananeira 60s wall — shoulder endurance",
    block: "Sprint 2 · Month 4",
    theme: "Shoulder Endurance + Inversion Volume",
    focus: "60 seconds is an endurance problem. Train shoulder endurance specifically.",
    strength: [
      { id: "s_overhead_hold",icon: "💪", label: "Overhead Hold × 5×30s",  sets: "Hands on wall overhead — hold bodyweight. 30s each.", why: "Shoulder endurance in the overhead position = bananeira holding endurance." },
      { id: "s_band_press",   icon: "💪", label: "Band Overhead Press × 4×15", sets: "Light band. High reps. Shoulder endurance not power.", why: "Rotator cuff endurance — the muscles that stabilize the 60-second hold." },
      { id: "s_pullup_slow",  icon: "🏋️", label: "Slow Negative Pull-Ups × 4×5", sets: "5 sec descent. 5 reps. 2 min rest.", why: "Eccentric pulling strength controls the bananeira descent." },
    ],
    conditioning: [
      { id: "c_ban_volume",  icon: "🙃", label: "Bananeira Volume × 10 attempts", sets: "10 wall kick-ups. Hold max time each. Log every attempt.", why: "Pure inversion volume. Shoulder adaptation requires repeated exposure." },
    ],
    flexibility: [
      { id: "f_lat_overhead",icon: "🧘", label: "Lat + Overhead Opening",  sets: "Foam roller lat stretch 3 min each + overhead stretch floor 3 min", why: "Lat tightness is what forces the lower back to arch in bananeira. Open the lats, fix the line." },
    ],
    xpBonus: 180,
  },

  17: {
    goal: "Queda de Rins 5s hold — lateral core load",
    block: "Sprint 2 · Month 5",
    theme: "Lateral Core + Elbow Joint Armor",
    focus: "5 seconds of QdR requires specific lateral core strength and elbow joint tolerance.",
    strength: [
      { id: "s_side_pl2",    icon: "⚖️", label: "Side Plank Progression × 4×60s", sets: "60s each side. Add hip dip variation last 10s.", why: "Direct lateral core endurance progression toward QdR hold times." },
      { id: "s_elbow_load",  icon: "🤲", label: "Elbow Plank × 4×60s",     sets: "Straight body. No hip drop. 60s.", why: "Elbow loading tolerance — QdR puts the elbow under oblique force. Condition it here." },
      { id: "s_windmill",    icon: "🔄", label: "Windmill × 3×8",           sets: "KB or bodyweight. 8 each side. Lateral chain under load.", why: "Full lateral chain strength — hip to shoulder — the exact load path of queda de rins." },
    ],
    conditioning: [
      { id: "c_qdr_circuit", icon: "🌀", label: "QdR Circuit × 4×3 min",   sets: "QdR hold → switch → rolê → QdR hold. 3 min × 4 rounds. 2 min rest.", why: "QdR conditioning in movement context. Builds the endurance to use it in a roda." },
    ],
    flexibility: [
      { id: "f_qdr_prep",    icon: "🧘", label: "Lateral Chain Stretch",    sets: "Standing lateral stretch 3 min each + QL release on floor 3 min each", why: "The lateral chain (QL, IT band, hip abductors) is what QdR compresses. Stretch it after every session." },
    ],
    xpBonus: 180,
  },

  18: {
    goal: "Floor game depth — corta capim + contra + gorila",
    block: "Sprint 2 · Month 5",
    theme: "Hip Rotation Endurance + Floor Strength",
    focus: "The floor game moves require specific hip rotation under fatigue. Build that engine.",
    strength: [
      { id: "s_hip_rot_str", icon: "🔄", label: "Hip Rotation Strength × 3×15", sets: "Side-lying clam + fire hydrant. 15 each side. Slow.", why: "Hip abductor + external rotator strength controls the leg arcs in corta capim and gorila." },
      { id: "s_bear_crawl",  icon: "🐒", label: "Bear Crawl × 4×20m",      sets: "20m each direction. Hips low. Controlled.", why: "Quadruped locomotion strength — the base movement pattern of the floor game." },
      { id: "s_core_rot",    icon: "💪", label: "Russian Twist × 4×20",    sets: "20 reps. Slow. Pause at each side. Feet up.", why: "Rotational core endurance for repeated corta capim arcs." },
    ],
    conditioning: [
      { id: "c_floor_circuit",icon:"🌀", label: "Floor Game Circuit × 4×3 min", sets: "Corta capim + gorila + aranha + rolê + negativa. 3 min non-stop. 2 min rest.", why: "Floor game cardiovascular conditioning. The hip rotators need to last under aerobic load." },
    ],
    flexibility: [
      { id: "f_hip_full",    icon: "🧘", label: "Full Hip Opening Block",   sets: "All directions: flexion + extension + rotation + abduction. 90s each.", why: "Floor game uses every hip direction. Open all of them or one will be the bottleneck." },
    ],
    xpBonus: 178,
  },

  19: {
    goal: "Au Reversão + Au Pesado — directional control and slow loading",
    block: "Sprint 2 · Month 5",
    theme: "Slow Strength + Proprioception",
    focus: "These au variations require body awareness and control more than power. Train that.",
    strength: [
      { id: "s_slow_au",     icon: "🌀", label: "Slow Au Hold × 4×5s",     sets: "Hold midpoint of au for 5 seconds each side. 4 sets.", why: "Teaches the body to find position mid-cartwheel — the core demand of au pesado." },
      { id: "s_chest_pu",    icon: "💪", label: "Wide Push-Ups × 4×15",    sets: "Wide grip. Chest to floor. Slow eccentric.", why: "Wider chest strength for the lateral pushing demand of reversed au directions." },
      { id: "s_hip_circle",  icon: "🔄", label: "Hip Circle Strength × 3×10", sets: "Standing hip circle — full range. 10 each direction. Slow.", why: "Proprioceptive hip control for au reversão direction switching." },
    ],
    conditioning: [
      { id: "c_au_variation",icon: "🌀", label: "Au Variation Flow × 3×4 min", sets: "Cycle through au basico → reversão → pesado → fechado. 4 min each round.", why: "Conditioning multiple au patterns in sequence — the demand of a rich cartwheel vocabulary." },
    ],
    flexibility: [
      { id: "f_shoulder_rot",icon: "🧘", label: "Full Shoulder Rotation",  sets: "CARs × 10 each arm + banded shoulder stretch each direction 90s", why: "Shoulder rotation in all planes allows the arm placement changes that au reversão requires." },
    ],
    xpBonus: 178,
  },

  20: {
    goal: "Rasteira mechanics — sweep strength and timing",
    block: "Sprint 2 · Month 5",
    theme: "Single-Leg Strength + Sweep Power",
    focus: "A rasteira that works is a sweep with power behind it. Train the hip and leg for that.",
    strength: [
      { id: "s_sweep_hip",   icon: "🦵", label: "Hip Abduction Sweeps × 3×15", sets: "Standing side kick to sweep arc. 15 each side. Slow power.", why: "Hip abductor strength drives the sweep arc in rasteira." },
      { id: "s_lateral_lunge",icon:"🦵", label: "Lateral Lunge × 3×12",   sets: "12 each side. Deep. Pause at bottom.", why: "Lateral leg strength + adductor mobility for the low entry before the sweep." },
      { id: "s_core_brace",  icon: "💪", label: "Anti-Rotation Press × 3×12", sets: "Band or cable. 12 each side. Resist the rotation.", why: "Core bracing during the sweep — you must stay stable while the leg sweeps." },
    ],
    conditioning: [
      { id: "c_sweep_drill", icon: "🌀", label: "Sweep Drill Circuit × 4×3 min", sets: "Ginga → esquiva → rasteira → recover → repeat. 3 min each. 2 min rest.", why: "Sweep under fatigue. The timing must work when you're tired — that's when you'll use it." },
    ],
    flexibility: [
      { id: "f_inner_hip",   icon: "🧘", label: "Inner Hip + Groin Release", sets: "Frog stretch 3 min + side split hold 3 min + groin stretch 2 min each", why: "Sweep range is limited by adductor and groin flexibility. Release it and the arc gets longer." },
    ],
    xpBonus: 180,
  },

  21: {
    goal: "Bananeira freestand attempts — balance + fear management",
    block: "Sprint 2 · Month 6",
    theme: "Balance Strength + Neurological Adaptation",
    focus: "Freestanding bananeira is 90% fear and 10% strength once the wall hold is solid.",
    strength: [
      { id: "s_finger_press",icon: "🤲", label: "Fingertip Push-Ups × 3×8",sets: "8 reps. Full range. Slow.", why: "Finger + wrist pressing strength for the micro-corrections freestanding bananeira requires." },
      { id: "s_handstand_press",icon:"💪",label:"Wall Handstand Press × 4×5", sets: "5 reps. Descend to 90° and press back. Slow.", why: "Overhead pressing strength for the push-through at the top of a kick-up." },
      { id: "s_core_hollow",  icon: "⚡", label: "Hollow Body Hold × 4×30s", sets: "30s holds. Lower back pressed to floor. Arms overhead.", why: "Hollow body tension is the shape a good bananeira requires. Train the position separately." },
    ],
    conditioning: [
      { id: "c_free_ban",    icon: "🙃", label: "Freestand Attempts × 20", sets: "20 attempts. Each one: kick up, find balance, fall safely. Log best hold time.", why: "Volume is the only way neurological adaptation happens. 20 is the minimum for meaningful adaptation." },
    ],
    flexibility: [
      { id: "f_wrist_full",  icon: "🧘", label: "Full Wrist Mobility Block",sets: "Extension + flexion + radial/ulnar deviation. 2 min each direction.", why: "Freestanding bananeira micro-corrections happen through the wrist. Full range = better corrections." },
    ],
    xpBonus: 185,
  },

  22: {
    goal: "7-minute flow — roda conditioning",
    block: "Sprint 2 · Month 6",
    theme: "Roda Endurance + Full-Body Conditioning",
    focus: "7 minutes is not just fitness — it is muscular endurance across every system simultaneously.",
    strength: [
      { id: "s_full_circuit",icon: "⚡", label: "Full Strength Circuit",    sets: "10 push-up + 8 pull-up + 15 squat + 10 QdR each side. 5 rounds. Log time.", why: "Full-body strength endurance — every movement system loaded in sequence." },
      { id: "s_squat100",    icon: "🦵", label: "100 Squats",               sets: "5×20 or 10×10. Slow. Deep. Log time.", why: "Leg endurance capacity directly limits how long you can sustain low game." },
      { id: "s_pushup60",    icon: "💪", label: "60 Push-Ups",              sets: "3×20. Any variation. Shoulder endurance.", why: "Upper body endurance for repeated au, bananeira entries, and arm-based work." },
    ],
    conditioning: [
      { id: "c_7min_round",  icon: "🌀", label: "7-Minute Flow Round",      sets: "Full game simulation. Every movement you have. Log what breaks and when.", why: "Boss test as training. Exposure to the demand is the conditioning." },
    ],
    flexibility: [
      { id: "f_recovery",    icon: "🧘", label: "Post-Round Recovery Stretch", sets: "Full body. Hip + hamstring + shoulder + calf. 2 min each.", why: "Recovery quality determines next-session quality. Don't skip this." },
    ],
    xpBonus: 200,
  },

  23: {
    goal: "Sprint 2 boss prep — combined test",
    block: "Sprint 2 · Month 6",
    theme: "Integrated Boss Prep",
    focus: "Run each boss test criterion as a practice. Know your numbers before the test.",
    strength: [
      { id: "s_ban_test",    icon: "🙃", label: "Bananeira Wall 60s + 5s Freestand", sets: "Attempt each. Log time.", why: "Bananeira Boss II criteria rehearsal." },
      { id: "s_au_test",     icon: "🌀", label: "20 Au Basico Each Side",  sets: "Clean form. Both sides continuous.", why: "Au component of Bananeira Boss II." },
      { id: "s_qdr_test",    icon: "⚖️", label: "QdR 10s Hold Each Side",  sets: "Both sides. Log pain.", why: "QdR Boss criteria." },
    ],
    conditioning: [
      { id: "c_boss_sim",    icon: "🌀", label: "Full Boss Simulation",     sets: "Run all boss criteria back-to-back with 3 min rest between. Log pass/fail.", why: "Pre-test the full boss sequence. Identifies what still needs work." },
    ],
    flexibility: [
      { id: "f_full_pre",    icon: "🧘", label: "Pre-Boss Full Mobility",  sets: "All key areas: shoulder + hip + hamstring + wrist. 90s each.", why: "Arrive at boss week with all ranges open. Flexibility is easy performance." },
    ],
    xpBonus: 210,
  },

  24: {
    goal: "Sprint 2 Boss Week — peak test",
    block: "Sprint 2 · Month 6 · BOSS WEEK",
    theme: "Sprint 2 Peak Output",
    focus: "Maximum effort. 6 months of work meets the test.",
    strength: [
      { id: "s_s2_push",     icon: "💪", label: "Max Push-Ups × 3 sets",   sets: "Max reps. 3 min rest. Compare to Week 1 and Week 12.", why: "6-month pushing strength delta." },
      { id: "s_s2_pull",     icon: "🏋️", label: "Max Pull-Ups × 3 sets",  sets: "Max reps. 3 min rest. Log total.", why: "6-month pulling strength delta." },
      { id: "s_s2_squat",    icon: "🦵", label: "Max Squat Hold",          sets: "Best time. Compare to Week 1.", why: "Hip and ankle mobility delta over 6 months." },
    ],
    conditioning: [
      { id: "c_s2_flow",     icon: "🌀", label: "7-Minute Flow + Au Batido Boss", sets: "Full simulation. Everything.", why: "Boss week conditioning test." },
    ],
    flexibility: [
      { id: "f_s2_full",     icon: "🧘", label: "Full 6-Month Flexibility Assessment", sets: "All ranges. Compare to baseline.", why: "Measure every range opened over 6 months." },
    ],
    xpBonus: 250,
  },

  // ── SPRINT 3: Intermediate (Weeks 25–36) ─────────────────────────
  // 3-month block goal: bananeira freestand 10s, macaco solo, au batido two-hand, 10-min flow

  25: {
    goal: "Bananeira freestand 3s → 10s",
    block: "Sprint 3 · Month 7",
    theme: "Handstand Balance + Proprioception",
    focus: "From 3s to 10s is a proprioceptive challenge, not a strength challenge.",
    strength: [
      { id: "s_hs_push",     icon: "💪", label: "Handstand Push-Up × 4×5", sets: "Wall handstand. Lower head toward floor. Press. 5 reps.", why: "Overhead strength at end-range — needed to maintain balance corrections." },
      { id: "s_hollow2",     icon: "⚡", label: "Hollow Body × 5×30s",    sets: "Perfect tension. Lower back flat. Arms overhead.", why: "The body shape that makes longer holds possible." },
      { id: "s_wrist_str2",  icon: "🤲", label: "Wrist Strength Circuit",  sets: "Push-up plus + wrist curl + reverse curl. 3×15 each.", why: "Wrist microstrength for balance corrections." },
    ],
    conditioning: [
      { id: "c_free_vol",    icon: "🙃", label: "Freestand Volume × 25 attempts", sets: "25 attempts. Log every hold time. Track trend.", why: "Neurological adaptation requires volume. 25 attempts minimum per session." },
    ],
    flexibility: [
      { id: "f_full_shoulder",icon:"🧘", label: "Full Shoulder Mobility Block", sets: "CARs + overhead + posterior capsule + internal rotation. 10 min total.", why: "Shoulder mobility governs handstand line quality. Better line = longer hold." },
    ],
    xpBonus: 185,
  },

  26: {
    goal: "Macaco spotted — back flexibility + explosive arm drive",
    block: "Sprint 3 · Month 7",
    theme: "Bridge Strength + Explosive Arm Drive",
    focus: "Macaco needs both a flexible back and arms that can drive through the arc.",
    strength: [
      { id: "s_bridge_str",  icon: "🐒", label: "Bridge Press × 4×10",    sets: "From bridge position — press hands into floor and push. 10 reps.", why: "The pushing action in macaco — arms drive the body over the arc." },
      { id: "s_exp_pullup",  icon: "🏋️", label: "Explosive Pull-Ups × 4×5", sets: "Pull explosively — touch chest to bar if possible. 5 reps.", why: "Pulling explosiveness helps the arm catch and drive in macaco." },
      { id: "s_tricep_dip",  icon: "💪", label: "Tricep Dips × 4×12",     sets: "Full range. Slow down — fast up.", why: "Tricep strength controls the arm in the macaco arc path." },
    ],
    conditioning: [
      { id: "c_mac_prep",    icon: "🐒", label: "Macaco Prep Circuit × 3×5", sets: "Bridge hold 10s → macaquinho → spotted macaco attempt. 5 each side × 3 rounds.", why: "Progressive conditioning into the full macaco with accumulated back fatigue." },
    ],
    flexibility: [
      { id: "f_thoracic2",   icon: "🧘", label: "Deep Thoracic Opening",   sets: "Foam roller + bands overhead + back bend on chair. 15 min total.", why: "Thoracic extension is the primary macaco bottleneck. This session targets nothing else." },
      { id: "f_shoulder_ext",icon: "🧘", label: "Shoulder Extension Stretch", sets: "Behind-back reach 3 min each + doorframe extension 3 min", why: "Shoulder extension range in macaco determines how far back you can reach safely." },
    ],
    xpBonus: 190,
  },

  27: {
    goal: "Au → Bananeira entry — momentum control",
    block: "Sprint 3 · Month 7",
    theme: "Momentum Control + Inversion Entry Strength",
    focus: "Carrying au momentum into bananeira requires a specific kind of shoulder control.",
    strength: [
      { id: "s_momentum_pu", icon: "💪", label: "Momentum Push-Up → Hold × 3×5", sets: "Push explosively — hold top position 3s. 5 reps.", why: "Explosive push into held position = the shoulder demand of au → bananeira transition." },
      { id: "s_kickup_str",  icon: "🙃", label: "Cartwheel Kick-Up × 4×5",sets: "From au position — redirect momentum upward into wall bananeira. 5 each side.", why: "The specific strength pattern of the au → bananeira entry." },
      { id: "s_core_anti",   icon: "⚡", label: "Anti-Extension Core × 4×20s", sets: "Ab wheel or plank walkout. 20s each. Control the spine.", why: "Spinal stability at the transition point — prevents banana-back in the bananeira entry." },
    ],
    conditioning: [
      { id: "c_au_ban_vol",  icon: "🌀", label: "Au → Bananeira × 15 attempts", sets: "15 attempts. Wall first. Log: controlled? Yes/no.", why: "Volume for neurological adaptation. The body learns this pattern through repetition." },
    ],
    flexibility: [
      { id: "f_wrist_bend",  icon: "🧘", label: "Wrist + Forearm Full Release", sets: "Extension + flexion + pronation/supination. 2 min each.", why: "Au → bananeira loads the wrist in transition. Full mobility reduces risk and improves landing." },
    ],
    xpBonus: 190,
  },

  28: {
    goal: "Queda de Rins switch — lateral core speed",
    block: "Sprint 3 · Month 7",
    theme: "Lateral Core Speed + Bilateral Balance",
    focus: "Switching QdR requires the core to generate lateral force quickly.",
    strength: [
      { id: "s_side_plank3", icon: "⚖️", label: "Side Plank with Hip Dips × 4×15", sets: "15 each side. Hip touches floor — drive back up. Explosive.", why: "Lateral core power under fatigue — needed for quick QdR switches." },
      { id: "s_lateral_hop", icon: "🦵", label: "Lateral Hops × 4×10",    sets: "10 each side. Side-to-side. Land soft — immediate next.", why: "Lateral movement speed and power for direction changes in floor game." },
      { id: "s_qdr_switch_str",icon:"⚖️",label:"QdR Switch Practice × 4×8",sets: "8 switches each session. Controlled speed.", why: "Direct practice of the switch movement as a strength exercise." },
    ],
    conditioning: [
      { id: "c_floor_switch",icon: "🌀", label: "Floor Switch Circuit × 4×3 min", sets: "QdR → switch → rolê → QdR. 3 min continuous. 2 min rest.", why: "Switch under cardiovascular load — the real game demand." },
    ],
    flexibility: [
      { id: "f_lateral_line",icon: "🧘", label: "Full Lateral Chain Release", sets: "IT band + QL + hip abductor + lat. 2 min each side each.", why: "The lateral chain controls QdR. Stiffness here limits hold time and switch speed." },
    ],
    xpBonus: 185,
  },

  29: {
    goal: "Au Batido two-hand — leg switch + kick timing",
    block: "Sprint 3 · Month 8",
    theme: "Leg Speed + Shoulder Stability Under Dynamic Load",
    focus: "Au batido is a cartwheel with a kick. Train the kick timing and shoulder stability separately.",
    strength: [
      { id: "s_leg_switch",  icon: "⚡", label: "Wall Leg Switch Drill × 3×20", sets: "Against wall — switch legs in L-position. 20 reps. Explosive.", why: "This exact drill trains the leg switch that creates au batido. Non-negotiable prerequisite." },
      { id: "s_unilat_pu",  icon: "💪", label: "Archer Push-Ups × 3×8",  sets: "8 each side. Extend one arm — press through the bent arm.", why: "Unilateral shoulder loading under dynamic conditions — what one-arm au batido will require." },
      { id: "s_kick_snap",   icon: "🦵", label: "Standing Kick Snap × 3×15", sets: "15 each leg. Hip chamber → explosive snap → control.", why: "Kick speed and snap for the batido impact. The arm provides structure, the leg provides force." },
    ],
    conditioning: [
      { id: "c_batido_drill",icon: "🌀", label: "Au Batido Drill × 4 rounds",  sets: "10 two-hand au batido each side. 2 min rest. 4 rounds. Log form consistency.", why: "Au batido endurance. The kick must land correctly on rep 10 as well as rep 1." },
    ],
    flexibility: [
      { id: "f_hip_kick_flex",icon:"🧘", label: "Hip Flexor + Quad Stretch", sets: "Couch stretch 3 min each + standing quad 2 min each + hip flexor lunge 2 min each", why: "Kick height and snap require hip flexor and quad flexibility. Tight here = short kick arc." },
    ],
    xpBonus: 195,
  },

  30: {
    goal: "Chicote + Chapéu de Couro — spinning kick speed",
    block: "Sprint 3 · Month 8",
    theme: "Rotational Speed + Spinning Balance",
    focus: "Spinning kicks need both rotational speed and the balance to survive that speed.",
    strength: [
      { id: "s_spin_balance",icon: "🔄", label: "Spinning Balance Drill × 3×10", sets: "Spin 360° — stop — hold balance 3s. 10 reps each direction.", why: "Vestibular adaptation for spinning kicks. Trains spotting and post-spin balance." },
      { id: "s_hip_power",   icon: "🦵", label: "Hip Drive Lunges × 3×12",sets: "12 each side. Drive through hip at top. Explosive.", why: "Hip drive power = spinning kick power. The spin comes from the hip, not the foot." },
      { id: "s_core_spin",   icon: "🔄", label: "Rotational Throws × 3×10",sets: "Wall ball toss rotation or med ball. 10 each side.", why: "Rotational power and speed — the engine behind chicote and chapéu de couro." },
    ],
    conditioning: [
      { id: "c_spin_kicks",  icon: "🌀", label: "Spinning Kick Circuit × 3×4 min", sets: "Armada + chicote + chapéu de couro cycling. 4 min each round.", why: "Conditioning the vestibular system and legs for repeated spinning under fatigue." },
    ],
    flexibility: [
      { id: "f_spine_rot2",  icon: "🧘", label: "Rotational Spine Mobility", sets: "Seated rotation + lying rotation + thread-the-needle. 2 min each direction.", why: "Spinal rotation range directly limits spinning kick arc. Open it and the kick improves." },
    ],
    xpBonus: 195,
  },

  31: {
    goal: "Bananeira freestand 10s — hold time mastery",
    block: "Sprint 3 · Month 8",
    theme: "Balance Mastery + Shoulder Endurance",
    focus: "10 seconds requires shoulder endurance AND balance simultaneously.",
    strength: [
      { id: "s_hs_hold",     icon: "🙃", label: "Wall Bananeira Hold × 5×max", sets: "Max time each. Log every attempt. Rest 3 min.", why: "Shoulder endurance is 50% of the 10-second hold. Build it here." },
      { id: "s_pushup_100",  icon: "💪", label: "100 Push-Ups",            sets: "Any split. All with full range.", why: "General shoulder endurance — the base that supports handstand endurance." },
      { id: "s_pullup_max",  icon: "🏋️", label: "Pull-Ups × 5 sets max",  sets: "Max reps. 2 min rest.", why: "Pulling endurance for controlled bananeira descents." },
    ],
    conditioning: [
      { id: "c_free_ban2",   icon: "🙃", label: "Freestand Session × 30 attempts", sets: "30 attempts. Chase best time each. Log the trend.", why: "30 attempts is where 10-second holds start appearing reliably." },
    ],
    flexibility: [
      { id: "f_full_upper",  icon: "🧘", label: "Full Upper Body Mobility",sets: "Thoracic + shoulder + wrist + lat. 15 min total.", why: "Every degree of upper body range opened here extends the bananeira hold time." },
    ],
    xpBonus: 200,
  },

  32: {
    goal: "Tesoura de Angola — scissors timing and low game depth",
    block: "Sprint 3 · Month 8",
    theme: "Leg Scissoring Strength + Low Level Endurance",
    focus: "Tesoura requires specific hip and leg strength at floor level.",
    strength: [
      { id: "s_scissors",    icon: "🦵", label: "Lying Scissors × 4×15",  sets: "15 each direction. Slow. Feel the hip flexor + adductor.", why: "Hip flexor and adductor coordination for the scissoring motion." },
      { id: "s_ground_push", icon: "💪", label: "Ground Push Circuit × 3×10", sets: "From floor: push to rolê position. 10 reps. Explosive.", why: "Pushing from floor to movement position — the transition tesoura requires." },
      { id: "s_leg_raise",   icon: "🦵", label: "Hanging Leg Raise × 4×10", sets: "10 reps. Full range. Slow.", why: "Hip flexor strength for leg height in tesoura." },
    ],
    conditioning: [
      { id: "c_tesoura_flow",icon: "🌀", label: "Tesoura Integration × 3×4 min", sets: "Low game flow with tesoura attempts. 4 min rounds.", why: "Tesoura in context. It only works when the low game is already flowing." },
    ],
    flexibility: [
      { id: "f_deep_hip",    icon: "🧘", label: "Deep Hip Flexor + Adductor", sets: "Full split attempt 3 min + frog hold 3 min + pigeon 2 min each", why: "Tesoura scissor range is limited by hip flexibility. Push every range here." },
    ],
    xpBonus: 195,
  },

  33: {
    goal: "Macaco solo — full commitment without spot",
    block: "Sprint 3 · Month 9",
    theme: "Explosive Back Strength + Commitment Power",
    focus: "Solo macaco is 90% commitment. The strength is already there if the bridge is solid.",
    strength: [
      { id: "s_bridge_exp",  icon: "🐒", label: "Explosive Bridge × 4×8", sets: "From bridge — explosive push. Don't hold — release. 8 reps.", why: "Trains the explosive commitment phase of macaco — once you start you cannot stop." },
      { id: "s_cat_pass",    icon: "💪", label: "Cartwheel → Bridge × 4×3", sets: "3 reps each side. Cartwheel to bridge landing.", why: "Trains the exact landing pattern macaco requires." },
      { id: "s_pullup_exp",  icon: "🏋️", label: "Clapping Pull-Ups × 3×5",sets: "5 reps. Explosive. Full hang.", why: "Explosive pulling strength for macaco arm drive." },
    ],
    conditioning: [
      { id: "c_macaco_flow", icon: "🐒", label: "Macaco Flow × 3×5",      sets: "5 solo macaco each side × 3 rounds. 3 min rest between.", why: "Solo macaco volume under fatigue. The body must maintain form without the spot." },
    ],
    flexibility: [
      { id: "f_macaco_prep", icon: "🧘", label: "Macaco-Specific Flexibility", sets: "Bridge max hold 3 min + shoulder overhead 3 min + wrist extension 3 min", why: "Every limiting range for macaco. Open all three before and after every session." },
    ],
    xpBonus: 205,
  },

  34: {
    goal: "Advanced combinations — Armada → Au, MLDC → Negativa",
    block: "Sprint 3 · Month 9",
    theme: "Combination Speed + Recovery Conditioning",
    focus: "Combinations require that each movement leaves the body ready for the next.",
    strength: [
      { id: "s_combo_strength",icon:"💪",label: "Combo Strength Circuit × 4 rounds",sets: "Push-up + squat jump + pull-up + squat. 10 each. No rest within round. 2 min between.", why: "Full-body rapid transition strength — the demand of a combination in a roda." },
      { id: "s_kick_squat",   icon: "🦵", label: "Kick + Squat Circuit × 3×10", sets: "10 kicks + 10 squats alternating. 3 rounds.", why: "Trains leg recovery between kicks — needed for combination attacks." },
    ],
    conditioning: [
      { id: "c_combo_game",   icon: "🌀", label: "Combination Game × 4×5 min", sets: "Pick 3 combinations — chain them in a 5-min round. 2 min rest. 4 rounds.", why: "Combination endurance. The body must execute linked movements 30 minutes into a session." },
    ],
    flexibility: [
      { id: "f_pre_combo",    icon: "🧘", label: "Pre-Combination Mobility",  sets: "Hip + shoulder + spine rotation. 10 min full flow.", why: "Combination range is limited by the least flexible joint in the chain. Open everything." },
    ],
    xpBonus: 205,
  },

  35: {
    goal: "Bananeira Boss III prep — full criteria in one session",
    block: "Sprint 3 · Month 9",
    theme: "Boss III Rehearsal",
    focus: "Run the full Bananeira Boss III criteria as a practice session.",
    strength: [
      { id: "s_ban3_test",   icon: "🙃", label: "10s Freestand × 3 attempts", sets: "Max time. Log best.", why: "Primary Bananeira Boss III criterion." },
      { id: "s_au_ban_test", icon: "🌀", label: "Au → Bananeira × 5",       sets: "Controlled entries. Log consistency.", why: "Second Bananeira Boss III criterion." },
    ],
    conditioning: [
      { id: "c_boss3_sim",   icon: "🌀", label: "Boss III Full Simulation",  sets: "10s freestand + Au → bananeira + 5-min flow. Exactly the boss criteria.", why: "Running the boss as training. Exposes what still needs work." },
    ],
    flexibility: [
      { id: "f_pre_boss3",   icon: "🧘", label: "Full Pre-Boss Mobility",   sets: "Shoulder + wrist + hip. 12 min total. Open everything.", why: "Arrive at the test with full range. Flexibility is free performance." },
    ],
    xpBonus: 215,
  },

  36: {
    goal: "Sprint 3 Boss Week",
    block: "Sprint 3 · Month 9 · BOSS WEEK",
    theme: "Sprint 3 Peak Output",
    focus: "9 months of work. This is the test.",
    strength: [
      { id: "s_s3_push",     icon: "💪", label: "Max Push-Ups × 3 sets",  sets: "Compare to Week 1 baseline.", why: "9-month pushing strength delta." },
      { id: "s_s3_pull",     icon: "🏋️", label: "Max Pull-Ups × 3 sets", sets: "Log total. Compare to Week 1.", why: "9-month pulling strength delta." },
      { id: "s_s3_squat",    icon: "🦵", label: "Max Squat Hold",         sets: "Best time. Compare.", why: "Mobility delta." },
    ],
    conditioning: [
      { id: "c_s3_flow",     icon: "🌀", label: "10-Min Flow + Boss Tests", sets: "All Sprint 3 boss criteria.", why: "Sprint 3 boss week simulation." },
    ],
    flexibility: [
      { id: "f_s3_assess",   icon: "🧘", label: "9-Month Flexibility Assessment", sets: "All ranges. Log vs. baseline.", why: "9-month mobility delta." },
    ],
    xpBonus: 250,
  },

  // ── SPRINT 4: Advanced (Weeks 37–52) ─────────────────────────────
  // 3-month block goal: au batido one-hand in flow, MLDC → bananeira, full roda, S-rank

  37: {
    goal: "Two-hand Au Batido automatic — groove the pattern",
    block: "Sprint 4 · Month 10",
    theme: "Au Batido Groove + Shoulder Power Endurance",
    focus: "Make two-hand au batido require zero thought. Volume and groove.",
    strength: [
      { id: "s_batido_power",icon: "💪", label: "Push-Up → Kick Drill × 4×10", sets: "Push-up → jump to standing → kick. 10 reps. Explosive.", why: "Combines pushing and kicking in one explosive sequence — the au batido demand pattern." },
      { id: "s_handstand_kick",icon:"🙃",label:"Wall Handstand Kick × 4×10", sets: "Kick up — opposite leg only — return. 10 each side.", why: "Single-leg handstand kicking — the exact au batido leg pattern." },
      { id: "s_100_pushup",  icon: "💪", label: "100 Push-Ups",            sets: "10×10. Shoulder endurance for repeated au batido.", why: "Shoulder endurance for au batido volume sessions." },
    ],
    conditioning: [
      { id: "c_batido_flow", icon: "🌀", label: "Au Batido Flow × 5×4 min",sets: "Au batido in continuous flow. 4 min each round. 2 min rest. 5 rounds.", why: "Groove the movement under fatigue — automatic form means it works in a real roda." },
    ],
    flexibility: [
      { id: "f_batido_upper",icon: "🧘", label: "Post-Batido Upper Body",  sets: "Shoulder + wrist + lat. 12 min full release.", why: "Au batido loads the shoulder heavily. Release it after every session." },
    ],
    xpBonus: 210,
  },

  38: {
    goal: "MLDC → Bananeira first attempts",
    block: "Sprint 4 · Month 10",
    theme: "MLDC Power + Inversion Entry Under Momentum",
    focus: "MLDC → bananeira requires MLDC power AND bananeira stability simultaneously.",
    strength: [
      { id: "s_mldc_power2", icon: "💥", label: "MLDC Power Drill × 4×10", sets: "Max speed each rep. 10 each side. 2 min rest.", why: "MLDC momentum is what carries into bananeira. More power = better entry." },
      { id: "s_hs_strength", icon: "🙃", label: "Wall Handstand Press × 5×5", sets: "5 reps each set. Slow descent. Explosive press.", why: "Pressing strength at bananeira entry point — when MLDC momentum arrives." },
      { id: "s_core_brace2", icon: "⚡", label: "Anti-Rotation + Hollow × 4×30s", sets: "30s each. Core must be rigid at entry.", why: "Core rigidity is what stops the body from collapsing when MLDC momentum hits the handstand." },
    ],
    conditioning: [
      { id: "c_mldc_ban_vol",icon: "🌀", label: "MLDC → Bananeira × 10 attempts", sets: "10 attempts. Wall safety option. Log: controlled entry? Yes/no.", why: "Volume for neurological adaptation. The entry must become reliable." },
    ],
    flexibility: [
      { id: "f_full_chain",  icon: "🧘", label: "Full MLDC → Ban Flexibility Chain", sets: "Hamstring + hip ext + shoulder + wrist. 15 min complete chain.", why: "Every range in the MLDC → bananeira chain opened in sequence." },
    ],
    xpBonus: 215,
  },

  // Weeks 39–51 maintain the same structure —
  // progressively increasing intensity, specific to each week's goal

  39: {
    goal: "One-hand Au Batido prep",
    block: "Sprint 4 · Month 10",
    theme: "Unilateral Shoulder Strength",
    focus: "One arm must support full body weight. Train that specifically.",
    strength: [
      { id: "s_archer2",     icon: "💪", label: "Archer Push-Ups × 5×8",  sets: "8 each side. Full range. Slow eccentric.", why: "Unilateral shoulder pressing — the exact demand of one-arm au batido." },
      { id: "s_single_push", icon: "🙃", label: "Wall One-Arm Hold × 4×10s", sets: "10s each arm in partial handstand. Assisted.", why: "Single-arm handstand tolerance — progressive load toward one-hand au batido." },
      { id: "s_unilat_pull",  icon: "🏋️", label: "Archer Pull-Ups × 3×5", sets: "5 each side. Full range.", why: "Unilateral pulling strength counterbalances the pressing demand." },
    ],
    conditioning: [
      { id: "c_onehand_prep",icon: "🌀", label: "One-Hand Au Prep × 3 rounds", sets: "Two-hand → release one hand briefly → re-catch. 10 reps each side per round.", why: "Progressive unilateral loading in the movement context." },
    ],
    flexibility: [
      { id: "f_unilat_shoulder",icon:"🧘",label:"Single-Arm Shoulder Opening", sets: "One arm at a time: all planes. 3 min each arm each direction.", why: "Unilateral shoulder mobility for the arm that carries everything in one-hand au batido." },
    ],
    xpBonus: 215,
  },

  40: { goal: "Au Queda de Rins",                 block: "Sprint 4 · Month 10", theme: "Cartwheel Into Balance — Elbow-Hip Precision", focus: "Au QdR requires landing on the elbow-hip point from full cartwheel momentum.", strength: [{ id: "s_elbow_hop", icon: "⚖️", label: "Elbow-Hip Load × 4×30s", sets: "QdR hold 30s each side. Wrist and elbow conditioned.", why: "Direct elbow joint conditioning for QdR holds." }, { id: "s_side_to_qdr", icon: "💪", label: "Side Plank → QdR × 3×5", sets: "5 transitions each side.", why: "Progressive entry into QdR from controlled position." }], conditioning: [{ id: "c_qdr_au", icon: "🌀", label: "Au QdR Drill × 3×8", sets: "8 each side. Full au → catch in QdR.", why: "Pattern conditioning for the exact transition." }], flexibility: [{ id: "f_lat_full", icon: "🧘", label: "Full Lateral + Shoulder", sets: "Lat + QL + hip lateral. 10 min.", why: "Open the lateral chain that QdR compresses." }], xpBonus: 215 },
  41: { goal: "Macaco → Au combination",           block: "Sprint 4 · Month 11", theme: "Backbend into Cartwheel — Explosive Continuity", focus: "Macaco must exit at the right angle and speed for au to follow naturally.", strength: [{ id: "s_mac_exp2", icon: "🐒", label: "Explosive Macaco × 4×5", sets: "5 each side. Max commitment.", why: "Macaco exit angle is generated by explosive hip drive." }, { id: "s_au_enter", icon: "🌀", label: "Au Entry Drill × 3×10", sets: "10 au from unusual entry angles.", why: "Au must adapt to macaco's exit direction." }], conditioning: [{ id: "c_mac_au_flow", icon: "🌀", label: "Macaco → Au Flow × 3×5 min", sets: "5-min rounds. Macaco → au cycling.", why: "Combination endurance." }], flexibility: [{ id: "f_back_chain", icon: "🧘", label: "Back Chain Full Opening", sets: "Bridge + thoracic + shoulder. 15 min.", why: "Back flexibility for macaco feeds into the au that follows." }], xpBonus: 220 },
  42: { goal: "Au Navalha — precision kick in cartwheel", block: "Sprint 4 · Month 11", theme: "Leg Precision + Hip Control", focus: "The navalha (razor) cuts cleanly. Train the hip to produce that precision.", strength: [{ id: "s_navalha_kick", icon: "⚡", label: "Slow Au Navalha × 4×8", sets: "8 each side. Pause at kick point.", why: "Slow precision builds the neural pattern." }, { id: "s_kick_precision", icon: "🦵", label: "Precision Kick Drill × 3×15", sets: "15 each side. Target height. Controlled.", why: "Kick accuracy under fatigue." }], conditioning: [{ id: "c_navalha_flow", icon: "🌀", label: "Au Navalha Flow × 4×4 min", sets: "4-min rounds. Au navalha in flow.", why: "Navalha in game context." }], flexibility: [{ id: "f_hip_full2", icon: "🧘", label: "Hip Full Opening", sets: "All planes. 12 min.", why: "Kick arc needs full hip range." }], xpBonus: 220 },
  43: { goal: "10-min roda — full simulation",       block: "Sprint 4 · Month 11", theme: "Roda Peak Conditioning", focus: "10 minutes is not training anymore. It is the game.", strength: [{ id: "s_100pu_100sq", icon: "💪", label: "100 Push-Ups + 100 Squats", sets: "Any split. Full range. Before the flow.", why: "Pre-fatigue the body so the flow trains real game endurance." }, { id: "s_pullup_max3", icon: "🏋️", label: "Max Pull-Up Sets × 5", sets: "Max reps. Log total.", why: "Pulling endurance for the full game." }], conditioning: [{ id: "c_10min_roda", icon: "🌀", label: "10-Min Roda Simulation × 2 rounds", sets: "10 min each. 5 min rest between. Everything.", why: "Double round conditioning — prepares the body for 2 × 10-min boss test." }], flexibility: [{ id: "f_roda_recovery", icon: "🧘", label: "Full Roda Recovery Stretch", sets: "All major systems. 20 min.", why: "Recovery quality determines next session quality." }], xpBonus: 230 },
  44: { goal: "Bananeira walking + direction changes", block: "Sprint 4 · Month 11", theme: "Dynamic Handstand Control", focus: "Walking in bananeira requires hip shifting and weight transfer. Build that.", strength: [{ id: "s_hs_walk", icon: "🙃", label: "Wall Walk-Out × 4×5", sets: "From wall — walk hands away. 5 steps each.", why: "Progressive weight shift training in handstand." }, { id: "s_shoulder_stab", icon: "💪", label: "Shoulder Stability Circuit", sets: "Band pull-apart + face pull + Y-T-W. 3×15 each.", why: "Rotator cuff stability for dynamic handstand movement." }], conditioning: [{ id: "c_ban_walk", icon: "🙃", label: "Bananeira Walk Attempts × 20", sets: "20 attempts. Log steps.", why: "Volume for walking adaptation." }], flexibility: [{ id: "f_shoulder_dyn", icon: "🧘", label: "Dynamic Shoulder Mobility", sets: "CARs + band distraction + all planes. 12 min.", why: "Dynamic mobility matches dynamic handstand demand." }], xpBonus: 225 },
  45: { goal: "One-hand Au Batido in flow",           block: "Sprint 4 · Month 12", theme: "One-Arm Au Batido Mastery", focus: "The one-hand form must work inside a moving round. Train for that.", strength: [{ id: "s_1arm_power", icon: "💪", label: "One-Arm Push-Up Progress × 4×5", sets: "5 each side. Knees if needed → feet.", why: "One-arm pressing power for au batido." }, { id: "s_batido_100", icon: "🌀", label: "100 Au Basico", sets: "50 each side. Shoulder endurance base.", why: "Shoulder endurance base for one-hand session." }], conditioning: [{ id: "c_1h_batido_flow", icon: "🌀", label: "One-Hand Au Batido Flow × 5×4 min", sets: "4-min flow rounds. One-hand batido in context.", why: "Make the one-hand form automatic in game." }], flexibility: [{ id: "f_one_arm", icon: "🧘", label: "Unilateral Shoulder Full Release", sets: "One arm at a time. All planes. 4 min each.", why: "Unilateral shoulder care for one-arm loading sessions." }], xpBonus: 230 },
  46: { goal: "Au de Costas intro",                  block: "Sprint 4 · Month 12", theme: "Back Cartwheel — Back Flexibility + Commitment", focus: "Au de costas requires trusting the arc backwards. Train the back and the commitment.", strength: [{ id: "s_back_bridge2", icon: "🐒", label: "Max Bridge Hold × 3", sets: "Max time each. Log.", why: "Back flexibility benchmark for au de costas." }, { id: "s_back_walkover", icon: "💪", label: "Back Bend Walks × 3×5", sets: "5 walk-overs if possible. Bridge → stand.", why: "Progressive back arc commitment." }], conditioning: [{ id: "c_back_au", icon: "🌀", label: "Au de Costas × 15 attempts", sets: "Wall-assisted. Log confidence level.", why: "Volume for the neurological adaptation." }], flexibility: [{ id: "f_spine_full", icon: "🧘", label: "Full Spinal Mobility", sets: "Flexion + extension + rotation + lateral. 15 min.", why: "Au de costas needs the full spinal range." }], xpBonus: 225 },
  47: { goal: "MLDC → Bananeira controlled",          block: "Sprint 4 · Month 12", theme: "Signature Combination Mastery", focus: "The entry is reliable. Now make it clean.", strength: [{ id: "s_mldc_clean", icon: "⚡", label: "MLDC Power × 3×20", sets: "20 each side. Max speed.", why: "MLDC must be powerful enough to carry into bananeira." }, { id: "s_hs_stable", icon: "🙃", label: "Freestand Holds × 5 max", sets: "Max time each. Log.", why: "Bananeira stability at arrival point." }], conditioning: [{ id: "c_mldc_ban2", icon: "🌀", label: "MLDC → Bananeira × 15", sets: "15 attempts. Both sides. Log: clean entry? Landing?", why: "Make the combination reliable under volume." }], flexibility: [{ id: "f_full_combo_chain", icon: "🧘", label: "Full MLDC → Ban Chain", sets: "Ham + hip ext + shoulder + wrist. 15 min.", why: "Every range in the chain opened completely." }], xpBonus: 235 },
  48: { goal: "Escorpião freestanding",               block: "Sprint 4 · Month 12", theme: "Scorpion Kick — Inversion + Back Flexibility + Balance", focus: "Escorpião requires bananeira control AND deep back flexibility AND kick precision.", strength: [{ id: "s_escorp_prep", icon: "🦵", label: "Wall Escorpião × 3×5", sets: "5 each side. Wall for safety.", why: "Progressive loading toward freestanding form." }, { id: "s_back_open", icon: "🐒", label: "Bridge + Overhead Reach × 3×10", sets: "10 reps. Maximum range.", why: "Back arc depth for escorpião kick range." }], conditioning: [{ id: "c_escorp_flow", icon: "🌀", label: "Escorpião Integration × 10", sets: "10 attempts from bananeira. Log form.", why: "Make it usable in flow." }], flexibility: [{ id: "f_deep_back", icon: "🧘", label: "Deep Back + Shoulder Opening", sets: "Max bridge 3 min + shoulder ext 3 min + thoracic 3 min.", why: "Escorpião is a flexibility movement as much as strength." }], xpBonus: 235 },
  49: { goal: "2 × 10-min rounds — roda simulation",  block: "Sprint 4 · Month 12", theme: "Double Round Conditioning", focus: "Two rounds is what a roda demands. Train it exactly.", strength: [{ id: "s_pre_roda", icon: "💪", label: "Pre-Roda Strength Circuit", sets: "50 push-up + 30 pull-up + 100 squat. Then the rounds.", why: "Pre-fatigue simulation of what happens later in a roda session." }], conditioning: [{ id: "c_double_round", icon: "🌀", label: "2 × 10-Min Rounds",       sets: "10 min on. 3 min rest. 10 min on. Everything.", why: "Boss test conditioning rehearsal." }], flexibility: [{ id: "f_post_roda", icon: "🧘", label: "Post-Roda Full Recovery", sets: "20 min. All major systems.", why: "Recovery quality determines if you can train tomorrow." }], xpBonus: 240 },
  50: { goal: "All boss tests rehearsal",              block: "Sprint 4 · Month 12", theme: "Full Boss Rehearsal", focus: "Run every Sprint boss criteria in one session.", strength: [{ id: "s_all_strength", icon: "⚡", label: "Full Strength Benchmark", sets: "Max push-ups + max pull-ups + max squat hold. Log all.", why: "12-month strength delta — the final measurement." }], conditioning: [{ id: "c_boss_all", icon: "🌀", label: "All Boss Criteria × Full Session", sets: "Run each boss test with 5 min rest between.", why: "Preparation for boss week." }], flexibility: [{ id: "f_12month", icon: "🧘", label: "12-Month Flexibility Assessment", sets: "All ranges. Compare to Week 1.", why: "Full year mobility delta." }], xpBonus: 245 },
  51: { goal: "Annual Boss Week",                      block: "Sprint 4 · Month 12 · BOSS WEEK", theme: "Peak Output — Annual Boss", focus: "Everything you built in 51 weeks. This is the test.", strength: [{ id: "s_annual_push", icon: "💪", label: "Max Push-Ups × 3 sets", sets: "Max. Compare to Week 1.", why: "Full year pushing strength delta." }, { id: "s_annual_pull", icon: "🏋️", label: "Max Pull-Ups × 3 sets", sets: "Max. Compare to Week 1.", why: "Full year pulling strength delta." }], conditioning: [{ id: "c_annual_flow", icon: "🌀", label: "10-Min Flow + Au Batido Boss + MLDC → Ban Boss", sets: "Full boss sequence.", why: "Annual boss week test." }], flexibility: [{ id: "f_annual_assess", icon: "🧘", label: "Full Annual Flexibility Test", sets: "Every range. Log vs. Week 1.", why: "Year 1 mobility delta." }], xpBonus: 260 },
  52: { goal: "S-Rank achieved — Year 1 complete",     block: "Sprint 4 · Year 1 FINAL", theme: "Reflection + Year 2 Baseline", focus: "You are a different person. Measure everything. Plan what comes next.", strength: [{ id: "s_year2_base", icon: "💪", label: "Year 2 Strength Baseline", sets: "Max push-up + pull-up + squat hold. Log for Year 2.", why: "Year 2 starts with better numbers. Document the floor." }], conditioning: [{ id: "c_year2_flow", icon: "🌀", label: "Year 2 Flow Baseline", sets: "10-min flow. Record video if possible.", why: "Document your Year 1 flow quality." }], flexibility: [{ id: "f_year2_base", icon: "🧘", label: "Year 2 Flexibility Baseline", sets: "All ranges. Compare to Week 1. Marvel at the delta.", why: "Year 1 is done. The Year 2 body starts here." }], xpBonus: 300 },
};

export function buildBonusQuest(week, dow, level) {
  const weekKey = Math.min(Math.max(1, week), 52);
  const weekBonus = WEEKLY_BONUS[weekKey] || WEEKLY_BONUS[1];

  const levelTier = Math.floor(level / 30);
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
