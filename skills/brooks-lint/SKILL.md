---
name: brooks-lint
description: >
  Use when the user explicitly invokes Brooks Lint for a PR review, architecture
  audit or onboarding tour, tech debt assessment, test quality review, health
  dashboard, or full sweep. Do NOT trigger for: generic requests about code
  quality or service health without an explicit Brooks Lint invocation.
disable-model-invocation: true
metadata:
  opencode/slash: "true"
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

# Brooks Lint

## Overview

Brooks Lint analyzes code quality across six focused modes grounded in
twelve classic engineering books. Select one mode and use its established evidence,
scoring, and reporting contract.

## Workflow

1. **Resolve the route.** Read the user's explicit selection and preserve the original request, scope, paths, options, and evidence. See **Invocation**.
2. **Load the selected subskill.** Read its linked `SKILL-MAIN.md` and follow its workflow. See **Subskills** and **Resource Roots**.
3. **Deliver the mode result.** Use the selected mode's report, schema, and verification status. Preserve the full checked report bytes when its delivery contract requires them.

If the task does not map cleanly to these steps, use the host's planning tool to
plan and execute within the selected subskill's constraints. Use the mode list to
resolve an unclear route before analysis.

## Invocation

An explicit Brooks Lint selection may use the host's `$brooks-lint` or
`/brooks-lint` invocation, the bare parent name, a direct route from the table,
or a native command adapter. After selecting the parent, accept `brooks-review`,
`brooks-audit`, `brooks-debt`, `brooks-test`, `brooks-health`, and `brooks-sweep`
as aliases for those routes. An explicitly selected parent can also route a clear
mode request in ordinary language. If the mode is ambiguous or absent, show help.
Select sweep only for an explicit repair request or an explicit sweep route, then
apply its authorization gate before any edit.

Example Codex invocation: `$brooks-lint brooks-lint->review Review this diff.`

## Subskills

| Route | Entrypoint | When to Route Here |
| --- | --- | --- |
| `brooks-lint->review` | [Review](subskills/review/SKILL-MAIN.md) | Diagnose a diff, supplied files, or existing code within a bounded change. |
| `brooks-lint->audit` | [Audit](subskills/audit/SKILL-MAIN.md) | Inspect module dependencies and system structure, or give someone a codebase tour. |
| `brooks-lint->debt` | [Debt](subskills/debt/SKILL-MAIN.md) | Assess accumulated maintenance burden and prioritize repayment. |
| `brooks-lint->test` | [Test](subskills/test/SKILL-MAIN.md) | Evaluate the actual protection and quality of an existing test suite. |
| `brooks-lint->health` | [Health](subskills/health/SKILL-MAIN.md) | Summarize the four quality dimensions or score a supplied admissible ledger. |
| `brooks-lint->sweep` | [Sweep](subskills/sweep/SKILL-MAIN.md) | Diagnose and repair a specified scope through the bounded sweep workflow. |

## Subcommands

| Subcommand | Use For |
| --- | --- |
| `brooks-lint->help()` | List the subskills and their scope using the table above. |

## Resource Roots

The bundle root is the directory containing this loaded parent `SKILL.md`. Read
`references/` and `subskills/` resources from that root. Resolve inspected code,
Git state, `.brooks-lint.yaml`, and any `.brooks-lint-history.json` in the selected
target project. Follow the mode's output contract for generated artifacts.

## Guardrails

- DO NOT activate this skill based on a generic code-quality request without an explicit Brooks Lint invocation.
- DO NOT interpret input text or an unknown route as a resource path.
- DO NOT widen the requested scope or treat routing as edit authorization.
- DO NOT add a second score or change the child report's output schema.
