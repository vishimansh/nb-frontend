import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Location, Shop, Buildings, ArrowUp2, ArrowDown2, ArrowRight, Refresh2 } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

const STATE_DATA = {
  mp: {
    id: 'mp',
    name: 'मध्य प्रदेश',
    cities: [
      { id: 'bhopal', name: 'भोपाल', reach: 103435 },
      { id: 'indore', name: 'इंदौर', reach: 98200 },
      { id: 'jabalpur', name: 'जबलपुर', reach: 68400 },
      { id: 'gwalior', name: 'ग्वालियर', reach: 64500 },
      { id: 'ujjain', name: 'उज्जैन', reach: 45000 },
      { id: 'sagar', name: 'सागर', reach: 38000 },
    ],
    totalReach: 417535,
  },
  cg: {
    id: 'cg',
    name: 'छत्तीसगढ़',
    cities: [
      { id: 'raipur', name: 'रायपुर', reach: 89000 },
      { id: 'bilaspur', name: 'बिलासपुर', reach: 54000 },
      { id: 'durg', name: 'दुर्ग-भिलाई', reach: 62000 },
      { id: 'korba', name: 'कोरबा', reach: 41000 },
      { id: 'rajnandgaon', name: 'राजनांदगांव', reach: 32000 },
    ],
    totalReach: 278000,
  },
  mh: {
    id: 'mh',
    name: 'महाराष्ट्र',
    cities: [
      { id: 'mumbai', name: 'मुंबई', reach: 210000 },
      { id: 'pune', name: 'पुणे', reach: 145000 },
      { id: 'nagpur', name: 'नागपुर', reach: 92000 },
      { id: 'nashik', name: 'नाशिक', reach: 68000 },
      { id: 'thane', name: 'ठाणे', reach: 78000 },
      { id: 'aurangabad', name: 'छत्रपति संभाजीनगर', reach: 52000 },
    ],
    totalReach: 645000,
  },
  gj: {
    id: 'gj',
    name: 'गुजरात',
    cities: [
      { id: 'ahmedabad', name: 'अहमदाबाद', reach: 185000 },
      { id: 'surat', name: 'सूरत', reach: 142000 },
      { id: 'vadodara', name: 'वडोदरा', reach: 84000 },
      { id: 'rajkot', name: 'राजकोट', reach: 68000 },
      { id: 'bhavnagar', name: 'भावनगर', reach: 42000 },
    ],
    totalReach: 521000,
  },
  rj: {
    id: 'rj',
    name: 'राजस्थान',
    cities: [
      { id: 'jaipur', name: 'जयपुर', reach: 125000 },
      { id: 'jodhpur', name: 'जोधपुर', reach: 72000 },
      { id: 'kota', name: 'कोटा', reach: 58000 },
      { id: 'udaipur', name: 'उदयपुर', reach: 49000 },
      { id: 'bikaner', name: 'बीकानेर', reach: 38000 },
      { id: 'ajmer', name: 'अजमेर', reach: 44000 },
    ],
    totalReach: 386000,
  },
};

