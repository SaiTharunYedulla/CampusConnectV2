import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb { label: string; href?: string; }

interface PageHeaderProps {
  title:       string;
  description?: string;
  breadcrumbs?: Crumb[];
  action?:     React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Home size={13} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ChevronRight size={12} color="var(--text-muted)" />
              {crumb.href ? (
                <Link href={crumb.href} style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: description ? '0.375rem' : 0 }}>
            {title}
          </h1>
          {description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{description}</p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  );
}
