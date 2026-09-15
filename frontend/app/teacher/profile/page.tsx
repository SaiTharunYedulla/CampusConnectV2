'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { TeacherProfile } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Loader2, Camera, Save } from 'lucide-react';

const profileSchema = z.object({
  firstName:   z.string().min(1).max(50),
  lastName:    z.string().min(1).max(50),
  bio:         z.string().max(500).optional(),
  designation: z.string().max(100).optional(),
  expertise:   z.string().max(200).optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile]       = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    api.get('/teachers/me').then(r => {
      const p: TeacherProfile = r.data.data;
      setProfile(p);
      setPhotoPreview(p.profilePhoto ?? '');
      reset({ firstName: p.firstName, lastName: p.lastName, bio: p.bio ?? '', designation: p.designation ?? '', expertise: p.expertise ?? '' });
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
        await api.post('/teachers/me/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await api.patch('/teachers/me', data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Loading profile…" />;
  if (!profile) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px' }}>
      <PageHeader title="My Profile" description="Manage your teacher profile information" />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Photo + summary */}
        <div className="cc-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', overflow: 'hidden', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border)', fontSize: '1.75rem', fontWeight: 700, color: '#059669' }}>
              {photoPreview
                ? <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : profile.firstName[0]?.toUpperCase()
              }
            </div>
            <label htmlFor="teacher-photo" style={{ position: 'absolute', bottom: 0, right: 0, width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
              <Camera size={13} color="white" />
            </label>
            <input id="teacher-photo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{profile.firstName} {profile.lastName}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>@{profile.username}</div>
            {profile.designation && <div style={{ fontSize: '0.8125rem', color: '#059669', marginTop: '0.2rem', fontWeight: 500 }}>{profile.designation}</div>}
            {profile.department && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{profile.department.name}</div>}
          </div>
        </div>

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
            <label className="cc-label">Designation</label>
            <input className="cc-input" placeholder="e.g. Assistant Professor" {...register('designation')} />
          </div>

          <div className="cc-form-group">
            <label className="cc-label">Area of Expertise</label>
            <input className="cc-input" placeholder="e.g. Machine Learning, Data Science" {...register('expertise')} />
          </div>

          <div className="cc-form-group">
            <label className="cc-label">Bio</label>
            <textarea className="cc-input" rows={4} placeholder="Tell students about your background and interests…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...register('bio')} />
          </div>

          {/* Stats summary */}
          {profile.stats && (
            <>
              <hr className="cc-divider" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Total',    value: profile.stats.totalReviews,      color: 'var(--primary)' },
                  { label: 'Approved', value: profile.stats.approved,          color: 'var(--success)' },
                  { label: 'Rejected', value: profile.stats.rejected,          color: 'var(--error)'   },
                  { label: 'Revision', value: profile.stats.revisionRequested, color: 'var(--warning)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
            {saved && <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 500 }}>✓ Saved!</span>}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />Save changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
