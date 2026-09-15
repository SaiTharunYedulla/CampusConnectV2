'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { UserStatus } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Search, Users, ChevronRight, Calendar } from 'lucide-react';

const STATUS_TABS: { label: string; value: UserStatus | 'ALL' }[] = [
  { label: 'All',       value: 'ALL' },
  { label: 'Pending',   value: 'PENDING' },
  { label: 'Active',    value: 'ACTIVE' },
  { label: 'Rejected',  value: 'REJECTED' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

interface StudentRow {
  id: string;
  firstName: string; lastName: string; username: string;
  user: { email: string; status: UserStatus; createdAt: string };
  department?: { code: string; name: string };
  academicYear?: string;
}

function StudentsContent() {
  const searchParams  = useSearchParams();
  const initialStatus = (searchParams.get('status') as UserStatus | null) ?? 'ALL';

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<UserStatus | 'ALL'>(initialStatus as UserStatus | 'ALL');
  const [search, setSearch]     = useState('');
  const [searchInput, setSearchInput] = useState('');
  const LIMIT = 20;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (activeTab !== 'ALL') params.set('status', activeTab);
    if (search) params.set('search', search);
    api.get(`/admin/students?${params}`)
      .then(r => { setStudents(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [page, activeTab, search]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const onTabChange  = (tab: UserStatus | 'ALL') => { setActiveTab(tab); setPage(1); };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Students" description={`${total} student${total !== 1 ? 's' : ''} registered`} />

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => onTabChange(tab.value)} style={{ padding: '0.375rem 0.875rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.15s', background: activeTab === tab.value ? 'var(--primary)' : 'transparent', color: activeTab === tab.value ? 'white' : 'var(--text-secondary)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '360px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="cc-input"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search name, email, username…"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : students.length === 0 ? (
        <EmptyState icon={<Users size={36} />} title="No students found" message="Try adjusting your filters or search query." />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ width: '3rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                        {s.firstName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.department?.code ?? '—'}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {s.academicYear?.replace(/_YEAR/, '').replace('FIRST','1').replace('SECOND','2').replace('THIRD','3').replace('FOURTH','4') ?? '—'}
                  </td>
                  <td><StatusBadge status={s.user.status} type="user" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <Calendar size={11} />
                      {new Date(s.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/students/${s.id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {total > LIMIT && (
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Page {page} of {Math.ceil(total / LIMIT)}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost" style={{ padding: '0.375rem 0.75rem' }}>Prev</button>
                <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)} className="btn-primary" style={{ padding: '0.375rem 0.75rem' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminStudentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StudentsContent />
    </Suspense>
  );
}
