'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { UserStatus } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { CheckCircle, XCircle, PauseCircle, PlayCircle, FileText, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';

interface StudentDetail {
  id: string; firstName: string; lastName: string; username: string;
  bio?: string; profilePhoto?: string; academicYear?: string;
  user: {
    id: string; email: string; status: UserStatus; createdAt: string;
    verificationDocuments: Array<{ id: string; fileName: string; fileType: string; storageKey: string; documentType: string; signedUrl?: string }>;
  };
  department?: { id: string; code: string; name: string };
}

const STATUS_TRANSITIONS: Record<UserStatus, { to: UserStatus; label: string; icon: React.ReactNode; color: string; bg: string }[]> = {
  PENDING:   [
    { to: 'ACTIVE',    label: 'Approve',  icon: <CheckCircle size={15}/>, color: 'var(--success)', bg: 'var(--success-bg)' },
    { to: 'REJECTED',  label: 'Reject',   icon: <XCircle size={15}/>,    color: 'var(--error)',   bg: 'var(--error-bg)'   },
  ],
  ACTIVE:    [{ to: 'SUSPENDED', label: 'Suspend', icon: <PauseCircle size={15}/>, color: 'var(--warning)', bg: 'var(--warning-bg)' }],
  SUSPENDED: [{ to: 'ACTIVE',   label: 'Reinstate',icon: <PlayCircle  size={15}/>, color: 'var(--success)', bg: 'var(--success-bg)' }],
  REJECTED:  [],
};

export default function AdminStudentDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reason, setReason]   = useState('');
  const [showReason, setShowReason] = useState(false);
  const [pendingTo, setPendingTo]   = useState<UserStatus | null>(null);

  useEffect(() => {
    Promise.all([
      api.get(`/admin/students/${id}`).then(r => r.data.data),
      api.get('/ref/departments').then(r => r.data.data ?? []).catch(() => []),
    ])
      .then(([s, depts]) => {
        setStudent(s);
        setDepartments(depts);
        if (s) {
          setSelectedDept(s.department?.id ?? '');
          setSelectedYear(s.academicYear ?? '');
        }
      })
      .catch(() => router.push('/admin/students'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleStatusChange = async (to: UserStatus) => {
    if (to === 'REJECTED' || to === 'SUSPENDED') { setPendingTo(to); setShowReason(true); return; }
    await doUpdate(to, '');
  };

  const doUpdate = async (to: UserStatus, r: string) => {
    setUpdating(true);
    setShowReason(false);
    try {
      await api.patch(`/admin/students/${id}/status`, { status: to, reason: r || undefined });
      setStudent(prev => prev ? { ...prev, user: { ...prev.user, status: to } } : prev);
    } catch { /* ignore */ }
    finally { setUpdating(false); setPendingTo(null); setReason(''); }
  };

  if (loading) return <LoadingSpinner message="Loading student…" />;
  if (!student) return null;

  const transitions = STATUS_TRANSITIONS[student.user.status] ?? [];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px' }}>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        breadcrumbs={[{ label: 'Students', href: '/admin/students' }, { label: student.firstName }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem' }}>
        {/* Left: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Profile card */}
          <div className="cc-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', border: '2px solid var(--border)' }}>
                {student.profilePhoto ? <img src={student.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : student.firstName[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{student.firstName} {student.lastName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>@{student.username}</div>
                <div style={{ marginTop: '0.375rem' }}><StatusBadge status={student.user.status} type="user" /></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                { label: 'Email',       value: student.user.email },
                { label: 'Department',  value: student.department?.name ?? '—' },
                { label: 'Academic Year', value: student.academicYear?.replace('_YEAR','').replace('FIRST','1st').replace('SECOND','2nd').replace('THIRD','3rd').replace('FOURTH','4th') ?? '—' },
                { label: 'Joined',      value: new Date(student.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem' }}>{value}</div>
                </div>
              ))}
            </div>

            {student.bio && (
              <>
                <hr className="cc-divider" style={{ margin: '1rem 0' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{student.bio}</p>
              </>
            )}
          </div>

          {/* Department & Academic Year Assignment */}
          <div className="cc-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Assign Branch & Academic Year</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>Update the student's department branch and current academic year.</p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setSavingProfile(true);
              setProfileMsg('');
              try {
                const res = await api.patch(`/admin/students/${id}/profile`, {
                  departmentId: selectedDept || null,
                  academicYear: selectedYear || null,
                });
                setStudent(prev => prev ? { ...prev, department: res.data.data?.department, academicYear: res.data.data?.academicYear } : prev);
                setProfileMsg('Branch and Year updated successfully!');
              } catch {
                setProfileMsg('Failed to update details');
              } finally {
                setSavingProfile(false);
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileMsg && (
                <div style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', background: profileMsg.includes('success') ? 'var(--success-bg)' : 'var(--error-bg)', color: profileMsg.includes('success') ? 'var(--success)' : 'var(--error)', border: `1px solid ${profileMsg.includes('success') ? 'var(--success-border)' : 'var(--error-border)'}` }}>
                  {profileMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cc-form-group">
                  <label className="cc-label">Branch / Department</label>
                  <select className="cc-input" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                    <option value="">Select Department / Branch…</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="cc-form-group">
                  <label className="cc-label">Academic Year</label>
                  <select className="cc-input" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    <option value="">Select Academic Year…</option>
                    <option value="FIRST_YEAR">1st Year</option>
                    <option value="SECOND_YEAR">2nd Year</option>
                    <option value="THIRD_YEAR">3rd Year</option>
                    <option value="FOURTH_YEAR">4th Year</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={savingProfile} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                {savingProfile ? <><Loader2 size={14} className="animate-spin" />Saving…</> : 'Save Branch & Year'}
              </button>
            </form>
          </div>

          {/* Verification documents */}
          <div className="cc-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Verification Documents</h2>
            {student.user.verificationDocuments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No documents uploaded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {student.user.verificationDocuments.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--background)' }}>
                    {doc.fileType.startsWith('image/') ? <ImageIcon size={18} color="var(--success)" /> : <FileText size={18} color="var(--primary)" />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.fileName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.documentType}</div>
                    </div>
                    {doc.signedUrl && (
                      <a href={doc.signedUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                        View <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: status actions */}
        <div>
          <div className="cc-card" style={{ padding: '1.25rem', position: 'sticky', top: 'calc(var(--topbar-height) + 1.5rem)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem' }}>Account Status</h3>
            <div style={{ marginBottom: '1.25rem' }}><StatusBadge status={student.user.status} type="user" /></div>

            {transitions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</p>
                {transitions.map(t => (
                  <button key={t.to} onClick={() => handleStatusChange(t.to)} disabled={updating}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: t.bg, border: `1px solid transparent`, borderRadius: 'var(--radius)', color: t.color, fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s', opacity: updating ? 0.6 : 1 }}
                  >
                    {updating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : t.icon} {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Reason input */}
            {showReason && pendingTo && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Reason (optional)</label>
                <textarea className="cc-input" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide a reason…" style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.8125rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-ghost" onClick={() => { setShowReason(false); setPendingTo(null); }} style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', padding: '0.375rem' }}>Cancel</button>
                  <button className="btn-primary" onClick={() => doUpdate(pendingTo, reason)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', padding: '0.375rem', background: pendingTo === 'REJECTED' ? 'var(--error)' : 'var(--warning)', border: 'none' }}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
