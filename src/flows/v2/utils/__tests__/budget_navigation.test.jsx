import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import FlowV2App from '../../FlowV2App';
import StickyCTA from '../../components/chrome/StickyCTA';
import S07_Budget from '../../screens/S07_Budget';
import { ToastV2Provider } from '../../context/ToastV2Context';
import { AdvertiserV2Provider } from '../../context/AdvertiserV2Context';

describe('S07_Budget "इलाका और बजट चुनें" screen and StickyCTA arrow button tests', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('StickyCTA renders label, arrow, and handles both prop formats', () => {
    let clicked = false;
    const html1 = renderToString(
      <StickyCTA
        label="आगे बढ़ें"
        onClick={() => { clicked = true; }}
        showArrow={true}
      />
    );
    expect(html1).toContain('आगे बढ़ें');
    expect(html1).toContain('lucide-arrow-right');

    const html2 = renderToString(
      <StickyCTA
        primaryLabel="आगे बढ़ें"
        onPrimary={() => { clicked = true; }}
        stickySubtitle="कुल ₹2,065 (GST सहित)"
        secondaryLabel="बिल देखें"
        showArrow={true}
      />
    );
    expect(html2).toContain('आगे बढ़ें');
    expect(html2).toContain('lucide-arrow-right');
    expect(html2).toContain('कुल ₹2,065 (GST सहित)');
    expect(html2).toContain('बिल देखें');
  });

  it('renders S07_Budget screen with title "इलाका और बजट चुनें", CTA label, arrow, and total with GST', () => {
    const savedState = {
      nav: { current: 'budget', history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget'], direction: 'forward' },
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', city: 'इंदौर', cityId: 'indore', pincode: '452001' },
      draft: {
        goal: 'engagement',
        ctaKey: 'whatsapp_us',
        format: 'feed_card_ad',
        media: { images: [{ dataUrl: 'data:image/png;base64,sample', name: 'banner.png' }], video: null },
        headline: 'स्पेशल मिठाई',
        description: 'स्वादिष्ट मिठाई',
        contactValue: '9876543210',
        linkUrl: '',
        area: { radiusKm: 10, manualCityIds: [], excludedCityIds: [] },
        budget: { packageId: 'standard', dailyAmount: 250, days: 7, startMode: 'after_review', startDate: null },
      },
    };
    localStorage.setItem('nb2_state', JSON.stringify(savedState));

    const html = renderToString(<FlowV2App />);
    expect(html).toContain('इलाका और बजट चुनें');
    expect(html).toContain('अनुमानित पाठक संख्या');
    expect(html).toContain('विज्ञापन का दायरा');
    expect(html.indexOf('अनुमानित पाठक संख्या')).toBeLessThan(html.indexOf('1. विज्ञापन का दायरा'));
    expect(html).toContain('बजट और अवधि तय करें');
    expect(html).toContain('आगे बढ़ें');
    expect(html).toContain('lucide-arrow-right');
    expect(html).toContain('बिल देखें');
    expect(html).toContain('वापस जाएँ');
  });
});
