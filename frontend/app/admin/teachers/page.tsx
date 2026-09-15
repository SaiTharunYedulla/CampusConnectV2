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
  { label: 'All',      value: 'ALL'      },
  { label: 'Pending',  value: 'PENDING'  },
  { label: 'Active',   value: 'ACTIVE'   },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Suspended',value: 'SUSPENDED'},
];

interface TeacherRow {
  id: string; firstName: string; lastName: string; username: string;
  designation?: string; employeeId?: string;
  user: { email: string; status: UserStatus; createdAt: string };
  department?: { code: string; name: string };
}

function TeachersContent() {
  const searchParams  = useSearchParams();
  const initialStatus = (searchParams.get('status') as UserStatus | null) ?? 'ALL';

  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
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
    api.get(`/admin/teachers?${params}`)
      .then(r => { setTeachers(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [page, activeTab, search]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Teachers" description={`${total} teacher${total !== 1 ? 's' : ''} registered`} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => { setActiveTab(tab.value); setPage(1); }} style={{ padding: '0.375rem 0.875rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.15s', background: activeTab === tab.value ? 'var(--primary)' : 'transparent', color: activeTab === tab.value ? 'white' : 'var(--text-secondary)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '360px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="cc-input" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search by name or email…" style={{ paddingLeft: '2.25rem' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Search</button>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : teachers.length === 0 ? (
        <EmptyState icon={<Users size={36} />} title="No teachers found" message="Try adjusting your filters." />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ width: '3rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#059669', flexShrink: 0 }}>
                        {t.firstName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t.firstName} {t.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.designation ?? '—'}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.department?.code ?? '—'}</td>
                  <td><StatusBadge status={t.user.status} type="user" /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <Calendar size={11} />
                      {new Date(t.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/teachers/${t.id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
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

export default function AdminTeachersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TeachersContent />
    </Suspense>
  );
}
