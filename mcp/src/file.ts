import { readFileSync, writeFileSync } from 'fs';

export type CutFace = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';

export interface BoxCut {
  id: string;
  face: CutFace;
  angle: number;
  depth?: number;
}

export interface Box {
  id: string;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  rotation: { x: number; y: number; z: number };
  materialId: string;
  label?: string;
  groupId?: string;
  locked?: boolean;
  hidden?: boolean;
  cuts?: BoxCut[];
}

export type UnitType = 'board_feet' | 'square_feet' | 'cubic_feet' | 'linear_feet' | 'count';

export interface Material {
  id: string;
  name: string;
  unitType: UnitType;
  color: string;
  defaultDimensions?: { width: number; height: number; depth: number };
}

export type UnitSystem = 'feet' | 'inches' | 'metric';

export interface Project {
  id: string;
  name: string;
  unitSystem: UnitSystem;
  boxes: Box[];
}

export interface ComponentTemplate {
  id: string;
  name: string;
  boxes: Box[];
  createdAt: number;
}

export interface OpenCADExport {
  version: 1;
  exportedAt: string;
  project: Project;
  components: ComponentTemplate[];
}

export function loadFile(filePath: string): OpenCADExport {
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as OpenCADExport;

  if (!data.version || !data.project || !Array.isArray(data.project.boxes)) {
    throw new Error('Invalid OpenCAD file format');
  }

  return data;
}

export function saveFile(filePath: string, data: OpenCADExport): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
