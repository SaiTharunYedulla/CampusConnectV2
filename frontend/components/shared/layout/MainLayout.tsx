'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

interface MainLayoutProps {
  children:  React.ReactNode;
  topbarTitle?: string;
}

export default function MainLayout({ children, topbarTitle }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="cc-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 35, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <Sidebar />

      <div className="cc-main">
        <Topbar
          title={topbarTitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="cc-content">
          {children}
        </main>
      </div>
    </div>
  );
}
