import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArchiveBook, ArrowRight } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import FeedCard from '../components/home/FeedCard';
import { useSavedArticles } from '../context/SavedArticlesContext';
import supremeCourtImg from '../assets/cards/supreme-court.jpg';

/**
 * SavedArticlesPage (/saved)
 * Accessible via Menu Screen ("सेव की गई खबरें").
 * Displays all news articles saved by the user via the article screen bookmark button or feed card 3-dots menu.
 */
export default function SavedArticlesPage() {
  const navigate = useNavigate();
  const { savedArticles } = useSavedArticles();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

      {/* Header Bar */}
      <header className="px-4 py-3 flex items-center justify-between bg-[#F7F7F4] border-b border-[#E5E7EB] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            सेव की गई खबरें
          </h1>
        </div>

        {savedArticles.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-[#2B2437] text-white text-[12px] font-bold shadow-2xs">
            {savedArticles.length} {savedArticles.length === 1 ? 'खबर' : 'खबरें'}
          </span>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-none px-4 py-3">
        {savedArticles.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
            <div className="w-20 h-20 rounded-[24px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-4 shadow-xs">
              <ArchiveBook size={40} color="#E39026" variant="Bold" />
            </div>

            <h2 className="text-[18px] font-bold text-[#2B2437] mb-1.5">
              कोई सेव की गई खबर नहीं है
            </h2>

            <p className="text-[13px] text-[#6B7280] font-normal leading-relaxed max-w-[280px] mb-6">
              अपनी पसंदीदा खबरों को बाद में पढ़ने के लिए खबर के 3-डॉट्स मेनू या बुकमार्क बटन से सेव करें।
            </p>

            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="h-[46px] px-6 rounded-[14px] bg-[#2B2437] text-white text-[14px] font-bold flex items-center gap-2 shadow-sm hover:bg-[#3D334E] active:scale-95 transition-all cursor-pointer"
            >
              <span>ताज़ा खबरें पढ़ें</span>
              <ArrowRight size={16} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          /* List of Saved Article Cards */
          <div className="space-y-3 pb-16 flex flex-col items-center">
            {savedArticles.map((article) => (
              <div key={article.id} className="w-full max-w-[386px]">
                <FeedCard
                  id={article.id}
                  headline={article.headline}
                  thumbnail={article.thumbnail || supremeCourtImg}
                  category={article.category}
                  publishedAgo={article.publishedAgo}
                  readTime={article.readTime}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
