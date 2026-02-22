import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadFile, Box, UnitType } from '../file.js';

const METERS_TO_FEET = 3.28084;
const METERS_TO_INCHES = 39.3701;

function metersToInches(m: number): number {
  return m * METERS_TO_INCHES;
}

function metersToLinearFeet(m: number): number {
  return m * METERS_TO_FEET;
}

function squareMetersToFeet(sqm: number): number {
  return sqm * Math.pow(METERS_TO_FEET, 2);
}

function cubicMetersToFeet(m3: number): number {
  return m3 * Math.pow(METERS_TO_FEET, 3);
}

function calculateBoardFeet(w: number, h: number, d: number): number {
  const dims = [w, h, d].sort((a, b) => a - b);
  const thicknessInches = metersToInches(dims[0]);
  const widthInches = metersToInches(dims[1]);
  const lengthFeet = metersToLinearFeet(dims[2]);
  return (thicknessInches * widthInches * lengthFeet) / 12;
}

const MATERIALS: Record<string, { name: string; unitType: UnitType }> = {
  '2x4-lumber':   { name: '2×4 Lumber',   unitType: 'board_feet' },
  '2x6-lumber':   { name: '2×6 Lumber',   unitType: 'board_feet' },
  '4x4-post':     { name: '4×4 Post',     unitType: 'board_feet' },
  'plywood-3-4':  { name: 'Plywood 3/4"', unitType: 'square_feet' },
  'plywood-1-2':  { name: 'Plywood 1/2"', unitType: 'square_feet' },
  'cedar-boards': { name: 'Cedar Boards', unitType: 'square_feet' },
  'concrete':     { name: 'Concrete',     unitType: 'cubic_feet' },
  'insulation':   { name: 'Insulation',   unitType: 'square_feet' },
  'trim':         { name: 'Trim',         unitType: 'linear_feet' },
  'heater':       { name: 'Sauna Heater', unitType: 'count' },
};

const UNIT_LABELS: Record<UnitType, string> = {
  board_feet:  'bd ft',
  square_feet: 'sq ft',
  cubic_feet:  'cu ft',
  linear_feet: 'lin ft',
  count:       'ea',
};

function calculateQuantity(box: Box, unitType: UnitType): number {
  const { width, height, depth } = box.dimensions;

  switch (unitType) {
    case 'board_feet':
      return calculateBoardFeet(width, height, depth);

    case 'square_feet': {
      const faces = [width * height, width * depth, height * depth];
      return squareMetersToFeet(Math.max(...faces));
    }

    case 'cubic_feet':
      return cubicMetersToFeet(width * height * depth);

    case 'linear_feet':
      return metersToLinearFeet(Math.max(width, height, depth));

    case 'count':
      return 1;
  }
}

export function registerBomTools(server: McpServer, filePath: string): void {
  server.tool(
    'get_bom',
    'Calculate and return the bill of materials for the project',
    {},
    async () => {
      const data = loadFile(filePath);
      const bomMap = new Map<string, { materialName: string; quantity: number; unit: string }>();

      for (const box of data.project.boxes) {
        const material = MATERIALS[box.materialId];
        if (!material) continue;

        const quantity = calculateQuantity(box, material.unitType);
        const existing = bomMap.get(box.materialId);

        if (existing) {
          existing.quantity += quantity;
        } else {
          bomMap.set(box.materialId, {
            materialName: material.name,
            quantity,
            unit: UNIT_LABELS[material.unitType],
          });
        }
      }

      const bom = Array.from(bomMap.values())
        .map((entry) => ({ ...entry, quantity: Math.round(entry.quantity * 100) / 100 }))
        .sort((a, b) => a.materialName.localeCompare(b.materialName));

      return { content: [{ type: 'text', text: JSON.stringify(bom, null, 2) }] };
    },
  );
}
