import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import {
  parseFrontmatterBooks,
  countBookSections,
  countProductionRisks,
  countTestRisks,
  extractChangelogVersion,
  extractGuideStepLabels,
  hasOpencodeSlashFlag,
  PRODUCTION_RISK_COUNT,
  TEST_RISK_COUNT,
} from "./frontmatter.mjs";
import { BUNDLE_NAME, MODES, VALID_MODES } from "./modes.mjs";
import { versionRefs } from "./version-refs.mjs";
import { coverageAnnouncement, coverageVerdict } from "./changelog-audit.mjs";
import {
  platformDocs,
  setupGuides,
  linkedSetupGuides,
  parseInstallerPlatforms,
  platformEnumeration,
  namesPlatform,
} from "./platforms.mjs";
import { render as renderStarHistory, readStamps as readStarStamps } from "./gen-star-history.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const bundleDir = `skills/${BUNDLE_NAME}`;
const sharedDir = `${bundleDir}/references`;

function readText(relPath) {
  return readFileSync(path.join(root, relPath), "utf8").replace(/\r\n/g, "\n");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

// ── Canonical data ─────────────────────────────────────────────────────────
// source-coverage.md frontmatter is the single source of truth for the book
// list and count. Adding a new book only requires updating that frontmatter
// (plus the narrative sections that describe it) — the validator auto-adapts.

const packageJson = readJson("package.json");
const version = packageJson.version;

const sourceCoverage = readText(`${sharedDir}/source-coverage.md`);
const books = parseFrontmatterBooks(sourceCoverage);
const sourceCount = books?.length ?? 0;

const COUNT_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
];
const sourceWord = COUNT_WORDS[sourceCount] ?? String(sourceCount);
const sourceWordCap = sourceWord.charAt(0).toUpperCase() + sourceWord.slice(1);

const evals = readJson("evals/evals.json");
const evalCount = evals.evals.length;


// ── Validation sections ────────────────────────────────────────────────────

function checkVersionConsistency() {
  const manifestVersions = [
    ["package.json", version],
    [".claude-plugin/plugin.json", readJson(".claude-plugin/plugin.json").version],
    [".claude-plugin/marketplace.json", readJson(".claude-plugin/marketplace.json").plugins[0]?.version],
    [".codex-plugin/plugin.json", readJson(".codex-plugin/plugin.json").version],
    ["gemini-extension.json", readJson("gemini-extension.json").version],
  ];
  for (const [file, foundVersion] of manifestVersions) {
    check(
      foundVersion === version,
      `${file} version ${foundVersion} does not match package.json version ${version}`,
    );
  }
}

function checkDescriptionConsistency() {
  const canonicalDesc = readJson(".claude-plugin/plugin.json").description;
  const manifestDescs = [
    [".claude-plugin/marketplace.json", readJson(".claude-plugin/marketplace.json").plugins[0]?.description],
    [".codex-plugin/plugin.json", readJson(".codex-plugin/plugin.json").description],
    ["gemini-extension.json", readJson("gemini-extension.json").description],
  ];
  for (const [file, desc] of manifestDescs) {
    check(desc === canonicalDesc, `${file} description does not match .claude-plugin/plugin.json`);
  }
}

function checkChangelog() {
  const changelog = readText("CHANGELOG.md");
  const latestVersion = extractChangelogVersion(changelog);
  check(
    latestVersion === version,
    `CHANGELOG.md latest version ${latestVersion ?? "<missing>"} does not match package.json version ${version}`,
  );
}

// Changelog COVERAGE, as distinct from checkChangelog()'s existence check.
// The audit runs only while a release is in progress — derived as "this
// version has no tag yet" — so it never nags during normal work. Only the
// provable gap fails: a pull request merged in the range whose number the
// section never cites. Everything else is judgment and belongs to the
// maintainer walking `npm run changelog:audit`.
//
// The skip is announced rather than silent. Plain `npm version <v>` tags as it
// commits, and a tag deleted on the remote can survive locally; either would
// switch this check off, and an unannounced off-state reads exactly like a pass.
function checkChangelogCoverage() {
  const verdict = coverageVerdict({ version, cwd: root, changelog: readText("CHANGELOG.md") });
  console.log(coverageAnnouncement(verdict));
  for (const gap of verdict.errors) check(false, gap);
}


