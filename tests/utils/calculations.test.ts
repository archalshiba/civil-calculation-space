
/**
 * @vitest-environment jsdom
 * 
 * NOTE: The describe, it, and expect functions are assumed to be globally available,
 * as is common in testing frameworks like Vitest or Jest.
 */

// Mock implementations for test environment
const describe = (name: string, fn: () => void) => fn();
const it = (name: string, fn: () => void) => fn();
const expect = (value: any) => ({
    toBe: (expected: any) => { if (value !== expected) throw new Error(`Expected ${value} to be ${expected}`); },
    toBeCloseTo: (expected: number, precision = 2) => {
        const pass = Math.abs(expected - value) < (Math.pow(10, -precision) / 2);
        if (!pass) throw new Error(`Expected ${value} to be close to ${expected}`);
    },
    toEqual: (expected: any) => { if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`); },
    toBeGreaterThan: (expected: number) => { if (value <= expected) throw new Error(`Expected ${value} to be greater than ${expected}`); },
    toContain: (expected: string) => { if (!String(value).includes(expected)) throw new Error(`Expected '${value}' to contain '${expected}'`); }
});

import {
    calculateRectangularColumn,
    calculateCircularColumn,
    calculateRectangularBeam,
    calculateOneWaySlab,
    calculatePileCapFoundation,
    calculateRetainingWall,
    calculateBracketCorbel,
    calculateAnchorage
} from '../../utils/calculations';
import type { CalculationInputs } from '../../types';

// Helper to parse "123.45 unit" string to a number for testing
const parseResult = (result: string | undefined): number => {
    if (!result) return 0;
    const parsed = parseFloat(result);
    return isNaN(parsed) ? 0 : parsed;
}

describe('Engineering Calculations', () => {

    describe('calculateRectangularColumn', () => {
        it('should correctly calculate for metric inputs', () => {
            const inputs: CalculationInputs = {
                width: 400, widthUnit: 'mm',
                depth: 400, depthUnit: 'mm',
                height: 3, heightUnit: 'm',
                concreteUnitWeight: 2400, concreteUnitWeightUnit: 'kg/m³',
                longitudinalBarSize: '16mm', // 1.578 kg/m
                longitudinalBarCount: 8,
                transverseBarSize: '10mm', // 0.617 kg/m
                transverseSpacing: 200, transverseSpacingUnit: 'mm'
            };
            const results = calculateRectangularColumn(inputs);

            expect(parseResult(results.concreteVolume)).toBeCloseTo(0.48);
            expect(parseResult(results.concreteWeight)).toBeCloseTo(1152);
            expect(parseResult(results.formworkArea)).toBeCloseTo(4.8);
            expect(parseResult(results.longitudinalSteelWeight)).toBeCloseTo(37.87);
            expect(parseResult(results.transverseSteelWeight)).toBeCloseTo(13.69);
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(51.56);
        });

        it('should correctly calculate for imperial inputs', () => {
            const inputs: CalculationInputs = {
                width: 16, widthUnit: 'in', // 1.333 ft
                depth: 16, depthUnit: 'in', // 1.333 ft
                height: 10, heightUnit: 'ft',
                concreteUnitWeight: 150, concreteUnitWeightUnit: 'lb/ft³',
                longitudinalBarSize: '#5', // 1.043 lb/ft -> 1.552 kg/m
                longitudinalBarCount: 8,
                transverseBarSize: '#3', // 0.376 lb/ft -> 0.560 kg/m
                transverseSpacing: 8, transverseSpacingUnit: 'in' // 0.667 ft
            };
            const results = calculateRectangularColumn(inputs); // Note: calculation is in SI, so results are converted back

            // 16 in = 0.4064m, 10 ft = 3.048m, 150 lb/ft3 = 2402.77 kg/m3
            const concreteVolume_m3 = 0.4064 * 0.4064 * 3.048; // ~0.504 m3
            expect(parseResult(results.concreteVolume)).toBeCloseTo(0.50);
            expect(parseResult(results.concreteWeight)).toBeCloseTo(1212.02);
            expect(parseResult(results.formworkArea)).toBeCloseTo(4.95);
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(47.41);
        });
    });

    describe('calculateCircularColumn', () => {
        it('should correctly calculate for metric inputs with spiral reinforcement', () => {
            const inputs: CalculationInputs = {
                diameter: 500, diameterUnit: 'mm',
                height: 3, heightUnit: 'm',
                concreteUnitWeight: 2400, concreteUnitWeightUnit: 'kg/m³',
                longitudinalBarSize: '20mm', // 2.466 kg/m
                longitudinalBarCount: 6,
                transverseType: 'spiral',
                transverseBarSize: '10mm', // 0.617 kg/m
                pitch: 75, pitchUnit: 'mm'
            };
            const results = calculateCircularColumn(inputs);

            expect(parseResult(results.concreteVolume)).toBeCloseTo(0.59);
            expect(parseResult(results.concreteWeight)).toBeCloseTo(1413.72);
            expect(parseResult(results.formworkArea)).toBeCloseTo(4.71);
            expect(parseResult(results.longitudinalSteelWeight)).toBeCloseTo(44.39);
            expect(parseResult(results.transverseSteelWeight)).toBeCloseTo(33.19);
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(77.58);
        });
    });
    
    describe('calculateRectangularBeam', () => {
        it('should correctly calculate for metric inputs', () => {
            const inputs: CalculationInputs = {
                width: 300, widthUnit: 'mm',
                depth: 500, depthUnit: 'mm',
                span: 8, spanUnit: 'm',
                concreteUnitWeight: 2400, concreteUnitWeightUnit: 'kg/m³',
                topBarSize: '16mm', topBarCount: 3, // 1.578 kg/m
                bottomBarSize: '20mm', bottomBarCount: 4, // 2.466 kg/m
                transverseBarSize: '10mm', transverseSpacing: 150, transverseSpacingUnit: 'mm' // 0.617 kg/m
            };
            const results = calculateRectangularBeam(inputs);
            
            expect(parseResult(results.concreteVolume)).toBeCloseTo(1.20);
            expect(parseResult(results.concreteWeight)).toBeCloseTo(2880);
            expect(parseResult(results.formworkArea)).toBeCloseTo(10.40);
            expect(parseResult(results.topSteelWeight)).toBeCloseTo(37.87);
            expect(parseResult(results.bottomSteelWeight)).toBeCloseTo(78.91);
            expect(parseResult(results.stirrupSteelWeight)).toBeCloseTo(60.15);
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(176.93);
        });
    });

    describe('calculateOneWaySlab', () => {
         it('should correctly calculate for imperial inputs', () => {
            const inputs: CalculationInputs = {
                depth: 8, depthUnit: 'in',
                length: 25, lengthUnit: 'ft',
                span: 15, spanUnit: 'ft', // width
                concreteUnitWeight: 150, concreteUnitWeightUnit: 'lb/ft³',
                mainBarSize: '#5', mainBarSpacing: 6, mainBarSpacingUnit: 'in',
                tempBarSize: '#4', tempBarSpacing: 10, tempBarSpacingUnit: 'in',
            };
            const results = calculateOneWaySlab(inputs);

            // 8in = 0.667ft, V = 25*15*0.667 = 250.125 ft3. 
            // 250.125 ft3 = 7.08 m3.
            expect(parseResult(results.concreteVolume)).toBeCloseTo(7.08);
            // 250.125 * 150 = 37518.75 lb = 17018.1 kg
            expect(parseResult(results.concreteWeight)).toBeCloseTo(17018.10);
            // 25ft*15ft = 375 ft2 = 34.84 m2
            expect(parseResult(results.formworkArea)).toBeCloseTo(34.84);
            // Total weight check is sufficient
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(581.57);
        });
    });
    
    describe('calculatePileCapFoundation', () => {
        it('should correctly calculate for metric inputs', () => {
            const inputs: CalculationInputs = {
                length: 2000, lengthUnit: 'mm',
                width: 2000, widthUnit: 'mm',
                depth: 800, depthUnit: 'mm',
                concreteUnitWeight: 2400, concreteUnitWeightUnit: 'kg/m³',
                footingBottomBarSize: '20mm', // 2.466 kg/m
                footingBottomBarSpacing: 150, footingBottomBarSpacingUnit: 'mm',
                footingTopBarSize: '16mm', // 1.578 kg/m
                footingTopBarSpacing: 200, footingTopBarSpacingUnit: 'mm',
                dowelBarSize: '20mm', // 2.466 kg/m
                dowelBarCount: 8,
            };
            const results = calculatePileCapFoundation(inputs);

            expect(parseResult(results.concreteVolume)).toBeCloseTo(3.20);
            expect(parseResult(results.formworkArea)).toBeCloseTo(6.40);
            expect(parseResult(results.bottomReinforcementWeight)).toBeCloseTo(131.52);
            expect(parseResult(results.topReinforcementWeight)).toBeCloseTo(50.50);
            expect(parseResult(results.dowelWeight)).toBeCloseTo(29.59);
            expect(parseResult(results.totalSteelWeight)).toBeCloseTo(211.61);
        });
    });

    describe('calculateRetainingWall', () => {
        it('should correctly calculate stability for metric inputs', () => {
            const inputs: CalculationInputs = {
                stemHeight: 3.0, stemHeightUnit: 'm',
                stemThicknessTop: 200, stemThicknessTopUnit: 'mm',
                stemThicknessBottom: 300, stemThicknessBottomUnit: 'mm',
                footingThickness: 400, footingThicknessUnit: 'mm',
                toeLength: 1.0, toeLengthUnit: 'm',
                heelLength: 1.5, heelLengthUnit: 'm',
                soilUnitWeight: 18, soilUnitWeightUnit: 'kN/m³',
                soilFrictionAngle: 30,
                soilBearingPressure: 150, soilBearingPressureUnit: 'kPa',
                surchargeLoad: 10, surchargeLoadUnit: 'kPa',
                concreteUnitWeight: 2400, concreteUnitWeightUnit: 'kg/m³',
                // Reinf. inputs not needed for stability check
            };
            const results = calculateRetainingWall(inputs);
            
            // Check stability results
            expect(parseResult(results.factorOfSafetyOverturning)).toBeGreaterThan(2.0); // Should be stable
            expect(parseResult(results.factorOfSafetySliding)).toBeGreaterThan(1.5); // Should be stable
            expect(parseResult(results.maxBearingPressure)).toBeCloseTo(97.22); // Check pressure < 150
            expect(parseResult(results.maxBearingPressure)).toBeGreaterThan(0);
        });
    });
    
    describe('calculateBracketCorbel', () => {
        it('should calculate required steel areas for metric inputs', () => {
             const inputs: CalculationInputs = {
                effectiveDepth: 400, effectiveDepthUnit: 'mm',
                shearSpan: 200, shearSpanUnit: 'mm',
                appliedLoad: 150, appliedLoadUnit: 'kN',
                width: 300, widthUnit: 'mm',
                concreteStrength: 25, concreteStrengthUnit: 'MPa',
                steelYieldStrength: 420, steelYieldStrengthUnit: 'MPa',
            };
            const results = calculateBracketCorbel(inputs);

            expect(parseResult(results.mainSteelArea)).toBeCloseTo(476.19);
            expect(parseResult(results.hangerSteelArea)).toBeCloseTo(238.10);
            expect(parseResult(results.bearingPlateArea)).toBeCloseTo(7058.82);
        });
    });

    describe('calculateAnchorage', () => {
        it('should correctly calculate anchorage capacities for imperial inputs', () => {
            const inputs: CalculationInputs = {
                anchorType: 'cast-in',
                anchorSize: '5/8"',
                concreteStrength: 4000, concreteStrengthUnit: 'psi',
                embedmentDepth: 5, embedmentDepthUnit: 'in',
                edgeDistance: 6, edgeDistanceUnit: 'in',
                factoredTension: 5.5, factoredTensionUnit: 'kip',
                factoredShear: 3.5, factoredShearUnit: 'kip',
            };
            const results = calculateAnchorage(inputs);
            
            expect(parseResult(results.tensionCapacity)).toBeCloseTo(51.64);
            expect(parseResult(results.shearCapacity)).toBeCloseTo(60.91);
            expect(results.combinedCheck).toContain("Pass");
        });
    });

});
