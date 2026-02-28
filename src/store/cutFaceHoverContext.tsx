import { createContext, useContext, useState, ReactNode } from 'react';
import { CutFace } from '../types';

interface CutFaceHoverValue {
  hoveredCutFace: { boxId: string; face: CutFace } | null;
  setHoveredCutFace: (v: { boxId: string; face: CutFace } | null) => void;
}

const CutFaceHoverContext = createContext<CutFaceHoverValue>({
  hoveredCutFace: null,
  setHoveredCutFace: () => {},
});

export function CutFaceHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredCutFace, setHoveredCutFace] = useState<{ boxId: string; face: CutFace } | null>(null);
  return (
    <CutFaceHoverContext.Provider value={{ hoveredCutFace, setHoveredCutFace }}>
      {children}
    </CutFaceHoverContext.Provider>
  );
}

export function useCutFaceHover() {
  return useContext(CutFaceHoverContext);
}
