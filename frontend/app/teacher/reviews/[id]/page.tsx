'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { Post } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getMediaUrl } from '@/lib/utils';
import { CheckCircle, XCircle, RefreshCcw, Loader2, FileText, Image as ImageIcon, Download, Award } from 'lucide-react';

const reviewSchema = z.object({
  action:   z.enum(['APPROVED','REJECTED','REVISION_REQUESTED']),
  score:    z.coerce.number().min(0).max(100).optional(),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
}).refine(d => d.action !== 'APPROVED' || (d.score !== undefined && d.score !== null), {
  message: 'Score is required when approving', path: ['score'],
});
type ReviewForm = z.infer<typeof reviewSchema>;

const ACTIONS = [
  { value: 'APPROVED',            label: 'Approve',          icon: <CheckCircle  size={16}/>, color: 'var(--success)' },
  { value: 'REVISION_REQUESTED',  label: 'Request Revision', icon: <RefreshCcw   size={16}/>, color: 'var(--warning)' },
  { value: 'REJECTED',            label: 'Reject',           icon: <XCircle      size={16}/>, color: 'var(--error)'   },
];

const POSITION_LABELS: Record<string, string> = {
  FIRST: '🥇 1st', SECOND: '🥈 2nd', THIRD: '🥉 3rd', TOP_5: 'Top 5', TOP_10: 'Top 10', FINALIST: 'Finalist', PARTICIPANT: 'Participant',
};

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { action: 'APPROVED' },
  });
  const selectedAction = watch('action');

  useEffect(() => {
    api.get(`/teacher/posts/${id}`).then(r => setPost(r.data.data)).catch(() => router.push('/teacher/reviews')).finally(() => setLoading(false));
  }, [id, router]);

  const onSubmit = async (data: ReviewForm) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/posts/${id}/review`, { action: data.action, feedback: data.feedback, ...(data.action === 'APPROVED' && { score: data.score }) });
      router.push('/teacher/reviews');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Review submission failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner message="Loading submission…" />;
  if (!post) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Review Submission"
        breadcrumbs={[{ label: 'Review Queue', href: '/teacher/reviews' }, { label: 'Review' }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
        {/* Left: Post details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Student info */}
          <div className="cc-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden' }}>
                {post.student?.profilePhoto
                  ? <img src={post.student.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : post.student?.firstName?.[0]?.toUpperCase()
                }
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{post.student?.firstName} {post.student?.lastName}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {(post.student as { department?: { code?: string; name?: string } })?.department?.name} · Year {(post.student as { academicYear?: string })?.academicYear?.replace(/_YEAR/,'').replace('FIRST','1').replace('SECOND','2').replace('THIRD','3').replace('FOURTH','4')}
                </div>
              </div>
            </div>
          </div>

          {/* Achievement details */}
          <div className="cc-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.0625rem', marginBottom: '1rem' }}>{post.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Date',     value: new Date(post.achievementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Category', value: post.category?.name ?? '—' },
                { label: 'Domain',   value: post.domain?.name ?? '—' },
                { label: 'Position', value: post.position ? POSITION_LABELS[post.position] : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <hr className="cc-divider" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.description}</p>

            {(post.skills?.length ?? 0) > 0 && (
              <>
                <hr className="cc-divider" style={{ margin: '1.25rem 0' }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {post.skills.map((item, idx) => {
                    const s = (item as unknown as { skill?: { id: string; name: string }; id?: string; name?: string }).skill ?? item;
                    return (
                      <span key={s.id ?? idx} style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500, background: '#F0FDF4', color: '#059669', border: '1px solid #A7F3D0' }}>{s.name}</span>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {post.media.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--background)' }}>
                    {m.fileType.startsWith('image/') ? <ImageIcon size={16} color="var(--success)" /> : <FileText size={16} color="var(--primary)" />}
                    <span style={{ flex: 1, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.fileName}</span>
                    <a href={getMediaUrl(m.storageKey)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'flex' }}><Download size={14} /></a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Review form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="cc-card" style={{ padding: '1.5rem', position: 'sticky', top: 'calc(var(--topbar-height) + 1.5rem)' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Submit Review</h2>

            {error && (
              <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{error}</p>
              </div>
            )}

            {/* Action selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <label className="cc-label">Decision *</label>
              {ACTIONS.map(action => (
                <label key={action.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: `1px solid ${selectedAction === action.value ? action.color : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', background: selectedAction === action.value ? `${action.color}0a` : 'var(--surface)', transition: 'all 0.15s' }}>
                  <input type="radio" value={action.value} {...register('action')} style={{ display: 'none' }} />
                  <span style={{ color: selectedAction === action.value ? action.color : 'var(--text-muted)' }}>{action.icon}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem', color: selectedAction === action.value ? action.color : 'var(--text-primary)' }}>{action.label}</span>
                </label>
              ))}
            </div>

            {/* Score (only for APPROVED) */}
            {selectedAction === 'APPROVED' && (
              <div className="cc-form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="cc-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Award size={14} color="var(--primary)" /> Score (0–100) *
                </label>
                <input type="number" min={0} max={100} className="cc-input" placeholder="e.g. 85" {...register('score')} />
                {errors.score && <span className="cc-form-error">{errors.score.message}</span>}
              </div>
            )}

            {/* Feedback */}
            <div className="cc-form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="cc-label">Feedback / Comments *</label>
              <textarea className="cc-input" rows={5} placeholder="Provide constructive feedback for the student…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...register('feedback')} />
              {errors.feedback && <span className="cc-form-error">{errors.feedback.message}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
