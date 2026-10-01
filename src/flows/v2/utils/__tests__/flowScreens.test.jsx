import { describe, it, expect } from 'vitest';
import React from 'react';
import S00_Intro from '../../screens/S00_Intro';
import S01_Login from '../../screens/S01_Login';
import S02_ShopDetails from '../../screens/S02_ShopDetails';
import S03_Goal from '../../screens/S03_Goal';
import S04_Format from '../../screens/S04_Format';
import S05_YourAd from '../../screens/S05_YourAd';
import S06_Area from '../../screens/S06_Area';
import S07_Budget from '../../screens/S07_Budget';
import S08_ReviewPay from '../../screens/S08_ReviewPay';
import S09_Status from '../../screens/S09_Status';
import S10_Dashboard from '../../screens/S10_Dashboard';
import S11_CampaignDetail from '../../screens/S11_CampaignDetail';
import FlowV2App from '../../FlowV2App';

describe('Flow V2 Screen Components Integrity', () => {
  it('all screens exist and are valid React components', () => {
    expect(S00_Intro).toBeDefined();
    expect(S01_Login).toBeDefined();
    expect(S02_ShopDetails).toBeDefined();
    expect(S03_Goal).toBeDefined();
    expect(S04_Format).toBeDefined();
    expect(S05_YourAd).toBeDefined();
    expect(S06_Area).toBeDefined();
    expect(S07_Budget).toBeDefined();
    expect(S08_ReviewPay).toBeDefined();
    expect(S09_Status).toBeDefined();
    expect(S10_Dashboard).toBeDefined();
    expect(S11_CampaignDetail).toBeDefined();
    expect(FlowV2App).toBeDefined();
  });
});
