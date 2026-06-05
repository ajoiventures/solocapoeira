import { MOVEMENTS, getMovementById } from "../src/data/movements.js";
import { getAllMestres, getMestreById } from "../src/data/mestres.js";
import { getAllMestreSequences } from "../src/data/mestreSequences.js";
import { SEQUENCES, BIMBA_SEQUENCES, TAYLOR_WORKOUTS } from "../src/data/sequences.js";
import { SPRINT_1, FOUNDATION_ROTATION } from "../src/data/sprint.js";
import { BOSS_TESTS } from "../src/data/bossTests.js";
import { EXERCISE_LIBRARY } from "../src/data/extraWork.js";
import { getAllCoreOrishas } from "../src/data/orishas.js";
import { getAllConceptAdvancedSequences } from "../src/data/conceptSequences.js";
import { ADVANCED_INVERSION_MOVES, buildRequirementPracticePlan, getRequirementPlanMovementIds } from "../src/data/requirementPracticePlans.js";

const failures = [];
const check = (condition, label, sample = "") => {
  if (!condition) failures.push({ label, sample });
};

const movementIds = new Set(MOVEMENTS.map((movement) => movement.id));
const referencedMovementIds = new Set();
const addMove = (id) => {
  if (id) referencedMovementIds.add(id);
};
let requirementPracticePlans = 0;
let requirementPracticeSessions = 0;

for (const movement of MOVEMENTS) {
  for (const id of movement.prerequisites || []) addMove(id);
  check(
    !!getMovementById(movement.id)?.profile?.practiceInstructions?.length,
    "Movement profile missing instructions",
    movement.id
  );
}

for (const sequence of getAllMestreSequences()) {
  for (const id of sequence.moves || []) addMove(id);
}
for (const sequence of SEQUENCES) {
  for (const id of sequence.movements || []) addMove(id);
}
for (const sequence of BIMBA_SEQUENCES) {
  for (const id of [...(sequence.prerequisiteMovements || []), ...(sequence.movements || [])]) addMove(id);
}
for (const workout of TAYLOR_WORKOUTS) {
  for (const id of [...(workout.movements || []), ...(workout.movementIds || [])]) addMove(id);
}
for (const day of Object.values(FOUNDATION_ROTATION || {})) {
  for (const drill of day.drills || []) addMove(drill.id);
}
for (const week of SPRINT_1.weeks || []) {
  for (const quest of week.quests || []) {
    for (const item of quest.items || []) {
      addMove(item.movementId);
      for (const id of item.movementIds || []) addMove(id);
    }
  }
  for (const id of week.conditioning?.movementIds || []) addMove(id);
}
for (const boss of BOSS_TESTS) {
  for (const [index, requirement] of (boss.requirements || []).entries()) {
    addMove(requirement.movementId);
    if (requirement.movementId) continue;
    const plan = buildRequirementPracticePlan(
      {
        ownerType: "archived_boss",
        ownerId: boss.id,
        ownerName: boss.name,
        ownerStyle: boss.tree,
        ownerTier: "archive",
        ownerHistory: boss.subtitle,
        ownerPhilosophy: boss.reward,
        ownerSkills: boss.requirements?.map((req) => req.movementId || req.label).filter(Boolean),
      },
      requirement,
      index
    );
    validateRequirementPracticePlan(plan, boss.id, requirement.label);
  }
}
for (const exercise of EXERCISE_LIBRARY) {
  for (const id of exercise.relatedMovements || []) addMove(id);
}

