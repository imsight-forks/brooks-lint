# OpenCode Setup

[OpenCode](https://opencode.ai) natively loads [Agent Skills](https://agentskills.io) and reads
`AGENTS.md`, so all six brooks-lint modes run with no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- opencode

# from a clone
./scripts/install.sh opencode            # global: ~/.config/opencode/skills
./scripts/install.sh opencode --project  # this repo: ./.opencode/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.config/opencode/skills/` to copy the complete bundle.

Those two paths are unchanged on OpenCode v2. v2 additionally scans `~/.claude/skills` and
`~/.agents/skills`, so an existing Claude Code bundle is picked up automatically, and
`./scripts/install.sh agents` covers OpenCode too.

## Invoke

Select `/brooks-lint` on OpenCode v2, then give it a mode such as `brooks-lint->review`. The parent opts into the slash menu and disables automatic selection using its frontmatter.

You can also select `brooks-lint` from `/skills` or attach it with `@brooks-lint`. On OpenCode 1.x, select it from `/skills` or type `/brooks-lint` followed by a space. The description requests explicit use on hosts that ignore the invocation flag.

## Notes

- **Do not add same-named commands.** On v2 a command that shares a skill's name *shadows* the
  skill: the `/` popup hides skills already registered as commands, and submit resolves a command
  before a skill. The `opencode/slash` opt-in exposes `/brooks-lint` in the menu.
- 🧪 Documented per the official [skills](https://opencode.ai/docs/skills/) and
  [rules](https://opencode.ai/docs/rules/) docs; community end-to-end verification welcome —
  [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
