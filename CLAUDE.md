# CLAUDE.md

Guidance for Claude Code when modifying this repository. For repo layout, install steps, and user-facing usage, see `README.md` — this file covers only what's needed to safely *change* the repo.

## What This Repo Is

**brooks-lint** is a Claude Code Plugin for code-quality diagnosis grounded in twelve classic software engineering books. Six modes bundled under `skills/brooks-lint/` (PR Review, Architecture Audit, Tech Debt, Test Quality, Health Dashboard, Full Sweep) each produce findings in the Iron Law form: **Symptom → Source → Consequence → Remedy**.

## Harness: brooks-lint maintenance

**Goal:** drive changes *to brooks-lint itself* through a verified pipeline so manifests, evals, docs, and trigger boundaries never drift.

**Trigger:** when working ON the plugin — add/edit a skill or guide, refresh the eval suite, fix trigger descriptions, or cut a release — use the `brooks-harness` skill. It runs a sequential subagent pipeline (`.claude/agents/`): **skill-author → eval-curator → consistency-qa → trigger-boundary-auditor → release-manager**. Simple questions, or *using* the analysis skills on some target codebase, do not trigger it.

**Change history:**
| Date | Change | Target | Reason |
|------|--------|--------|--------|
| 2026-06-01 | Initial harness: 5-stage pipeline orchestrator + 4 new agents (skill-author, eval-curator, consistency-qa, release-manager), reusing trigger-boundary-auditor | `.claude/agents/`, `.claude/skills/brooks-harness/` | Pre-existing dev tools (new-skill, release, trigger-boundary-auditor) had no orchestrator wiring them together |

## Workflow Conventions

- **Direct-to-main workflow:** Pushes go to `main` without a PR. After Edit/Write, the global rule's `agent-skills:code-simplify` + `agent-skills:review` steps still run before commit; only the optional PR-only `code-review:code-review` step is skipped.
- **Doc sources of truth:** `package.json` is canonical for version; book inventory is canonical in `skills/brooks-lint/references/source-coverage.md` (see Gotchas for derivation). README.md, AGENTS.md, GEMINI.md, and CHANGELOG.md must stay in sync — `npm run validate` enforces this.
- **VS Code extension is OUT OF SCOPE.** Do not plan, propose, or reference VS Code extension features.

## Critical Gotchas

- **Skill sync after edit:** Use `bash scripts/install.sh claude` to copy the source bundle, or link `~/.claude/skills/brooks-lint` to `skills/brooks-lint/` for development.
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

## Parser-Fidelity Benchmark

`evals/benchmark-corpus.json` is a FROZEN corpus of 30 real, model-generated reports (one per curated sample, across all six modes) each paired with an independently-graded finding inventory. `scripts/benchmark.mjs` (`npm run benchmark`) runs the shipped parser (`report-parse.mjs` / `sarif.mjs`) against it and reports severity-count fidelity, risk-code precision/recall, and SARIF validity; `npm test` guards the same as a deterministic regression. This is distinct from the eval suite: it benchmarks the **parser/SARIF plumbing**, not model judgment. The corpus is a frozen artifact — regenerate it only by re-running the generation workflow and hand-checking the new ground truth; do NOT hand-edit `report` or `truth` to make a failing parser pass.

## Development Commands

```bash
npm run bump              # Propagate the package.json version to all manifests + every version-bearing text file (NOT changelog)
npm run validate          # Repo consistency: manifests, version refs, changelog, source inventory, skills structure
npm run changelog:audit   # Release-time: account for every commit since the last tag (see Release Process)
npm test                  # Unit tests for validate-repo helpers
npm run evals             # Eval structural validation (IDs, fields, risk-code refs)
npm run evals:live        # Live evals against the AI (requires ANTHROPIC_API_KEY)
npm run benchmark         # Parser-fidelity benchmark on the frozen real-report corpus
npm run history           # View Health Score trend (.brooks-lint-history.json)

# Test hooks locally
bash hooks/session-start                        # local branch
CLAUDE_PLUGIN_ROOT=1 bash hooks/session-start   # plugin platform branch
```

## Release Process

Set the new version in `package.json` (e.g. `npm version <v> --no-git-tag-version`), then `npm run bump` (propagates the version to all manifests plus every version-bearing text file listed by `scripts/version-refs.mjs` — all six README badges and the docs landing-page JSON-LD) → add the new `CHANGELOG.md` section by hand → **audit the commit range** (below) → `npm run validate` → commit, push, tag GitHub release.

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
