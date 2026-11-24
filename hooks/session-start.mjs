#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginDir = path.resolve(__dirname, "..");
const homeDir = process.env.HOME || os.homedir();

function readVersion() {
  const packageJson = JSON.parse(
    readFileSync(path.join(pluginDir, "package.json"), "utf8"),
  );
  if (!packageJson.version) {
    throw new Error("Failed to read version from package.json");
  }
  return packageJson.version;
}

function installCommands(version) {
  const commandDir = path.join(homeDir, ".claude", "commands");
  // Replace prior wrappers even when the plugin version has not changed.
  const sentinel = path.join(commandDir, `.brooks-lint-v${version}-bundle`);

  // Already installed for this version and layout.
  if (existsSync(sentinel)) return;

  mkdirSync(commandDir, { recursive: true });

  const commandsDir = path.join(pluginDir, "commands");
  for (const entry of readdirSync(commandsDir)) {
    if (/^brooks-.*\.md$/.test(entry)) {
      // Short forms live in ~/.claude/commands/ (user commands), where
      // ${CLAUDE_PLUGIN_ROOT} does not expand — bake in the absolute path so
      // the wrapper can still locate its SKILL.md.
      const body = readFileSync(path.join(commandsDir, entry), "utf8").replaceAll(
        "${CLAUDE_PLUGIN_ROOT}",
        pluginDir,
      );
      writeFileSync(path.join(commandDir, entry), body);
    }
  }

  for (const entry of readdirSync(commandDir)) {
    if (entry === ".brooks-lint-installed" || entry.startsWith(".brooks-lint-v")) {
      rmSync(path.join(commandDir, entry), { force: true });
    }
  }

  writeFileSync(sentinel, "");
}

function buildContext() {
  return [
    "Run Brooks Lint when the user explicitly invokes the parent skill or a mode command.",
    "  /brooks-lint:brooks-lint -> Select a Brooks Lint mode",
    "  /brooks-review  -> PR code review",
    "  /brooks-audit   -> Architecture audit",
    "  /brooks-debt    -> Tech debt assessment",
    "  /brooks-test    -> Test quality review",
    "  /brooks-health  -> Codebase health dashboard",
    "  /brooks-sweep   -> Full sweep with scoped repairs",
  ].join("\n");
}

function buildOutput(context) {
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    return {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: context,
      },
    };
  }

  return {
    additional_context: context,
  };
}

try {
  installCommands(readVersion());
  process.stdout.write(`${JSON.stringify(buildOutput(buildContext()), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
