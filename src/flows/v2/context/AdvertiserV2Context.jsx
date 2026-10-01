import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import {
  loadSavedState,
  saveState,
  loadSavedAccount,
  saveAccount,
  loadSavedSim,
  clearFlowV2Session,
} from '../utils/autosave';
import { getMoneyBreakdown } from '../utils/money';
import { getCategoryById } from '../data/categories';
import { track } from '../utils/track';

export const initialDraftState = {
  goal: 'engagement',
  ctaKey: 'whatsapp_us',
  format: 'feed_card_ad',
  media: { images: [], video: null },
  headline: '',
  description: '',
  contactValue: '',
  linkUrl: '',
  area: { radiusKm: 10, manualCityIds: [], excludedCityIds: [] },
  audience: { gender: 'all', ages: ['18-27', '28-43', '44-59', '60+'] },
  budget: {
    packageId: 'standard',
    dailyAmount: 250,
    days: 7,
    startMode: 'after_review',
    startDate: null,
  },
};

export const initialV2State = {
  nav: {
    current: 'intro',
    history: ['intro'],
    direction: 'forward',
    fromReview: false,
    focusField: null,
    resubmitFor: null,
  },
  auth: { phone: '', otpVerified: false },
  shop: {
    name: '',
    categoryId: '',
    pincode: '',
    cityId: '',
    city: '',
    state: '',
    address: '',
    ownerName: '',
    email: '',
    logoDataUrl: null,
    pin: { lat: null, lng: null },
  },
  identity: { method: null, valueMasked: '', verified: false, verifiedAt: null },
  draft: initialDraftState,
  campaigns: [],
  prefs: { whatsappUpdates: true },
  sim: {
    reviewMode: 'auto_approve',
    paymentOutcome: 'success',
    uploadFails: false,
    sampleData: false,
    showPlaceholderNotes: true,
  },
};

function getMergedInitialState() {
  const saved = loadSavedState();
  const savedAccount = loadSavedAccount();
  const savedSim = loadSavedSim();

  let state = { ...initialV2State };

  if (savedAccount) {
    if (savedAccount.shop) state.shop = { ...state.shop, ...savedAccount.shop };
    if (savedAccount.identity) state.identity = { ...state.identity, ...savedAccount.identity };
    if (savedAccount.phone) state.auth.phone = savedAccount.phone;
  }

  if (saved) {
    state = {
      ...state,
      ...saved,
      shop: { ...state.shop, ...(saved.shop || {}) },
      draft: { ...state.draft, ...(saved.draft || {}) },
      auth: { ...state.auth, ...(saved.auth || {}) },
      identity: { ...state.identity, ...(saved.identity || {}) },
      nav: {
        ...initialV2State.nav,
        ...(saved.nav || {}),
      },
    };
  }

  if (savedSim) {
    state.sim = { ...state.sim, ...savedSim };
  }

  return state;
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let target = obj;
  for (const key of keys) {
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = {};
    }
    target = target[key];
  }
  target[lastKey] = value;
}

