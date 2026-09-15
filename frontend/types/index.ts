// ─── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole   = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
export type AcademicYear =
  | 'FIRST_YEAR' | 'SECOND_YEAR' | 'THIRD_YEAR' | 'FOURTH_YEAR';

export interface AuthUser {
  id:      string;
  email:   string;
  role:    UserRole;
  status:  UserStatus;
  profile: StudentProfile | TeacherProfile | null;
}

export interface LoginResponse {
  accessToken:  string;
  refreshToken: string;
  user:         AuthUser;
}

// ─── Profiles ─────────────────────────────────────────────────────────────────
export interface Department {
  id:   string;
  code: string;
  name: string;
}

export interface Skill {
  id:   string;
  name: string;
}

export interface Badge {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
  earnedAt?:   string;
}

export interface StudentProfile {
  id:           string;
  userId:       string;
  username:     string;
  firstName:    string;
  lastName:     string;
  bio?:         string;
  profilePhoto?:string;
  academicYear?:AcademicYear;
  education?:   string;
  socialLinks?: { linkedin?: string; github?: string; twitter?: string; website?: string };
  department?:  Department;
  skills?:      Skill[];
  badges?:      Badge[];
  stats?: {
    approvedCount: number;
    totalScore:    number;
    pendingCount:  number;
    badges:        number;
  };
}

export interface TeacherProfile {
  id:          string;
  userId:      string;
  username:    string;
  firstName:   string;
  lastName:    string;
  bio?:        string;
  profilePhoto?:string;
  designation?:string;
  employeeId?: string;
  expertise?:  string;
  department?: Department;
  stats?: {
    totalReviews:      number;
    approved:          number;
    rejected:          number;
    revisionRequested: number;
  };
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export type PostStatus =
  | 'DRAFT' | 'PENDING_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'REJECTED';

export type AchievementPosition =
  | 'FIRST' | 'SECOND' | 'THIRD' | 'TOP_5' | 'TOP_10' | 'FINALIST' | 'PARTICIPANT';

export type ReviewAction = 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';

export interface PostMedia {
  id:         string;
  fileName:   string;
  fileType:   string;
  fileSize:   number;
  storageKey: string;
  createdAt:  string;
}

export interface Post {
  id:              string;
  title:           string;
  description:     string;
  achievementDate: string;
  position?:       AchievementPosition;
  status:          PostStatus;
  score?:          number;
  teacherFeedback?:string;
  verifiedAt?:     string;
  createdAt:       string;
  updatedAt:       string;
  student?:        Partial<StudentProfile>;
  category?:       { id: string; name: string };
  domain?:         { id: string; name: string };
  skills:          Skill[];
  media:           PostMedia[];
  upvoteCount?:    number;
  hasUpvoted?:     boolean;
  mediaCount?:     number;
  verifiedBy?:     { id: string; firstName: string; lastName: string };
  reviews?:        Review[];
}

export interface Review {
  id:        string;
  action:    ReviewAction;
  score?:    number;
  feedback?: string;
  createdAt: string;
  teacher?:  Partial<TeacherProfile>;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  id:          string;
  firstName:   string;
  lastName:    string;
  username:    string;
  profilePhoto?:string;
  department?: { code: string; name: string };
  totalScore:  number;
  rank:        number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page:  number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data:       T[];
  pagination: PaginationMeta;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface AdminDashboard {
  students:    { total: number; pending: number; active: number; rejected: number };
  teachers:    { total: number; pending: number; active: number; rejected: number };
  departments: { total: number; active: number };
  posts:       { pending: number; approved: number };
}

export interface DepartmentFull {
  id:        string;
  code:      string;
  name:      string;
  isActive:  boolean;
  createdAt: string;
  updatedAt: string;
}
