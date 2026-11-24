# Windsurf Setup

[Windsurf](https://windsurf.com) (Cascade) natively loads [Agent Skills](https://agentskills.io) and
reads `AGENTS.md`, so all six brooks-lint modes run with no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- windsurf

# from a clone
./scripts/install.sh windsurf            # global:  ~/.codeium/windsurf/skills
./scripts/install.sh windsurf --project  # this repo: ./.windsurf/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.codeium/windsurf/skills/` to copy the complete bundle.

## Invoke

Explicitly select or reference `@brooks-lint` in Cascade, then supply a mode such as `brooks-lint->review` and a scope. Windsurf reads the repository's `AGENTS.md` for project instructions.

## Notes

- 🧪 Documented per the official [Cascade skills docs](https://docs.windsurf.com/windsurf/cascade/skills);
  community end-to-end verification welcome — [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
