import { Material } from '../types';

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: '2x4-lumber',
    name: '2×4 Lumber',
    unitType: 'board_feet',
    color: '#E8C9A0',
  },
  {
    id: '2x6-lumber',
    name: '2×6 Lumber',
    unitType: 'board_feet',
    color: '#DEBB9B',
  },
  {
    id: '4x4-post',
    name: '4×4 Post',
    unitType: 'board_feet',
    color: '#D4AD8C',
  },
  {
    id: 'plywood-3-4',
    name: 'Plywood 3/4"',
    unitType: 'square_feet',
    color: '#F0E4D0',
  },
  {
    id: 'plywood-1-2',
    name: 'Plywood 1/2"',
    unitType: 'square_feet',
    color: '#F5EDE0',
  },
  {
    id: 'cedar-boards',
    name: 'Cedar Boards',
    unitType: 'square_feet',
    color: '#E0B88A',
  },
  {
    id: 'concrete',
    name: 'Concrete',
    unitType: 'cubic_feet',
    color: '#C8C8C8',
  },
  {
    id: 'insulation',
    name: 'Insulation',
    unitType: 'square_feet',
    color: '#F5E6C8',
  },
  {
    id: 'trim',
    name: 'Trim',
    unitType: 'linear_feet',
    color: '#EDDCC8',
  },
  {
    id: 'heater',
    name: 'Sauna Heater',
    unitType: 'count',
    color: '#7A7A7A',
  },
];

export function getMaterialById(id: string): Material | undefined {
  return DEFAULT_MATERIALS.find(m => m.id === id);
}

export function getMaterialColor(materialId: string): string {
  const material = getMaterialById(materialId);
  return material?.color ?? '#888888';
}
