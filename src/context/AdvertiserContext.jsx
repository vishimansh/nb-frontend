import React, { createContext, useContext, useState, useEffect } from 'react';

export const AdvertiserContext = createContext();

const INITIAL_DRAFT_CAMPAIGN = {
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  businessLogoUrl: null,
  businessCategory: '',
  state: 'mp',
  city: 'bhopal',
  hasGstin: false, // Default to unregistered / without GSTIN
  idNumberMasked: '',
  idNumberRaw: '',
  gstin: '',
  goal: 'reach', // 'reach' | 'engagement' | 'ctrs'
  format: 'video_ad', // 'video_ad' | 'grid_ad' | 'carousel_ad' | 'feed_card_ad' | 'sponsored_ad'
  targetingType: 'radius', // 'radius' | 'district'
  radiusKm: 10, // Max 25 km
  selectedDistricts: ['bhopal'],
  selectedStates: [],
  isWholeStateSelected: false,
  baseReach: 7631, // Geographical reach from targeting step
  gender: 'all', // 'all' | 'male' | 'female'
  selectedGenerations: ['genz', 'millennial', 'boomer'],
  ageRange: [18, 65], // Derived from selected generations
  uploadedCreativeUrl: null,
  creativeFileName: '',
  creativeFileSize: '',
  aspectRatioValid: true,
  headline: '',
  description: '',
  gridImages: ['', '', '', ''],
  carouselImages: ['', '', ''],
  feedCardImage: null,
  sponsoredCardImage: null,
  sponsorTag: 'प्रायोजित',
  callNumber: '',
  keywords: [],
  selectedCategories: ['व्यापार', 'स्थानीय समाचार'],
  selectedFestivals: [],
  ctaText: 'अधिक जानें',
  destinationUrl: '',
  storeAddress: '',
  pincode: '',
  dailyBudget: 250, // Minimum slider is ₹100, max ₹2,500
  durationDays: 7,
  paymentMethod: 'upi', // 'upi' | 'card' | 'netbanking'
};

const INITIAL_CAMPAIGNS = [];

