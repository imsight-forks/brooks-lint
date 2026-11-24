import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { BUNDLE_NAME, MODES } from "./modes.mjs";
export { GUIDE_BY_MODE, VALID_MODES } from "./modes.mjs";

/**
 * The registry in modes.mjs owns guides, risk catalogs and runner capabilities.
 * VALID_MODES derives from it, and
 * validate-repo.mjs checks step continuity for every guide listed.
 *
 * A mode may carry more than one guide. Interactively, its subskill tells the agent
 * to read the secondary guide on demand; in the CI and eval paths there is no
 * on-demand read, so every guide the mode can dispatch to has to be in the
 * assembled system prompt or the mode simply does not exist there.
 */

/** Resolve resources in a bundle or a legacy --skills-dir override. */
export function skillResources(skillsDir) {
  const bundle = [path.join(skillsDir, BUNDLE_NAME), skillsDir]
    .find(dir => existsSync(path.join(dir, "SKILL.md")) && existsSync(path.join(dir, "subskills")));
  if (bundle) {
    return {
      sharedDir: path.join(bundle, "references"),
      modeDir: mode => path.join(bundle, "subskills", mode, "references"),
    };
  }
  return {
    sharedDir: path.join(skillsDir, "_shared"),
    modeDir: mode => path.join(skillsDir, MODES[mode].directory),
  };
}

/**
 * Assemble the system prompt for a given brooks-lint mode.
 * Shared by: GitHub Action (ci-review.mjs) and Eval Runner (run-evals-live.mjs).
 *
 * @param {string} mode - one of VALID_MODES
 * @param {string} skillsDir - absolute path to the skills directory or bundle
 * @returns {string} concatenated system prompt with --- separators
 */
export function assembleSystemPrompt(mode, skillsDir) {
  if (!Object.hasOwn(MODES, mode)) throw new Error(`Unknown mode: ${mode}`);
  const { sharedDir, modeDir } = skillResources(skillsDir);

  const read = (filePath) => readFileSync(filePath, "utf8");

  const sections = [
    read(path.join(sharedDir, "common.md")),
    read(path.join(sharedDir, "source-coverage.md")),
  ];

  // Add risk definitions based on mode
  for (const prefix of MODES[mode].risks) {
    sections.push(read(path.join(sharedDir, prefix === "T" ? "test-decay-risks.md" : "decay-risks.md")));
  }

  // Add mode-specific guide(s)
  for (const guideFile of MODES[mode].guides) {
    sections.push(read(path.join(modeDir(mode), guideFile)));
  }

  return sections.join("\n\n---\n\n");
}
