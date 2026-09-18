import React from 'react';

export default function GridAdMedia({ ad }) {
  const images = ad.gridImages || [];

  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-[#2D2A26] select-none">
      {/* 1. Full-Bleed Textured Ambient Backdrop */}
      <img
        src={ad.backgroundTexture || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'}
        alt="Background Texture"
        className="w-full h-full object-cover absolute inset-0 z-0 opacity-80 filter brightness-90"
      />

      {/* Dark Ambient Gradient Vignettes */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

      {/* 2. Centered 2×2 Image Grid Canvas */}
      <div className="absolute inset-x-4 top-[18%] bottom-[28%] flex items-center justify-center z-10">
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-full max-w-[360px] aspect-square">
          {/* Slot 1: Top-Left */}
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/30 relative">
            <img
              src={images[0]}
              alt="Ad Product 1"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          {/* Slot 2: Top-Right */}
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/30 relative">
            <img
              src={images[1]}
              alt="Ad Product 2"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          {/* Slot 3: Bottom-Left */}
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/30 relative">
            <img
              src={images[2]}
              alt="Ad Product 3"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          {/* Slot 4: Bottom-Right */}
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/30 relative">
            <img
              src={images[3]}
              alt="Ad Product 4"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
