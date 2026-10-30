import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseCircle,
  Camera,
  Gallery,
  Microphone2,
  Location,
  TickCircle,
  Clock,
  Eye,
  Send2,
  Whatsapp,
  ArrowDown2,
  Warning2,
  ShieldTick,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { useCity } from '../../context/CityContext';
import CitizenReelItem from './CitizenReelItem';
import { extractVideoThumbnail } from '../../utils/videoStorage';
import {
  CITIZEN_CATEGORIES,
  CITIZEN_RULES,
  CITIZEN_FALLBACK_VIDEO,
  getCitizenCategory,
  getCategoryVideo,
  getCategoryPoster,
} from '../../data/citizenReportConfig';

const formatDuration = (s) => {
  if (!Number.isFinite(s)) return '';
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const CITY_LOCALITY_SUGGESTIONS = {
  'भोपाल': ['एमपी नगर', 'न्यू मार्केट', 'अरेरा कॉलोनी', 'कोलार', 'अयोध्या बायपास'],
  'इंदौर': ['विजय नगर', 'पलासिया', 'राजवाड़ा', 'भंवरकुआं', 'सपना संगीता'],
  'जबलपुर': ['मदन महल', 'सिविल लाइन्स', 'राइट टाउन', 'ग्वारीघाट'],
  'ग्वालियर': ['महाराज बाड़ा', 'सिटी सेंटर', 'लश्कर', 'मुरार'],
  'रायपुर': ['तेलीबांधा', 'पंडरी', 'शंकर नगर', 'घड़ी चौक'],
  'बिलासपुर': ['व्यापार विहार', 'सिविल लाइन्स', 'गोल बाजार', 'तारबाहर'],
  'जयपुर': ['वैशाली नगर', 'मालवीय नगर', 'राजा पार्क', 'मानसरोवर'],
  'जोधपुर': ['सरदारपुरा', 'रातानाडा', 'शास्त्री नगर', 'चौपासनी हाउसिंग बोर्ड', 'मंडोर'],
  'नागपुर': ['सीताबर्डी', 'धरमपेठ', 'रामदासपेठ', 'सदर'],
  'मुंबई': ['बांद्रा', 'अंधेरी', 'दादर', 'बोरीवली', 'कुर्ला'],
  'पुणे': ['कोथरुड', 'शिवाजी नगर', 'विमान नगर', 'हिंजेवाड़ी', 'एफसी रोड'],
  'सूरत': ['वेसू', 'अठवा लाइन्स', 'अडजान', 'वरच्छा', 'पाल'],
  'अहमदाबाद': ['बोडकदेव', 'आश्रम रोड', 'मणिनगर', 'नवरंगपुरा', 'एसजी हाईवे'],
  'नई दिल्ली': ['कनॉट प्लेस', 'करोल बाग', 'लाजपत नगर', 'रोहिणी'],
};

export default function CitizenUploadSheet({ isOpen, onClose, onSuccessToast }) {
  const { submitCitizenReport, citizenCityFilter } = useVideo();
  const { userProfile = {} } = useOnboarding();
  const { savedCities = [], activeCityId } = useCity();

  // Active city initialized to user's currently selected active city from CityContext
  const initialCityName = useMemo(() => {
    const found = savedCities.find((c) => c.id === activeCityId);
    return found ? found.name : savedCities[0]?.name || 'भोपाल';
  }, [savedCities, activeCityId]);

  const [selectedCityName, setSelectedCityName] = useState(initialCityName);

  // Synchronize selectedCityName whenever the sheet opens to match the active city filter or active city
  useEffect(() => {
    if (isOpen) {
      if (citizenCityFilter && citizenCityFilter !== 'all_saved') {
        const foundFilter = savedCities.find(
          (c) => c.name === citizenCityFilter || c.id === citizenCityFilter
        );
        if (foundFilter) {
          setSelectedCityName(foundFilter.name);
          return;
        }
      }
      const foundActive = savedCities.find((c) => c.id === activeCityId);
      if (foundActive) {
        setSelectedCityName(foundActive.name);
      } else if (initialCityName) {
        setSelectedCityName(initialCityName);
      }
    }
  }, [isOpen, citizenCityFilter, activeCityId, savedCities, initialCityName]);

  // Guarantee selected city is always strictly one of the user's savedCities
  useEffect(() => {
    if (!savedCities.some((c) => c.name === selectedCityName)) {
      setSelectedCityName(initialCityName);
    }
  }, [savedCities, initialCityName, selectedCityName]);

  const reporterName = userProfile?.name || 'आप';

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [stage, setStage] = useState('pick');
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterThumbnail, setPosterThumbnail] = useState('');
  const [duration, setDuration] = useState(null);
  const [locality, setLocality] = useState('');
  const [categoryId, setCategoryId] = useState('water');
  const [headline, setHeadline] = useState('');
  const [details, setDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consent, setConsent] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [fileError, setFileError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const category = categoryId ? getCitizenCategory(categoryId) : null;
  const isTooLong = duration != null && duration > CITIZEN_RULES.maxVideoSeconds + 1;
  const trimmedHeadline = headline.trim();

  // Missing requirement validation helper
  const missing = useMemo(() => {
    if (isTooLong) return 'वीडियो 60s से बड़ा है, छोटा चुनें';
    if (!categoryId) return 'कैटेगरी चुनें';
    if (trimmedHeadline.length < CITIZEN_RULES.minHeadlineChars) return 'एक लाइन में बताएं क्या हुआ';
    if (!consent) return 'नियम व ज़िम्मेदारी कन्फर्म करें';
    return null;
  }, [isTooLong, categoryId, trimmedHeadline, consent]);

  const combinedLocality = locality.trim();

  const fallbackCatVideo = getCategoryVideo(categoryId || 'water');
  const fallbackCatPoster = getCategoryPoster(categoryId || 'water');

  const draftReel = {
    id: 'draft',
    videoUrl: videoUrl || fallbackCatVideo,
    posterThumbnail: posterThumbnail || fallbackCatPoster,
    city: selectedCityName,
    locality: combinedLocality,
    categoryId: categoryId || 'other',
    headline: trimmedHeadline || 'आपकी हेडलाइन यहाँ दिखेगी',
    fullDescription: details.trim(),
    reporterName,
    isAnonymous,
    isVerifiedReporter: false,
    status: 'verified',
    timeAgo: 'अभी-अभी',
    likeCount: 0,
    commentCount: 0,
  };

  const resetAll = (preserveCurrentUrl = false) => {
    if (!preserveCurrentUrl && videoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setStage('pick');
    setVideoUrl(null);
    setVideoFile(null);
    setPosterThumbnail('');
    setDuration(null);
    setLocality('');
    setCategoryId('water');
    setHeadline('');
    setDetails('');
    setShowDetails(false);
    setIsAnonymous(false);
    setConsent(true);
    setUploadProgress(null);
    setFileError('');
    setShowPreview(false);
    setConfirmDiscard(false);
  };

  useEffect(() => {
    if (!isOpen) setConfirmDiscard(false);
  }, [isOpen]);

  const requestClose = () => {
    if (stage === 'details' && uploadProgress == null) {
      setConfirmDiscard(true);
      return;
    }
    if (stage === 'done') resetAll(true);
    onClose();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > CITIZEN_RULES.maxVideoMB * 1024 * 1024) {
      setFileError(`वीडियो ${CITIZEN_RULES.maxVideoMB}MB से बड़ा है, छोटा वीडियो लें`);
      return;
    }
    setFileError('');
    if (videoUrl?.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    const newUrl = URL.createObjectURL(file);
    setDuration(null);
    setVideoFile(file);
    setVideoUrl(newUrl);
    setStage('details');

    // Extract real thumbnail from uploaded video
    extractVideoThumbnail(file).then((thumb) => {
      if (thumb) setPosterThumbnail(thumb);
    }).catch(() => {});
  };

  const useDemoVideo = () => {
    setFileError('');
    setDuration(null);
    setVideoFile(null);
    const demoCat = categoryId || 'water';
    setPosterThumbnail(getCategoryPoster(demoCat));
    setVideoUrl(getCategoryVideo(demoCat));
    setLocality((prev) => prev || 'एमपी नगर ज़ोन-2');
    setHeadline((prev) => prev || 'सीवर की पाइपलाइन फटने से सड़क पर पानी भरा, जाम');
    setStage('details');
  };

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setFileError('');
      setHeadline((h) => h || 'यहाँ सड़क पर पानी भरा है, आना-जाना मुश्किल');
      return;
    }
    try {
      const rec = new SR();
      rec.lang = 'hi-IN';
      rec.interimResults = false;
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (ev) => {
        const t = ev.results[0][0].transcript;
        if (t) setHeadline((h) => (h ? `${h} ${t}` : t).slice(0, CITIZEN_RULES.maxHeadlineChars));
      };
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = () => {
    if (missing || uploadProgress != null) return;
    setUploadProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(100, p + 28 + Math.random() * 22);
      setUploadProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(timer);
        const finalCat = categoryId || 'water';
        submitCitizenReport({
          headline: trimmedHeadline,
          fullDescription: details.trim(),
          city: selectedCityName,
          locality: combinedLocality,
          categoryId: finalCat,
          reporterName,
          isAnonymous,
          videoUrl: videoUrl || getCategoryVideo(finalCat),
          videoFile: videoFile || null,
          posterThumbnail: posterThumbnail || getCategoryPoster(finalCat),
        });
        setTimeout(() => {
          resetAll(true);
          onClose();
          onSuccessToast?.('बधाई! आपकी रिपोर्ट लाइव हो गई 🎉');
        }, 140);
      }
    }, 45);
  };

  const shareOnWhatsApp = () => {
    const text = `*नवभारत नागरिक रिपोर्टर* 🔴\nस्थान: ${[combinedLocality, selectedCityName].filter(Boolean).join(', ')}\nखबर: ${trimmedHeadline}\n\nपूरी वीडियो रिपोर्ट यहाँ देखें:`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  const sheetHeight = stage === 'details' ? 'h-[92%]' : 'max-h-[92%]';

  return (
    <div className="absolute inset-0 z-50 overflow-hidden select-none">
      {/* Native pickers */}
      <input ref={cameraInputRef} type="file" accept="video/*" capture="environment" onChange={handleFile} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={requestClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-pointer"
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className={`absolute bottom-0 inset-x-0 ${sheetHeight} bg-white rounded-t-[28px] flex flex-col shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-5 pt-3 pb-3 border-b border-[#F1F3F5] flex items-center justify-between relative shrink-0">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
          <h2 className="text-[17px] font-bold text-[#2B2437] mt-2">
            {stage === 'pick' && 'अपनी खबर भेजें'}
            {stage === 'details' && 'खबर की जानकारी'}
            {stage === 'done' && 'रिपोर्ट भेज दी गई'}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="बंद करें"
            className="mt-2 cursor-pointer active:scale-90 transition-transform"
          >
            <CloseCircle size={24} color="#6B7280" />
          </button>
        </div>

        {/* ───────── Stage 1: Pick ───────── */}
        {stage === 'pick' && (
          <div className="px-5 pt-3 pb-8 overflow-y-auto scrollbar-none">
            {/* Editorial Civic Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF6ED] border border-[#FDBA74] text-[#C05621] text-[11.5px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              <span>नवभारत नागरिक रिपोर्टर</span>
            </div>

            <h3 className="text-[19px] font-bold text-[#1E1926] mt-2 leading-tight">
              शहर की आवाज़ बनें
            </h3>
            <p className="text-[13.5px] text-[#4B5563] mt-1 leading-relaxed">
              सड़क, पानी या जनसमस्या का 60s वीडियो भेजें। जांच के बाद यह पूरे शहर को दिखेगी।
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="h-[120px] rounded-[20px] bg-[#2B2437] hover:bg-[#352D42] text-white flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-all cursor-pointer shadow-lg border border-white/10 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera size={26} color="#F5B55C" variant="Bold" />
                </div>
                <div className="text-center">
                  <span className="text-[14px] font-bold block leading-tight">रिकॉर्ड करें</span>
                  <span className="text-[11px] text-white/60 block mt-0.5">अधिकतम 60s</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="h-[120px] rounded-[20px] bg-[#F9FAFB] border border-[#E5E7EB] text-[#2B2437] flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-all cursor-pointer hover:border-[#2B2437] shadow-xs group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Gallery size={26} color="#2B2437" variant="Bold" />
                </div>
                <div className="text-center">
                  <span className="text-[14px] font-bold block leading-tight">गैलरी से चुनें</span>
                  <span className="text-[11px] text-[#6B7280] block mt-0.5">फ़ोन का वीडियो</span>
                </div>
              </button>
            </div>

            {fileError && (
              <div className="mt-3 flex items-center gap-2 text-[13px] text-[#B42318] bg-[#FEF3F2] p-2.5 rounded-xl border border-[#FECDCA]">
                <Warning2 size={16} color="#B42318" variant="Bold" />
                <span className="font-medium">{fileError}</span>
              </div>
            )}

            <div className="mt-4 rounded-[16px] bg-[#F7F7F4] p-3.5 space-y-2 border border-[#E5E7EB]/60">
              <p className="text-[12.5px] font-bold text-[#2B2437] flex items-center gap-1.5">
                <ShieldTick size={15} color="#4F7A55" variant="Bold" />
                <span>वीडियो भेजने के नियम</span>
              </p>
              {[
                'मौके का खुद का वीडियो (अधिकतम 60s)',
                'मोबाइल सीधा रखें ताकि साफ़ दिखे',
                'खबर सच हो — कोई अफवाह या झूठा आरोप न हो',
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <TickCircle size={15} color="#4F7A55" variant="Bold" className="shrink-0 mt-[1px]" />
                  <span className="text-[12.5px] text-[#4B5563] leading-snug">{t}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={useDemoVideo}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FFF6ED] border border-[#FDBA74] text-center text-[13px] font-bold text-[#C05621] cursor-pointer hover:bg-[#FFEDD5] active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>💡 डेमो वीडियो देखें</span>
            </button>
          </div>
        )}

        {/* ───────── Stage 2: Details ───────── */}
        {stage === 'details' && (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-none px-5 pt-4 pb-6 space-y-5">
              {/* Video Preview & Location Picker */}
              <div className="flex gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="relative w-[92px] h-[155px] rounded-[14px] overflow-hidden bg-black cursor-pointer shadow-md"
                    aria-label="फ़ीड प्रीव्यू देखें"
                  >
                    <video
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      className="w-full h-full object-cover"
                    />
                    {duration != null && (
                      <span
                        className={`absolute bottom-1.5 right-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isTooLong ? 'bg-[#B42318] text-white' : 'bg-black/60 text-white'
                        }`}
                      >
                        {formatDuration(duration)}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="text-[12px] font-medium text-[#C05621] cursor-pointer hover:underline"
                  >
                    वीडियो बदलें
                  </button>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <label className="text-[13px] font-semibold text-[#2B2437] mb-1.5 flex items-center justify-between">
                    <span>घटना कहाँ की है?</span>
                    {savedCities.length > 1 && (
                      <span className="text-[11.5px] text-[#6B7280]">शहर चुनें</span>
                    )}
                  </label>

                  {/* City Switcher: strictly bound to user's savedCities (No Add City) */}
                  {savedCities.length > 1 ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {savedCities.map((sc) => {
                        const isSelected = selectedCityName === sc.name;
                        return (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => setSelectedCityName(sc.name)}
                            className={`h-[30px] px-3 rounded-full text-[12.5px] font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#2B2437] text-white shadow-xs'
                                : 'bg-[#F1F3F5] text-[#4B5563] hover:bg-[#E5E7EB]'
                            }`}
                          >
                            <Location size={12} color={isSelected ? '#F5B55C' : '#6B7280'} variant="Bold" />
                            <span>{sc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-[30px] px-3 rounded-full bg-[#2B2437] text-white text-[12.5px] font-bold flex items-center gap-1.5 w-fit shadow-xs">
                      <Location size={13} color="#F5B55C" variant="Bold" />
                      <span>{selectedCityName}</span>
                    </div>
                  )}

                  {/* Locality Input */}
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={locality}
                      maxLength={35}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="इलाका / कॉलोनी (जैसे: एमपी नगर)"
                      className="h-10 w-full rounded-[10px] border border-[#D1D5DB] bg-white px-3 text-[13px] text-[#2B2437] placeholder-[#9CA3AF] outline-none focus:border-[#2B2437] transition-colors"
                    />

                    {/* Quick Locality Suggestions for the Active City */}
                    {CITY_LOCALITY_SUGGESTIONS[selectedCityName] && (
                      <div className="mt-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                        {CITY_LOCALITY_SUGGESTIONS[selectedCityName].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocality(loc)}
                            className={`h-[24px] px-2.5 rounded-full text-[11.5px] font-medium shrink-0 cursor-pointer transition-colors ${
                              locality === loc
                                ? 'bg-[#2B2437] text-white font-semibold'
                                : 'bg-[#F1F3F5] text-[#4B5563] hover:bg-[#E5E7EB]'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="mt-2 pt-1 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2B2437] cursor-pointer w-fit"
                  >
                    <Eye size={15} color="#2B2437" />
                    <span className="underline underline-offset-2">प्रीव्यू देखें (Preview)</span>
                  </button>
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-[13px] font-semibold text-[#2B2437]">खबर किस बारे में है?</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {CITIZEN_CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const active = categoryId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCategoryId(c.id);
                          if (!videoFile) {
                            setVideoUrl(getCategoryVideo(c.id));
                            setPosterThumbnail(getCategoryPoster(c.id));
                          }
                        }}
                        aria-pressed={active}
                        className={`h-[68px] rounded-[14px] flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                          active ? 'border-[#F5B55C] border-2 bg-[#FFFBEB] shadow-xs' : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: active ? c.color : `${c.color}1A` }}
                        >
                          <Icon size={16} color={active ? '#FFFFFF' : c.color} variant="Bold" />
                        </div>
                        <span className={`text-[12px] leading-none ${active ? 'font-bold text-[#2B2437]' : 'text-[#4B5563]'}`}>
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Legal Advisory Friction Strip */}
                <div className="mt-2.5 p-2 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2 text-[12px] text-[#92400E] leading-snug">
                  <span className="text-[14px] shrink-0">⚠️</span>
                  <span>
                    <strong>ज़रूरी नियम:</strong> आपसी झगड़े, धर्म/जाति पर टिप्पणी या बिना सबूत के आरोप लगाना मना है।
                  </span>
                </div>
              </div>

              {/* Headline Input & Hindi Voice Dictation */}
              <div>
                <label className="text-[13px] font-semibold text-[#2B2437]">क्या हुआ? एक लाइन में लिखें</label>
                <div className="mt-2 relative">
                  <textarea
                    rows={2}
                    value={headline}
                    maxLength={CITIZEN_RULES.maxHeadlineChars}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="जैसे: एमपी नगर में पाइपलाइन फटने से सड़क पर पानी भरा, जाम लगा"
                    className="w-full rounded-[14px] border border-[#D1D5DB] bg-white p-3 pr-14 text-[14px] text-[#2B2437] placeholder-[#9CA3AF] leading-relaxed outline-none focus:border-[#2B2437] resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleVoice}
                    aria-label="बोलकर लिखें"
                    className={`absolute right-2.5 bottom-3.5 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-all ${
                      isListening ? 'bg-[#B42318] animate-pulse' : 'bg-[#F5B55C]'
                    }`}
                  >
                    <Microphone2 size={18} color={isListening ? '#FFFFFF' : '#2B2437'} variant="Bold" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] text-[#6B7280]">
                    {isListening ? 'सुन रहे हैं...' : 'टाइप करें या माइक से बोलें'}
                  </span>
                  <span className="text-[11.5px] text-[#9CA3AF]">{headline.length}/{CITIZEN_RULES.maxHeadlineChars}</span>
                </div>

                {/* 1-Tap Quick Headline Suggestions */}
                {!trimmedHeadline && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {[
                      category?.suggestion,
                      'सड़क पर गड्ढों से हादसे का डर',
                      'सड़क पर सीवर का पानी भरा',
                      'चौराहे पर जाम, गाड़ियां फंसीं',
                    ]
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setHeadline(sug)}
                          className="px-2.5 py-1.5 rounded-full text-[12px] bg-[#FFF6ED] border border-[#FDBA74] text-[#C05621] font-medium hover:bg-[#FFEDD5] cursor-pointer text-left truncate max-w-[270px] active:scale-95 transition-transform"
                        >
                          + {sug}
                        </button>
                      ))}
                  </div>
                )}

                {/* Optional details */}
                {!showDetails ? (
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2B2437] cursor-pointer"
                  >
                    और जानकारी जोड़ें <span className="text-[#9CA3AF] font-normal">(वैकल्पिक)</span>
                    <ArrowDown2 size={13} color="#2B2437" />
                  </button>
                ) : (
                  <textarea
                    rows={2}
                    value={details}
                    maxLength={300}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="समस्या कब से है या किसी को शिकायत की? यहाँ लिखें..."
                    className="mt-2.5 w-full rounded-[12px] border border-[#D1D5DB] bg-white p-2.5 text-[13px] text-[#2B2437] placeholder-[#9CA3AF] leading-relaxed outline-none focus:border-[#2B2437] resize-none"
                  />
                )}
              </div>

              {/* Identity & Legal Consent */}
              <div className="rounded-[14px] border border-[#E5E7EB] divide-y divide-[#F1F3F5] bg-white">
                <label className="flex items-start justify-between gap-3 p-3.5 cursor-pointer">
                  <div>
                    <span className="block text-[13.5px] font-semibold text-[#2B2437]">मेरा नाम छुपाएं</span>
                    <span className="block text-[12px] text-[#6B7280] mt-0.5 leading-snug">
                      नाम नहीं दिखेगा, सिर्फ 'नागरिक रिपोर्टर' लिखा होगा।
                    </span>
                  </div>
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="sr-only peer" />
                  <span className="relative shrink-0 mt-0.5 w-11 h-6 rounded-full bg-[#D1D5DB] peer-checked:bg-[#2B2437] transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[18px] after:h-[18px] after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                </label>
                <label className="flex items-start gap-3 p-3.5 cursor-pointer bg-[#F9FAFB]/60">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-5 h-5 shrink-0 accent-[#2B2437] cursor-pointer"
                  />
                  <span className="text-[12.5px] text-[#374151] leading-snug font-medium">
                    मैं पुष्टि करता/करती हूँ कि वीडियो असली है, खबर सच है और ज़िम्मेदारी मेरी है।
                  </span>
                </label>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t border-[#E5E7EB] bg-white px-5 pt-3 pb-6">
              {uploadProgress != null ? (
                <div>
                  <div className="flex items-center justify-between text-[13px] text-[#2B2437] font-semibold mb-2">
                    <span>{uploadProgress < 50 ? 'वीडियो प्रोसेस हो रहा है...' : 'टीम को भेजा जा रहा है...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F1F3F5] overflow-hidden">
                    <motion.div className="h-full bg-[#F5B55C]" animate={{ width: `${uploadProgress}%` }} transition={{ ease: 'easeOut' }} />
                  </div>
                </div>
              ) : (
                <>
                  <p className={`text-[12px] mb-2 text-center font-medium ${isTooLong ? 'text-[#B42318]' : 'text-[#6B7280]'}`}>
                    {missing || `सब तैयार है! अब लाइव कर सकते हैं।`}
                  </p>
                  <button
                    type="button"
                    disabled={Boolean(missing)}
                    onClick={handleSubmit}
                    className="w-full h-[50px] rounded-full bg-[#2B2437] hover:bg-[#1E1926] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] cursor-pointer disabled:cursor-not-allowed shadow-md border border-white/10"
                  >
                    <Send2 size={18} color={missing ? '#9CA3AF' : '#F5B55C'} variant="Bold" />
                    <span>सीधे लाइव करें</span>
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* ───────── Stage 3: Done ───────── */}
        {stage === 'done' && (
          <div className="px-5 pt-6 pb-8 overflow-y-auto scrollbar-none">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="w-16 h-16 rounded-full bg-[#4F7A55]/10 flex items-center justify-center"
              >
                <TickCircle size={40} color="#4F7A55" variant="Bold" />
              </motion.div>
              <h3 className="text-[19px] font-bold text-[#2B2437] mt-3">बधाई! रिपोर्ट लाइव हो गई 🎉</h3>
              <p className="text-[13.5px] text-[#4B5563] mt-1.5 leading-relaxed max-w-[310px]">
                आपकी रिपोर्ट अब {selectedCityName} के पाठकों को दिख रही है।
              </p>
            </div>

            {/* Status Timeline */}
            <div className="mt-5 rounded-[16px] bg-[#F7F7F4] p-4">
              {[
                { icon: TickCircle, color: '#4F7A55', title: 'रिपोर्ट मिली', sub: 'वीडियो और डिटेल दर्ज', state: 'done' },
                { icon: TickCircle, color: '#4F7A55', title: 'जांच पूरी', sub: `${selectedCityName} और वीडियो चेक`, state: 'done' },
                { icon: ShieldTick, color: '#4F7A55', title: 'लाइव प्रसारित', sub: 'नागरिक रिपोर्टर में लाइव', state: 'done' },
              ].map((s, i, arr) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <Icon size={22} color={s.color} variant="Bold" />
                      {i < arr.length - 1 && <div className="w-[2px] flex-1 min-h-[22px] bg-[#4F7A55]/30 my-1" />}
                    </div>
                    <div className="pb-3.5">
                      <p className="text-[13.5px] font-bold text-[#2B2437]">{s.title}</p>
                      <p className="text-[12px] text-[#6B7280] leading-snug">{s.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                resetAll(true);
                onClose();
              }}
              className="mt-5 w-full h-[50px] rounded-full bg-[#2B2437] text-white text-[15px] font-bold active:scale-[0.98] transition-transform cursor-pointer shadow-md"
            >
              लाइव रिपोर्ट देखें
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="mt-2.5 w-full h-[46px] rounded-full border border-[#D1D5DB] text-[#2B2437] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Whatsapp size={18} color="#25D366" variant="Bold" />
              व्हाट्सएप पर शेयर करें
            </button>
          </div>
        )}
      </motion.div>

      {/* Discard confirmation */}
      <AnimatePresence>
        {confirmDiscard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/50 flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="w-full rounded-[20px] bg-white p-5 text-center shadow-2xl"
            >
              <p className="text-[16px] font-bold text-[#2B2437]">रिपोर्ट छोड़ दें?</p>
              <p className="text-[13px] text-[#6B7280] mt-1">बाहर जाने पर वीडियो और लिखी जानकारी हट जाएगी।</p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmDiscard(false)}
                  className="h-11 rounded-full bg-[#2B2437] text-white text-[14px] font-semibold cursor-pointer"
                >
                  लिखते रहें
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    onClose();
                  }}
                  className="h-11 rounded-full border border-[#D1D5DB] text-[#B42318] text-[14px] font-semibold cursor-pointer"
                >
                  हटाएं
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen feed preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black"
          >
            <CitizenReelItem reel={draftReel} isActive isPreview />
            <div className="absolute top-0 inset-x-0 z-40 pt-[59px] px-4 flex items-center justify-between">
              <span className="h-[32px] px-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[13px] font-medium flex items-center">
                प्रीव्यू · ऐसे दिखेगी आपकी रिपोर्ट
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="h-[32px] px-4 rounded-full bg-white text-[#2B2437] text-[13px] font-bold cursor-pointer"
              >
                ठीक है
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
