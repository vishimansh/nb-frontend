import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  // 1. Notification permission state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 2. Verified mobile phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  // 3. Selected regional states with priority order
  const [selectedStates, setSelectedStatesState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_selected_states');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const setSelectedStates = (action) => {
    setSelectedStatesState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      try {
        localStorage.setItem('nb_selected_states', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // 4. Selected cities / districts
  const [selectedCities, setSelectedCitiesState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_selected_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const setSelectedCities = (action) => {
    setSelectedCitiesState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      try {
        localStorage.setItem('nb_selected_cities', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // 5. User selected categories for Menu & Home feed with localStorage persistence (Default: 7 categories)
  const DEFAULT_CATEGORIES = [
    'politics',
    'entertainment',
    'sports',
    'business',
    'tech',
    'education',
    'astro',
  ];

  const [selectedCategories, setSelectedCategoriesState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_selected_categories');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.length > 7 ? parsed.slice(0, 7) : parsed;
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
        // Clear mock placeholder data from previous prototypes if present
        if (parsed.name === 'हिमांशु विश्वकर्मा' || parsed.phone === '+91 9826012345') {
          localStorage.removeItem('nb_user_profile');
          return {
            name: '',
            phone: '',
            isPhoneVerified: false,
            dob: '',
            gender: '',
            city: '',
            email: '',
            avatarUrl: null,
          };
        }
        return {
          name: parsed.name || '',
          phone: parsed.phone || '',
          isPhoneVerified: parsed.isPhoneVerified ?? false,
          dob: parsed.dob || '',
          gender: parsed.gender || '',
          city: parsed.city || '',
          email: parsed.email || '',
          avatarUrl: parsed.avatarUrl ?? null,
        };
      }
    } catch (e) {}
    return {
      name: '',
      phone: '',
      isPhoneVerified: false,
      dob: '',
      gender: '',
      city: '',
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
   * - Max 3 states can be selected.
   * - Any number of cities can be selected from any of the selected states in any combination.
   */
  const toggleCity = (stateId, cityName) => {
    setSelectedCities((prev) => {
      const isSelected = prev.some(
        (c) => c.stateId === stateId && c.city === cityName
      );
      if (isSelected) {
        return prev.filter(
          (c) => !(c.stateId === stateId && c.city === cityName)
        );
      } else {
        return [...prev, { stateId, city: cityName }];
      }
    });
  };

  // Active state for State News Screen with localStorage persistence
  const [activeStateId, setActiveStateIdState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_active_state_id');
      if (saved) return saved;
    } catch (e) {}
    return selectedStates[0]?.id || 'mp';
  });

  const setActiveStateId = (id) => {
    setActiveStateIdState(id);
    try {
      localStorage.setItem('nb_active_state_id', id);
    } catch (e) {}
  };

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
      return current.filter((c) => validStateIds.has(c.stateId));
    });
  };

  const toggleDraftCity = (stateId, cityName) => {
    setDraftCities((prev) => {
      const current = prev || [];
      const isSelected = current.some(
        (c) => c.stateId === stateId && c.city === cityName
      );

      if (isSelected) {
        return current.filter(
          (c) => !(c.stateId === stateId && c.city === cityName)
        );
      } else {
        return [...current, { stateId, city: cityName }];
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
    setSelectedStates([]);
    setSelectedCities([]);
    setActiveStateId('mp');
    setSelectedCategoriesState(DEFAULT_CATEGORIES);
    setUserProfileState({
      name: '',
      phone: '',
      isPhoneVerified: false,
      dob: '',
      gender: '',
      city: '',
      email: '',
      avatarUrl: null,
    });
    try {
      localStorage.clear();
      sessionStorage.clear();
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
