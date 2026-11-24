# GEMINI.md

This repository is an AI-powered code quality tool grounded in twelve classic engineering books (e.g., *The Mythical Man-Month*, *Code Complete*, *A Philosophy of Software Design*, *Software Engineering at Google*).

## Core Purpose
**brooks-lint** is a Gemini CLI extension used to diagnose code quality across twelve "decay risk" dimensions: six in production code (R1 Cognitive Overload, R2 Change Propagation, R3 Knowledge Duplication, R4 Accidental Complexity, R5 Dependency Disorder, R6 Domain Model Distortion) and six in the test suite (T1 Test Obscurity, T2 Test Brittleness, T3 Test Duplication, T4 Mock Abuse, T5 Coverage Illusion, T6 Architecture Mismatch).

## Skill Integration

Run Brooks Lint when the user explicitly selects the parent or runs one of the six existing slash-command adapters. Load `skills/brooks-lint/SKILL.md` and follow the routed `SKILL-MAIN.md`. Pass the original request and arguments through.

## Engineering Standards
- **Language:** Repo source and configuration stay in English for international consistency. Review output follows the user's language — see the "Language rule" in `skills/brooks-lint/references/common.md` (Iron Law field labels, book titles, and smell names stay in English even when the prose is translated).
- **The Iron Law:** NEVER suggest fixes before completing risk diagnosis. Every finding MUST follow: **Symptom → Source → Consequence → Remedy**.
- **Scoring System:** Base score 100, floor 0. Per-finding deductions depend on the `strictness` preset in `.brooks-lint.yaml` — `balanced` applies when the key is absent. Canonical table lives in `skills/brooks-lint/references/common.md`:

  | Preset | 🔴 Critical | 🟡 Warning | 🟢 Suggestion |
  |--------|------------|-----------|--------------|
  | `strict` | −20 | −8 | −2 |
  | `balanced` (default) | −15 | −5 | −1 |
  | `legacy-friendly` | −8 | −3 | −1 |

- **Project Config:** If a `.brooks-lint.yaml` exists in the project root, read and apply it before running any review mode — including `strictness`, which changes the weights above.
- **Workflow and guides:** Each `SKILL-MAIN.md` has a numbered `Workflow` that points to the detailed guide steps. `npm run validate` checks the workflow, routing, and guide-step continuity.
- **Explicit invocation:** Keep the parent manual-only in its frontmatter and `agents/openai.yaml`. Its `metadata.opencode/slash` flag exposes `/brooks-lint` in OpenCode v2.

## Project Structure
- `skills/brooks-lint/` contains the parent `SKILL.md`, shared `references/`, and six `subskills/<mode>/SKILL-MAIN.md` entrypoints.
- `commands/`: Short-form command adapters.
- `hooks/`: SessionStart hook for Claude Code session-level awareness.
- `evals/`: 64 scenarios across R1–R6 and T1–T6, including false-positive and tradeoff checks — `npm run evals` (structural), `npm run evals:live` (against the AI, needs `ANTHROPIC_API_KEY`). `evals/benchmark-corpus.json` is a frozen corpus of 30 real model-generated reports for the deterministic parser-fidelity benchmark: `npm run benchmark`.

## Runner Boundaries

All six modes remain available to interactive agents with the necessary project
access. The tool-less CI runner supports only `review` on a collected diff. API evals
cover supplied fixtures in the five read-only modes; `sweep` requires interactive
execution and is explicitly excluded from API eval pass rates. Deterministic eval
checks validate report structure and risk codes, not semantic correctness. See
`docs/runner-contracts.md` for the shared contracts.

## Release Preparation

Keep the six README translations, CHANGELOG, four plugin manifests, website metadata,
installation guides, and Action examples synchronized with `package.json` via
`npm run bump`. Apply GitHub About, topics, and managed labels from
`.github/repository-metadata.json` with `npm run github:metadata -- --apply`, then
verify with `npm run github:metadata -- --check`. Preserve unrelated issue labels.
Run the full offline gate, push, and require the exact commit's remote Validate
matrix to pass before any publication. Honor explicit user publication holds;
passing CI is not publication approval. Withdrawn npm versions cannot be reused.

## Development & Debugging
- **Skill Testing:** After modifying `skills/` locally, exit the Gemini CLI (`/quit`) and relaunch to pick up the changes.
- **Extension Installation:** Users can install the extension in the current workspace via `/extensions install .`.

---
**Note:** Gemini CLI should prioritize instructions found in `GEMINI.md` when operating in this repository.

## Codex Behavioral Evaluation

The opt-in `npm run evals:codex -- --model <model>` runner compares real Codex
behavior with and without skills across seven fixtures. It has separate semantic
judging and does not change the historical Anthropic API runner. Offline checks
use `npm run evals:codex:validate`; see `docs/codex-behavior-evals.md` for scope,
isolation, evidence, and limitations.
