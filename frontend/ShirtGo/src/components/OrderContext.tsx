/**
 * @fileoverview Order Context Provider for managing the purchase lifecycle.
 * Implements the Provider Pattern to share order state across the application.
 * 
 * SOLID Principles:
 * - Single Responsibility: Manages only the state and transitions of a single active order.
 */

import React, { createContext, useContext, useState } from 'react';

/**
 * Interface representing the structure of an active order.
 */
interface Order {
  productId: number;
  productName: string;
  price: number;
  status: 'confirming' | 'searching' | 'matched' | 'delivering' | 'delivered';
}

/**
 * Context type definition for the Order state and its modifiers.
 */
interface OrderContextType {
  activeOrder: Order | null;
  startOrder: (product: any) => void;
  confirmOrder: () => void;
  reprocessOrder: () => void;
  cancelOrder: () => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * OrderProvider component that wraps the application to provide order state.
 * 
 * Clean Code: Encapsulates state transitions (e.g., searching -> matched) 
 * within clear, named functions.
 */
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showMap, setShowMap] = useState(false);

  /**
   * Initializes a new order process.
   * @param {any} product - The product object selected by the user.
   */
  const startOrder = (product: any) => {
    setActiveOrder({
      productId: product.id,
      productName: product.nameKey || product.name,
      price: product.price,
      status: 'confirming'
    });
  };

  /**
   * Resets the current order status to 'confirming'.
   */
  const reprocessOrder = () => {
    if (!activeOrder) return;
    setActiveOrder({ ...activeOrder, status: 'confirming' });
  };

  /**
   * Confirms the order and simulates the delivery lifecycle.
   * Uses timeouts to simulate asynchronous backend/rider updates.
   */
  const confirmOrder = () => {
    if (!activeOrder) return;
    
    // Phase 1: Searching for driver
    setActiveOrder({ ...activeOrder, status: 'searching' });
    
    // Phase 2: Driver found (simulated delay)
    setTimeout(() => {
      setActiveOrder(prev => prev ? { ...prev, status: 'matched' } : null);
    }, 3000);

    // Phase 3: Delivering (simulated delay)
    setTimeout(() => {
      setActiveOrder(prev => prev ? { ...prev, status: 'delivering' } : null);
    }, 6000);
  };

  /**
   * Terminates the current order process and resets the UI state.
   */
  const cancelOrder = () => {
    setActiveOrder(null);
    setShowMap(false);
  };

  return (
    <OrderContext.Provider value={{ activeOrder, startOrder, confirmOrder, reprocessOrder, cancelOrder, showMap, setShowMap }}>
      {children}
    </OrderContext.Provider>
  );
};

/**
 * Custom hook to consume the OrderContext.
 * @throws {Error} if used outside of an OrderProvider.
 */
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  return context;
};
