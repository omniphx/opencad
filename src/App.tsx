import { useState } from 'react';
import { ProjectProvider, useProjectStore } from './store/projectStore';
import { Toolbar } from './components/layout/Toolbar';
import { Viewport } from './components/viewport/Viewport';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { BOMPanel } from './components/layout/BOMPanel';
import { ComponentLibraryPanel } from './components/layout/ComponentLibraryPanel';

function AppContent() {
  const { state } = useProjectStore();
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);

  const isBuilderMode = state.mode === 'component-builder';

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Toolbar
        onToggleComponentLibrary={() => setShowComponentLibrary((v) => !v)}
        showComponentLibrary={showComponentLibrary}
      />
      <div className="flex-1 flex overflow-hidden">
        <Viewport />
        <PropertiesPanel />
        {!isBuilderMode && showComponentLibrary && <ComponentLibraryPanel />}
        {!isBuilderMode && <BOMPanel />}
      </div>
    </div>
  );
}

function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}

export default App;
