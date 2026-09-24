import React, { useRef, useEffect } from 'react';

export default function VideoAdMedia({
  ad,
  isCurrentReel,
  isMuted,
  isPaused = false,
  onTogglePlayPause,
}) {
  const videoRef = useRef(null);

  // Manage Play/Pause based on active snap-scroll position and user pause state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCurrentReel && !isPaused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video ad autoplay prevented:', err);
        });
      }
    } else {
      video.pause();
    }
  }, [isCurrentReel, isPaused]);

  // Keep muted state synced with global video context
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      onClick={onTogglePlayPause}
      className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-black select-none cursor-pointer"
    >
      {/* 1. Native HTML5 Video Surface with Poster Fallback */}
      {ad.videoUrl ? (
        <video
          ref={videoRef}
          src={ad.videoUrl}
          poster={ad.posterThumbnail}
          muted={isMuted}
          playsInline
          loop
          preload="auto"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
      ) : (
        <img
          src={ad.posterThumbnail}
          alt={ad.headline}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
      )}

      {/* Center Play Option when Paused */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlayPause?.();
            }}
            aria-label="चलाएं (Play)"
            className="w-[76px] h-[76px] rounded-full bg-black/65 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] active:scale-90 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[24px] border-l-white border-b-[15px] border-b-transparent ml-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </button>
        </div>
      )}

      {/* 2. Top and Bottom Vignette Gradients */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
    </div>
  );
}


