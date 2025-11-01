# Cloud Storage FE

## Project structure
- `src/app` – app shell (routing, providers, layout)
- `src/components` – UI components (each in its own folder)
- `src/pages` – route pages
- `src/index.css` – Tailwind base, variants, keyframes

## Development
- Tailwind dark mode: class-based; toggle `html.dark` via `ThemeProvider`.
- Run: `npm i && npm run dev`

Component-specific guidelines live in each component’s `README.md` under `src/components/*`.
