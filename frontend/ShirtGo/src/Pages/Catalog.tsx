/**
 * @fileoverview Product Catalog Page.
 * Implements catalog browsing, filtering, and pagination for 60+ generated items.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShirtIcon, PantsIcon, HoodieIcon, DressShirtIcon } from '../components/Icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrder } from '../components/OrderContext';
import { useNavigate } from 'react-router-dom';

// Pagination Constant
const ITEMS_PER_PAGE = 6;

/**
 * Product templates used for simulating a large inventory.
 */
const PRODUCT_TEMPLATES = [
  { nameKey: 'URBAN_SHIRT', icon: 'shirt', color: 'bg-yellow-400', price: 18500 },
  { nameKey: 'SLIM_JEAN', icon: 'pants', color: 'bg-blue-400', price: 45200 },
  { nameKey: 'NIGHT_SHIRT', icon: 'dress', color: 'bg-green-400', price: 32000 },
  { nameKey: 'GRAFFITI_HOODIE', icon: 'hoodie', color: 'bg-pink-400', price: 58000 },
  { nameKey: 'CLASSIC_POLO', icon: 'shirt', color: 'bg-purple-400', price: 28500 },
  { nameKey: 'CARGO_BERMUDA', icon: 'pants', color: 'bg-orange-400', price: 35000 },
  { nameKey: 'BASIC_TEE', icon: 'shirt', color: 'bg-cyan-400', price: 12000 },
  { nameKey: 'DENIM_JACKET', icon: 'hoodie', color: 'bg-red-400', price: 65000 },
  { nameKey: 'SPORTS_SHORT', icon: 'pants', color: 'bg-lime-400', price: 22000 },
  { nameKey: 'WINTER_COAT', icon: 'hoodie', color: 'bg-indigo-400', price: 95000 },
];

const CHAINS = ['TEJANO', 'EQUUS', 'MACOWENS', 'CRISTOBAL', 'KEY', 'PROTOTYPE', 'RENNER', 'ZARA'];
const BRANCHES = ['Alto Rosario', 'Abasto Shopping', 'Unicenter', 'Paseo Alcorta', 'Florida St.', 'Galerías Pacífico', 'Dot Baires', 'Palermo Soho'];

/**
 * Inventory Generation: Simulates 60 products using deterministic patterns.
 * Clean Code: Data is generated outside the component to prevent re-generation on re-render.
 */
const GENERATED_PRODUCTS = Array.from({ length: 60 }).map((_, index) => {
  const template = PRODUCT_TEMPLATES[index % PRODUCT_TEMPLATES.length];
  const chain = CHAINS[index % CHAINS.length];
  const branch = BRANCHES[index % BRANCHES.length];
  
  return {
    id: index + 1,
    nameKey: template.nameKey,
    chainKey: chain,
    branch,
    price: template.price + (index * 100), // Variable pricing
    iconType: template.icon,
    color: template.color
  };
});

/**
 * Reusable Product Icon helper.
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
 * Catalog Page Component.
 */
export const Catalog = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { startOrder } = useOrder();
  const navigate = useNavigate();
  
  // Pagination Logic
  const totalPages = Math.ceil(GENERATED_PRODUCTS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = GENERATED_PRODUCTS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /**
   * Navigates to a specific page and resets scroll position.
   */
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Validates user session before starting purchase.
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black mb-8 uppercase border-b-8 border-black dark:border-white pb-4 inline-block">
        {t('CATALOG.TITLE')}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="brutalist-card p-6 bg-pink-400 dark:bg-purple-900 text-black dark:text-white">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{t('CATALOG.FILTERS')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-black uppercase text-sm mb-1">{t('CATALOG.CATEGORY')}</label>
                <select className="w-full border-4 border-black p-2 bg-white text-black font-bold">
                  <option>{t('CATALOG.CATEGORIES.ALL')}</option>
                  <option>{t('CATALOG.CATEGORIES.SHIRTS')}</option>
                  <option>{t('CATALOG.CATEGORIES.PANTS')}</option>
                  <option>{t('CATALOG.CATEGORIES.HOODIES')}</option>
                </select>
              </div>
              <div>
                <label className="block font-black uppercase text-sm mb-1">{t('CATALOG.BRANCH')}</label>
                <select className="w-full border-4 border-black p-2 bg-white text-black font-bold">
                  <option>{t('CATALOG.CATEGORIES.ALL')}</option>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <button className="brutalist-button w-full mt-4 bg-black text-white py-3 uppercase font-black">
                {t('CATALOG.APPLY')}
              </button>
            </div>
          </div>
        </aside>
        
        {/* Product Results Area */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map(product => (
              <div key={product.id} className="brutalist-card bg-white dark:bg-gray-800 p-0 flex flex-col overflow-hidden group">
                {/* Visual Header */}
                <div className={`h-64 ${product.color} border-b-4 border-black dark:border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                  <ProductIcon type={product.iconType} className="w-16 h-16 text-black dark:text-white" />
                </div>
                {/* Product Content */}
                <div className="p-4 flex flex-col flex-grow text-black dark:text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black leading-tight uppercase">
                      {t(`CATALOG.PRODUCTS.${product.nameKey}`)}
                    </h3>
                    <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] px-2 py-1 font-bold uppercase border-2 border-black dark:border-white">
                      {t(`CATALOG.CHAINS.${product.chainKey}`)}
                    </span>
                  </div>
                  <p className="text-xs font-bold opacity-70 mb-4 uppercase">{product.branch}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-xl font-black bg-white dark:bg-black border-4 border-black dark:border-white px-2 py-1">
                      ${product.price.toLocaleString('es-AR')}
                    </p>
                    <button 
                      onClick={() => handleBuy(product)}
                      className="brutalist-button px-4 py-2 text-sm font-black uppercase"
                    >
                      {t('CATALOG.BUY')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Brutalist Pagination */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            <button 
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`brutalist-button p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Previous Page"
            >
              <ChevronLeft size={24} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`w-12 h-12 font-black border-4 border-black dark:border-white transition-all ${
                  currentPage === i + 1 
                  ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1' 
                  : 'bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-yellow-400 dark:hover:bg-purple-600'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`brutalist-button p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Next Page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <p className="text-center mt-4 font-black uppercase text-sm">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
};
