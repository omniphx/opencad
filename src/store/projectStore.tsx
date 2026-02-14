import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { v4 as uuid } from 'uuid';
import { Box, Project, UnitSystem } from '../types';
import { saveProject, loadDefaultProject } from '../core/storage';
import { DEFAULT_MATERIALS } from '../core/materials';

interface ProjectState {
  project: Project;
  selectedBoxId: string | null;
  isLoading: boolean;
}

type ProjectAction =
  | { type: 'SET_PROJECT'; project: Project }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'ADD_BOX'; box: Box }
  | { type: 'UPDATE_BOX'; id: string; updates: Partial<Box> }
  | { type: 'DELETE_BOX'; id: string }
  | { type: 'SELECT_BOX'; id: string | null }
  | { type: 'SET_UNIT_SYSTEM'; unitSystem: UnitSystem }
  | { type: 'SET_PROJECT_NAME'; name: string };

function createDefaultProject(): Project {
  return {
    id: uuid(),
    name: 'Sauna Project',
    unitSystem: 'imperial',
    boxes: [],
  };
}

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_PROJECT':
      return { ...state, project: action.project, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };

    case 'ADD_BOX':
      return {
        ...state,
        project: {
          ...state.project,
          boxes: [...state.project.boxes, action.box],
        },
      };

    case 'UPDATE_BOX':
      return {
        ...state,
        project: {
          ...state.project,
          boxes: state.project.boxes.map((box) =>
            box.id === action.id ? { ...box, ...action.updates } : box
          ),
        },
      };

    case 'DELETE_BOX':
      return {
        ...state,
        project: {
          ...state.project,
          boxes: state.project.boxes.filter((box) => box.id !== action.id),
        },
        selectedBoxId:
          state.selectedBoxId === action.id ? null : state.selectedBoxId,
      };

    case 'SELECT_BOX':
      return { ...state, selectedBoxId: action.id };

    case 'SET_UNIT_SYSTEM':
      return {
        ...state,
        project: { ...state.project, unitSystem: action.unitSystem },
      };

    case 'SET_PROJECT_NAME':
      return {
        ...state,
        project: { ...state.project, name: action.name },
      };

    default:
      return state;
  }
}

interface ProjectContextValue {
  state: ProjectState;
  addBox: (materialId?: string) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  deleteBox: (id: string) => void;
  selectBox: (id: string | null) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  setProjectName: (name: string) => void;
  getSelectedBox: () => Box | undefined;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, {
    project: createDefaultProject(),
    selectedBoxId: null,
    isLoading: true,
  });

  // Load project from IndexedDB on mount
  useEffect(() => {
    loadDefaultProject().then((saved) => {
      if (saved) {
        dispatch({ type: 'SET_PROJECT', project: saved });
      } else {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      }
    });
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (!state.isLoading) {
      saveProject(state.project);
    }
  }, [state.project, state.isLoading]);

  const addBox = useCallback((materialId?: string) => {
    const boxes = state.project.boxes;

    // Cycle through materials so each new box gets a different color
    if (!materialId) {
      const materialIds = DEFAULT_MATERIALS.map((m) => m.id);
      const usedCounts = new Map<string, number>();
      for (const b of boxes) {
        usedCounts.set(b.materialId, (usedCounts.get(b.materialId) ?? 0) + 1);
      }
      // Pick the material with the fewest existing boxes
      let minCount = Infinity;
      let picked = materialIds[0];
      for (const id of materialIds) {
        const count = usedCounts.get(id) ?? 0;
        if (count < minCount) {
          minCount = count;
          picked = id;
        }
      }
      materialId = picked;
    }

    // Find a non-overlapping position by scanning along the X axis
    const defaultDim = { width: 1, height: 1, depth: 1 };
    let posX = 0;
    const posZ = 0;
    const spacing = 0.25; // gap between boxes

    const isOverlapping = (x: number, z: number) => {
      for (const b of boxes) {
        const bw = b.dimensions.width / 2;
        const bd = b.dimensions.depth / 2;
        const nw = defaultDim.width / 2;
        const nd = defaultDim.depth / 2;
        if (
          Math.abs(x - b.position.x) < bw + nw + spacing &&
          Math.abs(z - b.position.z) < bd + nd + spacing
        ) {
          return true;
        }
      }
      return false;
    };

    while (isOverlapping(posX, posZ)) {
      posX += defaultDim.width + spacing;
    }

    const box: Box = {
      id: uuid(),
      position: { x: posX, y: 0.5, z: posZ },
      dimensions: defaultDim,
      rotation: 0,
      materialId,
    };
    dispatch({ type: 'ADD_BOX', box });
    dispatch({ type: 'SELECT_BOX', id: box.id });
  }, [state.project.boxes]);

  const updateBox = useCallback((id: string, updates: Partial<Box>) => {
    dispatch({ type: 'UPDATE_BOX', id, updates });
  }, []);

  const deleteBox = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BOX', id });
  }, []);

  const selectBox = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BOX', id });
  }, []);

  const setUnitSystem = useCallback((unitSystem: UnitSystem) => {
    dispatch({ type: 'SET_UNIT_SYSTEM', unitSystem });
  }, []);

  const setProjectName = useCallback((name: string) => {
    dispatch({ type: 'SET_PROJECT_NAME', name });
  }, []);

  const getSelectedBox = useCallback(() => {
    return state.project.boxes.find((box) => box.id === state.selectedBoxId);
  }, [state.project.boxes, state.selectedBoxId]);

  return (
    <ProjectContext.Provider
      value={{
        state,
        addBox,
        updateBox,
        deleteBox,
        selectBox,
        setUnitSystem,
        setProjectName,
        getSelectedBox,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectStore() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectStore must be used within a ProjectProvider');
  }
  return context;
}