const CITY_LANDMARKS = {
  // MP
  bhopal: ['सिटी मार्केट', 'एम.पी. नगर', 'एम्स एरिया', 'होशंगाबाद रोड'],
  indore: ['राजवाड़ा', 'विजय नगर', 'पलासिया चौक', 'भंवरकुआँ'],
  gwalior: ['बाड़ा बाजार', 'फूलबाग', 'लश्कर चौक', 'मुरार बाजार'],
  jabalpur: ['गोलबाजार', 'गोरखपुर', 'सदर बाजार', 'मदन महल'],
  ujjain: ['महाकाल मंदिर', 'फ्रीगंज', 'नानाखेड़ा', 'टावर चौक'],
  sagar: ['कटरा बाजार', 'सिविल लाइंस', 'मकरोनिया', 'तीन बत्ती'],
  // CG
  raipur: ['घड़ी चौक', 'पंडरी मार्केट', 'तेलीबांधा', 'शंकर नगर'],
  bilaspur: ['व्यापार विहार', 'सिविल लाइंस', 'गोलबाजार', 'लिंक रोड'],
  durg: ['स्टेशन रोड', 'इंदिरा मार्केट', 'सिविक सेंटर', 'नेहरू नगर'],
  korba: ['टी.पी. नगर', 'निहारिका', 'कोसाबाड़ी', 'ट्रांसपोर्ट नगर'],
  rajnandgaon: ['मानपुर चौक', 'गुड़ाखू लाइन', 'सिनेमा लाइन', 'स्टेशन रोड'],
  // MH
  mumbai: ['दादर', 'बांद्रा', 'अंधेरी', 'नरीमन पॉइंट'],
  pune: ['शिवाजी नगर', 'कोथरुड', 'विमान नगर', 'हिंजेवाड़ी'],
  nagpur: ['धरमपेठ', 'सीता बर्डी', 'सदर', 'रामदासपेठ'],
  nashik: ['कॉलेज रोड', 'एमजी रोड', 'पंचवटी', 'गंगापुर रोड'],
  thane: ['नौपाड़ा', 'घोड़बंदर रोड', 'माजीवाड़ा', 'वागले एस्टेट'],
  aurangabad: ['कनॉट प्लेस', 'क्रांति चौक', 'जालना रोड', 'सिडको'],
  // GJ
  ahmedabad: ['आश्रम रोड', 'सीजी रोड', 'मणिनगर', 'प्रहलाद नगर'],
  surat: ['वेसू', 'अठवा गेट', 'रिंग रोड', 'अडजान'],
  vadodara: ['अलकापुरी', 'सयाजीगंज', 'फतेहगंज', 'मांजलपुर'],
  rajkot: ['याज्ञिक रोड', 'कालावड रोड', 'धर्मेन्द्र रोड', 'रैया रोड'],
  bhavnagar: ['वाघावाड़ी रोड', 'घोंघा गेट', 'सरदार नगर', 'कृष्णा नगर'],
  // RJ
  jaipur: ['एमआई रोड', 'मानसरोवर', 'राजा पार्क', 'वैशाली नगर'],
  jodhpur: ['सरदारपुरा', 'रातानाडा', 'शास्त्री नगर', 'नई सड़क'],
  kota: ['गुमानपुरा', 'तलवंडी', 'कोटा बैराज रोड', 'इंद्रा विहार'],
  udaipur: ['फतेह सागर', 'बापू बाजार', 'चेतक सर्कल', 'हिरण मगरी'],
  bikaner: ['कोटगेट', 'केईएम रोड', 'जयनारायण व्यास कॉलोनी', 'गंगाशहर'],
  ajmer: ['दरगाह बाजार', 'कचहरी रोड', 'वैशाली नगर', 'आना सागर'],
  default: ['सिटी मार्केट', 'एम.पी. नगर', 'एम्स एरिया', 'होशंगाबाद रोड'],
};

const RADIUS_REACH_MAP = {
  5: 4120,
  10: 7631,
  15: 14200,
  20: 22800,
  25: 34500,
};

