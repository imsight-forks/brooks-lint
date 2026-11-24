# Getting started

Brooks Lint provides one Agent Skill with six analysis modes. Diagnosis is
performed by your coding agent; reading, editing and execution capabilities vary
by host. Current maintainer verification covers Codex. Other integrations are
retained, but layout tests are not an end-to-end host compatibility claim.

## Choose the code you want to install

See [npm](https://www.npmjs.com/package/brooks-lint) and [GitHub Releases](https://github.com/hyhmrright/brooks-lint/releases) for published versions.

Install the fork's bundle from a Codex project.

```bash
npx skills add imsight-forks/brooks-lint --skill brooks-lint --agent codex
```

For the published npm package, with Node.js 20+:

```bash
npx brooks-lint@latest install codex
npx brooks-lint@latest install codex --project
npx brooks-lint@latest install --list
```

To try the current source, including changes ahead of the published package, use Git and Bash:

```bash
git clone https://github.com/imsight-forks/brooks-lint.git
cd brooks-lint
bash scripts/install.sh codex
```

Replace `codex` with the desired destination:

`<platform> = opencode · cursor · windsurf · antigravity · pi · kiro · copilot · droid · dsh · gemini · codex · claude · bob · agents`

Use `--project` from the project you want to install into, calling the script by
its absolute path if the source checkout is elsewhere. `--dir PATH` chooses a
custom destination. These commands install skills, not native IDE extensions.
The shell installer copies from its adjacent checkout when present; its remote
form clones main. Record the checkout commit if you need reproducibility.

## Bundle layout

```text
<skills-dir>/
└── brooks-lint/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── references/
    └── subskills/
        ├── review/SKILL-MAIN.md
        ├── audit/SKILL-MAIN.md
        ├── debt/SKILL-MAIN.md
        ├── test/SKILL-MAIN.md
        ├── health/SKILL-MAIN.md
        └── sweep/SKILL-MAIN.md
```

Copy the entire `skills/brooks-lint` directory for a manual install. Its
`references/` and `subskills/` directories contain the report contracts and
health's scoring and delivery tools.

If you installed the six standalone skills before this change, remove those
entries through the tool that installed them when you switch to the bundle.
For entries tracked by the Skills CLI, use `npx skills remove` with the
installed names, such as `brooks-review`.

## Pick a workflow

Start with one focused skill: review for a diff, audit for module structure,
debt for priorities, or test for an existing suite. Health provides an abbreviated
four-dimension dashboard. Sweep additionally edits within an authorized scope
and requires verification tools; it has a default limit of three total repair
rounds, including Critical-only rounds. No host is promised identical behavior.

Select the parent explicitly using your host's skill picker or invocation
syntax. In Codex, try `$brooks-lint brooks-lint->review Review the current diff.`
If a skill is unavailable, start a fresh session and inspect the actual installed
files and sibling resources before assuming that a successful copy means a
successful invocation.

## Platform guides

- [Codex](codex-setup.md)
- [OpenCode](opencode-setup.md)
- [Cursor](cursor-setup.md)
- [Windsurf](windsurf-setup.md)
- [Antigravity](antigravity-setup.md)
- [pi](pi-setup.md)
- [GitHub Copilot](copilot-setup.md)
- [Kiro](kiro-setup.md)
- [Factory Droid](factory-droid-setup.md)
- [DeepSeek Harness](dsh-setup.md)
- [IBM Bob](bob-setup.md)

The `gemini`, `claude` and generic `agents` installer destinations remain
available. Existing Claude Code native marketplace commands are documented in
the [README](../README.md#installation); these integrations are not currently
maintainer-tested in live hosts. Platform guides may describe historical host
behavior; report your host version and reproduction when contributing verification.

## Configure and interpret

Copy [the example config](../.brooks-lint.example.yaml) only if defaults do not
fit your project. Scores summarize retained findings; they do not certify safety.
Missing decisive evidence is not a clean dimension. Health must not emit a numeric
composite when a required dimension is unassessed. Finalizer receipts establish
arithmetic/artifact consistency, not diagnostic truth.

The [runner contracts](runner-contracts.md) distinguish interactive Codex use,
Codex behavioral evaluations, and the historical Anthropic-compatible Action.
Installing skills does not configure an API key or authorize a live evaluation.
