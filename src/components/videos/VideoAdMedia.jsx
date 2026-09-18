import React from 'react';

export default function VideoAdMedia({ ad }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-black select-none">
      {/* 1. Static High-Speed Image Surface */}
      <img
        src={ad.posterThumbnail}
        alt={ad.headline}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      {/* 2. Top and Bottom Vignette Gradients */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
    </div>
  );
}

