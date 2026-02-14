import { useMemo } from 'react';
import { useProject } from '../../hooks/useProject';
import { useProjectStore } from '../../store/projectStore';
import { getMaterialById } from '../../core/materials';
import { metersToDisplayUnit, getDisplayUnitLabel } from '../../core/units';

export function BOMPanel() {
  const { project } = useProject();
  const { state, selectBox } = useProjectStore();

  const unitLabel = getDisplayUnitLabel(project.unitSystem);

  const formatDim = (meters: number) => {
    const val = metersToDisplayUnit(meters, project.unitSystem);
    // Show up to 2 decimals, but trim trailing zeros
    return parseFloat(val.toFixed(2)).toString();
  };

  // Group boxes by material for organization
  const groupedBoxes = useMemo(() => {
    const groups = new Map<string, { materialName: string; color: string; boxes: typeof project.boxes }>();
    for (const box of project.boxes) {
      const material = getMaterialById(box.materialId);
      const name = material?.name ?? 'Unknown';
      const color = material?.color ?? '#888888';
      if (!groups.has(box.materialId)) {
        groups.set(box.materialId, { materialName: name, color, boxes: [] });
      }
      groups.get(box.materialId)!.boxes.push(box);
    }
    return Array.from(groups.values()).sort((a, b) =>
      a.materialName.localeCompare(b.materialName)
    );
  }, [project.boxes]);

  return (
    <div className="w-64 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <h2 className="text-slate-800 font-semibold mb-4">Bill of Materials</h2>

      {project.boxes.length === 0 ? (
        <p className="text-slate-400 text-sm">No materials yet. Add some boxes!</p>
      ) : (
        <div className="space-y-4">
          {groupedBoxes.map((group) => (
            <div key={group.materialName}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded border border-slate-300 flex-shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-slate-700 text-xs font-semibold uppercase tracking-wide">
                  {group.materialName}
                </span>
                <span className="text-slate-400 text-xs">
                  ({group.boxes.length})
                </span>
              </div>
              <div className="space-y-1">
                {group.boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => selectBox(box.id)}
                    className={`w-full text-left rounded-lg p-2 border transition-colors ${
                      state.selectedBoxId === box.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-slate-800 text-sm font-medium">
                      {box.label || group.materialName}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {formatDim(box.dimensions.width)} × {formatDim(box.dimensions.height)} × {formatDim(box.dimensions.depth)} {unitLabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {project.boxes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-slate-400 text-xs">
            {project.boxes.length} item{project.boxes.length !== 1 ? 's' : ''} total
          </div>
        </div>
      )}
    </div>
  );
}
