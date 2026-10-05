import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdvertiserTargetingScreen:
 * Location and Budget have been unified into a single streamlined screen at /advertise/budget.
 * This screen redirects seamlessly to /advertise/budget preserving any navigation state.
 */
export default function AdvertiserTargetingScreen() {
  const location = useLocation();
  return <Navigate to="/advertise/budget" replace state={location.state} />;
}
