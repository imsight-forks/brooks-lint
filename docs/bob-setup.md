# IBM Bob Setup

[IBM Bob](https://bob.ibm.com) (`bob`) is IBM's AI-powered developer agent — an "everything is a
skill" architecture with a chat interface and IDE integrations. It natively loads
[Agent Skills](https://agentskills.io) and reads `AGENTS.md`, so all six brooks-lint modes run with
no conversion.

## Install

```bash
# simplest — one command (global)
curl -fsSL https://raw.githubusercontent.com/imsight-forks/brooks-lint/main/scripts/install.sh | bash -s -- bob

# from a clone
./scripts/install.sh bob            # global: ~/.bob/skills
./scripts/install.sh bob --project  # this repo: ./.bob/skills
```

For a manual installation, clone the repo and run `cp -r skills/brooks-lint ~/.bob/skills/` to copy the complete bundle.

Bob scans these skill roots, highest priority first, so an existing vendor-neutral install is picked
up automatically:

| Root | Notes |
|---|---|
| `<projectRoot>/.bob/skills` | what `--project` writes |
| `~/.bob/skills` | what the global install writes |

When the same skill name appears in two roots, the project-level skill takes precedence.

## Invoke

Select `/brooks-lint` in the chat prompt, then give it a mode such as `brooks-lint->review` and the diff to review. Bob also reads `~/.bob/AGENTS.md` and the project instructions along the path to your working directory.

## Notes

- IBM Bob is available at [bob.ibm.com](https://bob.ibm.com); download and sign-in instructions
  are on that page.
- 🧪 Documented per IBM's [Skills](https://bob.ibm.com/docs/ide/features/skills) and
  [Configuring](https://bob.ibm.com/docs/shell/configuration/configuring) pages; community
  end-to-end verification welcome —
  [open an issue](https://github.com/hyhmrright/brooks-lint/issues/new).
