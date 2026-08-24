#!/usr/bin/env node
/**
 * Release script — bumps the version, records what changed, and keeps every
 * copy of the version in sync. No dependencies; plain Node.
 *
 *   npm run release                      interactive
 *   npm run release -- patch             bump, then prompt for changes
 *   npm run release -- minor -m "Added dark mode" -m "fixed: webhook crash"
 *   npm run release -- 2.0.0             set an exact version
 *   npm run release -- patch --commit    also git commit + tag
 *
 * Entries may be prefixed to group them in the changelog:
 *   added: …   fixed: …   changed: …   removed: …
 * Anything unprefixed lands under "Changed".
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (f) => resolve(root, f);

const VERSION_FILE = p("version.json");
const CHANGELOG = p("CHANGELOG.md");
const PKG = p("package.json");
const LOCK = p("package-lock.json");

const RELEASE_TYPES = ["major", "minor", "patch"];
const SECTIONS = [
  ["added", "Added"],
  ["changed", "Changed"],
  ["fixed", "Fixed"],
  ["removed", "Removed"],
];

// ---------------------------------------------------------------- helpers

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file, data) =>
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

const parseVersion = (v) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v).trim());
  if (!m) {
    throw new Error(
      `"${v}" is neither a release type (${RELEASE_TYPES.join(" | ")}) ` +
        `nor a semver version like 1.4.2`
    );
  }
  return { major: +m[1], minor: +m[2], patch: +m[3] };
};

const bumpVersion = (current, type) => {
  const { major, minor, patch } = parseVersion(current);
  if (type === "major") return `${major + 1}.0.0`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

/** Splits "fixed: webhook crash" into ["Fixed", "webhook crash"]. */
const classify = (raw) => {
  const line = raw.trim();
  const match = /^(\w+)\s*:\s*(.+)$/.exec(line);
  if (match) {
    const hit = SECTIONS.find(([key]) => key === match[1].toLowerCase());
    if (hit) return [hit[1], match[2].trim()];
  }
  return ["Changed", line];
};

const gitSha = () => {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null; // not a git repo yet, or no commits
  }
};

const fail = (message) => {
  console.error(`\n✗ ${message}\n`);
  exit(1);
};

// ---------------------------------------------------------------- args

const args = argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const notes = [];
let target = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "-m" || a === "--message") {
    const value = args[++i];
    if (!value) fail(`${a} needs a value`);
    notes.push(value);
  } else if (!a.startsWith("-") && !target) {
    target = a;
  }
}

const wantsCommit = flags.has("--commit");
const wantsTag = flags.has("--tag") || wantsCommit;

// ---------------------------------------------------------------- main

const rl =
  stdin.isTTY && stdout.isTTY
    ? createInterface({ input: stdin, output: stdout })
    : null;

const ask = async (question, fallback = "") => {
  if (!rl) return fallback;
  try {
    const answer = await rl.question(question);
    return answer.trim();
  } catch {
    // Ctrl+C / Ctrl+D — leave every file untouched
    console.log("\n\n  Cancelled. Nothing was written.\n");
    rl.close();
    exit(130);
  }
};

