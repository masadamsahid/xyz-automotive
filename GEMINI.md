# Project Context: XYZ Automotive

This is a full-stack monorepo for **XYZ Automotive**, a platform for managing automotive products. The project consists of a high-performance backend built with **Elysia.js** and a modern frontend using **Next.js**.

## Project Structure

- `backend/`: The Elysia.js API server.
- `frontend/`: The Next.js web application.

## Key Technologies

### Backend
- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Elysia.js](https://elysiajs.com/) (RESTful API, TypeBox validation)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Documentation:** [Swagger/OpenAPI](https://elysiajs.com/plugins/swagger.html) via `@elysiajs/openapi`

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) on **React 19**
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **API Client:** [Elysia Eden Treaty](https://elysiajs.com/eden/overview.html) for end-to-end type safety
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Building and Running

### Backend
To set up and run the backend:
```bash
cd backend
bun install
bun run dev
```
The server runs on `http://localhost:3000` with hot-reloading.

**Database Operations:**
- Generate Drizzle migrations: `bun run db:generate`
- Push schema changes to DB: `bun run db:push`
- Seed the database: `bun run db:seed`

### Frontend
To set up and run the frontend:
```bash
cd frontend
bun install
bun run dev
```
The application runs on `http://localhost:3001` (or next available port).

---

## Development Conventions

### Code Style
- **Indentation:** Use 2 spaces for indentation throughout the project.

### API Design
- **Type Safety:** Use Elysia's `t` (TypeBox) for all request body, query, and parameter validation.
- **Plugins:** Prefer using Elysia.js plugins for extending functionality (e.g., Swagger, CORS).
- **Versioning:** API is currently at `v1.0.0`.

### Database
- **Schema:** Managed in `backend/src/db/schema.ts`. Use `drizzle-kit` for migrations.
- **Connection:** Uses `postgres.js` as the driver. Environment variable `DATABASE_URL` is used for the connection string.

### Frontend Development
- **Core Styles:** Do NOT modify `frontend/src/app/globals.css`. All styling should be done via Tailwind utility classes and theme variables defined in that file.
- **Server Components First:** Prioritize using React Server Components (RSC) for all parts of the application.
- **Client Component Restrictions:** 
  - Do NOT use the `'use client'` directive in `page.tsx` or `layout.tsx`.
  - Avoid client components whenever possible. Only use them when interactivity (e.g., hooks, event listeners) is strictly required.
- **Tailwind CSS:** Follow Tailwind CSS v4 patterns.
- **Components:** Use Shadcn UI components located in `src/components/ui/`.
- **API Interaction:** Always use the `client` from `src/lib/api/edent-treaty.ts` to ensure type safety between the frontend and backend.

### Shared Types
- Export the `BackendApp` type from `backend/src/index.ts` to be used by Eden Treaty in the frontend for full type inference.
