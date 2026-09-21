import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microphone2, DocumentText, SearchNormal1 } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useOnboarding } from '../context/OnboardingContext';
import trendingData from '../data/trendingSearchData.json';
import SearchNewsCard from '../components/search/SearchNewsCard';
import SearchEmptyState from '../components/search/SearchEmptyState';
import { StatueHeritageIcon, IndiaMapOutlineIcon, TrendUpArrowIcon } from '../components/search/SearchIcons';
import bhopalSkyline from '../assets/illustrations/bhopal_skyline_amber.png';
import indiaSkyline from '../assets/illustrations/india_skyline_blue.png';

export default function SearchPage() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const rawCity = onboarding?.selectedCities?.[0];
  const currentCity =
    typeof rawCity === 'object' && rawCity !== null
      ? (rawCity.city || 'भोपाल')
      : (typeof rawCity === 'string' && rawCity ? rawCity : 'भोपाल');

  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Top News dataset prepared for search with breaking and standard variants
  const searchNewsList = useMemo(() => {
    return [
      {
        id: "sn-1",
        isBreakingNews: true,
        category: { id: "sports", label: "खेल", color: "#557E63" },
        location: "भोपाल",
        headline: "भोपाल में राज्य स्तरीय हॉकी मुकाबलों का रोमांचक आगाज, मेजबान टीम ने पहले मैच में 3-1 से दर्ज की जीत",
        thumbnail: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=400&q=80",
        timestamp: "5 मिनट पहले",
        readTimeMinutes: 3
      },
      {
        id: "sn-2",
        isBreakingNews: false,
        category: { id: "politics", label: "राजनीति", color: "#B6783A" },
        location: "नई दिल्ली",
        headline: "संसद के आगामी सत्र में पेश होंगे तीन बड़े डिजिटल सुधार विधेयक, विपक्षी दलों ने बनाई संयुक्त रणनीति",
        thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
        timestamp: "15 मिनट पहले",
        readTimeMinutes: 3
      },
      {
        id: "sn-3",
        isBreakingNews: false,
        category: { id: "business", label: "बिज़नेस", color: "#497877" },
        location: "मुंबई",
        headline: "शेयर बाजार में नया ऐतिहासिक रिकॉर्ड, सेंसेक्स पहली बार 83,000 के पार और निफ्टी नई ऊंचाई पर",
        thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80",
        timestamp: "25 मिनट पहले",
        readTimeMinutes: 3
      },
      {
        id: "sn-4",
        isBreakingNews: false,
        category: { id: "city", label: "शहर", color: "#F5B55C" },
        location: "भोपाल",
        headline: "भोपाल मेट्रो का सुभाष नगर से करोंद तक विस्तार तेज, दूसरे चरण के सर्वे और टेंडर प्रक्रिया पूरी",
        thumbnail: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=400&q=80",
        timestamp: "35 मिनट पहले",
        readTimeMinutes: 3
      },
      {
        id: "sn-5",
        isBreakingNews: false,
        category: { id: "education", label: "शिक्षा", color: "#5B6D8A" },
        location: "भोपाल",
        headline: "मध्य प्रदेश के 500 से अधिक सीएम राइज स्कूलों में स्मार्ट क्लास और रोबोटिक्स लैब शुरू",
        thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80",
        timestamp: "45 मिनट पहले",
        readTimeMinutes: 3
      }
    ];
  }, []);

  // Autocomplete candidate keywords
  const candidates = useMemo(() => [
    "भारी बारिश अलर्ट",
    "भोपाल मेट्रो",
    "तालाब ओवरफ्लो",
    "यूजीसी आंदोलन",
    "नीति आयोग रिपोर्ट",
    "रक्षाबंधन",
    currentCity,
    "मध्य प्रदेश",
    "बिज़नेस",
    "राजनीति"
  ].filter((item) => typeof item === 'string' && item.trim().length > 0), [currentCity]);

  // Filter autocomplete suggestions based on query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return candidates.slice(0, 6);
    }
    return candidates.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [candidates, searchQuery]);

  // Handle Speech Recognition for Hindi voice search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('वॉइस सर्च इस ब्राउज़र में उपलब्ध नहीं है।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript || '';
        setSearchQuery(text);
        setIsInputFocused(true);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleChipClick = (label) => {
    setSearchQuery(label);
    setIsInputFocused(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F4] select-none overflow-hidden relative">
      {/* 1. Fixed Search Header Bar with 54px Status Bar Clearance */}
      <div className="px-4 py-3 bg-[#F7F7F4] flex items-center gap-2.5 shrink-0 sticky top-0 z-30 pt-[54px]">
        {/* Left Boxed Back Button (46px × 46px rounded-[14px] matching Figma) */}
        <BackButton ariaLabel="पीछे जाएं" />

        {/* Center Search Input Wrapper (No magnifying icon, clean text placeholder, 14px radius, 46px height) */}
        <div className="h-[46px] bg-white rounded-[14px] border border-[#D1D5DB] px-4 flex items-center focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 shadow-2xs flex-1 transition-all">
          <input
            type="text"
            placeholder="किसी खबर, विषय या शहर को खोजें"
            value={searchQuery}
            onFocus={() => setIsInputFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-[13.5px] font-medium text-[#2B2437] placeholder-[#64748B] bg-transparent outline-none w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsInputFocused(false);
              }}
              aria-label="खोज साफ़ करें"
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#2B2437] text-xs font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Voice Search Button (46px × 46px rounded-[14px] bg-[#2B2437]) */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          aria-label="वॉइस सर्च"
          className={`w-[46px] h-[46px] rounded-[14px] bg-[#2B2437] flex items-center justify-center text-white shadow-xs cursor-pointer active:scale-95 flex-shrink-0 transition-all ${
            isListening ? 'animate-pulse ring-2 ring-[#F5B55C]' : ''
          }`}
        >
          <Microphone2 size={20} color="#FFFFFF" variant="Linear" />
        </button>
      </div>

      {/* 2. Body Viewport: Landing State vs Active Autocomplete */}
      {!isInputFocused && searchQuery.length === 0 ? (
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* Section 1 & 2: Visual Trending Cards (370px × 120px) */}
          <div className="w-full flex flex-col items-center pt-2.5 space-y-2.5">
            {/* City Trending Card: 370px × 120px */}
            <div className="w-[370px] h-[120px] min-h-[120px] max-h-[120px] rounded-[20px] bg-white border border-[#E5E7EB] p-3 px-3.5 relative overflow-hidden shadow-2xs flex flex-col justify-center gap-[18px]">
              {/* Background Silhouette Artwork: Redesigned Warm Amber Bhopal Skyline (Raja Bhoj, Taj-ul-Masajid & Cable Bridge) */}
              <img
                src={bhopalSkyline}
                alt="Bhopal Skyline"
                className="absolute right-0 bottom-0 h-[100px] w-auto max-w-[285px] object-contain object-bottom pointer-events-none select-none z-0 opacity-80"
              />

              {/* Card Header Row */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-[30px] h-[30px] rounded-full bg-[#FFF9EE] border border-[#F5B55C] flex items-center justify-center text-[#F5B55C] flex-shrink-0 shadow-2xs">
                  <StatueHeritageIcon size={17} color="#F5B55C" />
                </div>
                <h2 className="text-[15px] font-bold text-[#2B2437] leading-none">{currentCity} में ट्रेंडिंग</h2>
              </div>

              {/* Chips Row */}
              <div className="flex items-center gap-2 relative z-10 overflow-x-auto scrollbar-none pb-0.5">
                {trendingData.cityTrending.chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip.label)}
                    className="h-[32px] px-3 rounded-full bg-white/95 backdrop-blur-[2px] border border-[#D5D7DA] flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-[12px] font-medium text-[#2B2437] hover:border-[#2B2437] cursor-pointer shrink-0"
                  >
                    <TrendUpArrowIcon size={16} color="#F5B55C" />
                    <span className="whitespace-nowrap pt-[1px]">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* National Trending Card: 370px × 120px */}
            <div className="w-[370px] h-[120px] min-h-[120px] max-h-[120px] rounded-[20px] bg-white border border-[#E5E7EB] p-3 px-3.5 relative overflow-hidden shadow-2xs flex flex-col justify-center gap-[18px]">
              {/* Background Silhouette Artwork: Redesigned Slate-Blue National Heritage Skyline (India Gate, Gopuram, Qutub Minar, Taj Mahal, Chakra) */}
              <img
                src={indiaSkyline}
                alt="India Skyline"
                className="absolute right-0 bottom-0 h-[96px] w-auto max-w-[290px] object-contain object-bottom pointer-events-none select-none z-0 opacity-80"
              />

              {/* Card Header Row */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-[30px] h-[30px] rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#2B2437] flex-shrink-0 shadow-2xs">
                  <IndiaMapOutlineIcon size={17} color="#2B2437" />
                </div>
                <h2 className="text-[15px] font-bold text-[#2B2437] leading-none">देश-प्रदेश में ट्रेंडिंग</h2>
              </div>

              {/* Chips Row */}
              <div className="flex items-center gap-2 relative z-10 overflow-x-auto scrollbar-none pb-0.5">
                {trendingData.nationalTrending.chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip.label)}
                    className="h-[32px] px-3 rounded-full bg-white/95 backdrop-blur-[2px] border border-[#D5D7DA] flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-[12px] font-medium text-[#2B2437] hover:border-[#2B2437] cursor-pointer shrink-0"
                  >
                    <TrendUpArrowIcon size={16} color="#2B2437" />
                    <span className="whitespace-nowrap pt-[1px]">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: "प्रमुख खबरें" (Single Surface Container: 386px width, white bg) */}
          <div className="w-[386px] min-w-[386px] max-w-[386px] mx-auto mt-4 bg-white border border-[#D1D5DB] rounded-[24px] px-2 pt-3.5 pb-4 shadow-2xs mb-24 flex flex-col items-center">
            {/* Header Row: 370px aligned with cards */}
            <div className="w-[370px] flex items-center gap-2 mb-3 px-1">
              <div className="w-7 h-7 rounded-[9px] bg-[#FFF9EE] border border-[#F5B55C] flex items-center justify-center text-[#F5B55C] shadow-2xs flex-shrink-0">
                <DocumentText size={16} variant="Bold" color="#F5B55C" />
              </div>
              <h2 className="text-[17px] font-bold text-[#2B2437] leading-none">प्रमुख खबरें</h2>
            </div>

            {/* News Card List: exactly 370px, exactly like home feed cards */}
            <div className="w-full flex flex-col items-center space-y-2">
              {searchNewsList.map((story) => (
                <SearchNewsCard key={story.id} story={story} isSearchScreen={true} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Autocomplete / Empty State */
        <div className="flex-1 bg-white px-4 py-2 overflow-y-auto scrollbar-none">
          {/* Dismiss keyboard / return to landing action */}
          <div className="flex items-center justify-between py-1.5 border-b border-[#F1F3F5] text-xs text-[#9CA3AF]">
            <span>सुझाव</span>
            <button
              type="button"
              onClick={() => {
                setIsInputFocused(false);
              }}
              className="text-[#2B2437] font-medium hover:underline cursor-pointer"
            >
              रद्द करें
            </button>
          </div>

          {filteredSuggestions.length > 0 ? (
            <div className="divide-y divide-[#F1F3F5]">
              {filteredSuggestions.map((item, idx) => {
                const queryIndex = searchQuery
                  ? item.toLowerCase().indexOf(searchQuery.toLowerCase())
                  : -1;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item);
                      setIsInputFocused(false);
                    }}
                    className="h-[50px] flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors px-1"
                  >
                    <div className="flex items-center gap-3">
                      <SearchNormal1 className="text-[#9CA3AF] shrink-0" size={15} />
                      <span className="text-[14px]">
                        {queryIndex >= 0 ? (
                          <>
                            <span className="text-[#4B5563]">
                              {item.slice(0, queryIndex)}
                            </span>
                            <span className="font-bold text-[#2B2437]">
                              {item.slice(queryIndex, queryIndex + searchQuery.length)}
                            </span>
                            <span className="text-[#4B5563]">
                              {item.slice(queryIndex + searchQuery.length)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#2B2437]">{item}</span>
                        )}
                      </span>
                    </div>
                    <span className="text-xs text-[#CBD5E1] font-bold">↗</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <SearchEmptyState />
          )}
        </div>
      )}
    </div>
  );
}
