# XYZ Automotive

A high-performance full-stack monorepo for managing automotive parts, categories, and brands. Built with speed and type-safety as core principles.

## 🚀 Tech Stack

### Backend
- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Elysia.js](https://elysiajs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL
- **API Documentation:** Swagger/OpenAPI (built-in)

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **API Client:** [Elysia Eden Treaty](https://elysiajs.com/eden/overview.html) (End-to-end type safety)
- **Time Management:** Moment.js

## 📂 Project Structure

```text
.
├── backend/            # Elysia.js API Server
│   ├── src/
│   │   ├── db/         # Schema and Database Configuration
│   │   └── index.ts    # Main API Entry Point
│   └── package.json
├── frontend/           # Next.js Web Application
│   ├── src/
│   │   ├── app/        # Pages and Layouts (RSC)
│   │   ├── components/ # Shared UI Components
│   │   └── lib/        # API Client and Utilities
│   └── package.json
└── GEMINI.md           # Instructional Context for AI Agents
```

## 🛠️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A running PostgreSQL instance.

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd xyz-automotive
   ```

2. **Configure Backend:**
   Create a `.env` file in the `backend/` directory or use the default connection string in `src/db/index.ts`.
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/xyz_automotive
   ```

3. **Install Dependencies:**
   ```bash
   # Root level
   cd backend && bun install
   cd ../frontend && bun install
   ```

4. **Prepare Database:**
   ```bash
   cd backend
   bun run db:push
   bun run db:seed
   ```

### Running the Project

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
bun run dev
```
*API will be running at `http://localhost:3000`*

**Terminal 2 (Frontend):**
```bash
cd frontend
bun run dev
```
*App will be running at `http://localhost:3001`*

## 📖 Key Features

- **Full CRUD:** Manage products, categories, and brands seamlessly.
- **Advanced Filtering:** Filter products by price range, stock, category, and brand.
- **Dynamic Sorting:** Sort products by price, stock, or creation date.
- **Server-Side Rendering:** Optimized performance using Next.js Server Components.
- **Type Safety:** Shared types between backend and frontend via Eden Treaty.
- **Theme Support:** Native Dark/Light mode support.

## 🤝 Development Conventions

Refer to [GEMINI.md](./GEMINI.md) for detailed development mandates, including coding styles, Server Component priorities, and theme-specific guidelines.
