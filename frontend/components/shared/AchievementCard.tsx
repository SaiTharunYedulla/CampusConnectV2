'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import StatusBadge from './StatusBadge';
import { ThumbsUp, Calendar, Award, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';

const POSITION_LABELS: Record<string, string> = {
  FIRST: '🥇 1st Place', SECOND: '🥈 2nd Place', THIRD: '🥉 3rd Place',
  TOP_5: 'Top 5', TOP_10: 'Top 10', FINALIST: 'Finalist', PARTICIPANT: 'Participant',
};

interface AchievementCardProps {
  post:        Post;
  showStudent?: boolean;
  linkHref?:   string;
}

export default function AchievementCard({ post, showStudent = true, linkHref }: AchievementCardProps) {
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount ?? 0);
  const [hasUpvoted, setHasUpvoted]   = useState(post.hasUpvoted ?? false);
  const [upvoting, setUpvoting]       = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (upvoting) return;
    setUpvoting(true);
    try {
      if (hasUpvoted) {
        await api.delete(`/posts/${post.id}/upvote`);
        setUpvoteCount((c) => c - 1);
        setHasUpvoted(false);
      } else {
        await api.post(`/posts/${post.id}/upvote`);
        setUpvoteCount((c) => c + 1);
        setHasUpvoted(true);
      }
    } catch { /* ignore */ }
    finally { setUpvoting(false); }
  };

  const formattedDate = new Date(post.achievementDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const card = (
    <div className="achievement-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
            {post.status && <StatusBadge status={post.status} type="post" />}
            {post.position && (
              <span style={{
                fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem',
                background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                border: '1px solid #FCD34D', borderRadius: '9999px', color: '#92400E',
              }}>
                {POSITION_LABELS[post.position] ?? post.position}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </h3>
          {post.score !== undefined && post.score !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={13} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>
                Score: {Number(post.score).toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Student info */}
      {showStudent && post.student && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '1.875rem', height: '1.875rem', borderRadius: '50%',
            background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {post.student.profilePhoto
              ? <img src={post.student.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (post.student.firstName?.[0] ?? '?').toUpperCase()
            }
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {post.student.firstName} {post.student.lastName}
            </span>
            {post.student.department && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.375rem' }}>
                · {post.student.department.code}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {post.category && (
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 500, border: '1px solid rgba(79,70,229,0.15)' }}>
            {post.category.name}
          </span>
        )}
        {post.domain && (
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 500, border: '1px solid var(--border)' }}>
            {post.domain.name}
          </span>
        )}
        {(post.skills ?? []).slice(0, 3).map((item, idx) => {
          const s = (item as unknown as { skill?: { id: string; name: string }; id?: string; name?: string }).skill ?? item;
          return (
            <span key={s.id ?? idx} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: '#F0FDF4', color: '#059669', fontWeight: 500, border: '1px solid #A7F3D0' }}>
              {s.name}
            </span>
          );
        })}
        {(post.skills?.length ?? 0) > 3 && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            +{(post.skills?.length ?? 0) - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Calendar size={12} />
          {formattedDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {post.mediaCount !== undefined && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.mediaCount} file{post.mediaCount !== 1 ? 's' : ''}</span>
          )}
          <button
            onClick={handleUpvote}
            disabled={upvoting}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: hasUpvoted ? 'var(--primary-light)' : 'none',
              border: `1px solid ${hasUpvoted ? 'rgba(79,70,229,0.25)' : 'var(--border)'}`,
              color: hasUpvoted ? 'var(--primary)' : 'var(--text-muted)',
              borderRadius: '9999px', padding: '0.25rem 0.625rem',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500,
              transition: 'all 0.15s', opacity: upvoting ? 0.6 : 1,
            }}
            aria-label={hasUpvoted ? 'Remove upvote' : 'Upvote'}
          >
            <ThumbsUp size={12} fill={hasUpvoted ? 'currentColor' : 'none'} />
            {upvoteCount}
          </button>
        </div>
      </div>
    </div>
  );

  return linkHref ? (
    <Link href={linkHref} style={{ textDecoration: 'none', display: 'block' }}>
      {card}
    </Link>
  ) : card;
}
