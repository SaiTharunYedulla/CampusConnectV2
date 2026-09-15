'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import {
  GraduationCap, BookOpen, Upload, CheckCircle2,
  Loader2, Eye, EyeOff, X, FileText, Image, AlertCircle,
} from 'lucide-react';

// ─── Schemas ──────────────────────────────────────────────────────────────────
const personalSchema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  username:  z.string().min(3, 'Min 3 chars').max(30)
               .regex(/^[a-z0-9_]+$/, 'Lowercase, numbers, underscores only'),
  email:     z.string().email('Enter a valid email'),
  password:  z.string().min(8, 'Min 8 chars')
               .regex(/[A-Z]/, 'Need uppercase')
               .regex(/[0-9]/, 'Need a number')
               .regex(/[^A-Za-z0-9]/, 'Need a special char'),
  // Teacher extras
  designation: z.string().max(100).optional(),
  employeeId:  z.string().max(50).optional(),
  expertise:   z.string().max(200).optional(),
});
type PersonalForm = z.infer<typeof personalSchema>;

type Step = 1 | 2 | 3 | 4;
type Role = 'STUDENT' | 'TEACHER';

const STEPS = [
  { num: 1, label: 'Role'     },
  { num: 2, label: 'Details'  },
  { num: 3, label: 'Proof'    },
  { num: 4, label: 'Done'     },
];

