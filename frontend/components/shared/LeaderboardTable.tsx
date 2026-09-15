import { LeaderboardEntry } from '@/types';

const MEDAL = ['🥇', '🥈', '🥉'];

interface LeaderboardTableProps {
  entries:           LeaderboardEntry[];
  currentStudentId?: string;
}

export default function LeaderboardTable({ entries, currentStudentId }: LeaderboardTableProps) {
  if (!entries.length) return (
    <div className="cc-empty">
      <p className="cc-empty-title">No leaderboard data yet</p>
      <p className="cc-empty-desc">Submit and get achievements approved to appear here.</p>
    </div>
  );

  return (
    <div className="cc-card" style={{ overflow: 'hidden' }}>
      <table className="cc-table">
        <thead>
          <tr>
            <th style={{ width: '4rem' }}>Rank</th>
            <th>Student</th>
            <th>Department</th>
            <th style={{ textAlign: 'right' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isCurrent = entry.id === currentStudentId;
            const medal     = MEDAL[entry.rank - 1];
            return (
              <tr key={entry.id} style={{
                background: isCurrent ? 'var(--primary-light)' : undefined,
                fontWeight: isCurrent ? 600 : undefined,
              }}>
                <td style={{ textAlign: 'center' }}>
                  {medal ? (
                    <span style={{ fontSize: '1.125rem' }}>{medal}</span>
                  ) : (
                    <span className={
                      entry.rank === 1 ? 'rank-gold' :
                      entry.rank === 2 ? 'rank-silver' :
                      entry.rank === 3 ? 'rank-bronze' : ''
                    } style={{ fontWeight: 600 }}>
                      #{entry.rank}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%',
                      background: isCurrent ? 'var(--primary)' : 'var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700,
                      color: isCurrent ? 'white' : 'var(--text-secondary)',
                      flexShrink: 0, overflow: 'hidden',
                    }}>
                      {entry.profilePhoto
                        ? <img src={entry.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : entry.firstName[0].toUpperCase()
                      }
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem' }}>
                        {entry.firstName} {entry.lastName}
                        {isCurrent && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', marginLeft: '0.375rem', fontWeight: 600 }}>(You)</span>}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {entry.department?.code ?? '—'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{
                    fontWeight: 700, fontSize: '0.9375rem',
                    color: entry.rank <= 3 ? 'var(--primary)' : 'var(--text-primary)',
                  }}>
                    {entry.totalScore.toFixed(0)}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>pts</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
