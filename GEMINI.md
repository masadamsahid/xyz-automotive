# Project Context: XYZ Automotive Backend

This project is a backend application for XYZ Automotive, built with **Elysia.js** and running on the **Bun** runtime. It is a lightweight, high-performance API server.

## Project Structure
- `backend/`: Contains the Elysia.js server.
  - `src/index.ts`: The main entry point for the server.
  - `package.json`: Project metadata and script definitions.
  - `bun.lock`: Bun lockfile for dependency management.
  - `tsconfig.json`: TypeScript configuration.

## Key Technologies
- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Elysia.js](https://elysiajs.com/)
- **Language:** TypeScript

## Commands

### Setup
To install dependencies:
```bash
cd backend
bun install
```

### Running the Application
To start the development server with hot-reloading:
```bash
cd backend
bun run dev
```
The server runs on `http://localhost:3000` by default.

### Testing
Currently, no tests are configured. To run tests when they are added:
```bash
cd backend
bun test
```

## Development Conventions
- **Framework:** Prefer using Elysia.js plugins for extending functionality (e.g., Swagger, CORS, JWT).
- **Runtime:** Use Bun's built-in tools for testing, bundling, and running the application.
- **Code Style:** Follow standard TypeScript and Elysia practices as established in `src/index.ts`.
- **Validation:** Utilize Elysia's built-in schema validation (powered by `typebox`) for request/response typing.