export default function AdvertiserTargetingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();

  const userStateKey = draftCampaign.state || 'mp';

  // Normalize selected cities ensuring they are an array of string IDs
  const rawDistricts = draftCampaign.selectedDistricts;
  const initialCities = Array.isArray(rawDistricts) && rawDistricts.length > 0
    ? rawDistricts.map((item) => (typeof item === 'object' && item !== null ? item.id : String(item)))
    : [typeof draftCampaign.city === 'string' ? draftCampaign.city : (draftCampaign.city?.id || 'bhopal')];

  const [targetingType, setTargetingType] = useState(draftCampaign.targetingType || 'radius');
  const [radiusKm, setRadiusKm] = useState(draftCampaign.radiusKm || 10);
  const [selectedCities, setSelectedCities] = useState(initialCities);

  // Synchronize whole states based on actual full selection
  const [selectedWholeStates, setSelectedWholeStates] = useState(() => {
    if (draftCampaign.isWholeStateSelected && Array.isArray(draftCampaign.selectedStates) && draftCampaign.selectedStates.length > 0) {
      return draftCampaign.selectedStates;
    }
    const initialWhole = [];
    Object.keys(STATE_DATA).forEach((stKey) => {
      const stCities = STATE_DATA[stKey].cities.map((c) => c.id);
      if (stCities.length > 0 && stCities.every((id) => initialCities.includes(id))) {
        initialWhole.push(stKey);
      }
    });
    return initialWhole;
  });

  const [openStates, setOpenStates] = useState({ [userStateKey]: true });

  // Safe landmark resolution
  const activeCityKey =
    typeof draftCampaign.city === 'string'
      ? draftCampaign.city
      : (draftCampaign.city?.id || selectedCities?.[0] || 'bhopal');

  const currentLandmarks =
    CITY_LANDMARKS[activeCityKey] ||
    (selectedCities?.[0] && CITY_LANDMARKS[selectedCities[0]]) ||
    CITY_LANDMARKS.bhopal ||
    ['मुख्य बाजार', 'सिटी सेंटर', 'स्टेशन रोड', 'रिंग रोड'];

  const toggleStateAccordion = (stId) => {
    setOpenStates((prev) => ({
      ...prev,
      [stId]: !prev[stId],
    }));
  };

  // Toggle "पूरा राज्य चुनें"
  const handleToggleState = (stKey) => {
    const targetState = STATE_DATA[stKey];
    if (!targetState) return;
    const targetCityIds = targetState.cities.map((c) => c.id);
    const isStateFullySelected = targetCityIds.every((id) => selectedCities.includes(id));

    if (isStateFullySelected) {
      setSelectedWholeStates((prev) => prev.filter((k) => k !== stKey));
      setSelectedCities((prev) => prev.filter((id) => !targetCityIds.includes(id)));
    } else {
      setSelectedWholeStates((prev) => Array.from(new Set([...prev, stKey])));
      setSelectedCities((prev) => Array.from(new Set([...prev, ...targetCityIds])));
    }
  };

  // Toggle individual city
  const handleToggleCity = (cityId, stKey) => {
    const targetState = STATE_DATA[stKey];
    if (selectedCities.includes(cityId)) {
      const updated = selectedCities.filter((id) => id !== cityId);
      setSelectedCities(updated);
      setSelectedWholeStates((prev) => prev.filter((k) => k !== stKey));
    } else {
      const updated = [...selectedCities, cityId];
      setSelectedCities(updated);
      if (targetState && targetState.cities.every((c) => updated.includes(c.id))) {
        setSelectedWholeStates((prev) => Array.from(new Set([...prev, stKey])));
      }
    }
  };

  // Estimated reach calculation
  let estimatedReach = 0;
  let scopeBadgeLabel = '';

  if (targetingType === 'radius') {
    estimatedReach = RADIUS_REACH_MAP[radiusKm] || Math.round(7631 * (radiusKm / 10));
    scopeBadgeLabel = `${radiusKm} किमी`;
  } else {
    if (selectedCities.length === 0) {
      estimatedReach = 0;
      scopeBadgeLabel = '0 शहर';
    } else {
      const allCities = Object.values(STATE_DATA).flatMap((s) => s.cities);
      estimatedReach = selectedCities.reduce((total, id) => {
        const found = allCities.find((c) => c.id === id);
        return total + (found?.reach || 35000);
      }, 0);
      if (selectedWholeStates.length > 0) {
        scopeBadgeLabel = `${selectedWholeStates.length} राज्य (${selectedCities.length} शहर)`;
      } else {
        scopeBadgeLabel = `${selectedCities.length} शहर`;
      }
    }
  }

  const isProceedDisabled = targetingType === 'district' && selectedCities.length === 0;

  const handleProceed = () => {
    if (isProceedDisabled) return;

    updateDraftCampaign({
      targetingType,
      radiusKm,
      selectedDistricts: selectedCities,
      selectedStates: selectedWholeStates,
      isWholeStateSelected: selectedWholeStates.length > 0,
      baseReach: estimatedReach,
    });

    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/audience');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="3"
        totalSteps="7"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/format');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="space-y-3">
          {/* Saffron Hero Pin Badge */}
          <div className="w-14 h-14 rounded-[18px] bg-[#FDE8D0]/80 border border-[#FDE68A]/60 flex items-center justify-center mx-auto shadow-2xs">
            <Location size={28} color="#E39026" variant="Bold" />
          </div>

          {/* Headline & Subtitle */}
          <div className="text-center">
            <h2 className="text-[20px] font-bold text-[#2B2437] leading-tight">
              विज्ञापन कहाँ दिखाना है?
            </h2>
            <p className="text-[13px] text-[#6B7280] font-normal mt-1 leading-tight">
              अपनी दुकान के पास या चुनिंदा शहरों में दिखाएं
            </p>
          </div>

          {/* Segmented Control / Tab Switcher */}
          <div className="bg-[#E5E7EB]/80 p-1 rounded-[16px] flex items-center">
            <button
              type="button"
              onClick={() => setTargetingType('radius')}
              className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                targetingType === 'radius'
                  ? 'bg-[#2B2437] text-white shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#2B2437]'
              }`}
            >
              <Shop size={17} variant={targetingType === 'radius' ? 'Bold' : 'Linear'} />
              <span>मेरी दुकान के आसपास</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetingType('district')}
              className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                targetingType === 'district'
                  ? 'bg-[#2B2437] text-white shadow-xs font-semibold'
                  : 'text-[#6B7280] hover:text-[#2B2437]'
              }`}
            >
              <Buildings size={17} variant={targetingType === 'district' ? 'Bold' : 'Linear'} />
              <span>शहर या राज्य चुनें</span>
            </button>
          </div>

          {/* Audience Reach Card (Shared at Top) */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[13px] font-semibold text-[#2B2437] block leading-tight">
                इतने लोग विज्ञापन देख सकते हैं
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-bold text-[#2B2437] tracking-tight">
                  ~ {estimatedReach.toLocaleString('en-IN')}
                </span>
                <span className="text-[13px] font-medium text-[#6B7280]">
                  लोग (पहुंच)
                </span>
              </div>
              {targetingType === 'district' && selectedCities.length === 0 && selectedWholeStates.length === 0 && (
                <p className="text-[11.5px] text-[#D97706] font-medium mt-1">
                  कृपया कम से कम एक शहर या राज्य चुनें
                </p>
              )}
            </div>

            {/* Scope Badge */}
            <div className="w-18 h-14 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex flex-col items-center justify-center text-[#E39026] shrink-0 px-2 text-center">
              <Location size={20} color="#E39026" variant="Bold" />
              <span className="text-[11px] font-semibold text-[#E39026] mt-0.5 leading-tight truncate max-w-[65px]">
                {scopeBadgeLabel}
              </span>
            </div>
          </div>

          {/* Mode A: Radius & Map */}
          {targetingType === 'radius' && (
            <div className="space-y-3">
              {/* Interactive Vector Map Card */}
              <div className="rounded-[20px] border border-[#E5E7EB] overflow-hidden relative shadow-2xs h-[180px] bg-[#F4F5F7]">
                <svg
                  viewBox="0 0 400 180"
                  className="w-full h-full object-cover"
                >
                  {/* Map Background Polygons */}
                  <polygon points="15,20 100,25 85,90 20,80" fill="#D1FAE5" opacity="0.8" />
                  <polygon points="310,15 390,20 380,85 300,75" fill="#D1FAE5" opacity="0.8" />
                  <polygon points="20,110 80,120 70,170 10,165" fill="#A7F3D0" opacity="0.7" />
                  <polygon points="320,115 390,120 385,175 315,170" fill="#D1FAE5" opacity="0.8" />
                  <ellipse cx="60" cy="55" rx="14" ry="9" fill="#93C5FD" opacity="0.7" />
                  <ellipse cx="195" cy="155" rx="18" ry="10" fill="#93C5FD" opacity="0.7" />

                  {/* Streets */}
                  <line x1="0" y1="40" x2="400" y2="45" stroke="#CBD5E1" strokeWidth="2.5" />
                  <line x1="0" y1="140" x2="400" y2="135" stroke="#CBD5E1" strokeWidth="2.5" />
                  <line x1="80" y1="0" x2="85" y2="180" stroke="#CBD5E1" strokeWidth="2.5" />
                  <line x1="320" y1="0" x2="315" y2="180" stroke="#CBD5E1" strokeWidth="2.5" />

                  {/* Arterial Highway */}
                  <path
                    d="M 180,0 Q 200,60 270,100 T 400,120"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 200,90 Q 220,140 180,180"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Main Orange Avenue */}
                  <path
                    d="M 0,90 Q 120,80 200,90"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60,0 Q 110,60 200,90"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Dynamic Radius Circles centered at store (200, 90) */}
                  <circle
                    cx="200"
                    cy="90"
                    r={radiusKm * 3.5}
                    fill="#F59E0B"
                    fillOpacity="0.12"
                    stroke="#E39026"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="200"
                    cy="90"
                    r={radiusKm * 2.2}
                    fill="#F59E0B"
                    fillOpacity="0.22"
                    stroke="#E39026"
                    strokeWidth="1.8"
                  />

                  {/* Contextual City Landmarks */}
                  <g className="select-none">
                    <circle cx="120" cy="40" r="3" fill="#2B2437" />
                    <text x="128" y="43" fontSize="9.5" fontWeight="bold" fill="#2B2437">
                      {currentLandmarks?.[0] || 'मुख्य बाजार'}
                    </text>

                    <circle cx="280" cy="45" r="3" fill="#2B2437" />
                    <text x="288" y="48" fontSize="9.5" fontWeight="bold" fill="#2B2437">
                      {currentLandmarks?.[1] || 'सिटी सेंटर'}
                    </text>

                    <circle cx="110" cy="140" r="3" fill="#2B2437" />
                    <text x="118" y="143" fontSize="9.5" fontWeight="bold" fill="#2B2437">
                      {currentLandmarks?.[2] || 'स्टेशन रोड'}
                    </text>

                    <circle cx="280" cy="145" r="3" fill="#2B2437" />
                    <text x="288" y="148" fontSize="9.5" fontWeight="bold" fill="#2B2437">
                      {currentLandmarks?.[3] || 'रिंग रोड'}
                    </text>
                  </g>

                  {/* Store Pin Marker (Center: 200, 90) */}
                  <g transform="translate(200, 90)">
                    <path
                      d="M 0,-18 C -7,-18 -11,-12 -11,-6 C -11,4 0,14 0,14 C 0,14 11,4 11,-6 C 11,-12 7,-18 0,-18 Z"
                      fill="#E39026"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <circle cx="0" cy="-6" r="3.5" fill="#FFFFFF" />
                  </g>
                </svg>

                {/* "मेरी दुकान" Badge */}
                <div className="absolute top-[108px] left-1/2 -translate-x-1/2 bg-[#2B2437] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs pointer-events-none">
                  मेरी दुकान ({draftCampaign.businessName || 'स्टोर'})
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={() => setRadiusKm(10)}
                  className="absolute bottom-2.5 left-2.5 bg-white border border-[#D1D5DB] rounded-[10px] px-2.5 py-1 shadow-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                >
                  <Refresh2 size={13} color="#2B2437" />
                  <span className="text-[11px] font-medium text-[#2B2437]">
                    रीसेट करें
                  </span>
                </button>
              </div>

              {/* Radius Slider Card */}
              <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#2B2437]">
                    दुकान से दूरी (रेडियस)
                  </span>
                  <span className="bg-[#2B2437] text-white text-[12px] font-medium px-3 py-1 rounded-full shadow-xs font-mono">
                    {radiusKm} किमी
                  </span>
                </div>

                {/* Slider Input */}
                <div className="relative pt-1 pb-2">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#2B2437]"
                  />
                  <div
                    className="absolute top-3 left-0 h-2 bg-[#2B2437] rounded-lg pointer-events-none"
                    style={{ width: `${((radiusKm - 5) / 20) * 100}%` }}
                  />
                </div>

                {/* Presets */}
                <div className="flex justify-between gap-1.5 pt-1">
                  {[5, 10, 15, 20, 25].map((val) => {
                    const isSel = radiusKm === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRadiusKm(val)}
                        className={`flex-1 py-1.5 px-1 rounded-full text-[12px] font-medium transition-all cursor-pointer text-center ${
                          isSel
                            ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                            : 'bg-white text-[#2B2437] border border-[#D1D5DB] hover:border-[#2B2437]'
                        }`}
                      >
                        {val} किमी
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mode B: Multi-State District & City Selector */}
          {targetingType === 'district' && (
            <div className="space-y-3">
              {selectedCities.length === 0 && selectedWholeStates.length === 0 && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[16px] p-3 flex items-center gap-2.5 shadow-2xs">
                  <span className="text-[18px]">⚠️</span>
                  <p className="text-[12px] text-[#B45309] font-medium leading-snug">
                    आगे बढ़ने के लिए कम से कम एक शहर या राज्य चुनें।
                  </p>
                </div>
              )}

              {/* Multi-State Accordions (MP, RJ, CG) */}
              {Object.keys(STATE_DATA).map((stKey) => {
                const st = STATE_DATA[stKey];
                const isOpen = Boolean(openStates[stKey]);
                const isThisStateFull = st.cities.every((c) => selectedCities.includes(c.id));

                return (
                  <div
                    key={stKey}
                    className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3"
                  >
                    <div
                      onClick={() => toggleStateAccordion(stKey)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15.5px] font-bold text-[#2B2437]">
                          {st.name}
                        </h3>
                        <span className="text-[12px] font-normal text-[#6B7280]">
                          (~{(st.totalReach / 1000).toFixed(0)}k लोग)
                        </span>
                      </div>
                      <button type="button" className="text-[#2B2437]">
                        {isOpen ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
                      </button>
                    </div>

                    {isOpen && (
                      <>
                        {/* "पूरा राज्य चुनें" Row */}
                        <div
                          onClick={() => handleToggleState(stKey)}
                          className={`h-12 rounded-[14px] border px-3.5 flex items-center justify-between cursor-pointer transition-all ${
                            isThisStateFull
                              ? 'border-[#2B2437] bg-white ring-1 ring-[#2B2437] shadow-xs'
                              : 'border-[#E5E7EB] bg-white hover:border-[#2B2437]/40'
                          }`}
                        >
                          <span className="text-[14px] font-semibold text-[#2B2437]">
                            पूरा {st.name} चुनें
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isThisStateFull
                                ? 'bg-[#2B2437] text-white shadow-xs'
                                : 'border-2 border-[#D1D5DB] bg-white'
                            }`}
                          >
                            {isThisStateFull && <span className="text-[12px] font-bold leading-none">✓</span>}
                          </div>
                        </div>

                        {/* City Grid */}
                        <div className="pt-1">
                          <span className="text-[12.5px] font-bold text-[#2B2437] block mb-2">
                            प्रमुख शहर
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {st.cities.map((city) => {
                              const isChecked = selectedCities.includes(city.id);

                              return (
                                <div
                                  key={city.id}
                                  onClick={() => handleToggleCity(city.id, stKey)}
                                  className={`h-12 rounded-[14px] border px-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                                    isChecked
                                      ? 'border-[#2B2437] bg-white ring-1 ring-[#2B2437] shadow-2xs'
                                      : 'border-[#E5E7EB] bg-white hover:border-[#2B2437]/30'
                                  }`}
                                >
                                  <div>
                                    <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                                      {city.name}
                                    </span>
                                    <span className="text-[11px] text-[#6B7280] font-normal leading-none">
                                      ~{(city.reach / 1000).toFixed(0)}k लोग
                                    </span>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                      isChecked
                                        ? 'bg-[#2B2437] text-white shadow-xs'
                                        : 'border-2 border-[#D1D5DB] bg-white'
                                    }`}
                                  >
                                    {isChecked && <span className="text-[12px] font-bold leading-none">✓</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Primary Action CTA */}
        <div className="pt-4 pb-2">
          <button
            type="button"
            onClick={handleProceed}
            disabled={isProceedDisabled}
            className={`w-full h-[56px] rounded-[16px] font-medium text-[18px] shadow-md flex items-center justify-center gap-2 transition-all ${
              isProceedDisabled
                ? 'bg-[#9CA3AF] text-white cursor-not-allowed'
                : 'bg-[#2B2437] hover:bg-[#3D334E] text-white cursor-pointer active:scale-[0.99]'
            }`}
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>
    </div>
  );
}
