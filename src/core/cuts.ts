import { BoxCut, CutFace } from '../types';

interface CutterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface CutPlaneVizProps {
  groupPosition: [number, number, number];
  groupRotation: [number, number, number];
  meshPosition: [number, number, number];
  meshRotation: [number, number, number];
  planeArgs: [number, number];
}

/**
 * Face configuration: for each face, defines the normal axis, the pivot axis
 * the cut rotates around, and the direction the cutter is offset.
 *
 * The cutter is a box that gets positioned at the face, then rotated by the
 * cut angle around the pivot axis. When subtracted via CSG, this produces
 * the desired wedge cut.
 *
 * Coordinate system: box centered at origin with dimensions (w, h, d).
 * - top/bottom: normal along Y, pivot around X (cuts across width)
 * - front/back: normal along Z, pivot around X (cuts across width)
 * - left/right: normal along X, pivot around Z (cuts across depth)
 */
interface FaceConfig {
  // Which axis is the face normal
  normalAxis: 'x' | 'y' | 'z';
  // Direction along the normal axis (+1 or -1) toward the face
  normalDir: 1 | -1;
  // Which axis the cut pivots around
  pivotAxis: 'x' | 'y' | 'z';
  // Sign for the rotation angle
  rotationSign: 1 | -1;
}

const FACE_CONFIG: Record<CutFace, FaceConfig> = {
  top:    { normalAxis: 'y', normalDir:  1, pivotAxis: 'x', rotationSign:  1 },
  bottom: { normalAxis: 'y', normalDir: -1, pivotAxis: 'x', rotationSign: -1 },
  front:  { normalAxis: 'z', normalDir:  1, pivotAxis: 'x', rotationSign: -1 },
  back:   { normalAxis: 'z', normalDir: -1, pivotAxis: 'x', rotationSign:  1 },
  right:  { normalAxis: 'x', normalDir:  1, pivotAxis: 'z', rotationSign: -1 },
  left:   { normalAxis: 'x', normalDir: -1, pivotAxis: 'z', rotationSign:  1 },
};

/**
 * Given a box's dimensions and a cut definition, returns the position,
 * rotation, and scale for a cutter box that, when subtracted via CSG,
 * produces the correct angled cut.
 *
 * The cutter is an oversized box positioned at the cut face, rotated by the
 * cut angle around the appropriate edge axis. All coordinates are relative
 * to the box center (how CSG geometry is centered).
 */
export function buildCutterProps(
  dimensions: { width: number; height: number; depth: number },
  cut: BoxCut,
): CutterProps {
  const { width: w, height: h, depth: d } = dimensions;
  const config = FACE_CONFIG[cut.face];
  const angleRad = (cut.angle * Math.PI) / 180;

  // Half-dimensions along each axis
  const halfDim: Record<string, number> = { x: w / 2, y: h / 2, z: d / 2 };

  // The cutter box size — oversized so it fully covers the cut region
  const cutterSize = Math.max(w, h, d) * 3;

  // Position: start at the face center, then offset half the cutter size outward
  const pos: [number, number, number] = [0, 0, 0];
  const axisIndex = { x: 0, y: 1, z: 2 }[config.normalAxis];
  pos[axisIndex] = config.normalDir * (halfDim[config.normalAxis] + cutterSize / 2);

  // For partial-depth cuts, pull the cutter inward by (fullDim - depth)
  if (cut.depth !== undefined) {
    const fullDim = dimensions[
      config.normalAxis === 'x' ? 'width' : config.normalAxis === 'y' ? 'height' : 'depth'
    ];
    const inset = fullDim - cut.depth;
    pos[axisIndex] -= config.normalDir * inset;
  }

  // Rotation: rotate around the pivot axis by the cut angle
  const rot: [number, number, number] = [0, 0, 0];
  const pivotIndex = { x: 0, y: 1, z: 2 }[config.pivotAxis];
  rot[pivotIndex] = config.rotationSign * angleRad;

  return {
    position: pos,
    rotation: rot,
    scale: [cutterSize, cutterSize, cutterSize],
  };
}

/**
 * Returns props for rendering a semi-transparent visualization plane
 * that shows where and at what angle a cut occurs on a box.
 *
 * The plane is positioned at the hinge edge of the cut face and tilted
 * by the cut angle, so it visually represents the exposed cut surface.
 *
 * All coordinates are relative to the box center.
 */
export function buildCutPlaneVizProps(
  dimensions: { width: number; height: number; depth: number },
  cut: BoxCut,
): CutPlaneVizProps {
  const { width: w, height: h, depth: d } = dimensions;
  const angleRad = (cut.angle * Math.PI) / 180;

  // Each face config defines:
  //   hinge: the edge where the cut plane pivots (one edge of the face)
  //   offset: position of plane center relative to hinge (in group-local coords)
  //   meshRot: rotation to orient the PlaneGeometry (XY default) to lie on the face
  //   groupRot: rotation applied to the group to tilt the plane by the cut angle
  //   size: [width, height] of the plane geometry
  let hinge: [number, number, number];
  let offset: [number, number, number];
  let meshRot: [number, number, number];
  let groupRot: [number, number, number];
  let size: [number, number];

  switch (cut.face) {
    case 'top':
      hinge = [0, h / 2, -d / 2];
      offset = [0, 0, d / 2];
      meshRot = [-Math.PI / 2, 0, 0];
      groupRot = [angleRad, 0, 0];
      size = [w, d];
      break;
    case 'bottom':
      hinge = [0, -h / 2, -d / 2];
      offset = [0, 0, d / 2];
      meshRot = [-Math.PI / 2, 0, 0];
      groupRot = [-angleRad, 0, 0];
      size = [w, d];
      break;
    case 'front':
      hinge = [0, h / 2, d / 2];
      offset = [0, -h / 2, 0];
      meshRot = [0, 0, 0];
      groupRot = [-angleRad, 0, 0];
      size = [w, h];
      break;
    case 'back':
      hinge = [0, h / 2, -d / 2];
      offset = [0, -h / 2, 0];
      meshRot = [0, 0, 0];
      groupRot = [angleRad, 0, 0];
      size = [w, h];
      break;
    case 'right':
      hinge = [w / 2, h / 2, 0];
      offset = [0, -h / 2, 0];
      meshRot = [0, Math.PI / 2, 0];
      groupRot = [0, 0, -angleRad];
      size = [d, h];
      break;
    case 'left':
      hinge = [-w / 2, h / 2, 0];
      offset = [0, -h / 2, 0];
      meshRot = [0, Math.PI / 2, 0];
      groupRot = [0, 0, angleRad];
      size = [d, h];
      break;
  }

  return {
    groupPosition: hinge,
    groupRotation: groupRot,
    meshPosition: offset,
    meshRotation: meshRot,
    planeArgs: size,
  };
}
