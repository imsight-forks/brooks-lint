---
name: review
description: Use for a diff, supplied files, or existing code selected for a scoped change review.
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

# Brooks Lint PR Review

## Overview

Review changed behavior and structure against the production risk definitions grounded in twelve classic engineering books.

## Workflow

1. Read the bundle references and resolve scope. Honor explicit files or pasted code. Otherwise apply Auto Scope Detection in `references/common.md`.
2. Establish the review contract and scan production risks. Follow Steps 1–6 of the review guide. Retain the governing obligation, a discriminating witness, and the repair check for supported findings.
3. Run the bounded Quick Test Check where production logic changes. Follow Step 7 of the guide and keep independently supported test consequences distinct.
4. Return the scoped PR Review. Apply the Iron Law and shared report template.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `PR Review`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/decay-risks.md`
4. `references/test-decay-risks.md`
5. `subskills/review/references/pr-review-guide.md`

## Guardrails

- DO NOT score an unknown obligation or a witness outside the established input domain.
- DO NOT attribute a finding to the change without comparison evidence.
