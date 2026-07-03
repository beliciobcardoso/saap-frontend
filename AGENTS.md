# AGENTS.md — saap-frontend

## Stack

Vue 3 + TypeScript + Vite 8 SPA. Tailwind CSS 3 (`@tailwindcss/forms`). TanStack Query v5 (server state). Pinia (auth/ui stores). Vue Router (guards + role-based access). Axios with JWT interceptors. pnpm.

Backend: Spring Boot at `localhost:8080`. Frontend proxies `/api` to it.

## Commands

```bash
pnpm dev          # Vite dev server at :5173, proxies /api → localhost:8080
pnpm build        # vue-tsc -b && vite build
pnpm lint         # ESLint flat-config disabled (ESLINT_USE_FLAT_CONFIG=false)
```

No `test`, `typecheck`, or `test:ui` scripts in package.json despite vitest being installed. `pnpm build` runs vue-tsc which serves as typecheck.

## Pre-commit

Husky + lint-staged. On commit: `eslint --fix` on `*.{js,jsx,ts,tsx,vue}`, `prettier --write` on `*.{json,css,scss,md}`.

## Code Style

Prettier: semicolons, single quotes, trailing commas (es5), 80 cols, 2-space indent, no arrow parens, LF line endings. Tailwind utility classes. CSS custom properties (not Tailwind theme) for design tokens — see `src/styles/tokens.css`.

## Path Aliases

`@/` → `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`.

## Layout System

App.vue switches layout via `route.meta.layout`:
- `auth` → AuthLayout (login, no sidebar)
- `queue` → QueueLayout (full-screen queue display)
- `none` → no layout wrapper
- default → AppLayout (sidebar + topbar)

## Auth & Roles

JWT stored in `localStorage` as `saap_token`. Decoded client-side for `userRole`. Router guard redirects unauthenticated to `/login?redirect=`. Role-based route access via `meta.roles`.

Roles: `ADMIN`, `RECEPTIONIST`, `PROFESSIONAL`, `ASSISTANT`, `PATIENT`.

Permission checks in `src/composables/usePermissions.ts` — mirrors backend `@PreAuthorize`.

## Architecture

```
src/
  api/          # Axios functions per resource (one file per domain)
    client.ts   # apiClient instance, JWT interceptors, getApiErrorMessage()
    types.ts    # All DTOs — mirrors Spring Boot DTOs exactly
  composables/
    queries/    # useQuery hooks (one per resource)
    mutations/  # useMutation hooks (one per resource)
    queryKeys.ts # Centralized TanStack query keys
  stores/       # Pinia: auth.ts (JWT), ui.ts (sidebar state)
  pages/        # Route-level components (lazy-loaded)
  components/
    ui/         # Design system atoms (AppButton, AppInput, etc.)
    shared/     # PriorityBadge, StatusBadge, UserAvatar, etc.
    layout/     # AppSidebar, AppTopbar, AppBreadcrumb
    {domain}/   # Feature components per domain
  styles/       # tokens.css, typography.css, animations.css, global.css
```

## Data Flow

API functions → TanStack Query composables (queries/mutations) → Vue components. Mutations invalidate relevant query keys on success. Toasts via `vue-sonner`.

## Key Conventions

- Portuguese UI text throughout (labels, toasts, status names)
- Priority levels P1–P5 with dedicated CSS variables (`--color-p{1-5}-*`)
- Status flow: PENDING → CONFIRMED → ARRIVED → CALLING → IN_PROGRESS → COMPLETED (plus CANCELLED, NO_SHOW)
- All IDs are UUIDs (strings)
- `src/api/types.ts` is source of truth for DTOs — must match backend exactly
- `DOCS/DESIGN_SYSTEM.md` — full design spec, component specs, and layout wireframes

## Environment

`.env.development`: `VITE_API_BASE_URL=http://localhost:8080`
`.env.production`: `VITE_API_BASE_URL=https://api.saap.belloinfo.com.br`

## Gotchas

- `build` script includes `vue-tsc -b` (project references mode) — build will fail on TS errors
- ESLint runs with flat config disabled explicitly (`ESLINT_USE_FLAT_CONFIG=false`)
- No test runner configured in scripts despite vitest + jsdom being in devDeps
- `@tailwindcss/forms` plugin is loaded — form elements have base styles applied
- `float` import: `floating-vue` for tooltips/popovers
- `jwt-decode` v4 — named export `jwtDecode`, no default export
