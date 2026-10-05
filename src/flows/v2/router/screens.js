/**
 * Registry of all screens in Flow B.
 * Steps 1 to 7 are the only counted steps shown on the ProgressPill.
 */

export const SCREENS = {
  intro: {
    id: 'intro',
    stepNumber: null,
    requiresAuth: false,
  },
  login: {
    id: 'login',
    stepNumber: null,
    requiresAuth: false,
  },
  shop: {
    id: 'shop',
    stepNumber: 1,
    requiresAuth: true,
  },
  goal: {
    id: 'goal',
    stepNumber: 2,
    requiresAuth: true,
    requiresShop: true,
  },
  format: {
    id: 'format',
    stepNumber: 3,
    requiresAuth: true,
    requiresShop: true,
  },
  ad: {
    id: 'ad',
    stepNumber: 4,
    requiresAuth: true,
    requiresShop: true,
  },
  area: {
    id: 'area',
    stepNumber: null,
    requiresAuth: true,
    requiresShop: true,
  },
  budget: {
    id: 'budget',
    stepNumber: 5,
    requiresAuth: true,
    requiresShop: true,
  },
  review: {
    id: 'review',
    stepNumber: 6,
    requiresAuth: true,
    requiresShop: true,
  },
  status: {
    id: 'status',
    stepNumber: null,
    requiresAuth: true,
  },
  dashboard: {
    id: 'dashboard',
    stepNumber: null,
    requiresAuth: true,
  },
  analytics: {
    id: 'analytics',
    stepNumber: null,
    requiresAuth: true,
  },
};

export const STEP_ORDER = ['shop', 'goal', 'format', 'ad', 'budget', 'review'];

export const getScreenConfig = (screenId) => SCREENS[screenId] || SCREENS.intro;
