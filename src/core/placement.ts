import { v4 as uuid } from 'uuid';
import { Box, ComponentTemplate } from '../types';

/**
 * Places a component's boxes into the project by generating new UUIDs
 * and finding a non-overlapping position along the X axis.
 */
export function placeComponentBoxes(
  template: ComponentTemplate,
  existingBoxes: Box[]
): Box[] {
  if (template.boxes.length === 0) return [];

  // Calculate bounding box of the template
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  for (const box of template.boxes) {
    const hw = box.dimensions.width / 2;
    const hd = box.dimensions.depth / 2;
    minX = Math.min(minX, box.position.x - hw);
    maxX = Math.max(maxX, box.position.x + hw);
    minZ = Math.min(minZ, box.position.z - hd);
    maxZ = Math.max(maxZ, box.position.z + hd);
  }

  const templateWidth = maxX - minX;
  const templateDepth = maxZ - minZ;
  const spacing = 0.25;

  // Find non-overlapping X position by scanning along X axis
  let offsetX = 0;
  const centerZ = 0;

  const isOverlapping = (ox: number) => {
    // Check if placing the template bounding box at ox would overlap any existing box
    const tMinX = ox;
    const tMaxX = ox + templateWidth;
    const tMinZ = centerZ - templateDepth / 2;
    const tMaxZ = centerZ + templateDepth / 2;

    for (const b of existingBoxes) {
      const bMinX = b.position.x - b.dimensions.width / 2;
      const bMaxX = b.position.x + b.dimensions.width / 2;
      const bMinZ = b.position.z - b.dimensions.depth / 2;
      const bMaxZ = b.position.z + b.dimensions.depth / 2;

      if (
        tMinX < bMaxX + spacing &&
        tMaxX > bMinX - spacing &&
        tMinZ < bMaxZ + spacing &&
        tMaxZ > bMinZ - spacing
      ) {
        return true;
      }
    }
    return false;
  };

  while (isOverlapping(offsetX)) {
    offsetX += templateWidth + spacing;
  }

  // Generate new boxes with new IDs and offset positions
  // Shift so template's minX aligns to offsetX, and center on Z
  const shiftX = offsetX - minX;
  const shiftZ = centerZ - (minZ + maxZ) / 2;

  return template.boxes.map((box) => ({
    ...box,
    id: uuid(),
    position: {
      x: box.position.x + shiftX,
      y: box.position.y,
      z: box.position.z + shiftZ,
    },
  }));
}
