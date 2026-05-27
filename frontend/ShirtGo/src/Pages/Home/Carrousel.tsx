/**
 * @fileoverview Visual Carrousel component for showcasing trends.
 * Features automated cycling and manual navigation controls.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carrousel component.
 * Uses a time-based effect for auto-progression and CSS transitions for sliding visuals.
 */
export const Carrousel = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  
  /**
   * Static list of featured image URLs from Unsplash.
   */
  const images = [
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200&h=600",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200&h=600",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200&h=600",
  ];

  /**
   * Effect: Implements auto-progression every 5 seconds.
   * Clean Code: Correctly clears interval on unmount to prevent memory leaks.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      {/* Centered section title */}
      <h2 className="text-5xl font-black mb-12 uppercase text-center">{t('HOME.CARROUSEL.TITLE')}</h2>
      
      <div className="relative h-[400px] md:h-[600px] brutalist-card overflow-hidden">
        {/* Slides */}
        {images.map((img, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={img} 
              alt="Carousel Slide" 
              className="w-full h-full object-cover grayscale transition-all duration-500 hover:grayscale-0" 
            />
            {/* Subtle overlay for better visual integration */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </div>
        ))}
        
        {/* Navigation Controls: Previous */}
        <button 
          onClick={() => setCurrent(prev => (prev - 1 + images.length) % images.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 brutalist-button p-4 bg-white text-black"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={32} />
        </button>
        
        {/* Navigation Controls: Next */}
        <button 
          onClick={() => setCurrent(prev => (prev + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 brutalist-button p-4 bg-white text-black"
          aria-label="Next Slide"
        >
          <ChevronRight size={32} />
        </button>

        {/* Navigation Indicators (Dots) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          {images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`w-4 h-4 border-2 border-black ${i === current ? 'bg-black w-12' : 'bg-white'} transition-all`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};
