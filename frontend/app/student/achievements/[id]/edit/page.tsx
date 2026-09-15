'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getMediaUrl } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, Loader2, Upload, X, FileText, Image as ImageIcon
} from 'lucide-react';

const POSITIONS = ['FIRST', 'SECOND', 'THIRD', 'TOP_5', 'TOP_10', 'FINALIST', 'PARTICIPANT'];

const editSchema = z.object({
  title:           z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:     z.string().min(10, 'Description must be at least 10 characters').max(5000),
  categoryId:      z.string().optional(),
  domainId:        z.string().optional(),
  achievementDate: z.string().min(1, 'Date is required'),
  position:        z.string().optional(),
});
type EditForm = z.infer<typeof editSchema>;

interface Category { id: string; name: string; }
interface Domain   { id: string; name: string; }
interface Skill    { id: string; name: string; }

export default function EditAchievementPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();

  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [domains, setDomains]       = useState<Domain[]>([]);
  const [skills, setSkills]         = useState<Skill[]>([]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [existingMedia, setExistingMedia]   = useState<Array<{ id: string; fileName: string; fileType: string; storageKey: string }>>([]);
  const [newFiles, setNewFiles]             = useState<File[]>([]);
  const [dragOver, setDragOver]             = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes, domRes, skillRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get('/ref/categories').catch(() => ({ data: { data: [] } })),
          api.get('/ref/domains').catch(() => ({ data: { data: [] } })),
          api.get('/ref/skills').catch(() => ({ data: { data: [] } })),
        ]);

        const post = postRes.data.data;
        if (!['DRAFT', 'REVISION_REQUESTED'].includes(post.status)) {
          router.push(`/student/achievements/${id}`);
          return;
        }

        if (catRes.data?.data)   setCategories(catRes.data.data);
        if (domRes.data?.data)   setDomains(domRes.data.data);
        if (skillRes.data?.data) setSkills(skillRes.data.data);

        // Pre-fill form values
        reset({
          title:           post.title,
          description:     post.description,
          categoryId:      post.categoryId ?? '',
          domainId:        post.domainId ?? '',
          achievementDate: post.achievementDate ? new Date(post.achievementDate).toISOString().split('T')[0] : '',
          position:        post.position ?? '',
        });

        // Pre-fill skills
        const postSkills = (post.skills ?? []).map((s: { skill?: { id: string; name: string }; id?: string; name?: string }) => {
          const item = s.skill ?? s;
          return item.id ?? item.name;
        }).filter(Boolean);
        setSelectedSkills(postSkills);

        // Pre-fill existing media
        setExistingMedia(post.media ?? []);
      } catch {
        router.push('/student/achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset, router]);

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    const existing = skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!selectedSkills.includes(existing.id)) {
        setSelectedSkills(prev => prev.length < 10 ? [...prev, existing.id] : prev);
      }
    } else {
      setSkills(prev => [...prev, { id: trimmed, name: trimmed }]);
      setSelectedSkills(prev => prev.length < 10 ? [...prev, trimmed] : prev);
    }
    setCustomSkillInput('');
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await api.delete(`/posts/${id}/media/${mediaId}`);
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch {
      setError('Failed to remove media file');
    }
  };

  const onSubmit = async (data: EditForm) => {
    setSubmitting(true);
    setError('');
    try {
      // Update post details & skills
      await api.patch(`/posts/${id}`, {
        title:           data.title,
        description:     data.description,
        achievementDate: data.achievementDate,
        categoryId:      data.categoryId || null,
        domainId:        data.domainId || null,
        position:        data.position || null,
        skillIds:        selectedSkills,
      });

      // Upload new evidence files if any
      if (newFiles.length > 0) {
        const fd = new FormData();
        newFiles.forEach(f => fd.append('evidence', f));
        await api.post(`/posts/${id}/media`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      router.push(`/student/achievements/${id}`);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading achievement for editing…" />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px' }}>
      <PageHeader
        title="Edit Achievement"
        breadcrumbs={[
          { label: 'Achievements', href: '/student/achievements' },
          { label: 'Detail', href: `/student/achievements/${id}` },
          { label: 'Edit' }
        ]}
      />

      <div className="cc-card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="cc-form-group">
            <label className="cc-label">Title *</label>
            <input className="cc-input" placeholder="e.g. AI Hackathon 2026 — 1st Place" {...register('title')} />
            {errors.title && <span className="cc-form-error">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="cc-form-group">
            <label className="cc-label">Description *</label>
            <textarea className="cc-input" rows={4} placeholder="Describe what you achieved…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...register('description')} />
            {errors.description && <span className="cc-form-error">{errors.description.message}</span>}
          </div>

          {/* Category & Domain */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="cc-form-group">
              <label className="cc-label">Category</label>
              <select className="cc-input" {...register('categoryId')}>
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="cc-form-group">
              <label className="cc-label">Domain</label>
              <select className="cc-input" {...register('domainId')}>
                <option value="">Select domain…</option>
                {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {/* Date & Position */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="cc-form-group">
              <label className="cc-label">Achievement Date *</label>
              <input type="date" className="cc-input" {...register('achievementDate')} />
              {errors.achievementDate && <span className="cc-form-error">{errors.achievementDate.message}</span>}
            </div>
            <div className="cc-form-group">
              <label className="cc-label">Position / Result</label>
              <select className="cc-input" {...register('position')}>
                <option value="">Select position…</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p.replace(/_/g,' ')}</option>)}
              </select>
            </div>
          </div>

          <hr className="cc-divider" />

          {/* Skills Selection */}
          <div>
            <label className="cc-label" style={{ marginBottom: '0.375rem', display: 'block' }}>Relevant Skills (Up to 10)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <input
                className="cc-input"
                placeholder="Can't find a skill? Type custom skill name…"
                value={customSkillInput}
                onChange={e => setCustomSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={handleAddCustomSkill}
                style={{ border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
              >
                + Add Skill
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {skills.map(s => {
                const selected = selectedSkills.includes(s.id) || selectedSkills.includes(s.name);
                return (
                  <button key={s.id} type="button"
                    onClick={() => setSelectedSkills(prev => selected ? prev.filter(id => id !== s.id && id !== s.name) : prev.length < 10 ? [...prev, s.id] : prev)}
                    style={{
                      padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.12s',
                      background: selected ? 'var(--primary)' : 'var(--surface)',
                      color: selected ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >{s.name}</button>
                );
              })}
            </div>
          </div>

          <hr className="cc-divider" />

          {/* Evidence section */}
          <div>
            <label className="cc-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Evidence Files</label>

            {/* Existing media */}
            {existingMedia.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '0.5rem', background: 'var(--surface)' }}>
                {m.fileType.startsWith('image/') ? <ImageIcon size={18} color="var(--success)" /> : <FileText size={18} color="var(--primary)" />}
                <span style={{ flex: 1, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.fileName}</span>
                <button type="button" onClick={() => handleDeleteMedia(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>
            ))}

            {/* Upload new evidence */}
            {existingMedia.length + newFiles.length < 5 && (
              <div
                className={`cc-dropzone ${dragOver ? 'active' : ''}`}
                style={{ marginTop: '0.5rem' }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setDragOver(false);
                  const allowed = ['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm'];
                  const valid = Array.from(e.dataTransfer.files).filter(f => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024);
                  setNewFiles(prev => [...prev, ...valid].slice(0, 5 - existingMedia.length));
                }}
                onClick={() => document.getElementById('edit-evidence-input')?.click()}
              >
                <Upload size={24} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem', display: 'block', opacity: 0.7 }} />
                <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                  Add more evidence files (Images, PDF, Video)
                </p>
                <input id="edit-evidence-input" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4,.webm" style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files) {
                      const allowed = ['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm'];
                      const valid = Array.from(e.target.files).filter(f => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024);
                      setNewFiles(prev => [...prev, ...valid].slice(0, 5 - existingMedia.length));
                    }
                  }} />
              </div>
            )}

            {newFiles.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '0.5rem', background: 'var(--surface)' }}>
                {f.type === 'application/pdf' ? <FileText size={18} color="var(--primary)" /> : <ImageIcon size={18} color="var(--success)" />}
                <span style={{ flex: 1, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name} (New)</span>
                <button type="button" onClick={() => setNewFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn-ghost" onClick={() => router.push(`/student/achievements/${id}`)}>
              <ChevronLeft size={14} /> Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ minWidth: '130px', justifyContent: 'center' }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" />Saving…</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
