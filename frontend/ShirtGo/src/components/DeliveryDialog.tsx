/**
 * @fileoverview Dialog component for order confirmation and status updates.
 * Guides the user through the 'confirming', 'searching', and 'matched' phases.
 */

import { useState, useEffect } from 'react';
import { useOrder } from './OrderContext';
import { useTranslation } from 'react-i18next';
import { X, Package, Truck, MapPin, CheckCircle, Loader2 } from 'lucide-react';

/**
 * DeliveryDialog component.
 * Adheres to SRP by focusing only on the visual representation of the order flow.
 */
export const DeliveryDialog = () => {
  const { activeOrder, confirmOrder, cancelOrder } = useOrder();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);

  /**
   * Helper to fetch user data from localStorage.
   */
  const fetchUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  };

  /**
   * Initial effect: Sync user data and listen for updates.
   */
  useEffect(() => {
    fetchUser();
    window.addEventListener('user-updated', fetchUser);
    return () => window.removeEventListener('user-updated', fetchUser);
  }, []);

  // Guard clause: Don't render if there is no active order.
  if (!activeOrder) return null;

  // Validation: Check if the user has provided sufficient shipping and payment info.
  const hasShippingInfo = user?.address && user?.paymentCard?.number;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="brutalist-card bg-white dark:bg-gray-900 w-full max-w-lg overflow-hidden shadow-[20px_20px_0_0_rgba(0,0,0,1)] dark:shadow-[20px_20px_0_0_rgba(255,255,255,1)]">
        
        {/* Header Section */}
        <div className="bg-black text-white dark:bg-white dark:text-black p-4 flex items-center justify-between border-b-4 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <Package size={20} />
            <span className="font-black uppercase tracking-tighter">Order Processing</span>
          </div>
          <button onClick={cancelOrder} className="hover:bg-red-500 p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {/* Phase: Confirming the purchase */}
          {activeOrder.status === 'confirming' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-black uppercase text-center mb-4">Confirm Purchase</h2>
              <div className="brutalist-card p-4 bg-yellow-400 text-black">
                <p className="font-black text-xl uppercase">{t(`CATALOG.PRODUCTS.${activeOrder.productName}`)}</p>
                <p className="text-3xl font-black mt-2">${activeOrder.price.toLocaleString('es-AR')}</p>
              </div>

              {!hasShippingInfo ? (
                // Feedback for missing user information
                <div className="bg-red-100 border-4 border-red-500 p-4 text-red-700 font-bold">
                  <p className="uppercase text-sm mb-2">Error: Missing Information</p>
                  <p>You must add a delivery address and payment method in your profile settings before buying.</p>
                </div>
              ) : (
                // Confirmation action
                <div className="space-y-4">
                  <div className="flex items-center gap-3 opacity-70">
                    <MapPin size={20} />
                    <p className="font-bold">Shipping to: {user.address}</p>
                  </div>
                  <button 
                    onClick={confirmOrder}
                    className="brutalist-button w-full py-4 text-xl bg-green-500 hover:translate-x-1 hover:translate-y-1"
                  >
                    CONFIRM & PAY
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase: Searching for available driver */}
          {activeOrder.status === 'searching' && (
            <div className="text-center py-12 space-y-6 animate-in fade-in duration-500">
              <div className="relative inline-block">
                <Loader2 size={80} className="animate-spin text-blue-500" />
                <Truck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={32} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter animate-pulse">Searching for Driver...</h2>
              <p className="font-bold opacity-60">Connecting with supermarkets and local delivery riders in Argentina.</p>
            </div>
          )}

          {/* Phase: Driver matched / Order in transit */}
          {(activeOrder.status === 'matched' || activeOrder.status === 'delivering') && (
            <div className="text-center py-12 space-y-6 animate-in scale-in duration-500">
              <CheckCircle size={80} className="mx-auto text-green-500" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Driver Matched!</h2>
              <div className="brutalist-card p-4 bg-blue-100 dark:bg-blue-900 inline-block">
                <p className="font-black uppercase">Juan "El Rayo" Rossi</p>
                <p className="font-bold text-sm">Moto: Honda Titan 150cc</p>
              </div>
              <p className="font-bold">Your order is being picked up. You can track it using the map icon in the navbar.</p>
              <button 
                onClick={cancelOrder}
                className="brutalist-button px-8 py-3 bg-black text-white"
              >
                GOT IT!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
