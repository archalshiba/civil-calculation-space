// Data for steel reinforcement bars
// Source: ACI 318 & standard bar manufacturers
export const BAR_DATA: { [key: string]: { diameter_mm: number; weight_kg_per_m: number } } = {
  // Metric sizes
  '10mm': { diameter_mm: 10, weight_kg_per_m: 0.617 },
  '12mm': { diameter_mm: 12, weight_kg_per_m: 0.888 },
  '16mm': { diameter_mm: 16, weight_kg_per_m: 1.578 },
  '20mm': { diameter_mm: 20, weight_kg_per_m: 2.466 },
  '25mm': { diameter_mm: 25, weight_kg_per_m: 3.853 },
  '32mm': { diameter_mm: 32, weight_kg_per_m: 6.313 },
  // Imperial sizes
  '#3': { diameter_mm: 9.5, weight_kg_per_m: 0.560 }, // 3/8 inch
  '#4': { diameter_mm: 12.7, weight_kg_per_m: 0.996 }, // 4/8 inch
  '#5': { diameter_mm: 15.9, weight_kg_per_m: 1.552 }, // 5/8 inch
  '#6': { diameter_mm: 19.1, weight_kg_per_m: 2.235 }, // 6/8 inch
};

export const ANCHOR_DATA: { [key: string]: { area_mm2: number; fut_MPa: number } } = {
    'M12': { area_mm2: 84.3, fut_MPa: 400 },
    'M16': { area_mm2: 157, fut_MPa: 400 },
    'M20': { area_mm2: 245, fut_MPa: 400 },
    '1/2"': { area_mm2: 129, fut_MPa: 414 }, // Grade 36
    '5/8"': { area_mm2: 199, fut_MPa: 414 }, // Grade 36
};