// Version strings embedded in text files (README badges, docs JSON-LD). The
// list lives in version-refs.mjs so this check and bump-version.mjs can never
// disagree about what carries a version.
function checkVersionRefs() {
  for (const { rel, pattern, expected, required } of versionRefs(root, version)) {
    const found = readText(rel).match(pattern) ?? [];
    if (required) {
      check(found.length > 0, `${rel} is missing its version reference (expected "${expected}")`);
    }
    for (const hit of found) {
      check(hit === expected, `${rel} has stale "${hit}", expected "${expected}" (run npm run bump)`);
    }
  }
}

// Canonical Claude Code install command — must appear in README.md.
const CANONICAL_INSTALL_CMD = "/plugin marketplace add hyhmrright/brooks-lint";

function checkReadmeIntegrity() {
  const readme = readText("README.md");
  check(readme.includes(CANONICAL_INSTALL_CMD), `README.md should contain canonical install command`);
  check(
    readme.includes(`grounded in ${sourceWord} classic engineering books`),
    `README.md should describe Brooks-Lint as grounded in ${sourceWord} classic engineering books`,
  );
  check(
    readme.includes(`## The ${sourceWordCap} Books`),
    `README.md should expose a unified The ${sourceWordCap} Books section`,
  );
  check(readme.includes("*The Art of Unit Testing*"), "README.md should list The Art of Unit Testing in the source inventory");
  check(readme.includes("*How Google Tests Software*"), "README.md should list How Google Tests Software in the source inventory");
  check(readme.includes("source-coverage.md"), "README.md should link to the source coverage matrix");
}

function checkConfigExamples() {
  const commonMd = readText(`${sharedDir}/common.md`);
  const exampleYaml = readText(".brooks-lint.example.yaml");
  const readme = readText("README.md");
  check(commonMd.includes("- T5"), `${sharedDir}/common.md should use T5 in the disable section of config examples`);
  check(exampleYaml.includes("- T5"), ".brooks-lint.example.yaml should use T5 in the disable section");
  check(readme.includes("- T5"), "README.md configuration example should include T5 in the disable section");
  check(exampleYaml.includes("# suppress:"), ".brooks-lint.example.yaml should include a commented suppress example");
}

function checkSourceInventory() {
  check(
    books !== null && books.length > 0,
    `${sharedDir}/source-coverage.md must have a books: frontmatter list`,
  );
  if (!books) return;

  for (const title of books) {
    check(
      sourceCoverage.includes(`*${title}*`),
      `${sharedDir}/source-coverage.md should include a section for ${title}`,
    );
  }

  // Verify frontmatter book count matches actual book sections in the document.
  // Book sections use the pattern: ## Author Name — *Book Title*
  const bookSections = countBookSections(sourceCoverage);
  check(
    bookSections === books.length,
    `${sharedDir}/source-coverage.md frontmatter lists ${books.length} books but has ${bookSections} book sections (## Author — *Title*)`,
  );
}

function checkSharedFramework() {
  const commonMd = readText(`${sharedDir}/common.md`);
  check(commonMd.includes("source-coverage.md"), `${sharedDir}/common.md should reference source-coverage.md`);

  const testDecayRisks = readText(`${sharedDir}/test-decay-risks.md`);
  check(testDecayRisks.includes("## Risk T3: Test Duplication"), "T3 definition missing from test-decay-risks.md");
  check(testDecayRisks.includes("## Risk T5: Coverage Illusion"), "T5 definition missing from test-decay-risks.md");
  check(testDecayRisks.includes("### What Not to Flag"), `${sharedDir}/test-decay-risks.md should include false-positive guidance`);

  const decayRisks = readText(`${sharedDir}/decay-risks.md`);
  check(decayRisks.includes("### What Not to Flag"), `${sharedDir}/decay-risks.md should include false-positive guidance`);

  // Verify risk section counts are stable
  const productionRisks = countProductionRisks(decayRisks);
  check(productionRisks === PRODUCTION_RISK_COUNT, `${sharedDir}/decay-risks.md should define exactly ${PRODUCTION_RISK_COUNT} risks (found ${productionRisks})`);

  const testRisks = countTestRisks(testDecayRisks);
  check(testRisks === TEST_RISK_COUNT, `${sharedDir}/test-decay-risks.md should define exactly ${TEST_RISK_COUNT} test risks (found ${testRisks})`);
}

