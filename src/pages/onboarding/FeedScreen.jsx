import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Refresh2, Notification, Location, Call, ShieldTick } from 'iconsax-react';
import NavaBharatLogo from '../../components/common/NavaBharatLogo';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Feed Landing Screen (Placeholder with summary of onboarding selections)
 */
export default function FeedScreen() {
  const navigate = useNavigate();
  const {
    notificationsEnabled,
    phoneNumber,
    selectedStates,
    selectedCities,
    resetOnboarding,
  } = useOnboarding();

  const handleRestart = () => {
    resetOnboarding();
    navigate('/');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-between pt-[64px] pb-10 px-6 select-none overflow-y-auto scrollbar-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
          <NavaBharatLogo className="scale-90 origin-left" />
          <div className="w-8 h-8 rounded-full bg-[#1E213D]/5 flex items-center justify-center">
            <Notification size={18} color="#1E213D" variant="Linear" />
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="mt-5 p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-card-soft">
          <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
            <ShieldTick size={18} color="#059669" variant="Bold" />
            <span className="text-xs font-bold uppercase tracking-wider">ऑनबोर्डिंग पूर्ण</span>
          </div>
          <h2 className="text-lg font-bold text-[#1E213D]">
            होम फीड (प्रोटोटाइप जल्द आ रहा है)
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            आपकी प्राथमिकताओं के आधार पर आपकी व्यक्तिगत हाइपरलोकल समाचार फीड तैयार की जा रही है।
          </p>
        </div>

        {/* User Selection Summary */}
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-bold text-[#1E213D] uppercase tracking-wider px-1">
            आपकी चुनी हुई प्राथमिकताएं
          </h3>

          {/* Phone & Notifications */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Call size={16} color="#1E213D" variant="Linear" />
              <span className="font-semibold text-[#1E213D]">
                {phoneNumber || '+91 9876543210'}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                notificationsEnabled
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {notificationsEnabled ? 'नोटिफिकेशन सक्रिय' : 'नोटिफिकेशन बंद'}
            </span>
          </div>

          {/* States Selected */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#1E213D]">
              <Location size={16} color="#EEEBDA" variant="Bold" />
              <span>चुने गए राज्य (प्राथमिकता अनुसार)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedStates.length > 0 ? (
                selectedStates.map((st) => (
                  <span
                    key={st.id}
                    className="inline-flex items-center gap-1.5 bg-[#1E213D]/5 border border-[#1E213D]/15 px-3 py-1 rounded-full text-xs font-medium text-[#1E213D]"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#EEEBDA] text-white flex items-center justify-center text-[10px] font-bold">
                      {st.priority}
                    </span>
                    <span>{st.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#6B7280]">कोई राज्य नहीं चुना (सभी राज्य)</span>
              )}
            </div>
          </div>

          {/* Cities Selected */}
          <div className="bg-white rounded-xl p-3 border border-[#E5E7EB]">
            <div className="text-xs font-bold text-[#1E213D] mb-2">
              चुने गए शहर ({selectedCities.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedCities.length > 0 ? (
                selectedCities.map((c, i) => (
                  <span
                    key={i}
                    className="bg-[#1E213D] text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {c.city}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#6B7280]">कोई शहर नहीं चुना गया</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restart CTA */}
      <div className="mt-6">
        <button
          onClick={handleRestart}
          className="w-full h-[56px] rounded-[16px] bg-[#1E213D] text-white font-bold text-[15px] shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1f304d] transition-colors"
        >
          <Refresh2 size={18} color="#FFFFFF" variant="Linear" />
          <span>प्रोटोटाइप रीसेट और दोबारा शुरू करें</span>
        </button>
      </div>
    </div>
  );
}
