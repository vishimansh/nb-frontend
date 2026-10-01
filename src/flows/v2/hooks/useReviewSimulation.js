import { useEffect } from 'react';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { viewsBought, peopleReached, areaReaders } from '../utils/reach';

/**
 * Handles the simulation state machine for campaigns (review progress, rejection, approval, live, and metrics growth).
 */
export function useReviewSimulation() {
  const { state, setCampaignStatus } = useAdvertiserV2();
  const { campaigns, sim } = state;

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();

      campaigns.forEach((campaign) => {
        const { id, status, statusChangedAt, snapshot, money } = campaign;
        const elapsedSec = (now - statusChangedAt) / 1000;

        // 1. IN_REVIEW state machine
        if (status === 'in_review') {
          if (sim.reviewMode === 'hold') {
            return;
          }

          if (sim.reviewMode === 'reject_once' && !campaign.hasBeenRejected) {
            if (elapsedSec >= 5) {
              setCampaignStatus(id, 'needs_changes', {
                rejection: {
                  reasonId: sim.rejectReasonId || 'unprovable_claim',
                  field: 'headline',
                },
              });
            }
            return;
          }

          // auto_approve (or reject_once after resubmission)
          if (elapsedSec >= 8) {
            // Check if scheduled for a future date
            const startMode = snapshot?.draft?.budget?.startMode;
            const startDate = snapshot?.draft?.budget?.startDate;

            if (startMode === 'scheduled' && startDate) {
              setCampaignStatus(id, 'approved');
            } else {
              setCampaignStatus(id, 'approved');
            }
          }
        }

        // 2. APPROVED state transition to LIVE or SCHEDULED
        if (status === 'approved') {
          if (elapsedSec >= 3) {
            const startMode = snapshot?.draft?.budget?.startMode;
            if (startMode === 'scheduled') {
              setCampaignStatus(id, 'scheduled');
            } else {
              setCampaignStatus(id, 'live');
            }
          }
        }

        // 3. LIVE metrics simulation (when sim.sampleData is enabled)
        if (status === 'live' && sim.sampleData) {
          const totalDays = money?.days || 7;
          const subtotal = money?.subtotal || 1750;
          const daily = money?.daily || 250;

          // 10 real seconds = 1 campaign day
          const simulatedDaysElapsed = Math.min(totalDays, elapsedSec / 10);
          const completionFraction = Math.min(1, simulatedDaysElapsed / totalDays);

          if (completionFraction >= 1) {
            setCampaignStatus(id, 'completed', {
              metrics: {
                views: viewsBought(daily, totalDays),
                clicks: Math.round(viewsBought(daily, totalDays) * 0.012),
                contactTaps: Math.round(viewsBought(daily, totalDays) * 0.012 * 0.6),
                spent: subtotal,
              },
            });
            return;
          }

          const targetViews = Math.round(viewsBought(daily, simulatedDaysElapsed));
          const maxAreaReaders = areaReaders(
            snapshot?.draft?.area?.manualCityIds || ['indore'],
            snapshot?.draft?.audience
          );
          const reachedPeopleMax = peopleReached(maxAreaReaders, daily, totalDays);

          const views = Math.min(targetViews, viewsBought(daily, totalDays));
          const clicks = Math.round(views * 0.011);
          const contactTaps = Math.round(clicks * 0.6);
          const spent = Math.min(subtotal, Math.round(subtotal * completionFraction));

          setCampaignStatus(id, 'live', {
            metrics: { views, clicks, contactTaps, spent },
            sampleSeries: {
              hourlyPeak: 'शाम 6 से रात 10 बजे',
              reachedPeople: Math.min(reachedPeopleMax, Math.round(views / 3)),
            },
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [campaigns, sim, setCampaignStatus]);
}
