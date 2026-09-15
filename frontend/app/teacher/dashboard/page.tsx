'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth.store';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ClipboardList, CheckCircle, XCircle, RefreshCcw, ChevronRight } from 'lucide-react';

interface Stats { totalReviews: number; approved: number; rejected: number; revisionRequested: number; }
interface PendingItem { id: string; title: string; student: { firstName: string; lastName: string; }; updatedAt: string; }

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="cc-stat-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', flexShrink: 0, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user }   = useAuthStore();
  const [stats, setStats]         = useState<Stats | null>(null);
  const [pending, setPending]     = useState<PendingItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const profile = user?.profile as { firstName?: string } | null;

  useEffect(() => {
    Promise.all([
      api.get('/teachers/me'),
      api.get('/teacher/reviews/pending?limit=5'),
    ]).then(([profileRes, pendingRes]) => {
      setStats(profileRes.data.data?.stats ?? null);
      setPending(pendingRes.data.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome, {profile?.firstName ?? 'Teacher'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Here's your review activity overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={<ClipboardList size={18}/>} label="Total Reviews"      value={stats?.totalReviews ?? 0}       color="var(--primary)" />
        <StatCard icon={<CheckCircle size={18}/>}   label="Approved"           value={stats?.approved ?? 0}           color="var(--success)" />
        <StatCard icon={<XCircle size={18}/>}       label="Rejected"           value={stats?.rejected ?? 0}           color="var(--error)" />
        <StatCard icon={<RefreshCcw size={18}/>}    label="Revision Requested" value={stats?.revisionRequested ?? 0} color="var(--warning)" />
      </div>

      {/* Pending queue preview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Pending Reviews</h2>
        <Link href="/teacher/reviews" style={{ fontSize: '0.8125rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 500 }}>
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="cc-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <CheckCircle size={36} style={{ color: 'var(--success)', margin: '0 auto 0.75rem', display: 'block' }} />
          <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>All caught up! No pending reviews.</p>
        </div>
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          {pending.map(item => (
            <Link key={item.id} href={`/teacher/reviews/${item.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--background)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    by {item.student?.firstName} {item.student?.lastName} · {new Date(item.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
