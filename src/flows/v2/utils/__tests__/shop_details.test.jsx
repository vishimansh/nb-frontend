import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import S02_ShopDetails from '../../screens/S02_ShopDetails';
import { AdvertiserV2Provider } from '../../context/AdvertiserV2Context';
import { ToastV2Provider } from '../../context/ToastV2Context';
import FlowV2App from '../../FlowV2App';

describe('S02_ShopDetails UI and Structure', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('renders shop details screen with title, verified phone, required fields and sticky CTA', () => {
    const savedState = {
      nav: { current: 'shop', history: ['intro', 'shop'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: {
        name: 'शर्मा स्वीट्स',
        categoryId: 'restaurant',
        city: 'इंदौर',
        cityId: 'indore',
        pincode: '452001',
      },
      draft: {
        goal: 'engagement',
        ctaKey: 'whatsapp_us',
        format: 'banner_card_ad',
        media: { images: [], video: null },
      },
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(
      <ToastV2Provider>
        <AdvertiserV2Provider>
          <S02_ShopDetails />
        </AdvertiserV2Provider>
      </ToastV2Provider>
    );

    // Title
    expect(html).toContain('आपकी दुकान की जानकारी');

    // Verified badge
    expect(html).toContain('9876543210');
    expect(html).toContain('वेरिफाइड');

    // Required fields
    expect(html).toContain('दुकान का नाम');
    expect(html).toContain('शर्मा स्वीट्स');
    expect(html).toContain('दुकान किस चीज़ की है?');
    expect(html).toContain('रेस्टोरंट');
    expect(html).toContain('पिन कोड');
    expect(html).toContain('452001');

    // Resolved city
    expect(html).toContain('इंदौर');

    // Optional section
    expect(html).toContain('और जानकारी (वैकल्पिक)');

    // CTA
    expect(html).toContain('आगे बढ़ें');
  });

  it('renders in FlowV2App when current screen is shop', () => {
    const savedState = {
      nav: { current: 'shop', history: ['intro', 'shop'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: {},
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(<FlowV2App />);
    expect(html).toContain('आपकी दुकान की जानकारी');
    expect(html).toContain('दुकान का नाम');
  });
});
