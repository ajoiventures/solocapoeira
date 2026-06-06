export const OZ_TO_ML = 29.5735;

export function ozToMl(oz) {
  return Math.round((parseFloat(oz) || 0) * OZ_TO_ML);
}

export function mlToOz(ml) {
  return Math.round((parseFloat(ml) || 0) / OZ_TO_ML);
}
