import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book1, Tag, Calendar, Profile2User, ArrowDown2, ArrowUp2, CloseCircle, Filter, Man, Woman, ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

const NEWS_CATEGORIES = [
  'मनोरंजन',
  'लाइफस्टाइल',
  'खेल',
  'तकनीक',
  'ऑटो',
  'शिक्षा',
  'ज्योतिष',
  'व्यापार',
  'स्वास्थ्य',
];

const OCCASIONS = [
  'दिवाली',
  'होली',
  'नवरात्रि',
  'शादी का सीजन',
  'परीक्षा का समय',
  'बुवाई सीजन',
  'कटाई सीजन',
  'मानसून',
];

const GENDERS = [
  { id: 'men', label: 'पुरुष', icon: Man },
  { id: 'women', label: 'महिला', icon: Woman },
  { id: 'all', label: 'सभी पाठक', icon: Profile2User },
];

const AGE_BRACKETS = [
  { id: 'genz', label: '18-27 वर्ष' },
  { id: 'millennial', label: '28-43 वर्ष' },
  { id: 'genx', label: '44-59 वर्ष' },
  { id: 'senior', label: '60+ वर्ष' },
];

export default function AdvertiserAudienceScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();

  const [selectedCategories, setSelectedCategories] = useState(
    draftCampaign.selectedCategories && draftCampaign.selectedCategories.length > 0
      ? draftCampaign.selectedCategories
      : ['लाइफस्टाइल']
  );
  const [keywords, setKeywords] = useState(draftCampaign.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState(
    draftCampaign.selectedFestivals || []
  );
  const [gender, setGender] = useState(draftCampaign.gender || 'all');
  const [selectedAges, setSelectedAges] = useState(
    draftCampaign.selectedGenerations || ['genz', 'millennial', 'genx', 'senior']
  );

  const [openSections, setOpenSections] = useState({
    categories: true,
    keywords: true,
    occasions: true,
    demographics: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const baseReach =
    draftCampaign.baseReach ||
    (draftCampaign.targetingType === 'radius'
      ? draftCampaign.radiusKm === 5
        ? 24500
        : draftCampaign.radiusKm === 15
        ? 62800
        : draftCampaign.radiusKm === 20
        ? 75000
        : draftCampaign.radiusKm === 25
        ? 89500
        : 79984
      : 125000);

  const genderMultiplier = gender === 'men' ? 0.52 : gender === 'women' ? 0.48 : 1.0;
  const ageMultiplier = Math.max(0.25, (selectedAges.length / 4));
  const categoryBonus = selectedCategories.length > 0 ? Math.min(1.0, 0.72 + selectedCategories.length * 0.05) : 1.0;
  const calculatedReach = Math.max(1200, Math.round(baseReach * genderMultiplier * ageMultiplier * categoryBonus));

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleToggleOccasion = (occ) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const handleToggleAge = (ageId) => {
    setSelectedAges((prev) => {
      if (prev.includes(ageId)) {
        return prev.length > 1 ? prev.filter((a) => a !== ageId) : prev;
      }
      return [...prev, ageId];
    });
  };

  const handleProceed = () => {
    updateDraftCampaign({
      selectedCategories,
      keywords,
      selectedFestivals: selectedOccasions,
      gender,
      selectedGenerations: selectedAges,
      audienceReach: calculatedReach,
    });

    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/creative');
    }
  };

  const handleSkip = () => {
    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/creative');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="4"
        totalSteps="7"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/targeting');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-3.5 pb-8">
        <div className="space-y-3">
          {/* Title Header Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
              <Filter size={24} color="#E39026" variant="Bold" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#2B2437] leading-tight">
                विज्ञापन किनको दिखाना है?
              </h1>
              <p className="text-[13px] text-[#6B7280] font-normal mt-0.5 leading-snug">
                पसंद, उम्र और जेंडर के हिसाब से चुनें
              </p>
            </div>
          </div>

          {/* Estimated Reach Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center justify-between">
            <div className="text-[13px] font-medium text-[#6B7280] leading-snug">
              फ़िल्टर के साथ<br />अनुमानित पहुंच (Reach):
            </div>
            <div className="text-right">
              <div className="text-[22px] font-bold text-[#2B2437] tracking-tight leading-tight">
                ~{calculatedReach.toLocaleString('en-IN')}
              </div>
              <div className="text-[13px] font-medium text-[#6B7280] leading-tight">
                लोग
              </div>
            </div>
          </div>

          {/* Accordion 1: पसंदीदा विषय */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs transition-all">
            <div
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                  <Book1 size={20} color="#E39026" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight">
                    पसंदीदा विषय
                  </h2>
                  <span className="text-[12px] text-[#6B7280] font-normal leading-none">
                    कैटेगरी चुनें
                  </span>
                </div>
              </div>
              <div className="text-[#2B2437] ml-2 shrink-0">
                {openSections.categories ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
              </div>
            </div>

            {openSections.categories && (
              <div className="pt-3.5 border-t border-[#F3F4F6] mt-3.5">
                <div className="flex flex-wrap gap-2">
                  {NEWS_CATEGORIES.map((cat) => {
                    const isSel = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`h-[34px] px-4 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                            : 'bg-white text-[#2B2437] border border-[#D1D5DB] hover:border-[#2B2437]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: मुख्य कीवर्ड */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs transition-all">
            <div
              onClick={() => toggleSection('keywords')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                  <Tag size={20} color="#E39026" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight">
                    कीवर्ड (Keywords)
                  </h2>
                  <span className="text-[12px] text-[#6B7280] font-normal leading-none">
                    बिज़नेस से जुड़े शब्द
                  </span>
                </div>
              </div>
              <div className="text-[#2B2437] ml-2 shrink-0">
                {openSections.keywords ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
              </div>
            </div>

            {openSections.keywords && (
              <div className="pt-3.5 border-t border-[#F3F4F6] mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5 bg-white border border-[#D1D5DB] rounded-[14px] px-3.5 h-[50px] focus-within:border-[#2B2437] transition-all">
                  <Tag size={18} color="#6B7280" />
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="कीवर्ड लिखें और Enter दबाएं..."
                    className="flex-1 bg-transparent text-[14px] outline-none text-[#2B2437] placeholder-[#9CA3AF] font-medium"
                  />
                </div>

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1.5 bg-[#FFF9EE] border border-[#FDE68A] text-[#2B2437] text-[12px] font-medium px-3 py-1 rounded-full"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-[#9CA3AF] hover:text-[#DC2626] cursor-pointer"
                        >
                          <CloseCircle size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion 3: त्योहार व अवसर */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs transition-all">
            <div
              onClick={() => toggleSection('occasions')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                  <Calendar size={20} color="#E39026" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight">
                    त्योहार व अवसर
                  </h2>
                  <span className="text-[12px] text-[#6B7280] font-normal leading-none">
                    सीजन या खास मौके
                  </span>
                </div>
              </div>
              <div className="text-[#2B2437] ml-2 shrink-0">
                {openSections.occasions ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
              </div>
            </div>

            {openSections.occasions && (
              <div className="pt-3.5 border-t border-[#F3F4F6] mt-3.5">
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => {
                    const isSel = selectedOccasions.includes(occ);
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => handleToggleOccasion(occ)}
                        className={`h-[34px] px-4 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                            : 'bg-white text-[#2B2437] border border-[#D1D5DB] hover:border-[#2B2437]'
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Accordion 4: उम्र और लिंग */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs transition-all">
            <div
              onClick={() => toggleSection('demographics')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                  <Profile2User size={20} color="#E39026" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight">
                    उम्र और लिंग
                  </h2>
                  <span className="text-[12px] text-[#6B7280] font-normal leading-none">
                    जेंडर और एज ग्रुप
                  </span>
                </div>
              </div>
              <div className="text-[#2B2437] ml-2 shrink-0">
                {openSections.demographics ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
              </div>
            </div>

            {openSections.demographics && (
              <div className="pt-3.5 border-t border-[#F3F4F6] mt-3.5 space-y-4">
                {/* लिंग */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#2B2437] mb-2">
                    जेंडर चुनें
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDERS.map((g) => {
                      const isSel = gender === g.id;
                      const IconComponent = g.icon;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGender(g.id)}
                          className={`py-2.5 px-2 rounded-[14px] border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#2B2437] bg-[#2B2437] text-white shadow-xs font-semibold'
                              : 'border-[#D1D5DB] bg-white text-[#2B2437] hover:border-[#2B2437] font-medium'
                          }`}
                        >
                          <IconComponent size={18} color={isSel ? '#FFFFFF' : '#2B2437'} variant={isSel ? 'Bold' : 'Linear'} />
                          <span className="text-[13px]">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* आयु वर्ग */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#2B2437] mb-2">
                    उम्र चुनें
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AGE_BRACKETS.map((bracket) => {
                      const isSel = selectedAges.includes(bracket.id);
                      return (
                        <button
                          key={bracket.id}
                          type="button"
                          onClick={() => handleToggleAge(bracket.id)}
                          className={`py-2.5 px-3 rounded-[14px] border text-center transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#2B2437] bg-[#2B2437] text-white shadow-xs font-semibold'
                              : 'border-[#D1D5DB] bg-white text-[#2B2437] hover:border-[#2B2437] font-medium'
                          }`}
                        >
                          <span className="text-[13px] block">{bracket.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full h-[50px] rounded-[16px] bg-white border border-[#D1D5DB] text-[#2B2437] font-medium text-[15px] shadow-2xs hover:bg-[#2B2437]/5 flex items-center justify-center cursor-pointer active:scale-[0.99] transition-all"
          >
            अभी छोड़ें (Skip)
          </button>
        </div>
      </div>
    </div>
  );
}