function v2Reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      const { screenId, options = {} } = action.payload;
      const history = [...state.nav.history];
      if (history[history.length - 1] !== screenId) {
        history.push(screenId);
      }
      return {
        ...state,
        nav: {
          current: screenId,
          history,
          direction: 'forward',
          fromReview: options.fromReview ?? false,
          focusField: options.focusField ?? null,
          resubmitFor: options.resubmitFor ?? null,
        },
      };
    }

    case 'GO_BACK': {
      const history = [...state.nav.history];
      if (history.length <= 1) {
        return state;
      }
      history.pop();
      const prevScreen = history[history.length - 1];
      return {
        ...state,
        nav: {
          ...state.nav,
          current: prevScreen,
          history,
          direction: 'backward',
          fromReview: false,
          focusField: null,
          resubmitFor: null,
        },
      };
    }

    case 'UPDATE_AUTH': {
      return {
        ...state,
        auth: { ...state.auth, ...action.payload },
      };
    }

    case 'UPDATE_SHOP': {
      const updatedShop = { ...state.shop, ...action.payload };
      return {
        ...state,
        shop: updatedShop,
      };
    }

    case 'UPDATE_DRAFT': {
      const { path, value } = action.payload;
      const draftCopy = JSON.parse(JSON.stringify(state.draft));
      setNestedValue(draftCopy, path, value);
      return {
        ...state,
        draft: draftCopy,
      };
    }

    case 'SET_IDENTITY': {
      return {
        ...state,
        identity: { ...state.identity, ...action.payload },
      };
    }

    case 'RESET_DRAFT': {
      return {
        ...state,
        draft: JSON.parse(JSON.stringify(initialDraftState)),
      };
    }

    case 'LOAD_DRAFT_FROM_CAMPAIGN': {
      const campaign = state.campaigns.find((c) => c.id === action.payload);
      if (!campaign || !campaign.snapshot?.draft) return state;
      return {
        ...state,
        draft: JSON.parse(JSON.stringify(campaign.snapshot.draft)),
      };
    }

    case 'COMMIT_CAMPAIGN': {
      const { dailyAmount, days } = state.draft.budget;
      const money = getMoneyBreakdown(dailyAmount, days);
      const cat = getCategoryById(state.shop.categoryId);

      const newCampaign = {
        id: `cmp-${Date.now()}`,
        orderId: `NB-ADV-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        statusChangedAt: Date.now(),
        status: 'in_review',
        rejection: null,
        snapshot: {
          shop: JSON.parse(JSON.stringify(state.shop)),
          draft: JSON.parse(JSON.stringify(state.draft)),
        },
        money,
        extraCheck: !!cat?.restricted,
        metrics: { views: 0, clicks: 0, contactTaps: 0, spent: 0 },
        sampleSeries: null,
      };

      return {
        ...state,
        campaigns: [newCampaign, ...state.campaigns],
        draft: JSON.parse(JSON.stringify(initialDraftState)),
      };
    }

    case 'SET_CAMPAIGN_STATUS': {
      const { id, status, meta = {} } = action.payload;
      const campaigns = state.campaigns.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status,
          statusChangedAt: Date.now(),
          rejection: meta.rejection ?? (status === 'needs_changes' ? c.rejection : null),
          metrics: meta.metrics ? { ...c.metrics, ...meta.metrics } : c.metrics,
          sampleSeries: meta.sampleSeries ?? c.sampleSeries,
        };
      });
      return { ...state, campaigns };
    }

    case 'TOGGLE_CAMPAIGN_PAUSE': {
      const id = action.payload;
      const campaigns = state.campaigns.map((c) => {
        if (c.id !== id) return c;
        if (c.status !== 'live' && c.status !== 'paused') return c;
        const newStatus = c.status === 'live' ? 'paused' : 'live';
        track(newStatus === 'live' ? 'campaign_resumed' : 'campaign_paused', { id });
        return { ...c, status: newStatus, statusChangedAt: Date.now() };
      });
      return { ...state, campaigns };
    }

    case 'UPDATE_CAMPAIGN_BUDGET': {
      const { id, newDaily } = action.payload;
      const campaigns = state.campaigns.map((c) => {
        if (c.id !== id) return c;
        const updatedMoney = getMoneyBreakdown(newDaily, c.money.days);
        return { ...c, money: updatedMoney };
      });
      return { ...state, campaigns };
    }

    case 'UPDATE_PREFS': {
      return {
        ...state,
        prefs: { ...state.prefs, ...action.payload },
      };
    }

    case 'UPDATE_SIM': {
      return {
        ...state,
        sim: { ...state.sim, ...action.payload },
      };
    }

    case 'LOGOUT': {
      return {
        ...state,
        auth: { phone: '', otpVerified: false },
        nav: {
          current: 'intro',
          history: ['intro'],
          direction: 'forward',
          fromReview: false,
          focusField: null,
          resubmitFor: null,
        },
      };
    }

    case 'RESET_ALL': {
      clearFlowV2Session();
      return JSON.parse(JSON.stringify(initialV2State));
    }

    default:
      return state;
  }
}

const AdvertiserV2Context = createContext(null);

export function AdvertiserV2Provider({ children }) {
  const [state, dispatch] = useReducer(v2Reducer, null, getMergedInitialState);
  const saveTimerRef = useRef(null);

  // Debounced autosave (400ms)
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveState(state);
      if (state.shop?.name || state.identity?.verified || state.auth?.phone) {
        saveAccount({
          shop: state.shop,
          identity: state.identity,
          phone: state.auth.phone,
        });
      }
    }, 400);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state]);

  const navigateTo = (screenId, options = {}) => {
    track('screen_view', { id: screenId });
    dispatch({ type: 'NAVIGATE', payload: { screenId, options } });
  };

  const goBack = () => {
    track('back_tap', { screen: state.nav.current });
    dispatch({ type: 'GO_BACK' });
  };

  const updateAuth = (patch) => dispatch({ type: 'UPDATE_AUTH', payload: patch });
  const updateShop = (patch) => dispatch({ type: 'UPDATE_SHOP', payload: patch });
  const updateDraft = (path, value) => dispatch({ type: 'UPDATE_DRAFT', payload: { path, value } });
  const setIdentity = (patch) => dispatch({ type: 'SET_IDENTITY', payload: patch });
  const resetDraft = () => dispatch({ type: 'RESET_DRAFT' });
  const loadDraftFromCampaign = (campaignId) =>
    dispatch({ type: 'LOAD_DRAFT_FROM_CAMPAIGN', payload: campaignId });
  const commitCampaign = (paymentInfo) => dispatch({ type: 'COMMIT_CAMPAIGN', payload: paymentInfo });
  const setCampaignStatus = (id, status, meta) =>
    dispatch({ type: 'SET_CAMPAIGN_STATUS', payload: { id, status, meta } });
  const toggleCampaignPause = (id) => dispatch({ type: 'TOGGLE_CAMPAIGN_PAUSE', payload: id });
  const updateCampaignBudget = (id, newDaily) =>
    dispatch({ type: 'UPDATE_CAMPAIGN_BUDGET', payload: { id, newDaily } });
  const updatePrefs = (patch) => dispatch({ type: 'UPDATE_PREFS', payload: patch });
  const updateSim = (patch) => dispatch({ type: 'UPDATE_SIM', payload: patch });
  const logout = () => {
    track('logout');
    dispatch({ type: 'LOGOUT' });
  };
  const resetAll = () => {
    track('reset_all');
    dispatch({ type: 'RESET_ALL' });
  };

  return (
    <AdvertiserV2Context.Provider
      value={{
        state,
        dispatch,
        navigateTo,
        goBack,
        updateAuth,
        updateShop,
        updateDraft,
        setIdentity,
        resetDraft,
        loadDraftFromCampaign,
        commitCampaign,
        setCampaignStatus,
        toggleCampaignPause,
        updateCampaignBudget,
        updatePrefs,
        updateSim,
        logout,
        resetAll,
      }}
    >
      {children}
    </AdvertiserV2Context.Provider>
  );
}

export function useAdvertiserV2() {
  const context = useContext(AdvertiserV2Context);
  if (!context) {
    throw new Error('useAdvertiserV2 must be used within an AdvertiserV2Provider');
  }
  return context;
}
