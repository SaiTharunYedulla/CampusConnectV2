import Link from 'next/link';
import {
  ArrowRight, GraduationCap, Trophy, Clock,
  BarChart3, Award, CheckCircle,
} from 'lucide-react';

const SAMPLE_ACHIEVEMENTS = [
  { title: 'National Hackathon — 1st Place', date: '12 Mar 2026', status: 'approved', pts: '50' },
  { title: 'AI Workshop Coordinator',         date: '28 Feb 2026', status: 'pending',  pts: null  },
  { title: 'IEEE Paper Publication',          date: '14 Jan 2026', status: 'approved', pts: '45' },
];

const MINI_LEADERBOARD = [
  { name: 'Ananya R.', score: '320', rank: '🥇' },
  { name: 'Rahul S.',  score: '285', rank: '🥈' },
  { name: 'Priya N.',  score: '260', rank: '🥉' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF2FF 52%, #F0FDF4 100%)',
        padding: 'clamp(3rem,7vw,5.5rem) 1.5rem clamp(3.5rem,6vw,5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial blob decorators — same as auth layout */}
      <div style={{
        position: 'absolute', top: '-14rem', right: '-14rem',
        width: '52rem', height: '52rem',
        background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-12rem', left: '-12rem',
        width: '44rem', height: '44rem',
        background: 'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="landing-hero-grid">

          {/* ─── Left: text + CTAs ─────────────────────────────── */}
          <div
            style={{
              display: 'flex', flexDirection: 'column', gap: '1.625rem',
              animation: 'fadeIn 0.6s ease both',
            }}
          >
            {/* Label pill */}
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.3125rem 0.875rem',
                background: 'var(--primary-light)', color: 'var(--primary)',
                border: '1px solid rgba(79,70,229,0.2)',
                borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600,
                letterSpacing: '0.01em',
              }}>
                <span style={{ fontSize: '0.625rem' }}>✦</span>
                Campus Achievement Platform
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{
                fontSize: 'clamp(2.375rem, 5.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
                marginBottom: '1.125rem',
              }}>
                Connect.{' '}
                <span style={{ color: 'var(--primary)' }}>Participate.</span>
                <br />Achieve.
              </h1>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.0625rem)',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '32rem',
              }}>
                A unified campus platform where students showcase their achievements,
                teachers verify and score them, and the entire campus community
                stays connected through meaningful recognition.
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <Link
                href="/register"
                id="hero-get-started"
                className="btn-primary"
                style={{ padding: '0.6875rem 1.625rem', fontSize: '0.9375rem', gap: '0.5rem' }}
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                id="hero-sign-in"
                className="btn-ghost"
                style={{ padding: '0.6875rem 1.375rem', fontSize: '0.9375rem' }}
              >
                Sign In
              </Link>
            </div>

            {/* Trust indicators */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
              paddingTop: '0.25rem',
            }}>
              {[
                { icon: <CheckCircle size={14} />, label: 'Teacher Verified' },
                { icon: <Trophy size={14} />,      label: 'Live Leaderboard' },
                { icon: <BarChart3 size={14} />,   label: 'Transparent Scoring' },
              ].map(({ icon, label }) => (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500,
                }}>
                  <span style={{ color: 'var(--primary)' }}>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Right: Product mockup ─────────────────────────── */}
          <div style={{
            animation: 'float 5.5s ease-in-out infinite',
            filter: 'drop-shadow(0 24px 48px rgba(79,70,229,0.11))',
          }}
            className="landing-mockup-float"
          >
            {/* Browser-chrome frame */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '0.875rem', overflow: 'hidden',
              boxShadow: '0 24px 56px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)',
            }}>
              {/* Chrome top bar */}
              <div style={{
                background: 'var(--border-subtle)', padding: '0.5rem 0.875rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {['#FC5753', '#FDBC40', '#34C749'].map(c => (
                    <div key={c} style={{ width: '0.5625rem', height: '0.5625rem', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, background: 'var(--surface)', borderRadius: '0.25rem',
                  padding: '0.1875rem 0.625rem', fontSize: '0.5625rem',
                  color: 'var(--text-muted)', border: '1px solid var(--border)',
                  textAlign: 'center', maxWidth: '220px', margin: '0 auto',
                }}>
                  campusconnect.app/student/dashboard
                </div>
              </div>

              {/* App content: mini sidebar + content */}
              <div style={{ display: 'flex', height: '348px', background: 'var(--background)' }}>

                {/* Mini sidebar */}
                <div style={{
                  width: '88px', background: 'var(--surface)',
                  borderRight: '1px solid var(--border)',
                  padding: '0.625rem 0.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.1875rem',
                  flexShrink: 0,
                }}>
                  {/* Brand row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.3rem', marginBottom: '0.375rem' }}>
                    <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '0.3rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GraduationCap size={9} color="white" />
                    </div>
                    <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--text-primary)' }}>Campus</span>
                  </div>
                  {[
                    { emoji: '▣',  label: 'Dashboard',  active: true  },
                    { emoji: '🏆', label: 'Achieve.',   active: false },
                    { emoji: '📰', label: 'Feed',       active: false },
                    { emoji: '📊', label: 'Ranking',    active: false },
                    { emoji: '👤', label: 'Profile',    active: false },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.3125rem 0.375rem', borderRadius: '0.25rem',
                      background: item.active ? 'var(--primary-light)' : 'transparent',
                      color:      item.active ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.5rem', fontWeight: item.active ? 600 : 400,
                    }}>
                      <span style={{ fontSize: '0.625rem' }}>{item.emoji}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Dashboard content */}
                <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Good morning, Ananya 👋
                    </div>
                    <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>
                      Your CampusConnect snapshot.
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem' }}>
                    {[
                      { Icon: Trophy,    val: '5',   label: 'Verified', c: 'var(--primary)' },
                      { Icon: Clock,     val: '2',   label: 'Pending',  c: 'var(--warning)' },
                      { Icon: BarChart3, val: '320', label: 'Score',    c: 'var(--success)' },
                      { Icon: Award,     val: '3',   label: 'Badges',   c: '#D97706'         },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: '0.3rem', padding: '0.3125rem 0.25rem',
                        textAlign: 'center',
                      }}>
                        <s.Icon size={9} color={s.c} style={{ marginBottom: '0.125rem' }} />
                        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontSize: '0.4375rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent achievements */}
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.4375rem' }}>
                    <div style={{ fontSize: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Recent Achievements
                    </div>
                    {SAMPLE_ACHIEVEMENTS.map((a) => (
                      <div key={a.title} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)',
                        gap: '0.25rem',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.46875rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {a.title}
                          </div>
                          <div style={{ fontSize: '0.40625rem', color: 'var(--text-muted)' }}>{a.date}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1875rem', flexShrink: 0 }}>
                          {a.pts && <span style={{ fontSize: '0.46875rem', fontWeight: 700, color: 'var(--primary)' }}>{a.pts}pt</span>}
                          <span style={{
                            fontSize: '0.40625rem', padding: '0.09375rem 0.28125rem',
                            borderRadius: '9999px',
                            background: a.status === 'approved' ? 'var(--success-bg)' : 'var(--warning-bg)',
                            color:      a.status === 'approved' ? 'var(--success)'    : 'var(--warning)',
                            border: `1px solid ${a.status === 'approved' ? 'var(--success-border)' : 'var(--warning-border)'}`,
                          }}>
                            {a.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Leaderboard snippet */}
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.4375rem' }}>
                    <div style={{ fontSize: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Top Students
                    </div>
                    {MINI_LEADERBOARD.map(e => (
                      <div key={e.name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.5625rem' }}>{e.rank}</span>
                          <span style={{ fontSize: '0.4375rem', color: 'var(--text-primary)', fontWeight: 500 }}>{e.name}</span>
                        </div>
                        <span style={{ fontSize: '0.46875rem', fontWeight: 700, color: 'var(--primary)' }}>{e.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
