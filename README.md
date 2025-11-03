# Cloud Storage FE

## Project structure
```
.
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ eslint.config.js
├─ public/
│  └─ vite.svg
└─ src/
   ├─ main.tsx
   ├─ index.css
   ├─ app/
   │  ├─ providers/
   │  │  ├─ RouterProvider.tsx
   │  │  ├─ ThemeProvider.tsx
   │  │  └─ QueryProvider.tsx
   │  ├─ router/
   │  │  ├─ index.tsx
   │  │  ├─ root.tsx
   │  │  └─ segments/
   │  │     ├─ app.tsx
   │  │     ├─ auth.tsx
   │  │     ├─ public.tsx
   │  │     └─ sample.tsx
   │  ├─ layout/
   │  │  ├─ AppLayout.tsx
   │  │  └─ AuthLayout.tsx
   │  └─ pages/
   │     ├─ index.tsx
   │     ├─ home.tsx
   │     ├─ auth/
   │     │  ├─ login.tsx
   │     │  └─ register.tsx
   │     ├─ redirects/
   │     │  └─ RedirectToHome.tsx
   │     └─ samples/
   ├─ api/
   │  ├─ config/
   │  │  ├─ axios.ts
   │  │  └─ env.ts
   │  ├─ core/
   │  │  ├─ auth-key.ts
   │  │  ├─ error.ts
   │  │  ├─ fetcher.ts
   │  │  ├─ guards.ts
   │  │  ├─ qs.ts
   │  │  ├─ types.ts
   │  │  └─ upload.ts
   │  ├─ features/
   │  │  └─ auth/
   │  │     ├─ auth.api.ts
   │  │     ├─ auth.mutations.ts
   │  │     ├─ auth.schemas.ts
   │  │     └─ auth.types.ts
   │  └─ query/
   │     ├─ client.ts
   │     └─ keys.ts
   ├─ components/
   │  ├─ Alert/ ...
   │  ├─ Button/ ...
   │  ├─ Card/ ...
   │  ├─ Dialog/ ...
   │  ├─ FileCard/ ...
   │  ├─ FileList/ ...
   │  ├─ FormCard/ ...
   │  ├─ FormGroup/ ...
   │  ├─ Loading/ ...
   │  ├─ MDX/ ...
   │  ├─ Navbar/ ...
   │  ├─ NavGroup/ ...
   │  ├─ Offcanvas/ ...
   │  ├─ Sidebar/ ...
   │  ├─ StorageUsage/ ...
   │  └─ Subnav/ ...
   ├─ contexts/
   │  └─ SidebarContext.tsx
   ├─ constants/
   │  └─ sizing.ts
   ├─ data/
   │  ├─ icons/
   │  └─ sample-data.mock.ts
   ├─ lib/
   │  └─ highlight.ts
   └─ utils/
      └─ clipboard.ts
```

## Folder purposes
- **src/app**: app shell (layout, routing, providers, pages)
  - **providers**: global providers (`RouterProvider`, `ThemeProvider`, `QueryProvider`).
  - **router**: router config, root, and route segments (public/app/auth/sample).
  - **layout**: page layouts (`AppLayout`, `AuthLayout`).
  - **pages**: route components (public home, app index, auth, samples, redirects).
- **src/api**: API layer and React Query setup
  - **config**: axios instance, env helpers.
  - **core**: cross-cutting helpers (`auth-key`, `error`, `fetcher`, `guards`, `qs`, `types`, `upload`).
  - **features/auth**: auth endpoints, schemas, types, mutations.
  - **query**: React Query client and key factory.
- **src/components**: reusable UI components (Alert, Button, Navbar, Sidebar, ...).
- **src/contexts**: React contexts (e.g., `SidebarContext`).
- **src/constants**: constants (e.g., `sizing`).
- **src/data**: static assets/mocks (icons, `sample-data.mock.ts`).
- **src/lib**: library helpers (e.g., `highlight`).
- **src/utils**: utility helpers (e.g., `clipboard`).
- **src/index.css**: Tailwind base, components, utilities, dark mode variants.
- **src/main.tsx**: app entry; mounts providers and router.
- **public/**: static files served as-is.

## Notes
- Routing guards: unauthenticated users only access `/auth/*` (via `AuthLayout`); others redirect to `/auth/login`.
- Development: `npm i && npm run dev`.
- Tailwind: class-based dark mode; toggle `html.dark` in `ThemeProvider`.
