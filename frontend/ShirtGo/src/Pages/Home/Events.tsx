/**
 * @fileoverview Events component for displaying upcoming community/sales events.
 * Implements a detailed dialog view for individual events.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, X } from 'lucide-react';

/**
 * Interface for Event data to ensure type safety.
 */
interface Event {
  id: string;
  title: string;
  date: string;
  color: string;
  desc: string;
}

/**
 * Events component.
 * Manages a list of events and a modal state for the selected event.
 */
export const Events = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  /**
   * Static list of events, localized via the translation hook.
   */
  const events: Event[] = [
    { 
      id: 'E1',
      title: t('HOME.EVENTS.E1'), 
      date: 'April 15, 2026', 
      color: 'bg-purple-400',
      desc: t('HOME.EVENTS.DIALOG.E1_DESC')
    },
    { 
      id: 'E2',
      title: t('HOME.EVENTS.E2'), 
      date: 'May 20, 2026', 
      color: 'bg-red-400',
      desc: t('HOME.EVENTS.DIALOG.E2_DESC')
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <h2 className="text-5xl font-black mb-12 uppercase border-b-8 border-black dark:border-white pb-4 inline-block">{t('HOME.EVENTS.TITLE')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {events.map((e, i) => (
          <div key={i} className={`brutalist-card p-0 flex flex-col md:flex-row overflow-hidden group`}>
            {/* Visual Side (Icon + Color) */}
            <div className={`w-full md:w-1/3 ${e.color} flex items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white`}>
              <Calendar size={64} className="group-hover:animate-bounce" />
            </div>
            {/* Content Side */}
            <div className="w-full md:w-2/3 p-8 bg-white dark:bg-gray-800">
              <span className="text-xl font-black opacity-70 mb-2 block">{e.date}</span>
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight">{e.title}</h3>
              <div className="flex items-center gap-2 font-bold mb-6">
                <MapPin size={20} />
                <span>Buenos Aires, Central Square</span>
              </div>
              <button 
                onClick={() => setSelectedEvent(e)}
                className="brutalist-button w-full py-3 bg-black text-white uppercase font-black"
              >
                {t('HOME.EVENTS.JOIN')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal Dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="brutalist-card bg-white dark:bg-gray-900 w-full max-w-lg overflow-hidden shadow-[20px_20px_0_0_rgba(0,0,0,1)] dark:shadow-[20px_20px_0_0_rgba(255,255,255,1)]">
            {/* Dialog Header */}
            <div className="bg-black text-white dark:bg-white dark:text-black p-4 flex items-center justify-between border-b-4 border-black dark:border-white">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span className="font-black uppercase tracking-tighter">{selectedEvent.title}</span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="hover:bg-red-500 p-1 transition-colors">
                <X size={24} />
              </button>
            </div>
            {/* Dialog Content */}
            <div className="p-8 space-y-6">
              <div className={`p-6 ${selectedEvent.color} border-4 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]`}>
                <p className="text-xl font-black uppercase mb-2">{selectedEvent.date}</p>
                <p className="font-bold">{selectedEvent.desc}</p>
              </div>
              <div className="flex items-center gap-3 font-bold">
                <MapPin size={24} />
                <span>Buenos Aires, Central Square</span>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="brutalist-button w-full py-4 bg-black text-white uppercase font-black"
              >
                {t('HOME.EVENTS.DIALOG.CLOSE')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
