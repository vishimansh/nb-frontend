import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeFeedData from '../data/homeFeedData.json';
import categoryFeedData from '../data/categoryFeedData.json';
import TopNavShell from '../components/home/TopNavShell';
import BottomTabBar from '../components/home/BottomTabBar';
import SelfPromoBanner from '../components/home/SelfPromoBanner';
import HeroArticleCard from '../components/home/HeroArticleCard';
import FeedCard, { CATEGORY_PALETTES } from '../components/home/FeedCard';
import NativeFeedAd from '../components/home/NativeFeedAd';
import CategorySectionHeader from '../components/home/CategorySectionHeader';
import CategoryFeedContent from '../components/home/CategoryFeedContent';
import CityFilterHeader from '../components/city/CityFilterHeader';
import CityFeedContent from '../components/city/CityFeedContent';
import { useFeed } from '../context/FeedContext';
import { useOnboarding } from '../context/OnboardingContext';
import { CANONICAL_CATEGORY_ORDER } from '../theme/categoryMeta';

export default function HomePage() {
  const navigate = useNavigate();
  const feedScrollRef = useRef(null);
  const { activeCategory, goToCategory } = useFeed();
  const { selectedCategories = [] } = useOnboarding();

  // If state category is active, redirect cleanly to /state
  useEffect(() => {
    if (activeCategory === 'state') {
      navigate('/state', { replace: true });
    }
  }, [activeCategory, navigate]);

  const { heroStory, topStories, categories, ads } = homeFeedData;

  // Active category list in custom user order (synced with draggable category tabs)
  const fallbackCategories = [
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

  const activeCategoryIds = (
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories
      : fallbackCategories
  );

  const activeCategoryList = activeCategoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean);

  // Reset scroll when switching category
  useEffect(() => {
    if (feedScrollRef.current) {
      feedScrollRef.current.scrollTo({
        top: 0,
        behavior: activeCategory === 'top_news' ? 'smooth' : 'instant',
      });
    }
  }, [activeCategory]);

  const handleCategorySelect = (tabId) => {
    if (tabId === activeCategory && tabId === 'top_news' && feedScrollRef.current) {
      feedScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToCategory(tabId);
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative overflow-hidden select-none">
      {/* 1. Fixed Top Navigation Shell (Sticky Top) */}
      <TopNavShell activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />

      {/* 2-Tier Hyperlocal City Filter Header (Tier 1 Saved Cities + Tier 2 Zone Strip) */}
      {activeCategory === 'city' && <CityFilterHeader />}

      {/* 2. Vertically Scrollable Feed Canvas */}
      <main
        ref={feedScrollRef}
        className="flex-1 w-full overflow-y-auto scrollbar-none bg-[#F7F7F4]"
      >
        {activeCategory === 'city' ? (
          /* Hyperlocal City News Feed */
          <CityFeedContent onCategoryClick={goToCategory} />
        ) : activeCategory === 'top_news' ? (
          /* Full Mixed Home Feed */
          <div className="pb-24">
            {/* 1. Self-Promo Ad Banner (386×120) */}
            <div className="flex justify-center my-2">
              <SelfPromoBanner />
            </div>

            {/* 2. Hero Story Card (386×284 with live ticker) */}
            <div className="flex justify-center my-2">
              <HeroArticleCard story={heroStory} />
            </div>

            {/* 3. Top News Block (5 Standard Cards + 1 Sponsored Card) */}
            <section aria-label="प्रमुख समाचार" className="my-2 space-y-2 flex flex-col items-center">
              {topStories.map((story) => (
                <FeedCard
                  key={story.id}
                  id={story.id}
                  category={CATEGORY_PALETTES[story.categoryId]}
                  headline={story.title}
                  thumbnail={story.imageUrl}
                  publishedAgo={story.publishedAt}
                  readTime={story.readTime}
                  onCategoryClick={goToCategory}
                  isSponsored={story.isSponsored || story.categoryId === 'sponsored'}
                />
              ))}
            </section>

            {/* 4. Native Feed Ad 1 (Fixed separator before category sections) */}
            {ads[0] && activeCategoryList.length > 0 && (
              <div className="flex justify-center my-2">
                <NativeFeedAd ad={ads[0]} />
              </div>
            )}

            {/* 5. Dynamic Category Sections & Recurring Ad Cadence */}
            {activeCategoryList.map((cat, index) => {
              const isMultipleOf3 = (index + 1) % 3 === 0;
              const adIndex = Math.floor((index + 1) / 3);
              const adToRender = isMultipleOf3 && ads.length > 0 ? ads[adIndex % ads.length] : null;

              return (
                <React.Fragment key={cat.id}>
                  <section aria-label={cat.label || cat.id} className="my-2 flex flex-col items-center">
                    <div className="w-[386px]">
                      <CategorySectionHeader category={cat} onCategoryClick={goToCategory} />
                    </div>
                    <div className="space-y-2 mt-1">
                      {cat.articles.slice(0, 3).map((article) => (
                        <FeedCard
                          key={article.id}
                          id={article.id}
                          category={cat}
                          headline={article.title}
                          thumbnail={article.imageUrl}
                          publishedAgo={article.publishedAt}
                          readTime={article.readTime}
                          onCategoryClick={goToCategory}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Recurring Ad every 3 sections (no trailing ad for incomplete groups) */}
                  {adToRender && (
                    <div className="flex justify-center my-2">
                      <NativeFeedAd ad={adToRender} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          /* Single Filtered Category View (Exactly 5 Cards) */
          <div className="pb-24 pt-2">
            <CategoryFeedContent
              articles={
                categoryFeedData[activeCategory] ||
                categories.find((c) => c.id === activeCategory)?.articles ||
                []
              }
              categoryId={activeCategory}
              onCategoryClick={goToCategory}
            />
          </div>
        )}
      </main>

      {/* 3. Fixed Bottom Tab Bar ('होम' stays active in all category views) */}
      <BottomTabBar activeTab="home" />
    </div>
  );
}
