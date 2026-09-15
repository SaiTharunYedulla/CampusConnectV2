'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Post } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import AchievementCard from '@/components/shared/AchievementCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Rss, SlidersHorizontal } from 'lucide-react';

interface FilterState { departmentId: string; categoryId: string; domainId: string; }

export default function FeedPage() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ departmentId: '', categoryId: '', domainId: '' });
  const [showFilters, setShowFilters] = useState(false);
  const LIMIT = 12;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (filters.departmentId) params.set('departmentId', filters.departmentId);
    if (filters.categoryId)   params.set('categoryId',   filters.categoryId);
    if (filters.domainId)     params.set('domainId',     filters.domainId);
    api.get(`/feed?${params}`)
      .then(r => { setPosts(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [page, filters]);

  const applyFilter = (key: keyof FilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Achievement Feed"
        description={`${total} verified achievements from your campus community`}
        action={
          <button className="btn-ghost" onClick={() => setShowFilters(f => !f)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
        }
      />

      {/* Filters */}
      {showFilters && (
        <div className="cc-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="cc-input" value={filters.categoryId} onChange={e => applyFilter('categoryId', e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="">All categories</option>
          </select>
          <select className="cc-input" value={filters.domainId} onChange={e => applyFilter('domainId', e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="">All domains</option>
          </select>
          <button className="btn-ghost" style={{ padding: '0.5rem 0.875rem' }} onClick={() => { setFilters({ departmentId: '', categoryId: '', domainId: '' }); setPage(1); }}>
            Clear filters
          </button>
        </div>
      )}

      {loading ? <LoadingSpinner /> : posts.length === 0 ? (
        <EmptyState
          icon={<Rss size={36} />}
          title="No achievements in the feed yet"
          message="Be the first! Submit an achievement and get it approved by a teacher."
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {posts.map(post => (
              <AchievementCard key={post.id} post={post} showStudent linkHref={`/student/achievements/${post.id}`} />
            ))}
          </div>
          {total > LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost">← Prev</button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                {page} / {Math.ceil(total / LIMIT)}
              </span>
              <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)} className="btn-primary">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
