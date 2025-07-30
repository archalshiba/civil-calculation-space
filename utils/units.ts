// Conversion constants
const IN_TO_MM = 25.4;
const FT_TO_M = 0.3048;
const LBS_PER_FT3_TO_KG_PER_M3 = 16.0185;
const PSI_TO_MPA = 0.00689476;
const KIP_TO_KN = 4.44822;

/**
 * Converts a value from a known unit to a specified SI base unit.
 * @param value The numerical value to convert.
 * @param fromUnit The unit of the provided value.
 * @returns The value converted to its SI base unit (meters, kg/m³, MPa, or kN).
 */
export function toSI(value: number, fromUnit: string): number {
  switch (fromUnit) {
    // Length
    case 'mm':
      return value / 1000;
    case 'in':
      return (value * IN_TO_MM) / 1000;
    case 'ft':
      return value * FT_TO_M;
    case 'm':
      return value;

    // Density
    case 'lb/ft³':
      return value * LBS_PER_FT3_TO_KG_PER_M3;
    case 'kg/m³':
      return value;
      
    // Pressure / Stress
    case 'psi':
        return value * PSI_TO_MPA;
    case 'ksi':
        return value * PSI_TO_MPA * 1000;
    case 'kPa':
        return value / 1000;
    case 'MPa':
        return value;

    // Force
    case 'kip':
        return value * KIP_TO_KN;
    case 'kN':
        return value;

    default:
      console.warn(`Unknown unit for SI conversion: ${fromUnit}`);
      return value;
  }
}

/**
 * Formats a number to a string with a specified number of decimal places.
 * @param value The number to format.
 * @param decimals The number of decimal places.
 * @returns A formatted string.
 */
export function format(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
}