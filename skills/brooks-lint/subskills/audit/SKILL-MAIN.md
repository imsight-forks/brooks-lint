---
name: audit
description: Use for module structure, dependencies, and ownership boundaries, or for an explicitly requested codebase tour.
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

# Brooks Lint Architecture Audit

## Overview

Diagnose module-level decay using twelve classic engineering books, or guide a new contributor through the project using the onboarding workflow.

## Workflow

1. Read the shared references and determine scope. Apply Auto Scope Detection when the user supplies no files or directory. Preserve the incremental ref when provided.
2. Select the audit or onboarding guide. A request for onboarding, a codebase tour, or an explanation for a new developer uses the onboarding guide and its orientation-only output.
3. For diagnosis, map evidenced boundaries and edges before assigning findings. Follow Steps 0–4 of the architecture guide, then assess seams and Conway's Law under Steps 5–6.
4. Return the selected result. For the audit, assign node colors after all checks and put the Mermaid dependency graph before findings.

If the task does not map cleanly to these steps, use the host's planning tool to plan and execute it within this mode's scope, evidence rules, and output contract.

**Mode line in report:** `Architecture Audit`

## Bundle Resources

Resolve these resources from the parent bundle root. Read the listed shared references before the selected guide.

1. `references/common.md`
2. `references/source-coverage.md`
3. `references/decay-risks.md`
4. `subskills/audit/references/architecture-guide.md` for diagnosis or `subskills/audit/references/onboarding-guide.md` for onboarding

## Guardrails

- DO NOT infer a cycle, team structure, or runtime binding from an unsupported edge.
- DO NOT add a Health Score or Iron Law findings to the onboarding tour.
