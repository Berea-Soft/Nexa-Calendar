# Contributing to Nexa-Calendar

We love your input! We want to make contributing as easy as possible.

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Setup Development Environment

```bash
# Install dependencies
pnpm install

# Run the example app
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build:all
```

## Package Architecture

Nexa-Calendar uses a pnpm monorepo structure:

```
packages/
  core/     — Domain logic, types, services (zero UI deps)
  ui/       — Lit web components, Tailwind views
  react/    — React wrapper (@lit-labs/react)
  vue/      — Vue 3 wrapper
  angular/  — Angular wrapper
  svelte/   — Svelte wrapper
apps/
  example/  — Demo app with StackBlitz
```

## Code Style

- TypeScript strict mode
- Interfaces prefixed with `I` (e.g., `IEventSource`)
- Lit components: `nx-*` prefix (e.g., `nx-month-view`)
- Classes: `Nx*` prefix (e.g., `NxMonthView`)
- Private fields: `_` prefix in Lit

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Commits

We follow Conventional Commits. Please use:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Pull Requests

- Fill in the required template
- Do not submit unrelated changes
- Include tests for new features
- Update documentation for API changes

## License

By contributing, you agree that your contributions will be licensed
under the MIT License.

Report issues here: https://github.com/Berea-Soft/Nexa-Calendar/issues
