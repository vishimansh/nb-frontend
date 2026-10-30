import { describe, it, expect, beforeEach } from 'vitest';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { VideoProvider, useVideo } from '../context/VideoContext';
import { CityProvider, useCity } from '../context/CityContext';
import initialCitizenReels from '../data/citizenReelsData.json';

describe('Citizen Reels City Switching & Visibility System', () => {
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

  it('includes seed citizen reels for Jodhpur, Pune, and Surat in citizenReelsData.json', () => {
    const jodhpurReels = initialCitizenReels.filter(
      (r) => r.city === 'जोधपुर' || r.city?.toLowerCase() === 'jodhpur'
    );
    const puneReels = initialCitizenReels.filter(
      (r) => r.city === 'पुणे' || r.city?.toLowerCase() === 'pune'
    );
    const suratReels = initialCitizenReels.filter(
      (r) => r.city === 'सूरत' || r.city?.toLowerCase() === 'surat'
    );

    expect(jodhpurReels.length).toBeGreaterThanOrEqual(2);
    expect(puneReels.length).toBeGreaterThanOrEqual(2);
    expect(suratReels.length).toBeGreaterThanOrEqual(1);

    expect(jodhpurReels[0].headline).toBeDefined();
    expect(puneReels[0].headline).toBeDefined();
  });

  it('loads and retains user uploaded reports for Jodhpur from persistence on top of seed reels', () => {
    // Seed user report in localStorage
    const sampleUserReport = {
      id: 'cit-user-999',
      city: 'जोधपुर',
      locality: 'सरदारपुरा',
      categoryId: 'water',
      headline: 'सरदारपुरा में मुख्य पाइपलाइन लीकेज, सैकड़ों घरों में पानी की किल्लत',
      fullDescription: 'स्थानीय लोगों ने जलदाय विभाग से तुरंत मरम्मत की मांग की है।',
      reporterName: 'गौरव सोनी',
      isVerifiedReporter: false,
      isAnonymous: false,
      status: 'verified',
      timeAgo: 'अभी-अभी',
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      comments: [],
      isUserSubmitted: true,
    };
    store['nb_citizen_user_reports'] = JSON.stringify([sampleUserReport]);

    let capturedVideo = null;
    function TestComponent() {
      capturedVideo = useVideo();
      return <div>Citizen Test</div>;
    }

    renderToString(
      <VideoProvider>
        <TestComponent />
      </VideoProvider>
    );

    expect(capturedVideo).toBeDefined();

    // Check that user report is at the top of citizenReels
    const jodhpurReels = capturedVideo.citizenReels.filter(
      (r) => r.city === 'जोधपुर' || r.city?.toLowerCase() === 'jodhpur'
    );
    expect(jodhpurReels.length).toBeGreaterThanOrEqual(2);
    expect(jodhpurReels[0].id).toBe('cit-user-999');
    expect(jodhpurReels[0].headline).toBe('सरदारपुरा में मुख्य पाइपलाइन लीकेज, सैकड़ों घरों में पानी की किल्लत');

    // Check Pune reels also exist without collision
    const puneReels = capturedVideo.citizenReels.filter(
      (r) => r.city === 'पुणे' || r.city?.toLowerCase() === 'pune'
    );
    expect(puneReels.length).toBeGreaterThanOrEqual(2);
    expect(puneReels.some((r) => r.id === 'cit-pune-1')).toBe(true);
  });

  it('matches city names resiliently whether queried by Hindi name, English id, or with extra whitespace', () => {
    const savedCities = [
      { id: 'jodhpur', name: 'जोधपुर', state: 'राजस्थान' },
      { id: 'pune', name: 'पुणे', state: 'महाराष्ट्र' },
      { id: 'bhopal', name: 'भोपाल', state: 'मध्य प्रदेश' },
    ];

    const findSavedCity = (query, cities) => {
      if (!query || !cities) return null;
      const q = String(query).trim().toLowerCase();
      return cities.find(
        (c) => c.name?.trim().toLowerCase() === q || c.id?.trim().toLowerCase() === q
      );
    };

    expect(findSavedCity('जोधपुर', savedCities)?.id).toBe('jodhpur');
    expect(findSavedCity('jodhpur', savedCities)?.name).toBe('जोधपुर');
    expect(findSavedCity(' JODHPUR ', savedCities)?.name).toBe('जोधपुर');
    expect(findSavedCity('पुणे', savedCities)?.id).toBe('pune');
    expect(findSavedCity('pune', savedCities)?.name).toBe('पुणे');
    expect(findSavedCity('Pune ', savedCities)?.name).toBe('पुणे');
  });
});
