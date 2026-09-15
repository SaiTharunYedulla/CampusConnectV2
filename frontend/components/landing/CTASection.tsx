'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/lib/landing/useInView';

export default function CTASection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`landing-section landing-animate ${inView ? 'in-view' : ''}`}
      style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #6366F1 60%, #7C3AED 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle blobs */}
      <div style={{
        position: 'absolute', top: '-8rem', right: '-8rem',
        width: '30rem', height: '30rem',
        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-6rem', left: '-6rem',
        width: '24rem', height: '24rem',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="landing-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 0.875rem',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, color: 'white',
          }}>
            ✦ Get Started Today
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: 'clamp(1.875rem,5vw,3rem)', fontWeight: 800,
          letterSpacing: '-0.04em', color: 'white', lineHeight: 1.1,
          marginBottom: '1.125rem',
        }}>
          Your Campus.{' '}
          <span style={{ opacity: 0.85 }}>Your Achievements.</span>
          <br />Your Community.
        </h2>

        <p style={{
          fontSize: 'clamp(1rem,2vw,1.125rem)',
          color: 'rgba(255,255,255,0.8)', lineHeight: 1.65,
          maxWidth: '32rem', margin: '0 auto 2.5rem',
        }}>
          Join CampusConnect and start building a verified record of your academic journey —
          one achievement at a time.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center' }}>
          <Link
            href="/register"
            id="cta-create-account"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              background: 'white', color: 'var(--primary)',
              borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
          >
            Create Account <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            id="cta-sign-in"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.12)',
              color: 'white', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9375rem',
              textDecoration: 'none', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            Sign In
          </Link>
        </div>

        {/* Small reassurance */}
        <p style={{ marginTop: '1.75rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>
          Free to use · Role-based access · Teacher-verified achievements
        </p>

      </div>
    </section>
  );
}
