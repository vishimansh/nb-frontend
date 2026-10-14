import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import ProfileScreen from '../pages/ProfileScreen';
import { OnboardingProvider } from '../context/OnboardingContext';
import { AdvertiserProvider } from '../context/AdvertiserContext';

describe('ProfileScreen Business Profile (Flow B)', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('renders Flow B shop model in Business Profile tab without Flow A Aadhaar/GSTIN', () => {
    // Seed Flow B account in localStorage
    const sampleAccount = {
      phone: '9876543210',
      shop: {
        name: 'शर्मा किराना स्टोर',
        categoryId: 'grocery',
        category: 'किराना',
        pincode: '462001',
        city: 'भोपाल',
        cityId: 'bhopal',
        state: 'मध्य प्रदेश',
        address: 'एम.पी. नगर जोन-2',
        ownerName: 'राजेश शर्मा',
      },
    };
    localStorage.setItem('nb2_account', JSON.stringify(sampleAccount));

    const html = renderToString(
      <MemoryRouter initialEntries={[{ pathname: '/profile', state: { tab: 'business' } }]}>
        <OnboardingProvider>
          <AdvertiserProvider>
            <ProfileScreen />
          </AdvertiserProvider>
        </OnboardingProvider>
      </MemoryRouter>
    );

    // Business tab active
    expect(html).toContain('दुकान का विवरण');
    expect(html).toContain('शर्मा किराना स्टोर');
    expect(html).toContain('किराना');
    expect(html).toContain('462001');
    expect(html).toContain('भोपाल');
    expect(html).toContain('एम.पी. नगर जोन-2');
    expect(html).toContain('राजेश शर्मा');

    // Flow B promotion banner
    expect(html).toContain('नवभारत पर विज्ञापन चलाएं');
    expect(html).toContain('शुरू करें');

    // Flow A enterprise fields must NOT be present
    expect(html).not.toContain('आधार नंबर');
    expect(html).not.toContain('GSTIN');
    expect(html).not.toContain('पहचान एवं कर विवरण');
  });
});
