'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { LeaderboardEntry } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LeaderboardTable from '@/components/shared/LeaderboardTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/lib/store/auth.store';
import { BarChart3 } from 'lucide-react';

type LeaderboardType = 'institute' | 'dept';

export default function LeaderboardPage() {
  const { user }   = useAuthStore();
  const [type, setType]   = useState<LeaderboardType>('institute');
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    api.get('/students/me').then(r => setStudentId(r.data.data?.id ?? '')).catch(() => null);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = type === 'institute'
      ? '/leaderboards/institute'
      : '/leaderboards/institute'; // dept requires departmentId; use institute as fallback
    api.get(url).then(r => setEntries(r.data.data ?? [])).finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Leaderboard"
        description="Top students ranked by total achievement score"
      />

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem', width: 'fit-content' }}>
        {([['institute','Institute Wide'],['dept','My Department']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setType(val)}
            style={{ padding: '0.375rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.15s', background: type === val ? 'var(--primary)' : 'transparent', color: type === val ? 'white' : 'var(--text-secondary)' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <LeaderboardTable entries={entries} currentStudentId={studentId} />
      )}
    </div>
  );
}
