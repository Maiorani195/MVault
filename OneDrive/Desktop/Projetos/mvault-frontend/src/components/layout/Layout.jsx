import React from 'react';
import Header from './Header';
import VaultWatermark from './VaultWatermark';

export default function Layout({ children }) {
  return (
    <div className="bg-black min-h-screen flex flex-col selection:bg-[#e58b20] selection:text-[#0c0b09] relative overflow-x-hidden">
      <VaultWatermark />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10 py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