try {
  if (!existsSync(VERSION_FILE)) {
    fail(
      `${VERSION_FILE} is missing. Create it with {"version":"0.1.0","build":0}`
    );
  }

  const meta = readJson(VERSION_FILE);
  const pkg = readJson(PKG);
  const current = meta.version ?? pkg.version ?? "0.0.0";

  console.log(`\n  Current: v${current} (build ${meta.build ?? 0})\n`);

  // --- which version?
  let next;
  if (target && RELEASE_TYPES.includes(target)) {
    next = bumpVersion(current, target);
  } else if (target) {
    next = parseVersion(target) && target; // throws if malformed
  } else {
    if (!rl)
      fail("No release type given. Use: npm run release -- patch|minor|major");
    console.log("  What kind of release is this?");
    RELEASE_TYPES.forEach((t, i) =>
      console.log(`    ${i + 1}) ${t.padEnd(6)} → v${bumpVersion(current, t)}`)
    );
    const choice = await ask("\n  Choose 1-3 (or type an exact version): ");
    if (/^[123]$/.test(choice)) {
      next = bumpVersion(current, RELEASE_TYPES[+choice - 1]);
    } else if (choice) {
      parseVersion(choice);
      next = choice;
    } else {
      fail("Nothing selected.");
    }
  }

  // --- what changed?
  if (notes.length === 0) {
    if (!rl) fail('No changes given. Pass them with -m "added: …"');
    console.log(
      `\n  What changed? One per line, blank line when done.` +
        `\n  Prefix with added:/changed:/fixed:/removed: to group them.\n`
    );
    for (;;) {
      const line = await ask("  • ");
      if (!line) break;
      notes.push(line);
    }
  }

  if (notes.length === 0) fail("A release needs at least one change entry.");

  // --- assemble
  const build = (meta.build ?? 0) + 1;
  const releasedAt = new Date().toISOString();
  const commit = gitSha();

  const grouped = new Map();
  for (const note of notes) {
    const [section, text] = classify(note);
    if (!grouped.has(section)) grouped.set(section, []);
    grouped.get(section).push(text);
  }

  // --- confirm
  console.log(
    `\n  v${current} → v${next}   build ${meta.build ?? 0} → ${build}\n`
  );
  for (const [, label] of SECTIONS) {
    if (!grouped.has(label)) continue;
    console.log(`  ${label}`);
    grouped.get(label).forEach((t) => console.log(`    - ${t}`));
  }
  const ok = await ask("\n  Write this release? [Y/n] ", "y");
  if (ok && !/^y(es)?$/i.test(ok)) fail("Aborted.");

  // --- write version.json
  writeJson(VERSION_FILE, {
    version: next,
    build,
    releasedAt,
    ...(commit ? { commit } : {}),
  });

  // --- keep package.json + lockfile in sync
  pkg.version = next;
  writeJson(PKG, pkg);

  if (existsSync(LOCK)) {
    const lock = readJson(LOCK);
    lock.version = next;
    if (lock.packages?.[""]) lock.packages[""].version = next;
    writeJson(LOCK, lock);
  }

  // --- prepend to CHANGELOG.md
  const header = `# Changelog

All notable changes to this project are documented here.
Generated by \`npm run release\` — see README.md.
`;

  const date = releasedAt.slice(0, 10);
  let entry = `## v${next} — ${date} · build ${build}\n`;
  for (const [, label] of SECTIONS) {
    if (!grouped.has(label)) continue;
    entry += `\n### ${label}\n\n`;
    entry +=
      grouped
        .get(label)
        .map((t) => `- ${t}`)
        .join("\n") + "\n";
  }

  let changelog = existsSync(CHANGELOG)
    ? readFileSync(CHANGELOG, "utf8")
    : header;
  if (!changelog.startsWith("# Changelog"))
    changelog = header + "\n" + changelog;
  const splitAt = changelog.indexOf("\n## ");
  changelog =
    splitAt === -1
      ? `${changelog.trimEnd()}\n\n${entry}`
      : `${changelog.slice(0, splitAt).trimEnd()}\n\n${entry}${changelog.slice(splitAt)}`;
  writeFileSync(CHANGELOG, changelog);

  console.log(`\n  ✓ v${next} (build ${build}) written`);
  console.log(
    `    version.json · package.json · package-lock.json · CHANGELOG.md`
  );

  // --- optional git
  if (wantsCommit) {
    execFileSync(
      "git",
      [
        "add",
        "version.json",
        "package.json",
        "package-lock.json",
        "CHANGELOG.md",
      ],
      { cwd: root, stdio: "inherit" }
    );
    execFileSync(
      "git",
      ["commit", "-m", `release: v${next} (build ${build})`],
      {
        cwd: root,
        stdio: "inherit",
      }
    );
  }
  if (wantsTag) {
    execFileSync(
      "git",
      ["tag", "-a", `v${next}`, "-m", `v${next} (build ${build})`],
      {
        cwd: root,
        stdio: "inherit",
      }
    );
    console.log(`    tagged v${next}`);
  }
  if (!wantsCommit) {
    console.log(
      `\n    Next: git add -A && git commit -m "release: v${next}"\n`
    );
  } else {
    console.log("");
  }
} catch (err) {
  fail(err.message);
} finally {
  rl?.close();
}
