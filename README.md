# CampusConnect V2

<div align="center">

![CampusConnect Banner](https://img.shields.io/badge/CampusConnect-V2.0-indigo?style=for-the-badge&logo=academic-pages&logoColor=white)
![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**An Academic Management & Social Networking Platform for Educational Campuses**

[Overview](#overview) • [Key Features](#key-features) • [Technology Stack](#technology-stack) • [Architecture](#architecture--directory-structure) • [Getting Started](#getting-started) • [Security & Validation](#security--validation)

---

</div>

## Overview

**CampusConnect V2** is a enterprise-grade academic platform designed to connect students, faculty, and campus administrators. It unifies academic achievement tracking, portfolio verification, course interactions, peer reviews, and campus community discussions into a single system.

---

## Key Features

### Academic Ecosystem
- **Student Portal:** Centralized dashboard for tracking academic progress, submitting assignments, showcasing projects, and managing peer connections.
- **Faculty Portal:** Course administration, achievement verification, student evaluation tools, and feedback management.
- **Administrator Panel:** Document verification pipeline, role-based access delegation, system audits, and campus-wide communications.

### Verified Achievement System
- Structured recognition workflows with standardized position metrics (First, Second, Third, Top 5/10, Finalist).
- Portfolio document verification backed by Supabase object storage.

### Community & Collaboration
- Dedicated streams for campus announcements, technical discussions, and department-specific forums.
- Domain and interest group content categorization.

### Identity Verification & Security
- Mandatory document verification step during registration workflows.
- Role-based Access Control (RBAC) utilizing JWT access and refresh token pairs.
- Runtime payload validation via Zod schemas across all API endpoints.

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19, TypeScript
- **Styling:** TailwindCSS v4, CSS Modules, Lucide React
- **State Management:** Zustand
- **Form Management & Validation:** React Hook Form, Zod (`@hookform/resolvers`)

### Backend
- **Runtime Environment:** Node.js, Express.js (TypeScript)
- **Database & ORM:** PostgreSQL (Supabase), Prisma ORM v5
- **Object Storage:** Supabase Storage (Document & Media Buckets)
- **Security Middleware:** Helmet, CORS, Express Rate Limit, bcryptjs, JSON Web Tokens (JWT)
- **Request Validation:** Zod

---

## Architecture & Directory Structure

```
CampusConnectV2/
├── backend/                  # Express REST API & Prisma Layer
│   ├── prisma/               # Database Schema Definitions & Migrations
│   └── src/
│       ├── config/           # Environment & Database Connectors
│       ├── middleware/       # Authentication, Rate Limiting, Error Handlers
│       └── modules/          # Feature Modules
│           ├── admin/        # Verification & Management Controllers
│           ├── auth/         # Authentication Controllers & Schemas
│           ├── feed/         # Community Stream Endpoints
│           ├── leaderboards/ # Ranking & Achievement Logic
│           ├── posts/        # Engagement & Content Handlers
│           ├── reviews/      # Peer & Faculty Evaluation System
│           ├── students/     # Student Profiles & Portfolios
│           └── teachers/     # Faculty Management & Course Tools
│
└── frontend/                 # Next.js 16 Web Client
    ├── app/                  # Application Routes & Pages
    ├── components/           # Component Library
    │   ├── ui/               # Core Design System Primitives
    │   └── landing/          # Public Landing Components
    └── lib/                  # Application State, Hooks, API Clients
```

---

## Getting Started

### System Requirements
- **Node.js**: `v18.x` or later
- **Package Manager**: `npm` or `pnpm`
- **Database**: PostgreSQL (e.g., Supabase PostgreSQL instance)

---

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/SaiTharunYedulla/CampusConnectV2.git
cd CampusConnectV2
```

---

#### 2. Backend Configuration

```bash
cd backend
npm install
```

Configure environment variables by creating a `.env` file inside the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres"

# Supabase Storage
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_BUCKET_NAME="campusconnect"

# JWT Configuration
JWT_ACCESS_SECRET="your_32_character_access_secret"
JWT_REFRESH_SECRET="your_32_character_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Database Initialization:

```bash
# Execute Database Migrations
npm run db:migrate

# Seed Initial Data
npm run db:seed

# Launch Backend Server
npm run dev
```

The backend server runs at `http://localhost:5000`.

---

#### 3. Frontend Configuration

```bash
cd ../frontend
npm install
```

Launch Development Client:

```bash
npm run dev
```

The application client runs at `http://localhost:3000`.

---

## Security & Validation

All incoming requests across backend endpoints undergo strict schema validation using Zod.

```typescript
// Sample schema from auth.validation.ts
export const studentRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/),
  documentType: z.string().min(1, 'Document proof required'),
});
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
