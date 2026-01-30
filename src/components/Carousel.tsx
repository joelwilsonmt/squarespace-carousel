import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGalleryImages } from '../hooks/useGalleryImages';

export const Carousel: React.FC = () => {
  const { images, loading, error } = useGalleryImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for fade
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsAutoPlaying(true);
      setDirection(0);
    }, 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;
    const timer = setInterval(() => {
      setDirection(0); // Use fade for auto-play
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying, images.length]);

  if (loading) {
    return (
      <div className="efm-relative efm-w-full efm-h-[600px] efm-flex efm-items-center efm-justify-center">
        <Loader2 className="efm-w-10 efm-h-10 efm-text-primary efm-animate-spin" />
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="efm-relative efm-w-full efm-h-[600px] efm-flex efm-items-center efm-justify-center efm-text-gray-500">
        {error || "No images found in gallery."}
      </div>
    );
  }

  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
      opacity: 0,
      scale: direction === 0 ? 1 : 1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.05,
      zIndex: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : direction < 0 ? '100%' : 0,
      opacity: 0,
      scale: 1,
      transition: {
        opacity: { duration: direction === 0 ? 1.5 : 0.5 },
        x: { duration: 0.5 }
      }
    })
  };

  return (
    <div className="efm-relative efm-w-full efm-h-[600px] efm-overflow-hidden efm-flex efm-flex-col">
      {/* Main Image Area */}
      <div className="efm-relative efm-flex-1 efm-overflow-hidden efm-flex efm-items-center efm-justify-center">
        <div className="efm-relative efm-h-full efm-max-w-full">
          {/* Invisible placeholder for width */}
          <img
            src={images[currentIndex]}
            alt=""
            aria-hidden="true"
            className="efm-h-full efm-w-auto efm-invisible efm-pointer-events-none"
          />

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              className="efm-absolute efm-inset-0 efm-w-full efm-h-full efm-flex efm-items-center efm-justify-center"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: direction === 0 ? 1.5 : 0.4 },
                x: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 5, ease: "linear" }
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                loading="lazy"
                className="efm-h-full efm-w-auto efm-object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Moving out slightly further (75% offset) */}
          <button
            onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="efm-absolute efm-left-0 efm-top-1/2 efm--translate-y-1/2 efm--translate-x-3/4 efm-z-10 efm-p-3 efm-bg-white/40 hover:efm-bg-white/60 efm-rounded-full efm-backdrop-blur-md efm-transition-all efm-group efm-shadow-lg efm-border efm-border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="efm-w-10 efm-h-10 efm-text-primary group-hover:efm-scale-110 efm-transition-transform" />
          </button>
          <button
            onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className="efm-absolute efm-right-0 efm-top-1/2 efm--translate-y-1/2 efm-translate-x-3/4 efm-z-10 efm-p-3 efm-bg-white/40 hover:efm-bg-white/60 efm-rounded-full efm-backdrop-blur-md efm-transition-all efm-group efm-shadow-lg efm-border efm-border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="efm-w-10 efm-h-10 efm-text-primary group-hover:efm-scale-110 efm-transition-transform" />
          </button>
        </div>
      </div>

      {/* Thumbnail Previews */}
      <div className="efm-bg-transparent efm-py-4 efm-flex efm-justify-center efm-gap-4 efm-px-4 efm-overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`efm-relative efm-flex-shrink-0 efm-w-20 efm-h-20 efm-rounded-lg efm-overflow-hidden efm-border-2 efm-transition-all efm-duration-300 ${
              currentIndex === index ? 'efm-border-accent efm-scale-110 efm-shadow-md' : 'efm-border-transparent efm-opacity-60 hover:efm-opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="efm-w-full efm-h-full efm-object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
