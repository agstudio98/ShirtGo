/**
 * @fileoverview Journey Timeline section.
 * Visualizes the history and future roadmap of ShirtGo.
 */

import { useTranslation } from 'react-i18next';

/**
 * Timeline component.
 * Implements a responsive layout that shifts from vertical (mobile) to horizontal (desktop).
 */
export const Timeline = () => {
  const { t } = useTranslation();
  
  /**
   * Milestones data.
   */
  const steps = [
    { year: '2024', text: t('HOME.TIMELINE.STEP1'), color: 'bg-pink-400' },
    { year: '2025', text: t('HOME.TIMELINE.STEP2'), color: 'bg-cyan-400' },
    { year: '2026', text: t('HOME.TIMELINE.STEP3'), color: 'bg-yellow-400' },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <h2 className="text-5xl font-black mb-16 text-center uppercase tracking-tighter">
        {t('HOME.TIMELINE.TITLE')}
      </h2>
      
      {/* Adaptive timeline border (Left on mobile, Top on desktop) */}
      <div className="relative border-l-8 border-black dark:border-white ml-8 md:ml-0 md:flex md:border-l-0 md:border-t-8 md:justify-between space-y-12 md:space-y-0 pt-8">
        {steps.map((step, i) => (
          <div key={i} className="relative md:w-1/3 flex flex-col items-start md:items-center">
            {/* Year Badge with rotation effect */}
            <div className={`absolute -left-[44px] md:-left-auto md:-top-[44px] w-20 h-20 border-8 border-black dark:border-white ${step.color} flex items-center justify-center text-xl font-black rotate-12 group hover:rotate-0 transition-all`}>
              {step.year}
            </div>
            {/* Description Card */}
            <div className="ml-12 md:ml-0 md:mt-12 brutalist-card p-6 bg-white dark:bg-gray-800 w-full max-w-[250px]">
              <p className="font-bold uppercase leading-tight">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
