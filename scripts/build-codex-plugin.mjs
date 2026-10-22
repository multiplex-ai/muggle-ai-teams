#!/usr/bin/env node
/**
 * Generates the parts of the Codex plugin that are derived from the Claude Code
 * plugin, so commands/ and hooks/hooks.json stay the one hand-edited source:
 *
 * - codex/command-skills/<command>/ — one skill per commands/<command>.md.
 *   Codex has no plugin slash commands. It converts a plugin's commands into
 *   skills itself, but skips any over 4,000 bytes or using $ARGUMENTS, which is
 *   most of these — /muggle-ai-teams among them — so the manifest switches that
 *   conversion off ("commands": []) and lists these instead. Each is a short
 *   pointer to the command file rather than a copy of it, and is for the user to
 *   type ($muggle-ai-teams:<command>), never for the model to pick on its own:
 *   the model's skills list is already full with the plugin's own skills.
 * - hooks/codex-hooks.json — hooks.json for Codex, which the manifest points
 *   at. Codex runs Claude Code-format hooks, but its tools have other names:
 *   each matcher is rewritten to the Codex tools that play its part, and a
 *   group whose tools Codex lacks is dropped. Codex exports CLAUDE_PLUGIN_ROOT
 *   to hooks too, so every command is also given `codex` as its last argument
 *   (hooks/lib/host-compat.js reads it): an argument, not an environment
 *   variable, because on Windows Codex runs the command through PowerShell or
 *   cmd.exe, which set variables differently.
 *
 * `--check` exits non-zero when a committed file differs from what this script
 * would write, or a generated file has no source any more.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, join, relative, sep } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const REPOSITORY_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMANDS_DIR = join(REPOSITORY_ROOT, "commands");
export const COMMAND_SKILLS_DIR = join(REPOSITORY_ROOT, "codex", "command-skills");

const CLAUDE_HOOKS_PATH = join(REPOSITORY_ROOT, "hooks", "hooks.json");

const REGENERATE_HINT = "Run `npm run build:codex` and commit the result.";

/** The argument that tells a hook Codex fired it. */
export const CODEX_HOST_ARGUMENT = "codex";

// Multi-agent v2 reports its tools as `collaboration<tool>`; v1 reports spawn_agent bare and wait_agent as
// `multi_agent_v1wait_agent`.
const CODEX_SPAWN_AGENT = ["collaborationspawn_agent", "spawn_agent"];
const CODEX_WAIT_AGENT = ["collaborationwait_agent", "multi_agent_v1wait_agent"];

/**
 * Claude Code tool → the Codex tools that play its part. Codex edits files with
 * apply_patch, reads them through the shell (reported as Bash), and dispatches
 * a sub-agent with spawn_agent. A tool missing here has no Codex counterpart.
 */
export const CODEX_TOOL_EQUIVALENTS = {
  Bash: ["Bash"],
  Read: ["Bash"],
  Edit: ["apply_patch"],
  Write: ["apply_patch"],
  MultiEdit: ["apply_patch"],
  Agent: CODEX_SPAWN_AGENT,
  Task: CODEX_SPAWN_AGENT,
};

/**
 * Groups Codex runs on a different event. Claude Code's Agent call returns once
 * the agent has finished, so its PostToolUse means "an agent reported back".
 * Codex's spawn_agent returns at once, and wait_agent — which collects what
 * agents report — fires no PostToolUse; the group runs before wait_agent
 * instead, and its context reaches the model with the wait's result.
 */
const CODEX_EVENT_OVERRIDES = {
  PostToolUse: {
    Agent: { event: "PreToolUse", tools: CODEX_WAIT_AGENT },
    Task: { event: "PreToolUse", tools: CODEX_WAIT_AGENT },
  },
};

/**
 * Tokens of context a hook may give the model under Codex, where the default is
 * 2,500 and the rest is spilled to a file. session-start.js gives a Codex
 * session the always-on rules, which Claude Code loads from ~/.claude/rules.
 */
