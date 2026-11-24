---
name: debt
description: Use for assessing accumulated maintenance burden, refactoring priorities, or debt intent.
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

# Brooks Lint Tech Debt Assessment

## Overview

Assess debt with the production risk definitions grounded in twelve classic engineering books, then prioritize supported repayment work.

## Workflow

1. Read the bundle references and resolve scope. Apply Auto Scope Detection when the user supplies no specific boundary. Use the guide's evidence question when required.
2. Inventory supported findings before scoring any of them. Run Step 1 of the debt guide using the available change and ownership evidence.
3. Apply Pain × Spread and classify intent. Follow Steps 2–3 of the guide, retaining bounded ranges, ties, and unknown factors as supported.
4. Group findings by risk and deliver the assessment. Follow Step 4 and append the Debt Summary Table to the shared report.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `Tech Debt Assessment`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/decay-risks.md`
4. `subskills/debt/references/debt-guide.md`

## Guardrails

- DO NOT assign a guessed priority when Pain or Spread lacks evidence.
- DO NOT use debt priority or intent as a substitute for finding severity.
