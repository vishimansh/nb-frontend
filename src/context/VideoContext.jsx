import React, { createContext, useContext, useState } from 'react';
import initialReels from '../data/reelsData.json';
import initialPodcasts from '../data/podcastsData.json';

export const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  // Mode & Feed State
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'podcast'
  const [reels, setReels] = useState(initialReels);
  const [podcasts, setPodcasts] = useState(initialPodcasts);
  const [videoCurrentIndex, setVideoCurrentIndex] = useState(0);
  const [podcastCurrentIndex, setPodcastCurrentIndex] = useState(0);

  // Audio & Session State
  const [isMuted, setIsMuted] = useState(false);

  // Mutually Exclusive Overlays: 'none' | 'comment' | 'transcript'
  const [activeOverlay, setActiveOverlay] = useState('none');
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState(null);
  const [activeTranscriptPodcastId, setActiveTranscriptPodcastId] = useState(null);

  const toggleMuted = () => {
    setIsMuted((prev) => !prev);
  };

  // Switch between Video and Podcast modes while preserving independent scroll positions
  const switchMediaMode = (mode) => {
    if (mode === mediaMode) return;
    closeOverlays();
    setMediaMode(mode);
  };

  // Open comment sheet with mutual exclusivity (closes transcript)
  const openCommentSheet = (id) => {
    setActiveTranscriptPodcastId(null);
    setActiveCommentReelId(id);
    setActiveOverlay('comment');
    setIsCommentSheetOpen(true);
  };

  const closeCommentSheet = () => {
    setIsCommentSheetOpen(false);
    if (activeOverlay === 'comment') {
      setActiveOverlay('none');
    }
  };

  // Open transcript panel with mutual exclusivity (closes comments)
  const openTranscript = (id) => {
    setIsCommentSheetOpen(false);
    setActiveCommentReelId(null);
    setActiveTranscriptPodcastId(id);
    setActiveOverlay('transcript');
  };

  const closeTranscript = () => {
    setActiveTranscriptPodcastId(null);
    if (activeOverlay === 'transcript') {
      setActiveOverlay('none');
    }
  };

  const closeOverlays = () => {
    setIsCommentSheetOpen(false);
    setActiveTranscriptPodcastId(null);
    setActiveOverlay('none');
  };

  // Toggle Like on Video Reel
  const toggleLike = (reelId) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id !== reelId) return reel;
        const newIsLiked = !reel.isLiked;
        return {
          ...reel,
          isLiked: newIsLiked,
          likeCount: newIsLiked ? reel.likeCount + 1 : Math.max(0, reel.likeCount - 1),
        };
      })
    );
  };

  // Toggle Like on Podcast Show
  const togglePodcastLike = (podcastId) => {
    setPodcasts((prev) =>
      prev.map((pod) => {
        if (pod.id !== podcastId) return pod;
        const newIsLiked = !pod.isLiked;
        return {
          ...pod,
          isLiked: newIsLiked,
          likeCount: newIsLiked ? pod.likeCount + 1 : Math.max(0, pod.likeCount - 1),
        };
      })
    );
  };

  const addComment = (id, text) => {
    if (!text || !text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      username: 'आप',
      timeAgo: 'अभी-अभी',
      text: text.trim(),
      likeCount: 0,
      isLiked: false,
    };

    // Update in video reels
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id !== id) return reel;
        return {
          ...reel,
          commentCount: reel.commentCount + 1,
          comments: [newComment, ...(reel.comments || [])],
        };
      })
    );

    // Update in podcasts
    setPodcasts((prev) =>
      prev.map((pod) => {
        if (pod.id !== id) return pod;
        return {
          ...pod,
          commentCount: pod.commentCount + 1,
          comments: [newComment, ...(pod.comments || [])],
        };
      })
    );
  };

  const toggleCommentLike = (id, commentId) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id !== id) return reel;
        const updatedComments = (reel.comments || []).map((c) => {
          if (c.id !== commentId) return c;
          const newIsLiked = !c.isLiked;
          return {
            ...c,
            isLiked: newIsLiked,
            likeCount: newIsLiked ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
          };
        });
        return { ...reel, comments: updatedComments };
      })
    );

    setPodcasts((prev) =>
      prev.map((pod) => {
        if (pod.id !== id) return pod;
        const updatedComments = (pod.comments || []).map((c) => {
          if (c.id !== commentId) return c;
          const newIsLiked = !c.isLiked;
          return {
            ...c,
            isLiked: newIsLiked,
            likeCount: newIsLiked ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
          };
        });
        return { ...pod, comments: updatedComments };
      })
    );
  };

  // Active index mapped to current mode
  const activeReelIndex = mediaMode === 'video' ? videoCurrentIndex : podcastCurrentIndex;
  const setActiveReelIndex = (index) => {
    if (mediaMode === 'video') {
      setVideoCurrentIndex(index);
    } else {
      setPodcastCurrentIndex(index);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        mediaMode,
        setMediaMode,
        switchMediaMode,
        reels,
        podcasts,
        isMuted,
        setIsMuted,
        toggleMuted,
        videoCurrentIndex,
        setVideoCurrentIndex,
        podcastCurrentIndex,
        setPodcastCurrentIndex,
        activeReelIndex,
        setActiveReelIndex,
        activeOverlay,
        setActiveOverlay,
        isCommentSheetOpen,
        activeCommentReelId,
        activeTranscriptPodcastId,
        openCommentSheet,
        closeCommentSheet,
        openTranscript,
        closeTranscript,
        closeOverlays,
        toggleLike,
        togglePodcastLike,
        addComment,
        toggleCommentLike,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
