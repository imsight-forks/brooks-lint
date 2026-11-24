# AGENTS.md

This repository is an AI-powered code quality tool grounded in twelve classic engineering books (e.g., *The Mythical Man-Month*, *Code Complete*, *A Philosophy of Software Design*, *Software Engineering at Google*).

## Core Purpose
**brooks-lint** is a portable Agent-Skills code quality tool — it runs on any Agent-Skills-compatible agent (Codex CLI, OpenCode, Cursor, Antigravity, pi, and others that read `AGENTS.md` and load `SKILL.md` skills) to diagnose code quality across twelve "decay risk" dimensions: six in production code (R1 Cognitive Overload, R2 Change Propagation, R3 Knowledge Duplication, R4 Accidental Complexity, R5 Dependency Disorder, R6 Domain Model Distortion) and six in the test suite (T1 Test Obscurity, T2 Test Brittleness, T3 Test Duplication, T4 Mock Abuse, T5 Coverage Illusion, T6 Architecture Mismatch).

## Skill Integration
- **Manual invocation:** Run Brooks Lint when the user explicitly selects it. In Codex, use `$brooks-lint brooks-lint->review` and pass the desired scope.

## Engineering Standards
- **Comment Preference:** All internal documentation and configuration should remain in English for international consistency.
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
- `.codex-plugin/`: Plugin metadata for Codex CLI installation.
- `hooks/`: SessionStart hook for session-level awareness (not used by Codex CLI).
- `commands/`: Short-form command wrappers for Claude Code (not used by Codex CLI).
- `evals/`: 64 scenarios across R1–R6 and T1–T6, including false-positive and tradeoff checks — `npm run evals` (structural), `npm run evals:live` (against the AI, needs `ANTHROPIC_API_KEY`). `evals/benchmark-corpus.json` is a frozen corpus of 30 real model-generated reports for the deterministic parser-fidelity benchmark: `npm run benchmark`.

---
**Note:** Codex CLI should prioritize instructions found in `AGENTS.md` when operating in this repository.


## Maintainer Testing Policy

The maintainer's Claude account has been banned. From 2026-10-16 onward,
maintainer testing and verification cover only Codex-related capabilities.
Other platform verification is historical; keep existing integrations available,
but do not claim they are currently maintainer-tested. Community verification
and contributions remain welcome. Continue running the repository's offline
validation, unit tests, structural evals, and parser benchmark as applicable.
Do not run Anthropic live evals as part of routine maintainer verification;
changing the live evaluation provider requires a separate implementation change.

## Codex Maintenance Workflow

Use `$brooks-harness` for changes to this repository's skills, framework, evals,
maintenance tooling, or releases. Repository maintenance skills live in
`.agents/skills/`; custom Codex agents live in `.codex/agents/`. Agents inherit
the current session's model and permissions. Do not request Claude's `opus` model
or use Claude-only `Agent` / `Skill` tools. Read the selected SKILL.md and use the
available Codex collaboration tools.

- Run `npm run validate`, `npm test`, and `npm run evals` before handing off changes.
  Codex does not use `.claude/settings.local.json`; the Claude PostToolUse hook
  is not a substitute for this explicit verification gate.
- Use the source bundle under `skills/brooks-lint/`. The `.agents/skills/brooks-lint` link exposes it for local development.
- Keep existing unrelated changes intact. Stage only task-owned changes.
- Version comes from `package.json`; book inventory comes from
  `skills/brooks-lint/references/source-coverage.md`; version-bearing text files come from
  `scripts/version-refs.mjs`.
- VS Code extension work is outside this repository's scope.
- `npm run evals:live` currently uses Anthropic and needs `ANTHROPIC_API_KEY`.
  Structural evals and the parser benchmark work offline; switching the live
  evaluation provider requires a separate implementation change.

The reference below preserves release checks and platform compatibility details.
Claude-specific hooks and commands apply only to the Claude platform;
for Codex use the repository skills and explicit verification gate above.

## Maintainer Reference (Migrated from Claude Code)

