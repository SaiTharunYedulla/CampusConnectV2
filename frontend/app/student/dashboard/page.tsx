'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth.store';
import { Post, StudentProfile } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import BadgeDisplay from '@/components/shared/BadgeDisplay';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Trophy, Clock, BarChart3, Award, Plus, ChevronRight, TrendingUp } from 'lucide-react';

interface DashboardData {
  profile:    StudentProfile;
  recentPosts:Post[];
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color?: string;
}) {
  return (
    <div className="cc-stat-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{
        width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', flexShrink: 0,
        background: color ? `${color}18` : 'var(--primary-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color ?? 'var(--primary)',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'var(--success)', PENDING_REVIEW: 'var(--warning)',
  REVISION_REQUESTED: 'var(--info)', REJECTED: 'var(--error)', DRAFT: 'var(--text-muted)',
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get('/students/me'),
          api.get('/posts/my?limit=5'),
        ]);
        setData({ profile: profileRes.data.data, recentPosts: postsRes.data.data ?? [] });
      } catch { /* handled by redirect */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;
  if (!data) return null;

  const { profile, recentPosts } = data;
  const stats = profile.stats;
  const profile2 = user?.profile as { firstName?: string } | null;

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Good {getGreeting()}, {profile2?.firstName ?? 'there'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Here's a snapshot of your CampusConnect activity.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={<Trophy size={18} />}   label="Verified Achievements" value={stats?.approvedCount ?? 0} color="var(--primary)" />
        <StatCard icon={<Clock size={18} />}     label="Pending Reviews"       value={stats?.pendingCount ?? 0}  color="var(--warning)" />
        <StatCard icon={<BarChart3 size={18} />} label="Total Score"            value={stats?.totalScore ?? 0}   color="var(--success)" />
        <StatCard icon={<Award size={18} />}     label="Badges Earned"          value={stats?.badges ?? 0}       color="#D97706" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
        {/* Recent achievements */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Achievements</h2>
            <Link href="/student/achievements" style={{ fontSize: '0.8125rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 500 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="cc-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <TrendingUp size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', display: 'block' }} />
              <p style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>No achievements yet</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Submit your first achievement to get started.
              </p>
              <Link href="/student/achievements/new" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Plus size={15} /> New Achievement
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/student/achievements/${post.id}`} style={{ textDecoration: 'none' }}>
                  <div className="cc-card cc-card-hover" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(post.achievementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {post.score !== undefined && post.score !== null && (
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: STATUS_COLORS[post.status] }}>
                          {Number(post.score).toFixed(0)}
                        </span>
                      )}
                      <StatusBadge status={post.status} type="post" />
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/student/achievements/new" className="btn-primary" style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                <Plus size={15} /> New Achievement
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar: badges */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>My Badges</h2>
          <div className="cc-card" style={{ padding: '1.25rem' }}>
            <BadgeDisplay badges={profile.badges ?? []} />
          </div>

          {/* Department */}
          {profile.department && (
            <div className="cc-card" style={{ padding: '1rem 1.25rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Department</div>
              <div style={{ fontWeight: 600 }}>{profile.department.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{profile.academicYear?.replace(/_/g, ' ')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
