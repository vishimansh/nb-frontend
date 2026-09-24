import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DeviceFrame from './components/common/DeviceFrame';
import { OnboardingProvider } from './context/OnboardingContext';
import { FeedProvider } from './context/FeedContext';
import { CityProvider } from './context/CityContext';
import { AdvertiserProvider } from './context/AdvertiserContext';
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
import { SavedArticlesProvider } from './context/SavedArticlesContext';
import SavedArticlesPage from './pages/SavedArticlesPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Advertiser Flow & Dashboard Screens
import AdvertiserIntroScreen from './pages/advertiser/AdvertiserIntroScreen';
import AdvertiserPhoneScreen from './pages/advertiser/AdvertiserPhoneScreen';
import AdvertiserOtpScreen from './pages/advertiser/AdvertiserOtpScreen';
import AdvertiserBusinessProfileScreen from './pages/advertiser/AdvertiserBusinessProfileScreen';
import AdvertiserLocationTaxScreen from './pages/advertiser/AdvertiserLocationTaxScreen';
import AdvertiserGoalScreen from './pages/advertiser/AdvertiserGoalScreen';
import AdvertiserFormatScreen from './pages/advertiser/AdvertiserFormatScreen';
import AdvertiserTargetingScreen from './pages/advertiser/AdvertiserTargetingScreen';
import AdvertiserAudienceScreen from './pages/advertiser/AdvertiserAudienceScreen';
import AdvertiserCreativeScreen from './pages/advertiser/AdvertiserCreativeScreen';
import AdvertiserBudgetScreen from './pages/advertiser/AdvertiserBudgetScreen';
import AdvertiserReviewScreen from './pages/advertiser/AdvertiserReviewScreen';
import AdvertiserPaymentScreen from './pages/advertiser/AdvertiserPaymentScreen';
import AdvertiserDashboardScreen from './pages/advertiser/AdvertiserDashboardScreen';
import AdvertiserAnalyticsScreen from './pages/advertiser/AdvertiserAnalyticsScreen';
import AdvertiserGuard from './components/advertiser/AdvertiserGuard';

export default function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <DeviceFrame>
          <SavedArticlesProvider>
            <CityProvider>
              <FeedProvider>
                <VideoProvider>
                  <AdvertiserProvider>
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
                        element={<SavedArticlesPage />}
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

                      {/* Advertiser Flow & Dashboard Routes */}
                      <Route path="/advertise" element={<Navigate to="/advertise/intro" replace />} />
                      <Route path="/advertise/intro" element={<AdvertiserIntroScreen />} />
                      <Route path="/advertise/phone" element={<AdvertiserPhoneScreen />} />
                      <Route path="/advertise/otp" element={<AdvertiserOtpScreen />} />
                      <Route path="/advertise/business-profile" element={<AdvertiserBusinessProfileScreen />} />
                      <Route path="/advertise/location-tax" element={<AdvertiserLocationTaxScreen />} />
                      <Route path="/advertise/goal" element={<AdvertiserGuard><AdvertiserGoalScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/format" element={<AdvertiserGuard><AdvertiserFormatScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/targeting" element={<AdvertiserGuard><AdvertiserTargetingScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/audience" element={<AdvertiserGuard><AdvertiserAudienceScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/creative" element={<AdvertiserGuard><AdvertiserCreativeScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/budget" element={<AdvertiserGuard><AdvertiserBudgetScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/review" element={<AdvertiserGuard><AdvertiserReviewScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/payment" element={<AdvertiserGuard><AdvertiserPaymentScreen /></AdvertiserGuard>} />
                      <Route path="/advertise/dashboard" element={<AdvertiserDashboardScreen />} />
                      <Route path="/advertise/analytics" element={<AdvertiserAnalyticsScreen />} />

                      <Route path="*" element={<Navigate to="/feed" replace />} />
                    </Routes>
                  </ErrorBoundary>
                </AdvertiserProvider>
              </VideoProvider>
            </FeedProvider>
          </CityProvider>
        </SavedArticlesProvider>
      </DeviceFrame>
      </BrowserRouter>
    </OnboardingProvider>
  );
}
