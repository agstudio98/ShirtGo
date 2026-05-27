/**
 * @fileoverview Custom SVG icons for the ShirtGo catalog.
 * Clean Code: Reusable functional components for SVGs to keep templates clean.
 */

import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Shirt icon SVG component.
 * @param {IconProps} props
 */
export const ShirtIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.62 1.96V10a2 2 0 002 2h2v10h12V12h2a2 2 0 002-2V5.42a2 2 0 00-1.62-1.96z" />
  </svg>
);

/**
 * Pants icon SVG component.
 * @param {IconProps} props
 */
export const PantsIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4v16M15 4v16M9 4h6M9 20l-4-1M15 20l4-1M5 19V4h14v15" />
    <path d="M9 8h6" />
  </svg>
);

/**
 * Hoodie icon SVG component.
 * @param {IconProps} props
 */
export const HoodieIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L8 4.5V7c0 2.21 1.79 4 4 4s4-1.79 4-4V4.5L12 2z" />
    <path d="M4 10v10a2 2 0 002 2h12a2 2 0 002-2V10" />
    <path d="M2 12l2-2h16l2 2" />
    <path d="M9 22V12h6v10" />
  </svg>
);

/**
 * Dress Shirt icon SVG component.
 * @param {IconProps} props
 */
export const DressShirtIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9 5h6l-3-3z" />
    <path d="M3 6l3-1h12l3 1v4h-2V6h-4v14h-4V6H6v4H4V6z" />
  </svg>
);
