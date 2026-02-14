import { useMemo } from 'react';
import { useProject } from '../../hooks/useProject';
import { calculateBOM } from '../../core/bom';

export function BOMPanel() {
  const { project } = useProject();

  const bomEntries = useMemo(() => {
    return calculateBOM(project.boxes);
  }, [project.boxes]);

  return (
    <div className="w-64 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <h2 className="text-slate-800 font-semibold mb-4">Bill of Materials</h2>

      {bomEntries.length === 0 ? (
        <p className="text-slate-400 text-sm">No materials yet. Add some boxes!</p>
      ) : (
        <div className="space-y-3">
          {bomEntries.map((entry) => (
            <div
              key={entry.materialId}
              className="bg-slate-50 rounded-lg p-3 border border-slate-100"
            >
              <div className="text-slate-800 text-sm font-medium">
                {entry.materialName}
              </div>
              <div className="text-slate-500 text-sm mt-1">
                {entry.quantity.toFixed(2)} {entry.unit}
              </div>
            </div>
          ))}
        </div>
      )}

      {bomEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-slate-400 text-xs">
            {project.boxes.length} box{project.boxes.length !== 1 ? 'es' : ''} total
          </div>
        </div>
      )}
    </div>
  );
}
