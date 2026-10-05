import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SavedArticlesProvider, useSavedArticles } from '../context/SavedArticlesContext';
import LiveArticleHero from '../components/article/LiveArticleHero';
import { MemoryRouter } from 'react-router-dom';

describe('Offline Article Download and Saved News Flow', () => {
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

  it('renders LiveArticleHero with download button instead of save/bookmark', () => {
    const html = renderToString(
      <SavedArticlesProvider>
        <MemoryRouter>
          <LiveArticleHero
            hero={{ caption: 'टेस्ट खबर', imageUrl: 'https://example.com/test.jpg' }}
            isLive={true}
            isDownloaded={false}
            articleId="test-123"
          />
        </MemoryRouter>
      </SavedArticlesProvider>
    );

    // Should contain offline download aria-label or title
    expect(html).toContain('ऑफलाइन डाउनलोड करें');
  });

  it('renders LiveArticleHero downloaded state with downloaded aria-label and check indicator', () => {
    const html = renderToString(
      <SavedArticlesProvider>
        <MemoryRouter>
          <LiveArticleHero
            hero={{ caption: 'टेस्ट खबर', imageUrl: 'https://example.com/test.jpg' }}
            isLive={false}
            isDownloaded={true}
            articleId="test-123"
          />
        </MemoryRouter>
      </SavedArticlesProvider>
    );

    expect(html).toContain('डाउनलोड किया गया (ऑफलाइन उपलब्ध)');
  });

  it('correctly persists downloaded article metadata and full content to localStorage', () => {
    let contextValue = null;
    function TestConsumer() {
      contextValue = useSavedArticles();
      return <div>Test</div>;
    }

    renderToString(
      <SavedArticlesProvider>
        <TestConsumer />
      </SavedArticlesProvider>
    );

    expect(contextValue).toBeDefined();

    const sampleCard = {
      id: 'art-offline-01',
      headline: 'सुप्रीम कोर्ट का ऐतिहासिक फैसला',
      category: 'देश',
      readTime: '4 मिनट पढ़ें',
    };

    const sampleFullArticle = {
      id: 'art-offline-01',
      headline: 'सुप्रीम कोर्ट का ऐतिहासिक फैसला',
      subheading: 'नागरिकों के अधिकारों पर विशेष निर्णय',
      bodyBlocks: [
        { type: 'paragraph', text: 'यह पहला पैराग्राफ है।' },
        { type: 'paragraph', text: 'यह दूसरा पैराग्राफ है।' },
      ],
    };

    // Download article
    contextValue.downloadArticle(sampleCard, sampleFullArticle);

    // Verify localStorage has both metadata list and offline article map
    const savedList = JSON.parse(store['nb_saved_articles_list'] || '[]');
    expect(savedList.length).toBe(1);
    expect(savedList[0].id).toBe('art-offline-01');
    expect(savedList[0].headline).toBe('सुप्रीम कोर्ट का ऐतिहासिक फैसला');

    const offlineMap = JSON.parse(store['nb_offline_articles_map'] || '{}');
    expect(offlineMap['art-offline-01']).toBeDefined();
    expect(offlineMap['art-offline-01'].bodyBlocks.length).toBe(2);
    expect(offlineMap['art-offline-01'].subheading).toBe('नागरिकों के अधिकारों पर विशेष निर्णय');

    // Verify lookup helpers
    expect(contextValue.isArticleDownloaded('art-offline-01')).toBe(true);
    const retrieved = contextValue.getOfflineArticle('art-offline-01');
    expect(retrieved.headline).toBe('सुप्रीम कोर्ट का ऐतिहासिक फैसला');
  });
});
