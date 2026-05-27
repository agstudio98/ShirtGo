/**
 * @fileoverview Hero section of the Landing Page.
 * Displays the brand name and primary slogan with high-impact brutalist styling.
 */

import { useTranslation } from 'react-i18next';

/**
 * Main (Hero) component.
 * Uses large typography and CSS-based decorative patterns for visual impact.
 */
export const Main = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-yellow-400 dark:bg-indigo-900 border-b-8 border-black dark:border-white">
      <div className="z-10 text-center space-y-6 px-4">
        {/* Brand Title with custom drop shadow and rotation */}
        <h1 className="text-7xl md:text-9xl font-black uppercase drop-shadow-[8px_8px_0_rgba(0,0,0,1)] text-white logo-font tracking-tighter italic -rotate-2">
          {t('HOME.MAIN.TITLE')}
        </h1>
        <div className="flex justify-center">
          {/* Slogan with brutalist shadow and interactive rotation effect */}
          <p className="text-2xl md:text-4xl font-bold bg-black text-white p-4 inline-block shadow-[8px_8px_0_0_rgba(255,255,255,1)] dark:shadow-[8px_8px_0_0_rgba(0,0,0,1)] rotate-1 transition-transform hover:rotate-0">
            {t('HOME.MAIN.SLOGAN')}
          </p>
        </div>
      </div>
      {/* Background Decorative patterns using base64 SVG dot grid */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')]"></div>
    </section>
  );
};
