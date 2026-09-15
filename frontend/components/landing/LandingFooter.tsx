import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const FOOTER_LINKS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Features',     href: '#features'    },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Technology',   href: '#technology'   },
    ],
  },
  {
    heading: 'Access',
    links: [
      { label: 'Sign In',        href: '/login'    },
      { label: 'Create Account', href: '/register' },
    ],
  },
];

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 1.5rem 2rem',
    }}>
      <div className="landing-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '2.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }} className="footer-grid">

          {/* Brand + description */}
          <div style={{ maxWidth: '22rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '0.875rem' }}>
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
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              A unified campus platform where students showcase verified achievements,
              teachers review and score contributions, and the entire community
              celebrates campus excellence.
            </p>
          </div>

          {/* Navigation columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem',
              }}>
                {col.heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: '0.875rem', color: 'var(--text-secondary)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="cc-divider" />

        {/* Bottom bar */}
        <div style={{
          marginTop: '1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {year} CampusConnect. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Built with</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>Next.js + TypeScript + PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
