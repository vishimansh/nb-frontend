import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThemeProvider,
  useTheme,
  DEFAULT_PRIMARY,
  DEFAULT_ACCENT,
  THEME_PRESETS,
  hexToRgb,
  adjustLightness,
} from '../context/ThemeContext';
import ColorPickerWidget from '../components/theme/ColorPickerWidget';

describe('Dynamic Color Picker & Theme System', () => {
  let store = {};

  beforeEach(() => {
    store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
      clear: () => {
        store = {};
      },
    };
  });

  it('correctly converts hex colors to RGB values', () => {
    const plumRgb = hexToRgb('#2B2437');
    expect(plumRgb.r).toBe(43);
    expect(plumRgb.g).toBe(36);
    expect(plumRgb.b).toBe(55);

    const goldRgb = hexToRgb('#F5B55C');
    expect(goldRgb.r).toBe(245);
    expect(goldRgb.g).toBe(181);
    expect(goldRgb.b).toBe(92);
  });

  it('correctly calculates adjusted lightness for hover and darker shades', () => {
    const lighter = adjustLightness('#000000', 50);
    expect(lighter).toBe('#000000');
    const lightened = adjustLightness('#202020', 20);
    expect(lightened).toBe('#262626');
  });

  it('provides default primary and accent colors via ThemeContext', () => {
    let captured = null;
    function Consumer() {
      captured = useTheme();
      return <div>Theme Test</div>;
    }

    renderToString(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(captured).toBeDefined();
    expect(captured.primaryColor).toBe(DEFAULT_PRIMARY);
    expect(captured.accentColor).toBe(DEFAULT_ACCENT);
    expect(captured.presets.length).toBe(THEME_PRESETS.length);
  });

  it('renders ColorPickerWidget trigger with dual primary and accent color dots', () => {
    const html = renderToString(
      <ThemeProvider>
        <ColorPickerWidget />
      </ThemeProvider>
    );

    expect(html).toContain('Color Picker');
    expect(html).toContain(DEFAULT_PRIMARY);
    expect(html).toContain(DEFAULT_ACCENT);
  });

  it('renders interactive 2D color picker and rainbow hue slider when open', () => {
    const html = renderToString(
      <ThemeProvider initialOpen={true}>
        <ColorPickerWidget />
      </ThemeProvider>
    );

    // Should contain Primary and Accent tabs
    expect(html).toContain('Primary');
    expect(html).toContain('Accent');
    // Should contain current HEX value
    expect(html).toContain(DEFAULT_PRIMARY);
    // Should contain rainbow hue slider gradient
    expect(html).toContain('linear-gradient(to right, #ff0000');
  });
});
