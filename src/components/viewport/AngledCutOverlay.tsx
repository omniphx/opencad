import { useRef, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { Vector3, BufferGeometry, Float32BufferAttribute, Line, LineDashedMaterial } from 'three';
import { formatDimension } from '../../core/units';
import type { UnitSystem } from '../../types';

interface AngledCutOverlayProps {
  pointA: Vector3 | null;
  hoverPoint: Vector3 | null;
  unitSystem: UnitSystem;
  previewLength: number | null;
  previewAngle: number | null;
}

function OverlayDot({ position, color }: { position: Vector3; color: string }) {
  return (
    <mesh position={position} renderOrder={999}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color={color} depthTest={false} />
    </mesh>
  );
}

function OverlayLine({ from, to }: { from: Vector3; to: Vector3 }) {
  const lineRef = useRef<Line>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array([
      from.x, from.y, from.z,
      to.x, to.y, to.z,
    ]);
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new LineDashedMaterial({
      color: '#22c55e',
      dashSize: 0.05,
      gapSize: 0.03,
      depthTest: false,
    });

    return { geometry: geo, material: mat };
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [geometry]);

  return <primitive ref={lineRef} object={new Line(geometry, material)} renderOrder={999} />;
}

export function AngledCutOverlay({ pointA, hoverPoint, unitSystem, previewLength, previewAngle }: AngledCutOverlayProps) {
  const endPoint = pointA && hoverPoint ? hoverPoint : null;

  return (
    <>
      {pointA && <OverlayDot position={pointA} color="#22c55e" />}

      {hoverPoint && <OverlayDot position={hoverPoint} color="#f59e0b" />}

      {pointA && endPoint && <OverlayLine from={pointA} to={endPoint} />}

      {pointA && endPoint && previewLength !== null && previewAngle !== null && (
        <Html
          position={[
            (pointA.x + endPoint.x) / 2,
            (pointA.y + endPoint.y) / 2,
            (pointA.z + endPoint.z) / 2,
          ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>
            {formatDimension(previewLength, unitSystem)}
            {previewAngle > 0.1 ? ` @ ${previewAngle.toFixed(1)}°` : ''}
          </div>
        </Html>
      )}
    </>
  );
}
