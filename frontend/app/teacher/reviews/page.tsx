'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Post } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { ClipboardList, Calendar, ChevronRight, User } from 'lucide-react';

export default function TeacherReviewsPage() {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    setLoading(true);
    api.get(`/teacher/reviews/pending?page=${page}&limit=${LIMIT}`)
      .then(r => { setPosts(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Review Queue"
        description={`${total} achievement${total !== 1 ? 's' : ''} awaiting your review`}
      />

      {loading ? <LoadingSpinner /> : posts.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={36} />}
          title="No pending reviews"
          message="All submissions have been reviewed. Check back later."
        />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Student</th>
                <th>Submitted</th>
                <th style={{ width: '3rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{post.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {post.category?.name} {post.domain ? `· ${post.domain.name}` : ''}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                        {post.student?.firstName?.[0]?.toUpperCase() ?? <User size={12} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{post.student?.firstName} {post.student?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(post.student as { department?: { code?: string } })?.department?.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      <Calendar size={12} />
                      {new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <Link href={`/teacher/reviews/${post.id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
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
