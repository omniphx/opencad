import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useProject } from '../../hooks/useProject';

interface ToolbarProps {
  onToggleComponentLibrary?: () => void;
  showComponentLibrary?: boolean;
}

export function Toolbar({ onToggleComponentLibrary, showComponentLibrary }: ToolbarProps) {
  const { state, addBox, saveComponent, cancelComponentBuilder } = useProjectStore();
  const { project, setUnitSystem } = useProject();
  const [componentName, setComponentName] = useState('');

  const isBuilderMode = state.mode === 'component-builder';

  const handleSave = () => {
    const name = componentName.trim() || 'Untitled Component';
    saveComponent(name);
    setComponentName('');
  };

  const handleCancel = () => {
    cancelComponentBuilder();
    setComponentName('');
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 gap-4">
      <h1 className="text-slate-800 font-bold text-lg tracking-tight">OpenCAD</h1>

      {isBuilderMode && (
        <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full">
          Builder Mode
        </span>
      )}

      <div className="h-6 w-px bg-slate-200" />

      <button
        onClick={() => addBox()}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        + Add Box
      </button>

      {isBuilderMode ? (
        <>
          <div className="h-6 w-px bg-slate-200" />
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Component name..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <button
            onClick={handleSave}
            disabled={(state.currentTemplate?.boxes.length ?? 0) === 0}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Save Component
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onToggleComponentLibrary}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showComponentLibrary
                ? 'bg-violet-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Components
          </button>
        </>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-sm">Units:</span>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            project.unitSystem === 'imperial'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Imperial
        </button>
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            project.unitSystem === 'metric'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Metric
        </button>
      </div>
    </div>
  );
}
