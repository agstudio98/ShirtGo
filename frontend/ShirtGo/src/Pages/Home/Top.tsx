/**
 * @fileoverview Top Deals section displaying featured products.
 * Handles the logic for initiating a purchase or redirecting to login.
 */

import { useTranslation } from 'react-i18next';
import { ShirtIcon, PantsIcon, HoodieIcon, DressShirtIcon } from '../../components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../components/OrderContext';

/**
 * Hardcoded featured products data for the landing page.
 */
const FEATURED_PRODUCTS = [
  { id: 101, nameKey: 'URBAN_SHIRT', chainKey: 'TEJANO', branch: 'Alto Rosario', price: 18500, iconType: 'shirt', color: 'bg-yellow-400', discount: '20% OFF' },
  { id: 102, nameKey: 'SLIM_JEAN', chainKey: 'EQUUS', branch: 'Abasto Shopping', price: 45200, iconType: 'pants', color: 'bg-blue-400', discount: '15% OFF' },
  { id: 103, nameKey: 'GRAFFITI_HOODIE', chainKey: 'CRISTOBAL', branch: 'Unicenter', price: 58000, iconType: 'hoodie', color: 'bg-pink-400', discount: '30% OFF' },
  { id: 104, nameKey: 'NIGHT_SHIRT', chainKey: 'MACOWENS', branch: 'Florida St.', price: 32000, iconType: 'dress', color: 'bg-green-400', discount: '10% OFF' },
  { id: 105, nameKey: 'CLASS_POLO', chainKey: 'KEY', branch: 'Paseo Alcorta', price: 28500, iconType: 'shirt', color: 'bg-purple-400', discount: '25% OFF' },
  { id: 106, nameKey: 'CARGO_BERMUDA', chainKey: 'PROTOTYPE', branch: 'Galerías Pacífico', price: 35000, iconType: 'pants', color: 'bg-orange-400', discount: '40% OFF' },
];

/**
 * Helper component to render the appropriate icon based on product type.
 */
const ProductIcon = ({ type, className }: { type: string, className: string }) => {
  switch (type) {
    case 'shirt': return <ShirtIcon className={className} />;
    case 'pants': return <PantsIcon className={className} />;
    case 'hoodie': return <HoodieIcon className={className} />;
    case 'dress': return <DressShirtIcon className={className} />;
    default: return <ShirtIcon className={className} />;
  }
};

/**
 * Top (Featured Deals) component.
 * Orchestrates product display and shopping navigation.
 */
export const Top = () => {
  const { t } = useTranslation();
  const { startOrder } = useOrder();
  const navigate = useNavigate();

  /**
   * Handles the 'Buy' action.
   * If the user is logged in, it starts the order flow; otherwise, it redirects to login.
   * @param {any} product - The product object to purchase.
   */
  const handleBuy = (product: any) => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/user');
      return;
    }
    startOrder(product);
  };

  return (
    <section className="py-24 bg-gray-100 dark:bg-gray-900 border-y-8 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">{t('HOME.TOP.TITLE')}</h2>
            <p className="text-2xl font-bold opacity-70 uppercase tracking-widest">{t('HOME.TOP.SUBTITLE')}</p>
          </div>
          <Link to="/catalog" className="brutalist-button text-2xl px-12 py-5 bg-black text-white hover:bg-white hover:text-black transition-colors">
            {t('NAVBAR.CATALOG').toUpperCase()}
          </Link>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURED_PRODUCTS.map((product, i) => (
            <div key={i} className="brutalist-card group bg-white dark:bg-gray-800 p-0 flex flex-col overflow-hidden shadow-[12px_12px_0_0_rgba(0,0,0,1)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all duration-300">
              
              {/* Product Visual Area */}
              <div className={`relative h-72 ${product.color} border-b-4 border-black dark:border-white flex items-center justify-center overflow-hidden`}>
                {/* Badge/Discount */}
                <div className="absolute top-6 left-6 z-10 bg-black text-white px-4 py-2 font-black rotate-[-12deg] group-hover:rotate-0 transition-transform border-2 border-white text-lg">
                  {product.discount}
                </div>
                {/* Animated Icon */}
                <div className="transform group-hover:scale-125 transition-transform duration-500">
                  <ProductIcon type={product.iconType} className="w-24 h-24 text-black dark:text-white" />
                </div>
              </div>
              
              {/* Product Info Area */}
              <div className="p-6 flex flex-col flex-grow text-black dark:text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-1">
                      {t(`CATALOG.PRODUCTS.${product.nameKey}`)}
                    </h3>
                    <p className="text-sm font-bold opacity-60 uppercase">{product.branch}</p>
                  </div>
                  <span className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-black uppercase border-2 border-black dark:border-white">
                    {t(`CATALOG.CHAINS.${product.chainKey}`)}
                  </span>
                </div>

                {/* Price and Action */}
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-red-500 line-through opacity-50 mb-[-4px]">
                      ${(product.price * 1.5).toLocaleString('es-AR')}
                    </span>
                    <span className="text-3xl font-black bg-white dark:bg-black border-4 border-black dark:border-white px-3 py-1 mt-1">
                      ${product.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleBuy(product)}
                    className="brutalist-button px-6 py-3 font-black uppercase text-sm hover:bg-yellow-400 dark:hover:bg-purple-600 transition-colors"
                  >
                    {t('CATALOG.BUY')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
