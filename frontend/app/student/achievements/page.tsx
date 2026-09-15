'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Post, PostStatus } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Plus, Trophy, Calendar, Award, ChevronRight } from 'lucide-react';

const STATUS_TABS: { label: string; value: PostStatus | 'ALL' }[] = [
  { label: 'All',                value: 'ALL' },
  { label: 'Draft',              value: 'DRAFT' },
  { label: 'Pending Review',     value: 'PENDING_REVIEW' },
  { label: 'Approved',           value: 'APPROVED' },
  { label: 'Revision Requested', value: 'REVISION_REQUESTED' },
  { label: 'Rejected',           value: 'REJECTED' },
];

const POSITION_SHORT: Record<string, string> = {
  FIRST: '🥇', SECOND: '🥈', THIRD: '🥉', TOP_5: 'T5', TOP_10: 'T10', FINALIST: 'F', PARTICIPANT: 'P',
};

export default function AchievementsPage() {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostStatus | 'ALL'>('ALL');
  const [page, setPage]       = useState(1);
  const LIMIT = 20;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (activeTab !== 'ALL') params.set('status', activeTab);
    api.get(`/posts/my?${params}`)
      .then((r) => { setPosts(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  const onTabChange = (tab: PostStatus | 'ALL') => { setActiveTab(tab); setPage(1); };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Achievements"
        description={`${total} total achievement${total !== 1 ? 's' : ''}`}
        action={
          <Link href="/student/achievements/new" className="btn-primary">
            <Plus size={15} /> New Achievement
          </Link>
        }
      />

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem', width: 'fit-content' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: '0.375rem',
              border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500,
              background: activeTab === tab.value ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.value ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : posts.length === 0 ? (
        <EmptyState
          icon={<Trophy size={36} />}
          title="No achievements found"
          message={activeTab === 'ALL' ? 'Start by submitting your first achievement.' : `No ${activeTab.replace(/_/g, ' ').toLowerCase()} achievements.`}
          action={activeTab === 'ALL' && <Link href="/student/achievements/new" className="btn-primary"><Plus size={14} />New Achievement</Link>}
        />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th style={{ width: '3rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {post.position && (
                        <span style={{ fontSize: '1rem' }}>{POSITION_SHORT[post.position]}</span>
                      )}
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{post.title}</div>
                        {post.domain && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.domain.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    {post.category?.name ?? '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      <Calendar size={12} />
                      {new Date(post.achievementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td><StatusBadge status={post.status} type="post" /></td>
                  <td style={{ textAlign: 'right' }}>
                    {post.score !== undefined && post.score !== null ? (
                      <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                        <Award size={12} />{Number(post.score).toFixed(0)}
                      </span>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <Link href={`/student/achievements/${post.id}`} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Page {page} of {Math.ceil(total / LIMIT)}
              </span>
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
