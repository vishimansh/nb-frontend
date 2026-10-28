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
  'नागपुर': ['सीताबर्डी', 'धरमपेठ', 'रामदासपेठ', 'सदर'],
  'मुंबई': ['बांद्रा', 'अंधेरी', 'दादर', 'बोरीवली', 'कुर्ला'],
  'नई दिल्ली': ['कनॉट प्लेस', 'करोल बाग', 'लाजपत नगर', 'रोहिणी'],
};

export default function CitizenUploadSheet({ isOpen, onClose, onSuccessToast }) {
  const { submitCitizenReport } = useVideo();
  const { userProfile = {} } = useOnboarding();
  const { savedCities = [], activeCityId } = useCity();

  // Active city initialized to user's currently selected active city from CityContext
  const initialCityName = useMemo(() => {
    const found = savedCities.find((c) => c.id === activeCityId);
    return found ? found.name : savedCities[0]?.name || 'भोपाल';
  }, [savedCities, activeCityId]);

  const [selectedCityName, setSelectedCityName] = useState(initialCityName);

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
    if (isTooLong) return 'वीडियो 60 सेकंड से लंबा है, छोटा वीडियो चुनें';
    if (!categoryId) return 'बताएं कि खबर किस बारे में है';
    if (trimmedHeadline.length < CITIZEN_RULES.minHeadlineChars) return 'एक लाइन में बताएं क्या हुआ';
    if (!consent) return 'वीडियो की सच्चाई और कानूनी जिम्मेदारी की पुष्टि करें';
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
      setFileError(`वीडियो ${CITIZEN_RULES.maxVideoMB}MB से बड़ा है`);
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
    setHeadline((prev) => prev || 'सीवरेज पाइपलाइन फटने से मुख्य सड़क पर जलभराव');
    setStage('details');
  };

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setFileError('');
      setHeadline((h) => h || 'यहाँ तीन दिन से सड़क पर पानी भरा है, आना-जाना मुश्किल');
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
          onSuccessToast?.('बधाई! आपकी नागरिक रिपोर्ट लाइव हो गई है 🎉');
        }, 140);
      }
    }, 45);
  };

  const shareOnWhatsApp = () => {
    const text = `मैंने नवभारत पर अपने इलाके (${[combinedLocality, selectedCityName].filter(Boolean).join(', ')}) की खबर भेजी है: "${trimmedHeadline}"`;
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
          <div className="px-5 pt-4 pb-8 overflow-y-auto scrollbar-none">
            <p className="text-[14px] text-[#4B5563] leading-relaxed">
              अपने इलाके की घटना का 60 सेकंड का वीडियो भेजें। नवभारत डेस्क सत्यापन के बाद इसे आपके शहर के पाठकों के लिए प्रकाशित करेगा।
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="h-[118px] rounded-[20px] bg-[#2B2437] text-white flex flex-col items-center justify-center gap-2.5 active:scale-[0.97] transition-transform cursor-pointer shadow-md"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  <Camera size={24} color="#F5B55C" variant="Bold" />
                </div>
                <span className="text-[15px] font-semibold">अभी रिकॉर्ड करें</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="h-[118px] rounded-[20px] bg-white border border-[#D1D5DB] text-[#2B2437] flex flex-col items-center justify-center gap-2.5 active:scale-[0.97] transition-transform cursor-pointer hover:border-[#2B2437]"
              >
                <div className="w-11 h-11 rounded-full bg-[#F7F7F4] flex items-center justify-center">
                  <Gallery size={24} color="#2B2437" variant="Bold" />
                </div>
                <span className="text-[15px] font-semibold">गैलरी से चुनें</span>
              </button>
            </div>

            {fileError && (
              <div className="mt-3 flex items-center gap-2 text-[13px] text-[#B42318]">
                <Warning2 size={15} color="#B42318" variant="Bold" />
                {fileError}
              </div>
            )}

            <div className="mt-5 rounded-[16px] bg-[#F7F7F4] p-4 space-y-2.5">
              <p className="text-[13px] font-semibold text-[#2B2437]">सत्यापित रिपोर्टिंग के दिशानिर्देश</p>
              {[
                'घटनास्थल पर स्वयं रिकॉर्ड किया गया वीडियो (अधिकतम 60 सेकंड)',
                'मोबाइल सीधा (वर्टिकल) रखें ताकि खबर स्पष्ट दिखे',
                'व्यक्तिगत आक्षेप, अफवाह या पारिवारिक विवाद स्वीकार नहीं होंगे',
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <TickCircle size={16} color="#4F7A55" variant="Bold" className="shrink-0 mt-[1px]" />
                  <span className="text-[13px] text-[#4B5563] leading-snug">{t}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={useDemoVideo}
              className="mt-4 w-full text-center text-[13px] font-medium text-[#C05621] cursor-pointer hover:underline"
            >
              डेमो वीडियो से आज़माएं
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
                    <span>कहाँ की घटना है?</span>
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
                      placeholder="इलाका / क्षेत्र (जैसे: एमपी नगर)"
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
                    <span className="underline underline-offset-2">फ़ीड में कैसी दिखेगी (प्रीव्यू)</span>
                  </button>
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-[13px] font-semibold text-[#2B2437]">किस बारे में है?</label>
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
                          active ? 'border-[#2B2437] border-2 bg-[#F7F7F4]' : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
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
                <div className="mt-2.5 p-2 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2 text-[11.5px] text-[#92400E] leading-snug">
                  <span className="text-[13px] shrink-0">⚠️</span>
                  <span>
                    <strong>कानूनी दिशानिर्देश:</strong> व्यक्तिगत विवाद, पारिवारिक मामले, धर्म/जाति पर टिप्पणी या बिना साक्ष्य के आरोप पूरी तरह प्रतिबंधित हैं।
                  </span>
                </div>
              </div>

              {/* Headline Input & Hindi Voice Dictation */}
              <div>
                <label className="text-[13px] font-semibold text-[#2B2437]">एक लाइन में बताएं, क्या हुआ?</label>
                <div className="mt-2 relative">
                  <textarea
                    rows={2}
                    value={headline}
                    maxLength={CITIZEN_RULES.maxHeadlineChars}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="जैसे: कोलार मुख्य मार्ग पर पाइपलाइन फटने से भारी जलभराव, आवागमन ठप"
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
                    {isListening ? 'सुन रहे हैं... हिंदी में बोलें' : 'टाइप करें या माइक दबाकर बोलें'}
                  </span>
                  <span className="text-[11.5px] text-[#9CA3AF]">{headline.length}/{CITIZEN_RULES.maxHeadlineChars}</span>
                </div>

                {/* 1-Tap Quick Headline Suggestions */}
                {!trimmedHeadline && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {[
                      category?.suggestion,
                      'सड़क पर गड्ढों से हादसों का खतरा',
                      'सीवरेज लाइन फटने से भारी जलभराव',
                      'चौराहे पर लंबा जाम, वाहन रेंगते रहे',
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
                    अतिरिक्त जानकारी जोड़ें <span className="text-[#9CA3AF] font-normal">(वैकल्पिक)</span>
                    <ArrowDown2 size={13} color="#2B2437" />
                  </button>
                ) : (
                  <textarea
                    rows={2}
                    value={details}
                    maxLength={300}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="कब से हो रहा है, क्या किसी अधिकारी को शिकायत की गई है..."
                    className="mt-2.5 w-full rounded-[12px] border border-[#D1D5DB] bg-white p-2.5 text-[13px] text-[#2B2437] placeholder-[#9CA3AF] leading-relaxed outline-none focus:border-[#2B2437] resize-none"
                  />
                )}
              </div>

              {/* Identity & Legal Consent */}
              <div className="rounded-[14px] border border-[#E5E7EB] divide-y divide-[#F1F3F5] bg-white">
                <label className="flex items-start justify-between gap-3 p-3.5 cursor-pointer">
                  <div>
                    <span className="block text-[13.5px] font-semibold text-[#2B2437]">मेरा नाम न दिखाएं</span>
                    <span className="block text-[12px] text-[#6B7280] mt-0.5 leading-snug">
                      रिपोर्ट "नागरिक रिपोर्टर (गोपनीय)" के साथ दिखेगी।
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
                    मैं पुष्टि करता/करती हूँ कि यह वीडियो वास्तविक है, किसी की मानहानि नहीं करता और इसकी कानूनी ज़िम्मेदारी मेरी है।
                  </span>
                </label>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t border-[#E5E7EB] bg-white px-5 pt-3 pb-6">
              {uploadProgress != null ? (
                <div>
                  <div className="flex items-center justify-between text-[13px] text-[#2B2437] font-semibold mb-2">
                    <span>{uploadProgress < 50 ? 'वीडियो प्रोसेस हो रहा है...' : 'नवभारत डेस्क को सुरक्षित भेजा जा रहा है...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F1F3F5] overflow-hidden">
                    <motion.div className="h-full bg-[#F5B55C]" animate={{ width: `${uploadProgress}%` }} transition={{ ease: 'easeOut' }} />
                  </div>
                </div>
              ) : (
                <>
                  <p className={`text-[12px] mb-2 text-center font-medium ${isTooLong ? 'text-[#B42318]' : 'text-[#6B7280]'}`}>
                    {missing || `सब तैयार है। आपकी रिपोर्ट तुरंत लाइव प्रसारित हो जाएगी।`}
                  </p>
                  <button
                    type="button"
                    disabled={Boolean(missing)}
                    onClick={handleSubmit}
                    className="w-full h-[50px] rounded-full bg-[#2B2437] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] cursor-pointer disabled:cursor-not-allowed shadow-md"
                  >
                    <Send2 size={18} color={missing ? '#9CA3AF' : '#F5B55C'} variant="Bold" />
                    सीधे लाइव करें
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
              <h3 className="text-[19px] font-bold text-[#2B2437] mt-3">बधाई! आपकी रिपोर्ट लाइव हो गई है</h3>
              <p className="text-[13.5px] text-[#4B5563] mt-1.5 leading-relaxed max-w-[300px]">
                आपकी नागरिक रिपोर्ट स्वीकृत होकर अब {selectedCityName} और सभी पाठकों के फ़ीड में लाइव प्रसारित है।
              </p>
            </div>

            {/* Status Timeline */}
            <div className="mt-5 rounded-[16px] bg-[#F7F7F4] p-4">
              {[
                { icon: TickCircle, color: '#4F7A55', title: 'रिपोर्ट प्राप्त हुई', sub: 'सफलतापूर्वक अपलोड', state: 'done' },
                { icon: TickCircle, color: '#4F7A55', title: 'डेस्क सत्यापन पूरा', sub: `वीडियो व स्थान (${selectedCityName}) स्वीकृत`, state: 'done' },
                { icon: ShieldTick, color: '#4F7A55', title: 'सार्वजनिक प्रसारण लाइव', sub: 'नागरिक रिपोर्टर फ़ीड में अब लाइव है', state: 'done' },
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
              मेरी लाइव रिपोर्ट देखें
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="mt-2.5 w-full h-[46px] rounded-full border border-[#D1D5DB] text-[#2B2437] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Whatsapp size={18} color="#25D366" variant="Bold" />
              व्हाट्सएप पर स्थानीय लोगों को बताएं
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
              <p className="text-[13px] text-[#6B7280] mt-1">आपका वीडियो और लिखी जानकारी हट जाएगी।</p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmDiscard(false)}
                  className="h-11 rounded-full bg-[#2B2437] text-white text-[14px] font-semibold cursor-pointer"
                >
                  जारी रखें
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    onClose();
                  }}
                  className="h-11 rounded-full border border-[#D1D5DB] text-[#B42318] text-[14px] font-semibold cursor-pointer"
                >
                  छोड़ें
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
