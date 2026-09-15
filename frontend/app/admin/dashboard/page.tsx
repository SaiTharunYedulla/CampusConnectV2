'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { AdminDashboard } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Users, GraduationCap, Building2, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

function StatGroup({
  title, href, icon, stats, accent,
}: {
  title: string; href: string; icon: React.ReactNode;
  stats: { label: string; value: number; color?: string }[];
  accent: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="cc-card cc-card-hover" style={{ padding: '1.5rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
              {icon}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{title}</span>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '1rem' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: s.color ?? 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [data, setData]     = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;
  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Admin Console</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Platform overview and management</p>
      </div>

      {/* Quick-action alert if there are pending approvals */}
      {(data.students.pending > 0 || data.teachers.pending > 0) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1.25rem', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.0625rem' }} />
          <div>
            <p style={{ fontWeight: 600, color: 'var(--warning)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Action Required</p>
            <p style={{ color: '#92400E', fontSize: '0.8125rem' }}>
              {data.students.pending > 0 && `${data.students.pending} student${data.students.pending !== 1 ? 's' : ''} pending approval`}
              {data.students.pending > 0 && data.teachers.pending > 0 && ' · '}
              {data.teachers.pending > 0 && `${data.teachers.pending} teacher${data.teachers.pending !== 1 ? 's' : ''} pending approval`}
            </p>
          </div>
        </div>
      )}

      {/* Stat groups */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <StatGroup
          title="Students" href="/admin/students" icon={<GraduationCap size={18}/>} accent="var(--primary)"
          stats={[
            { label: 'Total',   value: data.students.total,    color: 'var(--text-primary)' },
            { label: 'Pending', value: data.students.pending,  color: 'var(--warning)' },
            { label: 'Active',  value: data.students.active,   color: 'var(--success)' },
            { label: 'Rejected',value: data.students.rejected, color: 'var(--error)' },
          ]}
        />
        <StatGroup
          title="Teachers" href="/admin/teachers" icon={<Users size={18}/>} accent="#059669"
          stats={[
            { label: 'Total',   value: data.teachers.total,    color: 'var(--text-primary)' },
            { label: 'Pending', value: data.teachers.pending,  color: 'var(--warning)' },
            { label: 'Active',  value: data.teachers.active,   color: 'var(--success)' },
            { label: 'Rejected',value: data.teachers.rejected, color: 'var(--error)' },
          ]}
        />
        <StatGroup
          title="Departments" href="/admin/departments" icon={<Building2 size={18}/>} accent="#7C3AED"
          stats={[
            { label: 'Total',  value: data.departments.total,  color: 'var(--text-primary)' },
            { label: 'Active', value: data.departments.active, color: 'var(--success)' },
          ]}
        />
        <StatGroup
          title="Achievements" href="/admin/students" icon={<ClipboardList size={18}/>} accent="var(--warning)"
          stats={[
            { label: 'Pending',  value: data.posts.pending,  color: 'var(--warning)' },
            { label: 'Approved', value: data.posts.approved, color: 'var(--success)' },
          ]}
        />
      </div>

      {/* Quick links */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '1.75rem 0 0.875rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[
          { href: '/admin/students?status=PENDING',  label: 'Review student registrations', icon: <Clock size={15}/>,        color: 'var(--warning)' },
          { href: '/admin/teachers?status=PENDING',  label: 'Review teacher registrations', icon: <Clock size={15}/>,        color: 'var(--warning)' },
          { href: '/admin/students',                 label: 'Manage students',              icon: <GraduationCap size={15} />, color: 'var(--primary)' },
          { href: '/admin/departments',              label: 'Manage departments',           icon: <Building2 size={15}/>,     color: '#7C3AED' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div className="cc-card cc-card-hover" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
              <div style={{ color: item.color }}>{item.icon}</div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
