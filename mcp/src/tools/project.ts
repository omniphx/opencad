import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { loadFile, saveFile } from '../file.js';

export function registerProjectTools(server: McpServer, filePath: string): void {
  server.tool(
    'get_project',
    'Get project metadata (name, unit system, box count, id)',
    {},
    async () => {
      const data = loadFile(filePath);
      const { id, name, unitSystem, boxes } = data.project;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ id, name, unitSystem, boxCount: boxes.length }, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'set_project_name',
    'Update the project name',
    { name: z.string().min(1).describe('New project name') },
    async ({ name }) => {
      const data = loadFile(filePath);
      data.project.name = name;
      saveFile(filePath, data);
      return {
        content: [{ type: 'text', text: `Project name updated to "${name}"` }],
      };
    },
  );
}
