import { useRef, useState, useMemo } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { Mesh, Vector3, BoxGeometry } from 'three';
import { Box } from '../../types';
import { getMaterialColor } from '../../core/materials';

interface Box3DProps {
  box: Box;
  allBoxes: Box[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number; z: number }) => void;
}

export function Box3D({ box, allBoxes, isSelected, onSelect, onMove }: Box3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(new Vector3());
  const dragPlaneY = useRef(0);
  const { camera, raycaster, pointer } = useThree();

  const color = getMaterialColor(box.materialId);

  const outlineGeometry = useMemo(() => {
    return new BoxGeometry(
      box.dimensions.width * 1.01,
      box.dimensions.height * 1.01,
      box.dimensions.depth * 1.01
    );
  }, [box.dimensions.width, box.dimensions.height, box.dimensions.depth]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect(box.id);

    // Lock drag plane to current Y so stacking doesn't shift the plane
    dragPlaneY.current = box.position.y;

    const groundPlane = new Vector3(0, 1, 0);
    raycaster.setFromCamera(pointer, camera);
    const intersectPoint = new Vector3();
    raycaster.ray.intersectPlane(
      { normal: groundPlane, constant: -dragPlaneY.current } as never,
      intersectPoint
    );

    setDragOffset(
      new Vector3(
        box.position.x - intersectPoint.x,
        0,
        box.position.z - intersectPoint.z
      )
    );
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();

    const groundPlane = new Vector3(0, 1, 0);
    raycaster.setFromCamera(pointer, camera);
    const intersectPoint = new Vector3();
    raycaster.ray.intersectPlane(
      { normal: groundPlane, constant: -dragPlaneY.current } as never,
      intersectPoint
    );

    const newX = Math.round((intersectPoint.x + dragOffset.x) * 4) / 4;
    const newZ = Math.round((intersectPoint.z + dragOffset.z) * 4) / 4;

    // Find the highest box we overlap on XZ and stack on top of it
    const halfW = box.dimensions.width / 2;
    const halfD = box.dimensions.depth / 2;
    let stackY = 0; // ground level

    for (const other of allBoxes) {
      if (other.id === box.id) continue;
      const oHalfW = other.dimensions.width / 2;
      const oHalfD = other.dimensions.depth / 2;
      const overlapX = Math.abs(newX - other.position.x) < halfW + oHalfW;
      const overlapZ = Math.abs(newZ - other.position.z) < halfD + oHalfD;
      if (overlapX && overlapZ) {
        const otherTop = other.position.y + other.dimensions.height / 2;
        if (otherTop > stackY) stackY = otherTop;
      }
    }

    onMove(box.id, {
      x: newX,
      y: stackY + box.dimensions.height / 2,
      z: newZ,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <group
      position={[box.position.x, box.position.y, box.position.z]}
      rotation={[0, box.rotation, 0]}
    >
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={(e: ThreeEvent<MouseEvent>) => e.stopPropagation()}
      >
        <boxGeometry
          args={[box.dimensions.width, box.dimensions.height, box.dimensions.depth]}
        />
        <meshStandardMaterial
          color={color}
          transparent={isSelected}
          opacity={isSelected ? 0.9 : 1}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[outlineGeometry]} />
          <lineBasicMaterial color="#3b82f6" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}