- **Skill sync after edit:** Codex loads this checkout through `.agents/skills/` symlinks. Update `skills/` directly; do not copy into an installed cache. If a newly added skill is not visible, start a new Codex session.
- **Workflow and guides:** Each `SKILL-MAIN.md` has a numbered `Workflow` that points to the detailed guide steps. `npm run validate` checks the workflow, routing, and guide-step continuity.
- **Explicit invocation:** Keep the parent manual-only in its frontmatter and `agents/openai.yaml`. Its `metadata.opencode/slash` flag exposes `/brooks-lint` in OpenCode v2.
- **Book count is derived, never hardcoded:** `validate-repo.mjs` reads `source-coverage.md` frontmatter and derives `sourceCount` from it. Adding a book = update the frontmatter list + add the corresponding section; the validator auto-adapts.
- **`package.json` is ESM:** `"type": "module"` enables ESM for everything in `scripts/`. Skills are plain markdown — no bundling.
- **Slash commands:** The plugin registers `/brooks-lint:brooks-lint`. The SessionStart hook installs the six existing short commands. Each command reads the parent `SKILL.md` directly and forwards its original arguments to the corresponding subskill. The hook resolves `${CLAUDE_PLUGIN_ROOT}` for user-installed wrappers.
- **Codex manifest:** Keep `"commands": []` to prevent the Codex CLI from migrating Claude command adapters into extra discoverable skills.
- **GitHub Action cache:** `.github/actions/brooks-lint/action.yml` uses `actions/cache@v6` with built-in cache-hit guard — do NOT add a manual directory check.
- **Adding a platform is derived, not hardcoded:** create `docs/<name>-setup.md`, add the platform to `install.sh`'s `PLATFORMS` **and** both `global_dir()` / `project_dir()` case tables, then link the new guide from every `README*.md` and `docs/getting-started.md` **and** add the name to each of those documents' `<platform> = …` enumeration (the `<平台> = …` line in the zh translations). That enumeration must list every `PLATFORMS` entry, `claude` included — it is the one spot a platform has to be spelled out, since a bare mention elsewhere is worthless as a check (`~/.bob/skills` in a table row already contains "bob"). `npm run validate` derives all three sides (`scripts/platforms.mjs`) and fails on any gap — a guide missing from one translation, a `PLATFORMS` entry with no directory mapping, or a platform absent from one document's enumeration. Do not add a hand-maintained platform list anywhere.
- **Star history is data-first, never hand-drawn:** `assets/star-history.json` (raw `starred_at` timestamps, no usernames) is the source of truth; `assets/star-history.svg` is a pure function of it. Never hand-edit the SVG — `npm run validate` re-renders and fails on any mismatch. `node scripts/gen-star-history.mjs` refetches (needs `GITHUB_TOKEN` or `gh auth`, since GitHub restricted the stargazers API to admins/collaborators on 2026-06-30); `--render-only` redraws offline from the committed data. The render must stay deterministic — anchoring the time axis to the clock would make the weekly workflow commit noise on every run.
- **Custom risks:** Teams add project-specific risk codes via `custom-risks-guide.md` in their project root. Template lives at `skills/brooks-lint/references/custom-risks-guide.md`.

## How the Skill Works

1. Select the parent manually with the host’s skill command or use a retained native slash adapter.
2. Load the parent `SKILL.md`, then the selected `SKILL-MAIN.md` and its references.
3. Use the selected mode’s evidence checks and reporting contract.

## Adding a Mode

1. Create `skills/brooks-lint/subskills/<mode>/SKILL-MAIN.md` with the Imsight invocation metadata, Overview, numbered Workflow, and Guardrails. Keep detailed steps in that mode’s `references/` directory.
2. Add the route to the parent `SKILL.md` and register the mode and guides in `scripts/modes.mjs`.
3. Add a happy-path and false-positive scenario to `evals/evals.json`, then run `npm run validate`, `npm test`, and `npm run evals`.
4. Load the parent in a fresh session, invoke the mode, and verify its report against the tool and output contracts.

## Eval Suite

`evals/evals.json` contains 64 benchmark scenarios covering R1–R6 (code decay) and T1–T6 (test decay), including false-positive / tradeoff cases that must NOT be flagged. Each scenario has `id`, `name`, `prompt`, `expected_output`, `mode`, `files`. Optional boundary settings (mutually exclusive): `no_risk_codes: true` (no findings allowed), `no_health_score: true` (Health Score suppression test), or `forbidden_risk_codes: [R5]` (only those codes are forbidden; other findings are permitted).

