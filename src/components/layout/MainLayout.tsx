/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="pb-20 md:pb-0 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
