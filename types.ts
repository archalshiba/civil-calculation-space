
import React from 'react';

export interface NavItem {
  nameKey: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CalculatorInfo {
  id: string;
  titleKey: string;
  descriptionKey: string;
  modalComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void; title: string; }>;
}

export interface CalculatorSection {
  titleKey: string;
  calculators: CalculatorInfo[];
}

export type UnitSystem = 'metric' | 'imperial';
export type Theme = 'light' | 'dark';
export type Locale = 'en' | 'es';

export interface GlobalSettings {
  unitSystem: UnitSystem;
  projectName: string;
  projectNumber: string;
  theme?: Theme;
  locale?: Locale;
}

export interface CalculationInputs {
  // Common Dimensions
  width?: number; // bw for beams, W for footings
  widthUnit?: 'mm' | 'in' | 'm' | 'ft';
  depth?: number; // h for columns/beams, thickness for walls/slabs
  depthUnit?: 'mm' | 'in';
  height?: number; // for columns/walls
  heightUnit?: 'm' | 'ft';
  span?: number; // for beams/slabs
  spanUnit?: 'm' | 'ft';
  length?: number; // for slabs/foundations/walls
  lengthUnit?: 'm' | 'ft' | 'mm' | 'in';
  diameter?: number; // for circular columns
  diameterUnit?: 'mm' | 'in';

  // T-Beam specific
  flangeWidth?: number; // bf
  flangeWidthUnit?: 'mm' | 'in';
  flangeThickness?: number; // hf
  flangeThicknessUnit?: 'mm' | 'in';

  // Material Properties
  concreteUnitWeight?: number;
  concreteUnitWeightUnit?: 'kg/m³' | 'lb/ft³';
  concreteStrength?: number;
  concreteStrengthUnit?: 'MPa' | 'psi';
  steelYieldStrength?: number;
  steelYieldStrengthUnit?: 'MPa' | 'ksi';

  // Foundation Material Properties
  soilBearingPressure?: number;
  soilBearingPressureUnit?: 'kPa' | 'psf';

  // Column/Wall Longitudinal Reinforcement
  longitudinalBarSize?: string;
  longitudinalBarCount?: number;

  // Beam Longitudinal Reinforcement
  topBarSize?: string;
  topBarCount?: number;
  bottomBarSize?: string;
  bottomBarCount?: number;

  // Slab Reinforcement
  mainBarSize?: string;
  mainBarSpacing?: number;
  mainBarSpacingUnit?: 'mm' | 'in';
  tempBarSize?: string;
  tempBarSpacing?: number;
  tempBarSpacingUnit?: 'mm' | 'in';
  // Two-way slab specific
  shortDirBarSize?: string;
  shortDirBarSpacing?: number;
  shortDirBarSpacingUnit?: 'mm' | 'in';
  longDirBarSize?: string;
  longDirBarSpacing?: number;
  longDirBarSpacingUnit?: 'mm' | 'in';
  
  // Foundation Reinforcement
  footingTopBarSize?: string;
  footingTopBarSpacing?: number;
  footingTopBarSpacingUnit?: 'mm' | 'in';
  footingBottomBarSize?: string;
  footingBottomBarSpacing?: number;
  footingBottomBarSpacingUnit?: 'mm' | 'in';
  dowelBarSize?: string;
  dowelBarCount?: number;

  // Pile Cap specific
  pileCount?: number;
  pileDiameter?: number;
  pileDiameterUnit?: 'mm' | 'in';
  pileSpacing?: number;
  pileSpacingUnit?: 'mm' | 'in';
  capEdgeDistance?: number;
  capEdgeDistanceUnit?: 'mm' | 'in';

  // Wall Reinforcement
  verticalBarSize?: string;
  verticalBarSpacing?: number;
  verticalBarSpacingUnit?: 'mm' | 'in';
  horizontalBarSize?: string;
  horizontalBarSpacing?: number;
  horizontalBarSpacingUnit?: 'mm' | 'in';
  reinforcementLayers?: 'single' | 'double';

  // Transverse Reinforcement
  transverseType?: 'tied' | 'spiral' | 'stirrup';
  transverseBarSize?: string;
  transverseSpacing?: number;
  transverseSpacingUnit?: 'mm' | 'in';
  pitch?: number; // for spirals
  pitchUnit?: 'mm' | 'in';

  // Diaphragm specific
  diaphragmThickness?: number;
  diaphragmThicknessUnit?: 'mm' | 'in';
  collectorBarSize?: string;
  collectorBarCount?: number;
  chordBarSize?: string;
  chordBarCount?: number;
  shrinkageBarSize?: string;
  shrinkageBarSpacing?: number;
  shrinkageBarSpacingUnit?: 'mm' | 'in';
  modelingMethod?: 'flexible' | 'rigid' | 'semi-rigid';

  // Bracket/Corbel specific
  effectiveDepth?: number;
  effectiveDepthUnit?: 'mm' | 'in';
  shearSpan?: number;
  shearSpanUnit?: 'mm' | 'in';
  appliedLoad?: number;
  appliedLoadUnit?: 'kN' | 'kip';

