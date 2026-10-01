import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { isValidPhone } from '../../utils/validators';
import { STRINGS } from '../../strings/hi';

export default function PhoneField({
  value,
  onChange,
  disabled = false,
  error = null,
  setError = null,
  autoFocus = true,
}) {
  const [touched, setTouched] = useState(false);

  const handleInputChange = (e) => {
    // Strip non-digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(digitsOnly);

    if (touched && setError) {
      if (digitsOnly.length === 10 && !isValidPhone(digitsOnly)) {
        setError(STRINGS.login.phoneError);
      } else {
        setError(null);
      }
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (setError && value) {
      if (!isValidPhone(value)) {
        setError(STRINGS.login.phoneError);
      } else {
        setError(null);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div
        className={`w-full h-[54px] rounded-[16px] px-4 bg-white border flex items-center gap-3 transition-all ${
          error
            ? 'border-[#DC2626] ring-2 ring-[#FEF2F2]'
            : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-4 focus-within:ring-[#FFF9EE]'
        } ${disabled ? 'bg-[#F7F7F4] opacity-80 cursor-not-allowed' : ''}`}
      >
        {/* +91 Prefix */}
        <span className="text-[16px] font-bold text-[#2B2437] shrink-0 tracking-tight">
          {STRINGS.login.phonePrefix}
        </span>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-[#E5E7EB] shrink-0" />

        {/* Input */}
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          autoFocus={autoFocus}
          disabled={disabled}
          value={value || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="98765 43210"
          className="w-full h-full bg-transparent text-[17px] font-semibold text-[#2B2437] outline-none placeholder:text-[#A6A4A9] tracking-wider"
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 px-1 text-[12.5px] text-[#DC2626] font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
