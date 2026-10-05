import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import FlowV2App from '../../FlowV2App';

describe('S08_ReviewPay "विज्ञापन जाँचें और पेमेंट करें" Redesigned Screen Tests', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('renders clean, refined summary, ad preview, and unified checkout card when unverified', () => {
    const savedState = {
      nav: { current: 'review', history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget', 'review'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', city: 'इंदौर', cityId: 'indore', pincode: '452001', address: 'विजय नगर मेन रोड' },
      identity: { verified: false, valueMasked: '', method: null },
      draft: {
        goal: 'engagement',
        ctaKey: 'whatsapp_us',
        format: 'feed_card_ad',
        media: { images: [{ dataUrl: 'data:image/png;base64,sample', name: 'banner.png' }], video: null },
        headline: 'शुद्ध देसी घी की मिठाइयाँ',
        description: 'दिवाली स्पेशल ऑफ़र उपलब्ध है.',
        contactValue: '9876543210',
        linkUrl: '',
        area: { radiusKm: 10, manualCityIds: ['indore'], excludedCityIds: [] },
        budget: { packageId: 'standard', dailyAmount: 250, days: 7, startMode: 'after_review', startDate: null },
      },
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(<FlowV2App />);
    // Title
    expect(html).toContain('विज्ञापन जाँचें और पेमेंट करें');
    // Compact Telemetry
    expect(html).toContain('पाठक');
    expect(html).toContain('इंदौर');
    // Unified summary card
    expect(html).toContain('उद्देश्य व प्रकार');
    expect(html).toContain('इलाका');
    expect(html).toContain('दुकान');
    expect(html).toContain('बजट और दिन');
    // Identity verification
    expect(html).toContain('एक बार पहचान की जाँच');
    expect(html).toContain('GST नंबर');
    expect(html).toContain('PAN नंबर');
    // Trust reassurance
    expect(html).toContain('100% सुरक्षित भुगतान');
    expect(html).toContain('24 घंटे में अप्रूवल');
  });

  it('renders verified badge with ITC claim note when identity is verified', () => {
    const savedState = {
      nav: { current: 'review', history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget', 'review'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', city: 'इंदौर', cityId: 'indore', pincode: '452001' },
      identity: { verified: true, valueMasked: '23AAAAA1234A1Z5', method: 'gst' },
      draft: {
        goal: 'engagement',
        ctaKey: 'whatsapp_us',
        format: 'feed_card_ad',
        media: { images: [{ dataUrl: 'data:image/png;base64,sample', name: 'banner.png' }], video: null },
        headline: 'शुद्ध देसी घी की मिठाइयाँ',
        description: 'दिवाली स्पेशल ऑफ़र उपलब्ध है.',
        contactValue: '9876543210',
        linkUrl: '',
        area: { radiusKm: 10, manualCityIds: ['indore'], excludedCityIds: [] },
        budget: { packageId: 'standard', dailyAmount: 250, days: 7, startMode: 'after_review', startDate: null },
      },
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(<FlowV2App />);
    expect(html).toContain('पहचान की जाँच पूरी');
    expect(html).toContain('23AAAAA1234A1Z5');
    expect(html).toContain('18% ITC');
    expect(html).toContain('पे करें');
  });
});