export const CODEX_SESSION_START_CONTEXT_TOKENS = 12_000;

const CODEX_HOOKS_DESCRIPTION =
  "Generated from hooks.json by scripts/build-codex-plugin.mjs for the Codex plugin. Edit hooks.json, then run `npm run build:codex`.";

// Every hooks.json command runs a hook script with node, which every shell Codex may use runs the same way.
const NODE_COMMAND_PREFIX = "node ";
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** One frontmatter scalar as YAML reads the single-line forms these files use. */
function frontmatterScalar(frontmatter, field) {
  const raw = new RegExp(`^${field}:[ \\t]*(.*)$`, "m").exec(frontmatter)?.[1]?.trim();
  if (!raw) return undefined;
  if (raw.startsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  return raw;
}

/**
 * A command's description: its frontmatter `description`, else — as Claude Code
 * does for a command without one — its opening line, here the first line of
 * prose rather than the title.
 * @param {string} markdown - The command file.
 * @returns {string} One line.
 */
export function commandDescription(markdown) {
  const match = FRONTMATTER.exec(markdown);
  const declared = match ? frontmatterScalar(match[1], "description") : undefined;
  if (declared) return declared;
  const lines = markdown.slice(match ? match[0].length : 0).split(/\r?\n/).map((line) => line.trim());
  const prose = lines.find((line) => line && !line.startsWith("#"));
  return prose ?? lines.find((line) => line)?.replace(/^#+\s*/, "") ?? "";
}

/** Every command, by name, with its description. */
export function listCommands() {
  return readdirSync(COMMANDS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const name = file.slice(0, -".md".length);
      return { name: name, description: commandDescription(readFileSync(join(COMMANDS_DIR, file), "utf-8")) };
    });
}

function commandSkillMarkdown(command) {
  return [
    "---",
    `name: ${JSON.stringify(command.name)}`,
    `description: ${JSON.stringify(command.description)}`,
    "---",
    "",
    `<!-- Generated from commands/${command.name}.md by scripts/build-codex-plugin.mjs. Edit the command, not this file. -->`,
    "",
    `# /${command.name}`,
    "",
    `This skill is muggle-ai-teams' \`/${command.name}\` command, for Codex. The command itself is \`../../../commands/${command.name}.md\`, three directories above this file. Read it and follow it as your instructions:`,
    "",
    `- Its \`$ARGUMENTS\` is what the user wrote after \`$muggle-ai-teams:${command.name}\`, and \`$1\`, \`$2\`, … are the words of that text; with nothing written, they are empty.`,
    "- It was written for Claude Code. Where it names a Claude Code tool, slash command or path, use the Codex equivalent from `../../host-tool-equivalents.md`.",
    "",
  ].join("\n");
}

function commandSkillPolicy(command) {
  return [
    "# Codex reads this beside SKILL.md. A command is for the user to type: the",
    "# plugin's own skills already fill the list Codex shows the model.",
    "interface:",
    `  display_name: ${JSON.stringify(command.name)}`,
    `  short_description: ${JSON.stringify(command.description)}`,
    "policy:",
    "  allow_implicit_invocation: false",
    "",
  ].join("\n");
}

/**
 * Where Codex runs one hooks.json group: the event and matcher, or null when
 * none of its tools has a Codex counterpart.
 */
function codexPlacement(eventName, matcher) {
  if (matcher === undefined) return { event: eventName, matcher: undefined };
  const tools = matcher.split("|");
  const overrides = tools.map((tool) => CODEX_EVENT_OVERRIDES[eventName]?.[tool]);
  if (overrides.every(Boolean)) {
    return { event: overrides[0].event, matcher: [...new Set(overrides.flatMap((override) => override.tools))].join("|") };
  }
  const codexTools = [...new Set(tools.flatMap((tool) => CODEX_TOOL_EQUIVALENTS[tool] ?? []))];
  return codexTools.length > 0 ? { event: eventName, matcher: codexTools.join("|") } : null;
}

/**
 * Derive the Codex hooks manifest from the Claude Code one.
 * @param {{ hooks: Record<string, Array<{ matcher?: string, hooks: Array<Record<string, unknown>> }>> }} claudeHooks - Parsed hooks.json.
 * @returns {{ description: string, hooks: Record<string, Array<{ matcher?: string, hooks: Array<Record<string, unknown>> }>> }}
 * @throws {Error} When a command does not run a hook script with node.
 */
export function deriveCodexHooks(claudeHooks) {
  const codexEvents = {};
  for (const [eventName, groups] of Object.entries(claudeHooks.hooks)) {
    for (const group of groups) {
      const placement = codexPlacement(eventName, group.matcher);
      if (!placement) continue;
      const hooks = group.hooks.map((hook) => {
        if (!hook.command.startsWith(NODE_COMMAND_PREFIX)) {
          throw new Error(`hooks.json command does not run a hook script with node: ${hook.command}`);
        }
        return {
          ...hook,
          command: `${hook.command} ${CODEX_HOST_ARGUMENT}`,
          ...(placement.event === "SessionStart" ? { additionalContextLimit: CODEX_SESSION_START_CONTEXT_TOKENS } : {}),
        };
      });
      (codexEvents[placement.event] ??= []).push(placement.matcher === undefined ? { hooks: hooks } : { matcher: placement.matcher, hooks: hooks });
    }
  }
  return { description: CODEX_HOOKS_DESCRIPTION, hooks: codexEvents };
}

/**
 * Every generated file, keyed by its path under the repository root.
 * @returns {Map<string, string>} Path (POSIX separators) → contents.
 */
export function renderGeneratedFiles() {
  const files = new Map();
  const claudeHooks = JSON.parse(readFileSync(CLAUDE_HOOKS_PATH, "utf-8"));
  files.set("hooks/codex-hooks.json", `${JSON.stringify(deriveCodexHooks(claudeHooks), null, 2)}\n`);
  for (const command of listCommands()) {
    const skillDir = `codex/command-skills/${command.name}`;
    files.set(`${skillDir}/SKILL.md`, commandSkillMarkdown(command));
    files.set(`${skillDir}/agents/openai.yaml`, commandSkillPolicy(command));
  }
  return files;
}

function filesUnder(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(REPOSITORY_ROOT, join(entry.parentPath, entry.name)).split(sep).join("/"));
}

