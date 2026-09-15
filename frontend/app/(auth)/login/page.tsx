'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth.store';
import { AuthUser } from '@/types';
import { Eye, EyeOff, Loader2, GraduationCap, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

const STATUS_MESSAGES: Record<string, string> = {
  PENDING:   'Your account is awaiting administrator approval. You will be notified once approved.',
  REJECTED:  'Your account registration was rejected. Please contact support.',
  SUSPENDED: 'Your account has been suspended. Please contact the administrator.',
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${7 * 24 * 3600};SameSite=Lax`;
}

export default function LoginPage() {
  const router   = useRouter();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const [showPwd, setShowPwd] = useState(false);
  const [apiErr, setApiErr]   = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setApiErr('');
    setStatusMsg('');
    try {
      const res = await api.post<{ accessToken: string; refreshToken: string; user: AuthUser }>(
        '/auth/login', data,
      );
      const { accessToken, refreshToken, user } = res.data;

      // Set auth store
      setAuth(user, accessToken, refreshToken);

      // Set cookies for middleware
      setCookie('cc_auth', 'true');
      setCookie('cc_role', user.role);

      // Role-based redirect
      if (user.role === 'STUDENT') router.push('/student/dashboard');
      else if (user.role === 'TEACHER') router.push('/teacher/dashboard');
      else if (user.role === 'ADMIN')   router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? '';
      // Check if it's a status-related 403
      if (msg.includes('awaiting') || msg.includes('approval')) setStatusMsg(STATUS_MESSAGES.PENDING);
      else if (msg.includes('rejected')) setStatusMsg(STATUS_MESSAGES.REJECTED);
      else if (msg.includes('suspended')) setStatusMsg(STATUS_MESSAGES.SUSPENDED);
      else setApiErr(msg || 'Invalid email or password');
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '3rem', height: '3rem', borderRadius: '0.875rem',
          background: 'var(--primary)', marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
        }}>
          <GraduationCap size={24} color="white" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Sign in to your CampusConnect account
        </p>
      </div>

      {/* Card */}
      <div className="cc-card" style={{ padding: '2rem' }}>
        {/* Status alert */}
        {statusMsg && (
          <div style={{
            background: 'var(--warning-bg)', border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius)', padding: '0.875rem 1rem',
            marginBottom: '1.25rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
          }}>
            <AlertCircle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <p style={{ color: 'var(--warning)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{statusMsg}</p>
          </div>
        )}

        {/* API error */}
        {apiErr && (
          <div style={{
            background: 'var(--error-bg)', border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius)', padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
          }}>
            <p style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{apiErr}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div className="cc-form-group">
            <label className="cc-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="cc-input"
              placeholder="you@university.edu"
              {...register('email')}
            />
            {errors.email && <span className="cc-form-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="cc-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="cc-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className="cc-input"
                placeholder="Enter your password"
                style={{ paddingRight: '2.75rem' }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center',
                }}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="cc-form-error">{errors.password.message}</span>}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ justifyContent: 'center', width: '100%', padding: '0.625rem' }}
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in...</>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <hr className="cc-divider" style={{ flex: 1 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New to CampusConnect?</span>
          <hr className="cc-divider" style={{ flex: 1 }} />
        </div>

        <Link
          href="/register"
          className="btn-ghost"
          style={{ justifyContent: 'center', width: '100%' }}
        >
          Create an account
        </Link>
      </div>

      {/* Footer */}
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} CampusConnect. All rights reserved.
      </p>
    </div>
  );
}