To add a scenario: append to the `evals` array with the next sequential `id` and the relevant risk code. Validate structure with `npm run evals`; live-test with `npm run evals:live` (requires `ANTHROPIC_API_KEY`).

`expected_output` should describe the Iron Law finding (Symptom + risk code) and a Health Score range; it does NOT need to be verbatim. The deterministic evaluator checks report structure and finding risk codes, not semantic truth or whether the evidence establishes the diagnosis. Human or semantic review is still needed for those claims. For entirely clean false-positive / tradeoff scenarios, set `no_risk_codes: true`; use `forbidden_risk_codes` for targeted exclusions.

The API eval runner diagnoses supplied fixtures in `review`, `audit`, `debt`, `test`,
and `health`. It explicitly skips `sweep` scenarios in default runs and excludes them
from pass-rate denominators; selecting unsupported scenarios explicitly is an error.
Full Sweep needs an interactive execution environment. The CI runner supports only
`review` on a collected diff. See `docs/runner-contracts.md` for scope and input rules.

## Codex Behavioral Evaluation

`npm run evals:codex -- --model <model> --runs 3` is an opt-in, real Codex CLI
comparison against a no-skill baseline. Seven independent fixtures cover review,
audit, test, and non-trigger controls. It measures observed skill reads, semantic
completion, false positives, recall, and explicit severity calibration. Separate
model judging is not human validation. `npm run evals:codex:validate` is offline;
raw runs are ignored. See `docs/codex-behavior-evals.md` for isolation, evidence,
limitations, and authentication. Never run live evaluation as an implicit offline
validation step. The historical Anthropic runner remains separate.

## Parser-Fidelity Benchmark

`evals/benchmark-corpus.json` is a FROZEN corpus of 30 real, model-generated reports (one per curated sample, across all six modes) each paired with an independently-graded finding inventory. `scripts/benchmark.mjs` (`npm run benchmark`) runs the shipped parser (`report-parse.mjs` / `sarif.mjs`) against it and reports severity-count fidelity, risk-code precision/recall, and SARIF validity; `npm test` guards the same as a deterministic regression. This is distinct from the eval suite: it benchmarks the **parser/SARIF plumbing**, not model judgment. The corpus is a frozen artifact — regenerate it only by re-running the generation workflow and hand-checking the new ground truth; do NOT hand-edit `report` or `truth` to make a failing parser pass.

## Development Commands

```bash
npm run bump              # Propagate the package.json version to all manifests + every version-bearing text file (NOT changelog)
npm run validate          # Repo consistency: manifests, version refs, changelog, source inventory, skills structure
npm run changelog:audit   # Release-time: account for every commit since the last tag (see Release Process)
npm test                  # Unit tests for validate-repo helpers
npm run evals             # Eval structural validation (IDs, fields, risk-code refs)
npm run evals:live        # Historical Anthropic evals (requires ANTHROPIC_API_KEY)
npm run evals:codex:validate # Offline real-Codex fixture validation
npm run evals:codex -- --model <model> # Opt-in paired Codex behavioral comparison
npm run benchmark         # Parser-fidelity benchmark on the frozen real-report corpus
npm run history           # View Health Score trend (.brooks-lint-history.json)

# Test hooks locally
bash hooks/session-start                        # local branch
CLAUDE_PLUGIN_ROOT=1 bash hooks/session-start   # plugin platform branch
```

## Release Process

Before publication, synchronize all README translations, CHANGELOG, plugin manifests,
version-bearing website and Action examples, installation guides, and GitHub About,
topics, and managed issue labels. `npm run bump` propagates versions;
`npm run github:metadata -- --apply` applies `.github/repository-metadata.json`, and
`npm run github:metadata -- --check` verifies it without changing unrelated labels.
Commit and push, then wait for the exact commit's `Validate` workflow to pass on
all matrix jobs. Run `npm run release:ci`; local checks alone never permit publication.
Honor any explicit publication hold: a green CI is not approval to publish.
Withdrawn npm package versions cannot be reused, even if GitHub tags are removed.


