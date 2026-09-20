import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-black text-[#f7f4ef]">
      {/* Background Texture & Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none" 
        style={{ backgroundImage: `url('/IMAGE/BACK.jpeg')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#0b0b0b]/90 pointer-events-none" />

      <Navbar />
      <Sidebar />

      <div className="relative z-10 p-4 sm:ml-64 pt-20 min-h-screen">
        <main className="mx-auto max-w-5xl py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