  // Beam-Column Joint specific
  beamDepth?: number;
  beamDepthUnit?: 'mm' | 'in';
  columnDepth?: number;
  columnDepthUnit?: 'mm' | 'in';
  factoredShearVu?: number;
  factoredShearVuUnit?: 'kN' | 'kip';
  jointEffectiveWidth?: number;
  jointEffectiveWidthUnit?: 'mm' | 'in';

  // Anchorage specific
  anchorType?: 'cast-in' | 'adhesive' | 'mechanical';
  anchorSize?: string;
  embedmentDepth?: number;
  embedmentDepthUnit?: 'mm' | 'in';
  edgeDistance?: number;
  edgeDistanceUnit?: 'mm' | 'in';
  anchorSpacing?: number;
  anchorSpacingUnit?: 'mm' | 'in';
  factoredTension?: number;
  factoredTensionUnit?: 'kN' | 'kip';
  factoredShear?: number;
  factoredShearUnit?: 'kN' | 'kip';

  // Retaining Wall specific
  stemHeight?: number;
  stemHeightUnit?: 'm' | 'ft';
  stemThicknessTop?: number;
  stemThicknessTopUnit?: 'mm' | 'in';
  stemThicknessBottom?: number;
  stemThicknessBottomUnit?: 'mm' | 'in';
  heelLength?: number;
  heelLengthUnit?: 'm' | 'ft';
  toeLength?: number;
  toeLengthUnit?: 'm' | 'ft';
  footingThickness?: number;
  footingThicknessUnit?: 'mm' | 'in';
  soilUnitWeight?: number;
  soilUnitWeightUnit?: 'kN/m³' | 'pcf'; // pcf = pounds-force per cubic foot
  soilFrictionAngle?: number; // degrees
  surchargeLoad?: number;
  surchargeLoadUnit?: 'kPa' | 'psf';
}

/**
 * Represents a single type of reinforcement bar for scheduling.
 */
export interface ReinforcementBar {
  barSize: string;
  count: number;
  length: number; // in meters
  shapeCode: 'straight' | 'L-bend' | 'stirrup' | 'tie' | 'spiral';
  description: string;
}

/**
 * Represents a single step in the calculation process for the "Show Your Work" feature.
 */
export interface CalculationTrace {
  description: string;
  formula: string;
  calculation: string;
  result: string;
  reference?: string;
}

export interface CalculationResults {
  concreteVolume?: string;
  concreteWeight?: string;
  formworkArea?: string;
  totalSteelWeight?: string;

  // Detailed reinforcement for scheduling
  detailedReinforcement?: ReinforcementBar[];
  
  // Calculation trace for transparency
  calculationTrace?: CalculationTrace[];

  // Column specific
  longitudinalSteelWeight?: string;
  transverseSteelWeight?: string;
  
  // Beam specific
  topSteelWeight?: string;
  bottomSteelWeight?: string;
  stirrupSteelWeight?: string;
  
  // Slab specific
  mainSteelWeight?: string;
  tempSteelWeight?: string;
  shortDirSteelWeight?: string;
  longDirSteelWeight?: string;

  // Foundation specific
  topReinforcementWeight?: string;
  bottomReinforcementWeight?: string;
  dowelWeight?: string;

  // Wall specific
  verticalSteelWeight?: string;
  horizontalSteelWeight?: string;

  // Diaphragm specific
  collectorSteelWeight?: string;
  chordSteelWeight?: string;
  shrinkageSteelWeight?: string;

  // Bracket/Corbel specific
  mainSteelArea?: string;
  hangerSteelArea?: string;
  bearingPlateArea?: string;

  // Beam-Column Joint specific
  beamColumnDepthRatio?: string;
  jointShearStrength?: string;

  // Anchorage specific
  tensionCapacity?: string;
  shearCapacity?: string;
  combinedCheck?: string;

  // Retaining Wall specific
  factorOfSafetyOverturning?: string;
  factorOfSafetySliding?: string;
  maxBearingPressure?: string;
  minBearingPressure?: string;
  stemConcreteVolume?: string;
  footingConcreteVolume?: string;
  stemSteelWeight?: string;
  footingSteelWeight?: string;
}

export interface SavedCalculationItem {
  id: string;
  timestamp: number;
  type: string; // e.g., "Rectangular/Square Column"
  description: string;
  inputs: Partial<CalculationInputs>; // A snapshot of the inputs used
  results: Partial<CalculationResults>; // The results generated
}

/**
 * Represents a single line item in the reinforcement schedule report.
 */
export interface ScheduleItem {
  barMark: string;
  barSize: string;
  quantity: number;
  shapeCode: ReinforcementBar['shapeCode'];
  length: number; // in meters
  totalLength: number; // in meters
}


export type ValidationErrors = { [key in keyof Partial<CalculationInputs>]: string | undefined };
