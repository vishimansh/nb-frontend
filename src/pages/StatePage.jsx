import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavShell from '../components/home/TopNavShell';
import BottomTabBar from '../components/home/BottomTabBar';
import StateFilterBar from '../components/state/StateFilterBar';
import StateFeedContent from '../components/state/StateFeedContent';
import StateEmptyState from '../components/state/StateEmptyState';
import { useOnboarding } from '../context/OnboardingContext';
import { useFeed } from '../context/FeedContext';
import stateNewsData from '../data/stateNewsData.json';

export default function StatePage() {
  const navigate = useNavigate();
  const feedScrollRef = useRef(null);
  const { goToCategory } = useFeed();
  const {
    selectedStates,
    activeStateId,
    setActiveStateId,
    startAtomicEdit,
  } = useOnboarding();

  // Scroll to top on state switch
  useEffect(() => {
    if (feedScrollRef.current) {
      feedScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeStateId]);

  // Ensure activeStateId matches available selectedStates
  useEffect(() => {
    if (selectedStates.length > 0 && (!activeStateId || !selectedStates.some((s) => s.id === activeStateId))) {
      setActiveStateId(selectedStates[0].id);
    }
  }, [selectedStates, activeStateId, setActiveStateId]);

  const handleEditClick = () => {
    startAtomicEdit();
    navigate('/edit/select-state');
  };

  const activeStateObj = selectedStates.find((s) => s.id === activeStateId) || selectedStates[0];
  const activeStateName = activeStateObj?.name || 'राज्य';
  const effectiveStateId = activeStateObj?.id || 'mp';
  let filteredArticles = stateNewsData.articles.filter((a) => a.stateId === effectiveStateId);

  if (filteredArticles.length === 0) {
    filteredArticles = [
      {
        id: `state-gen-${effectiveStateId}-1`,
        stateId: effectiveStateId,
        category: 'विकास',
        categoryColor: '#16A34A',
        title: `${activeStateName} में आगामी वित्तीय वर्ष के लिए बजट प्राथमिकताओं पर कैबिनेट की अहम बैठक संपन्न`,
        publishedAt: '30 मिनट पहले',
        readTime: '3 मिनट पढ़ें',
        imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: `state-gen-${effectiveStateId}-2`,
        stateId: effectiveStateId,
        category: 'प्रशासन',
        categoryColor: '#B6783A',
        title: `${activeStateName} में सुशासन और जन कल्याणकारी योजनाओं की जमीनी समीक्षा के लिए जिलाधिकारियों को निर्देश`,
        publishedAt: '1 घंटा पहले',
        readTime: '2 मिनट पढ़ें',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80',
      },
    ];
  }

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative overflow-hidden select-none">
      {/* 1. Fixed Top Navigation Shell */}
      <TopNavShell activeCategory="state" onSelectCategory={goToCategory} />

      {/* 2. Single-Tier State Chip Filter (Fixed directly below top shell, matching CityFilterHeader) */}
      {selectedStates.length > 0 && (
        <StateFilterBar
          states={selectedStates}
          activeStateId={activeStateId}
          onSelectState={(id) => setActiveStateId(id)}
          onEditClick={handleEditClick}
        />
      )}

      {/* 3. Content Viewport */}
      <div
        ref={feedScrollRef}
        className="flex-1 w-full overflow-y-auto scrollbar-none bg-[#F7F7F4] flex flex-col"
      >
        {selectedStates.length === 0 ? (
          <StateEmptyState onSelectStateClick={handleEditClick} />
        ) : (
          /* State Articles List */
          <StateFeedContent
            articles={filteredArticles}
            activeStateName={activeStateName}
            onCategoryClick={goToCategory}
          />
        )}
      </div>

      {/* 3. Fixed Bottom Tab Bar */}
      <BottomTabBar activeTab="home" />
    </div>
  );
}
