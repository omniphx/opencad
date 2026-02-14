import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { IsometricCamera } from './IsometricCamera';
import { Grid } from './Grid';
import { Box3D } from './Box3D';
import { useProjectStore } from '../../store/projectStore';

export function Viewport() {
  const { state, selectBox, updateBox } = useProjectStore();

  const handleMove = (id: string, position: { x: number; y: number; z: number }) => {
    updateBox(id, { position });
  };

  const handleBackgroundClick = () => {
    selectBox(null);
  };

  return (
    <div className="flex-1 bg-sky-50">
      <Canvas>
        <IsometricCamera />
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          minZoom={20}
          maxZoom={500}
        />
        {/* Hemisphere light gives different tint to sky-facing vs ground-facing surfaces */}
        <hemisphereLight args={['#b0d0ff', '#806040', 0.6]} />
        {/* Key light from upper-right-front */}
        <directionalLight position={[5, 12, 8]} intensity={1} />
        {/* Fill light from left to soften shadows without flattening */}
        <directionalLight position={[-8, 6, -3]} intensity={0.25} />

        <Grid />

        {/* Background plane for deselection */}
        <mesh
          position={[0, -0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={handleBackgroundClick}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {(state.mode === 'component-builder'
          ? (state.currentTemplate?.boxes ?? [])
          : state.project.boxes
        ).map((box) => (
          <Box3D
            key={box.id}
            box={box}
            allBoxes={
              state.mode === 'component-builder'
                ? (state.currentTemplate?.boxes ?? [])
                : state.project.boxes
            }
            isSelected={box.id === state.selectedBoxId}
            onSelect={selectBox}
            onMove={handleMove}
          />
        ))}
      </Canvas>
    </div>
  );
}
