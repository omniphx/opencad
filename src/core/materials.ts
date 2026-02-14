import { Material } from '../types';

// Helper: inches to meters
const IN = 0.0254;
// Helper: feet to meters
const FT = 0.3048;

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: '2x4-lumber',
    name: '2×4 Lumber',
    unitType: 'board_feet',
    color: '#E8C9A0',
    defaultDimensions: { width: 1.5 * IN, height: 3.5 * IN, depth: 8 * FT },
  },
  {
    id: '2x6-lumber',
    name: '2×6 Lumber',
    unitType: 'board_feet',
    color: '#DEBB9B',
    defaultDimensions: { width: 1.5 * IN, height: 5.5 * IN, depth: 8 * FT },
  },
  {
    id: '4x4-post',
    name: '4×4 Post',
    unitType: 'board_feet',
    color: '#D4AD8C',
    defaultDimensions: { width: 3.5 * IN, height: 3.5 * IN, depth: 8 * FT },
  },
  {
    id: 'plywood-3-4',
    name: 'Plywood 3/4"',
    unitType: 'square_feet',
    color: '#C9A96E',
    defaultDimensions: { width: 4 * FT, height: 0.75 * IN, depth: 8 * FT },
  },
  {
    id: 'plywood-1-2',
    name: 'Plywood 1/2"',
    unitType: 'square_feet',
    color: '#D4B07A',
    defaultDimensions: { width: 4 * FT, height: 0.5 * IN, depth: 8 * FT },
  },
  {
    id: 'cedar-boards',
    name: 'Cedar Boards',
    unitType: 'square_feet',
    color: '#E0B88A',
    defaultDimensions: { width: 0.75 * IN, height: 5.5 * IN, depth: 8 * FT },
  },
  {
    id: 'concrete',
    name: 'Concrete',
    unitType: 'cubic_feet',
    color: '#C8C8C8',
    defaultDimensions: { width: 1 * FT, height: 1 * FT, depth: 1 * FT },
  },
  {
    id: 'insulation',
    name: 'Insulation',
    unitType: 'square_feet',
    color: '#F5E6C8',
    defaultDimensions: { width: 3.5 * IN, height: 15 * IN, depth: 93 * IN },
  },
  {
    id: 'trim',
    name: 'Trim',
    unitType: 'linear_feet',
    color: '#EDDCC8',
    defaultDimensions: { width: 0.75 * IN, height: 2.5 * IN, depth: 8 * FT },
  },
  {
    id: 'heater',
    name: 'Sauna Heater',
    unitType: 'count',
    color: '#7A7A7A',
    defaultDimensions: { width: 20 * IN, height: 20 * IN, depth: 20 * IN },
  },
];

export function getMaterialById(id: string): Material | undefined {
  return DEFAULT_MATERIALS.find(m => m.id === id);
}

export function getMaterialColor(materialId: string): string {
  const material = getMaterialById(materialId);
  return material?.color ?? '#888888';
}
