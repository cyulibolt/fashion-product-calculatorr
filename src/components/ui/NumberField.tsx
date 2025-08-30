import React from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  min?: number;
  step?: number;
  required?: boolean;
  error?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  prefix,
  min = 0,
  step = 0.01,
  required = false,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          step={step}
          className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
            prefix ? 'pl-12' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'} py-2 ${error ? 'border-red-500' : ''}`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};