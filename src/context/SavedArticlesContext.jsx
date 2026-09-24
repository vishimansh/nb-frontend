import React, { createContext, useContext, useState, useEffect } from 'react';

export const SavedArticlesContext = createContext(null);

export function SavedArticlesProvider({ children }) {
  const [savedArticles, setSavedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_saved_articles_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Keep localStorage synchronized
  useEffect(() => {
    try {
      localStorage.setItem('nb_saved_articles_list', JSON.stringify(savedArticles));
      // Also maintain ID array for compatibility with older components
      const ids = savedArticles.map((a) => String(a.id || a.headline));
      localStorage.setItem('nb_saved_articles', JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save articles to localStorage', e);
    }
  }, [savedArticles]);

  const isArticleSaved = (idOrHeadline) => {
    if (!idOrHeadline) return false;
    const str = String(idOrHeadline);
    return savedArticles.some(
      (a) => String(a.id) === str || String(a.headline) === str
    );
  };

  const saveArticle = (article) => {
    if (!article) return;
    const targetId = String(article.id || article.headline);
    setSavedArticles((prev) => {
      const exists = prev.some(
        (a) => String(a.id) === targetId || String(a.headline) === String(article.headline)
      );
      if (exists) return prev;

      return [
        {
          id: article.id || `saved-${Date.now()}`,
          headline: article.headline || article.title || 'शीर्षक उपलब्ध नहीं',
          thumbnail: article.thumbnail || article.imageUrl || null,
          category: article.category || 'टॉप न्यूज़',
          publishedAgo: article.publishedAgo || 'अभी-अभी',
          readTime: article.readTime || '3 मिनट पढ़ें',
          savedAt: Date.now(),
        },
        ...prev,
      ];
    });
  };

  const removeSavedArticle = (idOrHeadline) => {
    if (!idOrHeadline) return;
    const str = String(idOrHeadline);
    setSavedArticles((prev) =>
      prev.filter((a) => String(a.id) !== str && String(a.headline) !== str)
    );
  };

  const toggleSaveArticle = (article) => {
    if (!article) return false;
    const targetId = String(article.id || article.headline);
    const alreadySaved = savedArticles.some(
      (a) => String(a.id) === targetId || String(a.headline) === String(article.headline)
    );

    if (alreadySaved) {
      removeSavedArticle(targetId);
      return false;
    } else {
      saveArticle(article);
      return true;
    }
  };

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        isArticleSaved,
        saveArticle,
        removeSavedArticle,
        toggleSaveArticle,
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
