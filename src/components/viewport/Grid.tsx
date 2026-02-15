import { Grid as DreiGrid } from '@react-three/drei';
import { UnitSystem } from '../../types';

interface GridProps {
  unitSystem: UnitSystem;
}

export function Grid({ unitSystem }: GridProps) {
  const cellSize = unitSystem === 'metric' ? 0.01 : 0.3048;
  const sectionSize = unitSystem === 'metric' ? 0.1 : 3.048;

  return (
    <DreiGrid
      position={[0, 0, 0]}
      args={[20, 20]}
      cellSize={cellSize}
      cellThickness={0.5}
      cellColor="#94a3b8"
      sectionSize={sectionSize}
      sectionThickness={1}
      sectionColor="#64748b"
      fadeDistance={50}
      fadeStrength={1}
      infiniteGrid
    />
  );
}
