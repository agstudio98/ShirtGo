/**
 * @fileoverview About Us section.
 * Provides a brief introduction to the ShirtGo mission and philosophy.
 */

import { useTranslation } from 'react-i18next';

/**
 * Who (About) component.
 * Features a split layout with a text card and a grayscale-to-color image hover effect.
 */
export const Who = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      {/* Narrative Card */}
      <div className="md:w-1/2 brutalist-card bg-white dark:bg-gray-800 p-8 rotate-3 transition-transform hover:rotate-0">
        <h2 className="text-5xl font-black mb-6 uppercase border-b-4 border-black dark:border-white pb-2 inline-block">
          {t('HOME.WHO.TITLE')}
        </h2>
        <p className="text-xl font-bold leading-relaxed">
          {t('HOME.WHO.DESC')}
        </p>
      </div>
      
      {/* Visual Identity Image */}
      <div className="md:w-1/2 relative group">
        {/* Decorative shadow layer */}
        <div className="absolute inset-0 bg-yellow-400 translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform"></div>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
          alt="Fashion Store Visual" 
          className="relative z-10 border-4 border-black grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </section>
  );
};
