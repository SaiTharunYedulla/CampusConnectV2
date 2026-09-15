'use client';

import { useInView } from '@/lib/landing/useInView';
import { ArrowRight } from 'lucide-react';

const FLOW_STEPS = [
  { emoji: '📝', label: 'Submit',      desc: 'Student submits achievement with proof' },
  { emoji: '👩‍🏫', label: 'Review',      desc: 'Teacher reviews and validates the submission' },
  { emoji: '✅', label: 'Verify',      desc: 'Achievement is verified and confirmed' },
  { emoji: '📊', label: 'Score',       desc: 'Points are added to the student profile' },
  { emoji: '🏆', label: 'Leaderboard', desc: 'Rankings update across the campus' },
  { emoji: '🎖️', label: 'Recognition', desc: 'Badges earned, profile showcased' },
];

export default function SolutionSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`landing-section landing-animate ${inView ? 'in-view' : ''}`}
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="landing-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 0.875rem', marginBottom: '1rem',
            background: 'var(--success-bg)', color: 'var(--success)',
            border: '1px solid var(--success-border)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            ✓ The Solution
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            One Connected Campus.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '38rem', margin: '0 auto' }}>
            CampusConnect brings achievements, verification, scoring, and community into
            a single coherent platform — from the moment a student submits to the moment
            they earn recognition.
          </p>
        </div>

        {/* Flow diagram */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          gap: '0', flexWrap: 'wrap',
        }}>
          {FLOW_STEPS.map((step, idx) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* Step box */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.5rem', width: '9rem', textAlign: 'center',
              }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '0.875rem',
                  background: idx === 0 ? 'var(--primary)' : idx === FLOW_STEPS.length - 1 ? 'var(--success)' : 'var(--primary-light)',
                  border: `2px solid ${idx === 0 ? 'var(--primary)' : idx === FLOW_STEPS.length - 1 ? 'var(--success)' : 'rgba(79,70,229,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.375rem',
                  boxShadow: idx === 0 || idx === FLOW_STEPS.length - 1 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease',
                }}>
                  {step.emoji}
                </div>
                <div style={{
                  fontSize: '0.875rem', fontWeight: 700,
                  color: idx === 0 ? 'var(--primary)' : idx === FLOW_STEPS.length - 1 ? 'var(--success)' : 'var(--text-primary)',
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {step.desc}
                </div>
              </div>

              {/* Arrow connector (except after last) */}
              {idx < FLOW_STEPS.length - 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  paddingTop: '1rem', color: 'var(--border)',
                  flexShrink: 0,
                }}>
                  <ArrowRight size={18} color="var(--text-muted)" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div style={{
          marginTop: '3rem', padding: '1.5rem 2rem',
          background: 'var(--primary-light)', border: '1px solid rgba(79,70,229,0.18)',
          borderRadius: 'var(--radius-lg)', textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--primary)', fontWeight: 600, lineHeight: 1.6 }}>
            Every achievement goes through a transparent, verified pipeline — so students
            build a credible portfolio and institutions gain real visibility into campus participation.
          </p>
        </div>

      </div>
    </section>
  );
}
