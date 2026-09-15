'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { CheckCircle2, Upload, X, FileText, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const POSITIONS = ['FIRST','SECOND','THIRD','TOP_5','TOP_10','FINALIST','PARTICIPANT'];

const step1Schema = z.object({
  title:           z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:     z.string().min(10, 'Description must be at least 10 characters').max(5000),
  categoryId:      z.string().optional(),
  domainId:        z.string().optional(),
  achievementDate: z.string().min(1, 'Date is required'),
  position:        z.string().optional(),
});
type Step1Form = z.infer<typeof step1Schema>;

interface Category { id: string; name: string; }
interface Domain   { id: string; name: string; }
interface Skill    { id: string; name: string; }

const STEPS = ['Details','Skills','Evidence','Review'];

export default function NewAchievementPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [domains, setDomains]       = useState<Domain[]>([]);
  const [skills, setSkills]         = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [files, setFiles]   = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [postId, setPostId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    // Check if already in skills array or selected
    const existing = skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!selectedSkills.includes(existing.id)) {
        setSelectedSkills(prev => prev.length < 10 ? [...prev, existing.id] : prev);
      }
    } else {
      const newSkill = { id: trimmed, name: trimmed };
      setSkills(prev => [...prev, newSkill]);
      setSelectedSkills(prev => prev.length < 10 ? [...prev, trimmed] : prev);
    }
    setCustomSkillInput('');
  };

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  useEffect(() => {
    Promise.all([
      api.get('/admin/departments').catch(() => ({ data: { data: [] } })),
    ]);
    api.get('/feed?limit=1').catch(() => null); // warm up

    // Fetch ref data
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/departments`),
    ]).catch(() => null);

    // Actually fetch via api
    const token = document.cookie; // not needed, axios handles it
    Promise.all([
      api.get('/admin/departments'),
    ]).catch(() => null);

    // simpler: just call these
    api.get('/admin/departments').then(r => {
      // departments not directly needed for form; categories/domains from admin endpoints
    }).catch(() => null);
  }, []);

  useEffect(() => {
    // Fetch categories, domains, skills via a workaround since no dedicated public endpoint
    // We'll get them from the admin endpoints (admin can see all)
    // For students, categories/domains are included in post creation
    // Let's use direct fetch with auth
    Promise.all([
      api.get('/admin/departments'),
    ]).catch(() => null);

    // Fetch categories + domains from posts or static — add endpoints to backend
    // For now we'll hard-code from seed data (same as backend seed)
    setCategories([
      { id: 'hackathon',    name: 'Hackathon' },     { id: 'competition',  name: 'Competition' },
      { id: 'certification',name: 'Certification' }, { id: 'internship',   name: 'Internship' },
      { id: 'research',     name: 'Research' },       { id: 'publication',  name: 'Publication' },
      { id: 'workshop',     name: 'Workshop' },       { id: 'conference',   name: 'Conference' },
      { id: 'project',      name: 'Project' },        { id: 'sports',       name: 'Sports' },
      { id: 'cultural',     name: 'Cultural' },       { id: 'academic',     name: 'Academic' },
      { id: 'volunteer',    name: 'Volunteer' },      { id: 'other',        name: 'Other' },
    ]);
    // Load real IDs from API
    api.get('/admin/departments').catch(() => null);

    // We'll use a ref data endpoint — add GET /ref/categories etc to backend
    // For now fall back to a simpler approach: fetch from API if available
    const loadRefData = async () => {
      try {
        const [catRes, domRes, skillRes] = await Promise.all([
          api.get('/ref/categories'),
          api.get('/ref/domains'),
          api.get('/ref/skills'),
        ]);
        if (catRes.data?.data)   setCategories(catRes.data.data);
        if (domRes.data?.data)   setDomains(domRes.data.data);
        if (skillRes.data?.data) setSkills(skillRes.data.data);
      } catch {
        /* keep static fallback */
      }
    };
    loadRefData();
  }, []);

  // File handling
  const handleFiles = useCallback((newFiles: File[]) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm'];
    const valid = newFiles.filter(f => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...valid].slice(0, 5));
  }, []);

  // Step 1 → create DRAFT
  const handleStep1 = async (data: Step1Form) => {
    setStep1Data(data);
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/posts', {
        title:           data.title,
        description:     data.description,
        achievementDate: data.achievementDate,
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.domainId   && { domainId:   data.domainId }),
        ...(data.position   && { position:   data.position }),
      });
      setPostId(res.data.data.id);
      setStep(1);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to create post');
    } finally { setSubmitting(false); }
  };

  // Step 2 → update skills
  const handleSkillsNext = async () => {
    if (selectedSkills.length > 0) {
      try {
        await api.patch(`/posts/${postId}`, { skillIds: selectedSkills });
      } catch { /* non-fatal */ }
    }
    setStep(2);
  };

  // Step 3 → upload evidence
  const handleEvidenceNext = async () => {
    if (files.length > 0) {
      setSubmitting(true);
      try {
        const fd = new FormData();
        files.forEach(f => fd.append('evidence', f));
        await api.post(`/posts/${postId}/media`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } catch { /* non-fatal */ }
      finally { setSubmitting(false); }
    }
    setStep(3);
  };

  // Final submit
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/posts/${postId}/submit`);
      router.push('/student/achievements');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Submit failed');
    } finally { setSubmitting(false); }
  };

  const StepBar = () => (
    <div className="step-indicator" style={{ marginBottom: '2rem' }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div className={`step ${step > i ? 'done' : step === i ? 'active' : ''}`}>
            <div className="step-num">{step > i ? <CheckCircle2 size={12} /> : i + 1}</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`step-line ${step > i ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px' }}>
      <PageHeader
        title="New Achievement"
        breadcrumbs={[{ label: 'Achievements', href: '/student/achievements' }, { label: 'New' }]}
      />

      <div className="cc-card" style={{ padding: '2rem' }}>
        <StepBar />

        {error && (
          <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{error}</p>
          </div>
        )}

        {/* ── Step 0: Details ── */}
        {step === 0 && (
          <form onSubmit={handleSubmit(handleStep1)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div className="cc-form-group">
              <label className="cc-label">Title *</label>
              <input className="cc-input" placeholder="e.g. AI Hackathon 2026 — 1st Place" {...register('title')} />
              {errors.title && <span className="cc-form-error">{errors.title.message}</span>}
            </div>

            <div className="cc-form-group">
              <label className="cc-label">Description *</label>
              <textarea className="cc-input" rows={4} placeholder="Describe what you achieved, how, and the impact…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...register('description')} />
              {errors.description && <span className="cc-form-error">{errors.description.message}</span>}
            </div>

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

            <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
              {submitting ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <>Continue <ChevronRight size={14} /></>}
            </button>
          </form>
        )}

        {/* ── Step 1: Skills ── */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.375rem' }}>Select relevant skills</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Pick up to 10 skills demonstrated in this achievement or add your own.</p>

            {/* Custom Skill Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {skills.map(s => {
                const selected = selectedSkills.includes(s.id) || selectedSkills.includes(s.name);
                const skillValue = s.id;
                return (
                  <button key={s.id} type="button"
                    onClick={() => setSelectedSkills(prev => selected ? prev.filter(id => id !== s.id && id !== s.name) : prev.length < 10 ? [...prev, skillValue] : prev)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-ghost" onClick={() => setStep(0)}><ChevronLeft size={14} />Back</button>
              <button className="btn-primary" onClick={handleSkillsNext}>Continue <ChevronRight size={14} /></button>
            </div>
          </div>
        )}

        {/* ── Step 2: Evidence ── */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.375rem' }}>Upload evidence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Add proof of your achievement — screenshots, certificates, videos, PDFs. Max 5 files, 10MB each.
            </p>
            {files.length < 5 && (
              <div
                className={`cc-dropzone ${dragOver ? 'active' : ''}`}
                style={{ marginBottom: '1rem' }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(Array.from(e.dataTransfer.files)); }}
                onClick={() => document.getElementById('evidence-input')?.click()}
              >
                <Upload size={28} style={{ color: 'var(--primary)', margin: '0 auto 0.625rem', display: 'block', opacity: 0.7 }} />
                <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Drop files here or <span style={{ color: 'var(--primary)' }}>browse</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Images, PDF, MP4 · Max 10MB each · Up to {5 - files.length} more</p>
                <input id="evidence-input" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4,.webm" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) handleFiles(Array.from(e.target.files)); }} />
              </div>
            )}
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '0.5rem', background: 'var(--surface)' }}>
                {f.type === 'application/pdf' ? <FileText size={18} color="var(--primary)" /> : <ImageIcon size={18} color="var(--success)" />}
                <span style={{ flex: 1, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{(f.size/1024/1024).toFixed(1)}MB</span>
                <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={15} />
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button className="btn-ghost" onClick={() => setStep(1)}><ChevronLeft size={14} />Back</button>
              <button className="btn-primary" onClick={handleEvidenceNext} disabled={submitting}>
                {submitting ? <><Loader2 size={14} className="animate-spin" />Uploading…</> : <>Continue <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Submit ── */}
        {step === 3 && step1Data && (
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Review & Submit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Title',       value: step1Data.title },
                { label: 'Date',        value: step1Data.achievementDate },
                { label: 'Category',    value: categories.find(c => c.id === step1Data.categoryId)?.name ?? '—' },
                { label: 'Domain',      value: domains.find(d => d.id === step1Data.domainId)?.name ?? '—' },
                { label: 'Position',    value: step1Data.position?.replace(/_/g,' ') ?? '—' },
                { label: 'Skills',      value: selectedSkills.length > 0 ? `${selectedSkills.length} selected` : 'None' },
                { label: 'Evidence',    value: files.length > 0 ? `${files.length} file(s)` : 'None' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--info-bg)', border: '1px solid var(--info-border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--info)' }}>
              Submitting will move this achievement to <strong>Pending Review</strong>. A teacher will review and score it shortly.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-ghost" onClick={() => setStep(2)}><ChevronLeft size={14} />Back</button>
              <button className="btn-primary" onClick={handleFinalSubmit} disabled={submitting} style={{ minWidth: '140px', justifyContent: 'center' }}>
                {submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : 'Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
