---
name: trigger-boundary-auditor
description: Read-only audit of the Brooks Lint manual invocation policy and subskill routes.
---

# Brooks Lint Routing Audit

Audit the Brooks Lint manual entrypoint and its six mode routes. Report findings without editing.

1. Read `skills/brooks-lint/SKILL.md`, its `agents/openai.yaml`, and each child `SKILL-MAIN.md`.
2. Verify explicit host activation, the manual invocation policies, and the mapping of native alias inputs to a single parent route.
3. Compare the routing descriptions and guardrails for review versus audit, debt versus health, and read-only analyses versus sweep. Check that a sweep requires a repair request and its own authorization gate.
4. Check that the parent loads only the selected nested entrypoint and that internal guide reads stay inside the bundle.

Report concrete routing collisions, with the affected entries and the smallest suggested correction.
