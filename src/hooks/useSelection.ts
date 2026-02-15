import { useProjectStore } from '../store/projectStore';

export function useSelection() {
  const { state, selectBoxes, toggleBoxSelection, getSelectedBox, getSelectedBoxes, updateBox, deleteBox } = useProjectStore();

  return {
    selectedBoxIds: state.selectedBoxIds,
    selectedBoxes: getSelectedBoxes(),
    selectedBox: getSelectedBox(),
    selectBoxes,
    toggleBoxSelection,
    updateBox,
    deleteBox,
    deselectAll: () => selectBoxes([]),
  };
}
