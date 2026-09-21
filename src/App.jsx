import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DeviceFrame from './components/common/DeviceFrame';
import { OnboardingProvider } from './context/OnboardingContext';
import { FeedProvider } from './context/FeedContext';
import { CityProvider } from './context/CityContext';
import SplashScreen from './pages/onboarding/SplashScreen';
import NotificationsScreen from './pages/onboarding/NotificationsScreen';
import LoginScreen from './pages/onboarding/LoginScreen';
import OtpScreen from './pages/onboarding/OtpScreen';
import StateSelectionScreen from './pages/onboarding/StateSelectionScreen';
import CitySelectionScreen from './pages/onboarding/CitySelectionScreen';
import FeedScreen from './pages/onboarding/FeedScreen';
import HomePage from './pages/HomePage';
import LocalityPickerPage from './pages/LocalityPickerPage';
import CitySelectionPage from './pages/CitySelectionPage';
import StatePage from './pages/StatePage';
import EditStateSelectionPage from './pages/edit/EditStateSelectionPage';
import EditCitySelectionPage from './pages/edit/EditCitySelectionPage';
import MenuScreen from './pages/MenuScreen';
import CategorySelectionScreen from './pages/CategorySelectionScreen';
import ProfileScreen from './pages/ProfileScreen';
import SettingsPrivacyScreen from './pages/SettingsPrivacyScreen';
import PlaceholderScreen from './pages/PlaceholderScreen';
import EPaperPage from './pages/EPaperPage';
import VideosPage from './pages/VideosPage';
import NotificationsFeedPage from './pages/NotificationsFeedPage';
import SearchPage from './pages/SearchPage';
import LiveArticlePage from './pages/LiveArticlePage';
import { VideoProvider } from './context/VideoContext';

import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <DeviceFrame>
          <CityProvider>
            <FeedProvider>
              <VideoProvider>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/article/:id" element={<LiveArticlePage />} />
                    <Route path="/article" element={<Navigate to="/article/live-bhopal-encroachment" replace />} />
                    <Route path="/search" element={<SearchPage />} />
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/onboarding/notifications" element={<NotificationsScreen />} />
                  <Route path="/onboarding/login" element={<LoginScreen />} />
                  <Route path="/onboarding/otp" element={<OtpScreen />} />
                  <Route path="/onboarding/select-state" element={<StateSelectionScreen />} />
                  <Route path="/onboarding/select-city" element={<CitySelectionScreen />} />
                  <Route path="/feed" element={<HomePage />} />
                  <Route path="/city" element={<HomePage />} />
                  <Route path="/city/localities" element={<LocalityPickerPage />} />
                  <Route path="/city/select" element={<CitySelectionPage />} />
                  <Route path="/state" element={<StatePage />} />
                  <Route path="/edit/select-state" element={<EditStateSelectionPage />} />
                  <Route path="/edit/select-city" element={<EditCitySelectionPage />} />
                  <Route
                    path="/menu"
                    element={
                      <div className="w-full h-full relative overflow-hidden bg-[#2B2437]">
                        <div className="absolute inset-0 pointer-events-none select-none filter brightness-[0.88]" aria-hidden="true">
                          <HomePage />
                        </div>
                        <MenuScreen />
                      </div>
                    }
                  />
                  <Route path="/menu/categories" element={<CategorySelectionScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/epaper" element={<EPaperPage />} />
                  <Route path="/videos" element={<VideosPage />} />
                  <Route path="/notifications" element={<NotificationsFeedPage />} />
                  <Route
                    path="/notifications/categories"
                  element={<PlaceholderScreen title="श्रेणी आधारित सूचनाएं" subtitle="विशिष्ट श्रेणियों के लिए सूचनाएं प्रबंधित करें" />}
                />
                <Route
                  path="/saved"
                  element={<PlaceholderScreen title="सेव की गई खबरें" subtitle="आपकी बुकमार्क की गई खबरें यहां दिखाई देंगी" />}
                />
                <Route path="/settings" element={<SettingsPrivacyScreen />} />
                <Route
                  path="/about"
                  element={<PlaceholderScreen title="ऐप की जानकारी" subtitle="नवभारत न्यूज़ ऐप वर्ज़न 1.0.0" />}
                />
                <Route
                  path="/privacy"
                  element={<PlaceholderScreen title="प्राइवेसी पॉलिसी" subtitle="गोपनीयता नीति और डेटा सुरक्षा दिशानिर्देश" />}
                />
                <Route
                  path="/terms"
                  element={<PlaceholderScreen title="नियम एवं शर्तें" subtitle="उपयोग के नियम और कानूनी शर्तें" />}
                />
                <Route path="/home" element={<HomePage />} />
                <Route path="/category/:slug" element={<HomePage />} />
                <Route path="/onboarding/summary" element={<FeedScreen />} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
              </ErrorBoundary>
            </VideoProvider>
          </FeedProvider>
          </CityProvider>
        </DeviceFrame>
      </BrowserRouter>
    </OnboardingProvider>
  );
}
