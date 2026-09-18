import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flash, DocumentText } from 'iconsax-react';
import notificationsRaw from '../data/notificationsData.json';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationSectionHeader from '../components/notifications/NotificationSectionHeader';
import BackButton from '../components/common/BackButton';

export default function NotificationsFeedPage() {
  const navigate = useNavigate();

  // Deduplication: Exclude trending IDs from today and thisWeek
  const { trending, today, thisWeek } = useMemo(() => {
    const trendingList = notificationsRaw.trending || [];
    const trendingIds = new Set(trendingList.map((n) => n.id));

    const todayList = (notificationsRaw.today || []).filter((n) => !trendingIds.has(n.id));
    const thisWeekList = (notificationsRaw.thisWeek || []).filter((n) => !trendingIds.has(n.id));

    return {
      trending: trendingList,
      today: todayList,
      thisWeek: thisWeekList,
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#F7F7F4] select-none">
      {/* 1. Fixed Header with 54px Status Bar Clearance */}
      <div className="px-4 py-3 bg-[#F7F7F4] flex items-center justify-between border-b border-[#E5E7EB] sticky top-0 z-30 pt-[54px]">
        <BackButton ariaLabel="वापस जाएं" />
        <h1 className="text-[18px] font-bold text-[#18253B] text-center flex-1 pr-[46px]">
          नोटिफिकेशन
        </h1>
      </div>

      {/* 2. Scrollable Notification Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-12 pt-2">
        {/* Section 1: Trending Near You - Single Surface Big Frame */}
        {trending.length > 0 && (
          <div className="w-[386px] min-w-[386px] max-w-[386px] mx-auto mt-3 bg-white border border-[#D1D5DB] rounded-[24px] px-2 pt-3.5 pb-4 shadow-2xs flex flex-col items-center">
            <NotificationSectionHeader
              title="आपके आसपास ट्रेंडिंग"
              icon={Flash}
              badgeBg="#FFF4ED"
              badgeBorder="#FDBA74"
              iconColor="#C05621"
            />
            <div className="w-full flex flex-col items-center space-y-2">
              {trending.map((item) => (
                <NotificationCard isTrending={true} key={item.id} notification={item} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Today ("आज की सूचनाएं") - Single Surface Big Frame */}
        {today.length > 0 && (
          <div className="w-[386px] min-w-[386px] max-w-[386px] mx-auto mt-4 bg-white border border-[#D1D5DB] rounded-[24px] px-2 pt-3.5 pb-4 shadow-2xs flex flex-col items-center">
            <NotificationSectionHeader
              title="आज की सूचनाएं"
              icon={DocumentText}
              badgeBg="#FFF9EE"
              badgeBorder="#F7C873"
              iconColor="#E39026"
            />
            <div className="w-full flex flex-col items-center space-y-2">
              {today.map((item) => (
                <NotificationCard isTrending={false} key={item.id} notification={item} />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: This Week - Single Surface Big Frame */}
        {thisWeek.length > 0 && (
          <div className="w-[386px] min-w-[386px] max-w-[386px] mx-auto mt-4 mb-6 bg-white border border-[#D1D5DB] rounded-[24px] px-2 pt-3.5 pb-4 shadow-2xs flex flex-col items-center">
            <NotificationSectionHeader
              title="इस हफ्ते की सूचनाएं"
              icon={DocumentText}
              badgeBg="#EEF2F6"
              badgeBorder="#CBD5E1"
              iconColor="#18253B"
            />
            <div className="w-full flex flex-col items-center space-y-2">
              {thisWeek.map((item) => (
                <NotificationCard isTrending={false} key={item.id} notification={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
