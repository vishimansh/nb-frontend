import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, DocumentText } from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';

export default function TranscriptOverlay() {
  const {
    activeOverlay,
    activeTranscriptPodcastId,
    closeTranscript,
    podcasts,
  } = useVideo();

  const isOpen = activeOverlay === 'transcript' && Boolean(activeTranscriptPodcastId);
  const activePodcast = podcasts.find((p) => p.id === activeTranscriptPodcastId);

  if (!isOpen || !activePodcast) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 overflow-hidden select-none pointer-events-auto">
        {/* Semi-transparent scrim backdrop - tap closes transcript */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeTranscript}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Capped 45% height bottom panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="h-[45%] absolute bottom-0 inset-x-0 bg-black/90 backdrop-blur-xl rounded-t-[24px] border-t border-white/20 z-40 flex flex-col p-4 shadow-2xl"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-2">
              <DocumentText size={18} color="#EEEBDA" variant="Bold" />
              <span className="text-[15px] font-bold text-white leading-none tracking-wide">
                एपिसोड ट्रांसक्रिप्ट
              </span>
            </div>

            <button
              type="button"
              onClick={closeTranscript}
              aria-label="ट्रांसक्रिप्ट बंद करें"
              className="text-white/70 hover:text-white cursor-pointer active:scale-90 transition-transform p-1"
            >
              <CloseCircle size={20} color="#FFFFFF" variant="Linear" />
            </button>
          </div>

          {/* Episode Title & Host Sub-header */}
          <div className="mb-2">
            <h4 className="text-[12px] font-semibold text-[#EEEBDA] leading-tight">
              {activePodcast.showName}
            </h4>
            <p className="text-[11px] text-white/60">होस्ट: {activePodcast.hostName}</p>
          </div>

          {/* Scrollable Transcript Body */}
          <div className="flex-1 overflow-y-auto scrollbar-none pr-1 select-text pb-4">
            <p className="text-[13px] text-white/90 leading-[1.6] font-normal select-text">
              {activePodcast.fullTranscript}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
