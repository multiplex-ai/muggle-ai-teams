#!/usr/bin/env node
/**
 * Postinstall script for @muggleai/teams.
 * Installs agents, commands, skills, rules, workflow, hooks, and contexts
 * to ~/.claude/ for Claude Code integration.
 *
 * Behavior:
 * - Symlinks directories to ~/.claude/ (global level)
 * - Backs up existing directories before overwriting
 * - Detects if installed via npm (copies) vs git clone (symlinks)
 * - Logs all actions to ~/.muggle-ai/teams-postinstall.log
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  lstatSync,
  rmSync,
  renameSync,
  copyFileSync,
  appendFileSync,
} from "fs";
import { homedir } from "os";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_DIR = resolve(__dirname, "..");
const CLAUDE_HOME = join(homedir(), ".claude");
const LOG_FILE = join(homedir(), ".muggle-ai", "teams-postinstall.log");

// Directories to install at global level (~/.claude/)
const GLOBAL_DIRS = ["agents", "commands", "skills", "rules"];

// Directories to install only if a project .claude/ exists
const PROJECT_DIRS = ["agents", "skills"];

// Files/dirs that are workflow-internal (not symlinked, but available via package path)
const INTERNAL_DIRS = ["workflow", "hooks", "contexts", "projects"];

/**
 * Log to both console and log file.
 */
function log(...args) {
  const message = args.join(" ");
  console.log(message);
  try {
    mkdirSync(dirname(LOG_FILE), { recursive: true });
    appendFileSync(LOG_FILE, message + "\n", "utf-8");
  } catch {
    // ignore
  }
}

function logError(...args) {
  const message = args.map(a => a instanceof Error ? a.stack || a.message : String(a)).join(" ");
  console.error(message);
  try {
    appendFileSync(LOG_FILE, "[ERROR] " + message + "\n", "utf-8");
  } catch {
    // ignore
  }
}

/**
 * Detect if we're running from a git clone (development) or npm install (distribution).
 * In a git clone, .git exists at package root. In npm install, it doesn't.
 */
function isGitClone() {
  return existsSync(join(PACKAGE_DIR, ".git"));
}

/**
 * Safely create a symlink, backing up any existing directory.
 */
function safeSymlink(source, target, label) {
  if (lstatSync(target, { throwIfNoEntry: false })?.isSymbolicLink()) {
    rmSync(target);
    log(`  Removed existing symlink: ${label}`);
  } else if (existsSync(target)) {
    const backupPath = target + ".bak";
    if (existsSync(backupPath)) {
      rmSync(backupPath, { recursive: true, force: true });
    }
    renameSync(target, backupPath);
    log(`  Backed up existing ${label} → ${label}.bak`);
  }

  symlinkSync(source, target);
  log(`  ~/.claude/${label} → @muggleai/teams/${label}`);
}

/**
 * Copy a directory recursively (for npm install where symlinks to node_modules are fragile).
 */
function copyDirRecursive(source, target) {
  mkdirSync(target, { recursive: true });
  const entries = readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(source, entry.name);
    const destPath = join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Safely copy a directory, backing up any existing non-managed directory.
 */
function safeCopy(source, target, label) {
  if (lstatSync(target, { throwIfNoEntry: false })?.isSymbolicLink()) {
    rmSync(target);
    log(`  Removed existing symlink: ${label}`);
  } else if (existsSync(target)) {
    // Check if it's a previous @muggleai/teams install (has marker file)
    const markerPath = join(target, ".muggleai-teams-managed");
    if (existsSync(markerPath)) {
      // Previous install — safe to overwrite
      rmSync(target, { recursive: true, force: true });
      log(`  Updating managed directory: ${label}`);
    } else {
      // User's own directory — back up
      const backupPath = target + ".bak";
      if (existsSync(backupPath)) {
        rmSync(backupPath, { recursive: true, force: true });
      }
      renameSync(target, backupPath);
      log(`  Backed up existing ${label} → ${label}.bak`);
    }
  }

  copyDirRecursive(source, target);

  // Write marker file so we know we manage this directory
  writeFileSync(join(target, ".muggleai-teams-managed"), `Managed by @muggleai/teams\nInstalled: ${new Date().toISOString()}\n`);
  log(`  ~/.claude/${label} ← @muggleai/teams/${label} (copied)`);
}

/**
 * Write a path reference file so the workflow can find its own files.
 */
function writePackagePath() {
  const pathFile = join(CLAUDE_HOME, ".muggleai-teams-path");
  writeFileSync(pathFile, PACKAGE_DIR + "\n", "utf-8");
  log(`  Package path written to ~/.claude/.muggleai-teams-path`);
}

/**
 * Main install logic.
 */
function install() {
  const timestamp = new Date().toISOString();
  log(`\n${"=".repeat(60)}`);
  log(`@muggleai/teams postinstall — ${timestamp}`);
  log(`Package dir: ${PACKAGE_DIR}`);

  const gitClone = isGitClone();
  log(`Install mode: ${gitClone ? "git clone (symlinks)" : "npm package (copy)"}`);

  // Ensure ~/.claude exists
  mkdirSync(CLAUDE_HOME, { recursive: true });

  // Install global directories
  log(`\nInstalling to ~/.claude/:`);
  for (const dir of GLOBAL_DIRS) {
    const source = join(PACKAGE_DIR, dir);
    if (!existsSync(source)) {
      log(`  Skipping ${dir} — not found in package`);
      continue;
    }

    const target = join(CLAUDE_HOME, dir);

    if (gitClone) {
      // Git clone: symlink (same as setup.sh)
      safeSymlink(source, target, dir);
    } else {
      // npm install: copy (symlinks into node_modules are fragile)
      safeCopy(source, target, dir);
    }
  }

  // Write package path reference (for workflow step file loading)
  writePackagePath();

  // Report internal directories available via package path
  log(`\nInternal directories (accessible via package path):`);
  for (const dir of INTERNAL_DIRS) {
    const source = join(PACKAGE_DIR, dir);
    if (existsSync(source)) {
      log(`  ${dir}/ → ${source}`);
    }
  }

  // Summary
  const installedCount = GLOBAL_DIRS.filter(d => existsSync(join(PACKAGE_DIR, d))).length;
  log(`\nInstalled ${installedCount} directories to ~/.claude/`);
  log(`Mode: ${gitClone ? "symlinked (edit in place)" : "copied (update with npm update)"}`);

  if (!gitClone) {
    log(`\nTo update: npm update @muggleai/teams`);
    log(`To uninstall: npm uninstall @muggleai/teams`);
  }

  log(`\nSetup complete! Start with: /muggle-ai-teams`);
}

try {
  install();
} catch (error) {
  logError("\n========================================");
  logError("ERROR: @muggleai/teams postinstall failed");
  logError("========================================\n");
  logError(error);
  logError("\nYou can run setup manually: bash muggle-ai-teams/setup.sh");
}
