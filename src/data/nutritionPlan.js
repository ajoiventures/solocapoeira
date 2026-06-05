// Nutrition Plan — Shadow Hunter Protocol
// Science basis: 3 sources integrated
//
// ─ Benardot, "Advanced Sports Nutrition" (2nd ed):
//     Within-day energy balance is the #1 determinant of body composition
//     Athletes who deviate most from steady blood sugar have HIGHEST body fat
//     Post-exercise glycogen window: eat carbs immediately, glycogen synthetase peaks when stores depleted
//     Protein: 1.2–1.7 g/kg for athletes. Protein beyond this is burned as fuel or stored as fat
//     6 small meals > 3 large: sustained blood sugar = more muscle, less fat, better performance
//     Omega-3s: anti-inflammatory, reduce DOMS, improve oxygen delivery (reduce RBC "stickiness")
//
// ─ Rawson & Volpe, "Nutrition for Elite Athletes":
//     Whey protein: fast-absorbing, highest leucine content → maximal MPS post-workout
//     Casein protein: slow-release, 40g before sleep → 22% higher overnight MPS
//     Creatine monohydrate: strongest evidence base for strength + power
//     Carbs: 6–12 g/kg/day for power athletes; glycogen depleted 20–40% per resistance session
//     Caffeine: 3–6 mg/kg, 1h before training → strength + endurance benefit
//
// ─ Muth, "Sports Nutrition for Health Professionals":
//     Iron absorption: heme (meat) 10–35% bioavailable vs nonheme (beans) 2–10% — pair with vitamin C
//     B vitamins: cofactors in every energy-producing reaction — deficiency limits power output
//     Antioxidants (C, E, selenium): neutralize exercise-induced reactive oxygen species
//     MPS window: 24–48h post training — protein intake at any point in this window builds muscle
//     Power athletes need 6–12 g/kg carbs + 1.4–1.7 g/kg protein per day
//
// User profile: 220 lbs (100 kg) | Budget athlete | No gym | KB + vest + bodyweight
// Current grocery: eggs (9/day), beans, potatoes, chicken, milk, cottage cheese, oats, veggies, bread, meatballs

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — CALORIE & MACRO TARGETS
// ══════════════════════════════════════════════════════════════════════════════

