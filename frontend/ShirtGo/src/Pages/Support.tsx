/**
 * @fileoverview Help Center (Support) Page.
 * Implements a category-based selection system to provide instant support responses.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, CreditCard, RotateCcw, MapPin, HelpCircle, MessageCircle } from 'lucide-react';

/**
 * Support Page Component.
 * Features an interactive grid of help categories and a dynamic dialogue box.
 */
export const Support = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /**
   * Definition of support categories and their visual themes.
   */
  const categories = [
    { id: 'ORDER', icon: <Package size={32} />, color: 'bg-cyan-400' },
    { id: 'PAYMENT', icon: <CreditCard size={32} />, color: 'bg-yellow-400' },
    { id: 'RETURN', icon: <RotateCcw size={32} />, color: 'bg-pink-400' },
    { id: 'BRANCH', icon: <MapPin size={32} />, color: 'bg-green-400' },
    { id: 'OTHER', icon: <HelpCircle size={32} />, color: 'bg-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col min-h-[85vh]">
      {/* Section Introduction */}
      <div className="mb-12">
        <h1 className="text-6xl font-black mb-4 uppercase border-b-8 border-black dark:border-white pb-4 inline-block">
          {t('SUPPORT.TITLE')}
        </h1>
        <p className="text-xl font-bold opacity-70 uppercase max-w-2xl">
          {t('SUPPORT.SUBTITLE')}
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Help Categories Selector (Interactive Grid) */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`brutalist-card p-6 flex items-center gap-4 transition-all hover:-translate-y-1 hover:translate-x-1 ${
                selectedCategory === cat.id 
                  ? `${cat.color} translate-x-2 -translate-y-2 shadow-none` 
                  : 'bg-white dark:bg-gray-800 hover:shadow-none'
              } shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}
            >
              <div className={`p-3 border-4 border-black dark:border-white ${cat.color} text-black`}>
                {cat.icon}
              </div>
              <span className="text-xl font-black uppercase text-left leading-tight text-black dark:text-white">
                {t(`SUPPORT.CATEGORIES.${cat.id}`)}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Support Response (Dialogue Box) */}
        <div className="w-full lg:w-1/2 min-h-[300px]">
          {selectedCategory ? (
            <div className="brutalist-card bg-white dark:bg-gray-900 p-8 h-full border-8 border-black dark:border-white shadow-[16px_16px_0_0_rgba(0,0,0,1)] dark:shadow-[16px_16px_0_0_rgba(255,255,255,1)] animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black dark:border-white pb-4">
                <MessageCircle size={32} />
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {t(`SUPPORT.CATEGORIES.${selectedCategory}`)}
                </h2>
              </div>
              <p className="text-2xl font-bold leading-relaxed text-black dark:text-white mb-8 italic">
                "{t(`SUPPORT.RESPONSES.${selectedCategory}`)}"
              </p>
              <div className="flex justify-end">
                {/* Agent Persona Badge */}
                <div className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 font-black uppercase text-sm">
                  ShirtGo Support Agent
                </div>
              </div>
            </div>
          ) : (
            /* Empty State: Placeholder for when no category is selected */
            <div className="h-full border-8 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <HelpCircle size={80} className="mb-4" />
              <p className="text-2xl font-black uppercase italic">Esperando tu consulta...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
