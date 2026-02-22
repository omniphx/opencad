import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const MATERIALS = [
  { id: '2x4-lumber',   name: '2×4 Lumber',    unitType: 'board_feet',   color: '#E8C9A0' },
  { id: '2x6-lumber',   name: '2×6 Lumber',    unitType: 'board_feet',   color: '#DEBB9B' },
  { id: '4x4-post',     name: '4×4 Post',       unitType: 'board_feet',   color: '#D4AD8C' },
  { id: 'plywood-3-4',  name: 'Plywood 3/4"',   unitType: 'square_feet',  color: '#C9A96E' },
  { id: 'plywood-1-2',  name: 'Plywood 1/2"',   unitType: 'square_feet',  color: '#D4B07A' },
  { id: 'cedar-boards', name: 'Cedar Boards',   unitType: 'square_feet',  color: '#E0B88A' },
  { id: 'concrete',     name: 'Concrete',       unitType: 'cubic_feet',   color: '#C8C8C8' },
  { id: 'insulation',   name: 'Insulation',     unitType: 'square_feet',  color: '#F5E6C8' },
  { id: 'trim',         name: 'Trim',           unitType: 'linear_feet',  color: '#EDDCC8' },
  { id: 'heater',       name: 'Sauna Heater',   unitType: 'count',        color: '#7A7A7A' },
];

export function registerMaterialsTools(server: McpServer): void {
  server.tool(
    'list_materials',
    'List all available materials with their id, name, unitType, and color',
    {},
    async () => {
      return {
        content: [{ type: 'text', text: JSON.stringify(MATERIALS, null, 2) }],
      };
    },
  );
}
