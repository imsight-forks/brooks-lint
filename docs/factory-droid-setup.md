# Factory Droid Setup

Factory's [Droid](https://factory.ai) (`droid` CLI) natively loads
[Agent Skills](https://agentskills.io) and reads `AGENTS.md`, so all six brooks-lint modes run with no
conversion.

## Install

```bash
# simplest — one command
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- droid

# from a clone
./scripts/install.sh droid            # personal: ~/.factory/skills
./scripts/install.sh droid --project  # this repo: ./.factory/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.factory/skills/` to copy the complete bundle.

Droid discovers skills from `~/.factory/skills` (personal), `.factory/skills` (project), and the legacy
`.agent/skills`, each a single level deep.

## Invoke

Select `/brooks-lint` in Droid, then provide a mode such as `brooks-lint->review` and the requested scope. `AGENTS.md` carries the shared report rules.

## Notes

- Droid ignores Claude-only frontmatter fields (e.g. `allowed-tools`); `name` + `description` + body
  are all it needs, so the skills load unchanged.
- 🧪 Documented per the official [skills docs](https://docs.factory.ai/cli/configuration/skills) and
  [AGENTS.md docs](https://docs.factory.ai/cli/configuration/agents-md); community end-to-end
  verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
