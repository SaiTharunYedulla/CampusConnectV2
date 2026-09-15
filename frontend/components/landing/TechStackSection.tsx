'use client';

import { useInView } from '@/lib/landing/useInView';
import { ArrowRight } from 'lucide-react';

const TECH_LAYERS = [
  {
    label: 'Frontend',
    color: '#0891B2',
    bg:    '#ECFEFF',
    border:'#BAE6FD',
    icon:  '🌐',
    techs: [
      { name: 'Next.js 16',   desc: 'React framework with App Router' },
      { name: 'TypeScript',   desc: 'Type-safe development' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
      { name: 'Zustand',      desc: 'Lightweight state management' },
    ],
  },
  {
    label: 'Backend',
    color: 'var(--success)',
    bg:    'var(--success-bg)',
    border:'var(--success-border)',
    icon:  '⚙️',
    techs: [
      { name: 'Node.js',    desc: 'JavaScript runtime environment' },
      { name: 'Express',    desc: 'Minimal REST API framework' },
      { name: 'TypeScript', desc: 'End-to-end type safety' },
      { name: 'JWT Auth',   desc: 'Access + refresh token flow' },
    ],
  },
  {
    label: 'Data & Storage',
    color: '#7C3AED',
    bg:    '#F5F3FF',
    border:'#DDD6FE',
    icon:  '🗄️',
    techs: [
      { name: 'PostgreSQL', desc: 'Relational database' },
      { name: 'Prisma ORM', desc: 'Type-safe database client' },
      { name: 'Supabase',   desc: 'File and media storage' },
      { name: 'Zod',        desc: 'Schema validation' },
    ],
  },
];

const ARCH_FLOW = [
  { label: 'Student / Teacher',  icon: '👤' },
  { label: 'Next.js UI',         icon: '🌐' },
  { label: 'Express API',        icon: '⚙️' },
  { label: 'Auth + Logic',       icon: '🔐' },
  { label: 'Prisma ORM',         icon: '🔗' },
  { label: 'PostgreSQL',         icon: '🗄️' },
];

export default function TechStackSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="technology"
      ref={ref}
      className={`landing-section landing-animate ${inView ? 'in-view' : ''}`}
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="landing-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 0.875rem', marginBottom: '1rem',
            background: 'var(--primary-light)', color: 'var(--primary)',
            border: '1px solid rgba(79,70,229,0.18)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            ⚙ Technology Stack
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            Built with Modern Technology.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            A full-stack TypeScript codebase designed for performance, type safety,
            and a great developer experience from the first commit.
          </p>
        </div>

        {/* Tech layer cards */}
        <div className="landing-tech-grid" style={{ marginBottom: '3rem' }}>
          {TECH_LAYERS.map(({ label, color, bg, border, icon, techs }) => (
            <div
              key={label}
              className="cc-card cc-card-hover"
              style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
                  background: bg, border: `1px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color }}>
                  {label}
                </div>
              </div>

              {/* Tech items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {techs.map(({ name, desc }) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: bg, border: `1px solid ${border}`,
                      borderRadius: 'var(--radius)', gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color, whiteSpace: 'nowrap' }}>{name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture flow */}
        <div style={{
          background: 'var(--background)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Request Flow
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0' }}>
            {ARCH_FLOW.map((node, idx) => (
              <div key={node.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3125rem',
                  padding: '0.625rem 0.875rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', minWidth: '7rem', textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{node.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{node.label}</span>
                </div>
                {idx < ARCH_FLOW.length - 1 && (
                  <ArrowRight size={16} color="var(--text-muted)" style={{ margin: '0 0.375rem', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
