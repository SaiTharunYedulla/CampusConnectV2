'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { DepartmentFull } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Building2, Plus, Pencil, ToggleLeft, ToggleRight, Loader2, Check, X } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [depts, setDepts]     = useState<DepartmentFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode]   = useState('');
  const [editName, setEditName]   = useState('');
  const [saving, setSaving]       = useState(false);
  // New dept form
  const [showNew, setShowNew]   = useState(false);
  const [newCode, setNewCode]   = useState('');
  const [newName, setNewName]   = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError]       = useState('');

  const loadDepts = () => {
    api.get('/admin/departments').then(r => setDepts(r.data.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { loadDepts(); }, []);

  const handleToggle = async (id: string) => {
    setToggling(id);
    try { const r = await api.patch(`/admin/departments/${id}/status`); setDepts(prev => prev.map(d => d.id === id ? r.data.data : d)); }
    catch { /* ignore */ }
    finally { setToggling(null); }
  };

  const startEdit = (d: DepartmentFull) => { setEditingId(d.id); setEditCode(d.code); setEditName(d.name); };
  const cancelEdit = () => { setEditingId(null); setEditCode(''); setEditName(''); };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      const r = await api.patch(`/admin/departments/${id}`, { code: editCode.toUpperCase(), name: editName });
      setDepts(prev => prev.map(d => d.id === id ? r.data.data : d));
      cancelEdit();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newCode.trim() || !newName.trim()) { setError('Both code and name are required'); return; }
    setCreating(true);
    try {
      const r = await api.post('/admin/departments', { code: newCode.toUpperCase(), name: newName });
      setDepts(prev => [...prev, r.data.data]);
      setNewCode(''); setNewName(''); setShowNew(false);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to create department');
    } finally { setCreating(false); }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px' }}>
      <PageHeader
        title="Departments"
        description={`${depts.length} department${depts.length !== 1 ? 's' : ''} configured`}
        action={
          <button className="btn-primary" onClick={() => setShowNew(v => !v)}>
            <Plus size={15} /> New Department
          </button>
        }
      />

      {/* New department form */}
      {showNew && (
        <form onSubmit={handleCreate} className="cc-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Add New Department</h3>
          {error && <p style={{ color: 'var(--error)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{error}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div className="cc-form-group">
              <label className="cc-label">Code</label>
              <input className="cc-input" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="CSE" maxLength={10} />
            </div>
            <div className="cc-form-group">
              <label className="cc-label">Department Name</label>
              <input className="cc-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Computer Science & Engineering" />
            </div>
            <button type="submit" className="btn-primary" disabled={creating} style={{ height: '38px', alignSelf: 'flex-end' }}>
              {creating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Add'}
            </button>
          </div>
        </form>
      )}

      {loading ? <LoadingSpinner /> : depts.length === 0 ? (
        <EmptyState icon={<Building2 size={36} />} title="No departments yet" message="Create your first department above." />
      ) : (
        <div className="cc-card" style={{ overflow: 'hidden' }}>
          <table className="cc-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Code</th>
                <th>Name</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {depts.map(dept => (
                <tr key={dept.id}>
                  <td>
                    {editingId === dept.id ? (
                      <input className="cc-input" value={editCode} onChange={e => setEditCode(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.8125rem', width: '70px' }} maxLength={10} />
                    ) : (
                      <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--primary)' }}>{dept.code}</span>
                    )}
                  </td>
                  <td>
                    {editingId === dept.id ? (
                      <input className="cc-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '0.375rem 0.5rem', fontSize: '0.8125rem' }} />
                    ) : (
                      <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{dept.name}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, background: dept.isActive ? 'var(--success-bg)' : 'var(--border-subtle)', color: dept.isActive ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${dept.isActive ? 'var(--success-border)' : 'var(--border)'}` }}>
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                      {editingId === dept.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(dept.id)} disabled={saving} style={{ display: 'flex', alignItems: 'center', padding: '0.375rem', borderRadius: '0.375rem', background: 'var(--success-bg)', border: 'none', color: 'var(--success)', cursor: 'pointer' }}>
                            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={13} />}
                          </button>
                          <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', padding: '0.375rem', borderRadius: '0.375rem', background: 'var(--error-bg)', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(dept)} title="Edit" style={{ display: 'flex', alignItems: 'center', padding: '0.375rem', borderRadius: '0.375rem', background: 'var(--border-subtle)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleToggle(dept.id)} disabled={toggling === dept.id} title={dept.isActive ? 'Deactivate' : 'Activate'} style={{ display: 'flex', alignItems: 'center', padding: '0.375rem', borderRadius: '0.375rem', background: dept.isActive ? 'var(--warning-bg)' : 'var(--success-bg)', border: 'none', color: dept.isActive ? 'var(--warning)' : 'var(--success)', cursor: 'pointer' }}>
                            {toggling === dept.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : dept.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
