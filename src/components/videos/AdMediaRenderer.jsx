import React from 'react';
import VideoAdMedia from './VideoAdMedia';
import GridAdMedia from './GridAdMedia';
import CarouselAdMedia from './CarouselAdMedia';

export default function AdMediaRenderer({
  ad,
  isCurrentReel,
  isMuted,
  isPaused,
  onTogglePlayPause,
}) {
  switch (ad.format) {
    case 'video':
      return (
        <VideoAdMedia
          ad={ad}
          isCurrentReel={isCurrentReel}
          isMuted={isMuted}
          isPaused={isPaused}
          onTogglePlayPause={onTogglePlayPause}
        />
      );
    case 'grid':
      return <GridAdMedia ad={ad} />;
    case 'carousel':
      return (
        <CarouselAdMedia
          ad={ad}
          isCurrentReel={isCurrentReel}
        />
      );
    default:
      return null;
  }
}

