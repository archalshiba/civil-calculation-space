
import { toSI, format } from './units';
import type { CalculationInputs, CalculationResults, ReinforcementBar, CalculationTrace } from '../types';
import { BAR_DATA, ANCHOR_DATA } from '../data/rebar';

// --- Helper Functions ---
const CONCRETE_COVER_MM = 40;
const CONCRETE_COVER_M = CONCRETE_COVER_MM / 1000;

export function calculateRectangularColumn(inputs: CalculationInputs): CalculationResults {
  const width_m = toSI(inputs.width, inputs.widthUnit);
  const depth_m = toSI(inputs.depth, inputs.depthUnit);
  const height_m = toSI(inputs.height, inputs.heightUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  const transverseSpacing_m = toSI(inputs.transverseSpacing, inputs.transverseSpacingUnit);

  const concreteVolume_m3 = width_m * depth_m * height_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = 2 * (width_m + depth_m) * height_m;

  const detailedReinforcement: ReinforcementBar[] = [];
  const trace: CalculationTrace[] = [];
  let longSteelWeight_kg = 0;
  let transSteelWeight_kg = 0;

  trace.push({
    description: 'Concrete Volume',
    formula: 'V = width × depth × height',
    calculation: `V = ${format(width_m, 2)} m × ${format(depth_m, 2)} m × ${format(height_m, 2)} m`,
    result: `${format(concreteVolume_m3, 3)} m³`
  });
  trace.push({
    description: 'Formwork Area',
    formula: 'A = 2 × (width + depth) × height',
    calculation: `A = 2 × (${format(width_m, 2)} m + ${format(depth_m, 2)} m) × ${format(height_m, 2)} m`,
    result: `${format(formworkArea_m2, 2)} m²`
  });

  const longBarData = BAR_DATA[inputs.longitudinalBarSize];
  if (longBarData && inputs.longitudinalBarCount > 0) {
    longSteelWeight_kg = inputs.longitudinalBarCount * height_m * longBarData.weight_kg_per_m;
    detailedReinforcement.push({
        barSize: inputs.longitudinalBarSize,
        count: inputs.longitudinalBarCount,
        length: height_m,
        shapeCode: 'straight',
        description: 'Longitudinal Bars',
    });
    trace.push({
        description: 'Longitudinal Steel Weight',
        formula: 'W_long = count × height × weight_per_meter',
        calculation: `W_long = ${inputs.longitudinalBarCount} × ${format(height_m, 2)} m × ${longBarData.weight_kg_per_m} kg/m`,
        result: `${format(longSteelWeight_kg, 2)} kg`
    });
  }
  
  const transBarData = BAR_DATA[inputs.transverseBarSize];
  if (transBarData && transverseSpacing_m > 0) {
    const tieLength_m = 2 * (width_m - 2 * CONCRETE_COVER_M) + 2 * (depth_m - 2 * CONCRETE_COVER_M) + 0.2; // +200mm for hooks
    const numberOfTies = Math.ceil(height_m / transverseSpacing_m);
    transSteelWeight_kg = numberOfTies * tieLength_m * transBarData.weight_kg_per_m;
    detailedReinforcement.push({
        barSize: inputs.transverseBarSize,
        count: numberOfTies,
        length: tieLength_m,
        shapeCode: 'tie',
        description: 'Transverse Ties'
    });
    trace.push({
        description: 'Transverse Steel Weight',
        formula: 'W_trans = (tie_length) × (column_height / spacing) × weight_per_meter',
        calculation: `W_trans = ${format(tieLength_m, 2)} m/tie × ${numberOfTies} ties × ${transBarData.weight_kg_per_m} kg/m`,
        result: `${format(transSteelWeight_kg, 2)} kg`,
        reference: 'ACI 318-19 Cl 25.7.2'
    });
  }
  
  const totalSteelWeight_kg = longSteelWeight_kg + transSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    longitudinalSteelWeight: `${format(longSteelWeight_kg)} kg`,
    transverseSteelWeight: `${format(transSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
    calculationTrace: trace,
  };
}

export function calculateCircularColumn(inputs: CalculationInputs): CalculationResults {
  const diameter_m = toSI(inputs.diameter, inputs.diameterUnit);
  const height_m = toSI(inputs.height, inputs.heightUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  
  const radius_m = diameter_m / 2;
  const concreteVolume_m3 = Math.PI * radius_m * radius_m * height_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = Math.PI * diameter_m * height_m;

  const detailedReinforcement: ReinforcementBar[] = [];
  let longSteelWeight_kg = 0;
  let transSteelWeight_kg = 0;

  const longBarData = BAR_DATA[inputs.longitudinalBarSize];
  if (longBarData && inputs.longitudinalBarCount > 0) {
    detailedReinforcement.push({
        barSize: inputs.longitudinalBarSize,
        count: inputs.longitudinalBarCount,
        length: height_m,
        shapeCode: 'straight',
        description: 'Longitudinal Bars'
    });
    longSteelWeight_kg = inputs.longitudinalBarCount * height_m * longBarData.weight_kg_per_m;
  }
  
  const transBarData = BAR_DATA[inputs.transverseBarSize];
  if (transBarData) {
    const spiralCoreDiameter_m = diameter_m - 2 * CONCRETE_COVER_M;
    if (inputs.transverseType === 'spiral') {
      const pitch_m = toSI(inputs.pitch, inputs.pitchUnit);
      if (pitch_m > 0) {
        const numberOfTurns = Math.ceil(height_m / pitch_m);
        const spiralLengthPerTurn_m = Math.sqrt((Math.PI * spiralCoreDiameter_m) ** 2 + pitch_m ** 2);
        const totalSpiralLength = numberOfTurns * spiralLengthPerTurn_m;
        detailedReinforcement.push({
            barSize: inputs.transverseBarSize,
            count: 1, // One continuous spiral
            length: totalSpiralLength,
            shapeCode: 'spiral',
            description: 'Spiral Reinforcement'
        });
        transSteelWeight_kg = totalSpiralLength * transBarData.weight_kg_per_m;
      }
    } else { // Tied hoop
      const spacing_m = toSI(inputs.transverseSpacing, inputs.transverseSpacingUnit);
      if (spacing_m > 0) {
        const hoopLength_m = Math.PI * spiralCoreDiameter_m + 0.2; // + hook
        const numberOfHoops = Math.ceil(height_m / spacing_m);
         detailedReinforcement.push({
            barSize: inputs.transverseBarSize,
            count: numberOfHoops,
            length: hoopLength_m,
            shapeCode: 'tie',
            description: 'Tied Hoops'
        });
        transSteelWeight_kg = numberOfHoops * hoopLength_m * transBarData.weight_kg_per_m;
      }
    }
  }
  
  const totalSteelWeight_kg = longSteelWeight_kg + transSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    longitudinalSteelWeight: `${format(longSteelWeight_kg)} kg`,
    transverseSteelWeight: `${format(transSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
  };
}


export function calculateRectangularBeam(inputs: CalculationInputs): CalculationResults {
  const width_m = toSI(inputs.width, inputs.widthUnit);
  const depth_m = toSI(inputs.depth, inputs.depthUnit);
  const span_m = toSI(inputs.span, inputs.spanUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  const stirrupSpacing_m = toSI(inputs.transverseSpacing, inputs.transverseSpacingUnit);

  const concreteVolume_m3 = width_m * depth_m * span_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = (width_m * span_m) + (2 * depth_m * span_m);

  const detailedReinforcement: ReinforcementBar[] = [];
  let topSteelWeight_kg = 0, bottomSteelWeight_kg = 0, stirrupSteelWeight_kg = 0;

  const topBarData = BAR_DATA[inputs.topBarSize];
  if (topBarData && inputs.topBarCount > 0) {
    detailedReinforcement.push({ barSize: inputs.topBarSize, count: inputs.topBarCount, length: span_m, shapeCode: 'straight', description: 'Top Bars'});
    topSteelWeight_kg = inputs.topBarCount * span_m * topBarData.weight_kg_per_m;
  }

  const bottomBarData = BAR_DATA[inputs.bottomBarSize];
  if (bottomBarData && inputs.bottomBarCount > 0) {
    detailedReinforcement.push({ barSize: inputs.bottomBarSize, count: inputs.bottomBarCount, length: span_m, shapeCode: 'straight', description: 'Bottom Bars'});
    bottomSteelWeight_kg = inputs.bottomBarCount * span_m * bottomBarData.weight_kg_per_m;
  }

  const stirrupBarData = BAR_DATA[inputs.transverseBarSize];
  if (stirrupBarData && stirrupSpacing_m > 0) {
      const stirrupLength_m = 2 * (width_m - 2 * CONCRETE_COVER_M) + 2 * (depth_m - 2 * CONCRETE_COVER_M) + 0.2; // + hook
      const numberOfStirrups = Math.ceil(span_m / stirrupSpacing_m);
      detailedReinforcement.push({ barSize: inputs.transverseBarSize, count: numberOfStirrups, length: stirrupLength_m, shapeCode: 'stirrup', description: 'Stirrups'});
      stirrupSteelWeight_kg = numberOfStirrups * stirrupLength_m * stirrupBarData.weight_kg_per_m;
  }
  
  const totalSteelWeight_kg = topSteelWeight_kg + bottomSteelWeight_kg + stirrupSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    topSteelWeight: `${format(topSteelWeight_kg)} kg`,
    bottomSteelWeight: `${format(bottomSteelWeight_kg)} kg`,
    stirrupSteelWeight: `${format(stirrupSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
  };
}

export function calculateTBeam(inputs: CalculationInputs): CalculationResults {
  const bw_m = toSI(inputs.width, inputs.widthUnit);
  const h_m = toSI(inputs.depth, inputs.depthUnit);
  const bf_m = toSI(inputs.flangeWidth, inputs.flangeWidthUnit);
  const hf_m = toSI(inputs.flangeThickness, inputs.flangeThicknessUnit);
  const span_m = toSI(inputs.span, inputs.spanUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  const stirrupSpacing_m = toSI(inputs.transverseSpacing, inputs.transverseSpacingUnit);

  const webStemArea_m2 = bw_m * (h_m - hf_m);
  const flangeArea_m2 = bf_m * hf_m;
  const concreteVolume_m3 = (webStemArea_m2 + flangeArea_m2) * span_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = (bw_m + 2 * (h_m - hf_m) + (bf_m - bw_m) + 2 * hf_m) * span_m;

  const detailedReinforcement: ReinforcementBar[] = [];
  let topSteelWeight_kg = 0, bottomSteelWeight_kg = 0, stirrupSteelWeight_kg = 0;

  const topBarData = BAR_DATA[inputs.topBarSize];
  if (topBarData && inputs.topBarCount > 0) {
    detailedReinforcement.push({ barSize: inputs.topBarSize, count: inputs.topBarCount, length: span_m, shapeCode: 'straight', description: 'Top Bars' });
    topSteelWeight_kg = inputs.topBarCount * span_m * topBarData.weight_kg_per_m;
  }

  const bottomBarData = BAR_DATA[inputs.bottomBarSize];
  if (bottomBarData && inputs.bottomBarCount > 0) {
    detailedReinforcement.push({ barSize: inputs.bottomBarSize, count: inputs.bottomBarCount, length: span_m, shapeCode: 'straight', description: 'Bottom Bars' });
    bottomSteelWeight_kg = inputs.bottomBarCount * span_m * bottomBarData.weight_kg_per_m;
  }

  const stirrupBarData = BAR_DATA[inputs.transverseBarSize];
  if (stirrupBarData && stirrupSpacing_m > 0) {
      const stirrupLength_m = 2 * (bw_m - 2 * CONCRETE_COVER_M) + 2 * (h_m - 2 * CONCRETE_COVER_M) + 0.2;
      const numberOfStirrups = Math.ceil(span_m / stirrupSpacing_m);
      detailedReinforcement.push({ barSize: inputs.transverseBarSize, count: numberOfStirrups, length: stirrupLength_m, shapeCode: 'stirrup', description: 'Stirrups' });
      stirrupSteelWeight_kg = numberOfStirrups * stirrupLength_m * stirrupBarData.weight_kg_per_m;
  }
  
  const totalSteelWeight_kg = topSteelWeight_kg + bottomSteelWeight_kg + stirrupSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    topSteelWeight: `${format(topSteelWeight_kg)} kg`,
    bottomSteelWeight: `${format(bottomSteelWeight_kg)} kg`,
    stirrupSteelWeight: `${format(stirrupSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
  };
}

export function calculateOneWaySlab(inputs: CalculationInputs): CalculationResults {
    const thickness_m = toSI(inputs.depth, inputs.depthUnit);
    const length_m = toSI(inputs.length, inputs.lengthUnit);
    const width_m = toSI(inputs.span, inputs.spanUnit);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const mainSpacing_m = toSI(inputs.mainBarSpacing, inputs.mainBarSpacingUnit);
    const tempSpacing_m = toSI(inputs.tempBarSpacing, inputs.tempBarSpacingUnit);

    const concreteVolume_m3 = thickness_m * length_m * width_m;
    const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
    const formworkArea_m2 = length_m * width_m;

    const detailedReinforcement: ReinforcementBar[] = [];
    let mainSteelWeight_kg = 0, tempSteelWeight_kg = 0;

    const mainBarData = BAR_DATA[inputs.mainBarSize];
    if (mainBarData && mainSpacing_m > 0) {
        const numMainBars = Math.ceil(length_m / mainSpacing_m);
        detailedReinforcement.push({ barSize: inputs.mainBarSize, count: numMainBars, length: width_m, shapeCode: 'straight', description: 'Main Reinforcement' });
        mainSteelWeight_kg = numMainBars * width_m * mainBarData.weight_kg_per_m;
    }
    
    const tempBarData = BAR_DATA[inputs.tempBarSize];
    if (tempBarData && tempSpacing_m > 0) {
        const numTempBars = Math.ceil(width_m / tempSpacing_m);
        detailedReinforcement.push({ barSize: inputs.tempBarSize, count: numTempBars, length: length_m, shapeCode: 'straight', description: 'Temperature Reinforcement' });
        tempSteelWeight_kg = numTempBars * length_m * tempBarData.weight_kg_per_m;
    }
    
    const totalSteelWeight_kg = mainSteelWeight_kg + tempSteelWeight_kg;

    return {
        concreteVolume: `${format(concreteVolume_m3)} m³`,
        concreteWeight: `${format(concreteWeight_kg)} kg`,
        formworkArea: `${format(formworkArea_m2)} m²`,
        mainSteelWeight: `${format(mainSteelWeight_kg)} kg`,
        tempSteelWeight: `${format(tempSteelWeight_kg)} kg`,
        totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
        detailedReinforcement,
    };
}

export function calculateTwoWaySlab(inputs: CalculationInputs): CalculationResults {
    const thickness_m = toSI(inputs.depth, inputs.depthUnit);
    const length_m = toSI(inputs.length, inputs.lengthUnit);
    const width_m = toSI(inputs.span, inputs.spanUnit);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const shortDirSpacing_m = toSI(inputs.shortDirBarSpacing, inputs.shortDirBarSpacingUnit);
    const longDirSpacing_m = toSI(inputs.longDirBarSpacing, inputs.longDirBarSpacingUnit);

    const concreteVolume_m3 = thickness_m * length_m * width_m;
    const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
    const formworkArea_m2 = length_m * width_m;

    const detailedReinforcement: ReinforcementBar[] = [];
    let shortDirSteelWeight_kg = 0, longDirSteelWeight_kg = 0;

    const shortDirBarData = BAR_DATA[inputs.shortDirBarSize];
    if (shortDirBarData && shortDirSpacing_m > 0) {
        const numShortDirBars = Math.ceil(length_m / shortDirSpacing_m);
        detailedReinforcement.push({ barSize: inputs.shortDirBarSize, count: numShortDirBars, length: width_m, shapeCode: 'straight', description: 'Short Direction Bars' });
        shortDirSteelWeight_kg = numShortDirBars * width_m * shortDirBarData.weight_kg_per_m;
    }
    
    const longDirBarData = BAR_DATA[inputs.longDirBarSize];
    if (longDirBarData && longDirSpacing_m > 0) {
        const numLongDirBars = Math.ceil(width_m / longDirSpacing_m);
        detailedReinforcement.push({ barSize: inputs.longDirBarSize, count: numLongDirBars, length: length_m, shapeCode: 'straight', description: 'Long Direction Bars' });
        longDirSteelWeight_kg = numLongDirBars * length_m * longDirBarData.weight_kg_per_m;
    }
    
    const totalSteelWeight_kg = shortDirSteelWeight_kg + longDirSteelWeight_kg;

    return {
        concreteVolume: `${format(concreteVolume_m3)} m³`,
        concreteWeight: `${format(concreteWeight_kg)} kg`,
        formworkArea: `${format(formworkArea_m2)} m²`,
        shortDirSteelWeight: `${format(shortDirSteelWeight_kg)} kg`,
        longDirSteelWeight: `${format(longDirSteelWeight_kg)} kg`,
        totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
        detailedReinforcement,
    };
}

export function calculateIsolatedFooting(inputs: CalculationInputs): CalculationResults {
    const length_m = toSI(inputs.length, inputs.lengthUnit);
    const width_m = toSI(inputs.width, inputs.widthUnit);
    const thickness_m = toSI(inputs.depth, inputs.depthUnit);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const bottomSpacing_m = toSI(inputs.footingBottomBarSpacing, inputs.footingBottomBarSpacingUnit);
    const topSpacing_m = inputs.footingTopBarSize !== 'None' ? toSI(inputs.footingTopBarSpacing, inputs.footingTopBarSpacingUnit) : 0;

    const concreteVolume_m3 = length_m * width_m * thickness_m;
    const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
    const formworkArea_m2 = 2 * (length_m + width_m) * thickness_m;

    const detailedReinforcement: ReinforcementBar[] = [];
    let bottomReinforcementWeight_kg = 0, topReinforcementWeight_kg = 0, dowelWeight_kg = 0;

    const bottomBarData = BAR_DATA[inputs.footingBottomBarSize];
    if (bottomBarData && bottomSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / bottomSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / bottomSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Bottom Bars (Lengthwise)' });
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Bottom Bars (Widthwise)' });
        bottomReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * bottomBarData.weight_kg_per_m;
    }

    const topBarData = BAR_DATA[inputs.footingTopBarSize];
    if (topBarData && topSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / topSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / topSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Top Bars (Lengthwise)' });
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Top Bars (Widthwise)' });
        topReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * topBarData.weight_kg_per_m;
    }

    const dowelBarData = BAR_DATA[inputs.dowelBarSize];
    if (dowelBarData && inputs.dowelBarCount > 0) {
        const dowelLength_m = 1.2; // Simplified assumption: 600mm embed + 600mm starter
        detailedReinforcement.push({ barSize: inputs.dowelBarSize, count: inputs.dowelBarCount, length: dowelLength_m, shapeCode: 'L-bend', description: 'Column Dowels' });
        dowelWeight_kg = inputs.dowelBarCount * dowelLength_m * dowelBarData.weight_kg_per_m;
    }
    
    const totalSteelWeight_kg = bottomReinforcementWeight_kg + topReinforcementWeight_kg + dowelWeight_kg;

    return {
        concreteVolume: `${format(concreteVolume_m3)} m³`,
        concreteWeight: `${format(concreteWeight_kg)} kg`,
        formworkArea: `${format(formworkArea_m2)} m²`,
        bottomReinforcementWeight: `${format(bottomReinforcementWeight_kg)} kg`,
        topReinforcementWeight: `${format(topReinforcementWeight_kg)} kg`,
        dowelWeight: `${format(dowelWeight_kg)} kg`,
        totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
        detailedReinforcement,
    };
}

export function calculateCombinedFooting(inputs: CalculationInputs): CalculationResults {
    const length_m = toSI(inputs.length, inputs.lengthUnit);
    const width_m = toSI(inputs.width, inputs.widthUnit);
    const thickness_m = toSI(inputs.depth, inputs.depthUnit);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const bottomSpacing_m = toSI(inputs.footingBottomBarSpacing, inputs.footingBottomBarSpacingUnit);
    const topSpacing_m = inputs.footingTopBarSize !== 'None' ? toSI(inputs.footingTopBarSpacing, inputs.footingTopBarSpacingUnit) : 0;

    const concreteVolume_m3 = length_m * width_m * thickness_m;
    const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
    const formworkArea_m2 = 2 * (length_m + width_m) * thickness_m;

    const detailedReinforcement: ReinforcementBar[] = [];
    let bottomReinforcementWeight_kg = 0, topReinforcementWeight_kg = 0;

    const bottomBarData = BAR_DATA[inputs.footingBottomBarSize];
    if (bottomBarData && bottomSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / bottomSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / bottomSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Bottom Bars (Longitudinal)'});
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Bottom Bars (Transverse)'});
        bottomReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * bottomBarData.weight_kg_per_m;
    }

    const topBarData = BAR_DATA[inputs.footingTopBarSize];
    if (topBarData && topSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / topSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / topSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Top Bars (Longitudinal)'});
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Top Bars (Transverse)'});
        topReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * topBarData.weight_kg_per_m;
    }
    
    const totalSteelWeight_kg = bottomReinforcementWeight_kg + topReinforcementWeight_kg;

    return {
        concreteVolume: `${format(concreteVolume_m3)} m³`,
        concreteWeight: `${format(concreteWeight_kg)} kg`,
        formworkArea: `${format(formworkArea_m2)} m²`,
        bottomReinforcementWeight: `${format(bottomReinforcementWeight_kg)} kg`,
        topReinforcementWeight: `${format(topReinforcementWeight_kg)} kg`,
        totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
        detailedReinforcement,
    };
}

export function calculateStripFooting(inputs: CalculationInputs): CalculationResults {
  const width_m = toSI(inputs.width, inputs.widthUnit);
  const thickness_m = toSI(inputs.depth, inputs.depthUnit);
  const length_m = toSI(inputs.length, inputs.lengthUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  const mainSpacing_m = toSI(inputs.mainBarSpacing, inputs.mainBarSpacingUnit);
  const tempSpacing_m = toSI(inputs.tempBarSpacing, inputs.tempBarSpacingUnit);

  const concreteVolume_m3 = width_m * thickness_m * length_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = 2 * length_m * thickness_m;

  const detailedReinforcement: ReinforcementBar[] = [];
  let mainSteelWeight_kg = 0, tempSteelWeight_kg = 0;

  const mainBarData = BAR_DATA[inputs.mainBarSize]; // Transverse
  if (mainBarData && mainSpacing_m > 0) {
    const numMainBars = Math.ceil(length_m / mainSpacing_m);
    detailedReinforcement.push({ barSize: inputs.mainBarSize, count: numMainBars, length: width_m, shapeCode: 'straight', description: 'Transverse Bars (Main)'});
    mainSteelWeight_kg = numMainBars * width_m * mainBarData.weight_kg_per_m;
  }
  
  const tempBarData = BAR_DATA[inputs.tempBarSize]; // Longitudinal
  if (tempBarData && tempSpacing_m > 0) {
    const numTempBars = Math.ceil(width_m / tempSpacing_m);
    detailedReinforcement.push({ barSize: inputs.tempBarSize, count: numTempBars, length: length_m, shapeCode: 'straight', description: 'Longitudinal Bars (Distribution)'});
    tempSteelWeight_kg = numTempBars * length_m * tempBarData.weight_kg_per_m;
  }
  
  const totalSteelWeight_kg = mainSteelWeight_kg + tempSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    mainSteelWeight: `${format(mainSteelWeight_kg)} kg`,
    tempSteelWeight: `${format(tempSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
  };
}

export function calculatePileCapFoundation(inputs: CalculationInputs): CalculationResults {
    const length_m = toSI(inputs.length, inputs.lengthUnit);
    const width_m = toSI(inputs.width, inputs.widthUnit);
    const thickness_m = toSI(inputs.depth, inputs.depthUnit);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const bottomSpacing_m = toSI(inputs.footingBottomBarSpacing, inputs.footingBottomBarSpacingUnit);
    const topSpacing_m = inputs.footingTopBarSize !== 'None' ? toSI(inputs.footingTopBarSpacing, inputs.footingTopBarSpacingUnit) : 0;

    const concreteVolume_m3 = length_m * width_m * thickness_m;
    const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
    const formworkArea_m2 = 2 * (length_m + width_m) * thickness_m;

    const detailedReinforcement: ReinforcementBar[] = [];
    let bottomReinforcementWeight_kg = 0, topReinforcementWeight_kg = 0, dowelWeight_kg = 0;

    const bottomBarData = BAR_DATA[inputs.footingBottomBarSize];
    if (bottomBarData && bottomSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / bottomSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / bottomSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Bottom Bars (Lengthwise)' });
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Bottom Bars (Widthwise)' });
        bottomReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * bottomBarData.weight_kg_per_m;
    }

    const topBarData = BAR_DATA[inputs.footingTopBarSize];
    if (topBarData && topSpacing_m > 0) {
        const numBarsLengthwise = Math.ceil(width_m / topSpacing_m);
        const numBarsWidthwise = Math.ceil(length_m / topSpacing_m);
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsLengthwise, length: length_m, shapeCode: 'straight', description: 'Top Bars (Lengthwise)' });
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count: numBarsWidthwise, length: width_m, shapeCode: 'straight', description: 'Top Bars (Widthwise)' });
        topReinforcementWeight_kg = (numBarsLengthwise * length_m + numBarsWidthwise * width_m) * topBarData.weight_kg_per_m;
    }

    const dowelBarData = BAR_DATA[inputs.dowelBarSize];
    if (dowelBarData && inputs.dowelBarCount > 0) {
        const dowelLength_m = 1.5; // Simplified assumption for pile cap dowels
        detailedReinforcement.push({ barSize: inputs.dowelBarSize, count: inputs.dowelBarCount, length: dowelLength_m, shapeCode: 'L-bend', description: 'Column Dowels' });
        dowelWeight_kg = inputs.dowelBarCount * dowelLength_m * dowelBarData.weight_kg_per_m;
    }
    
    const totalSteelWeight_kg = bottomReinforcementWeight_kg + topReinforcementWeight_kg + dowelWeight_kg;

    return {
        concreteVolume: `${format(concreteVolume_m3)} m³`,
        concreteWeight: `${format(concreteWeight_kg)} kg`,
        formworkArea: `${format(formworkArea_m2)} m²`,
        bottomReinforcementWeight: `${format(bottomReinforcementWeight_kg)} kg`,
        topReinforcementWeight: `${format(topReinforcementWeight_kg)} kg`,
        dowelWeight: `${format(dowelWeight_kg)} kg`,
        totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
        detailedReinforcement,
    };
}

export function calculateRectangularWall(inputs: CalculationInputs): CalculationResults {
  const thickness_m = toSI(inputs.depth, inputs.depthUnit);
  const length_m = toSI(inputs.length, inputs.lengthUnit);
  const height_m = toSI(inputs.height, inputs.heightUnit);
  const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
  const verticalSpacing_m = toSI(inputs.verticalBarSpacing, inputs.verticalBarSpacingUnit);
  const horizontalSpacing_m = toSI(inputs.horizontalBarSpacing, inputs.horizontalBarSpacingUnit);
  const layers = inputs.reinforcementLayers === 'double' ? 2 : 1;

  const concreteVolume_m3 = thickness_m * length_m * height_m;
  const concreteWeight_kg = concreteVolume_m3 * concreteUnitWeight_kg_m3;
  const formworkArea_m2 = 2 * length_m * height_m;

  const detailedReinforcement: ReinforcementBar[] = [];
  let verticalSteelWeight_kg = 0, horizontalSteelWeight_kg = 0;

  const vertBarData = BAR_DATA[inputs.verticalBarSize];
  if (vertBarData && verticalSpacing_m > 0) {
    const numVerticalBars = Math.ceil(length_m / verticalSpacing_m);
    detailedReinforcement.push({ barSize: inputs.verticalBarSize, count: numVerticalBars * layers, length: height_m, shapeCode: 'straight', description: 'Vertical Bars'});
    verticalSteelWeight_kg = numVerticalBars * height_m * vertBarData.weight_kg_per_m * layers;
  }
  
  const horizBarData = BAR_DATA[inputs.horizontalBarSize];
  if (horizBarData && horizontalSpacing_m > 0) {
    const numHorizontalBars = Math.ceil(height_m / horizontalSpacing_m);
    detailedReinforcement.push({ barSize: inputs.horizontalBarSize, count: numHorizontalBars * layers, length: length_m, shapeCode: 'straight', description: 'Horizontal Bars'});
    horizontalSteelWeight_kg = numHorizontalBars * length_m * horizBarData.weight_kg_per_m * layers;
  }
  
  const totalSteelWeight_kg = verticalSteelWeight_kg + horizontalSteelWeight_kg;

  return {
    concreteVolume: `${format(concreteVolume_m3)} m³`,
    concreteWeight: `${format(concreteWeight_kg)} kg`,
    formworkArea: `${format(formworkArea_m2)} m²`,
    verticalSteelWeight: `${format(verticalSteelWeight_kg)} kg`,
    horizontalSteelWeight: `${format(horizontalSteelWeight_kg)} kg`,
    totalSteelWeight: `${format(totalSteelWeight_kg)} kg`,
    detailedReinforcement,
  };
}

export function calculateRetainingWall(inputs: CalculationInputs): CalculationResults {
    const H_stem = toSI(inputs.stemHeight, inputs.stemHeightUnit);
    const t_top = toSI(inputs.stemThicknessTop, inputs.stemThicknessTopUnit);
    const t_bot = toSI(inputs.stemThicknessBottom, inputs.stemThicknessBottomUnit);
    const L_heel = toSI(inputs.heelLength, inputs.heelLengthUnit);
    const L_toe = toSI(inputs.toeLength, inputs.toeLengthUnit);
    const h_footing = toSI(inputs.footingThickness, inputs.footingThicknessUnit);
    const phi_deg = inputs.soilFrictionAngle || 0;
    const phi_rad = (phi_deg * Math.PI) / 180;
    const g = 9.81; 
    const gamma_soil_kNm3 = inputs.soilUnitWeightUnit === 'pcf' ? (inputs.soilUnitWeight || 0) * 0.157087 : (inputs.soilUnitWeight || 0);
    const concreteUnitWeight_kg_m3 = toSI(inputs.concreteUnitWeight, inputs.concreteUnitWeightUnit);
    const gamma_concrete_kNm3 = (concreteUnitWeight_kg_m3 * g) / 1000;
    const q_surcharge_kPa = inputs.surchargeLoadUnit === 'psf' ? (inputs.surchargeLoad || 0) * 0.04788 : (inputs.surchargeLoad || 0);
    const q_allowable_kPa = inputs.soilBearingPressureUnit === 'psf' ? (inputs.soilBearingPressure || 0) * 0.04788 : (inputs.soilBearingPressure || 0);
    const H_total = H_stem + h_footing;
    const Ka = Math.tan((45 - phi_deg / 2) * Math.PI / 180) ** 2;
    const Pa_soil = 0.5 * Ka * gamma_soil_kNm3 * H_total ** 2;
    const Pa_surcharge = Ka * q_surcharge_kPa * H_total;
    const F_sliding = Pa_soil + Pa_surcharge;
    const M_ot_soil = Pa_soil * H_total / 3;
    const M_ot_surcharge = Pa_surcharge * H_total / 2;
    const M_overturning = M_ot_soil + M_ot_surcharge;
    const W_stem_rect = t_top * H_stem * gamma_concrete_kNm3;
    const W_stem_tri = 0.5 * (t_bot - t_top) * H_stem * gamma_concrete_kNm3;
    const W_footing = (L_toe + t_bot + L_heel) * h_footing * gamma_concrete_kNm3;
    const W_soil = L_heel * H_stem * gamma_soil_kNm3;
    const W_surcharge = L_heel * q_surcharge_kPa;
    const R_v = W_stem_rect + W_stem_tri + W_footing + W_soil + W_surcharge;
    const arm_stem_rect = L_toe + (t_bot + t_top) / 2;
    const arm_stem_tri = L_toe + (t_bot - t_top) * 2 / 3;
    const arm_footing = (L_toe + t_bot + L_heel) / 2;
    const arm_soil = L_toe + t_bot + L_heel / 2;
    const M_s_stem = W_stem_rect * arm_stem_rect + W_stem_tri * arm_stem_tri;
    const M_s_footing = W_footing * arm_footing;
    const M_s_soil_surcharge = (W_soil + W_surcharge) * arm_soil;
    const M_stabilizing = M_s_stem + M_s_footing + M_s_soil_surcharge;
    const FoS_OT = M_overturning > 0 ? M_stabilizing / M_overturning : Infinity;
    const F_resisting = R_v * Math.tan(phi_rad);
    const FoS_SL = F_sliding > 0 ? F_resisting / F_sliding : Infinity;
    const B_base = L_toe + t_bot + L_heel;
    const x_bar = (M_stabilizing - M_overturning) / R_v;
    const eccentricity = B_base / 2 - x_bar;
    let q_max_kPa = 0, q_min_kPa = 0;
    if (Math.abs(eccentricity) <= B_base / 6) {
        q_max_kPa = (R_v / B_base) * (1 + (6 * eccentricity) / B_base);
        q_min_kPa = (R_v / B_base) * (1 - (6 * eccentricity) / B_base);
    } else {
        q_max_kPa = (2 * R_v) / (3 * (B_base / 2 - eccentricity));
        q_min_kPa = 0;
    }
    
    // --- Material Quantities & Reinforcement (per 1m length) ---
    const stem_concrete_m3 = (t_top + t_bot) / 2 * H_stem;
    const footing_concrete_m3 = B_base * h_footing;
    const detailedReinforcement: ReinforcementBar[] = [];
    let stem_steel_kg = 0, footing_steel_kg = 0;

    const vertBarData = BAR_DATA[inputs.verticalBarSize];
    const horizBarData = BAR_DATA[inputs.horizontalBarSize];
    const footingTopData = BAR_DATA[inputs.footingTopBarSize];
    const footingBotData = BAR_DATA[inputs.footingBottomBarSize];
    
    if (vertBarData && inputs.verticalBarSpacing) {
        const spacing_m = toSI(inputs.verticalBarSpacing, inputs.verticalBarSpacingUnit);
        const count = Math.ceil(1 / spacing_m);
        const length = H_stem + L_heel - CONCRETE_COVER_M; // L-bend into heel
        detailedReinforcement.push({ barSize: inputs.verticalBarSize, count, length, shapeCode: 'L-bend', description: 'Stem Vertical Bars (per m)'});
        stem_steel_kg += count * length * vertBarData.weight_kg_per_m;
    }
    if(horizBarData && inputs.horizontalBarSpacing) {
        const spacing_m = toSI(inputs.horizontalBarSpacing, inputs.horizontalBarSpacingUnit);
        const count = Math.ceil(H_stem / spacing_m);
        detailedReinforcement.push({ barSize: inputs.horizontalBarSize, count: count * 2, length: 1, shapeCode: 'straight', description: 'Stem Horizontal Bars (per m)'}); // x2 for two faces
        stem_steel_kg += count * 2 * 1 * horizBarData.weight_kg_per_m;
    }
    if (footingTopData && inputs.footingTopBarSpacing) {
        const spacing_m = toSI(inputs.footingTopBarSpacing, inputs.footingTopBarSpacingUnit);
        const count = Math.ceil(1 / spacing_m);
        detailedReinforcement.push({ barSize: inputs.footingTopBarSize, count, length: B_base, shapeCode: 'straight', description: 'Footing Top Bars (per m)'});
        footing_steel_kg += count * B_base * footingTopData.weight_kg_per_m;
    }
    if (footingBotData && inputs.footingBottomBarSpacing) {
        const spacing_m = toSI(inputs.footingBottomBarSpacing, inputs.footingBottomBarSpacingUnit);
        const count = Math.ceil(1 / spacing_m);
        detailedReinforcement.push({ barSize: inputs.footingBottomBarSize, count, length: B_base, shapeCode: 'straight', description: 'Footing Bottom Bars (per m)'});
        footing_steel_kg += count * B_base * footingBotData.weight_kg_per_m;
    }

    return {
        factorOfSafetyOverturning: `${format(FoS_OT)} (${FoS_OT >= 2.0 ? 'PASS' : 'FAIL'})`,
        factorOfSafetySliding: `${format(FoS_SL)} (${FoS_SL >= 1.5 ? 'PASS' : 'FAIL'})`,
        maxBearingPressure: `${format(q_max_kPa)} kPa (${q_max_kPa <= q_allowable_kPa ? 'OK' : 'Exceeded'})`,
        minBearingPressure: `${format(q_min_kPa)} kPa`,
        stemConcreteVolume: `${format(stem_concrete_m3)} m³/m`,
        footingConcreteVolume: `${format(footing_concrete_m3)} m³/m`,
        stemSteelWeight: `${format(stem_steel_kg)} kg/m`,
        footingSteelWeight: `${format(footing_steel_kg)} kg/m`,
        concreteVolume: `${format(stem_concrete_m3 + footing_concrete_m3)} m³/m`,
        totalSteelWeight: `${format(stem_steel_kg + footing_steel_kg)} kg/m`,
        detailedReinforcement,
    };
}


export function calculateDiaphragm(inputs: CalculationInputs): CalculationResults {
  const shrinkageSpacing_m = toSI(inputs.shrinkageBarSpacing, inputs.shrinkageBarSpacingUnit);
  const detailedReinforcement: ReinforcementBar[] = [];

  const collectorBarData = BAR_DATA[inputs.collectorBarSize];
  const collectorSteelWeight_kg_m = collectorBarData ? (inputs.collectorBarCount * collectorBarData.weight_kg_per_m) : 0;
  if(collectorBarData && inputs.collectorBarCount > 0) detailedReinforcement.push({ barSize: inputs.collectorBarSize, count: inputs.collectorBarCount, length: 1, shapeCode: 'straight', description: 'Collector Bar (per m)'});
  
  const chordBarData = BAR_DATA[inputs.chordBarSize];
  const chordSteelWeight_kg_m = chordBarData ? (inputs.chordBarCount * chordBarData.weight_kg_per_m) : 0;
  if(chordBarData && inputs.chordBarCount > 0) detailedReinforcement.push({ barSize: inputs.chordBarSize, count: inputs.chordBarCount, length: 1, shapeCode: 'straight', description: 'Chord Bar (per m)'});
  
  const shrinkageBarData = BAR_DATA[inputs.shrinkageBarSize];
  let shrinkageSteelWeight_kg_m2 = 0;
  if (shrinkageBarData && shrinkageSpacing_m > 0) {
    shrinkageSteelWeight_kg_m2 = shrinkageBarData.weight_kg_per_m * (1 / shrinkageSpacing_m) * 2;
    const countPerM2 = Math.ceil(1 / shrinkageSpacing_m) * 2;
    detailedReinforcement.push({ barSize: inputs.shrinkageBarSize, count: countPerM2, length: 1, shapeCode: 'straight', description: 'Shrinkage Bars (per m²)'});
  }
  
  return {
    collectorSteelWeight: `${format(collectorSteelWeight_kg_m)} kg/m`,
    chordSteelWeight: `${format(chordSteelWeight_kg_m)} kg/m`,
    shrinkageSteelWeight: `${format(shrinkageSteelWeight_kg_m2)} kg/m²`,
    detailedReinforcement,
  };
}

export function calculateBracketCorbel(inputs: CalculationInputs): CalculationResults {
    const fc_MPa = toSI(inputs.concreteStrength, inputs.concreteStrengthUnit);
    const fy_MPa = toSI(inputs.steelYieldStrength, inputs.steelYieldStrengthUnit);
    const vu_kN = toSI(inputs.appliedLoad, inputs.appliedLoadUnit);
    const d_mm = toSI(inputs.effectiveDepth, inputs.effectiveDepthUnit) * 1000;
    const b_mm = toSI(inputs.width, inputs.widthUnit) * 1000;
    const requiredBearingArea_mm2 = (vu_kN * 1000) / (0.85 * fc_MPa);
    const requiredMainSteel_mm2 = (vu_kN * 1000) / (0.75 * fy_MPa);
    const requiredHangerSteel_mm2 = 0.5 * requiredMainSteel_mm2;
    return {
        mainSteelArea: `${format(requiredMainSteel_mm2)} mm²`,
        hangerSteelArea: `${format(requiredHangerSteel_mm2)} mm²`,
        bearingPlateArea: `${format(requiredBearingArea_mm2)} mm²`,
    };
}


export function calculateBeamColumnJoint(inputs: CalculationInputs): CalculationResults {
    const fc_MPa = toSI(inputs.concreteStrength, inputs.concreteStrengthUnit);
    const h_col_mm = toSI(inputs.columnDepth, inputs.columnDepthUnit) * 1000;
    const b_j_mm = toSI(inputs.jointEffectiveWidth, inputs.jointEffectiveWidthUnit) * 1000;
    const gamma = 20;
    const vn_kN = (gamma * Math.sqrt(fc_MPa) * b_j_mm * h_col_mm * 0.75) / 1000;
    const ratio = (inputs.beamDepth && inputs.columnDepth) ? (inputs.beamDepth / inputs.columnDepth) : 0;
    const ratioStatus = ratio > 0 && ratio <= 0.75 ? "OK" : "Check";
    return {
        jointShearStrength: `${format(vn_kN)} kN`,
        beamColumnDepthRatio: `${format(ratio)} (${ratioStatus})`,
    };
}

export function calculateAnchorage(inputs: CalculationInputs): CalculationResults {
  const hef_m = toSI(inputs.embedmentDepth, inputs.embedmentDepthUnit);
  const ca1_m = toSI(inputs.edgeDistance, inputs.edgeDistanceUnit);
  const fc_MPa = toSI(inputs.concreteStrength, inputs.concreteStrengthUnit);
  const factoredTension_kN = toSI(inputs.factoredTension, inputs.factoredTensionUnit);
  const factoredShear_kN = toSI(inputs.factoredShear, inputs.factoredShearUnit);
  
  const anchorData = ANCHOR_DATA[inputs.anchorSize];
  if (!anchorData) return {};

  const phi_steel = 0.75;
  const phi_concrete = 0.65;
  const nsa_kN = (anchorData.area_mm2 * anchorData.fut_MPa * phi_steel) / 1000;
  const k_c = 24;
  const ncb_kN = (k_c * Math.sqrt(fc_MPa) * Math.pow(hef_m * 1000, 1.5) * phi_concrete) / 1000;
  const tensionCapacity_kN = Math.min(nsa_kN, ncb_kN);
  const vsa_kN = (0.6 * anchorData.area_mm2 * anchorData.fut_MPa * phi_steel) / 1000;
  const vcb_kN = (0.42 * Math.sqrt(fc_MPa) * Math.pow(ca1_m * 1000, 1.5) * phi_concrete) / 1000;
  const shearCapacity_kN = Math.min(vsa_kN, vcb_kN);
  let combinedCheckValue = 0;
  if (tensionCapacity_kN > 0 && shearCapacity_kN > 0) {
      combinedCheckValue = (factoredTension_kN / tensionCapacity_kN) + (factoredShear_kN / shearCapacity_kN);
  }

  const tensionStatus = tensionCapacity_kN >= factoredTension_kN ? "OK" : "FAIL";
  const shearStatus = shearCapacity_kN >= factoredShear_kN ? "OK" : "FAIL";
  const combinedStatus = combinedCheckValue <= 1.2 ? "Pass" : "Fail";

  return {
    tensionCapacity: `${format(tensionCapacity_kN)} kN (${tensionStatus})`,
    shearCapacity: `${format(shearCapacity_kN)} kN (${shearStatus})`,
    combinedCheck: `${combinedStatus} (${format(combinedCheckValue, 3)})`,
  };
}
