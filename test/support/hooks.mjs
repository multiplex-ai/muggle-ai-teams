// Runs the plugin's hook scripts the way each host does — the payload on stdin,
// and under Codex the `codex` argument hooks/codex-hooks.json adds — and judges
// their answers by the rules Codex 0.163.0 parses them with.

import { spawnSync } from "node:child_process";
import { delimiter, join } from "node:path";

import { REPOSITORY_ROOT } from "./skills.mjs";

export const HOOKS_DIR = join(REPOSITORY_ROOT, "hooks");

/**
 * `env` with `extra` set over it. Windows keeps PATH as `Path`, and a second,
 * differently cased key would leave which one a child sees to chance.
 */
export function overEnvironment(env, extra) {
  const merged = { ...env };
  for (const [name, value] of Object.entries(extra)) {
    for (const existing of Object.keys(merged)) if (existing.toUpperCase() === name.toUpperCase()) delete merged[existing];
    merged[name] = value;
  }
  return merged;
}

/** The PATH a hook starts with when `dir` comes first. */
export function pathWithFirst(dir) {
  const current = Object.entries(process.env).find(([name]) => name.toUpperCase() === "PATH")?.[1] ?? "";
  return `${dir}${delimiter}${current}`;
}

/**
 * Run one hook script.
 * @param {string} script - File name under hooks/.
 * @param {object} payload - What the host sends on stdin.
 * @param {{ host?: "claude-code" | "codex", cwd?: string, env?: Record<string, string> }} [options]
 * @returns {{ status: number | null, stdout: string, stderr: string }}
 */
export function runHook(script, payload, { host = "claude-code", cwd = REPOSITORY_ROOT, env = {} } = {}) {
  const run = spawnSync(process.execPath, [join(HOOKS_DIR, script), ...(host === "codex" ? ["codex"] : [])], {
    cwd: cwd,
    input: JSON.stringify(payload),
    encoding: "utf-8",
    // Both hosts export the plugin's directory to its hooks.
    env: overEnvironment(process.env, { CLAUDE_PLUGIN_ROOT: REPOSITORY_ROOT, ...env }),
    timeout: 60_000,
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/** The context a PreToolUse or PostToolUse answer gives the model, or undefined. */
export function additionalContext(stdout) {
  return stdout.trim() ? JSON.parse(stdout).hookSpecificOutput?.additionalContext : undefined;
}

// codex-rs/hooks/src/schema.rs: every hook output struct is deny_unknown_fields,
// and a hookEventName outside the known set fails the parse. A hook whose
// output fails is skipped, and nobody — not the model, not `--json` — is told.
const UNIVERSAL_OUTPUT_KEYS = ["continue", "stopReason", "suppressOutput", "systemMessage"];
const CODEX_OUTPUT_KEYS = {
  SessionStart: { topLevel: [...UNIVERSAL_OUTPUT_KEYS, "hookSpecificOutput"], hookSpecific: ["hookEventName", "additionalContext"] },
  PreToolUse: {
    topLevel: ["systemMessage", "decision", "reason", "hookSpecificOutput"],
    hookSpecific: ["hookEventName", "permissionDecision", "permissionDecisionReason", "updatedInput", "additionalContext"],
  },
  PostToolUse: {
    topLevel: [...UNIVERSAL_OUTPUT_KEYS, "decision", "reason", "hookSpecificOutput"],
    hookSpecific: ["hookEventName", "additionalContext", "updatedMCPToolOutput"],
  },
  Stop: { topLevel: [...UNIVERSAL_OUTPUT_KEYS, "decision", "reason"] },
};

/**
 * Why Codex would reject this answer for this event, or undefined when it parses.
 * @param {string} event - The hook event.
 * @param {string} stdout - The hook's answer.
 */
export function codexRejection(event, stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return undefined;
  let output;
  try {
    output = JSON.parse(trimmed);
  } catch {
    // SessionStart takes plain text as context; the tool and Stop events do not.
    return event === "SessionStart" ? undefined : "not JSON";
  }
  const allowed = CODEX_OUTPUT_KEYS[event];
  const extraTop = Object.keys(output).filter((key) => !allowed.topLevel.includes(key));
  if (extraTop.length > 0) return `unknown keys ${extraTop.join(", ")}`;
  const specific = output.hookSpecificOutput;
  if (specific) {
    if (specific.hookEventName !== event) return `hookEventName ${String(specific.hookEventName)}`;
    const extra = Object.keys(specific).filter((key) => !allowed.hookSpecific.includes(key));
    if (extra.length > 0) return `unknown hookSpecificOutput keys ${extra.join(", ")}`;
  }
  if (output.decision !== undefined && output.decision !== "block") return `decision ${String(output.decision)}`;
  if (output.reason !== undefined && output.decision === undefined) return "a reason without a decision";
  return undefined;
}
