# pi Setup

[pi](https://github.com/earendil-works/pi) (the earendil-works coding agent) natively loads
[Agent Skills](https://agentskills.io) and reads `AGENTS.md` / `CLAUDE.md`, so all six brooks-lint
modes run with no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- pi

# from a clone
./scripts/install.sh pi            # global:  ~/.pi/agent/skills
./scripts/install.sh pi --project  # this repo: ./.pi/skills
```

Or **don't copy at all** — point pi at a clone via settings (`~/.pi/settings.json`, or project
`.pi/settings.json`):

```json
{ "skills": ["/path/to/brooks-lint/skills"] }
```

pi can also reuse other tools' skill folders, for example
`{ "skills": ["~/.claude/skills"] }`.

## Invoke

Select `/skill:brooks-lint`, then supply a mode such as `brooks-lint->review` and the requested scope. `AGENTS.md` carries the shared report rules.

## Notes

- The parent skill's description fits pi's 1024-character limit.
- 🧪 Documented per the official [skills docs](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md);
  community end-to-end verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
