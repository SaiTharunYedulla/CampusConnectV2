'use client';

import { useInView } from '@/lib/landing/useInView';
import { Trophy, Clock, BarChart3, Award, ClipboardList, ThumbsUp } from 'lucide-react';

/* ── Stat card helper (reuses .cc-stat-card class) ─────────────────────── */
function MiniStat({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="cc-stat-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem' }}>
      <div style={{
        width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function ProductPreview() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`landing-section landing-animate ${inView ? 'in-view' : ''}`}
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="landing-container">

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 0.875rem', marginBottom: '1rem',
            background: 'var(--primary-light)', color: 'var(--primary)',
            border: '1px solid rgba(79,70,229,0.18)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            ✦ Product Preview
          </span>
          <h2 style={{ fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.875rem' }}>
            See the Platform in Action
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            A complete experience designed for students, teachers, and institutions — all in one place.
          </p>
        </div>

        {/* Three preview cards */}
        <div className="landing-preview-row">

          {/* ─── Card 1: Student Dashboard ─────────────────── */}
          <div className="cc-card" style={{ overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{
              padding: '0.75rem 1rem', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Trophy size={14} color="white" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>Student Dashboard</span>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                <MiniStat icon={<Trophy size={15} />}    value="5"   label="Verified"  color="var(--primary)" />
                <MiniStat icon={<Clock size={15} />}     value="2"   label="Pending"   color="var(--warning)" />
                <MiniStat icon={<BarChart3 size={15} />} value="320" label="Score"     color="var(--success)" />
                <MiniStat icon={<Award size={15} />}     value="3"   label="Badges"    color="#D97706"        />
              </div>
              {/* Mini achievement list */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.625rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Recent Achievements
                </div>
                {[
                  { title: 'National Hackathon — 1st Place', pts: '50', approved: true },
                  { title: 'AI Workshop Coordinator',         pts: null, approved: false },
                  { title: 'IEEE Paper Publication',          pts: '45', approved: true },
                ].map(a => (
                  <div key={a.title} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.375rem 0', borderBottom: '1px solid var(--border-subtle)', gap: '0.5rem',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {a.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                      {a.pts && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{a.pts}pt</span>}
                      <span style={{
                        fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: '9999px',
                        background: a.approved ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color:      a.approved ? 'var(--success)'    : 'var(--warning)',
                        border: `1px solid ${a.approved ? 'var(--success-border)' : 'var(--warning-border)'}`,
                      }}>
                        {a.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Card 2: Teacher Reviews ───────────────────── */}
          <div className="cc-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '0.75rem 1rem', background: '#059669',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <ClipboardList size={14} color="white" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>Teacher Reviews</span>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { student: 'Ananya Reddy', title: 'National Hackathon — 1st Place', dept: 'CSE', time: '2h ago' },
                { student: 'Rahul Sharma', title: 'Conducted AI Workshop',          dept: 'IT',  time: '5h ago' },
                { student: 'Priya Nair',   title: 'IEEE Paper Publication',         dept: 'ECE', time: '1d ago' },
                { student: 'Kiran Rao',    title: 'Open Source Contribution',       dept: 'CSE', time: '2d ago' },
              ].map(r => (
                <div key={r.title} style={{
                  background: 'var(--background)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.student}</span>
                    <span style={{
                      fontSize: '0.6875rem', padding: '0.125rem 0.4375rem', borderRadius: '9999px',
                      background: 'var(--warning-bg)', color: 'var(--warning)',
                      border: '1px solid var(--warning-border)',
                    }}>Pending</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{r.dept} · {r.time}</span>
                    <button style={{
                      fontSize: '0.6875rem', padding: '0.1875rem 0.625rem', borderRadius: 'var(--radius)',
                      background: '#05966914', color: '#059669', border: '1px solid #059669',
                      cursor: 'default', fontWeight: 600,
                    }}>Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Card 3: Community Feed ────────────────────── */}
          <div className="cc-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '0.75rem 1rem', background: '#7C3AED',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.875rem' }}>📰</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>Community Feed</span>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Ananya Reddy', dept: 'CSE', time: '2h ago', text: 'Secured 1st place in the National Hackathon 2026 🎉', pts: '50', likes: 24, tag: '🏆 Achievement' },
                { name: 'Rahul Sharma', dept: 'IT',  time: '5h ago', text: 'Our team conducted the AI Workshop for 120+ students.', pts: '35', likes: 18, tag: '📚 Activity' },
                { name: 'Priya Nair',   dept: 'ECE', time: '1d ago', text: 'Published a research paper at IEEE International Conference.', pts: '45', likes: 31, tag: '📄 Research' },
              ].map(p => (
                <div key={p.name} className="achievement-card" style={{ padding: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                      background: 'var(--primary-light)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)',
                    }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{p.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{p.dept} · {p.time}</div>
                    </div>
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.6875rem', padding: '0.125rem 0.4375rem',
                      borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)',
                      border: '1px solid rgba(79,70,229,0.15)',
                    }}>{p.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {p.text}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>+{p.pts} points</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <ThumbsUp size={11} /> {p.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
