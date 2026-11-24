---
name: test
description: Use for protection, maintainability, and quality of an existing test suite.
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

# Brooks Lint Test Quality Review

## Overview

Review existing tests using the six test risk definitions grounded in twelve classic engineering books.

## Workflow

1. Read the bundle references and resolve scope. Use the supplied tests or directory, or apply Auto Scope Detection from `references/common.md`.
2. Build the Test Suite Map. Follow the guide's Before You Start section and read the governing production obligations alongside the test bodies.
3. Run the test risk scans. Follow Steps 1–4 and retain discriminating evidence for supported findings.
4. Deliver the test review. Follow Step 5, apply the Iron Law, and put the Test Suite Map immediately before Findings.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `Test Quality Review`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/test-decay-risks.md`
4. `subskills/test/references/test-guide.md`

## Guardrails

- DO NOT treat an excerpt or an uninspected inventory as evidence of absent protection.
- DO NOT report an unexecuted comparison as executed.
