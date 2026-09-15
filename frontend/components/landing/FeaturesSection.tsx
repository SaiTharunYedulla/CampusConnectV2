'use client';

import {
  LayoutDashboard, Trophy, Rss, BarChart3,
  User, ClipboardList, Award, Users,
} from 'lucide-react';
import { useInView } from '@/lib/landing/useInView';

const FEATURES = [
  {
    Icon:  LayoutDashboard,
    title: 'Dashboards',
    desc:  'Personalised dashboards for students, teachers, and admins — each role sees exactly what they need.',
    color: 'var(--primary)',
    bg:    'var(--primary-light)',
  },
  {
    Icon:  Trophy,
    title: 'Achievement Management',
    desc:  'Students submit achievements with supporting proof documents — competitions, workshops, projects, and more.',
    color: '#D97706',
    bg:    '#FFFBEB',
  },
  {
    Icon:  ClipboardList,
    title: 'Teacher Reviews',
    desc:  'Teachers receive pending submissions, review proof, award scores, and send detailed feedback.',
    color: 'var(--success)',
    bg:    'var(--success-bg)',
  },
  {
    Icon:  BarChart3,
    title: 'Scoring System',
    desc:  'Verified achievements contribute to a transparent cumulative score visible on each student\'s profile.',
    color: 'var(--info)',
    bg:    'var(--info-bg)',
  },
  {
    Icon:  Users,
    title: 'Leaderboard',
    desc:  'Campus-wide rankings show who is leading in verified achievements — healthy competition, real results.',
    color: '#7C3AED',
    bg:    '#F5F3FF',
  },
  {
    Icon:  Rss,
    title: 'Community Feed',
    desc:  'A shared activity feed where students and teachers can post, discover, and celebrate campus achievements.',
    color: '#0891B2',
    bg:    '#ECFEFF',
  },
  {
    Icon:  Award,
    title: 'Badges & Recognition',
    desc:  'Students earn achievement badges as milestones are reached — visible on their profile and portfolio.',
    color: '#D97706',
    bg:    '#FFFBEB',
  },
  {
    Icon:  User,
    title: 'Admin Control',
    desc:  'Administrators manage users, departments, approvals, and platform governance from a central console.',
    color: 'var(--error)',
    bg:    'var(--error-bg)',
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      id="features"
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
            ✦ Core Features
          </span>
          <h2 style={{
            fontSize: 'clamp(1.625rem,3.5vw,2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '0.875rem',
          }}>
            Everything a Campus Needs.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
            A comprehensive set of tools built specifically for the real needs of students,
            teachers, and academic institutions.
          </p>
        </div>

        {/* Feature grid */}
        <div className="landing-features-grid">
          {FEATURES.map(({ Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="cc-card cc-card-hover"
              style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              <div style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0,
              }}>
                <Icon size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
