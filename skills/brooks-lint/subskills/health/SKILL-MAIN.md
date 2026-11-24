---
name: health
description: Use for a scoped, four-dimension quality dashboard or a dashboard for an admissible supplied ledger.
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

# Brooks Lint Health Dashboard

## Overview

Summarize project quality using four dimensions grounded in twelve classic engineering books. Use a single adjudicated ledger for the report and scorer.

## Workflow

1. Read the bundle references and resolve scope. Use the explicit project or directory boundary or apply Auto Scope Detection. For a supplied adjudicated ledger, follow the guide's supplied-ledger path.
2. Assess the four dimensions. Use Step 1 of the health guide, then reconcile statuses, evidence, retained finding owners, and caps in one ledger.
3. Finalize the dashboard from one score-free draft. Follow Step 2 and the score ledger contract. Run the bundled scorer when execution is available and permitted.
4. Verify and deliver the result. Follow Step 3 and exact delivery in the ledger reference. Return the checked report bytes in the required report or artifact schema.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `Health Dashboard`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/decay-risks.md`
4. `references/test-decay-risks.md`
5. `subskills/health/references/health-guide.md`
6. `subskills/health/references/score-ledger.md` for the schema and the scoring and delivery helpers in `subskills/health/scripts/`

## Guardrails

- DO NOT assign a score to an unassessed dimension or emit a numeric composite when a required assessment is missing.
- DO NOT alter a checked report before delivering it.
