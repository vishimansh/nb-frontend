import React, { createContext, useContext, useState, useEffect } from 'react';
import cityNewsData from '../data/cityNewsData.json';
import { useOnboarding } from './OnboardingContext';
import { CITY_NAME_TO_ID, CITIES_BY_STATE } from '../data/onboardingData';

export const CityContext = createContext(null);

const DEFAULT_SELECTED_LOCALITIES = {
  bhopal: ['mp_nagar', 'arera_colony', 'berasia', 'phanda'],
  indore: ['vijay_nagar', 'palasia', 'chhappan_dukan'],
  gwalior: ['lashkar', 'city_center'],
  jabalpur: ['madan_mahal', 'wright_town'],
  jaipur: ['vaishali_nagar', 'malviya_nagar'],
  jodhpur: ['sardarpura', 'ratanada'],
  nagpur: ['dharampeth', 'sitabuldi'],
  mumbai: ['bandra', 'andheri'],
  pune: ['kothrud', 'shivaji_nagar'],
  raipur: ['pandri', 'telibandha'],
  bilaspur: ['vyapar_vihar', 'civil_lines'],
  ahmedabad: ['bodakdev', 'ashram_road'],
  surat: ['vesu', 'athwa'],
};

const DEFAULT_ZONE_FILTERS = {
  bhopal: 'all',
  indore: 'all',
  gwalior: 'all',
  jabalpur: 'all',
  jaipur: 'all',
  jodhpur: 'all',
  nagpur: 'all',
  mumbai: 'all',
  pune: 'all',
  raipur: 'all',
  bilaspur: 'all',
  ahmedabad: 'all',
  surat: 'all',
};

export const SAVED_CITY_META = [
  { id: 'bhopal', name: 'भोपाल', state: 'मध्य प्रदेश' },
  { id: 'jaipur', name: 'जयपुर', state: 'राजस्थान' },
  { id: 'nagpur', name: 'नागपुर', state: 'महाराष्ट्र' },
];

export function CityProvider({ children }) {
  const onboarding = useOnboarding();
  const selectedCities = onboarding?.selectedCities || [];

  // Helper to map onboarding selectedCities [{stateId, city}] to savedCities [{id, name, state}]
  const mapOnboardingToSavedCities = (cities) => {
    if (!cities || cities.length === 0) return SAVED_CITY_META;
    return cities.map((c) => {
      const cityId = CITY_NAME_TO_ID[c.city] || c.city.toLowerCase().replace(/\s+/g, '_');
      const stateData = CITIES_BY_STATE[c.stateId];
      return {
        id: cityId,
        name: c.city,
        state: stateData?.stateName || 'मध्य प्रदेश',
      };
    });
  };

  const [savedCities, setSavedCities] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_saved_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return mapOnboardingToSavedCities(selectedCities);
  });

  const [activeCityId, setActiveCityIdState] = useState(() => {
    try {
      const saved = localStorage.getItem('nb_active_city_id');
      if (saved) return saved;
    } catch (e) {}
    return savedCities[0]?.id || 'bhopal';
  });

  const setActiveCityId = (id) => {
    setActiveCityIdState(id);
    try {
      localStorage.setItem('nb_active_city_id', id);
    } catch (e) {}
  };

  // Keep savedCities in sync whenever onboarding.selectedCities changes
  useEffect(() => {
    if (selectedCities && selectedCities.length > 0) {
      const mapped = mapOnboardingToSavedCities(selectedCities);
      setSavedCities(mapped);
      try {
        localStorage.setItem('nb_saved_cities', JSON.stringify(mapped));
      } catch (e) {}
    }
  }, [selectedCities]);

  // Ensure activeCityId always corresponds to one of the saved cities
  useEffect(() => {
    if (savedCities.length > 0 && !savedCities.some((c) => c.id === activeCityId)) {
      setActiveCityId(savedCities[0].id);
    }
  }, [savedCities, activeCityId]);

  const [selectedLocalitiesByCity, setSelectedLocalitiesByCity] = useState(
    DEFAULT_SELECTED_LOCALITIES
  );
  const [activeZoneFilterByCity, setActiveZoneFilterByCity] = useState(
    DEFAULT_ZONE_FILTERS
  );

  const updateSavedCities = (newCities) => {
    setSavedCities(newCities);
    try {
      localStorage.setItem('nb_saved_cities', JSON.stringify(newCities));
    } catch (e) {}

    // Synchronize back to OnboardingContext if possible
    if (onboarding?.setSelectedCities) {
      const reverseMapped = newCities.map((c) => {
        // Find stateId by matching state name in CITIES_BY_STATE
        let stateId = 'mp';
        for (const [sId, sData] of Object.entries(CITIES_BY_STATE)) {
          if (sData.stateName === c.state || sData.all.includes(c.name)) {
            stateId = sId;
            break;
          }
        }
        return { stateId, city: c.name };
      });
      onboarding.setSelectedCities(reverseMapped);
    }

    if (newCities.length > 0 && !newCities.some((c) => c.id === activeCityId)) {
      setActiveCityId(newCities[0].id);
    }
  };

  const setZoneFilter = (cityId, zoneId) => {
    setActiveZoneFilterByCity((prev) => ({
      ...prev,
      [cityId]: zoneId,
    }));
  };

  const updateLocalities = (cityId, localityIds) => {
    setSelectedLocalitiesByCity((prev) => ({
      ...prev,
      [cityId]: localityIds,
    }));
  };

  const toggleLocality = (cityId, localityId) => {
    setSelectedLocalitiesByCity((prev) => {
      const currentList = prev[cityId] || [];
      const isSelected = currentList.includes(localityId);
      const updatedList = isSelected
        ? currentList.filter((id) => id !== localityId)
        : [...currentList, localityId];

      return {
        ...prev,
        [cityId]: updatedList,
      };
    });
  };

  const activeZone = activeZoneFilterByCity[activeCityId] || 'all';
  const activeLocalities = selectedLocalitiesByCity[activeCityId] || [];
  const currentCityObj = savedCities.find((c) => c.id === activeCityId) || savedCities[0];

  const currentCityData =
    cityNewsData.cities[activeCityId] || {
      id: activeCityId,
      name: currentCityObj?.name || 'शहर',
      urbanZones: [
        { id: `${activeCityId}_main`, name: 'मुख्य शहर' },
        { id: `${activeCityId}_market`, name: 'बाजार क्षेत्र' },
        { id: `${activeCityId}_station`, name: 'स्टेशन रोड' },
        { id: `${activeCityId}_civil`, name: 'सिविल लाइन्स' },
      ],
      ruralZones: [
        { id: `${activeCityId}_rural`, name: 'ग्रामीण क्षेत्र' },
      ],
    };

  return (
    <CityContext.Provider
      value={{
        savedCities,
        setSavedCities,
        updateSavedCities,
        activeCityId,
        setActiveCityId,
        selectedLocalitiesByCity,
        activeZoneFilterByCity,
        activeZone,
        activeLocalities,
        currentCityData,
        allCitiesData: cityNewsData.cities,
        articles: cityNewsData.articles,
        setZoneFilter,
        updateLocalities,
        toggleLocality,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
