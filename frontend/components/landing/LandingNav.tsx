'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Impact',       href: '#impact' },
  { label: 'Technology',   href: '#technology' },
];

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      id="landing-nav"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="landing-container" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', height: '64px', justifyContent: 'space-between' }}>

        {/* Brand — matches sidebar exactly */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
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
              University Platform
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="landing-desktop-only" style={{ alignItems: 'center', gap: '0.125rem' }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.4375rem 0.875rem', borderRadius: 'var(--radius)',
                fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)',
                textDecoration: 'none', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--primary-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTAs + mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Desktop buttons */}
          <Link href="/login"    className="btn-ghost   landing-desktop-only" id="nav-signin"  style={{ whiteSpace: 'nowrap' }}>Sign In</Link>
          <Link href="/register" className="btn-primary landing-desktop-only" id="nav-getstarted" style={{ whiteSpace: 'nowrap' }}>Get Started</Link>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="landing-mobile-only"
            style={{
              alignItems: 'center', justifyContent: 'center',
              width: '2.25rem', height: '2.25rem',
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', cursor: 'pointer',
              color: 'var(--text-secondary)', transition: 'all 0.15s',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav-menu"
          style={{
            background: 'var(--surface)', borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem 1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: 'block', padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius)', fontSize: '0.9375rem',
                fontWeight: 500, color: 'var(--text-secondary)',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
            >
              {link.label}
            </a>
          ))}
          <hr className="cc-divider" style={{ margin: '0.625rem 0' }} />
          <Link href="/login"    className="btn-ghost"   style={{ justifyContent: 'center' }}>Sign In</Link>
          <Link href="/register" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.375rem' }}>Get Started</Link>
        </nav>
      )}
    </header>
  );
}
