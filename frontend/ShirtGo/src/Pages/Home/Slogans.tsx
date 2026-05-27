/**
 * @fileoverview Brand Slogans section.
 * Highlights core value propositions (Speed, Quality, Price) with a skewed layout.
 */

import { useTranslation } from 'react-i18next';
import { FastForward, CheckCircle, DollarSign } from 'lucide-react';

/**
 * Slogans component.
 * Uses CSS skew transformations to create a dynamic, "off-kilter" brutalist look.
 */
export const Slogans = () => {
  const { t } = useTranslation();
  
  /**
   * List of slogans with associated icons and background colors.
   */
  const slogans = [
    { icon: <FastForward size={48} />, text: t('HOME.SLOGANS.S1'), color: 'bg-orange-400' },
    { icon: <CheckCircle size={48} />, text: t('HOME.SLOGANS.S2'), color: 'bg-green-400' },
    { icon: <DollarSign size={48} />, text: t('HOME.SLOGANS.S3'), color: 'bg-blue-400' },
  ];

  return (
    <section className="py-20 bg-black dark:bg-white text-white dark:text-black overflow-hidden -skew-y-3">
      {/* Reverse skew on the container to keep the content straight */}
      <div className="max-w-7xl mx-auto px-4 skew-y-3 flex flex-wrap justify-around gap-12">
        {slogans.map((s, i) => (
          <div key={i} className="flex flex-col items-center space-y-4 group">
            {/* Icon container with hover animation */}
            <div className={`p-6 border-4 border-white dark:border-black ${s.color} text-black group-hover:scale-110 transition-transform shadow-[4px_4px_0_0_rgba(255,255,255,1)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,1)]`}>
              {s.icon}
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">{s.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
