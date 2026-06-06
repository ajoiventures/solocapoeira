export const NUTRITION_HABIT_IDS = new Set([
  "habit_cottage_cheese",
  "habit_preworkout_carb",
  "habit_postworkout_window",
  "habit_omega3",
  "habit_vitamin_c_with_beans",
  "habit_5_eating_events",
  "habit_protein_target",
  "habit_hydration",
]);

export function isNutritionHabitId(id) {
  return NUTRITION_HABIT_IDS.has(id);
}
