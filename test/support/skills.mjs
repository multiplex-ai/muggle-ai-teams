// The plugin's skills as Codex reads them, for the suites that hold them to
// Codex's rules: the plugin's own skills, and the command skills generated for
// Codex from commands/.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const REPOSITORY_ROOT = fileURLToPath(new URL("../..", import.meta.url));
export const PLUGIN_ID = "muggle-ai-teams@muggle-ai-teams";
export const SKILL_NAMESPACE = "muggle-ai-teams";

const MANIFEST = JSON.parse(readFileSync(join(REPOSITORY_ROOT, ".codex-plugin", "plugin.json"), "utf-8"));

/** The skill roots the Codex manifest lists, as absolute paths. */
export const SKILL_ROOTS = MANIFEST.skills.map((root) => join(REPOSITORY_ROOT, root));

export const SKILLS_DIR = join(REPOSITORY_ROOT, "skills");
export const COMMAND_SKILLS_DIR = join(REPOSITORY_ROOT, "codex", "command-skills");

function skillDirsIn(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, "SKILL.md")))
    .map((entry) => join(root, entry.name));
}

/** Every directory Codex loads a skill from, across the manifest's roots. */
export const SKILL_DIRS = SKILL_ROOTS.flatMap(skillDirsIn);

/** The plugin's own skills, which Codex lists to the model. */
export const MODEL_LISTED_SKILL_DIRS = skillDirsIn(SKILLS_DIR);

/** The command skills, which the user types and the model is never shown. */
export const COMMAND_SKILL_DIRS = skillDirsIn(COMMAND_SKILLS_DIR);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

export function skillMarkdown(skillDir) {
  return readFileSync(join(skillDir, "SKILL.md"), "utf-8");
}

export function frontmatter(skillDir) {
  return FRONTMATTER.exec(skillMarkdown(skillDir))?.[1] ?? "";
}

/** One top-level frontmatter scalar, unquoted the way YAML does for the forms the skills use. */
export function frontmatterScalar(skillDir, field) {
  const raw = new RegExp(`^${field}:[ \\t]*(.+)$`, "m").exec(frontmatter(skillDir))?.[1]?.trim();
  if (raw === undefined) return undefined;
  if (raw.startsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  return raw;
}

/**
 * A top-level frontmatter value as Codex reads it (codex-rs/skills/src/parser.rs):
 * YAML, then collapsed to one line. Handles the forms these skills use — plain,
 * quoted, and folded or literal block scalars.
 */
export function frontmatterValue(skillDir, field) {
  const lines = frontmatter(skillDir).split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`${field}:`));
  if (start === -1) return undefined;
  const first = lines[start].slice(field.length + 1).trim();
  const continuation = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !/^\s/.test(line)) break;
    continuation.push(line.trim());
  }
  let value;
  if (/^[>|][+-]?$/.test(first)) value = continuation.join(first.startsWith(">") ? " " : "\n");
  else if (first.startsWith('"')) value = JSON.parse(first);
  else if (first.startsWith("'")) value = first.slice(1, -1).replaceAll("''", "'");
  else value = [first, ...continuation].join(" ");
  return value.split(/\s+/).filter(Boolean).join(" ");
}

/** The name Codex gives a skill: its frontmatter `name`, else its directory's. */
export function skillName(skillDir) {
  return frontmatterValue(skillDir, "name") || skillDir.split(/[\\/]/).pop();
}
