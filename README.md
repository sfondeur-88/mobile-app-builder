# Mobile App Home Screen Builder

A full-stack application for building and managing mobile app home screens with real-time preview, configuration versioning, and production-ready publish workflows.

Built as a Full-stack take-home project demonstrating code readability, proper UX patterns and API design.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **ORM:** Drizzle ORM
- **State Management:** Zustand
- **Validation:** Zod
- **Authentication:** iron-session
- **Chosen Enhancement - Drag & Drop:** using @dnd-kit

## Prerequisites

- Node.js 18+
- npm
- Docker & Docker Compose

## Quick Start

```bash
# 1. Clone the repository
git clone <https://github.com/sfondeur-88/mobile-app-builder.git>
cd mobile-app-builder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.template .env.local
# Edit .env.local with your values

# 4. Start PostgreSQL + seed database
npm run setup

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:

- Password: Value from `ADMIN_PASSWORD` in `.env.local`

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)

npm run docker:up    # Start PostgreSQL container
npm run docker:down  # Stop PostgreSQL container

npm run db:push      # Sync Drizzle schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio (database GUI)

npm run setup        # Complete setup (docker + push + seed)
```

## Environment Variables

Required variables (see `.env.template`):

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string       |
| `ADMIN_PASSWORD` | Admin login password               |
| `SESSION_SECRET` | Session encryption key (32+ chars) |

## Project Structure

```
mobile-app-builder/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/            # Login/logout endpoints
│   │   │   └── configurations/  # Config CRUD + versioning
│   │   ├── builder/             # Builder pages
│   │   │   ├── [id]/            # Dynamic config editor
│   │   │   └── new/             # New config creation
│   │   └── login/               # Login page
│   │
│   ├── components/
│   │   ├── builder/             # Header, sidebar, mobile-preview, revisions modal
│   │   ├── editor/              # Carousel, text, CTA editors
│   │   ├── layout/              # Layout components (AppHeader)
│   │   └── ui/                  # Reusable UI (modals, etc)
│   │
│   ├── lib/
│   │   ├── api/                 # Data access layer (reusable DB functions)
│   │   ├── db/                  # Drizzle config, schema, seed data
│   │   ├── auth.ts              # iron-session setup
│   │   ├── store.ts             # Zustand state management
│   │   ├── utils.ts             # Utility functions
│   │   └── validations.ts       # Zod schemas
│   │
│   ├── types/                   # TypeScript type definitions
│   └── proxy.ts                 # Next.js 16 middleware (authentication)
│
├── drizzle/                     # Database migrations
├── docker-compose.yml           # PostgreSQL container config
└── drizzle.config.ts            # Drizzle ORM config
```

## Architecture

[See architecture diagram: `docs/architecture.png`]

### High-Level Flow

**Server Components:**

- Fetch data directly via `/lib/api` functions
- Pass initial state to Client Components as props

**Client Components:**

- Manage draft state with Zustand
- Call API routes for mutations (save/publish/restore)
- Real-time preview updates on every edit

**API Routes:**

- Handles authentication checks
- Use shared `/lib/api` functions for db operations

**Data Access Layer:**

- Reusable functions in `/lib/api` (e.g., `getConfigurationById`, `saveConfiguration`)
- Used by both Server Components and API Routes
- Encapsulates db logic and transactions

## API Endpoints

| Method | Endpoint                                      | Description              |
| ------ | --------------------------------------------- | ------------------------ |
| `POST` | `/api/auth/login`                             | Authenticate user        |
| `POST` | `/api/auth/logout`                            | End session              |
| `GET`  | `/api/configurations`                         | List all configurations  |
| `POST` | `/api/configurations`                         | Create new configuration |
| `GET`  | `/api/configurations/:id`                     | Get single configuration |
| `PUT`  | `/api/configurations/:id/save`                | Save as new revision     |
| `PUT`  | `/api/configurations/:id/publish`             | Publish current revision |
| `GET`  | `/api/configurations/:id/revisions`           | List all revisions       |
| `POST` | `/api/configurations/:id/restore/:revisionId` | Restore old revision     |

## Key Design Decisions & Tradeoffs

**Single Configuration Model:**
Implemented single config per user (focused on home screen) with extensible routing (`/builder/[id]`) that supports multiple configs in the future without major arch changes.

**Data Access Layer Pattern:**
Extracted db operations into `/lib/api` functions used by both Server Components and API Routes. Keeps business logic DRY and reusable.

See `DECISION_LOG.md` for detailed reasoning, AI usage, and areas i'd choose for improvement.

## Notable Assumptions

- Users are trusted administrators (no user isolation implemented)
- Single published revision per configuration at a time
- Images are hosted externally (no upload functionality)
- Session-based authentication felt sufficient for the use case

## Development Notes

**Drizzle Studio:**
Access database GUI with `npm run db:studio` (opens at `https://local.drizzle.studio`)

**Docker PostgreSQL:**

- Data persists in Docker volume
- Use `"docker-compose down -v && docker-compose up -d"` to completely reset database

**Authentication:**

- Session-based
- Stored in encrypted httpOnly cookies
- Auto-redirects unauthenticated users to `/login`
- Protects all api route calls except for `/login` & `/logout`.
