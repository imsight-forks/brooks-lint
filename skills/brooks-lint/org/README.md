# Brooks Lint Source Provenance

The snapshot preserves the local `main` working tree based on `7c1a6f3`, including the explicit-invocation policy edits. Each legacy entrypoint is stored as `SKILL-SOURCE.md`, with its bytes preserved. Every other source file retains its original relative path and contents.

| Snapshot directory | Copied content | Source inspection |
| --- | --- | --- |
| `src/brooks-review/` | Entrypoint, Codex policy, `pr-review-guide.md` | [PR Review](analysis/analysis-of-brooks-review.md) |
| `src/brooks-audit/` | Entrypoint, Codex policy, `architecture-guide.md`, `onboarding-guide.md` | [Architecture Audit](analysis/analysis-of-brooks-audit.md) |
| `src/brooks-debt/` | Entrypoint, Codex policy, `debt-guide.md` | [Tech Debt Assessment](analysis/analysis-of-brooks-debt.md) |
| `src/brooks-test/` | Entrypoint, Codex policy, `test-guide.md` | [Test Quality Review](analysis/analysis-of-brooks-test.md) |
| `src/brooks-health/` | Entrypoint, Codex policy, `health-guide.md`, `score-ledger.md`, `scripts/score-dashboard.mjs`, `scripts/deliver-dashboard.mjs` | [Health Dashboard](analysis/analysis-of-brooks-health.md) |
| `src/brooks-sweep/` | Entrypoint, Codex policy, `sweep-guide.md` | [Full Sweep](analysis/analysis-of-brooks-sweep.md) |
| `src/_shared/` | Common scoring, configuration, source coverage, production and test definitions, remedy mode, and custom risks | Read by the mode inspections as applicable. |

The source boundary is the six standalone skill folders and their shared references. Repository installers, plugins, hooks, and runners belong to the integration migration outside this snapshot.

[Migration plan](../migrate/migration-plan.md)
