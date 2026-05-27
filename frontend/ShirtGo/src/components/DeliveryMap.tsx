/**
 * @fileoverview Interactive delivery tracking map.
 * Simulates a rider's movement from a store to the user's location.
 */

import { useState, useEffect } from 'react';
import { useOrder } from './OrderContext';
import { X, MapPin, Truck, Store } from 'lucide-react';

/**
 * DeliveryMap component.
 * Uses a grid-based coordinate system to simulate real-time movement.
 */
export const DeliveryMap = () => {
  const { showMap, setShowMap, activeOrder } = useOrder();
  const [truckPos, setTruckPos] = useState({ x: 10, y: 10 });

  /**
   * Effect: Animates the truck position when the map is visible 
   * and the status is 'delivering'.
   */
  useEffect(() => {
    if (showMap && activeOrder?.status === 'delivering') {
      const interval = setInterval(() => {
        setTruckPos(prev => ({
          x: Math.min(prev.x + 1, 80),
          y: Math.min(prev.y + 0.5, 80)
        }));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showMap, activeOrder]);

  // Guard clause: Don't render if map visibility is toggled off.
  if (!showMap) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="brutalist-card bg-white dark:bg-gray-900 w-full max-w-4xl h-[70vh] flex flex-col overflow-hidden shadow-[24px_24px_0_0_rgba(0,0,0,1)] dark:shadow-[24px_24px_0_0_rgba(255,255,255,1)]">
        
        {/* Navigation Bar */}
        <div className="bg-black text-white dark:bg-white dark:text-black p-4 flex items-center justify-between border-b-4 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span className="font-black uppercase tracking-tighter">Live Delivery Tracking - Rosario/CABA Region</span>
          </div>
          <button onClick={() => setShowMap(false)} className="hover:bg-red-500 p-1 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Map Visualization Area */}
        <div className="flex-grow relative bg-gray-200 dark:bg-gray-800 overflow-hidden pattern-grid-lg">
          {/* Origin Point: Partner Supermarket */}
          <div className="absolute top-[10%] left-[10%] flex flex-col items-center animate-bounce">
            <Store className="text-red-500" size={40} />
            <span className="bg-black text-white px-2 text-[10px] font-black uppercase">Origin</span>
          </div>

          {/* Destination Point: User Home */}
          <div className="absolute top-[80%] left-[80%] flex flex-col items-center">
            <MapPin className="text-green-500" size={40} />
            <span className="bg-black text-white px-2 text-[10px] font-black uppercase">Your Home</span>
          </div>

          {/* Moving Truck Agent */}
          <div 
            className="absolute transition-all duration-500 ease-linear flex flex-col items-center"
            style={{ left: `${truckPos.x}%`, top: `${truckPos.y}%` }}
          >
            <div className="relative">
              <Truck className="text-blue-500" size={48} />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full animate-ping" />
            </div>
            <span className="bg-blue-600 text-white px-2 py-1 text-[10px] font-black uppercase whitespace-nowrap border-2 border-black">Juan Rossi En Camino</span>
          </div>

          {/* Decorative Grid Lines (Simulated Streets) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-1 bg-black absolute top-1/4" />
            <div className="w-full h-1 bg-black absolute top-3/4" />
            <div className="h-full w-1 bg-black absolute left-1/4" />
            <div className="h-full w-1 bg-black absolute left-3/4" />
          </div>
        </div>

        {/* Dynamic Status Footer */}
        <div className="p-4 bg-yellow-300 dark:bg-yellow-700 border-t-4 border-black dark:border-white flex justify-between items-center">
          <div className="font-black uppercase italic">
            {activeOrder?.status === 'delivering' ? 'Estimated arrival: 5 minutes' : 'Driver picking up your order...'}
          </div>
          <div className="font-black uppercase text-sm border-2 border-black px-2">
            Status: {activeOrder?.status}
          </div>
        </div>
      </div>
    </div>
  );
};
