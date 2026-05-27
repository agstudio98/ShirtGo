/**
 * @fileoverview Main Navigation Bar component.
 * orchestrates navigation links, user identity, theme toggling, and language switching.
 * 
 * SOLID Principles:
 * - Interface Segregation: Uses multiple hooks (useTranslation, useTheme, useOrder) 
 *   to handle specific concerns.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, MessageCircle, Moon, Sun, Globe, MapPin, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useState, useEffect } from 'react';
import { GestorUser } from './GestorUser';
import { useOrder } from './OrderContext';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [showGestor, setShowGestor] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeOrder, setShowMap } = useOrder();

  // Derived state: determines if an order is currently in transit.
  const isMatched = activeOrder?.status === 'matched' || activeOrder?.status === 'delivering';

  /**
   * Effect: Synchronizes user state with localStorage and custom 'user-updated' events.
   * Ensures the UI reflects changes across different tabs or components.
   */
  useEffect(() => {
    const handleStorage = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          let parsed = JSON.parse(savedUser);
          // Auto-unwrap nested 'data' objects for legacy compatibility.
          if (parsed.data && !parsed.token) {
            parsed = parsed.data;
            localStorage.setItem('user', JSON.stringify(parsed));
          }
          setUser(parsed);
        } catch (e) {
          console.error("Error parsing user data", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    handleStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('user-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user-updated', handleStorage);
    };
  }, []);

  /**
   * Effect: Re-fetches user data when the GestorUser (profile editor) is closed.
   */
  useEffect(() => {
    if (!showGestor) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [showGestor]);

  /**
   * Cycles the application language between English and Spanish.
   */
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  /**
   * Helper to close the mobile responsive menu.
   */
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-light-bg dark:bg-dark-bg border-b-4 border-black dark:border-white shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold logo-font tracking-wider" onClick={closeMenu}>
            ShirtGo
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/catalog" className="text-xl hover:underline decoration-4 underline-offset-4 font-bold">{t('NAVBAR.CATALOG')}</Link>
            <Link to="/support" className="flex items-center space-x-2 text-xl hover:underline decoration-4 underline-offset-4 font-bold">
              <MessageCircle size={24} />
              <span>{t('NAVBAR.SUPPORT')}</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Dynamic Map Icon (appears only when an order is matched) */}
            {isMatched && (
              <button 
                onClick={() => setShowMap(true)}
                className="p-2 bg-blue-500 text-white brutalist-card rounded-none animate-bounce"
                aria-label="Track Order"
              >
                <MapPin size={24} />
              </button>
            )}
            
            {/* Theme & Language Toggles (Desktop only) */}
            <div className="hidden sm:flex items-center space-x-4">
              <button onClick={toggleLanguage} className="p-2 brutalist-card rounded-none" aria-label="Toggle Language">
                <Globe size={24} />
              </button>
              <button onClick={toggleTheme} className="p-2 brutalist-card rounded-none" aria-label="Toggle Theme">
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button className="p-2 brutalist-card rounded-none" aria-label="Cart">
                <ShoppingCart size={24} />
              </button>
            </div>
            
            {/* User Identity / Login */}
            {user ? (
              <button 
                onClick={() => setShowGestor(true)}
                className="flex items-center gap-2 p-1 brutalist-card rounded-none bg-black text-white dark:bg-white dark:text-black hover:translate-x-1 transition-transform overflow-hidden"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-8 h-8 object-cover border-2 border-white dark:border-black" />
                ) : (
                  <User size={24} />
                )}
                <span className="hidden lg:block font-black text-sm uppercase max-w-[100px] truncate px-1">{user.name}</span>
              </button>
            ) : (
              <Link to="/user" className="p-2 brutalist-card rounded-none bg-black text-white dark:bg-white dark:text-black hidden sm:flex">
                <User size={24} />
              </Link>
            )}

            {/* Mobile Sidebar Trigger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 brutalist-card bg-yellow-400 text-black rounded-none border-4 border-black"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Responsive Menu */}
        <div className={`fixed inset-0 top-20 bg-white dark:bg-gray-900 z-40 md:hidden transition-transform duration-500 transform border-t-4 border-black dark:border-white ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex flex-col h-full space-y-8">
            <Link to="/catalog" className="text-4xl font-black uppercase border-b-8 border-black dark:border-white pb-2" onClick={closeMenu}>
              {t('NAVBAR.CATALOG')}
            </Link>
            <Link to="/support" className="text-4xl font-black uppercase border-b-8 border-black dark:border-white pb-2" onClick={closeMenu}>
              {t('NAVBAR.SUPPORT')}
            </Link>
            <Link to="/user" className="text-4xl font-black uppercase border-b-8 border-black dark:border-white pb-2" onClick={closeMenu}>
              {user ? t('USER_MANAGEMENT.TABS.IDENTITY') : t('AUTH.LOGIN')}
            </Link>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button onClick={toggleLanguage} className="brutalist-button flex items-center justify-center gap-2 py-4">
                <Globe size={24} />
                <span className="font-black uppercase">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
              </button>
              <button onClick={toggleTheme} className="brutalist-button flex items-center justify-center gap-2 py-4">
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                <span className="font-black uppercase">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
            
            <button className="brutalist-button w-full bg-black text-white dark:bg-white dark:text-black py-6 text-2xl flex items-center justify-center gap-4">
              <ShoppingCart size={32} />
              <span className="font-black uppercase">My Cart (0)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Management Dialog Overlay */}
      {showGestor && <GestorUser onClose={() => setShowGestor(false)} />}
    </>
  );
};