const conceptAdvancedSequences = getAllConceptAdvancedSequences();
for (const [conceptId, pack] of Object.entries(conceptAdvancedSequences)) {
  check(!!pack.context?.trim(), "Concept sequence pack missing context", conceptId);
  check(
    Array.isArray(pack.keyPrinciples) && pack.keyPrinciples.length >= 3,
    "Concept sequence pack missing key principles",
    conceptId
  );
  check(
    pack.sessionPolicy?.unitMinutes === 10 && pack.sessionPolicy?.minSessions >= 3,
    "Concept sequence pack has invalid 10-minute session policy",
    conceptId
  );
  check(
    Array.isArray(pack.sequences) && pack.sequences.length >= pack.sessionPolicy.minSessions,
    "Concept boss has fewer than minimum advanced sequence sessions",
    `${conceptId}:${pack.sequences?.length || 0}`
  );

  const seenSessions = new Set();
  const seenNames = new Set();
  for (const sequence of pack.sequences || []) {
    check(!seenSessions.has(sequence.session), "Duplicate concept sequence session number", `${conceptId}:${sequence.session}`);
    check(!seenNames.has(sequence.name), "Duplicate concept sequence name", `${conceptId}:${sequence.name}`);
    seenSessions.add(sequence.session);
    seenNames.add(sequence.name);
    check(sequence.minutes === 10, "Concept advanced sequence is not 10 minutes", `${conceptId}:${sequence.name}`);
    check(!!sequence.goal?.trim(), "Concept advanced sequence missing goal", `${conceptId}:${sequence.name}`);
    check(!!sequence.orisha?.trim(), "Concept advanced sequence missing Orisha context", `${conceptId}:${sequence.name}`);
    check(!!sequence.mestre?.trim(), "Concept advanced sequence missing Mestre context", `${conceptId}:${sequence.name}`);
    check(Array.isArray(sequence.moves) && sequence.moves.length >= 3, "Concept advanced sequence missing movement links", `${conceptId}:${sequence.name}`);
    for (const id of sequence.moves || []) addMove(id);
  }
}

const unresolvedMovementRefs = [...referencedMovementIds].filter(
  (id) => !getMovementById(id)?.profile?.practiceInstructions?.length
);
check(
  unresolvedMovementRefs.length === 0,
  "Referenced movement IDs without profile/instructions",
  unresolvedMovementRefs.slice(0, 20).join(", ")
);

const mestres = getAllMestres();
check(mestres.length >= 27, "Expected 27+ Mestre profiles", String(mestres.length));

for (const mestre of mestres) {
  const full = getMestreById(mestre.id);
  check(!!full?.historical_context?.trim(), "Mestre missing historical context", mestre.id);
  check((full?.requirements || []).length > 0, "Mestre missing requirements", mestre.id);
}

const mestreSequences = getAllMestreSequences();
const mestreSeqCounts = new Map();
for (const sequence of mestreSequences) {
  mestreSeqCounts.set(sequence.mestreId, (mestreSeqCounts.get(sequence.mestreId) || 0) + 1);
}
const mestreWithoutFive = mestres
  .filter((mestre) => (mestreSeqCounts.get(mestre.id) || 0) < 5)
  .map((mestre) => `${mestre.id}:${mestreSeqCounts.get(mestre.id) || 0}`);
check(
  mestreWithoutFive.length === 0,
  "Mestres without 5 advanced sequences",
  mestreWithoutFive.slice(0, 20).join(", ")
);

const orishas = getAllCoreOrishas();
check(orishas.length === 16, "Expected 16 core Orishas", String(orishas.length));

