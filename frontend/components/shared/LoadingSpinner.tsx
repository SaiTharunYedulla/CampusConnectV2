import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?:    number;
  message?: string;
  fullPage?:boolean;
}

export default function LoadingSpinner({ size = 28, message, fullPage = false }: LoadingSpinnerProps) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <Loader2 size={size} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      {message && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--background)', zIndex: 50,
      }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
      {content}
    </div>
  );
}
