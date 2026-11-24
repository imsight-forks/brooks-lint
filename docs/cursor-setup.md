# Cursor Setup

[Cursor](https://cursor.com) added native [Agent Skills](https://agentskills.io) support in 2.4. It
loads `SKILL.md` skills and reads `AGENTS.md`, so all six brooks-lint modes run with no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- cursor

# from a clone
./scripts/install.sh cursor            # global:  ~/.cursor/skills
./scripts/install.sh cursor --project  # this repo: ./.cursor/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.cursor/skills/` to copy the complete bundle.

Cursor also loads `.agents/skills/` / `~/.agents/skills/` and existing Claude/Codex skill folders, so
`./scripts/install.sh agents` works too and is shared with Copilot and pi.

## Invoke

Select `/brooks-lint` in chat, then provide a mode such as `brooks-lint->review` and the requested scope.

## Notes

- 🧪 Documented per the official [skills docs](https://cursor.com/docs/skills); community end-to-end
  verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