export const AdvertiserProvider = ({ children }) => {
  // Persistent Business Profile (retained across all campaigns)
  const [businessProfile, setBusinessProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_business_profile');
      return saved ? JSON.parse(saved) : {
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        businessLogoUrl: null,
        businessCategory: '',
        storeAddress: '',
        pincode: '',
        hasGstin: false,
        idNumberMasked: '',
        idNumberRaw: '',
        gstin: '',
      };
    } catch {
      return {
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        businessLogoUrl: null,
        businessCategory: '',
        storeAddress: '',
        pincode: '',
        hasGstin: false,
        idNumberMasked: '',
        idNumberRaw: '',
        gstin: '',
      };
    }
  });

  // Business Profile completion state (shown only once on first visit)
  const [isBusinessProfileSaved, setIsBusinessProfileSaved] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_business_profile_saved');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Authentication state independent of reader app session
  const [advertiserAuth, setAdvertiserAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_advertiser_auth');
      return saved ? JSON.parse(saved) : {
        isAuthenticated: false,
        phone: '',
        otpVerified: false,
      };
    } catch {
      return {
        isAuthenticated: false,
        phone: '',
        otpVerified: false,
      };
    }
  });

  // Staged wizard state for Screens 1-12
  const [draftCampaign, setDraftCampaign] = useState(() => {
    try {
      const saved = sessionStorage.getItem('nb_draft_campaign');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.businessName === 'शर्मा किराना एवं जनरल स्टोर') {
          sessionStorage.removeItem('nb_draft_campaign');
          return { ...INITIAL_DRAFT_CAMPAIGN, ...businessProfile };
        }
        return {
          ...INITIAL_DRAFT_CAMPAIGN,
          ...businessProfile,
          ...parsed,
        };
      }
      return { ...INITIAL_DRAFT_CAMPAIGN, ...businessProfile };
    } catch {
      return { ...INITIAL_DRAFT_CAMPAIGN, ...businessProfile };
    }
  });

  // Persisted campaigns - default to 0 running campaigns
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_campaigns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((c) => c.businessName?.includes('शर्मा किराना'))) {
          localStorage.removeItem('nb_campaigns');
          return INITIAL_CAMPAIGNS;
        }
        return parsed;
      }
      return INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  // Keep storage synchronized
  useEffect(() => {
    try {
      localStorage.setItem('nb_business_profile', JSON.stringify(businessProfile));
    } catch (e) {
      console.warn('Failed to save businessProfile', e);
    }
  }, [businessProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('nb_business_profile_saved', isBusinessProfileSaved ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save isBusinessProfileSaved', e);
    }
  }, [isBusinessProfileSaved]);

  useEffect(() => {
    try {
      localStorage.setItem('nb_advertiser_auth', JSON.stringify(advertiserAuth));
    } catch (e) {
      console.warn('Failed to save advertiserAuth', e);
    }
  }, [advertiserAuth]);

  useEffect(() => {
    try {
      sessionStorage.setItem('nb_draft_campaign', JSON.stringify(draftCampaign));
    } catch (e) {
      console.warn('Failed to save draftCampaign', e);
    }
  }, [draftCampaign]);

  useEffect(() => {
    try {
      localStorage.setItem('nb_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.warn('Failed to save campaigns', e);
    }
  }, [campaigns]);

  // Only these keys belong to the persistent business profile.
  // Propagating only these to draftCampaign prevents accidental overwrite
  // of campaign-specific fields (goal, format, targeting, etc.).
  const BUSINESS_PROFILE_KEYS = new Set([
    'businessName', 'ownerName', 'phone', 'email', 'businessLogoUrl',
    'businessCategory', 'storeAddress', 'pincode', 'hasGstin',
    'idNumberMasked', 'idNumberRaw', 'gstin',
  ]);

  const updateBusinessProfile = (fields) => {
    setBusinessProfile((prev) => {
      const updated = { ...prev, ...fields };
      try {
        localStorage.setItem('nb_business_profile', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    // Only propagate known business-profile fields — never overwrite campaign steps
    const bpOnly = Object.fromEntries(
      Object.entries(fields).filter(([k]) => BUSINESS_PROFILE_KEYS.has(k))
    );
    if (Object.keys(bpOnly).length > 0) {
      setDraftCampaign((prev) => ({ ...prev, ...bpOnly }));
    }
  };

  const updateDraftCampaign = (fields) => {
    setDraftCampaign((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const resetDraftCampaign = () => {
    setDraftCampaign({
      ...INITIAL_DRAFT_CAMPAIGN,
      ...businessProfile,
    });
    try {
      sessionStorage.removeItem('nb_draft_campaign');
    } catch (e) {
      // ignore
    }
  };

  const commitCampaign = () => {
    const dailyBudget = Number(draftCampaign.dailyBudget || 250);
    const durationDays = Number(draftCampaign.durationDays || 7);
    const subtotal = dailyBudget * durationDays;
    const gst = Math.round(subtotal * 0.18);
    const totalSpend = draftCampaign.grandTotal || (subtotal + gst);

    // Reach calculation directly matching the ADs flow screens (Targeting / Audience / Budget):
    const baseReach = draftCampaign.baseReach || 7631;
    const estimatedReach = draftCampaign.estimatedReach || Math.min(
      Math.round(baseReach * 3.5),
      Math.max(1200, Math.round(dailyBudget * 28.5 * (durationDays / 7)))
    );
    const totalImpressions = draftCampaign.audienceReach || estimatedReach;

    // Goal-aware CTR matching the flow (Screen 1 Goal):
    // reach: 0.94%, engagement: 1.25%, ctrs: 1.6%
    const goal = draftCampaign.goal || 'reach';
    const ctr = goal === 'ctrs' ? 1.6 : goal === 'engagement' ? 1.25 : 0.94;
    const totalClicks = Math.max(1, Math.round(totalImpressions * (ctr / 100)));

    const now = Date.now();
    const newCampaign = {
      id: `cmp-${now}`,
      orderId: `NB-ADV-${Math.floor(10000 + Math.random() * 90000)}`,
      // New campaigns enter 'pending_review' and automatically go live in 5 seconds
      status: 'pending_review',
      createdAt: now,
      businessName: draftCampaign.businessName || businessProfile.businessName || 'मेरा नया व्यापार',
      businessCategory: draftCampaign.businessCategory || businessProfile.businessCategory || 'दुकान व परिधान',
      format: draftCampaign.format || 'video_ad',  // 'feed_banner' was never a valid format
      goal,
      dailyBudget,
      totalSpend: Number(totalSpend.toFixed(2)),
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr,
      // Store as DD-MM-YYYY, consistent with AdvertiserBudgetScreen's getTodayFormatted()
      startDate: draftCampaign.startDate || (() => {
        const t = new Date();
        return `${String(t.getDate()).padStart(2,'0')}-${String(t.getMonth()+1).padStart(2,'0')}-${t.getFullYear()}`;
      })(),
      durationDays,
      metricsByAge: [
        { bracket: '18–24 वर्ष', percent: 18 },
        { bracket: '25–34 वर्ष', percent: 46 },
        { bracket: '35–44 वर्ष', percent: 28 },
        { bracket: '45+ वर्ष', percent: 8 },
      ],
      details: {
        ...draftCampaign,
        idNumberRaw: undefined, // Never keep raw in campaign records
      },
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    resetDraftCampaign();
    return newCampaign;
  };

  const toggleCampaignStatus = (campaignId) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          if (c.status === 'pending_review') {
            // Simulated instant approval if tapped during testing
            return { ...c, status: 'live' };
          }
          const newStatus = c.status === 'live' ? 'paused' : 'live';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const approveCampaign = (campaignId) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'live' } : c))
    );
  };

  const logoutAdvertiser = () => {
    setAdvertiserAuth({
      isAuthenticated: false,
      phone: '',
      otpVerified: false,
    });
    // Fault fix: also reset isBusinessProfileSaved so next login re-verifies identity
    setIsBusinessProfileSaved(false);
    try {
      localStorage.removeItem('nb_advertiser_auth');
      localStorage.removeItem('nb_business_profile_saved');
      sessionStorage.removeItem('nb_draft_campaign');
    } catch (e) {
      console.warn('Failed to clear advertiser session', e);
    }
  };

  const updateCampaignBudget = (campaignId, newDailyBudget) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const budgetNum = Number(newDailyBudget);
          const ratio = budgetNum / (c.dailyBudget || 1);
          return {
            ...c,
            dailyBudget: budgetNum,
            totalSpend: Number((c.totalSpend * ratio).toFixed(2)),
          };
        }
        return c;
      })
    );
  };

  return (
    <AdvertiserContext.Provider
      value={{
        businessProfile,
        updateBusinessProfile,
        isBusinessProfileSaved,
        setIsBusinessProfileSaved,
        advertiserAuth,
        setAdvertiserAuth,
        draftCampaign,
        setDraftCampaign,
        updateDraftCampaign,
        resetDraftCampaign,
        commitCampaign,
        campaigns,
        setCampaigns,
        toggleCampaignStatus,
        approveCampaign,
        updateCampaignBudget,
        logoutAdvertiser,
      }}
    >
      {children}
    </AdvertiserContext.Provider>
  );
};

export const useAdvertiser = () => {
  const context = useContext(AdvertiserContext);
  if (!context) {
    throw new Error('useAdvertiser must be used within an AdvertiserProvider');
  }
  return context;
};
