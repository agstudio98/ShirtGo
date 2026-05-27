/**
 * @fileoverview Main Application Component (App).
 * acts as the primary orchestrator for global state providers, layout structure, 
 * and client-side routing.
 * 
 * SOLID Principles:
 * - Single Responsibility: Handles top-level orchestration and layout without 
 *   containing business logic.
 * - Open/Closed: Easily extendable with new global providers or routes.
 */

import { ThemeProvider } from './components/ThemeContext';
import { OrderProvider } from './components/OrderContext';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { Home } from './Pages/Home';
import { Catalog } from './Pages/Catalog';
import { Support } from './Pages/Support';
import { User } from './Pages/User';
import { Routes, Route } from 'react-router-dom';
import { DeliveryDialog } from './components/DeliveryDialog';
import { DeliveryMap } from './components/DeliveryMap';

/**
 * App component.
 * Implements a standard "sticky footer" layout using Flexbox.
 */
function App() {
  return (
    // 1) Global State Providers
    <ThemeProvider>
      <OrderProvider>
        
        {/* Main Application Container */}
        <div className="min-h-screen flex flex-col font-sans">
          
          {/* 2) Navigation Layer */}
          <Navbar />
          
          {/* 3) Main Content Area (Dynamic Routing) */}
          <main className="flex-grow pt-20">
            <Routes>
              {/* Route Definitions: Decouples navigation from implementation */}
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/support" element={<Support />} />
              <Route path="/user" element={<User />} />
            </Routes>
          </main>
          
          {/* 4) Footer Layer */}
          <Footer />

          {/* 5) Global Modals & Overlays */}
          {/* These components listen to context changes to trigger their display */}
          <DeliveryDialog />
          <DeliveryMap />
          
        </div>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
