---
name: new-skill
description: >
  Scaffold a new analysis mode inside the Brooks Lint bundle, register its
  route and guide, and add paired eval scenarios. The parent loads the mode
  through its SKILL-MAIN.md entrypoint.
  Triggers when the maintainer asks to "add a new skill", "scaffold a skill", or
  "create a brooks-lint mode".
  Do NOT trigger for: editing an existing skill's content, adding a single eval to
  an existing skill, or authoring skills for some other plugin.
disable-model-invocation: true
---

# Brooks Lint Mode Scaffold

Take the lower-kebab-case mode name and its purpose from the request. Follow the “Adding a Mode” section in `AGENTS.md`.

1. Create `skills/brooks-lint/subskills/<mode>/SKILL-MAIN.md`. Match an existing subskill’s metadata, Overview, numbered Workflow, bundle resources, and Guardrails.
2. Put the retained detailed steps under that mode’s `references/` directory. Keep step headings sequential and link shared references from the parent bundle root.
3. Add the route to the parent `SKILL.md` and register its guide and runner capabilities in `scripts/modes.mjs`.
4. Add happy-path and false-positive scenarios with sequential IDs and the existing schema in `evals/evals.json`.
5. Run `npm run validate`, `npm test`, and `npm run evals`. Verify the selected route and its report from the installed parent.

Report the files created and the validation results.
