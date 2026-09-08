# BSH E-Procurement Demo - Agent Rules

## Project References

Before development, follow:

1. `docs/PRD-EXECUTION-SUMMARY.md` for normal implementation work.
2. `docs/BSH-EProcurement-Demo-PRD.docx` only when the summary does not contain enough detail or when exact PRD validation is required.

If anything conflicts, the full PRD is the source of truth.

## Working Method

- Build strictly phase-by-phase.
- Within each phase, build component-by-component.
- Complete and verify one scoped component before moving to the next.
- Implement only the requested scope.
- Do not refactor unrelated code.
- Do not add speculative features.
- Do not overengineer demo functionality.

## Architecture

Frontend:

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query + Axios
- React Hook Form + Zod
- Recharts

Backend:

- Laravel REST API
- PostgreSQL
- Lightweight modular monolith

## Folder Rules

- Business features: `frontend/src/features/`
- Shared UI: `frontend/src/components/ui/`
- App configuration: `frontend/src/app/`
- API access: `frontend/src/services/`
- Shared types: `frontend/src/types/`

Do not create folders or abstractions until they are actually needed.

## Coding Rules

- Keep code simple, typed and maintainable.
- Keep components focused and reusable where appropriate.
- Avoid duplicate logic and duplicate business data.
- Do not scatter hard-coded demo data across components.
- Use shared service/API boundaries for connected data.
- Remove unused imports, files and starter code.
- Do not leave lorem ipsum, debug content or broken client-visible actions.
- Do not add a dependency unless the current task requires it.

## Demo Rules

- Use Bangladesh Specialized Hospital PLC context.
- Use BDT for financial values.
- Use realistic hospital procurement terminology and data.
- Keep vendors, tenders, values and statuses consistent across modules.
- Simulate external enterprise services where the PRD specifies simulation.
- Do not present simulated capabilities as production integrations.

## Verification

After each scoped task:

1. Run the relevant build, test or validation command.
2. Fix errors introduced by the task.
3. Report only:
   - files changed
   - implementation completed
   - verification result
   - blocker, if any

Keep responses concise.
