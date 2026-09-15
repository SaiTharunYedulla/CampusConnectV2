'use client';

import { useInView } from '@/lib/landing/useInView';
import { ArrowDown } from 'lucide-react';

const TRUST_STEPS = [
  { emoji: '📝', label: 'Student Submission',  desc: 'Student submits an achievement with title, description, and date',    color: 'var(--primary)',  bg: 'var(--primary-light)',  border: 'rgba(79,70,229,0.2)' },
  { emoji: '📎', label: 'Proof Uploaded',       desc: 'Supporting documents, certificates, or media files are attached',     color: '#0891B2',          bg: '#ECFEFF',                border: '#BAE6FD'              },
  { emoji: '👩‍🏫', label: 'Teacher Verification', desc: 'An authorised teacher reviews the submission and validates the claim', color: '#059669',          bg: 'var(--success-bg)',      border: 'var(--success-border)'},
  { emoji: '✅', label: 'Verified Achievement',  desc: 'The achievement is marked verified and locked on the platform',        color: 'var(--success)',   bg: 'var(--success-bg)',      border: 'var(--success-border)'},
  { emoji: '🏆', label: 'Score + Recognition',   desc: 'Points are added to the student\'s profile and leaderboard ranking updates', color: '#D97706', bg: '#FFFBEB',                border: '#FDE68A'              },
];

export default function TrustSection() {
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
            background: 'var(--success-bg)', color: 'var(--success)',
            border: '1px solid var(--success-border)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            🔒 Built on Verified Trust
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            No Unverified Claims.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            CampusConnect uses a structured, teacher-verified pipeline. Every achievement
            displayed on a student&apos;s profile has gone through this process.
          </p>
        </div>

        {/* Vertical trust flow */}
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          {TRUST_STEPS.map((step, idx) => (
            <div key={step.label} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Step card */}
              <div style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                background: step.bg, border: `1px solid ${step.border}`,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '0.75rem',
                  background: 'white', border: `2px solid ${step.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {step.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: step.color, marginBottom: '0.25rem' }}>
                    {step.label}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {step.desc}
                  </p>
                </div>
                {/* Step number badge */}
                <div style={{
                  width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                  background: step.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
              </div>

              {/* Arrow connector */}
              {idx < TRUST_STEPS.length - 1 && (
                <div style={{ color: 'var(--border)', padding: '0.375rem 0' }}>
                  <ArrowDown size={20} color="var(--text-muted)" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{
          textAlign: 'center', marginTop: '2.5rem',
          fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic',
        }}>
          Only achievements that complete this full pipeline appear as Verified on a student&apos;s profile.
        </p>

      </div>
    </section>
  );
}
