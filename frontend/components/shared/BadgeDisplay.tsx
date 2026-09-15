import { Badge } from '@/types';

interface BadgeDisplayProps {
  badges:  Badge[];
  compact?: boolean;
}

export default function BadgeDisplay({ badges, compact = false }: BadgeDisplayProps) {
  if (!badges.length) return (
    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      No badges earned yet. Keep going! 🚀
    </div>
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? '0.5rem' : '0.75rem' }}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          title={`${badge.name}: ${badge.description}`}
          style={{
            display: 'flex', alignItems: 'center', gap: compact ? '0.375rem' : '0.5rem',
            padding: compact ? '0.375rem 0.625rem' : '0.625rem 0.875rem',
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '1px solid #FDE68A',
            borderRadius: '9999px',
            cursor: 'default',
          }}
        >
          <span style={{ fontSize: compact ? '0.875rem' : '1rem' }}>{badge.icon}</span>
          {!compact && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400E', lineHeight: 1.2 }}>
                {badge.name}
              </div>
              {badge.earnedAt && (
                <div style={{ fontSize: '0.68rem', color: '#B45309' }}>
                  {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
