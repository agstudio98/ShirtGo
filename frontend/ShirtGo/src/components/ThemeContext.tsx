/**
 * @fileoverview Theme Context Provider for managing Light/Dark mode.
 * Syncs the UI theme with the browser's system preferences and document classes.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context type for theme state and toggle functionality.
 */
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * Custom hook for accessing the theme state.
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider component.
 * Adheres to SRP by handling only the visual theme synchronization.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /**
   * Initial effect: Detects system color scheme preference on mount.
   */
  useEffect(() => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  /**
   * Effect: Updates the root document class to enable/disable Tailwind dark mode.
   */
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Toggles the current theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
