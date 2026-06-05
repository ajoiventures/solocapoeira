import sys

NEW_SPRINT1 = '''const WEEKLY_BONUS = {
  // -- SPRINT 1: Foundation (Weeks 1-12)
  // 3-month block goal: MLDC -> slow au -> handstand
  // Phase 1 (Wks 1-4): Joint armor + MLDC prerequisites
  // Phase 2 (Wks 5-8): MLDC hand plant + slow hip lift off floor
  // Phase 3 (Wks 9-12): Slow au pauses + handstand chain + boss test

  1: {
    goal: "Baseline -- diagnose wrist, shoulder, hamstring limits",
    block: "Sprint 1 - Month 1",
    theme: "Diagnostic Baseline + Armor Foundation",
    focus: "You cannot build toward MLDC to au to handstand without knowing your starting point. Every number you log today is a reference for Week 12.",
    strength: [
      { id: "s1_max_pushup",   icon: "PUSH", label: "Max Push-Up Test",          sets: "1 max set -- log the number. Rest 3 min. Week 12 comparison.", why: "Shoulder pressing baseline. Handstand requires this to sustain overhead load." },
      { id: "s1_dead_hang",    icon: "HANG", label: "Dead Hang x 3 sets",        sets: "Max time each set. Log seconds.", why: "Grip + scapular stability baseline. Every au and MLDC hand plant demands this." },
      { id: "s1_wrist_load",   icon: "WRIST", label: "Wrist Loading Protocol",   sets: "Circles x 20 each direction + loaded extension 2x30s + knuckle press 2x10. Log any pain.", why: "The MLDC hand plant loads the wrist from a rotated angle. Diagnose tolerance now before it becomes injury." },
    ],
    conditioning: [
      { id: "c1_ginga_base",   icon: "FLOW", label: "10-Min Continuous Ginga",   sets: "Unbroken. No stopping. Log if you stop and when.", why: "Aerobic baseline. Roda endurance is the container for everything else." },
    ],
    flexibility: [
      { id: "f1_hamstring",    icon: "STRETCH", label: "Hamstring Assessment",   sets: "Standing forward fold -- hold 2 min. Log: fingers to floor? Shins? Knees?", why: "MLDC sweep arc is directly limited by hamstring length. This is your starting range." },
      { id: "f1_shoulder_flex",icon: "STRETCH", label: "Overhead Reach Assessment", sets: "Arms overhead against wall -- hold 2 min. Log gap between wrists and wall.", why: "Handstand requires full shoulder flexion. That gap is the handstand limiter." },
    ],
    xpBonus: 150,
  },

  2: {
    goal: "Wrist + shoulder armor -- build joint tolerance for MLDC hand plant",
    block: "Sprint 1 - Month 1",
    theme: "Wrist Conditioning + Scapular Control Foundation",
    focus: "The MLDC hand plant hits the wrist from a rotated lateral position. Armor the wrist from all four quadrants before the drill can be practiced safely.",
    strength: [
      { id: "s2_scap_pu",      icon: "PUSH", label: "Scapular Push-Ups x 4x20", sets: "Arms fully straight. Protract (push floor away) -- retract (let chest sag). Slow. No elbow bend.", why: "Scapular control is the #1 safety mechanism for every au and handstand." },
      { id: "s2_wrist_prog",   icon: "WRIST", label: "Progressive Wrist Loading x 4 rounds", sets: "Round 1: forward-facing 30s. Round 2: backward-facing 30s. Round 3: side-facing 30s each. Round 4: rotation hold 30s.", why: "MLDC hand plant comes from a spinning position -- the wrist angle is diagonal. All four quadrants must be conditioned." },
      { id: "s2_pike_pu",      icon: "PUSH", label: "Pike Push-Ups x 4x10",     sets: "Hips as high as possible. Lower crown toward floor. Press fully overhead. Slow.", why: "Overhead pressing strength is the prerequisite for holding any handstand." },
    ],
    conditioning: [
      { id: "c2_au_slow",      icon: "FLOW", label: "Slow Au x 3 rounds",       sets: "10 au each side per round. Go 50% speed. Pause 1 second when both hands are on floor.", why: "The pause at floor contact is the same position as the MLDC hand plant. Start feeling weight on hands from a cartwheel." },
    ],
    flexibility: [
      { id: "f2_wrist_ext",    icon: "STRETCH", label: "Wrist Extension Stretch",sets: "Fingers toward knees on floor x 3 min. Fingers to sides 2 min each. Shift weight gently.", why: "Handstand wrist angle needs 90 degrees extension. Most wrists sit at 60. Daily stretching closes this gap." },
      { id: "f2_thoracic",     icon: "STRETCH", label: "Thoracic Extension",     sets: "Foam roller on mid-back x 4 min. Arms overhead. Breathe into each spinal segment.", why: "Thoracic mobility = shoulder elevation = cleaner au overhead line. Tight t-spine is the hidden handstand limiter." },
    ],
    xpBonus: 155,
  },

  3: {
    goal: "MLDC mechanics -- hamstring + hip rotation + hand-to-floor reach",
    block: "Sprint 1 - Month 1",
    theme: "MLDC Foundation -- Hip Hinge + Rotational Strength",
    focus: "MLDC is a spinning hip hinge kick. Before the hand plant, the kick must be reliable. This week builds the hip mechanics and first practice of touching the floor.",
    strength: [
      { id: "s3_rdl",          icon: "LEG", label: "Single-Leg RDL x 4x10",     sets: "10 each side. Hinge at hip -- feel the hamstring load. Return slow and controlled.", why: "The MLDC loading phase is a single-leg hip hinge. This is the exact strength pattern." },
      { id: "s3_rotational",   icon: "CORE", label: "Rotational Core x 4x12",   sets: "12 each side. Resistance band or slow bodyweight rotation. Full range -- controlled return.", why: "MLDC sweeps through the transverse plane. Rotational core strength = kick control through the arc." },
      { id: "s3_floor_plant",  icon: "WRIST", label: "MLDC Floor Touch Drill x 3x10", sets: "10 slow MLDC each side. Goal: both hands touch floor at deepest point. Hold 1 second.", why: "This is the exact moment before the au begins. Get comfortable placing both hands on floor from the MLDC position." },
    ],
    conditioning: [
      { id: "c3_mldc_vol",     icon: "FLOW", label: "MLDC Volume Drill x 4 rounds", sets: "10 slow MLDC each side per round. 90 sec rest. Log: do hands reach floor?", why: "Hamstring endurance for MLDC. The kick must survive fatigue before it can transition to a handstand." },
    ],
    flexibility: [
      { id: "f3_hamstring",    icon: "STRETCH", label: "Hamstring Flexibility Block", sets: "Standing fold 3 min + seated single-leg fold 2 min each + PNF: 5s contract, relax, deeper x 3 each side.", why: "MLDC hand-to-floor reach is directly limited by hamstring length. Every cm of flexibility = deeper floor reach." },
      { id: "f3_hip_rotation", icon: "STRETCH", label: "Hip Internal Rotation", sets: "Seated figure-4 2 min each + prone hip IR 2 min each + pigeon 2 min each.", why: "MLDC rotates through the hip. Internal rotation range is the joint range the kick travels through." },
    ],
    xpBonus: 160,
  },

  4: {
    goal: "Slow au with floor pause -- shoulder endurance in the handstand position",
    block: "Sprint 1 - Month 2",
    theme: "Slow Au + Wall Handstand -- Inversion Endurance",
    focus: "A slow au is a handstand in motion. The body has to be strong enough to pause at the top. This week builds that endurance specifically.",
    strength: [
      { id: "s4_wall_tap",     icon: "INVERT", label: "Wall Shoulder Taps x 4x8", sets: "In wall bananeira. One shoulder at a time -- lift slowly. 8 each side. Do not rush.", why: "Unilateral shoulder loading in the handstand position is the exact strength required to slow an au and hold at top." },
      { id: "s4_wall_hold",    icon: "INVERT", label: "Wall Bananeira Hold x 5 attempts", sets: "Max hold each attempt. Record best time. 3 min rest. Target: 15+ seconds.", why: "The handstand hold time directly measures the shoulder endurance your slow au will require." },
      { id: "s4_pullup",       icon: "PULL", label: "Pull-Ups x 5 sets max",    sets: "Max reps each set. 2 min rest. Log total.", why: "Lat + serratus strength stabilizes the shoulder girdle during inversion and slows descent from handstand." },
    ],
    conditioning: [
      { id: "c4_slow_au",      icon: "FLOW", label: "Slow Au Pause Drill x 4 rounds", sets: "5 au each side per round. On every rep: pause 2 seconds when both hands are on floor. Slow the arc.", why: "The slow pause at floor contact is Phase 1's version of the MLDC hand plant position." },
    ],
    flexibility: [
      { id: "f4_overhead",     icon: "STRETCH", label: "Overhead Shoulder Line", sets: "Doorframe shoulder stretch 2 min each + floor overhead lat 3 min + cross-body 2 min each.", why: "Shoulder flexion range is the ceiling of your handstand line. Every degree opened now is a cleaner au overhead." },
      { id: "f4_wrist_full",   icon: "STRETCH", label: "Full Wrist Mobility Circuit", sets: "Extension 2 min + flexion 2 min + side-facing 2 min each + loaded back-of-hand 2 min.", why: "Four weeks of daily wrist work should be creating meaningful extension range. Do not skip this." },
    ],
    xpBonus: 165,
  },

  5: {
    goal: "MLDC hand plant -- lean forward, absorb weight, hold the floor position",
    block: "Sprint 1 - Month 2",
    theme: "MLDC to Floor -- Weight Transfer + Shoulder Loading",
    focus: "MLDC, plant both hands, lean weight into hands, hold the floor position 2 seconds. This is the beginning of the au. The body must accept weight from a spinning hip-hinged position.",
    strength: [
      { id: "s5_lateral_pu",   icon: "PUSH", label: "Lateral Shoulder Loading x 4x10", sets: "Push-up position, walk hands to one side until one arm is at 60 degrees, press. 10 each side.", why: "The MLDC hand plant is a lateral-facing shoulder load. Train the shoulder from this angle specifically." },
      { id: "s5_hollow_hold",  icon: "CORE", label: "Hollow Body Hold x 5x20s", sets: "Lower back flat on floor. Arms overhead, legs straight out. 20-sec holds. Breathe.", why: "Hollow body tension holds the shape in the handstand and slows the au arc." },
      { id: "s5_scap_press",   icon: "PUSH", label: "Scapular Push-Ups into Press x 4x15", sets: "5 scapular reps (straight arms) then flow into 10 full push-ups. Continuous.", why: "Trains the exact sequence of the MLDC landing: absorb (scap) then press (push-up)." },
    ],
    conditioning: [
      { id: "c5_mldc_plant",   icon: "FLOW", label: "MLDC Hand Plant Drill x 5 rounds", sets: "8 MLDC each side. On every rep: plant both hands and hold 2 sec before standing. Rest 90 sec.", why: "The specific drill. MLDC, hands on floor, pause, stand. This exact rep is the foundation of MLDC to au." },
    ],
    flexibility: [
      { id: "f5_hamstring",    icon: "STRETCH", label: "Hamstring Deepening Block", sets: "Standing fold 3 min + PNF: 5s contract, 10s deeper x 5 rounds. Log final range.", why: "Deeper hamstring = lower hand plant from MLDC = less distance to travel into au." },
      { id: "f5_shoulder_int", icon: "STRETCH", label: "Shoulder Internal Rotation", sets: "Sleeper stretch 3 min each + behind-back reach + towel assist 2 min each.", why: "Internal rotation allows the arm to rotate correctly during the au arc. Without it the shoulder compensates." },
    ],
    xpBonus: 170,
  },

  6: {
    goal: "Slow hip lift from floor -- MLDC hand plant, hips off ground, hold",
    block: "Sprint 1 - Month 2",
    theme: "Hip Float -- Core Compression + Shoulder Press to Lift",
    focus: "Hardest week in Phase 2. From the MLDC hand plant position: weight into hands, slowly lift hips and feet off the ground, hold 2 seconds. Core compresses hips toward chest while shoulders press and stabilize.",
    strength: [
      { id: "s6_lsit",         icon: "CORE", label: "L-Sit Progression x 5 sets", sets: "Chairs or parallettes. Tucked L-sit 10-20s per set. Log best time. Progress: tuck, one leg, full L.", why: "L-sit is the exact core compression pattern used to lift the hips off the floor from the MLDC hand plant." },
      { id: "s6_hollow_press", icon: "PUSH", label: "Hollow Body into Press Combo x 4x10", sets: "Hollow hold on back, roll to hands, press to push-up. 10 reps. Maintain hollow through transition.", why: "Trains the core-to-shoulder press transition. Core initiates hip compression, shoulders follow." },
      { id: "s6_lat_pull",     icon: "PULL", label: "Pull-Ups x 5 sets max + Dead Hang x 3x30s", sets: "Alternate pull-up set then dead hang. Log pull-up reps and hang time.", why: "The shoulder girdle must support full bodyweight during the MLDC hip lift. Hang endurance builds that capacity." },
    ],
    conditioning: [
      { id: "c6_hip_float",    icon: "FLOW", label: "MLDC Hand Plant Hip Lift Drill x 4 rounds", sets: "5 each side per round. MLDC, plant hands, lean weight in, lift hips 1-3 inches, hold 1s, lower. 90 sec rest.", why: "The actual drill. 1 inch off floor counts. Feel weight transfer and core compression working together." },
    ],
    flexibility: [
      { id: "f6_hip_flexor",   icon: "STRETCH", label: "Hip Flexor Release",   sets: "Couch stretch 3 min each + low lunge 2 min each + elevated back foot 2 min each.", why: "Tight hip flexors resist the hip lift. Releasing them lets the hips come up with less effort." },
      { id: "f6_wrist_load",   icon: "STRETCH", label: "Loaded Wrist Mobility", sets: "Forward extension hold with bodyweight 3 min + back-of-hand on floor 2 min + side circles 2 min.", why: "The MLDC hip lift puts maximum wrist load while the body is off-balance." },
    ],
    xpBonus: 175,
  },

  7: {
    goal: "Slow au arc -- pause at 3 points: entry, top, exit",
    block: "Sprint 1 - Month 2",
    theme: "Slow Au Pause Drill -- Shoulder + Core Control Through the Arc",
    focus: "Break the au into 3 checkpoints: (1) hands on floor = weight transferred, (2) hips at vertical = hollow body hold, (3) feet descending = controlled lowering. Pause 2 seconds at each point.",
    strength: [
      { id: "s7_pike_press",   icon: "PUSH", label: "Pike Push-Ups x 5x12",    sets: "Hips high. Press slow -- 3 sec down, 1 sec up. 12 reps x 5.", why: "The handstand top of the au requires sustained overhead pressing. This volume builds the endurance for the pause." },
      { id: "s7_side_plank",   icon: "CORE", label: "Side Plank x 4x45s",      sets: "45 sec each side. Hips stacked. Do not let them sag.", why: "Lateral core fires during arc transitions. Without this, the body twists or drops instead of pausing cleanly." },
      { id: "s7_wrist_fist",   icon: "WRIST", label: "Wrist Push-Up Progression x 3x10", sets: "10 push-ups on fists + 10 on fingertips + 10 supported back-of-hands. Log pain level.", why: "Fist and fingertip push-ups strengthen wrist intrinsic muscles that stabilize during the au arc pause." },
    ],
    conditioning: [
      { id: "c7_3point_au",    icon: "FLOW", label: "3-Point Slow Au x 4 rounds", sets: "5 au each side. Pause 2 sec at: entry (hands on floor) + top (hips over shoulders) + exit (one foot descending). Rest 2 min.", why: "This drill directly trains the slow controlled au. The 3 pauses force the body to hold positions it normally rushes through." },
    ],
    flexibility: [
      { id: "f7_shoulder_full",icon: "STRETCH", label: "Full Shoulder Mobility Circuit", sets: "Overhead lat 3 min + pec doorframe 2 min + cross-body 2 min each + thoracic roller 3 min.", why: "Shoulder range must be fully open for the handstand top. Every restriction shows up as a bent elbow at the top." },
      { id: "f7_hamstring_deep",icon: "STRETCH", label: "Hamstring Maximum Range", sets: "PNF standing fold x 5 rounds (5s contract, 10s deeper). Seated straddle 4 min. Log today's range.", why: "Deeper hamstring = lower center of mass at au entry = smoother transition into the handstand arc." },
    ],
    xpBonus: 175,
  },

  8: {
    goal: "MLDC into slow au entry -- connecting the kick to the handstand floor",
    block: "Sprint 1 - Month 3",
    theme: "MLDC to Au Chain -- Hip Hinge Into Handstand Entry",
    focus: "The full movement begins. MLDC, plant hands, lean weight in, slow hip lift, begin the au arc. You do not need to complete the handstand. Goal: smooth transition from MLDC into the first 90 degrees of the au. Quality over height.",
    strength: [
      { id: "s8_mldc_str",     icon: "LEG", label: "MLDC Strength Block x 4x8", sets: "8 slow MLDC each side. On every rep: pause at floor with hands planted. Feel the load. Slow return to standing.", why: "MLDC kick mechanics must be solid and fatigue-resistant before adding the au." },
      { id: "s8_shoulder_end", icon: "PUSH", label: "Wall Handstand Shoulder Endurance x 6 sets", sets: "Hold wall bananeira max time. 3 min rest. Log each hold. Target: 20+ seconds.", why: "The au will briefly put the full body in handstand. The shoulder must survive this under MLDC-accumulated fatigue." },
      { id: "s8_core_press",   icon: "CORE", label: "L-Sit into Tuck into Press Circuit x 4 rounds", sets: "L-sit 10s, pull knees to chest, press up to standing. 5 reps per round. Continuous.", why: "Exact motor pattern: compress (L-sit), tuck, press. This is MLDC hand plant, hip lift, au exit." },
    ],
    conditioning: [
      { id: "c8_mldc_au",      icon: "FLOW", label: "MLDC into Au Entry Drill x 5 rounds", sets: "4 reps each side. Full MLDC, hands on floor, lean forward, slow au entry. Do not rush past the hand plant. 2 min rest.", why: "The chain drill. The transition between MLDC and au is the skill being built. Slow is the goal." },
    ],
    flexibility: [
      { id: "f8_hip_hamstring", icon: "STRETCH", label: "Hip Hinge Flexibility Block", sets: "Standing fold 3 min + PNF hamstring x 5 rounds + forward fold with rotation 2 min each side.", why: "Deeper MLDC hand plant = lower hips when au begins = less height needed to enter the handstand arc." },
      { id: "f8_wrist_deep",   icon: "STRETCH", label: "Deep Wrist Conditioning", sets: "Full wrist mobility circuit 6 min total. Every angle. Loaded and unloaded.", why: "Week 8 wrist load is higher than any previous week. The MLDC + au combination doubles the wrist demand." },
    ],
    xpBonus: 180,
  },

  9: {
    goal: "Slow au with handstand pause -- hold at top for 3+ seconds",
    block: "Sprint 1 - Month 3",
    theme: "Handstand Hold at Au Top -- Shoulder + Balance + Hollow Body",
    focus: "The arc must now stop at the top. Hips over shoulders, legs vertical, hollow body, 3 seconds minimum. From any starting position. Then descend slow. Hardest pure strength target of Sprint 1.",
    strength: [
      { id: "s9_wall_endur",   icon: "INVERT", label: "Wall Bananeira Endurance x 6 sets", sets: "Hold max time. 3 min rest. Target: 25-30 seconds. Log every session.", why: "30-second wall hold = reliable handstand. The au top is a momentary handstand requiring this strength to pause in." },
      { id: "s9_hollow_rock",  icon: "CORE", label: "Hollow Body Rockings x 4x10", sets: "10 rocks per set. Maintain hollow throughout. No arm push -- core drives the rock.", why: "Hollow body rocking trains the exact core shape needed at the top of the au handstand." },
      { id: "s9_neg_press",    icon: "PUSH", label: "Negative Handstand Push-Up x 4x5", sets: "From wall bananeira -- lower crown to floor in 5 seconds. Press back up. 5 reps.", why: "Eccentric shoulder press = ability to hold and lower from handstand top instead of dumping onto one foot." },
    ],
    conditioning: [
      { id: "c9_au_hold",      icon: "FLOW", label: "Slow Au, Top Hold, Slow Exit x 5 rounds", sets: "3 au each side per round. Pause 3 seconds at handstand top. Slow descent. Rest 3 min between rounds.", why: "The target drill. Slow in -- hold -- slow out. Every rep is valuable." },
    ],
    flexibility: [
      { id: "f9_shoulder_max", icon: "STRETCH", label: "Maximum Shoulder Flexion Work", sets: "Wall overhead slide 3 min + floor overhead lat 3 min + doorframe stretch 2 min each arm.", why: "By week 9 shoulder flexion should be noticeably improved. Push to your new maximum." },
      { id: "f9_thoracic",     icon: "STRETCH", label: "Thoracic Extension Deep", sets: "Foam roller 5 min -- move slowly through every segment. Arms overhead on each spot.", why: "Fully open t-spine = fully vertical handstand line." },
    ],
    xpBonus: 185,
  },

  10: {
    goal: "MLDC into slow au into handstand -- complete the full chain from the kick",
    block: "Sprint 1 - Month 3",
    theme: "Full Chain -- MLDC Into Handstand",
    focus: "All three phases connect this week. MLDC, hand plant, lean into hands, slow hip lift, arc up, pause 2 seconds at top, slow descent. Do it from both sides. Slow. 3-5 good reps.",
    strength: [
      { id: "s10_chain_str",   icon: "PUSH", label: "Chain Strength Circuit x 5 rounds", sets: "Single-leg RDL 5 each + pike push-up 8 + hollow hold 20s + L-sit 10s + pull-up max. Rest 2 min.", why: "Hits every component: MLDC strength (RDL) + handstand press (pike) + core (hollow + L-sit) + girdle (pull-up)." },
      { id: "s10_wall_fatigue",icon: "PULL", label: "Wall Handstand into Shoulder Taps x 4 sets", sets: "Hold wall bananeira 20s, 5 shoulder taps each side, hold 10s more.", why: "Handstand endurance under shoulder fatigue. The chain puts the handstand at end of MLDC -- shoulder is already working." },
    ],
    conditioning: [
      { id: "c10_full_chain",  icon: "FLOW", label: "MLDC into Au into Handstand Full Chain x 5 rounds", sets: "3 full chain reps each side. Slow. Pause 2 sec at handstand top. 3 min rest between rounds.", why: "The complete drill. This is the Sprint 1 skill goal made into training volume." },
      { id: "c10_flow_test",   icon: "FIRE", label: "5-Min Flow with MLDC to Au Attempts", sets: "5-min continuous flow. Include at least 3 MLDC to au attempts. Log which ones hit the handstand.", why: "The chain must work inside moving context, not just as an isolated drill." },
    ],
    flexibility: [
      { id: "f10_full_mob",    icon: "STRETCH", label: "Full Chain Mobility Reset", sets: "Hamstring 3 min + hip flexor 2 min each + wrist circuit 4 min + shoulder overhead 3 min.", why: "Every joint in the chain gets opened after the hardest training week." },
    ],
    xpBonus: 195,
  },

  11: {
    goal: "MLDC into au into handstand from both sides -- 5-second hold, any entry",
    block: "Sprint 1 - Month 3",
    theme: "Consolidation -- Full Chain Both Sides + Hold Extension",
    focus: "Increase the hold to 5 seconds. Practice from both your strong and weak MLDC side. The weak side will be harder -- that is exactly what must be trained. The chain must not be one-sided.",
    strength: [
      { id: "s11_weak_side",   icon: "LEG", label: "Weak-Side MLDC Floor Plant x 5x8", sets: "8 reps on weaker side only. Hands reach floor every rep. Hold 2 seconds.", why: "The weak-side au chain always falls behind. Dedicated volume prevents a permanent one-sided game." },
      { id: "s11_5sec_wall",   icon: "INVERT", label: "5-Sec Wall Bananeira x 6 attempts", sets: "Hold for exactly 5 counted seconds -- full stillness. Rest 3 min between. Log how many of 6 you hold clean.", why: "5-second wall hold = 5-second au top pause." },
      { id: "s11_pike_max",    icon: "PUSH", label: "Pike Push-Ups Max Set",    sets: "1 max set -- log number. Compare to Week 2. Aim for 20+ at this point.", why: "Shoulder press progression check at Week 11. Should show meaningful growth from wrist/shoulder armor phase." },
    ],
    conditioning: [
      { id: "c11_both_sides",  icon: "FLOW", label: "Both-Side Chain Drill x 6 rounds", sets: "3 full chain reps strong side + 3 weak side per round. 5-sec top hold target. 3 min rest.", why: "6 rounds of bilateral chain training. By Week 12 boss, both sides must work." },
    ],
    flexibility: [
      { id: "f11_hamstring_max",icon: "STRETCH", label: "Hamstring Maximum Test", sets: "Standing fold -- log vs. Week 1 and Week 3. PNF 5 rounds. Push to new maximum.", why: "Week 11 is the last flexibility push before boss week." },
      { id: "f11_shoulder_inv",icon: "STRETCH", label: "Inversion Shoulder Stretch", sets: "In wall bananeira -- let shoulder stretch passively 2 min. Switch. Then full overhead circuit 4 min.", why: "Shoulder stretch tested under inversion load -- the closest stretch to the actual handstand position." },
    ],
    xpBonus: 210,
  },

  12: {
    goal: "Boss week -- MLDC into slow au into handstand hold, both sides, clean",
    block: "Sprint 1 - Month 3 - BOSS WEEK",
    theme: "Sprint 1 Boss -- The Full Chain Tested",
    focus: "This is not a training session. This is a proof of 12 weeks. The test: MLDC from both sides, slow au, pause 3 seconds at handstand, slow exit. Log your best attempt each side. Compare every number to Week 1.",
    strength: [
      { id: "s12_max_pushup",  icon: "PUSH", label: "Max Push-Up Test x 3 sets", sets: "Max reps each. 3 min rest. Compare to Week 1 baseline.", why: "12-week shoulder pressing delta. This measures the armor foundation of the entire program." },
      { id: "s12_wall_hold",   icon: "INVERT", label: "Max Wall Bananeira Hold x 3 attempts", sets: "Record each hold. Compare to Week 4. Target: 30+ seconds.", why: "30-second wall hold was the Phase 1 target. If you are here, the handstand pause in the au is sustainable." },
      { id: "s12_max_hang",    icon: "PULL", label: "Dead Hang x 3 max sets",   sets: "Max time each. Compare to Week 1.", why: "Shoulder girdle endurance delta. Shows what 12 weeks of au and bananeira drilling built." },
    ],
    conditioning: [
      { id: "c12_boss_chain",  icon: "FLOW", label: "Boss Test: MLDC into Au into Handstand -- Both Sides", sets: "3 attempts each side. Best attempt logged. Video if possible. Judge: does top hold 3 sec? Is arc slow?", why: "This is the Sprint 1 boss. The movement you trained for 12 weeks. Do it clean." },
      { id: "c12_flow_round",  icon: "FIRE", label: "10-Min Flow Round With Chains", sets: "Full game simulation -- include MLDC to au chains throughout. Log how many successful chain transitions occur.", why: "The chain must exist inside real flow, not just as a drill. This is the true test of integration." },
    ],
    flexibility: [
      { id: "f12_full_assess", icon: "STRETCH", label: "Full 12-Week Flexibility Assessment", sets: "Hamstring + hip rotation + wrist extension + shoulder flexion. Log ranges vs. Week 1.", why: "The flexibility delta shows what daily work opened over 12 weeks." },
    ],
    xpBonus: 250,
  },

'''

with open('src/data/bonusQuests.js', 'r', encoding='utf-8') as f:
    content = f.read()

START = 'const WEEKLY_BONUS = {'
SPRINT2 = '  // ── SPRINT 2:'

start_idx = content.find(START)
end_idx = content.find(SPRINT2)

if start_idx == -1 or end_idx == -1:
    print('MARKERS NOT FOUND')
    print('start:', start_idx, 'end:', end_idx)
    sys.exit(1)

new_content = NEW_SPRINT1 + content[end_idx:]
with open('src/data/bonusQuests.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('SUCCESS. Written', len(new_content), 'chars')