Set the new version in `package.json` (e.g. `npm version <v> --no-git-tag-version`), then `npm run bump` (propagates the version to all manifests plus every version-bearing text file listed by `scripts/version-refs.mjs` — all six README badges and action `uses:` pins, the docs landing-page JSON-LD, and `docs/github-action-example.yml`) → add the new `CHANGELOG.md` section by hand → **audit the commit range** (below) → `npm run validate` → commit, push, tag GitHub release.

**Check the version number against the backlog first.** The bump is decided by what is *unreleased*, not by the size of the change in front of you. `npm run changelog:audit` prints the range before you choose the number — a "small doc fix" on top of an unreleased new platform is a minor, not a patch. v1.5.1 was cut, then deleted and re-cut as v1.6.0 for exactly this reason.

**Audit the commit range against the changelog — every commit, no sampling.** `npm run changelog:audit` (`scripts/changelog-audit.mjs`) derives the range from the last release tag (`v[0-9]*`) and prints it as a checklist to walk, with three exemptions applied for you: the release bump itself, a merge commit (its branch commits are listed separately), and the weekly star-history refresh — a `[bot]` author's commit touching only the files `gen-star-history.mjs` exports as `STAR_HISTORY_FILES`. That last one is judged by what the commit *changed*, not by its subject: `[bot]` plus `chore:` was wide enough to exempt a `dependabot[bot]` `chore(deps): bump …`, and a dependency bump is a change this changelog records. **Nothing else is exempt** — internal hardening with no user-visible behavior change (a new validator check, a test-only guard) earns an entry, and so does a maintainer-facing doc fix from an outside contributor, who gets credited by `@handle` like any other.

Between releases the command reports the same range as the *next* release's backlog and exits 0; it only enforces while a release is in progress, because nobody edits a section that already shipped.

The script fails on the one gap it can *prove*: a pull request merged in the range whose `#N` the section never cites. `checkChangelogCoverage()` runs that same check inside `npm run validate`, but **only while a release is in progress** — derived as "`package.json`'s version has no `v<version>` tag yet", so it is a no-op during normal work and unskippable at the one moment it matters. It needs tags, which is why `validate.yml` checks out with `fetch-depth: 0`. It says what it did on stdout every run — `Changelog coverage: not audited — <reason>.` when it stands down, and `audited <n> commits in <range> — pull-request citations only; walk the rest` when it does not. A gate whose off-state looks like a pass is the silence this check exists to remove, and a pass that claims more than it checked is the other half of it. Everything else on the checklist is judgment and stays yours.

**Do not read a green audit as proof the changelog is complete.** Three things it cannot see, by construction:
- **A bare number anywhere clears the gate.** Citation is matched as `#N` or a `/pull/N` link *anywhere in the section* — including a mention in passing, which is the exact 1.6.0 trap ("it reads as prior state when a later entry mentions it"). The check proves the number was written, not that an entry was written.
- **A rebase-merged PR is invisible.** It leaves neither a `(#N)` subject nor a merge commit, so it is an ordinary checklist line with nothing enforced behind it.
- **Whatever rides along in the release bump is never audited.** Step 5 stages everything `npm run bump` rewrote, and step 4 says "fix and re-run until clean" — so a fix made during validation lands inside the exempt commit and no release ever sees it. Land such fixes as their own commit before bumping.

**A commit that defers its changelog entry says so in a `Changelog:` trailer**, so the audit can surface it in the checklist:

```
Changelog: added — platform docs and installer mappings are cross-checked
```

Use it when a change lands without a version bump. A trailer rather than a sentence in the body, because prose cannot tell a commit deferring its own entry from one quoting another commit that did. This is what 1.6.0 got wrong twice: `d4b5c40` asked in plain prose to be logged in the next release and was missed anyway, and PR #25 went uncredited in a release that credited two other contributors. Both were found only by auditing after publishing.

## Mandatory Commit and Push

- After completing any code, documentation, or configuration change, run the applicable checks, commit all task-owned changes, and push the commit to the current branch's remote before handing off. This is standing authorization; do not ask for confirmation each time.
- Preserve unrelated uncommitted changes and exclude them from the commit. Never force-push.
- If checks, commit, or push fail, report the failure clearly; do not claim completion or bypass checks.
- Creating tags and publishing releases still require an explicit release request.
