import { PostStatus, UserStatus } from '@/types';

const POST_STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  DRAFT:              { label: 'Draft',              className: 'badge-draft'     },
  PENDING_REVIEW:     { label: 'Pending Review',     className: 'badge-pending'   },
  REVISION_REQUESTED: { label: 'Revision Requested', className: 'badge-revision'  },
  APPROVED:           { label: 'Approved',           className: 'badge-approved'  },
  REJECTED:           { label: 'Rejected',           className: 'badge-rejected'  },
};

const USER_STATUS_CONFIG: Record<UserStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pending',   className: 'badge-pending'   },
  ACTIVE:    { label: 'Active',    className: 'badge-active'    },
  REJECTED:  { label: 'Rejected',  className: 'badge-rejected'  },
  SUSPENDED: { label: 'Suspended', className: 'badge-suspended' },
};

interface StatusBadgeProps {
  status: PostStatus | UserStatus;
  type?:  'post' | 'user';
}

export default function StatusBadge({ status, type = 'post' }: StatusBadgeProps) {
  const config = type === 'post'
    ? POST_STATUS_CONFIG[status as PostStatus]
    : USER_STATUS_CONFIG[status as UserStatus];

  if (!config) return null;

  return (
    <span className={`status-pill ${config.className}`}>
      {config.label}
    </span>
  );
}
