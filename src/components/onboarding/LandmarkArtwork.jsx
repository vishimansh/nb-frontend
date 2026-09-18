import React from 'react';
import mpSanchi from '../../assets/illustrations/mp-sanchi.jpg';
import rjHawa from '../../assets/illustrations/rj-hawamahal.png';
import mhGateway from '../../assets/illustrations/mh-gateway.jpg';
import gjStatue from '../../assets/illustrations/gj-statue.jpg';
import cgBhoramdeo from '../../assets/illustrations/cg-bhoramdeo.jpg';

const LANDMARK_IMAGES = {
  mp: mpSanchi,
  rj: rjHawa,
  mh: mhGateway,
  gj: gjStatue,
  cg: cgBhoramdeo,
};

/**
 * High-fidelity artwork component for state landmarks.
 * 28px rounded corner visuals with grayscale(100%) opacity-70 unselected,
 * and full color opacity-100 selected.
 */
export default function LandmarkArtwork({ stateId, isSelected }) {
  const imageSrc = LANDMARK_IMAGES[stateId];

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#E5E7EB]">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={stateId}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isSelected
              ? 'filter-none opacity-100 scale-[1.02]'
              : 'grayscale opacity-70 scale-100'
          }`}
          draggable={false}
        />
      )}
    </div>
  );
}
