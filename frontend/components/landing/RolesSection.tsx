'use client';

import { useInView } from '@/lib/landing/useInView';
import { Check } from 'lucide-react';

const STUDENT_BENEFITS = [
  'Build a verified portfolio of real achievements',
  'Earn recognition through transparent, fair scoring',
  'Compete through healthy campus-wide rankings',
  'Submit proof and receive expert teacher feedback',
  'Earn badges as meaningful milestones are reached',
  'Track your academic journey from day one',
  'Discover campus activities and stay connected',
  'Showcase your profile to teachers and the institution',
];

const TEACHER_BENEFITS = [
  'Review student achievement submissions efficiently',
  'Provide scores and detailed written feedback',
  'Recognise and celebrate outstanding contributions',
  'Stay connected to student activity and progress',
  'Manage pending reviews from a dedicated dashboard',
  'Participate in the campus community feed',
  'View department-wise achievement analytics',
  'Build a history of verified reviews over time',
];

export default function RolesSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="impact"
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
            ✦ Why CampusConnect
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            Built for Everyone on Campus.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            Whether you are a student building your portfolio or a teacher recognising student
            contributions — CampusConnect works for both sides of the campus.
          </p>
        </div>

        {/* Two columns */}
        <div className="landing-two-col">

          {/* Students */}
          <div>
            <div className="cc-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, #6366F1 100%)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                }}>
                  🎓
                </div>
                <div>
                  <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'white' }}>For Students</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>Build your verified campus portfolio</div>
                </div>
              </div>
              {/* Benefits list */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {STUDENT_BENEFITS.map((benefit) => (
                  <div key={benefit} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                    <div style={{
                      width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                      background: 'var(--primary-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.0625rem',
                    }}>
                      <Check size={11} color="var(--primary)" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div>
            <div className="cc-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                }}>
                  👩‍🏫
                </div>
                <div>
                  <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'white' }}>For Teachers</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>Review, verify, and recognise with ease</div>
                </div>
              </div>
              {/* Benefits list */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {TEACHER_BENEFITS.map((benefit) => (
                  <div key={benefit} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                    <div style={{
                      width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                      background: 'var(--success-bg)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.0625rem',
                    }}>
                      <Check size={11} color="var(--success)" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Institution note */}
        <div style={{
          marginTop: '2.5rem', padding: '1.5rem 2rem',
          background: 'var(--background)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
        }}>
          <div style={{
            width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
            background: 'var(--warning-bg)', border: '1px solid var(--warning-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', flexShrink: 0,
          }}>
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              For Institutions
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Administrators get a unified view of all student activity, achievement verification, user management,
              and department analytics — providing the institution with a clear, centralised record of campus participation and academic growth.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
