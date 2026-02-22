import { useRef, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { Vector3, BufferGeometry, Float32BufferAttribute, Line, LineDashedMaterial } from 'three';
import { formatDimension } from '../../core/units';
import type { UnitSystem } from '../../types';

interface MeasureOverlayProps {
  pointA: Vector3 | null;
  pointB: Vector3 | null;
  hoverPoint: Vector3 | null;
  distance: number | null;
  unitSystem: UnitSystem;
}

function MeasureDot({ position, color }: { position: Vector3; color: string }) {
  return (
    <mesh position={position} renderOrder={999}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color={color} depthTest={false} />
    </mesh>
  );
}

function MeasureLine({ from, to }: { from: Vector3; to: Vector3 }) {
  const lineRef = useRef<Line>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array([
      from.x, from.y, from.z,
      to.x, to.y, to.z,
    ]);
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const mat = new LineDashedMaterial({
      color: '#ef4444',
      dashSize: 0.05,
      gapSize: 0.03,
      depthTest: false,
    });

    return { geometry: geo, material: mat };
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  // computeLineDistances is needed for dashed material to work
  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [geometry]);

  return <primitive ref={lineRef} object={new Line(geometry, material)} renderOrder={999} />;
}

export function MeasureOverlay({ pointA, pointB, hoverPoint, distance, unitSystem }: MeasureOverlayProps) {
  // Determine the second endpoint: committed pointB or hover preview
  const endPoint = pointB ?? (pointA && hoverPoint ? hoverPoint : null);

  return (
    <>
      {/* Point A */}
      {pointA && <MeasureDot position={pointA} color="#ef4444" />}

      {/* Point B (committed) */}
      {pointB && <MeasureDot position={pointB} color="#ef4444" />}

      {/* Hover snap preview (only before point B is committed) */}
      {!pointB && hoverPoint && <MeasureDot position={hoverPoint} color="#f59e0b" />}

      {/* Line from A to endpoint */}
      {pointA && endPoint && <MeasureLine from={pointA} to={endPoint} />}

      {/* Distance label at midpoint */}
      {pointA && pointB && distance !== null && (
        <Html
          position={[
            (pointA.x + pointB.x) / 2,
            (pointA.y + pointB.y) / 2,
            (pointA.z + pointB.z) / 2,
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
            {formatDimension(distance, unitSystem)}
          </div>
        </Html>
      )}
    </>
  );
}
