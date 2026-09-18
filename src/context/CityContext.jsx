import React, { createContext, useContext, useState } from 'react';
import cityNewsData from '../data/cityNewsData.json';

export const CityContext = createContext(null);

const DEFAULT_SELECTED_LOCALITIES = {
  bhopal: ['mp_nagar', 'arera_colony', 'berasia', 'phanda'],
  jaipur: ['vaishali_nagar', 'malviya_nagar'],
  nagpur: ['dharampeth'],
};

const DEFAULT_ZONE_FILTERS = {
  bhopal: 'all',
  jaipur: 'all',
  nagpur: 'all',
};

export const SAVED_CITY_META = [
  { id: 'bhopal', name: 'भोपाल', state: 'मध्य प्रदेश' },
  { id: 'jaipur', name: 'जयपुर', state: 'राजस्थान' },
  { id: 'nagpur', name: 'नागपुर', state: 'महाराष्ट्र' },
];

export function CityProvider({ children }) {
  const [savedCities, setSavedCities] = useState(SAVED_CITY_META);
  const [activeCityId, setActiveCityId] = useState('bhopal');
  const [selectedLocalitiesByCity, setSelectedLocalitiesByCity] = useState(
    DEFAULT_SELECTED_LOCALITIES
  );
  const [activeZoneFilterByCity, setActiveZoneFilterByCity] = useState(
    DEFAULT_ZONE_FILTERS
  );

  const updateSavedCities = (newCities) => {
    setSavedCities(newCities);
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
        : [...currentList, localityId]; // No limit / cap

      return {
        ...prev,
        [cityId]: updatedList,
      };
    });
  };

  const activeZone = activeZoneFilterByCity[activeCityId] || 'all';
  const activeLocalities = selectedLocalitiesByCity[activeCityId] || [];
  const currentCityObj = savedCities.find((c) => c.id === activeCityId);
  const currentCityData =
    cityNewsData.cities[activeCityId] || {
      id: activeCityId,
      name: currentCityObj?.name || 'शहर',
      urbanZones: [],
      ruralZones: [],
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
