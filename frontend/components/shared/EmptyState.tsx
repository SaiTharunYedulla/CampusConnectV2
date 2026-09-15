interface EmptyStateProps {
  icon?:    React.ReactNode;
  title:    string;
  message?: string;
  action?:  React.ReactNode;
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="cc-empty">
      {icon && <div className="cc-empty-icon">{icon}</div>}
      <p className="cc-empty-title">{title}</p>
      {message && <p className="cc-empty-desc">{message}</p>}
      {action && <div style={{ marginTop: '0.75rem' }}>{action}</div>}
    </div>
  );
}
