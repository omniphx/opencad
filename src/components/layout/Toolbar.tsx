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
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
      <h1 className="text-white font-bold text-lg">OpenCAD</h1>

      {isBuilderMode && (
        <span className="px-2 py-0.5 bg-amber-600 text-white text-xs font-medium rounded">
          Component Builder
        </span>
      )}

      <div className="h-6 w-px bg-gray-600" />

      <button
        onClick={() => addBox()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
      >
        Add Box
      </button>

      {isBuilderMode ? (
        <>
          <div className="h-6 w-px bg-gray-600" />
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Component name..."
            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <button
            onClick={handleSave}
            disabled={(state.currentTemplate?.boxes.length ?? 0) === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
          >
            Save Component
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded transition-colors"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onToggleComponentLibrary}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              showComponentLibrary
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Components
          </button>
        </>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Units:</span>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            project.unitSystem === 'imperial'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Imperial
        </button>
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            project.unitSystem === 'metric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Metric
        </button>
      </div>
    </div>
  );
}
