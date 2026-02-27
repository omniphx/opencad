import { v4 as uuid } from 'uuid';
import { Box, BoxCut } from '../types';
import { cornerFromVisualCenter } from './rotation';

const MIN_LENGTH_METERS = 2 * 0.0254; // 2 inches

export interface AngledCutResult {
  box: Box;
  pitchDegrees: number;
  lengthMeters: number;
}

/**
 * Creates a board spanning between two 3D points with correct rotation
 * and miter cuts on both ends for flush contact with vertical surfaces.
 *
 * Returns null if the two points are too close together.
 */
export function createAngledCutBoard(
  pointA: { x: number; y: number; z: number },
  pointB: { x: number; y: number; z: number },
  materialId: string,
  crossSection: { width: number; height: number },
): AngledCutResult | null {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const dz = pointB.z - pointA.z;

  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (length < MIN_LENGTH_METERS) return null;

  // Yaw: rotation around Y to swing the board's Z axis toward the target in the XZ plane
  const yaw = Math.atan2(dx, dz);

  // Pitch: rotation around X to tilt the board up/down
  // Negative because positive X rotation tilts Z+ end downward,
  // but positive dy means the board goes upward from A to B
  const horizontalDist = Math.sqrt(dx * dx + dz * dz);
  const pitch = -Math.atan2(dy, horizontalDist);

  // Pitch angle in degrees for miter cuts (clamped to cut system max of 89°)
  const pitchDeg = Math.min(Math.abs(pitch * 180 / Math.PI), 89);

  const dimensions = {
    width: crossSection.width,
    height: crossSection.height,
    depth: length,
  };

  const rotation = { x: pitch, y: yaw, z: 0 };

  // Position: midpoint of A-B is the visual center, back-compute to corner
  const midpoint = {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
    z: (pointA.z + pointB.z) / 2,
  };
  const position = cornerFromVisualCenter(midpoint, dimensions, rotation);

  // Miter cuts on front (Z+) and back (Z-) faces so ends are flush with
  // vertical surfaces. The FACE_CONFIG in cuts.ts gives front rotationSign=-1
  // and back rotationSign=+1, producing opposing wedges that become vertical
  // after the board is pitched.
  const cuts: BoxCut[] = pitchDeg > 0.1
    ? [
        { id: uuid(), face: 'front', angle: pitchDeg },
        { id: uuid(), face: 'back', angle: pitchDeg },
      ]
    : [];

  return {
    box: {
      id: uuid(),
      position,
      dimensions,
      rotation,
      materialId,
      label: 'Angled Brace',
      cuts,
    },
    pitchDegrees: pitchDeg,
    lengthMeters: length,
  };
}
