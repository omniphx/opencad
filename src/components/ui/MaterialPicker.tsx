import { DEFAULT_MATERIALS } from '../../core/materials';

interface MaterialPickerProps {
  value: string;
  onChange: (materialId: string) => void;
}

export function MaterialPicker({ value, onChange }: MaterialPickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {DEFAULT_MATERIALS.map((material) => (
        <option key={material.id} value={material.id}>
          {material.name}
        </option>
      ))}
    </select>
  );
}
