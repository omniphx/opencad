import { useProjectStore } from '../../store/projectStore';

export function ComponentLibraryPanel() {
  const { state, startComponentBuilder, editComponent, placeComponent, deleteComponentTemplate } =
    useProjectStore();

  return (
    <div className="w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <h2 className="text-slate-800 font-semibold mb-4">Component Library</h2>

      <button
        onClick={startComponentBuilder}
        className="w-full px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors mb-4"
      >
        + New Component
      </button>

      {state.componentLibrary.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No saved components yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {state.componentLibrary.map((template) => (
            <div
              key={template.id}
              className="bg-slate-50 rounded-lg p-3 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-800 text-sm font-medium truncate">
                  {template.name}
                </h3>
                <span className="text-slate-400 text-xs ml-2 shrink-0">
                  {template.boxes.length} box{template.boxes.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => placeComponent(template)}
                  className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Place
                </button>
                <button
                  onClick={() => editComponent(template)}
                  className="px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComponentTemplate(template.id)}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
