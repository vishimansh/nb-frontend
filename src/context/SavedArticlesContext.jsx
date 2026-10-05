import React, { createContext, useContext, useState, useEffect } from 'react';

export const SavedArticlesContext = createContext(null);

export function SavedArticlesProvider({ children }) {
  // 1. Saved / Downloaded Articles Metadata List for /saved page
  const [savedArticles, setSavedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_saved_articles_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved articles list', e);
    }
    return [];
  });

  // 2. Full Offline Articles Map { [articleId]: fullArticleData }
  const [offlineArticlesMap, setOfflineArticlesMap] = useState(() => {
    try {
      const map = localStorage.getItem('nb_offline_articles_map');
      if (map) {
        const parsed = JSON.parse(map);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse offline articles map', e);
    }
    return {};
  });

  // 3. Reactive Online/Offline Network Status
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync savedArticles list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nb_saved_articles_list', JSON.stringify(savedArticles));
      // Maintain ID array for compatibility with older components
      const ids = savedArticles.map((a) => String(a.id || a.headline));
      localStorage.setItem('nb_saved_articles', JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save articles to localStorage', e);
    }
  }, [savedArticles]);

  // Sync offlineArticlesMap to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nb_offline_articles_map', JSON.stringify(offlineArticlesMap));
    } catch (e) {
      console.warn('Failed to save offline articles map to localStorage', e);
    }
  }, [offlineArticlesMap]);

  const isArticleDownloaded = (idOrHeadline) => {
    if (!idOrHeadline) return false;
    const str = String(idOrHeadline);
    if (
      savedArticles.some((a) => String(a.id) === str || String(a.headline) === str) ||
      !!offlineArticlesMap[str]
    ) {
      return true;
    }
    // Reliable fallback to localStorage cache
    try {
      const storedMap = JSON.parse(localStorage.getItem('nb_offline_articles_map') || '{}');
      if (storedMap[str]) return true;
      const storedList = JSON.parse(localStorage.getItem('nb_saved_articles_list') || '[]');
      return storedList.some((a) => String(a.id) === str || String(a.headline) === str);
    } catch {
      return false;
    }
  };

  const isArticleSaved = isArticleDownloaded;

  const downloadArticle = (cardData, fullArticleData) => {
    if (!cardData && !fullArticleData) return;
    const targetId = String(
      cardData?.id || fullArticleData?.id || cardData?.headline || fullArticleData?.headline
    );

    const summaryItem = {
      id: targetId,
      headline:
        cardData?.headline ||
        fullArticleData?.headline ||
        fullArticleData?.title ||
        'शीर्षक उपलब्ध नहीं',
      thumbnail:
        cardData?.thumbnail ||
        fullArticleData?.hero?.imageUrl ||
        fullArticleData?.thumbnail ||
        null,
      category: cardData?.category || fullArticleData?.category || 'टॉप न्यूज़',
      publishedAgo: cardData?.publishedAgo || fullArticleData?.publishedAgo || 'अभी-अभी',
      readTime: cardData?.readTime || fullArticleData?.readTime || '3 मिनट पढ़ें',
      isDownloaded: true,
      downloadedAt: Date.now(),
      savedAt: Date.now(),
    };

    setSavedArticles((prev) => {
      const exists = prev.some(
        (a) => String(a.id) === targetId || String(a.headline) === String(summaryItem.headline)
      );
      return exists
        ? prev.map((a) =>
            String(a.id) === targetId || String(a.headline) === String(summaryItem.headline)
              ? { ...a, ...summaryItem }
              : a
          )
        : [summaryItem, ...prev];
    });

    try {
      const currentSaved = JSON.parse(localStorage.getItem('nb_saved_articles_list') || '[]');
      const exists = currentSaved.some(
        (a) => String(a.id) === targetId || String(a.headline) === String(summaryItem.headline)
      );
      const nextSaved = exists
        ? currentSaved.map((a) =>
            String(a.id) === targetId || String(a.headline) === String(summaryItem.headline)
              ? { ...a, ...summaryItem }
              : a
          )
        : [summaryItem, ...currentSaved];
      localStorage.setItem('nb_saved_articles_list', JSON.stringify(nextSaved));
      localStorage.setItem(
        'nb_saved_articles',
        JSON.stringify(nextSaved.map((a) => String(a.id || a.headline)))
      );
    } catch (e) {
      console.warn('Failed to sync to localStorage', e);
    }

    if (fullArticleData) {
      const offlineItem = {
        ...fullArticleData,
        id: targetId,
        isDownloaded: true,
        downloadedAt: Date.now(),
      };
      setOfflineArticlesMap((prev) => ({
        ...prev,
        [targetId]: offlineItem,
      }));
      try {
        const currentMap = JSON.parse(localStorage.getItem('nb_offline_articles_map') || '{}');
        currentMap[targetId] = offlineItem;
        localStorage.setItem('nb_offline_articles_map', JSON.stringify(currentMap));
      } catch (e) {
        console.warn('Failed to sync offlineArticlesMap', e);
      }
    }
  };

  const removeDownloadedArticle = (idOrHeadline) => {
    if (!idOrHeadline) return;
    const str = String(idOrHeadline);
    setSavedArticles((prev) =>
      prev.filter((a) => String(a.id) !== str && String(a.headline) !== str)
    );
    try {
      const currentSaved = JSON.parse(localStorage.getItem('nb_saved_articles_list') || '[]');
      const nextSaved = currentSaved.filter((a) => String(a.id) !== str && String(a.headline) !== str);
      localStorage.setItem('nb_saved_articles_list', JSON.stringify(nextSaved));
      localStorage.setItem(
        'nb_saved_articles',
        JSON.stringify(nextSaved.map((a) => String(a.id || a.headline)))
      );
    } catch (e) {
      console.warn('Failed to remove from localStorage', e);
    }

    setOfflineArticlesMap((prev) => {
      const next = { ...prev };
      delete next[str];
      return next;
    });
    try {
      const currentMap = JSON.parse(localStorage.getItem('nb_offline_articles_map') || '{}');
      delete currentMap[str];
      localStorage.setItem('nb_offline_articles_map', JSON.stringify(currentMap));
    } catch (e) {
      console.warn('Failed to remove from offlineArticlesMap', e);
    }
  };

  const toggleDownloadArticle = (cardData, fullArticleData) => {
    const targetId = String(
      cardData?.id || fullArticleData?.id || cardData?.headline || fullArticleData?.headline
    );
    const alreadyDownloaded = isArticleDownloaded(targetId);

    if (alreadyDownloaded) {
      removeDownloadedArticle(targetId);
      return false;
    } else {
      downloadArticle(cardData, fullArticleData);
      return true;
    }
  };

  const getOfflineArticle = (id) => {
    if (!id) return null;
    const str = String(id);
    if (offlineArticlesMap[str]) return offlineArticlesMap[str];
    try {
      const storedMap = JSON.parse(localStorage.getItem('nb_offline_articles_map') || '{}');
      return storedMap[str] || null;
    } catch {
      return null;
    }
  };

  // Backward-compatible methods
  const saveArticle = (article) => downloadArticle(article, article);
  const removeSavedArticle = removeDownloadedArticle;
  const toggleSaveArticle = (article) => toggleDownloadArticle(article, article);

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        downloadedArticles: savedArticles,
        isArticleSaved,
        isArticleDownloaded,
        saveArticle,
        downloadArticle,
        removeSavedArticle,
        removeDownloadedArticle,
        toggleSaveArticle,
        toggleDownloadArticle,
        getOfflineArticle,
        isOffline,
      }}
    >
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext);
  if (!context) {
    throw new Error('useSavedArticles must be used within a SavedArticlesProvider');
  }
  return context;
}
