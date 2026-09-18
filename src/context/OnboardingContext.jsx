import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  // 1. Notification permission state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 2. Verified mobile phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  // 3. Selected regional states with priority order
  // Initial default on first load: Madhya Pradesh (Priority 1)
  const [selectedStates, setSelectedStates] = useState([
    { id: 'mp', name: 'मध्य प्रदेश', priority: 1, landmark: 'सांची स्तूप' },
    { id: 'rj', name: 'राजस्थान', priority: 2, landmark: 'हवा महल' },
    { id: 'mh', name: 'महाराष्ट्र', priority: 3, landmark: 'गेटवे ऑफ इंडिया' },
  ]);

  // 4. Selected cities / districts
  const [selectedCities, setSelectedCities] = useState([
    { stateId: 'mp', city: 'भोपाल' },
    { stateId: 'rj', city: 'जयपुर' },
    { stateId: 'mh', city: 'नागपुर' },
  ]);

  // 5. User selected categories for Menu & Home feed with localStorage persistence
  const DEFAULT_CATEGORIES = [
    'politics',
    'entertainment',
    'sports',
    'business',
    'tech',
    'education',
    'astro',
    'health',
    'lifestyle',
    'auto',
  ];

  const [selectedCategories, setSelectedCategoriesState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_selected_categories');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_CATEGORIES;
  });

  const setSelectedCategories = (newCats) => {
    setSelectedCategoriesState(newCats);
    try {
      localStorage.setItem('nb_selected_categories', JSON.stringify(newCats));
    } catch (e) {}
  };

  // 6. User Profile State with localStorage persistence
  const [userProfile, setUserProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name ?? '',
          phone: parsed.phone || '+91 3425895426',
          isPhoneVerified: parsed.isPhoneVerified ?? true,
          dob: parsed.dob ?? '',
          gender: parsed.gender || 'male',
          city: parsed.city || 'भोपाल',
          email: parsed.email ?? '',
          avatarUrl: parsed.avatarUrl ?? null,
        };
      }
    } catch (e) {}
    return {
      name: '',
      phone: '+91 3425895426',
      isPhoneVerified: true,
      dob: '',
      gender: 'male',
      city: 'भोपाल',
      email: '',
      avatarUrl: null,
    };
  });

  const setUserProfile = (newProfile) => {
    setUserProfileState(newProfile);
    try {
      localStorage.setItem('nb_user_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  // Toast / alert state accessible across screens
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  /**
   * Toggle state selection with automatic renumbering and 3-state maximum limit
   */
  const toggleState = (stateObj) => {
    const isAlreadySelected = selectedStates.some((s) => s.id === stateObj.id);

    if (isAlreadySelected) {
      // Remove and auto-renumber remaining states sequentially (1, 2, 3)
      const remaining = selectedStates
        .filter((s) => s.id !== stateObj.id)
        .map((s, index) => ({
          ...s,
          priority: index + 1,
        }));
      setSelectedStates(remaining);
      // Remove any cities associated with this deselected state
      setSelectedCities((prev) => prev.filter((c) => c.stateId !== stateObj.id));
      return { success: true, action: 'removed' };
    } else {
      if (selectedStates.length >= 3) {
        showAlert('आप अधिकतम 3 राज्य ही चुन सकते हैं');
        return { success: false, reason: 'limit_reached' };
      }
      const newSelected = [
        ...selectedStates,
        {
          id: stateObj.id,
          name: stateObj.name,
          landmark: stateObj.landmark,
          priority: selectedStates.length + 1,
        },
      ];
      setSelectedStates(newSelected);
      return { success: true, action: 'added' };
    }
  };

  /**
   * City selection logic:
   * - If single state selected: user can select up to 3 cities total across that state.
   * - If multi-state or skipped: user can select exactly 1 city per state (radio behavior per state).
   */
  const toggleCity = (stateId, cityName, isSingleStateMode) => {
    const isSelected = selectedCities.some(
      (c) => c.stateId === stateId && c.city === cityName
    );

    if (isSingleStateMode) {
      if (isSelected) {
        setSelectedCities((prev) =>
          prev.filter((c) => !(c.stateId === stateId && c.city === cityName))
        );
      } else {
        const stateCitiesCount = selectedCities.filter((c) => c.stateId === stateId).length;
        if (stateCitiesCount >= 3) {
          showAlert('आप अधिकतम 3 शहर ही चुन सकते हैं');
          return;
        }
        setSelectedCities((prev) => [...prev, { stateId, city: cityName }]);
      }
    } else {
      // Multi-state mode: 1 city per state (replace existing if any in same state)
      if (isSelected) {
        // Toggle off
        setSelectedCities((prev) =>
          prev.filter((c) => !(c.stateId === stateId && c.city === cityName))
        );
      } else {
        // Remove prior city in this state and set this one
        setSelectedCities((prev) => [
          ...prev.filter((c) => c.stateId !== stateId),
          { stateId, city: cityName },
        ]);
      }
    }
  };

  // Active state for State News Screen
  const [activeStateId, setActiveStateId] = useState('mp');

  // Atomic cascade editing drafts (null when not in edit mode)
  const [draftStates, setDraftStates] = useState(null);
  const [draftCities, setDraftCities] = useState(null);

  const startAtomicEdit = () => {
    setDraftStates(selectedStates.map((s) => ({ ...s })));
    setDraftCities(selectedCities.map((c) => ({ ...c })));
  };

  const cancelAtomicEdit = () => {
    setDraftStates(null);
    setDraftCities(null);
  };

  const toggleDraftState = (stateObj) => {
    setDraftStates((prev) => {
      const current = prev || selectedStates;
      const isAlreadySelected = current.some((s) => s.id === stateObj.id);

      if (isAlreadySelected) {
        return current
          .filter((s) => s.id !== stateObj.id)
          .map((s, index) => ({
            ...s,
            priority: index + 1,
          }));
      } else {
        if (current.length >= 3) {
          showAlert('आप अधिकतम 3 राज्य ही चुन सकते हैं');
          return current;
        }
        return [
          ...current,
          {
            id: stateObj.id,
            name: stateObj.name,
            landmark: stateObj.landmark,
            priority: current.length + 1,
          },
        ];
      }
    });
  };

  const reconcileDraftCitiesOnNext = (statesList) => {
    const validStateIds = new Set(statesList.map((s) => s.id));
    setDraftCities((prev) => {
      const current = prev || selectedCities;
      // Remove cities whose state was removed
      const filtered = current.filter((c) => validStateIds.has(c.stateId));
      if (statesList.length > 1) {
        // Enforce max 1 city per state in multi-state mode
        const seen = new Set();
        return filtered.filter((c) => {
          if (seen.has(c.stateId)) return false;
          seen.add(c.stateId);
          return true;
        });
      }
      return filtered.slice(0, 3);
    });
  };

  const toggleDraftCity = (stateId, cityName, isSingleStateMode) => {
    setDraftCities((prev) => {
      const current = prev || [];
      const isSelected = current.some(
        (c) => c.stateId === stateId && c.city === cityName
      );

      if (isSingleStateMode) {
        if (isSelected) {
          return current.filter(
            (c) => !(c.stateId === stateId && c.city === cityName)
          );
        } else {
          const stateCitiesCount = current.filter((c) => c.stateId === stateId).length;
          if (stateCitiesCount >= 3) {
            showAlert('आप अधिकतम 3 शहर ही चुन सकते हैं');
            return current;
          }
          return [...current, { stateId, city: cityName }];
        }
      } else {
        if (isSelected) {
          return current.filter(
            (c) => !(c.stateId === stateId && c.city === cityName)
          );
        } else {
          return [
            ...current.filter((c) => c.stateId !== stateId),
            { stateId, city: cityName },
          ];
        }
      }
    });
  };

  const commitAtomicEdit = () => {
    const finalStates = draftStates !== null ? draftStates : selectedStates;
    const finalCities = draftCities !== null ? draftCities : selectedCities;

    setSelectedStates(finalStates);
    setSelectedCities(finalCities);

    // Update activeStateId if current active state was removed
    if (finalStates.length > 0) {
      if (!finalStates.some((s) => s.id === activeStateId)) {
        setActiveStateId(finalStates[0].id);
      }
    } else {
      setActiveStateId(null);
    }

    setDraftStates(null);
    setDraftCities(null);
  };

  const resetOnboarding = () => {
    setNotificationsEnabled(false);
    setPhoneNumber('');
    setSelectedStates([
      { id: 'mp', name: 'मध्य प्रदेश', priority: 1, landmark: 'सांची स्तूप' },
      { id: 'rj', name: 'राजस्थान', priority: 2, landmark: 'हवा महल' },
      { id: 'mh', name: 'महाराष्ट्र', priority: 3, landmark: 'गेटवे ऑफ इंडिया' },
    ]);
    setSelectedCities([
      { stateId: 'mp', city: 'भोपाल' },
      { stateId: 'rj', city: 'जयपुर' },
      { stateId: 'mh', city: 'नागपुर' },
    ]);
    setActiveStateId('mp');
    setSelectedCategoriesState(['politics', 'entertainment', 'sports']);
    setUserProfileState({
      name: null,
      phone: '+91 9876543210',
      avatarUrl: null,
    });
    try {
      localStorage.removeItem('nb_selected_categories');
      localStorage.removeItem('nb_user_profile');
    } catch (e) {}
    setDraftStates(null);
    setDraftCities(null);
  };

  return (
    <OnboardingContext.Provider
      value={{
        notificationsEnabled,
        setNotificationsEnabled,
        phoneNumber,
        setPhoneNumber,
        selectedStates,
        setSelectedStates,
        selectedCities,
        setSelectedCities,
        selectedCategories,
        setSelectedCategories,
        userProfile,
        setUserProfile,
        activeStateId,
        setActiveStateId,
        draftStates,
        setDraftStates,
        draftCities,
        setDraftCities,
        startAtomicEdit,
        cancelAtomicEdit,
        toggleDraftState,
        reconcileDraftCitiesOnNext,
        toggleDraftCity,
        commitAtomicEdit,
        toggleState,
        toggleCity,
        alertMessage,
        showAlert,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
