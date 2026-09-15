'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { StudentProfile } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import BadgeDisplay from '@/components/shared/BadgeDisplay';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Loader2, Camera, Save, Award, Link as LinkIcon } from 'lucide-react';

const profileSchema = z.object({
  firstName:    z.string().min(1).max(50),
  lastName:     z.string().min(1).max(50),
  bio:          z.string().max(500).optional(),
  education:    z.string().max(200).optional(),
  linkedin:     z.string().url().optional().or(z.literal('')),
  github:       z.string().url().optional().or(z.literal('')),
});
type ProfileForm = z.infer<typeof profileSchema>;

const ACADEMIC_YEAR_LABELS: Record<string, string> = {
  FIRST_YEAR: '1st Year', SECOND_YEAR: '2nd Year', THIRD_YEAR: '3rd Year', FOURTH_YEAR: '4th Year',
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saved, setSaved]     = useState(false);
  const [activeTab, setActiveTab] = useState<'profile'|'badges'>('profile');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    api.get('/students/me').then(r => {
      const p: StudentProfile = r.data.data;
      setProfile(p);
      setPhotoPreview(p.profilePhoto ?? '');
      reset({
        firstName: p.firstName,
        lastName:  p.lastName,
        bio:       p.bio ?? '',
        education: p.education ?? '',
        linkedin:  (p.socialLinks as { linkedin?: string } | undefined)?.linkedin ?? '',
        github:    (p.socialLinks as { github?: string } | undefined)?.github ?? '',
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setSaved(false);
    try {
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await api.post('/students/me/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await api.patch('/students/me', {
        firstName: data.firstName,
        lastName:  data.lastName,
        bio:       data.bio,
        education: data.education,
        socialLinks: { linkedin: data.linkedin, github: data.github },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Loading profile…" />;
  if (!profile) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px' }}>
      <PageHeader title="My Profile" description="Manage your public profile and personal information" />

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {(['profile','badges'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.625rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500, borderBottom: `2px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)', transition: 'all 0.15s',
          }}>
            {tab === 'profile' ? 'Profile' : `Badges (${profile.badges?.length ?? 0})`}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Photo */}
          <div className="cc-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', overflow: 'hidden', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : profile.firstName[0]?.toUpperCase()
                }
              </div>
              <label htmlFor="photo-input" style={{ position: 'absolute', bottom: 0, right: 0, width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
                <Camera size={13} color="white" />
              </label>
              <input id="photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{profile.firstName} {profile.lastName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>@{profile.username}</div>
              {profile.department && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{profile.department.name} · {ACADEMIC_YEAR_LABELS[profile.academicYear ?? ''] ?? ''}</div>}
            </div>
          </div>

          {/* Form */}
          <div className="cc-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="cc-form-group">
                <label className="cc-label">First name</label>
                <input className="cc-input" {...register('firstName')} />
                {errors.firstName && <span className="cc-form-error">{errors.firstName.message}</span>}
              </div>
              <div className="cc-form-group">
                <label className="cc-label">Last name</label>
                <input className="cc-input" {...register('lastName')} />
                {errors.lastName && <span className="cc-form-error">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="cc-form-group">
              <label className="cc-label">Bio</label>
              <textarea className="cc-input" rows={3} placeholder="Tell us about yourself…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...register('bio')} />
            </div>

            <div className="cc-form-group">
              <label className="cc-label">Education / Degree</label>
              <input className="cc-input" placeholder="e.g. B.Tech Computer Science, 2024–2028" {...register('education')} />
            </div>

            <hr className="cc-divider" />
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <LinkIcon size={13} /> Social Links
            </div>

            <div className="cc-form-group">
              <label className="cc-label">LinkedIn</label>
              <input className="cc-input" placeholder="https://linkedin.com/in/yourprofile" {...register('linkedin')} />
              {errors.linkedin && <span className="cc-form-error">{errors.linkedin.message}</span>}
            </div>

            <div className="cc-form-group">
              <label className="cc-label">GitHub</label>
              <input className="cc-input" placeholder="https://github.com/yourusername" {...register('github')} />
              {errors.github && <span className="cc-form-error">{errors.github.message}</span>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
              {saved && <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 500 }}>✓ Saved!</span>}
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save changes</>}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'badges' && (
        <div className="cc-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Earned Badges</h2>
          </div>
          <BadgeDisplay badges={profile.badges ?? []} />
        </div>
      )}
    </div>
  );
}
