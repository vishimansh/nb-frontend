import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flash, DocumentText, ArrowDown2 } from 'iconsax-react';
import notificationsRaw from '../data/notificationsData.json';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationSectionHeader from '../components/notifications/NotificationSectionHeader';
import BackButton from '../components/common/BackButton';

export default function NotificationsFeedPage() {
  const navigate = useNavigate();

  const [todayLimit, setTodayLimit] = useState(3);
  const [thisWeekLimit, setThisWeekLimit] = useState(3);

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
        <h1 className="text-[18px] font-bold text-[#2B2437] text-center flex-1 pr-[46px]">
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
              badgeBorder="#F5B55C"
              iconColor="#F5B55C"
            />
            <div className="w-full flex flex-col items-center space-y-2">
              <AnimatePresence initial={false}>
                {today.slice(0, todayLimit).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={index >= 3 ? { opacity: 0, y: 20, scale: 0.98 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: index >= 3 ? ((index - 3) % 5) * 0.06 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full flex justify-center"
                  >
                    <NotificationCard isTrending={false} notification={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* और खबरें देखें button: opens 5 more cards smoothly */}
            <AnimatePresence>
              {today.length > todayLimit && (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setTodayLimit((prev) => prev + 5)}
                  aria-label="आज की और खबरें देखें"
                  className="mt-3 w-[370px] min-w-[370px] max-w-[370px] py-2.5 px-4 rounded-[12px] bg-[#F7F7F4] hover:bg-[#EFEFEA] border border-[#E5E7EB] text-[#2B2437] text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>और खबरें देखें</span>
                  <ArrowDown2 size={16} color="#2B2437" variant="Bold" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Section 3: This Week - Single Surface Big Frame */}
        {thisWeek.length > 0 && (
          <div className="w-[386px] min-w-[386px] max-w-[386px] mx-auto mt-4 mb-6 bg-white border border-[#D1D5DB] rounded-[24px] px-2 pt-3.5 pb-4 shadow-2xs flex flex-col items-center">
            <NotificationSectionHeader
              title="इस हफ्ते की सूचनाएं"
              icon={DocumentText}
              badgeBg="#2B2437"
              badgeBorder="#2B2437"
              iconColor="#FFFFFF"
            />
            <div className="w-full flex flex-col items-center space-y-2">
              <AnimatePresence initial={false}>
                {thisWeek.slice(0, thisWeekLimit).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={index >= 3 ? { opacity: 0, y: 20, scale: 0.98 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: index >= 3 ? ((index - 3) % 5) * 0.06 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full flex justify-center"
                  >
                    <NotificationCard isTrending={false} notification={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* और खबरें देखें button: opens 5 more cards smoothly */}
            <AnimatePresence>
              {thisWeek.length > thisWeekLimit && (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setThisWeekLimit((prev) => prev + 5)}
                  aria-label="इस हफ्ते की और खबरें देखें"
                  className="mt-3 w-[370px] min-w-[370px] max-w-[370px] py-2.5 px-4 rounded-[12px] bg-[#F7F7F4] hover:bg-[#EFEFEA] border border-[#E5E7EB] text-[#2B2437] text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>और खबरें देखें</span>
                  <ArrowDown2 size={16} color="#2B2437" variant="Bold" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
