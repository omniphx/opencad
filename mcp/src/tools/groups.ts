import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { loadFile, saveFile } from '../file.js';

export function registerGroupsTools(server: McpServer, filePath: string): void {
  server.tool(
    'group_boxes',
    'Assign a shared groupId to a list of boxes',
    {
      boxIds: z.array(z.string()).min(2).describe('List of box UUIDs to group together'),
    },
    async ({ boxIds }) => {
      const data = loadFile(filePath);
      const groupId = uuidv4();

      for (const id of boxIds) {
        const box = data.project.boxes.find((b) => b.id === id);
        if (box) box.groupId = groupId;
      }

      saveFile(filePath, data);

      return { content: [{ type: 'text', text: `Grouped ${boxIds.length} boxes with groupId "${groupId}"` }] };
    },
  );

  server.tool(
    'ungroup_boxes',
    'Remove groupId from a list of boxes',
    {
      boxIds: z.array(z.string()).min(1).describe('List of box UUIDs to ungroup'),
    },
    async ({ boxIds }) => {
      const data = loadFile(filePath);

      for (const id of boxIds) {
        const box = data.project.boxes.find((b) => b.id === id);
        if (box) delete box.groupId;
      }

      saveFile(filePath, data);

      return { content: [{ type: 'text', text: `Removed groupId from ${boxIds.length} boxes` }] };
    },
  );

  server.tool(
    'set_box_locked',
    'Lock or unlock a box',
    {
      id: z.string().describe('Box UUID'),
      locked: z.boolean().describe('true to lock, false to unlock'),
    },
    async ({ id, locked }) => {
      const data = loadFile(filePath);
      const box = data.project.boxes.find((b) => b.id === id);

      if (!box) {
        return { content: [{ type: 'text', text: `Box "${id}" not found` }], isError: true };
      }

      box.locked = locked;
      saveFile(filePath, data);

      return { content: [{ type: 'text', text: `Box "${id}" locked=${locked}` }] };
    },
  );

  server.tool(
    'set_box_hidden',
    'Show or hide a box',
    {
      id: z.string().describe('Box UUID'),
      hidden: z.boolean().describe('true to hide, false to show'),
    },
    async ({ id, hidden }) => {
      const data = loadFile(filePath);
      const box = data.project.boxes.find((b) => b.id === id);

      if (!box) {
        return { content: [{ type: 'text', text: `Box "${id}" not found` }], isError: true };
      }

      box.hidden = hidden;
      saveFile(filePath, data);

      return { content: [{ type: 'text', text: `Box "${id}" hidden=${hidden}` }] };
    },
  );
}
