# Copilot Instructions for diagnostics-next

This project is a Next.js application using TypeScript, React, and Fluent UI components. It is structured for modular diagnostics UI development and robust CI/CD with Vercel and GitHub Actions.

## Architecture & Patterns

- **App Structure:**
  - Source code is in `src/`.
  - Main UI components: `BuildInfo.tsx`, `Configuration.tsx`, `Extension.tsx`, `Extensions.tsx`, `ServerInfo.tsx`, `StageDefinition.tsx`.
  - Shared logic and styles are in `utils.ts` (e.g., `useStyles`, type guards, helpers).
  - Types are colocated as `.types.d.ts` files or in `types.d.ts`.
  - The `app/` directory contains Next.js app entrypoints (`layout.tsx`, `page.tsx`).
- **Component Patterns:**
  - All UI uses [@fluentui/react-components](https://react.fluentui.dev/).
  - Components expect props typed via `*.types.d.ts`.
  - Use `useStyles` (from `utils.ts` or local) for styling.
  - Navigation and extension mapping use helpers: `isExtensionInfo`, `toNavLink`, `byKey`.
- **Testing:**
  - Tests are colocated in `src/__tests__/` and use Jest + React Testing Library.
  - Use a `FluentProvider` wrapper in tests for Fluent UI context.
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`, `npm run test:ci`.
  - Coverage output is in `coverage/`.

## Workflows

- **Development:**
  - Start dev server: `npm run dev` (Next.js, hot reload).
  - Main entry: `app/page.tsx`.
- **Build & Deploy:**
  - Build: `npm run build`.
  - Deploys use Vercel (`vercel.json`), blocking on test failures via `test:ci`.
  - CI: `.github/workflows/ci.yml` runs lint, tests, build, and uploads coverage to Codecov.
- **Linting:**
  - Run `npm run lint` (uses Next.js ESLint config).

## Conventions & Integration

- **TypeScript:**
  - All code is TypeScript-first. Avoid JS in `src/`.
  - Prefer explicit prop types and utility types.
- **Imports:**
  - Use `@/` alias for `src/` (see `jest.config.ts` and `tsconfig.json`).
- **External APIs:**
  - No direct API calls in UI; all data is passed as props (see `App.types.d.ts`).
- **Styling:**
  - Use Fluent UI's `makeStyles` for all custom styles.

## Key Files

- `src/utils.ts`: Shared helpers and styles.
- `src/__tests__/`: All test files.
- `jest.config.ts`, `jest.setup.ts`: Test config and setup.
- `vercel.json`, `.github/workflows/ci.yml`: Deployment and CI config.
- `TESTING.md`, `DEPLOYMENT_TESTING.md`: Project-specific testing and deployment docs.

For more, see `README.md`, `TESTING.md`, and `DEPLOYMENT_TESTING.md`.
