import React, { useState, useEffect } from 'react';
import './theme/tokens.css';
import { ToastV2Provider } from './context/ToastV2Context';
import { AdvertiserV2Provider, useAdvertiserV2 } from './context/AdvertiserV2Context';
import { useReviewSimulation } from './hooks/useReviewSimulation';
import PhoneFrame from './components/chrome/PhoneFrame';
import Toast from './components/ui/Toast';
import FacilitatorPanel from './components/chrome/FacilitatorPanel';

// Screens
import S00_Intro from './screens/S00_Intro';
import S01_Login from './screens/S01_Login';
import S02_ShopDetails from './screens/S02_ShopDetails';
import S03_Goal from './screens/S03_Goal';
import S04_Format from './screens/S04_Format';
import S05_YourAd from './screens/S05_YourAd';
import S06_Area from './screens/S06_Area';
import S07_Budget from './screens/S07_Budget';
import S08_ReviewPay from './screens/S08_ReviewPay';
import S09_Status from './screens/S09_Status';
import S10_Dashboard from './screens/S10_Dashboard';
import S11_CampaignDetail from './screens/S11_CampaignDetail';

const SCREEN_COMPONENTS = {
  intro: S00_Intro,
  login: S01_Login,
  shop: S02_ShopDetails,
  goal: S03_Goal,
  format: S04_Format,
  ad: S05_YourAd,
  area: S06_Area,
  budget: S07_Budget,
  review: S08_ReviewPay,
  status: S09_Status,
  dashboard: S10_Dashboard,
  analytics: S11_CampaignDetail,
};

class FlowV2ScreenErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Flow B Screen Error caught:', error, info);
  }

  handleScreenReset = () => {
    localStorage.removeItem('nb2_state');
    window.location.href = '/?flow=b';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-[#F7F7F4] p-6 flex flex-col items-center justify-center text-center gap-4 select-none">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-2xl font-bold shadow-xs">
            ⚠️
          </div>
          <h3 className="text-[17px] font-bold text-[#2B2437]">
            स्क्रीन लोड करने में समस्या आई
          </h3>
          <p className="text-[12.5px] text-[#6B7280] max-w-[280px]">
            {this.state.error?.message || 'डेटा सिंक करने में रुकावट आई. कृपया नीचे दिए बटन से फ़्लो फिर से शुरू करें.'}
          </p>
          <button
            type="button"
            onClick={this.handleScreenReset}
            className="px-5 py-2.5 rounded-xl bg-[#2B2437] text-white font-bold text-[13.5px] shadow-sm active:scale-95 transition-transform"
          >
            फ़्लो रीसेट करें
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function FlowV2Inner() {
  const { state } = useAdvertiserV2();
  const [showFacilitator, setShowFacilitator] = useState(false);

  // Activate review simulation & sample metrics
  useReviewSimulation();

  // Listen for Ctrl+Shift+F to open Facilitator Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setShowFacilitator((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentScreenId = state.nav?.current || 'intro';
  const CurrentScreenComponent = SCREEN_COMPONENTS[currentScreenId] || S00_Intro;
  const slideDirection = state.nav?.direction === 'backward' ? 'nb2-screen-slide-backward' : 'nb2-screen-slide-forward';

  return (
    <PhoneFrame>
      <div className={`w-full h-full relative overflow-hidden flex flex-col ${slideDirection}`} key={currentScreenId}>
        <FlowV2ScreenErrorBoundary key={currentScreenId}>
          <CurrentScreenComponent onOpenFacilitator={() => setShowFacilitator(true)} />
        </FlowV2ScreenErrorBoundary>
      </div>

      {/* Floating Global Toast (96px above bottom) */}
      <Toast />

      {/* Facilitator Panel Bottom Sheet (inside phone frame) */}
      <FacilitatorPanel
        isOpen={showFacilitator}
        onClose={() => setShowFacilitator(false)}
      />
    </PhoneFrame>
  );
}

class FlowV2ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Flow B Root Error caught:', error, info);
  }

  handleReset = () => {
    localStorage.removeItem('nb2_state');
    window.location.href = '/?flow=b';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-[#E5E7EB] p-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-3xl font-bold shadow-md">
            ⚠️
          </div>
          <h3 className="text-[20px] font-bold text-[#2B2437]">
            फ़्लो लोड करने में समस्या आई
          </h3>
          <p className="text-[14px] text-[#6B7280] max-w-[340px]">
            {this.state.error?.message || 'कृपया नीचे दिए गए बटन पर टैप करके फ़्लो को फिर से शुरू करें.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-[#2B2437] text-white font-bold text-[15px] shadow-md active:scale-95 transition-transform"
          >
            फ़्लो रीसेट करें
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FlowV2App() {
  return (
    <FlowV2ErrorBoundary>
      <ToastV2Provider>
        <AdvertiserV2Provider>
          <FlowV2Inner />
        </AdvertiserV2Provider>
      </ToastV2Provider>
    </FlowV2ErrorBoundary>
  );
}
