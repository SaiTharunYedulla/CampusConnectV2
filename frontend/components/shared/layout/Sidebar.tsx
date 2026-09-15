'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { getMediaUrl } from '@/lib/utils';
import {
  GraduationCap, LayoutDashboard, Trophy, Rss, BarChart3,
  User, ClipboardList, History, Users, Building2, ShieldCheck,
  LogOut, ChevronRight,
} from 'lucide-react';

interface NavItem {
  href:  string;
  label: string;
  icon:  React.ReactNode;
}

const STUDENT_NAV: NavItem[] = [
  { href: '/student/dashboard',    label: 'Dashboard',     icon: <LayoutDashboard size={17} /> },
  { href: '/student/achievements', label: 'Achievements',  icon: <Trophy size={17} /> },
  { href: '/student/feed',         label: 'Feed',          icon: <Rss size={17} /> },
  { href: '/student/leaderboard',  label: 'Leaderboard',   icon: <BarChart3 size={17} /> },
  { href: '/student/profile',      label: 'Profile',       icon: <User size={17} /> },
];

const TEACHER_NAV: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={17} /> },
  { href: '/teacher/reviews',   label: 'Reviews',    icon: <ClipboardList size={17} /> },
  { href: '/student/feed',      label: 'Feed',       icon: <Rss size={17} /> },
  { href: '/teacher/history',   label: 'History',    icon: <History size={17} /> },
  { href: '/teacher/profile',   label: 'Profile',    icon: <User size={17} /> },
];

const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard',   label: 'Dashboard',   icon: <LayoutDashboard size={17} /> },
  { href: '/admin/students',    label: 'Students',    icon: <Users size={17} /> },
  { href: '/admin/teachers',    label: 'Teachers',    icon: <ShieldCheck size={17} /> },
  { href: '/student/feed',      label: 'Feed',        icon: <Rss size={17} /> },
  { href: '/admin/departments', label: 'Departments', icon: <Building2 size={17} /> },
];

const ROLE_NAV: Record<string, NavItem[]> = {
  STUDENT: STUDENT_NAV,
  TEACHER: TEACHER_NAV,
  ADMIN:   ADMIN_NAV,
};

const ROLE_COLOR: Record<string, string> = {
  STUDENT: 'var(--primary)',
  TEACHER: '#059669',
  ADMIN:   '#DC2626',
};

const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  ADMIN:   'Administrator',
};

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearAuth } = useAuthStore();

  const role    = user?.role ?? 'STUDENT';
  const navItems = ROLE_NAV[role] ?? STUDENT_NAV;
  const profile  = user?.profile as { firstName?: string; lastName?: string; profilePhoto?: string } | null;

  const handleLogout = () => {
    clearAuth();
    document.cookie = 'cc_auth=;path=/;max-age=0';
    document.cookie = 'cc_role=;path=/;max-age=0';
    router.push('/login');
  };

  return (
    <aside className="cc-sidebar">
      {/* Brand */}
      <div style={{ padding: '1.25rem 1.25rem 0.75rem' }}>
        <Link href={`/${role.toLowerCase()}/dashboard`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.125rem', height: '2.125rem', borderRadius: '0.5rem',
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)', flexShrink: 0,
          }}>
            <GraduationCap size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              CampusConnect
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              {ROLE_LABEL[role]}
            </div>
          </div>
        </Link>
      </div>

      <hr className="cc-divider" style={{ margin: '0.75rem 0' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {isActive && (
                <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '0.75rem' }}>
        <hr className="cc-divider" style={{ marginBottom: '0.75rem' }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.625rem 0.5rem', borderRadius: 'var(--radius)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: ROLE_COLOR[role] + '18',
            border: `2px solid ${ROLE_COLOR[role]}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '0.75rem', fontWeight: 600,
            color: ROLE_COLOR[role], overflow: 'hidden',
          }}>
            {profile?.profilePhoto ? (
              <img
                src={getMediaUrl(profile.profilePhoto)}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              profile?.firstName?.[0]?.toUpperCase() ?? user?.email[0]?.toUpperCase() ?? '?'
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.email}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="logout-btn"
            title="Sign out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: '0.25rem',
              borderRadius: '0.25rem', transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
