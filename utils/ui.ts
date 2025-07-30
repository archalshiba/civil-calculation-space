
import React from 'react';
import {
  RectangularColumnSVG,
  CircularColumnSVG,
  RectangularBeamSVG,
  TBeamSVG,
  OneWaySlabSVG,
  TwoWaySlabSVG,
  IsolatedFootingSVG,
  CombinedFootingSVG,
  StripFootingSVG,
  PileCapSVG,
  RectangularWallSVG,
  RetainingWallSVG,
  DiaphragmSVG,
  BracketCorbelSVG,
  BeamColumnJointSVG,
  AnchorageSVG
} from '../components/icons/SVGSchematics';

/**
 * Converts a camelCase or snake_case string into a human-readable title.
 * e.g., "longitudinalBarCount" -> "Longitudinal Bar Count"
 * @param key The string to format.
 * @returns A formatted, title-cased string.
 */
export const formatInputKey = (key: string): string => {
  if (!key) return '';
  const withSpaces = key.replace(/([A-Z])/g, ' $1');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

/**
 * A map connecting the calculator title string to its corresponding SVG schematic component.
 */
const schematicMap: { [key: string]: React.ComponentType<any> } = {
    'Rectangular/Square Column': RectangularColumnSVG,
    'Circular Column': CircularColumnSVG,
    'Rectangular Beam': RectangularBeamSVG,
    'T-Beam': TBeamSVG,
    'One-Way Slab': OneWaySlabSVG,
    'Two-Way Slab': TwoWaySlabSVG,
    'Isolated Footing': IsolatedFootingSVG,
    'Combined Footing': CombinedFootingSVG,
    'Strip Footing': StripFootingSVG,
    'Pile Cap Foundation': PileCapSVG,
    'Rectangular Wall': RectangularWallSVG,
    'Retaining Wall': RetainingWallSVG,
    'Floor & Roof Diaphragms': DiaphragmSVG,
    'Bracket & Corbel Design': BracketCorbelSVG,
    'Beam-Column Joint': BeamColumnJointSVG,
    'Anchorage to Concrete': AnchorageSVG,
};

/**
 * Retrieves the appropriate SVG schematic component for a given calculation type.
 * @param type The title of the calculator (e.g., "Rectangular/Square Column").
 * @returns The corresponding SVG component or null if no match is found.
 */
export const getSchematicForType = (type: string): React.ComponentType<any> | null => {
    return schematicMap[type] || null;
};

/**
 * Groups a detailed calculation type string into a broader category for reporting.
 * @param type The title of the calculator.
 * @returns A category string (e.g., "Columns", "Beams").
 */
export const getCategoryForType = (type: string): string => {
    if (type.includes('Column')) return 'Columns';
    if (type.includes('Beam') || type.includes('T-Beam')) return 'Beams';
    if (type.includes('Slab')) return 'Slabs';
    if (type.includes('Footing') || type.includes('Foundation')) return 'Foundations';
    if (type.includes('Wall')) return 'Walls';
    if (type.includes('Diaphragm')) return 'Diaphragms';
    if (type.includes('Bracket') || type.includes('Corbel')) return 'Brackets & Corbels';
    if (type.includes('Joint') || type.includes('Anchorage')) return 'Joints & Connections';
    return 'Other';
};
