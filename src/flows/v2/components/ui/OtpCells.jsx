import React, { useRef, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { STRINGS } from '../../strings/hi';

export default function OtpCells({
  onComplete,
  error = null,
  setError = null,
  disabled = false,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const next = [...digits];
    // Handle paste of multiple characters
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      chars.forEach((ch, i) => {
        if (i < 6) next[i] = ch;
      });
      setDigits(next);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      checkFullCode(next);
      return;
    }

    next[index] = cleaned[0];
    setDigits(next);

    // Auto-advance to next cell
    if (index < 5 && cleaned[0]) {
      inputRefs.current[index + 1]?.focus();
    }

    checkFullCode(next);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const checkFullCode = (currentDigits) => {
    const code = currentDigits.join('');
    if (code.length === 6) {
      if (code === '000000') {
        // Trigger wrong code error & shake
        setShaking(true);
        if (setError) setError(STRINGS.login.otpError);
        setTimeout(() => {
          setDigits(['', '', '', '', '', '']);
          setShaking(false);
          inputRefs.current[0]?.focus();
        }, 500);
      } else {
        if (setError) setError(null);
        if (onComplete) onComplete(code);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* 6 Cells */}
      <div
        className={`flex items-center justify-between gap-2 w-full max-w-[320px] ${
          shaking ? 'nb2-shake-anim' : ''
        }`}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-[45px] h-[58px] rounded-[14px] text-center text-[22px] font-bold outline-none transition-all border ${
              error
                ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]'
                : digit
                ? 'border-[#2B2437] bg-white text-[#2B2437] shadow-sm'
                : 'border-[#E5E7EB] bg-white text-[#2B2437] focus:border-[#2B2437] focus:ring-4 focus:ring-[#FFF9EE]'
            }`}
          />
        ))}
      </div>

      {/* Error line */}
      {error && (
        <div className="flex items-center gap-1.5 text-[13px] text-[#DC2626] font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
