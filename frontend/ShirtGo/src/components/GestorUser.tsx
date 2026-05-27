/**
 * @fileoverview User Profile Management component (GestorUser).
 * Handles user identity, financial data, and security settings.
 * 
 * Clean Code: Uses sub-tab architecture to separate different profile concerns.
 * SRP: Manages user synchronization with the backend and local storage.
 */

import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Shield, CreditCard, LogOut, Save, Camera, CreditCard as CardIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * User data interface for type safety.
 */
interface UserData {
  _id: string;
  name: string;
  email: string;
  token: string;
  profileImage?: string;
  address?: string;
  paymentCard?: {
    number: string;
    expiry: string;
    cvv: string;
    type: string;
  };
}

export const GestorUser = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    profileImage: '',
    address: '',
    cardNum: '',
    cardExp: '',
    cardCvv: '',
    cardType: 'Visa'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Effect: Initial data load and self-healing for legacy data structures.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        let parsed = JSON.parse(savedUser);
        
        // Data unwrap for compatibility
        if (parsed.data && !parsed.token) {
          parsed = parsed.data;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
        
        setUserData(parsed);
        setEditData({ 
          name: parsed.name || '', 
          email: parsed.email || '', 
          password: '', 
          profileImage: parsed.profileImage || '',
          address: parsed.address || '',
          cardNum: parsed.paymentCard?.number || '',
          cardExp: parsed.paymentCard?.expiry || '',
          cardCvv: parsed.paymentCard?.cvv || '',
          cardType: parsed.paymentCard?.type || 'Visa'
        });
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  /**
   * Logs out the user by clearing storage and redirecting.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  /**
   * Processes image selection and converts to Base64 for upload.
   * Includes size validation (Clean Code: Fail early).
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        setMessage({ type: 'error', text: 'Image is too large! Max 10MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Submits profile updates to the API.
   * Includes strict frontend validation for financial data.
   */
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Financial Data Validations
    if (activeTab === 'shipping') {
      const cardNumClean = editData.cardNum.replace(/\s/g, '');
      if (cardNumClean.length !== 16) {
        setMessage({ type: 'error', text: 'Card number must be exactly 16 digits!' });
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(editData.cardExp)) {
        setMessage({ type: 'error', text: 'Expiry date must be MM/YY!' });
        return;
      }
      if (editData.cardCvv.length !== 3) {
        setMessage({ type: 'error', text: 'CVV must be 3 digits!' });
        return;
      }
    }

    setMessage({ type: 'info', text: 'Updating...' });
    
    try {
      if (!userData) return;

      const res = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          password: editData.password || undefined,
          profileImage: editData.profileImage,
          address: editData.address,
          paymentCard: {
            number: editData.cardNum,
            expiry: editData.cardExp,
            cvv: editData.cardCvv,
            type: editData.cardType
          }
        })
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error: ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || 'Error updating profile');

      // Sync local storage and state with updated data
      const updatedUser = data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setEditData(prev => ({ ...prev, password: '' }));
      
      // Notify other components (Navbar) of the update
      window.dispatchEvent(new Event('user-updated'));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      console.error("Update error:", err);
      setMessage({ type: 'error', text: err.message || 'Failed to update.' });
    }
  };

  /**
   * Formats card number string into 4-digit chunks for readability.
   */
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0, len = v.length; i < len; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="brutalist-card bg-white dark:bg-gray-900 w-full max-w-4xl h-auto max-h-[90vh] flex flex-col overflow-hidden shadow-[20px_20px_0_0_rgba(0,0,0,1)] dark:shadow-[20px_20px_0_0_rgba(255,255,255,1)]">
        
        {/* Title Bar */}
        <div className="bg-black text-white dark:bg-white dark:text-black p-4 flex items-center justify-between border-b-4 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <UserIcon size={20} />
            <span className="font-black uppercase tracking-tighter">{t('USER_MANAGEMENT.TITLE')}</span>
          </div>
          <button onClick={onClose} className="hover:bg-red-500 p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Tab Sidebar */}
          <aside className="w-full md:w-64 bg-gray-200 dark:bg-gray-800 border-r-4 border-black dark:border-white p-4 space-y-2 flex flex-col">
            <div className="space-y-2">
              {[
                { id: 'info', label: t('USER_MANAGEMENT.TABS.IDENTITY'), icon: <UserIcon size={18} /> },
                { id: 'shipping', label: t('USER_MANAGEMENT.TABS.PAYMENTS'), icon: <CreditCard size={18} /> },
                { id: 'security', label: t('USER_MANAGEMENT.TABS.SECURITY'), icon: <Shield size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 font-bold uppercase transition-all border-2 border-transparent ${
                    activeTab === tab.id 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white translate-x-1' 
                    : 'hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="mt-auto pt-8">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 font-bold uppercase bg-red-500 text-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Form Content */}
          <div className="flex-grow p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 custom-scrollbar">
            {message.text && (
              <div className={`mb-6 p-4 border-4 border-black font-black uppercase text-center ${
                message.type === 'success' ? 'bg-green-400' : message.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
              }`}>
                {message.text}
              </div>
            )}

            {/* IDENTITY TAB */}
            {activeTab === 'info' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 border-8 border-black dark:border-white bg-yellow-400 flex items-center justify-center overflow-hidden">
                      {editData.profileImage ? (
                        <img src={editData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={64} />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-black text-white p-2 border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase">{userData?.name || 'User'}</h2>
                    <p className="font-bold opacity-60 uppercase">{userData?.email}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateInfo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-black uppercase text-sm">{t('USER_MANAGEMENT.INFO.USERNAME')}</label>
                      <input 
                        type="text" 
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full border-4 border-black p-3 font-bold dark:bg-gray-800" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-black uppercase text-sm">{t('AUTH.EMAIL')}</label>
                      <input 
                        type="email" 
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full border-4 border-black p-3 font-bold dark:bg-gray-800" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="brutalist-button flex items-center gap-2 px-8 py-4 bg-cyan-400">
                    <Save size={20} />
                    {t('USER_MANAGEMENT.INFO.SYNC')}
                  </button>
                </form>
              </div>
            )}

            {/* PAYMENTS & SHIPPING TAB */}
            {activeTab === 'shipping' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-2">
                  <h2 className="text-3xl font-black uppercase">{t('USER_MANAGEMENT.FINANCIAL.TITLE')}</h2>
                  <CardIcon className="animate-pulse" size={32} />
                </div>
                
                <form onSubmit={handleUpdateInfo} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block font-black uppercase text-sm">{t('USER_MANAGEMENT.FINANCIAL.DESTINATION')} (Argentina)</label>
                      <input 
                        type="text" 
                        placeholder="Av. Santa Fe 1234, CABA"
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full border-4 border-black p-4 font-bold dark:bg-gray-800 focus:bg-yellow-50 dark:focus:bg-gray-700 transition-colors" 
                      />
                    </div>

                    <div className="brutalist-card p-6 bg-gray-100 dark:bg-gray-800 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-black uppercase text-sm">{t('USER_MANAGEMENT.FINANCIAL.CARD_DETAILS')}</label>
                        <select 
                          value={editData.cardType}
                          onChange={(e) => setEditData({...editData, cardType: e.target.value})}
                          className="bg-black text-white px-2 py-1 font-bold text-xs border-2 border-white"
                        >
                          <option>Visa</option>
                          <option>Mastercard</option>
                          <option>American Express</option>
                          <option>Cabal</option>
                        </select>
                      </div>
                      
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="CARD NUMBER (16 DIGITS)"
                          maxLength={19}
                          value={editData.cardNum}
                          onChange={(e) => setEditData({...editData, cardNum: formatCardNumber(e.target.value)})}
                          className="w-full border-4 border-black p-4 font-mono font-black text-lg dark:bg-gray-900 text-center tracking-widest" 
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength={5}
                            value={editData.cardExp}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                              setEditData({...editData, cardExp: v});
                            }}
                            className="w-full border-4 border-black p-4 font-black dark:bg-gray-900 text-center" 
                          />
                          <input 
                            type="text" 
                            placeholder="CVV"
                            maxLength={3}
                            value={editData.cardCvv}
                            onChange={(e) => setEditData({...editData, cardCvv: e.target.value.replace(/\D/g, '')})}
                            className="w-full border-4 border-black p-4 font-black dark:bg-gray-900 text-center" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="brutalist-button w-full flex items-center justify-center gap-2 py-5 bg-yellow-400 text-black font-black text-xl">
                    <Save size={24} />
                    {t('USER_MANAGEMENT.FINANCIAL.LOCK')}
                  </button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-black uppercase border-b-4 border-black dark:border-white pb-2 inline-block">{t('USER_MANAGEMENT.TABS.SECURITY')}</h2>
                
                <form onSubmit={handleUpdateInfo} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-black uppercase text-sm">{t('AUTH.PASSWORD')} (LEAVE BLANK TO KEEP CURRENT)</label>
                    <input 
                      type="password" 
                      placeholder="NEW PASSWORD"
                      value={editData.password}
                      onChange={(e) => setEditData({...editData, password: e.target.value})}
                      className="w-full border-4 border-black p-4 font-bold dark:bg-gray-800" 
                    />
                  </div>
                  <button type="submit" className="brutalist-button flex items-center gap-2 px-8 py-4 bg-red-500 text-white">
                    <Save size={20} />
                    {t('USER_MANAGEMENT.INFO.SYNC')}
                  </button>
                </form>

                <div className="brutalist-card p-6 bg-yellow-300 dark:bg-yellow-700">
                  <h3 className="text-xl font-black mb-2 uppercase">Advanced Auth (2FA)</h3>
                  <p className="font-bold mb-4">Hardened protection for your financial data.</p>
                  <button type="button" className="brutalist-button bg-black text-white px-8">ACTIVATE 2FA</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
