'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Post } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getMediaUrl } from '@/lib/utils';
import {
  Calendar, Award, FileText, Image as ImageIcon, Video, Download,
  Edit, Send, AlertCircle, CheckCircle, Clock, RefreshCcw
} from 'lucide-react';

const POSITION_LABELS: Record<string, string> = {
  FIRST: '🥇 1st Place', SECOND: '🥈 2nd Place', THIRD: '🥉 3rd Place',
  TOP_5: 'Top 5', TOP_10: 'Top 10', FINALIST: 'Finalist', PARTICIPANT: 'Participant',
};

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'DRAFT',              label: 'Drafted',         icon: <Edit size={14} /> },
    { key: 'PENDING_REVIEW',     label: 'Under Review',    icon: <Clock size={14} /> },
    { key: 'APPROVED',           label: 'Approved',        icon: <CheckCircle size={14} /> },
    { key: 'REVISION_REQUESTED', label: 'Revision Needed', icon: <RefreshCcw size={14} /> },
    { key: 'REJECTED',           label: 'Rejected',        icon: <AlertCircle size={14} /> },
  ];
  const order = ['DRAFT','PENDING_REVIEW','APPROVED'];
  const currentIdx = order.indexOf(status);
  const activeSteps = status === 'REVISION_REQUESTED' || status === 'REJECTED'
    ? steps.filter(s => ['DRAFT','PENDING_REVIEW', status].includes(s.key))
    : steps.filter(s => order.includes(s.key));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {activeSteps.map((s, i) => {
        const done    = status === 'APPROVED' && order.indexOf(s.key) <= 2;
        const current = s.key === status;
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500,
              background: current ? (status === 'APPROVED' ? 'var(--success-bg)' : status === 'REJECTED' ? 'var(--error-bg)' : status === 'REVISION_REQUESTED' ? 'var(--info-bg)' : 'var(--warning-bg)') : done ? 'var(--success-bg)' : 'var(--border-subtle)',
              color: current ? (status === 'APPROVED' ? 'var(--success)' : status === 'REJECTED' ? 'var(--error)' : status === 'REVISION_REQUESTED' ? 'var(--info)' : 'var(--warning)') : done ? 'var(--success)' : 'var(--text-muted)',
              border: `1px solid ${current || done ? 'transparent' : 'var(--border)'}`,
            }}>
              {s.icon} {s.label}
            </div>
            {i < activeSteps.length - 1 && <div style={{ width: '1.5rem', height: '2px', background: done ? 'var(--success)' : 'var(--border)', borderRadius: '1px' }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function AchievementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then(r => setPost(r.data.data)).catch(() => router.push('/student/achievements')).finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const r = await api.post(`/posts/${id}/submit`);
      setPost(r.data.data);
    } catch { /* error */ }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner message="Loading achievement…" />;
  if (!post) return null;

  const canEdit   = ['DRAFT','REVISION_REQUESTED'].includes(post.status);
  const canSubmit = ['DRAFT','REVISION_REQUESTED'].includes(post.status);
  const latestReview = post.reviews?.[0];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px' }}>
      <PageHeader
        title={post.title}
        breadcrumbs={[{ label: 'Achievements', href: '/student/achievements' }, { label: post.title }]}
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canEdit && <Link href={`/student/achievements/${id}/edit`} className="btn-ghost"><Edit size={14} />Edit</Link>}
            {canSubmit && (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                <Send size={14} /> {submitting ? 'Submitting…' : 'Submit for Review'}
              </button>
            )}
          </div>
        }
      />

      {/* Status timeline */}
      <div className="cc-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ marginBottom: '0.875rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
        <StatusTimeline status={post.status} />
      </div>

      {/* Teacher feedback */}
      {latestReview && (
        <div style={{
          marginBottom: '1.25rem', padding: '1.25rem',
          background: post.status === 'APPROVED' ? 'var(--success-bg)' : post.status === 'REJECTED' ? 'var(--error-bg)' : 'var(--info-bg)',
          border: `1px solid ${post.status === 'APPROVED' ? 'var(--success-border)' : post.status === 'REJECTED' ? 'var(--error-border)' : 'var(--info-border)'}`,
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Teacher Feedback</div>
            {post.score !== null && post.score !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: 'var(--primary)' }}>
                <Award size={16} /> Score: {Number(post.score).toFixed(0)}/100
              </div>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{latestReview.feedback}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(latestReview.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="cc-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Achievement Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Date',     value: new Date(post.achievementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Category', value: post.category?.name ?? '—' },
            { label: 'Domain',   value: post.domain?.name ?? '—' },
            { label: 'Position', value: post.position ? POSITION_LABELS[post.position] : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
        <hr className="cc-divider" style={{ marginBottom: '1.25rem' }} />
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{post.description}</p>

        {(post.skills?.length ?? 0) > 0 && (
          <>
            <hr className="cc-divider" style={{ margin: '1.25rem 0' }} />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {post.skills.map((item, idx) => {
                const s = (item as unknown as { skill?: { id: string; name: string }; id?: string; name?: string }).skill ?? item;
                return (
                  <span key={s.id ?? idx} style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500, background: '#F0FDF4', color: '#059669', border: '1px solid #A7F3D0' }}>
                    {s.name}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Evidence */}
      {(post.media?.length ?? 0) > 0 && (
        <div className="cc-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Evidence ({post.media.length} file{post.media.length !== 1 ? 's' : ''})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {post.media.map(m => {
              const isImage = m.fileType.startsWith('image/');
              const isPDF   = m.fileType === 'application/pdf';
              const isVideo = m.fileType.startsWith('video/');
              const url     = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${m.storageKey}`;
              return (
                <div key={m.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--background)' }}>
                  <div style={{ height: '120px', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isImage ? <ImageIcon size={36} color="var(--text-muted)" /> : isPDF ? <FileText size={36} color="var(--error)" /> : <Video size={36} color="var(--info)" />}
                  </div>
                  <div style={{ padding: '0.625rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{m.fileName}</span>
                    <a href={getMediaUrl(m.storageKey)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}><Download size={14} /></a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