export const CALORIE_TARGETS = {
  bodyWeightLbs: 220,
  bodyWeightKg: 100,
  notes: "Estimated TDEE via Mifflin-St Jeor × activity factor. Training days need more carbs and total calories.",

  trainingDay: {
    totalKcal: 3100,
    protein_g: 160,    // 1.6 g/kg — Benardot's athlete range; eggs+chicken+cottage cheese easily hits this
    carbs_g: 390,      // ~5 g/kg — moderate-high; potatoes, oats, bread carry this
    fat_g: 80,         // ~0.8 g/kg — eggs provide ~45g; keep fat moderate, not low
    proteinPct: 21,
    carbsPct: 50,
    fatPct: 23,
    note: "High carb on training days. Glycogen is fuel — don't restrict potatoes/oats/bread when you train.",
  },
  restDay: {
    totalKcal: 2500,
    protein_g: 160,    // Protein stays constant — muscle synthesis runs 24-48h after training
    carbs_g: 270,      // Drop carbs on rest; fat slightly up
    fat_g: 90,
    proteinPct: 26,
    carbsPct: 43,
    fatPct: 31,
    note: "Lower carbs on rest days — body doesn't need glycogen for movement. Keep protein identical.",
  },
  currentDietAssessment: {
    estimatedProtein_g: "~160–185g (9 eggs=57g + beans~30g + chicken~45g + milk~16g + cottage cheese~25g)",
    estimatedCalories: "~2400–2800 estimated. Likely under-fueling on hard training days.",
    strengths: [
      "Egg-heavy diet is a science win — eggs score highest on PDCAAS (protein quality), contain B12, vitamin D, choline, selenium",
      "Cottage cheese = casein protein. Eating it at night = textbook slow-release overnight recovery (Rawson & Volpe)",
      "Beans + potatoes = complex carbs + fiber + nonheme iron + B vitamins — excellent base",
      "Oats = beta-glucan fiber + complex carbs + soluble fiber = optimal pre-training energy",
      "The baked egg cup formula is nearly ideal: protein + fat + complex carb + veggies in one meal",
    ],
    gaps: [
      "Omega-3 (no fish, no flaxseed) — anti-inflammatory gap affects DOMS and recovery speed",
      "Iron absorption is low from beans alone (2–10% nonheme) — not pairing with vitamin C",
      "Vitamin D: eggs provide some, but insufficient for a training athlete in winter — sun exposure or supplement",
      "Meal frequency: 2–3 meals is below the 4–6 recommended for within-day energy balance (Benardot)",
      "Carb timing: are potatoes eaten before/after training? If not, glycogen window is missed",
      "Total calories may be too low on hard training days — underfueling = muscle loss, not fat loss",
    ],
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — THE 6 PILLARS
// ══════════════════════════════════════════════════════════════════════════════

export const NUTRITION_PILLARS = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_1",
    number: 1,
    name: "Energy Timing",
    subtitle: "Never Let the Tank Empty",
    icon: "⚡",
    color: "#10b981",
    sourceBook: "Benardot — Advanced Sports Nutrition Ch6",
    oneLiner: "When you eat matters as much as what you eat. Crash blood sugar = lose muscle, gain fat.",

    principle: "Within-day energy balance is the single most powerful nutritional lever for body composition. Athletes who deviate most from steady blood sugar — whether through under-eating or over-eating — have the highest body fat levels, regardless of total daily calories. Your body does not work in 24-hour units. It makes micro-adjustments every hour.",

    rules: [
      "Eat within 30 minutes of waking — liver glycogen is depleted overnight. Skipping breakfast means training with borrowed fuel.",
      "Never go more than 4 hours without eating. 9 eggs + 2-3 meals = 3–4 eating events. Add 1 snack to make it 4–5.",
      "Eat your biggest carb meal BEFORE training, not after dinner. Energy goes to muscle when muscle needs it.",
      "Eat something — even small — immediately after training (within 30 min). Glycogen synthetase is at peak; this window closes.",
      "If you're eating dinner as your biggest carb meal: flip it. Potatoes and oats belong near training, not at 8pm.",
    ],

    yourDietApplication: "Your baked egg cup meals are good — but if all 3 meals are evenly spread without anchoring one to pre-training and one to post-training, you're leaving adaptation on the table. Add a small oat meal pre-training and eat potatoes in the meal immediately after training.",

    mealFramework: {
      meal1_preworkout: "Oats (1 cup dry) + 1 egg + banana if budget allows. 45–60 min before training.",
      meal2_postworkout: "2–3 baked egg cups + potatoes (1 medium) + veggies. Within 30 min of finishing.",
      meal3_midday: "Beans (1 cup) + 2 eggs + veggies. Steady blood sugar between sessions.",
      meal4_evening: "Chicken (6oz) + veggies + small potato. Protein + moderate carb to fuel overnight.",
      snack_beforebed: "Cottage cheese (1 cup). This is your overnight muscle builder — casein protein feeds MPS for 7+ hours while you sleep.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_2",
    number: 2,
    name: "Protein Architecture",
    subtitle: "Fast + Slow, Every Day",
    icon: "🥚",
    color: "#3b82f6",
    sourceBook: "Rawson & Volpe Ch5 + Benardot Ch1 + Muth Ch2",
    oneLiner: "Hit 160g/day across 4+ meals. Fast protein post-workout. Casein before sleep.",

    principle: "Protein quality, distribution, and timing all matter. A single protein metric (g/day) is insufficient. The leucine content of each meal triggers muscle protein synthesis — and each trigger fades in 2–3 hours regardless of how much protein you ate. 4 separate protein meals beats 1–2 large ones even if total grams are the same. Additionally: fast protein (eggs, milk) spikes MPS immediately post-workout; slow protein (cottage cheese, beans) sustains synthesis overnight.",

    targets: {
      minimumPerDay_g: 140,
      optimalPerDay_g: 160,
      perKg: "1.6 g/kg (100 kg × 1.6 = 160g)",
      perMeal_minimum: "30–40g per meal to reliably trigger MPS — leucine threshold (Rawson & Volpe)",
      fastProtein_timing: "Within 30 min post-workout: 2–3 eggs + 1 cup milk = ~30g fast protein",
      slowProtein_timing: "Before sleep: 1 cup cottage cheese = ~25g casein → 22% higher overnight MPS",
    },

    yourFoodsRanked: [
      { food: "Eggs (whole)", perUnit: "6.3g per egg | PDCAAS 1.0 (highest quality)", notes: "Your best protein source. 9 eggs = 57g. Keep this habit." },
      { food: "Cottage cheese", perServing: "25g per cup | casein = slow-release", notes: "Eat this before bed every night. Science-backed." },
      { food: "Chicken breast", perServing: "31g per 4oz | fast protein", notes: "Post-workout or midday. Cheap per gram of protein." },
      { food: "Milk", perServing: "8g per cup | whey + casein blend", notes: "Drink post-workout or with eggs. B12 + calcium bonus." },
      { food: "Beans (black/kidney)", perServing: "15g per cup cooked | slow, plant-based", notes: "Incomplete protein — combine with eggs or milk in same meal." },
      { food: "Oats", perServing: "5g per cup dry | not a protein source", notes: "Carb source. Don't count toward protein target." },
      { food: "Meatballs", perServing: "~14g per 4 balls | varies", notes: "Good protein + iron (heme). Use when available — prioritize iron from meat when possible." },
    ],

    proteinGapFix: "Your ~160–185g estimate is actually adequate. The fix is distribution — spread it over 4 meals with cottage cheese at night, not 2–3 larger egg cup meals.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_3",
    number: 3,
    name: "Carb Periodization",
    subtitle: "Fuel the Work. Earn the Carbs.",
    icon: "🥔",
    color: "#f59e0b",
    sourceBook: "Rawson & Volpe Ch1 + Benardot Ch6 + Muth Ch9",
    oneLiner: "Eat more carbs on hard training days. Less on rest days. Potatoes and oats are your weapons.",

    principle: "Glycogen is the primary fuel for KB swings, plyometrics, HIIT, and capoeira movement. Resistance training depletes glycogen 20–40% per session. If glycogen isn't replaced, the next session is run on empty — you go slower, you recruit fewer muscle fibers, and training quality collapses. Power athletes need 6–12 g/kg/day of carbohydrates. At 100 kg, that's 600–1200g — but for someone your size doing 3 sessions/week, 4–5 g/kg (400–500g on training days) is the practical target.",

    carbSources: [
      { food: "Potatoes (boiled/baked)", per100g: "17g carbs | low GI if eaten with protein + fat", timing: "Best POST-workout — pairs with eggs perfectly in your baked cup formula", cost: "Cheapest carb per calorie" },
      { food: "Oats (rolled)", per100g: "68g carbs dry | beta-glucan fiber, slow release", timing: "Best PRE-workout — sustained energy, no insulin spike", cost: "Extremely cheap" },
      { food: "Bread (whole grain)", per100g: "45g carbs | B vitamins if enriched", timing: "Flexible — good with eggs any meal", cost: "Cheap" },
      { food: "Beans (black/kidney/pinto)", per100g: "20g carbs + 8g protein + fiber", timing: "Midday or evening — slow carb + protein combo", cost: "Cheapest protein + carb combination in existence" },
      { food: "Milk", per100ml: "5g carbs (lactose) + protein", timing: "Post-workout or before bed with cottage cheese", cost: "Budget staple" },
    ],

    trainingDayVsRest: {
      trainingDay: "~390g carbs. Oats pre-training + potatoes post-training + beans midday + bread with meals.",
      restDay: "~270g carbs. Same foods, smaller portions. Cut potato serving in half. No pre-workout oat meal needed.",
      hardDay: "Before a long session or boss test week: eat even more carbs the day before (glycogen loading principle — Benardot). Add extra bread and oats the evening before.",
    },

    sprintPhases: {
      sprint1: "Establish carb base. Eat potatoes and oats consistently. Don't count yet — just eat them every day.",
      sprint2: "Time carbs to training. Oats before, potatoes after. Earn the carb with the session.",
      sprint3: "Increase carbs on power days (heavy KB, plyometrics). These sessions drain glycogen fastest.",
      sprint4: "Pre-competition loading. 2 days before boss test: add extra oats and potatoes. Sleep full.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_4",
    number: 4,
    name: "Micronutrient Armor",
    subtitle: "The Invisible Infrastructure",
    icon: "🛡️",
    color: "#8b5cf6",
    sourceBook: "Benardot Ch2 + Muth Ch4 + Muth Ch9",
    oneLiner: "B vitamins run the engine. Iron carries oxygen. Vitamin C unlocks iron. Your food already has most of this — just pair it right.",

    principle: "Every ATP-generating reaction in your body requires B vitamins as cofactors. Iron carries oxygen to working muscle. Vitamin D controls testosterone and bone density. Antioxidants (C, E, selenium) neutralize the cellular damage created by intense training. Athletes have higher requirements for all of these than sedentary people. The good news: your current diet is micronutrient-rich in ways most athletes' diets aren't.",

    micronutrients: [
      {
        nutrient: "Iron",
        whyItMatters: "Hemoglobin formation. Iron deficiency = reduced oxygen delivery = reduced power output. Training also causes foot-strike hemolysis (RBCs crushed with impact — same mechanism applies to explosive floor work). (Benardot Ch7)",
        yourSources: "Eggs (1mg/egg), beans (nonheme, low absorption), meatballs when eaten",
        gap: "Nonheme iron from beans has only 2–10% bioavailability. You need vitamin C to triple absorption.",
        fix: "ALWAYS eat something vitamin C-rich with beans. Bell pepper, tomato, broccoli, or any green veggie. Add lemon juice to beans. This doubles or triples iron absorption for free.",
        targetPerDay: "Men: 8–11 mg/day. Athletes may need up to 17.5 mg.",
      },
      {
        nutrient: "Vitamin D",
        whyItMatters: "Bone density, testosterone production, immune function, muscle function. Deficiency is epidemic in athletes training indoors. (Muth Ch4)",
        yourSources: "Egg yolks (~44 IU each × 9 = 396 IU). RDA is 600 IU, athletes may need 1500–2000 IU.",
        gap: "9 eggs provides 66% of the minimum — not enough if you're indoors.",
        fix: "15–20 minutes of direct midday sun on skin daily. Or a cheap vitamin D3 supplement if winter. No food fix exists — sun is the primary source.",
        targetPerDay: "600–2000 IU",
      },
      {
        nutrient: "B Vitamins (B6, B12, Folate, Thiamin)",
        whyItMatters: "Every single ATP-generating reaction requires these as cofactors. B12 deficiency → anemia. B6 requirement scales with protein intake. (Muth Ch4 + Benardot Ch2)",
        yourSources: "EXCELLENT: Eggs (B12, B2, B6), chicken (B6, niacin), beans (folate, B1), oats (B1, B5), milk (B12, B2). Your diet is B-vitamin rich.",
        gap: "None significant — your diet naturally covers B vitamins well.",
        fix: "No change needed. Continue eating eggs + beans + chicken + oats and B vitamins are covered.",
        targetPerDay: "B12: 2.4 mcg | B6: 1.3–2.0 mg for athletes | Folate: 400 mcg",
      },
      {
        nutrient: "Antioxidants (Vitamin C + Selenium)",
        whyItMatters: "Exercise creates reactive oxygen species (free radicals) that damage cells. Vitamin C and selenium neutralize these. Adequate antioxidants = faster recovery and less chronic inflammation. (Benardot Ch8)",
        yourSources: "Eggs (selenium — one of the richest sources in food). Veggies (vitamin C — depends on which ones).",
        gap: "Vitamin C depends entirely on veggie choices. Broccoli, peppers, tomatoes = high C. Iceberg lettuce = almost none.",
        fix: "Include at least one high-C veggie per meal: broccoli, bell pepper, tomato, cabbage, or potato skin. These are cheap.",
        targetPerDay: "Vitamin C: 200–1000 mg for athletes | Selenium: 55–200 mcg",
      },
      {
        nutrient: "Omega-3 Fatty Acids",
        whyItMatters: "Anti-inflammatory. Reduce DOMS by 24–48h. Improve RBC oxygen delivery. Compete with arachidonic acid to reduce chronic inflammation from training. Your BIGGEST nutritional gap. (Benardot Ch4 + Ch8)",
        yourSources: "NONE currently visible in your diet. Eggs have minimal omega-3 unless specifically fortified.",
        gap: "The absence of fatty fish or omega-3 sources is your largest recovery gap. No other single addition would help more.",
        fix: "Sardines in a can: cheapest omega-3 source per dollar. 2-3 cans/week = significant anti-inflammatory effect. Costs less than $2/week. Alternatively: ground flaxseed (cheap) mixed into oats.",
        targetPerWeek: "2–3 servings of fatty fish OR 1–2 tbsp ground flaxseed/day",
      },
      {
        nutrient: "Calcium + Magnesium",
        whyItMatters: "Calcium for bone + muscle contraction. Magnesium for 300+ enzyme reactions including ATP production. High protein intake increases magnesium requirements. (Muth Ch4)",
        yourSources: "Milk (300mg Ca/cup), cottage cheese (125mg Ca/cup), beans (magnesium), oats (magnesium). Good baseline coverage.",
        gap: "Minor. Ensure 2+ cups of milk or cottage cheese daily for calcium.",
        fix: "No change — your dairy habit covers this well.",
        targetPerDay: "Calcium: 1000 mg | Magnesium: 400–500 mg for athletes",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_5",
    number: 5,
    name: "Recovery Stack",
    subtitle: "The Session Ends. The Adaptation Begins.",
    icon: "🔄",
    color: "#ef4444",
    sourceBook: "Benardot Ch8 + Rawson & Volpe Ch5 + Muth Ch9",
    oneLiner: "Post-workout window + pre-sleep casein + omega-3 anti-inflammation. Hit all three.",

    principle: "Training is the stimulus. Recovery is the adaptation. The 30 minutes after training and the 7 hours of sleep that follow are when your body builds the strength, flexibility, and power you worked for. Miss the recovery nutrition window repeatedly and you're training in circles. Muscle protein synthesis runs for 24–48 hours after a session — protein and carbs consumed in this window contribute to that rebuild.",

    postWorkoutProtocol: {
      window: "Within 30 minutes of finishing training",
      target: "20–40g protein + 50–80g carbs",
      yourMeal: "2–3 baked egg cups (regular formula) + 1 medium potato. This is ideal — keep doing it.",
      why: "Glycogen synthetase (enzyme that converts glucose to glycogen) is most active when glycogen is most depleted — immediately post-exercise. Waiting 2+ hours to eat halves this replenishment rate. (Benardot Ch6)",
      fallback: "1 cup milk + banana if no time to cook. Quick, cheap, effective.",
    },

    preSleepProtocol: {
      window: "30–60 minutes before bed",
      target: "25–40g slow-release protein (casein)",
      yourMeal: "1 cup full-fat cottage cheese. Exact right food. Already in your diet.",
      why: "A Maastricht University study showed 40g casein before sleep produced 22% higher muscle protein synthesis overnight vs no intake. You sleep 7–8h — that's 7–8 hours of recovery either happening or not happening based on whether you ate cottage cheese. (Rawson & Volpe Ch5)",
      addOn: "Add a small amount of carbs if training was very hard — 2 tbsp of oats stirred into cottage cheese.",
    },

    antiInflammationProtocol: {
      window: "Ongoing — not tied to a single meal",
      target: "Omega-3 2–3x/week. Vitamin C every day.",
      yourGap: "You currently have no omega-3 source. This is the most impactful single addition.",
      cheapFix: [
        "Canned sardines in water: 2 cans/week. Eat them with eggs, on bread, or mixed into beans. ~$1.50/week.",
        "Ground flaxseed: 2 tbsp/day stirred into oats. Cheapest option. ~$0.20/day.",
        "Either option reduces DOMS by 24–48h and improves cardiovascular oxygen delivery over 4–8 weeks. (Benardot Ch8)",
      ],
      highVitaminCVeggies: "Broccoli, bell pepper, tomato, cabbage — include at least one per meal for antioxidant + iron absorption benefit.",
    },

    domsPrevention: "DOMS (delayed onset muscle soreness) peaks 24–48h after unfamiliar or eccentric-heavy training. Benardot's evidence: omega-3s are the most consistently supported dietary intervention. Adequate protein and carbs post-workout prevent the severity. Cold water during hot sessions. Sleep.",

    sleepAsNutrition: "Sleep is not separate from nutrition — it's where growth hormone peaks, testosterone restores, and IGF-1 drives muscle protein synthesis. Benardot: athletes who are chronically under-recovered show hormonal profiles similar to undereating even at normal calorie intake. 7–9 hours is a training variable.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "pillar_6",
    number: 6,
    name: "Budget Optimization",
    subtitle: "Maximum Performance Per Dollar",
    icon: "💰",
    color: "#06b6d4",
    sourceBook: "Benardot Ch1 + all 3 books: food quality analysis",
    oneLiner: "You're already buying some of the best sports foods on earth. A few cheap additions complete the system.",

    budgetPrinciple: "Benardot notes: 'Eggs cost approximately 13 cents per 8g of protein, while protein supplements cost $1.20 per 8g.' You have already figured this out. Your egg-heavy, bean-heavy, potato-heavy diet is nutritionally sophisticated, not nutritionally limited. The gaps are small and cheap to fill.",

    currentGroceryScore: {
      eggs: { score: "S", notes: "PDCAAS 1.0, highest quality protein, B12, selenium, vitamin D, choline. 9/day is excellent." },
      beans: { score: "A", notes: "Complex carbs + plant protein + fiber + folate + iron (nonheme). Pair with vitamin C." },
      potatoes: { score: "A", notes: "Excellent training carb. Potassium + vitamin C + fiber. Cheap per calorie." },
      chicken: { score: "A", notes: "Lean complete protein. B6, niacin. High protein per dollar on thighs/drumsticks." },
      milk: { score: "A", notes: "Whey + casein blend. Calcium, B12, B2. Cheap protein + carb combination." },
      cottage_cheese: { score: "S", notes: "Casein protein. The single best pre-sleep food for an athlete. Keep this." },
      oats: { score: "A", notes: "Slow complex carb. Beta-glucan. Cheap. Best pre-training carb source you have." },
      veggies: { score: "B+", notes: "Score depends on which ones. Broccoli/peppers/tomatoes = A. Iceberg lettuce = C." },
      bread: { score: "B", notes: "Useful carb filler. Choose whole grain for B vitamins. Not essential with oats + potatoes." },
      meatballs: { score: "B+", notes: "Heme iron (high bioavailability), complete protein. Include whenever possible for iron." },
    },

    cheapAdditions: [
      {
        item: "Canned sardines or mackerel",
        cost: "~$1–2/can",
        frequency: "2–3 cans/week",
        benefit: "Omega-3 (EPA+DHA). Single biggest missing piece in your diet. Anti-inflammatory. Reduces DOMS.",
        howToEat: "Mix into eggs when baking cups. Eat on bread. Mash with beans.",
      },
      {
        item: "Ground flaxseed",
        cost: "~$0.20/day",
        frequency: "2 tbsp/day",
        benefit: "Plant omega-3 (ALA). Cheaper than sardines. Stir into oats. Doesn't taste like anything.",
        howToEat: "Add to oat meal pre-workout. Invisible in baked egg cups.",
      },
      {
        item: "Frozen broccoli or mixed greens",
        cost: "~$1.50/bag",
        frequency: "Every day",
        benefit: "Vitamin C (iron absorption) + antioxidants + folate. Frozen is identical nutrition to fresh.",
        howToEat: "Already cooking veggies — just make sure high-C types are included.",
      },
      {
        item: "Vitamin D3 supplement (winter only)",
        cost: "~$5 for 3 months",
        frequency: "1000–2000 IU/day Oct–Mar",
        benefit: "Replaces sun exposure when unavailable. Testosterone + bone health + immune function.",
        howToEat: "One pill/day. Cheapest supplement per health impact that exists.",
      },
    ],

    eggCupOptimization: {
      formula: "4 eggs + filling + veggies + potatoes, baked in a 4×2 cup, 2–3x/day",
      scienceNotes: [
        "This is already an elite athlete meal structure. Don't change the formula — optimize the timing.",
        "Add omega-3 source to filling (flaxseed, sardine) — invisible in flavor, massive in recovery impact.",
        "Include a high-C veggie in every cup (broccoli, bell pepper, tomato) — doubles iron absorption from eggs.",
        "Pair with potatoes post-workout, oats pre-workout — same food, better timing.",
        "Add cottage cheese as a 4th 'meal' before sleep — costs you 5 minutes and a bowl.",
      ],
      weeklyVaritation: "The different-every-day approach is excellent — dietary variety ensures broad micronutrient coverage. Keep rotating fillings.",
    },

    weeklyGroceryMinimums: {
      eggs: "3 dozen (36 eggs) — your foundation",
      beans: "2 cans or 2 lbs dry",
      potatoes: "5 lbs",
      oats: "1 lb rolled oats",
      chicken: "2–3 lbs (thighs/legs are cheaper and more nutritious than breast)",
      milk: "1 gallon",
      cottageCheese: "32 oz (large container)",
      frozenVeggies: "1–2 bags (broccoli or mixed)",
      bread: "1 loaf whole grain",
      sardines: "2–3 cans (add this — it's the gap)",
      flaxseed: "Optional if no sardines",
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ANNUAL NUTRITION PLAN (tied to 4 training sprints)
// ══════════════════════════════════════════════════════════════════════════════

export const ANNUAL_NUTRITION_PLAN = {
  title: "Nutrition Periodization — Year 1",
  subtitle: "Nutrition phases match training phases. Food choices don't change — amounts and timing do.",
  overarchingPrinciple: "Benardot: 'There is no way to properly prepare for a competition by eating some pancakes several hours before the feet are placed in the starting blocks. It takes a consistent and long-term effort in conditioning and good nutrition.' Build the habit first. Optimize the timing second. Fine-tune the amounts third.",

  sprints: [

    // ── SPRINT 1: FOUNDATION ─────────────────────────────────────────────────
    {
      sprintId: "sprint_1",
      weeks: "1–12",
      phase: "GPP — General Preparation",
      nutritionPhase: "Build the Habit",
      color: "#10b981",

      primaryGoal: "Establish the 5-meal framework and fix the 3 biggest gaps: omega-3, iron pairing, and carb timing. Don't count calories yet — just build consistent patterns.",

      calorieTarget: "~2800–3000 kcal/day. Don't restrict. Foot rehab and initial training requires steady energy supply. Underfueling in this phase = injury risk and slow tissue remodeling.",

      proteinTarget: "1.4–1.6 g/kg = 140–160g/day. Your current diet likely hits this — confirm by roughly estimating 2 egg cups + chicken + beans + cottage cheese.",

      carbTarget: "~4 g/kg = 400g/day. Oats + potatoes + beans + bread cover this without counting.",

      keyFocuses: [
        "HABIT 1: Cottage cheese before bed — every single night from Week 1. Non-negotiable.",
        "HABIT 2: Oats or bread before training (even 30 min before). Don't train on empty.",
        "HABIT 3: Potatoes in the post-workout meal. Move them from dinner to immediately after training.",
        "FIX 1: Add sardines or flaxseed for omega-3 from Day 1. Plantar fasciitis = inflammatory condition. Omega-3 reduces inflammation systemically.",
        "FIX 2: Add broccoli or bell pepper to every meal for vitamin C + iron absorption.",
        "MONITOR: Track foot pain score (already in app). Nutrition compliance directly affects inflammation and healing speed.",
      ],

      weeklyCheckIn: "Every week 4 (deload week): assess how consistently you hit the 5 habits above. No need to log every meal — just a yes/no on each habit for the week.",

      specialConsiderations: "Sprint 1 is foot rehab. Inflammation management is nutrition priority #1. Omega-3 + antioxidants + sufficient calories all reduce chronic inflammation. A calorie deficit while healing injured tissue is contraindicated — eat enough.",

      sampleDayTrainingDay: [
        "7am: 1 cup oats + 1 egg + milk (pre-training fuel)",
        "8–9am: Training session",
        "9:30am: 2–3 baked egg cups + 1 medium potato + broccoli (post-workout meal)",
        "1pm: 1 cup beans + 2 eggs + tomato/peppers (midday protein + iron + C)",
        "6pm: 4–6oz chicken + large veggie portion + small potato (evening maintenance)",
        "9:30pm: 1 cup cottage cheese (pre-sleep casein — overnight MPS)",
      ],

      sampleDayRestDay: [
        "8am: 2–3 baked egg cups + small potato + veggies",
        "1pm: 1 cup beans + 2 eggs + veggies",
        "6pm: Chicken + large veggie portion",
        "9pm: 1 cup cottage cheese",
        "Note: Skip pre-training oats. Smaller carb portions overall.",
      ],

      nutritionBossTests: [
        { week: 4, test: "Consistency check — did you eat cottage cheese before bed 5+ nights this week?", pass: "Yes consistently" },
        { week: 8, test: "Post-workout meal timing — is the potato/carb meal happening within 30 min of finishing training?", pass: "Yes, 4+ of 5 sessions" },
        { week: 12, test: "Omega-3 source — are sardines or flaxseed in the weekly routine?", pass: "2+ times per week" },
      ],
    },

    // ── SPRINT 2: BUILDING ────────────────────────────────────────────────────
    {
      sprintId: "sprint_2",
      weeks: "13–24",
      phase: "SPP — Sport-Specific Preparation",
      nutritionPhase: "Tighten the Timing",
      color: "#3b82f6",

      primaryGoal: "Now that habits are built, tighten carb periodization: more carbs on training days, fewer on rest days. Introduce pre-session carb loading on hard HIIT days.",

      calorieTarget: "~3000–3200 on training days | ~2500 on rest days. Training intensity increases, calorie needs rise with it.",

      proteinTarget: "1.6 g/kg = 160g/day. Consistent. Distribution: 4 meals × 40g each.",

      carbTarget: "Training days: ~5 g/kg = 500g | Rest days: ~3 g/kg = 300g. The difference is 200g — one cup oats + one medium potato is that gap.",

      keyFocuses: [
        "CARB PERIODIZATION: Hard training day (KB + HIIT) = extra oats pre-session + extra potato post-session. Rest day = skip extra carb servings.",
        "HIIT days specifically: eat something high-carb within 60 min before HIIT. Low blood sugar + HIIT = cortisol spike = muscle breakdown (Benardot Ch6).",
        "If foot pain rises after introducing HIIT: immediately check omega-3 intake. Inflammation is nutrition-responsive.",
        "IRON MONITORING: Week 16–20, notice if you feel unusual fatigue or breathlessness at lower intensities. This is the first warning sign of sports anemia (blood volume expansion without matching RBC increase). Add more meatballs and lean red meat if available.",
        "SLEEP: Training intensity increase in Sprint 2 raises the importance of sleep. MPS is 60% lower in sleep-deprived athletes. This is a nutrition variable.",
      ],

      hiitNutritionProtocol: "Short-short HIIT (10s/10s × 20) heavily taxes anaerobic glycolysis. Glycogen is the fuel. Always eat 45–60 min before HIIT. Post-HIIT: eggs + potato within 30 min. This is non-negotiable as conditioning introduces in W19.",

      weeklyCheckIn: "Week 16 and 20 deload weeks: assess whether carb periodization is implemented. Are you actually eating more carbs on hard days and less on rest days?",

      sampleDayHIITDay: [
        "45min before: 1 cup oats + 1 egg or 1 cup milk",
        "Training: KB strength → Short-short HIIT",
        "Within 30min: 3 baked egg cups + large potato + broccoli",
        "Midday: beans + 2 eggs + peppers",
        "Evening: chicken + veggies + small potato",
        "Night: 1 cup cottage cheese",
      ],

      nutritionBossTests: [
        { week: 16, test: "Carb periodization — training day calories noticeably higher than rest day?", pass: "Yes, ~500–700 kcal difference" },
        { week: 20, test: "HIIT fuel: pre-HIIT carb meal eaten within 60 min before every HIIT session?", pass: "Yes, consistent" },
        { week: 24, test: "Overall: no signs of sports anemia, consistent energy levels, DOMS manageable with omega-3?", pass: "All three" },
      ],
    },

    // ── SPRINT 3: INTERMEDIATE ────────────────────────────────────────────────
    {
      sprintId: "sprint_3",
      weeks: "25–36",
      phase: "Pre-competitive — Power & Integration",
      nutritionPhase: "Performance Nutrition Peak",
      color: "#f59e0b",

      primaryGoal: "This is where the LDTE pays off (Verkhoshansky). Nutrition now supports peak power expression. Calorie increase to match heavier training loads. Power-specific protocol: higher creatine stores, sharper carb timing.",

      calorieTarget: "~3200–3400 on heavy strength days | ~3000 on conditioning days | ~2600 on rest days. Strength emphasis blocks (W25–27, W33–35) are your highest-calorie weeks of the year.",

      proteinTarget: "1.7 g/kg = 170g/day during strength emphasis blocks. Maximal effort + dynamic effort KB work creates significant muscle breakdown — needs above-normal repair protein.",

      carbTarget: "Heavy KB days: ~6 g/kg = 600g. Power output requires full glycogen. Conditioning days: ~5 g/kg = 500g. Rest days: ~3 g/kg = 300g.",

      keyFocuses: [
        "STRENGTH EMPHASIS BLOCKS (W25–27, W33–35): Eat your biggest meal BEFORE training. Heavy KB requires neural output — neural tissue uses glucose. Training with empty glycogen is the most common cause of strength plateaus.",
        "CONDITIONING EMPHASIS BLOCKS (W29–31): Maintain protein, reduce KB caloric demand but increase HIIT carbs. The moderate-moderate intervals (30s/90s) are aerobic-dominant — fat becomes a bigger fuel contributor, but glycogen still matters for the burst phase.",
        "POWER MEALS: Before maximal effort or dynamic effort KB sessions — add extra carbs the evening before. 2 cups of oats the night before a heavy day is classic glycogen pre-loading.",
        "BODY RECOMPOSITION: Sprint 3 is when Verkhoshansky's LDTE manifests as visible strength and power. If body composition is improving (stronger at same or lower weight), nutrition is working. Don't restrict calories in a misguided attempt to lean out — power needs fuel.",
        "DOMS MANAGEMENT: Dynamic effort and plyometrics create significant eccentric damage. Omega-3 intake becomes critical. Week 25+: 3 sardine servings/week minimum.",
      ],

      preBossTestProtocol: "The 2 days before boss test weeks (W36 boss week): increase carbs significantly. Add extra potato, extra oats, extra bread. This is glycogen supercompensation. Boss tests are the competition — prepare like it. (Benardot 7-day taper model)",

      sampleDayHeavyKBDay: [
        "Night before: extra bowl of oats before bed (glycogen pre-load)",
        "Morning: large oat meal + 2 eggs + milk (pre-training fuel)",
        "Training: Dynamic Effort + Maximal Effort KB",
        "Within 30min: 3 baked egg cups + 2 medium potatoes + broccoli",
        "Midday: large beans portion + 2 eggs + peppers + sardine or meatball",
        "Evening: chicken + veggies + potato",
        "Night: 1 cup cottage cheese + 2 tbsp flaxseed",
      ],

      nutritionBossTests: [
        { week: 28, test: "Pre-strength-block loading: are you eating extra carbs the evening before heavy KB days?", pass: "Yes, consistently" },
        { week: 32, test: "DOMS managed: sardines or flaxseed 3+ times/week, and DOMS duration decreasing vs Sprint 2?", pass: "Yes" },
        { week: 36, test: "Boss week prep: ate extra carbs for 2 days before boss test week?", pass: "Yes — felt fueled, not flat" },
      ],
    },

    // ── SPRINT 4: ADVANCED ────────────────────────────────────────────────────
    {
      sprintId: "sprint_4",
      weeks: "37–52",
      phase: "Competition/Integration — Peak & Maintain",
      nutritionPhase: "Peak Performance + Taper",
      color: "#7c3aed",

      primaryGoal: "Maintain peak nutrition while implementing taper protocol for boss test weeks. Volume down, intensity up, quality up, freshness up. The year of nutrition habits now supports your peak roda performance.",

      calorieTarget: "~3000–3200 maintenance. Volume reduction in training means slightly fewer calories needed — but don't drop too fast. Match calorie reduction to volume reduction: if you cut 30% training volume, cut 15% calories (not 30%).",

      proteinTarget: "1.6–1.7 g/kg = 160–170g/day. Maintained through competition phase — muscle is being expressed, not built. Protein supports maintenance and repair.",

      carbTarget: "Match carbs to session intensity. Roda simulation days = 5–6 g/kg = 500–600g. Taper days = 3–4 g/kg = 300–400g. Taper week (W46, W50): normal protein + reduced total carbs, then carb-load the day before boss tests.",

      keyFocuses: [
        "TAPER NUTRITION (W46, W50): Volume cuts 30–50% but carbs stay moderate-high. Don't starve the taper. Common mistake: athletes drop food when they drop training volume and arrive to boss tests depleted. (Benardot taper model)",
        "COMPETITION DAY PROTOCOL: Boss test days — wake up, eat a normal-size oat meal 90–120 min before. Then a small easy-to-digest snack 30–45 min before. No new foods on boss test day. Eat exactly what you trained on.",
        "RODA SIMULATION DAYS: These are your highest-intensity sessions of the year (2×10-min games). Treat them like competition days nutritionally. Carb-load the day before. Post-session: maximum recovery protocol (big egg cup meal, potatoes, sardines).",
        "SLEEP AS PEAK VARIABLE: Benardot: 'Recovery is training.' Sprint 4 is the phase where 8 hours of sleep contributes more to performance than an extra training session. Prioritize sleep over extra work.",
        "S-RANK BOSS PREP: Week 49–51. Three days out: normal eating. Day before: extra carbs (glycogen load). Morning of: oat meal + eggs + milk. You've done this for a year. The nutrition is automatic.",
      ],

      taperNutritionDetail: {
        week_minus3: "Normal eating. Maintain all habits. Last heavy training days.",
        week_minus2: "Reduce training volume 30%. Keep food normal. Don't match food reduction to volume reduction — maintain carbs.",
        dayBefore: "Extra oats + extra potato + extra bread. Glycogen fill. Go to bed well-fed.",
        bossTestDay: "Oats + eggs + milk (90 min before). Small carb snack 30 min before. NOTHING NEW.",
        postBossTest: "Largest meal of the sprint. Celebrate nutritionally. Egg cups + potatoes + sardines + cottage cheese before bed.",
      },

      annualReflection: "You started with a budget diet and 9 eggs/day. By Sprint 4, you understand why 9 eggs is elite-level thinking. You've added sardines, timed potatoes to training, eat cottage cheese before sleep, and pair vitamin C with every bean meal. Your food budget didn't increase significantly. Your performance ceiling did.",

      nutritionBossTests: [
        { week: 39, test: "Taper Week 1: Did you maintain carbs while reducing training volume?", pass: "Yes — didn't starve the taper" },
        { week: 46, test: "Pre-competition protocol established: carb-load day before, oat meal day of?", pass: "Yes — practiced and consistent" },
        { week: 49, test: "Roda Boss simulation day: pre-fueled, post-recovery protocol complete within 30 min?", pass: "Yes" },
        { week: 51, test: "S-Rank Boss: felt fueled for both 10-min rounds, no energy collapse in round 2?", pass: "Energy sustained — this is nutrition at work" },
      ],
    },
  ],
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — QUICK REFERENCE: THE EGG CUP OPTIMIZATION MATRIX
// ══════════════════════════════════════════════════════════════════════════════

export const EGG_CUP_MATRIX = {
  title: "The Baked Egg Cup — Optimized",
  description: "Your formula is already excellent. These upgrades add targeted nutrition without changing what works.",
  baseRecipe: "4 eggs + filling + veggies + potatoes, baked in a 4×2 cup",
  upgradesByPillar: {
    protein: "Add 2–3 tbsp cottage cheese to the egg mix → slower protein release from same meal",
    omega3: "Add 1 can drained sardines to the filling (1–2 times/week) → omega-3, invisible in flavor",
    ironPlusC: "ALWAYS include broccoli, bell pepper, or tomato → doubles iron absorption from eggs + beans",
    vitaminD: "Use whole eggs only — yolk is where vitamin D and choline live",
    carbs: "Potatoes POST-workout, oats PRE-workout. Same foods, better timing = better glycogen management",
    casein: "Side of cottage cheese with the cup = both fast (egg white) and slow (casein) protein in one meal",
  },
  weekdayVariations: [
    "Mon: Eggs + black beans + broccoli + potato — iron + C + complex carb",
    "Tue: Eggs + sardine + tomato + potato — omega-3 day",
    "Wed: Eggs + chicken pieces + bell pepper + potato — high protein day",
    "Thu: Eggs + meatball crumbles + broccoli + potato — heme iron day",
    "Fri: Eggs + oats mixed in batter + spinach — pre-competition style, high carb",
    "Sat: Eggs + beans + veggies + double potato — heavy training day",
    "Sun: Eggs + cottage cheese mix + veggie medley — recovery day",
  ],
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — WEEKLY NUTRITION CHECKLIST (for app integration)
// ══════════════════════════════════════════════════════════════════════════════

export const WEEKLY_NUTRITION_HABITS = [
  { id: "habit_cottage_cheese", label: "Cottage cheese before bed (5+ nights)", pillar: 5, xp: 15 },
  { id: "habit_preworkout_carb", label: "Carb meal within 60 min before training", pillar: 3, xp: 10 },
  { id: "habit_postworkout_window", label: "Post-workout meal within 30 min", pillar: 1, xp: 15 },
  { id: "habit_omega3", label: "Omega-3 source 3+ times this week (sardines or flaxseed)", pillar: 5, xp: 15 },
  { id: "habit_vitamin_c_with_beans", label: "High-C veggie with every bean meal", pillar: 4, xp: 10 },
  { id: "habit_5_eating_events", label: "4–5 eating events on training days (no 5h+ gaps)", pillar: 1, xp: 10 },
  { id: "habit_protein_target", label: "~160g protein hit (rough estimate from meals)", pillar: 2, xp: 10 },
  { id: "habit_hydration", label: "Drank water consistently — not thirsty at training start", pillar: 4, xp: 5 },
];
