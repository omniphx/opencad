import { useState, useEffect } from 'react';
import { UnitSystem } from '../../types';
import {
  metersToDisplayUnit,
  displayUnitToMeters,
  getDisplayUnitLabel,
} from '../../core/units';

interface DimensionInputProps {
  label: string;
  value: number; // in meters
  unitSystem: UnitSystem;
  onChange: (meters: number) => void;
  min?: number;
}

export function DimensionInput({
  label,
  value,
  unitSystem,
  onChange,
  min = 0.01,
}: DimensionInputProps) {
  const displayValue = metersToDisplayUnit(value, unitSystem);
  const [inputValue, setInputValue] = useState(displayValue.toFixed(2));

  useEffect(() => {
    setInputValue(metersToDisplayUnit(value, unitSystem).toFixed(2));
  }, [value, unitSystem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= min) {
      const meters = displayUnitToMeters(parsed, unitSystem);
      onChange(meters);
    } else {
      setInputValue(displayValue.toFixed(2));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-slate-500 text-sm w-16">{label}</label>
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        step="0.1"
        min="0"
        className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <span className="text-slate-400 text-sm w-8">{getDisplayUnitLabel(unitSystem)}</span>
    </div>
  );
}
