# Antigravity Setup

Google's [Antigravity](https://antigravity.google) uses Claude-compatible
[Agent Skills](https://agentskills.io) and reads `AGENTS.md` / `GEMINI.md`, so all six brooks-lint
modes run with no conversion.

## Install

```bash
# project-scoped is the official convention (recommended)
./scripts/install.sh antigravity --project   # this repo: ./.agent/skills

# global
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- antigravity
./scripts/install.sh antigravity             # global: ~/.gemini/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint .agent/skills/` to copy the complete bundle.

## Invoke

Select the `brooks-lint` skill explicitly in Antigravity, then give it a mode such as `brooks-lint->audit` and a scope. `AGENTS.md` and `GEMINI.md` describe the report and scoring conventions.

## Notes

- The project convention `.agent/skills/` is well documented; the **global** skills path
  (`~/.gemini/skills` vs a product subfolder) varies between sources — if the global install isn't
  discovered, use the project install. Please report what worked.
- 🧪 Documented per the official [skills](https://antigravity.google/docs/skills) and
  [rules & workflows](https://antigravity.google/docs/rules-workflows) docs; community end-to-end
  verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
