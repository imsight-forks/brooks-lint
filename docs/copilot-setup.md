# GitHub Copilot Setup

GitHub Copilot has supported [Agent Skills](https://agentskills.io) since December 2025 (coding agent,
Copilot CLI, and VS Code agent mode). It reads `AGENTS.md` and **auto-detects existing `.claude/skills`
folders**, so all six brooks-lint modes run with no conversion.

## Install

```bash
# personal (all repos) — one command
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- copilot

# from a clone
./scripts/install.sh copilot            # personal: ~/.copilot/skills
./scripts/install.sh copilot --project  # this repo: ./.github/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint .github/skills/` to copy the complete bundle. Commit it so the
cloud agent and reviewers share the same skills.

Copilot discovers skills from `.github/skills`, `.claude/skills`, `.agents/skills` (project) and
`~/.copilot/skills`, `~/.agents/skills` (personal). `./scripts/install.sh agents` (→ `~/.agents/skills`)
is shared with Cursor and pi.

## Invoke

Explicitly select `brooks-lint` in Copilot and provide a mode such as `brooks-lint->review` plus the requested scope. Keep project instructions in `AGENTS.md` or `.github/copilot-instructions.md`.

## Notes

- Org/enterprise-level skills were "coming soon" at launch; repo-level `.github/skills` works today.
- 🧪 Documented per the [Agent Skills announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
  and [docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills); community
  end-to-end verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
