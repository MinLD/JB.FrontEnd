# Jobbod frontend profile

- Repository: https://github.com/Jobbod/Jobbod.git
- Branches: frontend/develop (service-only) → automatic promotion PR → staging (monorepo CI) → main (production CD).
- Stack: Next.js generated defaults, npm, src/app.
- Owner/release owner: repository owner Jobbod.
- Deployment authorized by the user in the bootstrap conversation on 2026-11-11.
- CI: integration tests on PRs into staging/main; selective Docker build/push and one SSH batch deploy on main only.
- Secrets: server-local runtime secrets; GitHub deployment key/host keys and a separate promotion token.
- Verification: npm run build; infrastructure integration and rollback checks during bootstrap.
- Runtime budget: app 4 GB RAM / 40 GB disk; infra 6 GB RAM / 99 GB disk.
- AI: no selected model, no model download; persistent cache reserved for later use.
- Parallel agents: 1. Token/cost telemetry unavailable.
