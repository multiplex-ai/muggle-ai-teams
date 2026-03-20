#!/usr/bin/env node
/**
 * PostToolUse Hook: TypeScript check after editing .ts/.tsx files
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs after Edit tool use on TypeScript files. Walks up from the file's
 * directory to find the nearest tsconfig.json, then runs tsc --noEmit.
 *
 * ADAPTED FOR MUGGLE-AI: Runs FULL tsc --noEmit and reports ALL errors,
 * not just errors in the edited file. This is because CI fails on ANY
 * tsc error globally, so we need to catch all type errors introduced
 * by an edit, even in other files.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const MAX_STDIN = 1024 * 1024; // 1MB limit
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
    const filePath = input.tool_input?.file_path;

    if (filePath && /\.(ts|tsx)$/.test(filePath)) {
      const resolvedPath = path.resolve(filePath);
      if (!fs.existsSync(resolvedPath)) {
        process.stdout.write(data);
        process.exit(0);
      }
      // Find nearest tsconfig.json by walking up (max 20 levels to prevent infinite loop)
      let dir = path.dirname(resolvedPath);
      const root = path.parse(dir).root;
      let depth = 0;

      while (dir !== root && depth < 20) {
        if (fs.existsSync(path.join(dir, "tsconfig.json"))) {
          break;
        }
        dir = path.dirname(dir);
        depth++;
      }

      if (fs.existsSync(path.join(dir, "tsconfig.json"))) {
        try {
          // Use npx.cmd on Windows to avoid shell: true which enables command injection
          const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
          execFileSync(npxBin, ["tsc", "--noEmit", "--pretty", "false"], {
            cwd: dir,
            encoding: "utf8",
            stdio: ["pipe", "pipe", "pipe"],
            timeout: 60000, // 60s timeout for full typecheck (can be slow on large projects)
          });
        } catch (err) {
          // tsc exits non-zero when there are errors — report ALL errors
          const output = (err.stdout || "") + (err.stderr || "");
          const errorLines = output
            .split("\n")
            .filter((line) => line.includes("error TS"))
            .slice(0, 20); // Cap at 20 lines to avoid flooding

          if (errorLines.length > 0) {
            const totalErrors = output
              .split("\n")
              .filter((line) => line.includes("error TS")).length;

            console.error(
              `[Hook] TypeScript errors after editing ${path.basename(filePath)} (${totalErrors} total):`,
            );
            errorLines.forEach((line) => console.error(line));
            if (totalErrors > 20) {
              console.error(
                `[Hook] ... and ${totalErrors - 20} more errors (run full tsc --noEmit to see all)`,
              );
            }
          }
        }
      }
    }
  } catch {
    // Invalid input — pass through
  }

  process.stdout.write(data);
  process.exit(0);
});
