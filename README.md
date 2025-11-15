# TrekJob - Job Application Tracker

A comprehensive job application tracking platform that helps you manage your job search journey with AI-powered insights, interview preparation tools, and personalized analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Development Guidelines](#development-guidelines)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Features
- **Job Application Tracking** — Keep records of all job applications in one centralized dashboard
- **Status Tracking** — Track application progress from "Applied" to "Interview" to "Offer"
- **CV Management** — Upload and securely store multiple CV versions
- **Interview Preparation** — AI-powered interview coach for generating questions and refining answers
- **Notes & Documentation** — Add notes to applications and keep track of important details
- **Interview Scheduling** — Schedule and manage interviews with interview dates, type, and feedback
- **Analytics Dashboard** — Visualize job search progress with charts and success metrics
- **Cover Letter Generator** — AI-assisted cover letter creation tailored to job postings
- **AI Recommendations** — Get personalized AI feedback on CV structure, tone, and keywords

### User Experience
- **Responsive Design** — Works seamlessly on desktop and mobile devices
- **Private Dashboard** — Secure user authentication via Clerk
- **Fixed Sidebar Navigation** — Desktop: fixed left sidebar with full navigation; Mobile: bottom icon-only navbar
- **User Profile** — Display user profile picture and name in sidebar with quick sign-out

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Routing**: TanStack React Router v1.136
- **Styling**: Tailwind CSS 4.1 + @tailwindcss/vite
- **Build Tool**: Vite 7.2
- **Authentication**: Clerk (Clerk React SDK)
- **UI Components**: Lucide React (icons)
- **Compiler**: Babel React Compiler
- **Dev Tools**: ESLint, TypeScript ESLint

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express 5.1
- **Language**: TypeScript 5.9
- **Database ORM**: Prisma 6.18 with SQLite
- **Database Adapter**: better-sqlite3
- **CORS**: cors middleware
- **Dev Server**: Nodemon
- **Type Safety**: TypeScript with strict mode

### Database
- **Provider**: SQLite (for development, cost-effective)
- **ORM**: Prisma
- **Query Engine**: Built-in Prisma query engine
- **Location**: `trackjobapi/prisma/dev.db`

## 📁 Project Structure

```
trackjob/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── PrivateNav.tsx       # Authenticated user sidebar/mobile nav with Clerk user info
│   │   │   ├── PublicNav.tsx        # Public navbar with hamburger menu
│   │   │   └── ui/                  # UI layout components
│   │   ├── routes/                  # File-based routing (TanStack Router)
│   │   │   ├── __root.tsx           # Root layout
│   │   │   ├── app/                 # Authenticated routes
│   │   │   │   ├── index.tsx        # Dashboard (wrapped in PrivateLayout)
│   │   │   │   ├── applications.tsx # Applications page
│   │   │   │   ├── interviews.tsx   # Interviews page
│   │   │   │   ├── notes.tsx        # Notes page
│   │   │   │   ├── settings.tsx     # Settings page
│   │   │   │   ├── jobsleads.tsx    # Job leads/boards
│   │   │   │   └── addapplication.tsx # Add new application
│   │   │   ├── sign-in.tsx          # Sign-in page
│   │   │   ├── sign-up.tsx          # Sign-up page
│   │   │   ├── index.tsx            # Home page
│   │   │   ├── features.tsx         # Features page
│   │   │   ├── how-it-works.tsx     # How it works page
│   │   │   └── about.tsx            # About page
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── staticdata/              # Static content and navigation links
│   │   ├── styles/                  # CSS modules and styles
│   │   ├── App.tsx                  # Main App component
│   │   ├── main.tsx                 # Entry point with Clerk setup
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── eslint.config.js
│
├── trackjobapi/                     # Express backend API
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   └── userController.ts
│   │   ├── routes/                  # API route definitions
│   │   │   └── junctionRouter.ts    # Main router
│   │   ├── prisma/                  # Database schema
│   │   │   └── schema.prisma        # Prisma schema (Users, Jobs, Applications, Interviews, Notes)
│   │   ├── generated/               # Generated Prisma client
│   │   │   └── prisma/              # Prisma types and engine
│   │   ├── data/                    # Data utilities
│   │   ├── queries.ts               # Database query helpers
│   │   └── index.ts                 # Server entry point
│   ├── prisma/
│   │   ├── migrations/              # Database migration history
│   │   ├── dev.db                   # SQLite database file
│   │   └── migration_lock.toml      # Prisma lock file
│   ├── package.json
│   ├── prisma.config.ts             # Prisma configuration
│   ├── tsconfig.json
│   ├── nodemon.json                 # Nodemon config for dev server
│   └── dist/                        # Compiled JavaScript output
│
├── package.json                     # Root package.json with workspace scripts
└── README.md                        # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher
- **npm**: v10+ or **pnpm** (recommended)
- **Git**: For version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/McDonaldMusimwa/trackjob.git
cd trackjob
```

### 2. Install Dependencies

```bash
# Install root and workspace dependencies
npm install

# Or with pnpm
pnpm install
```

### 3. Setup Environment Variables

#### Frontend (client/.env)
Create a `.env` file in the `client/` directory:

```env
# Clerk authentication (get from Clerk dashboard at https://dashboard.clerk.com)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

#### Backend (trackjobapi/.env)
Create a `.env` file in the `trackjobapi/` directory:

```env
# SQLite database (local file-based)
DATABASE_URL="file:./dev.db"

# Optional: Add other environment variables as needed
NODE_ENV=development
```

### 4. Setup Database

Generate Prisma client types and run migrations:

```bash
cd trackjobapi

# Generate Prisma client
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate
```

## ▶️ Running the Application

### Development Mode (Frontend + Backend Concurrently)

From the root directory:

```bash
npm run dev
```

This will start both the frontend (Vite dev server on port 5173) and backend (Express server on port 3000).

### Individual Services

#### Frontend Only
```bash
npm run client
```
Runs Vite dev server at `http://localhost:5173`

#### Backend Only
```bash
npm run api
```
Runs Express server at `http://localhost:3000`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
npm run preview  # Test production build locally
```

#### Build Backend
```bash
cd trackjobapi
npm run build
npm start  # Runs compiled JavaScript
```

## 🗄 Database

### Database Schema

The application uses SQLite with the following models:

#### User
```typescript
- id (Int, Primary Key)
- email (String, Unique)
- name (String, optional)
- password (String, optional)
- provider (String, optional)  // OAuth provider
- providerId (String, optional)
- avatar (String, optional)
- emailVerified (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
- Relationships: jobs[], profile, applications[], interviews[], notes[]
```

#### Profile
```typescript
- id (Int, Primary Key)
- bio (String, optional)
- userId (Int, Foreign Key -> User)
- user (User relation)
```

#### Job
```typescript
- id (Int, Primary Key)
- companyName (String)
- jobTitle (String)
- jobLink (String)
- status (JobStatus enum: APPLIED, INTERVIEWING, PENDING, OFFER, REJECTED, SAVED)
- comments (String, optional)
- published (Boolean)
- authorId (Int, optional, Foreign Key -> User)
- author (User relation)
- createdAt (DateTime)
- updatedAt (DateTime)
- Relationships: applications[], interviews[], notes[]
```

#### Application
```typescript
- id (Int, Primary Key)
- userId (Int, Foreign Key -> User)
- jobId (Int, Foreign Key -> Job)
- appliedDate (DateTime)
- status (JobStatus enum)
- coverLetter (String, optional)
- resume (String, optional)
- notes (String, optional)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Interview
```typescript
- id (Int, Primary Key)
- userId (Int, Foreign Key -> User)
- jobId (Int, optional, Foreign Key -> Job)
- interviewDate (DateTime)
- interviewType (String, optional) // Phone, Video, In-person
- interviewer (String, optional)
- notes (String, optional)
- feedback (String, optional)
- status (String, optional) // Scheduled, Completed, Cancelled
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Note
```typescript
- id (Int, Primary Key)
- userId (Int, Foreign Key -> User)
- jobId (Int, optional, Foreign Key -> Job)
- title (String)
- content (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Database Commands

```bash
cd trackjobapi

# Generate Prisma client
npm run prisma:generate

# Create and apply a new migration
npm run prisma:migrate

# Open Prisma Studio (GUI for database)
npx prisma studio

# Run custom queries
npm run prisma:test
```

## 📡 API Documentation

### Base URL
`http://localhost:3000`

### Authentication
Currently using Clerk for frontend authentication. Backend routes should be secured with appropriate middleware.

### Example Endpoints

#### Get Users
```
GET /api/users
Response: { users: User[] }
```

#### Create Job Application
```
POST /api/applications
Body: {
  userId: number
  jobId: number
  status: JobStatus
  coverLetter?: string
  resume?: string
  notes?: string
}
Response: { application: Application }
```

#### Get User Applications
```
GET /api/users/:userId/applications
Response: { applications: Application[] }
```

#### Create Interview Record
```
POST /api/interviews
Body: {
  userId: number
  jobId?: number
  interviewDate: DateTime
  interviewType?: string
  interviewer?: string
}
Response: { interview: Interview }
```

### CORS Configuration
CORS is enabled for all origins in development. Update `trackjobapi/src/index.ts` for production.

## 📂 Folder Structure Details

### Frontend Routes

- **Public Routes** (accessible to everyone):
  - `/` — Home page
  - `/about` — About page
  - `/features` — Features showcase
  - `/how-it-works` — How it works
  - `/sign-in` — Sign in with Clerk
  - `/sign-up` — Sign up with Clerk

- **Private Routes** (requires Clerk authentication):
  - `/app` — Dashboard
  - `/app/applications` — View/manage job applications
  - `/app/interviews` — Schedule and track interviews
  - `/app/notes` — Add and organize notes
  - `/app/settings` — User settings
  - `/app/jobsleads` — Browse job boards
  - `/app/addapplication` — Add new job application

### Frontend Components

- **PrivateNav.tsx**: Desktop sidebar + mobile bottom nav with Clerk user profile
- **PublicNav.tsx**: Public navbar with hamburger menu (mobile responsive)
- **PrivateLayout.tsx**: Wraps `/app/*` routes with PrivateNav
- **PublicLayout.tsx**: Wraps public routes

### Backend Routes

- **junctionRouter.ts**: Main router that consolidates all API endpoints
- **userController.ts**: Handlers for user-related endpoints

## 🔧 Development Guidelines

### Frontend Development

#### Adding a New Route
1. Create a new file in `client/src/routes/` (e.g., `new-feature.tsx`)
2. Define the route with TanStack Router:
   ```tsx
   import { createFileRoute } from '@tanstack/react-router'
   
   export const Route = createFileRoute('/new-feature')({
     component: RouteComponent,
   })
   
   function RouteComponent() {
     return <div>New Feature</div>
   }
   ```
3. Route is auto-generated and added to the route tree

#### Adding a New Component
1. Create component in `client/src/components/`
2. Use React hooks for state management
3. Style with Tailwind CSS classes
4. Import and use in routes/other components

#### Using Clerk Authentication
```tsx
import { useUser, useClerk } from '@clerk/clerk-react'

function MyComponent() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return (
    <div>
      <p>Welcome, {user?.firstName}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### Backend Development

#### Adding a New API Endpoint
1. Create a controller function in `trackjobapi/src/controllers/`
2. Add route to `trackjobapi/src/routes/junctionRouter.ts`:
   ```typescript
   app.get('/api/endpoint', yourController)
   ```
3. Use Prisma client for database queries

#### Using Prisma
```typescript
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Query examples
const users = await prisma.user.findMany()
const user = await prisma.user.create({ data: { email, name } })
const updated = await prisma.job.update({ 
  where: { id }, 
  data: { status } 
})
```

## 🔐 Authentication

### Clerk Setup
1. Sign up at [Clerk.com](https://clerk.com)
2. Create a new application
3. Copy your **Publishable Key** from the Clerk dashboard
4. Add to `client/.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

### Frontend Authentication Flow
1. User signs up/signs in via Clerk UI
2. Clerk provides user object with profile data (name, email, avatar)
3. Use `useUser()` hook in components to access user data
4. PrivateNav displays user profile picture and name
5. Sign out button clears Clerk session

### Backend Authentication (Future)
Consider implementing:
- JWT token validation for API endpoints
- Middleware to verify Clerk tokens
- Protected routes for sensitive operations

## 🐛 Troubleshooting

### Issue: "Prisma Client could not locate the Query Engine"

**Solution**:
```bash
cd trackjobapi
npm run prisma:generate
npm run build
# Then start the server
npm run dev
```

The postbuild script automatically copies the engine to `dist/generated/prisma/`.

### Issue: Port already in use

**For port 3000 (Backend)**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**For port 5173 (Frontend)**:
```bash
# Set custom port
npm run dev -- --port 5174
```

### Issue: CORS errors

Ensure CORS is enabled in `trackjobapi/src/index.ts`:
```typescript
import cors from 'cors'
app.use(cors())
```

### Issue: Database file not found

```bash
cd trackjobapi
npm run prisma:migrate
# This creates the dev.db file
```

### Issue: Clerk authentication not working

1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in `client/.env`
2. Check Clerk dashboard for active application
3. Ensure ClerkProvider wraps the app in `client/src/main.tsx`

### Issue: TypeScript errors

```bash
cd client
npm run lint

cd ../trackjobapi
npm run build
```

## 📚 Resources

- **TanStack Router**: https://tanstack.com/router/latest
- **Clerk Documentation**: https://clerk.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev
- **Express**: https://expressjs.com

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

McDonaldMusimwa

---

**Last Updated**: November 15, 2025

For issues, questions, or contributions, please open an issue or submit a pull request on GitHub.
