'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { Bell, Search, Menu } from 'lucide-react';

interface TopbarProps {
  title?:        string;
  onMenuToggle?: () => void;
}

const ROLE_GREETING: Record<string, string> = {
  STUDENT: 'Student Portal',
  TEACHER: 'Teacher Portal',
  ADMIN:   'Admin Console',
};

export default function Topbar({ title, onMenuToggle }: TopbarProps) {
  const { user } = useAuthStore();
  const role     = user?.role ?? 'STUDENT';
  const profile  = user?.profile as { firstName?: string } | null;
  const greeting = profile?.firstName ? `Hello, ${profile.firstName}` : ROLE_GREETING[role];

  return (
    <header className="cc-topbar">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        style={{
          display: 'none', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-secondary)',
          padding: '0.375rem', marginRight: '0.5rem', borderRadius: '0.375rem',
        }}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }}>
        <h2 style={{
          fontSize: '0.9375rem', fontWeight: 600,
          color: 'var(--text-primary)', margin: 0,
        }}>
          {title ?? greeting}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '0.5rem',
          borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
          transition: 'background 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-subtle)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '0.5rem',
          borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
          transition: 'background 0.15s', position: 'relative',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-subtle)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
