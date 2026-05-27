/**
 * @fileoverview Payment Methods section.
 * Lists supported payment gateways and local methods with high-contrast visuals.
 */

import { useTranslation } from 'react-i18next';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

/**
 * Pays component.
 * Displays a grid of payment icons and a descriptive text box.
 */
export const Pays = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-yellow-400 dark:bg-yellow-600 border-y-8 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Descriptive Text Block */}
        <div className="md:w-1/2">
          <h2 className="text-6xl font-black uppercase mb-6 leading-none drop-shadow-[4px_4px_0_rgba(0,0,0,1)] text-white">
            {t('HOME.PAYS.TITLE')}
          </h2>
          <p className="text-2xl font-bold bg-black text-white p-6 shadow-[10px_10px_0_0_rgba(255,255,255,1)]">
            {t('HOME.PAYS.DESC')}
          </p>
        </div>
        
        {/* Payment Methods Grid */}
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          {[
            { icon: <CreditCard size={40} />, label: 'Mastercard' },
            { icon: <CreditCard size={40} />, label: 'Visa' },
            { icon: <Smartphone size={40} />, label: 'Mercado Pago' },
            { icon: <Banknote size={40} />, label: 'Cash (Supermarket)' },
          ].map((m, i) => (
            <div key={i} className="brutalist-card bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-6 gap-2 hover:scale-105 transition-all">
              {m.icon}
              <span className="font-black text-sm uppercase">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