const DOC_TYPES = [
  'Student ID Card', 'Admission Letter', 'College ID', 'Fee Receipt',
  'Employee ID', 'Appointment Letter', 'Faculty ID',
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]           = useState<Step>(1);
  const [role, setRole]           = useState<Role | null>(null);
  const [file, setFile]           = useState<File | null>(null);
  const [docType, setDocType]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [apiErr, setApiErr]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
  });

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = useCallback((f: File) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf'];
    if (!allowed.includes(f.type)) { setApiErr('Only JPEG, PNG, WebP, or PDF files allowed'); return; }
    if (f.size > 10 * 1024 * 1024) { setApiErr('File must be under 10MB'); return; }
    setApiErr('');
    setFile(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  // ── Final submit ───────────────────────────────────────────────────────────
  const handleFinalSubmit = async () => {
    if (!file || !docType || !role) return;
    const values = getValues();
    setSubmitting(true);
    setApiErr('');

    const fd = new FormData();
    fd.append('email', values.email);
    fd.append('password', values.password);
    fd.append('firstName', values.firstName);
    fd.append('lastName', values.lastName);
    fd.append('username', values.username);
    fd.append('documentType', docType);
    fd.append('proof', file);
    if (role === 'TEACHER') {
      if (values.designation) fd.append('designation', values.designation);
      if (values.employeeId)  fd.append('employeeId', values.employeeId);
      if (values.expertise)   fd.append('expertise', values.expertise);
    }

    try {
      const endpoint = role === 'STUDENT' ? '/auth/student/register' : '/auth/teacher/register';
      await api.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStep(4);
    } catch (err: unknown) {
      setApiErr(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? 'Registration failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step indicator ─────────────────────────────────────────────────────────
  const StepBar = () => (
    <div className="step-indicator" style={{ width: '100%', marginBottom: '2rem' }}>
      {STEPS.map((s, i) => (
        <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div className={`step ${step > s.num ? 'done' : step === s.num ? 'active' : ''}`}>
            <div className="step-num">
              {step > s.num ? <CheckCircle2 size={12} /> : s.num}
            </div>
            <span style={{ display: 'none' }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${step > s.num ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: step === 2 ? '540px' : '460px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
          background: 'var(--primary)', marginBottom: '0.75rem',
          boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
        }}>
          <GraduationCap size={20} color="white" />
        </div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Create your account</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
          Join CampusConnect and showcase your achievements
        </p>
      </div>

      <div className="cc-card" style={{ padding: '1.75rem' }}>
        <StepBar />

        {/* ── Step 1: Role Selection ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>I am a…</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Select your role to get started
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {([
                { r: 'STUDENT' as Role, icon: <GraduationCap size={28} />, label: 'Student', desc: 'Submit and showcase achievements' },
                { r: 'TEACHER' as Role, icon: <BookOpen size={28} />,      label: 'Teacher', desc: 'Review and verify achievements' },
              ]).map(({ r, icon, label, desc }) => (
                <button
                  key={r}
                  id={`role-${r.toLowerCase()}`}
                  onClick={() => { setRole(r); setStep(2); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '0.625rem', padding: '1.5rem 1rem',
                    border: `2px solid ${role === r ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)', background: role === r ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center',
                    color: role === r ? 'var(--primary)' : 'var(--text-primary)',
                  }}
                >
                  <div style={{ color: 'inherit' }}>{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Personal Info ── */}
        {step === 2 && (
          <form className="animate-fade-in" onSubmit={handleSubmit(() => setStep(3))}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>
              Your details
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                ({role})
              </span>
            </h2>

            {apiErr && (
              <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{apiErr}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="cc-form-group">
                <label className="cc-label" htmlFor="firstName">First name</label>
                <input id="firstName" className="cc-input" placeholder="First" {...register('firstName')} />
                {errors.firstName && <span className="cc-form-error">{errors.firstName.message}</span>}
              </div>
              <div className="cc-form-group">
                <label className="cc-label" htmlFor="lastName">Last name</label>
                <input id="lastName" className="cc-input" placeholder="Last" {...register('lastName')} />
                {errors.lastName && <span className="cc-form-error">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="cc-form-group" style={{ marginTop: '1rem' }}>
              <label className="cc-label" htmlFor="username">Username</label>
              <input id="username" className="cc-input" placeholder="e.g. john_doe" {...register('username')} />
              {errors.username && <span className="cc-form-error">{errors.username.message}</span>}
            </div>

            <div className="cc-form-group" style={{ marginTop: '1rem' }}>
              <label className="cc-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" className="cc-input" placeholder="you@university.edu" {...register('email')} />
              {errors.email && <span className="cc-form-error">{errors.email.message}</span>}
            </div>

            <div className="cc-form-group" style={{ marginTop: '1rem' }}>
              <label className="cc-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  className="cc-input"
                  placeholder="Min 8 chars, uppercase, number, special"
                  style={{ paddingRight: '2.75rem' }}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="cc-form-error">{errors.password.message}</span>}
            </div>

            {/* Teacher extras */}
            {role === 'TEACHER' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem', fontWeight: 500 }}>
                  Teacher information (optional)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div className="cc-form-group">
                    <label className="cc-label" htmlFor="designation">Designation</label>
                    <input id="designation" className="cc-input" placeholder="e.g. Assistant Professor" {...register('designation')} />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-label" htmlFor="employeeId">Employee ID</label>
                    <input id="employeeId" className="cc-input" placeholder="EMP-001" {...register('employeeId')} />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-label" htmlFor="expertise">Area of Expertise</label>
                    <input id="expertise" className="cc-input" placeholder="e.g. Machine Learning, Data Science" {...register('expertise')} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button type="submit" id="reg-next" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                Continue
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3: Proof Upload ── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Upload verification proof</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Upload your {role === 'STUDENT' ? 'student ID or admission letter' : 'employee ID or appointment letter'} for verification.
            </p>

            {/* Document type */}
            <div className="cc-form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="cc-label" htmlFor="docType">Document type</label>
              <select
                id="docType"
                className="cc-input"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select document type…</option>
                {DOC_TYPES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Drop zone */}
            {!file ? (
              <div
                className={`cc-dropzone ${dragOver ? 'active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById('proof-input')?.click()}
              >
                <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.75rem', opacity: 0.7 }} />
                <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Drop your file here or <span style={{ color: 'var(--primary)' }}>browse</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  JPEG, PNG, WebP or PDF · Max 10MB
                </p>
                <input
                  id="proof-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
              </div>
            ) : (
              /* File preview */
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.875rem 1rem', borderRadius: 'var(--radius)',
                border: '1px solid var(--success-border)', background: 'var(--success-bg)',
              }}>
                {file.type === 'application/pdf'
                  ? <FileText size={24} color="var(--success)" />
                  : <Image size={24} color="var(--success)" />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '0.25rem' }}>
                  <X size={16} />
                </button>
              </div>
            )}

            {apiErr && (
              <div style={{ marginTop: '1rem', background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={15} color="var(--error)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{apiErr}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              <button
                id="reg-submit"
                className="btn-primary"
                disabled={!file || !docType || submitting}
                onClick={handleFinalSubmit}
                style={{ flex: 2, justifyContent: 'center' }}
              >
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : 'Submit for review'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '4rem', height: '4rem', borderRadius: '50%',
              background: 'var(--success-bg)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={32} color="var(--success)" />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Registration submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              Your account is pending administrator review. You will receive a notification once your account is approved — typically within 1–2 business days.
            </p>
            <Link href="/login" className="btn-primary" style={{ justifyContent: 'center', display: 'inline-flex' }}>
              Back to sign in
            </Link>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
      </p>
    </div>
  );
}
