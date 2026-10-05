import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const DEFAULT_PRIMARY = '#2B2437';
export const DEFAULT_ACCENT = '#F5B55C';

export const THEME_PRESETS = [
  {
    id: 'navbharat-classic',
    name: 'नवभारत क्लासिक (Default)',
    subtitle: 'शाही जामुनी व हेरिटेज अम्बर',
    primary: '#2B2437',
    accent: '#F5B55C',
  },
  {
    id: 'midnight-gold',
    name: 'मिडनाइट नेवी & गोल्ड',
    subtitle: 'डीप नेवी व वाइब्रेंट गोल्ड',
    primary: '#0F172A',
    accent: '#F59E0B',
  },
  {
    id: 'emerald-amber',
    name: 'एमराल्ड फॉरेस्ट & हनी',
    subtitle: 'रॉयल डार्क ग्रीन व वॉर्म हनी',
    primary: '#064E3B',
    accent: '#FBBF24',
  },
  {
    id: 'imperial-indigo',
    name: 'रॉयल इंडिगो & टैंगरीन',
    subtitle: 'डीप इंडिगो व सनसेट नारंगी',
    primary: '#1E1B4B',
    accent: '#F97316',
  },
  {
    id: 'crimson-ruby',
    name: 'रूबी वाइन & सनशाइन',
    subtitle: 'शाही गहरा लाल व लेमन येलो',
    primary: '#4A0404',
    accent: '#FACC15',
  },
  {
    id: 'obsidian-cyan',
    name: 'ऑब्सिडियन & इलेक्ट्रिक सियान',
    subtitle: 'प्योर डार्क चारकोल व वाइब्रेंट सियान',
    primary: '#121214',
    accent: '#06B6D4',
  },
  {
    id: 'velvet-rose',
    name: 'वेलवेट पर्पल & नियॉन रोज़',
    subtitle: 'गहरा पर्पल व वाइब्रेंट रोज़ पिंक',
    primary: '#2E1065',
    accent: '#F43F5E',
  },
  {
    id: 'espresso-marigold',
    name: 'डार्क एस्प्रेसो & मैरीगोल्ड',
    subtitle: 'रिच डार्क चॉकलेट व गेंदा पीला',
    primary: '#291811',
    accent: '#EAB308',
  },
];

// Quick single color suggestions for custom picking
export const PRIMARY_COLOR_SWATCHES = [
  '#2B2437', // Default Royal Plum
  '#0F172A', // Slate / Midnight Navy
  '#121214', // Obsidian
  '#064E3B', // Deep Emerald
  '#1E1B4B', // Royal Indigo
  '#4A0404', // Crimson Wine
  '#291811', // Espresso
  '#1E293B', // Steel Slate
  '#2E1065', // Royal Violet
  '#18181B', // Zinc Dark
];

