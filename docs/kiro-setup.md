# Kiro Setup

AWS [Kiro](https://kiro.dev) (IDE & CLI) natively loads Claude-compatible
[Agent Skills](https://agentskills.io), reads `AGENTS.md`, and **auto-registers each skill as a slash
command**, so all six brooks-lint modes run with no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- kiro

# from a clone
./scripts/install.sh kiro            # global:  ~/.kiro/skills
./scripts/install.sh kiro --project  # this repo: ./.kiro/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.kiro/skills/` to copy the complete bundle.

Or use the IDE: **Agent Steering & Skills** panel → **+** → **Import a skill** → paste a GitHub URL or
pick a local folder (Kiro copies it into your skills folder).

## Invoke

Select `/brooks-lint`, then give it a mode such as `brooks-lint->audit` and the intended scope. `AGENTS.md` carries the shared report rules.

## Notes

- Kiro requires the folder name to equal the skill's `name` (✅ already true here), `name` ≤ 64 chars,
  and `description` ≤ 1024 chars (brooks-lint's longest is ~920).
- 🧪 Documented per the official [skills docs](https://kiro.dev/docs/skills/); community end-to-end
  verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
