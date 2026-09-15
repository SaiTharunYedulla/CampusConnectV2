'use client';

import { useInView } from '@/lib/landing/useInView';

const PROBLEMS = [
  {
    emoji: '📁',
    title: 'Scattered Records',
    desc: 'Student achievements are spread across emails, drives, and spreadsheets — with no central source of truth.',
  },
  {
    emoji: '🔍',
    title: 'No Visibility',
    desc: 'Teachers have no easy, structured way to review and validate what students have actually accomplished.',
  },
  {
    emoji: '📋',
    title: 'Manual Tracking',
    desc: 'Maintaining achievement lists, calculating scores, and managing submissions is tedious and error-prone.',
  },
  {
    emoji: '🏆',
    title: 'Lack of Recognition',
    desc: 'Outstanding student accomplishments often go unrecognized beyond the classroom and the campus.',
  },
  {
    emoji: '🔗',
    title: 'Disconnected Community',
    desc: 'Students and teachers communicate in silos without a shared platform to discover contributions.',
  },
  {
    emoji: '⚖️',
    title: 'No Verification Layer',
    desc: 'Self-reported achievements carry no credibility — there is no system to verify or validate claims.',
  },
];

export default function ProblemSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`landing-section landing-animate ${inView ? 'in-view' : ''}`}
      style={{ background: 'var(--background)' }}
    >
      <div className="landing-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 0.875rem', marginBottom: '1rem',
            background: 'var(--error-bg)', color: 'var(--error)',
            border: '1px solid var(--error-border)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            ⚠ The Problem
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            Achievements Don't Manage Themselves.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            Without a dedicated platform, students miss recognition and institutions lose visibility
            into what their community is actually achieving.
          </p>
        </div>

        {/* Problem grid */}
        <div className="landing-problem-grid">
          {PROBLEMS.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="cc-card cc-card-hover"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
                background: 'var(--error-bg)', border: '1px solid var(--error-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', flexShrink: 0,
              }}>
                {emoji}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4375rem', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
