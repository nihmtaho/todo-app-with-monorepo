
# AI Coding Agent Guide: todo-app Monorepo

## Architecture Overview
- The project uses Turborepo to manage a monorepo with multiple apps and packages.
- Main apps:
  - `apps/web`: Next.js app for the user interface.
  - `apps/docs`: Next.js app for internal documentation.
  - `apps/backend`: NestJS app, using nestjs-trpc to provide RPC-style APIs.
- Shared packages:
  - `packages/ui`: Shared React component library.
  - `packages/eslint-config`, `packages/typescript-config`: Shared lint and TypeScript config for the whole repo.

## Developer Workflow
- Install dependencies: Run `pnpm install` at the repo root.
- Build all apps/packages: `pnpm exec turbo build` or `turbo build` (if installed globally).
- Run individual apps:
  - Web: `pnpm --filter web dev`
  - Backend: `pnpm --filter backend start:dev`
- Test backend: `pnpm --filter backend test`, `test:e2e`, `test:cov`

## Project-Specific Conventions & Patterns
- All code uses TypeScript.
- Backend API uses nestjs-trpc; routers/services are in `apps/backend/src`.
- Data validation schemas use zod, e.g. `todo.schema.ts`.
- Decorators like `@Query`, `@Mutation`, `@Router` are used to declare RPC endpoints.
- Shared UI components are in `packages/ui/src`.
- Lint and TypeScript configs are inherited from shared packages; do not edit app configs directly.
- Always respond in Vietnamese (see `.github/instructions/respond.instructions.md`).

## Integrations & Dependencies
- Next.js for frontend, NestJS for backend, trpc for RPC communication.
- pnpm workspace for package management.
- turbo for concurrent build/test/lint across apps/packages.
- ESLint, Prettier, TypeScript are preconfigured.

## Example Code Patterns
- Backend router declaration:
  ```typescript
  @Router({ alias: 'todos' })
  export class TodoRouter {
    @Query({ ... })
    getAllTodos() { ... }
    @Mutation({ ... })
    createTodo(...) { ... }
  }
  ```
- Data validation with zod:
  ```typescript
  export const createTodoSchema = z.object({ ... });
  ```
- Import shared UI component:
  ```tsx
  import { Button } from '@repo/ui/src/button';
  ```

## Notes
- Do not include deleted or commented-out code in results.
- If creating config files, ensure they are complete and properly formatted.
- Always check shared packages before editing config.

---
Please respond if any section is unclear or if you need more details about workflow, conventions, or architecture.
