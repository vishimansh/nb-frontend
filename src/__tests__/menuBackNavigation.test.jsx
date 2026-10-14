import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import MenuScreen from '../pages/MenuScreen';
import { OnboardingProvider } from '../context/OnboardingContext';
import { AdvertiserProvider } from '../context/AdvertiserContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('MenuScreen back navigation animation behavior', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
    global.sessionStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('renders MenuScreen directly without slide-in when returning from subscreen', () => {
    sessionStorage.setItem('nb_menu_subscreen_active', 'true');

    const html = renderToString(
      <MemoryRouter initialEntries={[{ pathname: '/menu', state: { returnedFromChild: true } }]}>
        <ThemeProvider>
          <OnboardingProvider>
            <AdvertiserProvider>
              <MenuScreen />
            </AdvertiserProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(html).toContain('मेनू');
    expect(html).toContain('मेरी सामग्री');
    expect(html).toContain('ऐप सेटिंग्स');
  });
});
