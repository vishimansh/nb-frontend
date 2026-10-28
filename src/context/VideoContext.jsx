import React, { createContext, useContext, useState, useEffect } from 'react';
import initialReels from '../data/reelsData.json';
import initialPodcasts from '../data/podcastsData.json';
import initialCitizenReels from '../data/citizenReelsData.json';
import { CITIZEN_FALLBACK_VIDEO, getCategoryVideo, getCategoryPoster } from '../data/citizenReportConfig';
import { storeUploadedVideo, getUploadedVideo } from '../utils/videoStorage';

export const VideoContext = createContext(null);

const USER_REPORTS_KEY = 'nb_citizen_user_reports';

function loadUserReports() {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_REPORTS_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    let neededHeal = false;
    const healed = saved.map((r) => {
      const isDeadBlob = r.videoUrl?.startsWith('blob:');
      const fallbackVideo = getCategoryVideo(r.categoryId);
      const fallbackPoster = getCategoryPoster(r.categoryId);
      const finalVideo = isDeadBlob ? fallbackVideo : (r.videoUrl || fallbackVideo);
      const finalPoster = (r.posterThumbnail && !r.posterThumbnail.startsWith('blob:'))
        ? r.posterThumbnail
        : fallbackPoster;

      if (
        isDeadBlob ||
        r.status !== 'verified' ||
        !r.videoUrl ||
        !r.posterThumbnail ||
        r.onlineFallbackUrl?.includes('wikimedia.org')
      ) {
        neededHeal = true;
      }

      return {
        ...r,
        status: 'verified',
        videoUrl: finalVideo,
        onlineFallbackUrl: fallbackVideo,
        posterThumbnail: finalPoster,
      };
    });

    if (neededHeal) {
      persistUserReports(healed);
    }
    return healed;
  } catch {
    return [];
  }
}

function persistUserReports(list) {
  try {
    localStorage.setItem(
      USER_REPORTS_KEY,
      JSON.stringify(list.filter((r) => r.isUserSubmitted))
    );
  } catch {}
}

