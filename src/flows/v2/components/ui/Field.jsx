import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { STRINGS } from '../../strings/hi';

export default function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error = null,
  helper = null,
  required = false,
  maxLength = undefined,
  showCounter = false,
  type = 'text',
  inputMode = undefined,
  autoComplete = undefined,
  autoFocus = false,
  disabled = false,
  className = '',
  rightAction = null,
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[14px] font-semibold text-[#2B2437] flex items-center gap-1">
          <span>{label}</span>
          {required ? (
            <span className="text-[#DC2626] font-bold">*</span>
          ) : (
            <span className="text-[12px] font-normal text-[#6B7280]">
              {STRINGS.common.optionalHint}
            </span>
          )}
        </label>
        {showCounter && maxLength && (
          <span className="text-[12px] text-[#6B7280] tabular-nums">
            {(value || '').length}/{maxLength}
          </span>
        )}
      </div>

      {/* Input container */}
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          maxLength={maxLength}
          value={value ?? ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full h-[52px] rounded-[16px] px-4 text-[16px] bg-white border outline-none transition-all placeholder:text-[#A6A4A9] text-[#2B2437] ${
            error
              ? 'border-[#DC2626] ring-2 ring-[#FEF2F2]'
              : 'border-[#E5E7EB] focus:border-[#2B2437] focus:ring-4 focus:ring-[#FFF9EE]'
          } ${disabled ? 'bg-[#F7F7F4] text-[#A6A4A9] cursor-not-allowed' : ''}`}
        />
        {rightAction && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightAction}
          </div>
        )}
      </div>

      {/* Helper text */}
      {helper && !error && (
        <span className="text-[12.5px] text-[#6B7280] px-1">{helper}</span>
      )}

      {/* Error text with alert icon */}
      {error && (
        <div id={errorId} className="flex items-center gap-1.5 px-1 text-[12.5px] text-[#DC2626] font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
