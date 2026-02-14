import { useProjectStore } from '../../store/projectStore';

export function ComponentLibraryPanel() {
  const { state, startComponentBuilder, placeComponent, deleteComponentTemplate } =
    useProjectStore();

  return (
    <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-white font-semibold mb-4">Component Library</h2>

      <button
        onClick={startComponentBuilder}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors mb-4"
      >
        New Component
      </button>

      {state.componentLibrary.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No saved components yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {state.componentLibrary.map((template) => (
            <div
              key={template.id}
              className="bg-gray-700 rounded p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium truncate">
                  {template.name}
                </h3>
                <span className="text-gray-400 text-xs ml-2 shrink-0">
                  {template.boxes.length} box{template.boxes.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => placeComponent(template)}
                  className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Place
                </button>
                <button
                  onClick={() => deleteComponentTemplate(template.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
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