export const ACCENT_COLOR_SWATCHES = [
  '#F5B55C', // Default Amber
  '#F59E0B', // Bright Gold
  '#F97316', // Tangerine
  '#E39026', // Electric Saffron
  '#10B981', // Mint Emerald
  '#06B6D4', // Electric Cyan
  '#F43F5E', // Rose Pink
  '#8B5CF6', // Electric Purple
  '#FBBF24', // Honey Yellow
  '#EAB308', // Marigold
];

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return { r: 43, g: 36, b: 55 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return { r: 43, g: 36, b: 55 };

  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 43, g: 36, b: 55 };

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function adjustLightness(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialOpen = false }) {
  const [primaryColor, setPrimaryColorState] = useState(() => {
    try {
      return localStorage.getItem('nb_theme_primary') || DEFAULT_PRIMARY;
    } catch {
      return DEFAULT_PRIMARY;
    }
  });

  const [accentColor, setAccentColorState] = useState(() => {
    try {
      return localStorage.getItem('nb_theme_accent') || DEFAULT_ACCENT;
    } catch {
      return DEFAULT_ACCENT;
    }
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(initialOpen);

  // Injects dynamic CSS variables and override rules directly into the document head
  const updateDynamicStyles = useCallback((primary, accent) => {
    if (typeof document === 'undefined') return;

    const pRgb = hexToRgb(primary);
    const aRgb = hexToRgb(accent);
    const primaryHover = adjustLightness(primary, 22);
    const accentDark = adjustLightness(accent, -16);
    const accentTint = `rgba(${aRgb.r}, ${aRgb.g}, ${aRgb.b}, 0.12)`;
    const accentBorder = `rgba(${aRgb.r}, ${aRgb.g}, ${aRgb.b}, 0.35)`;

    let styleEl = document.getElementById('nb-dynamic-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'nb-dynamic-theme-style';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      :root {
        --nb-primary: ${primary};
        --nb-primary-rgb: ${pRgb.r}, ${pRgb.g}, ${pRgb.b};
        --nb-primary-hover: ${primaryHover};
        --nb-accent: ${accent};
        --nb-accent-rgb: ${aRgb.r}, ${aRgb.g}, ${aRgb.b};
        --nb-accent-dark: ${accentDark};
        --nb-accent-tint: ${accentTint};
        --nb-accent-border: ${accentBorder};
      }

      /* 1. Global text & background mapping */
      body {
        color: var(--nb-primary);
      }

      /* 2. Primary Color Overrides */
      .bg-\\[\\#2B2437\\], .bg-\\[\\#2b2437\\],
      .bg-brand-primary, .bg-shell-navy, .bg-nb2-ink {
        background-color: var(--nb-primary) !important;
      }

      .bg-\\[\\#3D334E\\], .bg-\\[\\#3d334e\\],
      .bg-shell-tab-active {
        background-color: var(--nb-primary-hover) !important;
      }

      .text-\\[\\#2B2437\\], .text-\\[\\#2b2437\\],
      .text-brand-primary, .text-shell-navy, .text-primary, .text-nb2-ink {
        color: var(--nb-primary) !important;
      }

      .border-\\[\\#2B2437\\], .border-\\[\\#2b2437\\],
      .border-brand-primary {
        border-color: var(--nb-primary) !important;
      }

      .ring-\\[\\#2B2437\\], .ring-\\[\\#2b2437\\] {
        --tw-ring-color: var(--nb-primary) !important;
      }

      /* 3. Accent Color Overrides */
      .bg-\\[\\#F5B55C\\], .bg-\\[\\#f5b55c\\],
      .bg-\\[\\#E39026\\], .bg-\\[\\#e39026\\],
      .bg-brand-accent, .bg-ad-accent, .bg-nb2-amber {
        background-color: var(--nb-accent) !important;
      }

      .text-\\[\\#F5B55C\\], .text-\\[\\#f5b55c\\],
      .text-\\[\\#E39026\\], .text-\\[\\#e39026\\],
      .text-brand-accent, .text-ad-accent, .text-nb2-amber {
        color: var(--nb-accent) !important;
      }

      .border-\\[\\#F5B55C\\], .border-\\[\\#f5b55c\\],
      .border-\\[\\#E39026\\], .border-\\[\\#e39026\\] {
        border-color: var(--nb-accent) !important;
      }

      .ring-\\[\\#F5B55C\\], .ring-\\[\\#f5b55c\\],
      .ring-\\[\\#E39026\\], .ring-\\[\\#e39026\\] {
        --tw-ring-color: var(--nb-accent) !important;
      }

      /* 4. Real-time SVG Icons Stroke & Fill (Iconsax, Lucide, React Icons) */
      svg [stroke="#2B2437"], svg [stroke="#2b2437"],
      svg[stroke="#2B2437"], svg[stroke="#2b2437"] {
        stroke: var(--nb-primary) !important;
      }

      svg [fill="#2B2437"], svg [fill="#2b2437"],
      svg[fill="#2B2437"], svg[fill="#2b2437"] {
        fill: var(--nb-primary) !important;
      }

      svg [stroke="#F5B55C"], svg [stroke="#f5b55c"],
      svg [stroke="#E39026"], svg [stroke="#e39026"],
      svg[stroke="#F5B55C"], svg[stroke="#f5b55c"],
      svg[stroke="#E39026"], svg[stroke="#e39026"] {
        stroke: var(--nb-accent) !important;
      }

      svg [fill="#F5B55C"], svg [fill="#f5b55c"],
      svg [fill="#E39026"], svg [fill="#e39026"],
      svg[fill="#F5B55C"], svg[fill="#f5b55c"],
      svg[fill="#E39026"], svg[fill="#e39026"] {
        fill: var(--nb-accent) !important;
      }

      /* 5. Tailwind Opacity variants */
      [class*="bg-\\[\\#2B2437\\]\\/"], [class*="bg-\\[\\#2b2437\\]\\/"] {
        background-color: rgba(var(--nb-primary-rgb), 0.92) !important;
      }

      [class*="border-\\[\\#F5B55C\\]\\/"], [class*="border-\\[\\#f5b55c\\]\\/"],
      [class*="border-\\[\\#E39026\\]\\/"], [class*="border-\\[\\#e39026\\]\\/"] {
        border-color: rgba(var(--nb-accent-rgb), 0.6) !important;
      }

      [class*="bg-\\[\\#F5B55C\\]\\/"], [class*="bg-\\[\\#f5b55c\\]\\/"],
      [class*="bg-\\[\\#E39026\\]\\/"], [class*="bg-\\[\\#e39026\\]\\/"] {
        background-color: rgba(var(--nb-accent-rgb), 0.15) !important;
      }

      /* 6. Gradients */
      [class*="from-\\[\\#2B2437\\]"], [class*="from-\\[\\#2b2437\\]"] {
        --tw-gradient-from: var(--nb-primary) var(--tw-gradient-from-position) !important;
        --tw-gradient-to: rgba(var(--nb-primary-rgb), 0) var(--tw-gradient-to-position) !important;
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
      }

      [class*="to-\\[\\#2B2437\\]"], [class*="to-\\[\\#2b2437\\]"], [class*="to-\\[\\#1E1927\\]"] {
        --tw-gradient-to: var(--nb-primary) var(--tw-gradient-to-position) !important;
      }

      [class*="from-\\[\\#F59E0B\\]"], [class*="from-\\[\\#F5B55C\\]"], [class*="from-\\[\\#E39026\\]"] {
        --tw-gradient-from: var(--nb-accent) var(--tw-gradient-from-position) !important;
        --tw-gradient-to: rgba(var(--nb-accent-rgb), 0) var(--tw-gradient-to-position) !important;
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
      }

      [class*="to-\\[\\#E39026\\]"], [class*="to-\\[\\#F5B55C\\]"] {
        --tw-gradient-to: var(--nb-accent-dark) var(--tw-gradient-to-position) !important;
      }

      /* 7. Flow B (nb2) Color Tokens */
      .nb2-root {
        --nb2-ink: var(--nb-primary) !important;
        --nb2-amber: var(--nb-accent) !important;
        --nb2-amber-dark: var(--nb-accent-dark) !important;
        --nb2-amber-tint: var(--nb-accent-tint) !important;
        --nb2-amber-line: var(--nb-accent-border) !important;
      }

      /* 8. Budget range slider thumb */
      .custom-budget-range::-webkit-slider-thumb,
      .custom-budget-range::-moz-range-thumb {
        border-color: var(--nb-accent) !important;
      }
    `;
  }, []);

  // Update styles immediately when colors change
  useEffect(() => {
    updateDynamicStyles(primaryColor, accentColor);
    try {
      localStorage.setItem('nb_theme_primary', primaryColor);
      localStorage.setItem('nb_theme_accent', accentColor);
    } catch {
      // Ignore
    }
  }, [primaryColor, accentColor, updateDynamicStyles]);

  const setPrimaryColor = (color) => {
    if (!color) return;
    setPrimaryColorState(color);
  };

  const setAccentColor = (color) => {
    if (!color) return;
    setAccentColorState(color);
  };

  const applyPreset = (preset) => {
    if (!preset) return;
    setPrimaryColorState(preset.primary);
    setAccentColorState(preset.accent);
  };

  const resetTheme = () => {
    setPrimaryColorState(DEFAULT_PRIMARY);
    setAccentColorState(DEFAULT_ACCENT);
  };

  // Find active preset if matched
  const activePreset = THEME_PRESETS.find(
    (p) =>
      p.primary.toLowerCase() === primaryColor.toLowerCase() &&
      p.accent.toLowerCase() === accentColor.toLowerCase()
  );

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        accentColor,
        setPrimaryColor,
        setAccentColor,
        applyPreset,
        resetTheme,
        activePresetId: activePreset?.id || null,
        isCustomizerOpen,
        setIsCustomizerOpen,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
