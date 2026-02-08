# Mobile App Home Screen Builder

A full-stack application for configuring mobile app home screens with real-time preview, versioning, and publish workflows.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Authentication:** iron-session

## Prerequisites

- Node.js 18+ 
- npm
- Docker & Docker Compose

## Quick Start
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd mobile-app-builder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.template .env.local

# 4. Start PostgreSQL + seed database
npm run setup

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the password from `.env.local`

## Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

npm run docker:up    # Start PostgreSQL container
npm run docker:down  # Stop PostgreSQL container
npm run docker:reset # Reset database (WARNING: deletes all data)

npm run db:push      # Sync schema to database
npm run db:seed      # Seed with sample data
npm run db:studio    # Open Drizzle Studio (database GUI)

npm run setup        # Complete setup (docker + push + seed)
```

## Environment Variables

See `.env.template` for required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_PASSWORD` - Admin login password
- `SESSION_SECRET` - Session encryption key

## Architecture

TODO:Shane - Diagram here.

## Key Design Decisions

**PostgreSQL over SQLite:**
Initially i chose SqlLite for simplicity with the take-home project. But I ended up running into some async quirks when creating the Configuration table POST endpoints. It appears SqlLite only supports synchronous calls out of the box. So due to that, I migrated over to PostgreSQL to align with production systems, support concurrent access, while keeping the simple set up by containerizing w/ Docker.

**Versioning Strategy:**
Every save creates a new revision, enabling full audit history and one-click rollback. Published state is tracked separately from save state.

[TODO:Shane - More details in DECISION_LOG.md]