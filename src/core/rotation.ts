export interface Rotation3 {
  x: number;
  y: number;
  z: number;
}

export const ZERO_ROTATION: Rotation3 = { x: 0, y: 0, z: 0 };

/** Converts legacy single-number rotation (Y-axis) to 3D rotation object */
export function migrateRotation(r: number | Rotation3): Rotation3 {
  if (typeof r === 'number') {
    return { x: 0, y: r, z: 0 };
  }
  return r;
}

/** Rotates a point around a center on a given axis by an angle (radians) */
export function rotatePositionAroundAxis(
  pos: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  axis: 'x' | 'y' | 'z',
  angle: number,
): { x: number; y: number; z: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  if (axis === 'y') {
    // Rotate around Y axis (XZ plane)
    const dx = pos.x - center.x;
    const dz = pos.z - center.z;
    return {
      x: center.x + dx * cos - dz * sin,
      y: pos.y,
      z: center.z + dx * sin + dz * cos,
    };
  } else if (axis === 'x') {
    // Rotate around X axis (YZ plane)
    const dy = pos.y - center.y;
    const dz = pos.z - center.z;
    return {
      x: pos.x,
      y: center.y + dy * cos - dz * sin,
      z: center.z + dy * sin + dz * cos,
    };
  } else {
    // Rotate around Z axis (XY plane)
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    return {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos,
      z: pos.z,
    };
  }
}

/** Adds an angle to one Euler component */
export function addRotationOnAxis(
  rotation: Rotation3,
  axis: 'x' | 'y' | 'z',
  angle: number,
): Rotation3 {
  return { ...rotation, [axis]: rotation[axis] + angle };
}

/**
 * Applies an Euler rotation (XYZ order) to a vector.
 * Returns the rotated vector as {x, y, z}.
 */
export function applyEulerToVec(
  v: { x: number; y: number; z: number },
  rot: Rotation3,
): { x: number; y: number; z: number } {
  // Apply rotations in XYZ order (matching Three.js default Euler order)
  let { x, y, z } = v;

  // Rotate around X
  if (rot.x !== 0) {
    const cos = Math.cos(rot.x), sin = Math.sin(rot.x);
    const ny = y * cos - z * sin;
    const nz = y * sin + z * cos;
    y = ny; z = nz;
  }

  // Rotate around Y
  if (rot.y !== 0) {
    const cos = Math.cos(rot.y), sin = Math.sin(rot.y);
    const nx = x * cos + z * sin;
    const nz = -x * sin + z * cos;
    x = nx; z = nz;
  }

  // Rotate around Z
  if (rot.z !== 0) {
    const cos = Math.cos(rot.z), sin = Math.sin(rot.z);
    const nx = x * cos - y * sin;
    const ny = x * sin + y * cos;
    x = nx; y = ny;
  }

  return { x, y, z };
}

/**
 * Computes the visual center of a box given its corner position, dimensions, and rotation.
 * The visual center = corner + applyEuler(halfDims, rotation)
 */
export function boxVisualCenter(
  position: { x: number; y: number; z: number },
  dimensions: { width: number; height: number; depth: number },
  rotation: Rotation3,
): { x: number; y: number; z: number } {
  const halfDims = {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    z: dimensions.depth / 2,
  };
  const rotated = applyEulerToVec(halfDims, rotation);
  return {
    x: position.x + rotated.x,
    y: position.y + rotated.y,
    z: position.z + rotated.z,
  };
}

/**
 * Back-computes the corner position from a visual center, dimensions, and rotation.
 * corner = visualCenter - applyEuler(halfDims, rotation)
 */
export function cornerFromVisualCenter(
  visualCenter: { x: number; y: number; z: number },
  dimensions: { width: number; height: number; depth: number },
  rotation: Rotation3,
): { x: number; y: number; z: number } {
  const halfDims = {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    z: dimensions.depth / 2,
  };
  const rotated = applyEulerToVec(halfDims, rotation);
  return {
    x: visualCenter.x - rotated.x,
    y: visualCenter.y - rotated.y,
    z: visualCenter.z - rotated.z,
  };
}
