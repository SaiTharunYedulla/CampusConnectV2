'use client';

import { useInView } from '@/lib/landing/useInView';
import { ThumbsUp, Calendar, Award } from 'lucide-react';

const POSTS = [
  {
    name:     'Ananya Reddy',
    initials: 'AR',
    dept:     'CSE',
    time:     '2 hours ago',
    tag:      '🏆 Achievement',
    tagColor: 'var(--primary)',
    tagBg:    'var(--primary-light)',
    tagBorder:'rgba(79,70,229,0.2)',
    title:    'Secured 1st place in National Hackathon 2026',
    body:     'Competed against 200+ teams across 18 universities. Our solution used AI-powered resource optimization for smart campuses. Incredibly proud of the team.',
    category: 'Competition',
    position: '🥇 1st Place',
    pts:      50,
    likes:    24,
    approved: true,
  },
  {
    name:     'Rahul Sharma',
    initials: 'RS',
    dept:     'IT',
    time:     '5 hours ago',
    tag:      '📚 Activity',
    tagColor: '#059669',
    tagBg:    'var(--success-bg)',
    tagBorder:'var(--success-border)',
    title:    'Conducted AI Workshop for 120+ students',
    body:     'Our student club organized a two-day workshop on Machine Learning fundamentals. We covered model training, evaluation, and real-world deployment with hands-on sessions.',
    category: 'Workshop',
    position: null,
    pts:      35,
    likes:    18,
    approved: true,
  },
  {
    name:     'Priya Nair',
    initials: 'PN',
    dept:     'ECE',
    time:     '1 day ago',
    tag:      '📄 Research',
    tagColor: '#0891B2',
    tagBg:    '#ECFEFF',
    tagBorder:'#BAE6FD',
    title:    'Published paper at IEEE International Conference',
    body:     'Our paper on "Energy-Efficient IoT Protocol Design" was accepted and presented at IEEE CONECCT 2026 in Bengaluru. Grateful to my supervisor and co-authors.',
    category: 'Research',
    position: null,
    pts:      45,
    likes:    31,
    approved: true,
  },
];

export default function CommunityPreview() {
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
            background: 'var(--primary-light)', color: 'var(--primary)',
            border: '1px solid rgba(79,70,229,0.18)', borderRadius: '9999px',
            fontSize: '0.8125rem', fontWeight: 600,
          }}>
            📰 Community Feed
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            A Living Campus Community.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            The CampusConnect feed keeps the entire campus informed — students share accomplishments,
            teachers celebrate progress, and the community thrives together.
          </p>
        </div>

        {/* Post cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
          {POSTS.map((post) => (
            <div
              key={post.name}
              className="achievement-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {post.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{post.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.dept} · {post.time}</div>
                </div>
                <span style={{
                  fontSize: '0.6875rem', padding: '0.1875rem 0.5rem',
                  borderRadius: '9999px', whiteSpace: 'nowrap',
                  background: post.tagBg, color: post.tagColor,
                  border: `1px solid ${post.tagBorder}`, fontWeight: 500,
                }}>
                  {post.tag}
                </span>
              </div>

              {/* Status + position badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.6875rem', padding: '0.1875rem 0.5rem', borderRadius: '9999px', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', fontWeight: 500 }}>
                  ✓ Approved
                </span>
                {post.position && (
                  <span style={{ fontSize: '0.6875rem', padding: '0.1875rem 0.5rem', borderRadius: '9999px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontWeight: 600 }}>
                    {post.position}
                  </span>
                )}
                <span style={{ fontSize: '0.6875rem', padding: '0.1875rem 0.5rem', borderRadius: '9999px', background: 'var(--border-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: 500 }}>
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {post.title}
              </h3>

              {/* Body */}
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.body}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '0.625rem', borderTop: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                    <Award size={13} /> +{post.pts} pts
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> Recently
                  </span>
                </div>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    border: '1px solid rgba(79,70,229,0.2)',
                    borderRadius: '9999px', padding: '0.25rem 0.625rem',
                    cursor: 'default', fontSize: '0.75rem', fontWeight: 500,
                  }}
                >
                  <ThumbsUp size={12} fill="currentColor" /> {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
