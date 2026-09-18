import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, Heart, Send2 } from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';

export default function CommentSheet({
  isOpen: propIsOpen,
  onClose: propOnClose,
  comments: propComments,
  onAddComment: propOnAddComment,
  title: propTitle,
} = {}) {
  const videoContext = useVideo();
  const {
    isCommentSheetOpen = false,
    activeCommentReelId = null,
    closeCommentSheet = () => {},
    reels = [],
    podcasts = [],
    addComment = () => {},
    toggleCommentLike = () => {},
  } = videoContext || {};

  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(null);
  const listRef = useRef(null);

  // Check if controlled via props or VideoContext
  const isControlled = propIsOpen !== undefined;
  const isOpen = isControlled ? propIsOpen : isCommentSheetOpen;
  const handleClose = isControlled ? propOnClose : closeCommentSheet;

  const activeReel =
    reels.find((r) => r.id === activeCommentReelId) ||
    (podcasts || []).find((p) => p.id === activeCommentReelId);

  const activeComments = isControlled
    ? (localComments || propComments || [])
    : (activeReel?.comments || []);
  const commentCount = activeComments.length;

  // Auto scroll to top on new comment
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;

    if (isControlled) {
      const newComment = {
        id: `c_${Date.now()}`,
        username: 'आप',
        text: commentText.trim(),
        timeAgo: 'अभी-अभी',
        likes: 0,
        isLiked: false,
      };
      setLocalComments([newComment, ...activeComments]);
      if (propOnAddComment) propOnAddComment(newComment);
    } else {
      if (!activeCommentReelId) return;
      addComment(activeCommentReelId, commentText.trim());
    }

    setCommentText('');
    setTimeout(scrollToTop, 50);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden select-none pointer-events-auto">
        {/* Semi-transparent scrim backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Slides up from bottom covering ~70% of device height */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute bottom-0 inset-x-0 h-[70%] bg-white rounded-t-[28px] z-50 flex flex-col shadow-2xl overflow-hidden border-t border-[#E5E7EB]"
        >
          {/* Sheet Header */}
          <div className="px-5 pt-3 pb-3 border-b border-[#F1F3F5] flex items-center justify-between bg-white relative shrink-0">
            {/* Centered Drag Handle */}
            <div className="w-10 h-1 bg-[#D1D5DB] rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />

            {/* Title */}
            <h2 className="text-[16px] font-bold text-[#18253B] mt-2">
              {propTitle || 'टिप्पणियाँ'} · {commentCount}
            </h2>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="बंद करें"
              className="mt-2 text-[#6B7280] hover:text-[#18253B] cursor-pointer active:scale-90 transition-transform flex items-center justify-center"
            >
              <CloseCircle size={22} color="#6B7280" />
            </button>
          </div>

          {/* Comment List Viewport */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none bg-white"
          >
            {activeComments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center text-[#9CA3AF]">
                <p className="text-[14px] font-medium">सबसे पहले टिप्पणी करें</p>
                <p className="text-[11px] text-[#CBD5E1] mt-1">
                  इस खबर पर अपनी राय साझा करें
                </p>
              </div>
            ) : (
              activeComments.map((c) => {
                const initial = c.username ? c.username.charAt(0) : 'य';
                return (
                  <div
                    key={c.id}
                    className="flex items-start justify-between gap-3"
                  >
                    {/* Left Avatar Placeholder */}
                    <div className="w-9 h-9 rounded-full bg-[#18253B] text-white font-bold text-[13px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {initial}
                    </div>

                    {/* Middle Content Block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] font-bold text-[#18253B] truncate">
                          {c.username}
                        </span>
                        <span className="text-[11px] text-[#9CA3AF] shrink-0">
                          {c.timeAgo}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#374151] leading-snug mt-0.5 break-words">
                        {c.text}
                      </p>
                    </div>

                    {/* Right Action: Like Comment */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isControlled) {
                          setLocalComments((prev) =>
                            (prev || activeComments).map((comm) =>
                              comm.id === c.id
                                ? {
                                    ...comm,
                                    isLiked: !comm.isLiked,
                                    likeCount: comm.isLiked
                                      ? (comm.likeCount || 1) - 1
                                      : (comm.likeCount || 0) + 1,
                                  }
                                : comm
                            )
                          );
                        } else if (activeCommentReelId) {
                          toggleCommentLike(activeCommentReelId, c.id);
                        }
                      }}
                      className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform shrink-0 pt-0.5"
                    >
                      <Heart
                        size={15}
                        color={c.isLiked ? '#EF4444' : '#9CA3AF'}
                        variant={c.isLiked ? 'Bold' : 'Linear'}
                      />
                      {(c.likeCount > 0 || c.likes > 0) && (
                        <span
                          className={`text-[10px] mt-0.5 font-medium ${
                            c.isLiked ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
                          }`}
                        >
                          {c.likeCount || c.likes}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Input Row */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 border-t border-[#E5E7EB] bg-white flex items-center gap-2.5 shrink-0"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#18253B] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              आप
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="अपनी टिप्पणी जोड़ें..."
              className="flex-1 h-11 bg-[#F9FAFB] rounded-full border border-[#E5E7EB] px-4 text-[13px] text-[#18253B] placeholder-[#9CA3AF] outline-none focus:border-[#18253B] transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
                commentText.trim()
                  ? 'bg-[#E39026] text-white cursor-pointer active:scale-95 shadow-sm'
                  : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed pointer-events-none'
              }`}
            >
              <Send2 size={16} color="#FFFFFF" variant="Bold" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
