import { Grid as DreiGrid } from '@react-three/drei';

export function Grid() {
  return (
    <DreiGrid
      position={[0, 0, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#94a3b8"
      sectionSize={1}
      sectionThickness={1}
      sectionColor="#64748b"
      fadeDistance={50}
      fadeStrength={1}
      infiniteGrid
    />
  );
}
