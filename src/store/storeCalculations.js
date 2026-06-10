export function getPrestigeMultiplier(state) {
  const integratedBonus = 1 + ((state.orishasIntegrated?.length || 0) * 0.02);
  const ehiBonus = state.ehiStatus?.prestigeMode ? 2 : 1;
  return integratedBonus * ehiBonus;
}
