---
name: sweep
description: Use for an explicitly selected sweep of a scoped project or an explicitly requested bounded repair artifact.
metadata:
  skill_invocation_notation: >
    Top-level skill entrypoints use SKILL.md. Parent-scoped subskill entrypoints use
    SKILL-MAIN.md and are loaded explicitly through their parent; nested SKILL.md is
    accepted only as legacy input when SKILL-MAIN.md is absent.
    Skill and subskill entrypoints use bare object paths: `X` invokes skill X and
    `X->Y->Z` invokes subskill Z. Subcommands use parenthesized components:
    `X->cmd()` invokes a direct subcommand, `X->Y->cmd()` invokes a subcommand of
    subskill Y, and `X->parent()->child()` invokes child subcommand child exposed
    by parent subcommand parent. Intermediate subcommands act as object generators.
    Forms such as `X()` and `X->Y()` are invalid for skill or subskill entrypoints.
---

# Brooks Lint Full Sweep

## Overview

Run the four focused analysis and repair passes grounded in twelve classic engineering books, then report the health of the verified final snapshot.

## Workflow

1. Read the bundle references and resolve scope and authority. Apply Auto Scope Detection when no project or directory is supplied. Follow Steps 0–1 of the sweep guide for baseline, config, and bounded pipeline state.
2. Run the four repair passes in order. Follow Steps 2–5 of the guide for review, test, debt, and audit, using each focused guide at its pass.
3. Re-scan affected files and verify repairs. Follow Step 6 to retain user changes, stop at the applicable cap or disposition, and retire failed repairs under the guide's retry rules.
4. Deliver the Full Sweep report. Follow Steps 7–8, reuse the deduplicated evidence, and apply health's final snapshot and exact delivery rules. Use any explicitly requested artifact schema.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `Full Sweep`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/decay-risks.md`
4. `references/test-decay-risks.md`
5. `subskills/sweep/references/sweep-guide.md`
6. Focused guides at their pass: `subskills/review/references/pr-review-guide.md`, `subskills/test/references/test-guide.md`, `subskills/debt/references/debt-guide.md`, `subskills/audit/references/architecture-guide.md`, and `subskills/health/references/health-guide.md`

## Guardrails

- DO NOT apply an edit outside the permitted scope or without the required safety evidence.
- DO NOT revert changes made before this sweep.
- DO NOT declare a clean stop from the number of edits or from dashboard completeness alone.
