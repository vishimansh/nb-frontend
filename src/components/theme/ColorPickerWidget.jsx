import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette, RotateCcw, X, Palette, Check, GripHorizontal, GripVertical } from 'lucide-react';
import {
  useTheme,
  DEFAULT_PRIMARY,
  DEFAULT_ACCENT,
  hexToRgb,
} from '../../context/ThemeContext';

// --- Color Math Helpers ---
function hexToHsv(hex) {
  const { r: r255, g: g255, b: b255 } = hexToRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

function hsvToHex(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r1 = 0, g1 = 0, b1 = 0;
  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clampPosition(x, y, width = 290, height = 380) {
  if (typeof window === 'undefined') return { x, y };
  const maxX = Math.max(8, window.innerWidth - width - 8);
  const maxY = Math.max(8, window.innerHeight - height - 8);
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  };
}

export default function ColorPickerWidget() {
  const {
    primaryColor,
    accentColor,
    setPrimaryColor,
    setAccentColor,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useTheme();

  // Active target: 'primary' or 'accent'
  const [target, setTarget] = useState('primary');

  const currentColor = target === 'primary' ? primaryColor : accentColor;
  const setCurrentColor = target === 'primary' ? setPrimaryColor : setAccentColor;

  // Internal HSV state for smooth dragging
  const [hsv, setHsv] = useState(() => hexToHsv(currentColor));
  const [hexInput, setHexInput] = useState(currentColor);

  // Sync HSV when target or external color changes
  useEffect(() => {
    const newHsv = hexToHsv(currentColor);
    setHsv(newHsv);
    setHexInput(currentColor.toUpperCase());
  }, [currentColor, target]);

  // Draggable position state (stored in localStorage)
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nb_color_picker_pos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            return clampPosition(parsed.x, parsed.y, 290, 420);
          }
        }
      } catch {}
      return clampPosition(window.innerWidth - 305, 75, 290, 420);
    }
    return { x: 100, y: 75 };
  });

  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [isDraggingTrigger, setIsDraggingTrigger] = useState(false);

  // Keep widget in screen bounds on resize and when toggling open/close
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const width = isCustomizerOpen ? 290 : 155;
        const height = isCustomizerOpen ? 420 : 44;
        return clampPosition(prev.x, prev.y, width, height);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCustomizerOpen]);

  // When opening, ensure it fits within the viewport
  useEffect(() => {
    if (isCustomizerOpen) {
      setPosition((prev) => clampPosition(prev.x, prev.y, 290, 420));
    }
  }, [isCustomizerOpen]);

  // Unified global drag tracker for Trigger and Panel
  const dragRef = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    isPanel: false,
  });

  const handlePointerDownDrag = (e, isPanel) => {
    if (e.button !== undefined && e.button !== 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragRef.current = {
      isDragging: true,
      hasMoved: false,
      startX: clientX,
      startY: clientY,
      origX: position.x,
      origY: position.y,
      isPanel,
    };

    if (isPanel) {
      setIsDraggingPanel(true);
    } else {
      setIsDraggingTrigger(true);
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;

      if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
        dragRef.current.hasMoved = true;
      }

      if (dragRef.current.hasMoved) {
        const width = dragRef.current.isPanel ? 290 : 155;
        const height = dragRef.current.isPanel ? 420 : 44;
        const newPos = clampPosition(
          dragRef.current.origX + dx,
          dragRef.current.origY + dy,
          width,
          height
        );
        setPosition(newPos);
      }
    };

    const handleUp = () => {
      if (!dragRef.current.isDragging) return;
      const wasPanel = dragRef.current.isPanel;
      const hadMoved = dragRef.current.hasMoved;

      dragRef.current.isDragging = false;
      setIsDraggingPanel(false);
      setIsDraggingTrigger(false);

      if (hadMoved) {
        try {
          localStorage.setItem('nb_color_picker_pos', JSON.stringify(position));
        } catch {}
      } else if (!wasPanel) {
        // Simple click without drag on closed trigger: open customizer
        setIsCustomizerOpen(true);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [position, setIsCustomizerOpen]);

  const satBoxRef = useRef(null);
  const hueBarRef = useRef(null);
  const isDraggingSat = useRef(false);
  const isDraggingHue = useRef(false);

  // Update color from Saturation & Value area
  const updateSatVal = useCallback(
    (clientX, clientY) => {
      if (!satBoxRef.current) return;
      const rect = satBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = Math.max(0, Math.min(1, x / rect.width));
      const v = Math.max(0, Math.min(1, 1 - y / rect.height));

      setHsv((prev) => {
        const next = { ...prev, s, v };
        const hex = hsvToHex(next.h, next.s, next.v);
        setCurrentColor(hex);
        setHexInput(hex);
        return next;
      });
    },
    [setCurrentColor]
  );

  // Update color from Hue bar
  const updateHue = useCallback(
    (clientX) => {
      if (!hueBarRef.current) return;
      const rect = hueBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      const h = Math.round(ratio * 360) % 360;

      setHsv((prev) => {
        const next = { ...prev, h };
        const hex = hsvToHex(next.h, next.s, next.v);
        setCurrentColor(hex);
        setHexInput(hex);
        return next;
      });
    },
    [setCurrentColor]
  );

  // Window-level mouse/touch drag handlers for color picking in Saturation & Hue
  useEffect(() => {
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isDraggingSat.current) {
        updateSatVal(clientX, clientY);
      } else if (isDraggingHue.current) {
        updateHue(clientX);
      }
    };

    const handlePointerUp = () => {
      isDraggingSat.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [updateSatVal, updateHue]);

  // Handle manual HEX input
  const handleHexInputChange = (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setCurrentColor(val.toUpperCase());
    }
  };

  // Eyedropper API (Chrome/Edge native color picker)
  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          setCurrentColor(hex);
        }
      } catch {
        // Cancelled or ignored
      }
    }
  };

  // If customizer is closed, show floating draggable palette button
  if (!isCustomizerOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }}
        className="select-none touch-none"
      >
        <button
          type="button"
          onMouseDown={(e) => handlePointerDownDrag(e, false)}
          onTouchStart={(e) => handlePointerDownDrag(e, false)}
          className={`h-[38px] pl-2.5 pr-3 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/90 flex items-center gap-1.5 text-gray-800 transition-all cursor-grab active:cursor-grabbing group select-none ${
            isDraggingTrigger
              ? 'scale-105 shadow-2xl ring-2 ring-black/10'
              : 'hover:shadow-xl active:scale-95'
          }`}
          title="Drag anywhere on screen, or click to open Color Picker"
          aria-label="Open Color Picker (Draggable)"
        >
          <GripVertical size={13} className="text-gray-400 group-hover:text-gray-600 shrink-0" />
          <Palette size={15} className="text-gray-700 shrink-0" />
          <div className="flex items-center shrink-0">
            <span
              className="w-4 h-4 rounded-full border border-white shadow-xs inline-block"
              style={{ backgroundColor: primaryColor }}
              title="Primary"
            />
            <span
              className="w-4 h-4 rounded-full border border-white shadow-xs inline-block -ml-1.5"
              style={{ backgroundColor: accentColor }}
              title="Accent"
            />
          </div>
          <span className="text-[12px] font-bold text-gray-900 tracking-tight shrink-0">
            Color Picker
          </span>
        </button>
      </div>
    );
  }

  // Pure Hue background color for Saturation Box
  const hueBgColor = `hsl(${hsv.h}, 100%, 50%)`;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        boxShadow: isDraggingPanel
          ? '0 28px 50px -10px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(0,0,0,0.1)'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06)',
      }}
      className={`w-[290px] bg-white rounded-[22px] border border-gray-200/90 p-3.5 flex flex-col gap-2.5 select-none transition-shadow ${
        isDraggingPanel ? 'scale-[1.01]' : 'animate-fadeIn'
      }`}
    >
      {/* 0. Dedicated Drag Handle Bar */}
      <div
        onMouseDown={(e) => handlePointerDownDrag(e, true)}
        onTouchStart={(e) => handlePointerDownDrag(e, true)}
        className="w-full flex items-center justify-between pb-1 cursor-grab active:cursor-grabbing group touch-none -mt-1 select-none border-b border-gray-100/80"
        title="Click and drag anywhere to move color picker"
      >
        <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-600 transition-colors">
          <GripHorizontal size={14} />
          <span className="text-[10.5px] font-semibold tracking-tight text-gray-400 group-hover:text-gray-600">
            Drag to move
          </span>
        </div>
        <div className="w-12 h-1 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors mr-1" />
      </div>

      {/* 1. Header with Target Switcher (Primary vs Accent) & Close */}
      <div className="flex items-center justify-between gap-1 pb-1 border-b border-gray-100">
        <div className="flex items-center gap-1.5 flex-1 bg-gray-100 p-1 rounded-[14px]">
          {/* Target: Primary */}
          <button
            type="button"
            onClick={() => setTarget('primary')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-[11px] transition-all cursor-pointer ${
              target === 'primary'
                ? 'bg-white shadow-xs text-gray-900 font-bold'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-[11.5px] leading-none">Primary</span>
            {target === 'primary' && <Check size={11} className="text-gray-900" strokeWidth={3} />}
          </button>

          {/* Target: Accent */}
          <button
            type="button"
            onClick={() => setTarget('accent')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-[11px] transition-all cursor-pointer ${
              target === 'accent'
                ? 'bg-white shadow-xs text-gray-900 font-bold'
                : 'text-gray-500 hover:text-gray-800 font-medium'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[11.5px] leading-none">Accent</span>
            {target === 'accent' && <Check size={11} className="text-gray-900" strokeWidth={3} />}
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsCustomizerOpen(false)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center active:scale-90 transition-all cursor-pointer shrink-0 ml-1"
          aria-label="Close Color Picker"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* 2. Visual 2D Saturation & Brightness Area */}
      <div
        ref={satBoxRef}
        onMouseDown={(e) => {
          isDraggingSat.current = true;
          updateSatVal(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          isDraggingSat.current = true;
          updateSatVal(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className="relative w-full h-[150px] rounded-[16px] overflow-hidden cursor-crosshair shadow-inner"
        style={{ backgroundColor: hueBgColor }}
      >
        {/* Saturation gradient (white to transparent) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #FFFFFF, transparent)',
          }}
        />
        {/* Value/Brightness gradient (black to transparent) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000, transparent)',
          }}
        />

        {/* Draggable Circle Pointer */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2 ring-1 ring-black/40"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: currentColor,
          }}
        />
      </div>

      {/* 3. Rainbow Hue Slider */}
      <div className="flex flex-col gap-1">
        <div
          ref={hueBarRef}
          onMouseDown={(e) => {
            isDraggingHue.current = true;
            updateHue(e.clientX);
          }}
          onTouchStart={(e) => {
            isDraggingHue.current = true;
            updateHue(e.touches[0].clientX);
          }}
          className="relative w-full h-[14px] rounded-full cursor-pointer shadow-inner"
          style={{
            background:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        >
          {/* Draggable Thumb on Hue Bar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border border-black/20 shadow-md ring-1 ring-black/20 pointer-events-none"
            style={{ left: `${(hsv.h / 360) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. Controls Row: Swatch + Native Picker + Hex Input + Eyedropper + Reset */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* Color Swatch & Native Color Picker trigger */}
        <label
          className="relative w-8 h-8 rounded-[10px] border border-black/15 shadow-xs cursor-pointer overflow-hidden shrink-0 flex items-center justify-center group"
          style={{ backgroundColor: currentColor }}
          title="Open native color wheel"
        >
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value.toUpperCase());
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>

        {/* Hex Text Input */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            placeholder="#000000"
            maxLength={7}
            className="w-full h-8 px-2 text-[12.5px] font-mono font-bold text-gray-900 uppercase bg-gray-50 border border-gray-200 rounded-[10px] text-center focus:outline-none focus:border-gray-400 focus:bg-white"
          />
        </div>

        {/* Eyedropper (if available) */}
        {typeof window !== 'undefined' && window.EyeDropper && (
          <button
            type="button"
            onClick={handleEyeDropper}
            className="w-8 h-8 rounded-[10px] bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Pick color from screen (EyeDropper)"
          >
            <Pipette size={14} />
          </button>
        )}

        {/* Reset Color Button */}
        <button
          type="button"
          onClick={() => {
            if (target === 'primary') {
              setPrimaryColor(DEFAULT_PRIMARY);
            } else {
              setAccentColor(DEFAULT_ACCENT);
            }
          }}
          className="w-8 h-8 rounded-[10px] bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
          title={`Reset ${target === 'primary' ? 'Primary (#2B2437)' : 'Accent (#F5B55C)'} to default`}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* 5. Quick Popular Palettes for Current Target */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Quick:
        </span>
        <div className="flex items-center gap-1.5">
          {(target === 'primary'
            ? ['#2B2437', '#0F172A', '#121214', '#064E3B', '#1E1B4B', '#4A0404']
            : ['#F5B55C', '#F59E0B', '#F97316', '#E39026', '#10B981', '#06B6D4']
          ).map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setCurrentColor(hex)}
              className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 transition-transform cursor-pointer shadow-2xs"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
