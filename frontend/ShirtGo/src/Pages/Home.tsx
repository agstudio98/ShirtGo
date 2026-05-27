/**
 * @fileoverview Landing Page orchestrator.
 * Combines all Home-specific sub-components into a unified marketing view.
 */

import { Main } from './Home/Main';
import { Who } from './Home/Who';
import { Slogans } from './Home/Slogans';
import { Timeline } from './Home/Timeline';
import { Top } from './Home/Top';
import { Events } from './Home/Events';
import { Pays } from './Home/Pays';
import { Carrousel } from './Home/Carrousel';

/**
 * Home Page component.
 * Adheres to the Composition Principle by delegating all UI rendering 
 * to smaller, specialized domain components.
 */
export const Home = () => {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* 1) Hero Section */}
      <Main />
      
      {/* 2) Mission & Vision */}
      <Who />
      
      {/* 3) High-impact Value Propositions */}
      <Slogans />
      
      {/* 4) Brand Journey & History */}
      <Timeline />
      
      {/* 5) Featured Products Showcase */}
      <Top />
      
      {/* 6) Upcoming Community Events */}
      <Events />
      
      {/* 7) Financial Confidence & Payments */}
      <Pays />
      
      {/* 8) Trend Gallery */}
      <Carrousel />
    </div>
  );
};