export function VideoProvider({ children }) {
  // Mode & Feed State: 'video' | 'podcast' | 'citizen'
  const [mediaMode, setMediaMode] = useState('video');
  const [reels, setReels] = useState(initialReels);
  const [podcasts, setPodcasts] = useState(initialPodcasts);

  // Citizen Reels: reader's own submissions (persisted) on top of editorial seed data
  const [citizenReels, setCitizenReels] = useState(() => [
    ...loadUserReports(),
    ...initialCitizenReels,
  ]);

  // Re-hydrate persistent video blobs from IndexedDB across browser reloads
  useEffect(() => {
    let isCancelled = false;
    async function rehydrateVideos() {
      const userReports = loadUserReports();
      if (userReports.length === 0) return;
      let hasUpdates = false;
      const updated = await Promise.all(
        userReports.map(async (report) => {
          const blob = await getUploadedVideo(report.id);
          if (blob) {
            hasUpdates = true;
            return {
              ...report,
              videoUrl: URL.createObjectURL(blob),
            };
          }
          if (report.videoUrl?.startsWith('blob:')) {
            hasUpdates = true;
            return {
              ...report,
              videoUrl: getCategoryVideo(report.categoryId),
            };
          }
          return report;
        })
      );
      if (!isCancelled) {
        setCitizenReels((prev) => {
          const others = prev.filter((r) => !r.isUserSubmitted);
          return [...updated, ...others];
        });
        if (hasUpdates) {
          persistUserReports(updated);
        }
      }
    }
    rehydrateVideos();
    return () => {
      isCancelled = true;
    };
  }, []);

  const [videoCurrentIndex, setVideoCurrentIndex] = useState(0);
  const [podcastCurrentIndex, setPodcastCurrentIndex] = useState(0);
  const [citizenCurrentIndex, setCitizenCurrentIndex] = useState(0);

  // Active city filter inside citizen reports: null (auto → reader's city), 'all', or a city name
  const [citizenCityFilter, setCitizenCityFilter] = useState(null);

  // Upload Modal State
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);

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

  // Switch between Video, Podcast, and Citizen modes while preserving independent scroll positions
  const switchMediaMode = (mode) => {
    if (mode === mediaMode) return;
    closeOverlays();
    setMediaMode(mode);
  };

  // Open comment sheet with mutual exclusivity
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

  // Open transcript panel with mutual exclusivity
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

  // Toggle Like on Citizen Reel
  const toggleCitizenLike = (reelId) => {
    setCitizenReels((prev) => {
      const updated = prev.map((reel) => {
        if (reel.id !== reelId) return reel;
        const newIsLiked = !reel.isLiked;
        return {
          ...reel,
          isLiked: newIsLiked,
          likeCount: newIsLiked ? reel.likeCount + 1 : Math.max(0, reel.likeCount - 1),
        };
      });
      persistUserReports(updated);
      return updated;
    });
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

  // Submit Citizen Report
  const submitCitizenReport = (reportData) => {
    const reportId = `cit-user-${Date.now()}`;

    // If an actual file was selected, persist it in IndexedDB
    if (reportData.videoFile) {
      storeUploadedVideo(reportId, reportData.videoFile).catch(() => {});
    }

    const fallbackVideo = getCategoryVideo(reportData.categoryId);
    const fallbackPoster = getCategoryPoster(reportData.categoryId);

    const newReport = {
      id: reportId,
      videoUrl: reportData.videoUrl || fallbackVideo,
      onlineFallbackUrl: fallbackVideo,
      posterThumbnail: reportData.posterThumbnail || fallbackPoster,
      city: reportData.city || 'भोपाल',
      locality: reportData.locality || '',
      categoryId: reportData.categoryId || 'other',
      headline: reportData.headline,
      fullDescription: reportData.fullDescription || '',
      reporterName: reportData.isAnonymous ? '' : (reportData.reporterName || 'आप'),
      isVerifiedReporter: false,
      isAnonymous: Boolean(reportData.isAnonymous),
      status: 'verified',
      followUp: '',
      timeAgo: 'अभी-अभी',
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      comments: [],
      isUserSubmitted: true,
    };

    setCitizenReels((prev) => {
      const updated = [newReport, ...prev.filter((r) => r.id !== reportId)];
      persistUserReports(updated);
      return updated;
    });

    // Show the reader their own report first: switch to citizen tab, reset filter to their city, scroll to top
    setMediaMode('citizen');
    setCitizenCityFilter(newReport.city);
    setCitizenCurrentIndex(0);
    return newReport;
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

    // Update in citizen reels
    setCitizenReels((prev) => {
      const updated = prev.map((reel) => {
        if (reel.id !== id) return reel;
        return {
          ...reel,
          commentCount: (reel.commentCount || 0) + 1,
          comments: [newComment, ...(reel.comments || [])],
        };
      });
      persistUserReports(updated);
      return updated;
    });

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

    setCitizenReels((prev) => {
      const updated = prev.map((reel) => {
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
      });
      persistUserReports(updated);
      return updated;
    });

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
  const activeReelIndex =
    mediaMode === 'video'
      ? videoCurrentIndex
      : mediaMode === 'citizen'
      ? citizenCurrentIndex
      : podcastCurrentIndex;

  const setActiveReelIndex = (index) => {
    if (mediaMode === 'video') {
      setVideoCurrentIndex(index);
    } else if (mediaMode === 'citizen') {
      setCitizenCurrentIndex(index);
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
        citizenReels,
        citizenCurrentIndex,
        setCitizenCurrentIndex,
        citizenCityFilter,
        setCitizenCityFilter,
        isUploadSheetOpen,
        setIsUploadSheetOpen,
        submitCitizenReport,
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
        toggleCitizenLike,
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
    return {
      mediaMode: 'video',
      setMediaMode: () => {},
      switchMediaMode: () => {},
      reels: [],
      podcasts: [],
      citizenReels: [],
      citizenCurrentIndex: 0,
      setCitizenCurrentIndex: () => {},
      citizenCityFilter: null,
      setCitizenCityFilter: () => {},
      isUploadSheetOpen: false,
      setIsUploadSheetOpen: () => {},
      submitCitizenReport: () => {},
      isMuted: false,
      setIsMuted: () => {},
      toggleMuted: () => {},
      videoCurrentIndex: 0,
      setVideoCurrentIndex: () => {},
      podcastCurrentIndex: 0,
      setPodcastCurrentIndex: () => {},
      activeReelIndex: 0,
      setActiveReelIndex: () => {},
      activeOverlay: 'none',
      setActiveOverlay: () => {},
      isCommentSheetOpen: false,
      activeCommentReelId: null,
      activeTranscriptPodcastId: null,
      openCommentSheet: () => {},
      closeCommentSheet: () => {},
      openTranscript: () => {},
      closeTranscript: () => {},
      closeOverlays: () => {},
      toggleLike: () => {},
      toggleCitizenLike: () => {},
      togglePodcastLike: () => {},
      addComment: () => {},
      toggleCommentLike: () => {},
    };
  }
  return context;
}
