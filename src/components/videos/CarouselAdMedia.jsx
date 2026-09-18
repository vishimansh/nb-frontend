import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CarouselAdMedia({ ad, isCurrentReel }) {
  const slides = ad.carouselSlides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!isCurrentReel) {
      setCurrentSlide(0);
    }
  }, [isCurrentReel]);

  const prevSlide = () => {
    setCurrentSlide((curr) => Math.max(0, curr - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((curr) => Math.min(slides.length - 1, curr + 1));
  };

  const handleDragEnd = (e, info) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden bg-black select-none">
      {/* 1. Top Segmented Progress Bar (8px below Dynamic Island at top-[59px], left-[32px], right-[16px], h-[4px]) */}
      <div className="absolute top-[59px] left-[32px] right-[16px] z-40 flex items-center gap-[6px] pointer-events-none">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-[4px] rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* 2. Top and Bottom Ambient Vignette Gradients */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

      {/* 3. Horizontal Draggable Media Surface */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="w-full h-full relative cursor-grab active:cursor-grabbing z-0"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt={`Carousel Slide ${currentSlide + 1}`}
            initial={{ opacity: 0.85, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover pointer-events-none absolute inset-0"
          />
        </AnimatePresence>
      </motion.div>

      {/* 4. Tap Navigation Zones (Left 30% / Right 30%) */}
      <div className="absolute inset-y-0 inset-x-0 z-10 pointer-events-auto flex">
        <div
          onClick={prevSlide}
          className="w-[30%] h-full cursor-pointer"
          aria-label="पिछली स्लाइड"
        />
        <div className="flex-1 h-full pointer-events-none" />
        <div
          onClick={nextSlide}
          className="w-[30%] h-full cursor-pointer"
          aria-label="अगली स्लाइड"
        />
      </div>
    </div>
  );
}