// A Windows checkout may have turned the committed LF files into CRLF.
const normalizeLineEndings = (text) => text.replace(/\r\n/g, "\n");

/** Generated paths that are stale or missing, as messages; empty when the tree matches. */
export function findDrift() {
  const rendered = renderGeneratedFiles();
  const drift = [];
  for (const [path, contents] of rendered) {
    const onDisk = join(REPOSITORY_ROOT, path);
    if (!existsSync(onDisk)) drift.push(`${path} is missing`);
    else if (normalizeLineEndings(readFileSync(onDisk, "utf-8")) !== contents) drift.push(`${path} is out of date`);
  }
  for (const path of filesUnder(COMMAND_SKILLS_DIR)) {
    if (!rendered.has(path)) drift.push(`${path} has no source command`);
  }
  return drift;
}

function main() {
  if (process.argv.includes("--check")) {
    const drift = findDrift();
    if (drift.length > 0) {
      console.error(`The generated Codex plugin files are out of date:\n  ${drift.join("\n  ")}\n${REGENERATE_HINT}`);
      process.exit(1);
    }
    console.log("Generated Codex plugin files are up to date.");
    return;
  }
  rmSync(COMMAND_SKILLS_DIR, { recursive: true, force: true });
  for (const [path, contents] of renderGeneratedFiles()) {
    const target = join(REPOSITORY_ROOT, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents, "utf-8");
  }
  console.log("Generated Codex plugin files written.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
