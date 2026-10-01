import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ToastV2Provider } from '../../context/ToastV2Context';
import { AdvertiserV2Provider } from '../../context/AdvertiserV2Context';
import S05_YourAd from '../../screens/S05_YourAd';
import S04_Format from '../../screens/S04_Format';

describe('Render S05_YourAd directly', () => {
  beforeEach(() => {
    // Mock localStorage for node environment
    const store = {};
    global.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('renders S05_YourAd without throwing error', () => {
    expect(() => {
      const html = renderToString(
        <ToastV2Provider>
          <AdvertiserV2Provider>
            <S05_YourAd onOpenFacilitator={() => {}} />
          </AdvertiserV2Provider>
        </ToastV2Provider>
      );
      expect(html).toContain('मीडिया');
    }).not.toThrow();
  });

  it('renders S04_Format without throwing error', () => {
    expect(() => {
      const html = renderToString(
        <ToastV2Provider>
          <AdvertiserV2Provider>
            <S04_Format onOpenFacilitator={() => {}} />
          </AdvertiserV2Provider>
        </ToastV2Provider>
      );
      expect(html).toContain('विज्ञापन का प्रकार');
    }).not.toThrow();
  });

  it('renders AdPreview for all 5 MVP formats without throwing', async () => {
    const { default: AdPreview } = await import('../../components/ad/AdPreview');
    const formats = ['video_ad', 'grid_ad', 'carousel_ad', 'feed_card_ad', 'sponsored_ad'];

    formats.forEach((fmt) => {
      expect(() => {
        const html = renderToString(
          <ToastV2Provider>
            <AdPreview
              format={fmt}
              shop={{ name: 'शर्मा स्वीट्स' }}
              headline="टेस्ट हेडलाइन"
              description="टेस्ट विवरण"
              ctaLabel="और जानें"
            />
          </ToastV2Provider>
        );
        expect(html.length).toBeGreaterThan(50);
      }).not.toThrow();
    });
  });

  it('renders FormatMiniPhone for all 5 MVP formats without throwing', async () => {
    const { default: FormatMiniPhone } = await import('../../components/ad/FormatMiniPhone');
    const formats = ['video_ad', 'grid_ad', 'carousel_ad', 'feed_card_ad', 'sponsored_ad'];

    formats.forEach((fmt) => {
      expect(() => {
        const html = renderToString(
          <FormatMiniPhone formatId={fmt} shopName="शर्मा स्वीट्स" />
        );
        expect(html.length).toBeGreaterThan(50);
      }).not.toThrow();
    });
  });
});

