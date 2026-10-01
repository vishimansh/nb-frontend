import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import FlowV2App from '../../FlowV2App';
import S05_YourAd from '../../screens/S05_YourAd';
import { ToastV2Provider } from '../../context/ToastV2Context';
import { AdvertiserV2Provider } from '../../context/AdvertiserV2Context';
import { FORMATS } from '../../data/formats';

describe('Detailed Flow B test after AD type selection', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  FORMATS.forEach((fmt) => {
    it(`renders S05_YourAd properly for format ${fmt.id}`, () => {
      // Simulate localStorage with format selected
      const savedState = {
        nav: { current: 'ad', history: ['intro', 'shop', 'goal', 'format', 'ad'], direction: 'forward' },
        auth: { phone: '9876543210', otpVerified: true },
        shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', city: 'इंदौर', cityId: 'indore', pincode: '452001' },
        draft: {
          goal: 'engagement',
          ctaKey: 'whatsapp_us',
          format: fmt.id,
          media: { images: [], video: null },
          headline: '',
          description: '',
          contactValue: '9876543210',
          linkUrl: '',
        },
      };
      localStorage.setItem('nb2_state', JSON.stringify(savedState));

      expect(() => {
        const html = renderToString(<FlowV2App />);
        expect(html).toContain('आपका विज्ञापन बनाएँ');
        if (fmt.id === 'feed_card_ad') {
          expect(html).toContain('पूरा बैनर कार्ड ही सीधा लिंक है');
        }
      }).not.toThrow();
    });
  });

  it('feed_card_ad does not require headline or description to submit', () => {
    const savedState = {
      nav: { current: 'ad', history: ['intro', 'shop', 'goal', 'format', 'ad'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', city: 'इंदौर', cityId: 'indore', pincode: '452001' },
      draft: {
        goal: 'engagement',
        ctaKey: 'whatsapp_us',
        format: 'feed_card_ad',
        media: { images: [{ dataUrl: 'data:image/png;base64,sample', name: 'banner.png' }], video: null },
        headline: '',
        description: '',
        contactValue: '9876543210',
        linkUrl: '',
      },
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(<FlowV2App />);
    expect(html).toContain('पूरा बैनर कार्ड ही सीधा लिंक है');
    // Headline field should not be rendered for feed_card_ad
    expect(html).not.toContain('हेडलाइन</label>');
  });
});
