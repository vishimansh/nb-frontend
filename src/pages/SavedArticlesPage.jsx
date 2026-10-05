import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'iconsax-react';
import { Download, Check, WifiOff } from 'lucide-react';
import BackButton from '../components/common/BackButton';
import FeedCard from '../components/home/FeedCard';
import { useSavedArticles } from '../context/SavedArticlesContext';
import supremeCourtImg from '../assets/cards/supreme-court.jpg';

/**
 * SavedArticlesPage (/saved)
 * Accessible via Menu Screen ("डाउनलोड की गई खबरें").
 * Displays all news articles downloaded by the user via the article screen download button or feed card 3-dots menu.
 * Fully viewable in offline mode without internet connection.
 */
export default function SavedArticlesPage() {
  const navigate = useNavigate();
  const { savedArticles, isOffline } = useSavedArticles();

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

      {/* Offline Status Clearance Banner */}
      {isOffline && (
        <div className="bg-[#FFF9EE] border-b border-[#FDE68A] text-[#92400E] px-4 py-2 flex items-center justify-between text-[11.5px] font-bold z-20 shrink-0">
          <div className="flex items-center gap-1.5">
            <WifiOff size={14} className="text-[#E39026]" />
            <span>ऑफलाइन मोड • डाउनलोड की गई खबरें उपलब्ध हैं</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            बिना इंटरनेट
          </span>
        </div>
      )}

      {/* Header Bar */}
      <header className="px-4 py-3 flex items-center justify-between bg-[#F7F7F4] border-b border-[#E5E7EB] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            डाउनलोड की गई खबरें
          </h1>
        </div>

        {savedArticles.length > 0 && (
          <span className="px-3 py-1 rounded-full bg-[#2B2437] text-white text-[12px] font-bold shadow-2xs flex items-center gap-1.5">
            <Download size={12} strokeWidth={2.5} />
            <span>{savedArticles.length} {savedArticles.length === 1 ? 'खबर' : 'खबरें'}</span>
          </span>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-none px-4 py-3">
        {savedArticles.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16">
            <div className="w-20 h-20 rounded-[24px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-4 shadow-xs">
              <Download size={38} className="text-[#E39026]" strokeWidth={2.2} />
            </div>

            <h2 className="text-[18px] font-bold text-[#2B2437] mb-1.5">
              कोई डाउनलोड की गई खबर नहीं है
            </h2>

            <p className="text-[13px] text-[#6B7280] font-normal leading-relaxed max-w-[290px] mb-6">
              अपनी पसंदीदा खबरों को बिना इंटरनेट (ऑफलाइन) पढ़ने के लिए खबर के डाउनलोड बटन या 3-डॉट्स मेनू से डाउनलोड करें।
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
          /* List of Downloaded Article Cards */
          <div className="space-y-3 pb-16 flex flex-col items-center">
            {savedArticles.map((article) => (
              <div key={article.id} className="w-full max-w-[386px] relative group">
                {/* Offline Available Badge Pill */}
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#10B981]">
                    <span className="w-3.5 h-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full flex items-center justify-center">
                      <Check size={8} className="text-[#059669] stroke-[3.5]" />
                    </span>
                    <span>ऑफलाइन उपलब्ध</span>
                  </div>
                  <span className="text-[10.5px] text-[#94A3B8] font-medium">
                    डाउनलोड किया गया
                  </span>
                </div>

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