// ── Step alignment ────────────────────────────────────────────────────────

/** Steps in one guide must be present, unique, and numerically contiguous. */
function checkGuideSteps(rel) {
  const text = readText(rel);
  const labels = extractGuideStepLabels(text);

  // A step at the wrong heading level is invisible to the label extractor, so the
  // continuity check below silently skips it — that is how `## Step 7` in the PR
  // guide stayed unvalidated while SKILL.md cited it by number. Catch the level
  // itself, not just the sequence.
  for (const heading of text.match(/^#{1,6} Step \d[a-z]?\b.*$/gm) ?? []) {
    check(
      heading.startsWith("### "),
      `${rel} has a step heading at the wrong level (must be ###): "${heading.trim()}"`,
    );
  }

  check(labels.length > 0, `${rel} has no ### Step headings — expected at least one`);

  check(
    new Set(labels).size === labels.length,
    `${rel} has duplicate step labels: ${labels.filter((l, i) => labels.indexOf(l) !== i).join(", ")}`,
  );

  // Compare main step numbers only, ignoring sub-step suffixes: "6a" → 6, "0" → 0.
  const mainSteps = [...new Set(labels.map(l => parseInt(l, 10)))].sort((a, b) => a - b);
  const expectedStart = mainSteps[0]; // 0-indexed (architecture) or 1-indexed (others)
  for (let i = 0; i < mainSteps.length; i++) {
    check(
      mainSteps[i] === expectedStart + i,
      `${rel} main step sequence has a gap: expected ${expectedStart + i}, found ${mainSteps[i]}`,
    );
  }
}

function checkStepAlignment() {
  for (const [mode, { guides }] of Object.entries(MODES)) {
    for (const guide of guides) checkGuideSteps(`${bundleDir}/subskills/${mode}/references/${guide}`);
  }
}

function checkEntrypoint(rel, name) {
  const text = readText(rel);
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const workflow = text.split(/^## /m).find(section => section.startsWith("Workflow\n")) ?? "";
  check(frontmatter.split("\n").includes(`name: ${name}`), `${rel} should declare the name ${name}`);
  check(/^  skill_invocation_notation: >/m.test(frontmatter), `${rel} should declare the Imsight invocation notation`);
  check(/^## Overview$/m.test(text), `${rel} should have an Overview section`);
  check(/^\d+\. /m.test(workflow), `${rel} should have a numbered Workflow`);
  check(/^## Guardrails\n/m.test(text), `${rel} should have a Guardrails section`);
  return { text, frontmatter };
}

function checkSkillsContent() {
  const entrypoints = readdirSync(path.join(root, "skills"), { recursive: true })
    .filter(file => path.basename(file) === "SKILL.md");
  check(
    entrypoints.length === 1 && entrypoints[0] === path.join(BUNDLE_NAME, "SKILL.md"),
    "skills/ should expose exactly one SKILL.md, at brooks-lint/SKILL.md",
  );
  const parent = checkEntrypoint(`${bundleDir}/SKILL.md`, BUNDLE_NAME);
  check(/^disable-model-invocation: true$/m.test(parent.frontmatter), `${bundleDir}/SKILL.md should be manual-only`);
  check(hasOpencodeSlashFlag(parent.text), `${bundleDir}/SKILL.md should opt into OpenCode's / menu`);
  check(/^policy:\n  allow_implicit_invocation: false$/m.test(readText(`${bundleDir}/agents/openai.yaml`)),
    `${bundleDir}/agents/openai.yaml should disable implicit invocation`);
  const childDirs = readdirSync(path.join(root, bundleDir, "subskills"), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  check(childDirs.join(",") === [...VALID_MODES].sort().join(","), "Bundle subskills should match the mode registry");

  for (const [mode, { guides }] of Object.entries(MODES)) {
    const dir = `${bundleDir}/subskills/${mode}`;
    const entrypoint = `${dir}/SKILL-MAIN.md`;
    const child = checkEntrypoint(entrypoint, mode);
    check(child.text.includes(`${sourceWord} classic`), `${entrypoint} should reference the derived book count`);
    check(parent.text.includes(`${BUNDLE_NAME}->${mode}`) && parent.text.includes(`subskills/${mode}/SKILL-MAIN.md`),
      `${bundleDir}/SKILL.md should route ${mode} to its nested entrypoint`);
    for (const guide of guides) {
      check(
        readText(`${dir}/references/${guide}`).includes("Iron Law"),
        `${dir}/references/${guide} should reference the Iron Law`,
      );
    }
  }
}

// Every shipped mode needs at least one scenario. This replaced a hardcoded
// ">= 49 scenarios" floor: that number stopped tracking reality the moment the
// suite grew past it, and run-evals.mjs already enforces per-risk-code coverage.
// Mode coverage is the invariant neither check owned.
function checkEvalSuite() {
  const modes = new Set(evals.evals.map((ev) => ev.mode));
  for (const mode of VALID_MODES) {
    check(modes.has(mode), `evals/evals.json has no scenario for mode '${mode}'`);
  }
}

function checkContributing() {
  const contributing = readText("CONTRIBUTING.md");
  check(
    contributing.includes(`currently ${evalCount}`),
    `CONTRIBUTING.md should mention the current eval count (${evalCount})`,
  );
}

// AGENTS.md and GEMINI.md are near-duplicates that Codex CLI and Gemini CLI are
// each told to prioritize, so they have to stay factually identical. Checking only
// AGENTS.md is what let GEMINI.md quietly lose the eval count and the benchmark
// corpus, and let both keep advertising balanced-only scoring after strictness
// presets shipped.
const AGENT_DOCS = ["AGENTS.md", "GEMINI.md"];
// Backticked, as the scoring table writes them. A bare "strict" would also match
// inside the word "strictness" and pass on a doc that never lists the presets.
const STRICTNESS_PRESETS = ["`strict`", "`balanced`", "`legacy-friendly`"];

function checkAgentsDocs() {
  for (const file of AGENT_DOCS) {
    const text = readText(file);
    check(
      text.includes(`${sourceWord} classic engineering books`),
      `${file} should describe the repository as grounded in ${sourceWord} classic engineering books`,
    );
    check(
      text.includes(`${evalCount} scenarios`),
      `${file} should mention the current eval suite (${evalCount} scenarios)`,
    );
    for (const preset of STRICTNESS_PRESETS) {
      check(
        text.includes(preset),
        `${file} should document the '${preset}' strictness preset — its scoring table is stale`,
      );
    }
  }
}

// Every docs/<name>-setup.md must be linked from all six READMEs and the
// getting-started table, and every platform the installer accepts must appear in
// each document's `<platform> = …` list. Linking alone was not enough: IBM Bob
// arrived with its setup guide linked everywhere and its name missing from every
// enumeration but the English one.
function checkPlatformDocs() {
  const guides = setupGuides(root);
  const { declared } = parseInstallerPlatforms(readText("scripts/install.sh"));
  check(guides.length > 0, "docs/ should contain at least one <platform>-setup.md guide");

  for (const file of platformDocs(root)) {
    const text = readText(file);
    const linked = linkedSetupGuides(text);
    for (const guide of guides) {
      check(linked.includes(guide), `${file} is missing an install-table link to docs/${guide}`);
    }
    for (const link of linked) {
      check(guides.includes(link), `${file} links to docs/${link}, which does not exist`);
    }
    const enumeration = platformEnumeration(text);
    if (enumeration === "") {
      check(false, `${file} has no '<platform> = …' list of the installer's platforms`);
      continue;
    }
    for (const platform of declared) {
      check(
        namesPlatform(enumeration, platform),
        `${file} omits '${platform}' from its '<platform> = …' list, which scripts/install.sh accepts`,
      );
    }
  }
}

function checkInstallerPlatforms() {
  const { declared, global: globalArms, project } = parseInstallerPlatforms(readText("scripts/install.sh"));
  check(declared.length > 0, "scripts/install.sh should declare a PLATFORMS list");

  for (const [arms, fn] of [[globalArms, "global_dir"], [project, "project_dir"]]) {
    for (const platform of declared) {
      check(arms.includes(platform), `scripts/install.sh ${fn}() has no path for PLATFORMS entry '${platform}'`);
    }
    for (const platform of arms) {
      check(declared.includes(platform), `scripts/install.sh ${fn}() maps '${platform}', which PLATFORMS omits`);
    }
  }
}

// assets/star-history.svg is a pure function of assets/star-history.json, so a
// mismatch means the chart was hand-edited or the data moved without a redraw.
// Re-rendering here needs no credentials, which is the point of committing the
// data rather than the drawing alone.
function checkStarHistory() {
  check(
    renderStarHistory(readStarStamps()) === readText("assets/star-history.svg"),
    "assets/star-history.svg does not match assets/star-history.json — rerun `node scripts/gen-star-history.mjs --render-only`",
  );
}

function checkSecurity() {
  const security = readText("SECURITY.md");
  check(!security.includes("<!--"), "SECURITY.md still contains placeholder content");
  check(
    security.includes("Claude Code, Codex CLI, and Gemini CLI"),
    "SECURITY.md should describe the repository as multi-platform",
  );
}

function checkHookOutput() {
  function runHook(env = {}) {
    const tempHome = mkdtempSync(path.join(os.tmpdir(), "brooks-lint-hook-home-"));
    // The hook branches on CLAUDE_PLUGIN_ROOT, so it must never leak in from the
    // surrounding shell: a maintainer running `npm run validate` from inside
    // Claude Code would otherwise get the plugin-shaped output for the default
    // run and fail a check that has nothing to do with their change.
    const { CLAUDE_PLUGIN_ROOT: _pluginRoot, ...baseEnv } = process.env;
    const stdout = execFileSync(process.execPath, [path.join(root, "hooks", "session-start.mjs")], {
      cwd: root,
      env: { ...baseEnv, HOME: tempHome, ...env },
      encoding: "utf8",
    });
    return JSON.parse(stdout);
  }

  const defaultOut = runHook();
  check(typeof defaultOut.additional_context === "string", "hooks/session-start default output must include additional_context");

  const claudeOut = runHook({ CLAUDE_PLUGIN_ROOT: "1" });
  check(claudeOut.hookSpecificOutput?.hookEventName === "SessionStart", "hooks/session-start Claude output must include hookSpecificOutput.hookEventName");
  check(typeof claudeOut.hookSpecificOutput?.additionalContext === "string", "hooks/session-start Claude output must include hookSpecificOutput.additionalContext");
}

// ── Run all checks ─────────────────────────────────────────────────────────

checkVersionConsistency();
checkDescriptionConsistency();
checkChangelog();
checkChangelogCoverage();
checkVersionRefs();
checkReadmeIntegrity();
checkConfigExamples();
checkSourceInventory();
checkSharedFramework();
checkSkillsContent();
checkStepAlignment();
checkEvalSuite();
checkContributing();
checkAgentsDocs();
checkPlatformDocs();
checkInstallerPlatforms();
checkSecurity();
checkStarHistory();
checkHookOutput();

// ── Report ─────────────────────────────────────────────────────────────────

if (errors.length > 0) {
  console.error("Repository validation failed:");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Repository validation passed for version ${version}.`);
