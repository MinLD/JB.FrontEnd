# Project integration rules

Backend owns PostgreSQL schema and migrations. AI has no direct database ownership.
Production configuration is owned centrally in monorepo deploy/. Never commit real
secrets or model weights. Service-only develop branches feed generated promotion
PRs into staging; staging/main contain the monorepo. CI tests PR merge results with
disposable infrastructure. Only main publishes/deploys affected application images.
Do not merge a service-root branch directly into staging/main, or edit generated
promote/* branches. CI/CD branches are historical and inactive. Do not weaken
existing repository protections.
