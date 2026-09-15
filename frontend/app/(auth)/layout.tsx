export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF2FF 50%, #F0FDF4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-10rem', right: '-10rem',
        width: '40rem', height: '40rem',
        background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-10rem', left: '-10rem',
        width: '40rem', height: '40rem',
        background: 'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}
