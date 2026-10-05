import React, { useEffect } from 'react';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';

/**
 * S06_Area:
 * In the redesigned advertisement flow, Location and Budget have been unified into S07_Budget.
 * This screen automatically redirects to 'budget'.
 */
export default function S06_Area() {
  const { navigateTo } = useAdvertiserV2();

  useEffect(() => {
    navigateTo('budget', { replace: true });
  }, [navigateTo]);

  return null;
}
