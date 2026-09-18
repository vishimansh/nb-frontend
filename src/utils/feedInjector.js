/**
 * Guaranteed insertion of all 3 ad formats into the organic news feed.
 * 
 * Ensures all reference campaigns (Toyota Video, Feather Grid, Lumea Carousel)
 * are cleanly interspersed in the prototype feed so reviewers encounter
 * every format within the first few swipes.
 *
 * Sequence:
 *   Item 0: Organic Reel 1
 *   Item 1: Organic Reel 2
 *   Item 2: [AD 1] Toyota Video Ad
 *   Item 3: Organic Reel 3
 *   Item 4: Organic Reel 4
 *   Item 5: [AD 2] Feather 2x2 Grid Ad
 *   Item 6: Organic Reel 5
 *   Item 7: Organic Reel 6
 *   Item 8: [AD 3] Lumea Carousel Ad
 *   Item 9+: Remaining Organic Reels
 */
export const mergeReelsWithAds = (organicReels = [], ads = [], options = {}) => {
  if (!organicReels || organicReels.length === 0) {
    return ads.map((ad, i) => ({ ...ad, instanceId: `ad-${i}`, isAd: true }));
  }
  if (!ads || ads.length === 0) {
    return organicReels.map((r) => ({ ...r, isAd: false }));
  }

  const cadence = options.cadence ?? 2; // Insert an ad after every 2 organic reels
  const merged = [];
  let adIndex = 0;

  organicReels.forEach((reel, index) => {
    merged.push({ ...reel, isAd: false });

    // After every `cadence` organic reels, insert the next ad
    if ((index + 1) % cadence === 0 && adIndex < ads.length) {
      const adTemplate = ads[adIndex];
      merged.push({
        ...adTemplate,
        instanceId: `ad-slot-${merged.length}-${adTemplate.id}`,
        isAd: true,
      });
      adIndex++;
    }
  });

  // Guarantee that any remaining ads are appended so all 3 formats are 100% present
  while (adIndex < ads.length) {
    const adTemplate = ads[adIndex];
    merged.push({
      ...adTemplate,
      instanceId: `ad-slot-${merged.length}-${adTemplate.id}`,
      isAd: true,
    });
    adIndex++;
  }

  return merged;
};
