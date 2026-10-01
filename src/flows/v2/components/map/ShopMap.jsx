import React, { useMemo } from 'react';
import { CITIES } from '../../data/cities';
import { getDistanceKm } from '../../utils/geo';
import { STRINGS } from '../../strings/hi';

/**
 * Pseudo-random generator seeded by lat and lng so each location has a unique, deterministic schematic grid.
 */
function createSeededRandom(seed) {
  let s = Math.abs(Math.sin(seed) * 10000);
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function ShopMap({
  pin = { lat: 22.72, lng: 75.86 },
  shopName = 'आपकी दुकान',
  radiusKm = 10,
  className = '',
}) {
  const mapWidth = 350;
  const mapHeight = 220;
  const cx = mapWidth / 2;
  const cy = mapHeight / 2;

  // 60km edge-to-edge
  const kmToPx = mapWidth / 60;
  const pixelRadius = Math.max(10, radiusKm * kmToPx);

  // Safe coordinates
  const lat = pin?.lat ?? 22.72;
  const lng = pin?.lng ?? 75.86;

  // Generate procedural roads & blocks seeded by lat/lng
  const { roads, blocks } = useMemo(() => {
    const seed = lat * 1000 + lng;
    const rng = createSeededRandom(seed);
    const rList = [];
    const bList = [];

    // 6-8 background procedural arterial roads
    const roadCount = 6 + Math.floor(rng() * 3);
    for (let i = 0; i < roadCount; i++) {
      const isHorizontal = rng() > 0.5;
      if (isHorizontal) {
        const y = 20 + rng() * (mapHeight - 40);
        const curve = (rng() - 0.5) * 30;
        rList.push({
          d: `M 0 ${y} Q ${cx + curve} ${y + curve} ${mapWidth} ${y}`,
          width: 3 + rng() * 2,
        });
      } else {
        const x = 20 + rng() * (mapWidth - 40);
        const curve = (rng() - 0.5) * 30;
        rList.push({
          d: `M ${x} 0 Q ${x + curve} ${cy + curve} ${x} ${mapHeight}`,
          width: 3 + rng() * 2,
        });
      }
    }

    // 8-10 soft schematic urban blocks
    for (let i = 0; i < 9; i++) {
      const bx = 20 + rng() * (mapWidth - 70);
      const by = 20 + rng() * (mapHeight - 50);
      const bw = 25 + rng() * 35;
      const bh = 15 + rng() * 25;
      bList.push({ x: bx, y: by, w: bw, h: bh });
    }

    return { roads: rList, blocks: bList };
  }, [lat, lng, cx, cy, mapWidth, mapHeight]);

  // Project real cities onto map coordinate space
  const nearbyCityDots = useMemo(() => {
    const dots = [];

    for (const city of CITIES) {
      const dist = getDistanceKm(lat, lng, city.lat, city.lng);
      // Skip very far cities (> 35km from center)
      if (dist > 35) continue;

      const dLat = city.lat - lat;
      const dLon = city.lng - lng;

      // Approximate flat projection in km
      const dxKm = dLon * 111.32 * Math.cos((lat * Math.PI) / 180);
      const dyKm = dLat * 110.57;

      const pxX = cx + dxKm * kmToPx;
      const pxY = cy - dyKm * kmToPx;

      // Only if within canvas view bounds
      if (pxX >= 10 && pxX <= mapWidth - 10 && pxY >= 10 && pxY <= mapHeight - 10) {
        const isInside = dist <= radiusKm;
        dots.push({
          id: city.id,
          name: city.name,
          x: pxX,
          y: pxY,
          isInside,
          dist: Math.round(dist),
        });
      }
    }

    return dots;
  }, [lat, lng, cx, cy, kmToPx, radiusKm, mapWidth, mapHeight]);

  const displayShopName = shopName.length > 14 ? `${shopName.slice(0, 13)}…` : shopName;

  return (
    <div className={`w-full flex flex-col items-center gap-1.5 select-none ${className}`}>
      {/* SVG Map Container */}
      <div className="w-full rounded-[20px] bg-[#F8F8F4] border border-[#E5E7EB] overflow-hidden shadow-inner relative flex justify-center">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-[220px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base map fill */}
          <rect width={mapWidth} height={mapHeight} fill="#F8F8F4" />

          {/* Schematic city blocks */}
          {blocks.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={4}
              fill="#EAECE7"
              opacity="0.8"
            />
          ))}

          {/* Schematic roads */}
          {roads.map((r, i) => (
            <path
              key={i}
              d={r.d}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={r.width}
              strokeLinecap="round"
            />
          ))}

          {/* Interactive Amber Coverage Radius Circle */}
          <circle
            cx={cx}
            cy={cy}
            r={pixelRadius}
            fill="rgba(227, 144, 38, 0.16)"
            stroke="#E39026"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="transition-all duration-300 ease-out"
          />

          {/* Nearby City Dots */}
          {nearbyCityDots.map((city) => (
            <g key={city.id} className="transition-all duration-200">
              <circle
                cx={city.x}
                cy={city.y}
                r={city.isInside ? 4.5 : 3.5}
                fill={city.isInside ? '#E39026' : '#9CA3AF'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <text
                x={city.x}
                y={city.y + 11}
                textAnchor="middle"
                fontSize="9"
                fontWeight={city.isInside ? 'bold' : 'normal'}
                fill={city.isInside ? '#2B2437' : '#6B7280'}
                className="select-none pointer-events-none"
              >
                {city.name}
              </text>
            </g>
          ))}

          {/* Center Shop Pin */}
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Soft pulse glow around pin */}
            <circle r="14" fill="rgba(43, 36, 55, 0.12)" />

            {/* Pin head */}
            <circle r="6" fill="#2B2437" stroke="#FFFFFF" strokeWidth="2" />

            {/* Shop Name Label Pill floating above pin */}
            <g transform="translate(0, -18)">
              <rect
                x="-42"
                y="-11"
                width="84"
                height="19"
                rx="9.5"
                fill="#2B2437"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
              <text
                x="0"
                y="2.5"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="bold"
                fill="#FFFFFF"
                className="select-none pointer-events-none"
              >
                {displayShopName}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Tiny Map Caption */}
      <span className="text-[11.5px] text-[#6B7280]">
        {STRINGS.area.mapDisclaimer}
      </span>
    </div>
  );
}
