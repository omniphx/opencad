import { v4 as uuid } from 'uuid';
import { Box, BoxCut, CutFace } from '../../types';
import { UnitSystem } from '../../types';

const FACE_LABELS: Record<CutFace, string> = {
  left: 'Left end',
  right: 'Right end',
  top: 'Top',
  bottom: 'Bottom',
  front: 'Front',
  back: 'Back',
};

const FACE_OPTIONS: CutFace[] = ['left', 'right', 'top', 'bottom', 'front', 'back'];
const ANGLE_PRESETS = [45, 22.5, 0];

interface CutsSectionProps {
  box: Box;
  unitSystem?: UnitSystem;
  onUpdateCuts: (cuts: BoxCut[]) => void;
}

export function CutsSection({ box, onUpdateCuts }: CutsSectionProps) {
  const cuts = box.cuts ?? [];

  const addCut = () => {
    onUpdateCuts([...cuts, { id: uuid(), face: 'left', angle: 45 }]);
  };

  const updateCut = (id: string, updates: Partial<BoxCut>) => {
    onUpdateCuts(cuts.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCut = (id: string) => {
    onUpdateCuts(cuts.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h3 className="text-slate-600 text-sm font-medium mb-2">Cuts</h3>
      {cuts.map((cut) => (
        <div key={cut.id} className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
          {/* Face dropdown */}
          <div className="flex items-center gap-2 mb-2">
            <label className="text-slate-500 text-xs w-10">Face</label>
            <select
              value={cut.face}
              onChange={(e) => updateCut(cut.id, { face: e.target.value as CutFace })}
              className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {FACE_OPTIONS.map((f) => (
                <option key={f} value={f}>{FACE_LABELS[f]}</option>
              ))}
            </select>
          </div>

          {/* Angle input + presets */}
          <div className="flex items-center gap-2 mb-2">
            <label className="text-slate-500 text-xs w-10">Angle</label>
            <input
              type="number"
              value={cut.angle}
              min={0}
              max={89}
              step={0.5}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v >= 0 && v <= 89) {
                  updateCut(cut.id, { angle: v });
                }
              }}
              className="w-14 px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-slate-400 text-xs">°</span>
            {ANGLE_PRESETS.map((a) => (
              <button
                key={a}
                onClick={() => updateCut(cut.id, { angle: a })}
                className={`px-1.5 py-0.5 text-xs rounded border transition-colors ${
                  cut.angle === a
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                {a}°
              </button>
            ))}
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeCut(cut.id)}
            className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
          >
            Remove cut
          </button>
        </div>
      ))}
      <button
        onClick={addCut}
        className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors"
      >
        + Add Cut
      </button>
    </div>
  );
}
