'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { History, Calendar, Award, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

interface ReviewRecord {
  id:        string;
  action:    'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  score?:    number;
  feedback?: string;
  createdAt: string;
  post: {
    id:    string;
    title: string;
    student: { firstName: string; lastName: string };
  };
}

const ACTION_CONFIG = {
  APPROVED:           { label: 'Approved',          icon: <CheckCircle  size={14}/>, color: 'var(--success)' },
  REJECTED:           { label: 'Rejected',          icon: <XCircle      size={14}/>, color: 'var(--error)'   },
  REVISION_REQUESTED: { label: 'Revision Requested',icon: <RefreshCcw   size={14}/>, color: 'var(--warning)' },
};

export default function TeacherHistoryPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    setLoading(true);
    api.get(`/teacher/reviews/history?page=${page}&limit=${LIMIT}`)
      .then(r => { setReviews(r.data.data ?? []); setTotal(r.data.pagination?.total ?? 0); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Review History"
        description={`${total} review${total !== 1 ? 's' : ''} submitted`}
      />

      {loading ? <LoadingSpinner /> : reviews.length === 0 ? (
        <EmptyState
          icon={<History size={36} />}
          title="No review history yet"
          message="Once you review submissions, your history will appear here."
        />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Student</th>
                <th>Decision</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => {
                const cfg = ACTION_CONFIG[r.action];
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{r.post.title}</div>
                      {r.feedback && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                          {r.feedback}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {r.post.student.firstName} {r.post.student.lastName}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: cfg.color, fontWeight: 500, fontSize: '0.8125rem' }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {r.score !== undefined && r.score !== null ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem' }}>
                          <Award size={12} />{Number(r.score).toFixed(0)}
                        </span>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        <Calendar size={12} />
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
