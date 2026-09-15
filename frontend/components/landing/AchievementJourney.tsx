'use client';

import { useInView } from '@/lib/landing/useInView';

const STEPS = [
  {
    num: '01',
    emoji: '👤',
    title: 'Create Your Profile',
    desc: 'Students register and set up their academic profile — adding their department, academic year, skills, and a short bio.',
    sample: null,
    color: 'var(--primary)',
  },
  {
    num: '02',
    emoji: '📝',
    title: 'Submit an Achievement',
    desc: 'Submit any accomplishment — hackathons, workshops, competitions, papers, projects — with supporting proof documents.',
    sample: {
      title: 'National Hackathon 2026 — 1st Place',
      category: 'Competition', position: '🥇 1st Place',
    },
    color: 'var(--info)',
  },
  {
    num: '03',
    emoji: '👩‍🏫',
    title: 'Teacher Reviews',
    desc: 'An assigned teacher reviews the submission, verifies the proof, and provides a score along with written feedback.',
    sample: {
      teacher: 'Dr. Kavitha Rao', action: 'Approved', feedback: 'Excellent performance — well deserved recognition.',
    },
    color: '#059669',
  },
  {
    num: '04',
    emoji: '📊',
    title: 'Score Awarded',
    desc: 'Once verified, the achievement contributes to the student\'s cumulative score, updating their profile automatically.',
    sample: { pts: '+50', total: '320 pts total', badge: '🏅 Top Achiever' },
    color: '#D97706',
  },
  {
    num: '05',
    emoji: '🏆',
    title: 'Earn Recognition',
    desc: 'The student\'s leaderboard rank updates, badges are awarded for milestones, and the achievement appears on their public profile.',
    sample: { rank: '#1', dept: 'CSE', score: '320 pts' },
    color: 'var(--success)',
  },
];

export default function AchievementJourney() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="how-it-works"
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
            background: 'var(--primary-light)', color: 'var(--primary)',
            border: '1px solid rgba(79,70,229,0.18)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            ✦ How It Works
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            A Journey Worth Celebrating.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            From profile creation to leaderboard recognition — every step is transparent,
            structured, and built around real student accomplishments.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
          {STEPS.map((step, idx) => (
            <div key={step.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Left: number + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '50%',
                  background: step.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem', fontWeight: 800,
                  boxShadow: `0 4px 12px ${step.color}30`,
                }}>
                  {step.num}
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ width: '2px', flex: 1, minHeight: '2rem', background: 'var(--border)', marginTop: '0.375rem' }} />
                )}
              </div>

              {/* Right: content */}
              <div style={{ flex: 1, paddingBottom: idx < STEPS.length - 1 ? '1rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{step.emoji}</span>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                  {step.desc}
                </p>

                {/* Sample card — specific to each step */}
                {step.sample && (
                  <div className="cc-card" style={{ padding: '0.875rem 1rem', display: 'inline-flex', flexDirection: 'column', gap: '0.375rem', minWidth: '260px' }}>
                    {/* Step 2 sample */}
                    {'title' in step.sample && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.2)', fontWeight: 500 }}>
                            {step.sample.category}
                          </span>
                          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: '9999px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontWeight: 600 }}>
                            {step.sample.position}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{step.sample.title}</div>
                      </>
                    )}
                    {/* Step 3 sample */}
                    {'teacher' in step.sample && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: '#05966914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: '#059669' }}>K</div>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{step.sample.teacher}</div>
                            <span style={{ fontSize: '0.6875rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', fontWeight: 500 }}>
                              ✓ {step.sample.action}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>"{step.sample.feedback}"</p>
                      </>
                    )}
                    {/* Step 4 sample */}
                    {'pts' in step.sample && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{step.sample.pts}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>points added</div>
                        </div>
                        <div style={{ height: '2rem', width: '1px', background: 'var(--border)' }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{step.sample.total}</div>
                          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.4375rem', borderRadius: '9999px', background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 600 }}>
                            {step.sample.badge}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Step 5 sample */}
                    {'rank' in step.sample && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{step.sample.rank}</div>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Campus Leaderboard</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.sample.dept} · {step.sample.score}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
