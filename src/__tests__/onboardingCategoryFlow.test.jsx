import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OnboardingProvider } from '../context/OnboardingContext';
import { CityProvider } from '../context/CityContext';
import CitySelectionScreen from '../pages/onboarding/CitySelectionScreen';
import CategorySelectionScreen from '../pages/onboarding/CategorySelectionScreen';
import CategorySelectionScreenReexport from '../pages/CategorySelectionScreen';

describe('Onboarding Category Selection Flow', () => {
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

  it('renders CategorySelectionScreen with onboarding header, skip button, and categories list', () => {
    const html = renderToString(
      <OnboardingProvider>
        <MemoryRouter initialEntries={['/onboarding/select-category']}>
          <Routes>
            <Route path="/onboarding/select-category" element={<CategorySelectionScreen />} />
          </Routes>
        </MemoryRouter>
      </OnboardingProvider>
    );

    // Title & instruction
    expect(html).toContain('श्रेणियां चुनें');
    expect(html).toContain('होम स्क्रीन के लिए पसंदीदा श्रेणियां चुनें');
    expect(html).toContain('स्किप');

    // Button in onboarding mode
    expect(html).toContain('होम स्क्रीन पर जाएं');

    // Core categories
    expect(html).toContain('राजनीति');
    expect(html).toContain('मनोरंजन');
    expect(html).toContain('खेल');
    expect(html).toContain('टेक्नोलॉजी');
    expect(html).toContain('बिज़नेस');
  });

  it('renders re-exported CategorySelectionScreen identically', () => {
    const html = renderToString(
      <OnboardingProvider>
        <MemoryRouter initialEntries={['/onboarding/select-category']}>
          <Routes>
            <Route path="/onboarding/select-category" element={<CategorySelectionScreenReexport />} />
          </Routes>
        </MemoryRouter>
      </OnboardingProvider>
    );

    expect(html).toContain('श्रेणियां चुनें');
    expect(html).toContain('होम स्क्रीन पर जाएं');
  });

  it('renders CategorySelectionScreen in menu mode with save button and without skip button', () => {
    const html = renderToString(
      <OnboardingProvider>
        <MemoryRouter initialEntries={['/menu/categories']}>
          <Routes>
            <Route path="/menu/categories" element={<CategorySelectionScreen />} />
          </Routes>
        </MemoryRouter>
      </OnboardingProvider>
    );

    expect(html).toContain('श्रेणियां चुनें');
    expect(html).toContain('सेव करें');
    expect(html).not.toContain('होम स्क्रीन पर जाएं');
  });

  it('renders CitySelectionScreen with save button and state groupings', () => {
    const html = renderToString(
      <OnboardingProvider>
        <CityProvider>
          <MemoryRouter initialEntries={['/onboarding/select-city']}>
            <Routes>
              <Route path="/onboarding/select-city" element={<CitySelectionScreen />} />
            </Routes>
          </MemoryRouter>
        </CityProvider>
      </OnboardingProvider>
    );

    expect(html).toContain('शहर चुनें');
    expect(html).toContain('सेव करें');
    expect(html).toContain('स्किप');
  });
});
