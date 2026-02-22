import { useState, useEffect } from 'react';
import { ProjectProvider, useProjectStore } from './store/projectStore';
import { Toolbar } from './components/layout/Toolbar';
import { Viewport } from './components/viewport/Viewport';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { BOMPanel } from './components/layout/BOMPanel';
import { ComponentLibraryPanel } from './components/layout/ComponentLibraryPanel';
import { Toast } from './components/ui/Toast';

function AppContent() {
  const { state, copySelectedBoxes, pasteBoxes, duplicateSelectedBoxes, deleteSelectedBoxes, dismissToast, undo, redo, canUndo, canRedo, groupSelectedBoxes, ungroupSelectedBoxes } = useProjectStore();
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else if (e.key === 'z') {
          e.preventDefault();
          if (canUndo) undo();
        } else if (e.key === 'c' && state.selectedBoxIds.length > 0) {
          e.preventDefault();
          copySelectedBoxes();
        } else if (e.key === 'v' && state.clipboard && state.clipboard.length > 0) {
          e.preventDefault();
          pasteBoxes();
        } else if (e.key === 'd' && state.selectedBoxIds.length > 0) {
          e.preventDefault();
          duplicateSelectedBoxes();
        } else if (e.key === 'g' && e.shiftKey) {
          e.preventDefault();
          ungroupSelectedBoxes();
        } else if (e.key === 'g') {
          e.preventDefault();
          groupSelectedBoxes();
        }
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedBoxIds.length > 0) {
        e.preventDefault();
        deleteSelectedBoxes();
      }

      if (e.key === 'm' || e.key === 'M') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setIsMeasuring((v) => !v);
        }
      }
      if (e.key === 'Escape' && isMeasuring) {
        e.preventDefault();
        setIsMeasuring(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedBoxIds, state.clipboard, copySelectedBoxes, pasteBoxes, duplicateSelectedBoxes, deleteSelectedBoxes, undo, redo, canUndo, canRedo, groupSelectedBoxes, ungroupSelectedBoxes, isMeasuring]);

  const isBuilderMode = state.mode === 'component-builder';

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Toolbar
        onToggleComponentLibrary={() => setShowComponentLibrary((v) => !v)}
        showComponentLibrary={showComponentLibrary}
        isMeasuring={isMeasuring}
        onToggleMeasure={() => setIsMeasuring((v) => !v)}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <Viewport isMeasuring={isMeasuring} />
        <div className="absolute top-0 right-0 bottom-0 flex">
          <PropertiesPanel />
          {!isBuilderMode && showComponentLibrary && <ComponentLibraryPanel />}
          {!isBuilderMode && <BOMPanel />}
        </div>
      </div>
      <Toast message={state.toastMessage} onDismiss={dismissToast} />
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
