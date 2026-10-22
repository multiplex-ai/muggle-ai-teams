#!/usr/bin/env node
/**
 * PostToolUse Hook: TypeScript check after editing .ts/.tsx files
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs after a file edit — Claude Code's Edit, Write or MultiEdit, Codex's
 * apply_patch — that wrote a TypeScript file. Walks up from the file's
 * directory to find the nearest tsconfig.json, runs tsc --noEmit there, and
 * hands any errors to the model as context.
 *
 * ADAPTED FOR MUGGLE-AI: Runs FULL tsc --noEmit and reports ALL errors,
 * not just errors in the edited file. This is because CI fails on ANY
 * tsc error globally, so we need to catch all type errors introduced
 * by an edit, even in other files.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { emitContext, writtenFilePaths } = require("./lib/host-compat");

const MAX_STDIN = 1024 * 1024; // 1MB limit
const MAX_REPORTED_ERRORS = 20; // Cap to avoid flooding

/** The directory of the nearest tsconfig.json above `filePath`, or null. */
function findTsconfigDir(filePath) {
  let dir = path.dirname(filePath);
  const root = path.parse(dir).root;
  for (let depth = 0; dir !== root && depth < 20; depth++) {
    if (fs.existsSync(path.join(dir, "tsconfig.json"))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

/** What `tsc --noEmit` reports for the project in `dir`, or "" when it passes or cannot run. */
function typecheckReport(dir, editedFileName) {
  try {
    const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
    execFileSync(npxBin, ["tsc", "--noEmit", "--pretty", "false"], {
      cwd: dir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 60000, // 60s timeout for full typecheck (can be slow on large projects)
      // Node runs a .cmd only through a shell; the arguments are fixed, so none needs quoting.
      shell: process.platform === "win32",
    });
    return "";
  } catch (err) {
    const output = (err.stdout || "") + (err.stderr || "");
    const errorLines = output.split("\n").filter((line) => line.includes("error TS"));
    if (errorLines.length === 0) return "";

    const lines = [
      `[Hook] TypeScript errors after editing ${editedFileName} (${errorLines.length} total):`,
      ...errorLines.slice(0, MAX_REPORTED_ERRORS),
    ];
    if (errorLines.length > MAX_REPORTED_ERRORS) {
      lines.push(`[Hook] ... and ${errorLines.length - MAX_REPORTED_ERRORS} more errors (run full tsc --noEmit to see all)`);
    }
    return lines.join("\n");
  }
}

let data = "";
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += chunk.substring(0, remaining);
  }
});

process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    const checkedDirs = new Set();
    const reports = [];
    for (const filePath of writtenFilePaths(input)) {
      if (!/\.(ts|tsx)$/.test(filePath) || !fs.existsSync(filePath)) continue;
      const dir = findTsconfigDir(filePath);
      if (!dir || checkedDirs.has(dir)) continue;
      checkedDirs.add(dir);
      const report = typecheckReport(dir, path.basename(filePath));
      if (report) reports.push(report);
    }
    if (reports.length > 0) emitContext(input, reports.join("\n\n"));
  } catch {
    // Invalid input — nothing to check
  }

  process.exit(0);
});
