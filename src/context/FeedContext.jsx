import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

export const FeedContext = createContext(null);

const SUPPORTED_CONTENT_CATEGORIES = [
  'city',
  'state',
  'politics',
  'entertainment',
  'sports',
  'business',
  'tech',
  'education',
  'astro',
  'health',
  'lifestyle',
  'auto',
];

const INERT_TABS = [];

export { SUPPORTED_CONTENT_CATEGORIES, INERT_TABS };

export function FeedProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();

  const isCityPath = location.pathname === '/city';
  const isStatePath = location.pathname === '/state';
  const queryCat = searchParams.get('cat');
  const urlCategory = isCityPath
    ? 'city'
    : isStatePath
      ? 'state'
      : (queryCat && (SUPPORTED_CONTENT_CATEGORIES.includes(queryCat) || queryCat === 'top_news' || queryCat === 'top-news'))
        ? (queryCat === 'top-news' ? 'top_news' : queryCat)
        : (slug && SUPPORTED_CONTENT_CATEGORIES.includes(slug) ? slug : null);

  const [internalCategory, setInternalCategory] = useState('top_news');

  const activeCategory = urlCategory || internalCategory;

  const goToCategory = useCallback((categoryId) => {
    if (!categoryId) return;

    const target = categoryId === 'top-news' ? 'top_news' : categoryId;

    if (INERT_TABS.includes(target)) {
      return;
    }

    if (target === 'top_news') {
      setInternalCategory('top_news');
      navigate('/feed');
      return;
    }

    if (target === 'city') {
      setInternalCategory('city');
      navigate('/city');
      return;
    }

    if (target === 'state') {
      setInternalCategory('state');
      navigate('/state');
      return;
    }

    if (SUPPORTED_CONTENT_CATEGORIES.includes(target)) {
      setInternalCategory(target);
      navigate(`/feed?cat=${target}`);
    }
  }, [navigate]);

  return (
    <FeedContext.Provider value={{ activeCategory, goToCategory }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}
