/**
 * @fileoverview Application Entry Point.
 * responsible for bootstrapping the React application, initializing internationalization,
 * and setting up the base routing context.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n'; // Initialize i18next configurations

/**
 * Root rendering logic.
 * Adheres to the Single Responsibility Principle by acting only as a bootstrap layer.
 * 
 * - StrictMode: Enables additional development checks for side effects and legacy APIs.
 * - BrowserRouter: Provides the history and routing context to the entire application.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