function validateRequirementPracticePlan(plan, ownerId, requirementLabel) {
  check(!!plan?.id && !!plan?.title, "Requirement practice plan missing identity", `${ownerId}:${requirementLabel}`);
  check(!!plan?.context?.trim(), "Requirement practice plan missing context", `${ownerId}:${requirementLabel}`);
  check(
    plan?.sessionPolicy?.unitMinutes === 10 && plan?.sessionPolicy?.minSessions >= 3,
    "Requirement practice plan has invalid session policy",
    `${ownerId}:${requirementLabel}`
  );
  check(
    Array.isArray(plan?.principles) && plan.principles.length >= 3,
    "Requirement practice plan missing principles",
    `${ownerId}:${requirementLabel}`
  );
  check(
    Array.isArray(plan?.sessions) && plan.sessions.length >= (plan?.sessionPolicy?.minSessions || 3),
    "Requirement practice plan missing minimum sessions",
    `${ownerId}:${requirementLabel}`
  );

  requirementPracticePlans += 1;
  requirementPracticeSessions += plan?.sessions?.length || 0;
  const sessionNames = new Set();
  const moveSignatures = new Set();

  for (const session of plan?.sessions || []) {
    check(session.minutes === 10, "Requirement practice session is not 10 minutes", `${ownerId}:${session.name}`);
    check(!!session.name?.trim(), "Requirement practice session missing name", `${ownerId}:${requirementLabel}`);
    check(!sessionNames.has(session.name), "Requirement practice page repeats a session name", `${ownerId}:${session.name}`);
    sessionNames.add(session.name);
    check(!!session.goal?.trim(), "Requirement practice session missing goal", `${ownerId}:${session.name}`);
    check(
      Array.isArray(session.instructions) && session.instructions.length >= 3,
      "Requirement practice session missing full instructions",
      `${ownerId}:${session.name}`
    );
    check(
      Array.isArray(session.moves) && session.moves.length >= 7,
      "Requirement practice session needs 7+ movement links",
      `${ownerId}:${session.name}`
    );
    const signature = (session.moves || []).join(">");
    check(!moveSignatures.has(signature), "Requirement practice page repeats the same movement chain", `${ownerId}:${session.name}`);
    moveSignatures.add(signature);
    const inversionCount = (session.moves || []).filter((id) => ADVANCED_INVERSION_MOVES.includes(id)).length;
    check(
      inversionCount >= 2,
      "Requirement practice session needs at least 2 inversion movement links",
      `${ownerId}:${session.name}:${inversionCount}`
    );
    for (const id of session.moves || []) {
      addMove(id);
      check(
        !!getMovementById(id)?.profile?.practiceInstructions?.length,
        "Requirement practice movement lacks profile instructions",
        `${ownerId}:${session.name}:${id}`
      );
    }
  }

  for (const id of getRequirementPlanMovementIds(plan)) addMove(id);
}

for (const orisha of orishas) {
  check(!!orisha.icon && !!orisha.color, "Orisha missing icon/color", orisha.id);
  check((orisha.requirements || []).length > 0, "Orisha missing requirements", orisha.id);
  for (const [index, requirement] of (orisha.requirements || []).entries()) {
    if (requirement.movementId) continue;
    const plan = buildRequirementPracticePlan(
      {
        ownerType: "orisha",
        ownerId: orisha.id,
        ownerName: orisha.name,
        ownerStyle: orisha.spiritualDomain,
        ownerTier: orisha.tier,
        ownerHistory: orisha.historicalContext,
        ownerPhilosophy: orisha.spiritualLesson,
        ownerSkills: orisha.signature_techniques,
        ownerQualities: orisha.capoeiraDimension,
      },
      requirement,
      index
    );
    validateRequirementPracticePlan(plan, orisha.id, requirement.label);
  }
}

for (const mestre of mestres) {
  for (const [index, requirement] of (mestre.requirements || []).entries()) {
    if (requirement.movementId) continue;
    const plan = buildRequirementPracticePlan(
      {
        ownerType: "mestre",
        ownerId: mestre.id,
        ownerName: mestre.name,
        ownerStyle: mestre.style,
        ownerTier: mestre.tier,
        ownerHistory: mestre.historical_context || mestre.historical_role,
        ownerPhilosophy: mestre.philosophy,
        ownerSkills: mestre.signature_techniques?.map((technique) => technique.id || technique.name).filter(Boolean),
        ownerQualities: mestre.style_characteristics,
      },
      requirement,
      index
    );
    validateRequirementPracticePlan(plan, mestre.id, requirement.label);
  }
}

const result = {
  authoredMovements: MOVEMENTS.length,
  referencedMovementIds: referencedMovementIds.size,
  movementIdsCoveredByFallback: [...referencedMovementIds].filter((id) => !movementIds.has(id)).length,
  mestres: mestres.length,
  mestreSequences: mestreSequences.length,
  conceptBosses: Object.keys(conceptAdvancedSequences).length,
  conceptBossSequences: Object.values(conceptAdvancedSequences).reduce((sum, pack) => sum + (pack.sequences?.length || 0), 0),
  requirementPracticePlans,
  requirementPracticeSessions,
  orishas: orishas.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exit(1);
}
