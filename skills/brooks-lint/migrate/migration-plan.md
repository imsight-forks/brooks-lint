# Brooks Lint Suite Migration

## Scope

Migrate the six standalone skills into one installable package on local `main`. The selected source is the working-tree snapshot in `org/src/`. The runtime destination is `skills/brooks-lint/`. This suite migration combines separate source modes and their common resources into one new parent.

## Source Behavior To Preserve

| Mode | Inputs and gates | Output |
| --- | --- | --- |
| Review | Explicit code or path, or staged, working-tree, then branch diffs. Establish governing obligation and witness before severity. Bound the Quick Test Check to applicable changes. | PR Review with scope, Iron Law findings, and the supported Health Score. |
| Audit | Directory, module, project, or incremental ref. Select the onboarding guide when requested. Keep source, runtime, and ownership evidence distinct. | Architecture Audit with dependency graph before findings, or Codebase Tour with onboarding sections. |
| Debt | Scoped inventory, history and obligations, and one relevant missing-evidence question if necessary. Inventory before Pain × Spread and intent classification. | Tech Debt Assessment with evidence-ranked findings and a Debt Summary. |
| Test | Existing test inventory and relevant production contract. Use discriminating comparisons and track sample limits. | Test Quality Review with suite map before findings and the supported Health Score. |
| Health | One evidence map, independent finding owners, dimension statuses, caps, and a reconciled score ledger. | Health Dashboard with one supported Composite Score and byte-exact verified delivery where required. |
| Sweep | Explicit scope and authority, user-work baseline, four repair passes, bounded re-scans, and a final health pass. | Full Sweep with fix log, stop reason, residuals, and the final dashboard, or the requested bounded artifact schema. |

Keep the project's configuration keys, defaults, history conditions, and report labels. Project evidence remains scoped to the actual files, diff, and declared boundary. Maintain existing read-only and authorized mutation boundaries.

## Target Runtime Shape

The parent `SKILL.md` owns explicit selection and progress to a single nested `SKILL-MAIN.md`. The previously distinct peer skills map to `subskills/review`, `subskills/audit`, `subskills/debt`, `subskills/test`, `subskills/health`, and `subskills/sweep`. Each owns its guide in `references/`. Health owns unchanged scoring and delivery scripts. The old shared directory becomes the parent's `references/`.

The parent owns the manual invocation metadata and Codex policy. The six old skill frontmatters and agent policy files are retained in provenance because their runtime roles are covered by the parent and rewritten mode entrypoints. Their old standalone discovery paths are replaced by the parent package.

## Term Adaptations

`brooks-lint->review` through `brooks-lint->sweep` select the original analysis modes. The legacy `brooks-*` names still identify the corresponding modes inside the parent and in command adapters. `brooks-lint->help()` lists the modes and their scopes.

## Tool And Harness Adaptations

Root the resource paths at the directory containing the installed parent `SKILL.md`. Use the host's existing Git, workspace, and optional Node capabilities. Preserve the scoring and delivery script APIs and their verified input/output contracts. Native installers and host registries select the single parent. CI and eval runners use the existing mode registry to assemble the relocated guides with their established runner-specific scope.

## Artifact And Storage Adaptations

Resolve code, Git state, `.brooks-lint.yaml`, and `.brooks-lint-history.json` from the selected target project. Retain output schemas, reports, and verification artifacts at their existing task-selected locations. Only skill-resource locations change.

## External Skill Route Adaptations

The review guide recommends the test subskill for systemic test findings. Sweep reads review, test, debt, audit, and health guides in its existing order inside the installed bundle. These routes share package resources. No external skill route requires a placeholder.

## Step Support Mapping

| Runtime step | Supporting resource |
| --- | --- |
| Resolve explicit invocation and route | Parent `SKILL.md` workflow, subskills table, and help contract. |
| Resolve scope and requested options | Parent `references/common.md` scope and project config sections, then the selected child entrypoint. |
| Establish evidence and disposition | The selected mode's guide in `subskills/<mode>/references/` and the selected shared risk definitions. |
| Check scoring and retained findings | The shared report template and severity rules, plus the mode-specific gates. |
| Apply and verify authorized edits | The sweep guide's baseline, repair classification, re-scan, reversal, and residual rules. |
| Deliver a verified dashboard | `subskills/health/references/score-ledger.md` and the unchanged health helpers. |

## Semantic Match Checks

Compare each source entrypoint and guide against its bundled counterpart. Preserve exact mode labels, programmatic IDs, risk codes, configuration names, report schema, and helper APIs. Check scope selection, the audit tour, the capped health ledger, and sweep's authorization and stop reasons. Validate that a fresh Skills CLI install holds all six child entrypoints, each referenced file, and the manual-only policy. The intended changes are the explicit parent routes, mode-local resource paths, and a single management entry.
